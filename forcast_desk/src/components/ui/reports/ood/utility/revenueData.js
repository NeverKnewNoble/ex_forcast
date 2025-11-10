/**
 * Revenue data functions for OOD Profit & Loss Report
 * Handles OOD revenue calculations from various sources
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel } from './helpers.js';
import { PAGE, ROW, DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get OOD revenue for a specific year and period
 * @param {Object} calculationCache - Calculation cache instance
 * @param {string} projectName - Project name
 * @param {string} year - Year
 * @param {string} label - Period label (month or quarter)
 * @returns {number} OOD revenue
 */
export function getOodRevenue(calculationCache, projectName, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      // Get OOD revenue from OOD data page cache
      const val = calculationCache.getValue(projectName, PAGE.OOD_DATA, ROW.OOD_REVENUE, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting OOD revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD revenue for a specific year
 */
export function getOodRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getOodRevenue(calculationCache, projectName, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating OOD revenue total for ${year}:`, error);
    return 0;
  }
}

/**
 * Get service charge for OOD revenue
 */
export function getOodServiceCharge(calculationCache, projectName, year, label) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      const val = calculationCache.getValue(projectName, PAGE.OOD_DATA, ROW.OOD_SERVICE_CHARGE, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting OOD service charge for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD service charge for a year
 */
export function getOodServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getOodServiceCharge(calculationCache, projectName, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating OOD service charge total for ${year}:`, error);
    return 0;
  }
}

/**
 * Get total OOD revenue including service charge
 */
export function getTotalOodRevenueInclServiceCharge(calculationCache, projectName, year, label) {
  try {
    const revenue = getOodRevenue(calculationCache, projectName, year, label);
    const serviceCharge = getOodServiceCharge(calculationCache, projectName, year, label);
    return getNumber(revenue) + getNumber(serviceCharge);
  } catch (error) {
    console.error(`Error calculating total OOD revenue incl. SC for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD revenue including service charge for a year
 */
export function getTotalOodRevenueInclServiceChargeYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getTotalOodRevenueInclServiceCharge(calculationCache, projectName, year, label));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total OOD revenue incl. SC for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if there's any OOD revenue data
 */
export function hasOodRevenueData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOodRevenue(calculationCache, projectName, year, label) > 0) return true;
      if (getOodServiceCharge(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

// ============================================================================
// HEALTH CLUB - SPA REVENUE FUNCTIONS
// ============================================================================

/**
 * Get Health Club revenue by item
 */
export function getHealthClubRevenue(calculationCache, projectName, year, label, itemName) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      const val = calculationCache.getValue(projectName, PAGE.OOD_DATA, itemName, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting Health Club revenue for ${itemName} ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total Health Club revenue by item for a year
 */
export function getHealthClubRevenueTotal(calculationCache, projectName, year, itemName, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getHealthClubRevenue(calculationCache, projectName, year, label, itemName));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating Health Club revenue total for ${itemName} ${year}:`, error);
    return 0;
  }
}

// Club Use Revenue items
export function getSaunaRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Sauna');
}

export function getSaunaRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Sauna', getColumnLabelsForYear);
}

export function getGymRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Gym');
}

export function getGymRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Gym', getColumnLabelsForYear);
}

export function getSwimmingPoolRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Swimming Pool');
}

export function getSwimmingPoolRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Swimming Pool', getColumnLabelsForYear);
}

// Treatments & Other Services items
export function getFitnessLessonsRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Fitness Lessons (group)');
}

export function getFitnessLessonsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Fitness Lessons (group)', getColumnLabelsForYear);
}

export function getHealthWellnessRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Health / Wellness Services');
}

export function getHealthWellnessRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Health / Wellness Services', getColumnLabelsForYear);
}

export function getMassageRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Massage');
}

export function getMassageRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Massage', getColumnLabelsForYear);
}

export function getPersonalTrainingRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Personal Training & Swimming Lessons');
}

export function getPersonalTrainingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Personal Training & Swimming Lessons', getColumnLabelsForYear);
}

export function getSpaRevenueItem(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Spa Treatment');
}

export function getSpaRevenueItemTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Spa Treatment', getColumnLabelsForYear);
}

export function getSalonTreatmentRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Salon Treatment');
}

export function getSalonTreatmentRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Salon Treatment', getColumnLabelsForYear);
}

// Merchandise items
export function getClothingRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Clothing');
}

export function getClothingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Clothing', getColumnLabelsForYear);
}

// Membership items
export function getPoolSpaMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Pool/SPA');
}

export function getPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Pool/SPA', getColumnLabelsForYear);
}

export function getGymMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Gym');
}

export function getGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Gym', getColumnLabelsForYear);
}

export function getPoolGymMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Pool / Gym');
}

export function getPoolGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Pool / Gym', getColumnLabelsForYear);
}

export function getSpaGymMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Spa / Gym');
}

export function getSpaGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Spa / Gym', getColumnLabelsForYear);
}

export function getGymPoolSpaMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Gym / Pool / Spa');
}

export function getGymPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Gym / Pool / Spa', getColumnLabelsForYear);
}

export function getPoolMembershipRevenue(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'Pool');
}

export function getPoolMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'Pool', getColumnLabelsForYear);
}

// Total calculations
export function getTotalClubUseRevenue(calculationCache, projectName, year, label) {
  const sauna = getSaunaRevenue(calculationCache, projectName, year, label);
  const gym = getGymRevenue(calculationCache, projectName, year, label);
  const pool = getSwimmingPoolRevenue(calculationCache, projectName, year, label);
  return getNumber(sauna) + getNumber(gym) + getNumber(pool);
}

export function getTotalClubUseRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalClubUseRevenue(calculationCache, projectName, year, label));
  }
  return total;
}

export function getTotalTreatmentsOtherServices(calculationCache, projectName, year, label) {
  const fitness = getFitnessLessonsRevenue(calculationCache, projectName, year, label);
  const wellness = getHealthWellnessRevenue(calculationCache, projectName, year, label);
  const massage = getMassageRevenue(calculationCache, projectName, year, label);
  const training = getPersonalTrainingRevenue(calculationCache, projectName, year, label);
  const spa = getSpaRevenueItem(calculationCache, projectName, year, label);
  const salon = getSalonTreatmentRevenue(calculationCache, projectName, year, label);
  return getNumber(fitness) + getNumber(wellness) + getNumber(massage) + 
         getNumber(training) + getNumber(spa) + getNumber(salon);
}

export function getTotalTreatmentsOtherServicesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalTreatmentsOtherServices(calculationCache, projectName, year, label));
  }
  return total;
}

export function getTotalMemberships(calculationCache, projectName, year, label) {
  const poolSpa = getPoolSpaMembershipRevenue(calculationCache, projectName, year, label);
  const gym = getGymMembershipRevenue(calculationCache, projectName, year, label);
  const poolGym = getPoolGymMembershipRevenue(calculationCache, projectName, year, label);
  const spaGym = getSpaGymMembershipRevenue(calculationCache, projectName, year, label);
  const gymPoolSpa = getGymPoolSpaMembershipRevenue(calculationCache, projectName, year, label);
  const pool = getPoolMembershipRevenue(calculationCache, projectName, year, label);
  return getNumber(poolSpa) + getNumber(gym) + getNumber(poolGym) + 
         getNumber(spaGym) + getNumber(gymPoolSpa) + getNumber(pool);
}

export function getTotalMembershipsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalMemberships(calculationCache, projectName, year, label));
  }
  return total;
}

export function getTotalHealthClubSpa(calculationCache, projectName, year, label) {
  const clubUse = getTotalClubUseRevenue(calculationCache, projectName, year, label);
  const treatments = getTotalTreatmentsOtherServices(calculationCache, projectName, year, label);
  const clothing = getClothingRevenue(calculationCache, projectName, year, label);
  const memberships = getTotalMemberships(calculationCache, projectName, year, label);
  return getNumber(clubUse) + getNumber(treatments) + getNumber(clothing) + getNumber(memberships);
}

export function getTotalHealthClubSpaYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalHealthClubSpa(calculationCache, projectName, year, label));
  }
  return total;
}

export function getHealthClubServiceCharge(calculationCache, projectName, year, label) {
  return getHealthClubRevenue(calculationCache, projectName, year, label, 'SERVICE CHARGE');
}

export function getHealthClubServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getHealthClubRevenueTotal(calculationCache, projectName, year, 'SERVICE CHARGE', getColumnLabelsForYear);
}

export function getTotalHealthClubRevInclSC(calculationCache, projectName, year, label) {
  const healthClub = getTotalHealthClubSpa(calculationCache, projectName, year, label);
  const serviceCharge = getHealthClubServiceCharge(calculationCache, projectName, year, label);
  return getNumber(healthClub) + getNumber(serviceCharge);
}

export function getTotalHealthClubRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalHealthClubRevInclSC(calculationCache, projectName, year, label));
  }
  return total;
}

/**
 * Check if there's any Health Club data
 */
export function hasHealthClubData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalHealthClubSpa(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

// ============================================================================
// LAUNDRY REVENUE FUNCTIONS
// ============================================================================

/**
 * Get Laundry revenue by item
 */
export function getLaundryRevenue(calculationCache, projectName, year, label, itemName) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      const val = calculationCache.getValue(projectName, PAGE.OOD_DATA, itemName, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting Laundry revenue for ${itemName} ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total Laundry revenue by item for a year
 */
export function getLaundryRevenueTotal(calculationCache, projectName, year, itemName, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getLaundryRevenue(calculationCache, projectName, year, label, itemName));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating Laundry revenue total for ${itemName} ${year}:`, error);
    return 0;
  }
}

// Individual Laundry items
export function getInHouseGuestLaundryRevenue(calculationCache, projectName, year, label) {
  return getLaundryRevenue(calculationCache, projectName, year, label, 'In House Guest Laundry & Dry cleaning');
}

export function getInHouseGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getLaundryRevenueTotal(calculationCache, projectName, year, 'In House Guest Laundry & Dry cleaning', getColumnLabelsForYear);
}

export function getDryCleaningRevenue(calculationCache, projectName, year, label) {
  return getLaundryRevenue(calculationCache, projectName, year, label, 'Dry Cleaning');
}

export function getDryCleaningRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getLaundryRevenueTotal(calculationCache, projectName, year, 'Dry Cleaning', getColumnLabelsForYear);
}

export function getOutsideGuestLaundryRevenue(calculationCache, projectName, year, label) {
  return getLaundryRevenue(calculationCache, projectName, year, label, 'Outside Guest Laundry');
}

export function getOutsideGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getLaundryRevenueTotal(calculationCache, projectName, year, 'Outside Guest Laundry', getColumnLabelsForYear);
}

// Total Laundry calculations
export function getTotalLaundryRevenue(calculationCache, projectName, year, label) {
  const inHouse = getInHouseGuestLaundryRevenue(calculationCache, projectName, year, label);
  const dryCleaning = getDryCleaningRevenue(calculationCache, projectName, year, label);
  const outside = getOutsideGuestLaundryRevenue(calculationCache, projectName, year, label);
  return getNumber(inHouse) + getNumber(dryCleaning) + getNumber(outside);
}

export function getTotalLaundryRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalLaundryRevenue(calculationCache, projectName, year, label));
  }
  return total;
}

export function getLaundryServiceCharge(calculationCache, projectName, year, label) {
  return getLaundryRevenue(calculationCache, projectName, year, label, 'SERVICE CHARGE');
}

export function getLaundryServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getLaundryRevenueTotal(calculationCache, projectName, year, 'SERVICE CHARGE', getColumnLabelsForYear);
}

export function getTotalLaundryRevInclSC(calculationCache, projectName, year, label) {
  const laundry = getTotalLaundryRevenue(calculationCache, projectName, year, label);
  const serviceCharge = getLaundryServiceCharge(calculationCache, projectName, year, label);
  return getNumber(laundry) + getNumber(serviceCharge);
}

export function getTotalLaundryRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalLaundryRevInclSC(calculationCache, projectName, year, label));
  }
  return total;
}

/**
 * Check if there's any Laundry data
 */
export function hasLaundryData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalLaundryRevenue(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

// ============================================================================
// COST OF SALES FUNCTIONS
// ============================================================================

/**
 * Get Cost of Sales by item
 */
export function getCostOfSales(calculationCache, projectName, year, label, itemName) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;

    for (const month of months) {
      const val = calculationCache.getValue(projectName, PAGE.OOD_DATA, itemName, year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }

    return sum;
  } catch (error) {
    console.error(`Error getting Cost of Sales for ${itemName} ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total Cost of Sales by item for a year
 */
export function getCostOfSalesTotal(calculationCache, projectName, year, itemName, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      total += getNumber(getCostOfSales(calculationCache, projectName, year, label, itemName));
    }

    return total;
  } catch (error) {
    console.error(`Error calculating Cost of Sales total for ${itemName} ${year}:`, error);
    return 0;
  }
}

// Individual Cost of Sales items
export function getCostOfLaundry(calculationCache, projectName, year, label) {
  return getCostOfSales(calculationCache, projectName, year, label, 'Cost Of Laundry');
}

export function getCostOfLaundryTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getCostOfSalesTotal(calculationCache, projectName, year, 'Cost Of Laundry', getColumnLabelsForYear);
}

export function getCostOfMerchandiseSales(calculationCache, projectName, year, label) {
  return getCostOfSales(calculationCache, projectName, year, label, 'Cost of Merchandise Sales');
}

export function getCostOfMerchandiseSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getCostOfSalesTotal(calculationCache, projectName, year, 'Cost of Merchandise Sales', getColumnLabelsForYear);
}

export function getCostOfClothingSales(calculationCache, projectName, year, label) {
  return getCostOfSales(calculationCache, projectName, year, label, 'Cost of Clothing Sales');
}

export function getCostOfClothingSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  return getCostOfSalesTotal(calculationCache, projectName, year, 'Cost of Clothing Sales', getColumnLabelsForYear);
}

// Total Cost of Sales
export function getTotalCostOfSales(calculationCache, projectName, year, label) {
  const laundry = getCostOfLaundry(calculationCache, projectName, year, label);
  const merchandise = getCostOfMerchandiseSales(calculationCache, projectName, year, label);
  const clothing = getCostOfClothingSales(calculationCache, projectName, year, label);
  return getNumber(laundry) + getNumber(merchandise) + getNumber(clothing);
}

export function getTotalCostOfSalesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  for (const label of labels) {
    total += getNumber(getTotalCostOfSales(calculationCache, projectName, year, label));
  }
  return total;
}

/**
 * Check if there's any Cost of Sales data
 */
export function hasCostOfSalesData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalCostOfSales(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

