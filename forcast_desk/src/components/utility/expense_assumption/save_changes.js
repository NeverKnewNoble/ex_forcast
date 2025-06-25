import alertService from "@/components/ui/alertService.js";
import { cloneDeep } from 'lodash-es';

export async function saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData) {
  if (changedCells.value.length === 0) return;
  isSaving.value = true;
  saveError.value = "";
  try {
    const payload = changedCells.value.map(cell => {
      const entry = (expenseData.value?.[cell.year]?.[cell.label] || []).find(e => e.expense === cell.expense);
      return {
        year: cell.year,
        month: cell.label,
        expense: cell.expense,
        code: entry?.code || "",
        amount: parseFloat(cell.newValue),
        hospitality_category: entry?.category || "",
        cost_type: entry?.['cost type'] || "",
        root_type: entry?.['root type'] || ""
      };
    });
    const response = await fetch("/api/method/ex_forcast.api.expense_estimate.upsert_expense_items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ changes: payload })
    });
    const result = await response.json();
    if (result.status === "success") {
      alertService.success("Changes saved successfully!");
      isSaved.value = true;
      changedCells.value = [];
      const newData = await loadExpenseData();
      expenseData.value = newData;
      originalExpenseData.value = cloneDeep(newData);
    } else {
      const errorMsg = typeof result.message === 'string' ? result.message : 'Save failed.';
      alertService.error(errorMsg);
    }
  } catch (err) {
    const errorMsg = typeof err.message === 'string' ? err.message : 'Save failed.';
    alertService.error(errorMsg);
  } finally {
    isSaving.value = false;
  }
} 