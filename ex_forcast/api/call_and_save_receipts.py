import frappe
from collections import defaultdict
import json


MONTH_ORDER = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "ex1", "ex2",
    "Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec",
]


def _month_field_order_clause():
    return "'" + "', '".join(MONTH_ORDER) + "'"


@frappe.whitelist(allow_guest=True)
def receipts_payments_display(project=None):
    """
    Fetch Receipts & Payments data from Receipts And Payments doctype

    Returns a nested dict: year -> month -> list of child rows with fields
    { department, section, percent_position, percent, payment_row, amount }.
    """
    try:
        query = f"""
            SELECT 
                p.year,
                p.month,
                c.department,
                c.section,
                c.percent_position,
                c.percent,
                c.payment_row,
                c.amount
            FROM `tabReceipts And Payments` AS p
            INNER JOIN `tabReceipts And Payments Items` AS c
                ON c.parent = p.name
        """

        params = []
        if project:
            query += " WHERE p.project = %s"
            params.append(project)

        query += (
            " ORDER BY CAST(p.year AS UNSIGNED) ASC, "
            f"FIELD(p.month, {_month_field_order_clause()})"
        )

        rows = frappe.db.sql(query, tuple(params), as_dict=True)

        grouped = defaultdict(lambda: defaultdict(list))
        for r in rows:
            grouped[r["year"]][r["month"]].append({
                "department": r.get("department"),
                "section": r.get("section"),
                "percent_position": r.get("percent_position"),
                "percent": float(r.get("percent") or 0),
                "payment_row": r.get("payment_row"),
                "amount": float(r.get("amount") or 0),
            })

        result = {year: dict(months) for year, months in grouped.items()}
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "receipts_payments_display failed")
        return {"error": str(err)}


@frappe.whitelist()
def upsert_receipts_payments_items(changes, project=None):
    """
    Upsert Receipts & Payments child rows.

    changes: JSON string or list of dicts. Each change can contain:
      - year (str/int)
      - month (str) one of MONTH_ORDER
      - department (str)
      - section ("Revenue"|"Payment")
      - percent_position ("month"|"following"|"second") [optional]
      - percent (number) [optional]
      - payment_row ("Net Salary & Wage"|"Bonus"|"Payroll related"|"Expenses") [optional]
      - amount (number) [optional]
    project: (str) Forecast Project name
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        for ch in changes or []:
            year = ch.get("year")
            month = ch.get("month")
            department = ch.get("department")
            section = ch.get("section")
            percent_position = ch.get("percent_position")
            percent = ch.get("percent")
            payment_row = ch.get("payment_row")
            amount = ch.get("amount")

            if not (year and month and department and section):
                # Skip invalid entries
                continue

            # Normalize/guard: skip zero/negative values
            if percent is not None:
                try:
                    if float(percent) <= 0:
                        continue
                except Exception:
                    pass
            if amount is not None:
                try:
                    if float(amount) <= 0:
                        continue
                except Exception:
                    pass

            # Find or create parent
            parent_name = frappe.db.get_value(
                "Receipts And Payments",
                {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
                "name",
            )
            if not parent_name:
                parent_doc = frappe.get_doc({
                    "doctype": "Receipts And Payments",
                    "project": project,
                    "year": str(year),
                    "month": month,
                })
                parent_doc.insert()
                parent_name = parent_doc.name

            # Identify a unique child row by dept/section/percent_position/payment_row
            # Use a tolerant lookup to avoid duplicates when optional fields are NULL/empty
            existing_children = frappe.get_all(
                "Receipts And Payments Items",
                filters={"parent": parent_name, "department": department, "section": section},
                fields=["name", "percent_position", "payment_row"],
            )
            child_name = None
            for chd in existing_children:
                same_pos = (chd.get("percent_position") or None) == (percent_position or None)
                same_row = (chd.get("payment_row") or None) == (payment_row or None)
                if same_pos and same_row:
                    child_name = chd.get("name")
                    break

            if child_name:
                child_doc = frappe.get_doc("Receipts And Payments Items", child_name)
                if percent is not None:
                    child_doc.percent = percent
                if amount is not None:
                    child_doc.amount = amount
                if percent_position and not getattr(child_doc, "percent_position", None):
                    child_doc.percent_position = percent_position
                if payment_row and not getattr(child_doc, "payment_row", None):
                    child_doc.payment_row = payment_row
                child_doc.save()
                results.append({"action": "updated", "child": child_doc.name})
            else:
                parent_doc = frappe.get_doc("Receipts And Payments", parent_name)
                new_child = parent_doc.append("receipt_items", {
                    "department": department,
                    "section": section,
                    "percent_position": percent_position,
                    "percent": percent or 0,
                    "payment_row": payment_row,
                    "amount": amount or 0,
                })
                parent_doc.save()
                results.append({"action": "created", "child": new_child.name})

        frappe.db.commit()
        return {"status": "success", "results": results}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_receipts_payments_items failed")
        return {"status": "error", "message": str(e)}


