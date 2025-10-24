import frappe
from collections import defaultdict
import json
from datetime import datetime


# ! Test Connection
@frappe.whitelist(allow_guest=True)
def test_connection():
    """Test endpoint to verify Contractor Estimator API is working"""
    return {
        "success": True,
        "message": "Contractor Estimator API is working",
        "timestamp": frappe.utils.now()
    }


# ! Get Contractor Estimator Data
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
                    # Get the actual item name from the Item doctype
                    actual_item_name = frappe.db.get_value("Item", item.item_name, "item_name") if item.item_name else ""
                    
                    item_data = {
                        "id": item.name,
                        "lineId": item.line_id,
                        "name": actual_item_name,  # Use actual item name, not document name
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


# ! Save Contractor Estimator Data
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

        # # Debug: Print the incoming data structure
        # print(f"DEBUG - Incoming data type: {type(data)}")
        # print(f"DEBUG - Incoming data: {data}")
        
        # Validate data structure
        if not isinstance(data, list):
            return {
                "success": False,
                "error": "Data must be a list of estimators"
            }

        results = []

        for estimator_data in data:
            try:
                # Debug: Print estimator data
                # print(f"DEBUG - Processing estimator: {estimator_data}")
                
                # Validate estimator data structure
                if not isinstance(estimator_data, dict):
                    # print(f"ERROR - Estimator data is not a dictionary: {type(estimator_data)}")
                    continue
                
                estimator_id = estimator_data.get("id")
                project = estimator_data.get("project", "")
                categories = estimator_data.get("categories", []) or []

                # Validate categories structure
                if not isinstance(categories, list):
                    # print(f"ERROR - Categories is not a list: {type(categories)}")
                    continue

                final_project_name = project or project_name

                # Find or create estimator
                if estimator_id and frappe.db.exists("Contractor Estimator", estimator_id):
                    # print(f"DEBUG - Loading existing estimator: {estimator_id}")
                    estimator_doc = frappe.get_doc("Contractor Estimator", estimator_id)
                    estimator_doc.project = final_project_name
                    # print(f"DEBUG - Loaded existing estimator doc: {estimator_doc.name}")
                else:
                    print(f"DEBUG - Creating new estimator")
                    estimator_doc = frappe.new_doc("Contractor Estimator")
                    estimator_doc.project = final_project_name
                    print(f"DEBUG - Created new estimator doc")
                
                # Clear existing categories and items
                estimator_doc.set("categories", [])
                # print(f"DEBUG - Cleared existing categories")
                
                # Debug: Print what we're about to save
                # print(f"DEBUG - About to save estimator with {len(categories)} categories")
                for i, cat in enumerate(categories):
                    print(f"DEBUG - Category {i}: '{cat.get('name')}' with {len(cat.get('items', []))} items")

                # Running totals for the estimator
                total_projected = 0.0
                total_actual = 0.0
                total_variance = 0.0
                total_current_paid = 0.0
                total_amount_due = 0.0

                # First, add all categories with their items directly
                category_map = {}
                
                for category_data in categories:
                    # Debug: Print category data
                    # print(f"DEBUG - Processing category: {category_data}")
                    
                    # Validate category data structure
                    if not isinstance(category_data, dict):
                        print(f"ERROR - Category data is not a dictionary: {type(category_data)}")
                        continue
                    
                    category_name = category_data.get("name", "") or ""
                    category_order = category_data.get("order", 0) or 0
                    items = category_data.get("items", []) or []
                    
                    # Validate items structure
                    if not isinstance(items, list):
                        print(f"ERROR - Items is not a list for category '{category_name}': {type(items)}")
                        continue

                    # Debug: Print items data
                    print(f"DEBUG - Category '{category_name}' has {len(items)} items")

                    # Calculate category totals
                    c_proj = c_act = c_var = c_paid = c_due = 0.0
                    for item_data in items:
                        # Debug: Print item data
                        print(f"DEBUG - Processing item: {item_data}")
                        print(f"DEBUG - Item lineId: {item_data.get('lineId')} (type: {type(item_data.get('lineId'))})")
                        
                        # Validate item data structure
                        if not isinstance(item_data, dict):
                            print(f"ERROR - Item data is not a dictionary: {type(item_data)}")
                            continue
                        
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
                    try:
                        print(f"DEBUG - About to append category '{category_name}' to estimator")
                        print(f"DEBUG - Estimator doc type: {type(estimator_doc)}")
                        print(f"DEBUG - Estimator doc has categories field: {hasattr(estimator_doc, 'categories')}")
                        
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
                        # print(f"DEBUG - Successfully added category: {category_name}")
                        # print(f"DEBUG - Category row type: {type(category_row)}")
                        # print(f"DEBUG - Category row has items field: {hasattr(category_row, 'items')}")
                    except Exception as cat_error:
                        # print(f"ERROR - Failed to add category '{category_name}': {cat_error}")
                        # print(f"ERROR - Category error type: {type(cat_error)}")
                        # print(f"ERROR - Category error details: {str(cat_error)}")
                        raise cat_error

                    # Store category reference for items (we'll add items after all categories are created)
                    category_map[category_name] = category_row

                    # Add to estimator totals
                    total_projected += c_proj
                    total_actual += c_act
                    total_variance += c_var
                    total_current_paid += c_paid
                    total_amount_due += c_due

                # Save the estimator first to get category row names
                # print(f"DEBUG - Saving estimator with categories first to get row names")
                try:
                    if estimator_id and frappe.db.exists("Contractor Estimator", estimator_id):
                        estimator_doc.save(ignore_permissions=True)
                    else:
                        estimator_doc.insert(ignore_permissions=True)
                    frappe.db.commit()
                    # print(f"DEBUG - Successfully saved estimator with categories")
                except Exception as save_error:
                    # print(f"ERROR - Failed to save estimator with categories: {save_error}")
                    raise save_error

                # Reload the estimator to get the category row names
                estimator_doc = frappe.get_doc("Contractor Estimator", estimator_doc.name)
                # print(f"DEBUG - Reloaded estimator, categories: {[(cat.name, cat.category_name) for cat in estimator_doc.categories]}")

                # Now add all items directly to the estimator, linked to their categories
                # print(f"DEBUG - About to add items to estimator")
                for category_data in categories:
                    category_name = category_data.get("name", "") or ""
                    items = category_data.get("items", []) or []
                    
                    # Find the category row by name
                    category_row = None
                    for cat in estimator_doc.categories:
                        if cat.category_name == category_name:
                            category_row = cat
                            break
                    
                    if not category_row:
                        # print(f"ERROR - Category '{category_name}' not found in saved estimator")
                        continue
                    
                    for item_data in items:
                        try:
                            # Validate item data structure
                            if not isinstance(item_data, dict):
                                # print(f"ERROR - Item data is not a dictionary: {type(item_data)}")
                                continue
                            
                            projected_amount = float(item_data.get("projected") or 0)
                            actual_amount = float(item_data.get("actual") or 0)
                            current_paid = float(item_data.get("currentPaid") or 0)
                            variance = actual_amount - projected_amount
                            amount_due = actual_amount - current_paid

                            # Generate a line_id if it's null or empty
                            line_id = item_data.get("lineId")
                            if not line_id or line_id == "null" or line_id == "" or line_id is None:
                                # Generate a formatted line ID like "01.01" instead of random UUID
                                category_order = category_data.get("order", 1)
                                item_index = items.index(item_data) + 1
                                line_id = f"{category_order:02d}.{item_index:02d}"

                            # Get the Item document name (item_name is a Link field)
                            item_name_string = item_data.get("name") or ""
                            item_doc_name = frappe.db.get_value("Item", {"item_name": item_name_string}, "name")
                            
                            if not item_doc_name:
                                # print(f"ERROR - Item '{item_name_string}' not found in Item doctype")
                                continue
                            
                            # print(f"DEBUG - About to append item '{item_name_string}' (doc: {item_doc_name}) to estimator")
                            # print(f"DEBUG - Linking item '{item_name_string}' to category '{category_name}' -> '{category_row.name}'")
                            
                            # Add item directly to estimator with category reference
                            estimator_doc.append("items", {
                                "doctype": "Contractor Estimator Item",
                                "line_id": line_id,
                                "item_name": item_doc_name,  # Use Item document name, not string
                                "party_responsible": item_data.get("party") or "",
                                "status": item_data.get("status") or "Not Started",
                                "_complete": float(item_data.get("percentComplete") or 0),
                                "projected_amount": projected_amount,
                                "actual_amount": actual_amount,
                                "current_paid": current_paid,
                                "variance": variance,
                                "amount_due": amount_due,
                                "comments": item_data.get("comments") or "",
                                "category": category_row.name,  # Link to category by document name
                            })
                            # print(f"DEBUG - Successfully added item: {item_data.get('name')}")
                        except Exception as item_error:
                            # print(f"ERROR - Failed to add item '{item_data.get('name')}': {item_error}")
                            # print(f"ERROR - Item data: {item_data}")
                            raise item_error

                # Set estimator totals
                estimator_doc.total_projected = total_projected
                estimator_doc.total_actual = total_actual
                estimator_doc.total_variance = total_variance
                estimator_doc.total_current_paid = total_current_paid
                estimator_doc.total_amount_due = total_amount_due

                # Save the complete estimator with items
                try:
                    estimator_doc.save(ignore_permissions=True)
                    frappe.db.commit()
                    print(f"DEBUG - Successfully saved estimator with {len(estimator_doc.categories)} categories and {len(estimator_doc.items)} items")
                    
                except Exception as save_error:
                    # print(f"ERROR - Failed to save estimator with items: {save_error}")
                    # print(f"ERROR - Estimator doc categories: {[cat.category_name for cat in estimator_doc.categories]}")
                    # print(f"ERROR - Total items: {len(estimator_doc.items)}")
                    raise save_error
                

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


# ! Create Contractor Estimator
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


# ! Delete Contractor Estimator
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


# ! Get Summary of Contractor Estimator
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


# ! Get Items From Item Doctype
@frappe.whitelist()
def get_items_by_order_of_category():
    """Get items from Item doctype grouped by item_group"""
    try:
        
        query = """
            SELECT 
                name,
                item_name, 
                item_group,
                stock_uom,
                valuation_rate
            FROM 
                `tabItem`
            WHERE
                COALESCE(custom_module, '') = 'Ex Forcast'
            ORDER BY `tabItem`.item_group ASC, `tabItem`.item_name ASC
        """
        items = frappe.db.sql(query, as_dict=True)

        # Group items by item_group
        grouped_items = {}
        for item in items:
            item_group = item.get("item_group", "Uncategorized")
            if item_group not in grouped_items:
                grouped_items[item_group] = []
            # Include unit and rate in response for frontend consumption
            grouped_items[item_group].append({
                "name": item.get("name"),
                "item_name": item.get("item_name", ""),
                "stock_uom": item.get("stock_uom"),
                "valuation_rate": float(item.get("valuation_rate") or 0)
            })

        return {
            "success": True,
            "data": grouped_items
        }
    
    except Exception as e:
        frappe.logger().error(f"Error getting items by order of item_group: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist(allow_guest=True)
def get_item_groups():
    """Get all existing Item Groups"""
    try:
        query = """
            SELECT 
                name,
                item_group_name,
                parent_item_group,
                is_group
            FROM 
                `tabItem Group`
            WHERE 
                is_group = 0
                AND COALESCE(custom_module, '') = 'Ex Forcast'
            ORDER BY 
                item_group_name ASC
        """
        item_groups = frappe.db.sql(query, as_dict=True)
        
        return {
            "success": True,
            "data": item_groups
        }
        
    except Exception as e:
        frappe.logger().error(f"Error getting Item Groups: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_item_group(item_group_name):
    """Create a new Item Group doctype document"""
    try:
        if not item_group_name or not item_group_name.strip():
            return {
                "success": False,
                "error": "Item Group name is required"
            }
        
        item_group_name = item_group_name.strip()
        
        # Check if Item Group already exists
        if frappe.db.exists("Item Group", item_group_name):
            return {
                "success": False,
                "error": f"Item Group '{item_group_name}' already exists"
            }
        
        # Create new Item Group document
        item_group_doc = frappe.new_doc("Item Group")
        item_group_doc.item_group_name = item_group_name
        item_group_doc.parent_item_group = "All Item Groups"  # Default parent
        item_group_doc.is_group = 0  # This is a leaf node, not a group
        item_group_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        
        return {
            "success": True,
            "message": f"Item Group '{item_group_name}' created successfully",
            "data": {
                "name": item_group_doc.name,
                "item_group_name": item_group_doc.item_group_name
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error creating Item Group: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def create_item(item_name, item_group):
    """Create a new Item doctype document"""
    try:
        if not item_name or not item_name.strip():
            return {
                "success": False,
                "error": "Item name is required"
            }
        
        if not item_group or not item_group.strip():
            return {
                "success": False,
                "error": "Item group is required"
            }
        
        item_name = item_name.strip()
        item_group = item_group.strip()
        
        # Check if Item already exists by item_name
        existing_item = frappe.db.get_value("Item", {"item_name": item_name}, "name")
        if existing_item:
            # Item already exists, return success with existing item info
            existing_doc = frappe.get_doc("Item", existing_item)
            return {
                "success": True,
                "message": f"Item '{item_name}' already exists",
                "data": {
                    "name": existing_doc.name,
                    "item_code": existing_doc.item_code,
                    "item_name": existing_doc.item_name,
                    "item_group": existing_doc.item_group
                }
            }
        
        # Generate item_code (use item_name as base, make it unique)
        item_code = item_name.replace(" ", "_").replace("-", "_").upper()
        
        # Ensure item_code is unique
        counter = 1
        original_item_code = item_code
        while frappe.db.exists("Item", item_code):
            item_code = f"{original_item_code}_{counter}"
            counter += 1
        
        # Create new Item document
        item_doc = frappe.new_doc("Item")
        item_doc.item_code = item_code
        item_doc.item_name = item_name
        item_doc.item_group = item_group
        item_doc.is_stock_item = 0  # Default to non-stock item
        item_doc.is_sales_item = 1  # Default to sales item
        item_doc.is_purchase_item = 1  # Default to purchase item
        item_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        
        return {
            "success": True,
            "message": f"Item '{item_name}' created successfully",
            "data": {
                "name": item_doc.name,
                "item_code": item_doc.item_code,
                "item_name": item_doc.item_name,
                "item_group": item_doc.item_group
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error creating Item: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def delete_contractor_estimator_item(estimator_id, item_line_id):
    """Delete a Contractor Estimator Item by line_id from a specific estimator"""
    try:
        if not estimator_id or not estimator_id.strip():
            return {
                "success": False,
                "error": "Estimator ID is required"
            }
        
        if not item_line_id or not item_line_id.strip():
            return {
                "success": False,
                "error": "Item line ID is required"
            }
        
        estimator_id = estimator_id.strip()
        item_line_id = item_line_id.strip()
        
        # Check if estimator exists
        if not frappe.db.exists("Contractor Estimator", estimator_id):
            return {
                "success": False,
                "error": f"Contractor Estimator '{estimator_id}' not found"
            }
        
        # Get the estimator document
        estimator_doc = frappe.get_doc("Contractor Estimator", estimator_id)
        
        # Find the item in the estimator's items
        item_found = False
        item_name = ""
        
        for item in estimator_doc.items:
            if item.line_id == item_line_id:
                item_name = item.item_name
                # Remove the item from the estimator
                estimator_doc.remove(item)
                item_found = True
                break
        
        if not item_found:
            return {
                "success": False,
                "error": f"Item with line ID '{item_line_id}' not found in estimator"
            }
        
        # Recalculate category totals
        for category in estimator_doc.categories:
            c_proj = c_act = c_var = c_paid = c_due = 0.0
            # Get items for this category from the estimator's items
            category_items = [item for item in estimator_doc.items if item.category == category.name]
            for item in category_items:
                c_proj += float(item.projected_amount or 0)
                c_act += float(item.actual_amount or 0)
                c_paid += float(item.current_paid or 0)
                c_var += float(item.variance or 0)
                c_due += float(item.amount_due or 0)
            
            category.subtotal_projected = c_proj
            category.subtotal_actual = c_act
            category.subtotal_variance = c_var
            category.subtotal_current_paid = c_paid
            category.subtotal_amount_due = c_due
        
        # Recalculate estimator totals
        total_projected = total_actual = total_variance = total_current_paid = total_amount_due = 0.0
        for category in estimator_doc.categories:
            total_projected += float(category.subtotal_projected or 0)
            total_actual += float(category.subtotal_actual or 0)
            total_variance += float(category.subtotal_variance or 0)
            total_current_paid += float(category.subtotal_current_paid or 0)
            total_amount_due += float(category.subtotal_amount_due or 0)
        
        estimator_doc.total_projected = total_projected
        estimator_doc.total_actual = total_actual
        estimator_doc.total_variance = total_variance
        estimator_doc.total_current_paid = total_current_paid
        estimator_doc.total_amount_due = total_amount_due
        
        # Save the updated estimator
        estimator_doc.save(ignore_permissions=True)
        frappe.db.commit()
        
        return {
            "success": True,
            "message": f"Item '{item_name}' deleted successfully from estimator"
        }
        
    except Exception as e:
        frappe.logger().error(f"Error deleting Contractor Estimator Item: {str(e)}")
        frappe.db.rollback()
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def get_general_account_balances(company=None, from_date=None, to_date=None):
    """
    Get general account balances for the company (fallback approach when item-specific GL is not available)
    
    Args:
        company (str): Company name (optional - uses default company if not provided)
        from_date (str): Start date for GL entries (YYYY-MM-DD)
        to_date (str): End date for GL entries (YYYY-MM-DD)
    
    Returns:
        dict: General account balances
    """
    try:
        # Get default company if not provided
        if not company:
            company = frappe.defaults.get_user_default("Company")
            if not company:
                company = frappe.db.get_default("company")
        
        # Validate company exists
        if not frappe.db.exists("Company", company):
            return {
                "success": False,
                "error": f"Company '{company}' not found"
            }
        
        # Build conditions for GL Entry query
        conditions = ["gle.company = %s"]
        params = [company]
        
        if from_date:
            conditions.append("gle.posting_date >= %s")
            params.append(from_date)
        
        if to_date:
            conditions.append("gle.posting_date <= %s")
            params.append(to_date)
        
        where_clause = "WHERE " + " AND ".join(conditions)
        
        # Query to get GL entries for the company
        sql_query = f"""
            SELECT 
                gle.account,
                acc.account_name,
                acc.account_type,
                acc.company,
                acc.parent_account,
                acc.is_group,
                SUM(gle.debit) as total_debit,
                SUM(gle.credit) as total_credit,
                SUM(gle.debit) - SUM(gle.credit) as net_amount
            FROM `tabGL Entry` gle
            INNER JOIN `tabAccount` acc ON gle.account = acc.name
            {where_clause}
            GROUP BY gle.account, acc.account_name, acc.account_type, acc.company, 
                     acc.parent_account, acc.is_group
            HAVING (SUM(gle.debit) != 0 OR SUM(gle.credit) != 0)
            ORDER BY acc.account_type, acc.account_name
        """
        
        gl_entries = frappe.db.sql(sql_query, params, as_dict=True)
        
        # Debug logging for general account balances
        frappe.logger().info(f"General GL query returned {len(gl_entries)} entries for company '{company}'")
        if gl_entries:
            for entry in gl_entries[:3]:  # Log first 3 entries
                total_activity = (entry.total_debit or 0) + (entry.total_credit or 0)
                net_balance = (entry.total_debit or 0) - (entry.total_credit or 0)
                balance_amount = abs(net_balance)
                frappe.logger().info(f"Found account: {entry.account_name}")
                frappe.logger().info(f"  - Total Debit: {entry.total_debit or 0}")
                frappe.logger().info(f"  - Total Credit: {entry.total_credit or 0}")
                frappe.logger().info(f"  - Total Activity (Debit + Credit): {total_activity}")
                frappe.logger().info(f"  - Net Balance (Debit - Credit): {net_balance}")
                frappe.logger().info(f"  - Using Balance Column for Actual Subtotal: {balance_amount}")
        
        if not gl_entries:
            return {
                "success": True,
                "data": {
                    "company": company,
                    "accounts": [],
                    "total_balance": 0,
                    "message": f"No GL entries found for company '{company}'"
                }
            }
        
        # Calculate balance amounts for each account (using Balance column values)
        accounts_data = []
        total_balance = 0
        
        for entry in gl_entries:
            # Calculate the balance amount (net amount from GL Entry)
            total_debit = entry.total_debit or 0
            total_credit = entry.total_credit or 0
            net_amount = entry.net_amount or 0  # This is the Balance column value
            balance_amount = abs(net_amount)  # Use absolute value for display
            
            # Determine if it's debit or credit balance
            if net_amount > 0:
                balance_type = "Debit"
            elif net_amount < 0:
                balance_type = "Credit"
            else:
                balance_type = "Balanced"
            
            account_data = {
                "account": entry.account,
                "account_name": entry.account_name,
                "account_type": entry.account_type,
                "company": entry.company,
                "parent_account": entry.parent_account,
                "is_group": entry.is_group,
                "total_debit": total_debit,
                "total_credit": total_credit,
                "net_amount": net_amount,  # Net balance (debit - credit)
                "balance_type": balance_type,
                "total_balance": balance_amount  # This is what goes in Actual Subtotal (Balance column)
            }
            
            accounts_data.append(account_data)
            total_balance += balance_amount
        
        return {
            "success": True,
            "data": {
                "company": company,
                "accounts": accounts_data,
                "total_balance": total_balance,
                "filters_applied": {
                    "from_date": from_date,
                    "to_date": to_date,
                    "company": company
                },
                "generated_at": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error getting general account balances: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def get_item_gl_balance(item_name, from_date=None, to_date=None, company=None):
    """
    Get General Ledger closing balance for an item by matching item name to account name
    
    Args:
        item_name (str): Item name (like "Assim")
        from_date (str): Start date for GL entries (YYYY-MM-DD)
        to_date (str): End date for GL entries (YYYY-MM-DD) 
        company (str): Company name (optional - uses default company if not provided)
    
    Returns:
        dict: GL closing balance data for the item
    """
    try:
        # Get default company if not provided
        if not company:
            company = frappe.defaults.get_user_default("Company")
            if not company:
                company = frappe.db.get_default("company")
        
        # Validate item exists
        if not frappe.db.exists("Item", item_name):
            return {
                "success": False,
                "error": f"Item '{item_name}' not found"
            }
        
        # Validate company exists
        if not frappe.db.exists("Company", company):
            return {
                "success": False,
                "error": f"Company '{company}' not found"
            }
        
        # Get item details
        item_doc = frappe.get_doc("Item", item_name)
        item_code = item_doc.item_code
        item_name_field = item_doc.item_name
        
        # Debug logging
        frappe.logger().info(f"Looking up GL balance for item: '{item_name}' (code: '{item_code}') in company: '{company}'")
        
        # Check if GL Entry table has item_code column
        try:
            # Test if item_code column exists
            test_query = "SELECT item_code FROM `tabGL Entry` LIMIT 1"
            frappe.db.sql(test_query)
            has_item_code = True
        except:
            has_item_code = False
        
        # Build conditions based on available columns
        if has_item_code:
            # Use item_code if available
            conditions = ["gle.item_code = %s", "gle.company = %s"]
            params = [item_code, company]
            
            select_fields = """
                gle.account,
                acc.account_name,
                acc.account_type,
                acc.company,
                acc.parent_account,
                acc.is_group,
                gle.item_code,
                gle.item_name,
                SUM(gle.debit) as total_debit,
                SUM(gle.credit) as total_credit,
                SUM(gle.debit) - SUM(gle.credit) as net_amount
            """
            
            group_by = """
                gle.account, acc.account_name, acc.account_type, acc.company, 
                acc.parent_account, acc.is_group, gle.item_code, gle.item_name
            """
        else:
            # Fallback: Use account-based approach for items
            # Find accounts that might be related to this item
            conditions = ["gle.company = %s"]
            params = [company]
            
            # Look for accounts that match the item name or code
            # Use ONLY exact or contains matching - NO broad account type matching
            item_related_conditions = [
                "acc.account_name = %s",  # Exact match first
                "acc.account_name LIKE %s",  # Contains item name
                "acc.account_name LIKE %s"  # Contains item code
            ]
            params.extend([
                item_name,  # Exact match
                f"%{item_name}%",  # Contains item name
                f"%{item_code}%"  # Contains item code
            ])
            
            conditions.append(f"({' OR '.join(item_related_conditions)})")
            
            select_fields = """
                gle.account,
                acc.account_name,
                acc.account_type,
                acc.company,
                acc.parent_account,
                acc.is_group,
                %s as item_code,
                %s as item_name,
                SUM(gle.debit) as total_debit,
                SUM(gle.credit) as total_credit,
                SUM(gle.debit) - SUM(gle.credit) as net_amount
            """ % (frappe.db.escape(item_code), frappe.db.escape(item_name))
            
            group_by = """
                gle.account, acc.account_name, acc.account_type, acc.company, 
                acc.parent_account, acc.is_group
            """
        
        if from_date:
            conditions.append("gle.posting_date >= %s")
            params.append(from_date)
        
        if to_date:
            conditions.append("gle.posting_date <= %s")
            params.append(to_date)
        
        where_clause = "WHERE " + " AND ".join(conditions)
        
        # Query to get GL entries for the item with account details
        sql_query = f"""
            SELECT 
                {select_fields}
            FROM `tabGL Entry` gle
            INNER JOIN `tabAccount` acc ON gle.account = acc.name
            {where_clause}
            GROUP BY {group_by}
            HAVING (SUM(gle.debit) != 0 OR SUM(gle.credit) != 0)
            ORDER BY acc.account_type, acc.account_name
        """
        
        gl_entries = frappe.db.sql(sql_query, params, as_dict=True)
        
        # Debug logging
        frappe.logger().info(f"GL query returned {len(gl_entries)} entries for item '{item_name}'")
        if gl_entries:
            for entry in gl_entries[:3]:  # Log first 3 entries
                total_activity = (entry.total_debit or 0) + (entry.total_credit or 0)
                net_balance = (entry.total_debit or 0) - (entry.total_credit or 0)
                balance_amount = abs(net_balance)
                frappe.logger().info(f"Found account: {entry.account_name}")
                frappe.logger().info(f"  - Total Debit: {entry.total_debit or 0}")
                frappe.logger().info(f"  - Total Credit: {entry.total_credit or 0}")
                frappe.logger().info(f"  - Total Activity (Debit + Credit): {total_activity}")
                frappe.logger().info(f"  - Net Balance (Debit - Credit): {net_balance}")
                frappe.logger().info(f"  - Using Balance Column for Actual Subtotal: {balance_amount}")
        
        if not gl_entries:
            return {
                "success": True,
                "data": {
                    "item_name": item_name,
                    "item_code": item_code,
                    "company": company,
                    "accounts": [],
                    "total_balance": 0,
                    "message": f"No GL entries found for item '{item_name}' in company '{company}'",
                    "method_used": "item_code" if has_item_code else "account_based"
                }
            }
        
        # Calculate balance amounts for each account (using Balance column values)
        accounts_data = []
        total_balance = 0
        
        for entry in gl_entries:
            # Calculate the balance amount (net amount from GL Entry)
            total_debit = entry.total_debit or 0
            total_credit = entry.total_credit or 0
            net_amount = entry.net_amount or 0  # This is the Balance column value
            balance_amount = abs(net_amount)  # Use absolute value for display
            
            # Determine if it's debit or credit balance
            if net_amount > 0:
                balance_type = "Debit"
            elif net_amount < 0:
                balance_type = "Credit"
            else:
                balance_type = "Balanced"
            
            account_data = {
                "account": entry.account,
                "account_name": entry.account_name,
                "account_type": entry.account_type,
                "company": entry.company,
                "parent_account": entry.parent_account,
                "is_group": entry.is_group,
                "item_code": entry.item_code,
                "item_name": entry.item_name,
                "total_debit": total_debit,
                "total_credit": total_credit,
                "net_amount": net_amount,  # Net balance (debit - credit)
                "balance_type": balance_type,
                "total_balance": balance_amount  # This is what goes in Actual Subtotal (Balance column)
            }
            
            accounts_data.append(account_data)
            total_balance += balance_amount
        
        return {
            "success": True,
            "data": {
                "item_name": item_name,
                "item_code": item_code,
                "company": company,
                "accounts": accounts_data,
                "total_balance": total_balance,
                "primary_account": accounts_data[0] if accounts_data else None,  # First account for display
                "method_used": "item_code" if has_item_code else "account_based",
                "filters_applied": {
                    "item_name": item_name,
                    "from_date": from_date,
                    "to_date": to_date,
                    "company": company
                },
                "generated_at": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error getting GL balance for item {item_name}: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }


@frappe.whitelist()
def get_default_company():
    """
    Get the default company for the current user/site
    
    Returns:
        dict: Default company information
    """
    try:
        # Try user default first, then system default
        user_company = frappe.defaults.get_user_default("Company")
        system_company = frappe.db.get_default("company")
        
        default_company = user_company or system_company
        
        if not default_company:
            return {
                "success": False,
                "error": "No default company found. Please set a default company in User Settings or System Defaults."
            }
        
        # Get company details
        company_doc = frappe.get_doc("Company", default_company)
        
        return {
            "success": True,
            "data": {
                "name": company_doc.name,
                "company_name": company_doc.company_name,
                "abbr": company_doc.abbr,
                "default_currency": company_doc.default_currency,
                "country": company_doc.country,
                "is_default": True
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error getting default company: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

@frappe.whitelist()
def debug_accounts(company=None, search_term=None):
    """
    Debug API to see what accounts exist in the system
    """
    try:
        if not company:
            company = frappe.db.get_default("Company")
        
        # Get all accounts for the company
        accounts = frappe.get_all(
            "Account",
            filters={"company": company, "is_group": 0},
            fields=["name", "account_name", "account_type", "parent_account"],
            order_by="account_name"
        )
        
        # Filter by search term if provided
        if search_term:
            search_lower = search_term.lower()
            accounts = [acc for acc in accounts if search_lower in acc.account_name.lower()]
        
        return {
            "success": True,
            "data": {
                "company": company,
                "search_term": search_term,
                "accounts": accounts,
                "count": len(accounts)
            }
        }
        
    except Exception as e:
        frappe.logger().error(f"Error debugging accounts: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
