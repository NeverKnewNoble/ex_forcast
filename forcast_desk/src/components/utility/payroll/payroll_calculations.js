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
    // Get the monthly salary value (already calculated as count * base salary)
    const monthlySalary = getPayrollCellValue(rowId, 'salary', year, month);
    total += monthlySalary;
  });
  return total;
}

/**
 *! Calculate sub-total for management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total count
 */
export function calculateSubTotalManagement(payrollRows, category, location) {
  const managementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Manager'
  );
  return managementRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 *! Calculate sub-total count for management positions
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
 *! Calculate monthly count for management positions
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
 *! Calculate monthly salary for management positions
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
    // Get the monthly salary value (already calculated as count * base salary)
    const monthlySalary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + monthlySalary;
  }, 0);
}

/**
 *! Calculate total for management positions in a year
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
 *! Calculate annual percentage for management positions
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
 *! Calculate sub-total for non-management positions
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Sub-total count
 */
export function calculateSubTotalNonManagement(payrollRows, category, location) {
  const nonManagementRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === 'Non-manager'
  );
  return nonManagementRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 *! Calculate sub-total count for non-management positions
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
 *! Calculate monthly count for non-management positions
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
 *! Calculate monthly salary for non-management positions
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
    // Get the monthly salary value (already calculated as count * base salary)
    const monthlySalary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + monthlySalary;
  }, 0);
}

/**
 *! Calculate total for non-management positions in a year
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
 *! Calculate annual percentage for non-management positions
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
 *! Calculate total for a location
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category filter
 * @param {string} location - Location filter
 * @returns {number} - Total count
 */
export function calculateLocationTotal(payrollRows, category, location) {
  const locationRows = payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  return locationRows.reduce((sum, row) => sum + row.count, 0);
}

/**
 *! Calculate total count for a location
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
 *! Calculate monthly count for a location
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
 *! Calculate monthly salary for a location
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
    // Get the monthly salary value (already calculated as count * base salary)
    const monthlySalary = getPayrollCellValue(row.id, 'salary', year, month);
    return sum + monthlySalary;
  }, 0);
}

/**
 *! Calculate total for a location in a year
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
 *! Calculate annual percentage for a location
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

/**
 *! Calculate total for entire hotel across all locations
 * @param {Array} payrollRows - Array of payroll rows
 * @returns {number} - Total count
 */
export function calculateHotelTotal(payrollRows) {
  // Debug logging
 //  // console.log('calculateHotelTotal called with:', { payrollRows: payrollRows?.length });
  
  if (!payrollRows || payrollRows.length === 0) {
   //  // console.log('No payroll rows found');
    return 0;
  }
  
  // Get all unique locations across all categories
  const locations = [...new Set(payrollRows.map(row => row.departmentLocation))];
 //  // console.log('Unique locations:', locations);
  
  // Sum up all location totals across all categories
  const total = locations.reduce((sum, location) => {
    const locationRows = payrollRows.filter(row => 
      row.departmentLocation === location
    );
    const locationTotal = locationRows.reduce((locationSum, row) => locationSum + (row.count || 0), 0);
   //  // console.log(`Location ${location} total:`, locationTotal);
    return sum + locationTotal;
  }, 0);
  
 //  // console.log('Hotel total:', total);
  return total;
}

/**
 *! Calculate monthly count for entire hotel
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly count
 */
export function calculateHotelTotalMonthlyCount(payrollRows, year, month, getPayrollCellValue) {
  // Get all unique locations across all categories
  const locations = [...new Set(payrollRows.map(row => row.departmentLocation))];
  
  // Sum up all location monthly counts
  return locations.reduce((sum, location) => {
    const locationRows = payrollRows.filter(row => 
      row.departmentLocation === location
    );
    return sum + locationRows.reduce((locationSum, row) => {
      const count = getPayrollCellValue(row.id, 'count', year, month);
      return locationSum + count;
    }, 0);
  }, 0);
}

/**
 *! Calculate monthly salary for entire hotel
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Monthly salary total
 */
export function calculateHotelTotalMonthlySalary(payrollRows, year, month, getPayrollCellValue) {
  // Get all unique locations across all categories
  const locations = [...new Set(payrollRows.map(row => row.departmentLocation))];
  
  // Sum up all location monthly salaries
  return locations.reduce((sum, location) => {
    const locationRows = payrollRows.filter(row => 
      row.departmentLocation === location
    );
    return sum + locationRows.reduce((locationSum, row) => {
      const monthlySalary = getPayrollCellValue(row.id, 'salary', year, month);
      return locationSum + monthlySalary;
    }, 0);
  }, 0);
}

/**
 *! Calculate total for entire hotel in a year
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {Function} calculatePayrollTotal - Function to calculate payroll total
 * @returns {number} - Total amount
 */
export function calculateHotelTotalTotal(payrollRows, year, calculatePayrollTotal) {
  // Get all unique locations across all categories
  const locations = [...new Set(payrollRows.map(row => row.departmentLocation))];
  
  // Sum up all location totals
  return locations.reduce((sum, location) => {
    const locationRows = payrollRows.filter(row => 
      row.departmentLocation === location
    );
    return sum + locationRows.reduce((locationSum, row) => {
      return locationSum + calculatePayrollTotal(row.id, year);
    }, 0);
  }, 0);
}

/**
 *! Calculate annual percentage for entire hotel
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @returns {number} - Average annual percentage
 */
export function calculateHotelTotalAnnual(payrollRows, year, getPayrollCellValue) {
  // Get all unique locations across all categories
  const locations = [...new Set(payrollRows.map(row => row.departmentLocation))];
  
  if (locations.length === 0) return 0;
  
  // Sum up all location annual percentages
  const totalAnnual = locations.reduce((sum, location) => {
    const locationRows = payrollRows.filter(row => 
      row.departmentLocation === location
    );
    if (locationRows.length === 0) return sum;
    const locationAnnual = locationRows.reduce((locationSum, row) => {
      const annual = getPayrollCellValue(row.id, 'annual', year, '');
      return locationSum + annual;
    }, 0);
    return sum + Math.round(locationAnnual / locationRows.length);
  }, 0);
  
  return Math.round(totalAnnual / locations.length);
}

/**
 *! Calculate employee/room ratio
 * @param {Array} payrollRows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {number} - Employee/room ratio
 */
export function calculateEmployeeRoomRatio(payrollRows, totalRooms = 100) {
  // Get hotel total (sum of all payroll rows across all categories)
  const hotelTotal = calculateHotelTotal(payrollRows);
  return totalRooms > 0 ? (hotelTotal / totalRooms).toFixed(2) : 0;
}

/**
 *! Calculate monthly employee/room ratio
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @param {number} totalRooms - Total number of rooms
 * @returns {number} - Monthly employee/room ratio
 */
export function calculateEmployeeRoomRatioMonthly(payrollRows, year, month, getPayrollCellValue, totalRooms = 100) {
  // Get hotel total monthly count (sum of all payroll rows across all categories)
  const hotelTotalMonthly = calculateHotelTotalMonthlyCount(payrollRows, year, month, getPayrollCellValue);
  return totalRooms > 0 ? (hotelTotalMonthly / totalRooms).toFixed(2) : 0;
}

/**
 *! Calculate monthly salary per room for employee/room ratio
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {string} month - Month to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @param {number} totalRooms - Total number of rooms
 * @returns {number} - Monthly salary per room
 */
export function calculateEmployeeRoomRatioSalary(payrollRows, year, month, getPayrollCellValue, totalRooms = 100) {
  // Get hotel total monthly salary (sum of all payroll rows across all categories)
  const hotelTotalSalary = calculateHotelTotalMonthlySalary(payrollRows, year, month, getPayrollCellValue);
  return totalRooms > 0 ? (hotelTotalSalary / totalRooms) : 0;
}

/**
 *! Calculate total salary per room for employee/room ratio in a year
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {Function} calculatePayrollTotal - Function to calculate payroll total
 * @param {number} totalRooms - Total number of rooms
 * @returns {number} - Total salary per room
 */
export function calculateEmployeeRoomRatioTotal(payrollRows, year, calculatePayrollTotal, totalRooms = 100) {
  // Get hotel total (sum of all payroll rows across all categories)
  const hotelTotal = calculateHotelTotalTotal(payrollRows, year, calculatePayrollTotal);
  return totalRooms > 0 ? (hotelTotal / totalRooms) : 0;
}

/**
 *! Calculate annual percentage per room for employee/room ratio
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} year - Year to calculate for
 * @param {Function} getPayrollCellValue - Function to get cell values
 * @param {number} totalRooms - Total number of rooms
 * @returns {number} - Annual percentage per room
 */
export function calculateEmployeeRoomRatioAnnual(payrollRows, year, getPayrollCellValue, totalRooms = 100) {
  // Get hotel total annual percentage (sum of all payroll rows across all categories)
  const hotelTotalAnnual = calculateHotelTotalAnnual(payrollRows, year, getPayrollCellValue);
  return totalRooms > 0 ? (hotelTotalAnnual / totalRooms) : 0;
} 