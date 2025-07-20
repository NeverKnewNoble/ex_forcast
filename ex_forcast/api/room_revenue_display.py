import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def room_revenue_display(project=None):
    try:
        # Define month order for SQL ordering
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # SQL query to get raw room revenue rows with project filter
        query = """
            SELECT 
                parent.year,
                parent.month,
                child.room_package,
                child.rate,
                child.occupied_beds
            FROM 
                `tabRoom Revenue Assumptions` AS parent
            INNER JOIN 
                `tabRoom Revenue Items` AS child
            ON 
                child.parent = parent.name
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, as_dict=True)

        # Nested dict: year -> month -> list of expense rows
        grouped_data = defaultdict(lambda: defaultdict(list))

        for row in raw_results:
            grouped_data[row['year']][row['month']].append({
                "room_package": row['room_package'],
                "rate": row['rate'],
                "occupied_beds": row['occupied_beds']
            })

        # Convert defaultdicts to normal dicts for JSON serialization
        result = {year: dict(months) for year, months in grouped_data.items()}
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "room_revenue_display failed")
        return {"error": str(err)}


@frappe.whitelist(allow_guest=True)
def market_segment_display(project=None):
    """Fetch market segment data from Room Revenue Assumptions doctype"""
    try:
        # Define month order for SQL ordering
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # SQL query to get market segment data with market segment names and project filter
        query = """
            SELECT 
                parent.year,
                parent.month,
                segment.market_segment,
                child.room_nights,
                child.room_rate_usd
            FROM 
                `tabRoom Revenue Assumptions` AS parent
            INNER JOIN 
                `tabMarket Segement Table Data` AS child
            ON 
                child.parent = parent.name
            INNER JOIN
                `tabRoom Market Segment` AS segment
            ON
                child.market_segment = segment.name
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, as_dict=True)

        # Nested dict: year -> market_segment -> month -> data
        grouped_data = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))

        for row in raw_results:
            grouped_data[row['year']][row['market_segment']][row['month']] = {
                "room_nights": row['room_nights'] or 0,
                "room_rate": row['room_rate_usd'] or 0
            }

        # Convert defaultdicts to normal dicts for JSON serialization
        result = {}
        for year in grouped_data:
            result[year] = {}
            for segment in grouped_data[year]:
                result[year][segment] = dict(grouped_data[year][segment])

        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "market_segment_display failed")
        return {"error": str(err)}




@frappe.whitelist()
def upsert_room_revenue_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      For room revenue data:
        - year
        - month  
        - room_package
        - rate
        - occupied_beds
      For room count updates:
        - roomType (package name)
        - field: 'room_count'
        - newValue (number_of_rooms)
    project: Project name to filter/create documents for
    """
    try:
        # Debug logging
        frappe.logger().info(f"Received changes: {changes}")
        
        if isinstance(changes, str):
            changes = json.loads(changes)
        
        frappe.logger().info(f"Parsed changes: {changes}")

        results = []
        room_revenue_changes = []
        room_package_changes = []

        # Separate the changes by type
        for change in changes:
            if 'field' in change and change['field'] == 'room_count':
                # This is a room package count update
                room_package_changes.append(change)
            else:
                # This is a room revenue data update
                room_revenue_changes.append(change)
        
        frappe.logger().info(f"Room revenue changes: {room_revenue_changes}")
        frappe.logger().info(f"Room package changes: {room_package_changes}")

        # Process room revenue changes
        for change in room_revenue_changes:
            year = change.get("year")
            month = change.get("month")
            room_package = change.get("room_package")
            rate = change.get("rate")
            occupied_beds = change.get("occupied_beds")

            if not all([year, month, room_package]):
                frappe.logger().warning(f"Skipping invalid change: {change}")
                continue

            # Find or create parent document with project filter
            parent = frappe.db.get_value(
                "Room Revenue Assumptions",
                {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                "name"
            )
            if not parent:
                parent_doc = frappe.get_doc({
                    "doctype": "Room Revenue Assumptions",
                    "year": year,
                    "month": month,
                    "project": project,  # Add project field
                    "room_details": []
                })
                parent_doc.insert()
                parent = parent_doc.name

            # Check if child exists based on room_package
            child = frappe.db.get_value(
                "Room Revenue Items",
                {"parent": parent, "room_package": room_package},
                "name"
            )

            if child:
                # Update existing child
                child_doc = frappe.get_doc("Room Revenue Items", child)
                if rate is not None:
                    child_doc.rate = rate
                if occupied_beds is not None:
                    child_doc.occupied_beds = occupied_beds
                child_doc.save()
                results.append({"action": "updated", "name": child_doc.name, "type": "room_revenue"})
            else:
                # Create new child
                parent_doc = frappe.get_doc("Room Revenue Assumptions", parent)
                new_child = parent_doc.append("room_details", {
                    "room_package": room_package,
                    "rate": rate or 0,
                    "occupied_beds": occupied_beds or 0
                })
                parent_doc.save()
                results.append({"action": "created", "name": new_child.name, "type": "room_revenue"})

        # Process room package changes
        for change in room_package_changes:
            room_type = change.get("roomType")  # This is the package name
            new_value = change.get("newValue")  # This is the number_of_rooms

            if not room_type or new_value is None:
                frappe.logger().warning(f"Skipping invalid room package change: {change}")
                continue

            # Find the room package by package_name
            room_package = frappe.db.get_value(
                "Room Packages",
                {"package_name": room_type},
                "name"
            )

            if room_package:
                # Update existing room package
                room_package_doc = frappe.get_doc("Room Packages", room_package)
                room_package_doc.number_of_rooms = new_value
                room_package_doc.save()
                results.append({"action": "updated", "name": room_package_doc.name, "type": "room_package"})
            else:
                # Create new room package
                room_package_doc = frappe.get_doc({
                    "doctype": "Room Packages",
                    "package_name": room_type,
                    "number_of_rooms": new_value
                })
                room_package_doc.insert()
                results.append({"action": "created", "name": room_package_doc.name, "type": "room_package"})

        frappe.db.commit()
        frappe.logger().info(f"Successfully processed {len(results)} changes")
        
        return {
            "status": "success", 
            "results": results,
            "summary": {
                "room_revenue_processed": len(room_revenue_changes),
                "room_packages_processed": len(room_package_changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_room_revenue_items failed")
        frappe.logger().error(f"Error in upsert_room_revenue_items: {str(e)}")
        return {"status": "error", "message": str(e)}


@frappe.whitelist()
def upsert_market_segment_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - month
      - market_segment
      - field: 'room_nights' or 'room_rate'
      - value
    project: Project name to filter/create documents for
    """
    try:
        # Debug logging
        frappe.logger().info(f"Received market segment changes: {changes}")
        
        if isinstance(changes, str):
            changes = json.loads(changes)
        
        frappe.logger().info(f"Parsed market segment changes: {changes}")

        results = []

        # Process market segment changes
        for change in changes:
            year = change.get("year")
            month = change.get("month")
            market_segment_name = change.get("market_segment")
            field = change.get("field")  # 'room_nights' or 'room_rate'
            value = change.get("value")

            if not all([year, month, market_segment_name, field]):
                frappe.logger().warning(f"Skipping invalid market segment change: {change}")
                continue

            # Find the market segment document by name
            market_segment_doc = frappe.db.get_value(
                "Room Market Segment",
                {"market_segment": market_segment_name},
                "name"
            )
            
            if not market_segment_doc:
                frappe.logger().warning(f"Market segment '{market_segment_name}' not found, skipping change")
                continue

            # Find or create parent document with project filter
            parent = frappe.db.get_value(
                "Room Revenue Assumptions",
                {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                "name"
            )
            if not parent:
                parent_doc = frappe.get_doc({
                    "doctype": "Room Revenue Assumptions",
                    "year": year,
                    "month": month,
                    "project": project,  # Add project field
                    "market_segment": []
                })
                parent_doc.insert()
                parent = parent_doc.name

            # Check if child exists based on market_segment
            child = frappe.db.get_value(
                "Market Segement Table Data",
                {"parent": parent, "market_segment": market_segment_doc},
                "name"
            )

            if child:
                # Update existing child
                child_doc = frappe.get_doc("Market Segement Table Data", child)
                if field == 'room_nights':
                    child_doc.room_nights = value
                elif field == 'room_rate':
                    child_doc.room_rate_usd = value
                child_doc.save()
                results.append({"action": "updated", "name": child_doc.name, "type": "market_segment"})
            else:
                # Create new child
                parent_doc = frappe.get_doc("Room Revenue Assumptions", parent)
                new_child_data = {
                    "market_segment": market_segment_doc,
                    "room_nights": 0,
                    "room_rate_usd": 0
                }
                if field == 'room_nights':
                    new_child_data["room_nights"] = value
                elif field == 'room_rate':
                    new_child_data["room_rate_usd"] = value
                
                new_child = parent_doc.append("market_segment", new_child_data)
                parent_doc.save()
                results.append({"action": "created", "name": new_child.name, "type": "market_segment"})

        frappe.db.commit()
        frappe.logger().info(f"Successfully processed {len(results)} market segment changes")
        
        return {
            "status": "success", 
            "results": results,
            "summary": {
                "market_segment_processed": len(changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_market_segment_items failed")
        frappe.logger().error(f"Error in upsert_market_segment_items: {str(e)}")
        return {"status": "error", "message": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_revenue_display.room_revenue_display
#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_revenue_display.upsert_room_revenue_items
#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_revenue_display.market_segment_display
#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_revenue_display.upsert_market_segment_items
