<template>
  <div class="flex ">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div class="w-80 bg-white border-r border-violet-200 p-6 min-h-screen flex flex-col">
          <h1 class="text-[28px] font-extrabold text-gray-800 mb-6">Expense Assumptions</h1>

          <!-- Unsaved Indicator and Save Button -->
          <div class="flex justify-between items-center pb-4 border-b border-violet-200">
            <div
              v-if="!isSaved"
              class="text-sm text-red-600 font-medium bg-red-200 px-3 py-1.5 rounded-full"
            >
              Unsaved
            </div>
            <div
              v-else
              class="text-sm text-green-600 font-medium bg-green-200 px-3 py-1.5 rounded-full"
            >
              Saved
            </div>
            <button
              v-if="!isSaving && !isSaved"
              :disabled="isSaving"
              @click="saveChangesWrapper"
              class="px-4 py-0.5 bg-black text-white hover:bg-gray-900 rounded-md transition-all"
            >
              Save
            </button>
            <button
              v-if="isSaving"
              class="px-4 py-0.5 bg-black text-white hover:bg-gray-900 rounded-md transition-all"
            >
              Saving...
            </button>
            <span v-if="saveError" class="ml-2 text-xs text-red-500">{{ saveError }}</span>
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-3 mb-6">
            <button @click="showAddExpenseModal = true" class="w-full px-4 py-2 mt-4 bg-violet-500 rounded-md hover:bg-black transition-all text-white">
            Add Expense
          </button>
        </div>

          <!-- Filters Section -->
          <div class="space-y-3 mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Year Range</h3>
            
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-600 mb-1">From Year</label>
                <select v-model="fromYear" class="w-full px-4 py-2 rounded-md border focus:border-violet-500">
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                </select>
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-600 mb-1">To Year</label>
                <select v-model="toYear" class="w-full px-4 py-2 rounded-md border focus:border-violet-500">
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="'to-' + year" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>

            <button @click="clearYearSelection" class="w-full px-4 py-2 bg-black text-white hover:bg-violet-500 rounded-md">
              Clear
            </button>
            <button @click="showAdvanced = true" class="w-full px-4 py-2 bg-white border border-violet-500 text-violet-700 hover:bg-violet-100 rounded-md">
              Advanced Setting
            </button>


          </div>
        </div>

        <!-- Right Side - Table Area -->
        <div class="flex-1 p-6">
        <template v-if="visibleYears.length">
            <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="table-auto border-violet-300 rounded-xl overflow-hidden">
              <thead class="bg-violet-600 text-white">
                <tr>
                  <th rowspan="2" class="px-4 py-3 text-left align-middle border-r border-violet-400">Code</th>
                  <th rowspan="2" class="px-4 py-3 text-left align-middle border-r border-violet-400">Expense</th>
                  <th rowspan="2" class="px-4 py-3 text-left align-middle border-r border-violet-400">Cost Type</th>
                  <th
                    v-for="year in visibleYears"
                    :key="'header-' + year"
                        :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                    class="px-4 py-3 text-center border-x-2 border-white cursor-pointer select-none hover:bg-violet-700 transition"
                    @click="toggleCollapse(year)"
                    title="Click to collapse/expand"
                  >
                    {{ year }}
                  </th>
                </tr>
                <tr class="bg-violet-500 text-sm">
                  <template v-for="year in visibleYears" :key="'months-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <th
                            v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="year + '-' + label"
                        class="px-4 py-2 text-center border border-violet-300 min-w-[110px]"
                      >
                        {{ label }}
                      </th>
                      <th class="px-4 py-2 text-center border border-violet-300 min-w-[120px]">Total</th>
                    </template>
                    <template v-else>
                      <th class="px-4 py-2 text-center border border-violet-300 min-w-[120px]">Total</th>
                    </template>
                  </template>
                </tr>
              </thead>

              <tbody class="text-gray-700 bg-white">
                <template v-for="categoryGroup in groupedExpenses" :key="'category-' + categoryGroup.category">
                  <!-- Category Header Row -->
                  <tr class="bg-violet-100 border-b-1 border-violet-300">
                    <td colspan="3" class="px-4 py-3 font-bold text-violet-800 border-r border-violet-300">
                      {{ categoryGroup.category }}
                    </td>
                    <template v-for="year in visibleYears" :key="'category-header-' + year">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'category-cell-' + year + '-' + label"
                          class="px-2 py-2 text-center border border-violet-200 bg-violet-100"
                        ></td>
                        <td class="px-2 py-2 text-center border border-violet-200 bg-violet-100"></td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-center border border-violet-200 bg-violet-100"></td>
                      </template>
                    </template>
                  </tr>
                  
                  <!-- Expense Rows for this Category -->
                  <tr
                    v-for="expense in categoryGroup.expenses"
                    :key="'expense-' + expense"
                    class="even:bg-violet-50 hover:bg-violet-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-violet-200 text-gray-600">
                      {{ getExpenseDetails(expenseData, expense, visibleYears).code }}
                    </td>
                    <td class="px-4 py-3 font-medium border-r border-violet-200">{{ expense }}</td>
                    <td class="px-4 py-3 font-medium border-r border-violet-200 text-gray-600">
                      {{ getExpenseDetails(expenseData, expense, visibleYears).costType }}
                    </td>
                    <template v-for="year in visibleYears" :key="'row-' + year + '-' + expense">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'cell-' + year + '-' + label"
                          contenteditable="true"
                          class="px-2 py-2 text-right border border-violet-200"
                          @input="handleCellInput({ year, label, expense, event: $event })"
                          @focus="handleCellFocus({ year, label, expense, event: $event })"
                          @blur="handleCellEditWrapper({ year, label, expense, event: $event })"
                        >
                          {{ getAmountForExpense(expenseData, expense, year, label, advancedModes[year] || displayMode) }}
                        </td>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold">
                          {{ calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal) }}
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold">
                          {{ calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal) }}
                        </td>
                      </template>
                    </template>
                  </tr>
                  
                  <!-- Category Total Row -->
                  <tr class="bg-violet-100 border-y-2 border-violet-400">
                    <td colspan="3" class="px-4 py-3 font-bold text-violet-900 border-r border-violet-300">
                      Total
                    </td>
                    <template v-for="year in visibleYears" :key="'category-total-' + year">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'category-total-cell-' + year + '-' + label"
                          class="px-2 py-2 text-center border border-violet-300 bg-violet-200"
                        ></td>
                        <td class="px-2 py-2 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                          {{ calculateCategoryTotal(expenseData, categoryGroup.expenses, year, advancedModes[year] || displayMode) }}
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                          {{ calculateCategoryTotal(expenseData, categoryGroup.expenses, year, advancedModes[year] || displayMode) }}
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
              </div>
          </div>
        </template>

        <!-- No Years Selected -->
        <template v-else>
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border border-dashed border-violet-300 rounded-xl shadow-sm">
            <CircleAlert class="w-12 h-12 text-violet-400 mb-4" />
            <p class="text-lg text-violet-600 font-semibold">
              {{ fromYear && !toYear ? 'Please select a "To Year"' : !fromYear && toYear ? 'Please select a "From Year"' : 'No years selected' }}
            </p>
            <p class="text-sm text-gray-500 mt-1 text-center max-w-md">
              {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the expense table.' : 
                 !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the expense table.' :
                   'Please select both "From Year" and "To Year" in the left panel to display the expense table.' }}
            </p>
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-xl p-6 w-[90%] max-w-lg shadow-xl border border-violet-200">
        <h2 class="text-xl font-semibold text-violet-700 mb-4">Advanced Display Mode Settings</h2>

        <!-- Message when no years selected -->
        <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-center gap-2">
            <AlertTriangle class="w-15 h-15 mr-2 text-yellow-600" />
            <p class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure advanced settings.</p>
          </div>
        </div>

        <div v-if="visibleYears.length" class="space-y-4 max-h-[60vh] overflow-auto pr-2">
          <div
            v-for="year in visibleYears"
            :key="'adv-' + year"
            class="flex justify-between items-center border-b pb-2"
          >
            <span class="font-medium text-gray-700">{{ year }}</span>
            <select
              v-model="tempAdvancedModes[year]"
              class="px-6 py-2 border rounded-md focus:ring-violet-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="cancelAdvancedSettings"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            v-if="visibleYears.length"
            @click="applyAdvancedSettings"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  </transition>


  <!-- Add Expense Modal -->
  <transition name="fade">
    <div
      v-if="showAddExpenseModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-5xl max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 py-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Add New Expense</h2>
              <p class="text-violet-100 mt-1">Enter expense details for the selected period</p>
            </div>
            <button 
              @click="cancelAddExpense"
              class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pb-0 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Year and Month Select -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Year</label>
              <select v-model="addExpenseForm.year" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white">
                <option disabled value="">Choose a year</option>
                <option v-for="year in years" :key="'add-year-' + year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Month</label>
              <select v-model="addExpenseForm.month" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white">
                <option disabled value="">Choose a month</option>
                <option v-for="month in months" :key="'add-month-' + month" :value="month">{{ month }}</option>
              </select>
            </div>
          </div>

          <!-- Input Table -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-1 h-6 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full"></div>
              <h3 class="text-lg font-semibold text-gray-800">Expense Items</h3>
            </div>
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white sticky top-0">
                  <tr>
                    <th class="text-left px-6 py-4 font-semibold">Expense Name</th>
                    <th v-if="hospitalityExperience" class="text-left px-6 py-4 font-semibold">Category</th>
                    <th class="text-left px-6 py-4 font-semibold">Cost Type</th>
                    <th class="text-left px-6 py-4 font-semibold">Amount</th>
                    <th class="w-16"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="(row, index) in addExpenseForm.rows" 
                    :key="'expense-row-' + index" 
                    class="hover:bg-violet-50/50 transition-colors"
                  >
                  
                    <td class="px-2 py-4">
                      <select
                        v-model="row.expense"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      >
                        <option disabled value="">Select expense</option>
                        <option v-for="option in expenseOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td v-if="hospitalityExperience" class="px-2 py-4">
                      <select
                        v-model="row.category"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      >
                        <option disabled value="">Select Category</option>
                        <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td class="px-2 py-4">
                      <select
                        v-model="row.costType"
                        class="w-full px-2 mr-20 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      >
                        <option disabled value="">Select Cost Type</option>
                        <option v-for="option in costTypeOptions" :key="option.value" :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td class="px-2 py-4">
                      <input
                        type="text"
                        v-model="row.amountDisplay"
                        @input="formatAmountInputWrapper(index, $event)"
                        @blur="cleanAmountValueWrapper(index)"
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-left"
                        placeholder="0.00"
                      />
                    </td>


                    <td class="px-6 py-4">
                      <button 
                        @click="removeExpenseRow(index)"
                        class="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                        v-if="addExpenseForm.rows.length > 1"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-3 pb-3 border-t border-gray-200 bg-white sticky bottom-0">
            <button 
              @click="addExpenseRow" 
              class="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Row
            </button>

            <div class="flex gap-3">
              <button
                @click="cancelAddExpense"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                @click="submitAddExpenseWrapper" 
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Unsaved Changes Warning Modal -->
  <transition name="fade">
    <div
      v-if="showUnsavedWarning"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl border border-red-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Unsaved Changes</h2>
        </div>
        
        <p class="text-gray-600 mb-6">
          You have unsaved changes that may be discarded if you leave this page. Are you sure you want to continue?
        </p>
        
        <div class="flex justify-end gap-3">
          <button
            @click="cancelNavigation"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Stay on Page
          </button>
          <button
            @click="confirmNavigation"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>






<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { CircleAlert, AlertTriangle } from 'lucide-vue-next';

import {
  // Core expense calculations
  getVisibleYears,
  getColumnLabels,
  
  // Modal and form management
  showAddExpenseModal,
  addExpenseForm,
  addExpenseRow,
  removeExpenseRow,
  cancelAddExpense,
  resetExpenseForm,
  
  // Data loading and API services
  loadYearOptions,
  loadExpenseData,
  extractAllExpenses,
  
  // Table display and interaction
  toggleCollapse,
  isYearCollapsed,

  getExpensesGroupedByCategory,
  getExpenseDetails,
  getAmountForExpense,
  calculateTotalForExpense,
  
  // Filter and validation utilities,
  months,

  // Expense List
  getExpenseList,
  
  // Expense Field Options
  getExpenseFieldOptions
} from "@/components/utility/expense_assumption/index.js";

import { cloneDeep } from 'lodash-es';
import {
  calculateCategoryTotal,
  formatAmountInput,
  cleanAmountValue,
  handleCellEdit,
  handleCellInput,
  handleCellFocus
} from "@/components/utility/expense_assumption/expense_estimate_utils.js";
import { saveChanges } from "@/components/utility/expense_assumption/save_changes.js";
import { submitAddExpense } from "@/components/utility/expense_assumption/submit_add_expense.js";


// Reactive state
const years = ref([]);
const fromYear = ref("");
const toYear = ref("");
const displayMode = ref("monthly");
const expenses = ref([]);
const expenseData = ref({});
const showAdvanced = ref(false);
const advancedModes = ref({});
const tempAdvancedModes = ref({});
const expenseOptions = ref([]);
const hospitalityExperience = ref(
  localStorage.getItem('hospitalityExperience') === null
    ? true
    : localStorage.getItem('hospitalityExperience') === 'true'
);
const categoryOptions = ref([]);
const costTypeOptions = ref([]);
const isSaved = ref(false);
const originalExpenseData = ref({});
const changedCells = ref([]); // {year, label, expense, newValue}
const isSaving = ref(false);
const saveError = ref("");
const showUnsavedWarning = ref(false);
const pendingNavigation = ref(null); // Store the pending navigation action

// Computed properties
const visibleYears = computed(() => {
  const years = getVisibleYears(fromYear.value, toYear.value);
  // console.log('Visible years:', years, 'from:', fromYear.value, 'to:', toYear.value);
  return years;
});


const groupedExpenses = computed(() => {
  return getExpensesGroupedByCategory(expenseData.value, visibleYears.value);
});


// Computed property to get column labels for a specific year
const getColumnLabelsForYearLocal = (year) => {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Watch for changes in visible years to initialize advanced modes
watch(visibleYears, () => {
  // console.log('Visible years changed:', visibleYears.value);
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      advancedModes.value[year] = displayMode.value;
    }
  });
});

// Watch for hospitality experience changes
watch(hospitalityExperience, (newValue) => {
  localStorage.setItem('hospitalityExperience', newValue);
});

// Watch for localStorage changes to sync with sidebar
const checkHospitalityExperience = () => {
  const stored = localStorage.getItem('hospitalityExperience');
  const newValue = stored === null ? true : stored === 'true';
  if (hospitalityExperience.value !== newValue) {
    hospitalityExperience.value = newValue;
  }
};

// Check for changes periodically
setInterval(checkHospitalityExperience, 1000);

// When opening the modal, copy the current settings
watch(showAdvanced, (val) => {
  if (val) {
    tempAdvancedModes.value = { ...advancedModes.value };
  }
});

function applyAdvancedSettings() {
  advancedModes.value = { ...tempAdvancedModes.value };
  showAdvanced.value = false;
}

function cancelAdvancedSettings() {
  showAdvanced.value = false;
}

// On mount, initialize years from localStorage if available
onMounted(async () => {
  try {
    years.value = await loadYearOptions();
    expenseData.value = await loadExpenseData();
    // console.log('Loaded expense data structure:', expenseData.value); // Debug log
    originalExpenseData.value = cloneDeep(expenseData.value); // Store original
    expenses.value = extractAllExpenses(expenseData.value);
    expenseOptions.value = (await getExpenseList())?.map(name => ({ label: name, value: name })) || [];
    
    // Use the options API for modal dropdowns (shows all available options)
    const fieldOptions = await getExpenseFieldOptions();
    categoryOptions.value = fieldOptions.hospitality_category.map(category => ({ label: category, value: category }));
    costTypeOptions.value = fieldOptions.cost_type.map(costType => ({ label: costType, value: costType }));
    
    // Restore years from localStorage
    fromYear.value = localStorage.getItem('expenseEstimateFromYear') || "";
    toYear.value = localStorage.getItem('expenseEstimateToYear') || "";
    isSaved.value = true;
  } catch (err) {
    console.error("Error loading data:", err);
  }
});

// Watchers to persist year selection
watch(fromYear, (newValue) => {
  localStorage.setItem('expenseEstimateFromYear', newValue);
});
watch(toYear, (newValue) => {
  localStorage.setItem('expenseEstimateToYear', newValue);
});

function clearYearSelection() {
  fromYear.value = "";
  toYear.value = "";
  localStorage.removeItem('expenseEstimateFromYear');
  localStorage.removeItem('expenseEstimateToYear');
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

// ! Wrapper functions to ensure addExpenseForm is properly initialized
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
    await submitAddExpense(addExpenseForm, showAddExpenseModal, resetExpenseForm, isSaved);
  }
};

// Wrapper function for saveChanges
const saveChangesWrapper = async () => {
  await saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData);
};


// ! Unsaved Changes Warning Modal
// ! Watch for unsaved changes to show warning on page refresh
watch(isSaved, (newValue) => {
  if (!newValue) {
    // Add beforeunload event listener when there are unsaved changes
    window.addEventListener('beforeunload', handleBeforeUnload);
  } else {
    // Remove beforeunload event listener when changes are saved
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
});

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

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
