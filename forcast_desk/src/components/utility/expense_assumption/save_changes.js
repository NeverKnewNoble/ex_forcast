import alertService from "@/components/ui/ui_utility/alertService.js";
import { cloneDeep } from 'lodash-es';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';

//! Helper function to find expense details from data
function findExpenseDetails(expenseData, expense, year, month) {
  // First try to find in the specific year and month
  const entries = expenseData?.[year]?.[month] || [];
  const found = entries.find(e => e.expense === expense);
  if (found) {
    return {
      department: found.department || "",
      department_location: found.department_location || "",
      hospitality_category: found.hospitality_category || "",
      cost_type: found.cost_type || ""
    };
  }
  
  // If not found in specific month, search through all months in the year
  const yearData = expenseData?.[year] || {};
  for (const monthKey in yearData) {
    const monthEntries = yearData[monthKey] || [];
    const monthFound = monthEntries.find(e => e.expense === expense);
    if (monthFound) {
      return {
        department: monthFound.department || "",
        department_location: monthFound.department_location || "",
        hospitality_category: monthFound.hospitality_category || "",
        cost_type: monthFound.cost_type || ""
      };
    }
  }
  
  // If still not found, search through all years
  for (const yearKey in expenseData) {
    const yearData = expenseData[yearKey] || {};
    for (const monthKey in yearData) {
      const monthEntries = yearData[monthKey] || [];
      const monthFound = monthEntries.find(e => e.expense === expense);
      if (monthFound) {
        return {
          department: monthFound.department || "",
          department_location: monthFound.department_location || "",
          hospitality_category: monthFound.hospitality_category || "",
          cost_type: monthFound.cost_type || ""
        };
      }
    }
  }
  
  // Return empty strings if not found anywhere
  return {
    department: "",
    department_location: "",
    hospitality_category: "",
    cost_type: ""
  };
}

//! Helper function to check if an expense is a default expense
function isDefaultExpense(expense, defaultExpenses, department = null) {
  // Ensure defaultExpenses is an array and has the some method
  if (!Array.isArray(defaultExpenses) || typeof defaultExpenses.some !== 'function') {
    console.warn('defaultExpenses is not an array:', defaultExpenses);
    return false;
  }
  
  try {
    if (department) {
      // If department is provided, check if there's a default expense that matches both name and department
      return defaultExpenses.some(de => de.expense === expense && de.department === department);
    } else {
      // Fallback to checking by name only (for backward compatibility)
      return defaultExpenses.some(de => de.expense === expense);
    }
  } catch (error) {
    console.error('Error checking if expense is default:', error);
    return false;
  }
}

//! Helper function to get expense details from either default expenses or regular expense data
function getExpenseDetailsForSaving(expense, year, label, expenseData, defaultExpenses, department = null) {
  // First check if it's a default expense, considering department if provided
  let defaultExpense;
  if (department) {
    // If department is provided, find the default expense that matches both name and department
    defaultExpense = defaultExpenses.find(de => de.expense === expense && de.department === department);
  } else {
    // Fallback to finding by name only (for backward compatibility)
    defaultExpense = defaultExpenses.find(de => de.expense === expense);
  }
  
  if (defaultExpense) {
    return {
      department: defaultExpense.department || '',
      department_location: defaultExpense.department_location || '',
      cost_type: defaultExpense.cost_type || '',
      hospitality_category: defaultExpense.hospitality_category || ''
    };
  }
  
  // If not a default expense, look in regular expense data
  const details = findExpenseDetails(expenseData, expense, year, label);
  return {
    department: details.department || '',
    department_location: details.department_location || '',
    cost_type: details.cost_type || '',
    hospitality_category: details.hospitality_category || ''
  };
}

// ! Save changes to the database
export async function saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData, defaultExpenses = []) {
  if (changedCells.value.length === 0) return;
  
  // Ensure defaultExpenses is always an array
  if (!Array.isArray(defaultExpenses)) {
    console.warn('defaultExpenses is not an array, converting to empty array:', defaultExpenses);
    defaultExpenses = [];
  }
  
  // Get the currently selected project
  const currentProject = selectedProject.value
  
  if (!currentProject) {
    alertService.error("No project selected. Please select a project first.");
    return;
  }
  
  isSaving.value = true;
  saveError.value = "";
  try {
    const payload = changedCells.value.map(cell => {
      // Find the expense details by searching through the data
      // Use the department from the cell if available, otherwise fall back to the details lookup
      const details = getExpenseDetailsForSaving(cell.expense, cell.year, cell.label, expenseData.value, defaultExpenses, cell.department);
      
      // Check if this is a default expense, considering the department
      const isDefault = isDefaultExpense(cell.expense, defaultExpenses, cell.department);
      
      // Use the department from the cell if available, otherwise use the details lookup
      const finalDepartment = cell.department || details.department;
      
      return {
        year: cell.year,
        month: cell.label,
        expense: cell.expense,
        amount: parseFloat(cell.newValue),
        department: finalDepartment,
        department_location: details.department_location,
        cost_type: details.cost_type,
        hospitality_category: details.hospitality_category,
        is_default_expense: isDefault, // Add flag to indicate if this is a default expense
      };
    });
    
    // Debug logging to see what's being sent
    console.log('Saving expense changes with payload:', payload);
    console.log('Changed cells with department info:', changedCells.value);
    console.log('Default expenses for reference:', defaultExpenses);
    
    const response = await fetch("/api/method/ex_forcast.api.expense_estimate.upsert_expense_items", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-Frappe-CSRF-Token": frappe.csrf_token },
      body: JSON.stringify({ 
        changes: payload,
        project: currentProject.project_name
      })
    });
    const result = await response.json();
    // console.log('result', result);
    
    if (result.message?.status === "success") {
      alertService.success("Changes saved successfully!");
      isSaved.value = true;
      changedCells.value = [];
      const newData = await loadExpenseData();
      expenseData.value = newData;
      originalExpenseData.value = cloneDeep(newData);
    } else {
      const errorMsg = typeof result.message?.message === 'string' ? result.message.message : 'Save failed.';
      alertService.error(errorMsg);
    }
  } catch (err) {
    const errorMsg = typeof err.message === 'string' ? err.message : 'Save failed.';
    alertService.error(errorMsg);
  } finally {
    isSaving.value = false;
  }
} 