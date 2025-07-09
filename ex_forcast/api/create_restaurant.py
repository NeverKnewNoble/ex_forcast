import frappe
import json

@frappe.whitelist(allow_guest=True)
def create_restaurant(cover_name):
    try:
        doc = frappe.new_doc("Restaurant")
        doc.cover_name = cover_name
        doc.insert()
        frappe.db.commit()
        return {"status": "success", "docname": doc.name}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_restaurant failed")
        return {"status": "error", "message": str(e)}

@frappe.whitelist(allow_guest=True)
def get_restaurants():
    try:
        restaurants = frappe.get_all("Restaurant", fields=["name", "cover_name"])
        # Return a list of dicts with name and cover_name
        return restaurants
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_restaurants failed")
        return []

#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.create_restaurant.create_restaurant 