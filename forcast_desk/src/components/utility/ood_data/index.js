// OOD Data Utility Functions
//! Export all utility functions and constants
export * from './ood_defaults';
export * from './ood_calculations';
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js';


//! Format value based on field type
export function formatOODValue(fieldCode, value) {
  if (value === null || value === undefined || value === '') return '0.00';
  
  const numValue = Number(value);
  if (isNaN(numValue)) return '0.00';
  
  // For percentage fields, show as percentage
  if (fieldCode.includes('percentage') || fieldCode.includes('_pct')) {
    return numValue.toFixed(2) + '%';
  }
  
  // For currency fields, show as currency
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Get visible years based on from and to year selection
export function getVisibleYears(fromYear, toYear) {
  if (!fromYear || !toYear) return [];
  
  const from = parseInt(fromYear);
  const to = parseInt(toYear);
  
  if (isNaN(from) || isNaN(to) || from > to) return [];
  
  const years = [];
  for (let year = from; year <= to; year++) {
    years.push(year);
  }
  
  return years;
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

// Get amount for a specific field, year, and month/quarter
export function getAmountForOOD(oodData, fieldCode, year, label, displayMode = 'monthly') {
  if (!oodData || !oodData[year] || !oodData[year][label]) return 0;
  
  const entries = oodData[year][label];
  if (!Array.isArray(entries)) return 0;
  const found = entries.find(e => e.field === fieldCode);
  return found ? Number(found.amount) || 0 : 0;
}

// Calculate total for a field across all months/quarters in a year
export function calculateTotalForOOD(oodData, fieldCode, year, displayMode, getColumnLabelsForYear) {
  const labels = getColumnLabelsForYear(year);
  let total = 0;
  
  for (const label of labels) {
    total += getAmountForOOD(oodData, fieldCode, year, label, displayMode);
  }
  
  return total;
}

//! Handle cell input for OOD data
export function handleOODCellInput({ year, label, field, event, oodData }) {
  const value = event.target.textContent.trim();
  const numValue = value === '' ? 0 : Number(value.replace(/[^\d.-]/g, ''));
  
  if (!oodData[year]) oodData[year] = {};
  if (!Array.isArray(oodData[year][label])) oodData[year][label] = [];

  const existingIndex = oodData[year][label].findIndex(e => e.field === field);
  
  if (existingIndex >= 0) {
    oodData[year][label][existingIndex].amount = numValue;
  } else {
    oodData[year][label].push({ field, amount: numValue });
  }
}

//! Handle cell focus for OOD data
export function handleOODCellFocus({ year, label, field, event }) {
  // Store original value for comparison
  event.target.dataset.originalValue = event.target.textContent;
}

//! Handle cell edit for OOD data
export function handleOODCellEdit({ year, label, field, event, originalOODData, changedCells, oodData, isSaved, isComponentReady }) {
  if (!isComponentReady.value) return;

  // Support both input fields and contenteditable
  const rawNew = (typeof event.target.value === 'string') ? event.target.value.trim() : event.target.textContent.trim();
  const rawOrig = (event.target.dataset.originalValue ?? '').toString();

  // Some OOD fields (e.g., *_base) are string selects. Compare as strings.
  const isBaseField = typeof field === 'string' && field.endsWith('_base');
  if (isBaseField) {
    if (rawNew !== rawOrig) {
      const idx = changedCells.value.findIndex(cell => cell.year === year && cell.label === label && cell.field === field);
      if (idx >= 0) {
        changedCells.value[idx].newValue = rawNew;
      } else {
        changedCells.value.push({ year, label, field, newValue: rawNew });
      }
      isSaved.value = false;
    }
    return;
  }

  // Convert to numbers for comparison
  const newNum = rawNew === '' ? 0 : Number(rawNew.replace(/[^\d.-]/g, ''));
  const originalNum = rawOrig === '' ? 0 : Number(rawOrig.replace(/[^\d.-]/g, ''));

  if (newNum !== originalNum) {
    // Check if this change is already tracked
    const existingChangeIndex = changedCells.value.findIndex(
      cell => cell.year === year && cell.label === label && cell.field === field
    );

    if (existingChangeIndex >= 0) {
      changedCells.value[existingChangeIndex].newValue = newNum;
    } else {
      changedCells.value.push({
        year,
        label,
        field,
        newValue: newNum
      });
    }

    isSaved.value = false;
  }
}

//! Load OOD data from backend (NEW API)
export async function loadOODData(projectName = null) {
  try {
    let url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.ood_revenue_display";
    if (projectName) {
      url += `?project=${encodeURIComponent(projectName)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load OOD data');
    const result = await response.json();
    // The backend returns { year: { month: { laundry_table: [...], health_club_table: [...] } } }
    return result.message || {};
  } catch (error) {
    console.error('Error loading OOD data:', error);
    return {};
  }
}

//! Save OOD data changes to backend (NEW API)
export async function saveOODChanges(changes, projectName = null) {
  try {
    // changes should be an array of { year, month, laundry_table, health_club_table }
    const url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.upsert_ood_revenue_items";
    const formData = new FormData();
    formData.append('changes', JSON.stringify(changes));
    if (projectName) {
      formData.append('project', projectName);
    }
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to save OOD changes');
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error('Error saving OOD changes:', error);
    throw error;
  }
}

//! Convert server data to frontend format
export function convertOODServerDataToFrontend(serverData) {
  const frontendData = {};
  
  if (!serverData || !Array.isArray(serverData)) return frontendData;
  
  for (const item of serverData) {
    const { year, month, field, amount } = item;
    
    if (!frontendData[year]) frontendData[year] = {};
    if (!frontendData[year][month]) frontendData[year][month] = [];
    
    frontendData[year][month].push({ field, amount });
  }
  
  return frontendData;
}

//! Utility function to convert to number
export function toNum(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

//! Toggle year collapse functionality
export function toggleCollapse(year, collapsedYears) {
  const index = collapsedYears.value.indexOf(year);
  if (index > -1) {
    collapsedYears.value.splice(index, 1);
  } else {
    collapsedYears.value.push(year);
  }
}

//! Check if year is collapsed
export function isYearCollapsed(year, collapsedYears) {
  return collapsedYears.value.includes(year);
}

//! Load year options
export async function loadYearOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.year.get_year_options', {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
    if (!response.ok) throw new Error('Failed to load years');
    
    const result = await response.json();
    return result.message?.options || [];
  } catch (error) {
    console.error('Error loading year options:', error);
    return [];
  }
} 

// Load only laundry_table data
export async function loadLaundryTableData(projectName = null) {
  try {
    let url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.ood_laundry_table_display";
    if (projectName) {
      url += `?project=${encodeURIComponent(projectName)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load laundry table data');
    const result = await response.json();
    return result.message || {};
  } catch (error) {
    console.error('Error loading laundry table data:', error);
    return {};
  }
}

// Save only laundry_table data for a given year/month
export async function saveLaundryTableData(year, month, laundryTable, projectName = null) {
  try {
    const url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.upsert_ood_laundry_table";
    const formData = new FormData();
    formData.append('year', year);
    formData.append('month', month);
    formData.append('laundry_table', JSON.stringify(laundryTable));
    if (projectName) {
      formData.append('project', projectName);
    }
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to save laundry table data');
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error('Error saving laundry table data:', error);
    throw error;
  }
}

// Load only health_club_table data
export async function loadHealthClubTableData(projectName = null) {
  try {
    let url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.ood_health_club_table_display";
    if (projectName) {
      url += `?project=${encodeURIComponent(projectName)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load health club table data');
    const result = await response.json();
    return result.message || {};
  } catch (error) {
    console.error('Error loading health club table data:', error);
    return {};
  }
}

// Save only health_club_table data for a given year/month
export async function saveHealthClubTableData(year, month, healthClubTable, projectName = null) {
  try {
    const url = "/api/method/ex_forcast.api.call_and_save_ood_revenue.upsert_ood_health_club_table";
    const formData = new FormData();
    formData.append('year', year);
    formData.append('month', month);
    formData.append('health_club_table', JSON.stringify(healthClubTable));
    if (projectName) {
      formData.append('project', projectName);
    }
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to save health club table data');
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error('Error saving health club table data:', error);
    throw error;
  }
} 