// Payroll Data Constructor - Handles data transformation between API and frontend

import { PAYROLL_CATEGORIES, DEFAULT_PAYROLL_ROW } from '../payroll_constants.js';

/**
 *! Payroll Data Constructor Class
 *? Handles transformation between API responses and frontend format
 */
export class PayrollDataConstructor {
  constructor() {
    this.validationRules = {
      required: ['department', 'departmentLocation', 'position', 'designation'],
      numeric: ['salary', 'count'],
      minValues: {
        salary: 0,
        count: 0
      }
    };
  }

  /**
   *! Transform API response to frontend format
   * @param {Object} apiResponse - Raw API response
   * @param {string} projectName - Project name
   * @param {number} fromYear - Optional year filter start
   * @param {number} toYear - Optional year filter end
   * @returns {Object} - Transformed data with payrollData and payrollRows
   */
  transformApiToFrontend(apiResponse, projectName, fromYear = null, toYear = null) {
    try {
      if (!apiResponse || !apiResponse.message) {
        throw new Error('Invalid API response structure');
      }

      const transformedData = {};
      const transformedRows = [];
      
      Object.keys(apiResponse.message).forEach(year => {
        // Filter by year range if provided
        if (fromYear && toYear) {
          const yearNum = parseInt(year);
          const fromYearNum = parseInt(fromYear);
          const toYearNum = parseInt(toYear);
          
          if (yearNum < fromYearNum || yearNum > toYearNum) {
            return; // Skip this year if it's outside the selected range
          }
        }
        
        //? Transform each payroll item
        apiResponse.message[year].forEach(item => {
          const transformedRow = this.transformPayrollItem(item, year);
          if (transformedRow) {
            transformedRows.push(transformedRow);
            
            //? Initialize payrollData structure
            if (!transformedData[year]) {
              transformedData[year] = {};
            }
            if (!transformedData[year][transformedRow.id]) {
              transformedData[year][transformedRow.id] = {};
            }
            
            transformedData[year][transformedRow.id] = {
              salary: item.salary || 0,
              unique_id: item.unique_id,
              count: item.monthly_count && Object.keys(item.monthly_count).length > 0 
                ? item.monthly_count 
                : {},
              salary: {}
            };
          }
        });
      });
      
      return {
        payrollData: transformedData,
        payrollRows: transformedRows,
        projectName,
        totalRows: transformedRows.length
      };
    } catch (error) {
      console.error('Error transforming API to frontend:', error);
      throw new Error(`Failed to transform API data: ${error.message}`);
    }
  }

  /**
   *! Transform frontend data to API format
   * @param {Array} payrollRows - Frontend payroll rows
   * @param {Object} payrollData - Frontend payroll data
   * @param {string} projectName - Project name
   * @returns {Object} - Data formatted for API submission
   */
  transformFrontendToApi(payrollRows, payrollData, projectName) {
    try {
      if (!projectName) {
        throw new Error('Project name is required');
      }

      const apiChanges = [];
      
      payrollRows.forEach(row => {
        const apiItem = this.transformRowToApiFormat(row, payrollData);
        if (apiItem) {
          apiChanges.push(apiItem);
        }
      });

      return {
        changes: apiChanges,
        project: projectName
      };
    } catch (error) {
      console.error('Error transforming frontend to API:', error);
      throw new Error(`Failed to transform frontend data: ${error.message}`);
    }
  }

  /**
   *! Transform individual payroll item from API to frontend
   * @param {Object} item - API payroll item
   * @param {string} year - Year
   * @returns {Object} - Transformed payroll row
   */
  transformPayrollItem(item, year) {
    try {
      //? Generate stable row ID
      let rowId;
      if (item.unique_id) {
        rowId = item.unique_id;
      } else {
        rowId = `${item.department}_${item.department_location}_${item.position}_${item.designation}_${year}`;
      }
      
      return {
        id: rowId,
        department: item.department || '',
        departmentLocation: item.department_location || '',
        position: item.position || '',
        designation: item.designation || '',
        salary: parseFloat(item.salary) || 0,
        count: parseInt(item.amount) || 0,
        category: item.department || '', // Category based on department
        year: year,
        unique_id: item.unique_id
      };
    } catch (error) {
      console.error('Error transforming payroll item:', error, item);
      return null;
    }
  }

  /**
   *! Transform individual row from frontend to API format
   * @param {Object} row - Frontend payroll row
   * @param {Object} payrollData - Frontend payroll data
   * @returns {Object} - API format payroll item
   */
  transformRowToApiFormat(row, payrollData) {
    try {
      const apiItem = {
        department: row.department,
        department_location: row.departmentLocation,
        position: row.position,
        designation: row.designation,
        salary: parseFloat(row.salary) || 0,
        amount: parseInt(row.count) || 0
      };

      //? Add unique_id if exists
      if (row.unique_id) {
        apiItem.unique_id = row.unique_id;
      }

      //? Add year if exists
      if (row.year) {
        apiItem.year = row.year;
      }

      //? Add monthly data if exists
      if (payrollData && payrollData[row.year] && payrollData[row.year][row.id]) {
        const monthlyData = payrollData[row.year][row.id];
        if (monthlyData.count && Object.keys(monthlyData.count).length > 0) {
          apiItem.monthly_count = monthlyData.count;
        }
      }

      return apiItem;
    } catch (error) {
      console.error('Error transforming row to API format:', error, row);
      return null;
    }
  }

  /**
   *! Validate payroll data
   * @param {Object} data - Data to validate
   * @param {string} type - Validation type ('api' or 'frontend')
   * @returns {Object} - Validation result
   */
  validatePayrollData(data, type = 'frontend') {
    const errors = [];
    const warnings = [];

    try {
      if (type === 'frontend') {
        return this.validateFrontendData(data, errors, warnings);
      } else {
        return this.validateApiData(data, errors, warnings);
      }
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  }

  /**
   *! Validate frontend data
   * @param {Object} data - Frontend data
   * @param {Array} errors - Error array
   * @param {Array} warnings - Warning array
   * @returns {Object} - Validation result
   */
  validateFrontendData(data, errors, warnings) {
    if (!data.payrollRows || !Array.isArray(data.payrollRows)) {
      errors.push('Payroll rows must be an array');
      return { isValid: false, errors, warnings };
    }

    data.payrollRows.forEach((row, index) => {
      //? Check required fields
      this.validationRules.required.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: ${field} is required`);
        }
      });

      //? Check numeric fields
      this.validationRules.numeric.forEach(field => {
        const value = parseFloat(row[field]);
        if (isNaN(value) || value < this.validationRules.minValues[field]) {
          errors.push(`Row ${index + 1}: ${field} must be a positive number`);
        }
      });

      //? Check department validity
      if (row.department && !PAYROLL_CATEGORIES.includes(row.department)) {
        warnings.push(`Row ${index + 1}: Department "${row.department}" is not in standard categories`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   *! Validate API data
   * @param {Object} data - API data
   * @param {Array} errors - Error array
   * @param {Array} warnings - Warning array
   * @returns {Object} - Validation result
   */
  validateApiData(data, errors, warnings) {
    if (!data.message) {
      errors.push('API response must contain message property');
      return { isValid: false, errors, warnings };
    }

    //? Validate API structure
    Object.keys(data.message).forEach(year => {
      if (!Array.isArray(data.message[year])) {
        errors.push(`Year ${year}: Data must be an array`);
        return;
      }

      data.message[year].forEach((item, index) => {
        if (!item.department || !item.department_location || !item.position || !item.designation) {
          errors.push(`Year ${year}, Row ${index + 1}: Missing required fields`);
        }

        if (isNaN(parseFloat(item.salary)) || isNaN(parseInt(item.amount))) {
          errors.push(`Year ${year}, Row ${index + 1}: Invalid numeric values`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   *! Create default payroll row
   * @returns {Object} - Default payroll row
   */
  createDefaultRow() {
    return {
      ...DEFAULT_PAYROLL_ROW,
      id: this.generateRowId()
    };
  }

  /**
   *! Create default related page row
   * @param {string} pageType - Type of related page
   * @param {Object} payrollReference - Reference payroll row
   * @returns {Object} - Default related page row
   */
  createDefaultRelatedRow(pageType, payrollReference = null) {
    const baseRow = {
      id: this.generateRowId(),
      pageType: pageType,
      year: new Date().getFullYear().toString()
    };

    if (payrollReference) {
      baseRow.payroll_reference = {
        id: payrollReference.id,
        unique_id: payrollReference.unique_id,
        department: payrollReference.department,
        departmentLocation: payrollReference.departmentLocation,
        position: payrollReference.position,
        designation: payrollReference.designation
      };
    }

    //? Add page-specific default fields
    const pageDefaults = this.getPageTypeDefaults(pageType);
    return { ...baseRow, ...pageDefaults };
  }

  /**
   *! Get default fields for specific page type
   * @param {string} pageType - Type of related page
   * @returns {Object} - Default fields for page type
   */
  getPageTypeDefaults(pageType) {
    const defaults = {
      bonus: {
        bonus_amount: 0,
        bonus_type: 'annual',
        bonus_percentage: 0
      },
      overtime: {
        overtime_hours: 0,
        overtime_rate: 0,
        overtime_type: 'monthly'
      },
      benefits: {
        benefit_type: 'health',
        benefit_amount: 0,
        benefit_percentage: 0
      }
    };
    
    return defaults[pageType] || {};
  }

  /**
   *! Generate unique row ID
   * @returns {string} - Unique row ID
   */
  generateRowId() {
    return `payroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   *! Merge API changes with existing data
   * @param {Object} existingData - Existing payroll data
   * @param {Array} apiChanges - New API changes
   * @returns {Object} - Merged data
   */
  mergeApiChanges(existingData, apiChanges) {
    try {
      const mergedData = { ...existingData };
      
      apiChanges.forEach(change => {
        const year = change.year || new Date().getFullYear().toString();
        const rowId = change.unique_id || this.generateRowId();
        
        if (!mergedData[year]) {
          mergedData[year] = {};
        }
        
        mergedData[year][rowId] = {
          salary: parseFloat(change.salary) || 0,
          unique_id: change.unique_id,
          count: change.monthly_count || {},
          salary: {}
        };
      });

      return mergedData;
    } catch (error) {
      console.error('Error merging API changes:', error);
      throw new Error(`Failed to merge API changes: ${error.message}`);
    }
  }

  /**
   *! Extract changes from payroll data
   * @param {Object} payrollData - Current payroll data
   * @param {Object} originalData - Original payroll data
   * @returns {Array} - Array of changes
   */
  extractChanges(payrollData, originalData) {
    const changes = [];
    
    try {
      Object.keys(payrollData).forEach(year => {
        Object.keys(payrollData[year]).forEach(rowId => {
          const current = payrollData[year][rowId];
          const original = originalData[year]?.[rowId];
          
          if (!original || JSON.stringify(current) !== JSON.stringify(original)) {
            changes.push({
              year,
              rowId,
              data: current,
              type: original ? 'update' : 'create'
            });
          }
        });
      });

      return changes;
    } catch (error) {
      console.error('Error extracting changes:', error);
      throw new Error(`Failed to extract changes: ${error.message}`);
    }
  }
}

//? Export singleton instance
export const payrollDataConstructor = new PayrollDataConstructor();

//? Export utility functions for backward compatibility
export const transformApiToFrontend = (apiResponse, projectName, fromYear, toYear) => 
  payrollDataConstructor.transformApiToFrontend(apiResponse, projectName, fromYear, toYear);

export const transformFrontendToApi = (payrollRows, payrollData, projectName) => 
  payrollDataConstructor.transformFrontendToApi(payrollRows, payrollData, projectName);

export const validatePayrollData = (data, type) => 
  payrollDataConstructor.validatePayrollData(data, type);

export const createDefaultRow = () => 
  payrollDataConstructor.createDefaultRow(); 