import alertService from "@/components/ui/alertService.js";
import { cloneDeep } from 'lodash-es';

//! Helper function to find expense details from data
function findExpenseDetails(expenseData, expense, year, month) {
  // First try to find in the specific year and month
  const entries = expenseData?.[year]?.[month] || [];
  const found = entries.find(e => e.expense === expense);
  if (found) {
    return {
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
          hospitality_category: monthFound.hospitality_category || "",
          cost_type: monthFound.cost_type || ""
        };
      }
    }
  }
  
  // Return empty strings if not found anywhere
  return {
    hospitality_category: "",
    cost_type: ""
  };
}



// ! Save changes to the database
export async function saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData) {
  if (changedCells.value.length === 0) return;
  isSaving.value = true;
  saveError.value = "";
  try {
    const payload = changedCells.value.map(cell => {
      // Find the expense details by searching through the data
      const details = findExpenseDetails(expenseData.value, cell.expense, cell.year, cell.label);
      
      return {
        year: cell.year,
        month: cell.label,
        expense: cell.expense,
        amount: parseFloat(cell.newValue),
        hospitality_category: details.hospitality_category,
        cost_type: details.cost_type,
      };
    });
    // console.log('payload', payload);
    const response = await fetch("/api/method/ex_forcast.api.expense_estimate.upsert_expense_items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes: payload })
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