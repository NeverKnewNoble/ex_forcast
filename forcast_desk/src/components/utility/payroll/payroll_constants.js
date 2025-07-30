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
 * Sample payroll data for testing
 */
export const SAMPLE_PAYROLL_DATA = [
  {
    id: 1,
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Manager',
    designation: 'Front Office Manager',
    salary: 5000.00,
    count: 1,
    category: 'ROOMS'
  },
  {
    id: 2,
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Non-manager',
    designation: 'Receptionist',
    salary: 2500.00,
    count: 3,
    category: 'ROOMS'
  },
  {
    id: 3,
    department: 'ROOMS',
    departmentLocation: 'Housekeeping',
    position: 'Manager',
    designation: 'Housekeeping Manager',
    salary: 4000.00,
    count: 1,
    category: 'ROOMS'
  },
  {
    id: 4,
    department: 'ROOMS',
    departmentLocation: 'Housekeeping',
    position: 'Non-manager',
    designation: 'Room Attendant',
    salary: 2200.00,
    count: 8,
    category: 'ROOMS'
  },
  {
    id: 5,
    department: 'FOOD & BEVERAGE',
    departmentLocation: 'Restaurant',
    position: 'Manager',
    designation: 'Restaurant Manager',
    salary: 4500.00,
    count: 1,
    category: 'FOOD & BEVERAGE'
  },
  {
    id: 6,
    department: 'FOOD & BEVERAGE',
    departmentLocation: 'Restaurant',
    position: 'Non-manager',
    designation: 'Waiter',
    salary: 2000.00,
    count: 6,
    category: 'FOOD & BEVERAGE'
  },
  {
    id: 7,
    department: 'FOOD & BEVERAGE',
    departmentLocation: 'Kitchen',
    position: 'Manager',
    designation: 'Executive Chef',
    salary: 5500.00,
    count: 1,
    category: 'FOOD & BEVERAGE'
  },
  {
    id: 8,
    department: 'FOOD & BEVERAGE',
    departmentLocation: 'Kitchen',
    position: 'Non-manager',
    designation: 'Sous Chef',
    salary: 3500.00,
    count: 2,
    category: 'FOOD & BEVERAGE'
  }
];

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