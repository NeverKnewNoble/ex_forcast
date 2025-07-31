import frappe
from frappe import _

@frappe.whitelist()
def get_department_list():
    """Get list of departments for payroll modal"""
    try:
        departments = frappe.get_all(
            "Department",
            fields=["name", "department_name"],
            order_by="department_name"
        )
        
        return {
            "success": True,
            "departments": departments
        }
    except Exception as e:
        frappe.log_error(f"Error getting department list: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_department(department_name):
    """Create a new department"""
    try:
        # Get default company from Global Defaults
        default_company = frappe.get_value("Global Defaults", "Global Defaults", "default_company")
        
        if not default_company:
            return {
                "success": False,
                "error": "Default company not found in Global Defaults"
            }
        
        # Check if department already exists
        if frappe.db.exists("Department", {"department_name": department_name}):
            return {
                "success": False,
                "error": f"Department '{department_name}' already exists"
            }
        
        # Create new department
        department = frappe.get_doc({
            "doctype": "Department",
            "department_name": department_name,
            "company": default_company
        })
        department.insert()
        
        return {
            "success": True,
            "message": f"Department '{department_name}' created successfully",
            "department": {
                "name": department.name,
                "department_name": department.department_name
            }
        }
    except Exception as e:
        frappe.log_error(f"Error creating department: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
    
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.department_list.get_department_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.department_list.create_department