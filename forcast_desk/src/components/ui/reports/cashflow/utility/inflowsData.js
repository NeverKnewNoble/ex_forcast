/**
 * Cash Inflow calculations for Cashflow report
 * Handles all revenue and receipt calculations
 */

import { getNumber } from './helpers.js';

// ============================================
// CASH INFLOWS
// ============================================

/**
 * Get Cash Received from Operations
 */
export function getCashReceivedFromOperations(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  // This should fetch operating revenue/receipts
  return 0;
}

export function getCashReceivedFromOperationsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getCashReceivedFromOperations(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Accounts Receivable Receipts
 */
export function getAccountsReceivableReceipts(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getAccountsReceivableReceiptsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAccountsReceivableReceipts(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Other Operating Receipts
 */
export function getOtherOperatingReceipts(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOtherOperatingReceiptsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOtherOperatingReceipts(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Interest Received
 */
export function getInterestReceived(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getInterestReceivedYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getInterestReceived(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Long Term Loan (inflow)
 */
export function getLongTermLoanInflow(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  // This is loan drawdown/disbursement
  return 0;
}

export function getLongTermLoanInflowYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getLongTermLoanInflow(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Total Cash Inflow
 * Sum of all inflow items
 */
export function getTotalCashInflow(calculationCache, projectName, year, label) {
  const cashOps = getNumber(getCashReceivedFromOperations(calculationCache, projectName, year, label));
  const arReceipts = getNumber(getAccountsReceivableReceipts(calculationCache, projectName, year, label));
  const otherReceipts = getNumber(getOtherOperatingReceipts(calculationCache, projectName, year, label));
  const interest = getNumber(getInterestReceived(calculationCache, projectName, year, label));
  const loan = getNumber(getLongTermLoanInflow(calculationCache, projectName, year, label));
  
  return cashOps + arReceipts + otherReceipts + interest + loan;
}

export function getTotalCashInflowYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getTotalCashInflow(calculationCache, projectName, year, label));
  }, 0);
}

