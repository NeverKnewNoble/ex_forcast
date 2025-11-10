/**
 * Revenue data functions for F&B Profit & Loss Report
 * Handles food revenue, beverage revenue, other revenue, and service charges
 */

import { getNumber } from './formatters.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';

// ============================================================================
// RESTAURANT FOOD & BEVERAGE REVENUE
// ============================================================================

/**
 * Get restaurant food revenue for a period
 */
export function getRestaurantFoodRevenue(calculationCache, projectName, restaurant, year, label) {
  try {
    // Get restaurant name (handle both object and string)
    const restaurantName = restaurant.name || restaurant;

    // Prefer normalized F&B metric
    const normalized = calculationCache.getFnbMetric(projectName, restaurantName, 'totalFoodRevenue', year, label);

    if (normalized !== undefined && normalized !== null && normalized !== 0) return getNumber(normalized);

    // Legacy PAGE cache using concatenated row key
    const cacheKey = `Total Food Revenue:${restaurantName}`;
    const val = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, cacheKey, year, label);
    if (val !== undefined && val !== null) return getNumber(val);

    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: ROW.TOTAL_FOOD_REVENUE
    };

    const fallbackVal = calculationCache.getValue(
      projectName,
      PAGE.FNB_REVENUE,
      JSON.stringify(rowData),
      year,
      label
    );
    if (fallbackVal !== undefined && fallbackVal !== null) return getNumber(fallbackVal);

    return 0;
  } catch (error) {
    console.error(`[FNB PnL] Error getting food revenue for ${restaurant}:`, error);
    return 0;
  }
}

/**
 * Get restaurant food revenue for entire year
 */
export function getRestaurantFoodRevenueYear(calculationCache, projectName, restaurant, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getRestaurantFoodRevenue(calculationCache, projectName, restaurant, year, label)), 0);
}

/**
 * Get restaurant beverage revenue for a period
 */
export function getRestaurantBeverageRevenue(calculationCache, projectName, restaurant, year, label) {
  try {
    // Get restaurant name (handle both object and string)
    const restaurantName = restaurant.name || restaurant;

    // Prefer normalized F&B metric
    const normalized = calculationCache.getFnbMetric(projectName, restaurantName, 'totalBeverageRevenue', year, label);
    if (normalized !== undefined && normalized !== null && normalized !== 0) return getNumber(normalized);

    // Legacy PAGE cache using concatenated row key
    const cacheKey = `Total Beverage Revenue:${restaurantName}`;
    const val = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, cacheKey, year, label);
    if (val !== undefined && val !== null) return getNumber(val);

    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: ROW.TOTAL_BEVERAGE_REVENUE
    };

    const fallbackVal = calculationCache.getValue(
      projectName,
      PAGE.FNB_REVENUE,
      JSON.stringify(rowData),
      year,
      label
    );
    if (fallbackVal !== undefined && fallbackVal !== null) return getNumber(fallbackVal);

    return 0;
  } catch (error) {
    console.error(`Error getting beverage revenue for ${restaurant}:`, error);
    return 0;
  }
}

/**
 * Get restaurant beverage revenue for entire year
 */
export function getRestaurantBeverageRevenueYear(calculationCache, projectName, restaurant, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getRestaurantBeverageRevenue(calculationCache, projectName, restaurant, year, label)), 0);
}

// ============================================================================
// BANQUET REVENUE
// ============================================================================

/**
 * Get banquet food revenue for a period
 */
export function getBanquetFoodRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, ROW.FOOD, year, label);
    
    if (val !== undefined && val !== null && val !== 0) {
      return getNumber(val);
    }
    
    return 0;

  } catch (error) {
    console.error(`[FNB PnL] Error getting banquet food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get banquet food revenue for entire year
 */
export function getBanquetFoodRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getBanquetFoodRevenue(calculationCache, projectName, year, label)), 0);
}

/**
 * Get banquet beverage revenue for a period
 */
export function getBanquetBeverageRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Sum up Liquor + Soft Drinks for the month
    const liquorValue = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, ROW.LIQUOR, year, label);
    const softDrinksValue = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, ROW.SOFT_DRINKS, year, label);

    const liquor = getNumber(liquorValue) || 0;
    const softDrinks = getNumber(softDrinksValue) || 0;
    const total = liquor + softDrinks;

    return total;
  } catch (error) {
    console.error(`Error getting banquet beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get banquet beverage revenue for entire year
 */
export function getBanquetBeverageRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getBanquetBeverageRevenue(calculationCache, projectName, year, label)), 0);
}

// ============================================================================
// OUTSIDE CATERING REVENUE
// ============================================================================

/**
 * Get outside catering food revenue for a period
 */
export function getOutsideCateringFoodRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Try common row codes for outside catering food revenue
    const possibleRowCodes = [
      'outside_service_food_catering',
      'outside_catering_food',
      'catering_food',
      'outside_food_service',
      'external_catering_food'
    ];

    for (const rowCode of possibleRowCodes) {
      const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, rowCode, year, label);
      if (val !== undefined && val !== null) {
        return getNumber(val);
      }
    }

    return 0;
  } catch (error) {
    console.error(`Error getting outside catering food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get outside catering food revenue for entire year
 */
export function getOutsideCateringFoodRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getOutsideCateringFoodRevenue(calculationCache, projectName, year, label)), 0);
}

/**
 * Get outside catering beverage revenue for a period
 */
export function getOutsideCateringBeverageRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Based on your cache logs, this uses the exact row code: "outside_service_beverage_catering"
    const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'outside_service_beverage_catering', year, label);

    if (val !== undefined && val !== null) {
      return getNumber(val);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting outside catering beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get outside catering beverage revenue for entire year
 */
export function getOutsideCateringBeverageRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getOutsideCateringBeverageRevenue(calculationCache, projectName, year, label)), 0);
}

// ============================================================================
// OTHER REVENUE
// ============================================================================

/**
 * Get function room rental revenue for a period
 */
export function getFunctionRoomRentalRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'Hall Space Charges', year, label);

    if (val !== undefined && val !== null) {
      return getNumber(val);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting function room rental revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get function room rental revenue for entire year
 */
export function getFunctionRoomRentalRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getFunctionRoomRentalRevenue(calculationCache, projectName, year, label)), 0);
}

/**
 * Get miscellaneous other revenue for a period
 */
export function getMiscellaneousOtherRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Sum up Tobacco + non_fnb + Others for the month
    const tobaccoValue = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'tobacco', year, label);
    const nonFnbValue = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'non_fnb', year, label);
    const othersValue = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'others', year, label);

    const tobacco = getNumber(tobaccoValue) || 0;
    const nonFnb = getNumber(nonFnbValue) || 0;
    const others = getNumber(othersValue) || 0;

    // Try to find any additional banquet detail rows that might exist
    const additionalRowCodes = [
      'additional_revenue',
      'extra_revenue',
      'supplementary_revenue',
      'additional_income',
      'extra_income'
    ];

    let additionalTotal = 0;
    for (const rowCode of additionalRowCodes) {
      const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, rowCode, year, label);
      if (val !== undefined && val !== null) {
        const additionalValue = getNumber(val) || 0;
        additionalTotal += additionalValue;
      }
    }

    const total = tobacco + nonFnb + others + additionalTotal;

    return total;
  } catch (error) {
    console.error(`Error getting miscellaneous other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get miscellaneous other revenue for entire year
 */
export function getMiscellaneousOtherRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getMiscellaneousOtherRevenue(calculationCache, projectName, year, label)), 0);
}

/**
 * Get audiovisual revenue for a period (currently unused but kept for reference)
 */
export function getAudiovisualRevenue(calculationCache, projectName, year, label) {
  try {
    const val = calculationCache.getValue(projectName, PAGE.BANQUET_REVENUE, 'audiovisual', year, label);
    if (val !== undefined && val !== null) {
      return getNumber(val);
    }
    return 0;
  } catch (error) {
    console.error(`Error getting audiovisual revenue for ${year} ${label}:`, error);
    return 0;
  }
}

// ============================================================================
// TOTAL REVENUE CALCULATIONS
// ============================================================================

/**
 * Get total food revenue for a period
 */
export function getTotalFoodRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const restaurantList = getRestaurantList();
    let total = 0;

    for (const restaurant of restaurantList) {
      const revenue = getRestaurantFoodRevenue(calculationCache, projectName, restaurant, year, label);
      total += getNumber(revenue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total food revenue for entire year
 */
export function getTotalFoodRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalFoodRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total food revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total beverage revenue for a period
 */
export function getTotalBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const restaurantList = getRestaurantList();
    let total = 0;

    for (const restaurant of restaurantList) {
      const revenue = getRestaurantBeverageRevenue(calculationCache, projectName, restaurant, year, label);
      total += getNumber(revenue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total beverage revenue for entire year
 */
export function getTotalBeverageRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total beverage revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total food & beverage revenue for a period
 */
export function getTotalFoodAndBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const foodRevenue = getTotalFoodRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const beverageRevenue = getTotalBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const total = getNumber(foodRevenue) + getNumber(beverageRevenue);

    return total;
  } catch (error) {
    console.error(`Error calculating total food & beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total food & beverage revenue for entire year
 */
export function getTotalFoodAndBeverageRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const foodYearTotal = getTotalFoodRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear);
    const beverageYearTotal = getTotalBeverageRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear);
    const yearTotal = getNumber(foodYearTotal) + getNumber(beverageYearTotal);

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total food & beverage revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total other revenue for a period
 */
export function getTotalOtherRevenue(calculationCache, projectName, year, label) {
  try {
    const functionRoomRental = getFunctionRoomRentalRevenue(calculationCache, projectName, year, label);
    const miscellaneousOther = getMiscellaneousOtherRevenue(calculationCache, projectName, year, label);
    const total = getNumber(functionRoomRental) + getNumber(miscellaneousOther);

    return total;
  } catch (error) {
    console.error(`Error calculating total other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total other revenue for entire year
 */
export function getTotalOtherRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalOtherRevenue(calculationCache, projectName, year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total other revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total revenue (F&B + Other) for a period
 */
export function getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const fnbRevenue = getTotalFoodAndBeverageRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const otherRevenue = getTotalOtherRevenue(calculationCache, projectName, year, label);
    const total = getNumber(fnbRevenue) + getNumber(otherRevenue);

    return total;
  } catch (error) {
    console.error(`Error calculating total revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total revenue for entire year
 */
export function getTotalRevenueYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total revenue for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// SERVICE CHARGE
// ============================================================================

/**
 * Get service charge for a period
 */
export function getServiceCharge(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    // Get from calculation cache - you can adjust the page and row code as needed
    const serviceCharge = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Service Charge', year, label);

    if (serviceCharge !== undefined && serviceCharge !== null) {
      return getNumber(serviceCharge);
    }

    // Default fallback - you can adjust this calculation as needed
    // For example, if service charge is typically 10% of total revenue
    const totalRevenue = getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const defaultServiceCharge = totalRevenue * 0.10; // 10% service charge

    return defaultServiceCharge;
  } catch (error) {
    console.error(`Error getting service charge for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get service charge for entire year
 */
export function getServiceChargeYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthServiceCharge = getServiceCharge(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthServiceCharge);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating service charge for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total revenue including service charge for a period
 */
export function getTotalRevenueInclServiceCharge(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const totalRevenue = getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const serviceCharge = getServiceCharge(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
    const total = getNumber(totalRevenue) + getNumber(serviceCharge);

    return total;
  } catch (error) {
    console.error(`Error calculating total revenue including service charge for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total revenue including service charge for entire year
 */
export function getTotalRevenueInclServiceChargeYear(calculationCache, projectName, year, getRestaurantList, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalRevenueInclServiceCharge(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total revenue including service charge for year ${year}:`, error);
    return 0;
  }
}

