import { selectedProject } from '@/components/utility/dashboard/projectService.js'

// Data service for handling API calls and data loading
export async function loadYearOptions() {
  try {
    const response = await fetch("/api/v2/method/ex_forcast.api.year.get_year_options");
    const data = await response.json();
    // console.log('Raw API response:', data);
    const filteredOptions = data.data.options.filter(option => option);
    // console.log('Filtered year options:', filteredOptions);
    return filteredOptions;
  } catch (error) {
    console.error("Error loading year options:", error);
    return [];
  }
}

export async function loadExpenseData() {
  try {
    // Get the currently selected project
    const currentProject = selectedProject.value
    
    if (!currentProject) {
      // Return special status to indicate no project selected
      return { 
        status: 'no_project_selected',
        message: 'No project selected'
      };
    }

    // Load expense data filtered by project
    const response = await fetch(`/api/v2/method/ex_forcast.api.expense_estimate.estimate_display?project=${encodeURIComponent(currentProject.project_name)}`);
    const data = await response.json();
    
    // Check if the project has any data
    const expenseData = data.data || {};
    const hasData = Object.keys(expenseData).length > 0;
    
    if (!hasData) {
      return {
        status: 'no_data',
        message: `No expense data found for project: ${currentProject.project_name}`,
        project: currentProject.project_name
      };
    }
    
    return expenseData;
  } catch (error) {
    console.error("Error loading expense data:", error);
    return { 
      status: 'error',
      message: 'Failed to load expense data'
    };
  }
}

export function extractAllExpenses(expenseData) {
  const all = new Set();
  for (const year in expenseData) {
    for (const month in expenseData[year]) {
      expenseData[year][month].forEach(e => all.add(e.expense));
    }
  }
  return [...all].sort();
} 