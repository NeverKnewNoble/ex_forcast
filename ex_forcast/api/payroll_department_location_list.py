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