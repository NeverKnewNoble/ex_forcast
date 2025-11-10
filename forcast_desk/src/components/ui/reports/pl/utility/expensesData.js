/**
 * Expenses data functions for P&L Statement Report
 * Aggregates expenses from all departments
 */

import { getNumber } from './formatters.js';
import { DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get total Room expenses for a period
 */
export function getTotalRoomExpenses(calculationCache, projectName, year, label) {
  try {
    let total = 0;
    const roomExpenses = calculationCache.expenses?.[projectName]?.[DEPARTMENT.ROOM] || {};
    
    Object.keys(roomExpenses).forEach((expenseName) => {
      const yearData = roomExpenses[expenseName]?.[year];
      if (yearData && yearData[label] !== undefined) {
        total += getNumber(yearData[label]);
      }
    });
    
    return total;
  } catch (error) {
    console.error(`Error getting Room expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total Room expenses for a year
 */
export function getTotalRoomExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalRoomExpenses(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating Room expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total F&B expenses for a period
 */
export function getTotalFnbExpenses(calculationCache, projectName, year, label) {
  try {
    let total = 0;
    const fnbExpenses = calculationCache.expenses?.[projectName]?.[DEPARTMENT.FOOD_AND_BEVERAGE] || {};
    
    Object.keys(fnbExpenses).forEach((expenseName) => {
      const yearData = fnbExpenses[expenseName]?.[year];
      if (yearData && yearData[label] !== undefined) {
        total += getNumber(yearData[label]);
      }
    });
    
    return total;
  } catch (error) {
    console.error(`Error getting F&B expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total F&B expenses for a year
 */
export function getTotalFnbExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalFnbExpenses(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating F&B expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total OOD expenses for a period
 */
export function getTotalOodExpenses(calculationCache, projectName, year, label) {
  try {
    let total = 0;
    const oodExpenses = calculationCache.expenses?.[projectName]?.[DEPARTMENT.OTHER_OPERATING] || {};
    
    Object.keys(oodExpenses).forEach((expenseName) => {
      const yearData = oodExpenses[expenseName]?.[year];
      if (yearData && yearData[label] !== undefined) {
        total += getNumber(yearData[label]);
      }
    });
    
    return total;
  } catch (error) {
    console.error(`Error getting OOD expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD expenses for a year
 */
export function getTotalOodExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalOodExpenses(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating OOD expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total operating expenses for a period
 */
export function getTotalOperatingExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const roomExpenses = getTotalRoomExpenses(calculationCache, projectName, year, label);
    const fnbExpenses = getTotalFnbExpenses(calculationCache, projectName, year, label);
    const oodExpenses = getTotalOodExpenses(calculationCache, projectName, year, label);
    
    return getNumber(roomExpenses) + getNumber(fnbExpenses) + getNumber(oodExpenses);
  } catch (error) {
    console.error(`Error calculating total operating expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total operating expenses for a year
 */
export function getTotalOperatingExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const roomExpenses = getTotalRoomExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear);
    const fnbExpenses = getTotalFnbExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear);
    const oodExpenses = getTotalOodExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear);
    
    return getNumber(roomExpenses) + getNumber(fnbExpenses) + getNumber(oodExpenses);
  } catch (error) {
    console.error(`Error calculating total operating expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total departmental profit for a period (Revenue - Departmental Expenses)
 */
export function getTotalDepartmentalProfit(calculationCache, projectName, year, label, getTotalOperatingRevenue, getColumnLabelsForYear) {
  try {
    const revenue = getTotalOperatingRevenue(calculationCache, projectName, year, label, getColumnLabelsForYear);
    const expenses = getTotalOperatingExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear);
    return getNumber(revenue) - getNumber(expenses);
  } catch (error) {
    console.error(`Error calculating departmental profit for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total departmental profit for a year
 */
export function getTotalDepartmentalProfitYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalOperatingRevenueYear, getTotalOperatingExpensesYear) {
  try {
    const revenue = getTotalOperatingRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear);
    const expenses = getTotalOperatingExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear);
    return getNumber(revenue) - getNumber(expenses);
  } catch (error) {
    console.error(`Error calculating departmental profit for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get undistributed operating expense by category
 */
export function getUndistributedExpense(calculationCache, projectName, year, label, category) {
  try {
    // TODO: Implement based on actual data structure
    // Categories: 'Administration and General', 'Information and Telecommunications Systems', 
    //             'Sales and Marketing', 'Property Operation and Maintenance', 'Utilities'
    return 0;
  } catch (error) {
    console.error(`Error getting undistributed expense ${category} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total undistributed expenses for a period
 */
export function getTotalUndistributedExpenses(calculationCache, projectName, year, label) {
  try {
    let total = 0;
    const categories = [
      'Administration and General',
      'Information and Telecommunications Systems',
      'Sales and Marketing',
      'Property Operation and Maintenance',
      'Utilities'
    ];
    
    categories.forEach(category => {
      total += getUndistributedExpense(calculationCache, projectName, year, label, category);
    });
    
    return total;
  } catch (error) {
    console.error(`Error calculating total undistributed expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total undistributed expenses for a year
 */
export function getTotalUndistributedExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalUndistributedExpenses(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating total undistributed expenses for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get gross operating profit for a period
 */
export function getGrossOperatingProfit(calculationCache, projectName, year, label, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue) {
  try {
    const departmentalProfit = getTotalDepartmentalProfit(calculationCache, projectName, year, label, getTotalOperatingRevenue, getColumnLabelsForYear);
    const undistributedExpenses = getTotalUndistributedExpenses(calculationCache, projectName, year, label);
    return getNumber(departmentalProfit) - getNumber(undistributedExpenses);
  } catch (error) {
    console.error(`Error calculating gross operating profit for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get gross operating profit for a year
 */
export function getGrossOperatingProfitYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalDepartmentalProfitYear, getTotalOperatingRevenueYear, getTotalOperatingExpensesYear) {
  try {
    const departmentalProfit = getTotalDepartmentalProfitYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalOperatingRevenueYear, getTotalOperatingExpensesYear);
    const undistributedExpenses = getTotalUndistributedExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear);
    return getNumber(departmentalProfit) - getNumber(undistributedExpenses);
  } catch (error) {
    console.error(`Error calculating gross operating profit for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get management fee by type
 */
export function getManagementFee(calculationCache, projectName, year, label, feeType) {
  try {
    // TODO: Implement based on actual data structure
    // feeType: 'Base Fee' or 'Incentive Fee'
    return 0;
  } catch (error) {
    console.error(`Error getting ${feeType} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total management fees for a period
 */
export function getTotalManagementFees(calculationCache, projectName, year, label) {
  try {
    const baseFee = getManagementFee(calculationCache, projectName, year, label, 'Base Fee');
    const incentiveFee = getManagementFee(calculationCache, projectName, year, label, 'Incentive Fee');
    return getNumber(baseFee) + getNumber(incentiveFee);
  } catch (error) {
    console.error(`Error calculating total management fees for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total management fees for a year
 */
export function getTotalManagementFeesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalManagementFees(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating total management fees for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get income before non-operating income & expenses
 */
export function getIncomeBeforeNonOperating(calculationCache, projectName, year, label, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue) {
  try {
    const grossOperatingProfit = getGrossOperatingProfit(calculationCache, projectName, year, label, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue);
    const managementFees = getTotalManagementFees(calculationCache, projectName, year, label);
    return getNumber(grossOperatingProfit) - getNumber(managementFees);
  } catch (error) {
    console.error(`Error calculating income before non-operating for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get non-operating item by type
 */
export function getNonOperatingItem(calculationCache, projectName, year, label, itemType) {
  try {
    // TODO: Implement based on actual data structure
    // itemType: 'Income', 'Rent', 'Property and Other Taxes', 'Insurance', 'Directors Remuneration', 'Other'
    return 0;
  } catch (error) {
    console.error(`Error getting non-operating ${itemType} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total non-operating income and expenses
 */
export function getTotalNonOperating(calculationCache, projectName, year, label) {
  try {
    const income = getNonOperatingItem(calculationCache, projectName, year, label, 'Income');
    const rent = getNonOperatingItem(calculationCache, projectName, year, label, 'Rent');
    const taxes = getNonOperatingItem(calculationCache, projectName, year, label, 'Property and Other Taxes');
    const insurance = getNonOperatingItem(calculationCache, projectName, year, label, 'Insurance');
    const directors = getNonOperatingItem(calculationCache, projectName, year, label, 'Directors Remuneration');
    const other = getNonOperatingItem(calculationCache, projectName, year, label, 'Other');
    
    return getNumber(income) - getNumber(rent) - getNumber(taxes) - getNumber(insurance) - getNumber(directors) - getNumber(other);
  } catch (error) {
    console.error(`Error calculating total non-operating for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get EBITDA
 */
export function getEBITDA(calculationCache, projectName, year, label, getIncomeBeforeNonOperating, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue) {
  try {
    const incomeBeforeNonOperating = getIncomeBeforeNonOperating(calculationCache, projectName, year, label, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue);
    const nonOperating = getTotalNonOperating(calculationCache, projectName, year, label);
    return getNumber(incomeBeforeNonOperating) + getNumber(nonOperating);
  } catch (error) {
    console.error(`Error calculating EBITDA for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get interest, depreciation, or amortization item
 */
export function getIDAItem(calculationCache, projectName, year, label, itemType) {
  try {
    // TODO: Implement based on actual data structure
    // itemType: 'Loan Interest', 'Depreciation', 'Amortization'
    return 0;
  } catch (error) {
    console.error(`Error getting ${itemType} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total interest, depreciation and amortization
 */
export function getTotalIDA(calculationCache, projectName, year, label) {
  try {
    const interest = getIDAItem(calculationCache, projectName, year, label, 'Loan Interest');
    const depreciation = getIDAItem(calculationCache, projectName, year, label, 'Depreciation');
    const amortization = getIDAItem(calculationCache, projectName, year, label, 'Amortization');
    
    return getNumber(interest) + getNumber(depreciation) + getNumber(amortization);
  } catch (error) {
    console.error(`Error calculating total IDA for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get earnings before income taxes
 */
export function getEarningsBeforeTaxes(calculationCache, projectName, year, label, getEBITDA, getIncomeBeforeNonOperating, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue) {
  try {
    const ebitda = getEBITDA(calculationCache, projectName, year, label, getIncomeBeforeNonOperating, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue);
    const ida = getTotalIDA(calculationCache, projectName, year, label);
    return getNumber(ebitda) - getNumber(ida);
  } catch (error) {
    console.error(`Error calculating earnings before taxes for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get replacement reserve
 */
export function getReplacementReserve(calculationCache, projectName, year, label) {
  try {
    // TODO: Implement based on actual data structure
    return 0;
  } catch (error) {
    console.error(`Error getting replacement reserve for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get earnings before taxes less replacement reserve
 */
export function getEarningsBeforeTaxesLessReserve(calculationCache, projectName, year, label, getEarningsBeforeTaxes, getEBITDA, getIncomeBeforeNonOperating, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue) {
  try {
    const earningsBeforeTaxes = getEarningsBeforeTaxes(calculationCache, projectName, year, label, getEBITDA, getIncomeBeforeNonOperating, getGrossOperatingProfit, getTotalDepartmentalProfit, getColumnLabelsForYear, getTotalOperatingRevenue);
    const replacementReserve = getReplacementReserve(calculationCache, projectName, year, label);
    return getNumber(earningsBeforeTaxes) - getNumber(replacementReserve);
  } catch (error) {
    console.error(`Error calculating earnings before taxes less reserve for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Check if expense data is available
 */
export function hasExpenseData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalOperatingExpenses(calculationCache, projectName, year, label, getColumnLabelsForYear) > 0) {
        return true;
      }
    }
  }
  return false;
}

