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
        query = """
            SELECT 
                parent.year,
                parent.month,
                child.department,
                child.department_location,
                child.expense_name,
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
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
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
                "expense": row['expense_name'],
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
        query = """
            SELECT DISTINCT
                child.expense_name,
                child.code,
                child.root_type,
                child.cost_type
            FROM 
                `tabExpense Assumptions` AS parent
            INNER JOIN 
                `tabExpense Items` AS child
            ON 
                child.parent = parent.name
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
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
                child_doc.save()
                results.append({"action": "updated", "name": child_doc.name})
            else:
                # Create new child with all fields
                parent_doc = frappe.get_doc("Expense Assumptions", parent)
                new_child = parent_doc.append("expense_items", {
                    "department": department,
                    "department_location": department_location,
                    "expense_name": expense_name,
                    "amount": amount,
                    "cost_type": cost_type
                })
                parent_doc.save()
                results.append({"action": "created", "name": new_child.name})

        frappe.db.commit()
        return {"status": "success", "results": results}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_expense_items failed")
        return {"status": "error", "message": str(e)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_estimate.estimate_display