/**
 * Expenses data functions for OOD Profit & Loss Report
 * Handles OOD expense calculations from the expense assumptions cache
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel } from './helpers.js';
import { PAGE, DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get OOD department expenses for a specific expense type
 */
export function getOodExpense(calculationCache, projectName, department, expenseName, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      const val = calculationCache.getExpense(projectName, department, expenseName, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting OOD expense ${expenseName} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get all OOD expenses for a specific department
 */
export function getOodDepartmentExpenses(calculationCache, projectName, department, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      // Sum all expenses for this department from the normalized expense cache
      const normYearBucket = calculationCache?.cache?.[projectName]?.expenses?.[department]?.[year];
      
      if (normYearBucket) {
        for (const [expenseName, monthsBucket] of Object.entries(normYearBucket)) {
          const amount = monthsBucket[month];
          if (amount !== undefined && amount !== null) {
            sum += getNumber(amount);
          }
        }
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting OOD department expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD department expenses for a year
 */
export function getOodDepartmentExpensesTotal(calculationCache, projectName, department, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getOodDepartmentExpenses(calculationCache, projectName, department, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total OOD expenses for ${year}:`, error);
    return 0;
  }
}

/**
 * Get total OOD expenses across all OOD departments
 */
export function getTotalOodExpenses(calculationCache, projectName, year, label, oodDepartments = []) {
  try {
    let sum = 0;

    // Sum expenses from all OOD departments
    for (const department of oodDepartments) {
      sum += getNumber(getOodDepartmentExpenses(calculationCache, projectName, department, year, label));
    }

    return sum;
  } catch (error) {
    console.error(`Error getting total OOD expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD expenses for a year
 */
export function getTotalOodExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear, oodDepartments = []) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getTotalOodExpenses(calculationCache, projectName, year, label, oodDepartments));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total OOD expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if there's any OOD expense data
 */
export function hasOodExpenseData(calculationCache, projectName, visibleYears, getColumnLabelsForYear, oodDepartments = []) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      for (const department of oodDepartments) {
        if (getOodDepartmentExpenses(calculationCache, projectName, department, year, label) > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

// ============================================================================
// OOD EXPENSE CATEGORIES (Individual Line Items)
// ============================================================================

/**
 * Get list of OOD expense categories from cache
 */
export function getOodExpenseCategories(calculationCache, projectName) {
  try {
    const oodExpenses = calculationCache.expenses?.[projectName]?.[DEPARTMENT.OTHER_OPERATING_DEPARTMENTS] || {};

    // Get all expense names (keys) from the OOD department
    const expenseNames = Object.keys(oodExpenses);

    // Sort for stable display
    return expenseNames.sort();
  } catch (error) {
    console.error('Error reading OOD expense categories from cache:', error);
    return [];
  }
}

/**
 * Get OOD expense value for a specific category and period
 */
export function getOodExpenseByCategory(calculationCache, projectName, expenseCategory, year, label) {
  try {
    // Get the expense value from the normalized expense cache
    const value = calculationCache.getExpense(projectName, DEPARTMENT.OTHER_OPERATING_DEPARTMENTS, expenseCategory, year, label);

    if (value !== undefined && value !== null) {
      return getNumber(value);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting OOD expense ${expenseCategory} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get OOD expense value for entire year
 */
export function getOodExpenseByCategoryYear(calculationCache, projectName, expenseCategory, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthExpense = getOodExpenseByCategory(calculationCache, projectName, expenseCategory, year, label);
      yearTotal += getNumber(monthExpense);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating OOD expense ${expenseCategory} for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total of all OOD expenses for a period
 */
export function getTotalOodExpensesByCategory(calculationCache, projectName, year, label) {
  try {
    const expenses = getOodExpenseCategories(calculationCache, projectName);
    let total = 0;

    for (const expense of expenses) {
      const expenseValue = getOodExpenseByCategory(calculationCache, projectName, expense, year, label);
      total += getNumber(expenseValue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total OOD expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total of all OOD expenses for entire year
 */
export function getTotalOodExpensesByCategoryYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      yearTotal += getNumber(getTotalOodExpensesByCategory(calculationCache, projectName, year, label));
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total OOD expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if there's any OOD expense category data
 */
export function hasOodExpenseCategoryData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  try {
    const expenses = getOodExpenseCategories(calculationCache, projectName);
    if (!expenses || expenses.length === 0) return false;

    for (const year of visibleYears) {
      const labels = getColumnLabelsForYear(year);
      for (const label of labels) {
        if (getTotalOodExpensesByCategory(calculationCache, projectName, year, label) > 0) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

