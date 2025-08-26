import { ref } from 'vue';
import {
  calcFood,
  calcLiquor,
  calcSoftDrinks,
  calcHallSpaceCharges,
  calcGross,
  calcNetAmount,
  calcAmountPerEvent,
  calcAmountPerPax,
  calcAvgPaxPerEvent
} from './banquet_calculations.js';
import { formatBanquetValue } from './banquet_format.js';
export * from './banquet_fields.js';
export * from './banquet_format.js';
export * from './banquet_calculations.js';

// Import API functions from data service
export {
  loadBanquetRevenueData,
  saveBanquetRevenueChanges,
  convertBanquetServerDataToFrontend,
  testBanquetApi,
  loadBanquetRevenueDataForFrontend
} from './banquet_data_service.js';

//! Utility: Load banquet data from the backend
export async function loadBanquetData() {
  try {
    // TODO: Replace with actual fetch logic if needed
    return {}; // Return a plain object, not a ref
  } catch (error) {
    console.error('Error loading banquet data:', error);
    return {};
  }
}

//! Utility: Get visible years between from and to (inclusive)
export function getVisibleYears(from, to) {
  const fromYear = parseInt(from);
  const toYear = parseInt(to);
  if (!fromYear || !toYear || fromYear > toYear) return [];
  const range = [];
  for (let y = fromYear; y <= toYear; y++) range.push(y);
  return range;
}

//! Utility: Get column labels for display mode
export const monthLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
export const quarterLabels = [
  'Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'
];
export function getColumnLabels(displayMode) {
  return displayMode === 'monthly' ? monthLabels : quarterLabels;
}

//! Utility: Get amount for a specific field, year, and label (month/quarter)
export function getAmountForBanquet(banquetData, code, year, label, displayMode = 'monthly') {
  if (displayMode === 'quarterly' && ['Jan-Mar','Apr-Jun','Jul-Sep','Oct-Dec'].includes(label)) {
    // First, check if the quarterly label itself exists in the data (e.g., "Jan-Mar")
    const quarterlyEntries = banquetData?.[year]?.[label] || [];
    const quarterlyFound = quarterlyEntries.find(e => e.expense === code);
    if (quarterlyFound) {
      return Number(quarterlyFound.amount) || 0;
    }
    
    // If quarterly label doesn't exist, try to sum the three months in the quarter
    const quarterToMonths = {
      'Jan-Mar': ['Jan', 'Feb', 'Mar'],
      'Apr-Jun': ['Apr', 'May', 'Jun'],
      'Jul-Sep': ['Jul', 'Aug', 'Sep'],
      'Oct-Dec': ['Oct', 'Nov', 'Dec']
    };
    let total = 0;
    for (const month of quarterToMonths[label]) {
      const entries = banquetData?.[year]?.[month] || [];
      const found = entries.find(e => e.expense === code);
      if (found) total += Number(found.amount) || 0;
    }
    return total;
  } else {
    const entries = banquetData?.[year]?.[label] || [];
    const found = entries.find(e => e.expense === code);
    return found ? Number(found.amount) || 0 : 0;
  }
}

//! Utility: Calculate total for a field in a year
export function calculateTotalForBanquet(banquetData, code, year, displayMode, getColumnLabelsForYear) {
  const months = getColumnLabelsForYear(year);
  let total = 0.00;
  
  // For calculated fields, we need to calculate the total by summing individual month/quarter calculations
  if (['food', 'liquor', 'soft_drinks', 'hall_space_charges', 'gross', 'net_amount', 'amount_per_event', 'amount_per_pax', 'avg_pax_per_event'].includes(code)) {
    for (const month of months) {
      // Get the row data for this month/quarter to calculate the field value
      const row = getBanquetRowData(banquetData, year, month);
      
      switch (code) {
        case 'food':
          total += calcFood(row); break;
        case 'liquor':
          total += calcLiquor(row); break;
        case 'soft_drinks':
          total += calcSoftDrinks(row); break;
        case 'hall_space_charges':
          total += calcHallSpaceCharges(row); break;
        case 'gross':
          total += calcGross(row, []); break;
        case 'net_amount':
          total += calcNetAmount(row, []); break;
        case 'amount_per_event':
          total += calcAmountPerEvent(row); break;
        case 'amount_per_pax':
          total += calcAmountPerPax(row); break;
        case 'avg_pax_per_event':
          total += calcAvgPaxPerEvent(row); break;
      }
    }
  } else {
    // For manual fields, use the existing logic
    for (const month of months) {
      total += getAmountForBanquet(banquetData, code, year, month, displayMode);
    }
  }
  
  return total;
}

//! Utility: Extract all unique banquet expense codes
export function extractAllBanquetExpenses(banquetData) {
  const all = new Set();
  for (const year in banquetData) {
    for (const month in banquetData[year]) {
      banquetData[year][month].forEach(e => all.add(e.expense));
    }
  }
  return [...all].sort();
}

//! Safe number conversion utility
export function toNum(val) {
  return typeof val === 'number' ? val : (val === undefined || val === null || val === '') ? 0 : Number(val);
}

//! Handler for cell edits (banquet-specific)
export function handleBanquetCellEdit({ year, label, expense, event, originalBanquetData, changedCells, banquetData, isSaved, isComponentReady }) {
  // Check if component is ready
  if (!isComponentReady || !isComponentReady.value) {
    console.warn('Component not ready yet, skipping cell edit');
    return;
  }

  // Defensive checks for refs
  if (!changedCells || !changedCells.value) {
    console.error('changedCells ref is undefined');
    return;
  }
  if (!banquetData) {
    console.error('banquetData is undefined');
    return;
  }
  if (!isSaved) {
    console.error('isSaved ref is undefined');
    return;
  }
  if (!originalBanquetData || !originalBanquetData.value) {
    console.error('originalBanquetData ref is undefined');
    return;
  }

  let newValue = event.target.innerText.replace(/,/g, '').trim();
  if (newValue === '') newValue = '0.00';
  const numValue = parseFloat(newValue) || 0;
  newValue = numValue.toFixed(2);
  let original = '0.00';
  const entries = originalBanquetData.value?.[year]?.[label] || [];
  const found = entries.find(e => e.expense === expense);
  if (found) original = parseFloat(found.amount).toFixed(2);
  if (newValue !== original) {
    isSaved.value = false;
    const idx = changedCells.value.findIndex(c => c.year === year && c.label === label && c.expense === expense);
    if (idx !== -1) {
      changedCells.value[idx].newValue = newValue;
    } else {
      changedCells.value.push({ year, label, expense, newValue });
    }
    // Ensure proper reactivity by replacing arrays
    if (!banquetData[year]) {
      banquetData[year] = {};
    }
    let dataEntries = banquetData[year][label] || [];
    const entryIdx = dataEntries.findIndex(e => e.expense === expense);
    if (entryIdx !== -1) {
      // Replace the entry with a new object
      dataEntries = [
        ...dataEntries.slice(0, entryIdx),
        { ...dataEntries[entryIdx], amount: parseFloat(newValue) },
        ...dataEntries.slice(entryIdx + 1)
      ];
    } else {
      // Add new entry
      dataEntries = [...dataEntries, { expense, amount: parseFloat(newValue) }];
    }
    banquetData[year][label] = dataEntries; // REPLACE the array reference!
    // Debug logging
    // console.log(`Cell updated: ${year}/${label}/${expense} = ${newValue}`);
    // console.log('Updated banquetData structure:', banquetData);
    // Verify the data was stored correctly
    const verifyData = banquetData?.[year]?.[label]?.find(e => e.expense === expense);
    // console.log('Verification - stored data:', verifyData);
  } else {
    changedCells.value = changedCells.value.filter(c => !(c.year === year && c.label === label && c.expense === expense));
    if (changedCells.value.length === 0) isSaved.value = true;
  }
}

//! Handler for cell input (banquet-specific, real-time formatting)
export function handleBanquetCellInput({ year, label, expense, event, banquetData }) {
  let value = event.target.innerText;
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  const shouldFormat = !value.includes('.') || (parts.length === 2 && parts[1].length === 2);
  if (shouldFormat) {
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    const numValue = parseFloat(value) || 0;
    const formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (formattedValue !== event.target.innerText) {
      event.target.innerText = formattedValue;
      const range = document.createRange();
      const selection = window.getSelection();
      const textNode = event.target.firstChild || event.target;
      range.setStart(textNode, textNode.textContent.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    if (value !== event.target.innerText) {
      event.target.innerText = value;
    }
  }
}

//! Handler for cell focus (banquet-specific, show raw value for editing)
export function handleBanquetCellFocus({ year, label, expense, event }) {
  let value = event.target.innerText;
  const rawValue = value.replace(/,/g, '');
  event.target.innerText = rawValue;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(event.target);
  selection.removeAllRanges();
  selection.addRange(range);
}

// Central function for all cell value logic (auto-calc and manual)
export function getBanquetCellValue(banquetData, fieldCode, year, label, displayMode = 'monthly') {
  // Get the row data for this year/label
  const row = getBanquetRowData(banquetData, year, label);
  switch (fieldCode) {
    case 'food':
      return calcFood(row);
    case 'liquor':
      return calcLiquor(row);
    case 'soft_drinks':
      return calcSoftDrinks(row);
    case 'hall_space_charges':
      return calcHallSpaceCharges(row);
    case 'gross':
      return calcGross(row);
    case 'net_amount':
      return calcNetAmount(row);
    case 'amount_per_event':
      return calcAmountPerEvent(row);
    case 'amount_per_pax':
      return calcAmountPerPax(row);
    case 'avg_pax_per_event':
      return calcAvgPaxPerEvent(row);
    default:
      // For manual fields, use getAmountForBanquet utility
      return getAmountForBanquet(banquetData, fieldCode, year, label, displayMode);
  }
}

// Helper to get all field values for a given year/label (month/quarter)
export function getBanquetRowData(banquetData, year, label) {
  const row = {};
  for (const f of BANQUET_FIELDS) {
    const entries = (banquetData?.[year]?.[label]) || [];
    const found = entries.find(e => e.expense === f.code);
    row[f.code] = found ? Number(found.amount) || 0 : 0;
  }
  return row;
}
