// OOD Data Utility Functions
//! Export all utility functions and constants
export * from './ood_defaults';





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
  if (!oodData[year][label]) oodData[year][label] = [];
  
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
  
  const newValue = event.target.textContent.trim();
  const originalValue = event.target.dataset.originalValue || '0';
  
  // Convert to numbers for comparison
  const newNum = newValue === '' ? 0 : Number(newValue.replace(/[^\d.-]/g, ''));
  const originalNum = originalValue === '' ? 0 : Number(originalValue.replace(/[^\d.-]/g, ''));
  
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

//! Load OOD data from backend
export async function loadOODData(projectName = null) {
  try {
    const url = projectName 
      ? `/api/method/ex_forcast.api.ood_data.load_ood_data?project_name=${encodeURIComponent(projectName)}`
      : '/api/method/ex_forcast.api.ood_data.load_ood_data';
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load OOD data');
    
    const result = await response.json();
    return result.message || {};
  } catch (error) {
    console.error('Error loading OOD data:', error);
    return {};
  }
}

//! Save OOD data changes to backend
export async function saveOODChanges(changes, projectName = null) {
  try {
    const url = projectName 
      ? `/api/method/ex_forcast.api.ood_data.save_ood_changes?project_name=${encodeURIComponent(projectName)}`
      : '/api/method/ex_forcast.api.ood_data.save_ood_changes';
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changes })
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
    const response = await fetch('/api/method/ex_forcast.api.year.get_year_options');
    if (!response.ok) throw new Error('Failed to load years');
    
    const result = await response.json();
    return result.message?.options || [];
  } catch (error) {
    console.error('Error loading year options:', error);
    return [];
  }
} 