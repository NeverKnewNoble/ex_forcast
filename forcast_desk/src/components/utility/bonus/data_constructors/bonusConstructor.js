// Bonus Data Constructor - Handles bonus data transformation between API and frontend

import { PayrollDataConstructor } from '@/components/utility/payroll/data_constructors/payrollDataConstructor.js';

/**
 *! Bonus Data Constructor Class
 *? Handles transformation between API responses and frontend format for bonus data
 */
export class BonusDataConstructor extends PayrollDataConstructor {
    constructor() {
        super();

        // Bonus field definitions - only bonus_percentage
        this.bonusFields = {
            bonus: {
                payroll_unique_id: null, // Links to payroll row
                fields: ['bonus_percentage']
            }
        };

        // Validation rules for bonus data
        this.bonusValidationRules = {
            required: ['payroll_unique_id'],
            numeric: ['bonus_percentage'],
            minValues: {
                bonus_percentage: 0
            },
            maxValues: {
                bonus_percentage: 100 // Maximum 100% bonus
            }
        };
    }

    /**
     *! Transform bonus API response to frontend format
     * @param {Object} apiResponse - Raw API response
     * @param {string} projectName - Project name
     * @param {number} fromYear - Optional year filter start
     * @param {number} toYear - Optional year filter end
     * @returns {Object} - Transformed bonus data
     */
    transformBonusApiToFrontend(apiResponse, projectName, fromYear = null, toYear = null) {
        try {
            if (!apiResponse || !apiResponse.message) {
                throw new Error('Invalid bonus API response structure');
            }

            const transformedData = {};
            
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
                
                // Initialize year data structure
                if (!transformedData[year]) {
                    transformedData[year] = {};
                }
                
                // Handle the correct API response structure
                // apiResponse.message[year] = { "bonus": { "row_id": { "bonus_percentage": value } } }
                const yearData = apiResponse.message[year];
               //  // console.log('Processing year data:', year, yearData);
                if (yearData && yearData.bonus) {
                    Object.keys(yearData.bonus).forEach(rowId => {
                        const bonusItem = yearData.bonus[rowId];
                       //  // console.log('Processing bonus item:', rowId, bonusItem);
                        transformedData[year][rowId] = {
                            bonusPercentage: bonusItem.bonus_percentage || 0,
                            payroll_unique_id: rowId
                        };
                    });
                }
            });
            
            return {
                bonusData: transformedData,
                projectName,
                totalBonusEntries: Object.keys(transformedData).reduce((total, year) => 
                    total + Object.keys(transformedData[year]).length, 0)
            };
        } catch (error) {
            console.error('Error transforming bonus API to frontend:', error);
            throw new Error(`Failed to transform bonus API data: ${error.message}`);
        }
    }

    /**
     *! Transform bonus frontend data to API format
     * @param {Array} changes - Array of changes from getBonusChangesForAPI
     * @param {string} projectName - Project name
     * @returns {Object} - Data formatted for API submission
     */
    transformBonusFrontendToApi(changes, projectName) {
        try {
            if (!projectName) {
                throw new Error('Project name is required');
            }

            // Changes are already in the correct format from getBonusChangesForAPI
            // Each change has: { year, bonus: { rowId: { bonus_percentage } } }
            const apiChanges = changes.map(change => ({
                year: change.year,
                bonus: Object.keys(change.bonus).reduce((acc, rowId) => {
                    acc[rowId] = {
                        bonus_percentage: parseFloat(change.bonus[rowId].bonus_percentage) || 0
                    };
                    return acc;
                }, {})
            }));

            return {
                changes: apiChanges,
                project: projectName
            };
        } catch (error) {
            console.error('Error transforming bonus frontend to API:', error);
            throw new Error(`Failed to transform bonus frontend data: ${error.message}`);
        }
    }

    /**
     *! Transform individual bonus item from API to frontend format
     * @param {Object} item - API bonus item
     * @param {string} year - Year
     * @returns {Object} - Transformed bonus row
     */
    transformBonusItem(item, year) {
        try {
            if (!item.payroll_unique_id) {
                console.warn('Bonus item missing payroll_unique_id:', item);
                return null;
            }

            const rowId = item.unique_id || `bonus_${item.payroll_unique_id}_${year}`;

            return {
                id: rowId,
                payroll_unique_id: item.payroll_unique_id,
                year: year,
                unique_id: item.unique_id,
                bonusPercentage: item.bonus_percentage || 0
            };
        } catch (error) {
            console.error('Error transforming bonus item:', error, item);
            return null;
        }
    }

    /**
     *! Transform bonus row from frontend to API format
     * @param {Object} bonusItem - Frontend bonus item
     * @param {string} year - Year
     * @param {string} rowId - Row ID
     * @returns {Object} - API format bonus item
     */
    transformBonusRowToApiFormat(bonusItem, year, rowId) {
        try {
            const apiItem = {
                payroll_unique_id: bonusItem.payroll_unique_id,
                year: year,
                bonus_percentage: parseFloat(bonusItem.bonusPercentage) || 0
            };

            // Add unique_id if exists
            if (bonusItem.unique_id) {
                apiItem.unique_id = bonusItem.unique_id;
            }

            return apiItem;
        } catch (error) {
            console.error('Error transforming bonus row to API format:', error, bonusItem);
            return null;
        }
    }

    /**
     *! Validate bonus data
     * @param {Object} data - Data to validate
     * @param {string} type - Validation type ('api' or 'frontend')
     * @returns {Object} - Validation result
     */
    validateBonusData(data, type = 'frontend') {
        const errors = [];
        const warnings = [];

        try {
            if (type === 'frontend') {
                return this.validateBonusFrontendData(data, errors, warnings);
            } else {
                return this.validateBonusApiData(data, errors, warnings);
            }
        } catch (error) {
            errors.push(`Bonus validation error: ${error.message}`);
            return { isValid: false, errors, warnings };
        }
    }

    /**
     *! Validate bonus frontend data
     * @param {Object} data - Bonus frontend data
     * @param {Array} errors - Error array
     * @param {Array} warnings - Warning array
     * @returns {Object} - Validation result
     */
    validateBonusFrontendData(data, errors, warnings) {
        if (!data || typeof data !== 'object') {
            errors.push('Bonus data must be an object');
            return { isValid: false, errors, warnings };
        }

        Object.keys(data).forEach(year => {
            if (!data[year] || typeof data[year] !== 'object') {
                errors.push(`Year ${year}: Bonus data must be an object`);
                return;
            }

            Object.keys(data[year]).forEach(rowId => {
                const bonusItem = data[year][rowId];
                
                if (!bonusItem.payroll_unique_id) {
                    errors.push(`Row ${rowId}: payroll_unique_id is required`);
                }

                // Validate bonus percentage
                const percentage = parseFloat(bonusItem.bonusPercentage);
                if (isNaN(percentage) || percentage < 0) {
                    errors.push(`Row ${rowId}: bonus_percentage must be a positive number`);
                }
                if (percentage > 100) {
                    errors.push(`Row ${rowId}: bonus_percentage cannot exceed 100%`);
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
     *! Validate bonus API data
     * @param {Object} data - Bonus API data
     * @param {Array} errors - Error array
     * @param {Array} warnings - Warning array
     * @returns {Object} - Validation result
     */
    validateBonusApiData(data, errors, warnings) {
        if (!data.message) {
            errors.push('Bonus API response must contain message property');
            return { isValid: false, errors, warnings };
        }

        Object.keys(data.message).forEach(year => {
            const yearData = data.message[year];
            if (!yearData || !yearData.bonus || typeof yearData.bonus !== 'object') {
                errors.push(`Year ${year}: Bonus data must be an object with 'bonus' property`);
                return;
            }

            Object.keys(yearData.bonus).forEach(rowId => {
                const bonusItem = yearData.bonus[rowId];
                
                if (!bonusItem || typeof bonusItem !== 'object') {
                    errors.push(`Year ${year}, Row ${rowId}: Invalid bonus item structure`);
                    return;
                }

                if (isNaN(parseFloat(bonusItem.bonus_percentage))) {
                    errors.push(`Year ${year}, Row ${rowId}: Invalid bonus_percentage value`);
                }

                if (parseFloat(bonusItem.bonus_percentage) > 100) {
                    errors.push(`Year ${year}, Row ${rowId}: bonus_percentage cannot exceed 100%`);
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
     *! Create default bonus row
     * @param {Object} payrollReference - Reference payroll row
     * @returns {Object} - Default bonus row
     */
    createDefaultBonusRow(payrollReference = null) {
        const baseRow = {
            id: this.generateRowId(),
            year: new Date().getFullYear().toString(),
            bonusPercentage: 0
        };

        if (payrollReference) {
            baseRow.payroll_unique_id = payrollReference.unique_id;
        }

        return baseRow;
    }

    /**
     *! Get bonus field definitions
     * @returns {Object} - Bonus field definitions
     */
    getBonusFieldDefinitions() {
        return this.bonusFields;
    }

    /**
     *! Get bonus validation rules
     * @returns {Object} - Bonus validation rules
     */
    getBonusValidationRules() {
        return this.bonusValidationRules;
    }
}

// Export singleton instance
export const bonusDataConstructor = new BonusDataConstructor();

// Export utility functions for backward compatibility
export const transformBonusApiToFrontend = (apiResponse, projectName, fromYear, toYear) => 
    bonusDataConstructor.transformBonusApiToFrontend(apiResponse, projectName, fromYear, toYear);

export const transformBonusFrontendToApi = (bonusData, projectName) => 
    bonusDataConstructor.transformBonusFrontendToApi(bonusData, projectName);

export const validateBonusData = (data, type) => 
    bonusDataConstructor.validateBonusData(data, type);

export const createDefaultBonusRow = (payrollReference) => 
    bonusDataConstructor.createDefaultBonusRow(payrollReference);

