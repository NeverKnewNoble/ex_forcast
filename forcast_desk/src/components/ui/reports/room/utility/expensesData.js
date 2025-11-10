/**
 * Expenses data functions for Room Profit & Loss Report
 * Handles room department expenses, payroll related, and departmental income calculations
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel } from './helpers.js';
import { getTotalRoomsRevenue, getTotalRoomsRevenueTotal } from './revenueData.js';
import { getTotalPayroll, getTotalPayrollYear } from './payrollData.js';

// ============================================================================
// ROOM DEPARTMENT EXPENSES
// ============================================================================

/**
 * Get room department expenses list from cache
 */
export function getRoomDepartmentExpenses(calculationCache, projectName, expenseDataCache) {
  try {
    const expensesSet = new Set();

    // Prefer new normalized expenses structure if available
    if (projectName && calculationCache?.expenses?.[projectName]) {
      const projectExpenses = calculationCache.expenses[projectName];
      // Collect from any department key that maps to Room/Rooms
      Object.keys(projectExpenses).forEach((deptKey) => {
        const isRoomDept = ['room', 'rooms'].includes((deptKey || '').toLowerCase());
        if (!isRoomDept) return;
        const byExpenseName = projectExpenses[deptKey] || {};
        Object.keys(byExpenseName).forEach((expenseName) => {
          if (expenseName) expensesSet.add(expenseName);
        });
      });
      if (expensesSet.size > 0) return Array.from(expensesSet);
    }

    // Fallback to local cache if normalized cache is not populated yet
    const data = expenseDataCache || {};
    for (const [year, months] of Object.entries(data)) {
      for (const [month, entries] of Object.entries(months)) {
        (entries || []).forEach(entry => {
          const dept = (entry.department || '').toLowerCase();
          if (dept === 'room' || dept === 'rooms') {
            const name = entry.expense;
            if (name) expensesSet.add(name);
          }
        });
      }
    }
    return Array.from(expensesSet);
  } catch (e) {
    return [];
  }
}

/**
 * Get room expense amount for a period
 */
export function getRoomExpenseAmount(calculationCache, projectName, year, label, expenseName, expenseDataCache) {
  try {
    // Prefer normalized expenses cache first
    const monthKeys = getMonthsForLabel(label);
    let sum = 0;

    for (const m of monthKeys) {
      // Try normalized lookups under both 'Room' and 'Rooms' department keys
      const amtRoom = calculationCache.getExpense(projectName, 'Room', expenseName, year, m);
      const amtRooms = calculationCache.getExpense(projectName, 'Rooms', expenseName, year, m);
      const normalizedAmt = getNumber(amtRoom || amtRooms || 0);
      if (normalizedAmt > 0) {
        sum += normalizedAmt;
        continue;
      }

      // Fallback to local API-shaped cache
      const entries = expenseDataCache?.[year]?.[m] || [];
      const filtered = entries.filter(e => {
        const dept = (e.department || '').toLowerCase();
        return (dept === 'room' || dept === 'rooms') && e.expense === expenseName;
      });
      sum += filtered.reduce((acc, e) => acc + getNumber(e.amount), 0);
    }
    return sum;
  } catch (e) {
    return 0;
  }
}

/**
 * Get room expense total for entire year
 */
export function getRoomExpenseTotal(calculationCache, projectName, year, expenseName, getColumnLabelsForYear, expenseDataCache) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomExpenseAmount(calculationCache, projectName, year, label, expenseName, expenseDataCache)), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Get room expense percentage
 */
export function getRoomExpensePercentage(calculationCache, projectName, year, label, expenseName, getColumnLabelsForYear, expenseDataCache) {
  try {
    const monthValue = getRoomExpenseAmount(calculationCache, projectName, year, label, expenseName, expenseDataCache);
    const yearTotal = getRoomExpenseTotal(calculationCache, projectName, year, expenseName, getColumnLabelsForYear, expenseDataCache);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room expense percentage:', error);
    return 0;
  }
}

/**
 * Get gross room expenses for a period
 */
export function getGrossRoomExpenses(calculationCache, projectName, year, label, roomDepartmentExpensesList, expenseDataCache) {
  try {
    let total = 0;
    for (const exp of roomDepartmentExpensesList) {
      total += getNumber(getRoomExpenseAmount(calculationCache, projectName, year, label, exp, expenseDataCache));
    }
    return total;
  } catch (e) {
    return 0;
  }
}

/**
 * Get gross room expenses for entire year
 */
export function getGrossRoomExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getGrossRoomExpenses(calculationCache, projectName, year, label, roomDepartmentExpensesList, expenseDataCache)), 0);
  } catch (e) {
    return 0;
  }
}

/**
 * Get gross room expenses percentage
 */
export function getGrossRoomExpensesPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getGrossRoomExpenses(calculationCache, projectName, year, label, roomDepartmentExpensesList, expenseDataCache);
    const monthRevenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating gross room expenses percentage:', error);
    return 0;
  }
}

// ============================================================================
// PAYROLL RELATED EXPENSES
// ============================================================================

/**
 * Get payroll related benefit types list
 */
export function getPayrollRelatedBenefitTypes(calculationCache, projectName, visibleYears) {
  try {
    const types = new Set();
    (Array.isArray(visibleYears) ? visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payrollRelated?.[projectName]?.[yr] || {};
      Object.keys(yearBucket).forEach((typeKey) => {
        if (typeKey) types.add(typeKey);
      });
    });
    return Array.from(types);
  } catch (e) {
    console.error('Error discovering payroll related benefit types:', e);
    return [];
  }
}

/**
 * Get payroll related value for a specific benefit type, year, and period
 */
export function getPayrollRelatedValue(calculationCache, projectName, year, label, benefitType) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payrollRelated structure sum across all positions/locations/designations
    const normYearBucket = calculationCache?.payrollRelated?.[projectName]?.[year];
    if (normYearBucket) {
      const typeBucket = normYearBucket[benefitType] || normYearBucket[benefitType.toUpperCase()] || normYearBucket[benefitType.toLowerCase()];
      if (typeBucket) {
        Object.keys(typeBucket).forEach((positionKey) => {
          const byLocation = typeBucket[positionKey] || {};
          Object.keys(byLocation).forEach((locationKey) => {
            const byDesignation = byLocation[locationKey] || {};
            Object.keys(byDesignation).forEach((designationKey) => {
              const byLabel = byDesignation[designationKey] || {};
              for (const m of months) {
                const v = byLabel?.[m];
                if (v !== undefined && v !== null) sum += getNumber(v);
              }
            });
          });
        });
      }
    }
    if (sum > 0) return sum;

    // Fallback: if 'payrollRelatedCache' is defined as a simple dictionary keyed by benefit type
    // This handles the scenario where benefit data is not normalized
    const fallbackCache = calculationCache?.payrollRelatedCache;
    if (fallbackCache && fallbackCache[benefitType]) {
      const cached = fallbackCache[benefitType];
      for (const m of months) {
        const val = cached?.[year]?.[m];
        if (val !== undefined && val !== null) sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting payroll related value for ${benefitType}:`, error);
    return 0;
  }
}

/**
 * Get payroll related total for entire year
 */
export function getPayrollRelatedTotal(calculationCache, projectName, year, benefitType, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getPayrollRelatedValue(calculationCache, projectName, year, label, benefitType)), 0);
  } catch (error) {
    console.error(`Error calculating payroll related total for ${benefitType}:`, error);
    return 0;
  }
}

/**
 * Get payroll related percentage
 */
export function getPayrollRelatedPercentage(calculationCache, projectName, year, label, benefitType, getColumnLabelsForYear) {
  try {
    const monthValue = getPayrollRelatedValue(calculationCache, projectName, year, label, benefitType);
    const yearTotal = getPayrollRelatedTotal(calculationCache, projectName, year, benefitType, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating payroll related percentage:', error);
    return 0;
  }
}

/**
 * Get total payroll related for a period (sum of all benefit types)
 */
export function getTotalPayrollRelated(calculationCache, projectName, year, label, benefitTypesList) {
  try {
    let total = 0;
    for (const benefitType of benefitTypesList) {
      total += getNumber(getPayrollRelatedValue(calculationCache, projectName, year, label, benefitType));
    }
    return total;
  } catch (error) {
    console.error('Error calculating total payroll related:', error);
    return 0;
  }
}

/**
 * Get total payroll related for entire year
 */
export function getTotalPayrollRelatedYear(calculationCache, projectName, year, getColumnLabelsForYear, benefitTypesList) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getTotalPayrollRelated(calculationCache, projectName, year, label, benefitTypesList)), 0);
  } catch (error) {
    console.error('Error calculating total payroll related for year:', error);
    return 0;
  }
}

/**
 * Get total payroll related percentage
 */
export function getTotalPayrollRelatedPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getTotalPayrollRelated(calculationCache, projectName, year, label, benefitTypesList);
    const monthRevenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total payroll related percentage:', error);
    return 0;
  }
}

// ============================================================================
// TOTAL EXPENSES
// ============================================================================

/**
 * Get total expenses for a period (room expenses + payroll + payroll related)
 */
export function getTotalExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList) {
  try {
    const roomExpenses = getGrossRoomExpenses(calculationCache, projectName, year, label, roomDepartmentExpensesList, expenseDataCache);
    const payroll = getTotalPayroll(calculationCache, projectName, year, label, getColumnLabelsForYear, visibleYears);
    const payrollRelated = getTotalPayrollRelated(calculationCache, projectName, year, label, benefitTypesList);

    return getNumber(roomExpenses) + getNumber(payroll) + getNumber(payrollRelated);
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return 0;
  }
}

/**
 * Get total expenses for entire year
 */
export function getTotalExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getTotalExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList)), 0);
  } catch (error) {
    console.error('Error calculating total expenses for year:', error);
    return 0;
  }
}

/**
 * Get total expenses percentage
 */
export function getTotalExpensesPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getTotalExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList);
    const monthRevenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total expenses percentage:', error);
    return 0;
  }
}

// ============================================================================
// DEPARTMENTAL INCOME (LOSS)
// ============================================================================

/**
 * Get departmental income (revenue - total expenses) for a period
 */
export function getDepartmentalIncome(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const revenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);
    const expenses = getTotalExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList);

    return getNumber(revenue) - getNumber(expenses);
  } catch (error) {
    console.error('Error calculating departmental income:', error);
    return 0;
  }
}

/**
 * Get departmental income for entire year
 */
export function getDepartmentalIncomeYear(calculationCache, projectName, year, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const revenue = getTotalRoomsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear, getRoomRevenueSegmentsList, getRoomTypePackagesList);
    const expenses = getTotalExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList);

    return getNumber(revenue) - getNumber(expenses);
  } catch (error) {
    console.error('Error calculating departmental income for year:', error);
    return 0;
  }
}

/**
 * Get departmental income percentage
 */
export function getDepartmentalIncomePercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getDepartmentalIncome(calculationCache, projectName, year, label, getColumnLabelsForYear, roomDepartmentExpensesList, expenseDataCache, visibleYears, benefitTypesList, getRoomRevenueSegmentsList, getRoomTypePackagesList);
    const monthRevenue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating departmental income percentage:', error);
    return 0;
  }
}

