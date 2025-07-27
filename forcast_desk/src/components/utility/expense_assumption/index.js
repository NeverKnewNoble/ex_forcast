// Expense Assumption Utilities - Main Export File

// Core expense calculations and formulas
export {
  getVisibleYears,
  getColumnLabels,
  getAmount,
  calculateTotal,
  monthLabels,
  quarterLabels,
  yearsCount
} from './expense_formular.js';

// Modal and form management
export {
  showAddExpenseModal,
  addExpenseForm,
  addExpenseRow,
  removeExpenseRow,
  cancelAddExpense,
  resetExpenseForm
} from './expense_modal.js';

// Document creation
export { createExpenseDocument } from './create_expense.js';

// Data loading and API services
export {
  loadYearOptions,
  loadExpenseData,
  loadAllExpensesAndCategories,
  extractAllExpenses
} from './data_service.js';

// Save changes functionality
export { saveChanges } from './save_changes.js';

// Table display and interaction
export {
  collapsedYears,
  toggleCollapse,
  isYearCollapsed,
  getFilteredExpenses,
  getExpensesGroupedByCategory,
  getAllExpensesGroupedByCategory,
  getExpenseDetails,
  getExpenseDetailsFromAllExpenses,
  getAmountForExpense,
  calculateTotalForExpense,
  extractFieldOptionsFromData
} from './table_utils.js';

// Advanced settings management
export {
  showAdvanced,
  advancedModes,
  initializeAdvancedModes,
  applyAdvancedSettings,
  getColumnLabelsForYear
} from './advanced_settings.js';

// Filter and validation utilities
export {
  validateYearRange,
  generateYearOptions,
  getMonthOptions,
  months
} from './filter_utils.js'; 

// Get Expenses and Revenue List From Accounts
export { 
  getExpenseList 
} from './expense_list.js';

// Get Expense Field Options
export { 
  getExpenseFieldOptions 
} from './expense_options.js';