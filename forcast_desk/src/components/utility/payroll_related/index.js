// Payroll Related Data Constructors Index
// Centralized exports for all payroll related data constructor functions

export {
  PayrollRelatedDataConstructor,
  payrollRelatedDataConstructor
} from './data_constructors/payrollRelatedDataConstructor.js';

// Export calculation functions
export {
  calculatePayrollTaxes,
  calculateSupplementaryPay,
  calculateEmployeeBenefits,
  calculateTotalPayrollRelated,
  calculateManagementSubtotals,
  calculateNonManagementSubtotals,
  calculateLocationTotals,
  calculateHotelTotals,
  calculateEmployeeRoomRatio
} from './related_calculations.js';

// Export utility functions
export {
  transformRelatedApiToFrontend,
  transformRelatedFrontendToApi,
  validateRelatedData,
  getRelatedFieldValue,
  setRelatedFieldValue,
  createDefaultRelatedRow,
  getRequiredFieldsForPageType,
  calculateRelatedTotals,
  formatCurrency,
  formatPercentage,
  allowOnlyNumbers,
  allowOnlyNumbersAndDecimal,
  findMatchingPayrollRow,
  generateRelatedRowId,
  hasRelatedDataChanges,
  getRelatedDataSummary
} from './related_utils.js';
