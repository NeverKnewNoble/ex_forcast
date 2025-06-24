// Data service for handling API calls and data loading
export async function loadYearOptions() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v2/method/ex_forcast.api.year.get_year_options");
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
    const response = await fetch("http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_estimate.estimate_display");
    const data = await response.json();
    return data.data;
  } catch (error) {
    // console.error("Error loading expense data:", error);
    return {};
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