import frappe
from frappe import _

@frappe.whitelist()
def get_payroll_department_location_list():
    """Get list of payroll department locations for payroll modal"""
    try:
        locations = frappe.get_all(
            "Payroll Department Location",
            fields=["name", "department_location"],
            order_by="department_location"
        )
        
        return {
            "success": True,
            "locations": locations
        }
    except Exception as e:
        frappe.log_error(f"Error getting payroll department location list: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_payroll_department_location(department_location):
    """Create a new payroll department location"""
    try:
        # Check if location already exists
        if frappe.db.exists("Payroll Department Location", {"department_location": department_location}):
            return {
                "success": False,
                "error": f"Department Location '{department_location}' already exists"
            }
        
        # Create new payroll department location
        location = frappe.get_doc({
            "doctype": "Payroll Department Location",
            "department_location": department_location
        })
        location.insert()
        
        return {
            "success": True,
            "message": f"Department Location '{department_location}' created successfully",
            "location": {
                "name": location.name,
                "department_location": location.department_location
            }
        }
    except Exception as e:
        frappe.log_error(f"Error creating payroll department location: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        } 