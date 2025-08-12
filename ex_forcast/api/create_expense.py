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

        # Normalize and append each expense row to match child doctype schema
        # Incoming row keys expected from frontend: department, department_location, expense, costType, amount/amountDisplay
        for item in expenses:
            department = item.get("department")
            department_location = item.get("department_location")
            expense_name = item.get("expense")
            cost_type = item.get("costType") or item.get("cost_type")
            # Prefer numeric amount; fallback to display string cleaned by frontend
            amount = item.get("amount")
            if amount is None and item.get("amountDisplay") is not None:
                # try to parse amountDisplay
                try:
                    amount = float(str(item.get("amountDisplay")).replace(",", ""))
                except Exception:
                    amount = 0

            doc.append("expense_items", {
                "department": department,
                "department_location": department_location,
                "expense_name": expense_name,
                "cost_type": cost_type,
                "amount": amount or 0,
            })

        doc.insert()
        frappe.db.commit()
        
        return {"status": "success", "docname": doc.name}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_document failed")
        return {"status": "error", "message": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.create_expense.create_document