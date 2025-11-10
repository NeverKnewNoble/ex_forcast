/**
 * Formatting utility functions for F&B Profit & Loss Report
 * Handles number, money, and percentage formatting
 */

/**
 * Convert value to number, handling null/undefined/NaN
 * @param {*} value - Value to convert
 * @returns {number} Numeric value or 0
 */
export function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Format value as money with 2 decimal places
 * @param {*} value - Value to format
 * @returns {string} Formatted money string
 */
export function formatMoney(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Format value as number with no decimal places
 * @param {*} value - Value to format
 * @returns {string} Formatted number string
 */
export function formatNumber(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Format value as percentage with 2 decimal places
 * @param {*} value - Value to format
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

