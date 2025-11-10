/**
 * useReportPage Composable
 * 
 * Centralized logic for all report pages to eliminate code duplication.
 * Handles year selection, data loading, advanced settings, and UI state management.
 * 
 * @returns {Object} Reactive state and handler functions for report pages
 */

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useYearSettingsStore } from '@/components/utility/_master_utility/yearSettingsStore.js'
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js'
import { getVisibleYears, loadYearOptions } from '@/components/utility/expense_assumption/index.js'
import alertService from '@/components/ui/ui_utility/alertService.js'
import reportDataService from '@/components/utility/reports/reportDataService.js'

export function useReportPage(options = {}) {
  const {
    reportName = 'Report',
    loadDataOnMount = true,
    showSuccessAlert = true,
    enableAdvancedSettings = true
  } = options

  // ============================================================================
  // REACTIVE STATE
  // ============================================================================
  const years = ref([])
  const showAdvanced = ref(false)
  const tempAdvancedModes = ref({})
  const showSettingsModal = ref(false)
  const dataLoading = ref(false)
  const dataError = ref(null)
  const dataCompleteness = ref(0)

  // ============================================================================
  // PINIA STORE
  // ============================================================================
  const yearSettingsStore = useYearSettingsStore()
  const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore)
  const { setFromYear, setToYear, setAdvancedModes, clearYearSettings } = yearSettingsStore

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  const visibleYears = computed(() => {
    return getVisibleYears(fromYear.value, toYear.value)
  })

  const hasData = computed(() => dataCompleteness.value > 0)

  const canLoadData = computed(() => 
    selectedProject.value && visibleYears.value.length > 0
  )

  // ============================================================================
  // DATA LOADING
  // ============================================================================
  
  /**
   * Loads report data from the backend service
   * Properly handles loading states, errors, and completion tracking
   */
  async function loadReportData() {
    if (!canLoadData.value) {
      return
    }

    try {
      dataLoading.value = true
      dataError.value = null
      
      const unifiedData = await reportDataService.getReportData(
        selectedProject.value.project_name, 
        visibleYears.value
      )
      
      dataCompleteness.value = unifiedData.metadata?.dataCompleteness || 0
      
      if (showSuccessAlert && dataCompleteness.value > 0) {
        alertService.success(
          `${reportName} data loaded successfully (${dataCompleteness.value}% complete)`
        )
      }
    } catch (error) {
      console.error(`Error loading ${reportName} data:`, error)
      dataError.value = error.message
      alertService.error(`Failed to load ${reportName} data: ${error.message}`)
    } finally {
      dataLoading.value = false
    }
  }

  /**
   * Refreshes report data without full page reload
   * Maintains application state while refreshing data
   */
  async function refreshTable() {
    dataCompleteness.value = 0
    await loadReportData()
  }

  // ============================================================================
  // YEAR SELECTION HANDLERS
  // ============================================================================
  
  function clearYearSelection() {
    clearYearSettings()
    dataCompleteness.value = 0
  }

  // ============================================================================
  // ADVANCED SETTINGS HANDLERS
  // ============================================================================
  
  function openAdvancedSettings() {
    if (!visibleYears.value.length) {
      alertService.warning('Please select years before configuring advanced settings')
      return
    }
    tempAdvancedModes.value = { ...advancedModes.value }
    showAdvanced.value = true
  }

  function applyAdvancedSettings() {
    setAdvancedModes({ ...tempAdvancedModes.value })
    showAdvanced.value = false
    alertService.success('Advanced settings applied')
  }

  function cancelAdvancedSettings() {
    tempAdvancedModes.value = {}
    showAdvanced.value = false
  }

  // ============================================================================
  // EXPORT & PRINT FUNCTIONALITY
  // ============================================================================
  
  function exportTableData() {
    alertService.info('Export functionality is coming soon.')
  }

  function printTable() {
    try {
      window.print()
    } catch (error) {
      console.error('Error triggering print:', error)
      alertService.error('Failed to open print dialog.')
    }
  }

  // ============================================================================
  // SETTINGS MODAL HANDLERS
  // ============================================================================
  
  const openSettings = () => {
    showSettingsModal.value = true
  }

  const closeSettings = () => {
    showSettingsModal.value = false
  }

  // ============================================================================
  // KEYBOARD ACCESSIBILITY
  // ============================================================================
  
  /**
   * Handles Escape key to close modals for better accessibility
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      if (showAdvanced.value) {
        cancelAdvancedSettings()
      } else if (showSettingsModal.value) {
        closeSettings()
      }
    }
  }

  // ============================================================================
  // WATCHERS
  // ============================================================================
  
  /**
   * Watch visible years and initialize advanced modes
   * Only load data when years actually change to prevent unnecessary API calls
   */
  watch(visibleYears, async (newYears, oldYears) => {
    // Initialize advanced modes for new years
    newYears.forEach(year => {
      if (!advancedModes.value[year]) {
        yearSettingsStore.setAdvancedMode(year, 'monthly')
      }
    })
    
    // Only load if years actually changed
    const yearsChanged = !oldYears || 
                        oldYears.length === 0 || 
                        JSON.stringify(newYears) !== JSON.stringify(oldYears)
    
    if (selectedProject.value && newYears.length > 0 && yearsChanged) {
      await loadReportData()
    }
  })

  /**
   * Watch project changes and reload data
   * Reset completeness when project changes
   */
  watch(selectedProject, async (newProject, oldProject) => {
    if (newProject && newProject !== oldProject) {
      dataCompleteness.value = 0
      if (visibleYears.value.length > 0) {
        await loadReportData()
      }
    }
  })

  /**
   * Copy current advanced modes when opening modal
   */
  watch(showAdvanced, (val) => {
    if (val) {
      tempAdvancedModes.value = { ...advancedModes.value }
    }
  })

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  onMounted(async () => {
    try {
      await initializeProjectService()
      years.value = await loadYearOptions()
      
      // Add keyboard event listener for accessibility
      window.addEventListener('keydown', handleEscapeKey)
      
      // Auto-load report data if conditions are met
      if (loadDataOnMount && selectedProject.value && visibleYears.value.length > 0) {
        await loadReportData()
      }
    } catch (err) {
      console.error(`Error initializing ${reportName}:`, err)
      alertService.error(`Failed to initialize ${reportName}`)
    }
  })

  onUnmounted(() => {
    // Cleanup keyboard listener
    window.removeEventListener('keydown', handleEscapeKey)
  })

  // ============================================================================
  // RETURN PUBLIC API
  // ============================================================================
  
  return {
    // State
    years,
    showAdvanced,
    tempAdvancedModes,
    showSettingsModal,
    dataLoading,
    dataError,
    dataCompleteness,
    visibleYears,
    hasData,
    canLoadData,
    
    // Store refs
    fromYear,
    toYear,
    advancedModes,
    
    // Store methods
    setFromYear,
    setToYear,
    
    // Handlers
    clearYearSelection,
    loadReportData,
    refreshTable,
    openAdvancedSettings,
    applyAdvancedSettings,
    cancelAdvancedSettings,
    exportTableData,
    printTable,
    openSettings,
    closeSettings,
    
    // Direct refs for compatibility
    selectedProject
  }
}

