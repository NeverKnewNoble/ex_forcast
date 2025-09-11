// Service to fetch expense field options from the API
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js'

export async function getExpenseFieldOptions() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.expense_options.get_expense_field_options', {
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
   //  // console.log("Expense options API response:", result);

    // Handle the nested data structure
    const data = result.data || result;
    
    if (data.success) {
      return {
        hospitality_category: data.data.hospitality_category || [],
        cost_type: data.data.cost_type || []
      };
    } else {
      console.error("API returned error:", data.error);
      return {
        hospitality_category: [],
        cost_type: []
      };
    }
  } catch (error) {
    console.error("Failed to fetch expense field options:", error);
    return {
      hospitality_category: [],
      cost_type: []
    };
  }
} 