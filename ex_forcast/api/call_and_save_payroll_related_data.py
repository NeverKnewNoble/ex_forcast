import frappe
from collections import defaultdict
import json

@frappe.whitelist(allow_guest=True)
def payroll_related_data_display(project=None):
    """Fetch Payroll Related data from Payroll Data doctype"""
    try:
        # SQL query to get Payroll Related data with project filter
        query = """
            SELECT 
                parent.year,
                parent.name as parent_name,
                parent.project
            FROM 
                `tabPayroll Data` AS parent
        """
        
        # Add project filter if provided
        if project:
            query += " WHERE parent.project = %s"
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, (project,), as_dict=True)
        else:
            query += " ORDER BY CAST(parent.year AS UNSIGNED) ASC"
            raw_results = frappe.db.sql(query, as_dict=True)
        
        # Group data by year -> payroll related data
        grouped_data = defaultdict(dict)

        for row in raw_results:
            year = row['year']
            parent_name = row['parent_name']
            
            # Get the parent Payroll Data document
            parent_doc = frappe.get_doc("Payroll Data", parent_name)
            
            # Extract payroll taxes data
            payroll_taxes = {}
            for tax_item in parent_doc.payroll_taxes:
                payroll_taxes[tax_item.row] = {
                    "tax_percentage": tax_item.tax_percentage
                }
            
            # Extract supplementary pay data
            supplementary_pay = {}
            for supp_item in parent_doc.supplementary_pay:
                if supp_item.row not in supplementary_pay:
                    supplementary_pay[supp_item.row] = {}
                supplementary_pay[supp_item.row][supp_item.supplementary_detail] = supp_item.amount
            
            # Extract employee benefits data
            employee_benefits = {}
            for benefit_item in parent_doc.employee_benefits:
                if benefit_item.row not in employee_benefits:
                    employee_benefits[benefit_item.row] = {}
                employee_benefits[benefit_item.row][benefit_item.benefits_details] = benefit_item.amount
            
            grouped_data[year] = {
                "payroll_taxes": payroll_taxes,
                "supplementary_pay": supplementary_pay,
                "employee_benefits": employee_benefits
            }

        # Convert defaultdict to normal dict for JSON serialization
        result = dict(grouped_data)
        return result

    except Exception as err:
        frappe.log_error(frappe.get_traceback(), "payroll_related_data_display failed")
        return {"error": str(err)}


@frappe.whitelist()
def upsert_payroll_related_data(changes, project=None):
    """
    changes: JSON string or list of dicts, each with:
      - year
      - payroll_taxes: dict with row -> tax_percentage mapping
      - supplementary_pay: dict with row -> {detail -> amount} mapping
      - employee_benefits: dict with row -> {benefit -> amount} mapping
    project: Project name to filter/create documents for
    """
    try:
        if isinstance(changes, str):
            changes = json.loads(changes)

        results = []

        # Process Payroll Related data changes
        for change in changes:
            try:
                year = change.get("year")
                payroll_taxes = change.get("payroll_taxes", {})
                supplementary_pay = change.get("supplementary_pay", {})
                employee_benefits = change.get("employee_benefits", {})

                if not year:
                    continue

                # Find or create parent document with project filter
                parent_filters = {"year": year, "project": project} if project else {"year": year}
                parent = frappe.db.get_value(
                    "Payroll Data",
                    parent_filters,
                    "name"
                )
                if not parent:
                    parent_doc = frappe.get_doc({
                        "doctype": "Payroll Data",
                        "year": year,
                        "project": project,
                        "payroll_data": [],
                        "payroll_taxes": [],
                        "supplementary_pay": [],
                        "employee_benefits": []
                    })
                    parent_doc.insert()
                    parent = parent_doc.name
                else:
                    parent_doc = frappe.get_doc("Payroll Data", parent)

                # Update payroll taxes
                if payroll_taxes:
                    update_payroll_taxes(parent_doc, payroll_taxes)
                
                # Update supplementary pay
                if supplementary_pay:
                    update_supplementary_pay(parent_doc, supplementary_pay)
                
                # Update employee benefits
                if employee_benefits:
                    update_employee_benefits(parent_doc, employee_benefits)
                
                parent_doc.save()
                results.append({"action": "updated", "name": parent_doc.name, "type": "payroll_related_data"})

            except Exception as e:
                frappe.logger().error(f"Error processing individual change {change}: {str(e)}")
                raise e

        frappe.db.commit()
        
        return {
            "success": True, 
            "results": results,
            "summary": {
                "payroll_related_data_processed": len(changes),
                "total_processed": len(results)
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "upsert_payroll_related_data failed")
        frappe.logger().error(f"Error in upsert_payroll_related_data: {str(e)}")
        return {"success": False, "error": str(e)}


def update_payroll_taxes(parent_doc, payroll_taxes):
    """Update payroll taxes data"""
    # Remove existing payroll taxes for the rows being updated
    rows_to_update = set(payroll_taxes.keys())
    parent_doc.payroll_taxes = [
        item for item in parent_doc.payroll_taxes 
        if item.row not in rows_to_update
    ]
    
    # Add new payroll taxes
    for row, data in payroll_taxes.items():
        if data.get("tax_percentage") is not None:
            parent_doc.append("payroll_taxes", {
                "row": row,
                "tax_percentage": data["tax_percentage"]
            })


def update_supplementary_pay(parent_doc, supplementary_pay):
    """Update supplementary pay data"""
    # Remove existing supplementary pay for the rows being updated
    rows_to_update = set(supplementary_pay.keys())
    parent_doc.supplementary_pay = [
        item for item in parent_doc.supplementary_pay 
        if item.row not in rows_to_update
    ]
    
    # Add new supplementary pay
    for row, details in supplementary_pay.items():
        for detail, amount in details.items():
            if amount is not None:
                parent_doc.append("supplementary_pay", {
                    "row": row,
                    "supplementary_detail": detail,
                    "amount": amount
                })


def update_employee_benefits(parent_doc, employee_benefits):
    """Update employee benefits data"""
    # Remove existing employee benefits for the rows being updated
    rows_to_update = set(employee_benefits.keys())
    parent_doc.employee_benefits = [
        item for item in parent_doc.employee_benefits 
        if item.row not in rows_to_update
    ]
    
    # Add new employee benefits
    for row, benefits in employee_benefits.items():
        for benefit, amount in benefits.items():
            if amount is not None:
                parent_doc.append("employee_benefits", {
                    "row": row,
                    "benefits_details": benefit,
                    "amount": amount
                })


# API endpoints:
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_related_data.payroll_related_data_display
# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.call_and_save_payroll_related_data.upsert_payroll_related_data 