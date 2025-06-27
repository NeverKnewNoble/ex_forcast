import frappe

@frappe.whitelist(allow_guest=True)
def get_room_packages():
    """
    API endpoint to Room Packages doctype
    """
    try:
        # Get the Expense Items doctype
        room_packages = frappe.get_all("Room Packages", fields=["name", "module"])
        
        return {
            "success": True,
            "data": {
                "room_packages": room_packages
            }
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_room_packages API failed")
        return {
            "success": False,
            "error": str(e),
            "data": {
                "room_packages": []
            }
        }


# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_packages_list.get_room_packages 