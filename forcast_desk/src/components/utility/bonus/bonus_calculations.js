// Bonus Calculations - Specific calculation functions for Bonus.vue component

import { formatCurrency, formatPercentage } from '@/components/utility/payroll_related/related_utils.js';
import { getBonusPercentage } from './bonus_utils.js';

/**
 *! Calculate bonus percentage for management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @returns {string} - Formatted percentage
 */
export function calculateSubTotalManagementBonusPercentage(rows, category, location, year) {
    const managementRows = rows.filter(row => 
        row.category === category && 
        row.departmentLocation === location && 
        row.position === 'Manager'
    );
    if (managementRows.length === 0) return '0.00';
    
    let totalPercentage = 0;
    managementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '');
        totalPercentage += parseFloat(bonusPercentage) || 0;
    });
    return formatPercentage(totalPercentage / managementRows.length);
}

/**
 *! Calculate bonus percentage for non-management subtotal
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @returns {string} - Formatted percentage
 */
export function calculateSubTotalNonManagementBonusPercentage(rows, category, location, year) {
    const nonManagementRows = rows.filter(row => 
        row.category === category && 
        row.departmentLocation === location && 
        row.position !== 'Manager'
    );
    if (nonManagementRows.length === 0) return '0.00';
    
    let totalPercentage = 0;
    nonManagementRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '');
        totalPercentage += parseFloat(bonusPercentage) || 0;
    });
    return formatPercentage(totalPercentage / nonManagementRows.length);
}

/**
 *! Calculate bonus percentage for location total
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @param {string} year - Year
 * @returns {string} - Formatted percentage
 */
export function calculateLocationTotalBonusPercentage(rows, category, location, year) {
    const locationRows = rows.filter(row => 
        row.category === category && 
        row.departmentLocation === location
    );
    if (locationRows.length === 0) return '0.00';
    
    let totalPercentage = 0;
    locationRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '');
        totalPercentage += parseFloat(bonusPercentage) || 0;
    });
    return formatPercentage(totalPercentage / locationRows.length);
}

/**
 *! Calculate bonus percentage for hotel total (safe wrapper)
 * @param {Array} payrollRows - All payroll rows
 * @param {string} year - Year
 * @returns {string} - Formatted percentage
 */
export function safeCalculateHotelTotalBonusPercentage(payrollRows, year) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0) {
        return '0.00';
    }
    
    let totalPercentage = 0;
    let validRows = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '');
        const percentage = parseFloat(bonusPercentage) || 0;
        if (percentage > 0) {
            totalPercentage += percentage;
            validRows++;
        }
    });
    
    return validRows > 0 ? formatPercentage(totalPercentage / validRows) : '0.00';
}

/**
 *! Calculate bonus percentage for employee/room ratio
 * @param {Array} payrollRows - All payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @param {string} year - Year
 * @returns {string} - Formatted percentage
 */
export function calculateEmployeeRoomRatioBonusPercentage(payrollRows, totalRooms, year) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0 || !totalRooms) {
        return '0.00';
    }
    
    let totalPercentage = 0;
    let validRows = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '');
        const percentage = parseFloat(bonusPercentage) || 0;
        if (percentage > 0) {
            totalPercentage += percentage;
            validRows++;
        }
    });
    
    return validRows > 0 ? formatPercentage(totalPercentage / validRows) : '0.00';
}

/**
 *! Safe wrapper for hotel total bonus calculations
 * @param {Array} payrollRows - All payroll rows
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @param {Object} calculationCache - Optional calculation cache for storing values
 * @param {string} projectId - Optional project ID for caching
 * @returns {string} - Formatted bonus value
 */
export function safeCalculateHotelTotalBonus(payrollRows, month, year, getPayrollCellValueLocal, calculationCache = null, projectId = null) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0) {
        return formatCurrency(0);
    }
    
    // Check cache first if available
    if (calculationCache && projectId) {
        const rowCode = 'Total Hotel';
        const cachedValue = calculationCache.getValue(projectId, 'Bonus', rowCode, year, month);
        if (cachedValue > 0) {
            return formatCurrency(cachedValue);
        }
    }
    
    let total = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    // Cache the value if cache is available
    if (calculationCache && projectId && total > 0) {
        const rowCode = 'Total Hotel';
        calculationCache.setValue(projectId, 'Bonus', rowCode, year, month, total);
    }
    
    return formatCurrency(total);
}

/**
 *! Safe wrapper for hotel total bonus total calculations
 * @param {Array} payrollRows - All payroll rows
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @param {Object} calculationCache - Optional calculation cache for storing values
 * @param {string} projectId - Optional project ID for caching
 * @returns {string} - Formatted total bonus value
 */
export function safeCalculateHotelTotalBonusTotal(payrollRows, year, months, getPayrollCellValueLocal, calculationCache = null, projectId = null) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0) {
        return formatCurrency(0);
    }
    
    // Check cache first if available
    if (calculationCache && projectId) {
        const rowCode = 'Total Hotel';
        const cachedValue = calculationCache.getValue(projectId, 'Bonus', rowCode, year, 'Total');
        if (cachedValue > 0) {
            return formatCurrency(cachedValue);
        }
    }
    
    let total = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    // Cache the total value if cache is available
    if (calculationCache && projectId && total > 0) {
        const rowCode = 'Total Hotel';
        calculationCache.setValue(projectId, 'Bonus', rowCode, year, 'Total', total);
    }
    
    return formatCurrency(total);
}

/**
 *! Safe wrapper for employee/room ratio bonus calculations
 * @param {Array} payrollRows - All payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @param {string} month - Month
 * @param {string} year - Year
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @param {Object} calculationCache - Optional calculation cache for storing values
 * @param {string} projectId - Optional project ID for caching
 * @returns {string} - Formatted bonus value
 */
export function safeCalculateEmployeeRoomRatioBonus(payrollRows, totalRooms, month, year, getPayrollCellValueLocal, calculationCache = null, projectId = null) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0 || !totalRooms) {
        return formatCurrency(0);
    }
    
    // Check cache first if available
    if (calculationCache && projectId) {
        const rowCode = 'Employee/Room Ratio';
        const cachedValue = calculationCache.getValue(projectId, 'Bonus', rowCode, year, month);
        if (cachedValue > 0) {
            return formatCurrency(cachedValue);
        }
    }
    
    let total = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
        const salary = row.salary || 0;
        total += (countValue || 0) * salary * bonusPercentage;
    });
    
    const ratioValue = total / totalRooms;
    
    // Cache the value if cache is available
    if (calculationCache && projectId && ratioValue > 0) {
        const rowCode = 'Employee/Room Ratio';
        calculationCache.setValue(projectId, 'Bonus', rowCode, year, month, ratioValue);
    }
    
    return formatCurrency(ratioValue);
}

/**
 *! Safe wrapper for employee/room ratio bonus total calculations
 * @param {Array} payrollRows - All payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @param {string} year - Year
 * @param {Array} months - Array of months
 * @param {Function} getPayrollCellValueLocal - Function to get payroll cell value
 * @param {Object} calculationCache - Optional calculation cache for storing values
 * @param {string} projectId - Optional project ID for caching
 * @returns {string} - Formatted total bonus value
 */
export function safeCalculateEmployeeRoomRatioBonusTotal(payrollRows, totalRooms, year, months, getPayrollCellValueLocal, calculationCache = null, projectId = null) {
    if (!payrollRows || !Array.isArray(payrollRows) || payrollRows.length === 0 || !totalRooms) {
        return formatCurrency(0);
    }
    
    // Check cache first if available
    if (calculationCache && projectId) {
        const rowCode = 'Employee/Room Ratio';
        const cachedValue = calculationCache.getValue(projectId, 'Bonus', rowCode, year, 'Total');
        if (cachedValue > 0) {
            return formatCurrency(cachedValue);
        }
    }
    
    let total = 0;
    payrollRows.forEach(row => {
        const bonusPercentage = getBonusPercentage(row, year).replace(/[^\d.-]/g, '') / 100;
        const salary = row.salary || 0;
        months.forEach(month => {
            const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
            total += (countValue || 0) * salary * bonusPercentage;
        });
    });
    
    const ratioValue = total / totalRooms;
    
    // Cache the total value if cache is available
    if (calculationCache && projectId && ratioValue > 0) {
        const rowCode = 'Employee/Room Ratio';
        calculationCache.setValue(projectId, 'Bonus', rowCode, year, 'Total', ratioValue);
    }
    
    return formatCurrency(ratioValue);
} 