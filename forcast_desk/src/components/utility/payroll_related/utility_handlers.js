// Payroll Related Utility Handlers
// Handles utility functions for payroll related data

import { getProjectKey } from '@/components/utility/projectLocalStorage.js';
import alertService from "@/components/ui/ui_utility/alertService.js";

/**
 *! Allow only numbers and decimal point for input validation
 * @param {Event} event - Input event
 */
export function allowOnlyNumbersAndDecimal(event) {
  const key = event.key;
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace', 'Delete', 'Tab', 'Enter'];
  
  if (!allowedKeys.includes(key)) {
    event.preventDefault();
  }
  
  // Prevent multiple decimal points
  if (key === '.' && event.target.textContent.includes('.')) {
    event.preventDefault();
  }
}

/**
 *! Check if total rooms is synced with Room Revenue page
 * @param {number} totalRooms - Current total rooms value
 * @returns {boolean} - Whether synced with room revenue
 */
export function isSyncedWithRoomRevenue(totalRooms) {
  const roomRevenueTotal = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  return roomRevenueTotal && parseInt(roomRevenueTotal) > 0 && 
         parseInt(roomRevenueTotal) === totalRooms;
}

/**
 *! Handle total rooms change
 * @param {Event} event - Input event
 * @param {Ref} totalRooms - Total rooms ref
 */
export function handleTotalRoomsChange(event, totalRooms) {
  const value = parseInt(event.target.value) || 1;
  if (value < 1) {
    totalRooms.value = 1;
  } else {
    totalRooms.value = value;
  }
}

/**
 *! Handle total rooms blur
 * @param {Event} event - Blur event
 * @param {Ref} totalRooms - Total rooms ref
 */
export function handleTotalRoomsBlur(event, totalRooms) {
  const value = parseInt(event.target.value) || 1;
  totalRooms.value = Math.max(1, value);
  localStorage.setItem('totalRooms', totalRooms.value.toString());
}

/**
 *! Sync with Room Revenue total
 * @param {Ref} totalRooms - Total rooms ref
 */
export function syncWithRoomRevenue(totalRooms) {
  const roomRevenueTotal = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  if (roomRevenueTotal && parseInt(roomRevenueTotal) > 0) {
    const newTotal = parseInt(roomRevenueTotal);
    totalRooms.value = newTotal;
    localStorage.setItem('totalRooms', newTotal.toString());
    alertService.success(`Synced With Room Revenue Room Total`);
  } else {
    alertService.warning('No Room Revenue total found. Please set a total in the Room Revenue page first.');
  }
}

/**
 *! Refresh table functionality - reload entire page
 */
export function refreshTable() {
  // Set flag to show success alert after reload
  localStorage.setItem('showRefreshSuccess', 'true');
  // Reload the entire page
  window.location.reload();
}

/**
 *! Handle beforeunload event to show warning
 * @param {Event} event - Beforeunload event
 * @param {Ref} isSaved - Is saved ref
 * @returns {string} - Warning message
 */
export function handleBeforeUnload(event, isSaved) {
  if (!isSaved.value) {
    // Standard browser warning
    event.preventDefault();
    event.returnValue = 'You have unsaved changes that may be discarded if not saved. Are you sure you want to leave?';
    return event.returnValue;
  }
}

/**
 *! Apply advanced settings
 * @param {Ref} tempAdvancedModes - Temporary advanced modes
 * @param {Ref} showAdvanced - Show advanced modal
 * @param {Function} setAdvancedModes - Set advanced modes function
 */
export function applyAdvancedSettings(tempAdvancedModes, showAdvanced, setAdvancedModes) {
  setAdvancedModes({ ...tempAdvancedModes.value });
  showAdvanced.value = false;
}

/**
 *! Cancel advanced settings
 * @param {Ref} showAdvanced - Show advanced modal
 */
export function cancelAdvancedSettings(showAdvanced) {
  showAdvanced.value = false;
}

/**
 *! Clear year selection
 * @param {Function} clearYearSettings - Clear year settings function
 * @param {Ref} isSaved - Is saved ref
 */
export function clearYearSelection(clearYearSettings, isSaved) {
  clearYearSettings();
  isSaved.value = false;
}

/**
 *! Helper function to ensure count data structure is correct
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @param {Ref} payrollData - Payroll data ref
 */
export function ensureCountDataStructure(rowId, year, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('ensureCountDataStructure: payrollData is undefined or null');
    return;
  }
  
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  if (typeof payrollData.value[year][rowId]['count'] !== 'object' || 
      payrollData.value[year][rowId]['count'] === null ||
      Array.isArray(payrollData.value[year][rowId]['count'])) {
    payrollData.value[year][rowId]['count'] = {};
  }
}

/**
 *! Helper function to ensure salary data structure is correct
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @param {Ref} payrollData - Payroll data ref
 */
export function ensureSalaryDataStructure(rowId, year, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('ensureSalaryDataStructure: payrollData is undefined or null');
    return;
  }
  
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  if (typeof payrollData.value[year][rowId]['salary'] !== 'object' || 
      payrollData.value[year][rowId]['salary'] === null ||
      Array.isArray(payrollData.value[year][rowId]['salary'])) {
    payrollData.value[year][rowId]['salary'] = {};
  }
}

/**
 *! Function to get monthly count value with getter/setter pattern
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @param {string} month - Month
 * @param {Ref} payrollRows - Payroll rows ref
 * @param {Ref} payrollData - Payroll data ref
 * @returns {number} - Monthly count value
 */
export function getMonthlyCountValue(rowId, year, month, payrollRows, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('getMonthlyCountValue: payrollData is undefined or null');
    return 0;
  }
  
  const row = payrollRows.value.find(r => r.id === rowId);
  if (!row) return 0;
  
  // Ensure the data structure is correct
  ensureCountDataStructure(rowId, year, payrollData);
  
  // Check if there's an override for this specific month
  const countData = payrollData.value[year]?.[rowId]?.['count'];
  if (countData && typeof countData === 'object' && countData !== null && !Array.isArray(countData)) {
    const overrideValue = countData[month];
    if (overrideValue !== undefined && overrideValue !== null) {
      return overrideValue;
    }
  }
  
  // If no override exists, return the main count value (getter behavior)
  return row.count || 0;
}

/**
 *! Function to set monthly count value with getter/setter pattern
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @param {string} month - Month
 * @param {number} newValue - New value
 * @param {Ref} payrollData - Payroll data ref
 */
export function setMonthlyCountValue(rowId, year, month, newValue, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('setMonthlyCountValue: payrollData is undefined or null');
    return;
  }
  
  // Ensure the data structure is correct
  ensureCountDataStructure(rowId, year, payrollData);
  
  // Store the override value for this specific month
  payrollData.value[year][rowId]['count'][month] = newValue;
}

/**
 *! Handle payroll cell edit local
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Field type
 * @param {string} year - Year
 * @param {string} month - Month
 * @param {Event} event - Input event
 * @param {Ref} payrollData - Payroll data ref
 * @param {Ref} changedCells - Changed cells ref
 * @param {Ref} isSaved - Is saved ref
 * @param {Function} handlePayrollCellEdit - Handle payroll cell edit function
 * @param {Function} nextTick - Next tick function
 */
export function handlePayrollCellEditLocal(rowId, fieldType, year, month, event, payrollData, changedCells, isSaved, handlePayrollCellEdit, nextTick) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('handlePayrollCellEditLocal: payrollData is undefined or null');
    return;
  }
  
  const newValue = parseFloat(event.target.textContent) || 0;
  
  // Store the value in payrollData for immediate reactivity
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  
  // For count fields, use the setter pattern
  if (fieldType === 'count' && month) {
    // Use the setter function to store the override value
    setMonthlyCountValue(rowId, year, month, newValue, payrollData);
  } else {
    // For other fields, store globally
    payrollData.value[year][rowId][fieldType] = newValue;
  }
  
  // Call the original handler for change tracking
  // This will add the change to changedCells array for saving to backend
  handlePayrollCellEdit(changedCells.value, rowId, fieldType, year, month, event);
  isSaved.value = false;
  
  // If this is a count field change, trigger reactive update for salary cells
  if (fieldType === 'count' && month) {
    // Force a reactive update by triggering a small change to the payrollData
    // This will cause Vue to re-evaluate the salary cells
    payrollData.value[year][rowId]._lastUpdate = Date.now();
    
    // Also trigger a more explicit update for the specific month
    if (!payrollData.value[year][rowId].monthlyUpdates || 
        typeof payrollData.value[year][rowId].monthlyUpdates !== 'object' ||
        Array.isArray(payrollData.value[year][rowId].monthlyUpdates)) {
      payrollData.value[year][rowId].monthlyUpdates = {};
    }
    payrollData.value[year][rowId].monthlyUpdates[month] = Date.now();
    
    // Force reactivity for salary calculations by updating the salary field
    // This ensures Vue detects the dependency change
    const row = payrollRows.value.find(r => r.id === rowId);
    if (row) {
      // Trigger a reactive update by accessing the salary calculation
      const countValue = getMonthlyCountValue(rowId, year, month, payrollRows, payrollData);
      const calculatedSalary = (countValue || 0) * (row.salary || 0);
      
      // Store this in payrollData to ensure reactivity
      ensureSalaryDataStructure(rowId, year, payrollData);
      payrollData.value[year][rowId].salary[month] = calculatedSalary;
      
      // Force a reactive update by triggering nextTick
      nextTick(() => {
        // This will ensure Vue re-evaluates the salary cells
        payrollData.value[year][rowId]._forceUpdate = Date.now();
      });
    }
  }
}

/**
 *! Handle payroll cell input
 * @param {string} fieldType - Field type
 * @param {Event} event - Input event
 */
export function handlePayrollCellInput(fieldType, event) {
  // Allow only numbers and decimal point for salary and annual fields
  if (fieldType === 'salary' || fieldType === 'annual') {
    const value = event.target.textContent.replace(/[^0-9.]/g, '');
    event.target.textContent = value;
  }
  // Allow only numbers for count fields
  if (fieldType === 'count') {
    const value = event.target.textContent.replace(/[^0-9]/g, '');
    event.target.textContent = value;
  }
}

/**
 *! Handle payroll cell focus
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Field type
 * @param {string} year - Year
 * @param {string} month - Month
 * @param {Event} event - Focus event
 * @param {Function} getPayrollCellValueLocal - Get payroll cell value local function
 */
export function handlePayrollCellFocus(rowId, fieldType, year, month, event, getPayrollCellValueLocal) {
  // Format the number when user starts editing salary or annual fields
  if (fieldType === 'salary' || fieldType === 'annual') {
    // For salary cells, get the raw calculated value
    if (fieldType === 'salary' && month) {
      const rawValue = getPayrollCellValueLocal(rowId, fieldType, year, month);
      event.target.textContent = rawValue.toString();
    } else {
      // For other fields, parse the current text content
      const value = parseFloat(event.target.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(value)) {
        // Show the raw number without commas for easier editing
        event.target.textContent = value.toString();
      }
    }
  }
  // For count fields, show the raw number for easier editing
  if (fieldType === 'count') {
    const rawValue = getPayrollCellValueLocal(rowId, fieldType, year, month);
    event.target.textContent = rawValue.toString();
  }
}

/**
 *! Modal Salary Handlers (using robust pattern like monthly cells)
 * @param {Event} event - Input event
 * @param {Object} row - Row object
 */
export function handleModalSalaryInput(event, row) {
  // Allow only numbers and decimal point
  let value = event.target.value.replace(/[^0-9.]/g, '');
  row.salary = value;
}

/**
 *! Handle modal salary focus
 * @param {Event} event - Focus event
 * @param {Object} row - Row object
 */
export function handleModalSalaryFocus(event, row) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.salary;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9.]/g, '');
  }
  event.target.value = rawValue || '';
}

/**
 *! Handle modal salary blur
 * @param {Event} event - Blur event
 * @param {Object} row - Row object
 * @param {Function} formatMoney - Format money function
 */
export function handleModalSalaryBlur(event, row, formatMoney) {
  // Get the raw value from the input
  let rawValue = event.target.value.replace(/[^0-9.]/g, '');
  
  // If the raw value is empty or invalid, use the original salary
  if (!rawValue || rawValue === '') {
    // Restore the original formatted value
    event.target.value = formatMoney(row.salary);
    return;
  }
  
  // Parse as a number (treat as whole number, not decimal)
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Store the value as a number (not formatted)
    row.salary = value;
    // Display the formatted value
    event.target.value = formatMoney(value);
  } else {
    // If invalid, restore the original value
    event.target.value = formatMoney(row.salary);
  }
}

/**
 *! Table Salary Handlers (using robust pattern like monthly cells)
 * @param {Object} row - Row object
 * @param {Event} event - Input event
 * @param {Ref} visibleYears - Visible years ref
 * @param {Ref} payrollData - Payroll data ref
 */
export function handleTableSalaryInput(row, event, visibleYears, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('handleTableSalaryInput: payrollData is undefined or null');
    return;
  }
  
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.salary = value;
  
  // Trigger reactive update for monthly salary cells
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    // Add a timestamp to force reactivity
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

/**
 *! Handle table salary focus
 * @param {Object} row - Row object
 * @param {Event} event - Focus event
 */
export function handleTableSalaryFocus(row, event) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.salary;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9.]/g, '');
  }
  event.target.textContent = rawValue || '';
}

/**
 *! Handle table salary blur
 * @param {Object} row - Row object
 * @param {Event} event - Blur event
 * @param {Ref} isSaved - Is saved ref
 * @param {Ref} visibleYears - Visible years ref
 * @param {Ref} payrollData - Payroll data ref
 * @param {Function} formatMoney - Format money function
 */
export function handleTableSalaryBlur(row, event, isSaved, visibleYears, payrollData, formatMoney) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('handleTableSalaryBlur: payrollData is undefined or null');
    return;
  }
  
  // Get the raw value from the cell content
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  // If the raw value is empty or invalid, use the original salary
  if (!rawValue || rawValue === '') {
    // Restore the original formatted value
    event.target.textContent = formatMoney(row.salary);
    return;
  }
  
  // Parse as a number (treat as whole number, not decimal)
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Store the value as a number (not formatted)
    row.salary = value;
    // Display the formatted value
    event.target.textContent = formatMoney(value);
    // Mark as unsaved
    isSaved.value = false;
    
    // Trigger reactive update for monthly salary cells
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      // Add a timestamp to force reactivity
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    // If invalid, restore the original value
    event.target.textContent = formatMoney(row.salary);
  }
}

/**
 *! Table Count Handlers (using robust pattern like monthly cells)
 * @param {Object} row - Row object
 * @param {Event} event - Input event
 * @param {Ref} visibleYears - Visible years ref
 * @param {Ref} payrollData - Payroll data ref
 */
export function handleTableCountInput(row, event, visibleYears, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('handleTableCountInput: payrollData is undefined or null');
    return;
  }
  
  let value = event.target.textContent.replace(/[^0-9]/g, '');
  row.count = value;
  
  // Trigger reactive update for monthly count and salary cells
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    // Add a timestamp to force reactivity
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

/**
 *! Handle table count focus
 * @param {Object} row - Row object
 * @param {Event} event - Focus event
 */
export function handleTableCountFocus(row, event) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.count;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9]/g, '');
  }
  event.target.textContent = rawValue || '';
}

/**
 *! Handle table count blur
 * @param {Object} row - Row object
 * @param {Event} event - Blur event
 * @param {Ref} isSaved - Is saved ref
 * @param {Ref} visibleYears - Visible years ref
 * @param {Ref} payrollData - Payroll data ref
 */
export function handleTableCountBlur(row, event, isSaved, visibleYears, payrollData) {
  // Defensive check for payrollData
  if (!payrollData || !payrollData.value) {
    console.warn('handleTableCountBlur: payrollData is undefined or null');
    return;
  }
  
  // Get the raw value from the cell content
  let rawValue = event.target.textContent.replace(/[^0-9]/g, '');
  
  // If the raw value is empty or invalid, use the original count
  if (!rawValue || rawValue === '') {
    // Restore the original value
    event.target.textContent = row.count || '0';
    return;
  }
  
  // Parse as a number
  let value = parseInt(rawValue, 10);
  if (!isNaN(value)) {
    // ✅ FIXED: Only update the base count, don't affect monthly overrides
    row.count = value;
    // Display the value
    event.target.textContent = value;
    // Mark as unsaved
    isSaved.value = false;
    
    // ✅ FIXED: Trigger reactive update for monthly salary cells only
    // Monthly count cells should NOT be affected by base count changes
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      // Add a timestamp to force reactivity for salary calculations
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    // If invalid, restore the original value
    event.target.textContent = row.count || '0';
  }
} 