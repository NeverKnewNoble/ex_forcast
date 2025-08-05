// Payroll Related Calculation Handlers
// Handles all calculation functions for payroll related data

import { formatMoney } from './input_handlers.js';
import { getTaxPercentage, getTaxTotal, getVacation, getRelocation, getSeverenceIndemnity, getOther, getMedical, getUniforms, getEmployeeMeal, getTransport, getTelephone, getAirTicket, getBenefitsOther } from './input_handlers.js';
import { toRaw } from 'vue';

//? Helper function to check if a position is management
function isManagementPosition(position) {
  if (!position) return false;
  const lowerPosition = position.toLowerCase();
  return (lowerPosition.includes('manager') && !lowerPosition.includes('non-manager')) ||
         lowerPosition.includes('director') ||
         lowerPosition.includes('supervisor');
}

//? Helper function to check if a position is non-management
function isNonManagementPosition(position) {
  if (!position) return true; // Default to non-management if no position
  return !isManagementPosition(position);
}

//? Payroll Taxes Calculation Functions

/**
 *! Calculate average tax percentage for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Average tax percentage formatted to 2 decimal places
 */
export function calculateSubTotalManagementTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }

  const managementRows = rows.filter(row => isManagementPosition(row.position));
  if (managementRows.length === 0) return 0;
  
  const totalTaxPercentage = managementRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / managementRows.length).toFixed(2);
}

//? Payroll Taxes Calculation Functions
/**
 *! Calculate total tax amount for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total tax amount formatted as currency
 */
export function calculateSubTotalManagementTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalTaxAmount = managementRows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

//? Payroll Taxes Calculation Functions
/**
 *! Calculate average tax percentage for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Average tax percentage formatted to 2 decimal places
 */
export function calculateSubTotalNonManagementTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  if (nonManagementRows.length === 0) return 0;
  
  const totalTaxPercentage = nonManagementRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / nonManagementRows.length).toFixed(2);
}

//? Payroll Taxes Calculation Functions
/**
 *! Calculate total tax amount for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total tax amount formatted as currency
 */
export function calculateSubTotalNonManagementTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalTaxAmount = nonManagementRows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

//? Payroll Taxes Calculation Functions
/**
 *! Calculate average tax percentage for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Average tax percentage formatted to 2 decimal places
 */
export function calculateLocationTotalTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }
  
  if (rows.length === 0) return 0;
  
  const totalTaxPercentage = rows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / rows.length).toFixed(2);
}

//? Payroll Taxes Calculation Functions
/**
 *! Calculate total tax amount for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total tax amount formatted as currency
 */
export function calculateLocationTotalTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTaxAmount = rows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}


/**
 *! Calculate average tax percentage for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Average tax percentage formatted to 2 decimal places
 */
export function calculateHotelTotalTaxPercentageLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return 0;
  }
  
  const rawRows = toRaw(rows);
  
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return 0;
  }
  
  if (rawRows.length === 0) return 0;
  
  const totalTaxPercentage = rawRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / rawRows.length).toFixed(2);
}

/**
 *! Calculate total tax amount for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Total tax amount formatted as currency
 */
export function calculateHotelTotalTaxTotalLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTaxAmount = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

/**
 *! Calculate average tax percentage for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Average tax percentage formatted to 2 decimal places
 */
export function calculateEmployeeRoomRatioTaxPercentageLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalTaxPercentageLocal(rows);
  const numericValue = parseFloat(hotelTotal) || 0;
  return totalRooms > 0 ? (numericValue / totalRooms).toFixed(2) : '0.00';
}

/**
 *! Calculate total tax amount for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total tax amount formatted as currency
 */
export function calculateEmployeeRoomRatioTaxTotalLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalTaxTotalLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

// Supplementary Pay Calculation Functions

/**
 *! Calculate total vacation pay for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total vacation pay formatted as currency
 */
export function calculateSubTotalManagementVacationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementVacationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalVacation = managementRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

/**
 *! Calculate total relocation pay for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total relocation pay formatted as currency
 */
export function calculateSubTotalManagementRelocationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementRelocationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalRelocation = managementRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

/**
 *! Calculate total severance & indemnity pay for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total severance & indemnity pay formatted as currency
 */
export function calculateSubTotalManagementSeverenceIndemnityLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementSeverenceIndemnityLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalSeverenceIndemnity = managementRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

/**
 *! Calculate total other supplementary pay for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total other supplementary pay formatted as currency
 */
export function calculateSubTotalManagementOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalOther = managementRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

/**
 *! Calculate total vacation pay for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total vacation pay formatted as currency
 */
export function calculateSubTotalNonManagementVacationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementVacationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalVacation = nonManagementRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

/**
 *! Calculate total relocation pay for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total relocation pay formatted as currency
 */
export function calculateSubTotalNonManagementRelocationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementRelocationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalRelocation = nonManagementRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

/**
 *! Calculate total severance & indemnity pay for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total severance & indemnity pay formatted as currency
 */
export function calculateSubTotalNonManagementSeverenceIndemnityLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementSeverenceIndemnityLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalSeverenceIndemnity = nonManagementRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

/**
 *! Calculate total other supplementary pay for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total other supplementary pay formatted as currency
 */
export function calculateSubTotalNonManagementOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalOther = nonManagementRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

/**
 *! Calculate total vacation pay for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total vacation pay formatted as currency
 */
export function calculateLocationTotalVacationLocal(rows, category, location) {
  const totalVacation = rows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

/**
 *! Calculate total relocation pay for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total relocation pay formatted as currency
 */
export function calculateLocationTotalRelocationLocal(rows, category, location) {
  const totalRelocation = rows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

/**
 *! Calculate total severance & indemnity pay for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total severance & indemnity pay formatted as currency
 */
export function calculateLocationTotalSeverenceIndemnityLocal(rows, category, location) {
  const totalSeverenceIndemnity = rows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

/**
 *! Calculate total other supplementary pay for all positions in a location
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total other supplementary pay formatted as currency
 */
export function calculateLocationTotalOtherLocal(rows, category, location) {
  const totalOther = rows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

/**
 *! Calculate total vacation pay for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Total vacation pay formatted as currency
 */
export function calculateHotelTotalVacationLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalVacation = rawRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

/**
 *! Calculate total relocation pay for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Total relocation pay formatted as currency
 */
export function calculateHotelTotalRelocationLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalRelocation = rawRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

/**
 *! Calculate total severance & indemnity pay for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Total severance & indemnity pay formatted as currency
 */
export function calculateHotelTotalSeverenceIndemnityLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalSeverenceIndemnity = rawRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

/**
 *! Calculate total other supplementary pay for all positions across the entire hotel
 * @param {Array} rows - Array of payroll rows
 * @returns {string} - Total other supplementary pay formatted as currency
 */
export function calculateHotelTotalOtherLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalOther = rawRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

/**
 *! Calculate total vacation pay for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total vacation pay formatted as currency
 */
export function calculateEmployeeRoomRatioVacationLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalVacationLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total relocation pay for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total relocation pay formatted as currency
 */
export function calculateEmployeeRoomRatioRelocationLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalRelocationLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total severance & indemnity pay for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total severance & indemnity pay formatted as currency
 */
export function calculateEmployeeRoomRatioSeverenceIndemnityLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalSeverenceIndemnityLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total other supplementary pay for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total other supplementary pay formatted as currency
 */
export function calculateEmployeeRoomRatioOtherLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalOtherLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

// Employee Benefits Calculation Functions

/**
 *! Calculate total medical benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total medical benefits formatted as currency
 */
export function calculateSubTotalManagementMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalMedical = managementRows.reduce((sum, row) => {
    const medical = getMedical(row) || 0;
    return sum + medical;
  }, 0);
  
  return formatMoney(totalMedical);
}

/**
 *! Calculate total uniforms benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total uniforms benefits formatted as currency
 */
export function calculateSubTotalManagementUniformsLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementUniformsLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalUniforms = managementRows.reduce((sum, row) => {
    const uniforms = getUniforms(row) || 0;
    return sum + uniforms;
  }, 0);
  
  return formatMoney(totalUniforms);
}

/**
 *! Calculate total employee meal benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total employee meal benefits formatted as currency
 */
export function calculateSubTotalManagementEmployeeMealLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementEmployeeMealLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalEmployeeMeal = managementRows.reduce((sum, row) => {
    const employeeMeal = getEmployeeMeal(row) || 0;
    return sum + employeeMeal;
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

/**
 *! Calculate total transport benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total transport benefits formatted as currency
 */
export function calculateSubTotalManagementTransportLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTransportLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalTransport = managementRows.reduce((sum, row) => {
    const transport = getTransport(row) || 0;
    return sum + transport;
  }, 0);
  
  return formatMoney(totalTransport);
}

/**
 *! Calculate total telephone benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total telephone benefits formatted as currency
 */
export function calculateSubTotalManagementTelephoneLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTelephoneLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalTelephone = managementRows.reduce((sum, row) => {
    const telephone = getTelephone(row) || 0;
    return sum + telephone;
  }, 0);
  
  return formatMoney(totalTelephone);
}

/**
 *! Calculate total air ticket benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total air ticket benefits formatted as currency
 */
export function calculateSubTotalManagementAirTicketLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementAirTicketLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalAirTicket = managementRows.reduce((sum, row) => {
    const airTicket = getAirTicket(row) || 0;
    return sum + airTicket;
  }, 0);
  
  return formatMoney(totalAirTicket);
}

/**
 *! Calculate total other benefits for management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total other benefits formatted as currency
 */
export function calculateSubTotalManagementBenefitsOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementBenefitsOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => isManagementPosition(row.position));
  
  const totalBenefitsOther = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

/**
 *! Calculate total medical benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total medical benefits formatted as currency
 */
export function calculateSubTotalNonManagementMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalMedical = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

/**
 *! Calculate total uniforms benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total uniforms benefits formatted as currency
 */
export function calculateSubTotalNonManagementUniformsLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalUniforms = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

/**
 *! Calculate total employee meal benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total employee meal benefits formatted as currency
 */
export function calculateSubTotalNonManagementEmployeeMealLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalEmployeeMeal = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

/**
 *! Calculate total transport benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total transport benefits formatted as currency
 */
export function calculateSubTotalNonManagementTransportLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalTransport = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

/**
 *! Calculate total telephone benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total telephone benefits formatted as currency
 */
export function calculateSubTotalNonManagementTelephoneLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalTelephone = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

/**
 *! Calculate total air ticket benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total air ticket benefits formatted as currency
 */
export function calculateSubTotalNonManagementAirTicketLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalAirTicket = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

/**
 *! Calculate total other benefits for non-management positions only
 * @param {Array} rows - Array of payroll rows
 * @param {string} category - Category (e.g., "ROOMS", "FOOD & BEVERAGE")
 * @param {string} location - Location (e.g., "Front Desk", "Kitchen")
 * @returns {string} - Total other benefits formatted as currency
 */
export function calculateSubTotalNonManagementBenefitsOtherLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => isNonManagementPosition(row.position));
  
  const totalBenefitsOther = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateLocationTotalMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalMedical = rows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateLocationTotalUniformsLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalUniformsLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalUniforms = rows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateLocationTotalEmployeeMealLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalEmployeeMealLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalEmployeeMeal = rows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateLocationTotalTransportLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTransportLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTransport = rows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateLocationTotalTelephoneLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTelephoneLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTelephone = rows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateLocationTotalAirTicketLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalAirTicketLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalAirTicket = rows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateLocationTotalBenefitsOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalBenefitsOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalBenefitsOther = rows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateHotelTotalMedicalLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalMedical = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateHotelTotalUniformsLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalUniforms = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateHotelTotalEmployeeMealLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalEmployeeMeal = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateHotelTotalTransportLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTransport = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateHotelTotalTelephoneLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTelephone = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateHotelTotalAirTicketLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalAirTicket = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateHotelTotalBenefitsOtherLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalBenefitsOther = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

/**
 *! Calculate total medical benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total medical benefits formatted as currency
 */
export function calculateEmployeeRoomRatioMedicalLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalMedicalLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total uniforms benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total uniforms benefits formatted as currency
 */
export function calculateEmployeeRoomRatioUniformsLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalUniformsLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total employee meal benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total employee meal benefits formatted as currency
 */
export function calculateEmployeeRoomRatioEmployeeMealLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalEmployeeMealLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total transport benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total transport benefits formatted as currency
 */
export function calculateEmployeeRoomRatioTransportLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalTransportLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total telephone benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total telephone benefits formatted as currency
 */
export function calculateEmployeeRoomRatioTelephoneLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalTelephoneLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total air ticket benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total air ticket benefits formatted as currency
 */
export function calculateEmployeeRoomRatioAirTicketLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalAirTicketLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
}

/**
 *! Calculate total other benefits for employee/room ratio calculations
 * @param {Array} rows - Array of payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {string} - Total other benefits formatted as currency
 */
export function calculateEmployeeRoomRatioBenefitsOtherLocal(rows, totalRooms = 100) {
  const hotelTotal = calculateHotelTotalBenefitsOtherLocal(rows);
  const numericValue = parseFloat(hotelTotal.replace(/[^0-9.-]/g, '')) || 0;
  return totalRooms > 0 ? formatMoney(numericValue / totalRooms) : formatMoney(0);
} 