/**
 * Expenses data functions for F&B Profit & Loss Report
 * Handles cost of sales, F&B expenses, and gross profit calculations
 */

import { getNumber } from './formatters.js';
import { getTotalFoodRevenue, getTotalBeverageRevenue, getTotalRevenue, getAudiovisualRevenue, getMiscellaneousOtherRevenue } from './revenueData.js';
import { DEPARTMENT, EXPENSE } from '@/components/utility/_master_utility/cacheKeys.js';

// ============================================================================
// COST OF SALES
// ============================================================================

/**
 * Get cost of food sales for a period
 */
export function getCostOfFoodSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    // Fetch rate from normalized expense cache as percentage/ratio
    const rateRaw = calculationCache.getExpense(
      projectName,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_FOOD_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const totalFoodRevenue = getTotalFoodRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    return getNumber(totalFoodRevenue) * rate;
  } catch (error) {
    console.error(`Error getting cost of food sales for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get cost of food sales for entire year
 */
export function getCostOfFoodSalesYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthCostOfFoodSales = getCostOfFoodSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthCostOfFoodSales);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating cost of food sales for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get cost of beverage sales for a period
 */
export function getCostOfBeverageSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    // Fetch rate from normalized expense cache as percentage/ratio
    const rateRaw = calculationCache.getExpense(
      projectName,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_BEVERAGE_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const totalBeverageRevenue = getTotalBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    return getNumber(totalBeverageRevenue) * rate;
  } catch (error) {
    console.error(`Error getting cost of beverage sales for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get cost of beverage sales for entire year
 */
export function getCostOfBeverageSalesYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthCostOfBeverageSales = getCostOfBeverageSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthCostOfBeverageSales);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating cost of beverage sales for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total F&B cost of sales for a period
 */
export function getTotalFnbCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const costOfFoodSales = getCostOfFoodSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const costOfBeverageSales = getCostOfBeverageSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const total = getNumber(costOfFoodSales) + getNumber(costOfBeverageSales);

    return total;
  } catch (error) {
    console.error(`Error calculating total F&B cost of sales for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total F&B cost of sales for entire year
 */
export function getTotalFnbCostOfSalesYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalFnbCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total F&B cost of sales for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// OTHER COSTS
// ============================================================================

/**
 * Get audiovisual cost for a period
 */
export function getAudiovisualCost(calculationCache, projectName, year, label) {
  try {
    // Audiovisual Cost = Cost of Beverage sales * (Audiovisual Revenue)
    // Rate source: normalized expense cache -> Cost of Beverage sales
    const rateRaw = calculationCache.getExpense(
      projectName,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_BEVERAGE_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const avRevenue = getAudiovisualRevenue(calculationCache, projectName, year, label);
    return getNumber(avRevenue) * rate;
  } catch (error) {
    console.error(`Error getting audiovisual costs for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get audiovisual cost for entire year
 */
export function getAudiovisualCostYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthAudiovisuals = getAudiovisualCost(calculationCache, projectName, year, label);
      yearTotal += getNumber(monthAudiovisuals);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating audiovisual costs for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get miscellaneous cost for a period
 */
export function getMiscellaneousCost(calculationCache, projectName, year, label) {
  try {
    // Miscellaneous Cost = Cost of Beverage sales * (Miscellaneous Other Revenue)
    // Rate source: normalized expense cache -> Cost of Beverage sales
    const rateRaw = calculationCache.getExpense(
      projectName,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_BEVERAGE_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const miscOtherRevenue = getMiscellaneousOtherRevenue(calculationCache, projectName, year, label);
    return getNumber(miscOtherRevenue) * rate;
  } catch (error) {
    console.error(`Error getting miscellaneous costs for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get miscellaneous cost for entire year
 */
export function getMiscellaneousCostYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthMiscellaneous = getMiscellaneousCost(calculationCache, projectName, year, label);
      yearTotal += getNumber(monthMiscellaneous);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating miscellaneous costs for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total cost of other revenue for a period
 */
export function getTotalCostOfOtherRevenue(calculationCache, projectName, year, label) {
  try {
    const miscellaneousCost = getMiscellaneousCost(calculationCache, projectName, year, label);
    const audiovisualCost = getAudiovisualCost(calculationCache, projectName, year, label);
    const total = getNumber(miscellaneousCost) + getNumber(audiovisualCost);

    return total;
  } catch (error) {
    console.error(`Error calculating total cost of other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total cost of other revenue for entire year
 */
export function getTotalCostOfOtherRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalCostOfOtherRevenue(calculationCache, projectName, year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total cost of other revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total cost of sales for a period
 */
export function getTotalCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const totalFnbCostOfSales = getTotalFnbCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const totalCostOfOtherRevenue = getTotalCostOfOtherRevenue(calculationCache, projectName, year, label);
    const total = getNumber(totalFnbCostOfSales) + getNumber(totalCostOfOtherRevenue);

    return total;
  } catch (error) {
    console.error(`Error calculating total cost of sales for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total cost of sales for entire year
 */
export function getTotalCostOfSalesYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total cost of sales for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// GROSS PROFIT
// ============================================================================

/**
 * Get gross profit for a period
 */
export function getGrossProfit(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const totalRevenue = getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const totalCostOfSales = getTotalCostOfSales(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const grossProfit = getNumber(totalRevenue) - getNumber(totalCostOfSales);

    return grossProfit;
  } catch (error) {
    console.error(`Error calculating gross profit for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get gross profit for entire year
 */
export function getGrossProfitYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthGrossProfit = getGrossProfit(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthGrossProfit);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating gross profit for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// F&B EXPENSES
// ============================================================================

/**
 * Get list of F&B expenses from cache
 */
export function getFnbExpenses(calculationCache, projectName) {
  // Dynamically read F&B expense categories from the normalized expense cache
  try {
    const fnbExpenses = calculationCache.expenses?.[projectName]?.[DEPARTMENT.FOOD_AND_BEVERAGE] || {};

    // Get all expense names (keys) from the F&B department
    const expenseNames = Object.keys(fnbExpenses);

    // Exclude Cost of Food sales and Cost of Beverage sales rows from F&B expenses list
    const normalize = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
    const excluded = new Set(['cost of food sales', 'cost of beverage sales', 'miscellaneous cost', 'audiovisual cost']);
    const filteredExpenses = expenseNames.filter(name => !excluded.has(normalize(name)));

    // Sort for stable display
    return filteredExpenses.sort();
  } catch (error) {
    console.error('Error reading F&B expense categories from cache:', error);
    return [];
  }
}

/**
 * Get F&B expense value for a period
 */
export function getFnbExpense(calculationCache, projectName, expense, year, label) {
  try {
    // Get the expense value from the normalized expense cache
    const value = calculationCache.getExpense(projectName, DEPARTMENT.FOOD_AND_BEVERAGE, expense, year, label);

    if (value !== undefined && value !== null) {
      return getNumber(value);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting F&B expense ${expense} for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get F&B expense value for entire year
 */
export function getFnbExpenseYear(calculationCache, projectName, expense, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthExpense = getFnbExpense(calculationCache, projectName, expense, year, label);
      yearTotal += getNumber(monthExpense);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating F&B expense ${expense} for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total F&B expenses for a period
 */
export function getTotalFnbExpenses(calculationCache, projectName, year, label) {
  try {
    const expenses = getFnbExpenses(calculationCache, projectName);
    let total = 0;

    for (const expense of expenses) {
      const expenseValue = getFnbExpense(calculationCache, projectName, expense, year, label);
      total += getNumber(expenseValue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total F&B expenses for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total F&B expenses for entire year
 */
export function getTotalFnbExpensesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalFnbExpenses(calculationCache, projectName, year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total F&B expenses for year ${year}:`, error);
    return 0;
  }
}

