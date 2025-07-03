import frappe

@frappe.whitelist(allow_guest=True)
def get_room_packages():
    """
    API endpoint to Room Packages doctype
    """
    try:
        # Get the Expense Items doctype
        room_packages = frappe.get_all("Room Packages", fields=["name", "number_of_rooms", "module"])
        
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

@frappe.whitelist(allow_guest=True)
def create_room_package(package_name, number_of_rooms):
    """
    API endpoint to create a Room Packages document
    """
    try:
        doc = frappe.get_doc({
            "doctype": "Room Packages",
            "package_name": package_name,
            "number_of_rooms": int(number_of_rooms)
        })
        doc.insert()
        frappe.db.commit()
        return {
            "success": True,
            "data": {
                "name": doc.name,
                "package_name": doc.package_name,
                "number_of_rooms": doc.number_of_rooms
            }
        }    
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_room_package API failed")
        return {
            "success": False,
            "error": str(e)
        }

# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_packages_list.get_room_packages 