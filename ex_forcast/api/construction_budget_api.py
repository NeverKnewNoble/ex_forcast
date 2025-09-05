import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def test_construction_budget_api():
    """Test endpoint to verify API is working"""
    return {
        "success": True,
        "message": "Construction Budget API is working",
        "timestamp": frappe.utils.now()
    }

@frappe.whitelist(allow_guest=True)
def construction_budget_display(project=None):
    """Fetch construction budget data from Construction Budget Project doctype"""
    try:
        # Log the request for debugging
        frappe.logger().info(f"Fetching construction budget data for project: {project}")
        
        # First, check if there are any construction budget projects
        project_count = frappe.db.count("Construction Budget Project")
        frappe.logger().info(f"Total construction budget projects: {project_count}")
        
        if project_count == 0:
            # Return empty data if no projects exist
            return {
                "success": True,
                "data": []
            }
        
        # SQL query to get construction budget data with project filter
        query = """
            SELECT 
                parent.name as project_id,
                parent.project,
                parent.total_budget,
                parent.total_actual,
                parent.variance,
                child.name as task_id,
                child.project_name,
                child.task_name,
                child.description,
                child.status,
                child.planned_start_date,
                child.actual_start_date,
                child.end_date,
                child.labor_hours,
                child.rate_per_hour,
                child.total_labor_cost,
                child.material_units,
                child.rate_per_unit,
                child.total_material_cost,
                child.travel_cost,
                child.equipmentspace_cost,
                child.miscellaneous_cost,
                child.budget_amount,
                child.actual_cost,
                child.underover_budget
            FROM 
                `tabConstruction Budget Project` AS parent
            LEFT JOIN 
                `tabConstruction Budget Task` AS child
            ON 
                child.parent = parent.name
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY parent.name ASC, child.idx ASC"
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY parent.name ASC, child.idx ASC"
            raw_results = frappe.db.sql(query, as_dict=True)
        
        frappe.logger().info(f"Raw SQL results count: {len(raw_results)}")
        frappe.logger().info(f"Sample result: {raw_results[0] if raw_results else 'No results'}")
        
        # Group data by project -> list of tasks
        grouped_data = defaultdict(list)
        project_info = {}

        for row in raw_results:
            project_id = row.get("project_id")
            project_name = row.get("project")
            
            # Store project info
            if project_id not in project_info:
                project_info[project_id] = {
                    "project_name": project_name,
                    "project_id": project_id,
                    "total_budget": float(row.get("total_budget") or 0),
                    "total_actual": float(row.get("total_actual") or 0),
                    "variance": float(row.get("variance") or 0)
                }
            
            # Only process task data if task_id exists (LEFT JOIN might return NULL)
            if row.get("task_id"):
                # Transform the data to match frontend structure
                task_data = {
                    "id": row.get("task_id"),
                    "task": row.get("task_name") or "",
                    "project_name": row.get("project_name") or "",
                    "isSubtask": False,  # Can be enhanced later
                    "description": row.get("description") or "",
                    "status": row.get("status") or "Not Started",
                    "plannedStartDate": row.get("planned_start_date") or "",
                    "actualStartDate": row.get("actual_start_date") or "",
                    "endDate": row.get("end_date") or "",
                    "hr": float(row.get("labor_hours") or 0),
                    "ratePerHr": float(row.get("rate_per_hour") or 0),
                    "units": float(row.get("material_units") or 0),
                    "ratePerUnit": float(row.get("rate_per_unit") or 0),
                    "travel": float(row.get("travel_cost") or 0),
                    "equipment": float(row.get("equipmentspace_cost") or 0),
                    "misc": float(row.get("miscellaneous_cost") or 0),
                    "budget": float(row.get("budget_amount") or 0)
                }
                
                # Add computed properties
                task_data["totalLabor"] = task_data["hr"] * task_data["ratePerHr"]
                task_data["totalMaterials"] = task_data["units"] * task_data["ratePerUnit"]
                task_data["actual"] = (task_data["totalLabor"] + 
                                     task_data["totalMaterials"] + 
                                     task_data["travel"] + 
                                     task_data["equipment"] + 
                                     task_data["misc"])
                task_data["underOver"] = task_data["actual"] - task_data["budget"]
                
                grouped_data[project_id].append(task_data)

        # Transform to frontend format
        projects = []
        for project_id, tasks in grouped_data.items():
            if project_id in project_info:
                proj_info = project_info[project_id]
                
                # Calculate project subtotals
                subtotal_labor = sum(task["totalLabor"] for task in tasks)
                subtotal_materials = sum(task["totalMaterials"] for task in tasks)
                subtotal_travel = sum(task["travel"] for task in tasks)
                subtotal_equipment = sum(task["equipment"] for task in tasks)
                subtotal_misc = sum(task["misc"] for task in tasks)
                subtotal_budget = sum(task["budget"] for task in tasks)
                subtotal_actual = subtotal_labor + subtotal_materials + subtotal_travel + subtotal_equipment + subtotal_misc
                subtotal_under_over = subtotal_actual - subtotal_budget
                
                project_data = {
                    "id": project_id,
                    "name": proj_info["project_name"],
                    "total_budget": proj_info["total_budget"],
                    "total_actual": proj_info["total_actual"],
                    "variance": proj_info["variance"],
                    "tasks": tasks,
                    "subtotalLabor": subtotal_labor,
                    "subtotalMaterials": subtotal_materials,
                    "subtotalTravel": subtotal_travel,
                    "subtotalEquipment": subtotal_equipment,
                    "subtotalMisc": subtotal_misc,
                    "subtotalBudget": subtotal_budget,
                    "subtotalActual": subtotal_actual,
                    "subtotalUnderOver": subtotal_under_over
                }
                projects.append(project_data)
        
        # Also include projects that have no tasks
        for project_id, proj_info in project_info.items():
            if project_id not in grouped_data:
                project_data = {
                    "id": project_id,
                    "name": proj_info["project_name"],
                    "total_budget": proj_info["total_budget"],
                    "total_actual": proj_info["total_actual"],
                    "variance": proj_info["variance"],
                    "tasks": [],
                    "subtotalLabor": 0,
                    "subtotalMaterials": 0,
                    "subtotalTravel": 0,
                    "subtotalEquipment": 0,
                    "subtotalMisc": 0,
                    "subtotalBudget": 0,
                    "subtotalActual": 0,
                    "subtotalUnderOver": 0
                }
                projects.append(project_data)

        return {
            "success": True,
            "data": projects
        }

    except Exception as err:
        frappe.logger().error(f"Error fetching construction budget data: {str(err)}")
        return {
            "success": False,
            "error": str(err)
        }


@frappe.whitelist()
def upsert_construction_budget(changes, project=None):
    """
    Create or update construction budget data
    
    changes: JSON string or list of dicts, each with:
      - project_id (optional, for updates)
      - project_name
      - tasks: list of task objects
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        # Process construction budget changes
        for change in changes:
            try:
                project_id = change.get("project_id")
                project_name = change.get("project_name") or change.get("name")
                tasks = change.get("tasks", [])

                if not project_name:
                    continue

                # Find or create parent document
                if project_id:
                    # Update existing project
                    parent_doc = frappe.get_doc("Construction Budget Project", project_id)
                else:
                    # Create new project
                    parent_doc = frappe.get_doc({
                        "doctype": "Construction Budget Project",
                        "project": project,
                        "tasks": []
                    })
                    parent_doc.insert()

                # Clear existing tasks
                parent_doc.tasks = []

                # Add new tasks
                for task_data in tasks:
                    task_doc = {
                        "doctype": "Construction Budget Task",
                        "project_name": task_data.get("project_name", ""),
                        "task_name": task_data.get("task", ""),
                        "description": task_data.get("description", ""),
                        "status": task_data.get("status", "Not Started"),
                        "planned_start_date": task_data.get("plannedStartDate"),
                        "actual_start_date": task_data.get("actualStartDate"),
                        "end_date": task_data.get("endDate"),
                        "labor_hours": task_data.get("hr", 0),
                        "rate_per_hour": task_data.get("ratePerHr", 0),
                        "material_units": task_data.get("units", 0),
                        "rate_per_unit": task_data.get("ratePerUnit", 0),
                        "travel_cost": task_data.get("travel", 0),
                        "equipmentspace_cost": task_data.get("equipment", 0),
                        "miscellaneous_cost": task_data.get("misc", 0),
                        "budget_amount": task_data.get("budget", 0)
                    }
                    
                    # Calculate computed fields
                    task_doc["total_labor_cost"] = task_doc["labor_hours"] * task_doc["rate_per_hour"]
                    task_doc["total_material_cost"] = task_doc["material_units"] * task_doc["rate_per_unit"]
                    task_doc["actual_cost"] = (task_doc["total_labor_cost"] + 
                                             task_doc["total_material_cost"] + 
                                             task_doc["travel_cost"] + 
                                             task_doc["equipmentspace_cost"] + 
                                             task_doc["miscellaneous_cost"])
                    task_doc["underover_budget"] = task_doc["actual_cost"] - task_doc["budget_amount"]
                    
                    parent_doc.append("tasks", task_doc)

                # Calculate project totals
                parent_doc.total_budget = sum(task.get("budget_amount", 0) for task in parent_doc.tasks)
                parent_doc.total_actual = sum(task.get("actual_cost", 0) for task in parent_doc.tasks)
                parent_doc.variance = parent_doc.total_actual - parent_doc.total_budget

                parent_doc.save()
                results.append({
                    "action": "updated" if project_id else "created", 
                    "name": parent_doc.name, 
                    "type": "construction_budget_project"
                })

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        
        # Log successful save for debugging
        frappe.logger().info(f"Successfully saved construction budget data. Results: {results}")
        
        return {
            "success": True, 
            "results": results,
            "message": "Construction budget data saved successfully"
        }

    except Exception as e:
        frappe.logger().error(f"Error upserting construction budget data: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def delete_construction_budget_project(project_id):
    """Delete a construction budget project"""
    try:
        if not project_id:
            return {
                "success": False,
                "error": "Project ID is required"
            }

        # Check if project exists
        if not frappe.db.exists("Construction Budget Project", project_id):
            return {
                "success": False,
                "error": "Project not found"
            }

        # Delete the project (this will cascade delete tasks)
        frappe.delete_doc("Construction Budget Project", project_id)
        frappe.db.commit()

        return {
            "success": True,
            "message": "Project deleted successfully"
        }

    except Exception as e:
        frappe.logger().error(f"Error deleting construction budget project: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def delete_construction_budget_task(task_id):
    """Delete a construction budget task"""
    try:
        if not task_id:
            return {
                "success": False,
                "error": "Task ID is required"
            }

        # Check if task exists
        if not frappe.db.exists("Construction Budget Task", task_id):
            return {
                "success": False,
                "error": "Task not found"
            }

        # Delete the task
        frappe.delete_doc("Construction Budget Task", task_id)
        frappe.db.commit()

        return {
            "success": True,
            "message": "Task deleted successfully"
        }

    except Exception as e:
        frappe.logger().error(f"Error deleting construction budget task: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist(allow_guest=True)
def get_construction_budget_summary(project=None):
    """Get summary statistics for construction budget"""
    try:
        # Get basic project count
        if project:
            project_count = frappe.db.count("Construction Budget Project", {"project": project})
        else:
            project_count = frappe.db.count("Construction Budget Project")

        # Get total budget and actual costs
        query = """
            SELECT 
                SUM(total_budget) as total_budget,
                SUM(total_actual) as total_actual,
                SUM(variance) as total_variance
            FROM `tabConstruction Budget Project`
        """
        
        if project:
            query += " WHERE project = %s"
            result = frappe.db.sql(query, (project,), as_dict=True)[0]
        else:
            result = frappe.db.sql(query, as_dict=True)[0]

        # Get task count
        task_query = """
            SELECT COUNT(*) as task_count
            FROM `tabConstruction Budget Task` t
            INNER JOIN `tabConstruction Budget Project` p ON t.parent = p.name
        """
        
        if project:
            task_query += " WHERE p.project = %s"
            task_result = frappe.db.sql(task_query, (project,), as_dict=True)[0]
        else:
            task_result = frappe.db.sql(task_query, as_dict=True)[0]

        return {
            "success": True,
            "data": {
                "project_count": project_count,
                "task_count": task_result.get("task_count", 0),
                "total_budget": float(result.get("total_budget") or 0),
                "total_actual": float(result.get("total_actual") or 0),
                "total_variance": float(result.get("total_variance") or 0)
            }
        }

    except Exception as e:
        frappe.logger().error(f"Error getting construction budget summary: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }