/**
 * Payroll data functions for P&L Statement Report
 * Aggregates payroll from all departments
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel } from './helpers.js';

/**
 * Get total hotel payroll for a period
 */
export function getTotalHotelPayroll(calculationCache, projectName, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;
    
    // Get from normalized payroll structure
    const payrollNorm = calculationCache?.payroll?.[projectName]?.[year] || {};
    
    Object.keys(payrollNorm).forEach((departmentKey) => {
      const byLocation = payrollNorm[departmentKey] || {};
      Object.keys(byLocation).forEach((locationKey) => {
        const byPosition = byLocation[locationKey] || {};
        Object.keys(byPosition).forEach((positionKey) => {
          const byDesignation = byPosition[positionKey] || {};
          Object.keys(byDesignation).forEach((designationKey) => {
            const byLabel = byDesignation[designationKey] || {};
            for (const m of months) {
              const v = byLabel?.[m];
              if (v !== undefined && v !== null) sum += getNumber(v);
            }
          });
        });
      });
    });
    
    return sum;
  } catch (error) {
    console.error(`Error getting total hotel payroll for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total hotel payroll for a year
 */
export function getTotalHotelPayrollYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalHotelPayroll(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating total hotel payroll for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if payroll data is available
 */
export function hasPayrollData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalHotelPayroll(calculationCache, projectName, year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

