/**
 * Cash Outflow calculations for Cashflow report
 * Handles all payment and expense calculations
 */

import { getNumber } from './helpers.js';

// ============================================
// CASH OUTFLOWS - Individual Items
// ============================================

/**
 * Get Rooms Net Salaries & Wages Payments
 */
export function getRoomsSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getRoomsSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getRoomsSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Rooms Bonus Payments
 */
export function getRoomsBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getRoomsBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getRoomsBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Rooms Payroll Related Payments
 */
export function getRoomsPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getRoomsPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getRoomsPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Rooms Expenses Payments
 */
export function getRoomsExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getRoomsExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getRoomsExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get F&B Cost of Sales
 */
export function getFnbCostOfSales(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getFnbCostOfSalesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getFnbCostOfSales(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get F&B Net Salaries & Wages Payments
 */
export function getFnbSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getFnbSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getFnbSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get F&B Bonus Payments
 */
export function getFnbBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getFnbBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getFnbBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get F&B Payroll Related Payments
 */
export function getFnbPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getFnbPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getFnbPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get F&B Expenses Payments
 */
export function getFnbExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getFnbExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getFnbExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get OOD Cost Payments
 */
export function getOodCostPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOodCostPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOodCostPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get OOD Net Salaries & Wages Payments
 */
export function getOodSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOodSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOodSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get OOD Bonus Payments
 */
export function getOodBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOodBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOodBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get OOD Payroll Related Payments
 */
export function getOodPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOodPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOodPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get OOD Expenses Payments
 */
export function getOodExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getOodExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getOodExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get A&G Net Salaries & Wages Payments
 */
export function getAgSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getAgSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAgSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get A&G Bonus Payments
 */
export function getAgBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getAgBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAgBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get A&G Payroll Related Payments
 */
export function getAgPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getAgPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAgPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get A&G Expenses Payments
 */
export function getAgExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getAgExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getAgExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get IT Net Salaries & Wages Payments
 */
export function getItSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getItSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getItSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get IT Bonus Payments
 */
export function getItBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getItBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getItBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get IT Payroll Related Payments
 */
export function getItPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getItPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getItPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get IT Cost Payments
 */
export function getItCostPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getItCostPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getItCostPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get IT Expenses Payments
 */
export function getItExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getItExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getItExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get S&M Net Salaries & Wages Payments
 */
export function getSmSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getSmSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getSmSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get S&M Bonus Payments
 */
export function getSmBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getSmBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getSmBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get S&M Payroll Related Payments
 */
export function getSmPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getSmPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getSmPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get S&M Expenses Payments
 */
export function getSmExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getSmExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getSmExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get POM Net Salaries & Wages Payments
 */
export function getPomSalariesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getPomSalariesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getPomSalariesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get POM Bonus Payments
 */
export function getPomBonusPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getPomBonusPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getPomBonusPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get POM Payroll Related Payments
 */
export function getPomPayrollRelatedPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getPomPayrollRelatedPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getPomPayrollRelatedPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get POM Expenses Payments
 */
export function getPomExpensesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getPomExpensesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getPomExpensesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Utilities Payments
 */
export function getUtilitiesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getUtilitiesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getUtilitiesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Base Fee Payments
 */
export function getBaseFeePayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getBaseFeePaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getBaseFeePayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Incentive Payments
 */
export function getIncentivePayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getIncentivePaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getIncentivePayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Property & Other Taxes
 */
export function getPropertyTaxesPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getPropertyTaxesPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getPropertyTaxesPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Insurance Payments
 */
export function getInsurancePayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getInsurancePaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getInsurancePayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Replacement Reserve
 */
export function getReplacementReservePayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getReplacementReservePaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getReplacementReservePayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Project Cost
 */
export function getProjectCostPayments(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getProjectCostPaymentsYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getProjectCostPayments(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Loan Principal Repayment
 */
export function getLoanPrincipalRepayment(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getLoanPrincipalRepaymentYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getLoanPrincipalRepayment(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Loan Interest payment
 */
export function getLoanInterestPayment(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching from cache
  return 0;
}

export function getLoanInterestPaymentYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getLoanInterestPayment(calculationCache, projectName, year, label));
  }, 0);
}

// ============================================
// TOTAL CASH OUTFLOWS
// ============================================

/**
 * Get Total Cash Outflow
 * Sum of all outflow items
 */
export function getTotalCashOutflow(calculationCache, projectName, year, label) {
  const roomssalariespayments = getNumber(getRoomsSalariesPayments(calculationCache, projectName, year, label));
  const roomsbonuspayments = getNumber(getRoomsBonusPayments(calculationCache, projectName, year, label));
  const roomspayrollrelatedpayments = getNumber(getRoomsPayrollRelatedPayments(calculationCache, projectName, year, label));
  const roomsexpensespayments = getNumber(getRoomsExpensesPayments(calculationCache, projectName, year, label));
  const fnbcostofsales = getNumber(getFnbCostOfSales(calculationCache, projectName, year, label));
  const fnbsalariespayments = getNumber(getFnbSalariesPayments(calculationCache, projectName, year, label));
  const fnbbonuspayments = getNumber(getFnbBonusPayments(calculationCache, projectName, year, label));
  const fnbpayrollrelatedpayments = getNumber(getFnbPayrollRelatedPayments(calculationCache, projectName, year, label));
  const fnbexpensespayments = getNumber(getFnbExpensesPayments(calculationCache, projectName, year, label));
  const oodcostpayments = getNumber(getOodCostPayments(calculationCache, projectName, year, label));
  const oodsalariespayments = getNumber(getOodSalariesPayments(calculationCache, projectName, year, label));
  const oodbonuspayments = getNumber(getOodBonusPayments(calculationCache, projectName, year, label));
  const oodpayrollrelatedpayments = getNumber(getOodPayrollRelatedPayments(calculationCache, projectName, year, label));
  const oodexpensespayments = getNumber(getOodExpensesPayments(calculationCache, projectName, year, label));
  const agsalariespayments = getNumber(getAgSalariesPayments(calculationCache, projectName, year, label));
  const agbonuspayments = getNumber(getAgBonusPayments(calculationCache, projectName, year, label));
  const agpayrollrelatedpayments = getNumber(getAgPayrollRelatedPayments(calculationCache, projectName, year, label));
  const agexpensespayments = getNumber(getAgExpensesPayments(calculationCache, projectName, year, label));
  const itsalariespayments = getNumber(getItSalariesPayments(calculationCache, projectName, year, label));
  const itbonuspayments = getNumber(getItBonusPayments(calculationCache, projectName, year, label));
  const itpayrollrelatedpayments = getNumber(getItPayrollRelatedPayments(calculationCache, projectName, year, label));
  const itcostpayments = getNumber(getItCostPayments(calculationCache, projectName, year, label));
  const itexpensespayments = getNumber(getItExpensesPayments(calculationCache, projectName, year, label));
  const smsalariespayments = getNumber(getSmSalariesPayments(calculationCache, projectName, year, label));
  const smbonuspayments = getNumber(getSmBonusPayments(calculationCache, projectName, year, label));
  const smpayrollrelatedpayments = getNumber(getSmPayrollRelatedPayments(calculationCache, projectName, year, label));
  const smexpensespayments = getNumber(getSmExpensesPayments(calculationCache, projectName, year, label));
  const pomsalariespayments = getNumber(getPomSalariesPayments(calculationCache, projectName, year, label));
  const pombonuspayments = getNumber(getPomBonusPayments(calculationCache, projectName, year, label));
  const pompayrollrelatedpayments = getNumber(getPomPayrollRelatedPayments(calculationCache, projectName, year, label));
  const pomexpensespayments = getNumber(getPomExpensesPayments(calculationCache, projectName, year, label));
  const utilitiespayments = getNumber(getUtilitiesPayments(calculationCache, projectName, year, label));
  const basefeepayments = getNumber(getBaseFeePayments(calculationCache, projectName, year, label));
  const incentivepayments = getNumber(getIncentivePayments(calculationCache, projectName, year, label));
  const propertytaxespayments = getNumber(getPropertyTaxesPayments(calculationCache, projectName, year, label));
  const insurancepayments = getNumber(getInsurancePayments(calculationCache, projectName, year, label));
  const replacementreservepayments = getNumber(getReplacementReservePayments(calculationCache, projectName, year, label));
  const projectcostpayments = getNumber(getProjectCostPayments(calculationCache, projectName, year, label));
  const loanprincipalrepayment = getNumber(getLoanPrincipalRepayment(calculationCache, projectName, year, label));
  const loaninterestpayment = getNumber(getLoanInterestPayment(calculationCache, projectName, year, label));

  return roomssalariespayments +
         roomsbonuspayments +
         roomspayrollrelatedpayments +
         roomsexpensespayments +
         fnbcostofsales +
         fnbsalariespayments +
         fnbbonuspayments +
         fnbpayrollrelatedpayments +
         fnbexpensespayments +
         oodcostpayments +
         oodsalariespayments +
         oodbonuspayments +
         oodpayrollrelatedpayments +
         oodexpensespayments +
         agsalariespayments +
         agbonuspayments +
         agpayrollrelatedpayments +
         agexpensespayments +
         itsalariespayments +
         itbonuspayments +
         itpayrollrelatedpayments +
         itcostpayments +
         itexpensespayments +
         smsalariespayments +
         smbonuspayments +
         smpayrollrelatedpayments +
         smexpensespayments +
         pomsalariespayments +
         pombonuspayments +
         pompayrollrelatedpayments +
         pomexpensespayments +
         utilitiespayments +
         basefeepayments +
         incentivepayments +
         propertytaxespayments +
         insurancepayments +
         replacementreservepayments +
         projectcostpayments +
         loanprincipalrepayment +
         loaninterestpayment;
}

export function getTotalCashOutflowYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getTotalCashOutflow(calculationCache, projectName, year, label));
  }, 0);
}

// ============================================
// NET CASH FLOW & BALANCES
// ============================================

/**
 * Get Net cash flows from Investing activities
 */
export function getNetInvestingActivities(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  // This would be from capital expenditures, asset purchases, etc.
  return 0;
}

export function getNetInvestingActivitiesYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getNetInvestingActivities(calculationCache, projectName, year, label));
  }, 0);
}

/**
 * Get Net Cash Flow
 * Net Cash Flow = Total Inflow - Total Outflow + Net Investing Activities
 */
export function getNetCashFlow(calculationCache, projectName, year, label, getTotalCashInflowUtil) {
  const inflow = getNumber(getTotalCashInflowUtil(calculationCache, projectName, year, label));
  const outflow = getNumber(getTotalCashOutflow(calculationCache, projectName, year, label));
  const investing = getNumber(getNetInvestingActivities(calculationCache, projectName, year, label));
  
  return inflow - outflow + investing;
}

export function getNetCashFlowYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalCashInflowUtil) {
  // Calculate year totals by summing all periods
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => {
    return sum + getNumber(getNetCashFlow(calculationCache, projectName, year, label, getTotalCashInflowUtil));
  }, 0);
}

/**
 * Get Opening Balance for the Month
 */
export function getOpeningBalance(calculationCache, projectName, year, label) {
  // TODO: Implement actual data fetching
  // This should be the closing balance from previous period
  return 0;
}

export function getOpeningBalanceYear(calculationCache, projectName, year, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  // Opening balance for the year is the opening of the first period
  if (labels.length > 0) {
    return getNumber(getOpeningBalance(calculationCache, projectName, year, labels[0]));
  }
  return 0;
}

/**
 * Get Closing Balance for the Month
 * Closing Balance = Opening Balance + Net Cash Flow
 */
export function getClosingBalance(calculationCache, projectName, year, label, getTotalCashInflowUtil) {
  const opening = getNumber(getOpeningBalance(calculationCache, projectName, year, label));
  const netFlow = getNumber(getNetCashFlow(calculationCache, projectName, year, label, getTotalCashInflowUtil));
  
  return opening + netFlow;
}

export function getClosingBalanceYear(calculationCache, projectName, year, getColumnLabelsForYear, getTotalCashInflowUtil) {
  const labels = getColumnLabelsForYear(year);
  // Closing balance for the year is the closing of the last period
  if (labels.length > 0) {
    return getNumber(getClosingBalance(calculationCache, projectName, year, labels[labels.length - 1], getTotalCashInflowUtil));
  }
  return 0;
}
