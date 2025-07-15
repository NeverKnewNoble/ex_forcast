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

export function calcGross(row) {
  return (
    // Always use the live auto-calculated values for these:
    calcFood(row) +
    calcLiquor(row) +
    calcSoftDrinks(row) +
    calcHallSpaceCharges(row) +
    // The rest are manual fields, use as-is:
    toNum(row.tobacco) +
    toNum(row.non_fnb) +
    toNum(row.outside_service_food_catering) +
    toNum(row.outside_service_beverage_catering) +
    toNum(row.others)
  );
}

export function calcNetAmount(row) {
  return calcGross(row) - toNum(row.advance_bal || 0);
}

export function calcAmountPerEvent(row) {
  const events = toNum(row.events);
  if (events === 0) return 0;
  return calcGross(row) / events;
}

export function calcAmountPerPax(row) {
  const pax = toNum(row.pax);
  if (pax === 0) return 0;
  return calcGross(row) / pax;
}

export function calcAvgPaxPerEvent(row) {
  const events = toNum(row.events);
  if (events === 0) return 0;
  return toNum(row.pax) / events;
} 