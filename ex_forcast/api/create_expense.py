import frappe
import json

@frappe.whitelist(allow_guest=True)
def create_document(year, month, expenses, project=None):
    try:
        # Parse expenses if sent as JSON string
        if isinstance(expenses, str):
            expenses = json.loads(expenses)

        doc = frappe.new_doc("Expense Assumptions")
        doc.year = year
        doc.month = month
        doc.project = project  # Add project field

        for item in expenses:
            doc.append("expense_items", item)

        doc.insert()
        frappe.db.commit()
        
        return {"status": "success", "docname": doc.name}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_document failed")
        return {"status": "error", "message": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.create_expense.create_document