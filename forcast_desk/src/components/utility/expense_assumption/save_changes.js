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
function isDefaultExpense(expense, defaultExpenses) {
  // Ensure defaultExpenses is an array and has the some method
  if (!Array.isArray(defaultExpenses) || typeof defaultExpenses.some !== 'function') {
    console.warn('defaultExpenses is not an array:', defaultExpenses);
    return false;
  }
  
  try {
    return defaultExpenses.some(de => de.expense === expense);
  } catch (error) {
    console.error('Error checking if expense is default:', error);
    return false;
  }
}

//! Helper function to get expense details from either default expenses or regular expense data
function getExpenseDetailsForSaving(expense, year, label, expenseData, defaultExpenses) {
  // First check if it's a default expense
  const defaultExpense = defaultExpenses.find(de => de.expense === expense);
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
      const details = getExpenseDetailsForSaving(cell.expense, cell.year, cell.label, expenseData.value, defaultExpenses);
      
      // Check if this is a default expense
      const isDefault = isDefaultExpense(cell.expense, defaultExpenses);
      
      return {
        year: cell.year,
        month: cell.label,
        expense: cell.expense,
        amount: parseFloat(cell.newValue),
        department: details.department,
        department_location: details.department_location,
        cost_type: details.cost_type,
        hospitality_category: details.hospitality_category,
        is_default_expense: isDefault, // Add flag to indicate if this is a default expense
      };
    });
    
    // Debug logging to see what's being sent
    console.log('Saving expense changes with payload:', payload);
    
    const response = await fetch("/api/method/ex_forcast.api.expense_estimate.upsert_expense_items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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