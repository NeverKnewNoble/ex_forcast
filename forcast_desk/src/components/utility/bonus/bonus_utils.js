// Bonus Utility Functions - Handles bonus data operations and calculations

import { bonusData } from './bonus_data_service.js';
import { formatCurrency, formatPercentage } from '@/components/utility/payroll_related/related_utils.js';

/**
 *! Get bonus percentage for a specific row
 * @param {Object} row - Payroll row object
 * @param {string} year - Year
 * @returns {string} - Formatted bonus percentage
 */
export function getBonusPercentage(row, year) {
   //  // console.log('getBonusPercentageUtil called with:', { rowId: row.id, year, bonusData: bonusData.value });
    if (!bonusData.value[year] || !bonusData.value[year][row.id]) {
       //  // console.log('No bonus data found for:', row.id, 'in year:', year);
        return '0.00';
    }
    const bonusPercentage = bonusData.value[year][row.id].bonusPercentage || 0;
   //  // console.log('Found bonus percentage:', bonusPercentage);
    return formatPercentage(bonusPercentage);
}

/**
 *! Handle bonus percentage input
 * @param {Object} row - Payroll row object
 * @param {Event} event - Input event
 * @param {boolean} isSaved - Saved state
 * @param {Array} visibleYears - Visible years
 * @param {Function} addBonusChange - Function to add bonus change
 */
export function handleBonusPercentageInput(row, event, isSaved, visibleYears, addBonusChange) {
    const value = parseFloat(event.target.textContent.replace(/[^\d.-]/g, '')) || 0;
    const year = visibleYears[0];
    
    // Add change to tracking
    addBonusChange(row.id, 'bonus_percentage', year, value);
}

/**
 *! Handle bonus percentage focus
 * @param {Object} row - Payroll row object
 * @param {Event} event - Focus event
 */
export function handleBonusPercentageFocus(row, event) {
    event.target.textContent = getBonusPercentage(row, visibleYears[0]).replace(/[^\d.-]/g, '');
}

/**
 *! Handle bonus percentage blur
 * @param {Object} row - Payroll row object
 * @param {Event} event - Blur event
 * @param {boolean} isSaved - Saved state
 * @param {Array} visibleYears - Visible years
 * @param {Function} addBonusChange - Function to add bonus change
 */
export function handleBonusPercentageBlur(row, event, isSaved, visibleYears, addBonusChange) {
    const value = parseFloat(event.target.textContent.replace(/[^\d.-]/g, '')) || 0;
    event.target.textContent = formatPercentage(value);
    handleBonusPercentageInput(row, event, isSaved, visibleYears, addBonusChange);
}

/**
 *! Calculate bonus value for a specific month
 * @param {Object} row - Payroll row object
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function getBonusValue(row, month, year, getPayrollCellValueLocal) {
    const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
    const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
    const salary = row.salary || 0;
    
    const bonusValue = (countValue || 0) * salary * bonusPercentage;
    return formatCurrency(bonusValue);
}

/**
 *! Calculate total bonus for all months
 * @param {Object} row - Payroll row object
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function getBonusTotal(row, year, months, getPayrollCellValueLocal) {
    let total = 0;
    const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
    const salary = row.salary || 0;
    
    months.forEach(month => {
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate bonus for management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function calculateSubTotalManagementBonus(rows, category, location, month, year, getPayrollCellValueLocal) {
    const managementRows = rows.filter(row => row.position === 'Manager');
    let total = 0;
    
    managementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate total bonus for management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function calculateSubTotalManagementBonusTotal(rows, category, location, year, months, getPayrollCellValueLocal) {
    const managementRows = rows.filter(row => row.position === 'Manager');
    let total = 0;
    
    managementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate bonus for non-management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function calculateSubTotalNonManagementBonus(rows, category, location, month, year, getPayrollCellValueLocal) {
    const nonManagementRows = rows.filter(row => row.position !== 'Manager');
    let total = 0;
    
    nonManagementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate total bonus for non-management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function calculateSubTotalNonManagementBonusTotal(rows, category, location, year, months, getPayrollCellValueLocal) {
    const nonManagementRows = rows.filter(row => row.position !== 'Manager');
    let total = 0;
    
    nonManagementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate bonus for location total
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function calculateLocationTotalBonus(rows, category, location, month, year, getPayrollCellValueLocal) {
    let total = 0;
    
    rows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate total bonus for location total
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function calculateLocationTotalBonusTotal(rows, category, location, year, months, getPayrollCellValueLocal) {
    let total = 0;
    
    rows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate bonus for hotel total
 * @param {Array} payrollRows - All payroll rows
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function calculateHotelTotalBonus(payrollRows, month, year, getPayrollCellValueLocal) {
    let total = 0;
    
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate total bonus for hotel total
 * @param {Array} payrollRows - All payroll rows
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function calculateHotelTotalBonusTotal(payrollRows, year, months, getPayrollCellValueLocal) {
    let total = 0;
    
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    return formatCurrency(total);
}

/**
 *! Calculate bonus for employee/room ratio
 * @param {Array} payrollRows - All payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted bonus value
 */
export function calculateEmployeeRoomRatioBonus(payrollRows, totalRooms, month, year, getPayrollCellValueLocal) {
    let total = 0;
    
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    return formatCurrency(total / totalRooms);
}

/**
 *! Calculate total bonus for employee/room ratio
 * @param {Array} payrollRows - All payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @returns {string} - Formatted total bonus value
 */
export function calculateEmployeeRoomRatioBonusTotal(payrollRows, totalRooms, year, months, getPayrollCellValueLocal) {
    let total = 0;
    
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    return formatCurrency(total / totalRooms);
} 