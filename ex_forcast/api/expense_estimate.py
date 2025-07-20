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
                child.expense_name,
                child.code,
                child.root_type,
                child.hospitality_category,
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
                "expense": row['expense_name'],
                "code": row['code'],
                "root type": row['root_type'],
                "hospitality_category": row['hospitality_category'],
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
def upsert_expense_items(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - month
      - expense (expense_name)
      - code
      - amount
      - (optionally: category/hospitality_category, cost_type)
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        for change in changes:
            year = change.get("year")
            month = change.get("month")
            expense_name = change.get("expense")
            amount = change.get("amount")
            hospitality_category = change.get("hospitality_category")
            cost_type = change.get("cost_type")

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

            # Check if child exists based on expense_name
            child = frappe.db.get_value(
                "Expense Items",
                {"parent": parent, "expense_name": expense_name},
                "name"
            )

            if child:
                # Update amount only
                child_doc = frappe.get_doc("Expense Items", child)
                child_doc.amount = amount
                child_doc.save()
                results.append({"action": "updated_amount_only", "name": child_doc.name})
            else:
                # Create new child with all fields
                parent_doc = frappe.get_doc("Expense Assumptions", parent)
                new_child = parent_doc.append("expense_items", {
                    "expense_name": expense_name,
                    "amount": amount,
                    "hospitality_category": hospitality_category,
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