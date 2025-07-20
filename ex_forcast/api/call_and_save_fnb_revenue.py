import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def fnb_revenue_display(project=None):
    """Fetch F&B revenue data from FandB Revenue Assumptions doctype"""
    try:
        # Define month order for SQL ordering
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # SQL query to get F&B revenue data with project filter
        query = """
            SELECT 
                parent.year,
                parent.month,
                child.dining_cover,
                child.cover_category,
                child.cover_detail,
                child.amount
            FROM 
                `tabFandB Revenue Assumptions` AS parent
            INNER JOIN 
                `tabFandB Revenue Assumption Items` AS child
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
        frappe.logger().info(f"Raw SQL results: {raw_results}")

        # Nested dict: year -> month -> list of expense rows
        grouped_data = defaultdict(lambda: defaultdict(list))

        for row in raw_results:
            grouped_data[row['year']][row['month']].append({
                "restaurant": row['dining_cover'],
                "cover_category": row['cover_category'],
                "cover_detail": row['cover_detail'],
                "amount": row['amount'] or 0
            })

        # Convert defaultdicts to normal dicts for JSON serialization
        result = {year: dict(months) for year, months in grouped_data.items()}
        frappe.logger().info(f"Final result: {result}")
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "fnb_revenue_display failed")
        return {"error": str(err)}


@frappe.whitelist()
def upsert_fnb_revenue_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - month
      - restaurant
      - cover_category
      - cover_detail
      - amount
    project: Project name to filter/create documents for
    """
    try:
        # Debug logging
        frappe.logger().info(f"Received F&B revenue changes: {changes}")
        
        if isinstance(changes, str):
            changes = json.loads(changes)
        
        frappe.logger().info(f"Parsed F&B revenue changes: {changes}")

        results = []

        # Process F&B revenue changes
        for change in changes:
            try:
                year = change.get("year")
                month = change.get("month")
                restaurant = change.get("restaurant")
                cover_category = change.get("cover_category")
                cover_detail = change.get("cover_detail")
                amount = change.get("amount")

                frappe.logger().info(f"Processing change: year={year}, month={month}, restaurant={restaurant}, cover_category={cover_category}, cover_detail={cover_detail}, amount={amount}")

                if not all([year, month, restaurant, cover_category, cover_detail]):
                    frappe.logger().warning(f"Skipping invalid F&B revenue change: {change}")
                    continue

                # Validate that the restaurant exists
                restaurant_exists = frappe.db.exists("Restaurant", restaurant)
                if not restaurant_exists:
                    frappe.logger().error(f"Restaurant '{restaurant}' does not exist")
                    # Instead of raising an exception, try to create the restaurant
                    try:
                        frappe.logger().info(f"Attempting to create restaurant '{restaurant}' for project '{project}'")
                        restaurant_doc = frappe.get_doc({
                            "doctype": "Restaurant",
                            "cover_name": restaurant,
                            "project": project
                        })
                        restaurant_doc.insert()
                        frappe.db.commit()
                        frappe.logger().info(f"Successfully created restaurant '{restaurant}' for project '{project}'")
                    except Exception as create_error:
                        frappe.logger().error(f"Failed to create restaurant '{restaurant}': {str(create_error)}")
                        raise Exception(f"Restaurant '{restaurant}' does not exist and could not be created: {str(create_error)}")

                # Find or create parent document with project filter
                parent = frappe.db.get_value(
                    "FandB Revenue Assumptions",
                    {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                    "name"
                )
                if not parent:
                    frappe.logger().info(f"Creating new parent document for year={year}, month={month}, project={project}")
                    parent_doc = frappe.get_doc({
                        "doctype": "FandB Revenue Assumptions",
                        "year": year,
                        "month": month,
                        "project": project,  # Add project field
                        "expense_items": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name
                    frappe.logger().info(f"Created parent document: {parent}")

                # Check if child exists based on dining_cover, cover_category, and cover_detail
                child = frappe.db.get_value(
                    "FandB Revenue Assumption Items",
                    {
                        "parent": parent, 
                        "dining_cover": restaurant,
                        "cover_category": cover_category,
                        "cover_detail": cover_detail
                    },
                    "name"
                )

                if child:
                    # Update existing child
                    frappe.logger().info(f"Updating existing child document: {child}")
                    child_doc = frappe.get_doc("FandB Revenue Assumption Items", child)
                    if amount is not None:
                        child_doc.amount = amount
                    child_doc.save()
                    results.append({"action": "updated", "name": child_doc.name, "type": "fnb_revenue"})
                else:
                    # Create new child
                    frappe.logger().info(f"Creating new child document for parent={parent}")
                    parent_doc = frappe.get_doc("FandB Revenue Assumptions", parent)
                    new_child = parent_doc.append("expense_items", {
                        "dining_cover": restaurant,
                        "cover_category": cover_category,
                        "cover_detail": cover_detail,
                        "amount": amount or 0
                    })
                    parent_doc.save()
                    results.append({"action": "created", "name": new_child.name, "type": "fnb_revenue"})

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        frappe.logger().info(f"Successfully processed {len(results)} F&B revenue changes")
        
        return {
            "status": "success", 
            "results": results,
            "summary": {
                "fnb_revenue_processed": len(changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_fnb_revenue_items failed")
        frappe.logger().error(f"Error in upsert_fnb_revenue_items: {str(e)}")
        return {"status": "error", "message": str(e)}


@frappe.whitelist()
def get_restaurants_list(project=None):
    """Fetch list of restaurants filtered by project"""
    try:
        filters = {}
        if project:
            filters["project"] = project
        
        restaurants = frappe.get_all(
            "Restaurant",
            fields=["name", "cover_name"],
            filters=filters,
            order_by="name"
        )
        return {"status": "success", "restaurants": restaurants}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_restaurants_list failed")
        return {"status": "error", "message": str(e)}


@frappe.whitelist()
def test_fnb_api():
    """Simple test endpoint to verify F&B API is working"""
    return {"status": "success", "message": "F&B Revenue API is working"}


@frappe.whitelist()
def test_fnb_upsert():
    """Test endpoint to verify upsert functionality with sample data"""
    try:
        # Test with sample data
        test_changes = [
            {
                "year": "2024",
                "month": "Jan",
                "restaurant": "test-restaurant",
                "cover_category": "Breakfast Revenue",
                "cover_detail": "Breakfast Covers",
                "amount": 100.00
            }
        ]
        
        # First check if test restaurant exists, if not create it
        if not frappe.db.exists("Restaurant", "test-restaurant"):
            restaurant_doc = frappe.get_doc({
                "doctype": "Restaurant",
                "cover_name": "Test Restaurant"
            })
            restaurant_doc.insert()
            frappe.db.commit()
        
        # Test the upsert function
        result = upsert_fnb_revenue_items(test_changes)
        return {
            "status": "success", 
            "message": "Test upsert completed",
            "result": result
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "test_fnb_upsert failed")
        return {"status": "error", "message": str(e)}


# API endpoints:
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_fnb_revenue.fnb_revenue_display
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_fnb_revenue.upsert_fnb_revenue_items
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_fnb_revenue.get_restaurants_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_fnb_revenue.test_fnb_api
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_fnb_revenue.test_fnb_upsert 