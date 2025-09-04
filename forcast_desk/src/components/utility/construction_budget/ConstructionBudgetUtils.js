/**
 * Construction Budget Utility Functions
 * Provides helper functions for data validation, transformation, and UI utilities
 */

/**
 * Validation utilities
 */
export const ValidationUtils = {
  /**
   * Validate task data
   */
  validateTask(task) {
    const errors = []
    
    if (!task.task || !task.task.trim()) {
      errors.push('Task name is required')
    }
    
    if (task.hr < 0) {
      errors.push('Labor hours cannot be negative')
    }
    
    if (task.ratePerHr < 0) {
      errors.push('Rate per hour cannot be negative')
    }
    
    if (task.units < 0) {
      errors.push('Material units cannot be negative')
    }
    
    if (task.ratePerUnit < 0) {
      errors.push('Rate per unit cannot be negative')
    }
    
    if (task.travel < 0) {
      errors.push('Travel cost cannot be negative')
    }
    
    if (task.equipment < 0) {
      errors.push('Equipment cost cannot be negative')
    }
    
    if (task.misc < 0) {
      errors.push('Miscellaneous cost cannot be negative')
    }
    
    if (task.budget < 0) {
      errors.push('Budget amount cannot be negative')
    }
    
    // Validate dates
    if (task.plannedStartDate && task.endDate) {
      if (new Date(task.plannedStartDate) > new Date(task.endDate)) {
        errors.push('Planned start date cannot be after end date')
      }
    }
    
    if (task.actualStartDate && task.endDate) {
      if (new Date(task.actualStartDate) > new Date(task.endDate)) {
        errors.push('Actual start date cannot be after end date')
      }
    }
    
    return errors
  },

  /**
   * Validate project data
   */
  validateProject(project) {
    const errors = []
    
    if (!project.name || !project.name.trim()) {
      errors.push('Project name is required')
    }
    
    if (project.name && project.name.length > 100) {
      errors.push('Project name cannot exceed 100 characters')
    }
    
    // Validate all tasks
    project.tasks.forEach((task, index) => {
      const taskErrors = this.validateTask(task)
      if (taskErrors.length > 0) {
        errors.push(`Task ${index + 1}: ${taskErrors.join(', ')}`)
      }
    })
    
    return errors
  },

  /**
   * Validate numeric input
   */
  validateNumeric(value, min = 0, max = Infinity) {
    const num = parseFloat(value)
    if (isNaN(num)) return 'Must be a valid number'
    if (num < min) return `Must be at least ${min}`
    if (num > max) return `Must be at most ${max}`
    return null
  },

  /**
   * Validate date input
   */
  validateDate(dateString) {
    if (!dateString) return null
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Must be a valid date'
    return null
  }
}

/**
 * Data transformation utilities
 */
export const DataTransformUtils = {
  /**
   * Transform API data to frontend format
   */
  transformApiToFrontend(apiData) {
    return {
      id: apiData.id,
      name: apiData.project_name || apiData.name,
      totalBudget: parseFloat(apiData.total_budget) || 0,
      totalActual: parseFloat(apiData.total_actual) || 0,
      variance: parseFloat(apiData.variance) || 0,
      tasks: (apiData.tasks || []).map(task => this.transformTaskApiToFrontend(task))
    }
  },

  /**
   * Transform task API data to frontend format
   */
  transformTaskApiToFrontend(apiTask) {
    return {
      id: apiTask.id,
      task: apiTask.task_name || apiTask.task || '',
      description: apiTask.description || '',
      status: apiTask.status || 'Not Started',
      plannedStartDate: apiTask.planned_start_date || '',
      actualStartDate: apiTask.actual_start_date || '',
      endDate: apiTask.end_date || '',
      hr: parseFloat(apiTask.labor_hours) || 0,
      ratePerHr: parseFloat(apiTask.rate_per_hour) || 0,
      units: parseFloat(apiTask.material_units) || 0,
      ratePerUnit: parseFloat(apiTask.rate_per_unit) || 0,
      travel: parseFloat(apiTask.travel_cost) || 0,
      equipment: parseFloat(apiTask.equipmentspace_cost) || 0,
      misc: parseFloat(apiTask.miscellaneous_cost) || 0,
      budget: parseFloat(apiTask.budget_amount) || 0
    }
  },

  /**
   * Transform frontend data to API format
   */
  transformFrontendToApi(frontendData) {
    return {
      project_id: frontendData.id,
      project_name: frontendData.name,
      tasks: frontendData.tasks.map(task => this.transformTaskFrontendToApi(task))
    }
  },

  /**
   * Transform task frontend data to API format
   */
  transformTaskFrontendToApi(frontendTask) {
    return {
      id: frontendTask.id,
      task_name: frontendTask.task,
      description: frontendTask.description,
      status: frontendTask.status,
      planned_start_date: frontendTask.plannedStartDate,
      actual_start_date: frontendTask.actualStartDate,
      end_date: frontendTask.endDate,
      labor_hours: frontendTask.hr,
      rate_per_hour: frontendTask.ratePerHr,
      material_units: frontendTask.units,
      rate_per_unit: frontendTask.ratePerUnit,
      travel_cost: frontendTask.travel,
      equipmentspace_cost: frontendTask.equipment,
      miscellaneous_cost: frontendTask.misc,
      budget_amount: frontendTask.budget
    }
  },

  /**
   * Sanitize input data
   */
  sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.trim()
    }
    if (typeof input === 'number') {
      return isNaN(input) ? 0 : input
    }
    return input
  },

  /**
   * Deep clone object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

/**
 * Formatting utilities
 */
export const FormattingUtils = {
  /**
   * Format currency
   */
  formatCurrency(amount, locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  },

  /**
   * Format number with commas
   */
  formatNumber(number, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number || 0)
  },

  /**
   * Format percentage
   */
  formatPercentage(value, total, decimals = 1) {
    if (total === 0) return '0%'
    const percentage = (value / total) * 100
    return `${percentage.toFixed(decimals)}%`
  },

  /**
   * Format date
   */
  formatDate(dateString, format = 'short') {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const options = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      time: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    }
    
    return date.toLocaleDateString('en-US', options[format] || options.short)
  },

  /**
   * Format file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

/**
 * UI utilities
 */
export const UIUtils = {
  /**
   * Get status color for UI
   */
  getStatusColor(status) {
    const colors = {
      'Not Started': 'gray',
      'In Progress': 'blue',
      'Complete': 'green',
      'Needs Review': 'yellow',
      'Approved': 'green',
      'Overdue': 'red',
      'On Hold': 'orange'
    }
    return colors[status] || 'gray'
  },

  /**
   * Get status icon
   */
  getStatusIcon(status) {
    const icons = {
      'Not Started': 'circle',
      'In Progress': 'play-circle',
      'Complete': 'check-circle',
      'Needs Review': 'eye',
      'Approved': 'check-circle-2',
      'Overdue': 'alert-circle',
      'On Hold': 'pause-circle'
    }
    return icons[status] || 'circle'
  },

  /**
   * Get variance color
   */
  getVarianceColor(variance) {
    if (variance > 0) return 'red' // Over budget
    if (variance < 0) return 'green' // Under budget
    return 'gray' // On budget
  },

  /**
   * Get progress percentage color
   */
  getProgressColor(percentage) {
    if (percentage >= 100) return 'green'
    if (percentage >= 75) return 'blue'
    if (percentage >= 50) return 'yellow'
    if (percentage >= 25) return 'orange'
    return 'red'
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

/**
 * Calculation utilities
 */
export const CalculationUtils = {
  /**
   * Calculate total labor cost
   */
  calculateLaborCost(hours, ratePerHour) {
    return (hours || 0) * (ratePerHour || 0)
  },

  /**
   * Calculate total material cost
   */
  calculateMaterialCost(units, ratePerUnit) {
    return (units || 0) * (ratePerUnit || 0)
  },

  /**
   * Calculate total actual cost
   */
  calculateActualCost(laborCost, materialCost, travel, equipment, misc) {
    return (laborCost || 0) + (materialCost || 0) + (travel || 0) + (equipment || 0) + (misc || 0)
  },

  /**
   * Calculate variance
   */
  calculateVariance(actual, budget) {
    return (actual || 0) - (budget || 0)
  },

  /**
   * Calculate percentage
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0
    return (value / total) * 100
  },

  /**
   * Calculate project totals
   */
  calculateProjectTotals(tasks) {
    return tasks.reduce((totals, task) => {
      const laborCost = this.calculateLaborCost(task.hr, task.ratePerHr)
      const materialCost = this.calculateMaterialCost(task.units, task.ratePerUnit)
      const actualCost = this.calculateActualCost(laborCost, materialCost, task.travel, task.equipment, task.misc)
      
      return {
        totalLabor: totals.totalLabor + laborCost,
        totalMaterials: totals.totalMaterials + materialCost,
        totalTravel: totals.totalTravel + (task.travel || 0),
        totalEquipment: totals.totalEquipment + (task.equipment || 0),
        totalMisc: totals.totalMisc + (task.misc || 0),
        totalBudget: totals.totalBudget + (task.budget || 0),
        totalActual: totals.totalActual + actualCost
      }
    }, {
      totalLabor: 0,
      totalMaterials: 0,
      totalTravel: 0,
      totalEquipment: 0,
      totalMisc: 0,
      totalBudget: 0,
      totalActual: 0
    })
  }
}

/**
 * Export utilities
 */
export const ExportUtils = {
  /**
   * Convert data to CSV
   */
  toCSV(data, headers) {
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
    return [csvHeaders, ...csvRows].join('\n')
  },

  /**
   * Download file
   */
  downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  },

  /**
   * Export to Excel (simplified - would need xlsx library for full functionality)
   */
  toExcel(data, headers, filename = 'export.xlsx') {
    // For now, export as CSV with .xlsx extension
    const csvContent = this.toCSV(data, headers)
    this.downloadFile(csvContent, filename.replace('.xlsx', '.csv'), 'text/csv')
  }
}

/**
 * Sort utilities
 */
export const SortUtils = {
  /**
   * Sort tasks by status priority
   */
  sortTasksByStatus(tasks) {
    const statusPriority = {
      'Overdue': 1,
      'In Progress': 2,
      'Needs Review': 3,
      'On Hold': 4,
      'Not Started': 5,
      'Approved': 6,
      'Complete': 7
    }
    
    return [...tasks].sort((a, b) => {
      const priorityA = statusPriority[a.status] || 999
      const priorityB = statusPriority[b.status] || 999
      return priorityA - priorityB
    })
  },

  /**
   * Sort by date
   */
  sortByDate(items, dateField, ascending = true) {
    return [...items].sort((a, b) => {
      const dateA = new Date(a[dateField])
      const dateB = new Date(b[dateField])
      return ascending ? dateA - dateB : dateB - dateA
    })
  },

  /**
   * Sort by numeric value
   */
  sortByNumber(items, numberField, ascending = true) {
    return [...items].sort((a, b) => {
      const numA = parseFloat(a[numberField]) || 0
      const numB = parseFloat(b[numberField]) || 0
      return ascending ? numA - numB : numB - numA
    })
  },

  /**
   * Sort by string
   */
  sortByString(items, stringField, ascending = true) {
    return [...items].sort((a, b) => {
      const strA = (a[stringField] || '').toLowerCase()
      const strB = (b[stringField] || '').toLowerCase()
      return ascending ? strA.localeCompare(strB) : strB.localeCompare(strA)
    })
  }
}

/**
 * Default export with all utilities
 */
export default {
  ValidationUtils,
  DataTransformUtils,
  FormattingUtils,
  UIUtils,
  CalculationUtils,
  ExportUtils,
  SortUtils
}
