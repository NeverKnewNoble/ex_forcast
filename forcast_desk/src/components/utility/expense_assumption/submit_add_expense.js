import { createExpenseDocument } from "@/components/utility/expense_assumption/index.js";

export async function submitAddExpense(addExpenseForm, showAddExpenseModal, resetExpenseForm, isSaved, alertService, reloadData) {
  const { year, month, rows } = addExpenseForm.value;
  if (!year || !month || rows.length === 0) {
    alertService.error('Please select year, month, and add at least one expense.');
    return;
  }
  const cleanRows = rows.filter(r => r.expense && r.amount > 0);
  const result = await createExpenseDocument({
    year,
    month,
    expenses: cleanRows
  });
  if (result.success) {
    alertService.success(`Expense document created successfully: ${result.name}`);
    showAddExpenseModal.value = false;
    resetExpenseForm();
    
    // Reload expense data to show the newly added expenses
    if (reloadData) {
      await reloadData();
    }
    
    isSaved.value = true;
  } else {
    alertService.error('Failed to create document: ' + (result.error?.message || result.error));
  }
} 