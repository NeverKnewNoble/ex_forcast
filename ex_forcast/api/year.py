import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)  # Capitalize True
def get_year_options():
    meta = frappe.get_meta("Expense Assumptions")
    year_field = next((df for df in meta.fields if df.fieldname == "year"), None)

    if not year_field or year_field.fieldtype != "Select":
        frappe.throw(_("Field 'year' not found or is not a Select field"))

    options = year_field.options.split("\n") if year_field.options else []
    return {"options": options}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.year.get_year_options