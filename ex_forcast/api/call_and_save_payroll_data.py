import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def payroll_data_display(project=None):
    """Fetch Payroll data from Payroll Data doctype"""
    try:
        # SQL query to get Payroll data with project filter
        query = """
            SELECT 
                parent.year,
                parent.name as parent_name,
                child.department,
                child.department_location,
                child.position,
                child.designation,
                child.salary,
                child.amount,
                child.unique_id,
                child.name as item_name
            FROM 
                `tabPayroll Data` AS parent
            INNER JOIN 
                `tabPayroll Data Items` AS child
            ON 
                child.parent = parent.name
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, as_dict=True)
        
        # Group data by year -> list of payroll rows
        grouped_data = defaultdict(list)

        for row in raw_results:
            # Get monthly count data for this item from the main Payroll Data document
            monthly_count = {}
            try:
                # Get the parent Payroll Data document
                parent_doc = frappe.get_doc("Payroll Data", row['parent_name'])
                
                # Find monthly count records that match this item's unique_id
                for monthly_count_item in parent_doc.monthly_count:
                    if monthly_count_item.row == row['unique_id']:
                        monthly_count[monthly_count_item.month] = monthly_count_item.count
                        
            except Exception as e:
                # If monthly count data doesn't exist yet, just continue without monthly counts
                monthly_count = {}
            
            grouped_data[row['year']].append({
                "department": row['department'],
                "department_location": row['department_location'],
                "position": row['position'],
                "designation": row['designation'],
                "salary": row['salary'] or 0,
                "amount": row['amount'] or 0,
                "unique_id": row['unique_id'],
                "monthly_count": monthly_count
            })

        # Convert defaultdict to normal dict for JSON serialization
        result = dict(grouped_data)
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "payroll_data_display failed")
        return {"error": str(err)}


@frappe.whitelist()
def upsert_payroll_data_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - department
      - department_location
      - position
      - designation
      - salary
      - amount
      - monthly_count (optional): dict with month -> count mapping
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        # Process Payroll data changes
        for change in changes:
            try:
                year = change.get("year")
                department = change.get("department")
                department_location = change.get("department_location")
                position = change.get("position")
                designation = change.get("designation")
                salary = change.get("salary")
                amount = change.get("amount")
                monthly_count = change.get("monthly_count", {})

                if not all([year, department, department_location, position, designation]):
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
                        "project": project,  # Add project field
                        "payroll_data": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name

                # Check if child exists based on department, department_location, position, and designation
                child = frappe.db.get_value(
                    "Payroll Data Items",
                    {
                        "parent": parent, 
                        "department": department,
                        "department_location": department_location,
                        "position": position,
                        "designation": designation
                    },
                    "name"
                )
                
                # Also check if we can find the child by unique_id if provided
                if not child and change.get("unique_id"):
                    child_by_unique_id = frappe.db.get_value(
                        "Payroll Data Items",
                        {"unique_id": change.get("unique_id")},
                        "name"
                    )
                    if child_by_unique_id:
                        # Get the parent of this child to ensure we're working with the correct parent
                        child_parent = frappe.db.get_value(
                            "Payroll Data Items",
                            {"name": child_by_unique_id},
                            "parent"
                        )
                        if child_parent == parent:
                            child = child_by_unique_id

                if child:
                    # Update existing child
                    child_doc = frappe.get_doc("Payroll Data Items", child)
                    if salary is not None:
                        child_doc.salary = salary
                    if amount is not None:
                        child_doc.amount = amount
                    
                    # Ensure unique_id exists (for backward compatibility)
                    if not child_doc.unique_id:
                        child_doc.unique_id = generate_unique_id()
                    
                    child_doc.save()
                    
                    # Update monthly counts with unique_id
                    if monthly_count:
                        update_monthly_counts(child, monthly_count, child_doc.unique_id)
                    
                    results.append({"action": "updated", "name": child_doc.name, "type": "payroll_data"})
                else:
                    # Create new child with unique ID
                    unique_id = generate_unique_id()
                    
                    parent_doc = frappe.get_doc("Payroll Data", parent)
                    new_child = parent_doc.append("payroll_data", {
                        "department": department,
                        "department_location": department_location,
                        "position": position,
                        "designation": designation,
                        "salary": salary or 0,
                        "amount": amount or 0,
                        "unique_id": unique_id
                    })
                    parent_doc.save()
                    
                    # Add monthly counts for new child with unique_id
                    if monthly_count:
                        update_monthly_counts(new_child.name, monthly_count, unique_id)
                    
                    results.append({"action": "created", "name": new_child.name, "type": "payroll_data", "unique_id": unique_id})

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        
        return {
            "success": True, 
            "results": results,
            "summary": {
                "payroll_data_processed": len(changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_payroll_data_items failed")
        frappe.logger().error(f"Error in upsert_payroll_data_items: {str(e)}")
        return {"success": False, "error": str(e)}


def generate_unique_id():
    """Generate a unique ID for payroll data items"""
    import uuid
    import time
    
    # Create a unique ID using timestamp and UUID
    timestamp = int(time.time() * 1000)  # milliseconds
    uuid_part = str(uuid.uuid4())[:8]  # first 8 characters of UUID
    unique_id = f"PAY_{timestamp}_{uuid_part}"
    
    return unique_id


def update_monthly_counts(item_name, monthly_count, unique_id=None):
    """Update monthly count data for a payroll item"""
    try:
        # Get the Payroll Data Items document to find its parent
        item_doc = frappe.get_doc("Payroll Data Items", item_name)
        parent_name = item_doc.parent
        
        # Get the parent Payroll Data document
        parent_doc = frappe.get_doc("Payroll Data", parent_name)
        
        # Remove existing monthly count records for this unique_id and specific months
        # Only remove the months that are being updated, not all months
        months_to_update = set(monthly_count.keys())
        parent_doc.monthly_count = [
            item for item in parent_doc.monthly_count 
            if not (item.row == unique_id and item.month in months_to_update)
        ]
        
        # Add new monthly count records
        for month, count in monthly_count.items():
            if count is not None:  # Save all values, including 0
                parent_doc.append("monthly_count", {
                    "month": month,
                    "count": count,
                    "row": unique_id
                })
        
        # Save the parent document
        parent_doc.save()
        
    except Exception as e:
        # Don't raise the error, just log it so the main operation can continue
        pass




# API endpoints:
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.payroll_data_display
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items