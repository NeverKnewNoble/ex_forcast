// Payroll Module Index - Exports all payroll-related functions and constants

// Export from payroll_data_service.js
export {
  showAddPayrollModal,
  isSubmittingPayroll,
  payrollModalError,
  addPayrollForm,
  departmentOptions,
  departmentLocationOptions,
  designationOptions,
  months,
  payrollData,
  payrollRows,
  openAddPayrollModal,
  closeAddPayrollModal,
  resetPayrollForm,
  addPayrollRow,
  removePayrollRow,
  submitPayrollData,
  loadDepartmentOptions,
  loadDepartmentLocationOptions,
  loadDesignationOptions,
  fetchPayrollData,
  savePayrollChanges
} from './payroll_data_service.js';

// Export from payroll_calculations.js
export {
  calculatePayrollTotal,
  calculateSubTotalManagement,
  calculateSubTotalManagementCount,
  calculateSubTotalManagementMonthlyCount,
  calculateSubTotalManagementMonthlySalary,
  calculateSubTotalManagementTotal,
  calculateSubTotalManagementAnnual,
  calculateSubTotalNonManagement,
  calculateSubTotalNonManagementCount,
  calculateSubTotalNonManagementMonthlyCount,
  calculateSubTotalNonManagementMonthlySalary,
  calculateSubTotalNonManagementTotal,
  calculateSubTotalNonManagementAnnual,
  calculateLocationTotal,
  calculateLocationTotalCount,
  calculateLocationTotalMonthlyCount,
  calculateLocationTotalMonthlySalary,
  calculateLocationTotalTotal,
  calculateLocationTotalAnnual
} from './payroll_calculations.js';

// Export from payroll_data_utils.js
export {
  getUniqueCategories,
  getPayrollRowsForCategory,
  getUniqueLocationsForCategory,
  getUniquePositionsForLocation,
  getPayrollRowsForPosition,
  getPayrollRowsForLocation,
  formatCurrency,
  getPayrollCellValue,
  handlePayrollCellEdit,
  addSamplePayrollData,
  resetToDefault,
  hasPayrollData
} from './payroll_data_utils.js';

// Export from payroll_constants.js
export {
  PAYROLL_CATEGORIES,
  POSITION_TYPES,
  DEFAULT_PAYROLL_ROW,
  SAMPLE_PAYROLL_DATA,
  FIELD_TYPES,
  POSITION_FILTERS
} from './payroll_constants.js'; 