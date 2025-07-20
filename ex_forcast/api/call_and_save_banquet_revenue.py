import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def banquet_revenue_display(project=None):
    """Fetch Banquet revenue data from Banquet Revenue Assumptions doctype"""
    try:
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        query = f"""
            SELECT 
                parent.year,
                parent.month,
                child.banquet_detail,
                child.amount
            FROM 
                `tabBanquet Revenue Assumptions` AS parent
            INNER JOIN 
                `tabBanquet Revenue Items` AS child
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

        grouped_data = defaultdict(lambda: defaultdict(list))
        for row in raw_results:
            grouped_data[row['year']][row['month']].append({
                "banquet_detail": row['banquet_detail'],
                "amount": row['amount'] or 0
            })
        result = {year: dict(months) for year, months in grouped_data.items()}
        frappe.logger().info(f"Final result: {result}")
        return result
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "banquet_revenue_display failed")
        return {"error": str(err)}

@frappe.whitelist()
def upsert_banquet_revenue_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - month
      - banquet_detail
      - amount
    project: Project name to filter/create documents for
    """
    try:
        frappe.logger().info(f"Received Banquet revenue changes: {changes}")
        if isinstance(changes, str):
            changes = json.loads(changes)
        frappe.logger().info(f"Parsed Banquet revenue changes: {changes}")
        results = []
        for change in changes:
            try:
                year = change.get("year")
                month = change.get("month")
                banquet_detail = change.get("banquet_detail")
                amount = change.get("amount")
                if not all([year, month, banquet_detail]):
                    frappe.logger().warning(f"Skipping invalid Banquet revenue change: {change}")
                    continue
                # Find or create parent document with project filter
                parent = frappe.db.get_value(
                    "Banquet Revenue Assumptions",
                    {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                    "name"
                )
                if not parent:
                    parent_doc = frappe.get_doc({
                        "doctype": "Banquet Revenue Assumptions",
                        "year": year,
                        "month": month,
                        "project": project,  # Add project field
                        "banquet_items": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name
                # Check if child exists based on banquet_detail
                child = frappe.db.get_value(
                    "Banquet Revenue Items",
                    {"parent": parent, "banquet_detail": banquet_detail},
                    "name"
                )
                if child:
                    child_doc = frappe.get_doc("Banquet Revenue Items", child)
                    if amount is not None:
                        child_doc.amount = amount
                    child_doc.save()
                    results.append({"action": "updated", "name": child_doc.name, "type": "banquet_revenue"})
                else:
                    parent_doc = frappe.get_doc("Banquet Revenue Assumptions", parent)
                    new_child = parent_doc.append("banquet_items", {
                        "banquet_detail": banquet_detail,
                        "amount": amount or 0
                    })
                    parent_doc.save()
                    results.append({"action": "created", "name": new_child.name, "type": "banquet_revenue"})
            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e
        frappe.db.commit()
        frappe.logger().info(f"Successfully processed {len(results)} Banquet revenue changes")
        return {
            "status": "success",
            "results": results,
            "summary": {
                "banquet_revenue_processed": len(changes),
                "total_processed": len(results)
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_banquet_revenue_items failed")
        frappe.logger().error(f"Error in upsert_banquet_revenue_items: {str(e)}")
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def test_banquet_api():
    """Simple test endpoint to verify Banquet API is working"""
    return {"status": "success", "message": "Banquet Revenue API is working"}

@frappe.whitelist()
def test_banquet_upsert():
    """Test endpoint to verify upsert functionality with sample data"""
    try:
        test_changes = [
            {
                "year": "2024",
                "month": "Jan",
                "banquet_detail": "Test Banquet Detail",
                "amount": 123.45
            }
        ]
        result = upsert_banquet_revenue_items(test_changes)
        return {
            "status": "success",
            "message": "Test upsert completed",
            "result": result
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "test_banquet_upsert failed")
        return {"status": "error", "message": str(e)}

# API endpoints:
# /api/method/ex_forcast.api.call_and_save_banquet_revenue.banquet_revenue_display
# /api/method/ex_forcast.api.call_and_save_banquet_revenue.upsert_banquet_revenue_items
# /api/method/ex_forcast.api.call_and_save_banquet_revenue.test_banquet_api
# /api/method/ex_forcast.api.call_and_save_banquet_revenue.test_banquet_upsert 