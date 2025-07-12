// Data service functions for F&B Revenue operations
import { cloneDeep } from 'lodash-es';

// Base API URL
const API_BASE = '/api/method/ex_forcast.api.call_and_save_fnb_revenue';

/**
 * Fetch F&B revenue data from the server
 * @returns {Promise<Object>} F&B revenue data organized by year and month
 */
export async function loadFnbRevenueData() {
  try {
    // console.log('Loading F&B revenue data from server...');
    const response = await fetch(`${API_BASE}.fnb_revenue_display`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log('Raw server response:', data);
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Handle case where data might be wrapped in message object
    const serverData = data.message || data;
    // console.log('Processed server data:', serverData);
    return serverData;
  } catch (error) {
    console.error('Error loading F&B revenue data:', error);
    throw error;
  }
}

/**
 * Save F&B revenue changes to the server
 * @param {Array} changes - Array of change objects
 * @returns {Promise<Object>} Save result
 */
export async function saveFnbRevenueChanges(changes) {
  try {
    console.log('Sending F&B revenue changes to server:', changes);
    
    // Create form data
    const formData = new FormData();
    formData.append('changes', JSON.stringify(changes));
    
    const response = await fetch(`${API_BASE}.upsert_fnb_revenue_items`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Server response:', result);
    
    if (result.message?.status === 'error') {
      throw new Error(result.message.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error saving F&B revenue changes:', error);
    throw error;
  }
}

/**
 * Get list of restaurants from the server
 * @returns {Promise<Array>} Array of restaurant objects
 */
export async function getRestaurantsList() {
  try {
    const response = await fetch(`${API_BASE}.get_restaurants_list`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    return data.restaurants || [];
  } catch (error) {
    console.error('Error loading restaurants list:', error);
    throw error;
  }
}

/**
 * Test the F&B API connection
 * @returns {Promise<Object>} Test result
 */
export async function testFnbApi() {
  try {
    console.log('Testing F&B API connection...');
    const response = await fetch(`${API_BASE}.test_fnb_api`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Test API response:', data);
    return data;
  } catch (error) {
    console.error('Error testing F&B API:', error);
    throw error;
  }
}

/**
 * Convert F&B revenue data from server format to frontend format
 * @param {Object} serverData - Data from server (year -> month -> array of items)
 * @returns {Object} Frontend format data (rowKey -> year -> label -> value)
 */
export function convertServerDataToFrontendFormat(serverData) {
//   console.log('Converting server data to frontend format:', serverData);
  const frontendData = {};
  
  if (!serverData || typeof serverData !== 'object') {
    console.warn('Server data is not a valid object:', serverData);
    return frontendData;
  }
  
  for (const year in serverData) {
    if (!serverData[year] || typeof serverData[year] !== 'object') {
      console.warn(`Year ${year} data is not a valid object:`, serverData[year]);
      continue;
    }
    
    for (const month in serverData[year]) {
      const items = serverData[year][month];
    //   console.log(`Processing year ${year}, month ${month}:`, items);
      
      if (!Array.isArray(items)) {
        console.warn(`Items for year ${year}, month ${month} is not an array:`, items);
        continue;
      }
      
      for (const item of items) {
        if (!item || typeof item !== 'object') {
          console.warn('Invalid item:', item);
          continue;
        }
        
        // Create row key in the format expected by frontend (without label)
        const rowKey = JSON.stringify({
          restaurant: item.restaurant,
          section: item.cover_category,
          type: item.cover_detail
        });
        
        // Initialize nested structure if needed
        if (!frontendData[rowKey]) {
          frontendData[rowKey] = {};
        }
        if (!frontendData[rowKey][year]) {
          frontendData[rowKey][year] = {};
        }
        
        // Set the value using month as the label
        frontendData[rowKey][year][month] = item.amount;
      }
    }
  }
  
//   console.log('Converted frontend data:', frontendData);
  return frontendData;
}

/**
 * Migrate old data format to new format (for backward compatibility)
 * @param {Object} frontendData - Data that might be in old format
 * @returns {Object} Data in new format
 */
export function migrateOldDataFormat(frontendData) {
  const migratedData = {};
  
  for (const rowKey in frontendData) {
    try {
      const rowKeyObj = JSON.parse(rowKey);
      
      // Check if this is old format (has label in the key)
      if (rowKeyObj.label) {
        // This is old format, migrate to new format
        const newRowKey = JSON.stringify({
          restaurant: rowKeyObj.restaurant,
          section: rowKeyObj.section,
          type: rowKeyObj.type
        });
        
        // Move data to new structure
        if (!migratedData[newRowKey]) {
          migratedData[newRowKey] = {};
        }
        
        for (const year in frontendData[rowKey]) {
          if (!migratedData[newRowKey][year]) {
            migratedData[newRowKey][year] = {};
          }
          
          for (const label in frontendData[rowKey][year]) {
            migratedData[newRowKey][year][label] = frontendData[rowKey][year][label];
          }
        }
      } else {
        // This is already new format, keep as is
        migratedData[rowKey] = frontendData[rowKey];
      }
    } catch (error) {
      // If parsing fails, keep the original key (might be legacy string format)
      migratedData[rowKey] = frontendData[rowKey];
    }
  }
  
  return migratedData;
}

/**
 * Convert frontend format data to server format for saving
 * @param {Object} frontendData - Frontend format data
 * @returns {Array} Array of change objects for server
 */
export function convertFrontendDataToServerFormat(frontendData) {
  const changes = [];
  
  for (const rowKey in frontendData) {
    try {
      const rowKeyObj = JSON.parse(rowKey);
      
      for (const year in frontendData[rowKey]) {
        for (const month in frontendData[rowKey][year]) {
          const amount = frontendData[rowKey][year][month];
          
          changes.push({
            year: year,
            month: month,
            restaurant: rowKeyObj.restaurant,
            cover_category: rowKeyObj.section,
            cover_detail: rowKeyObj.type,
            amount: amount
          });
        }
      }
    } catch (error) {
      console.warn('Failed to parse row key:', rowKey);
      continue;
    }
  }
  
  return changes;
}

/**
 * Load and convert F&B revenue data for frontend use
 * @returns {Promise<Object>} Frontend format data
 */
export async function loadFnbRevenueDataForFrontend() {
  try {
    // console.log('Loading F&B revenue data for frontend...');
    const serverData = await loadFnbRevenueData();
    
    if (!serverData || Object.keys(serverData).length === 0) {
      console.log('No F&B revenue data found, returning empty object');
      return {};
    }
    
    // console.log('Raw server data:', serverData);
    const frontendData = convertServerDataToFrontendFormat(serverData);
    // console.log('Converted frontend data:', frontendData);
    
    // Migrate any old format data to new format
    const migratedData = migrateOldDataFormat(frontendData);
    // console.log('Migrated data:', migratedData);
    
    return migratedData;
  } catch (error) {
    console.error('Error loading F&B revenue data for frontend:', error);
    // Return empty object instead of throwing error
    return {};
  }
}

/**
 * Save F&B revenue data from frontend format
 * @param {Object} frontendData - Frontend format data
 * @returns {Promise<Object>} Save result
 */
export async function saveFnbRevenueDataFromFrontend(frontendData) {
  try {
    const changes = convertFrontendDataToServerFormat(frontendData);
    return await saveFnbRevenueChanges(changes);
  } catch (error) {
    console.error('Error saving F&B revenue data from frontend:', error);
    throw error;
  }
} 