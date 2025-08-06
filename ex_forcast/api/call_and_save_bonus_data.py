import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def bonus_data_display(project=None):
    """Fetch Bonus data from Payroll Data doctype"""
    try:
        # SQL query to get Bonus data with project filter
        query = """
            SELECT 
                parent.year,
                parent.name as parent_name,
                parent.project
            FROM 
                `tabPayroll Data` AS parent
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, as_dict=True)
        
        # Group data by year -> bonus data
        grouped_data = defaultdict(dict)
        
        print(f"Found {len(raw_results)} Payroll Data documents")
        for row in raw_results:
            print(f"Row: year={row['year']}, parent={row['parent_name']}, project={row['project']}")
            year = row['year']
            parent_name = row['parent_name']
            
            # Get the parent Payroll Data document
            parent_doc = frappe.get_doc("Payroll Data", parent_name)
            
            # Extract bonus data
            bonus_data = {}
            print(f"Processing Payroll Data: {parent_name}, bonus items: {len(parent_doc.bonus)}")
            for bonus_item in parent_doc.bonus:
                print(f"Bonus item: row={bonus_item.row}, percentage={bonus_item.bonus_percentage}")
                bonus_data[bonus_item.row] = {
                    "bonus_percentage": bonus_item.bonus_percentage
                }
            
            grouped_data[year] = {
                "bonus": bonus_data
            }

        # Convert defaultdict to normal dict for JSON serialization
        result = dict(grouped_data)
        print(f"Final result: {result}")
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "bonus_data_display failed")
        return {"error": str(err)}


@frappe.whitelist()
def upsert_bonus_data(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - bonus: dict with row -> bonus_percentage mapping
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        # Process Bonus data changes
        for change in changes:
            try:
                year = change.get("year")
                bonus_data = change.get("bonus", {})

                if not year:
                    continue

                # Find or create parent document with project filter
                parent_filters = {"year": year, "project": project} if project else {"year": year}
                parent = frappe.db.get_value(
                    "Payroll Data",
                    parent_filters,
                    "name"
                )
                if not parent:
                    parent_doc = frappe.get_doc({
                        "doctype": "Payroll Data",
                        "year": year,
                        "project": project,
                        "payroll_data": [],
                        "bonus": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name
                else:
                    parent_doc = frappe.get_doc("Payroll Data", parent)

                # Update bonus data
                if bonus_data:
                    update_bonus_data(parent_doc, bonus_data)
                
                parent_doc.save()
                results.append({"action": "updated", "name": parent_doc.name, "type": "bonus_data"})

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        
        return {
            "success": True, 
            "results": results,
            "summary": {
                "bonus_data_processed": len(changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_bonus_data failed")
        frappe.logger().error(f"Error in upsert_bonus_data: {str(e)}")
        return {"success": False, "error": str(e)}


def update_bonus_data(parent_doc, bonus_data):
    """Update bonus data"""
    # Remove existing bonus data for the rows being updated
    rows_to_update = set(bonus_data.keys())
    parent_doc.bonus = [
        item for item in parent_doc.bonus 
        if item.row not in rows_to_update
    ]
    
    # Add new bonus data
    for row, data in bonus_data.items():
        if data.get("bonus_percentage") is not None:
            parent_doc.append("bonus", {
                "row": row,
                "bonus_percentage": data["bonus_percentage"]
            })


# API endpoints:
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_bonus_data.bonus_data_display
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_bonus_data.upsert_bonus_data 