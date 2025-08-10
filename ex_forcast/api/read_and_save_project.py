import frappe
from frappe import _
import json

@frappe.whitelist(allow_guest=True)
def get_projects():
    """Get all forecast projects"""
    try:
        projects = frappe.get_all(
            "Forecast Project",
            fields=["name", "project_name", "project_description", "creation"],
            order_by="creation desc"
        )
        
        return {
            "status": "success",
            "data": projects,
            "message": f"Found {len(projects)} projects"
        }
    except Exception as e:
        frappe.log_error(f"Error fetching projects: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch projects: {str(e)}"
        }

@frappe.whitelist(allow_guest=True)
def create_project(project_name, project_description, departments=None, department_details=None):
    """Create a new forecast project with departments and related items"""
    try:
        # Log incoming data for debugging
        frappe.logger().info(f"Creating project: {project_name}")
        frappe.logger().info(f"Project description: {project_description}")
        frappe.logger().info(f"Departments received: {departments}")
        frappe.logger().info(f"Department details received: {department_details}")
        
        # Validate input
        if not project_name or not project_name.strip():
            return {
                "status": "error",
                "message": "Project name is required"
            }
        
        if not project_description or not project_description.strip():
            return {
                "status": "error", 
                "message": "Project description is required"
            }
        
        # Check if project name already exists
        existing_project = frappe.db.exists("Forecast Project", {"project_name": project_name.strip()})
        if existing_project:
            return {
                "status": "error",
                "message": f"Project with name '{project_name}' already exists"
            }
        
        # Create new project
        new_project = frappe.get_doc({
            "doctype": "Forecast Project",
            "project_name": project_name.strip(),
            "project_description": project_description.strip()
        })
        
        new_project.insert()
        
        # Create default room packages for the new project
        default_packages = ["Standard", "Superior", "Deluxe", "Suite", "Presidential"]
        
        for package_name in default_packages: 
            # Check if package already exists for this project
            existing = frappe.db.exists("Room Packages", {
                "package_name": package_name, 
                "project": new_project.project_name
            })
            
            if not existing:
                # Create the package
                room_package = frappe.get_doc({
                    "doctype": "Room Packages",
                    "package_name": package_name,
                    "number_of_rooms": 0,
                    "project": new_project.project_name
                })
                room_package.insert()
        
        # Handle departments if provided
        if departments:
            departments_list = departments if isinstance(departments, list) else json.loads(departments)
            department_details_dict = department_details if isinstance(department_details, dict) else json.loads(department_details) if department_details else {}

            # Debug: Check what departments exist in the database
            all_existing_depts = frappe.get_all("Department", fields=["name", "department_name"])
            frappe.logger().info(f"All existing departments in database: {all_existing_depts}")
            frappe.logger().info(f"Departments being sent from frontend: {departments_list}")

            # Process each selected department - CREATE DEPARTMENTS FIRST
            # IMPORTANT: store Department docnames (IDs), since Link fields expect the docname
            actual_department_docnames = []
            frappe.logger().info(f"Processing departments list: {departments_list}")

            for dept_name in departments_list:
                # Normalize incoming name for better matching
                proper_dept_name = (dept_name or "").title().replace(" & ", " And ")
                frappe.logger().info(f"Processing department: '{dept_name}' -> '{proper_dept_name}'")

                # 1) Try exact match by department_name, get docname
                dept_docname = frappe.db.get_value("Department", {"department_name": proper_dept_name}, "name")

                # 2) Try case-insensitive exact match
                if not dept_docname:
                    candidates = frappe.get_all("Department", fields=["name", "department_name"])
                    for cand in candidates:
                        if (cand.get("department_name") or "").strip().lower() == proper_dept_name.strip().lower():
                            dept_docname = cand.get("name")
                            break

                # 3) Try LIKE search on proper and original name
                if not dept_docname:
                    similar = frappe.get_all(
                        "Department",
                        filters={"department_name": ["like", f"%{proper_dept_name}%"]},
                        fields=["name", "department_name"],
                        limit=1,
                    )
                    if not similar and dept_name:
                        similar = frappe.get_all(
                            "Department",
                            filters={"department_name": ["like", f"%{dept_name}%"]},
                            fields=["name", "department_name"],
                            limit=1,
                        )
                    if similar:
                        dept_docname = similar[0]["name"]

                # 4) Create if still not found
                if not dept_docname:
                    frappe.logger().info(f"No existing department found. Creating new Department: {proper_dept_name}")
                    try:
                        default_company = frappe.get_value("Global Defaults", "Global Defaults", "default_company")
                        if not default_company:
                            companies = frappe.get_all("Company", fields=["name"], limit=1)
                            if companies:
                                default_company = companies[0].name

                        if not default_company:
                            frappe.logger().error("No company found to create Department")
                        else:
                            department = frappe.get_doc({
                                "doctype": "Department",
                                "department_name": proper_dept_name,
                                "company": default_company,
                            })
                            department.insert()
                            dept_docname = department.name
                            frappe.logger().info(f"Created Department '{proper_dept_name}' with name '{dept_docname}'")
                    except Exception as e:
                        frappe.logger().error(f"Failed to create Department '{proper_dept_name}': {str(e)}")

                if dept_docname:
                    actual_department_docnames.append(dept_docname)
                else:
                    frappe.logger().error(f"Unable to resolve Department for '{dept_name}'")

            frappe.logger().info(f"Resolved Department docnames to add: {actual_department_docnames}")

            # Add departments to project's departments child table
            if not actual_department_docnames:
                frappe.logger().error("No departments were resolved to docnames; departments table will remain empty")
            else:
                for dept_docname in actual_department_docnames:
                    try:
                        # Verify department exists before adding to project
                        if frappe.db.exists("Department", dept_docname):
                            new_project.append("departments", {"depatment": dept_docname})
                            frappe.logger().info(f"Added Department '{dept_docname}' to project")
                        else:
                            frappe.logger().error(f"Department '{dept_docname}' does not exist; skipping append")
                    except Exception as e:
                        frappe.logger().error(f"Failed to append Department '{dept_docname}' to project: {str(e)}")
            
            frappe.logger().info(f"Project departments table after adding: {new_project.departments}")
            
            # Handle department details BEFORE saving the project
            if department_details:
                department_details_dict = department_details if isinstance(department_details, dict) else json.loads(department_details)

                # Handle Rooms department locations
                if 'Rooms' in departments_list and 'roomsLocations' in department_details_dict:
                    for location in department_details_dict['roomsLocations']:
                        if not frappe.db.exists("Payroll Department Location", {"department_location": location}):
                            try:
                                location_doc = frappe.get_doc({
                                    "doctype": "Payroll Department Location",
                                    "department_location": location
                                })
                                location_doc.insert()
                                frappe.logger().info(f"Created payroll department location: {location}")
                            except Exception as e:
                                frappe.logger().error(f"Failed to create payroll department location {location}: {str(e)}")
                        else:
                            frappe.logger().info(f"Payroll department location {location} already exists")

                # Handle Food & Beverage restaurants
                if 'Food And Beverage' in departments_list and 'fbRestaurants' in department_details_dict:
                    for restaurant in department_details_dict['fbRestaurants']:
                        # Create restaurant if it doesn't exist
                        if not frappe.db.exists("Restaurant", {"cover_name": restaurant}):
                            try:
                                restaurant_doc = frappe.get_doc({
                                    "doctype": "Restaurant",
                                    "cover_name": restaurant,
                                    "project": new_project.project_name
                                })
                                restaurant_doc.insert()
                                frappe.logger().info(f"Created restaurant: {restaurant}")
                            except Exception as e:
                                frappe.logger().error(f"Failed to create restaurant {restaurant}: {str(e)}")
                        else:
                            frappe.logger().info(f"Restaurant {restaurant} already exists")

                        # Create payroll department location for restaurant if it doesn't exist
                        if not frappe.db.exists("Payroll Department Location", {"department_location": restaurant}):
                            try:
                                location_doc = frappe.get_doc({
                                    "doctype": "Payroll Department Location",
                                    "department_location": restaurant
                                })
                                location_doc.insert()
                                frappe.logger().info(f"Created payroll department location for restaurant: {restaurant}")
                            except Exception as e:
                                frappe.logger().error(f"Failed to create payroll department location for restaurant {restaurant}: {str(e)}")
                        else:
                            frappe.logger().info(f"Payroll department location for restaurant {restaurant} already exists")
            
            # Save the project with departments
            new_project.save()
        
        return {
            "status": "success",
            "data": {
                "name": new_project.name,
                "project_name": new_project.project_name,
                "project_description": new_project.project_description,
                "creation": new_project.creation
            },
            "message": f"Project '{project_name}' created successfully"
        }
        
    except Exception as e:
        # Truncate error message to prevent CharacterLengthExceededError
        error_msg = str(e)[:100] + "..." if len(str(e)) > 100 else str(e)
        frappe.log_error(f"Error creating project: {error_msg}")
        return {
            "status": "error",
            "message": f"Failed to create project: {error_msg}"
        }

@frappe.whitelist(allow_guest=True)
def get_project_by_name(project_name):
    """Get a specific project by name"""
    try:
        project = frappe.get_doc("Forecast Project", {"project_name": project_name})
        return {
            "status": "success",
            "data": {
                "name": project.name,
                "project_name": project.project_name,
                "project_description": project.project_description,
                "creation": project.creation
            }
        }
    except Exception as e:
        frappe.log_error(f"Error fetching project: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch project: {str(e)}"
        } 
    

# ? Get project departments by project name
@frappe.whitelist(allow_guest=True)
def get_project_departments(project_name):
    """Get all department names for a specific project"""
    try:
        project = frappe.get_doc("Forecast Project", {"project_name": project_name})
        # Each child row has field `depatment` which links to Department docname. Resolve to human-friendly `department_name`.
        department_names = []
        for row in project.departments or []:
            dept_docname = getattr(row, "depatment", None)
            if not dept_docname:
                continue
            dept_name = frappe.db.get_value("Department", dept_docname, "department_name") or dept_docname
            department_names.append(dept_name)

        return {
            "status": "success",
            "data": department_names,
            "message": f"Found {len(department_names)} departments for project '{project_name}'"
        }
    except Exception as e:
        frappe.log_error(f"Error fetching project departments: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to fetch project departments: {str(e)}"
        }