/**
 * Contractor Estimator Utility Functions
 * Helper functions for calculations, formatting, and data manipulation
 */

/**
 * Format currency values (without dollar sign)
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00'
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format percentage values
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%'
  }
  
  return `${Math.round(value)}%`
}

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  
  // Remove currency symbols and commas
  const cleaned = currencyString.toString().replace(/[$,\s]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Format number with commas for thousands
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  
  const num = parseFloat(value)
  if (isNaN(num)) {
    return value.toString()
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num)
}

/**
 * Parse number string (removes commas and converts to number)
 */
export const parseNumber = (numberString) => {
  if (!numberString) return 0
  
  // Remove commas and spaces
  const cleaned = numberString.toString().replace(/[,\s]/g, '')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Validate numeric input
 */
export const validateNumericInput = (value, min = null, max = null) => {
  const num = parseFloat(value)
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' }
  }
  
  if (min !== null && num < min) {
    return { isValid: false, error: `Must be at least ${min}` }
  }
  
  if (max !== null && num > max) {
    return { isValid: false, error: `Must be at most ${max}` }
  }
  
  return { isValid: true, value: num }
}

/**
 * Validate percentage input (0-100)
 */
export const validatePercentage = (value) => {
  return validateNumericInput(value, 0, 100)
}

/**
 * Calculate variance between actual and projected
 */
export const calculateVariance = (actual, projected) => {
  const actualNum = parseFloat(actual) || 0
  const projectedNum = parseFloat(projected) || 0
  return actualNum - projectedNum
}

/**
 * Calculate amount due (actual - current paid)
 */
export const calculateAmountDue = (actual, currentPaid) => {
  const actualNum = parseFloat(actual) || 0
  const currentPaidNum = parseFloat(currentPaid) || 0
  return actualNum - currentPaidNum
}

/**
 * Get variance color class based on value
 */
export const getVarianceColorClass = (variance) => {
  if (variance > 0) {
    return 'text-red-600 bg-red-50' // Over budget
  } else if (variance < 0) {
    return 'text-green-600 bg-green-50' // Under budget
  } else {
    return 'text-gray-600 bg-gray-50' // On budget
  }
}

/**
 * Get status color class
 */
export const getStatusColorClass = (status) => {
  switch (status) {
    case 'Not Started':
      return 'text-gray-600 bg-gray-100'
    case 'In Progress':
      return 'text-blue-600 bg-blue-100'
    case 'Complete':
      return 'text-green-600 bg-green-100'
    case 'On Hold':
      return 'text-yellow-600 bg-yellow-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

/**
 * Get progress bar color class based on percentage
 */
export const getProgressColorClass = (percentage) => {
  if (percentage >= 100) {
    return 'bg-green-500'
  } else if (percentage >= 75) {
    return 'bg-blue-500'
  } else if (percentage >= 50) {
    return 'bg-yellow-500'
  } else if (percentage >= 25) {
    return 'bg-orange-500'
  } else {
    return 'bg-red-500'
  }
}

/**
 * Generate line ID for items
 */
export const generateLineId = (categoryOrder, itemIndex) => {
  return `${categoryOrder.toString().padStart(2, '0')}.${(itemIndex + 1).toString().padStart(2, '0')}`
}

/**
 * Sort categories by order
 */
export const sortCategoriesByOrder = (categories) => {
  return [...categories].sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * Sort items within category
 */
export const sortItemsByName = (items) => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Calculate category totals
 */
export const calculateCategoryTotals = (items) => {
  return items.reduce((totals, item) => {
    totals.projected += parseFloat(item.projected) || 0
    totals.actual += parseFloat(item.actual) || 0
    totals.variance += calculateVariance(item.actual, item.projected)
    totals.currentPaid += parseFloat(item.currentPaid) || 0
    totals.amountDue += calculateAmountDue(item.actual, item.currentPaid)
    return totals
  }, {
    projected: 0,
    actual: 0,
    variance: 0,
    currentPaid: 0,
    amountDue: 0
  })
}

/**
 * Calculate estimator totals
 */
export const calculateEstimatorTotals = (categories) => {
  return categories.reduce((totals, category) => {
    totals.projected += category.subtotals.projected
    totals.actual += category.subtotals.actual
    totals.variance += category.subtotals.variance
    totals.currentPaid += category.subtotals.currentPaid
    totals.amountDue += category.subtotals.amountDue
    return totals
  }, {
    projected: 0,
    actual: 0,
    variance: 0,
    currentPaid: 0,
    amountDue: 0
  })
}

/**
 * Validate estimator data
 */
export const validateEstimator = (estimator) => {
  const errors = []
  
  if (!estimator.projectTitle?.trim()) {
    errors.push('Project title is required')
  }
  
  if (!estimator.categories || estimator.categories.length === 0) {
    errors.push('At least one category is required')
  }
  
  estimator.categories?.forEach((category, categoryIndex) => {
    if (!category.name?.trim()) {
      errors.push(`Category ${categoryIndex + 1}: Name is required`)
    }
    
    category.items?.forEach((item, itemIndex) => {
      if (!item.name?.trim()) {
        errors.push(`Category ${categoryIndex + 1}, Item ${itemIndex + 1}: Name is required`)
      }
      
      if (item.percentComplete < 0 || item.percentComplete > 100) {
        errors.push(`Category ${categoryIndex + 1}, Item ${itemIndex + 1}: Percent complete must be between 0 and 100`)
      }
      
      if (item.currentPaid > item.actual) {
        errors.push(`Category ${categoryIndex + 1}, Item ${itemIndex + 1}: Current paid cannot exceed actual amount`)
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Export data to different formats
 */
export const exportToFormat = (data, format = 'csv') => {
  switch (format.toLowerCase()) {
    case 'csv':
      return exportToCSV(data)
    case 'json':
      return exportToJSON(data)
    case 'excel':
      return exportToExcel(data)
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

/**
 * Export to CSV format
 */
const exportToCSV = (estimator) => {
  const headers = [
    'Line ID',
    'Category & Items',
    'Projected Subtotal',
    'Actual Subtotal',
    'Variance',
    'Party Responsible',
    'Status',
    '% of Task Complete',
    'Current Paid',
    'Amount Due',
    'Comments'
  ]

  let csvContent = headers.join(',') + '\n'

  // Add grand totals row
  csvContent += `"","TOTALS",${estimator.totals.projected},${estimator.totals.actual},${estimator.totals.variance},"","","",${estimator.totals.currentPaid},${estimator.totals.amountDue},""\n`

  // Add categories and items
  estimator.categories.forEach(category => {
    // Category subtotal row
    csvContent += `"","${category.name}",${category.subtotals.projected},${category.subtotals.actual},${category.subtotals.variance},"","","",${category.subtotals.currentPaid},${category.subtotals.amountDue},""\n`
    
    // Category items
    category.items.forEach(item => {
      csvContent += `"${item.lineId || ''}","${item.name}",${item.projected || ''},${item.actual || ''},${item.variance},"${item.party || ''}","${item.status}","${item.percentComplete}","${item.currentPaid || ''}","${item.amountDue}","${item.comments || ''}"\n`
    })
  })

  return csvContent
}

/**
 * Export to JSON format
 */
const exportToJSON = (estimator) => {
  return JSON.stringify(estimator, null, 2)
}

/**
 * Export to Excel format (simplified)
 */
const exportToExcel = (estimator) => {
  // For now, return CSV format as Excel can import CSV
  // In a real implementation, you might use a library like xlsx
  return exportToCSV(estimator)
}

/**
 * Import data from CSV
 */
export const importFromCSV = (csvContent) => {
  try {
    const lines = csvContent.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('Invalid CSV format')
    }

    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
    const data = {
      categories: [],
      totals: {
        projected: 0,
        actual: 0,
        variance: 0,
        currentPaid: 0,
        amountDue: 0
      }
    }
    
    let currentCategory = null
    let lineId = 1

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.replace(/"/g, ''))
      
      if (values.length < headers.length) continue

      const categoryName = values[1]?.trim()
      
      // Check if this is a category row (has subtotals but no line ID)
      if (!values[0] && categoryName && !isNaN(values[2])) {
        currentCategory = {
          name: categoryName,
          order: data.categories.length + 1,
          items: [],
          subtotals: {
            projected: parseFloat(values[2]) || 0,
            actual: parseFloat(values[3]) || 0,
            variance: parseFloat(values[4]) || 0,
            currentPaid: parseFloat(values[8]) || 0,
            amountDue: parseFloat(values[9]) || 0
          }
        }
        data.categories.push(currentCategory)
        continue
      }

      // This is an item row
      if (currentCategory && values[0]) {
        const item = {
          lineId: values[0] || lineId++,
          name: values[1] || '',
          projected: parseFloat(values[2]) || 0,
          actual: parseFloat(values[3]) || 0,
          party: values[5] || '',
          status: values[6] || 'Not Started',
          percentComplete: parseFloat(values[7]) || 0,
          currentPaid: parseFloat(values[8]) || 0,
          comments: values[10] || '',
          variance: calculateVariance(values[3], values[2]),
          amountDue: calculateAmountDue(values[3], values[8])
        }
        currentCategory.items.push(item)
      }
    }

    // Calculate totals
    data.totals = calculateEstimatorTotals(data.categories)
    
    return data
  } catch (error) {
    console.error('Error importing CSV data:', error)
    throw error
  }
}

/**
 * Debounce function for input handling
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + '...'
}

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date for input fields
 */
export const formatDateForInput = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  return d.toISOString().split('T')[0]
}
