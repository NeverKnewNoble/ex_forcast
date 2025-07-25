import frappe

@frappe.whitelist(allow_guest=True)
def get_expense_field_options():
    """
    API endpoint to fetch options for hospitality_category (now a Link to Expense Category) and cost_type fields
    from the Expense Items child table doctype
    """
    try:
        # Fetch all Expense Category document names for hospitality_category options
        hospitality_category_options = [d.name for d in frappe.get_all("Expense Category", fields=["name"])]

        # Get the Expense Items doctype for cost_type options
        expense_items_doctype = frappe.get_doc("DocType", "Expense Items")
        cost_type_options = []
        cost_type_field = None
        for field in expense_items_doctype.fields:
            if field.fieldname == "cost_type":
                cost_type_field = field
                break
        if cost_type_field and cost_type_field.options:
            cost_type_options = [
                option.strip() for option in cost_type_field.options.split('\n')
                if option.strip()
            ]
        return {
            "success": True,
            "data": {
                "hospitality_category": hospitality_category_options,
                "cost_type": cost_type_options
            }
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_expense_field_options API failed")
        return {
            "success": False,
            "error": str(e),
            "data": {
                "hospitality_category": [],
                "cost_type": []
            }
        }

@frappe.whitelist(allow_guest=True)
def create_expense_category(category_name):
    """
    API endpoint to create a new Expense Category document with the given category name.
    The 'category' field will be set to the provided category_name.
    """
    try:
        # Create the new Expense Category document
        doc = frappe.get_doc({
            "doctype": "Expense Category",
            "category": category_name
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {
            "success": True,
            "name": doc.name
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_expense_category API failed")
        return {
            "success": False,
            "error": str(e)
        }

# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_options.get_expense_field_options 
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_options.create_expense_category?category_name=Test%20Category    
