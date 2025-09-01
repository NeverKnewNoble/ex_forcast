import { ref, watch } from 'vue'
import { selectedProject } from '@/components/utility/dashboard/projectService.js'

/**
 * Unified Caching Service for consistent data persistence
 * Handles both Pinia stores and localStorage with proper error handling
 */
export class UnifiedCacheService {
  constructor() {
    this.cache = ref({})
    this.isInitialized = ref(false)
    this.errorState = ref(null)
    
    // Watch for project changes to reload cache
    watch(selectedProject, () => {
      this.loadProjectCache()
    }, { deep: true })
  }

  /**
   * Initialize the cache service
   */
  async initialize() {
    try {
      await this.loadProjectCache()
      this.isInitialized.value = true
      // console.log('[CACHE] Service initialized successfully')
    } catch (error) {
      console.error('[CACHE] Initialization failed:', error)
      this.errorState.value = error.message
    }
  }

  /**
   * Get project-specific cache key
   */
  getProjectKey(baseKey) {
    const project = selectedProject.value
    if (!project || !project.project_name) {
      return baseKey
    }
    return `${baseKey}_${project.project_name}`
  }

  /**
   * Set cache value with automatic persistence
   */
  setValue(projectId, pageId, rowCode, year, label, value) {
    try {
      // Update in-memory cache
      if (!this.cache.value[projectId]) this.cache.value[projectId] = {}
      if (!this.cache.value[projectId][pageId]) this.cache.value[projectId][pageId] = {}
      if (!this.cache.value[projectId][pageId][rowCode]) this.cache.value[projectId][pageId][rowCode] = {}
      if (!this.cache.value[projectId][pageId][rowCode][year]) this.cache.value[projectId][pageId][rowCode][year] = {}
      
      this.cache.value[projectId][pageId][rowCode][year][label] = value

      // Persist to localStorage
      this.persistToStorage(projectId, pageId, rowCode, year, label, value)
      
      console.log('[CACHE SET]', { projectId, pageId, rowCode, year, label, value })
    } catch (error) {
      console.error('[CACHE] Error setting value:', error)
      this.errorState.value = error.message
    }
  }

  /**
   * Get cache value with fallback
   */
  getValue(projectId, pageId, rowCode, year, label) {
    try {
      // Try in-memory cache first
      const inMemoryValue = this.cache.value?.[projectId]?.[pageId]?.[rowCode]?.[year]?.[label]
      if (inMemoryValue !== undefined) {
        return inMemoryValue
      }

      // Fallback to localStorage
      const storedValue = this.getFromStorage(projectId, pageId, rowCode, year, label)
      if (storedValue !== null) {
        // Restore to in-memory cache
        this.setValue(projectId, pageId, rowCode, year, label, storedValue)
        return storedValue
      }

      return 0.00
    } catch (error) {
      console.error('[CACHE] Error getting value:', error)
      return 0.00
    }
  }

  /**
   * Get all values for a specific row
   */
  getRowValues(projectId, pageId, rowCode) {
    try {
      // Try in-memory cache first
      const inMemoryValues = this.cache.value?.[projectId]?.[pageId]?.[rowCode]
      if (inMemoryValues) {
        return inMemoryValues
      }

      // Fallback to localStorage
      return this.getRowFromStorage(projectId, pageId, rowCode)
    } catch (error) {
      console.error('[CACHE] Error getting row values:', error)
      return {}
    }
  }

  /**
   * Clear cache for specific scope
   */
  clearCache(projectId, pageId = null, rowCode = null, year = null) {
    try {
      if (!projectId) {
        // Clear all cache
        this.cache.value = {}
        this.clearAllStorage()
        // console.log('[CACHE CLEAR] All cache cleared')
        return
      }
      
      if (!pageId) {
        // Clear all cache for a project
        delete this.cache.value[projectId]
        this.clearProjectStorage(projectId)
        // console.log('[CACHE CLEAR] Project cache cleared:', projectId)
        return
      }
      
      if (!rowCode) {
        // Clear all cache for a page
        if (this.cache.value[projectId]) {
          delete this.cache.value[projectId][pageId]
          this.clearPageStorage(projectId, pageId)
          // console.log('[CACHE CLEAR] Page cache cleared:', { projectId, pageId })
        }
        return
      }
      
      if (!year) {
        // Clear all cache for a row
        if (this.cache.value[projectId]?.[pageId]) {
          delete this.cache.value[projectId][pageId][rowCode]
          this.clearRowStorage(projectId, pageId, rowCode)
          // console.log('[CACHE CLEAR] Row cache cleared:', { projectId, pageId, rowCode })
        }
        return
      }
      
      // Clear specific cache entry
      if (this.cache.value[projectId]?.[pageId]?.[rowCode]?.[year]) {
        delete this.cache.value[projectId][pageId][rowCode][year]
        this.clearYearStorage(projectId, pageId, rowCode, year)
        // console.log('[CACHE CLEAR] Year cache cleared:', { projectId, pageId, rowCode, year })
      }
    } catch (error) {
      console.error('[CACHE] Error clearing cache:', error)
    }
  }

  /**
   * Load project-specific cache from localStorage
   */
  async loadProjectCache() {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) {
        this.cache.value = {}
        return
      }

      // Load from localStorage
      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        this.cache.value = parsed
        // console.log('[CACHE] Loaded from storage:', storageKey)
      } else {
        this.cache.value = {}
        // console.log('[CACHE] No stored cache found for project:', project.project_name)
      }
    } catch (error) {
      console.error('[CACHE] Error loading project cache:', error)
      this.cache.value = {}
      this.errorState.value = error.message
    }
  }

  /**
   * Persist cache to localStorage
   */
  persistToStorage(projectId, pageId, rowCode, year, label, value) {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return

      const storageKey = this.getProjectKey('calculationCache')
      localStorage.setItem(storageKey, JSON.stringify(this.cache.value))
    } catch (error) {
      console.error('[CACHE] Error persisting to storage:', error)
      this.errorState.value = error.message
    }
  }

  /**
   * Get value from localStorage
   */
  getFromStorage(projectId, pageId, rowCode, year, label) {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return null

      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.[projectId]?.[pageId]?.[rowCode]?.[year]?.[label] ?? null
      }
      
      return null
    } catch (error) {
      console.error('[CACHE] Error reading from storage:', error)
      return null
    }
  }

  /**
   * Get row values from localStorage
   */
  getRowFromStorage(projectId, pageId, rowCode) {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return {}

      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.[projectId]?.[pageId]?.[rowCode] ?? {}
      }
      
      return {}
    } catch (error) {
      console.error('[CACHE] Error reading row from storage:', error)
      return {}
    }
  }

  /**
   * Clear storage methods
   */
  clearAllStorage() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('calculationCache')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('[CACHE] Error clearing all storage:', error)
    }
  }

  clearProjectStorage(projectId) {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return

      const storageKey = this.getProjectKey('calculationCache')
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.error('[CACHE] Error clearing project storage:', error)
    }
  }

  clearPageStorage(projectId, pageId) {
    // This would require partial updates to localStorage
    // For now, we'll just persist the updated cache
    this.persistToStorage()
  }

  clearRowStorage(projectId, pageId, rowCode) {
    // This would require partial updates to localStorage
    // For now, we'll just persist the updated cache
    this.persistToStorage()
  }

  clearYearStorage(projectId, pageId, rowCode, year) {
    // This would require partial updates to localStorage
    // For now, we'll just persist the updated cache
    this.persistToStorage()
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return null

      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        const projectCache = parsed[project.project_name] || {}
        
        let totalEntries = 0
        let totalPages = Object.keys(projectCache).length
        
        Object.values(projectCache).forEach(page => {
          Object.values(page).forEach(row => {
            Object.values(row).forEach(year => {
              totalEntries += Object.keys(year).length
            })
          })
        })
        
        return {
          project: project.project_name,
          pages: totalPages,
          entries: totalEntries,
          storageSize: stored.length,
          lastUpdated: new Date().toISOString()
        }
      }
      
      return null
    } catch (error) {
      console.error('[CACHE] Error getting cache stats:', error)
      return null
    }
  }

  /**
   * Validate cache integrity
   */
  validateCache() {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return { valid: false, errors: ['No project selected'] }

      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (!stored) return { valid: true, errors: [] }
      
      const parsed = JSON.parse(stored)
      const errors = []
      
      // Basic validation
      if (typeof parsed !== 'object') {
        errors.push('Cache is not an object')
      }
      
      if (parsed[project.project_name] && typeof parsed[project.project_name] !== 'object') {
        errors.push('Project cache is not an object')
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
   * Export cache data
   */
  exportCache() {
    try {
      const project = selectedProject.value
      if (!project || !project.project_name) return null

      const storageKey = this.getProjectKey('calculationCache')
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const data = {
          project: project.project_name,
          timestamp: new Date().toISOString(),
          data: JSON.parse(stored)
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cache-export-${project.project_name}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('[CACHE] Error exporting cache:', error)
    }
  }

  /**
   * Import cache data
   */
  importCache(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            const project = selectedProject.value
            
            if (!project || !project.project_name) {
              reject(new Error('No project selected'))
              return
            }
            
            if (data.project !== project.project_name) {
              reject(new Error('Cache data is for a different project'))
              return
            }
            
            // Validate the imported data
            const validation = this.validateImportedData(data.data)
            if (!validation.valid) {
              reject(new Error(`Invalid cache data: ${validation.errors.join(', ')}`))
              return
            }
            
            // Import the data
            this.cache.value = data.data
            this.persistToStorage()
            
            console.log('[CACHE] Cache imported successfully')
            resolve()
          } catch (error) {
            reject(new Error(`Failed to parse cache file: ${error.message}`))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Validate imported cache data
   */
  validateImportedData(data) {
    try {
      if (typeof data !== 'object') {
        return { valid: false, errors: ['Data is not an object'] }
      }
      
      // Add more validation as needed
      return { valid: true, errors: [] }
    } catch (error) {
      return { valid: false, errors: [error.message] }
    }
  }
}

// Create singleton instance
export const unifiedCacheService = new UnifiedCacheService()

// Export the service instance
export default unifiedCacheService
