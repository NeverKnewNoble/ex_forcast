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
                child.department,
                child.department_location,
                child.position,
                child.designation,
                child.salary,
                child.amount
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
        
        frappe.logger().info(f"Raw SQL results: {raw_results}")

        # Group data by year -> list of payroll rows
        grouped_data = defaultdict(list)

        for row in raw_results:
            grouped_data[row['year']].append({
                "department": row['department'],
                "department_location": row['department_location'],
                "position": row['position'],
                "designation": row['designation'],
                "salary": row['salary'] or 0,
                "amount": row['amount'] or 0
            })

        # Convert defaultdict to normal dict for JSON serialization
        result = dict(grouped_data)
        frappe.logger().info(f"Final result: {result}")
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
    project: Project name to filter/create documents for
    """
    try:
        # Debug logging
        frappe.logger().info(f"Received Payroll data changes: {changes}")
        
        if isinstance(changes, str):
            changes = json.loads(changes)
        
        frappe.logger().info(f"Parsed Payroll data changes: {changes}")

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

                frappe.logger().info(f"Processing change: year={year}, department={department}, department_location={department_location}, position={position}, designation={designation}, salary={salary}, amount={amount}")

                if not all([year, department, department_location, position, designation]):
                    frappe.logger().warning(f"Skipping invalid Payroll data change: {change}")
                    continue

                # Find or create parent document with project filter
                parent = frappe.db.get_value(
                    "Payroll Data",
                    {"year": year, "project": project} if project else {"year": year},
                    "name"
                )
                if not parent:
                    frappe.logger().info(f"Creating new parent document for year={year}, project={project}")
                    parent_doc = frappe.get_doc({
                        "doctype": "Payroll Data",
                        "year": year,
                        "project": project,  # Add project field
                        "payroll_data": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name
                    frappe.logger().info(f"Created parent document: {parent}")

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

                if child:
                    # Update existing child
                    frappe.logger().info(f"Updating existing child document: {child}")
                    child_doc = frappe.get_doc("Payroll Data Items", child)
                    if salary is not None:
                        child_doc.salary = salary
                    if amount is not None:
                        child_doc.amount = amount
                    child_doc.save()
                    results.append({"action": "updated", "name": child_doc.name, "type": "payroll_data"})
                else:
                    # Create new child
                    frappe.logger().info(f"Creating new child document for parent={parent}")
                    parent_doc = frappe.get_doc("Payroll Data", parent)
                    new_child = parent_doc.append("payroll_data", {
                        "department": department,
                        "department_location": department_location,
                        "position": position,
                        "designation": designation,
                        "salary": salary or 0,
                        "amount": amount or 0
                    })
                    parent_doc.save()
                    results.append({"action": "created", "name": new_child.name, "type": "payroll_data"})

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        frappe.logger().info(f"Successfully processed {len(results)} Payroll data changes")
        
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


@frappe.whitelist()
def get_departments_list(project=None):
    """Fetch list of departments filtered by project"""
    try:
        # Check if Department doctype exists
        if not frappe.db.exists("DocType", "Department"):
            return {"success": False, "error": "Department doctype does not exist"}
        
        filters = {}
        if project:
            filters["project"] = project
        
        departments = frappe.get_all(
            "Department",
            fields=["name", "department_name"],
            filters=filters,
            order_by="name"
        )
        return {"success": True, "departments": departments}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_departments_list failed")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def get_department_locations_list(project=None):
    """Fetch list of department locations filtered by project"""
    try:
        # Check if Payroll Department Location doctype exists
        if not frappe.db.exists("DocType", "Payroll Department Location"):
            return {"success": False, "error": "Payroll Department Location doctype does not exist"}
        
        filters = {}
        if project:
            filters["project"] = project
        
        locations = frappe.get_all(
            "Payroll Department Location",
            fields=["name", "department_location"],
            filters=filters,
            order_by="name"
        )
        return {"success": True, "locations": locations}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_department_locations_list failed")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def get_designations_list(project=None):
    """Fetch list of designations filtered by project"""
    try:
        # Check if Designation doctype exists
        if not frappe.db.exists("DocType", "Designation"):
            return {"success": False, "error": "Designation doctype does not exist"}
        
        filters = {}
        if project:
            filters["project"] = project
        
        designations = frappe.get_all(
            "Designation",
            fields=["name", "designation_name"],
            filters=filters,
            order_by="name"
        )
        return {"success": True, "designations": designations}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_designations_list failed")
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def test_payroll_api():
    """Simple test endpoint to verify Payroll API is working"""
    return {"status": "success", "message": "Payroll Data API is working"}


@frappe.whitelist()
def test_doctypes():
    """Test endpoint to check if required doctypes exist"""
    try:
        doctypes_to_check = ["Department", "Payroll Department Location", "Designation", "Payroll Data"]
        results = {}
        
        for doctype in doctypes_to_check:
            exists = frappe.db.exists("DocType", doctype)
            results[doctype] = exists
            
            if exists:
                # Try to get some sample data
                try:
                    sample_data = frappe.get_all(doctype, fields=["name"], limit=1)
                    results[f"{doctype}_sample"] = len(sample_data)
                except Exception as e:
                    results[f"{doctype}_error"] = str(e)
        
        return {
            "success": True,
            "doctypes": results,
            "message": "Doctype check completed"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@frappe.whitelist()
def test_payroll_upsert():
    """Test endpoint to verify upsert functionality with sample data"""
    try:
        # Test with sample data
        test_changes = [
            {
                "year": "2024",
                "department": "ROOMS",
                "department_location": "Front Desk",
                "position": "Manager",
                "designation": "Front Office Manager",
                "salary": 5000.00,
                "amount": 1
            }
        ]
        
        # Test the upsert function
        result = upsert_payroll_data_items(test_changes)
        return {
            "status": "success", 
            "message": "Test upsert completed",
            "result": result
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "test_payroll_upsert failed")
        return {"status": "error", "message": str(e)}


# API endpoints:
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.payroll_data_display
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.get_departments_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.get_department_locations_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.get_designations_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.test_payroll_api
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.test_doctypes
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_data.test_payroll_upsert 