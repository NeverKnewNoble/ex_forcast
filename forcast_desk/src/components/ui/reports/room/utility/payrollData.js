/**
 * Payroll data functions for Room Profit & Loss Report
 * Handles Room department payroll calculations for management and non-management positions
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel, isManagementPositionName, parseMonthlySalaryRowCode } from './helpers.js';
import { getTotalRoomsRevenue } from './revenueData.js';
import { PAGE } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get payroll locations for management positions
 */
export function getPayrollLocationsManagement(calculationCache, projectName, visibleYears) {
  try {
    const locs = new Set();
    // Prefer normalized payroll cache across visible years
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasMgmt = Object.keys(byPosition).some((pos) => isManagementPositionName(pos));
          if (hasMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('Room P&L: Error discovering payroll management locations:', e);
    return [];
  }
}

/**
 * Get payroll locations for non-management positions
 */
export function getPayrollLocationsNonManagement(calculationCache, projectName, visibleYears) {
  try {
    const locs = new Set();
    // Prefer normalized payroll cache across visible years
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasNonMgmt = Object.keys(byPosition).some((pos) => !isManagementPositionName(pos));
          if (hasNonMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && !isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('Room P&L: Error discovering payroll non-management locations:', e);
    return [];
  }
}

/**
 * Get payroll monthly salary by location for a period
 */
export function getPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, location, group) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure
    const payrollNorm = calculationCache?.payroll?.[projectName]?.[year] || {};
    const isMgmtGroup = group === 'management';
    const isNonMgmtGroup = group === 'non-management';
    Object.keys(payrollNorm).forEach((departmentKey) => {
      const byLocation = payrollNorm[departmentKey] || {};
      const locBucket = byLocation?.[location];
      if (!locBucket) return;
      Object.keys(locBucket).forEach((positionKey) => {
        const mgmt = isManagementPositionName(positionKey);
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
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (!parsed || !parsed.location || parsed.location !== location) return;
      const isMgmt = isManagementPositionName(parsed.position);
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
 * Get payroll monthly salary total for entire year
 */
export function getPayrollMonthlySalaryTotal(calculationCache, projectName, year, location, group, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getPayrollMonthlySalaryByLocation(calculationCache, projectName, year, lab, location, group)), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Get payroll monthly salary percentage
 */
export function getPayrollMonthlySalaryPercentage(calculationCache, projectName, year, label, location, group, getColumnLabelsForYear) {
  try {
    const monthValue = getPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, location, group);
    const yearTotal = getPayrollMonthlySalaryTotal(calculationCache, projectName, year, location, group, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating payroll monthly salary percentage:', error);
    return 0;
  }
}

/**
 * Check if payroll group has data
 */
export function hasPayrollGroupData(calculationCache, projectName, visibleYears, group, getColumnLabelsForYear) {
  try {
    const locs = group === 'management'
      ? getPayrollLocationsManagement(calculationCache, projectName, visibleYears)
      : getPayrollLocationsNonManagement(calculationCache, projectName, visibleYears);

    if (!locs || locs.length === 0) return false;
    for (const year of (Array.isArray(visibleYears) ? visibleYears : [])) {
      for (const loc of locs) {
        const total = getPayrollMonthlySalaryTotal(calculationCache, projectName, year, loc, group, getColumnLabelsForYear);
        if (getNumber(total) > 0) return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Get total payroll for a period (sum of management + non-management)
 */
export function getTotalPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears) {
  try {
    let total = 0;

    // Add management payroll
    const mgmtLocs = getPayrollLocationsManagement(calculationCache, projectName, visibleYears);
    for (const loc of mgmtLocs) {
      total += getNumber(getPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, loc, 'management'));
    }

    // Add non-management payroll
    const nonMgmtLocs = getPayrollLocationsNonManagement(calculationCache, projectName, visibleYears);
    for (const loc of nonMgmtLocs) {
      total += getNumber(getPayrollMonthlySalaryByLocation(calculationCache, projectName, year, label, loc, 'non-management'));
    }

    return total;
  } catch (error) {
    console.error('Error calculating total payroll:', error);
    return 0;
  }
}

/**
 * Get total payroll for entire year
 */
export function getTotalPayrollYear(calculationCache, projectName, year, getColumnLabelsForYear, visibleYears) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getTotalPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears)), 0);
  } catch (error) {
    console.error('Error calculating total payroll for year:', error);
    return 0;
  }
}

/**
 * Get total payroll percentage
 */
export function getTotalPayrollPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getTotalPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears);
    const monthRevenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total payroll percentage:', error);
    return 0;
  }
}

