/**
 * Liabilities calculations for Balance Sheet
 * Handles current liabilities, long-term loans, and working capital
 */

import { getNumber } from './helpers.js';

// ============================================
// DEPARTMENTAL PAYABLES - ROOMS
// ============================================

export function getRoomsSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getRoomsBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getRoomsPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getRoomsExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// DEPARTMENTAL PAYABLES - F&B
// ============================================

export function getFnbCostPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getFnbSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getFnbBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getFnbPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getFnbExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// DEPARTMENTAL PAYABLES - OOD
// ============================================

export function getOodCostPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getOodSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getOodBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getOodPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getOodExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// UNDISTRIBUTED PAYABLES - A&G
// ============================================

export function getAgSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getAgBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getAgPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getAgExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// UNDISTRIBUTED PAYABLES - IT
// ============================================

export function getItSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getItBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getItPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getItCostPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getItExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// UNDISTRIBUTED PAYABLES - S&M
// ============================================

export function getSmSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getSmBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getSmPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getSmExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// UNDISTRIBUTED PAYABLES - POM
// ============================================

export function getPomSalariesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getPomBonusPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getPomPayrollRelatedPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getPomExpensesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// OTHER PAYABLES
// ============================================

export function getUtilitiesPayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getBaseFeePayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getIncentivePayables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

// ============================================
// TOTAL CURRENT LIABILITIES
// ============================================

/**
 * Get Total Current Liabilities for a specific period
 * Sum of all departmental and undistributed payables
 */
export function getTotalCurrentLiabilities(calculationCache, projectName, year, label) {
  const rooms = getNumber(getRoomsSalariesPayables(calculationCache, projectName, year, label)) +
                getNumber(getRoomsBonusPayables(calculationCache, projectName, year, label)) +
                getNumber(getRoomsPayrollRelatedPayables(calculationCache, projectName, year, label)) +
                getNumber(getRoomsExpensesPayables(calculationCache, projectName, year, label));
  
  const fnb = getNumber(getFnbCostPayables(calculationCache, projectName, year, label)) +
              getNumber(getFnbSalariesPayables(calculationCache, projectName, year, label)) +
              getNumber(getFnbBonusPayables(calculationCache, projectName, year, label)) +
              getNumber(getFnbPayrollRelatedPayables(calculationCache, projectName, year, label)) +
              getNumber(getFnbExpensesPayables(calculationCache, projectName, year, label));
  
  const ood = getNumber(getOodCostPayables(calculationCache, projectName, year, label)) +
              getNumber(getOodSalariesPayables(calculationCache, projectName, year, label)) +
              getNumber(getOodBonusPayables(calculationCache, projectName, year, label)) +
              getNumber(getOodPayrollRelatedPayables(calculationCache, projectName, year, label)) +
              getNumber(getOodExpensesPayables(calculationCache, projectName, year, label));
  
  const ag = getNumber(getAgSalariesPayables(calculationCache, projectName, year, label)) +
             getNumber(getAgBonusPayables(calculationCache, projectName, year, label)) +
             getNumber(getAgPayrollRelatedPayables(calculationCache, projectName, year, label)) +
             getNumber(getAgExpensesPayables(calculationCache, projectName, year, label));
  
  const it = getNumber(getItSalariesPayables(calculationCache, projectName, year, label)) +
             getNumber(getItBonusPayables(calculationCache, projectName, year, label)) +
             getNumber(getItPayrollRelatedPayables(calculationCache, projectName, year, label)) +
             getNumber(getItCostPayables(calculationCache, projectName, year, label)) +
             getNumber(getItExpensesPayables(calculationCache, projectName, year, label));
  
  const sm = getNumber(getSmSalariesPayables(calculationCache, projectName, year, label)) +
             getNumber(getSmBonusPayables(calculationCache, projectName, year, label)) +
             getNumber(getSmPayrollRelatedPayables(calculationCache, projectName, year, label)) +
             getNumber(getSmExpensesPayables(calculationCache, projectName, year, label));
  
  const pom = getNumber(getPomSalariesPayables(calculationCache, projectName, year, label)) +
              getNumber(getPomBonusPayables(calculationCache, projectName, year, label)) +
              getNumber(getPomPayrollRelatedPayables(calculationCache, projectName, year, label)) +
              getNumber(getPomExpensesPayables(calculationCache, projectName, year, label));
  
  const other = getNumber(getUtilitiesPayables(calculationCache, projectName, year, label)) +
                getNumber(getBaseFeePayables(calculationCache, projectName, year, label)) +
                getNumber(getIncentivePayables(calculationCache, projectName, year, label));
  
  return rooms + fnb + ood + ag + it + sm + pom + other;
}

/**
 * Get Total Current Liabilities for a year
 */
export function getTotalCurrentLiabilitiesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getTotalCurrentLiabilities(calculationCache, projectName, year, label));
  }, 0);
}

// ============================================
// WORKING CAPITAL
// ============================================

/**
 * Get Working Capital for a specific period
 * Working Capital = Total Current Assets - Total Current Liabilities
 */
export function getWorkingCapital(calculationCache, projectName, year, label, getTotalCurrentAssetsUtil) {
  const currentAssets = getNumber(getTotalCurrentAssetsUtil(calculationCache, projectName, year, label));
  const currentLiabilities = getNumber(getTotalCurrentLiabilities(calculationCache, projectName, year, label));
  return currentAssets - currentLiabilities;
}

/**
 * Get Working Capital for a year
 */
export function getWorkingCapitalYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalCurrentAssetsYearUtil, getTotalCurrentLiabilitiesYearUtil) {
  const currentAssets = getNumber(getTotalCurrentAssetsYearUtil(calculationCache, projectName, year, getColumnLabelsForYear));
  const currentLiabilities = getNumber(getTotalCurrentLiabilitiesYearUtil(calculationCache, projectName, year, getColumnLabelsForYear));
  return currentAssets - currentLiabilities;
}

// ============================================
// LONG TERM LOAN
// ============================================

export function getLoanFacility(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getLoanInterest(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  return 0;
}

export function getLongTermLoan(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching - this is the outstanding loan balance
  return 0;
}

export function getLongTermLoanYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getLongTermLoan(calculationCache, projectName, year, label));
  }, 0);
}

