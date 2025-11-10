/**
 * Data validation functions for Room Profit & Loss Report
 * Checks if various sections have data to display
 */

import { getNumber } from './formatters.js';
import * as statistics from './statisticsData.js';
import * as revenue from './revenueData.js';
import * as expenses from './expensesData.js';
import * as payroll from './payrollData.js';

// ============================================================================
// STATISTICS DATA CHECKS
// ============================================================================

export function hasNoOfRoomsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getNoOfRooms(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasNoOfDaysData(visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getNoOfDays(year, label) > 0) return true;
    }
  }
  return false;
}

export function hasAvailableRoomsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getAvailableRooms(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasSoldRoomsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getSoldRooms(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasOccupancyData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getOccupancyPercentage(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasGuestsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getNumberOfGuests(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasCoversData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getNumberOfCovers(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasFnbSpentData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getAverageFnbSpent(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasRoomRateData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getAverageRoomRate(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

export function hasRevPerRoomData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (statistics.getRevPerAvailableRoom(calculationCache, projectName, year, label) > 0) return true;
    }
  }
  return false;
}

// ============================================================================
// REVENUE SECTION DATA CHECKS
// ============================================================================

export function hasSegmentData(calculationCache, projectName, visibleYears, segmentName, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (revenue.getSegmentRevenue(calculationCache, projectName, year, label, segmentName) > 0) return true;
    }
  }
  return false;
}

export function hasRoomTypeData(calculationCache, projectName, visibleYears, typeName, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (revenue.getRoomTypeRevenue(calculationCache, projectName, year, label, typeName) > 0) return true;
    }
  }
  return false;
}

// ============================================================================
// EXPENSE SECTION DATA CHECKS
// ============================================================================

export function hasRoomExpenseData(calculationCache, projectName, visibleYears, expenseName, getColumnLabelsForYear, expenseDataCache) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (expenses.getRoomExpenseAmount(calculationCache, projectName, year, label, expenseName, expenseDataCache) > 0) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================================
// PAYROLL SECTION DATA CHECKS
// ============================================================================

export function hasPayrollGroupData(calculationCache, projectName, visibleYears, group, getColumnLabelsForYear) {
  return payroll.hasPayrollGroupData(calculationCache, projectName, visibleYears, group, getColumnLabelsForYear);
}

// ============================================================================
// PAYROLL RELATED DATA CHECKS
// ============================================================================

export function hasPayrollRelatedBenefitData(calculationCache, projectName, visibleYears, benefitType, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  for (const year of visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (expenses.getPayrollRelatedValue(calculationCache, projectName, year, label, benefitType) > 0) {
        return true;
      }
    }
  }
  return false;
}

