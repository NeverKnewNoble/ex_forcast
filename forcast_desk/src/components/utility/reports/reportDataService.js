import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js'
import { unifiedCacheService } from '@/components/utility/_master_utility/unifiedCacheService.js'
import { selectedProject } from '@/components/utility/dashboard/projectService.js'

/**
 * Unified Report Data Service
 * Provides centralized data loading for all report types
 * Eliminates the need to visit other pages first to populate cache
 */
class ReportDataService {
  constructor() {
    this.calculationCache = useCalculationCache()
    this.unifiedCacheService = unifiedCacheService
  }

  /**
   * Debug function to inspect what's actually cached
   * @param {string} projectName - Name of the project
   * @returns {Object} Cache inspection results
   */
  debugCache(projectName) {
    try {
      // console.log('[REPORT SERVICE DEBUG] Inspecting cache for project:', projectName)
      
      const cache = this.calculationCache.cache[projectName] || {}
      const pages = Object.keys(cache)
      
      // console.log('[REPORT SERVICE DEBUG] Available pages:', pages)
      
      const inspection = {}
      
      pages.forEach(page => {
        const pageData = cache[page] || {}
        const rowCodes = Object.keys(pageData)
        
        inspection[page] = {
          rowCodes,
          sampleData: {}
        }
        
        // Sample some data from each page
        rowCodes.slice(0, 3).forEach(rowCode => {
          const yearData = pageData[rowCode] || {}
          const years = Object.keys(yearData)
          
          if (years.length > 0) {
            const sampleYear = years[0]
            const monthData = yearData[sampleYear] || {}
            const months = Object.keys(monthData)
            
            inspection[page].sampleData[rowCode] = {
              years,
              sampleYear,
              months: months.slice(0, 3),
              sampleValues: months.slice(0, 3).map(month => monthData[month])
            }
          }
        })
      })
      
      // console.log('[REPORT SERVICE DEBUG] Cache inspection:', inspection)
      return inspection
      
    } catch (error) {
      console.error('[REPORT SERVICE DEBUG] Error inspecting cache:', error)
      return {}
    }
  }

  /**
   * Get comprehensive data for all report types
   * @param {string} projectName - Name of the project
   * @param {Array} years - Array of years to load data for
   * @returns {Object} Unified data object with metadata
   */
  async getReportData(projectName, years) {
    try {
      // console.log('[REPORT SERVICE] Loading unified data for project:', projectName, 'years:', years)
      
      // Debug: Inspect what's actually cached
      const cacheInspection = this.debugCache(projectName)
      
      // Ensure cache service is initialized
      if (!this.unifiedCacheService.isInitialized.value) {
        await this.unifiedCacheService.initialize()
      }

      // Load project cache
      await this.unifiedCacheService.loadProjectCache()

      // Collect data from all relevant sources
      const data = {
        metadata: {
          projectName,
          years,
          timestamp: new Date().toISOString(),
          dataCompleteness: 0,
          cacheInspection
        },
        roomRevenue: {},
        fnbRevenue: {},
        oodRevenue: {},
        expenseData: {},
        payrollData: {},
        payrollRelatedData: {},
        bonusData: {},
        marketSegmentation: {},
        roomPackages: {}
      }

      let totalDataPoints = 0
      let populatedDataPoints = 0

      // Load Room Revenue data
      for (const year of years) {
        data.roomRevenue[year] = await this.loadRoomRevenueData(projectName, year)
        totalDataPoints += this.countDataPoints(data.roomRevenue[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.roomRevenue[year])
      }

      // Load F&B Revenue data
      for (const year of years) {
        data.fnbRevenue[year] = await this.loadFnBRevenueData(projectName, year)
        totalDataPoints += this.countDataPoints(data.fnbRevenue[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.fnbRevenue[year])
      }

      // Load OOD Revenue data
      for (const year of years) {
        data.oodRevenue[year] = await this.loadOODRevenueData(projectName, year)
        totalDataPoints += this.countDataPoints(data.oodRevenue[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.oodRevenue[year])
      }

      // Load Expense data
      for (const year of years) {
        data.expenseData[year] = await this.loadExpenseData(projectName, year)
        totalDataPoints += this.countDataPoints(data.expenseData[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.expenseData[year])
      }

      // Load Payroll data
      for (const year of years) {
        data.payrollData[year] = await this.loadPayrollData(projectName, year)
        totalDataPoints += this.countDataPoints(data.payrollData[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.payrollData[year])
      }

      // Load Payroll Related data
      for (const year of years) {
        data.payrollRelatedData[year] = await this.loadPayrollRelatedData(projectName, year)
        totalDataPoints += this.countDataPoints(data.payrollRelatedData[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.payrollRelatedData[year])
      }

      // Load Bonus data
      for (const year of years) {
        data.bonusData[year] = await this.loadBonusData(projectName, year)
        totalDataPoints += this.countDataPoints(data.bonusData[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.bonusData[year])
      }

      // Load Market Segmentation data
      for (const year of years) {
        data.marketSegmentation[year] = await this.loadMarketSegmentationData(projectName, year)
        totalDataPoints += this.countDataPoints(data.marketSegmentation[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.marketSegmentation[year])
      }

      // Load Room Packages data
      for (const year of years) {
        data.roomPackages[year] = await this.loadRoomPackagesData(projectName, year)
        totalDataPoints += this.countDataPoints(data.roomPackages[year])
        populatedDataPoints += this.countPopulatedDataPoints(data.roomPackages[year])
      }

      // Calculate data completeness percentage
      data.metadata.dataCompleteness = totalDataPoints > 0 
        ? Math.round((populatedDataPoints / totalDataPoints) * 100) 
        : 0

      // console.log('[REPORT SERVICE] Data loading complete. Completeness:', data.metadata.dataCompleteness + '%')
      
      return data

    } catch (error) {
      console.error('[REPORT SERVICE] Error loading unified data:', error)
      throw new Error(`Failed to load report data: ${error.message}`)
    }
  }

  /**
   * Get data for a specific report type
   * @param {string} reportType - Type of report (room-pnl, fnb-pnl, etc.)
   * @param {string} projectName - Name of the project
   * @param {Array} years - Array of years to load data for
   * @returns {Object} Report-specific data
   */
  async getReportSpecificData(reportType, projectName, years) {
    try {
      // console.log('[REPORT SERVICE] Loading specific data for report:', reportType)
      
      const data = {}
      
      switch (reportType) {
        case 'room-pnl':
          for (const year of years) {
            data[year] = {
              roomRevenue: await this.loadRoomRevenueData(projectName, year),
              expenses: await this.loadExpenseData(projectName, year),
              payroll: await this.loadPayrollData(projectName, year),
              payrollRelated: await this.loadPayrollRelatedData(projectName, year),
              bonus: await this.loadBonusData(projectName, year)
            }
          }
          break
          
        case 'fnb-pnl':
          for (const year of years) {
            data[year] = {
              fnbRevenue: await this.loadFnBRevenueData(projectName, year),
              roomStats: await this.loadRoomRevenueData(projectName, year)
            }
          }
          break
          
        case 'ood-pnl':
          for (const year of years) {
            data[year] = {
              oodRevenue: await this.loadOODRevenueData(projectName, year),
              expenses: await this.loadExpenseData(projectName, year)
            }
          }
          break
          
        default:
          throw new Error(`Unsupported report type: ${reportType}`)
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading specific report data:', error)
      throw new Error(`Failed to load ${reportType} data: ${error.message}`)
    }
  }

  /**
   * Load Room Revenue data for a specific year
   */
  async loadRoomRevenueData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      // Load basic room data
      for (const month of months) {
        data[month] = {
          totalRooms: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Total Rooms', year, month),
          totalRoomRevenue: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Total Room Revenue', year, month),
          corporate: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Corporate', year, month),
          ota: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'OTA', year, month),
          travelAgent: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Travel Agent', year, month),
          directRetail: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Direct Retail', year, month)
        }
      }
      
      // Load yearly totals
      data['ALL'] = {
        totalRooms: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Total Rooms', year, 'ALL'),
        totalRoomRevenue: this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', 'Total Room Revenue', year, 'ALL')
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading room revenue data:', error)
      return {}
    }
  }

  /**
   * Load F&B Revenue data for a specific year
   */
  async loadFnBRevenueData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      for (const month of months) {
        data[month] = {
          roomsAvailable: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Number of rooms available', year, month),
          roomsSold: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Number of rooms sold (excl.)', year, month),
          occupancy: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Occupancy (excl.) %', year, month),
          numberOfGuests: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Number of guests', year, month),
          totalCovers: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Total Covers', year, month),
          averageSpent: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Average Spent Per F&B Customer', year, month),
          averageRoomRate: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Average Room Rate', year, month),
          revenuePerRoom: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Revenue Per Available Room', year, month),
          totalFnBRevenue: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Total F&B Revenue', year, month),
          totalFoodRevenue: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Total Food Revenue', year, month),
          totalBeverageRevenue: this.calculationCache.getValue(projectName, 'F&B Revenue Assumptions', 'Total Beverage Revenue', year, month)
        }
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading F&B revenue data:', error)
      return {}
    }
  }

  /**
   * Load OOD Revenue data for a specific year
   */
  async loadOODRevenueData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      for (const month of months) {
        data[month] = {
          laundryRevenue: this.calculationCache.getValue(projectName, 'OOD Revenue Assumptions', 'Total Laundry Revenue', year, month),
          healthClubRevenue: this.calculationCache.getValue(projectName, 'OOD Revenue Assumptions', 'Total Health Club Rev Including SC', year, month)
        }
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading OOD revenue data:', error)
      return {}
    }
  }

  /**
   * Load Expense data for a specific year
   */
  async loadExpenseData(projectName, year) {
    try {
      // This would typically load from an API or cache
      // For now, return empty structure
      return {}
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading expense data:', error)
      return {}
    }
  }

  /**
   * Load Payroll data for a specific year
   */
  async loadPayrollData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      // Load payroll data from cache
      const pageData = this.calculationCache.cache[projectName]?.['Payroll'] || {}
      
      for (const month of months) {
        data[month] = {}
        
        // Iterate through all payroll row codes
        Object.keys(pageData).forEach(rowCode => {
          if (rowCode.startsWith('MonthlySalary|')) {
            const value = this.calculationCache.getValue(projectName, 'Payroll', rowCode, year, month)
            if (value !== undefined && value !== null) {
              data[month][rowCode] = value
            }
          }
        })
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading payroll data:', error)
      return {}
    }
  }

  /**
   * Load Payroll Related data for a specific year
   */
  async loadPayrollRelatedData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      for (const month of months) {
        data[month] = {
          nssit: this.calculationCache.getValue(projectName, 'Payroll Taxes', 'NSSIT', year, month),
          vacation: this.calculationCache.getValue(projectName, 'Payroll Related', 'hotel | vacation', year, month),
          relocation: this.calculationCache.getValue(projectName, 'Payroll Related', 'hotel | relocation', year, month),
          severence: this.calculationCache.getValue(projectName, 'Payroll Related', 'hotel | severence & indemnity', year, month),
          other: this.calculationCache.getValue(projectName, 'Payroll Related', 'hotel | other', year, month),
          medical: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | medical', year, month),
          uniforms: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | uniforms', year, month),
          employeeMeal: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | employee_meal', year, month),
          transport: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | transport', year, month),
          telephone: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | telephone', year, month),
          airTicket: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | air_ticket', year, month),
          otherBenefits: this.calculationCache.getValue(projectName, 'Payroll Related', 'category: Rooms | other_benefits', year, month)
        }
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading payroll related data:', error)
      return {}
    }
  }

  /**
   * Load Bonus data for a specific year
   */
  async loadBonusData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      for (const month of months) {
        data[month] = {
          totalHotel: this.calculationCache.getValue(projectName, 'Bonus', 'Total Hotel', year, month)
        }
      }
      
      // Load yearly total
      data['Total'] = {
        totalHotel: this.calculationCache.getValue(projectName, 'Bonus', 'Total Hotel', year, 'Total')
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading bonus data:', error)
      return {}
    }
  }

  /**
   * Load Market Segmentation data for a specific year
   */
  async loadMarketSegmentationData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      // Get all market segmentation row codes
      const pageData = this.calculationCache.cache[projectName]?.['Market Segmentation'] || {}
      
      for (const month of months) {
        data[month] = {}
        
        Object.keys(pageData).forEach(rowCode => {
          if (rowCode.startsWith('Room Revenue:')) {
            const value = this.calculationCache.getValue(projectName, 'Market Segmentation', rowCode, year, month)
            if (value !== undefined && value !== null) {
              data[month][rowCode] = value
            }
          }
        })
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading market segmentation data:', error)
      return {}
    }
  }

  /**
   * Load Room Packages data for a specific year
   */
  async loadRoomPackagesData(projectName, year) {
    try {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const data = {}
      
      // Get all room type row codes
      const pageData = this.calculationCache.cache[projectName]?.['Room Revenue Assumptions'] || {}
      
      for (const month of months) {
        data[month] = {}
        
        Object.keys(pageData).forEach(rowCode => {
          if (rowCode.startsWith('Room Type:')) {
            const value = this.calculationCache.getValue(projectName, 'Room Revenue Assumptions', rowCode, year, month)
            if (value !== undefined && value !== null) {
              data[month][rowCode] = value
            }
          }
        })
      }
      
      return data
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error loading room packages data:', error)
      return {}
    }
  }

  /**
   * Count total data points in a data object
   */
  countDataPoints(data) {
    if (!data || typeof data !== 'object') return 0
    
    let count = 0
    Object.values(data).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        count += this.countDataPoints(value)
      } else {
        count++
      }
    })
    
    return count
  }

  /**
   * Count populated data points (non-null, non-undefined, non-zero)
   */
  countPopulatedDataPoints(data) {
    if (!data || typeof data !== 'object') return 0
    
    let count = 0
    Object.values(data).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        count += this.countPopulatedDataPoints(value)
      } else if (value !== null && value !== undefined && value !== 0) {
        count++
      }
    })
    
    return count
  }

  /**
   * Validate data integrity
   */
  validateData(data) {
    try {
      if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Data is not an object'] }
      }
      
      const errors = []
      
      // Basic validation
      if (!data.metadata) {
        errors.push('Missing metadata')
      }
      
      if (!data.metadata.projectName) {
        errors.push('Missing project name')
      }
      
      if (!Array.isArray(data.metadata.years)) {
        errors.push('Missing or invalid years array')
      }
      
      return {
        valid: errors.length === 0,
        errors
      }
      
    } catch (error) {
      return { valid: false, errors: [error.message] }
    }
  }

  /**
   * Export data to JSON
   */
  exportData(data, filename = 'report-data-export.json') {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
      return true
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error exporting data:', error)
      return false
    }
  }

  /**
   * Clear all cached data for a project
   */
  clearProjectData(projectName) {
    try {
      this.calculationCache.clearCache(projectName)
      console.log('[REPORT SERVICE] Cleared all cached data for project:', projectName)
      return true
      
    } catch (error) {
      console.error('[REPORT SERVICE] Error clearing project data:', error)
      return false
    }
  }
}

// Create and export singleton instance
const reportDataService = new ReportDataService()

// Add debug functions to global scope for testing
if (typeof window !== 'undefined') {
  window.debugReportCache = (projectName) => {
    return reportDataService.debugCache(projectName)
  }
  
  window.reportDataService = reportDataService
}

export default reportDataService
