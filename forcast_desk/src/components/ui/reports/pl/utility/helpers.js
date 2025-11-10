/**
 * Helper utilities for P&L Statement Report
 * Provides common utility functions
 */

/**
 * Get number of days in a month or quarter period
 */
export function getNoOfDays(label) {
  // Monthly labels
  if (label === 'Jan' || label === 'Mar' || label === 'May' || label === 'Jul' ||
    label === 'Aug' || label === 'Oct' || label === 'Dec') return 31;
  if (label === 'Apr' || label === 'Jun' || label === 'Sep' || label === 'Nov') return 30;
  if (label === 'Feb') return 28;
  
  // Quarterly labels
  if (label === 'Jan-Mar') return 90;
  if (label === 'Apr-Jun') return 91;
  if (label === 'Jul-Sep') return 92;
  if (label === 'Oct-Dec') return 92;
  
  return 30;
}

/**
 * Get months that compose a quarterly label
 */
export function getMonthsForLabel(label) {
  if (label === 'Jan-Mar') return ['Jan', 'Feb', 'Mar'];
  if (label === 'Apr-Jun') return ['Apr', 'May', 'Jun'];
  if (label === 'Jul-Sep') return ['Jul', 'Aug', 'Sep'];
  if (label === 'Oct-Dec') return ['Oct', 'Nov', 'Dec'];
  return [label];
}

/**
 * Get all column labels for a year based on mode
 */
export function getColumnLabelsForYear(year, advancedModes) {
  const mode = advancedModes[year] || 'monthly';
  if (mode === 'monthly') {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  if (mode === 'quarterly') {
    return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  }
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

