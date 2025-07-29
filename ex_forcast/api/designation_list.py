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