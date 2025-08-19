<template>
    <div class="flex">
      <Sidebar @open-settings="openSettings" />
  
      <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
        <!-- Main Content Area -->
        <div class="relative p-4">
          <!-- Top Filters and Controls -->
          <div v-if="visibleYears.length" class="absolute top-4 left-4 z-30 w-[660px] max-w-[95vw] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-violet-200/60 shadow-2xl ring-1 ring-violet-300/30">
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
              <div v-show="!sidebarCollapsed" class="px-5 pb-5 bg-white/70">
                
                
                <!-- Report Selection Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FileText class="w-4 h-4 text-violet-600" />
                    {{ selectedReport ? 'Current Report' : 'Select Report' }}
                  </h3>
                  <div class="w-full">
                    <select 
                      v-model="selectedReport" 
                      class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm shadow-sm"
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
                      @click="selectedReport = ''"
                      class="flex items-center gap-1 px-2 py-1 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded transition-all"
                    >
                      <RefreshCw class="w-3 h-3" />
                      Change Report
                    </button>
                  </div>
                </div>

                <!-- Action Buttons Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Plus class="w-4 h-4 text-violet-600" />
                    Quick Actions
                  </h3>              
                  <div class="flex gap-2">
                    <button 
                      @click="refreshTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <RefreshCw class="w-4 h-4" />
                      Refresh
                    </button>
                    <button 
                      @click="exportTableData"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <Download class="w-4 h-4" />
                      Export
                    </button>
                    <button 
                      @click="printTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <Printer class="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
  
                <!-- Filters Section -->
                <div>
                  <div class="bg-white/90 rounded-xl p-5 border border-violet-100 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                      </svg>
                      Year Range Filter
                    </h3>
                    
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 gap-3">
                        <div>
                          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            From Year
                          </label>
                          <select 
                            disabled
                            v-model="fromYear" 
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm"
                          >
                            <option value="">Select Year</option>
                            <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                          </select>
                        </div>
  
                        <div>
                          <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            To Year
                          </label>
                          <select 
                            disabled
                            v-model="toYear" 
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm"
                          >
                            <option value="">Select Year</option>
                            <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                          </select>
                        </div>
                      </div>
  
                      <div class="flex gap-2">
                        <button 
                          @click="clearYearSelection" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/90 text-gray-700 border border-violet-200 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium shadow-sm"
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
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
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
                class="flex justify-between items-center border-b pb-2"
              >
                <span class="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar class="w-3 h-3 text-gray-500" />
                  {{ year }}
                </span>
                <select
                  v-model="tempAdvancedModes[year]"
                  class="px-6 py-2 border rounded-md focus:ring-violet-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelAdvancedSettings"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
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
    Plus
  } from 'lucide-vue-next';
  
  // Service imports
  import alertService from "@/components/ui/ui_utility/alertService.js";
  
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
  
  // Report selection state
  const selectedReport = ref('');
  
  // Settings modal state
  const showSettingsModal = ref(false);
  
  // Report-specific state will be added here as needed

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
  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        // Use Pinia action to set mode for new years
        yearSettingsStore.setAdvancedMode(year, displayMode.value);
      }
    });
  });
  
  // Watch for project changes to reload data
  watch(selectedProject, async (newProject, oldProject) => {
    if (newProject && newProject !== oldProject) {
      try {
        // Reset data for new project
        expenseData.value = {};
        allExpensesData.value = [];
        expenses.value = [];
        
        // Load departments for the new project
        await loadDepartments();
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        
        alertService.success(`Switched to project: ${newProject.project_name}`);
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
      
      isSaved.value = true;
      
      // Load departments and hydrate if a project is selected
      if (selectedProject.value) {
        await loadDepartments();
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
  // Report-specific functions will be added here as needed
  
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
    // You can add additional logic here for different report types
    // console.log('Selected report:', reportType);
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
    