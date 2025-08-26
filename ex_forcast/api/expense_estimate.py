import code
import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def estimate_display(project=None):
    try:
        # Define month order for SQL ordering
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # SQL query to get raw expense rows with project filter
        # Updated to handle both expense_name and default_expense fields
        query = """
            SELECT 
                parent.year,
                parent.month,
                child.department,
                child.department_location,
                COALESCE(child.expense_name, child.default_expense) as expense,
                child.code,
                child.root_type,
                child.cost_type,
                child.amount
            FROM 
                `tabExpense Assumptions` AS parent
            INNER JOIN 
                `tabExpense Items` AS child
            ON 
                child.parent = parent.name
            WHERE 
                (child.expense_name IS NOT NULL AND child.expense_name != '') 
                OR (child.default_expense IS NOT NULL AND child.default_expense != '')
        """
        
        # Add project filter if provided
        if project:
            query += " AND parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC, FIELD(parent.month, {month_order})".format(
                month_order="'" + "', '".join(month_order) + "'"
            )
            raw_results = frappe.db.sql(query, as_dict=True)

        # Nested dict: year -> month -> list of expense rows
        grouped_data = defaultdict(lambda: defaultdict(list))

        for row in raw_results:
            grouped_data[row['year']][row['month']].append({
                "department": row.get('department'),
                "department_location": row.get('department_location'),
                "expense": row['expense'],
                "code": row['code'],
                "root type": row['root_type'],
                "cost_type": row['cost_type'],
                "amount": row['amount']
            })

        # Convert defaultdicts to normal dicts for JSON serialization
        result = {year: dict(months) for year, months in grouped_data.items()}
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "estimate_display failed")
        return {"error": str(err)}


@frappe.whitelist(allow_guest=True)
def get_all_expense_assumptions(project=None):
    """
    Get all unique expenses and categories from Expense Assumptions doctype,
    regardless of whether they have data for specific years.
    """
    try:
        # SQL query to get all unique expenses and their details
        # Updated to handle both expense_name and default_expense fields
        query = """
            SELECT DISTINCT
                COALESCE(child.expense_name, child.default_expense) as expense_name,
                child.code,
                child.root_type,
                child.cost_type
            FROM 
                `tabExpense Assumptions` AS parent
            INNER JOIN 
                `tabExpense Items` AS child
            ON 
                child.parent = parent.name
            WHERE 
                (child.expense_name IS NOT NULL AND child.expense_name != '') 
                OR (child.default_expense IS NOT NULL AND child.default_expense != '')
        """
        
        # Add project filter if provided
        if project:
            query += " AND parent.project = %s"
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            raw_results = frappe.db.sql(query, as_dict=True)

        # Extract unique expenses
        expenses = []
        seen_expenses = set()
        
        for row in raw_results:
            expense_name = row['expense_name']
            if expense_name not in seen_expenses:
                seen_expenses.add(expense_name)
                expenses.append({
                    "expense_name": expense_name,
                    "code": row['code'] or '',
                    "root_type": row['root_type'] or '',
                    "cost_type": row['cost_type'] or ''
                })

        # Extract unique categories
        categories = list(set(row['hospitality_category'] for row in raw_results if row['hospitality_category']))
        categories.sort()

        return {
            "expenses": expenses,
            "categories": categories
        }

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "get_all_expense_assumptions failed")
        return {"error": str(err)}


@frappe.whitelist(allow_guest=True)
def upsert_expense_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - month
      - department (Link Department)
      - department_location (Link Payroll Department Location)
      - expense (expense_name: Link Account)
      - amount
      - (optionally: cost_type)
      - (optionally: is_default_expense) - flag to indicate if this is a default expense
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        for change in changes:
            year = change.get("year")
            month = change.get("month")
            department = change.get("department")
            department_location = change.get("department_location")
            expense_name = change.get("expense")
            amount = change.get("amount")
            cost_type = change.get("cost_type") or change.get("costType")
            is_default_expense = change.get("is_default_expense", False)
            
            # Debug logging
            print(f"Processing change: year={year}, month={month}, expense={expense_name}, is_default={is_default_expense}")
            print(f"Department: {department}, Location: {department_location}, Cost Type: {cost_type}")

            # Find or create parent document with project filter
            parent = frappe.db.get_value(
                "Expense Assumptions",
                {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                "name"
            )
            if not parent:
                parent_doc = frappe.get_doc({
                    "doctype": "Expense Assumptions",
                    "year": year,
                    "month": month,
                    "project": project,  # Add project field
                    "expense_items": []
                })
                parent_doc.insert()
                parent = parent_doc.name

            # Check if child exists based on department+location+expense_name
            # For default expenses, we need to search differently
            if is_default_expense:
                child = frappe.db.get_value(
                    "Expense Items",
                    {
                        "parent": parent,
                        "default_expense": expense_name,
                        "department": department,
                        "department_location": department_location,
                    },
                    "name"
                )
                # No fallback search - we need exact department match for default expenses
            else:
                child = frappe.db.get_value(
                    "Expense Items",
                    {
                        "parent": parent,
                        "expense_name": expense_name,
                        "department": department,
                        "department_location": department_location,
                    },
                    "name"
                )
                # No fallback search - we need exact department match for regular expenses

            if child:
                # Update amount only
                child_doc = frappe.get_doc("Expense Items", child)
                if department is not None:
                    child_doc.department = department
                if department_location is not None:
                    child_doc.department_location = department_location
                child_doc.amount = amount
                if cost_type is not None:
                    child_doc.cost_type = cost_type
                # Handle default expense field
                if is_default_expense:
                    child_doc.default_expense = expense_name
                    child_doc.expense_name = None  # Clear expense_name for default expenses
                else:
                    child_doc.expense_name = expense_name
                    child_doc.default_expense = None  # Clear default_expense for regular expenses
                child_doc.save()
                results.append({"action": "updated", "name": child_doc.name})
            else:
                # Create new child with all fields
                parent_doc = frappe.get_doc("Expense Assumptions", parent)
                new_child_data = {
                    "department": department,
                    "department_location": department_location,
                    "amount": amount,
                    "cost_type": cost_type
                }
                
                # Set the appropriate field based on whether it's a default expense
                if is_default_expense:
                    new_child_data["default_expense"] = expense_name
                else:
                    new_child_data["expense_name"] = expense_name
                
                new_child = parent_doc.append("expense_items", new_child_data)
                parent_doc.save()
                results.append({"action": "created", "name": new_child.name})

        frappe.db.commit()
        return {"status": "success", "results": results}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_expense_items failed")
        return {"status": "error", "message": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_estimate.estimate_display