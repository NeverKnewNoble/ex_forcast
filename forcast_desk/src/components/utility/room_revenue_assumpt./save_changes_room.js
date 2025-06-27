import alertService from "@/components/ui/alertService.js";
import { cloneDeep } from 'lodash-es';


export async function saveChangesRoomRevenue(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData) {
  try {
    isSaving.value = true;
    saveError.value = "";
    const updatedData = cloneDeep(expenseData.value);
    const originalData = cloneDeep(originalExpenseData.value);
  } catch (error) {
    console.error("Error saving changes:", error);
    saveError.value = "Failed to save changes. Please try again.";
  } finally {
    isSaving.value = false;
  }
}