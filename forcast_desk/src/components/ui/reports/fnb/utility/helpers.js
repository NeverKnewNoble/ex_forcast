/**
 * Helper utility functions for F&B Profit & Loss Report
 * Handles period mapping, column labels, and restaurant list management
 */

/**
 * Get month labels for a period label (handles quarterly aggregation)
 * @param {string} label - Period label (e.g., 'Jan', 'Jan-Mar')
 * @returns {Array<string>} Array of month labels
 */
export function getMonthsForLabel(label) {
  if (label === 'Jan-Mar') return ['Jan', 'Feb', 'Mar'];
  if (label === 'Apr-Jun') return ['Apr', 'May', 'Jun'];
  if (label === 'Jul-Sep') return ['Jul', 'Aug', 'Sep'];
  if (label === 'Oct-Dec') return ['Oct', 'Nov', 'Dec'];
  return [label];
}

/**
 * Get column labels for a year based on advanced mode setting
 * @param {number} year - Year
 * @param {Object} advancedModes - Advanced mode settings
 * @returns {Array<string>} Array of column labels
 */
export function getColumnLabelsForYear(year, advancedModes) {
  const mode = advancedModes[year] || 'monthly';
  if (mode === 'monthly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (mode === 'quarterly') return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

/**
 * Get days in a period
 * @param {number} year - Year
 * @param {string} label - Period label
 * @returns {number} Number of days in period
 */
export function getNoOfDays(year, label) {
  // TODO: Connect to calculation cache for days in month/quarter
  if (label === 'Jan' || label === 'Mar' || label === 'May' || label === 'Jul' ||
    label === 'Aug' || label === 'Oct' || label === 'Dec') return 31;
  if (label === 'Apr' || label === 'Jun' || label === 'Sep' || label === 'Nov') return 30;
  if (label === 'Feb') return 28; // Simplified leap year logic
  if (label === 'Jan-Mar') return 90;
  if (label === 'Apr-Jun') return 91;
  if (label === 'Jul-Sep') return 92;
  if (label === 'Oct-Dec') return 92;
  return 30;
}

/**
 * Get restaurant list from calculation cache
 * @param {Object} calculationCache - Calculation cache instance
 * @param {string} projectName - Project name
 * @param {Array} visibleYears - Visible years
 * @param {Array} fallbackRestaurants - Fallback restaurant list
 * @returns {Array} Array of restaurant objects
 */
export function getRestaurantList(calculationCache, projectName, visibleYears, fallbackRestaurants) {
  try {
    const names = new Set();
    // Prefer normalized F&B cache to auto-discover restaurants
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.fnb?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((restaurantKey) => {
        if (!restaurantKey || restaurantKey === '__ALL__') return;
        names.add(restaurantKey);
      });
    });

    if (names.size > 0) {
      return Array.from(names).map(n => ({ name: n }));
    }
    // Fallback to existing list when normalized cache not yet hydrated
    return fallbackRestaurants;
  } catch (e) {
    console.error('[FNB PnL] Error getting restaurant list:', e);
    return fallbackRestaurants;
  }
}

/**
 * Parse F&B monthly salary row code from payroll cache
 * @param {string} rowCode - Row code to parse
 * @returns {Object|null} Parsed row data or null
 */
export function parseFnbMonthlySalaryRowCode(rowCode) {
  try {
    if (!rowCode || !rowCode.startsWith('MonthlySalary|')) return null;
    const regex = /^MonthlySalary\|department:Food And Beverage\|position:(.*?)\|location:(.*?)\|designation:(.*)$/;
    const match = rowCode.match(regex);
    if (!match) return null;
    return {
      position: (match[1] || '').trim(),
      location: (match[2] || '').trim(),
      designation: (match[3] || '').trim()
    };
  } catch (e) {
    return null;
  }
}

/**
 * Check if position is management level
 * @param {string} position - Position name
 * @returns {boolean} True if management position
 */
export function isFnbManagementPositionName(position) {
  if (!position) return false;
  const lower = position.toLowerCase();
  return (lower.includes('manager') && !lower.includes('non-manager')) || lower.includes('director') || lower.includes('supervisor');
}

