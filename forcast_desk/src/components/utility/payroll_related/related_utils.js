// Payroll Related Utilities
// Handles data transformation, validation, and utility functions for payroll related data

import { payrollRelatedDataConstructor } from './index.js';
import { calculatePayrollTaxes, calculateSupplementaryPay, calculateEmployeeBenefits } from './related_calculations.js';

/**
 *! Transform API data to frontend format for payroll related data
 * @param {Object} apiData - API response data
 * @param {string} projectName - Project name
 * @returns {Object} - Transformed frontend data
 */
export function transformRelatedApiToFrontend(apiData, projectName) {
  try {
    if (!apiData || !apiData.message) {
      throw new Error('Invalid API data structure');
    }

    const transformedData = {
      relatedRows: [],
      relatedData: {},
      projectName
    };

    Object.keys(apiData.message).forEach(year => {
      const yearData = apiData.message[year];
      
      if (Array.isArray(yearData)) {
        yearData.forEach(item => {
          const transformedRow = payrollRelatedDataConstructor.transformRelatedPageItem(
            item, 
            year, 
            item.pageType, 
            [] // payrollRows will be passed separately
          );
          
          if (transformedRow) {
            transformedData.relatedRows.push(transformedRow);
            
            // Store the original API data for reference
            if (!transformedData.relatedData[year]) {
              transformedData.relatedData[year] = {};
            }
            transformedData.relatedData[year][transformedRow.id] = item;
          }
        });
      }
    });

    return transformedData;
  } catch (error) {
    console.error('Error transforming related API to frontend:', error);
    throw new Error(`Failed to transform API data: ${error.message}`);
  }
}

/**
 *! Transform frontend data to API format for payroll related data
 * @param {Array} relatedRows - Frontend related rows
 * @param {Object} relatedData - Frontend related data
 * @param {string} projectName - Project name
 * @returns {Object} - Data formatted for API submission
 */
export function transformRelatedFrontendToApi(relatedRows, relatedData, projectName) {
  try {
    return payrollRelatedDataConstructor.transformRelatedFrontendToApi(relatedRows, relatedData, projectName);
  } catch (error) {
    console.error('Error transforming related frontend to API:', error);
    throw new Error(`Failed to transform frontend data: ${error.message}`);
  }
}

/**
 *! Validate payroll related data
 * @param {Object} data - Data to validate
 * @param {string} type - Validation type ('api' or 'frontend')
 * @returns {Object} - Validation result
 */
export function validateRelatedData(data, type = 'frontend') {
  try {
    return payrollRelatedDataConstructor.validateRelatedData(data, type);
  } catch (error) {
    console.error('Error validating related data:', error);
    return { isValid: false, errors: [error.message], warnings: [] };
  }
}

/**
 *! Get field value for a specific row and field
 * @param {Object} row - Payroll row
 * @param {string} field - Field name
 * @returns {number} - Field value
 */
export function getRelatedFieldValue(row, field) {
  try {
    const fieldMappings = {
      'tax_percentage': row.tax_percentage,
      'vacation': row.vacation,
      'relocation': row.relocation,
      'severence_indemnity': row.severence_indemnity,
      'other': row.other,
      'medical': row.medical,
      'uniforms': row.uniforms,
      'employee_meal': row.employee_meal,
      'transport': row.transport,
      'telephone': row.telephone,
      'air_ticket': row.air_ticket,
      'benefits_other': row.benefits_other
    };

    return fieldMappings[field] || 0;
  } catch (error) {
    console.error('Error getting related field value:', error);
    return 0;
  }
}

/**
 *! Set field value for a specific row and field
 * @param {Object} row - Payroll row
 * @param {string} field - Field name
 * @param {number} value - Field value
 */
export function setRelatedFieldValue(row, field, value) {
  try {
    const fieldMappings = {
      'tax_percentage': 'tax_percentage',
      'vacation': 'vacation',
      'relocation': 'relocation',
      'severence_indemnity': 'severence_indemnity',
      'other': 'other',
      'medical': 'medical',
      'uniforms': 'uniforms',
      'employee_meal': 'employee_meal',
      'transport': 'transport',
      'telephone': 'telephone',
      'air_ticket': 'air_ticket',
      'benefits_other': 'benefits_other'
    };

    const fieldName = fieldMappings[field];
    if (fieldName) {
      row[fieldName] = parseFloat(value) || 0;
    }
  } catch (error) {
    console.error('Error setting related field value:', error);
  }
}

/**
 *! Create default related row
 * @param {string} pageType - Type of related page
 * @param {Object} payrollReference - Reference payroll row
 * @returns {Object} - Default related row
 */
export function createDefaultRelatedRow(pageType, payrollReference = null) {
  try {
    return payrollRelatedDataConstructor.createDefaultRelatedRow(pageType, payrollReference);
  } catch (error) {
    console.error('Error creating default related row:', error);
    return null;
  }
}

/**
 *! Get required fields for a specific page type
 * @param {string} pageType - Type of related page
 * @returns {Array} - Array of required fields
 */
export function getRequiredFieldsForPageType(pageType) {
  try {
    return payrollRelatedDataConstructor.getRequiredFieldsForPageType(pageType);
  } catch (error) {
    console.error('Error getting required fields for page type:', error);
    return [];
  }
}

/**
 *! Calculate related totals for a specific row
 * @param {Object} row - Payroll row
 * @param {string} year - Year
 * @returns {Object} - Calculated totals
 */
export function calculateRelatedTotals(row, year) {
  try {
    const taxes = calculatePayrollTaxes(row, year);
    const supplementary = calculateSupplementaryPay(row, year);
    const benefits = calculateEmployeeBenefits(row, year);
    
    return {
      taxes,
      supplementary,
      benefits,
      total: taxes.taxTotal + supplementary.total + benefits.total
    };
  } catch (error) {
    console.error('Error calculating related totals:', error);
    return { taxes: { taxTotal: 0 }, supplementary: { total: 0 }, benefits: { total: 0 }, total: 0 };
  }
}

/**
 *! Format currency value
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value) {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '0.00';
  }
}

/**
 *! Format percentage value
 * @param {number} value - Value to format
 * @returns {string} - Formatted percentage string
 */
export function formatPercentage(value) {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00%';
    }
    const num = parseFloat(value);
    return `${num.toFixed(2)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return '0.00%';
  }
}

/**
 *! Allow only numbers in input
 * @param {Event} event - Input event
 */
export function allowOnlyNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}

/**
 *! Allow only numbers and decimal point in input
 * @param {Event} event - Input event
 */
export function allowOnlyNumbersAndDecimal(event) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    event.preventDefault();
  }
}

/**
 *! Find matching payroll row for related data
 * @param {Object} relatedItem - Related item data
 * @param {Array} payrollRows - Array of payroll rows
 * @returns {Object|null} - Matching payroll row or null
 */
export function findMatchingPayrollRow(relatedItem, payrollRows) {
  try {
    if (!relatedItem.payroll_unique_id || !payrollRows || !Array.isArray(payrollRows)) {
      return null;
    }

    return payrollRows.find(row => row.unique_id === relatedItem.payroll_unique_id) || null;
  } catch (error) {
    console.error('Error finding matching payroll row:', error);
    return null;
  }
}

/**
 *! Generate unique ID for related row
 * @param {string} pageType - Type of related page
 * @param {string} payrollId - Payroll row ID
 * @param {string} year - Year
 * @returns {string} - Unique ID
 */
export function generateRelatedRowId(pageType, payrollId, year) {
  try {
    return `${pageType}_${payrollId}_${year}_${Date.now()}`;
  } catch (error) {
    console.error('Error generating related row ID:', error);
    return `related_${Date.now()}`;
  }
}

/**
 *! Check if related data has changes
 * @param {Array} originalRows - Original related rows
 * @param {Array} currentRows - Current related rows
 * @returns {boolean} - True if there are changes
 */
export function hasRelatedDataChanges(originalRows, currentRows) {
  try {
    if (!originalRows || !currentRows) {
      return false;
    }

    if (originalRows.length !== currentRows.length) {
      return true;
    }

    for (let i = 0; i < originalRows.length; i++) {
      const original = originalRows[i];
      const current = currentRows[i];

      if (!original || !current) {
        return true;
      }

      // Compare all relevant fields
      const fields = ['tax_percentage', 'vacation', 'relocation', 'severence_indemnity', 'other', 
                     'medical', 'uniforms', 'employee_meal', 'transport', 'telephone', 'air_ticket', 'benefits_other'];

      for (const field of fields) {
        if (original[field] !== current[field]) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking related data changes:', error);
    return false;
  }
}

/**
 *! Get related data summary
 * @param {Array} relatedRows - Related rows
 * @returns {Object} - Summary statistics
 */
export function getRelatedDataSummary(relatedRows) {
  try {
    if (!relatedRows || !Array.isArray(relatedRows)) {
      return { totalRows: 0, totalTaxes: 0, totalSupplementary: 0, totalBenefits: 0 };
    }

    let totalTaxes = 0;
    let totalSupplementary = 0;
    let totalBenefits = 0;

    relatedRows.forEach(row => {
      const totals = calculateRelatedTotals(row);
      totalTaxes += totals.taxes.taxTotal || 0;
      totalSupplementary += totals.supplementary.total || 0;
      totalBenefits += totals.benefits.total || 0;
    });

    return {
      totalRows: relatedRows.length,
      totalTaxes,
      totalSupplementary,
      totalBenefits,
      grandTotal: totalTaxes + totalSupplementary + totalBenefits
    };
  } catch (error) {
    console.error('Error getting related data summary:', error);
    return { totalRows: 0, totalTaxes: 0, totalSupplementary: 0, totalBenefits: 0, grandTotal: 0 };
  }
}
