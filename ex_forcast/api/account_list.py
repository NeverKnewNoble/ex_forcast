import frappe

@frappe.whitelist(allow_guest=True)
def get_accounts():
    """
    API endpoint to fetch Account doctype documents where is_group is not checked (0).
    Returns a list of accounts with their names for use as expense options.
    """
    try:
        # Fetch all accounts that are not groups
        accounts = frappe.get_all(
            doctype="Account",
            fields=["name"],
            filters={"is_group": 0},  # Only non-group accounts
            order_by="name asc"
        )
        frappe.logger().info(f"Fetched {len(accounts)} non-group accounts")
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

@frappe.whitelist(allow_guest=True)
def create_account(account_name, account_number, parent_account):
    """
    API endpoint to create a new Account document with the given fields.
    Sets company to the default company from Global Defaults. Does not allow creation if parent_account is a group.
    """
    try:
        # Get default company from Global Defaults
        default_company = frappe.db.get_single_value("Global Defaults", "default_company")
        if not default_company:
            return {"success": False, "error": "Default company not found in Global Defaults."}

        # Check if parent_account is a group
        parent_doc = frappe.get_doc("Account", parent_account)
        if not parent_doc.is_group:
            return {"success": False, "error": "Cannot create account under a non-group account. Please select a group account as parent."}

        # Create the new Account document
        doc = frappe.get_doc({
            "doctype": "Account",
            "account_name": account_name,
            "account_number": account_number,
            "company": default_company,
            "parent_account": parent_account
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"success": True, "name": doc.name}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_account API failed")
        return {"success": False, "error": str(e)}


@frappe.whitelist(allow_guest=True)
def get_group_accounts():
    """
    API endpoint to fetch names of all Account documents where is_group is checked (1).
    Returns a list of names for use as options.
    """
    try:
        group_accounts = frappe.get_all(
            "Account",
            fields=["name"],
            filters={"is_group": 1},
            order_by="name asc"
        )
        return {"success": True, "group_accounts": [a["name"] for a in group_accounts]}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_group_accounts API failed")
        return {"success": False, "group_accounts": [], "error": str(e)}


# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.account_list.get_accounts
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.account_list.create_account
# API endpoint: http://127.0.0.1:8000/api/v2/method/ex_forcast.api.account_list.get_group_accounts