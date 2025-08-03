// Payroll Constants - Handles constants and configuration data

/**
 * Payroll categories
 */
export const PAYROLL_CATEGORIES = [
  'ROOMS',
  'FOOD & BEVERAGE',
  'OTHER OPERATING DEPARTMENTS',
  'ADMINISTRATION & GENERAL',
  'INFORMATION & TELECOMMUNICATION SYSTEMS',
  'SALES & MARKETING',
  'POM'
];

/**
 * Position types
 */
export const POSITION_TYPES = [
  'Manager',
  'Non-manager'
];

/**
 * Default payroll data structure
 */
export const DEFAULT_PAYROLL_ROW = {
  department: '',
  departmentLocation: '',
  position: '',
  designation: '',
  salary: 0,
  count: 0,
  category: ''
};



/**
 * Field types for payroll data
 */
export const FIELD_TYPES = {
  COUNT: 'count',
  SALARY: 'salary',
  ANNUAL: 'annual'
};

/**
 * Position types for filtering
 */
export const POSITION_FILTERS = {
  MANAGER: 'Manager',
  NON_MANAGER: 'Non-manager'
}; 