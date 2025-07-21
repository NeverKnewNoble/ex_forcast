// Market Segment Table Utilities - Cell editing and data management

import { saveMarketSegmentChanges as saveMarketSegmentChangesAPI } from './data_service.js';
import alertService from '@/components/ui/ui_utility/alertService.js';

// Handle market segment cell input events
export function handleMarketSegmentCellInput({ year, label, segment, field, event, marketSegmentData, isSaved }) {
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  
  // Update the data structure
  if (!marketSegmentData[year]) marketSegmentData[year] = {};
  if (!marketSegmentData[year][segment.market_segment]) marketSegmentData[year][segment.market_segment] = {};
  if (!marketSegmentData[year][segment.market_segment][label]) marketSegmentData[year][segment.market_segment][label] = {};
  
  marketSegmentData[year][segment.market_segment][label][field] = value;
  
  // Mark as unsaved
  isSaved.value = false;
}

// Handle market segment cell focus events
export function handleMarketSegmentCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}

// Handle market segment cell edit completion
export function handleMarketSegmentCellEdit({ year, label, segment, field, event, marketSegmentData, isSaved }) {
  // Additional validation or processing can be added here
  // For now, just ensure the data is properly formatted
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  
  if (!marketSegmentData[year]) marketSegmentData[year] = {};
  if (!marketSegmentData[year][segment.market_segment]) marketSegmentData[year][segment.market_segment] = {};
  if (!marketSegmentData[year][segment.market_segment][label]) marketSegmentData[year][segment.market_segment][label] = {};
  
  marketSegmentData[year][segment.market_segment][label][field] = value;
  
  // Mark as unsaved
  isSaved.value = false;
}

// Save market segment changes to the backend
export async function saveMarketSegmentChanges(changes, isSaving, saveError, isSaved) {
  if (changes.length === 0) {
    alertService.info('No changes to save');
    return;
  }

  isSaving.value = true;
  saveError.value = '';

  try {
    console.log('Saving market segment changes:', changes);
    
    const result = await saveMarketSegmentChangesAPI(changes);
    
    if (result && result.message && result.message.status === 'success') {
      console.log('Market segment changes saved successfully:', result);
      isSaved.value = true;
      alertService.success('Market segment changes saved successfully!');
    } else {
      console.error('Failed to save market segment changes:', result);
      saveError.value = result?.message?.message || 'Failed to save changes';
      alertService.error('Failed to save market segment changes. Please try again.');
    }
  } catch (error) {
    console.error('Error saving market segment changes:', error);
    saveError.value = error.message || 'An error occurred while saving';
    alertService.error('Error saving market segment changes: ' + error.message);
  } finally {
    isSaving.value = false;
  }
}

// Format market segment amount input
export function formatMarketSegmentAmountInput(index, form, event) {
  let value = event.target.value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  form.value.rows[index].rate = value;
}

// Clean market segment amount value
export function cleanMarketSegmentAmountValue(index, form) {
  const value = parseFloat(form.value.rows[index].rate);
  if (!isNaN(value)) {
    form.value.rows[index].rate = value.toFixed(2);
  } else {
    form.value.rows[index].rate = '0.00';
  }
}

// Get market segment value with proper formatting
export function getMarketSegmentValue(data, segment, year, label, field) {
  const value = data?.[year]?.[segment.market_segment]?.[label]?.[field] ?? 0;
  return (parseFloat(value) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Calculate market segment total for a year
export function calculateMarketSegmentTotal(data, segment, year, field) {
  let total = 0;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  for (const month of months) {
    const value = data?.[year]?.[segment.market_segment]?.[month]?.[field] ?? 0;
    total += parseFloat(value) || 0;
  }
  
  return total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
} 