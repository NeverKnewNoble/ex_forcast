<template>
  <div class="flex">
    <Sidebar @open-settings="openSettings" />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50 dark:from-[#0f0f12] dark:to-[#0f0f12]">
      <!-- Main Content Area -->
      <div class="relative p-4">
        <!-- Report Controls -->
        <ReportControls
          :title="reportConfig.title"
          :subtitle="reportConfig.subtitle"
          :icon="reportConfig.icon"
          :years="years"
          :from-year="fromYear"
          :to-year="toYear"
          :data-loading="dataLoading"
          :data-error="dataError"
          :data-completeness="dataCompleteness"
          @update:from-year="setFromYear"
          @update:to-year="setToYear"
          @clear-years="clearYearSelection"
          @show-advanced="openAdvancedSettings"
          @load-data="loadReportData"
          @refresh="refreshTable"
          @export="exportTableData"
          @print="printTable"
        />

        <!-- Content Area -->
        <div class="p-0">
          <!-- No Project Selected State -->
          <div v-if="!selectedProject">
            <ReportsNoProjectSelectedState />
          </div>

          <!-- No Years Selected State -->
          <div v-else-if="!visibleYears.length" class="mt-28">
            <ReportsNoYearsSelectedState />
          </div>

          <!-- Report Content - Implemented -->
          <div v-else-if="reportConfig.isImplemented" class="mt-28">
            <component :is="reportConfig.component" :visible-years="visibleYears" />
          </div>

          <!-- Report Content - Not Yet Implemented -->
          <div v-else class="mt-28 p-8 text-center text-gray-500">
            <component :is="reportConfig.icon" class="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 class="text-lg font-medium mb-2">Report Not Yet Implemented</h3>
            <p class="text-sm">The {{ reportConfig.title }} is under development.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Advanced Settings Modal -->
  <transition name="fade">
    <div
      v-if="showAdvanced && reportConfig.enableAdvancedSettings"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="advanced-settings-title"
      @click.self="cancelAdvancedSettings"
    >
      <div 
        class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden dark:bg-[#151823] dark:border-violet-900/40"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <Settings class="w-4 h-4 text-white" aria-hidden="true" />
          <h2 id="advanced-settings-title" class="text-xl font-bold text-white">
            Advanced Display Mode Settings
          </h2>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pt-6">
          <!-- Message when no years selected -->
          <div 
            v-if="!visibleYears.length" 
            class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3"
            role="alert"
          >
            <AlertTriangle class="w-4 h-4 text-red-600" aria-hidden="true" />
            <span class="text-yellow-800 font-medium">
              Please select both "From Year" and "To Year" to configure advanced settings.
            </span>
          </div>

          <!-- Year settings list -->
          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'adv-' + year"
              class="flex justify-between items-center border-b pb-2 dark:border-[#1F2430]"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2 dark:text-gray-200">
                <Calendar class="w-3 h-3 text-gray-500" aria-hidden="true" />
                {{ year }}
              </span>
              <label class="sr-only" :for="`mode-${year}`">Display mode for {{ year }}</label>
              <select
                :id="`mode-${year}`"
                v-model="tempAdvancedModes[year]"
                class="px-6 py-2 border rounded-md focus:ring-violet-500 dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                :aria-label="`Display mode for ${year}`"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100 dark:bg-[#111318] dark:border-violet-900/40">
          <button
            @click="cancelAdvancedSettings"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 dark:bg-[#0f0f12] dark:hover:bg-[#151823] dark:text-gray-300"
            aria-label="Cancel advanced settings"
          >
            <X class="w-4 h-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            v-if="visibleYears.length"
            @click="applyAdvancedSettings"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
            aria-label="Apply advanced settings"
          >
            <Check class="w-4 h-4 text-green-600" aria-hidden="true" />
            Apply
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Settings Modal -->
  <SettingsModal 
    :is-visible="showSettingsModal" 
    @close="closeSettings"
  />
</template>

<script setup>
import { computed } from 'vue'

// Composables
import { useReportPage } from '@/composables/useReportPage.js'

// Components
import Sidebar from '@/components/ui/Sidebar.vue'
import ReportControls from '@/components/ui/reports/ReportControls.vue'
import ReportsNoProjectSelectedState from '@/components/ui/reports/ReportsNoProjectSelectedState.vue'
import ReportsNoYearsSelectedState from '@/components/ui/reports/ReportsNoYearsSelectedState.vue'
import SettingsModal from '@/components/ui/SettingsModal.vue'

// Icons
import { 
  AlertTriangle,
  Calendar,
  Settings,
  X,
  Check
} from 'lucide-vue-next'

// Props
const props = defineProps({
  /**
   * Report configuration object
   * Must include: id, title, subtitle, icon, component, isImplemented, enableAdvancedSettings, loadDataOnMount
   */
  reportConfig: {
    type: Object,
    required: true,
    validator: (config) => {
      return config.id && 
             config.title && 
             config.subtitle && 
             config.icon &&
             typeof config.isImplemented === 'boolean' &&
             typeof config.enableAdvancedSettings === 'boolean' &&
             typeof config.loadDataOnMount === 'boolean'
    }
  }
})

// ============================================================================
// COMPOSABLE - All shared logic extracted
// ============================================================================

const {
  // State
  years,
  showAdvanced,
  tempAdvancedModes,
  showSettingsModal,
  dataLoading,
  dataError,
  dataCompleteness,
  visibleYears,
  
  // Store refs
  fromYear,
  toYear,
  
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
  
  // Direct refs
  selectedProject
} = useReportPage({
  reportName: props.reportConfig.title,
  loadDataOnMount: props.reportConfig.loadDataOnMount,
  showSuccessAlert: props.reportConfig.isImplemented,
  enableAdvancedSettings: props.reportConfig.enableAdvancedSettings
})
</script>

<style scoped>
/* Component-specific styles only - transitions are now global */
</style>

