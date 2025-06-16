<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50 px-6">
      <h1 class="text-[40px] font-extrabold text-gray-800 pt-6">Assumptions on Expenses</h1>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mt-6 items-center">
        <!-- Add Expense Button -->
        <button @click="showAddExpenseModal = true" class="px-4 py-2 bg-violet-500 rounded-md hover:bg-black transition-all text-white">
          Add Expense
        </button>

        <!-- Dropdowns -->
        <div class="flex gap-4 flex-wrap">
          <select v-model="fromYear" class="px-6 py-2 rounded-md border focus:border-violet-500">
            <option value="">From Year</option>
            <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
          </select>

          <select v-model="toYear" class="px-6 py-2 rounded-md border focus:border-violet-500">
            <option value="">To Year</option>
            <option v-for="year in years" :key="'to-' + year" :value="year">{{ year }}</option>
          </select>

          <!-- Advanced Settings Button -->
          <button
            @click="showAdvanced = true"
            class="px-4 py-2 bg-white border border-violet-500 text-violet-700 hover:bg-violet-100 rounded-md"
          >
            Advanced Setting
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="w-full mt-8 overflow-x-auto">
        <template v-if="visibleYears.length">
          <div class="min-w-full w-max">
            <table class="table-auto border-violet-300 rounded-xl overflow-hidden">
              <thead class="bg-violet-600 text-white">
                <tr>
                  <th rowspan="2" class="px-4 py-3 text-left align-middle border-r border-violet-400">Expense</th>
                  <th
                    v-for="year in visibleYears"
                    :key="'header-' + year"
                    :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
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
                        v-for="label in getColumnLabelsForYear(year)"
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
                  <template v-for="year in visibleYears" :key="'row-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYear(year)"
                        :key="'cell-' + year + '-' + label"
                        contenteditable="true"
                        class="px-2 py-2 text-center border border-violet-200"
                      >
                        {{ getAmount(expenseData, expense, year, label) }}
                      </td>
                      <td 
                      contenteditable="true"
                      class="px-2 py-2 text-center border border-violet-200">
                        {{ calculateTotal(expenseData, expense, year, advancedModes[year] || displayMode) }}
                      </td>
                    </template>
                    <template v-else>
                      <td 
                      contenteditable="true"
                      class="px-2 py-2 text-center border border-violet-200">
                        {{ calculateTotal(expenseData, expense, year, advancedModes[year] || displayMode) }}
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </template>

        <!-- No Years Selected -->
        <template v-else>
          <div class="flex flex-col items-center justify-center min-h-[300px] bg-white border border-dashed border-violet-300 rounded-xl shadow-sm">
            <CircleAlert class="w-12 h-12 text-violet-400 mb-4" />
            <p class="text-lg text-violet-600 font-semibold">No years selected</p>
            <p class="text-sm text-gray-500 mt-1">Please choose a valid year range above to display the expense table.</p>
          </div>
        </template>
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    >
      <div class="bg-white rounded-xl p-6 w-[95%] max-w-4xl shadow-xl border border-violet-200">
        <h2 class="text-2xl font-bold text-violet-700 mb-6">Add New Expense</h2>

        <div class="space-y-4">
          <!-- Year and Month Select -->
          <div class="flex gap-4">
            <select v-model="addExpenseForm.year" class="px-4 py-2 rounded-md border w-1/2 focus:border-violet-500">
              <option disabled value="">Select Year</option>
              <option v-for="year in years" :key="'add-year-' + year" :value="year">{{ year }}</option>
            </select>
            <select v-model="addExpenseForm.month" class="px-4 py-2 rounded-md border w-1/2 focus:border-violet-500">
              <option disabled value="">Select Month</option>
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>
            </select>
          </div>

          <!-- Input Table -->
          <table class="w-full border-violet-300 border rounded-lg overflow-hidden">
            <thead class="bg-violet-600 text-white">
              <tr>
                <th class="text-left px-4 py-2">Expense</th>
                <th class="text-left px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in addExpenseForm.rows" :key="'expense-row-' + index" class="even:bg-violet-50">
                <td class="px-4 py-2">
                  <input
                    type="text"
                    v-model="row.expense"
                    class="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-violet-500"
                    placeholder="Enter expense name"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    type="number"
                    v-model.number="row.amount"
                    class="w-full px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-violet-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Actions -->
          <div class="flex justify-between mt-4">
            <button @click="addExpenseRow" class="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-700">
              + Add Row
            </button>

            <div class="space-x-2">
              <button @click="submitAddExpense" class="px-4 py-2 bg-black text-white rounded hover:bg-violet-800">
                Submit
              </button>
              <button
                @click="cancelAddExpense"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
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
import {
  getVisibleYears,
  getColumnLabels,
  getAmount,
  calculateTotal,
  yearsCount
} from "@/components/utility/expense_formular.js";


// Reactive state
const years = ref([]);
const fromYear = ref("");
const toYear = ref("");
const displayMode = ref("monthly");
const expenses = ref([]);
const expenseData = ref({});
const collapsedYears = ref(new Set());
const showAdvanced = ref(false);
const advancedModes = ref({});

// Computed
const visibleYears = computed(() => getVisibleYears(fromYear.value, toYear.value));


// Set defaults for advancedModes
watch(visibleYears, () => {
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      advancedModes.value[year] = displayMode.value;
    }
  });
});


const filteredExpenses = computed(() => {
  const filtered = new Set();
  visibleYears.value.forEach(year => {
    const yearData = expenseData.value[year] || {};
    for (const month in yearData) {
      yearData[month].forEach(entry => filtered.add(entry.expense));
    }
  });
  return [...filtered].sort();
});


function toggleCollapse(year) {
  collapsedYears.value.has(year)
    ? collapsedYears.value.delete(year)
    : collapsedYears.value.add(year);
}

function isYearCollapsed(year) {
  return collapsedYears.value.has(year);
}

function applyAdvancedSettings() {
  showAdvanced.value = false;
}

function getColumnLabelsForYear(year) {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
}


//Add expense modal logic:
const showAddExpenseModal = ref(false);

const addExpenseForm = ref({
  year: "",
  month: "",
  rows: [{ expense: "", amount: 0 }],
});

function cancelAddExpense() {
  addExpenseForm.value = {
    year: "",
    month: "",
    rows: [{ expense: "", amount: 0 }],
  };
  showAddExpenseModal.value = false;
}

function addExpenseRow() {
  addExpenseForm.value.rows.push({ expense: "", amount: 0 });
}


// Load years and data
onMounted(async () => {
  try {
    const yearRes = await fetch("http://127.0.0.1:8000/api/v2/method/ex_forcast.api.year.get_year_options");
    const yearData = await yearRes.json();
    years.value = yearData.data.options.filter(option => option);

    const dataRes = await fetch("http://127.0.0.1:8000/api/v2/method/ex_forcast.api.expense_estimate.estimate_display");
    const raw = await dataRes.json();
    expenseData.value = raw.data;

    const all = new Set();
    for (const year in raw.data) {
      for (const month in raw.data[year]) {
        raw.data[year][month].forEach(e => all.add(e.expense));
      }
    }
    expenses.value = [...all].sort();

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
