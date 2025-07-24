import frappe
import json

@frappe.whitelist()
def upsert_ood_laundry_table(year, month, laundry_table, project=None):
    """
    Save or update only the laundry_table for a given year, month, and project.
    laundry_table: JSON string or list of {section, detail, amount}
    """
    try:
        if isinstance(laundry_table, str):
            laundry_table = json.loads(laundry_table)
        parent = frappe.db.get_value(
            "OOD Revenue Assumptions",
            {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
            "name"
        )
        if not parent:
            parent_doc = frappe.get_doc({
                "doctype": "OOD Revenue Assumptions",
                "year": year,
                "month": month,
                "project": project,
                "laundry_table": [],
                "health_club_table": []
            })
            parent_doc.insert()
            parent = parent_doc.name
        parent_doc = frappe.get_doc("OOD Revenue Assumptions", parent)
        parent_doc.laundry_table = []
        for item in laundry_table:
            if item.get("detail") == "Base":
                parent_doc.append("laundry_table", {
                    "section": item.get("section"),
                    "detail": item.get("detail"),
                    "amount": 0.00,
                    "base": item.get("amount")
                })
            else:
                parent_doc.append("laundry_table", {
                    "section": item.get("section"),
                    "detail": item.get("detail"),
                    "amount": item.get("amount"),
                    "base": ''
                })
        parent_doc.save()
        return {"status": "success", "year": year, "month": month}
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "upsert_ood_laundry_table failed")
        return {"error": str(err)}

@frappe.whitelist()
def upsert_ood_health_club_table(year, month, health_club_table, project=None):
    """
    Save or update only the health_club_table for a given year, month, and project.
    health_club_table: JSON string or list of {section, detail, amount}
    """
    try:
        if isinstance(health_club_table, str):
            health_club_table = json.loads(health_club_table)
        parent = frappe.db.get_value(
            "OOD Revenue Assumptions",
            {"year": year, "month": month, "project": project} if project else {"year": year, "month": month},
            "name"
        )
        if not parent:
            parent_doc = frappe.get_doc({
                "doctype": "OOD Revenue Assumptions",
                "year": year,
                "month": month,
                "project": project,
                "laundry_table": [],
                "health_club_table": []
            })
            parent_doc.insert()
            parent = parent_doc.name
        parent_doc = frappe.get_doc("OOD Revenue Assumptions", parent)
        parent_doc.health_club_table = []
        for item in health_club_table:
            parent_doc.append("health_club_table", {
                "section": item.get("section"),
                "detail": item.get("detail"),
                "amount": item.get("amount")
            })
        parent_doc.save()
        return {"status": "success", "year": year, "month": month}
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "upsert_ood_health_club_table failed")
        return {"error": str(err)}

@frappe.whitelist(allow_guest=True)
def ood_revenue_display(project=None):
    """
    Fetch OOD revenue data from OOD Revenue Assumptions doctype, grouped by year and month, including laundry_table and health_club_table.
    """
    try:
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        filters = {}
        if project:
            filters["project"] = project
        docs = frappe.get_all(
            "OOD Revenue Assumptions",
            filters=filters,
            fields=["name", "year", "month", "project"],
            order_by="CAST(year AS UNSIGNED) ASC, FIELD(month, '{}')".format(",".join([f'\'{m}\'' for m in month_order]))
        )
        result = {}
        for doc in docs:
            year = doc["year"]
            month = doc["month"]
            if year not in result:
                result[year] = {}
            if month not in result[year]:
                result[year][month] = {"laundry_table": [], "health_club_table": []}
            parent_doc = frappe.get_doc("OOD Revenue Assumptions", doc["name"])
            # Laundry Table
            laundry_table = []
            for item in parent_doc.laundry_table:
                laundry_table.append({
                    "section": item.section,
                    "detail": item.detail,
                    "amount": item.amount
                })
            # Health Club Table
            health_club_table = []
            for item in parent_doc.health_club_table:
                health_club_table.append({
                    "section": item.section,
                    "detail": item.detail,
                    "amount": item.amount
                })
            result[year][month] = {
                "laundry_table": laundry_table,
                "health_club_table": health_club_table
            }
        return result
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "ood_revenue_display failed")
        return {"error": str(err)}

@frappe.whitelist(allow_guest=True)
def ood_laundry_table_display(project=None):
    """
    Fetch only the laundry_table data from OOD Revenue Assumptions, grouped by year and month.
    """
    try:
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        filters = {}
        if project:
            filters["project"] = project
        docs = frappe.get_all(
            "OOD Revenue Assumptions",
            filters=filters,
            fields=["name", "year", "month", "project"],
            order_by="CAST(year AS UNSIGNED) ASC, FIELD(month, '{}')".format(",".join([f'\'{m}\'' for m in month_order]))
        )
        result = {}
        for doc in docs:
            year = doc["year"]
            month = doc["month"]
            if year not in result:
                result[year] = {}
            if month not in result[year]:
                result[year][month] = {"laundry_table": []}
            parent_doc = frappe.get_doc("OOD Revenue Assumptions", doc["name"])
            # Laundry Table
            laundry_table = []
            for item in parent_doc.laundry_table:
                laundry_table.append({
                    "section": item.section,
                    "detail": item.detail,
                    "amount": item.amount,
                    "base": getattr(item, "base", None)
                })
            result[year][month]["laundry_table"] = laundry_table
        return result
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "ood_laundry_table_display failed")
        return {"error": str(err)}

@frappe.whitelist(allow_guest=True)
def ood_health_club_table_display(project=None):
    """
    Fetch only the health_club_table data from OOD Revenue Assumptions, grouped by year and month.
    """
    try:
        month_order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        filters = {}
        if project:
            filters["project"] = project
        docs = frappe.get_all(
            "OOD Revenue Assumptions",
            filters=filters,
            fields=["name", "year", "month", "project"],
            order_by="CAST(year AS UNSIGNED) ASC, FIELD(month, '{}')".format(",".join([f'\'{m}\'' for m in month_order]))
        )
        result = {}
        for doc in docs:
            year = doc["year"]
            month = doc["month"]
            if year not in result:
                result[year] = {}
            if month not in result[year]:
                result[year][month] = {"health_club_table": []}
            parent_doc = frappe.get_doc("OOD Revenue Assumptions", doc["name"])
            # Health Club Table
            health_club_table = []
            for item in parent_doc.health_club_table:
                health_club_table.append({
                    "section": item.section,
                    "detail": item.detail,
                    "amount": item.amount
                })
            result[year][month]["health_club_table"] = health_club_table
        return result
    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "ood_health_club_table_display failed")
        return {"error": str(err)} 