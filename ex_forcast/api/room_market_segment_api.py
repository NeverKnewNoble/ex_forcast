import frappe
from frappe import _

@frappe.whitelist()
def create_room_market_segment(market_segment, segment_category):
    """
    Create a new Room Market Segment document
    
    Args:
        market_segment (str): Name of the market segment
        segment_category (str): Category name for the segment
    
    Returns:
        dict: Success message with created document details
    """
    try:
        # Validate inputs
        if not market_segment or not segment_category:
            return {
                "message": {
                    "success": False,
                    "error": "Both market_segment and segment_category are required"
                }
            }
        
        market_segment = market_segment.strip()
        segment_category = segment_category.strip()
        
        # Check if segment already exists
        existing_segment = frappe.db.exists("Room Market Segment", {"market_segment": market_segment})
        if existing_segment:
            return {
                "message": {
                    "success": False,
                    "error": f"Market segment '{market_segment}' already exists"
                }
            }
        
        # Check if category exists
        existing_category = frappe.db.exists("Segment Category", {"category_name": segment_category})
        if not existing_category:
            return {
                "message": {
                    "success": False,
                    "error": f"Category '{segment_category}' does not exist"
                }
            }
        
        # Create new Room Market Segment document
        new_segment = frappe.get_doc({
            "doctype": "Room Market Segment",
            "market_segment": market_segment,
            "segment_category": segment_category
        })
        
        new_segment.insert()
        
        return {
            "message": {
                "success": True,
                "message": f"Room Market Segment '{market_segment}' created successfully",
                "data": {
                    "name": new_segment.name,
                    "market_segment": market_segment,
                    "segment_category": segment_category
                }
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error creating Room Market Segment: {str(e)}", "Room Market Segment Creation Error")
        return {
            "message": {
                "success": False,
                "error": f"Error creating Room Market Segment: {str(e)}"
            }
        }

@frappe.whitelist()
def get_room_market_segments():
    """
    Get all Room Market Segment documents
    
    Returns:
        dict: List of all room market segments with their details
    """
    try:
        segments = frappe.get_all(
            "Room Market Segment",
            fields=["name", "market_segment", "segment_category", "creation", "modified"],
            order_by="market_segment"
        )
        
        return {
            "message": {
                "success": True,
                "message": f"Retrieved {len(segments)} room market segments",
                "data": {
                    "room_market_segments": segments
                }
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching Room Market Segments: {str(e)}", "Room Market Segment Fetch Error")
        return {
            "message": {
                "success": False,
                "error": f"Error fetching Room Market Segments: {str(e)}"
            }
        }

@frappe.whitelist()
def get_default_room_market_segments():
    """
    Get Room Market Segment documents with module = "Ex Forcast"
    
    Returns:
        dict: List of default room market segments with their details
    """
    try:
        segments = frappe.get_all(
            "Room Market Segment",
            filters={"module": "Ex Forcast"},
            fields=["name", "market_segment", "segment_category", "creation", "modified"],
            order_by="market_segment"
        )
        
        return {
            "message": {
                "success": True,
                "message": f"Retrieved {len(segments)} default room market segments",
                "data": {
                    "room_market_segments": segments
                }
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error fetching default Room Market Segments: {str(e)}", "Default Room Market Segment Fetch Error")
        return {
            "message": {
                "success": False,
                "error": f"Error fetching default Room Market Segments: {str(e)}"
            }
        }

@frappe.whitelist()
def delete_room_market_segment(market_segment):
    """
    Delete a Room Market Segment document
    
    Args:
        market_segment (str): Name of the market segment to delete
    
    Returns:
        dict: Success message
    """
    try:
        # Validate input
        if not market_segment:
            return {
                "message": {
                    "success": False,
                    "error": "market_segment is required"
                }
            }
        
        # Check if segment exists
        existing_segment = frappe.db.exists("Room Market Segment", {"market_segment": market_segment})
        if not existing_segment:
            return {
                "message": {
                    "success": False,
                    "error": f"Market segment '{market_segment}' does not exist"
                }
            }
        
        # Get the document and delete it
        segment_doc = frappe.get_doc("Room Market Segment", {"market_segment": market_segment})
        segment_doc.delete()
        
        return {
            "message": {
                "success": True,
                "message": f"Room Market Segment '{market_segment}' deleted successfully"
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Error deleting Room Market Segment: {str(e)}", "Room Market Segment Deletion Error")
        return {
            "message": {
                "success": False,
                "error": f"Error deleting Room Market Segment: {str(e)}"
            }
        }

# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_market_segment_api.create_room_market_segment
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_market_segment_api.get_room_market_segments
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_market_segment_api.delete_room_market_segment 