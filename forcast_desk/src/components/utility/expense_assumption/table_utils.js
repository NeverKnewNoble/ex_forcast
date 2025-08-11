import { ref } from 'vue'
import { quarterToMonths } from './expense_formular.js'

// Table collapse state management
export const collapsedYears = ref(new Set())

export function toggleCollapse(year) {
  collapsedYears.value.has(year)
    ? collapsedYears.value.delete(year)
    : collapsedYears.value.add(year)
}

export function isYearCollapsed(year) {
  return collapsedYears.value.has(year)
}

// Filtered expenses computation
export function getFilteredExpenses(expenseData, visibleYears) {
  const filtered = new Set()
  visibleYears.forEach(year => {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      yearData[month].forEach(entry => filtered.add(entry.expense))
    }
  })
  return [...filtered].sort()
}

// New function to group all expenses by category (regardless of year data)
export function getAllExpensesGroupedByCategory(allExpensesData) {
  const categoryMap = new Map()
  
  // Group expenses by their hospitality_category
  allExpensesData.forEach(expense => {
    const category = expense.hospitality_category || 'Other'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category).push(expense)
  })
  
  // Convert to array format with category and expenses
  const groupedExpenses = []
  const otherExpenses = []
  
  for (const [category, expenses] of categoryMap) {
    const expenseList = expenses.map(exp => exp.expense_name).sort()
    
    if (category === 'Other') {
      otherExpenses.push({
        category: 'Other',
        expenses: expenseList
      })
    } else {
      groupedExpenses.push({
        category,
        expenses: expenseList
      })
    }
  }
  
  // Sort categories alphabetically (excluding "Other")
  groupedExpenses.sort((a, b) => a.category.localeCompare(b.category))
  
  // Add "Other" category at the bottom if it exists
  if (otherExpenses.length > 0) {
    groupedExpenses.push(...otherExpenses)
  }
  
  return groupedExpenses
}

// New functions for redesigned table with categories
export function getExpensesGroupedByCategory(expenseData, visibleYears) {
  const categoryMap = new Map()
  
  visibleYears.forEach(year => {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      yearData[month].forEach(entry => {
        const category = entry.hospitality_category || 'Other'
        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Set())
        }
        categoryMap.get(category).add(entry.expense)
      })
    }
  })
  
  // Convert to array format with category and expenses
  const groupedExpenses = []
  const otherExpenses = []
  
  for (const [category, expenses] of categoryMap) {
    if (category === 'Other') {
      otherExpenses.push({
        category: 'Other',
        expenses: [...expenses].sort()
      })
    } else {
      groupedExpenses.push({
        category,
        expenses: [...expenses].sort()
      })
    }
  }
  
  // Sort categories alphabetically (excluding "Other")
  groupedExpenses.sort((a, b) => a.category.localeCompare(b.category))
  
  // Add "Other" category at the bottom if it exists
  if (otherExpenses.length > 0) {
    groupedExpenses.push(...otherExpenses)
  }
  
  return groupedExpenses
}

// Get expense details (code, cost type, hospitality category) for a specific expense
export function getExpenseDetails(expenseData, expense, visibleYears) {
  for (const year of visibleYears) {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      const entry = yearData[month].find(e => e.expense === expense)
      if (entry) {
        return {
          code: entry.code || '',
          costType: entry['cost_type'] || '',
          hospitalityCategory: entry['hospitality_category'] || ''
        }
      }
    }
  }
  return { code: '', costType: '', hospitalityCategory: '' }
}

// New function to get expense details from all expenses data
export function getExpenseDetailsFromAllExpenses(allExpensesData, expense) {
  const expenseEntry = allExpensesData.find(e => e.expense_name === expense)
  if (expenseEntry) {
    return {
      code: expenseEntry.code || '',
      costType: expenseEntry.cost_type || '',
      hospitalityCategory: expenseEntry.hospitality_category || ''
    }
  }
  return { code: '', costType: '', hospitalityCategory: '' }
}

// Extract unique cost_type and hospitality_category values from expense data
export function extractFieldOptionsFromData(expenseData) {
  const hospitalityCategories = new Set()
  const costTypes = new Set()
  
  for (const year in expenseData) {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      yearData[month].forEach(entry => {
        if (entry.hospitality_category) {
          hospitalityCategories.add(entry.hospitality_category)
        }
        if (entry.cost_type) {
          costTypes.add(entry.cost_type)
        }
      })
    }
  }
  
  return {
    hospitality_category: [...hospitalityCategories].sort(),
    cost_type: [...costTypes].sort()
  }
}

// Get amount for a specific expense, year, and month/quarter
export function getAmountForExpense(expenseData, expense, year, label, displayMode = "monthly") {
  if (displayMode === "quarterly" && quarterToMonths[label]) {
    // First, check if the quarterly label itself exists in the data (e.g., "Jan-Mar")
    const quarterlyEntries = expenseData?.[year]?.[label] || [];
    const quarterlyFound = quarterlyEntries.find(e => e.expense === expense);
    if (quarterlyFound) {
      return parseFloat(quarterlyFound.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    // If quarterly label doesn't exist, try to sum the three months in the quarter
    let total = 0;
    for (const month of quarterToMonths[label]) {
      const entries = expenseData?.[year]?.[month] || [];
      const found = entries.find(e => e.expense === expense);
      if (found) total += parseFloat(found.amount) || 0;
    }
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // Monthly mode (or fallback)
    const entries = expenseData?.[year]?.[label] || [];
    const found = entries.find(e => e.expense === expense);
    return found ? parseFloat(found.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  }
}

// Calculate total for a specific expense and year
export function calculateTotalForExpense(expenseData, expense, year, displayMode, getColumnLabelsForYear) {
  const months = getColumnLabelsForYear(year)
  let total = 0
  for (const month of months) {
    const rawAmount = getAmountForExpense(expenseData, expense, year, month, displayMode)
    const amt = parseFloat(rawAmount.toString().replace(/,/g, ''))
    if (!isNaN(amt)) total += amt
  }
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
} 

// New function to group expenses by department and department location
export function getExpensesGroupedByDepartmentAndLocation(expenseData, visibleYears) {
  const departmentMap = new Map()
  
  visibleYears.forEach(year => {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      yearData[month].forEach(entry => {
        const department = entry.department || 'Other'
        const location = entry['department_location'] || 'Other'
        
        if (!departmentMap.has(department)) {
          departmentMap.set(department, new Map())
        }
        
        const locationMap = departmentMap.get(department)
        if (!locationMap.has(location)) {
          locationMap.set(location, new Set())
        }
        
        locationMap.get(location).add(entry.expense)
      })
    }
  })
  
  // Convert to array format with department, location, and expenses
  const groupedExpenses = []
  
  for (const [department, locationMap] of departmentMap) {
    const departmentGroup = {
      department,
      locations: []
    }
    
    for (const [location, expenses] of locationMap) {
      departmentGroup.locations.push({
        location,
        expenses: [...expenses].sort()
      })
    }
    
    // Sort locations alphabetically
    departmentGroup.locations.sort((a, b) => a.location.localeCompare(b.location))
    groupedExpenses.push(departmentGroup)
  }
  
  // Sort departments alphabetically
  groupedExpenses.sort((a, b) => a.department.localeCompare(b.department))
  
  return groupedExpenses
}

// New function to get expense details including department and location
export function getExpenseDetailsWithDepartment(expenseData, expense, visibleYears) {
  for (const year of visibleYears) {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      const entry = yearData[month].find(e => e.expense === expense)
      if (entry) {
        return {
          code: entry.code || '',
          costType: entry['cost_type'] || '',
          rootType: entry['root type'] || '',
          department: entry.department || '',
          departmentLocation: entry['department_location'] || ''
        }
      }
    }
  }
  return { 
    code: '', 
    costType: '', 
    rootType: '', 
    department: '', 
    departmentLocation: '' 
  }
} 