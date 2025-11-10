/**
 * Data validation functions for OOD Profit & Loss Report
 * Checks data availability for conditional rendering of sections
 */

import { hasStatisticsData } from './statisticsData.js';
import { hasOodRevenueData } from './revenueData.js';
import { hasOodExpenseData } from './expensesData.js';
import { hasPayrollData, hasPayrollRelatedData, hasBonusData } from './payrollData.js';

/**
 * Check if the statistics section has any data
 */
export function hasStatisticsSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return hasStatisticsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if the revenue section has any data
 */
export function hasRevenueSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return hasOodRevenueData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if the expenses section has any data
 */
export function hasExpensesSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear, oodDepartments = []) {
  return hasOodExpenseData(calculationCache, projectName, visibleYears, getColumnLabelsForYear, oodDepartments);
}

/**
 * Check if the payroll section has any data
 */
export function hasPayrollSectionData(calculationCache, projectName, department, visibleYears, getColumnLabelsForYear) {
  return hasPayrollData(calculationCache, projectName, department, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if the payroll related section has any data
 */
export function hasPayrollRelatedSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return hasPayrollRelatedData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if the bonus section has any data
 */
export function hasBonusSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return hasBonusData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if the entire report has any data to display
 */
export function hasReportData(calculationCache, projectName, visibleYears, getColumnLabelsForYear, oodDepartments = []) {
  return (
    hasStatisticsSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    hasRevenueSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    hasExpensesSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear, oodDepartments) ||
    hasPayrollSectionData(calculationCache, projectName, oodDepartments[0], visibleYears, getColumnLabelsForYear) ||
    hasPayrollRelatedSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    hasBonusSectionData(calculationCache, projectName, visibleYears, getColumnLabelsForYear)
  );
}

