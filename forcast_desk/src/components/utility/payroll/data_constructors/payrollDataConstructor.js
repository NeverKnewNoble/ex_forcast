// Payroll Data Constructor - Handles data transformation between API and frontend

import { PAYROLL_CATEGORIES, DEFAULT_PAYROLL_ROW } from '../payroll_constants.js';

/**
 *! Payroll Data Constructor Class
 *? Handles transformation between API responses and frontend format
 *? Supports foreign key relationships for related pages
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
    
    //? Foreign key relationships for related pages
    this.foreignKeyRelations = {
      bonus: {
        referenceTable: 'payroll',
        foreignKey: 'payroll_id',
        fields: ['department', 'departmentLocation', 'position', 'designation']
      },
      overtime: {
        referenceTable: 'payroll',
        foreignKey: 'payroll_id',
        fields: ['department', 'departmentLocation', 'position', 'designation']
      },
      benefits: {
        referenceTable: 'payroll',
        foreignKey: 'payroll_id',
        fields: ['department', 'departmentLocation', 'position', 'designation']
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
   *! Transform related page data with foreign key reference to payroll
   * @param {Object} apiResponse - Raw API response for related page
   * @param {string} pageType - Type of related page (bonus, overtime, benefits, etc.)
   * @param {Array} payrollRows - Reference payroll rows for foreign key mapping
   * @param {string} projectName - Project name
   * @param {number} fromYear - Optional year filter start
   * @param {number} toYear - Optional year filter end
   * @returns {Object} - Transformed data with foreign key relationships
   */
  transformRelatedPageData(apiResponse, pageType, payrollRows, projectName, fromYear = null, toYear = null) {
    try {
      if (!apiResponse || !apiResponse.message) {
        throw new Error('Invalid API response structure');
      }

      if (!this.foreignKeyRelations[pageType]) {
        throw new Error(`Unknown page type: ${pageType}`);
      }

      const relation = this.foreignKeyRelations[pageType];
      const transformedData = {};
      const transformedRows = [];

      Object.keys(apiResponse.message).forEach(year => {
        //? Filter by year range if provided
        if (fromYear && toYear) {
          const yearNum = parseInt(year);
          const fromYearNum = parseInt(fromYear);
          const toYearNum = parseInt(toYear);
          
          if (yearNum < fromYearNum || yearNum > toYearNum) {
            return;
          }
        }

        //? Transform each related page item
        apiResponse.message[year].forEach(item => {
          const transformedRow = this.transformRelatedPageItem(item, year, pageType, payrollRows);
          if (transformedRow) {
            transformedRows.push(transformedRow);
            
            // Initialize data structure
            if (!transformedData[year]) {
              transformedData[year] = {};
            }
            if (!transformedData[year][transformedRow.id]) {
              transformedData[year][transformedRow.id] = {};
            }
            
            transformedData[year][transformedRow.id] = {
              ...item,
              unique_id: item.unique_id,
              payroll_reference: transformedRow.payroll_reference
            };
          }
        });
      });

      return {
        [`${pageType}Data`]: transformedData,
        [`${pageType}Rows`]: transformedRows,
        projectName,
        totalRows: transformedRows.length,
        pageType,
        foreignKeyRelation: relation
      };
    } catch (error) {
      console.error(`Error transforming ${pageType} data:`, error);
      throw new Error(`Failed to transform ${pageType} data: ${error.message}`);
    }
  }

  /**
   *! Transform individual related page item with foreign key mapping
   * @param {Object} item - API item from related page
   * @param {string} year - Year
   * @param {string} pageType - Type of related page
   * @param {Array} payrollRows - Reference payroll rows
   * @returns {Object} - Transformed row with foreign key reference
   */
  transformRelatedPageItem(item, year, pageType, payrollRows) {
    try {
      const relation = this.foreignKeyRelations[pageType];
      
      //? Find matching payroll row based on foreign key fields
      const matchingPayrollRow = this.findMatchingPayrollRow(item, payrollRows, relation);
      
      if (!matchingPayrollRow) {
        console.warn(`No matching payroll row found for ${pageType} item:`, item);
        return null;
      }

      //? Generate unique row ID
      let rowId;
      if (item.unique_id) {
        rowId = item.unique_id;
      } else {
        rowId = `${pageType}_${matchingPayrollRow.id}_${year}`;
      }

      return {
        id: rowId,
        payroll_reference: {
          id: matchingPayrollRow.id,
          unique_id: matchingPayrollRow.unique_id,
          department: matchingPayrollRow.department,
          departmentLocation: matchingPayrollRow.departmentLocation,
          position: matchingPayrollRow.position,
          designation: matchingPayrollRow.designation
        },
        ...item,
        year: year,
        unique_id: item.unique_id,
        pageType: pageType
      };
    } catch (error) {
      console.error('Error transforming related page item:', error, item);
      return null;
    }
  }

  /**
   *! Find matching payroll row based on foreign key fields
   * @param {Object} item - Related page item
   * @param {Array} payrollRows - Reference payroll rows
   * @param {Object} relation - Foreign key relation configuration
   * @returns {Object|null} - Matching payroll row or null
   */
  findMatchingPayrollRow(item, payrollRows, relation) {
    return payrollRows.find(payrollRow => {
      //? Check if all foreign key fields match
      return relation.fields.every(field => {
        const payrollValue = payrollRow[field];
        const itemValue = item[field] || item[field.toLowerCase()];
        return payrollValue === itemValue;
      });
    });
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
   *! Transform related page frontend data to API format
   * @param {Array} relatedRows - Frontend related page rows
   * @param {Object} relatedData - Frontend related page data
   * @param {string} pageType - Type of related page
   * @param {string} projectName - Project name
   * @returns {Object} - Data formatted for API submission
   */
  transformRelatedPageToApi(relatedRows, relatedData, pageType, projectName) {
    try {
      if (!projectName) {
        throw new Error('Project name is required');
      }

      if (!this.foreignKeyRelations[pageType]) {
        throw new Error(`Unknown page type: ${pageType}`);
      }

      const apiChanges = [];
      
      relatedRows.forEach(row => {
        const apiItem = this.transformRelatedRowToApiFormat(row, relatedData, pageType);
        if (apiItem) {
          apiChanges.push(apiItem);
        }
      });

      return {
        changes: apiChanges,
        project: projectName,
        pageType: pageType
      };
    } catch (error) {
      console.error(`Error transforming ${pageType} to API:`, error);
      throw new Error(`Failed to transform ${pageType} data: ${error.message}`);
    }
  }

  /**
   *! Transform individual related row from frontend to API format
   * @param {Object} row - Frontend related page row
   * @param {Object} relatedData - Frontend related page data
   * @param {string} pageType - Type of related page
   * @returns {Object} - API format related page item
   */
  transformRelatedRowToApiFormat(row, relatedData, pageType) {
    try {
      const apiItem = {
        ...row,
        //? Remove frontend-specific fields
        id: undefined,
        payroll_reference: undefined,
        pageType: undefined
      };

      //? Add foreign key reference if exists
      if (row.payroll_reference && row.payroll_reference.unique_id) {
        apiItem.payroll_id = row.payroll_reference.unique_id;
      }

      //? Add year if exists
      if (row.year) {
        apiItem.year = row.year;
      }

      return apiItem;
    } catch (error) {
      console.error('Error transforming related row to API format:', error, row);
      return null;
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
   *! Validate related page data
   * @param {Object} data - Data to validate
   * @param {string} pageType - Type of related page
   * @param {string} type - Validation type ('api' or 'frontend')
   * @returns {Object} - Validation result
   */
  validateRelatedPageData(data, pageType, type = 'frontend') {
    const errors = [];
    const warnings = [];

    try {
      if (!this.foreignKeyRelations[pageType]) {
        errors.push(`Unknown page type: ${pageType}`);
        return { isValid: false, errors, warnings };
      }

      if (type === 'frontend') {
        return this.validateRelatedFrontendData(data, pageType, errors, warnings);
      } else {
        return this.validateRelatedApiData(data, pageType, errors, warnings);
      }
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { isValid: false, errors, warnings };
    }
  }

  /**
   *! Validate related page frontend data
   * @param {Object} data - Frontend data
   * @param {string} pageType - Type of related page
   * @param {Array} errors - Error array
   * @param {Array} warnings - Warning array
   * @returns {Object} - Validation result
   */
  validateRelatedFrontendData(data, pageType, errors, warnings) {
    const rowKey = `${pageType}Rows`;
    
    if (!data[rowKey] || !Array.isArray(data[rowKey])) {
      errors.push(`${pageType} rows must be an array`);
      return { isValid: false, errors, warnings };
    }

    data[rowKey].forEach((row, index) => {
      //? Check if payroll reference exists
      if (!row.payroll_reference) {
        errors.push(`Row ${index + 1}: Missing payroll reference`);
      }

      //? Check required fields based on page type
      const requiredFields = this.getRequiredFieldsForPageType(pageType);
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${index + 1}: ${field} is required`);
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
   *! Validate related page API data
   * @param {Object} data - API data
   * @param {string} pageType - Type of related page
   * @param {Array} errors - Error array
   * @param {Array} warnings - Warning array
   * @returns {Object} - Validation result
   */
  validateRelatedApiData(data, pageType, errors, warnings) {
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
        const requiredFields = this.getRequiredFieldsForPageType(pageType);
        requiredFields.forEach(field => {
          if (!item[field]) {
            errors.push(`Year ${year}, Row ${index + 1}: Missing required field ${field}`);
          }
        });
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   *! Get required fields for specific page type
   * @param {string} pageType - Type of related page
   * @returns {Array} - Array of required fields
   */
  getRequiredFieldsForPageType(pageType) {
    const fieldMappings = {
      bonus: ['bonus_amount', 'bonus_type'],
      overtime: ['overtime_hours', 'overtime_rate'],
      benefits: ['benefit_type', 'benefit_amount']
    };
    
    return fieldMappings[pageType] || [];
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

//? Export new related page functions
export const transformRelatedPageData = (apiResponse, pageType, payrollRows, projectName, fromYear, toYear) => 
  payrollDataConstructor.transformRelatedPageData(apiResponse, pageType, payrollRows, projectName, fromYear, toYear);

export const transformRelatedPageToApi = (relatedRows, relatedData, pageType, projectName) => 
  payrollDataConstructor.transformRelatedPageToApi(relatedRows, relatedData, pageType, projectName);

export const validateRelatedPageData = (data, pageType, type) => 
  payrollDataConstructor.validateRelatedPageData(data, pageType, type);

export const createDefaultRelatedRow = (pageType, payrollReference) => 
  payrollDataConstructor.createDefaultRelatedRow(pageType, payrollReference); 