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
    this.autoLoadGLBalances = true // Set to false to disable auto-loading
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
      // Use the merged approach that combines default Item Groups with saved data
      const mergedEstimator = await this.createMergedEstimator('', '', projectName)
      
      this.estimators = [mergedEstimator]
      return this.estimators
    } catch (error) {
      console.error('Error fetching contractor estimator data:', error)
      throw error
    }
  }

  /**
   * Get items by order of item_group
   */
  async getItemsByOrderOfItemGroup() {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_items_by_order_of_category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      const actualResult = result.message || result
      
      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to fetch items by category')
      }
      
      // console.log('Service - Items by order of category:', actualResult.data)
      return actualResult.data
    }
    catch (error) {
      console.error('Error getting items by order of category:', error)
      throw error
    }
  }

  /**
   * Create estimator from API item groups
   */
  async createEstimatorFromItemGroups(projectTitle = '', location = '', project = '') {
    try {
      const itemGroupsData = await this.getItemsByOrderOfItemGroup()
      
      const estimator = new ContractorEstimator({ 
        projectTitle, 
        location, 
        project 
      })
      
      // Create categories from item groups
      Object.keys(itemGroupsData).forEach((itemGroup, index) => {
        const category = estimator.addCategory({ 
          name: itemGroup, 
          order: index + 1 
        })
        
        // Add items for this category (supports string or object with stock_uom, valuation_rate)
        const items = itemGroupsData[itemGroup] || []
        items.forEach(entry => {
          if (typeof entry === 'string') {
            category.addItem({ name: entry })
          } else if (entry && typeof entry === 'object') {
            const itemName = entry.item_name || entry.name || ''
            const unitType = entry.stock_uom || ''
            const rate = typeof entry.valuation_rate === 'number' ? entry.valuation_rate : 0
            const quantity = 1
            category.addItem({ 
              name: itemName, 
              unitType, 
              rate, 
              quantity, 
              projected: quantity * rate 
            })
          }
        })
      })
      
      estimator.updateTotals()
      return estimator
    } catch (error) {
      console.error('Error creating estimator from item groups:', error)
      throw error
    }
  }

  /**
   * Create estimator by merging default Item Groups data with saved Contractor Estimator data
   */
  async createMergedEstimator(projectTitle = '', location = '', project = '') {
    try {
      // Get default data from Item Groups
      const itemGroupsData = await this.getItemsByOrderOfItemGroup()
      
      // Try to get saved data from Contractor Estimator (direct API call to avoid circular dependency)
      let savedEstimator = null
      try {
        const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_contractor_estimator_data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': getCSRFToken()
          },
          body: JSON.stringify({
            project_name: project
          })
        })

        if (response.ok) {
          const result = await response.json()
          const actualResult = result.message || result
          
          if (actualResult.success && actualResult.data && actualResult.data.length > 0) {
            savedEstimator = new ContractorEstimator(actualResult.data[0])
          }
        }
      } catch (error) {
        console.log('No saved estimator found, using default data only')
      }
      
      // Start with default data from Item Groups
      const estimator = new ContractorEstimator({ 
        projectTitle, 
        location, 
        project,
        id: savedEstimator?.id // Use saved ID if available
      })
      
      // Create categories from item groups (default structure)
      Object.keys(itemGroupsData).forEach((itemGroup, index) => {
        const category = estimator.addCategory({ 
          name: itemGroup, 
          order: index + 1 
        })
        
        // Add default items for this category (supports enriched item objects)
        const items = itemGroupsData[itemGroup] || []
        items.forEach(entry => {
          if (typeof entry === 'string') {
            category.addItem({ name: entry })
          } else if (entry && typeof entry === 'object') {
            const itemName = entry.item_name || entry.name || ''
            const unitType = entry.stock_uom || ''
            const rate = typeof entry.valuation_rate === 'number' ? entry.valuation_rate : 0
            const quantity = 1
            category.addItem({ 
              name: itemName, 
              unitType, 
              rate, 
              quantity, 
              projected: quantity * rate 
            })
          }
        })
      })
      estimator.updateTotals()
      
      // If we have saved data, merge it with the default data
      if (savedEstimator) {
        console.log('Merging saved data with default Item Groups data')
        
        // Update estimator totals from saved data
        estimator.totals = { ...savedEstimator.totals }
        
        // Merge category data
        savedEstimator.categories.forEach(savedCategory => {
          const defaultCategory = estimator.categories.find(cat => cat.name === savedCategory.name)
          
          if (defaultCategory) {
            // Update category totals from saved data
            defaultCategory.subtotals = { ...savedCategory.subtotals }
            
            // Merge items: keep default items, but update with saved data if they exist
            savedCategory.items.forEach(savedItem => {
              const defaultItem = defaultCategory.items.find(item => item.name === savedItem.name)
              
              if (defaultItem) {
                // Update default item with saved data
                defaultItem.projected = savedItem.projected
                defaultItem.actual = savedItem.actual
                defaultItem.currentPaid = savedItem.currentPaid
                defaultItem.comments = savedItem.comments
                defaultItem.party = savedItem.party
                defaultItem.status = savedItem.status
                defaultItem.percentComplete = savedItem.percentComplete
                defaultItem.lineId = savedItem.lineId
                // New fields
                if (typeof savedItem.quantity === 'number') defaultItem.quantity = savedItem.quantity
                if (typeof savedItem.rate === 'number') defaultItem.rate = savedItem.rate
                if (savedItem.unitType) defaultItem.unitType = savedItem.unitType
                // Recalculate derived fields
                defaultItem.variance = defaultItem.actual - defaultItem.projected
                defaultItem.amountDue = defaultItem.actual - defaultItem.currentPaid
              } else {
                // This is a new item that was added by user, add it to the category
                defaultCategory.addItem({
                  name: savedItem.name,
                  quantity: savedItem.quantity,
                  unitType: savedItem.unitType,
                  rate: savedItem.rate,
                  projected: savedItem.projected,
                  actual: savedItem.actual,
                  currentPaid: savedItem.currentPaid,
                  comments: savedItem.comments,
                  party: savedItem.party,
                  status: savedItem.status,
                  percentComplete: savedItem.percentComplete,
                  lineId: savedItem.lineId
                })
              }
            })
            
            // Recalculate category totals
            defaultCategory.updateSubtotals()
          } else {
            // This is a new category that was added by user, add it
            const newCategory = estimator.addCategory({
              name: savedCategory.name,
              order: savedCategory.order
            })
            
            // Add all items from this saved category
            savedCategory.items.forEach(savedItem => {
              newCategory.addItem({
                name: savedItem.name,
                projected: savedItem.projected,
                actual: savedItem.actual,
                currentPaid: savedItem.currentPaid,
                comments: savedItem.comments,
                party: savedItem.party,
                status: savedItem.status,
                percentComplete: savedItem.percentComplete,
                lineId: savedItem.lineId
              })
            })
          }
        })
        
        // Recalculate estimator totals
        estimator.updateTotals()
      }
      
      return estimator
    } catch (error) {
      console.error('Error creating merged estimator:', error)
      throw error
    }
  }

  /**
   * Get all existing Item Groups from Frappe
   */
  async getItemGroups() {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_item_groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const actualResult = result.message || result
      
      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to fetch item groups')
      }
      
      console.log('Service - Item Groups fetched:', actualResult.data)
      return actualResult.data
    } catch (error) {
      console.error('Error fetching item groups:', error)
      throw error
    }
  }

  /**
   * Create a new Item Group in Frappe
   */
  async createItemGroup(itemGroupName) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.create_item_group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          item_group_name: itemGroupName
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const actualResult = result.message || result
      
      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to create item group')
      }
      
      console.log('Service - Item Group created:', actualResult)
      return actualResult
    } catch (error) {
      console.error('Error creating item group:', error)
      throw error
    }
  }

  /**
   * Create a new Item in Frappe
   */
  async createItem(itemName, itemGroup) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.create_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          item_name: itemName,
          item_group: itemGroup
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const actualResult = result.message || result
      
      if (!actualResult.success) {
        throw new Error(actualResult.error || 'Failed to create item')
      }
      
      console.log('Service - Item created:', actualResult)
      return actualResult
    } catch (error) {
      console.error('Error creating item:', error)
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

  /**
   * Delete a contractor estimator item from the database
   * @param {string} estimatorId - The estimator ID
   * @param {string} itemLineId - The item line ID to delete
   * @returns {Promise<Object>} - API response
   */
  async deleteItem(estimatorId, itemLineId) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.delete_contractor_estimator_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estimator_id: estimatorId,
          item_line_id: itemLineId
        })
      })

      const result = await response.json()
      
      if (result.message && result.message.success) {
        return {
          success: true,
          message: result.message.message
        }
      } else {
        return {
          success: false,
          error: result.message?.error || 'Failed to delete item'
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      return {
        success: false,
        error: error.message || 'Network error occurred'
      }
    }
  }

  /**
   * Simple hash function to create deterministic but varied values for item names
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Get GL balance for an item to populate Actual Subtotal
   */
  async getItemGLBalance(itemName, filters = {}) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_item_gl_balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          item_name: itemName,
          from_date: filters.fromDate,
          to_date: filters.toDate,
          company: filters.company // Optional - API will use default if not provided
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message && result.message.success) {
        return result.message.data;
      } else {
        throw new Error(result.message?.error || 'Failed to fetch GL balance');
      }
    } catch (error) {
      console.error('Error fetching GL balance:', error);
      throw error;
    }
  }

  /**
   * Auto-populate Actual Subtotal from GL balance for an item
   */
  async populateActualSubtotalFromGL(item, filters = {}) {
    try {
      // First try item-specific GL balance
      try {
        const glData = await this.getItemGLBalance(item.name, filters);
        
        if (glData && glData.primary_account) {
          const balance = glData.primary_account.total_balance || 0;
          
          // Only update if we found actual GL data for this item
          if (balance > 0) {
            // Update the item's actual amount with GL balance
            item.actual = Math.abs(balance); // Use absolute value for display
            
            // Mark as unsaved
            item._unsaved = true;
            
            return {
              success: true,
              balance: balance,
              account: glData.primary_account.account_name,
              company: glData.company,
              method: glData.method_used || 'item_specific'
            };
          } else {
            // No GL data found for this specific item
            return {
              success: false,
              message: 'No GL transactions found for this item'
            };
          }
        }
      } catch (itemError) {
        console.warn('Item-specific GL balance failed:', itemError.message);
      }
      
      // If item-specific lookup failed, try to find exact account match by name
      try {
        const generalGlData = await this.getGeneralAccountBalances(filters);
        
        if (generalGlData && generalGlData.accounts && generalGlData.accounts.length > 0) {
          // Try to find exact account match by item name
          const itemName = item.name.toLowerCase();
          const exactMatch = generalGlData.accounts.find(acc => 
            acc.account_name.toLowerCase().includes(itemName) || 
            itemName.includes(acc.account_name.toLowerCase())
          );
          
          if (exactMatch && exactMatch.total_balance > 0) {
            // Found exact account match
            item.actual = Math.abs(exactMatch.total_balance);
            item._unsaved = true;
            
            return {
              success: true,
              balance: exactMatch.total_balance,
              account: exactMatch.account_name,
              company: generalGlData.company,
              method: 'exact_account_match'
            };
          }
        }
      } catch (generalError) {
        console.warn('General account lookup failed:', generalError.message);
      }
      
      // If no GL data found for this item, don't assign any balance
      return {
        success: false,
        message: 'No GL transactions found for this item'
      };
      
    } catch (error) {
      console.error('Error populating actual subtotal:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get general account balances (fallback approach)
   */
  async getGeneralAccountBalances(filters = {}) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_general_account_balances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        },
        body: JSON.stringify({
          from_date: filters.fromDate,
          to_date: filters.toDate,
          company: filters.company // Optional - API will use default if not provided
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message && result.message.success) {
        return result.message.data;
      } else {
        throw new Error(result.message?.error || 'Failed to fetch general account balances');
      }
    } catch (error) {
      console.error('Error fetching general account balances:', error);
      throw error;
    }
  }

  /**
   * Get default company information
   */
  async getDefaultCompany() {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.get_default_company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': getCSRFToken()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message && result.message.success) {
        return result.message.data;
      } else {
        throw new Error(result.message?.error || 'Failed to fetch default company');
      }
    } catch (error) {
      console.error('Error fetching default company:', error);
      throw error;
    }
  }

  /**
   * Toggle auto-loading of GL balances
   */
  setAutoLoadGLBalances(enabled) {
    this.autoLoadGLBalances = enabled;
    console.log(`Auto-loading GL balances ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Debug function to test GL balance lookup
   * Call this from browser console: contractorEstimatorService.debugGLBalance('Admin Fees')
   */
  async debugGLBalance(itemName) {
    console.log(`=== Debugging GL Balance for: ${itemName} ===`);
    
    try {
      // Test 1: Item-specific GL balance
      console.log('1. Testing item-specific GL balance...');
      const itemResult = await this.getItemGLBalance(itemName);
      console.log('Item-specific result:', itemResult);
      
      // Test 2: General account balances
      console.log('2. Testing general account balances...');
      const generalResult = await this.getGeneralAccountBalances();
      console.log('General result:', generalResult);
      
      // Test 3: Debug accounts API
      console.log('3. Testing debug accounts API...');
      const debugResult = await this.debugAccounts(itemName);
      console.log('Debug accounts result:', debugResult);
      
      return {
        itemSpecific: itemResult,
        general: generalResult,
        debug: debugResult
      };
      
    } catch (error) {
      console.error('Debug error:', error);
      return { error: error.message };
    }
  }

  /**
   * Debug accounts API call
   */
  async debugAccounts(searchTerm) {
    try {
      const response = await fetch('/api/method/ex_forcast.api.call_and_save_contractor_estimator.debug_accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search_term: searchTerm
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error debugging accounts:', error);
      throw error;
    }
  }

  /**
   * Auto-load GL balances for all items in an estimator
   */
  async autoLoadGLBalancesForEstimator(estimator, filters = {}) {
    try {
      // Check if auto-loading is enabled
      if (!this.autoLoadGLBalances) {
        return {
          success: true,
          total: 0,
          successful: 0,
          failed: 0,
          results: [],
          message: 'Auto-loading GL balances is disabled'
        };
      }

      const promises = [];
      
      // Load GL balances for all items across all categories
      for (const category of estimator.categories) {
        for (const item of category.items) {
          if (item.name && item.name.trim()) {
            promises.push(
              this.populateActualSubtotalFromGL(item, filters)
                .catch(error => {
                  console.warn(`Failed to load GL balance for item "${item.name}":`, error.message);
                  return { success: false, item: item.name, error: error.message };
                })
            );
          }
        }
      }
      
      // Wait for all GL balance loads to complete
      const results = await Promise.all(promises);
      
      // Count successes and failures
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      return {
        success: true,
        total: promises.length,
        successful: successful,
        failed: failed,
        results: results
      };
    } catch (error) {
      console.error('Error auto-loading GL balances:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create and export singleton instance
export const contractorEstimatorService = new ContractorEstimatorService()

// Export the class for testing
export { ContractorEstimatorService }
