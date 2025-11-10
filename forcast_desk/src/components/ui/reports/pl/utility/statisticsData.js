/**
 * Statistics data functions for P&L Statement Report
 * Handles hotel-wide statistics including rooms, occupancy, guests, and related metrics
 */

import { getNumber } from './formatters.js';
import { getNoOfDays } from './helpers.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';

/**
 * Get number of rooms for a period
 */
export function getNoOfRooms(calculationCache, projectName, year, label) {
  try {
    const roomCount = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    if (roomCount !== undefined && roomCount !== null) {
      return getNumber(roomCount);
    }
    return 100; // Default fallback
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
      total += getNumber(getNoOfRooms(calculationCache, projectName, year, label));
    }
    return total;
  } catch (error) {
    console.error('Error calculating total rooms:', error);
    return 0;
  }
}

/**
 * Get available rooms (rooms × days) for a period
 */
export function getAvailableRooms(calculationCache, projectName, year, label) {
  try {
    // Try normalized cache first
    let availableRooms = calculationCache.getFnbMetric(projectName, '__ALL__', 'roomsAvailable', year, label);
    if (availableRooms !== undefined && availableRooms !== null && availableRooms !== 0) {
      return getNumber(availableRooms);
    }
    
    // Calculate from total rooms
    const totalRooms = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    if (totalRooms !== undefined && totalRooms !== null) {
      const days = getNoOfDays(label);
      return getNumber(totalRooms) * days;
    }
    
    // Fallback
    const rooms = getNoOfRooms(calculationCache, projectName, year, label);
    const days = getNoOfDays(label);
    return rooms * days;
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
    return labels.reduce((sum, label) => 
      sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error('Error calculating total available rooms:', error);
    return 0;
  }
}

/**
 * Get sold rooms (excl. comp) for a period
 */
export function getSoldRooms(calculationCache, projectName, year, label) {
  try {
    const soldRooms = calculationCache.getFnbMetric(projectName, '__ALL__', 'roomsSoldExcl', year, label);
    if (soldRooms !== undefined && soldRooms !== null && soldRooms !== 0) {
      return getNumber(soldRooms);
    }
    
    // Fallback: calculate from occupancy
    const occupancy = calculationCache.getFnbMetric(projectName, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
      const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
      return Math.round((getNumber(occupancy) / 100) * availableRooms);
    }
    
    return 0;
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
    return labels.reduce((sum, label) => 
      sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error('Error calculating total sold rooms:', error);
    return 0;
  }
}

/**
 * Get occupancy percentage for a period
 */
export function getOccupancyPercentage(calculationCache, projectName, year, label) {
  try {
    const occupancy = calculationCache.getFnbMetric(projectName, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
      return getNumber(occupancy);
    }
    
    // Calculate from sold and available rooms
    const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
    if (availableRooms > 0) {
      return Number(((soldRooms / availableRooms) * 100).toFixed(2));
    }
    
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
  try {
    const labels = getColumnLabelsForYear(year);
    const totalSold = labels.reduce((sum, label) => 
      sum + getNumber(getSoldRooms(calculationCache, projectName, year, label)), 0);
    const totalAvailable = labels.reduce((sum, label) => 
      sum + getNumber(getAvailableRooms(calculationCache, projectName, year, label)), 0);
    
    if (totalAvailable > 0) {
      return Number(((totalSold / totalAvailable) * 100).toFixed(2));
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
    const guests = calculationCache.getFnbMetric(projectName, '__ALL__', 'numberOfGuests', year, label);
    if (guests !== undefined && guests !== null && guests !== 0) {
      return getNumber(guests);
    }
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
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => 
      sum + getNumber(getNumberOfGuests(calculationCache, projectName, year, label)), 0);
  } catch (error) {
    console.error('Error calculating total guests:', error);
    return 0;
  }
}

/**
 * Get average room rate for a period
 */
export function getAverageRoomRate(calculationCache, projectName, year, label) {
  try {
    const avgRate = calculationCache.getValue(projectName, PAGE.FNB_REVENUE, ROW.AVERAGE_ROOM_RATE, year, label);
    if (avgRate !== undefined && avgRate !== null) {
      return getNumber(avgRate);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching average room rate:', error);
    return 0;
  }
}

/**
 * Get average room rate for a year
 */
export function getAverageRoomRateTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    const totalRate = labels.reduce((sum, label) => 
      sum + getNumber(getAverageRoomRate(calculationCache, projectName, year, label)), 0);
    return totalRate > 0 ? totalRate / labels.length : 0;
  } catch (error) {
    console.error('Error calculating average room rate:', error);
    return 0;
  }
}

/**
 * Get revenue per available room (RevPAR) for a period
 */
export function getRevPerAvailableRoom(calculationCache, projectName, year, label) {
  try {
    const revPerRoom = calculationCache.getFnbMetric(projectName, '__ALL__', 'revpar', year, label);
    if (revPerRoom !== undefined && revPerRoom !== null && revPerRoom !== 0) {
      return getNumber(revPerRoom);
    }
    
    // Calculate
    const soldRooms = getSoldRooms(calculationCache, projectName, year, label);
    const avgRate = getAverageRoomRate(calculationCache, projectName, year, label);
    const availableRooms = getAvailableRooms(calculationCache, projectName, year, label);
    
    if (availableRooms > 0) {
      return (soldRooms * avgRate) / availableRooms;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching revenue per available room:', error);
    return 0;
  }
}

/**
 * Get average revenue per available room for a year
 */
export function getRevPerAvailableRoomTotal(calculationCache, projectName, year, getColumnLabelsForYear) {
  try {
    const labels = getColumnLabelsForYear(year);
    const totalRev = labels.reduce((sum, label) => 
      sum + getNumber(getRevPerAvailableRoom(calculationCache, projectName, year, label)), 0);
    return totalRev > 0 ? totalRev / labels.length : 0;
  } catch (error) {
    console.error('Error calculating average revenue per available room:', error);
    return 0;
  }
}

/**
 * Check if statistics data is available
 */
export function hasStatisticsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfRooms(calculationCache, projectName, year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

