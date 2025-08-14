import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get_default_payroll_for_project(project_name):
    """Get default payroll rows for departments selected in a project.

    Returns structure similar to default expenses API to keep frontend logic consistent:
    {
      success: True,
      default_payroll: [
        {
          department: <department_name>,
          department_location: <location>,
          position: <'Manager' | 'Non-manager'>,
          designation: <designation>,
          salary: 0,
          count: 0,
          is_default: True
        }, ...
      ],
      selected_departments: [...],
      message: str
    }
    """
    try:
        if not project_name:
            return {
                "success": False,
                "error": "Project name is required",
            }

        # Ensure project exists (accept both name and project_name)
        if not frappe.db.exists("Forecast Project", project_name):
            # Try lookup by project_name field if a pretty name was passed
            alt = frappe.db.get_value(
                "Forecast Project", {"project_name": project_name}, "name"
            )
            if not alt:
                all_projects = frappe.get_all(
                    "Forecast Project", fields=["name", "project_name"]
                )
                return {
                    "success": False,
                    "error": f"Project '{project_name}' not found. Available projects: {[p.project_name for p in all_projects]}",
                }
            project_name = alt

        project = frappe.get_doc("Forecast Project", project_name)

        # Collect human-readable department names from project child table (handles link mismatch)
        selected_departments = []
        if getattr(project, "departments", None):
            for dept in project.departments:
                if getattr(dept, "depatment", None):  # note: field is 'depatment' in project
                    try:
                        department_doc = frappe.get_doc("Department", dept.depatment)
                        dept_name = (
                            getattr(department_doc, "department_name", None)
                            or department_doc.name
                        )
                        selected_departments.append(dept_name)
                    except Exception:
                        # Fallback to link value
                        selected_departments.append(dept.depatment)

        if not selected_departments:
            return {
                "success": True,
                "default_payroll": [],
                "message": "No departments selected in project",
            }

        # Build an index of available Payroll Default Data docs
        all_defaults = frappe.get_all(
            "Payroll Default Data", fields=["name", "department"]
        )

        default_rows = []

        for dept_name in selected_departments:
            base_dept_name = dept_name.split(" - ")[0].strip()

            # Resolve a matching Payroll Default Data doc
            found_docname = None

            # Exact docname match (autoname by department field)
            if frappe.db.exists("Payroll Default Data", dept_name):
                found_docname = dept_name
            elif frappe.db.exists("Payroll Default Data", base_dept_name):
                found_docname = base_dept_name
            else:
                # Partial match via department field
                for d in all_defaults:
                    try:
                        dept_field = (d.get("department") or "").lower()
                        if base_dept_name.lower() in dept_field or dept_field in base_dept_name.lower():
                            found_docname = d["name"]
                            break
                    except Exception:
                        continue

            if not found_docname:
                continue

            doc = frappe.get_doc("Payroll Default Data", found_docname)
            if not getattr(doc, "default_data", None):
                continue

            # Each child row -> one default payroll row
            for item in doc.default_data:
                default_rows.append(
                    {
                        "department": dept_name,  # keep original department label
                        "department_location": getattr(item, "department_location", "Default"),
                        "position": getattr(item, "position", "Non-manager"),
                        "designation": getattr(item, "designation", ""),
                        # Defaults for numeric fields
                        "salary": 0,
                        "count": 0,
                        "is_default": True,
                    }
                )

        return {
            "success": True,
            "default_payroll": default_rows,
            "selected_departments": selected_departments,
            "message": f"Found {len(default_rows)} default payroll rows for {len(selected_departments)} departments",
        }

    except Exception as e:
        frappe.logger().error(
            f"Error fetching default payroll for project {project_name}: {str(e)}"
        )
        frappe.logger().error(frappe.get_traceback())
        return {"success": False, "error": str(e)}

# http://127.0.0.1:8000/api/v2/method/ex_forcast.api.default_payroll.get_default_payroll_for_project
