/**
 * Formatting utilities for P&L Statement Report
 * Provides consistent data formatting across the report
 */

/**
 * Convert value to number, returns 0 for invalid values
 */
export function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

/**
 * Format number as money with 2 decimal places
 */
export function formatMoney(value) {
  return getNumber(value).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

/**
 * Format number without decimal places
 */
export function formatNumber(value) {
  return getNumber(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
}

/**
 * Format percentage with 2 decimal places
 */
export function formatPercentage(value) {
  return getNumber(value).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

