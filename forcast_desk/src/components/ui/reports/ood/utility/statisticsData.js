/**
 * Statistics data functions for OOD Profit & Loss Report
 * Handles room statistics, occupancy, guests, and related metrics for OOD departments
 */

import { getNumber } from './formatters.js';
import { getNoOfDays } from './helpers.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get number of rooms for a period
 */
export function getNoOfRooms(calculationCache, projectName, year, label) {
  try {
    // Check if market segmentation is enabled
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';

    // Get room count from room revenue page via calculation cache
    const roomCount = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);

    if (roomCount !== undefined && roomCount !== null) {
      return getNumber(roomCount);
    }

    // Default fallback
    return 100;
  } catch (error) {
    console.error('Error fetching room count:', error);
    return 100;
  }
}

/**
 * Get total number of rooms for a year
 */
export function getNoOfRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      const roomCount = getNoOfRooms(calculationCache, projectName, year, label);
      total += getNumber(roomCount);
    }

    return total;
  } catch (error) {
    console.error('Error calculating total rooms:', error);
    return 0;
  }
}

/**
 * Get total days for a year
 */
export function getNoOfDaysTotal(year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNoOfDays(year, label)), 0);
}

/**
 * Get available rooms for a period
 */
export function getAvailableRooms(calculationCache, projectName, year, label) {
  try {
    // Try to get from F&B Revenue page - Number of rooms available row
    let availableRooms = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Number of rooms available', year, label); 

    if (availableRooms !== undefined && availableRooms !== null && availableRooms !== 0) {
      return getNumber(availableRooms);
    }

    // Fallback: Calculate from Room Revenue page - Total Rooms * Days
    const totalRooms = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    if (totalRooms !== undefined && totalRooms !== null) {
      const days = getNoOfDays(year, label);
      const calculatedValue = getNumber(totalRooms) * days;
      return calculatedValue;
    }

    return 0;
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return 0;
  }
}

/**
 * Get total available rooms for a year
 */
export function getAvailableRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
      total += getNumber(availableRooms);
    }

    return total;
  } catch (error) {
    console.error('Error calculating total available rooms:', error);
    return 0;
  }
}

/**
 * Get sold rooms (excluding complimentary) for a period
 */
export function getSoldRooms(calculationCache, projectName, year, label) {
  try {
    // Get from F&B Revenue page - Number of rooms sold (excl.) row
    let soldRooms = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Number of rooms sold (excl.)', year, label);

    if (soldRooms !== undefined && soldRooms !== null) {
      return getNumber(soldRooms);
    }

    // Fallback: Get from Room Revenue page
    soldRooms = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_SOLD_ROOMS, year, label);
    return getNumber(soldRooms);
  } catch (error) {
    console.error('Error fetching sold rooms:', error);
    return 0;
  }
}

/**
 * Get total sold rooms for a year
 */
export function getSoldRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
      total += getNumber(soldRooms);
    }

    return total;
  } catch (error) {
    console.error('Error calculating total sold rooms:', error);
    return 0;
  }
}

/**
 * Get room occupancy percentage for a period
 */
export function getOccupancyPercentage(calculationCache, projectName, year, label) {
  try {
    const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);

    if (availableRooms > 0) {
      return (soldRooms / availableRooms) * 100;
    }

    return 0;
  } catch (error) {
    console.error('Error calculating occupancy percentage:', error);
    return 0;
  }
}

/**
 * Get total room occupancy percentage for a year
 */
export function getOccupancyPercentageTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const totalSoldRooms = getSoldRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear);
    const totalAvailableRooms = getAvailableRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (totalAvailableRooms > 0) {
      return (totalSoldRooms / totalAvailableRooms) * 100;
    }

    return 0;
  } catch (error) {
    console.error('Error calculating total occupancy percentage:', error);
    return 0;
  }
}

/**
 * Get number of guests for a period
 */
export function getNumberOfGuests(calculationCache, projectName, year, label) {
  try {
    // Get from F&B Revenue page - Number of guests row
    let guests = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, ROW.NUMBER_OF_GUESTS, year, label);

    if (guests !== undefined && guests !== null) {
      return getNumber(guests);
    }

    // Fallback: Get from Room Revenue page if F&B doesn't have it
    guests = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.NUMBER_OF_GUESTS, year, label);
    return getNumber(guests);
  } catch (error) {
    console.error('Error fetching number of guests:', error);
    return 0;
  }
}

/**
 * Get total number of guests for a year
 */
export function getNumberOfGuestsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;

    for (const label of labels) {
      const guests = getNumberOfGuests(calculationCache, projectName, year, label);
      total += getNumber(guests);
    }

    return total;
  } catch (error) {
    console.error('Error calculating total guests:', error);
    return 0;
  }
}

/**
 * Check if there's any statistics data available
 */
export function hasStatisticsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;

  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfRooms(calculationCache, projectName, year, label) > 0) return true;
      if (getAvailableRooms(calculationCache, projectName, year, label) > 0) return true;
      if (getSoldRooms(calculationCache, projectName, year, label) > 0) return true;
      if (getNumberOfGuests(calculationCache, projectName, year, label) > 0) return true;
    }
  }

  return false;
}

