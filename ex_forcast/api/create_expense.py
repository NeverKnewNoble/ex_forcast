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
                except (ValueError, TypeError):
                    amount = 0.0
            
            # Check if this is a default expense (you may need to implement logic to determine this)
            # For now, we'll assume all expenses from the modal are regular expenses
            is_default_expense = item.get("is_default_expense", False)
            
            # Create expense item data
            expense_item_data = {
                "department": department,
                "department_location": department_location,
                "amount": amount,
                "cost_type": cost_type
            }
            
            # Set the appropriate field based on whether it's a default expense
            if is_default_expense:
                expense_item_data["default_expense"] = expense_name
            else:
                expense_item_data["expense_name"] = expense_name
            
            doc.append("expense_items", expense_item_data)

        doc.insert()
        return {"success": True, "name": doc.name}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_expense_document failed")
        return {"success": False, "error": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.create_expense.create_document