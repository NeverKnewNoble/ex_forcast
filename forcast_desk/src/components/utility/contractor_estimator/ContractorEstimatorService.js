/**
 * Contractor Estimator Service
 * Handles API calls and data management for contractor estimation functionality
 */

import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js'
import { ContractorEstimator, ContractorEstimatorCategory, ContractorEstimatorItem } from './ContractorEstimatorModels.js'

class ContractorEstimatorService {
  constructor() {
    this.estimators = []
    this.currentProject = null
  }

  /**
   * Test API connection
   */
  async testApiConnection() {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.test_connection', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        }
      })
      
      if (!response.ok) {
        throw new Error(`API connection failed: ${response.status}`)
      }
      
      return true
    } catch (error) {
      console.warn('Contractor Estimator API not available, using local storage:', error.message)
      return false
    }
  }

  /**
   * Fetch contractor estimator data from API
   */
  async fetchData(projectName = null) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_contractor_estimator_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          project_name: projectName
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const actualResult = result.message || result

      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to fetch contractor estimator data')
      }

      // Parse the data into our models
      this.estimators = (actualResult.data || []).map(estimatorData => {
        return new ContractorEstimator(estimatorData)
      })
      return this.estimators
    } catch (error) {
      console.error('Error fetching contractor estimator data:', error)
      
      // Fallback to local storage or create default data
      if (this.estimators.length === 0) {
        this.estimators = [ContractorEstimator.createWithDefaultCategories()]
      }
      
      throw error
    }
  }

  /**
   * Save contractor estimator data to API
   */
  async saveData(estimators, projectName = null) {
    try {
      // Debug logging
      console.log('Service - Saving estimators:', estimators.length)
      const dataToSend = estimators.map(estimator => estimator.toJSON())
      console.log('Service - Data being sent to API:', dataToSend)
      if (dataToSend.length > 0 && dataToSend[0].categories) {
        console.log('Service - First estimator categories:', dataToSend[0].categories.length)
        dataToSend[0].categories.forEach((cat, index) => {
          console.log(`Service - Category ${index}: ${cat.name}, Items: ${cat.items.length}`)
          if (cat.items.length > 0) {
            console.log(`Service - Category ${cat.name} items:`, cat.items)
          }
        })
      }
      
      // Log the complete JSON being sent
      console.log('Service - Complete JSON being sent to API:', JSON.stringify(dataToSend, null, 2))
      
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.save_contractor_estimator_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          project_name: projectName,
          data: dataToSend
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const actualResult = result.message || result


      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to save contractor estimator data')
      }

      // Update local data
      this.estimators = estimators
      return actualResult
    } catch (error) {
      console.error('Error saving contractor estimator data:', error)
      throw error
    }
  }

  /**
   * Create a new contractor estimator
   */
  async createEstimator(estimatorData) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.create_contractor_estimator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify(estimatorData)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const actualResult = result.message || result

      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to create contractor estimator')
      }

      return actualResult
    } catch (error) {
      console.error('Error creating contractor estimator:', error)
      throw error
    }
  }

  /**
   * Delete a contractor estimator
   */
  async deleteEstimator(estimatorId) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.delete_contractor_estimator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          estimator_id: estimatorId
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const actualResult = result.message || result

      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to delete contractor estimator')
      }

      return actualResult
    } catch (error) {
      console.error('Error deleting contractor estimator:', error)
      throw error
    }
  }

  /**
   * Get all estimators
   */
  getAllEstimators() {
    return [...this.estimators]
  }

  /**
   * Get estimator by ID
   */
  getEstimatorById(id) {
    return this.estimators.find(estimator => estimator.id === id)
  }

  /**
   * Add estimator to local collection
   */
  addEstimator(estimator) {
    if (!(estimator instanceof ContractorEstimator)) {
      estimator = new ContractorEstimator(estimator)
    }
    this.estimators.push(estimator)
    return estimator
  }

  /**
   * Remove estimator from local collection
   */
  removeEstimator(estimatorId) {
    const index = this.estimators.findIndex(estimator => estimator.id === estimatorId)
    if (index > -1) {
      this.estimators.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Export data to CSV format
   */
  exportData(format = 'csv') {
    if (this.estimators.length === 0) {
      return ''
    }

    const estimator = this.estimators[0] // Export first estimator
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
   * Import data from CSV format
   */
  importData(csvContent) {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        throw new Error('Invalid CSV format')
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''))
      const estimator = ContractorEstimator.createWithDefaultCategories()
      
      let currentCategory = null
      let lineId = 1

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''))
        
        if (values.length < headers.length) continue

        const categoryName = values[1]?.trim()
        
        // Check if this is a category row (has subtotals but no line ID)
        if (!values[0] && categoryName && !isNaN(values[2])) {
          currentCategory = estimator.categories.find(cat => cat.name === categoryName)
          continue
        }

        // This is an item row
        if (currentCategory && values[0]) {
          const item = currentCategory.addItem({
            lineId: values[0] || lineId++,
            name: values[1] || '',
            projected: parseFloat(values[2]) || 0,
            actual: parseFloat(values[3]) || 0,
            party: values[5] || '',
            status: values[6] || 'Not Started',
            percentComplete: parseFloat(values[7]) || 0,
            currentPaid: parseFloat(values[8]) || 0,
            comments: values[10] || ''
          })
        }
      }

      estimator.updateTotals()
      this.estimators = [estimator]
      return estimator
    } catch (error) {
      console.error('Error importing CSV data:', error)
      throw error
    }
  }

  /**
   * Clear all data
   */
  clearData() {
    this.estimators = []
  }

  /**
   * Get data summary
   */
  getDataSummary() {
    if (this.estimators.length === 0) {
      return {
        totalEstimators: 0,
        totalCategories: 0,
        totalItems: 0,
        totalProjected: 0,
        totalActual: 0,
        totalVariance: 0
      }
    }

    const estimator = this.estimators[0]
    const totalCategories = estimator.categories.length
    const totalItems = estimator.categories.reduce((sum, cat) => sum + cat.items.length, 0)

    return {
      totalEstimators: this.estimators.length,
      totalCategories,
      totalItems,
      totalProjected: estimator.totals.projected,
      totalActual: estimator.totals.actual,
      totalVariance: estimator.totals.variance
    }
  }
}

// Create and export singleton instance
export const contractorEstimatorService = new ContractorEstimatorService()

// Export the class for testing
export { ContractorEstimatorService }
