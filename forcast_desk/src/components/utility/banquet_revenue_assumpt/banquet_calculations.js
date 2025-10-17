// Utility functions for auto-calculated banquet revenue fields

import { toNum } from './index.js';

export function calcFood(row) {
  return toNum(row.pax) * toNum(row.avg_food_check);
}

export function calcLiquor(row) {
  return toNum(row.pax) * toNum(row.avg_liquor_check);
}

export function calcSoftDrinks(row) {
  return toNum(row.pax) * toNum(row.avg_soft_drinks_check);
}

export function calcHallSpaceCharges(row) {
  return toNum(row.events) * toNum(row.avg_hall_space_charges_check);
}

// List of auto-calculated fields
export const AUTO_CALC_FIELDS = ['food', 'liquor', 'soft_drinks', 'hall_space_charges'];
// List of summary fields to exclude from gross sum
export const SUMMARY_FIELDS = ['gross', 'net_amount', 'advance_bal', 'amount_per_event', 'amount_per_pax', 'avg_pax_per_event'];

export const INPUT_FIELDS = [
  'events',
  'pax',
  'avg_food_check',
  'avg_liquor_check',
  'avg_soft_drinks_check',
  'avg_hall_space_charges_check'
];

// Accepts row and a list of all field codes (static + custom)
export function calcGross(row, allFieldCodes = []) {
  // Always sum auto-calculated fields
  let total = 0;
  for (const code of AUTO_CALC_FIELDS) {
    switch (code) {
      case 'food': total += calcFood(row); break;
      case 'liquor': total += calcLiquor(row); break;
      case 'soft_drinks': total += calcSoftDrinks(row); break;
      case 'hall_space_charges': total += calcHallSpaceCharges(row); break;
    }
  }
  // Sum all other manual fields, including custom, except summary/calculated fields, auto-calculated, and input fields
  for (const code of allFieldCodes) {
    if (
      !AUTO_CALC_FIELDS.includes(code) &&
      !SUMMARY_FIELDS.includes(code) &&
      !INPUT_FIELDS.includes(code)
    ) {
      total += toNum(row[code]);
    }
  }
  return total;
}

export function calcNetAmount(row, allFieldCodes = []) {
  const net = calcGross(row, allFieldCodes) - toNum(row.advance_bal || 0);
  return net;
}

export function calcAmountPerEvent(row, allFieldCodes = []) {
  const events = toNum(row.events);

  if (events === 0) return 0;

  const amount = calcGross(row, allFieldCodes) / events;
  return amount;
}

export function calcAmountPerPax(row, allFieldCodes = []) {
  const pax = toNum(row.pax);
  if (pax === 0) return 0;
  
  const amount = calcGross(row, allFieldCodes) / pax;
  return amount;
}

export function calcAvgPaxPerEvent(row) {
  const events = toNum(row.events);
  if (events === 0) return 0;

  const amount = toNum(row.pax) / events;
  return amount;
} 