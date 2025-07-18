// Data service functions for Banquet Revenue operations
import { cloneDeep } from 'lodash-es';

// Base API URL
const API_BASE = '/api/method/ex_forcast.api.call_and_save_banquet_revenue';

/**
 * Fetch Banquet revenue data from the server
 * @returns {Promise<Object>} Banquet revenue data organized by year and month
 */
export async function loadBanquetRevenueData() {
  try {
    const response = await fetch(`${API_BASE}.banquet_revenue_display`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    // Handle case where data might be wrapped in message object
    const serverData = data.message || data;
    return serverData;
  } catch (error) {
    console.error('Error loading Banquet revenue data:', error);
    throw error;
  }
}

/**
 * Save Banquet revenue changes to the server
 * @param {Array} changes - Array of change objects
 * @returns {Promise<Object>} Save result
 */
export async function saveBanquetRevenueChanges(changes) {
  try {
    const formData = new FormData();
    formData.append('changes', JSON.stringify(changes));
    const response = await fetch(`${API_BASE}.upsert_banquet_revenue_items`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }
    const result = await response.json();
    if (result.message?.status === 'error') {
      throw new Error(result.message.message);
    }
    return result;
  } catch (error) {
    console.error('Error saving Banquet revenue changes:', error);
    throw error;
  }
}

/**
 * Convert server data (banquet_detail) to frontend format (expense)
 * @param {Object} serverData
 * @returns {Object}
 */
export function convertBanquetServerDataToFrontend(serverData) {
  const result = {};
  for (const year in serverData) {
    result[year] = {};
    for (const month in serverData[year]) {
      result[year][month] = (serverData[year][month] || []).map(item => ({
        ...item,
        expense: item.banquet_detail // map banquet_detail to expense
      }));
    }
  }
  return result;
}

/**
 * Test the Banquet API connection
 * @returns {Promise<Object>} Test result
 */
export async function testBanquetApi() {
  try {
    console.log('Testing Banquet API connection...');
    const response = await fetch(`${API_BASE}.test_banquet_api`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Test API response:', data);
    return data;
  } catch (error) {
    console.error('Error testing Banquet API:', error);
    throw error;
  }
}

/**
 * Load and convert Banquet revenue data for frontend use
 * @returns {Promise<Object>} Frontend format data
 */
export async function loadBanquetRevenueDataForFrontend() {
  try {
    const serverData = await loadBanquetRevenueData();
    
    if (!serverData || Object.keys(serverData).length === 0) {
      console.log('No Banquet revenue data found, returning empty object');
      return {};
    }
    
    const frontendData = convertBanquetServerDataToFrontend(serverData);
    return frontendData;
  } catch (error) {
    console.error('Error loading Banquet revenue data for frontend:', error);
    // Return empty object instead of throwing error
    return {};
  }
} 