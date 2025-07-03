import frappe


@frappe.whitelist(allow_guest=True)
def get_room_market_segments():
    try:
        segments = frappe.db.get_list("Room Market Segment", fields=["market_segment", "segment_category"])
        return {"success": True, "data": segments}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_room_market_segments API failed")
        return {
            "success": False,
            "error": str(e),
            "data": []
        }
    

@frappe.whitelist(allow_guest=True)
def get_segment_categories():
    try:
        categories = frappe.db.get_list("Segment Category", fields=["category_name"])
        return {"success": True, "data": categories}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_segment_categories API failed")
        return {
            "success": False,
            "error": str(e),
            "data": []
        }
    
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_segment_display.get_room_market_segments
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.room_segment_display.get_segment_categories
