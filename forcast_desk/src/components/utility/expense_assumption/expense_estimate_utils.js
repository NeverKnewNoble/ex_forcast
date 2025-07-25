// import { getColumnLabels, getAmountForExpense, loadExpenseData, createExpenseDocument } from "@/components/utility/expense_assumption/index.js";
import { getColumnLabels, getAmountForExpense} from "@/components/utility/expense_assumption/index.js";


// Calculate total for a category in a specific year
export function calculateCategoryTotal(expenseData, expenses, year, displayMode, advancedModes) {
  const months = getColumnLabels(advancedModes?.[year] || displayMode);
  let total = 0;
  for (const expense of expenses) {
    for (const month of months) {
      const rawAmount = getAmountForExpense(expenseData, expense, year, month, advancedModes?.[year] || displayMode);
      const amt = parseFloat(rawAmount.toString().replace(/,/g, ''));
      if (!isNaN(amt)) total += amt;
    }
  }
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Calculate total for a category in a specific month and year
export function calculateCategoryMonthTotal(expenseData, expenses, year, label, displayMode) {
  let total = 0;
  for (const expense of expenses) {
    const rawAmount = getAmountForExpense(expenseData, expense, year, label, displayMode);
    const amt = parseFloat(rawAmount.toString().replace(/,/g, ''));
    if (!isNaN(amt)) total += amt;
  }
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format amount input to show commas for better readability
export function formatAmountInput(index, addExpenseForm, event) {
  if (!addExpenseForm || !addExpenseForm.value || !addExpenseForm.value.rows) {
    console.warn('addExpenseForm is not properly initialized');
    return;
  }
  
  const row = addExpenseForm.value.rows[index];
  if (!row) {
    console.warn(`Row at index ${index} not found`);
    return;
  }
  
  let value = row.amountDisplay;
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  const shouldFormat = !value.includes('.') || (parts.length === 2 && parts[1].length === 2);
  if (shouldFormat) {
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    const numValue = parseFloat(value) || 0;
    const formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (formattedValue !== event.target.innerText) {
      event.target.innerText = formattedValue;
      const range = document.createRange();
      const selection = window.getSelection();
      const textNode = event.target.firstChild || event.target;
      range.setStart(textNode, textNode.textContent.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    if (value !== event.target.innerText) {
      event.target.innerText = value;
    }
  }
}

// Clean amount value when input loses focus
export function cleanAmountValue(index, addExpenseForm) {
  if (!addExpenseForm || !addExpenseForm.value || !addExpenseForm.value.rows) {
    console.warn('addExpenseForm is not properly initialized');
    return;
  }
  
  const row = addExpenseForm.value.rows[index];
  if (!row) {
    console.warn(`Row at index ${index} not found`);
    return;
  }
  
  const numValue = parseFloat(row.amountDisplay.replace(/[^\d.]/g, '')) || 0;
  row.amountDisplay = numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  row.amount = numValue;
}

// Handler for cell edits
export function handleCellEdit({ year, label, expense, event, originalExpenseData, changedCells, expenseData, isSaved }) {
  let newValue = event.target.innerText.replace(/,/g, '').trim();
  if (newValue === '') newValue = '0.00';
  const numValue = parseFloat(newValue) || 0;
  newValue = numValue.toFixed(2);
  let original = '0.00';
  const entries = originalExpenseData.value?.[year]?.[label] || [];
  const found = entries.find(e => e.expense === expense);
  if (found) original = parseFloat(found.amount).toFixed(2);
  if (newValue !== original) {
    isSaved.value = false;
    const idx = changedCells.value.findIndex(c => c.year === year && c.label === label && c.expense === expense);
    if (idx !== -1) {
      changedCells.value[idx].newValue = newValue;
    } else {
      changedCells.value.push({ year, label, expense, newValue });
    }
    const dataEntries = expenseData.value?.[year]?.[label] || [];
    const dataFound = dataEntries.find(e => e.expense === expense);
    if (dataFound) {
      dataFound.amount = parseFloat(newValue);
    }
  } else {
    changedCells.value = changedCells.value.filter(c => !(c.year === year && c.label === label && c.expense === expense));
    if (changedCells.value.length === 0) isSaved.value = true;
  }
}

// Handler for cell input (real-time formatting)
export function handleCellInput({ year, label, expense, event }) {
  let value = event.target.innerText;
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  const shouldFormat = !value.includes('.') || (parts.length === 2 && parts[1].length === 2);
  if (shouldFormat) {
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    const numValue = parseFloat(value) || 0;
    const formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (formattedValue !== event.target.innerText) {
      event.target.innerText = formattedValue;
      const range = document.createRange();
      const selection = window.getSelection();
      const textNode = event.target.firstChild || event.target;
      range.setStart(textNode, textNode.textContent.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    if (value !== event.target.innerText) {
      event.target.innerText = value;
    }
  }
}

// Handler for cell focus (show raw value for editing)
export function handleCellFocus({ year, label, expense, event }) {
  let value = event.target.innerText;
  const rawValue = value.replace(/,/g, '');
  event.target.innerText = rawValue;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(event.target);
  selection.removeAllRanges();
  selection.addRange(range);
}
