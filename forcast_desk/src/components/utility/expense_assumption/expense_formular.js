// ** Get year ranges function
export function getVisibleYears(from, to) {
  const fromYear = parseInt(from);
  const toYear = parseInt(to);
  if (!fromYear || !toYear || fromYear > toYear) return [];
  const range = [];
  for (let y = fromYear; y <= toYear; y++) range.push(y);
  return range;
}


// UI display for Monthly varaible
export const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// UI display for Quaterly varaible
export const quarterLabels = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];

export function getColumnLabels(displayMode) {
  return displayMode === "monthly" ? monthLabels : quarterLabels;
}

// Fet years, expense and mount from API function
export function getAmount(expenseData, expense, year, month) {
  const entries = expenseData?.[year]?.[month] || [];
  const found = entries.find(e => e.expense === expense);
  return found ? parseFloat(found.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
}

// Calculating Total function
export function calculateTotal(expenseData, expense, year, displayMode) {
  const months = getColumnLabels(displayMode);
  let total = 0;
  for (const month of months) {
    const rawAmount = getAmount(expenseData, expense, year, month);
    const amt = parseFloat(rawAmount.toString().replace(/,/g, ''));
    if (!isNaN(amt)) total += amt;
  }
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


// Count Year function from range
export function yearsCount(from, to) {
  const fromYear = parseInt(from);
  const toYear = parseInt(to);
  
  if (!fromYear || !toYear || fromYear > toYear) return 0;
  return toYear - fromYear + 1;
}

export const quarterToMonths = {
  "Jan-Mar": ["Jan", "Feb", "Mar"],
  "Apr-Jun": ["Apr", "May", "Jun"],
  "Jul-Sep": ["Jul", "Aug", "Sep"],
  "Oct-Dec": ["Oct", "Nov", "Dec"]
};
