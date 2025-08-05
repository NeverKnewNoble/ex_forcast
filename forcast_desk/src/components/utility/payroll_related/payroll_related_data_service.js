// Payroll Related Data Service - Handles API calls for payroll related data

import { ref } from 'vue';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';

// State for payroll related data
export const payrollRelatedData = ref({});
export const payrollRelatedChanges = ref([]);
export const isSavingPayrollRelated = ref(false);
export const payrollRelatedSaveError = ref("");

/**
 * Fetch payroll related data from the backend
 * @param {string} projectName - Project name
 * @param {string} fromYear - From year
 * @param {string} toYear - To year
 * @returns {Promise<Object>} - Payroll related data
 */
export async function fetchPayrollRelatedData(projectName, fromYear = null, toYear = null) {
  try {
    const response = await fetch(`/api/v2/method/ex_forcast.api.call_and_save_payroll_related_data.payroll_related_data_display?project=${encodeURIComponent(projectName)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle nested response structure
    const data = result.data || result;
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Filter by year range if provided
    if (fromYear && toYear) {
      const filteredData = {};
      for (const year in data) {
        if (year >= fromYear && year <= toYear) {
          filteredData[year] = data[year];
        }
      }
      payrollRelatedData.value = filteredData;
    } else {
      payrollRelatedData.value = data;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching payroll related data:', error);
    throw error;
  }
}

/**
 * Save payroll related data changes to the backend
 * @param {Array} changes - Array of changes to save
 * @param {string} projectName - Project name
 * @returns {Promise<Object>} - Save result
 */
export async function savePayrollRelatedChanges(changes, projectName) {
  try {
    isSavingPayrollRelated.value = true;
    payrollRelatedSaveError.value = "";
    
    const requestBody = {
      changes: changes,
      project: projectName
    };
    
    const response = await fetch('/api/v2/method/ex_forcast.api.call_and_save_payroll_related_data.upsert_payroll_related_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    // Handle nested response structure
    const responseData = result.data || result;
    
    if (!responseData.success) {
      throw new Error(responseData.error || 'Failed to save payroll related data');
    }
    
    // Clear changes after successful save
    payrollRelatedChanges.value = [];
    
    return responseData;
  } catch (error) {
    console.error('Error saving payroll related data:', error);
    payrollRelatedSaveError.value = error.message;
    throw error;
  } finally {
    isSavingPayrollRelated.value = false;
  }
}

/**
 * Add a change to the payroll related changes array
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Type of field (tax_percentage, vacation, medical, etc.)
 * @param {string} year - Year
 * @param {string} month - Month (optional)
 * @param {any} newValue - New value
 */
export function addPayrollRelatedChange(rowId, fieldType, year, month = null, newValue) {
  // Find existing change for this row and field
  const existingChangeIndex = payrollRelatedChanges.value.findIndex(change => 
    change.rowId === rowId && change.fieldType === fieldType && change.year === year
  );
  
  if (existingChangeIndex !== -1) {
    // Update existing change
    payrollRelatedChanges.value[existingChangeIndex].newValue = newValue;
  } else {
    // Add new change
    payrollRelatedChanges.value.push({
      rowId,
      fieldType,
      year,
      month,
      newValue,
      timestamp: Date.now()
    });
  }
}

/**
 * Get payroll related value for a specific row and field
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Type of field
 * @param {string} year - Year
 * @returns {any} - Field value
 */
export function getPayrollRelatedValue(rowId, fieldType, year) {
  const yearData = payrollRelatedData.value[year];
  
  if (!yearData) {
    return null;
  }
  
  // Handle different field types
  if (fieldType === 'tax_percentage') {
    return yearData.payroll_taxes?.[rowId]?.tax_percentage || 0;
  }
  
  if (fieldType.startsWith('supplementary_')) {
    let detail = fieldType.replace('supplementary_', '');
    // Map field names to backend expected values
    if (detail === 'vacation') detail = 'vacation';
    else if (detail === 'relocation') detail = 'relocation';
    else if (detail === 'severence_indemnity') detail = 'severence_indemnity';
    else if (detail === 'other') detail = 'other';
    
    return yearData.supplementary_pay?.[rowId]?.[detail] || 0;
  }
  
  if (fieldType.startsWith('benefit_')) {
    let benefit = fieldType.replace('benefit_', '');
    // Map field names to backend expected values
    if (benefit === 'medical') benefit = 'medical';
    else if (benefit === 'uniforms') benefit = 'uniforms';
    else if (benefit === 'employee_meal') benefit = 'employee_meal';
    else if (benefit === 'transport') benefit = 'transport';
    else if (benefit === 'telephone') benefit = 'telephone';
    else if (benefit === 'air_ticket') benefit = 'air_ticket';
    else if (benefit === 'other') benefit = 'other';
    
    return yearData.employee_benefits?.[rowId]?.[benefit] || 0;
  }
  
  return null;
}

/**
 * Set payroll related value for a specific row and field
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Type of field
 * @param {string} year - Year
 * @param {any} value - New value
 */
export function setPayrollRelatedValue(rowId, fieldType, year, value) {
  if (!payrollRelatedData.value[year]) {
    payrollRelatedData.value[year] = {
      payroll_taxes: {},
      supplementary_pay: {},
      employee_benefits: {}
    };
  }
  
  // Handle different field types
  if (fieldType === 'tax_percentage') {
    if (!payrollRelatedData.value[year].payroll_taxes[rowId]) {
      payrollRelatedData.value[year].payroll_taxes[rowId] = {};
    }
    payrollRelatedData.value[year].payroll_taxes[rowId].tax_percentage = value;
  }
  
  if (fieldType.startsWith('supplementary_')) {
    let detail = fieldType.replace('supplementary_', '');
    // Map field names to backend expected values
    if (detail === 'vacation') detail = 'vacation';
    else if (detail === 'relocation') detail = 'relocation';
    else if (detail === 'severence_indemnity') detail = 'severence_indemnity';
    else if (detail === 'other') detail = 'other';
    
    if (!payrollRelatedData.value[year].supplementary_pay[rowId]) {
      payrollRelatedData.value[year].supplementary_pay[rowId] = {};
    }
    payrollRelatedData.value[year].supplementary_pay[rowId][detail] = value;
  }
  
  if (fieldType.startsWith('benefit_')) {
    let benefit = fieldType.replace('benefit_', '');
    // Map field names to backend expected values
    if (benefit === 'medical') benefit = 'medical';
    else if (benefit === 'uniforms') benefit = 'uniforms';
    else if (benefit === 'employee_meal') benefit = 'employee_meal';
    else if (benefit === 'transport') benefit = 'transport';
    else if (benefit === 'telephone') benefit = 'telephone';
    else if (benefit === 'air_ticket') benefit = 'air_ticket';
    else if (benefit === 'other') benefit = 'other';
    
    if (!payrollRelatedData.value[year].employee_benefits[rowId]) {
      payrollRelatedData.value[year].employee_benefits[rowId] = {};
    }
    payrollRelatedData.value[year].employee_benefits[rowId][benefit] = value;
  }
}

/**
 * Check if there are any unsaved payroll related changes
 * @returns {boolean} - True if there are unsaved changes
 */
export function hasPayrollRelatedChanges() {
  return payrollRelatedChanges.value.length > 0;
}

/**
 * Clear all payroll related changes
 */
export function clearPayrollRelatedChanges() {
  payrollRelatedChanges.value = [];
}

/**
 * Get all payroll related changes as a format suitable for the API
 * @returns {Array} - Array of changes in API format
 */
export function getPayrollRelatedChangesForAPI() {
  const changes = [];
  
  // Group changes by year
  const changesByYear = {};
  
  payrollRelatedChanges.value.forEach(change => {
    if (!changesByYear[change.year]) {
      changesByYear[change.year] = {
        year: change.year,
        payroll_taxes: {},
        supplementary_pay: {},
        employee_benefits: {}
      };
    }
    
    // Add change to appropriate section
    if (change.fieldType === 'tax_percentage') {
      changesByYear[change.year].payroll_taxes[change.rowId] = {
        tax_percentage: change.newValue
      };
    }
    
    if (change.fieldType.startsWith('supplementary_')) {
      let detail = change.fieldType.replace('supplementary_', '');
      // Map field names to backend expected values
      if (detail === 'vacation') detail = 'vacation';
      else if (detail === 'relocation') detail = 'relocation';
      else if (detail === 'severence_indemnity') detail = 'severence_indemnity';
      else if (detail === 'other') detail = 'other';
      
      if (!changesByYear[change.year].supplementary_pay[change.rowId]) {
        changesByYear[change.year].supplementary_pay[change.rowId] = {};
      }
      changesByYear[change.year].supplementary_pay[change.rowId][detail] = change.newValue;
    }
    
    if (change.fieldType.startsWith('benefit_')) {
      let benefit = change.fieldType.replace('benefit_', '');
      // Map field names to backend expected values
      if (benefit === 'medical') benefit = 'medical';
      else if (benefit === 'uniforms') benefit = 'uniforms';
      else if (benefit === 'employee_meal') benefit = 'employee_meal';
      else if (benefit === 'transport') benefit = 'transport';
      else if (benefit === 'telephone') benefit = 'telephone';
      else if (benefit === 'air_ticket') benefit = 'air_ticket';
      else if (benefit === 'other') benefit = 'other';
      
      if (!changesByYear[change.year].employee_benefits[change.rowId]) {
        changesByYear[change.year].employee_benefits[change.rowId] = {};
      }
      changesByYear[change.year].employee_benefits[change.rowId][benefit] = change.newValue;
    }
  });
  
  return Object.values(changesByYear);
} 