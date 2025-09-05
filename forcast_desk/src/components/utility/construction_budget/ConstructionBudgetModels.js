/**
 * Construction Budget Data Models and Constructors
 * Provides data structures and validation for construction budget management
 */

/**
 * Task Status Options
 */
export const TASK_STATUS_OPTIONS = [
  'Not Started',
  'In Progress', 
  'Complete',
  'Needs Review',
  'Approved',
  'Overdue',
  'On Hold'
]

/**
 * Construction Budget Task Model
 */
export class ConstructionBudgetTask {
  constructor(data = {}) {
    this.id = data.id || null
    this.task = data.task || ''
    this.project_name = data.project_name || ''
    this.isSubtask = data.isSubtask || false
    this.description = data.description || ''
    this.status = data.status || 'Not Started'
    this.plannedStartDate = data.plannedStartDate || ''
    this.actualStartDate = data.actualStartDate || ''
    this.endDate = data.endDate || ''
    
    // Labor fields
    this.hr = parseFloat(data.hr) || 0
    this.ratePerHr = parseFloat(data.ratePerHr) || 0
    
    // Materials fields
    this.units = parseFloat(data.units) || 0
    this.ratePerUnit = parseFloat(data.ratePerUnit) || 0
    
    // Fixed costs
    this.travel = parseFloat(data.travel) || 0
    this.equipment = parseFloat(data.equipment) || 0
    this.misc = parseFloat(data.misc) || 0
    
    // Budget
    this.budget = parseFloat(data.budget) || 0
    
    // Add computed properties
    this._addComputedProperties()
  }

  _addComputedProperties() {
    // Total Labor Cost
    Object.defineProperty(this, 'totalLabor', {
      get() {
        return this.hr * this.ratePerHr
      },
      enumerable: true,
      configurable: true
    })
    
    // Total Materials Cost
    Object.defineProperty(this, 'totalMaterials', {
      get() {
        return this.units * this.ratePerUnit
      },
      enumerable: true,
      configurable: true
    })
    
    // Actual Cost (sum of all costs)
    Object.defineProperty(this, 'actual', {
      get() {
        return this.totalLabor + this.totalMaterials + this.travel + this.equipment + this.misc
      },
      enumerable: true,
      configurable: true
    })
    
    // Under/Over Budget
    Object.defineProperty(this, 'underOver', {
      get() {
        return this.actual - this.budget
      },
      enumerable: true,
      configurable: true
    })
  }

  /**
   * Validate task data
   */
  validate() {
    const errors = []
    
    if (!this.task.trim()) {
      errors.push('Task name is required')
    }
    
    if (this.hr < 0) {
      errors.push('Labor hours cannot be negative')
    }
    
    if (this.ratePerHr < 0) {
      errors.push('Rate per hour cannot be negative')
    }
    
    if (this.units < 0) {
      errors.push('Material units cannot be negative')
    }
    
    if (this.ratePerUnit < 0) {
      errors.push('Rate per unit cannot be negative')
    }
    
    if (this.travel < 0) {
      errors.push('Travel cost cannot be negative')
    }
    
    if (this.equipment < 0) {
      errors.push('Equipment cost cannot be negative')
    }
    
    if (this.misc < 0) {
      errors.push('Miscellaneous cost cannot be negative')
    }
    
    if (this.budget < 0) {
      errors.push('Budget amount cannot be negative')
    }
    
    if (!TASK_STATUS_OPTIONS.includes(this.status)) {
      errors.push('Invalid task status')
    }
    
    return errors
  }

  /**
   * Convert to API format
   */
  toApiFormat() {
    return {
      id: this.id,
      task: this.task,
      project_name: this.project_name,
      description: this.description,
      status: this.status,
      plannedStartDate: this.plannedStartDate,
      actualStartDate: this.actualStartDate,
      endDate: this.endDate,
      hr: this.hr,
      ratePerHr: this.ratePerHr,
      units: this.units,
      ratePerUnit: this.ratePerUnit,
      travel: this.travel,
      equipment: this.equipment,
      misc: this.misc,
      budget: this.budget
    }
  }

  /**
   * Create from API data
   */
  static fromApiData(apiData) {
    return new ConstructionBudgetTask(apiData)
  }

  /**
   * Create empty task
   */
  static createEmpty() {
    return new ConstructionBudgetTask()
  }
}

/**
 * Construction Budget Project Model
 */
export class ConstructionBudgetProject {
  constructor(data = {}) {
    // Preserve existing ID from database, only generate if truly missing
    this.id = data.id
    this.name = data.name || ''
    this.totalBudget = parseFloat(data.total_budget) || 0
    this.totalActual = parseFloat(data.total_actual) || 0
    this.variance = parseFloat(data.variance) || 0
    this.tasks = (data.tasks || []).map(task => 
      task instanceof ConstructionBudgetTask ? task : new ConstructionBudgetTask(task)
    )
    
    // Add computed properties
    this._addComputedProperties()
  }

  _addComputedProperties() {
    // Subtotal Labor
    Object.defineProperty(this, 'subtotalLabor', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.totalLabor, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Materials
    Object.defineProperty(this, 'subtotalMaterials', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.totalMaterials, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Travel
    Object.defineProperty(this, 'subtotalTravel', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.travel, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Equipment
    Object.defineProperty(this, 'subtotalEquipment', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.equipment, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Misc
    Object.defineProperty(this, 'subtotalMisc', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.misc, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Budget
    Object.defineProperty(this, 'subtotalBudget', {
      get() {
        return this.tasks.reduce((sum, task) => sum + task.budget, 0)
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Actual
    Object.defineProperty(this, 'subtotalActual', {
      get() {
        return this.subtotalLabor + this.subtotalMaterials + this.subtotalTravel + this.subtotalEquipment + this.subtotalMisc
      },
      enumerable: true,
      configurable: true
    })
    
    // Subtotal Under/Over
    Object.defineProperty(this, 'subtotalUnderOver', {
      get() {
        return this.subtotalActual - this.subtotalBudget
      },
      enumerable: true,
      configurable: true
    })
  }

  /**
   * Add a new task to the project
   */
  addTask(taskData = {}) {
    // Generate a unique ID if not provided
    if (!taskData.id) {
      taskData.id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    // Set the project name from the first task if available, otherwise use project name
    if (!taskData.project_name) {
      taskData.project_name = this.tasks.length > 0 && this.tasks[0].project_name 
        ? this.tasks[0].project_name 
        : this.name
    }
    
    const newTask = new ConstructionBudgetTask(taskData)
    this.tasks.push(newTask)
    return newTask
  }

  /**
   * Remove a task from the project
   */
  removeTask(taskId) {
    const index = this.tasks.findIndex(task => task.id === taskId)
    if (index > -1) {
      return this.tasks.splice(index, 1)[0]
    }
    return null
  }

  /**
   * Get task by ID
   */
  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId)
  }

  /**
   * Validate project data
   */
  validate() {
    const errors = []
    
    if (!this.name.trim()) {
      errors.push('Project name is required')
    }
    
    // Validate all tasks
    this.tasks.forEach((task, index) => {
      const taskErrors = task.validate()
      if (taskErrors.length > 0) {
        errors.push(`Task ${index + 1}: ${taskErrors.join(', ')}`)
      }
    })
    
    return errors
  }

  /**
   * Convert to API format
   */
  toApiFormat() {
    // Only send project_id if it's a real database ID (not a generated frontend ID)
    // Generated IDs start with "project-" and have timestamp-random format
    const isGeneratedId = this.id && this.id.startsWith('project-') && this.id.includes('-')
    
    // Use the project name from the first task if available, otherwise fall back to this.name
    const projectName = this.tasks.length > 0 && this.tasks[0].project_name 
      ? this.tasks[0].project_name 
      : this.name
    
    return {
      project_id: isGeneratedId ? null : this.id, // Send null for new projects, real ID for existing ones
      project_name: projectName,
      tasks: this.tasks.map(task => task.toApiFormat())
    }
  }

  /**
   * Create from API data
   */
  static fromApiData(apiData) {
    return new ConstructionBudgetProject(apiData)
  }

  /**
   * Create empty project
   */
  static createEmpty(name = '') {
    // Generate a unique ID for the project
    const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const project = new ConstructionBudgetProject({ id: projectId, name })
    // Add one empty task by default
    project.addTask()
    return project
  }
}

/**
 * Construction Budget Summary Model
 */
export class ConstructionBudgetSummary {
  constructor(data = {}) {
    this.projectCount = data.project_count || 0
    this.taskCount = data.task_count || 0
    this.totalBudget = parseFloat(data.total_budget) || 0
    this.totalActual = parseFloat(data.total_actual) || 0
    this.totalVariance = parseFloat(data.total_variance) || 0
  }

  /**
   * Get variance percentage
   */
  get variancePercentage() {
    if (this.totalBudget === 0) return 0
    return (this.totalVariance / this.totalBudget) * 100
  }

  /**
   * Check if over budget
   */
  get isOverBudget() {
    return this.totalVariance > 0
  }

  /**
   * Get budget utilization percentage
   */
  get budgetUtilization() {
    if (this.totalBudget === 0) return 0
    return (this.totalActual / this.totalBudget) * 100
  }
}

/**
 * Utility functions for data transformation
 */
export const ConstructionBudgetUtils = {
  /**
   * Format currency value
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0)
  },

  /**
   * Format number with commas
   */
  formatNumber(number) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number || 0)
  },

  /**
   * Calculate percentage
   */
  calculatePercentage(value, total) {
    if (total === 0) return 0
    return (value / total) * 100
  },

  /**
   * Validate date range
   */
  validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) return true
    return new Date(startDate) <= new Date(endDate)
  },

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
  }
}
