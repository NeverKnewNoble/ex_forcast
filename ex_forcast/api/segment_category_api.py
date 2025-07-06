import frappe
from frappe import _

@frappe.whitelist()
def create_segment_category(category_name):
    """
    Create a new Segment Category document
    
    Args:
        category_name (str): Name of the category to create
        
    Returns:
        dict: Success/error message
    """
    try:
        # Validate input
        if not category_name or not category_name.strip():
            return {
                "message": {
                    "success": False,
                    "error": "Category name is required"
                }
            }
        
        category_name = category_name.strip().upper()
        
        # Check if category already exists
        existing_category = frappe.db.exists("Segment Category", {"category_name": category_name})
        if existing_category:
            return {
                "message": {
                    "success": False,
                    "error": f"Category '{category_name}' already exists"
                }
            }
        
        # Create new Segment Category document
        new_category = frappe.get_doc({
            "doctype": "Segment Category",
            "category_name": category_name
        })
        
        new_category.insert()
        
        return {
            "message": {
                "success": True,
                "message": f"Category '{category_name}' created successfully",
                "docname": new_category.name
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error creating segment category: {str(e)}", "Segment Category Creation Error")
        return {
            "message": {
                "success": False,
                "error": f"Failed to create category: {str(e)}"
            }
        }

@frappe.whitelist()
def get_segment_categories():
    """
    Get all Segment Category documents
    
    Returns:
        dict: List of segment categories
    """
    try:
        categories = frappe.get_all(
            "Segment Category",
            fields=["name", "category_name", "creation", "modified"],
            order_by="category_name"
        )
        
        return {
            "message": {
                "success": True,
                "data": categories
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching segment categories: {str(e)}", "Segment Category Fetch Error")
        return {
            "message": {
                "success": False,
                "error": f"Failed to fetch categories: {str(e)}"
            }
        }

@frappe.whitelist()
def get_default_segment_categories():
    """
    Get Segment Category documents with module = "Ex Forcast"
    
    Returns:
        dict: List of default segment categories
    """
    try:
        categories = frappe.get_all(
            "Segment Category",
            filters={"module": "Ex Forcast"},
            fields=["name", "category_name", "creation", "modified"],
            order_by="category_name"
        )
        
        return {
            "message": {
                "success": True,
                "data": categories
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching default segment categories: {str(e)}", "Default Segment Category Fetch Error")
        return {
            "message": {
                "success": False,
                "error": f"Failed to fetch default categories: {str(e)}"
            }
        }

@frappe.whitelist()
def delete_segment_category(category_name):
    """
    Delete a Segment Category document
    
    Args:
        category_name (str): Name of the category to delete
        
    Returns:
        dict: Success/error message
    """
    try:
        # Find the document by category_name
        category_name_filter = frappe.db.get_value("Segment Category", {"category_name": category_name}, "name")
        
        if not category_name_filter:
            return {
                "message": {
                    "success": False,
                    "error": f"Category '{category_name}' not found"
                }
            }
        
        # Get the document and delete it
        category_doc = frappe.get_doc("Segment Category", category_name_filter)
        category_doc.delete()
        
        return {
            "message": {
                "success": True,
                "message": f"Category '{category_name}' deleted successfully"
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error deleting segment category: {str(e)}", "Segment Category Deletion Error")
        return {
            "message": {
                "success": False,
                "error": f"Failed to delete category: {str(e)}"
            }
        }

# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.segment_category_api.create_segment_category
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.segment_category_api.get_segment_categories
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.segment_category_api.delete_segment_category








