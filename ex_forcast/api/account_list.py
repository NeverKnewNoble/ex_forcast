import frappe

@frappe.whitelist(allow_guest=True)
def get_accounts():
    """
    API endpoint to fetch Account doctype documents
    Returns a list of accounts with their names and basic information
    """
    try:
        # Fetch all accounts with basic fields
        accounts = frappe.get_all(
            doctype="Account",
            fields=["name"],
            # fields=["name", "account_name", "account_type", "root_type", "is_group"],
            filters={},  # No filters - get all accounts
            order_by="name asc"
        )
        
        # Log for debugging
        frappe.logger().info(f"Fetched {len(accounts)} accounts")
        
        return {
            "success": True,
            "results": accounts,
            "count": len(accounts)
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_accounts API failed")
        return {
            "success": False,
            "error": str(e),
            "results": [],
            "count": 0
        }


# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.account_list.get_accounts 