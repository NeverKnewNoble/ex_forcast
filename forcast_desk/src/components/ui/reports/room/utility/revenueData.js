/**
 * Revenue data functions for Room Profit & Loss Report  
 * Handles room revenue from market segmentation and room type/packages
 */

import { getNumber } from './formatters.js';
import { getMonthsForLabel, isMarketSegmentationEnabled } from './helpers.js';
import { PAGE } from '@/components/utility/_master_utility/cacheKeys.js';

// ============================================================================
// MARKET SEGMENTATION REVENUE (when market segmentation is enabled)
// ============================================================================

/**
 * Get room revenue segments from cache
 */
export function getRoomRevenueSegments(calculationCache, projectName) {
  try {
    const page = PAGE.MARKET_SEGMENTATION;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    const segments = new Set();

    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Revenue:')) {
        const name = rowCode.replace('Room Revenue:', '').trim();
        if (name) segments.add(name);
      }
    });

    return Array.from(segments);
  } catch (e) {
    console.error('Room P&L: Error discovering room revenue segments:', e);
    return [];
  }
}

/**
 * Get segment revenue for a period
 */
export function getSegmentRevenue(calculationCache, projectName, year, label, segmentName) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(projectName, PAGE.MARKET_SEGMENTATION, `Room Revenue:${segmentName}`, year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    return sum;
  } catch (error) {
    console.error('Error fetching segment revenue:', segmentName, error);
    return 0;
  }
}

/**
 * Get segment revenue total for a year
 */
export function getSegmentRevenueTotal(calculationCache, projectName, year, segmentName, getColumnLabelsForYear) {
  try {
    const yearly = calculationCache.getValue(projectName, PAGE.MARKET_SEGMENTATION, `Room Revenue Year:${segmentName}`, year, 'ALL');
    if (yearly !== undefined && yearly !== null) {
      return getNumber(yearly);
    }
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getSegmentRevenue(calculationCache, projectName, year, label, segmentName)), 0);
  } catch (e) {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getSegmentRevenue(calculationCache, projectName, year, label, segmentName)), 0);
  }
}

/**
 * Get segment revenue percentage
 */
export function getSegmentRevenuePercentage(calculationCache, projectName, year, label, segmentName, getTotalRoomsRevenueTotal) {
  try {
    const monthValue = getSegmentRevenue(calculationCache, projectName, year, label, segmentName);
    const yearTotal = getTotalRoomsRevenueTotal(calculationCache, projectName, year);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating segment revenue percentage:', error);
    return 0;
  }
}

// ============================================================================
// ROOM TYPE/PACKAGES REVENUE (when market segmentation is disabled)
// ============================================================================

/**
 * Get room type packages from cache
 */
export function getRoomTypePackages(calculationCache, projectName) {
  try {
    const page = PAGE.ROOM_REVENUE;
    const pageData = calculationCache?.cache?.[projectName]?.[page] || {};
    const types = new Set();

    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Type:')) {
        const name = rowCode.replace('Room Type:', '').trim();
        if (name) types.add(name);
      }
    });

    return Array.from(types);
  } catch (e) {
    console.error('Room P&L: Error discovering room type packages:', e);
    return [];
  }
}

/**
 * Get room type revenue for a period
 */
export function getRoomTypeRevenue(calculationCache, projectName, year, label, typeName) {
  try {
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, `Room Type:${typeName}`, year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    return sum;
  } catch (error) {
    console.error('Error fetching Room Type revenue:', typeName, error);
    return 0;
  }
}

/**
 * Get room type revenue total for a year
 */
export function getRoomTypeRevenueTotal(calculationCache, projectName, year, typeName, getColumnLabelsForYear) {
  try {
    const yearly = calculationCache.getValue(projectName, PAGE.ROOM_REVENUE, `Room Type Year:${typeName}`, year, 'ALL');
    if (yearly !== undefined && yearly !== null) {
      return getNumber(yearly);
    }
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomTypeRevenue(calculationCache, projectName, year, label, typeName)), 0);
  } catch (e) {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomTypeRevenue(calculationCache, projectName, year, label, typeName)), 0);
  }
}

/**
 * Get room type revenue percentage
 */
export function getRoomTypeRevenuePercentage(calculationCache, projectName, year, label, typeName, getTotalRoomsRevenueTotal) {
  try {
    const monthValue = getRoomTypeRevenue(calculationCache, projectName, year, label, typeName);
    const yearTotal = getTotalRoomsRevenueTotal(calculationCache, projectName, year);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room type revenue percentage:', error);
    return 0;
  }
}

// ============================================================================
// TOTAL ROOMS REVENUE
// ============================================================================

/**
 * Get total rooms revenue for a period
 */
export function getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    // Prefer normalized F&B totals if present (aggregated across restaurants)
    const months = getMonthsForLabel(label);
    let totalFromFnb = 0;
    try {
      const yearBucket = calculationCache?.fnb?.[projectName]?.[year] || {};
      // Sum restaurant metric 'totalRevenue' and also include __ALL__/totalRevenue if present
      Object.keys(yearBucket).forEach((restaurantKey) => {
        const metrics = yearBucket[restaurantKey] || {};
        const revenueSeries = metrics?.totalRevenue || {};
        for (const m of months) {
          const v = revenueSeries?.[m];
          if (v !== undefined && v !== null) totalFromFnb += getNumber(v);
        }
      });
    } catch (e) {
      // ignore and fallback below
    }
    if (totalFromFnb > 0) return totalFromFnb;

    // Fallbacks: market segmentation or room packages caches
    if (isMarketSegmentationEnabled()) {
      const segments = getRoomRevenueSegmentsList();
      return segments.reduce((sum, seg) => sum + getNumber(getSegmentRevenue(calculationCache, projectName, year, label, seg)), 0);
    }
    const packages = getRoomTypePackagesList();
    return packages.reduce((sum, pkg) => sum + getNumber(getRoomTypeRevenue(calculationCache, projectName, year, label, pkg)), 0);
  } catch (error) {
    console.error('Error calculating total rooms revenue:', error);
    return 0;
  }
}

/**
 * Get total rooms revenue for entire year
 */
export function getTotalRoomsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  // Prefer normalized F&B yearly totals if present
  try {
    const yearBucket = calculationCache?.fnb?.[projectName]?.[year] || {};
    let total = 0;
    Object.keys(yearBucket).forEach((restaurantKey) => {
      const metrics = yearBucket[restaurantKey] || {};
      const yearly = metrics?.totalRevenue?.ALL;
      if (yearly !== undefined && yearly !== null) total += getNumber(yearly);
    });
    if (total > 0) return total;
  } catch (e) {
    // ignore and fallback below
  }

  if (isMarketSegmentationEnabled()) {
    const segments = getRoomRevenueSegmentsList();
    const perSegmentTotals = segments.map(seg => getSegmentRevenueTotal(calculationCache, projectName, year, seg, getColumnLabelsForYear));
    const sumSegments = perSegmentTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumSegments > 0) return sumSegments;
  } else {
    const packages = getRoomTypePackagesList();
    const perTypeTotals = packages.map(pkg => getRoomTypeRevenueTotal(calculationCache, projectName, year, pkg, getColumnLabelsForYear));
    const sumTypes = perTypeTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumTypes > 0) return sumTypes;
  }
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList)), 0);
}

/**
 * Get total rooms revenue percentage
 */
export function getTotalRoomsRevenuePercentage(calculationCache, projectName, year, label, getColumnLabelsForYear, getRoomRevenueSegmentsList, getRoomTypePackagesList) {
  try {
    const monthValue = getTotalRoomsRevenue(calculationCache, projectName, year, label, getRoomRevenueSegmentsList, getRoomTypePackagesList);
    const yearTotal = getTotalRoomsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear, getRoomRevenueSegmentsList, getRoomTypePackagesList);

    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total rooms revenue percentage:', error);
    return 0;
  }
}

