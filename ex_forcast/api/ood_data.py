import frappe
from frappe import _
import json

@frappe.whitelist()
def load_ood_data(project_name=None):
    """Load OOD data for a specific project"""
    try:
        if not project_name:
            return {"status": "error", "message": "Project name is required"}
        
        # Load laundry data
        laundry_data = frappe.get_all(
            "Laundry Data",
            filters={"project": project_name},
            fields=["year", "month", "field", "amount", "number", "percentage", "base"]
        )
        
        # Load health club data
        health_club_data = frappe.get_all(
            "Health Club Data",
            filters={"project": project_name},
            fields=["year", "month", "field", "amount", "percentage"]
        )
        
        return {
            "status": "success",
            "laundry": laundry_data,
            "health_club": health_club_data
        }
        
    except Exception as e:
        frappe.log_error(f"Error loading OOD data: {str(e)}")
        return {"status": "error", "message": str(e)}

@frappe.whitelist()
def save_ood_changes(project_name=None):
    """Save OOD data changes"""
    try:
        if not project_name:
            return {"status": "error", "message": "Project name is required"}
        
        # Get the request data
        data = frappe.request.get_json()
        changes = data.get("changes", [])
        
        if not changes:
            return {"status": "success", "message": "No changes to save"}
        
        # Process changes
        for change in changes:
            year = change.get("year")
            month = change.get("month")
            field = change.get("field")
            amount = change.get("amount")
            
            if not all([year, month, field, amount is not None]):
                continue
            
            # Determine if this is laundry or health club data based on field name
            if field.endswith('_pct') or field in ['club_use_revenue', 'sauna', 'gym', 'swimming_pool', 
                                                  'treatments_other_services', 'fitness_lessons_group',
                                                  'health_wellness_services', 'massage', 
                                                  'personal_training_swimming_lessons', 'spa_treatment',
                                                  'salon_treatment', 'merchandise', 'clothing', 'memberships',
                                                  'pool_spa', 'gym_membership', 'pool_gym', 'spa_gym',
                                                  'gym_pool_spa', 'pool_only', 'total_club_use_revenue',
                                                  'total_treatments_other_services', 'total_memberships',
                                                  'total_health_club_spa', 'service_charge',
                                                  'total_health_club_rev_including_sc']:
                # Health club data
                save_health_club_data(project_name, year, month, field, amount)
            else:
                # Laundry data
                save_laundry_data(project_name, year, month, field, amount)
        
        return {"status": "success", "message": "Changes saved successfully"}
        
    except Exception as e:
        frappe.log_error(f"Error saving OOD changes: {str(e)}")
        return {"status": "error", "message": str(e)}

def save_laundry_data(project_name, year, month, field, amount):
    """Save laundry data"""
    # Check if record exists
    existing = frappe.get_all(
        "Laundry Data",
        filters={
            "project": project_name,
            "year": year,
            "month": month,
            "field": field
        },
        limit=1
    )
    
    if existing:
        # Update existing record
        doc = frappe.get_doc("Laundry Data", existing[0].name)
        doc.amount = amount
        doc.save()
    else:
        # Create new record
        doc = frappe.get_doc({
            "doctype": "Laundry Data",
            "project": project_name,
            "year": year,
            "month": month,
            "field": field,
            "amount": amount
        })
        doc.insert()

def save_health_club_data(project_name, year, month, field, amount):
    """Save health club data"""
    # Check if record exists
    existing = frappe.get_all(
        "Health Club Data",
        filters={
            "project": project_name,
            "year": year,
            "month": month,
            "field": field
        },
        limit=1
    )
    
    if existing:
        # Update existing record
        doc = frappe.get_doc("Health Club Data", existing[0].name)
        doc.amount = amount
        doc.save()
    else:
        # Create new record
        doc = frappe.get_doc({
            "doctype": "Health Club Data",
            "project": project_name,
            "year": year,
            "month": month,
            "field": field,
            "amount": amount
        })
        doc.insert()

@frappe.whitelist()
def get_laundry_fields():
    """Get available laundry fields"""
    return [
        {"code": "in_house_guest_laundry", "label": "In House Guest Laundry & Dry cleaning"},
        {"code": "dry_cleaning", "label": "Dry Cleaning"},
        {"code": "outside_guest_laundry", "label": "Outside Guest Laundry"},
        {"code": "cost_of_sale", "label": "COST OF SALE"},
        {"code": "guest_laundry_cost", "label": "Guest Laundry Cost"},
        {"code": "other", "label": "Other"}
    ]

@frappe.whitelist()
def get_health_club_fields():
    """Get available health club fields"""
    return [
        {"code": "club_use_revenue", "label": "Club Use Revenue"},
        {"code": "sauna", "label": "Sauna"},
        {"code": "gym", "label": "Gym"},
        {"code": "swimming_pool", "label": "Swimming Pool"},
        {"code": "treatments_other_services", "label": "Treatments & Other Services"},
        {"code": "fitness_lessons_group", "label": "Fitness Lessons (group)"},
        {"code": "health_wellness_services", "label": "Health / Wellness Services"},
        {"code": "massage", "label": "Massage"},
        {"code": "personal_training_swimming_lessons", "label": "Personal Training & Swimming Lessons"},
        {"code": "spa_treatment", "label": "Spa Treatment"},
        {"code": "salon_treatment", "label": "Salon Treatment"},
        {"code": "merchandise", "label": "Merchandise"},
        {"code": "clothing", "label": "Clothing"},
        {"code": "memberships", "label": "Memberships"},
        {"code": "pool_spa", "label": "Pool/SPA"},
        {"code": "gym_membership", "label": "Gym"},
        {"code": "pool_gym", "label": "Pool / Gym"},
        {"code": "spa_gym", "label": "Spa / Gym"},
        {"code": "gym_pool_spa", "label": "Gym / Pool / Spa"},
        {"code": "pool_only", "label": "Pool"},
        {"code": "total_club_use_revenue", "label": "TOTAL CLUB USE REVENUE"},
        {"code": "total_treatments_other_services", "label": "TOTAL TREATMENTS & OTHER SERVICES"},
        {"code": "total_memberships", "label": "TOTAL MEMBERSHIPS"},
        {"code": "total_health_club_spa", "label": "TOTAL HEALTH CLUB & SPA"},
        {"code": "service_charge", "label": "SERVICE CHARGE"},
        {"code": "total_health_club_rev_including_sc", "label": "TOTAL HEALTH CLUB REV INCLUDING SC."}
    ] 