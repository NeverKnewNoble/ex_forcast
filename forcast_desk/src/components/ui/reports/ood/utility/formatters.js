/**
 * Formatting utility functions for OOD Profit & Loss Report
 * Handles number, money, and percentage formatting for display
 */

/**
 * Safely converts a value to a number, returning 0 for invalid values
 * @param {any} value - Value to convert
 * @returns {number} Converted number or 0
 */
export function getNumber(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Format a number to display with thousand separators
 * @param {number|string} value - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  const num = getNumber(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Format a number as currency with thousand separators and 2 decimal places
 * @param {number|string} value - Number to format as money
 * @returns {string} Formatted money string
 */
export function formatMoney(value) {
  const num = getNumber(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a number as a percentage with 2 decimal places
 * @param {number|string} value - Number to format as percentage
 * @returns {string} Formatted percentage string (without % symbol)
 */
export function formatPercentage(value) {
  const num = getNumber(value);
  return num.toFixed(2);
}

