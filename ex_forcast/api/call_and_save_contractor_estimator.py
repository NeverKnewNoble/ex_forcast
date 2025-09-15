import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def test_connection():
    """Test endpoint to verify Contractor Estimator API is working"""
    return {
        "success": True,
        "message": "Contractor Estimator API is working",
        "timestamp": frappe.utils.now()
    }

@frappe.whitelist(allow_guest=True)
def get_contractor_estimator_data(project_name=None):
    """Fetch contractor estimator data using flattened model"""
    try:
        # Get all estimators for the project
        estimators = frappe.get_all("Contractor Estimator", 
                                  filters={"project": project_name} if project_name else {},
                                  fields=["name", "project", "total_projected", "total_actual", 
                                         "total_variance", "total_current_paid", "total_amount_due"])
        
        if not estimators:
            return {
                "success": True,
                "data": []
            }
        
        result_list = []
        
        for estimator in estimators:
            # Get the full estimator document
            estimator_doc = frappe.get_doc("Contractor Estimator", estimator.name)
            
            # Build the response structure
            estimator_data = {
                "id": estimator_doc.name,
                "project": estimator_doc.project,
                "projectTitle": "",  # This field doesn't exist in the DocType
                "location": "",      # This field doesn't exist in the DocType
                "totals": {
                    "projected": float(estimator_doc.total_projected or 0),
                    "actual": float(estimator_doc.total_actual or 0),
                    "variance": float(estimator_doc.total_variance or 0),
                    "currentPaid": float(estimator_doc.total_current_paid or 0),
                    "amountDue": float(estimator_doc.total_amount_due or 0)
                },
                "categories": []
            }
            
            # Group items by category
            for category in estimator_doc.categories:
                # Get items for this category
                category_items = [item for item in estimator_doc.items if item.category == category.name]
                
                category_data = {
                    "id": category.name,
                    "name": category.category_name,
                    "order": category.order,
                    "subtotals": {
                        "projected": float(category.subtotal_projected or 0),
                        "actual": float(category.subtotal_actual or 0),
                        "variance": float(category.subtotal_variance or 0),
                        "currentPaid": float(category.subtotal_current_paid or 0),
                        "amountDue": float(category.subtotal_amount_due or 0)
                    },
                    "items": []
                }
                
                # Add items to category
                for item in category_items:
                    item_data = {
                        "id": item.name,
                        "lineId": item.line_id,
                        "name": item.item_name,
                        "party": item.party_responsible,
                        "status": item.status,
                        "percentComplete": float(item._complete or 0),
                        "projected": float(item.projected_amount or 0),
                        "actual": float(item.actual_amount or 0),
                        "currentPaid": float(item.current_paid or 0),
                        "variance": float(item.variance or 0),
                        "amountDue": float(item.amount_due or 0),
                        "comments": item.comments
                    }
                    category_data["items"].append(item_data)
                
                estimator_data["categories"].append(category_data)
            
            result_list.append(estimator_data)
        
        
        return {
            "success": True,
            "data": result_list
        }

    except Exception as err:
        frappe.logger().error(f"Error fetching contractor estimator data: {str(err)}")
        return {
            "success": False,
            "error": str(err)
        }

@frappe.whitelist()
def save_contractor_estimator_data(data, project_name=None):
    """
    Save contractor estimator data using flattened model:
    - Categories are children of Contractor Estimator
    - Items are children of Contractor Estimator, linked to categories via category field
    """
    try:
        if isinstance(data, str):
            data = json.loads(data)

        results = []

        for estimator_data in data:
            try:
                estimator_id = estimator_data.get("id")
                project = estimator_data.get("project", "")
                categories = estimator_data.get("categories", []) or []

                final_project_name = project or project_name

                # Find or create estimator
                if estimator_id and frappe.db.exists("Contractor Estimator", estimator_id):
                    estimator_doc = frappe.get_doc("Contractor Estimator", estimator_id)
                    estimator_doc.project = final_project_name
                else:
                    estimator_doc = frappe.new_doc("Contractor Estimator")
                    estimator_doc.project = final_project_name

                # Clear old data
                estimator_doc.set("categories", [])
                estimator_doc.set("items", [])

                # Running totals for the estimator
                total_projected = 0.0
                total_actual = 0.0
                total_variance = 0.0
                total_current_paid = 0.0
                total_amount_due = 0.0

                # First, add all categories and save to get their row names
                category_map = {}
                
                for category_data in categories:
                    category_name = category_data.get("name", "") or ""
                    category_order = category_data.get("order", 0) or 0
                    items = category_data.get("items", []) or []

                    # Calculate category totals
                    c_proj = c_act = c_var = c_paid = c_due = 0.0
                    for item_data in items:
                        projected_amount = float(item_data.get("projected") or 0)
                        actual_amount = float(item_data.get("actual") or 0)
                        current_paid = float(item_data.get("currentPaid") or 0)
                        variance = actual_amount - projected_amount
                        amount_due = actual_amount - current_paid

                        c_proj += projected_amount
                        c_act += actual_amount
                        c_var += variance
                        c_paid += current_paid
                        c_due += amount_due

                    # Add category to estimator
                    category_row = estimator_doc.append("categories", {
                        "doctype": "Contractor Estimator Category",
                        "category_name": category_name,
                        "order": category_order,
                        "subtotal_projected": c_proj,
                        "subtotal_actual": c_act,
                        "subtotal_variance": c_var,
                        "subtotal_current_paid": c_paid,
                        "subtotal_amount_due": c_due,
                    })

                    # Add to estimator totals
                    total_projected += c_proj
                    total_actual += c_act
                    total_variance += c_var
                    total_current_paid += c_paid
                    total_amount_due += c_due

                # Set estimator totals
                estimator_doc.total_projected = total_projected
                estimator_doc.total_actual = total_actual
                estimator_doc.total_variance = total_variance
                estimator_doc.total_current_paid = total_current_paid
                estimator_doc.total_amount_due = total_amount_due

                # Save categories first to get their row names
                if estimator_id and frappe.db.exists("Contractor Estimator", estimator_id):
                    estimator_doc.save(ignore_permissions=True)
                else:
                    estimator_doc.insert(ignore_permissions=True)
                
                # Commit the transaction
                frappe.db.commit()
                
                # Reload to get the actual category row names
                estimator_doc.reload()
                
                # Build category name to row name mapping
                for category in estimator_doc.categories:
                    category_map[category.category_name] = category.name
                
                # Now add items with proper category references
                for category_data in categories:
                    category_name = category_data.get("name", "") or ""
                    items = category_data.get("items", []) or []
                    
                    for item_data in items:
                        projected_amount = float(item_data.get("projected") or 0)
                        actual_amount = float(item_data.get("actual") or 0)
                        current_paid = float(item_data.get("currentPaid") or 0)
                        variance = actual_amount - projected_amount
                        amount_due = actual_amount - current_paid

                        estimator_doc.append("items", {
                            "doctype": "Contractor Estimator Item",
                            "line_id": item_data.get("lineId") or "",
                            "item_name": item_data.get("name") or "",
                            "party_responsible": item_data.get("party") or "",
                            "status": item_data.get("status") or "Not Started",
                            "_complete": float(item_data.get("percentComplete") or 0),
                            "projected_amount": projected_amount,
                            "actual_amount": actual_amount,
                            "current_paid": current_paid,
                            "variance": variance,
                            "amount_due": amount_due,
                            "comments": item_data.get("comments") or "",
                            "category": category_map[category_name],  # Use actual category row name
                        })
                
                # Save items
                estimator_doc.save(ignore_permissions=True)
                frappe.db.commit()
                

                results.append({
                    "action": "updated" if estimator_id else "created",
                    "name": estimator_doc.name,
                    "type": "contractor_estimator"
                })

            except Exception as e:
                frappe.logger().error(f"Error processing estimator {estimator_data}: {frappe.get_traceback()}")
                raise
        return {
            "success": True,
            "results": results,
            "message": "Contractor estimator data saved successfully",
            "saved_data": data
        }

    except Exception as e:
        frappe.db.rollback()
        frappe.logger().error(f"Error saving contractor estimator data: {frappe.get_traceback()}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_contractor_estimator(estimator_data):
    """Create a new contractor estimator"""
    try:
        if isinstance(estimator_data, str):
            estimator_data = json.loads(estimator_data)

        project = estimator_data.get("project", "")

        # Create new estimator
        estimator_doc = frappe.get_doc({
            "doctype": "Contractor Estimator",
            "project": project,
            "categories": []
        })
        estimator_doc.insert()
        frappe.db.commit()

        return {
            "success": True,
            "name": estimator_doc.name,
            "message": "Contractor estimator created successfully"
        }

    except Exception as e:
        frappe.logger().error(f"Error creating contractor estimator: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def delete_contractor_estimator(estimator_id):
    """Delete a contractor estimator"""
    try:
        if not estimator_id:
            return {
                "success": False,
                "error": "Estimator ID is required"
            }

        # Check if estimator exists
        if not frappe.db.exists("Contractor Estimator", estimator_id):
            return {
                "success": False,
                "error": "Estimator not found"
            }

        # Delete the estimator (this will cascade delete categories and items)
        frappe.delete_doc("Contractor Estimator", estimator_id)
        frappe.db.commit()

        return {
            "success": True,
            "message": "Estimator deleted successfully"
        }

    except Exception as e:
        frappe.logger().error(f"Error deleting contractor estimator: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist(allow_guest=True)
def get_contractor_estimator_summary(project_name=None):
    """Get summary statistics for contractor estimator"""
    try:
        # Get basic estimator count
        if project_name:
            estimator_count = frappe.db.count("Contractor Estimator", {"project": project_name})
        else:
            estimator_count = frappe.db.count("Contractor Estimator")

        # Get total amounts
        query = """
            SELECT 
                SUM(total_projected) as total_projected,
                SUM(total_actual) as total_actual,
                SUM(total_variance) as total_variance,
                SUM(total_current_paid) as total_current_paid,
                SUM(total_amount_due) as total_amount_due
            FROM `tabContractor Estimator`
        """
        
        if project_name:
            query += " WHERE project = %s"
            result = frappe.db.sql(query, (project_name,), as_dict=True)[0]
        else:
            result = frappe.db.sql(query, as_dict=True)[0]

        # Get category and item counts
        category_query = """
            SELECT COUNT(*) as category_count
            FROM `tabContractor Estimator Category` c
            INNER JOIN `tabContractor Estimator` e ON c.parent = e.name
        """
        
        item_query = """
            SELECT COUNT(*) as item_count
            FROM `tabContractor Estimator Item` i
            INNER JOIN `tabContractor Estimator Category` c ON i.parent = c.name
            INNER JOIN `tabContractor Estimator` e ON c.parent = e.name
        """
        
        if project_name:
            category_query += " WHERE e.project = %s"
            item_query += " WHERE e.project = %s"
            category_result = frappe.db.sql(category_query, (project_name,), as_dict=True)[0]
            item_result = frappe.db.sql(item_query, (project_name,), as_dict=True)[0]
        else:
            category_result = frappe.db.sql(category_query, as_dict=True)[0]
            item_result = frappe.db.sql(item_query, as_dict=True)[0]

        return {
            "success": True,
            "data": {
                "estimator_count": estimator_count,
                "category_count": category_result.get("category_count", 0),
                "item_count": item_result.get("item_count", 0),
                "total_projected": float(result.get("total_projected") or 0),
                "total_actual": float(result.get("total_actual") or 0),
                "total_variance": float(result.get("total_variance") or 0),
                "total_current_paid": float(result.get("total_current_paid") or 0),
                "total_amount_due": float(result.get("total_amount_due") or 0)
            }
        }

    except Exception as e:
        frappe.logger().error(f"Error getting contractor estimator summary: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
