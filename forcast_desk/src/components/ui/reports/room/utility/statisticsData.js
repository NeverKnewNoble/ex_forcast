/**
 * Statistics data functions for Room Profit & Loss Report
 * Handles room statistics, occupancy, guests, covers, and related metrics
 */

import { getNumber } from './formatters.js';
import { getNoOfDays, isMarketSegmentationEnabled } from './helpers.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get number of rooms for a period
 */
export function getNoOfRooms(calculationCache, projectName, year, label) {
  try {
    // Get room count from room revenue page via calculation cache
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
 * Get number of rooms percentage for a period
 */
export function getNoOfRoomsPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getNoOfRooms(calculationCache, projectName, year, label);
    const yearTotal = getNoOfRoomsTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room percentage:', error);
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
 * Get days percentage for a period
 */
export function getNoOfDaysPercentage(year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getNoOfDays(year, label);
    const yearTotal = getNoOfDaysTotal(year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating no of days percentage:', error);
    return 0;
  }
}

/**
 * Get available rooms for a period
 */
export function getAvailableRooms(calculationCache, projectName, year, label) {
  try {
    // First try: Get from F&B page - Number of rooms available row
    let availableRooms = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Number of rooms available', year, label);

    if (availableRooms !== undefined && availableRooms !== null) {
      return getNumber(availableRooms);
    }

    // Second try: Get from Room Revenue page - Total Available Rooms (if market segmentation is on)
    if (isMarketSegmentationEnabled()) {
      const totalRooms = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
      if (totalRooms !== undefined && totalRooms !== null) {
        const days = getNoOfDays(year, label);
        const calculatedValue = getNumber(totalRooms) * days;
        return calculatedValue;
      }
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
export function getAvailableRoomsTotal(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);
}

/**
 * Get available rooms percentage for a period
 */
export function getAvailableRoomsPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getAvailableRooms(calculationCache, projectName, year, label);
    const yearTotal = getAvailableRoomsTotal(calculationCache, projectName, year, label, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating available rooms percentage:', error);
    return 0;
  }
}

/**
 * Get sold rooms (excluding complimentary) for a period
 */
export function getSoldRooms(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Number of rooms sold (excl.) row
    const soldRooms = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Number of rooms sold (excl.)', year, label);

    if (soldRooms !== undefined && soldRooms !== null) {
      return getNumber(soldRooms);
    }

    // Fallback: Calculate based on occupancy percentage if available
    const occupancy = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Occupancy (excl.) %', year, label);
    if (occupancy !== undefined && occupancy !== null) {
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
export function getSoldRoomsTotal(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
}

/**
 * Get sold rooms percentage for a period
 */
export function getSoldRoomsPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getSoldRooms(calculationCache, projectName, year, label);
    const yearTotal = getSoldRoomsTotal(calculationCache, projectName, year, label, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating sold rooms percentage:', error);
    return 0;
  }
}

/**
 * Get occupancy percentage for a period
 */
export function getOccupancyPercentage(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Occupancy (excl.) % row
    const occupancy = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Occupancy (excl.) %', year, label);
    if (occupancy !== undefined && occupancy !== null) {
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
export function getOccupancyPercentageTotal(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  const totalSold = labels.reduce((sum, label) => sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
  const totalAvailable = labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);

  if (totalAvailable > 0) {
    return Number(((totalSold / totalAvailable) * 100).toFixed(2));
  }
  return 0;
}

/**
 * Get occupancy percentage percentage for a period (percentage of total occupancy)
 */
export function getOccupancyPercentagePercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getOccupancyPercentage(calculationCache, projectName, year, label);
    const yearTotal = getOccupancyPercentageTotal(calculationCache, projectName, year, label, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating occupancy percentage percentage:', error);
    return 0;
  }
}

/**
 * Get number of guests for a period
 */
export function getNumberOfGuests(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Number of guests row
    const guests = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, ROW.NUMBER_OF_GUESTS, year, label);
    if (guests !== undefined && guests !== null) {
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
 * Get number of guests percentage for a period
 */
export function getNumberOfGuestsPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getNumberOfGuests(calculationCache, projectName, year, label);
    const yearTotal = getNumberOfGuestsTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating number of guests percentage:', error);
    return 0;
  }
}

/**
 * Get number of F&B covers for a period
 */
export function getNumberOfCovers(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Total Covers row
    const covers = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Total Covers', year, label);
    if (covers !== undefined && covers !== null) {
      return getNumber(covers);
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
export function getNumberOfCoversTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfCovers(calculationCache, projectName, year, label)), 0);
}

/**
 * Get number of covers percentage for a period
 */
export function getNumberOfCoversPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getNumberOfCovers(calculationCache, projectName, year, label);
    const yearTotal = getNumberOfCoversTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating number of covers percentage:', error);
    return 0;
  }
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
 * Get average F&B spent percentage for a period
 */
export function getAverageFnbSpentPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getAverageFnbSpent(calculationCache, projectName, year, label);
    const yearTotal = getAverageFnbSpentTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating average F&B spent percentage:', error);
    return 0;
  }
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
 * Get average room rate percentage for a period
 */
export function getAverageRoomRatePercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getAverageRoomRate(calculationCache, projectName, year, label);
    const yearTotal = getAverageRoomRateTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating average room rate percentage:', error);
    return 0;
  }
}

/**
 * Get revenue per available room (RevPAR) for a period
 */
export function getRevPerAvailableRoom(calculationCache, projectName, year, label) {
  try {
    // Get from F&B page - Revenue Per Available Room row
    const revPerRoom = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, 'Revenue Per Available Room', year, label);
    if (revPerRoom !== undefined && revPerRoom !== null) {
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

/**
 * Get revenue per available room percentage for a period
 */
export function getRevPerAvailableRoomPercentage(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  try {
    const monthValue = getRevPerAvailableRoom(calculationCache, projectName, year, label);
    const yearTotal = getRevPerAvailableRoomTotal(calculationCache, projectName, year, getColumnLabelsForYear);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating revenue per available room percentage:', error);
    return 0;
  }
}

