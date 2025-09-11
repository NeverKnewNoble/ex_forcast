import { ref, onMounted, watch } from 'vue'
import { selectedProject } from '@/components/utility/dashboard/projectService.js'
import { unifiedCacheService } from './unifiedCacheService.js'

/**
 * Composable hook for automatic page data recovery
 * Ensures data persistence across page refreshes
 */
export function usePageDataRecovery(pageId, options = {}) {
  const {
    autoRecover = true,
    showRecoveryStatus = true,
    onDataRecovered = null,
    onRecoveryFailed = null
  } = options

  // State
  const isRecovering = ref(false)
  const recoveryStatus = ref('idle') // 'idle' | 'recovering' | 'success' | 'failed'
  const recoveredDataCount = ref(0)
  const lastRecoveryTime = ref(null)
  const errors = ref([])

  // Recovery methods
  const recoverPageData = async () => {
    if (!selectedProject.value?.project_name) {
      console.warn('[RECOVERY] No project selected, skipping recovery')
      return
    }

    try {
      isRecovering.value = true
      recoveryStatus.value = 'recovering'
      errors.value = []

      // console.log(`[RECOVERY] Starting data recovery for page: ${pageId}`)

      // Wait for cache service to be ready
      if (!unifiedCacheService.isInitialized.value) {
        await unifiedCacheService.initialize()
      }

      // Load project cache
      await unifiedCacheService.loadProjectCache()

      // Get page-specific data
      const pageData = unifiedCacheService.cache.value[selectedProject.value.project_name]?.[pageId]
      
      if (pageData) {
        let count = 0
        // Count total entries for this page
        Object.values(pageData).forEach(row => {
          Object.values(row).forEach(year => {
            count += Object.keys(year).length
          })
        })
        
        recoveredDataCount.value = count
        lastRecoveryTime.value = new Date()
        recoveryStatus.value = 'success'
        
        // console.log(`[RECOVERY] Successfully recovered ${count} data entries for page: ${pageId}`)
        
        // Call success callback if provided
        if (onDataRecovered && typeof onDataRecovered === 'function') {
          onDataRecovered(pageData)
        }
      } else {
        // console.log(`[RECOVERY] No cached data found for page: ${pageId}`)
        recoveryStatus.value = 'success'
        recoveredDataCount.value = 0
      }

    } catch (error) {
      console.error(`[RECOVERY] Failed to recover data for page: ${pageId}:`, error)
      recoveryStatus.value = 'failed'
      errors.value.push({
        timestamp: new Date(),
        message: error.message,
        stack: error.stack
      })

      // Call error callback if provided
      if (onRecoveryFailed && typeof onRecoveryFailed === 'function') {
        onRecoveryFailed(error)
      }
    } finally {
      isRecovering.value = false
    }
  }

  const clearPageData = () => {
    if (!selectedProject.value?.project_name) return

    try {
      unifiedCacheService.clearCache(selectedProject.value.project_name, pageId)
      recoveredDataCount.value = 0
      lastRecoveryTime.value = null
      recoveryStatus.value = 'idle'
      // console.log(`[RECOVERY] Cleared page data for: ${pageId}`)
    } catch (error) {
      console.error(`[RECOVERY] Failed to clear page data:`, error)
    }
  }

  const getPageData = () => {
    if (!selectedProject.value?.project_name) return null
    
    return unifiedCacheService.cache.value[selectedProject.value.project_name]?.[pageId] || null
  }

  const getPageDataStats = () => {
    const pageData = getPageData()
    if (!pageData) return null

    let totalEntries = 0
    let totalRows = Object.keys(pageData).length
    let totalYears = 0

    Object.values(pageData).forEach(row => {
      Object.values(row).forEach(year => {
        totalEntries += Object.keys(year).length
        totalYears++
      })
    })

    return {
      pageId,
      totalEntries,
      totalRows,
      totalYears,
      lastRecoveryTime: lastRecoveryTime.value,
      status: recoveryStatus.value
    }
  }

  const validatePageData = () => {
    const pageData = getPageData()
    if (!pageData) return { valid: false, errors: ['No page data found'] }

    const errors = []
    
    // Basic validation
    if (typeof pageData !== 'object') {
      errors.push('Page data is not an object')
    }

    // Check for corrupted data structures
    Object.entries(pageData).forEach(([rowKey, rowData]) => {
      if (typeof rowData !== 'object') {
        errors.push(`Row ${rowKey} is not an object`)
        return
      }

      Object.entries(rowData).forEach(([yearKey, yearData]) => {
        if (typeof yearData !== 'object') {
          errors.push(`Year ${yearKey} in row ${rowKey} is not an object`)
          return
        }

        Object.entries(yearData).forEach(([labelKey, value]) => {
          if (typeof value !== 'number' && typeof value !== 'string') {
            errors.push(`Invalid value type for ${labelKey} in ${rowKey}/${yearKey}`)
          }
        })
      })
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Auto-recovery on mount
  onMounted(() => {
    if (autoRecover) {
      recoverPageData()
    }
  })

  // Watch for project changes to trigger recovery
  watch(selectedProject, (newProject) => {
    if (newProject && autoRecover) {
      recoverPageData()
    }
  }, { deep: true })

  // Return public API
  return {
    // State
    isRecovering,
    recoveryStatus,
    recoveredDataCount,
    lastRecoveryTime,
    errors,

    // Methods
    recoverPageData,
    clearPageData,
    getPageData,
    getPageDataStats,
    validatePageData,

    // Computed helpers
    hasData: () => recoveredDataCount.value > 0,
    isHealthy: () => recoveryStatus.value === 'success',
    needsRecovery: () => recoveryStatus.value === 'failed' || recoveryStatus.value === 'idle'
  }
}

/**
 * Enhanced version with automatic retry logic
 */
export function usePageDataRecoveryWithRetry(pageId, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    ...baseOptions
  } = options

  const baseRecovery = usePageDataRecovery(pageId, baseOptions)
  const retryCount = ref(0)
  const isRetrying = ref(false)

  const recoverWithRetry = async () => {
    if (isRetrying.value) return

    try {
      isRetrying.value = true
      retryCount.value = 0

      while (retryCount.value < maxRetries) {
        try {
          await baseRecovery.recoverPageData()
          
          if (baseRecovery.recoveryStatus.value === 'success') {
            // console.log(`[RECOVERY] Successfully recovered data on attempt ${retryCount.value + 1}`)
            return
          }
        } catch (error) {
          retryCount.value++
          console.warn(`[RECOVERY] Attempt ${retryCount.value} failed:`, error.message)
          
          if (retryCount.value < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount.value))
          }
        }
      }

      // All retries failed
      console.error(`[RECOVERY] All ${maxRetries} recovery attempts failed`)
      baseRecovery.recoveryStatus.value = 'failed'
      baseRecovery.errors.value.push({
        timestamp: new Date(),
        message: `All ${maxRetries} recovery attempts failed`,
        retryCount: retryCount.value
      })

    } finally {
      isRetrying.value = false
    }
  }

  // Override the base recovery method
  const enhancedRecovery = {
    ...baseRecovery,
    recoverPageData: recoverWithRetry,
    retryCount,
    isRetrying
  }

  return enhancedRecovery
}

/**
 * Specialized hook for form data recovery
 */
export function useFormDataRecovery(pageId, formFields, options = {}) {
  const {
    autoRestore = true,
    validateOnRestore = true,
    ...baseOptions
  } = options

  const baseRecovery = usePageDataRecovery(pageId, baseOptions)
  const restoredFields = ref(new Set())
  const formData = ref({})

  const restoreFormData = () => {
    if (!baseRecovery.hasData()) return

    const pageData = baseRecovery.getPageData()
    if (!pageData) return

    try {
      formFields.forEach(field => {
        const { key, defaultValue = '', transform = null } = field
        
        // Try to find the field value in cache
        let value = defaultValue
        
        // Search through cached data for this field
        Object.values(pageData).forEach(row => {
          Object.values(row).forEach(year => {
            if (year[key] !== undefined) {
              value = year[key]
            }
          })
        })

        // Apply transformation if provided
        if (transform && typeof transform === 'function') {
          value = transform(value)
        }

        // Set the form data
        formData.value[key] = value
        restoredFields.value.add(key)
      })

      // console.log(`[FORM RECOVERY] Restored ${restoredFields.value.size} form fields`)
      
      // Validate restored data if requested
      if (validateOnRestore) {
        const validation = validateFormData()
        if (!validation.valid) {
          console.warn('[FORM RECOVERY] Validation warnings:', validation.warnings)
        }
      }

    } catch (error) {
      console.error('[FORM RECOVERY] Failed to restore form data:', error)
    }
  }

  const validateFormData = () => {
    const warnings = []
    
    formFields.forEach(field => {
      const { key, required = false, validator = null } = field
      const value = formData.value[key]

      if (required && (value === undefined || value === null || value === '')) {
        warnings.push(`Required field ${key} is missing`)
      }

      if (validator && typeof validator === 'function') {
        try {
          const validationResult = validator(value)
          if (!validationResult.valid) {
            warnings.push(`Field ${key} validation failed: ${validationResult.message}`)
          }
        } catch (error) {
          warnings.push(`Field ${key} validator error: ${error.message}`)
        }
      }
    })

    return {
      valid: warnings.length === 0,
      warnings
    }
  }

  const clearFormData = () => {
    formData.value = {}
    restoredFields.value.clear()
    baseRecovery.clearPageData()
  }

  // Auto-restore on successful recovery
  watch(() => baseRecovery.recoveryStatus.value, (status) => {
    if (status === 'success' && autoRestore) {
      restoreFormData()
    }
  })

  return {
    ...baseRecovery,
    formData,
    restoredFields,
    restoreFormData,
    validateFormData,
    clearFormData
  }
}
