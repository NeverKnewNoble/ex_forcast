/**
 * Helper functions for Cashflow report
 * Provides formatting and calculation utilities
 */

/**
 * Format number as currency with commas
 */
export function formatMoney(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.00';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format number with commas (no decimals)
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Format percentage value
 */
export function formatPercentage(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.00';
  return Number(value).toFixed(2);
}

/**
 * Safely get numeric value from cache or data
 */
export function getNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Number(value);
}

/**
 * Get column labels for a given year based on mode
 */
export function getColumnLabelsForYear(year, advancedModes) {
  const mode = advancedModes[year];
  
  if (mode === 'Monthly') {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  } else if (mode === 'Quarterly') {
    return ['Q1', 'Q2', 'Q3', 'Q4'];
  } else if (mode === 'Yearly') {
    return ['Year'];
  }
  
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

