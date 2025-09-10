// Custom API call to fetch accounts from our Frappe backend
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js'

export async function getExpenseList() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.account_list.get_accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    // console.log("API response:", result);

    // Handle the nested data structure
    const data = result.data || result;
    
    if (data.success && Array.isArray(data.results)) {
      // Return just the account names for the dropdown
      return data.results.map(account => account.name);
    } else {
      console.error("API returned error:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return [];
  }
}