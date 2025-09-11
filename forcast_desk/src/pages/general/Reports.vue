<template>
    <div class="flex">
      <Sidebar @open-settings="openSettings" />
  
      <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50 dark:from-[#0f0f12] dark:to-[#0f0f12]">
        <!-- Main Content Area -->
        <div class="relative p-4">
          <!-- Top Filters and Controls -->
          <div v-if="visibleYears.length" class="absolute top-4 left-4 z-30 w-[660px] max-w-[95vw] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-violet-200/60 shadow-2xl ring-1 ring-violet-300/30 dark:bg-[#151823]/80 dark:border-violet-900/40 dark:ring-violet-900/30">
            <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 class="text-xl font-bold">Reports</h1>
                  <p class="text-xs opacity-80">Manage and configure your reports</p>
                </div>
              </div>
              <!-- Collapse/Expand Button (collapses upward) -->
              <button 
                @click="sidebarCollapsed = !sidebarCollapsed" 
                class="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
              >
                <ChevronUp v-if="!sidebarCollapsed" class="w-5 h-5 text-white" />
                <ChevronDown v-else class="w-5 h-5 text-white" />
                <span class="text-sm font-medium">{{ sidebarCollapsed ? 'Expand' : 'Collapse' }}</span>
              </button>
            </div>
  
            <transition name="fade">
              <div v-show="!sidebarCollapsed" class="px-5 pb-5 bg-white/70 dark:bg-[#151823]/70">
                
                
                <!-- Report Selection Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 dark:text-gray-200">
                    <FileText class="w-4 h-4 text-violet-600" />
                    {{ selectedReport ? 'Current Report' : 'Select Report' }}
                  </h3>
                  <div class="w-full">
                    <select 
                      v-model="selectedReport" 
                      class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm shadow-sm dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                    >
                      <option value="">Select a report...</option>
                      <option value="room-pnl">Room Profit & Loss</option>
                      <option value="fnb-pnl">Food And Beverage Profit & Loss</option>
                      <option value="ood-pnl">Other Operating Departments Profit & Loss</option>
                      <option value="pl-statement">Profit And Loss Statement</option>
                      <option value="balance-sheet">Balance Sheet</option>
                      <option value="cashflow">Cashflow</option>
                      <option value="capex-schedule">Capex Schedule</option>
                    </select>
                  </div>
                  <div v-if="selectedReport" class="mt-2 flex gap-2">
                    <button 
                      @click="clearSelectedReport"
                      class="flex items-center gap-1 px-2 py-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-700 hover:bg-violet-50 rounded transition-all"
                    >
                      <RefreshCw class="w-3 h-3" />
                      Change Report
                    </button>
                  </div>
                </div>

                <!-- Data Status Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 dark:text-gray-200">
                    <Database class="w-4 h-4 text-violet-600" />
                    Data Status
                  </h3>
                  
                  <!-- Loading State -->
                  <div v-if="dataLoading" class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-900/30">
                    <Loader2 class="w-4 h-4 text-blue-600 animate-spin" />
                    <span class="text-sm text-blue-700">Loading report data...</span>
                  </div>
                  
                  <!-- Error State -->
                  <div v-else-if="dataError" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-900/30">
                    <AlertCircle class="w-4 h-4 text-red-600" />
                    <span class="text-sm text-red-700">{{ dataError }}</span>
                    <button 
                      @click="loadReportData"
                      class="ml-auto px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40"
                    >
                      Retry
                    </button>
                  </div>
                  
                  <!-- Success State -->
                  <div v-else-if="dataCompleteness > 0" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-900/30">
                    <CheckCircle class="w-4 h-4 text-green-600" />
                    <span class="text-sm text-green-700">Data loaded successfully</span>
                    <div class="ml-auto flex items-center gap-2">
                      <span class="text-xs text-green-600">{{ dataCompleteness }}% complete</span>
                      <button 
                        @click="loadReportData"
                        class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                  
                  <!-- No Data State -->
                  <div v-else class="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-900/30">
                    <AlertTriangle class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-yellow-700">No report data available</span>
                    <button 
                      @click="loadReportData"
                      class="ml-auto px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-all dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
                    >
                      Load Data
                    </button>
                  </div>
                </div>

                <!-- Action Buttons Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 dark:text-gray-200">
                    <Plus class="w-4 h-4 text-violet-600" />
                    Quick Actions
                  </h3>              
                  <div class="flex gap-2">
                    <button 
                      @click="refreshTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
                    >
                      <RefreshCw class="w-4 h-4" />
                      Refresh
                    </button>
                    <button 
                      @click="exportTableData"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
                    >
                      <Download class="w-4 h-4" />
                      Export
                    </button>
                    <button 
                      @click="printTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
                    >
                      <Printer class="w-4 h-4" />
                      Print
                    </button>
                  </div>
                  
                  <!-- Debug Section -->
                  <div class="mt-4 pt-4 border-t border-violet-200">
                    <h4 class="text-xs font-medium text-violet-600 mb-2">Debug Tools</h4>
                    <div class="flex gap-2">
                      <button 
                        @click="debugCache"
                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all text-xs font-medium"
                      >
                        <Database class="w-3 h-3" />
                        Debug Cache
                      </button>
                      <button 
                        @click="debugReportData"
                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-xs font-medium"
                      >
                        <FileText class="w-3 h-3" />
                        Debug Reports
                      </button>
                    </div>
                  </div>
                </div>
  
                <!-- Filters Section -->
                <div>
                  <div class="bg-white/90 rounded-xl p-5 border border-violet-100 shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 dark:text-gray-200">
                      <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                      </svg>
                      Year Range Filter
                    </h3>
                    
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 dark:text-gray-300">
                            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            From Year
                          </label>
                          <select 
                            disabled
                            v-model="fromYear" 
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                          >
                            <option value="">Select Year</option>
                            <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                          </select>
                        </div>
  
                        <div>
                          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 dark:text-gray-300">
                            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            To Year
                          </label>
                          <select 
                            disabled
                            v-model="toYear" 
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                          >
                            <option value="">Select Year</option>
                            <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                          </select>
                        </div>
                      </div>
  
                      <div class="flex gap-2">
                        <button 
                          @click="clearYearSelection" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/90 text-gray-700 border border-violet-200 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:text-gray-300 dark:border-violet-900/40 dark:hover:bg-[#151823]/90"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Clear
                        </button>
                        <button 
                          @click="showAdvanced = true" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 text-sm font-medium shadow"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Advanced
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
  
          <!-- Down Side - Table Area -->
          <div class="p-0">
          <!-- No Project Selected State -->
            <div v-if="expenseData.status === 'no_project_selected'">
              <NoProjectSelectedState />
            </div>

            <!-- Error State -->
            <div v-else-if="expenseData.status === 'error'">
              <ErrorState :message="expenseData.message" @retry="refreshTable" />
            </div>

            <!-- Report Selection State -->
            <div v-else-if="!selectedReport" class="mt-28">
              <ReportSelector @report-selected="handleReportSelection" />
            </div>

            <!-- Table Header with Stats -->
            <template v-else-if="visibleYears.length">
              <div class="mb-4">

              </div>

              <!-- Modern Table Container -->
              <div v-if="selectedReport === 'room-pnl'" class="mt-28">
                <RoomProfitLoss :visible-years="visibleYears" />
                            </div>
              
              <div v-else-if="selectedReport === 'fnb-pnl'" class="mt-28">
                <FoodBeverageProfitLoss :visible-years="visibleYears" />
              </div>
              
              <!-- Placeholder for other report types -->
              <div v-else class="mt-28 p-8 text-center text-gray-500">
                <FileText class="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 class="text-lg font-medium mb-2">Report Not Implemented</h3>
                <p class="text-sm">The {{ selectedReport }} report is not yet implemented.</p>
                            </div>
                                </template>
                            </div>
                            </div>
                            </div>
    </div>
  
    <!-- Advanced Setting Modal -->
    <transition name="fade">
      <div
        v-if="showAdvanced"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden dark:bg-[#151823] dark:border-violet-900/40">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <Settings class="w-4 h-4 text-white" />
            <h2 class="text-xl font-bold text-white">Advanced Display Mode Settings</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <!-- Message when no years selected -->
            <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle class="w-4 h-4 text-red-600" />
              <span class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure advanced settings.</span>
            </div>
  
            <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
              <div
                v-for="year in visibleYears"
                :key="'adv-' + year"
                class="flex justify-between items-center border-b pb-2 dark:border-[#1F2430]"
              >
                <span class="font-medium text-gray-700 flex items-center gap-2 dark:text-gray-200">
                  <Calendar class="w-3 h-3 text-gray-500" />
                  {{ year }}
                </span>
                <select
                  v-model="tempAdvancedModes[year]"
                  class="px-6 py-2 border rounded-md focus:ring-violet-500 dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
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
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              v-if="visibleYears.length"
              @click="applyAdvancedSettings"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
            >
              <Check class="w-4 h-4 text-green-600" />
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
  // ============================================================================
  // IMPORTS
  // ============================================================================
  import { ref, onMounted, computed, watch, onUnmounted } from "vue";
  import { storeToRefs } from 'pinia';
  import { cloneDeep } from 'lodash-es';

  // Store imports
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';

  // Component imports
  import Sidebar from "@/components/ui/Sidebar.vue";
  import NoProjectSelectedState from '@/components/ui/expense/NoProjectSelectedState.vue';
  import ErrorState from '@/components/ui/expense/ErrorState.vue';
  import NoYearsSelectedState from '@/components/ui/reports/NoYearsSelectedState.vue';
  import ReportSelector from '@/components/ui/reports/ReportSelector.vue';
  import SettingsModal from "@/components/ui/SettingsModal.vue";
  import RoomProfitLoss from '@/components/ui/reports/RoomProfitLoss.vue';
  import FoodBeverageProfitLoss from '@/components/ui/reports/FoodBeverageProfitLoss.vue';
  
  // Icon imports
  import { 
    AlertTriangle, 
    BookOpen, 
    Table, 
    Download, 
    Printer,
    RefreshCw, 
    FolderOpen, 
    Receipt, 
    Tag, 
    ChevronDown, 
    ChevronRight, 
    ChevronLeft, 
    ChevronUp,
    Hash, 
    Calendar, 
    ArrowLeft, 
    Settings, 
    X, 
    Check, 
    PlusCircle,  
    Trash2, 
    DollarSign, 
    Percent,
    CircleAlert,
    AlertCircle,
    Save,
    Loader2,
    FileText,
    Plus,
    Database,
    CheckCircle
  } from 'lucide-vue-next';
  
  // Service imports
  import alertService from "@/components/ui/ui_utility/alertService.js";
  import reportDataService from "@/components/utility/reports/reportDataService.js";
  
  // Utility imports
  import {
    // Core calculations
    getVisibleYears,
    getColumnLabels,
    
    // Data loading and API services
    loadYearOptions,
    
    // Table display and interaction
    toggleCollapse,
    isYearCollapsed,
    
    // Filter and validation utilities
    months,
  } from "@/components/utility/expense_assumption/index.js";
  
  import {
    calculateCategoryTotal,
    formatAmountInput,
    cleanAmountValue,
    handleCellEdit,
    handleCellInput,
    handleCellFocus,
    calculateCategoryMonthTotal
  } from "@/components/utility/expense_assumption/expense_estimate_utils.js";
  
  import { selectedProject, initializeProjectService, getProjectDepartments } from '@/components/utility/dashboard/projectService.js';
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  // Month labels and quarter utilities
  import { monthLabels as monthlyBaseLabels, quarterToMonths } from '@/components/utility/expense_assumption/expense_formular.js';
  import { allowOnlyNumbers } from '@/components/utility/payroll/index.js';
  
  // ============================================================================
  // REACTIVE STATE
  // ============================================================================
  const years = ref([]);
  const displayMode = ref("monthly");
  const expenses = ref([]);
  const expenseData = ref({});
  const allExpensesData = ref([]);
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalExpenseData = ref({});
  const changedCells = ref([]);
  const isSaving = ref(false);
  const saveError = ref("");
  const showUnsavedWarning = ref(false);
  const pendingNavigation = ref(null);
  const sidebarCollapsed = ref(true);
  const departments = ref([]); // Add departments state
  const calculationCache = useCalculationCache();
  
  // Report selection state - with persistence
  const getStoredReport = () => {
    try {
      return localStorage.getItem('selectedReport') || '';
    } catch (e) {
      console.warn('Could not access localStorage:', e);
      return '';
    }
  };

  const selectedReport = ref(getStoredReport());
  
  // Settings modal state
  const showSettingsModal = ref(false);
  
  // Report-specific state will be added here as needed
  const reportData = ref({});
  const dataLoading = ref(false);
  const dataError = ref(null);
  const dataCompleteness = ref(0);

  // Department management functions will be added here as needed
  
  // ============================================================================
  // PINIA STORE
  // ============================================================================
  const yearSettingsStore = useYearSettingsStore();
  const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
  const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;
  
  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  const visibleYears = computed(() => {
    const yearsArr = getVisibleYears(fromYear.value, toYear.value);
    return yearsArr;
  });
  
  const filteredToYears = computed(() => {
    return getFilteredToYears(years.value);
  });
  
  const groupedExpenses = computed(() => {
    // Use all expenses data to show all expenses, regardless of year data
    if (allExpensesData.value.length > 0) {
      return getAllExpensesGroupedByCategory(allExpensesData.value);
    }
    // Fallback to the old method if no all expenses data is available
    return getExpensesGroupedByCategory(expenseData.value, visibleYears.value);
  });
  
  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    // Get the base column labels
    const baseLabels = getColumnLabels(advancedModes.value[year] || displayMode.value);
    
    // Add the two extra columns (ex1 and ex2) before the Total column
    // This is specific to the Receipts_Payments page only
    return [...baseLabels, 'ex1', 'ex2'];
  };
  
  // =========================================================================
  // ROOMS REVENUE LOOKUP FROM PINIA CALCULATION CACHE
  // =========================================================================
  function getProjectName() {
    return selectedProject.value?.project_name || 'default';
  }

  function isMarketSegmentationEnabled() {
    try {
      return localStorage.getItem('marketSegmentation') === 'true';
    } catch (e) {
      return false;
    }
  }

  function getNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  function formatMoney(value) {
    return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // Report-specific calculation helpers will be added here as needed
  
  // ============================================================================
  // PAYMENTS HELPERS (moved to utility)
  // ============================================================================
  // Payment helpers will be added here as needed for specific reports
  
  // ============================================================================
  // WATCHERS
  // ============================================================================
  // Watch for changes in visible years to initialize advanced modes and load data
  watch(visibleYears, async (newYears, oldYears) => {
    // Initialize advanced modes for new years
    newYears.forEach(year => {
      if (!advancedModes.value[year]) {
        // Use Pinia action to set mode for new years
        yearSettingsStore.setAdvancedMode(year, displayMode.value);
      }
    });
    
    // Load report data when years change (if project is selected)
    if (selectedProject.value && newYears.length > 0 && 
        (!oldYears || oldYears.length === 0 || JSON.stringify(newYears) !== JSON.stringify(oldYears))) {
      await loadReportData();
    }
  });
  
  // Watch for project changes to reload data
  watch(selectedProject, async (newProject, oldProject) => {
    if (newProject && newProject !== oldProject) {
      try {
        // Reset data for new project
        expenseData.value = {};
        allExpensesData.value = [];
        expenses.value = [];
        reportData.value = {};
        dataCompleteness.value = 0;
        
        // Load departments for the new project
        await loadDepartments();
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        
        // Optionally reset report selection for new project
        // Uncomment the next line if you want to reset report selection on project change
        // selectedReport.value = '';
        
        alertService.success(`Switched to project: ${newProject.project_name}`);
        
        // Auto-load report data for the new project if years are selected
        if (visibleYears.value.length > 0) {
          await loadReportData();
        }
      } catch (error) {
        console.error("Error loading project data:", error);
        alertService.error("Failed to load project data. Please try again.");
      }
    }
  });
  
  // When opening the modal, copy the current settings
  watch(showAdvanced, (val) => {
    if (val) {
      tempAdvancedModes.value = { ...advancedModes.value };
    }
  });
  
  // Watch for unsaved changes to show warning on page refresh
  watch(isSaved, (newValue) => {
    if (!newValue) {
      // Add beforeunload event listener when there are unsaved changes
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      // Remove beforeunload event listener when changes are saved
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });

  // Watch for report selection changes to persist in localStorage
  watch(selectedReport, (newValue) => {
    try {
      if (newValue) {
        localStorage.setItem('selectedReport', newValue);
      } else {
        localStorage.removeItem('selectedReport');
      }
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  });
  
  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  onMounted(async () => {
    try {
      await initializeProjectService();
      years.value = await loadYearOptions();
      
      // Initialize with empty data
      expenseData.value = {};
      allExpensesData.value = [];
      expenses.value = [];
      reportData.value = {};
      
      isSaved.value = true;
      
      // Load departments and hydrate if a project is selected
      if (selectedProject.value) {
        await loadDepartments();
        
        // Auto-load report data if years are already selected
        if (visibleYears.value.length > 0) {
          await loadReportData();
        }
      }
      
      // Check if we should show refresh success alert
      if (localStorage.getItem('showRefreshSuccess') === 'true') {
        localStorage.removeItem('showRefreshSuccess');
        alertService.success("Page refreshed successfully");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  function clearYearSelection() {
    clearYearSettings();
    isSaved.value = false;
  }
  
  function handleCellEditWrapper({ year, label, expense, event }) {
    handleCellEdit({
      year,
      label,
      expense,
      event,
      originalExpenseData,
      changedCells,
      expenseData,
      isSaved
    });
  }
  
  // Wrapper functions to ensure addExpenseForm is properly initialized
  const formatAmountInputWrapper = (index, event) => {
    if (addExpenseForm && addExpenseForm.value && addExpenseForm.value.rows) {
      formatAmountInput(index, addExpenseForm, event);
    }
  };
  
  const cleanAmountValueWrapper = (index) => {
    if (addExpenseForm && addExpenseForm.value && addExpenseForm.value.rows) {
      cleanAmountValue(index, addExpenseForm);
    }
  };
  
  // Wrapper function for submitAddExpense
  const submitAddExpenseWrapper = async () => {
    if (addExpenseForm && addExpenseForm.value) {
      await submitAddExpense(addExpenseForm, showAddExpenseModal, resetExpenseForm, isSaved, alertService, async () => {
        // Reload all expenses and categories
        const allExpensesResult = await loadAllExpensesAndCategories();
        if (allExpensesResult.status === 'success') {
          allExpensesData.value = allExpensesResult.expenses;
        }
        
        // Reload expense data to show newly added expenses
        expenseData.value = await loadExpenseData();
        if (!expenseData.value.status) {
          originalExpenseData.value = cloneDeep(expenseData.value);
          expenses.value = extractAllExpenses(expenseData.value);
        }
      });
    }
  };
  
  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    try {
      isSaving.value = true;
      saveError.value = "";
      const projectName = selectedProject.value?.project_name || null;
      const changes = buildReceiptsPaymentsChanges();
      if (!changes.length) {
        alertService.info('No changes to save');
        return;
      }
      const res = await upsertReceiptsPaymentsItems(changes, projectName);
      if (res.status === 'error') {
        throw new Error(res.message || 'Save failed');
      }
      alertService.success('Receipts & Payments saved');
      isSaved.value = true;
      changedCells.value = [];
    } catch (e) {
      saveError.value = e?.message || 'Save failed';
      alertService.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };


  
  // ============================================================================
  // REPORT-SPECIFIC FUNCTIONS
  // ============================================================================
  
  /**
   * Load all report data using the unified service
   * This eliminates the need to visit other pages first
   */
  async function loadReportData() {
    if (!selectedProject.value || !visibleYears.value.length) {
      return;
    }

    try {
      dataLoading.value = true;
      dataError.value = null;
      
     //  // console.log('Reports: Loading data for project:', selectedProject.value.project_name, 'years:', visibleYears.value);
      
      // Use the unified service to get all data
      const unifiedData = await reportDataService.getReportData(
        selectedProject.value.project_name, 
        visibleYears.value
      );
      
      reportData.value = unifiedData;
      dataCompleteness.value = unifiedData.metadata?.dataCompleteness || 0;
      
     //  // console.log('Reports: Successfully loaded unified data, completeness:', dataCompleteness.value + '%');
      
      // Show success message if data is loaded
      if (dataCompleteness.value > 0) {
        alertService.success(`Report data loaded successfully (${dataCompleteness.value}% complete)`);
      }
      
    } catch (error) {
      console.error('Reports: Error loading report data:', error);
      dataError.value = error.message;
      alertService.error(`Failed to load report data: ${error.message}`);
    } finally {
      dataLoading.value = false;
    }
  }

  /**
   * Load data for a specific report type
   */
  async function loadReportSpecificData(reportType) {
    if (!selectedProject.value || !visibleYears.value.length) {
      return null;
    }

    try {
      const specificData = await reportDataService.getReportSpecificData(
        reportType,
        selectedProject.value.project_name,
        visibleYears.value
      );
      
      return specificData;
    } catch (error) {
      console.error('Reports: Error loading specific report data:', error);
      return null;
    }
  }
  
  // ============================================================================
  // ADVANCED SETTINGS HANDLERS
  // ============================================================================
  function applyAdvancedSettings() {
    setAdvancedModes({ ...tempAdvancedModes.value });
    showAdvanced.value = false;
  }
  
  function cancelAdvancedSettings() {
    showAdvanced.value = false;
  }
  
  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  // Handle beforeunload event to show warning
  function handleBeforeUnload(event) {
    if (!isSaved.value) {
      // Standard browser warning
      event.preventDefault();
      event.returnValue = 'You have unsaved changes that may be discarded if not saved. Are you sure you want to leave?';
      return event.returnValue;
    }
  }
  
  // Handle navigation cancellation
  function cancelNavigation() {
    showUnsavedWarning.value = false;
  }
  
  // Handle navigation confirmation
  function confirmNavigation() {
    showUnsavedWarning.value = false;
    // Allow the navigation to proceed by removing the event listener temporarily
    window.removeEventListener('beforeunload', handleBeforeUnload);
    // Trigger the actual navigation (refresh, close, etc.)
    window.location.reload();
  }
  
  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================
  function exportTableData() {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      const headers = ["Receipt/Payment"];
      visibleYears.value.forEach(year => {
        if (!isYearCollapsed(year)) {
          getColumnLabelsForYearLocal(year).forEach(label => {
            headers.push(`${year} - ${label}`);
          });
        }
        headers.push(`${year} - Total`);
      });
      csvContent += headers.join(",") + "\n";
      
      // Add data rows
      groupedExpenses.value.forEach(categoryGroup => {
        categoryGroup.expenses.forEach(expense => {
          const row = [
            expense
          ];
          
          visibleYears.value.forEach(year => {
            if (!isYearCollapsed(year)) {
              getColumnLabelsForYearLocal(year).forEach(label => {
                row.push(getAmountForExpense(expenseData.value, expense, year, label, advancedModes.value[year] || displayMode.value));
              });
            }
            row.push(calculateTotalForExpense(expenseData.value, expense, year, advancedModes.value[year] || displayMode.value, getColumnLabelsForYearLocal));
          });
          
          csvContent += row.join(",") + "\n";
        });
      });
      
      // Download the file
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `receipts_payments_data_${fromYear.value}_${toYear.value}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alertService.error("Failed to export data. Please try again.");
    }
  }

  // ==========================================================================
  // PRINT FUNCTIONALITY
  // ==========================================================================
  function printTable() {
    try {
      window.print();
    } catch (error) {
      console.error('Error triggering print:', error);
      alertService.error('Failed to open print dialog.');
    }
  }
  
  // ============================================================================
  // REFRESH FUNCTIONALITY
  // ============================================================================
  function refreshTable() {
    // Set flag to show success alert after reload
    localStorage.setItem('showRefreshSuccess', 'true');
    // The watcher automatically saves selectedReport to localStorage
    // Reload the entire page
    window.location.reload();
  }
  
  // ============================================================================
  // COLLECTION PERCENTAGE HANDLERS
  // ============================================================================
  function setEditableCellText(event, text) {
    // Keep DOM structure; update inner span content only
    const td = event.currentTarget?.closest?.('td[contenteditable="true"]') || event.currentTarget || event.target;
    if (td && td.querySelector) {
      const span = td.querySelector('span');
      if (span) {
        span.textContent = text;
      }
    }
  }

  function getCollectionSumAfter(deptKey, period, newValue) {
    const current = collectionPercentages.value[deptKey] || { month: 0, following: 0, second: 0 };
    const toDec = (x) => {
      const n = Number(x) || 0;
      return n > 1 ? n / 100 : n;
    };
    const monthVal = toDec(period === 'month' ? newValue : current.month);
    const followingVal = toDec(period === 'following' ? newValue : current.following);
    const secondVal = toDec(period === 'second' ? newValue : current.second);
    return monthVal + followingVal + secondVal; // returns decimal sum (0..1)
  }

  function updateCollectionPercentage(type, period, event) {
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      // During typing, accept value without enforcing sum; final check on blur
      collectionPercentages.value[deptKey][period] = value;
      isSaved.value = false;
    }
  }
  
  function handleCollectionPercentageFocus({ type, period, event }) {}
  
  function handleCollectionPercentageEdit({ type, period, event }) {
    // Handle edit completion for collection percentage
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const totalDec = getCollectionSumAfter(deptKey, period, value);
      if (totalDec > 1) {
        const prev = Number(collectionPercentages.value[deptKey][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Collection percentages cannot exceed 100%. Current total would be ${(totalDec * 100).toFixed(2)}%.`);
        return;
      }
      collectionPercentages.value[deptKey][period] = value;
      isSaved.value = false;
    } else {
      // Reset to previous value if invalid
      setEditableCellText(event, (Number(collectionPercentages.value[deptKey][period]) || 0).toFixed(2) + '%');
    }
  }
  
  // ============================================================================
  // PAYMENT PERCENTAGE HANDLERS
  // ============================================================================
  function getPaymentSumAfter(deptKey, category, period, newValue) {
    const currentCategory = (paymentPercentages.value[deptKey] && paymentPercentages.value[deptKey][category]) || { month: 0, following: 0, second: 0 };
    const monthVal = period === 'month' ? newValue : Number(currentCategory.month) || 0;
    const followingVal = period === 'following' ? newValue : Number(currentCategory.following) || 0;
    const secondVal = period === 'second' ? newValue : Number(currentCategory.second) || 0;
    return monthVal + followingVal + secondVal;
  }

  function updatePaymentPercentage(type, category, period, event) {
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const total = getPaymentSumAfter(deptKey, category, period, value);
      if (total > 100) {
        const prev = Number(paymentPercentages.value[deptKey][category][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Payment percentages for ${category} cannot exceed 100%. Current total would be ${total.toFixed(2)}%.`);
        return;
      }
      paymentPercentages.value[deptKey][category][period] = value;
      isSaved.value = false;
    }
  }
  
  function handlePaymentPercentageFocus({ type, category, period, event }) {}
  
  function handlePaymentPercentageEdit({ type, category, period, event }) {
    // Handle edit completion for payment percentage
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const total = getPaymentSumAfter(deptKey, category, period, value);
      if (total > 100) {
        const prev = Number(paymentPercentages.value[deptKey][category][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Payment percentages for ${category} cannot exceed 100%. Current total would be ${total.toFixed(2)}%.`);
        return;
      }
      paymentPercentages.value[deptKey][category][period] = value;
      isSaved.value = false;
    } else {
      // Reset to previous value if invalid
      setEditableCellText(event, (Number(paymentPercentages.value[deptKey][category][period]) || 0).toFixed(2) + '%');
    }
  }
  
  // ============================================================================
  // REPORT SELECTION HANDLERS
  // ============================================================================
  const handleReportSelection = (reportType) => {
    selectedReport.value = reportType;
    // The watcher will automatically save to localStorage
    // You can add additional logic here for different report types
   //  // console.log('Selected report:', reportType);
  };

  const clearSelectedReport = () => {
    selectedReport.value = '';
    // The watcher will automatically remove from localStorage
  };
  
  // ============================================================================
  // DEBUG FUNCTIONS
  // ============================================================================
  
  /**
   * Debug cache contents to identify data retrieval issues
   */
  const debugCache = () => {
    try {
      if (!selectedProject.value?.project_name) {
        alertService.warning('Please select a project first');
        return;
      }
      
     //  // console.log('=== CACHE DEBUG ===');
     //  // console.log('Project:', selectedProject.value.project_name);
      
      // Debug using the report service
      if (window.debugReportCache) {
        const cacheInfo = window.debugReportCache(selectedProject.value.project_name);
       //  // console.log('Cache inspection results:', cacheInfo);
        
        // Show summary in alert
        const pages = Object.keys(cacheInfo);
        const totalRowCodes = pages.reduce((sum, page) => sum + (cacheInfo[page]?.rowCodes?.length || 0), 0);
        
        alertService.info(`Cache Debug: ${pages.length} pages, ${totalRowCodes} total row codes. Check console for details.`);
      } else {
        // Fallback: direct cache inspection
        const cache = calculationCache.cache[selectedProject.value.project_name] || {};
        const pages = Object.keys(cache);
        
       //  // console.log('Available pages:', pages);
        pages.forEach(page => {
          const pageData = cache[page] || {};
          const rowCodes = Object.keys(pageData);
         //  // console.log(`Page "${page}": ${rowCodes.length} row codes`);
         //  // console.log('Sample row codes:', rowCodes.slice(0, 5));
        });
        
        alertService.info(`Cache Debug: ${pages.length} pages found. Check console for details.`);
      }
      
    } catch (error) {
      console.error('Error debugging cache:', error);
      alertService.error('Failed to debug cache. Check console for errors.');
    }
  };
  
  /**
   * Debug report data loading to identify specific issues
   */
  const debugReportData = async () => {
    try {
      if (!selectedProject.value?.project_name) {
        alertService.warning('Please select a project first');
        return;
      }
      
      if (!visibleYears.value.length) {
        alertService.warning('Please select years first');
        return;
      }
      
     //  // console.log('=== REPORT DATA DEBUG ===');
     //  // console.log('Project:', selectedProject.value.project_name);
     //  // console.log('Years:', visibleYears.value);
      
      // Test data loading for each report type
      const reportTypes = ['room-pnl', 'fnb-pnl', 'ood-pnl'];
      
      for (const reportType of reportTypes) {
       //  // console.log(`\n--- Testing ${reportType} ---`);
        
        try {
          const data = await reportDataService.getReportSpecificData(
            reportType,
            selectedProject.value.project_name,
            visibleYears.value
          );
          
         //  // console.log(`${reportType} data loaded:`, data);
          
          // Check data completeness
          let totalPoints = 0;
          let populatedPoints = 0;
          
          Object.values(data).forEach(yearData => {
            Object.values(yearData).forEach(categoryData => {
              if (typeof categoryData === 'object' && categoryData !== null) {
                Object.values(categoryData).forEach(monthData => {
                  if (typeof monthData === 'object' && monthData !== null) {
                    Object.values(monthData).forEach(value => {
                      totalPoints++;
                      if (value !== null && value !== undefined && value !== 0) {
                        populatedPoints++;
                      }
                    });
                  } else {
                    totalPoints++;
                    if (monthData !== null && monthData !== undefined && monthData !== 0) {
                      populatedPoints++;
                    }
                  }
                });
              }
            });
          });
          
          const completeness = totalPoints > 0 ? Math.round((populatedPoints / totalPoints) * 100) : 0;
         //  // console.log(`${reportType} completeness: ${populatedPoints}/${totalPoints} (${completeness}%)`);
          
        } catch (error) {
          console.error(`Error loading ${reportType} data:`, error);
        }
      }
      
      alertService.success('Report data debug complete. Check console for detailed results.');
      
    } catch (error) {
      console.error('Error debugging report data:', error);
      alertService.error('Failed to debug report data. Check console for errors.');
    }
  };
  
  // ============================================================================
  // SETTINGS MODAL HANDLERS
  // ============================================================================
  const openSettings = () => {
    showSettingsModal.value = true;
  };
  
  const closeSettings = () => {
    showSettingsModal.value = false;
  };
  
  // ============================================================================
  // DEPARTMENT LOADING
  // ============================================================================
  async function loadDepartments() {
    try {
      if (selectedProject.value) {
        const response = await getProjectDepartments(selectedProject.value.name);
        // Extract department names from the API response structure
        if (response && response.data && response.data.data) {
          departments.value = response.data.data;
        } else if (Array.isArray(response)) {
          // Fallback for direct array response
          departments.value = response;
        } else {
          departments.value = [];
        }
      } else {
        departments.value = [];
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      departments.value = [];
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
    