<template>
  <div class="flex ">
    <Sidebar @open-settings="openSettings" />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
          <!-- Collapse/Expand Button -->
          <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all dark:bg-violet-900/30 dark:hover:bg-violet-800/40">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-5 h-5 text-violet-700 dark:text-white" />
            <ChevronRight v-else class="w-5 h-5 text-violet-700 dark:text-white" />
            <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium dark:text-white">Collapse</span>
          </button>
          <transition name="fade">
              <div v-show="!sidebarCollapsed">
                <!-- Header Section -->
                <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calculator class="w-7 h-7 mx-2 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Expense Assumptions</h1>
            </div>
            <p class="text-sm text-gray-500">Manage and configure your expense data</p>
          </div>

          <!-- Save Status Section -->
          <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  v-if="!isSaved"
                  class="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                >
                  <AlertTriangle class="w-4 h-4 text-red-600" />
                  Unsaved
                </div>
                <div
                  v-else
                  class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                >
                  <Check class="w-4 h-4 text-green-600" />
                  All Saved
                </div>
              </div>
              
              <button
                v-if="!isSaving && !isSaved"
                :disabled="isSaving"
                @click="saveChangesWrapper"
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Save class="w-4 h-4" />
                Save
              </button>
              <button
                v-if="isSaving"
                class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed"
              >
                <Loader2 class="w-4 h-4 animate-spin" />
                Saving...
              </button>
            </div>
            <span v-if="saveError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              {{ saveError }}
            </span>
          </div>
          
          <!-- Action Buttons Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Plus class="w-4 h-4 text-violet-600" />
              Quick Actions
            </h3>
            <button 
              @click="showAddExpenseModal = true" 
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <Plus class="w-4 h-4" />
              Add New Expense
            </button>
            
            <div class="flex gap-2 mt-3">
              <button 
                @click="refreshTable"
                class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-violet-200 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium"
              >
                <RefreshCw class="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="flex-1">
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter class="w-5 h-5 text-violet-600" />
                Year Range Filter
              </h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar class="w-3 h-3 text-gray-500" />
                      From Year
                    </label>
                    <select 
                      v-model="fromYear" 
                      class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                    >
                      <option value="">Select Year</option>
                      <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar class="w-3 h-3 text-gray-500" />
                      To Year
                    </label>
                    <select 
                        v-model="toYear" 
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                      >
                        <option value="">Select Year</option>
                        <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                      </select>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button 
                    @click="clearYearSelection" 
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                  >
                    <X class="w-4 h-4" />
                    Clear
                  </button>
                  <button 
                    @click="showAdvanced = true" 
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 dark:text-violet-300 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                  >
                    <Settings class="w-4 h-4" />
                    Advanced
                  </button>
                </div>
              </div>
            </div>
          </div>
            </div>
          </transition>
        </div>

        <!-- Right Side - Table Area -->
        <div class="flex-1 p-4">

          
          <!-- No Project Selected State -->
          <div v-if="expenseData.status === 'no_project_selected'">
            <ExpenseNoProjectSelectedState />
          </div>

          <!-- No Data State (only when no default expenses exist) -->
          <div v-else-if="expenseData.status === 'no_data' && (!defaultExpenses || defaultExpenses.length === 0)">
            <NoDataState :project="expenseData.project" @add-expense="showAddExpenseModal = true" />
          </div>

          <!-- Error State -->
          <div v-else-if="expenseData.status === 'error'">
            <ExpenseErrorState :message="expenseData.message" @retry="refreshTable" />
          </div>

          <!-- Table Header with Stats -->
          <template v-else-if="visibleYears.length">
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Expense Overview</h2>
                </div>
              </div>
              <div class="mt-2">
                <button @click="restoreOriginal"
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium shadow-sm">
                  <RotateCcw class="w-4 h-4" />
                  Restore
                </button>
              </div>
            </div>

            <!-- Modern Table Container -->
            <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
              <div class="overflow-x-auto max-w-[100%] md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                <div class="min-w-full w-max">
                  <table class="w-full">
                    <!-- Enhanced Table Header -->
                    <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                      <tr>
                        <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                          <div class="flex items-center gap-1">
                            <Hash class="w-3 h-3" />
                            Code
                          </div>
                        </th>
                        <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                          <div class="flex items-center gap-1">
                            <Receipt class="w-3 h-3" />
                            Expense
                          </div>
                        </th>
                        <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                          <div class="flex items-center gap-1">
                            <Tag class="w-3 h-3" />
                            Cost Type
                          </div>
                        </th>
                        <th
                          v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])"
                          :key="'header-' + year"
                          :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                          class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-violet-700 transition-all duration-200 group text-sm dark:border-gray-700 dark:text-white"
                          @click="toggleCollapse(year)"
                          title="Click to collapse/expand"
                        >
                          <div class="flex items-center justify-center gap-1">
                            <span class="font-semibold">{{ year === 'Default' ? 'Default' : year }}</span>
                            <ChevronDown 
                              v-if="!isYearCollapsed(year)" 
                              class="w-3 h-3 transition-transform group-hover:scale-110" 
                            />
                            <ChevronRight 
                              v-else 
                              class="w-3 h-3 transition-transform group-hover:scale-110" 
                            />
                          </div>
                        </th>
                      </tr>
                      <tr class="bg-violet-500/90 text-xs">
                        <template v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])" :key="'months-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <th
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="year + '-' + label"
                              class="px-2 py-1 text-center border border-violet-300 min-w-[100px] font-medium"
                            >
                              {{ label }}
                            </th>
                            <th class="px-2 py-1 text-center border border-violet-300 min-w-[110px] font-semibold">
                              <div class="flex items-center justify-center gap-1">
                                <Calculator class="w-2 h-2" />
                                Total
                              </div>
                            </th>
                          </template>
                          <template v-else>
                            <th class="px-2 py-1 text-center border border-violet-300 min-w-[110px] font-semibold">
                              <div class="flex items-center justify-center gap-1">
                                <Calculator class="w-2 h-2" />
                                Total
                              </div>
                            </th>
                          </template>
                        </template>
                      </tr>
                    </thead>

                    <!-- Enhanced Table Body with Department and Location Grouping -->
                    <tbody class="text-gray-700 bg-white text-sm">
                      <template v-for="departmentGroup in groupedExpenses" :key="'department-' + departmentGroup.department">
                        <!-- Department Header Row -->
                        <tr class="bg-gradient-to-r from-violet-600 to-violet-700 border-b-2 border-violet-800">
                          <td colspan="3" class="px-3 py-3 font-bold text-white border-r border-violet-500">
                            <div class="flex items-center gap-2">
                              <Building class="w-4 h-4" />
                              {{ departmentGroup.department }}
                            </div>
                          </td>
                          <template v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])" :key="'department-header-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'department-cell-' + year + '-' + label"
                                class="px-1 py-1 text-center border border-violet-500 bg-violet-600"
                              ></td>
                              <td class="px-1 py-1 text-center border border-violet-500 bg-violet-600"></td>
                            </template>
                            <template v-else>
                              <td class="px-1 py-1 text-center border border-violet-500 bg-violet-600"></td>
                            </template>
                          </template>
                        </tr>
                        
                        <!-- Location Groups -->
                        <template v-for="locationGroup in departmentGroup.locations" :key="'location-' + locationGroup.location">
                          <!-- Location Header Row -->
                          <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b border-violet-300 dark:from-violet-800/40 dark:to-violet-700/40 dark:border-violet-600">
                            <td colspan="3" class="px-6 py-2 font-semibold text-violet-700 dark:text-white border-r border-violet-300 dark:border-violet-600">
                              <div class="flex items-center gap-2">
                                <MapPin class="w-3 h-3 dark:text-white" />
                                {{ locationGroup.location }}
                              </div>
                            </td>
                            <template v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])" :key="'location-header-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'location-cell-' + year + '-' + label"
                                  class="px-1 py-1 text-center border border-violet-300 bg-violet-100 dark:border-violet-600 dark:bg-violet-800/30"
                                ></td>
                                <td class="px-1 py-1 text-center border border-violet-300 bg-violet-100 dark:border-violet-600 dark:bg-violet-800/30"></td>
                              </template>
                              <template v-else>
                                <td class="px-1 py-1 text-center border border-violet-300 bg-violet-100 dark:border-violet-600 dark:bg-violet-800/30"></td>
                              </template>
                            </template>
                          </tr>
                          
                          <!-- Expense Rows for this Location -->
                           <tr
                            v-for="expense in getVisibleExpenses(locationGroup.expenses)"
                            :key="'expense-' + expense"
                            class="even:bg-gray-50 hover:bg-violet-50 transition-all duration-200 border-b border-gray-100 dark:even:bg-gray-800 dark:hover:bg-violet-900/20 dark:border-gray-700"
                          >
                            <td class="px-8 py-2 font-medium border-r border-violet-200 text-gray-600 dark:text-gray-300 dark:border-violet-700">
                              <div class="flex items-center gap-1">
                                <Hash class="w-2 h-2 text-gray-400" />
                                {{ getExpenseDetailsLocal(expense).code }}
                              </div>
                            </td>
                             <td class="px-3 py-2 font-medium border-r border-violet-200 dark:border-violet-700">
                              <div class="flex items-center justify-between gap-2">
                                <span>{{ expense }}</span>
                                <button @click="deleteExpense(expense)" class="text-red-600 hover:text-red-700" title="Delete expense">
                                  <X class="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-600">
                              <div class="flex items-center gap-1">
                                <Tag class="w-2 h-2 text-gray-400" />
                                {{ getExpenseDetailsLocal(expense).costType }}
                              </div>
                            </td>
                            <template v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])" :key="'row-' + year + '-' + expense">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'cell-' + year + '-' + label"
                                  contenteditable="true"
                                  class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 focus:bg-white dark:border-violet-700 dark:hover:bg-violet-900/20 dark:focus:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                  @input="handleCellInput({ year, label, expense, event: $event })"
                                  @focus="handleCellFocus({ year, label, expense, event: $event })"
                                  @blur="handleCellEditWrapper({ year, label, expense, event: $event, department: departmentGroup.department })"
                                >
                                  <span class=" text-xs">
                                    {{ year === 'Default' ? (isPercentageExpense(expense) ? '0.00%' : '0.00') : formatExpenseValue(getAmountForExpense(expenseData, expense, year, label, advancedModes[year] || displayMode, departmentGroup.department), expense) }}
                                  </span>
                                </td>
                                <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50 dark:border-violet-700 dark:bg-violet-900/20">
                                  <span class=" text-xs text-violet-700 dark:text-violet-300">
                                    {{ year === 'Default' ? (isPercentageExpense(expense) ? '0.00%' : '0.00') : formatExpenseValue(calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal, departmentGroup.department), expense) }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50 dark:border-violet-700 dark:bg-violet-900/20">
                                  <span class=" text-xs text-violet-700 dark:text-violet-300">
                                    {{ year === 'Default' ? (isPercentageExpense(expense) ? '0.00%' : '0.00') : formatExpenseValue(calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal, departmentGroup.department), expense) }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                        </template>
                        
                        <!-- Department Total Row -->
                        <tr class="bg-gradient-to-r from-violet-200 to-violet-300 border-y-2 border-violet-500">
                          <td colspan="3" class="px-3 py-2 font-bold text-violet-900 border-r border-violet-400">
                            <div class="flex items-center gap-1">
                              <Calculator class="w-3 h-3" />
                              Department Total
                            </div>
                          </td>
                          <template v-for="year in (visibleYears.length > 0 ? visibleYears : ['Default'])" :key="'department-total-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'department-total-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-400 bg-violet-200 font-bold text-violet-900 dark:border-violet-600 dark:bg-violet-800/30 dark:text-violet-200"
                              >
                                <span class=" text-xs">
                                  {{ year === 'Default' ? '0.00' : calculateDepartmentMonthTotal(expenseData, departmentGroup, year, label, advancedModes[year] || displayMode) }}
                                </span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-400 bg-violet-200 font-bold text-violet-900 dark:border-violet-600 dark:bg-violet-800/30 dark:text-violet-200">
                                <span class=" text-xs">
                                  {{ year === 'Default' ? '0.00' : calculateDepartmentTotal(expenseData, departmentGroup, year, advancedModes[year] || displayMode) }}
                                </span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-400 bg-violet-200 font-bold text-violet-900 dark:border-violet-600 dark:bg-violet-800/30 dark:text-violet-200">
                                <span class=" text-xs">
                                  {{ year === 'Default' ? '0.00' : calculateDepartmentTotal(expenseData, departmentGroup, year, advancedModes[year] || displayMode) }}
                                </span>
                              </td>
                            </template>
                          </template>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>

          
          
          <!-- Enhanced No Years Selected State -->
          <template v-else>
            <ExpenseNoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
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
            <AlertTriangle class="w-4 h-4 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure advanced settings.</span>
          </div>

          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'adv-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-3 h-3 text-violet-600" />
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
            <Check class="w-4 h-4" />
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <div class="flex items-center gap-3">
            <PlusCircle class="w-7 h-7 text-white" />
            <div>
              <h2 class="text-2xl font-bold text-white">Add New Expense</h2>
              <p class="text-violet-100 mt-1 text-sm">Enter expense details for the selected period</p>
            </div>
          </div>
          <button 
            @click="cancelAddExpense"
            class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
          >
            <X class="w-4 h-4" />
          </button>
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
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Month/Quarter</label>
              <select v-model="addExpenseForm.month" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white">
                <option disabled value="">Choose a month/quarter</option>
                <option v-for="month in months" :key="'add-month-' + month" :value="month">{{ month }}</option>
              </select>
            </div>
          </div>

          <!-- Quick Actions Dropdown Card -->
          <div class="mb-6">
            <button
              @click="showQuickActions = !showQuickActions"
              class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-200 rounded-lg hover:from-violet-100 hover:to-violet-200 transition-all duration-200"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Plus class="w-4 h-4 text-white" />
                </div>
                <span class="text-lg font-semibold text-violet-800">Quick Actions</span>
              </div>
              <ChevronDown 
                :class="['w-5 h-5 text-violet-600 transition-transform duration-200', showQuickActions ? 'rotate-180' : '']" 
              />
            </button>
            
            <div v-show="showQuickActions" class="mt-3 space-y-4 p-4 bg-white border border-violet-200 rounded-lg shadow-sm">

              <!-- Add Expense UI -->
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <Receipt class="w-5 h-5 text-violet-600" />
                  <span class="text-md font-semibold text-gray-700">Create New Expense</span>
                </div>
                <div class="grid grid-cols-4 gap-3">
                  <input
                    v-model="newAccount.account_name"
                    type="text"
                    placeholder="Account Name"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                  />
                  <input
                    v-model="newAccount.account_number"
                    type="text"
                    placeholder="Account Number"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    @keypress="allowOnlyNumbers"
                    @paste="handlePaste"
                    @input="validateAccountNumber"
                  />
                  <select
                    v-model="newAccount.parent_account"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                  >
                    <option value="">Parent Account</option>
                    <option v-for="account in groupAccounts" :key="account" :value="account">
                      {{ account }}
                    </option>
                  </select>
                  <button
                    :disabled="creatingAccount || !newAccount.account_name.trim() || !newAccount.account_number.trim() || !newAccount.parent_account"
                    @click="createAccount"
                    class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus class="w-4 h-4" />
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Cards -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-1 h-6 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full"></div>
              <h3 class="text-lg font-semibold text-gray-800">Expense Items</h3>
            </div>

            <div class="space-y-4">
              <div
                v-for="(row, index) in addExpenseForm.rows"
                :key="'expense-row-' + index"
                class="bg-white hover:border-violet-200 rounded-lg p-6 hover:shadow-md border-2 transition-all"
              >
                <!-- Row Header -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-800">Expense Entry {{ index + 1 }}</h4>
                  <button
                    @click="removeExpenseRow(index)"
                    :disabled="addExpenseForm.rows.length === 1"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove entry"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <!-- Form Fields Grid -->
                <div class="grid grid-cols-2 rounded-lg p-2 gap-6">
                  <!-- Department -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      v-model="row.department"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Department</option>
                      <option v-for="dept in modalDepartments" :key="dept" :value="dept">{{ dept }}</option>
                    </select>
                  </div>

                  <!-- Department Location -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Department Location</label>
                    <select
                      v-model="row.department_location"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Department Location</option>
                      <option v-for="loc in modalDepartmentLocations" :key="loc" :value="loc">{{ loc }}</option>
                    </select>
                  </div>

                  <!-- Expense Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expense Name</label>
                    <select
                      v-model="row.expense"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select expense</option>
                      <option v-for="option in expenseOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                  </div>

                  <!-- Cost Type -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cost Type</label>
                    <select
                      v-model="row.costType"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Cost Type</option>
                      <option v-for="option in costTypeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                    </select>
                  </div>

                  <!-- Amount -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      v-model="row.amountDisplay"
                      @keypress="allowOnlyNumbersFromPayroll"
                      @input="formatAmountInputWrapper(index, $event)"
                      @blur="cleanAmountValueWrapper(index)"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-left"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-3 pb-3 border-t border-gray-200 bg-white sticky bottom-0">
            <button 
              @click="addExpenseRow" 
              class="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
            >
              <Plus class="w-5 h-5" />
              Add Row
            </button>
            <div class="flex gap-3">
              <button
                @click="cancelAddExpense"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <X class="w-5 h-5" />
                Cancel
              </button>
              <button 
                @click="submitAddExpenseWrapper" 
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center gap-2"
              >
                <Check class="w-5 h-5" />
                Submit
              </button>
            </div>
          </div>
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
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import Sidebar from "@/components/ui/Sidebar.vue";
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js';
import { CircleAlert, AlertTriangle, Calculator, Table, Download, RefreshCw, FolderOpen, Receipt, Tag, ChevronDown, ChevronRight, ChevronLeft, Hash, Calendar, ArrowLeft, Settings, X, Check, PlusCircle, Plus, Trash2, DollarSign, Loader2, AlertCircle, Building2, Save, Filter, Building, MapPin, RotateCcw } from 'lucide-vue-next';
import alertService from "@/components/ui/ui_utility/alertService.js";

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
  loadDefaultExpensesForProject,
  loadAllExpensesAndCategories,
  extractAllExpenses,
  
  // Table display and interaction
  toggleCollapse,
  isYearCollapsed,

  getExpensesGroupedByCategory,
  getAllExpensesGroupedByCategory,
  getExpensesGroupedByDepartmentAndLocation,
  getExpenseDetails,
  getExpenseDetailsFromAllExpenses,
  getExpenseDetailsWithDefaults,
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
  handleCellFocus,
  calculateCategoryMonthTotal,
  calculateDepartmentMonthTotal,
  calculateDepartmentTotal
} from "@/components/utility/expense_assumption/expense_estimate_utils.js";
import { saveChanges } from "@/components/utility/expense_assumption/save_changes.js";
import { submitAddExpense } from "@/components/utility/expense_assumption/submit_add_expense.js";
import { selectedProject, initializeProjectService, getProjectDepartments } from '@/components/utility/dashboard/projectService.js';
import { loadDepartmentLocationOptions } from '@/components/utility/payroll/payroll_data_service.js';
import ExpenseNoProjectSelectedState from '@/components/ui/expense/ExpenseNoProjectSelectedState.vue';
import NoDataState from '@/components/ui/expense/NoDataState.vue';
import ExpenseErrorState from '@/components/ui/expense/ExpenseErrorState.vue';
import ExpenseNoYearsSelectedState from '@/components/ui/expense/ExpenseNoYearsSelectedState.vue';
import { allowOnlyNumbers as allowOnlyNumbersFromPayroll } from '@/components/utility/payroll/index.js';
import SettingsModal from '@/components/ui/SettingsModal.vue';


// Reactive state
const years = ref([]);
const displayMode = ref("monthly");
const expenses = ref([]);
const expenseData = ref({});
const allExpensesData = ref([]); // New: All expenses from Expense Assumptions doctype
const defaultExpenses = ref([]); // New: Default expenses for project departments
const showAdvanced = ref(false);
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
const deletedExpenses = ref(new Set());
const changedCells = ref([]); // {year, label, expense, newValue}
const isSaving = ref(false);
const saveError = ref("");
const showUnsavedWarning = ref(false);
const pendingNavigation = ref(null); // Store the pending navigation action
const sidebarCollapsed = ref(false);
const newCategoryName = ref("");
const creatingCategory = ref(false);
const newAccount = ref({
  account_name: "",
  account_number: "",
  parent_account: ""
});
const creatingAccount = ref(false);
const groupAccounts = ref([]);
const showQuickActions = ref(false);
const categoryCreateError = ref("");
const categoryCreateSuccess = ref("");
const modalDepartments = ref([]);
const modalDepartmentLocations = ref([]);
const showSettingsModal = ref(false);

// Pinia store for year settings
const yearSettingsStore = useYearSettingsStore();
const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;

// Calculation cache for storing expense calculations
const calculationCache = useCalculationCache();

// Computed properties
const visibleYears = computed(() => {
  const yearsArr = getVisibleYears(fromYear.value, toYear.value);
  return yearsArr;
});

// Computed property for filtered years in "To Year" dropdown
const filteredToYears = computed(() => {
  return getFilteredToYears(years.value);
});


const groupedExpenses = computed(() => {
  // Use the new department and location grouping with default expenses
  const result = getExpensesGroupedByDepartmentAndLocation(expenseData.value, visibleYears.value, defaultExpenses.value);
  return result;
});

function deleteExpense(expense) {
  const next = new Set(deletedExpenses.value);
  next.add(expense);
  deletedExpenses.value = next;
  isSaved.value = false;
}

function isExpenseDeleted(expense) {
  return deletedExpenses.value.has(expense);
}

function restoreOriginal() {
  try {
    if (originalExpenseData.value && Object.keys(originalExpenseData.value).length) {
      expenseData.value = cloneDeep(originalExpenseData.value);
    }
    deletedExpenses.value = new Set();
    isSaved.value = false;
    alertService.info('Restored to original');
  } catch (e) {}
}

function getVisibleExpenses(expensesArray) {
  const deleted = deletedExpenses.value;
  return (expensesArray || []).filter((name) => !deleted.has(name));
}

// Removed hasDataForSelectedYears check; table now shows when years are selected,
// and default expenses will render when present

// Computed property to get column labels for a specific year
const getColumnLabelsForYearLocal = (year) => {
  // Handle the default case when no years are selected
  if (year === 'Default') {
    return ['Default']; // Return a single column for default expenses
  }
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Function to get expense details using the new approach
const getExpenseDetailsLocal = (expense) => {
  if (allExpensesData.value.length > 0) {
    return getExpenseDetailsFromAllExpenses(allExpensesData.value, expense);
  }
  // Use the new function that can handle both default and existing expenses
  return getExpenseDetailsWithDefaults(expenseData.value, expense, visibleYears.value, defaultExpenses.value);
};

// Watch for changes in visible years to initialize advanced modes
watch(visibleYears, () => {
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      // Use Pinia action to set mode for new years
      yearSettingsStore.setAdvancedMode(year, displayMode.value);
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

// Watch for project changes to reload expense data
watch(selectedProject, async (newProject, oldProject) => {
  if (newProject && newProject !== oldProject) {
    try {
     //  // console.log('Project changed, reloading expense data for:', newProject.project_name);
      
      // Reload all expenses and categories for the new project
      const allExpensesResult = await loadAllExpensesAndCategories();
      if (allExpensesResult.status === 'success') {
        allExpensesData.value = allExpensesResult.expenses;
      }
      
      // Reload default expenses for the new project
      const defaultExpensesResult = await loadDefaultExpensesForProject();
      if (defaultExpensesResult.status === 'success') {
        defaultExpenses.value = defaultExpensesResult.defaultExpenses;
      }
      
      // Reload expense data for the new project (for cell values)
      expenseData.value = await loadExpenseData();
      
      // Cache the expense data for other components to use
      if (!expenseData.value.status && selectedProject.value?.project_name) {
        cacheExpenseData(expenseData.value, selectedProject.value.project_name);
      }
      
      // Handle the response based on its structure
      if (!expenseData.value.status) {
        originalExpenseData.value = cloneDeep(expenseData.value);
        expenses.value = extractAllExpenses(expenseData.value);
      } else {
        originalExpenseData.value = expenseData.value;
        expenses.value = [];
      }
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      
     //  // console.log("Expense data loaded for project:", newProject.project_name);
      alertService.success(`Switched to project: ${newProject.project_name}`);

      // Refresh modal departments for new project
      try {
        modalDepartments.value = await getProjectDepartments(newProject.project_name);
      } catch (e) {
        modalDepartments.value = [];
      }
      // Refresh department locations too
      try {
        const respLoc = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.get_payroll_department_location_list', {
          headers: {
            'X-Frappe-CSRF-Token': getCSRFToken()
          }
        });
        const jsonLoc = await respLoc.json();
        if (jsonLoc.message && jsonLoc.message.success) {
          modalDepartmentLocations.value = (jsonLoc.message.locations || []).map(l => l.department_location || l.name);
        } else {
          modalDepartmentLocations.value = [];
        }
      } catch (e) {
        modalDepartmentLocations.value = [];
      }
    } catch (error) {
      console.error("Error loading project data:", error);
      alertService.error("Failed to load project data. Please try again.");
    }
  }
}, { immediate: true }); // Add immediate: true to run on component creation

// Additional watcher to ensure default expenses are loaded when project is actually selected
watch(() => selectedProject.value?.project_name, async (newProjectName, oldProjectName) => {
  if (newProjectName && newProjectName !== oldProjectName) {
    try {
     //  // console.log('Project name changed, loading default expenses for:', newProjectName);
     //  // console.log('Full selectedProject object:', selectedProject.value);
     //  // console.log('Project name field:', selectedProject.value?.project_name);
     //  // console.log('Project name field:', selectedProject.value?.name);
      
      // Load default expenses for the newly selected project
      const defaultExpensesResult = await loadDefaultExpensesForProject();
     //  // console.log('Default expenses result:', defaultExpensesResult);
      if (defaultExpensesResult.status === 'success') {
        defaultExpenses.value = defaultExpensesResult.defaultExpenses;
       //  // console.log('Set defaultExpenses to:', defaultExpenses.value);
      } else {
       //  // console.log('Failed to load default expenses:', defaultExpensesResult.message);
      }
    } catch (error) {
      console.error("Error loading default expenses for project:", error);
    }
  }
}, { immediate: true });

// When opening the modal, copy the current settings
watch(showAdvanced, (val) => {
  if (val) {
    tempAdvancedModes.value = { ...advancedModes.value };
  }
});

function applyAdvancedSettings() {
  setAdvancedModes({ ...tempAdvancedModes.value });
  showAdvanced.value = false;
}

function cancelAdvancedSettings() {
  showAdvanced.value = false;
}

// On mount, initialize years from localStorage if available
onMounted(async () => {
  try {
    await initializeProjectService();
    years.value = await loadYearOptions();
    
    // Load all expenses and categories from Expense Assumptions doctype
    const allExpensesResult = await loadAllExpensesAndCategories();
    if (allExpensesResult.status === 'success') {
      allExpensesData.value = allExpensesResult.expenses;
    }
    
    // Load default expenses for project departments ONLY if a project is selected
    if (selectedProject.value) {
      const defaultExpensesResult = await loadDefaultExpensesForProject();
      if (defaultExpensesResult.status === 'success') {
        defaultExpenses.value = defaultExpensesResult.defaultExpenses;
      }
    }
    
    // Load expense data for the selected years (for cell values)
    expenseData.value = await loadExpenseData();
    if (!expenseData.value.status) {
      originalExpenseData.value = cloneDeep(expenseData.value);
      expenses.value = extractAllExpenses(expenseData.value);
    } else {
      originalExpenseData.value = expenseData.value;
      expenses.value = [];
    }
    
    expenseOptions.value = (await getExpenseList())?.map(name => ({ label: name, value: name })) || [];
    const fieldOptions = await getExpenseFieldOptions();
    categoryOptions.value = fieldOptions.hospitality_category.map(category => ({ label: category, value: category }));
    costTypeOptions.value = fieldOptions.cost_type.map(costType => ({ label: costType, value: costType }));
    
    // Load group accounts
    const response = await fetch("/api/v2/method/ex_forcast.api.account_list.get_group_accounts", {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
    const result = await response.json();
    if (result.data && result.data.group_accounts) {
      groupAccounts.value = result.data.group_accounts;
    }
    // Load project departments for modal
    if (selectedProject && selectedProject.value && selectedProject.value.project_name) {
      try {
        modalDepartments.value = await getProjectDepartments(selectedProject.value.project_name);
      } catch (e) {
        modalDepartments.value = [];
      }
    }
    // Load department locations (global list used elsewhere; reuse here)
    try {
      await loadDepartmentLocationOptions();
      // read from payroll service reactive ref via dynamic import not needed since function populates its own ref; we replicate by fetching API directly here
      const respLoc = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.get_payroll_department_location_list', {
        headers: {
          'X-Frappe-CSRF-Token': getCSRFToken()
        }
      });
      const jsonLoc = await respLoc.json();
      if (jsonLoc.message && jsonLoc.message.success) {
        modalDepartmentLocations.value = (jsonLoc.message.locations || []).map(l => l.department_location || l.name);
      } else {
        modalDepartmentLocations.value = [];
      }
    } catch (e) {
      modalDepartmentLocations.value = [];
    }
    
    isSaved.value = true;
    
    // Check if we should show refresh success alert
    if (localStorage.getItem('showRefreshSuccess') === 'true') {
      localStorage.removeItem('showRefreshSuccess');
      alertService.success("Page refreshed successfully");
    }
    
    // Manual trigger: If project is already selected, load default expenses
    if (selectedProject.value?.project_name) {
     //  // console.log('Manual trigger: Loading default expenses for existing project:', selectedProject.value.project_name);
      const defaultExpensesResult = await loadDefaultExpensesForProject();
      if (defaultExpensesResult.status === 'success') {
        defaultExpenses.value = defaultExpensesResult.defaultExpenses;
       //  // console.log('Manual trigger: Set defaultExpenses to:', defaultExpenses.value);
      }
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
});


function clearYearSelection() {
  clearYearSettings();
  isSaved.value = false;
}

function handleCellEditWrapper({ year, label, expense, event, department }) {
  handleCellEdit({
    year,
    label,
    expense,
    event,
    originalExpenseData,
    changedCells,
    expenseData,
    isSaved,
    department
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
    await submitAddExpense(addExpenseForm, showAddExpenseModal, resetExpenseForm, isSaved, alertService, async () => {
      // Reload all expenses and categories
      const allExpensesResult = await loadAllExpensesAndCategories();
      if (allExpensesResult.status === 'success') {
        allExpensesData.value = allExpensesResult.expenses;
      }
      
      // Reload and cache expense data after adding new expense
      if (selectedProject.value?.project_name) {
        expenseData.value = await loadExpenseData();
        if (!expenseData.value.status) {
          cacheExpenseData(expenseData.value, selectedProject.value.project_name);
        }
      }
      
      // Reload default expenses
      const defaultExpensesResult = await loadDefaultExpensesForProject();
      if (defaultExpensesResult.status === 'success') {
        defaultExpenses.value = defaultExpensesResult.defaultExpenses;
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
  await saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData, defaultExpenses.value);
  
  // Cache the updated expense data after saving
  if (selectedProject.value?.project_name && !expenseData.value.status) {
    cacheExpenseData(expenseData.value, selectedProject.value.project_name);
  }
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

// Cache expense data for other components to use
function cacheExpenseData(expenseData, projectName) {
  try {
    if (!expenseData || !projectName) return;
    
    // Clear existing cache for this project's expenses
    calculationCache.clearCache(projectName, 'Expense Assumptions');
    
    // Cache expense amounts by department, expense name, year, and month
    for (const [year, months] of Object.entries(expenseData)) {
      for (const [month, entries] of Object.entries(months)) {
        entries.forEach(entry => {
          if (entry.expense && entry.amount && entry.department) {
            const amount = parseFloat(entry.amount);
            if (amount > 0) {
              // Cache with project, page, rowCode (expense name), year, month, and amount
              calculationCache.setValue(
                projectName,
                'Expense Assumptions',
                entry.expense,
                year,
                month,
                amount
              );
              
              // Also cache by department for easier filtering
              calculationCache.setValue(
                projectName,
                `Expense Assumptions:${entry.department}`,
                entry.expense,
                year,
                month,
                amount
              );
            }
          }
        });
      }
    }
    
    // console.log(`[EXPENSE CACHE] Cached ${Object.keys(expenseData).length} years of expense data for project: ${projectName}`);
  } catch (error) {
    console.error('Error caching expense data:', error);
  }
}

// Export table data functionality
function exportTableData() {
  try {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = ["Code", "Expense", "Cost Type"];
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
    groupedExpenses.value.forEach(departmentGroup => {
      departmentGroup.locations.forEach(locationGroup => {
        locationGroup.expenses.forEach(expense => {
          const row = [
            getExpenseDetailsLocal(expense).code,
            expense,
            getExpenseDetailsLocal(expense).costType
          ];
          
          visibleYears.value.forEach(year => {
            if (!isYearCollapsed(year)) {
              getColumnLabelsForYearLocal(year).forEach(label => {
                const amount = getAmountForExpense(expenseData.value, expense, year, label, advancedModes.value[year] || displayMode.value, departmentGroup.department);
                row.push(formatExpenseValue(amount, expense));
              });
            }
            const total = calculateTotalForExpense(expenseData.value, expense, year, advancedModes.value[year] || displayMode.value, getColumnLabelsForYearLocal, departmentGroup.department);
            row.push(formatExpenseValue(total, expense));
          });
          
          csvContent += row.join(",") + "\n";
        });
      });
    });
    
    // Download the file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expense_data_${fromYear.value}_${toYear.value}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting data:", error);
    alertService.error("Failed to export data. Please try again.");
  }
}



// Refresh table functionality - reload entire page
function refreshTable() {
  // Set flag to show success alert after reload
  localStorage.setItem('showRefreshSuccess', 'true');
  // Reload the entire page
  window.location.reload();
}

async function createExpenseCategory() {
  if (!newCategoryName.value.trim()) return;
  creatingCategory.value = true;
  categoryCreateError.value = "";
  categoryCreateSuccess.value = "";
  try {
    const response = await fetch("/api/v2/method/ex_forcast.api.expense_options.create_expense_category", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify({ category_name: newCategoryName.value.trim() })
    });
    const result = await response.json();
   //  // console.log('create_expense_category API result:', result);
    if (result.data && result.data.success) {
      alertService.success(`Category '${newCategoryName.value.trim()}' created successfully!`);
      newCategoryName.value = "";
      // Refresh category options
      const fieldOptions = await getExpenseFieldOptions();
      categoryOptions.value = fieldOptions.hospitality_category.map(category => ({ label: category, value: category }));
    } else {
      alertService.error((result.data && result.data.error) || result.error || "Failed to create category.");
    }
  } catch (err) {
    alertService.error("Failed to create category.");
  } finally {
    creatingCategory.value = false;
  }
}

async function createAccount() {
  if (!newAccount.value.account_name.trim() || !newAccount.value.account_number.trim() || !newAccount.value.parent_account) return;
  creatingAccount.value = true;
  try {
    const response = await fetch("/api/v2/method/ex_forcast.api.account_list.create_account", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify({
        account_name: newAccount.value.account_name.trim(),
        account_number: newAccount.value.account_number.trim(),
        parent_account: newAccount.value.parent_account
      })
    });
    const result = await response.json();
    if (result.data && result.data.success) {
      alertService.success(`Account '${newAccount.value.account_name.trim()}' created successfully!`);
      newAccount.value = { account_name: "", account_number: "", parent_account: "" };
      // Refresh expense options
      expenseOptions.value = (await getExpenseList())?.map(name => ({ label: name, value: name })) || [];
    } else {
      alertService.error((result.data && result.data.error) || result.error || "Failed to create account.");
    }
  } catch (err) {
    alertService.error("Failed to create account.");
  } finally {
    creatingAccount.value = false;
  }
}

function allowOnlyNumbers(event) {
  // Allow only numbers (0-9)
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}

function handlePaste(event) {
  event.preventDefault();
  const pastedText = (event.clipboardData || window.clipboardData).getData('text');
  const numericOnly = pastedText.replace(/[^0-9]/g, '');
  newAccount.value.account_number += numericOnly;
}

function validateAccountNumber(event) {
  // Remove any non-numeric characters
  newAccount.value.account_number = event.target.value.replace(/[^0-9]/g, '');
}

function openSettings() {
  showSettingsModal.value = true;
}

function closeSettings() {
  showSettingsModal.value = false;
}

// Helper function to determine if an expense should be displayed as a percentage
function isPercentageExpense(expenseName) {
  const percentageExpenses = [
    'Cost of Beverage sales',
    'Cost of Food sales'
  ];
  return percentageExpenses.includes(expenseName);
}

// Helper function to format expense value as percentage or currency
function formatExpenseValue(value, expenseName) {
  if (isPercentageExpense(expenseName)) {
    // Convert decimal to percentage (e.g., 0.25 -> 25.00%)
    const percentage = (parseFloat(value) * 100).toFixed(2);
    return `${percentage}%`;
  }
  // Return as currency (existing behavior)
  return value;
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
