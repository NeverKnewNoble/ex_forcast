// Payroll Related Data Constructor - Handles data transformation between API and frontend

import { PayrollDataConstructor } from '@/components/utility/payroll/data_constructors/payrollDataConstructor.js';

/**
 *! Payroll Related Data Constructor Class
 *? Handles transformation between API responses and frontend format
 */
export class PayrollRelatedDataConstructor extends PayrollDataConstructor {
    constructor() {
        super();
        
        // Dynamically inherit field definitions from parent
        this.relatedFields = {
            payroll_taxes: {
                payroll_unique_id: null, // Links to payroll row
                fields: this.getPayrollTaxesFields()
            },
            supplementary_pay: {
                payroll_unique_id: null, // Links to payroll row
                fields: this.getSupplementaryPayFields()
            },
            employee_benefits: {
                payroll_unique_id: null, // Links to payroll row
                fields: this.getEmployeeBenefitsFields()
            }
        };
    }

    /**
     *! Get payroll taxes fields - can be overridden by parent
     * @returns {Array} - Array of field names
     */
    getPayrollTaxesFields() {
        return ['tax_percentage'];
    }

    /**
     *! Get supplementary pay fields - can be overridden by parent
     * @returns {Array} - Array of field names
     */
    getSupplementaryPayFields() {
        return [
            'vacation', 
            'relocation', 
            'severence_indemnity', 
            'other'
        ];
    }

    /**
     *! Get employee benefits fields - can be overridden by parent
     * @returns {Array} - Array of field names
     */
    getEmployeeBenefitsFields() {
        return [
            'medical', 
            'uniforms', 
            'employee_meal', 
            'transport', 
            'telephone', 
            'air_ticket', 
            'other'
        ];
    }

    /**
     *! Get all related field definitions dynamically
     * @returns {Object} - All field definitions
     */
    getRelatedFieldDefinitions() {
        return {
            payroll_taxes: {
                payroll_unique_id: null,
                fields: this.getPayrollTaxesFields()
            },
            supplementary_pay: {
                payroll_unique_id: null,
                fields: this.getSupplementaryPayFields()
            },
            employee_benefits: {
                payroll_unique_id: null,
                fields: this.getEmployeeBenefitsFields()
            }
        };
    }

    /**
     *! Update field definitions from parent constructor
     * @param {Object} parentFields - Field definitions from parent
     */
    updateFieldDefinitions(parentFields) {
        if (parentFields) {
            // Merge parent field definitions with related fields
            Object.keys(parentFields).forEach(pageType => {
                if (this.relatedFields[pageType]) {
                    this.relatedFields[pageType] = {
                        ...this.relatedFields[pageType],
                        ...parentFields[pageType]
                    };
                }
            });
        }
    }

    /**
     *! Transform related page item
     * @param {Object} item - API item from related page
     * @param {string} year - Year
     * @param {string} pageType - Type of related page
     * @param {Array} payrollRows - Reference payroll rows
     * @returns {Object} - Transformed row with foreign key reference
     */
    transformRelatedPageItem(item, year, pageType, payrollRows) {
        try {
            const rules = this.relatedFields[pageType];
            
            if (!rules) {
                console.warn(`No rules found for page type: ${pageType}`);
                return null;
            }

            // Find matching payroll row
            const matchingPayrollRow = this.findMatchingPayrollRow(item, payrollRows);
            
            if (!matchingPayrollRow) {
                console.warn(`No matching payroll row found for ${pageType} item:`, item);
                return null;
            }

            let rowId = item.unique_id || `${pageType}_${matchingPayrollRow.id}_${year}`;

            const transformedRow = {
                id: rowId,
                payroll_unique_id: matchingPayrollRow.unique_id, // Simple reference
                year: year,
                unique_id: item.unique_id,
                pageType: pageType
            };

            // Add specific fields based on page type rules
            rules.fields.forEach(field => {
                if (item[field] !== undefined) {
                    transformedRow[field] = item[field];
                }
            });

            return transformedRow;
        } catch (error) {
            console.error('Error transforming related page item:', error, item);
            return null;
        }
    }

    /**
     *! Transform frontend related data to API format
     * @param {Array} relatedRows - Frontend related rows
     * @param {Object} relatedData - Frontend related data
     * @param {string} projectName - Project name
     * @returns {Object} - Data formatted for API submission
     */
    transformRelatedFrontendToApi(relatedRows, relatedData, projectName) {
        try {
            if (!projectName) {
                throw new Error('Project name is required');
            }

            const apiChanges = [];
            
            relatedRows.forEach(row => {
                const apiItem = this.transformRelatedRowToApiFormat(row, relatedData);
                if (apiItem) {
                    apiChanges.push(apiItem);
                }
            });

            return {
                changes: apiChanges,
                project: projectName
            };
        } catch (error) {
            console.error('Error transforming related frontend to API:', error);
            throw new Error(`Failed to transform related frontend data: ${error.message}`);
        }
    }

    /**
     *! Transform individual related row from frontend to API format
     * @param {Object} row - Frontend related row
     * @param {Object} relatedData - Frontend related data
     * @returns {Object} - API format related item
     */
    transformRelatedRowToApiFormat(row, relatedData) {
        try {
            const apiItem = {
                payroll_unique_id: row.payroll_unique_id,
                pageType: row.pageType,
                year: row.year
            };

            // Add unique_id if exists
            if (row.unique_id) {
                apiItem.unique_id = row.unique_id;
            }

            // Add specific fields based on page type
            const rules = this.relatedFields[row.pageType];
            if (rules) {
                rules.fields.forEach(field => {
                    if (row[field] !== undefined) {
                        apiItem[field] = parseFloat(row[field]) || 0;
                    }
                });
            }

            return apiItem;
        } catch (error) {
            console.error('Error transforming related row to API format:', error, row);
            return null;
        }
    }



    /**
     *! Get required fields for specific page type
     * @param {string} pageType - Type of related page
     * @returns {Array} - Array of required fields
     */
    getRequiredFieldsForPageType(pageType) {
        const relatedFields = this.relatedFields[pageType]?.fields || [];
        return [...relatedFields];
    }

    /**
     *! Create default related page row with specific fields
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
            baseRow.payroll_unique_id = payrollReference.unique_id;
        }

        const rules = this.relatedFields[pageType];
        if (rules) {
            rules.fields.forEach(field => {
                baseRow[field] = 0;
            });
        }

        return baseRow;
    }

    /**
     *! Validate related data
     * @param {Object} data - Data to validate
     * @param {string} type - Validation type ('api' or 'frontend')
     * @returns {Object} - Validation result
     */
    validateRelatedData(data, type = 'frontend') {
        const errors = [];
        const warnings = [];

        try {
            if (type === 'frontend') {
                return this.validateRelatedFrontendData(data, errors, warnings);
            } else {
                return this.validateRelatedApiData(data, errors, warnings);
            }
        } catch (error) {
            errors.push(`Validation error: ${error.message}`);
            return { isValid: false, errors, warnings };
        }
    }

    /**
     *! Validate related frontend data
     * @param {Object} data - Related frontend data
     * @param {Array} errors - Error array
     * @param {Array} warnings - Warning array
     * @returns {Object} - Validation result
     */
    validateRelatedFrontendData(data, errors, warnings) {
        if (!data.relatedRows || !Array.isArray(data.relatedRows)) {
            errors.push('Related rows must be an array');
            return { isValid: false, errors, warnings };
        }

        data.relatedRows.forEach((row, index) => {
            if (!row.payroll_unique_id) {
                errors.push(`Row ${index + 1}: payroll_unique_id is required`);
            }

            if (!row.pageType) {
                errors.push(`Row ${index + 1}: pageType is required`);
            }

            // Validate numeric fields
            const rules = this.relatedFields[row.pageType];
            if (rules) {
                rules.fields.forEach(field => {
                    const value = parseFloat(row[field]);
                    if (isNaN(value) || value < 0) {
                        errors.push(`Row ${index + 1}: ${field} must be a positive number`);
                    }
                });
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     *! Validate related API data
     * @param {Object} data - Related API data
     * @param {Array} errors - Error array
     * @param {Array} warnings - Warning array
     * @returns {Object} - Validation result
     */
    validateRelatedApiData(data, errors, warnings) {
        if (!data.message) {
            errors.push('API response must contain message property');
            return { isValid: false, errors, warnings };
        }

        Object.keys(data.message).forEach(year => {
            if (!Array.isArray(data.message[year])) {
                errors.push(`Year ${year}: Data must be an array`);
                return;
            }

            data.message[year].forEach((item, index) => {
                if (!item.payroll_unique_id) {
                    errors.push(`Year ${year}, Row ${index + 1}: Missing payroll_unique_id`);
                }

                if (!item.pageType) {
                    errors.push(`Year ${year}, Row ${index + 1}: Missing pageType`);
                }

                const rules = this.relatedFields[item.pageType];
                if (rules) {
                    rules.fields.forEach(field => {
                        if (isNaN(parseFloat(item[field]))) {
                            errors.push(`Year ${year}, Row ${index + 1}: Invalid numeric value for ${field}`);
                        }
                    });
                }
            });
        });

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}

// Export singleton instance
export const payrollRelatedDataConstructor = new PayrollRelatedDataConstructor();

// Export utility functions for backward compatibility
export const transformRelatedFrontendToApi = (relatedRows, relatedData, projectName) => 
  payrollRelatedDataConstructor.transformRelatedFrontendToApi(relatedRows, relatedData, projectName);

export const validateRelatedData = (data, type) => 
  payrollRelatedDataConstructor.validateRelatedData(data, type);

export const createDefaultRelatedRow = (pageType, payrollReference) => 
  payrollRelatedDataConstructor.createDefaultRelatedRow(pageType, payrollReference);


