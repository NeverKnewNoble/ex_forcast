/**
 * Asset-related calculations for Balance Sheet
 * Handles tangible assets, current assets, and total assets
 */

import { getNumber } from './helpers.js';

// ============================================
// TANGIBLE ASSETS
// ============================================

/**
 * Get Assets Cost for a specific period
 */
export function getAssetsCost(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  // This should fetch the cost of tangible assets
  return 0;
}

/**
 * Get Assets Cost total for a year
 */
export function getAssetsCostYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAssetsCost(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Depreciation for a specific period
 */
export function getDepreciation(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  // This should fetch depreciation from the P&L or dedicated source
  return 0;
}

/**
 * Get Depreciation total for a year
 */
export function getDepreciationYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getDepreciation(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Net Book Value for a specific period
 * Net Book Value = Assets Cost - Depreciation
 */
export function getNetBookValue(calculationCache, projectName, year, label) {
  const assetsCost = getNumber(getAssetsCost(calculationCache, projectName, year, label));
  const depreciation = getNumber(getDepreciation(calculationCache, projectName, year, label));
  return assetsCost - depreciation;
}

/**
 * Get Net Book Value total for a year
 */
export function getNetBookValueYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getNetBookValue(calculationCache, projectName, year, label));
  }, 0);
}

// ============================================
// CURRENT ASSETS
// ============================================

/**
 * Get Account Receivables for a specific period
 */
export function getAccountReceivables(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

/**
 * Get Account Receivables total for a year
 */
export function getAccountReceivablesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAccountReceivables(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Cash & Bank for a specific period
 */
export function getCashAndBank(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

/**
 * Get Cash & Bank total for a year
 */
export function getCashAndBankYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getCashAndBank(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Total Current Assets for a specific period
 * Total Current Assets = Account Receivables + Cash & Bank
 */
export function getTotalCurrentAssets(calculationCache, projectName, year, label) {
  const receivables = getNumber(getAccountReceivables(calculationCache, projectName, year, label));
  const cash = getNumber(getCashAndBank(calculationCache, projectName, year, label));
  return receivables + cash;
}

/**
 * Get Total Current Assets for a year
 */
export function getTotalCurrentAssetsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getTotalCurrentAssets(calculationCache, projectName, year, label));
  }, 0);
}

// ============================================
// TOTAL ASSETS
// ============================================

/**
 * Get Total Assets for a specific period
 * Total Assets = Net Book Value + Total Current Assets
 */
export function getTotalAssets(calculationCache, projectName, year, label, getColumnLabelsForYear) {
  const netBookValue = getNumber(getNetBookValue(calculationCache, projectName, year, label));
  const currentAssets = getNumber(getTotalCurrentAssets(calculationCache, projectName, year, label));
  return netBookValue + currentAssets;
}

/**
 * Get Total Assets for a year
 */
export function getTotalAssetsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getTotalAssets(calculationCache, projectName, year, label, getColumnLabelsForYear));
  }, 0);
}

