/**
 * Revenue data functions for P&L Statement Report
 * Aggregates revenue from all departments (Room, F&B, OOD)
 */

import { getNumber } from './formatters.js';
import { PAGE, DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get total room revenue for a period
 */
export function getTotalRoomRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from Room revenue cache
    const roomRevenue = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, 'Total Room Revenue', year, label);
    if (roomRevenue !== undefined && roomRevenue !== null) {
      return getNumber(roomRevenue);
    }
    return 0;
  } catch (error) {
    console.error(`Error getting room revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total room revenue for a year
 */
export function getTotalRoomRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalRoomRevenue(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating room revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total F&B revenue for a period
 */
export function getTotalFnbRevenue(calculationCache, projectName, year, label) {
  try {
    // Get from F&B revenue cache
    const fnbRevenue = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Total Revenue', year, label);
    if (fnbRevenue !== undefined && fnbRevenue !== null) {
      return getNumber(fnbRevenue);
    }
    return 0;
  } catch (error) {
    console.error(`Error getting F&B revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total F&B revenue for a year
 */
export function getTotalFnbRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalFnbRevenue(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating F&B revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total OOD revenue for a period
 */
export function getTotalOodRevenue(calculationCache, projectName, year, label) {
  try {
    // Sum Health Club and Laundry revenue
    let total = 0;
    
    // Health Club revenue
    const healthClubCache = calculationCache.getValue(projectName, PAGE.OOD_REVENUE, 'Total Health Club Revenue', year, label);
    if (healthClubCache !== undefined && healthClubCache !== null) {
      total += getNumber(healthClubCache);
    }
    
    // Laundry revenue
    const laundryCache = calculationCache.getValue(projectName, PAGE.OOD_REVENUE, 'Total Laundry Revenue', year, label);
    if (laundryCache !== undefined && laundryCache !== null) {
      total += getNumber(laundryCache);
    }
    
    return total;
  } catch (error) {
    console.error(`Error getting OOD revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total OOD revenue for a year
 */
export function getTotalOodRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getTotalOodRevenue(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error(`Error calculating OOD revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Get total operating revenue for a period (Room + F&B + OOD)
 */
export function getTotalOperatingRevenue(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const roomRevenue = getTotalRoomRevenue(calculationCache, projectName, year, label);
    const fnbRevenue = getTotalFnbRevenue(calculationCache, projectName, year, label);
    const oodRevenue = getTotalOodRevenue(calculationCache, projectName, year, label);
    
    return getNumber(roomRevenue) + getNumber(fnbRevenue) + getNumber(oodRevenue);
  } catch (error) {
    console.error(`Error calculating total operating revenue for ${year} ${label}:`, error);
    return 0;
  }
}

/**
 * Get total operating revenue for a year
 */
export function getTotalOperatingRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const roomRevenue = getTotalRoomRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear);
    const fnbRevenue = getTotalFnbRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear);
    const oodRevenue = getTotalOodRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear);
    
    return getNumber(roomRevenue) + getNumber(fnbRevenue) + getNumber(oodRevenue);
  } catch (error) {
    console.error(`Error calculating total operating revenue for year ${year}:`, error);
    return 0;
  }
}

/**
 * Check if revenue data is available
 */
export function hasRevenueData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalOperatingRevenue(calculationCache, projectName, year, label, getColumnLabelsForYear) > 0) {
        return true;
      }
    }
  }
  return false;
}

