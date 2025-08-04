// Payroll Related Calculations
// Handles calculations for payroll taxes, supplementary pay, and employee benefits

import { payrollRelatedDataConstructor } from './index.js';

/**
 *! Calculate payroll taxes for a specific row
 * @param {Object} row - Payroll row data
 * @param {string} year - Year
 * @returns {Object} - Tax calculations
 */
export function calculatePayrollTaxes(row, year) {
  try {
    const taxPercentage = getTaxPercentage(row) || 0;
    const salary = row.salary || 0;
    const count = row.count || 0;
    
    const taxTotal = (salary * count * taxPercentage) / 100;
    
    return {
      taxPercentage,
      taxTotal,
      salary,
      count
    };
  } catch (error) {
    console.error('Error calculating payroll taxes:', error);
    return { taxPercentage: 0, taxTotal: 0, salary: 0, count: 0 };
  }
}

/**
 *! Calculate supplementary pay for a specific row
 * @param {Object} row - Payroll row data
 * @param {string} year - Year
 * @returns {Object} - Supplementary pay calculations
 */
export function calculateSupplementaryPay(row, year) {
  try {
    const vacation = getVacation(row) || 0;
    const relocation = getRelocation(row) || 0;
    const severenceIndemnity = getSeverenceIndemnity(row) || 0;
    const other = getOther(row) || 0;
    
    const total = vacation + relocation + severenceIndemnity + other;
    
    return {
      vacation,
      relocation,
      severenceIndemnity,
      other,
      total
    };
  } catch (error) {
    console.error('Error calculating supplementary pay:', error);
    return { vacation: 0, relocation: 0, severenceIndemnity: 0, other: 0, total: 0 };
  }
}

/**
 *! Calculate employee benefits for a specific row
 * @param {Object} row - Payroll row data
 * @param {string} year - Year
 * @returns {Object} - Employee benefits calculations
 */
export function calculateEmployeeBenefits(row, year) {
  try {
    const medical = getMedical(row) || 0;
    const uniforms = getUniforms(row) || 0;
    const employeeMeal = getEmployeeMeal(row) || 0;
    const transport = getTransport(row) || 0;
    const telephone = getTelephone(row) || 0;
    const airTicket = getAirTicket(row) || 0;
    const other = getBenefitsOther(row) || 0;
    
    const total = medical + uniforms + employeeMeal + transport + telephone + airTicket + other;
    
    return {
      medical,
      uniforms,
      employeeMeal,
      transport,
      telephone,
      airTicket,
      other,
      total
    };
  } catch (error) {
    console.error('Error calculating employee benefits:', error);
    return { 
      medical: 0, uniforms: 0, employeeMeal: 0, transport: 0, 
      telephone: 0, airTicket: 0, other: 0, total: 0 
    };
  }
}

/**
 *! Calculate total payroll related costs for a row
 * @param {Object} row - Payroll row data
 * @param {string} year - Year
 * @returns {Object} - Total calculations
 */
export function calculateTotalPayrollRelated(row, year) {
  try {
    const taxes = calculatePayrollTaxes(row, year);
    const supplementary = calculateSupplementaryPay(row, year);
    const benefits = calculateEmployeeBenefits(row, year);
    
    const total = taxes.taxTotal + supplementary.total + benefits.total;
    
    return {
      taxes,
      supplementary,
      benefits,
      total
    };
  } catch (error) {
    console.error('Error calculating total payroll related:', error);
    return { taxes: { taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 }, total: 0 };
  }
}

/**
 *! Calculate subtotals for management positions
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @returns {Object} - Management subtotals
 */
export function calculateManagementSubtotals(rows, category, location) {
  try {
    const managementRows = rows.filter(row => 
      row.category === category && 
      row.location === location && 
      row.position === 'Manager'
    );
    
    let taxes = { taxPercentage: 0, taxTotal: 0 };
    let supplementary = { vacation: 0, relocation: 0, severenceIndemnity: 0, other: 0, total: 0 };
    let benefits = { medical: 0, uniforms: 0, employeeMeal: 0, transport: 0, telephone: 0, airTicket: 0, other: 0, total: 0 };
    
    managementRows.forEach(row => {
      const rowTaxes = calculatePayrollTaxes(row);
      const rowSupplementary = calculateSupplementaryPay(row);
      const rowBenefits = calculateEmployeeBenefits(row);
      
      taxes.taxPercentage += rowTaxes.taxPercentage;
      taxes.taxTotal += rowTaxes.taxTotal;
      
      supplementary.vacation += rowSupplementary.vacation;
      supplementary.relocation += rowSupplementary.relocation;
      supplementary.severenceIndemnity += rowSupplementary.severenceIndemnity;
      supplementary.other += rowSupplementary.other;
      supplementary.total += rowSupplementary.total;
      
      benefits.medical += rowBenefits.medical;
      benefits.uniforms += rowBenefits.uniforms;
      benefits.employeeMeal += rowBenefits.employeeMeal;
      benefits.transport += rowBenefits.transport;
      benefits.telephone += rowBenefits.telephone;
      benefits.airTicket += rowBenefits.airTicket;
      benefits.other += rowBenefits.other;
      benefits.total += rowBenefits.total;
    });
    
    return { taxes, supplementary, benefits };
  } catch (error) {
    console.error('Error calculating management subtotals:', error);
    return { taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
  }
}

/**
 *! Calculate subtotals for non-management positions
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @returns {Object} - Non-management subtotals
 */
export function calculateNonManagementSubtotals(rows, category, location) {
  try {
    const nonManagementRows = rows.filter(row => 
      row.category === category && 
      row.location === location && 
      row.position === 'Non-manager'
    );
    
    let taxes = { taxPercentage: 0, taxTotal: 0 };
    let supplementary = { vacation: 0, relocation: 0, severenceIndemnity: 0, other: 0, total: 0 };
    let benefits = { medical: 0, uniforms: 0, employeeMeal: 0, transport: 0, telephone: 0, airTicket: 0, other: 0, total: 0 };
    
    nonManagementRows.forEach(row => {
      const rowTaxes = calculatePayrollTaxes(row);
      const rowSupplementary = calculateSupplementaryPay(row);
      const rowBenefits = calculateEmployeeBenefits(row);
      
      taxes.taxPercentage += rowTaxes.taxPercentage;
      taxes.taxTotal += rowTaxes.taxTotal;
      
      supplementary.vacation += rowSupplementary.vacation;
      supplementary.relocation += rowSupplementary.relocation;
      supplementary.severenceIndemnity += rowSupplementary.severenceIndemnity;
      supplementary.other += rowSupplementary.other;
      supplementary.total += rowSupplementary.total;
      
      benefits.medical += rowBenefits.medical;
      benefits.uniforms += rowBenefits.uniforms;
      benefits.employeeMeal += rowBenefits.employeeMeal;
      benefits.transport += rowBenefits.transport;
      benefits.telephone += rowBenefits.telephone;
      benefits.airTicket += rowBenefits.airTicket;
      benefits.other += rowBenefits.other;
      benefits.total += rowBenefits.total;
    });
    
    return { taxes, supplementary, benefits };
  } catch (error) {
    console.error('Error calculating non-management subtotals:', error);
    return { taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
  }
}

/**
 *! Calculate location totals
 * @param {Array} rows - Payroll rows
 * @param {string} category - Category
 * @param {string} location - Location
 * @returns {Object} - Location totals
 */
export function calculateLocationTotals(rows, category, location) {
  try {
    const locationRows = rows.filter(row => 
      row.category === category && 
      row.location === location
    );
    
    let taxes = { taxPercentage: 0, taxTotal: 0 };
    let supplementary = { vacation: 0, relocation: 0, severenceIndemnity: 0, other: 0, total: 0 };
    let benefits = { medical: 0, uniforms: 0, employeeMeal: 0, transport: 0, telephone: 0, airTicket: 0, other: 0, total: 0 };
    
    locationRows.forEach(row => {
      const rowTaxes = calculatePayrollTaxes(row);
      const rowSupplementary = calculateSupplementaryPay(row);
      const rowBenefits = calculateEmployeeBenefits(row);
      
      taxes.taxPercentage += rowTaxes.taxPercentage;
      taxes.taxTotal += rowTaxes.taxTotal;
      
      supplementary.vacation += rowSupplementary.vacation;
      supplementary.relocation += rowSupplementary.relocation;
      supplementary.severenceIndemnity += rowSupplementary.severenceIndemnity;
      supplementary.other += rowSupplementary.other;
      supplementary.total += rowSupplementary.total;
      
      benefits.medical += rowBenefits.medical;
      benefits.uniforms += rowBenefits.uniforms;
      benefits.employeeMeal += rowBenefits.employeeMeal;
      benefits.transport += rowBenefits.transport;
      benefits.telephone += rowBenefits.telephone;
      benefits.airTicket += rowBenefits.airTicket;
      benefits.other += rowBenefits.other;
      benefits.total += rowBenefits.total;
    });
    
    return { taxes, supplementary, benefits };
  } catch (error) {
    console.error('Error calculating location totals:', error);
    return { taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
  }
}

/**
 *! Calculate hotel totals
 * @param {Array} rows - Payroll rows
 * @returns {Object} - Hotel totals
 */
export function calculateHotelTotals(rows) {
  try {
    let taxes = { taxPercentage: 0, taxTotal: 0 };
    let supplementary = { vacation: 0, relocation: 0, severenceIndemnity: 0, other: 0, total: 0 };
    let benefits = { medical: 0, uniforms: 0, employeeMeal: 0, transport: 0, telephone: 0, airTicket: 0, other: 0, total: 0 };
    
    rows.forEach(row => {
      const rowTaxes = calculatePayrollTaxes(row);
      const rowSupplementary = calculateSupplementaryPay(row);
      const rowBenefits = calculateEmployeeBenefits(row);
      
      taxes.taxPercentage += rowTaxes.taxPercentage;
      taxes.taxTotal += rowTaxes.taxTotal;
      
      supplementary.vacation += rowSupplementary.vacation;
      supplementary.relocation += rowSupplementary.relocation;
      supplementary.severenceIndemnity += rowSupplementary.severenceIndemnity;
      supplementary.other += rowSupplementary.other;
      supplementary.total += rowSupplementary.total;
      
      benefits.medical += rowBenefits.medical;
      benefits.uniforms += rowBenefits.uniforms;
      benefits.employeeMeal += rowBenefits.employeeMeal;
      benefits.transport += rowBenefits.transport;
      benefits.telephone += rowBenefits.telephone;
      benefits.airTicket += rowBenefits.airTicket;
      benefits.other += rowBenefits.other;
      benefits.total += rowBenefits.total;
    });
    
    return { taxes, supplementary, benefits };
  } catch (error) {
    console.error('Error calculating hotel totals:', error);
    return { taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
  }
}

/**
 *! Calculate employee/room ratio
 * @param {Array} rows - Payroll rows
 * @param {number} totalRooms - Total number of rooms
 * @returns {Object} - Employee/room ratio calculations
 */
export function calculateEmployeeRoomRatio(rows, totalRooms) {
  try {
    if (!totalRooms || totalRooms <= 0) {
      return { ratio: 0, taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
    }
    
    const hotelTotals = calculateHotelTotals(rows);
    const totalEmployees = rows.reduce((sum, row) => sum + (row.count || 0), 0);
    const ratio = totalEmployees / totalRooms;
    
    return {
      ratio,
      totalEmployees,
      totalRooms,
      taxes: hotelTotals.taxes,
      supplementary: hotelTotals.supplementary,
      benefits: hotelTotals.benefits
    };
  } catch (error) {
    console.error('Error calculating employee/room ratio:', error);
    return { ratio: 0, taxes: { taxPercentage: 0, taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 } };
  }
}

// Helper functions for getting field values
function getTaxPercentage(row) {
  return row.tax_percentage || 0;
}

function getVacation(row) {
  return row.vacation || 0;
}

function getRelocation(row) {
  return row.relocation || 0;
}

function getSeverenceIndemnity(row) {
  return row.severence_indemnity || 0;
}

function getOther(row) {
  return row.other || 0;
}

function getMedical(row) {
  return row.medical || 0;
}

function getUniforms(row) {
  return row.uniforms || 0;
}

function getEmployeeMeal(row) {
  return row.employee_meal || 0;
}

function getTransport(row) {
  return row.transport || 0;
}

function getTelephone(row) {
  return row.telephone || 0;
}

function getAirTicket(row) {
  return row.air_ticket || 0;
}

function getBenefitsOther(row) {
  return row.benefits_other || 0;
}
