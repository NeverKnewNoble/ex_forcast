import frappe
import json

@frappe.whitelist(allow_guest=True)
def create_room_revenue_document(year, month, room_revenue_assumptions, project=None):
    try:
        # Parse room revenue assumptions if sent as JSON string
        if isinstance(room_revenue_assumptions, str):
            room_revenue_assumptions = json.loads(room_revenue_assumptions)

        doc = frappe.new_doc("Room Revenue Assumptions")
        doc.year = year
        doc.month = month
        doc.project = project  # Add project field
        doc.room_revenue_assumptions = room_revenue_assumptions
        doc.insert()
        frappe.db.commit()
        return {"status": "success", "docname": doc.name}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_document failed")
        return {"status": "error", "message": str(e)}
    
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.create_room_revenue_assumpt.create_room_revenue_document
