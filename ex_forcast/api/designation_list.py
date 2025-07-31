import frappe
from frappe import _

@frappe.whitelist()
def get_designation_list():
    """Get list of designations for payroll modal"""
    try:
        designations = frappe.get_all(
            "Designation",
            fields=["name", "designation_name"],
            order_by="designation_name"
        )
        
        return {
            "success": True,
            "designations": designations
        }
    except Exception as e:
        frappe.log_error(f"Error getting designation list: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_designation(designation_name):
    """Create a new designation"""
    try:
        # Check if designation already exists
        if frappe.db.exists("Designation", {"designation_name": designation_name}):
            return {
                "success": False,
                "error": f"Designation '{designation_name}' already exists"
            }
        
        # Create new designation
        designation = frappe.get_doc({
            "doctype": "Designation",
            "designation_name": designation_name
        })
        designation.insert()
        
        return {
            "success": True,
            "message": f"Designation '{designation_name}' created successfully",
            "designation": {
                "name": designation.name,
                "designation_name": designation.designation_name
            }
        }
    except Exception as e:
        frappe.log_error(f"Error creating designation: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
    
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.designation_list.get_designation_list
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.designation_list.create_designation