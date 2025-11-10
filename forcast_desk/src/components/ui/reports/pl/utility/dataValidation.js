/**
 * Data validation utilities for P&L Statement Report
 * Provides functions to check data availability
 */

import { getNumber } from './formatters.js';
import * as statistics from './statisticsData.js';
import * as revenue from './revenueData.js';
import * as expenses from './expensesData.js';
import * as payroll from './payrollData.js';

/**
 * Check if any data is available for the report
 */
export function hasAnyData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  if (!visibleYears || visibleYears.length === 0) return false;
  
  return (
    statistics.hasStatisticsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    revenue.hasRevenueData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    expenses.hasExpenseData(calculationCache, projectName, visibleYears, getColumnLabelsForYear) ||
    payroll.hasPayrollData(calculationCache, projectName, visibleYears, getColumnLabelsForYear)
  );
}

/**
 * Check if statistics section has data
 */
export function hasStatisticsSection(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return statistics.hasStatisticsData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if revenue section has data
 */
export function hasRevenueSection(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return revenue.hasRevenueData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if expenses section has data
 */
export function hasExpensesSection(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return expenses.hasExpenseData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

/**
 * Check if payroll section has data
 */
export function hasPayrollSection(calculationCache, projectName, visibleYears, getColumnLabelsForYear) {
  return payroll.hasPayrollData(calculationCache, projectName, visibleYears, getColumnLabelsForYear);
}

