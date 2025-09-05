/**
 * Construction Budget Service Layer
 * Handles API communication and data management for construction budget
 */

import { 
    ConstructionBudgetProject, 
    ConstructionBudgetTask, 
    ConstructionBudgetSummary,
    ConstructionBudgetUtils 
  } from './ConstructionBudgetModels.js'
  
  /**
   * API Configuration
   */
  const API_CONFIG = {
    baseUrl: '/api/method/ex_forcast.api.construction_budget_api',
    endpoints: {
      display: 'construction_budget_display',
      upsert: 'upsert_construction_budget',
      delete: 'delete_construction_budget_project',
      summary: 'get_construction_budget_summary'
    }
  }
  
  /**
   * Construction Budget Service Class
   */
  export class ConstructionBudgetService {
    constructor() {
      this.projects = []
      this.isLoading = false
      this.error = null
      this.lastSync = null
    }
  
    /**
     * Fetch all construction budget data
     */
    async fetchData(project = null) {
      try {
        this.isLoading = true
        this.error = null
  
        const url = `${API_CONFIG.baseUrl}.${API_CONFIG.endpoints.display}?project=${project || ''}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
  
        // Handle nested response structure (Frappe wraps responses in 'message')
        const actualResult = result.message || result
  
        if (actualResult.success) {
          this.projects = actualResult.data.map(projectData => {
            const project = ConstructionBudgetProject.fromApiData(projectData)
            // Only generate ID if it's truly null/undefined (not just falsy)
            if (project.id === null || project.id === undefined) {
              project.id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }
            return project
          })
          this.lastSync = new Date()
          return this.projects
        } else {
          throw new Error(actualResult.error || 'Failed to fetch construction budget data')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching construction budget data:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  
    /**
     * Save construction budget data
     */
    async saveData(projects, project = null) {
      try {
        this.isLoading = true
        this.error = null
  
        // Validate all projects before saving
        const validationErrors = []
        projects.forEach((proj, index) => {
          const errors = proj.validate()
          if (errors.length > 0) {
            validationErrors.push(`Project ${index + 1}: ${errors.join(', ')}`)
          }
        })
  
        if (validationErrors.length > 0) {
          throw new Error(`Validation failed: ${validationErrors.join('; ')}`)
        }
  
        // Convert to API format
        const apiData = projects.map(proj => proj.toApiFormat())
        
        console.log('API Data being sent to backend:', apiData)
        console.log('Project filter:', project)

        const requestBody = {
          changes: apiData,
          project: project
        }
        
        console.log('Full request body:', requestBody)

        const response = await fetch(`${API_CONFIG.baseUrl}.${API_CONFIG.endpoints.upsert}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
  
        const result = await response.json()
  
        // Handle nested response structure (Frappe wraps responses in 'message')
        const actualResult = result.message || result
  
        if (actualResult.success) {
          // Update project IDs with real database IDs if they were created
          if (actualResult.results && Array.isArray(actualResult.results)) {
            actualResult.results.forEach((result, index) => {
              if (result.name && projects[index]) {
                // Update the project with the real database ID
                projects[index].id = result.name
              }
            })
          }
          
          // Update local data
          this.projects = projects
          this.lastSync = new Date()
          return actualResult.results
        } else {
          throw new Error(actualResult.error || 'Failed to save construction budget data')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error saving construction budget data:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  
    /**
     * Delete a construction budget project
     */
    async deleteProject(projectId) {
      try {
        this.isLoading = true
        this.error = null
  
        const response = await fetch(`${API_CONFIG.baseUrl}.${API_CONFIG.endpoints.delete}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: projectId
          })
        })
  
        const result = await response.json()
  
        if (result.success) {
          // Remove from local data
          this.projects = this.projects.filter(proj => proj.id !== projectId)
          this.lastSync = new Date()
          return true
        } else {
          throw new Error(result.error || 'Failed to delete project')
        }
      } catch (error) {
        this.error = error.message
        console.error('Error deleting project:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    }
  
    /**
     * Get construction budget summary
     */
    async getSummary(project = null) {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}.${API_CONFIG.endpoints.summary}?project=${project || ''}`)
        const result = await response.json()
  
        if (result.success) {
          return new ConstructionBudgetSummary(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch summary')
        }
      } catch (error) {
        console.error('Error fetching summary:', error)
        throw error
      }
    }
  
    /**
     * Create a new project
     */
    createProject(name) {
      const newProject = ConstructionBudgetProject.createEmpty(name)
      this.projects.push(newProject)
      return newProject
    }
  
    /**
     * Add task to project
     */
    addTaskToProject(projectId, taskData = {}) {
      const project = this.projects.find(proj => proj.id === projectId)
      if (project) {
        const newTask = project.addTask(taskData)
        return newTask
      }
      throw new Error('Project not found')
    }
  
    /**
     * Remove task from project
     */
    removeTaskFromProject(projectId, taskId) {
      const project = this.projects.find(proj => proj.id === projectId)
      if (project) {
        return project.removeTask(taskId)
      }
      throw new Error('Project not found')
    }
  
    /**
     * Get project by ID
     */
    getProject(projectId) {
      return this.projects.find(proj => proj.id === projectId)
    }
  
    /**
     * Get all projects
     */
    getAllProjects() {
      // Only generate IDs for projects that truly don't have them
      this.projects.forEach(project => {
        if (project.id === null || project.id === undefined) {
          project.id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
      })
      return this.projects
    }
  
    /**
     * Get computed totals
     */
    getTotals() {
      const totalTasks = this.projects.reduce((sum, proj) => sum + proj.tasks.length, 0)
      const totalBudget = this.projects.reduce((sum, proj) => sum + proj.subtotalBudget, 0)
      const totalActual = this.projects.reduce((sum, proj) => sum + proj.subtotalActual, 0)
      const totalVariance = totalActual - totalBudget
  
      return {
        totalTasks,
        totalBudget,
        totalActual,
        totalVariance
      }
    }
  
    /**
     * Export data to various formats
     */
    exportData(format = 'json') {
      switch (format.toLowerCase()) {
        case 'json':
          return JSON.stringify(this.projects, null, 2)
        
        case 'csv':
          return this._exportToCSV()
        
        case 'excel':
          return this._exportToExcel()
        
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }
    }
  
    /**
     * Export to CSV format
     */
    _exportToCSV() {
      const headers = [
        'Project Name',
        'Task Name',
        'Description',
        'Status',
        'Planned Start Date',
        'Actual Start Date',
        'End Date',
        'Labor Hours',
        'Rate per Hour',
        'Total Labor Cost',
        'Material Units',
        'Rate per Unit',
        'Total Material Cost',
        'Travel Cost',
        'Equipment Cost',
        'Miscellaneous Cost',
        'Budget Amount',
        'Actual Cost',
        'Under/Over Budget'
      ]
  
      const rows = [headers.join(',')]
  
      this.projects.forEach(project => {
        project.tasks.forEach(task => {
          const row = [
            `"${project.name}"`,
            `"${task.task}"`,
            `"${task.description}"`,
            `"${task.status}"`,
            task.plannedStartDate,
            task.actualStartDate,
            task.endDate,
            task.hr,
            task.ratePerHr,
            task.totalLabor,
            task.units,
            task.ratePerUnit,
            task.totalMaterials,
            task.travel,
            task.equipment,
            task.misc,
            task.budget,
            task.actual,
            task.underOver
          ]
          rows.push(row.join(','))
        })
      })
  
      return rows.join('\n')
    }
  
    /**
     * Export to Excel format (simplified)
     */
    _exportToExcel() {
      // This would typically use a library like xlsx
      // For now, return CSV format
      return this._exportToCSV()
    }
  
    /**
     * Import data from various formats
     */
    importData(data, format = 'json') {
      try {
        let projects = []
  
        switch (format.toLowerCase()) {
          case 'json':
            projects = JSON.parse(data).map(proj => ConstructionBudgetProject.fromApiData(proj))
            break
          
          case 'csv':
            projects = this._importFromCSV(data)
            break
          
          default:
            throw new Error(`Unsupported import format: ${format}`)
        }
  
        // Validate imported data
        projects.forEach((proj, index) => {
          const errors = proj.validate()
          if (errors.length > 0) {
            throw new Error(`Import validation failed for project ${index + 1}: ${errors.join(', ')}`)
          }
        })
  
        this.projects = projects
        return projects
      } catch (error) {
        console.error('Error importing data:', error)
        throw error
      }
    }
  
    /**
     * Import from CSV format
     */
    _importFromCSV(csvData) {
      const lines = csvData.split('\n')
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      
      const projects = new Map()
  
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        const row = {}
        
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
  
        const projectName = row['Project Name']
        if (!projects.has(projectName)) {
          projects.set(projectName, ConstructionBudgetProject.createEmpty(projectName))
        }
  
        const project = projects.get(projectName)
        const taskData = {
          task: row['Task Name'],
          description: row['Description'],
          status: row['Status'],
          plannedStartDate: row['Planned Start Date'],
          actualStartDate: row['Actual Start Date'],
          endDate: row['End Date'],
          hr: parseFloat(row['Labor Hours']) || 0,
          ratePerHr: parseFloat(row['Rate per Hour']) || 0,
          units: parseFloat(row['Material Units']) || 0,
          ratePerUnit: parseFloat(row['Rate per Unit']) || 0,
          travel: parseFloat(row['Travel Cost']) || 0,
          equipment: parseFloat(row['Equipment Cost']) || 0,
          misc: parseFloat(row['Miscellaneous Cost']) || 0,
          budget: parseFloat(row['Budget Amount']) || 0
        }
  
        project.addTask(taskData)
      }
  
      return Array.from(projects.values())
    }
  
    /**
     * Clear all data
     */
    clearData() {
      this.projects = []
      this.error = null
      this.lastSync = null
    }
  
    /**
     * Check if data has been modified since last sync
     */
    hasUnsavedChanges() {
      // This would need to track changes more sophisticatedly
      // For now, return false
      return false
    }
  
    /**
     * Test API connection
     */
    async testApiConnection() {
      try {
        const response = await fetch(`${API_CONFIG.baseUrl}.test_construction_budget_api`)
        const result = await response.json()
        
        // Handle nested response structure (Frappe wraps responses in 'message')
        const actualResult = result.message || result
        return actualResult.success
      } catch (error) {
        console.error('API Test Error:', error)
        return false
      }
    }
  
    /**
     * Get service status
     */
    getStatus() {
      return {
        isLoading: this.isLoading,
        error: this.error,
        lastSync: this.lastSync,
        projectCount: this.projects.length,
        hasUnsavedChanges: this.hasUnsavedChanges()
      }
    }
  }
  
  /**
   * Create a singleton instance
   */
  export const constructionBudgetService = new ConstructionBudgetService()
  
  /**
   * Utility functions for the service
   */
  export const ConstructionBudgetServiceUtils = {
    /**
     * Initialize service with project context
     */
    async initialize(project = null) {
      try {
        await constructionBudgetService.fetchData(project)
        return constructionBudgetService
      } catch (error) {
        console.error('Failed to initialize construction budget service:', error)
        throw error
      }
    },
  
    /**
     * Get formatted summary for display
     */
    async getFormattedSummary(project = null) {
      try {
        const summary = await constructionBudgetService.getSummary(project)
        return {
          projectCount: summary.projectCount,
          taskCount: summary.taskCount,
          totalBudget: ConstructionBudgetUtils.formatCurrency(summary.totalBudget),
          totalActual: ConstructionBudgetUtils.formatCurrency(summary.totalActual),
          totalVariance: ConstructionBudgetUtils.formatCurrency(summary.totalVariance),
          variancePercentage: ConstructionBudgetUtils.formatNumber(summary.variancePercentage),
          isOverBudget: summary.isOverBudget,
          budgetUtilization: ConstructionBudgetUtils.formatNumber(summary.budgetUtilization)
        }
      } catch (error) {
        console.error('Failed to get formatted summary:', error)
        throw error
      }
    }
  }