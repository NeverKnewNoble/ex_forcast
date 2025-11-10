/**
 * Payroll data functions for F&B Profit & Loss Report
 * Handles F&B payroll calculations for management and non-management positions
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel, isFnbManagementPositionName, parseFnbMonthlySalaryRowCode } from './helpers.js';
import { getTotalFoodAndBeverageRevenue } from './revenueData.js';
import { PAGE } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get F&B payroll locations for management positions
 */
export function getFnbPayrollLocationsManagement(calculationCache, projectName, visibleYears) {
  try {
    const locs = new Set();
    const depts = ['Food And Beverage', 'F&B'];
    // Prefer normalized payroll structure across visible years
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        if (!depts.includes(departmentKey)) return;
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasMgmt = Object.keys(byPosition).some((pos) => isFnbManagementPositionName(pos));
          if (hasMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (parsed && isFnbManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('F&B P&L: Error discovering payroll management locations:', e);
    return [];
  }
}

/**
 * Get F&B payroll locations for non-management positions
 */
export function getFnbPayrollLocationsNonManagement(calculationCache, projectName, visibleYears) {
  try {
    const locs = new Set();
    const depts = ['Food And Beverage', 'F&B'];
    // Prefer normalized payroll structure across visible years
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        if (!depts.includes(departmentKey)) return;
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasNonMgmt = Object.keys(byPosition).some((pos) => !isFnbManagementPositionName(pos));
          if (hasNonMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (parsed && !isFnbManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('F&B P&L: Error discovering payroll non-management locations:', e);
    return [];
  }
}

/**
 * Get F&B payroll monthly salary by location for a period
 */
export function getFnbPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, location, group, getColumnLabelsForYear) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure - same approach as RoomProfitLoss.vue
    const payrollNorm = calculationCache?.payroll?.[projectName]?.[year] || {};
    const isMgmtGroup = group === 'management';
    const isNonMgmtGroup = group === 'non-management';
    Object.keys(payrollNorm).forEach((departmentKey) => {
      const byLocation = payrollNorm[departmentKey] || {};
      const locBucket = byLocation?.[location];
      if (!locBucket) return;
      Object.keys(locBucket).forEach((positionKey) => {
        const mgmt = isFnbManagementPositionName(positionKey);
        if ((isMgmtGroup && !mgmt) || (isNonMgmtGroup && mgmt)) return;
        const byDesignation = locBucket[positionKey] || {};
        Object.keys(byDesignation).forEach((designationKey) => {
          const byLabel = byDesignation[designationKey] || {};
          for (const m of months) {
            const v = byLabel?.[m];
            if (v !== undefined && v !== null) sum += getNumber(v);
          }
        });
      });
    });

    if (sum > 0) return sum;

    // Fallback to legacy PAGE-based cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (!parsed || !parsed.location || parsed.location !== location) return;
      const isMgmt = isFnbManagementPositionName(parsed.position);
      if ((group === 'management' && !isMgmt) || (group === 'non-management' && isMgmt)) return;
      for (const m of months) {
        const val = calculationCache.getValue(projectName, page, rowCode, year, m);
        if (val !== undefined && val !== null) sum += getNumber(val);
      }
    });
    return sum;
  } catch (e) {
    return 0;
  }
}

/**
 * Get F&B payroll monthly salary total for a year
 */
export function getFnbPayrollMonthlySalaryTotal(calculationCache, projectName, year, location, group, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getFnbPayrollMonthlySalaryByLocation(calculationCache, projectName, year, lab, location, group, getColumnLabelsForYear)), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Get F&B payroll monthly salary percentage for a period
 */
export function getFnbPayrollMonthlySalaryPercentage(calculationCache, projectName, year, label, location, group, getColumnLabelsForYear) {
  try {
    const total = getFnbPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, location, group, getColumnLabelsForYear);
    const yearTotal = getFnbPayrollMonthlySalaryTotal(calculationCache, projectName, year, location, group, getColumnLabelsForYear);
    if (yearTotal === 0) return 0;
    return (total / yearTotal) * 100;
  } catch (error) {
    console.error('Error calculating F&B payroll monthly salary percentage:', error);
    return 0;
  }
}

/**
 * Check if F&B payroll group has data
 */
export function hasFnbPayrollGroupData(calculationCache, projectName, visibleYears, group, getColumnLabelsForYear) {
  try {
    const locs = group === 'management' 
      ? getFnbPayrollLocationsManagement(calculationCache, projectName, visibleYears) 
      : getFnbPayrollLocationsNonManagement(calculationCache, projectName, visibleYears);
    
    if (!locs || locs.length === 0) return false;
    
    for (const year of (Array.isArray(visibleYears) ? visibleYears : [])) {
      for (const loc of locs) {
        const total = getFnbPayrollMonthlySalaryTotal(calculationCache, projectName, year, loc, group, getColumnLabelsForYear);
        if (getNumber(total) > 0) return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Get total F&B payroll for a period
 */
export function getTotalFnbPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears) {
  try {
    let total = 0;

    // Add management payroll
    const mgmtLocs = getFnbPayrollLocationsManagement(calculationCache, projectName, visibleYears);
    for (const loc of mgmtLocs) {
      total += getNumber(getFnbPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, loc, 'management', getColumnLabelsForYear));
    }

    // Add non-management payroll
    const nonMgmtLocs = getFnbPayrollLocationsNonManagement(calculationCache, projectName, visibleYears);
    for (const loc of nonMgmtLocs) {
      total += getNumber(getFnbPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, loc, 'non-management', getColumnLabelsForYear));
    }

    return total;
  } catch (e) {
    return 0;
  }
}

/**
 * Get total F&B payroll for entire year
 */
export function getTotalFnbPayrollYear(calculationCache, projectName, year, getColumnLabelsForYear, visibleYears) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getTotalFnbPayroll(calculationCache, projectName, year, lab, getColumnLabelsForYear, visibleYears)), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Get total F&B payroll percentage for a period
 */
export function getTotalFnbPayrollPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears, getRestaurantList) {
  try {
    const totalRevenue = getTotalFoodAndBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const totalPayroll = getTotalFnbPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears);
    if (totalRevenue === 0) return 0;
    return (totalPayroll / totalRevenue) * 100;
  } catch (error) {
    console.error('Error calculating F&B payroll percentage:', error);
    return 0;
  }
}

