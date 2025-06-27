app_name = "ex_forcast"
app_title = "Ex Forcast"
app_publisher = "noble"
app_description = "forcast in vue"
app_email = "nortexnoble@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "ex_forcast",
# 		"logo": "/assets/ex_forcast/logo.png",
# 		"title": "Ex Forcast",
# 		"route": "/ex_forcast",
# 		"has_permission": "ex_forcast.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/ex_forcast/css/ex_forcast.css"
# app_include_js = "/assets/ex_forcast/js/ex_forcast.js"

# include js, css files in header of web template
# web_include_css = "/assets/ex_forcast/css/ex_forcast.css"
# web_include_js = "/assets/ex_forcast/js/ex_forcast.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "ex_forcast/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "ex_forcast/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "ex_forcast.utils.jinja_methods",
# 	"filters": "ex_forcast.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "ex_forcast.install.before_install"
# after_install = "ex_forcast.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "ex_forcast.uninstall.before_uninstall"
# after_uninstall = "ex_forcast.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "ex_forcast.utils.before_app_install"
# after_app_install = "ex_forcast.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "ex_forcast.utils.before_app_uninstall"
# after_app_uninstall = "ex_forcast.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "ex_forcast.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

doc_events = {
    "Doctype1": {
        "on_update": "ex_forcast.api.year.get_year_options"
    },
    "Doctype2": {
        "on_update": "ex_forcast.api.expense_estimate.estimate_display"
    },
    "Doctype3": {
        "on_update": "ex_forcast.api.create_expense.create_document"
    },
    "Doctype4": {
        "on_update": "ex_forcast.api.expense_options.get_expense_field_options"
    }
}

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"ex_forcast.tasks.all"
# 	],
# 	"daily": [
# 		"ex_forcast.tasks.daily"
# 	],
# 	"hourly": [
# 		"ex_forcast.tasks.hourly"
# 	],
# 	"weekly": [
# 		"ex_forcast.tasks.weekly"
# 	],
# 	"monthly": [
# 		"ex_forcast.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "ex_forcast.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "ex_forcast.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "ex_forcast.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["ex_forcast.utils.before_request"]
# after_request = ["ex_forcast.utils.after_request"]

# Job Events
# ----------
# before_job = ["ex_forcast.utils.before_job"]
# after_job = ["ex_forcast.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"ex_forcast.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = [
            {"doctype": "Room Packages", "filters": [["module" , "in" , ("Ex Forcast" )]]},
]

website_route_rules = [{'from_route': '/forcast_desk/<path:app_path>', 'to_route': 'forcast_desk'},]