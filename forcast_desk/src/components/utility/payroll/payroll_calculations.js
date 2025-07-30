// Payroll Calculations - Handles all payroll calculation functions

/**
 * Calculate total for a payroll row in a specific year
 * @param {number} rowId - The payroll row ID
 * @param {string} year - The year to calculate for
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Total amount
 */
export function calculatePayrollTotal(rowId, year, months, getPayrollCellValue) {
  let total = 0;
  
  // Safety check for months array
  if (!months || !Array.isArray(months)) {
    console.warn('calculatePayrollTotal: months parameter is undefined or not an array');
    return 0;
  }
  
  months.forEach(month => {
    const count = getPayrollCellValue(rowId, 'count', year, month);
    const salary = getPayrollCellValue(rowId, 'salary', year, month);
    total += count * salary;
  });
  return total;
}

/**
 * Calculate sub-total for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total amount
 */
export function calculateSubTotalManagement(payrollRows, category, location) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => sum + (row.salary * row.count), 0);
}

/**
 * Calculate sub-total count for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total count
 */
export function calculateSubTotalManagementCount(payrollRows, category, location) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 * Calculate monthly count for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly count
 */
export function calculateSubTotalManagementMonthlyCount(payrollRows, category, location, year, month, getPayrollCellValue) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    return sum + count;
  }, 0);
}

/**
 * Calculate monthly salary for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly salary total
 */
export function calculateSubTotalManagementMonthlySalary(payrollRows, category, location, year, month, getPayrollCellValue) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    const salary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + (count * salary);
  }, 0);
}

/**
 * Calculate total for management positions in a year
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} calculatePayrollTotal - Function to calculate payroll total
 * @returns {number} - Total amount
 */
export function calculateSubTotalManagementTotal(payrollRows, category, location, year, calculatePayrollTotal) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => {
    return sum + calculatePayrollTotal(row.id, year);
  }, 0);
}

/**
 * Calculate annual percentage for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Average annual percentage
 */
export function calculateSubTotalManagementAnnual(payrollRows, category, location, year, getPayrollCellValue) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  if (managementRows.length === 0) return 0;
  const totalAnnual = managementRows.reduce((sum, row) => {
    const annual = getPayrollCellValue(row.id, 'annual', year, '');
    return sum + annual;
  }, 0);
  return Math.round(totalAnnual / managementRows.length);
}

/**
 * Calculate sub-total for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total amount
 */
export function calculateSubTotalNonManagement(payrollRows, category, location) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => sum + (row.salary * row.count), 0);
}

/**
 * Calculate sub-total count for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total count
 */
export function calculateSubTotalNonManagementCount(payrollRows, category, location) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 * Calculate monthly count for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly count
 */ 
export function calculateSubTotalNonManagementMonthlyCount(payrollRows, category, location, year, month, getPayrollCellValue) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    return sum + count;
  }, 0);
}

/**
 * Calculate monthly salary for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly salary total
 */
export function calculateSubTotalNonManagementMonthlySalary(payrollRows, category, location, year, month, getPayrollCellValue) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    const salary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + (count * salary);
  }, 0);
}

/**
 * Calculate total for non-management positions in a year
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} calculatePayrollTotal - Function to calculate payroll total
 * @returns {number} - Total amount
 */
export function calculateSubTotalNonManagementTotal(payrollRows, category, location, year, calculatePayrollTotal) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => {
    return sum + calculatePayrollTotal(row.id, year);
  }, 0);
}

/**
 * Calculate annual percentage for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Average annual percentage
 */
export function calculateSubTotalNonManagementAnnual(payrollRows, category, location, year, getPayrollCellValue) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  if (nonManagementRows.length === 0) return 0;
  const totalAnnual = nonManagementRows.reduce((sum, row) => {
    const annual = getPayrollCellValue(row.id, 'annual', year, '');
    return sum + annual;
  }, 0);
  return Math.round(totalAnnual / nonManagementRows.length);
}

/**
 * Calculate total for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Total amount
 */
export function calculateLocationTotal(payrollRows, category, location) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => sum + (row.salary * row.count), 0);
}

/**
 * Calculate total count for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Total count
 */
export function calculateLocationTotalCount(payrollRows, category, location) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 * Calculate monthly count for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly count
 */
export function calculateLocationTotalMonthlyCount(payrollRows, category, location, year, month, getPayrollCellValue) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    return sum + count;
  }, 0);
}

/**
 * Calculate monthly salary for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly salary total
 */
export function calculateLocationTotalMonthlySalary(payrollRows, category, location, year, month, getPayrollCellValue) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => {
    const count = getPayrollCellValue(row.id, 'count', year, month);
    const salary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + (count * salary);
  }, 0);
}

/**
 * Calculate total for a location in a year
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} calculatePayrollTotal - Function to calculate payroll total
 * @returns {number} - Total amount
 */
export function calculateLocationTotalTotal(payrollRows, category, location, year, calculatePayrollTotal) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => {
    return sum + calculatePayrollTotal(row.id, year);
  }, 0);
}

/**
 * Calculate annual percentage for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @param {string} year - Year to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Average annual percentage
 */
export function calculateLocationTotalAnnual(payrollRows, category, location, year, getPayrollCellValue) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  if (locationRows.length === 0) return 0;
  const totalAnnual = locationRows.reduce((sum, row) => {
    const annual = getPayrollCellValue(row.id, 'annual', year, '');
    return sum + annual;
  }, 0);
  return Math.round(totalAnnual / locationRows.length);
} 