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
def create_project(project_name, project_description):
    """Create a new forecast project"""
    try:
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
        frappe.log_error(f"Error creating project: {str(e)}")
        return {
            "status": "error",
            "message": f"Failed to create project: {str(e)}"
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