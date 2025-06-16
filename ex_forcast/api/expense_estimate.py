import frappe
from collections import defaultdict

@frappe.whitelist(allow_guest=True)
def estimate_display():
    try:
        # Define month order for SQL ordering
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        # SQL query to get raw expense rows
        query = """
            SELECT 
                parent.year,
                parent.month,
                child.expense_name,
                child.amount
            FROM 
                `tabExpense Estimation` AS parent
            INNER JOIN 
                `tabExpense Items` AS child
            ON 
                child.parent = parent.name
            ORDER BY 
                CAST(parent.year AS UNSIGNED) ASC,
                FIELD(parent.month, {month_order})
        """.format(month_order="'" + "', '".join(month_order) + "'")

        raw_results = frappe.db.sql(query, as_dict=True)

        # Nested dict: year -> month -> list of expense rows
        grouped_data = defaultdict(lambda: defaultdict(list))

        for row in raw_results:
            grouped_data[row['year']][row['month']].append({
                "expense": row['expense_name'],
                "amount": row['amount']
            })

        # Convert defaultdicts to normal dicts for JSON serialization
        result = {year: dict(months) for year, months in grouped_data.items()}
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "estimate_display failed")
        return {"error": str(err)}


#  http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_estimate.estimate_display