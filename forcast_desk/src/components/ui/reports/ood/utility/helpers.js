/**
 * Helper utility functions for OOD Profit & Loss Report
 * Provides period mapping, label generation, and general utilities
 */

/**
 * Get the number of days in a period (month or quarter)
 * @param {string|number} year - Year
 * @param {string} label - Period label (e.g., 'Jan', 'Q1')
 * @returns {number} Number of days in the period
 */
export function getNoOfDays(year, label) {
  // Map months to their typical days
  const monthDays = {
    'Jan': 31, 'Feb': 28, 'Mar': 31, 'Apr': 30,
    'May': 31, 'Jun': 30, 'Jul': 31, 'Aug': 31,
    'Sep': 30, 'Oct': 31, 'Nov': 30, 'Dec': 31
  };

  // Check for leap year for February
  const yearNum = parseInt(year);
  if (label === 'Feb' && yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
    return 29;
  }

  // Handle monthly labels
  if (monthDays[label]) {
    return monthDays[label];
  }

  // Handle quarterly labels
  const quarterDays = {
    'Q1': 90, // Jan + Feb + Mar (non-leap year)
    'Q2': 91, // Apr + May + Jun
    'Q3': 92, // Jul + Aug + Sep
    'Q4': 92  // Oct + Nov + Dec
  };

  // Adjust Q1 for leap year
  if (label === 'Q1' && yearNum % 4 === 0 && (yearNum % 100 !== 0 || yearNum % 400 === 0)) {
    return 91;
  }

  return quarterDays[label] || 30;
}

/**
 * Get months that correspond to a specific label (month or quarter)
 * @param {string} label - Period label (e.g., 'Jan', 'Q1')
 * @returns {Array<string>} Array of month names
 */
export function getMonthsForLabel(label) {
  const quarterToMonths = {
    'Q1': ['Jan', 'Feb', 'Mar'],
    'Q2': ['Apr', 'May', 'Jun'],
    'Q3': ['Jul', 'Aug', 'Sep'],
    'Q4': ['Oct', 'Nov', 'Dec']
  };

  // If it's a quarter, return the months in that quarter
  if (quarterToMonths[label]) {
    return quarterToMonths[label];
  }

  // Otherwise, it's a month, so return it as a single-item array
  return [label];
}

/**
 * Parse payroll designation from a row code
 * Example: "Management" from "Management|Sales Manager"
 * @param {string} rowCode - The row code string
 * @returns {string} The designation part
 */
export function parsePayrollDesignation(rowCode) {
  if (!rowCode) return '';
  const parts = rowCode.split('|');
  return parts[0] || '';
}

/**
 * Parse payroll position from a row code
 * Example: "Sales Manager" from "Management|Sales Manager"
 * @param {string} rowCode - The row code string
 * @returns {string} The position part
 */
export function parsePayrollPosition(rowCode) {
  if (!rowCode) return '';
  const parts = rowCode.split('|');
  return parts[1] || '';
}

