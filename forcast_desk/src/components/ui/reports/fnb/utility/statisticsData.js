/**
 * Statistics data functions for F&B Profit & Loss Report
 * Handles room statistics, occupancy, guests, covers, and related metrics
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
    // Both scenarios (market segmentation on/off) now cache to the same location
    const roomCount = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);

    if (roomCount !== undefined && roomCount !== null) {
      return getNumber(roomCount);
    }

    // Default fallback
    return 100;
  } catch (error) {
    console.error('Error fetching room count:', error);
    return 100; // Default fallback
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
    // First try: Get from normalized F&B cache (stored as '__ALL__' restaurant)
    let availableRooms = calculationCache.getFnbMetric(projectName, '__ALL__', 'roomsAvailable', year, label);

    if (availableRooms !== undefined && availableRooms !== null && availableRooms !== 0) {
      return getNumber(availableRooms);
    }

    // Second try: Calculate from Room Revenue page - Total Rooms * Days
    const totalRooms = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    if (totalRooms !== undefined && totalRooms !== null) {
      const days = getNoOfDays(year, label);
      const calculatedValue = getNumber(totalRooms) * days;
      return calculatedValue;
    }

    // Fallback calculation: Use cached room count × days
    const rooms = getNoOfRooms(calculationCache, projectName, year, label);
    const days = getNoOfDays(year, label);
    const fallbackValue = rooms * days;

    return fallbackValue;
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    // Fallback calculation
    const rooms = getNoOfRooms(calculationCache, projectName, year, label);
    const days = getNoOfDays(year, label);
    return rooms * days;
  }
}

/**
 * Get total available rooms for a year
 */
export function getAvailableRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);
}

/**
 * Get sold rooms (excluding complimentary) for a period
 */
export function getSoldRooms(calculationCache, projectName, year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const soldRooms = calculationCache.getFnbMetric(projectName, '__ALL__', 'roomsSoldExcl', year, label);

    if (soldRooms !== undefined && soldRooms !== null && soldRooms !== 0) {
      return getNumber(soldRooms);
    }

    // Fallback: Calculate based on occupancy percentage if available
    const occupancy = calculationCache.getFnbMetric(projectName, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
      const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
      const calculatedSoldRooms = Math.round((getNumber(occupancy) / 100) * availableRooms);
      return calculatedSoldRooms;
    }

    // Default fallback: Use 75% occupancy as placeholder
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
    const placeholderSoldRooms = Math.round(availableRooms * 0.75);
    return placeholderSoldRooms;
  } catch (error) {
    console.error('Error fetching sold rooms:', error);
    return 0;
  }
}

/**
 * Get total sold rooms for a year
 */
export function getSoldRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
}

/**
 * Get occupancy percentage for a period
 */
export function getOccupancyPercentage(calculationCache, projectName, year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const occupancy = calculationCache.getFnbMetric(projectName, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
      return getNumber(occupancy);
    }

    // Calculate occupancy percentage if we have sold rooms and available rooms
    const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
    if (availableRooms > 0) {
      return Number(((soldRooms / availableRooms) * 100).toFixed(2));
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching occupancy percentage:', error);
    return 0;
  }
}

/**
 * Get total occupancy percentage for a year
 */
export function getOccupancyPercentageTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  const totalSold = labels.reduce((sum, label) => sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
  const totalAvailable = labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);

  if (totalAvailable > 0) {
    return Number(((totalSold / totalAvailable) * 100).toFixed(2));
  }
  return 0;
}

/**
 * Get number of guests for a period
 */
export function getNumberOfGuests(calculationCache, projectName, year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const guests = calculationCache.getFnbMetric(projectName, '__ALL__', 'numberOfGuests', year, label);
    if (guests !== undefined && guests !== null && guests !== 0) {
      return getNumber(guests);
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching number of guests:', error);
    return 0;
  }
}

/**
 * Get total number of guests for a year
 */
export function getNumberOfGuestsTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfGuests(calculationCache, projectName, year, label)), 0);
}

/**
 * Get number of F&B covers for a period
 */
export function getNumberOfCovers(calculationCache, projectName, year, label, getRestaurantList) {
  try {
    // Get from normalized F&B cache - sum up all restaurant covers
    const restaurantList = getRestaurantList();
    let totalCovers = 0;

    for (const restaurant of restaurantList) {
      const restaurantName = restaurant.name || restaurant;
      const covers = calculationCache.getFnbMetric(projectName, restaurantName, 'totalCover', year, label);
      if (covers !== undefined && covers !== null) {
        totalCovers += getNumber(covers);
      }
    }

    if (totalCovers > 0) {
      return totalCovers;
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching number of covers:', error);
    return 0;
  }
}

/**
 * Get total number of covers for a year
 */
export function getNumberOfCoversTotal(calculationCache, projectName, year, getColumnLabelsForYear, getRestaurantList) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfCovers(calculationCache, projectName, year, label, getRestaurantList)), 0);
}

/**
 * Get average F&B spent per cover for a period
 */
export function getAverageFnbSpent(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Average Spent Per F&B Customer row
    const avgSpent = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Average Spent Per F&B Customer', year, label);
    if (avgSpent !== undefined && avgSpent !== null) {
      return getNumber(avgSpent);
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching average F&B spent:', error);
    return 0;
  }
}

/**
 * Get total average F&B spent for a year
 */
export function getAverageFnbSpentTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  const totalSpent = labels.reduce((sum, label) => sum + getNumber(getAverageFnbSpent(calculationCache, projectName, year, label)), 0);
  return totalSpent > 0 ? totalSpent / labels.length : 0;
}

/**
 * Get average room rate for a period
 */
export function getAverageRoomRate(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Average Room Rate row
    const avgRate = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, ROW.AVERAGE_ROOM_RATE, year, label);
    if (avgRate !== undefined && avgRate !== null) {
      return getNumber(avgRate);
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching average room rate:', error);
    return 0;
  }
}

/**
 * Get total average room rate for a year
 */
export function getAverageRoomRateTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  const totalRate = labels.reduce((sum, label) => sum + getNumber(getAverageRoomRate(calculationCache, projectName, year, label)), 0);
  return totalRate > 0 ? totalRate / labels.length : 0;
}

/**
 * Get revenue per available room for a period
 */
export function getRevPerAvailableRoom(calculationCache, projectName, year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const revPerRoom = calculationCache.getFnbMetric(projectName, '__ALL__', 'revpar', year, label);
    if (revPerRoom !== undefined && revPerRoom !== null && revPerRoom !== 0) {
      return getNumber(revPerRoom);
    }

    // Calculate if we have the components
    const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
    const avgRate = getAverageRoomRate(calculationCache, projectName, year, label);
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);

    if (availableRooms > 0) {
      return (soldRooms * avgRate) / availableRooms;
    }

    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching revenue per available room:', error);
    return 0;
  }
}

/**
 * Get total revenue per available room for a year
 */
export function getRevPerAvailableRoomTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  const totalRev = labels.reduce((sum, label) => sum + getNumber(getRevPerAvailableRoom(calculationCache, projectName, year, label)), 0);
  return totalRev > 0 ? totalRev / labels.length : 0;
}

