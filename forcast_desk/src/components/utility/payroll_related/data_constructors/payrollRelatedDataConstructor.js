// Payroll Related Data Constructor - Handles data transformation between API and frontend

import { PayrollDataConstructor } from '../payroll/data_constructors/payrollDataConstructor.js';

/**
 *! Payroll Related Data Constructor Class
 *? Handles transformation between API responses and frontend format
 */
export class PayrollRelatedDataConstructor extends PayrollDataConstructor {
    constructor() {
        super();
        
        this.relatedFields = {
            payroll_taxes: {
                payroll_unique_id: null, // Links to payroll row
                fields: [
                    'tax_percentage', 
                    'total_tax_amount'
                ]
            },
            supplementary_pay: {
                payroll_unique_id: null, // Links to payroll row
                fields: [
                    'vacation', 
                    'relocation', 
                    'severence_indemnity', 
                    'other'
                ]
            },
            employee_benefits: {
                payroll_unique_id: null, // Links to payroll row
                fields: [
                    'health_insurance', 
                    'dental_insurance', 
                    'vision_insurance', 
                    'life_insurance', 
                    'other'
                ]
            }
        };
    }

    /**
     *! Transform related page item with specific rules
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
     *! Find matching payroll row based on unique_id or other linking fields
     * @param {Object} item - Related page item
     * @param {Array} payrollRows - Reference payroll rows
     * @returns {Object|null} - Matching payroll row or null
     */
    findMatchingPayrollRow(item, payrollRows) {
        // First try to match by unique_id if the item has a payroll_id reference
        if (item.payroll_id) {
            const match = payrollRows.find(row => row.unique_id === item.payroll_id);
            if (match) return match;
        }

        // Try to match by department, location, position, designation
        return payrollRows.find(payrollRow => {
            return (
                payrollRow.department === (item.department || item.department_location) &&
                payrollRow.departmentLocation === (item.departmentLocation || item.department_location) &&
                payrollRow.position === item.position &&
                payrollRow.designation === item.designation
            );
        });
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
}

// Export singleton instance
export const payrollRelatedDataConstructor = new PayrollRelatedDataConstructor();


