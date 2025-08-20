// Payroll Related Input Handlers
// Handles all input/output events for payroll related fields

import { getRelatedFieldValue, setRelatedFieldValue, formatCurrency as formatRelatedCurrency, formatPercentage, allowOnlyNumbersAndDecimal } from './index.js';
import { setPayrollRelatedValue, addPayrollRelatedChange } from './payroll_related_data_service.js';

/**
 *! Helper function to safely format numbers to 2 decimal places with commas
 * @param {number} value - Value to format
 * @returns {string} - Formatted value
 */
export function formatMoney(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }
  const num = parseFloat(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Payroll Taxes Handlers
export function getTaxPercentage(row) {
  return getRelatedFieldValue(row, 'tax_percentage');
}

export function getTaxTotal(row) {
  // Calculate tax total based on salary and tax percentage
  const taxPercentage = getTaxPercentage(row);
  const salary = row.salary || 0;
  const count = row.count || 0;
  const taxTotal = (salary * count * taxPercentage) / 100;
  return formatRelatedCurrency(taxTotal);
}

export function handleTaxPercentageInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'tax_percentage', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'tax_percentage', year, numericValue);
    addPayrollRelatedChange(row.id, 'tax_percentage', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleTaxPercentageFocus(row, event) {
  const rawValue = getTaxPercentage(row);
  event.target.textContent = rawValue.toString();
}

export function handleTaxPercentageBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00%';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'tax_percentage', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'tax_percentage', year, value);
      addPayrollRelatedChange(row.id, 'tax_percentage', year, null, value);
    }
    
    event.target.textContent = formatPercentage(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00%';
  }
}

export function handleTaxTotalInput(row, event, payrollData, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.tax_total = value;
  
  // Store in payrollData for persistence
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    if (!payrollData[year]) {
      payrollData[year] = {};
    }
    if (!payrollData[year][row.id]) {
      payrollData[year][row.id] = {};
    }
    payrollData[year][row.id].tax_total = parseFloat(value) || 0;
    payrollData[year][row.id]._lastUpdate = Date.now();
  }
}

export function handleTaxTotalFocus(row, event) {
  const rawValue = getTaxTotal(row);
  event.target.textContent = rawValue.toString();
}

export function handleTaxTotalBlur(row, event, isSaved, payrollData, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.tax_total = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    // Store in payrollData
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      if (!payrollData[year]) {
        payrollData[year] = {};
      }
      if (!payrollData[year][row.id]) {
        payrollData[year][row.id] = {};
      }
      payrollData[year][row.id].tax_total = value;
      payrollData[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Supplementary Pay Handlers
export function getVacation(row) {
  return getRelatedFieldValue(row, 'vacation');
}

export function getRelocation(row) {
  return getRelatedFieldValue(row, 'relocation');
}

export function getSeverenceIndemnity(row) {
  return getRelatedFieldValue(row, 'severence_indemnity');
}

export function getOther(row) {
  return getRelatedFieldValue(row, 'other');
}

// Vacation Handlers
export function handleVacationInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'vacation', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'supplementary_vacation', year, numericValue);
    addPayrollRelatedChange(row.id, 'supplementary_vacation', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleVacationFocus(row, event) {
  const rawValue = getVacation(row);
  event.target.textContent = rawValue.toString();
}

export function handleVacationBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'vacation', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'supplementary_vacation', year, value);
      addPayrollRelatedChange(row.id, 'supplementary_vacation', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Relocation Handlers
export function handleRelocationInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'relocation', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'supplementary_relocation', year, numericValue);
    addPayrollRelatedChange(row.id, 'supplementary_relocation', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleRelocationFocus(row, event) {
  const rawValue = getRelocation(row);
  event.target.textContent = rawValue.toString();
}

export function handleRelocationBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'relocation', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'supplementary_relocation', year, value);
      addPayrollRelatedChange(row.id, 'supplementary_relocation', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Severence & Indemnity Handlers
export function handleSeverenceIndemnityInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'severence_indemnity', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'supplementary_severence_indemnity', year, numericValue);
    addPayrollRelatedChange(row.id, 'supplementary_severence_indemnity', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleSeverenceIndemnityFocus(row, event) {
  const rawValue = getSeverenceIndemnity(row);
  event.target.textContent = rawValue.toString();
}

export function handleSeverenceIndemnityBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'severence_indemnity', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'supplementary_severence_indemnity', year, value);
      addPayrollRelatedChange(row.id, 'supplementary_severence_indemnity', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Other Handlers
export function handleOtherInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'other', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'supplementary_other', year, numericValue);
    addPayrollRelatedChange(row.id, 'supplementary_other', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleOtherFocus(row, event) {
  const rawValue = getOther(row);
  event.target.textContent = rawValue.toString();
}

export function handleOtherBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    setRelatedFieldValue(row, 'other', value);
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Employee Benefits Handlers
export function getMedical(row) {
  return getRelatedFieldValue(row, 'medical');
}

export function getUniforms(row) {
  return getRelatedFieldValue(row, 'uniforms');
}

export function getEmployeeMeal(row) {
  return getRelatedFieldValue(row, 'employee_meal');
}

export function getTransport(row) {
  return getRelatedFieldValue(row, 'transport');
}

export function getTelephone(row) {
  return getRelatedFieldValue(row, 'telephone');
}

export function getAirTicket(row) {
  return getRelatedFieldValue(row, 'air_ticket');
}

export function getBenefitsOther(row) {
  return getRelatedFieldValue(row, 'benefits_other');
}

// Medical Handlers
export function handleMedicalInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'medical', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_medical', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_medical', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleMedicalFocus(row, event) {
  const rawValue = getMedical(row);
  event.target.textContent = rawValue.toString();
}

export function handleMedicalBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'medical', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_medical', year, value);
      addPayrollRelatedChange(row.id, 'benefit_medical', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Uniforms Handlers
export function handleUniformsInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'uniforms', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_uniforms', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_uniforms', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleUniformsFocus(row, event) {
  const rawValue = getUniforms(row);
  event.target.textContent = rawValue.toString();
}

export function handleUniformsBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'uniforms', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_uniforms', year, value);
      addPayrollRelatedChange(row.id, 'benefit_uniforms', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Employee Meal Handlers
export function handleEmployeeMealInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'employee_meal', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_employee_meal', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_employee_meal', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleEmployeeMealFocus(row, event) {
  const rawValue = getEmployeeMeal(row);
  event.target.textContent = rawValue.toString();
}

export function handleEmployeeMealBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'employee_meal', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_employee_meal', year, value);
      addPayrollRelatedChange(row.id, 'benefit_employee_meal', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Transport Handlers
export function handleTransportInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'transport', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_transport', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_transport', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleTransportFocus(row, event) {
  const rawValue = getTransport(row);
  event.target.textContent = rawValue.toString();
}

export function handleTransportBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'transport', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_transport', year, value);
      addPayrollRelatedChange(row.id, 'benefit_transport', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Telephone Handlers
export function handleTelephoneInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'telephone', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_telephone', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_telephone', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleTelephoneFocus(row, event) {
  const rawValue = getTelephone(row);
  event.target.textContent = rawValue.toString();
}

export function handleTelephoneBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'telephone', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_telephone', year, value);
      addPayrollRelatedChange(row.id, 'benefit_telephone', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Air Ticket Handlers
export function handleAirTicketInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'air_ticket', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_air_ticket', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_air_ticket', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleAirTicketFocus(row, event) {
  const rawValue = getAirTicket(row);
  event.target.textContent = rawValue.toString();
}

export function handleAirTicketBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'air_ticket', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_air_ticket', year, value);
      addPayrollRelatedChange(row.id, 'benefit_air_ticket', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
}

// Benefits Other Handlers
export function handleBenefitsOtherInput(row, event, isSaved, visibleYears) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(value) || 0;
  
  // Update local state
  setRelatedFieldValue(row, 'benefits_other', numericValue);
  
  // Update payroll related data service
  if (visibleYears.length > 0) {
    const year = visibleYears[0];
    setPayrollRelatedValue(row.id, 'benefit_other', year, numericValue);
    addPayrollRelatedChange(row.id, 'benefit_other', year, null, numericValue);
  }
  
  isSaved.value = false;
}

export function handleBenefitsOtherFocus(row, event) {
  const rawValue = getBenefitsOther(row);
  event.target.textContent = rawValue.toString();
}

export function handleBenefitsOtherBlur(row, event, isSaved, visibleYears) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Update local state
    setRelatedFieldValue(row, 'benefits_other', value);
    
    // Update payroll related data service
    if (visibleYears.length > 0) {
      const year = visibleYears[0];
      setPayrollRelatedValue(row.id, 'benefit_other', year, value);
      addPayrollRelatedChange(row.id, 'benefit_other', year, null, value);
    }
    
    event.target.textContent = formatRelatedCurrency(value);
    isSaved.value = false;
  } else {
    event.target.textContent = '0.00';
  }
} 