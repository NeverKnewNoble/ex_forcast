// Bonus Data Service - Handles API communication for bonus data

import { ref } from 'vue';
import { makeApiRequest } from '@/components/utility/dashboard/apiUtils.js';
import { bonusDataConstructor } from './data_constructors/bonusConstructor.js';

// Reactive state for bonus data
export const bonusData = ref({});
export const bonusChanges = ref([]);
export const isSavingBonus = ref(false);
export const bonusSaveError = ref("");

/**
 *! Fetch bonus data from API
 * @param {string} projectName - Project name
 * @param {number} fromYear - Optional year filter start
 * @param {number} toYear - Optional year filter end
 * @returns {Promise<Object>} - Bonus data
 */
export async function fetchBonusData(projectName, fromYear = null, toYear = null) {
    try {
       //  // console.log('Fetching bonus data for project:', projectName, 'years:', fromYear, 'to', toYear);
        
        const params = new URLSearchParams();
        if (projectName) {
            params.append('project', projectName);
        }
        if (fromYear) {
            params.append('fromYear', fromYear.toString());
        }
        if (toYear) {
            params.append('toYear', toYear.toString());
        }

        const url = `/api/v2/method/ex_forcast.api.call_and_save_bonus_data.bonus_data_display?${params.toString()}`;
       //  // console.log('API URL:', url);
        const response = await makeApiRequest(url);

        if (response.error) {
            throw new Error(response.error);
        }

        // Transform API response to frontend format using bonus constructor
        // Handle Frappe's response wrapper
        const apiResponse = response.data || response;
       //  // console.log('Raw API response:', response);
       //  // console.log('Extracted API response:', apiResponse);
        
        const transformedData = bonusDataConstructor.transformBonusApiToFrontend(
            { message: apiResponse },
            projectName,
            fromYear,
            toYear
        );

       //  // console.log('Bonus API response:', response);
       //  // console.log('Transformed bonus data:', transformedData);

        // Update reactive state
        bonusData.value = transformedData.bonusData || {};
        
        return transformedData;
    } catch (error) {
        console.error('Error fetching bonus data:', error);
        throw new Error(`Failed to fetch bonus data: ${error.message}`);
    }
}

/**
 *! Save bonus changes to API
 * @param {Array} changes - Bonus changes to save
 * @param {string} projectName - Project name
 * @returns {Promise<Object>} - Save result
 */
export async function saveBonusChanges(changes, projectName) {
    try {
        isSavingBonus.value = true;
        bonusSaveError.value = "";

        // Transform frontend data to API format using bonus constructor
        const apiData = bonusDataConstructor.transformBonusFrontendToApi(
            changes,
            projectName
        );

        const url = '/api/v2/method/ex_forcast.api.call_and_save_bonus_data.upsert_bonus_data';
        const response = await makeApiRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                changes: apiData.changes,
                project: projectName
            })
        });

        if (response.success === false) {
            throw new Error(response.error || 'Failed to save bonus data');
        }

        // Clear changes after successful save
        bonusChanges.value = [];
        
        return response;
    } catch (error) {
        console.error('Error saving bonus changes:', error);
        bonusSaveError.value = error.message;
        throw error;
    } finally {
        isSavingBonus.value = false;
    }
}

/**
 *! Add a bonus change to the tracking array
 * @param {string} rowId - Row ID
 * @param {string} fieldType - Field type (bonus_percentage)
 * @param {string} year - Year
 * @param {number} newValue - New value
 */
export function addBonusChange(rowId, fieldType, year, newValue) {
    // Remove existing change for the same row and field
    bonusChanges.value = bonusChanges.value.filter(change => 
        !(change.rowId === rowId && change.fieldType === fieldType && change.year === year)
    );

    // Add new change
    bonusChanges.value.push({
        rowId,
        fieldType,
        year,
        newValue,
        timestamp: Date.now()
    });
}

/**
 *! Get bonus value for a specific row and year
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @returns {number} - Bonus percentage value
 */
export function getBonusValue(rowId, year) {
    if (!bonusData.value[year] || !bonusData.value[year][rowId]) {
        return 0;
    }
    return bonusData.value[year][rowId].bonusPercentage || 0;
}

/**
 *! Set bonus value for a specific row and year
 * @param {string} rowId - Row ID
 * @param {string} year - Year
 * @param {number} value - Bonus percentage value
 */
export function setBonusValue(rowId, year, value) {
    if (!bonusData.value[year]) {
        bonusData.value[year] = {};
    }
    if (!bonusData.value[year][rowId]) {
        bonusData.value[year][rowId] = {};
    }
    bonusData.value[year][rowId].bonusPercentage = value;
}

/**
 *! Check if there are unsaved bonus changes
 * @returns {boolean} - True if there are unsaved changes
 */
export function hasBonusChanges() {
    return bonusChanges.value.length > 0;
}

/**
 *! Clear all bonus changes
 */
export function clearBonusChanges() {
    bonusChanges.value = [];
}

/**
 *! Get bonus changes formatted for API
 * @returns {Array} - Changes formatted for API submission
 */
export function getBonusChangesForAPI() {
    const changesByYear = {};
    
    bonusChanges.value.forEach(change => {
        if (!changesByYear[change.year]) {
            changesByYear[change.year] = {};
        }
        if (!changesByYear[change.year][change.rowId]) {
            changesByYear[change.year][change.rowId] = {};
        }
        // Map fieldType to the correct field name for API
        if (change.fieldType === 'bonus_percentage') {
            changesByYear[change.year][change.rowId].bonus_percentage = change.newValue;
        }
    });

    return Object.keys(changesByYear).map(year => ({
        year,
        bonus: changesByYear[year]
    }));
}

/**
 *! Validate bonus data
 * @param {Object} data - Data to validate
 * @param {string} type - Validation type ('api' or 'frontend')
 * @returns {Object} - Validation result
 */
export function validateBonusData(data, type = 'frontend') {
    return bonusDataConstructor.validateBonusData(data, type);
} 