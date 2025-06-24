<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div class="w-80 bg-white border-r border-violet-200 p-6 min-h-screen flex flex-col">
          <h1 class="text-[28px] font-extrabold text-gray-800 mb-6">Expense Assumptions</h1>

          <!-- Action Buttons -->
          <div class="space-y-3 mb-6">
            <button @click="showAddExpenseModal = true" class="w-full px-4 py-2 bg-violet-500 rounded-md hover:bg-black transition-all text-white">
            Add Expense
          </button>
        </div>

          <!-- Filters Section -->
          <div class="space-y-4 mb-6">
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

            <button @click="showAdvanced = true" class="w-full px-4 py-2 bg-white border border-violet-500 text-violet-700 hover:bg-violet-100 rounded-md">
              Advanced Setting
            </button>

            <!-- Unsaved Indicator and Save Button -->
            <div class="flex justify-between items-center pt-4 border-t border-violet-200">
              <div class="text-sm text-red-600 font-medium bg-red-200 px-3 py-1 rounded-full">
                Unsaved
              </div>
              <button class="px-4 py-1 bg-black text-white hover:border hover:border-violet-500 hover:text-violet-700 hover:bg-violet-100 rounded-md transition-all">
                Save
              </button>
            </div>
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
                  <th rowspan="2" class="px-4 py-3 text-left align-middle border-r border-violet-400">Expense</th>
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
                <tr
                  v-for="expense in filteredExpenses"
                  :key="expense"
                  class="even:bg-violet-50 hover:bg-violet-100 transition"
                >
                  <td class="px-4 py-3 font-medium border-r border-violet-200">{{ expense }}</td>
                  <template v-for="year in visibleYears" :key="'row-' + year + '-' + expense">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                            v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'cell-' + year + '-' + label"
                        contenteditable="true"
                        class="px-2 py-2 text-right border border-violet-200"
                      >
                        {{ getAmount(expenseData, expense, year, label) }}
                      </td>
                      <td class="px-2 py-2 text-right border border-violet-200">
                        {{ calculateTotal(expenseData, expense, year, advancedModes[year] || displayMode) }}
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-violet-200">
                        {{ calculateTotal(expenseData, expense, year, advancedModes[year] || displayMode) }}
                      </td>
                    </template>
                  </template>
                </tr>
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

        <div class="space-y-4 max-h-[60vh] overflow-auto pr-2">
          <div
            v-for="year in visibleYears"
            :key="'adv-' + year"
            class="flex justify-between items-center border-b pb-2"
          >
            <span class="font-medium text-gray-700">{{ year }}</span>
            <select
              v-model="advancedModes[year]"
              class="px-6 py-2 border rounded-md focus:ring-violet-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showAdvanced = false"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
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
                    <td class="px-6 py-4">
                      <input
                        type="text"
                        v-model="row.expense"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                        placeholder="Enter expense name"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        type="number"
                        min="0.00"
                        step="0.01"
                        v-model.number="row.amount"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-right"
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
                @click="submitAddExpense" 
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
</template>




<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { CircleAlert } from 'lucide-vue-next';

// Import all expense assumption utilities from the main index file
import {
  // Core expense calculations
  getVisibleYears,
  getColumnLabels,
  getAmount,
  calculateTotal,
  
  // Modal and form management
  showAddExpenseModal,
  addExpenseForm,
  addExpenseRow,
  removeExpenseRow,
  cancelAddExpense,
  resetExpenseForm,
  
  // Document creation
  createExpenseDocument,
  
  // Data loading and API services
  loadYearOptions,
  loadExpenseData,
  extractAllExpenses,
  
  // Table display and interaction
  collapsedYears,
  toggleCollapse,
  isYearCollapsed,
  getFilteredExpenses,
  
  // Advanced settings management
  initializeAdvancedModes,
  
  // Filter and validation utilities
  getMonthOptions,
  months
} from "@/components/utility/expense_assumption/index.js";

// Reactive state
const years = ref([]);
const fromYear = ref("");
const toYear = ref("");
const displayMode = ref("monthly");
const expenses = ref([]);
const expenseData = ref({});
const showAdvanced = ref(false);
const advancedModes = ref({});

// Computed properties
const visibleYears = computed(() => {
  const years = getVisibleYears(fromYear.value, toYear.value);
  console.log('Visible years:', years, 'from:', fromYear.value, 'to:', toYear.value);
  return years;
});

const filteredExpenses = computed(() => {
  const expenses = getFilteredExpenses(expenseData.value, visibleYears.value);
  console.log('Filtered expenses:', expenses, 'expenseData:', expenseData.value);
  return expenses;
});

const monthOptions = computed(() => getMonthOptions());

// Computed property to get column labels for a specific year
const getColumnLabelsForYearLocal = (year) => {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Watch for changes in visible years to initialize advanced modes
watch(visibleYears, () => {
  console.log('Visible years changed:', visibleYears.value);
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      advancedModes.value[year] = displayMode.value;
    }
  });
});

// Watch for changes in year selections
watch(fromYear, (newValue, oldValue) => {
  console.log('From Year changed:', { newValue, oldValue, type: typeof newValue });
});

watch(toYear, (newValue, oldValue) => {
  console.log('To Year changed:', { newValue, oldValue, type: typeof newValue });
});

function applyAdvancedSettings() {
  showAdvanced.value = false;
}

// Create expense document
async function submitAddExpense() {
  const { year, month, rows } = addExpenseForm.value

  if (!year || !month || rows.length === 0) {
    alert('Please select year, month, and add at least one expense.')
    return
  }

  const cleanRows = rows.filter(r => r.expense && r.amount > 0)

  const result = await createExpenseDocument({
    year,
    month,
    expenses: cleanRows
  })

  if (result.success) {
    alert(`Expense document created: ${result.name}`)
    showAddExpenseModal.value = false
    resetExpenseForm()
  } else {
    alert('Failed to create document: ' + (result.error?.message || result.error))
  }
}

// Load data on mount
onMounted(async () => {
  try {
    console.log('Loading data...');
    years.value = await loadYearOptions();
    console.log('Years loaded:', years.value);
    
    expenseData.value = await loadExpenseData();
    console.log('Expense data loaded:', expenseData.value);
    
    expenses.value = extractAllExpenses(expenseData.value);
    console.log('All expenses extracted:', expenses.value);
  } catch (err) {
    console.error("Error loading data:", err);
  }
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
