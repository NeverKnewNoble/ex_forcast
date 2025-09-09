import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_default_expenses_for_project(project_name):
    """Get default expenses for departments selected in a project"""
    try:
        if not project_name:
            return {
                "success": False,
                "error": "Project name is required"
            }
        
        # Debug: Log the project name being searched for
        frappe.logger().info(f"Searching for project: '{project_name}'")
        
        # Resolve project by either docname or project_name field
        resolved_project_name = None
        
        # Case 1: Provided value is the doctype docname
        if frappe.db.exists("Forecast Project", project_name):
            resolved_project_name = project_name
        else:
            # Case 2: Provided value is the human-friendly project_name field
            resolved_project_name = frappe.db.get_value(
                "Forecast Project",
                {"project_name": project_name},
                "name"
            )

        if not resolved_project_name:
            # Try to find similar project names to help debugging
            all_projects = frappe.get_all("Forecast Project", fields=["name", "project_name"])
            frappe.logger().info(f"Available projects: {all_projects}")
            return {
                "success": False,
                "error": f"Project '{project_name}' not found. Available projects: {[p.project_name for p in all_projects]}"
            }

        # Get the project document using the resolved docname
        project = frappe.get_doc("Forecast Project", resolved_project_name)
        frappe.logger().info(f"Found project: {project.name}, project_name: {project.project_name}")
        
        # Get selected departments from the project
        selected_departments = []
        if project.departments:
            for dept in project.departments:
                if dept.depatment:  # Note: typo in fieldname
                    # Get the actual department name from the linked Department document
                    try:
                        department_doc = frappe.get_doc("Department", dept.depatment)
                        # Use department_name field if available, otherwise fall back to name
                        dept_name = getattr(department_doc, 'department_name', None) or department_doc.name
                        selected_departments.append(dept_name)
                        frappe.logger().info(f"Department link: {dept.depatment} -> Department name: {dept_name}")
                    except Exception as dept_error:
                        frappe.logger().error(f"Error fetching department {dept.depatment}: {str(dept_error)}")
                        # Fall back to using the link name if there's an error
                        selected_departments.append(dept.depatment)
        
        frappe.logger().info(f"Selected departments: {selected_departments}")
        
        if not selected_departments:
            return {
                "success": True,
                "default_expenses": [],
                "message": "No departments selected in project"
            }
        
        # Get all available Default Expenses documents for debugging
        all_default_expenses = frappe.get_all("Default Expenses", fields=["name", "department"])
        frappe.logger().info(f"Available Default Expenses documents: {all_default_expenses}")
        
        # Get default expenses for selected departments
        default_expenses = []
        for dept_name in selected_departments:
            frappe.logger().info(f"Processing department: '{dept_name}'")
            
            # Remove common suffixes like "- N", "- S", etc.
            base_dept_name = dept_name.split(' - ')[0].strip()
            frappe.logger().info(f"Base department name: '{base_dept_name}'")
            
            # Try to find exact match first
            found_dept = None
            
            # First try exact match
            if frappe.db.exists("Default Expenses", dept_name):
                found_dept = dept_name
                frappe.logger().info(f"Found exact match: '{dept_name}'")
            # Then try base name match
            elif frappe.db.exists("Default Expenses", base_dept_name):
                found_dept = base_dept_name
                frappe.logger().info(f"Found base name match: '{base_dept_name}'")
            # Finally try partial match
            else:
                for dept_doc in all_default_expenses:
                    if base_dept_name.lower() in dept_doc.department.lower() or dept_doc.department.lower() in base_dept_name.lower():
                        found_dept = dept_doc.name
                        frappe.logger().info(f"Found partial match: '{dept_name}' -> '{dept_doc.department}'")
                        break
            
            if found_dept:
                dept_doc = frappe.get_doc("Default Expenses", found_dept)
                frappe.logger().info(f"Processing Default Expenses doc: {dept_doc.name}")
                
                if dept_doc.default_expenses:
                    frappe.logger().info(f"Found {len(dept_doc.default_expenses)} default expense items")
                    for expense_item in dept_doc.default_expenses:
                        frappe.logger().info(f"Adding expense: {expense_item.expense}")
                        default_expenses.append({
                            "department": dept_name,  # Keep original project department name
                            "expense": expense_item.expense,
                            "cost_type": expense_item.cost_type,
                            "code": "",  # Default expenses don't have codes initially
                            "root_type": "",  # Default expenses don't have root types initially
                            "department_location": "Default",  # Mark as default location
                            "is_default": True  # Flag to identify default expenses
                        })
                else:
                    frappe.logger().info(f"No default_expenses table items found for {found_dept}")
            else:
                frappe.logger().info(f"No Default Expenses doc found for department: '{dept_name}'")
        
        frappe.logger().info(f"Total default expenses found: {len(default_expenses)}")
        
        return {
            "success": True,
            "default_expenses": default_expenses,
            "selected_departments": selected_departments,
            "message": f"Found {len(default_expenses)} default expenses for {len(selected_departments)} departments"
        }
        
    except Exception as e:
        frappe.logger().error(f"Error fetching default expenses for project {project_name}: {str(e)}")
        frappe.logger().error(f"Full error details: {frappe.get_traceback()}")
        return {
            "success": False,
            "error": str(e)
        }
