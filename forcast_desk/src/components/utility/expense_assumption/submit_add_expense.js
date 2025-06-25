import { createExpenseDocument } from "@/components/utility/expense_assumption/index.js";

export async function submitAddExpense(addExpenseForm, showAddExpenseModal, resetExpenseForm, isSaved) {
  const { year, month, rows } = addExpenseForm.value;
  if (!year || !month || rows.length === 0) {
    alert('Please select year, month, and add at least one expense.');
    return;
  }
  const cleanRows = rows.filter(r => r.expense && r.amount > 0);
  const result = await createExpenseDocument({
    year,
    month,
    expenses: cleanRows
  });
  if (result.success) {
    alert(`Expense document created: ${result.name}`);
    showAddExpenseModal.value = false;
    resetExpenseForm();
    isSaved.value = true;
  } else {
    alert('Failed to create document: ' + (result.error?.message || result.error));
  }
} 