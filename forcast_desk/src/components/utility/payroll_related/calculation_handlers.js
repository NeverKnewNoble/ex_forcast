// Payroll Related Calculation Handlers
// Handles all calculation functions for payroll related data

import { formatMoney } from './input_handlers.js';
import { getTaxPercentage, getTaxTotal, getVacation, getRelocation, getSeverenceIndemnity, getOther, getMedical, getUniforms, getEmployeeMeal, getTransport, getTelephone, getAirTicket, getBenefitsOther } from './input_handlers.js';
import { toRaw } from 'vue';

// Payroll Taxes Calculation Functions
export function calculateSubTotalManagementTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  if (managementRows.length === 0) return 0;
  
  const totalTaxPercentage = managementRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / managementRows.length).toFixed(2);
}

export function calculateSubTotalManagementTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTaxAmount = managementRows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

export function calculateSubTotalNonManagementTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  if (nonManagementRows.length === 0) return 0;
  
  const totalTaxPercentage = nonManagementRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / nonManagementRows.length).toFixed(2);
}

export function calculateSubTotalNonManagementTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTaxAmount = nonManagementRows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

export function calculateLocationTotalTaxPercentageLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTaxPercentageLocal: rows is not an array', rows);
    return 0;
  }
  
  if (rows.length === 0) return 0;
  
  const totalTaxPercentage = rows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / rows.length).toFixed(2);
}

export function calculateLocationTotalTaxTotalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTaxTotalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTaxAmount = rows.reduce((sum, row) => {
    const taxTotal = getTaxTotal(row);
    const numericValue = parseFloat(taxTotal) || 0;
    return sum + numericValue;
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

export function calculateHotelTotalTaxPercentageLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return 0;
  }
  
  const rawRows = toRaw(rows);
  
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return 0;
  }
  
  if (rawRows.length === 0) return 0;
  
  const totalTaxPercentage = rawRows.reduce((sum, row) => {
    const taxPercentage = getTaxPercentage(row) || 0;
    return sum + taxPercentage;
  }, 0);
  
  return (totalTaxPercentage / rawRows.length).toFixed(2);
}

export function calculateHotelTotalTaxTotalLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTaxAmount = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

export function calculateEmployeeRoomRatioTaxPercentageLocal(rows) {
  return calculateHotelTotalTaxPercentageLocal(rows);
}

export function calculateEmployeeRoomRatioTaxTotalLocal(rows) {
  return calculateHotelTotalTaxTotalLocal(rows);
}

// Supplementary Pay Calculation Functions
export function calculateSubTotalManagementVacationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementVacationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalVacation = managementRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

export function calculateSubTotalManagementRelocationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementRelocationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalRelocation = managementRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

export function calculateSubTotalManagementSeverenceIndemnityLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementSeverenceIndemnityLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalSeverenceIndemnity = managementRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

export function calculateSubTotalManagementOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalOther = managementRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

export function calculateSubTotalNonManagementVacationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementVacationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalVacation = nonManagementRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

export function calculateSubTotalNonManagementRelocationLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementRelocationLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalRelocation = nonManagementRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

export function calculateSubTotalNonManagementSeverenceIndemnityLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementSeverenceIndemnityLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalSeverenceIndemnity = nonManagementRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

export function calculateSubTotalNonManagementOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalOther = nonManagementRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

export function calculateLocationTotalVacationLocal(rows, category, location) {
  const totalVacation = rows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

export function calculateLocationTotalRelocationLocal(rows, category, location) {
  const totalRelocation = rows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

export function calculateLocationTotalSeverenceIndemnityLocal(rows, category, location) {
  const totalSeverenceIndemnity = rows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

export function calculateLocationTotalOtherLocal(rows, category, location) {
  const totalOther = rows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

export function calculateHotelTotalVacationLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalVacation = rawRows.reduce((sum, row) => {
    const vacation = getVacation(row) || 0;
    return sum + vacation;
  }, 0);
  
  return formatMoney(totalVacation);
}

export function calculateHotelTotalRelocationLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalRelocation = rawRows.reduce((sum, row) => {
    const relocation = getRelocation(row) || 0;
    return sum + relocation;
  }, 0);
  
  return formatMoney(totalRelocation);
}

export function calculateHotelTotalSeverenceIndemnityLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalSeverenceIndemnity = rawRows.reduce((sum, row) => {
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    return sum + severenceIndemnity;
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

export function calculateHotelTotalOtherLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalOther = rawRows.reduce((sum, row) => {
    const other = getOther(row) || 0;
    return sum + other;
  }, 0);
  
  return formatMoney(totalOther);
}

export function calculateEmployeeRoomRatioVacationLocal(rows) {
  return calculateHotelTotalVacationLocal(rows);
}

export function calculateEmployeeRoomRatioRelocationLocal(rows) {
  return calculateHotelTotalRelocationLocal(rows);
}

export function calculateEmployeeRoomRatioSeverenceIndemnityLocal(rows) {
  return calculateHotelTotalSeverenceIndemnityLocal(rows);
}

export function calculateEmployeeRoomRatioOtherLocal(rows) {
  return calculateHotelTotalOtherLocal(rows);
}

// Employee Benefits Calculation Functions
export function calculateSubTotalManagementMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalMedical = managementRows.reduce((sum, row) => {
    const medical = getMedical(row) || 0;
    return sum + medical;
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateSubTotalManagementUniformsLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementUniformsLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalUniforms = managementRows.reduce((sum, row) => {
    const uniforms = getUniforms(row) || 0;
    return sum + uniforms;
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateSubTotalManagementEmployeeMealLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementEmployeeMealLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalEmployeeMeal = managementRows.reduce((sum, row) => {
    const employeeMeal = getEmployeeMeal(row) || 0;
    return sum + employeeMeal;
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateSubTotalManagementTransportLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTransportLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTransport = managementRows.reduce((sum, row) => {
    const transport = getTransport(row) || 0;
    return sum + transport;
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateSubTotalManagementTelephoneLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementTelephoneLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTelephone = managementRows.reduce((sum, row) => {
    const telephone = getTelephone(row) || 0;
    return sum + telephone;
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateSubTotalManagementAirTicketLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementAirTicketLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalAirTicket = managementRows.reduce((sum, row) => {
    const airTicket = getAirTicket(row) || 0;
    return sum + airTicket;
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateSubTotalManagementBenefitsOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalManagementBenefitsOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalBenefitsOther = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateSubTotalNonManagementMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateSubTotalNonManagementMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalMedical = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateSubTotalNonManagementUniformsLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalUniforms = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateSubTotalNonManagementEmployeeMealLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalEmployeeMeal = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateSubTotalNonManagementTransportLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTransport = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateSubTotalNonManagementTelephoneLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTelephone = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateSubTotalNonManagementAirTicketLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalAirTicket = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateSubTotalNonManagementBenefitsOtherLocal(rows, category, location) {
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalBenefitsOther = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateLocationTotalMedicalLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalMedicalLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalMedical = rows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateLocationTotalUniformsLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalUniformsLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalUniforms = rows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateLocationTotalEmployeeMealLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalEmployeeMealLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalEmployeeMeal = rows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateLocationTotalTransportLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTransportLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTransport = rows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateLocationTotalTelephoneLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalTelephoneLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalTelephone = rows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateLocationTotalAirTicketLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalAirTicketLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalAirTicket = rows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateLocationTotalBenefitsOtherLocal(rows, category, location) {
  // Defensive check for rows
  if (!rows || !Array.isArray(rows)) {
    console.warn('calculateLocationTotalBenefitsOtherLocal: rows is not an array', rows);
    return formatMoney(0);
  }
  
  const totalBenefitsOther = rows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateHotelTotalMedicalLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalMedical = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

export function calculateHotelTotalUniformsLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalUniforms = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

export function calculateHotelTotalEmployeeMealLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalEmployeeMeal = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

export function calculateHotelTotalTransportLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTransport = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

export function calculateHotelTotalTelephoneLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalTelephone = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

export function calculateHotelTotalAirTicketLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalAirTicket = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

export function calculateHotelTotalBenefitsOtherLocal(rows) {
  // Early return if rows is undefined or null
  if (!rows) {
    return formatMoney(0);
  }
  
  const rawRows = toRaw(rows);
  // Defensive check for rows
  if (!rawRows || !Array.isArray(rawRows)) {
    return formatMoney(0);
  }
  
  const totalBenefitsOther = rawRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

export function calculateEmployeeRoomRatioMedicalLocal(rows) {
  return calculateHotelTotalMedicalLocal(rows);
}

export function calculateEmployeeRoomRatioUniformsLocal(rows) {
  return calculateHotelTotalUniformsLocal(rows);
}

export function calculateEmployeeRoomRatioEmployeeMealLocal(rows) {
  return calculateHotelTotalEmployeeMealLocal(rows);
}

export function calculateEmployeeRoomRatioTransportLocal(rows) {
  return calculateHotelTotalTransportLocal(rows);
}

export function calculateEmployeeRoomRatioTelephoneLocal(rows) {
  return calculateHotelTotalTelephoneLocal(rows);
}

export function calculateEmployeeRoomRatioAirTicketLocal(rows) {
  return calculateHotelTotalAirTicketLocal(rows);
}

export function calculateEmployeeRoomRatioBenefitsOtherLocal(rows) {
  return calculateHotelTotalBenefitsOtherLocal(rows);
} 