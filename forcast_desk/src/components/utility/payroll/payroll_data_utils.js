// Payroll Data Utils - Handles data manipulation and utility functions

/**
 * Get unique categories from payroll rows
 * @param {Array} payrollRows - Array of payroll rows
 * @returns {Array} - Array of unique categories
 */
export function getUniqueCategories(payrollRows) {
  const uniqueCategories = new Set();
  payrollRows.forEach(row => {
    uniqueCategories.add(row.category);
  });
  return Array.from(uniqueCategories);
}

/**
 * Get payroll rows for a specific category
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category to filter by
 * @returns {Array} - Filtered payroll rows
 */
export function getPayrollRowsForCategory(payrollRows, category) {
  return payrollRows.filter(row => row.category === category);
}

/**
 * Get unique locations for a specific category
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category to filter by
 * @returns {Array} - Array of unique locations
 */
export function getUniqueLocationsForCategory(payrollRows, category) {
  const uniqueLocations = new Set();
  payrollRows
    .filter(row => row.category === category)
    .forEach(row => {
      uniqueLocations.add(row.departmentLocation);
    });
  return Array.from(uniqueLocations);
}

/**
 * Get unique positions for a specific location within a category
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category to filter by
 * @param {string} location - Location to filter by
 * @returns {Array} - Array of unique positions
 */
export function getUniquePositionsForLocation(payrollRows, category, location) {
  const uniquePositions = new Set();
  payrollRows
    .filter(row => row.category === category && row.departmentLocation === location)
    .forEach(row => {
      uniquePositions.add(row.position);
    });
  return Array.from(uniquePositions);
}

/**
 * Get payroll rows for a specific position within a location and category
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category to filter by
 * @param {string} location - Location to filter by
 * @param {string} position - Position to filter by
 * @returns {Array} - Filtered payroll rows
 */
export function getPayrollRowsForPosition(payrollRows, category, location, position) {
  return payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    row.position === position
  );
}

/**
 * Get payroll rows for a specific location within a category
 * @param {Array} payrollRows - Array of payroll rows
 * @param {string} category - Category to filter by
 * @param {string} location - Location to filter by
 * @returns {Array} - Filtered payroll rows
 */
export function getPayrollRowsForLocation(payrollRows, category, location) {
  return payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
}

/**
 * Format currency value
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Get payroll cell value
 * @param {Array} payrollRows - Array of payroll rows
 * @param {Object} payrollData - Payroll data object
 * @param {number} rowId - Row ID
 * @param {string} fieldType - Field type (count, salary, annual)
 * @param {string} year - Year
 * @param {string} month - Month (optional for annual)
 * @returns {number} - Cell value
 */
export function getPayrollCellValue(payrollRows, payrollData, rowId, fieldType, year, month) {
  const row = payrollRows.find(r => r.id === rowId);
  if (!row) return 0;
  
  if (fieldType === 'count') {
    // ✅ FIXED: Proper separation between base count and monthly overrides
    
    // For monthly count cells, check for overrides first
    if (month) {
      const countData = payrollData[year]?.[rowId]?.[fieldType];
      
      // Check if there's a monthly override for this specific month
      if (countData && typeof countData === 'object' && countData !== null) {
        const overrideValue = countData[month];
        if (overrideValue !== undefined && overrideValue !== null) {
          return overrideValue; // Return the override value
        }
      }
      
      // If no override exists, return the base count (getter behavior)
      return row.count || 0;
    }
    
    // For non-monthly contexts (like the main count column), return the base count
    return row.count || 0;
  } else if (fieldType === 'salary') {
    // For salary field, first check if there's specific data in payrollData
    const specificValue = payrollData[year]?.[rowId]?.[fieldType];
    if (specificValue !== undefined && specificValue !== null) {
      return specificValue;
    }
    // If no specific data found, calculate as row's salary * monthly count
    const monthlyCount = getPayrollCellValue(payrollRows, payrollData, rowId, 'count', year, month);
    const calculatedSalary = (row.salary || 0) * monthlyCount;
    
    return calculatedSalary;
  } else if (fieldType === 'annual') {
    // For annual percentage increment
    return payrollData[year]?.[rowId]?.[fieldType] || 0;
  }
  return 0;
}

/**
 * Handle payroll cell edit
 * @param {Array} changedCells - Array to track changed cells
 * @param {number} rowId - Row ID
 * @param {string} fieldType - Field type
 * @param {string} year - Year
 * @param {string} month - Month (optional)
 * @param {Event} event - Input event
 * @returns {Array} - Updated changed cells array
 */
export function handlePayrollCellEdit(changedCells, rowId, fieldType, year, month, event) {
  const newValue = parseFloat(event.target.textContent) || 0;
  
  // Format the display with commas for salary and annual fields
  if (fieldType === 'salary' || fieldType === 'annual') {
    if (!isNaN(newValue)) {
      event.target.textContent = newValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      event.target.textContent = '0.00';
    }
  }
  
  // ✅ FIXED: Proper handling of monthly count overrides
  // For count fields with month, this is a monthly override
  // For count fields without month, this is a base count update
  const changeData = {
    rowId,
    fieldType,
    year,
    month,
    newValue,
    isOverride: fieldType === 'count' && month // Mark if this is a monthly override
  };
  
  const existingChangeIndex = changedCells.findIndex(
    cell => cell.rowId === rowId && cell.fieldType === fieldType && cell.year === year && cell.month === month
  );
  
  if (existingChangeIndex >= 0) {
    changedCells[existingChangeIndex] = changeData;
  } else {
    changedCells.push(changeData);
  }
  
  return changedCells;
}

/**
 * Save payroll changes (deprecated - use savePayrollChanges from payroll_data_service.js)
 * @param {Array} changes - Array of changes to save
 * @param {string} projectName - Project name
 * @returns {Promise<boolean>} - Success status
 */
export async function savePayrollChanges(changes, projectName) {
  // This function is deprecated - use the one from payroll_data_service.js
  console.warn('savePayrollChanges from payroll_data_utils.js is deprecated. Use the one from payroll_data_service.js');
  return true;
}

/**
 * Add sample payroll data
 * @param {Array} payrollRows - Array to add sample data to
 * @returns {Array} - Updated payroll rows array
 */
export function addSamplePayrollData(payrollRows) {
  const sampleData = [
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
  
  payrollRows.push(...sampleData);
  return payrollRows;
}

/**
 * Reset payroll data to default
 * @param {Array} payrollRows - Array to reset
 * @returns {Array} - Empty payroll rows array
 */
export function resetToDefault(payrollRows) {
  payrollRows.length = 0;
  return payrollRows;
}

/**
 * Check if there's any payroll data
 * @param {Array} payrollRows - Array of payroll rows
 * @returns {boolean} - Whether there's payroll data
 */
export function hasPayrollData(payrollRows) {
  return payrollRows.length > 0;
} 