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