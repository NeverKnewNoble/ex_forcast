import frappe

@frappe.whitelist(allow_guest=True)
def get_room_packages(project_name=None):
    """
    API endpoint to get Room Packages doctype filtered by project
    """
    try:
        # Build the filter
        filters = {}
        if project_name:
            filters["project"] = project_name
        
        # Get the Room Packages doctype
        room_packages = frappe.get_all("Room Packages", fields=["name", "package_name", "number_of_rooms", "project"], filters=filters)
        
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
def create_room_package(package_name, number_of_rooms, project_name=None):
    """
    API endpoint to create a Room Packages document
    """
    try:
        doc = frappe.get_doc({
            "doctype": "Room Packages",
            "package_name": package_name,
            "number_of_rooms": int(number_of_rooms),
            "project": project_name
        })
        doc.insert()
        frappe.db.commit()
        return {
            "success": True,
            "data": {
                "name": doc.name,
                "package_name": doc.package_name,
                "number_of_rooms": doc.number_of_rooms,
                "project": doc.project
            }
        }    
    
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_room_package API failed")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist(allow_guest=True)
def create_default_room_packages(project_name):
    """
    API endpoint to create default room packages for a project if they don't exist
    """
    try:
        if not project_name:
            return {
                "success": False,
                "error": "Project name is required"
            }
        
        # Default room packages
        default_packages = [
            {"package_name": "Standard", "number_of_rooms": 0},
            {"package_name": "Superior", "number_of_rooms": 0},
            {"package_name": "Deluxe", "number_of_rooms": 0},
            {"package_name": "Suite", "number_of_rooms": 0},
            {"package_name": "Presidential", "number_of_rooms": 0}
        ]
        
        created_packages = []
        
        for package in default_packages:
            # Check if package already exists for this project
            existing = frappe.get_all("Room Packages", 
                filters={"package_name": package["package_name"], "project": project_name},
                fields=["name"]
            )
            
            if not existing:
                # Create the package
                doc = frappe.get_doc({
                    "doctype": "Room Packages",
                    "package_name": package["package_name"],
                    "number_of_rooms": package["number_of_rooms"],
                    "project": project_name
                })
                doc.insert()
                created_packages.append({
                    "name": doc.name,
                    "package_name": doc.package_name,
                    "number_of_rooms": doc.number_of_rooms,
                    "project": doc.project
                })
        
        frappe.db.commit()
        
        return {
            "success": True,
            "data": {
                "created_packages": created_packages,
                "message": f"Created {len(created_packages)} default packages for project {project_name}"
            }
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_default_room_packages API failed")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist(allow_guest=True)
def delete_room_package(package_name, project_name):
    """
    API endpoint to delete a Room Packages document
    """
    try:
        if not package_name or not project_name:
            return {
                "success": False,
                "error": "Package name and project name are required"
            }
        
        # Find the package to delete
        packages = frappe.get_all("Room Packages", 
            filters={"package_name": package_name, "project": project_name},
            fields=["name"]
        )
        
        if not packages:
            return {
                "success": False,
                "error": f"Package {package_name} not found for project {project_name}"
            }
        
        # Delete the package
        frappe.delete_doc("Room Packages", packages[0].name)
        frappe.db.commit()
        
        return {
            "success": True,
            "data": {
                "message": f"Package {package_name} deleted successfully from project {project_name}"
            }
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "delete_room_package API failed")
        return {
            "success": False,
            "error": str(e)
        }

# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_packages_list.get_room_packages 