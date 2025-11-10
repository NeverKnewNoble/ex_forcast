/**
 * Payroll data functions for OOD Profit & Loss Report
 * Handles OOD payroll calculations from the payroll cache
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel, parsePayrollDesignation } from './helpers.js';
import { PAGE, DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get OOD payroll for a specific designation (Management/Non-Management)
 */
export function getOodPayrollByDesignation(calculationCache, projectName, department, designation, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure
    const normYearBucket = calculationCache?.cache?.[projectName]?.payroll?.[department]?.[year];

    if (normYearBucket) {
      for (const [rowCode, monthsBucket] of Object.entries(normYearBucket)) {
        const rowDesignation = parsePayrollDesignation(rowCode);
        if (rowDesignation === designation) {
          for (const month of months) {
            const amount = monthsBucket[month];
            if (amount !== undefined && amount !== null) {
              sum += getNumber(amount);
            }
          }
        }
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting OOD payroll for ${designation} in ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD payroll for a department
 */
export function getTotalOodPayroll(calculationCache, projectName, department, year, label) {
  try {
    const management = getOodPayrollByDesignation(calculationCache, projectName, department, 'Management', year, label);
    const nonManagement = getOodPayrollByDesignation(calculationCache, projectName, department, 'Non-Management', year, label);
    
    return getNumber(management) + getNumber(nonManagement);
  } catch (error) {
    console.error(`Error calculating total OOD payroll for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD payroll for a year
 */
export function getTotalOodPayrollYear(calculationCache, projectName, department, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getTotalOodPayroll(calculationCache, projectName, department, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total OOD payroll for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get payroll related value for a specific benefit type
 */
export function getPayrollRelatedValue(calculationCache, projectName, benefitType, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payrollRelated structure
    const normYearBucket = calculationCache?.cache?.[projectName]?.payrollRelated?.[year];

    if (normYearBucket) {
      for (const [rowCode, monthsBucket] of Object.entries(normYearBucket)) {
        if (rowCode.includes(benefitType)) {
          for (const month of months) {
            const amount = monthsBucket[month];
            if (amount !== undefined && amount !== null) {
              sum += getNumber(amount);
            }
          }
        }
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting payroll related ${benefitType} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total payroll related expenses
 */
export function getTotalPayrollRelatedExpenses(calculationCache, projectName, year, label) {
  try {
    const benefitTypes = [
      'NSSIT', 'Vacation', 'Relocation', 'Severence & Indemnity', 'Other',
      'Medical', 'Uniforms', 'Employee Meal', 'Transport', 'Telephone',
      'Air Ticket', 'Other Benefits'
    ];

    let sum = 0;
    for (const benefitType of benefitTypes) {
      sum += getNumber(getPayrollRelatedValue(calculationCache, projectName, benefitType, year, label));
    }

    return sum;
  } catch (error) {
    console.error(`Error calculating total payroll related expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total payroll related expenses for a year
 */
export function getTotalPayrollRelatedExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getTotalPayrollRelatedExpenses(calculationCache, projectName, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total payroll related expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get bonus value for OOD from Bonus page cache
 */
export function getBonusValue(calculationCache, projectName, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;
    
    // Get data from Bonus page cache using "Total Hotel" row code
    for (const month of months) {
      const val = calculationCache.getValue(projectName, PAGE.BONUS, 'Total Hotel', year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting bonus for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total bonus for a year
 */
export function getBonusTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getBonusValue(calculationCache, projectName, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total bonus for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if there's any payroll data
 */
export function hasPayrollData(calculationCache, projectName, department, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalOodPayroll(calculationCache, projectName, department, year, label) > 0) return true;
    }
  }

  return false;
}

/**
 * Check if there's any payroll related data
 */
export function hasPayrollRelatedData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalPayrollRelatedExpenses(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

/**
 * Check if there's any bonus data
 */
export function hasBonusData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getBonusValue(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

