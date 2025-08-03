<template>
  <div class="flex ">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
          <!-- Collapse/Expand Button -->
          <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-5 h-5 text-violet-700" />
            <ChevronRight v-else class="w-5 h-5 text-violet-700" />
            <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium">Collapse</span>
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
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  Unsaved
                </div>
                <div
                  v-else
                  class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  All Saved
                </div>
              </div>
              
              <button
                v-if="!isSaving && !isSaved"
                :disabled="isSaving"
                @click="saveChangesWrapper"
                class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                Save
              </button>
              <button
                v-if="isSaving"
                class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed"
              >
                <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Saving...
              </button>
            </div>
            <span v-if="saveError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ saveError }}
            </span>
          </div>
          
          <!-- Action Buttons Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Quick Actions
            </h3>
            <button 
              @click="showAddExpenseModal = true" 
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Expense
            </button>
            
            <div class="flex gap-2 mt-3">
              <button 
                @click="refreshTable"
                class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium"
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
                      v-model="fromYear" 
                      class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
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
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Clear
                  </button>
                  <button 
                    @click="showAdvanced = true" 
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
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

        <!-- Right Side - Table Area -->
        <div class="flex-1 p-4">
          <!-- No Project Selected State -->
          <div v-if="expenseData.status === 'no_project_selected'" class="flex flex-col items-center justify-center h-96">
            <div class="w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mb-6">
              <FolderOpen class="w-12 h-12 text-violet-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No Project Selected</h3>
            <p class="text-gray-600 mb-6 text-center max-w-md">
              Please go to the Dashboard and select a project to view and manage expense data.
            </p>
            <router-link 
              to="/dashboard" 
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <ArrowLeft class="w-4 h-4" />
              Go to Dashboard
            </router-link>
          </div>

          <!-- No Data State -->
          <div v-else-if="expenseData.status === 'no_data'" class="flex flex-col items-center justify-center h-96">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
              <Receipt class="w-12 h-12 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No Expense Data Found</h3>
            <p class="text-gray-600 mb-6 text-center max-w-md">
              The project <span class="font-semibold text-violet-600">{{ expenseData.project }}</span> doesn't have any expense data yet.
            </p>
            <button 
              @click="showAddExpenseModal = true"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus class="w-4 h-4" />
              Add First Expense
            </button>
          </div>

          <!-- Error State -->
          <div v-else-if="expenseData.status === 'error'" class="flex flex-col items-center justify-center h-96">
            <div class="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle class="w-12 h-12 text-red-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
            <p class="text-gray-600 mb-6 text-center max-w-md">
              {{ expenseData.message }}
            </p>
            <button 
              @click="refreshTable"
              class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <RefreshCw class="w-4 h-4" />
              Try Again
            </button>
          </div>

          <!-- Table Header with Stats -->
          <template v-else-if="visibleYears.length && hasDataForSelectedYears">
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Table class="w-3 h-3 text-white" />
                </div>
                <h2 class="text-lg font-bold text-gray-800">Expense Overview</h2>
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
                          v-for="year in visibleYears"
                          :key="'header-' + year"
                          :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                          class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-violet-700 transition-all duration-200 group text-sm"
                          @click="toggleCollapse(year)"
                          title="Click to collapse/expand"
                        >
                          <div class="flex items-center justify-center gap-1">
                            <span class="font-semibold">{{ year }}</span>
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
                        <template v-for="year in visibleYears" :key="'months-' + year">
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

                    <!-- Enhanced Table Body -->
                    <tbody class="text-gray-700 bg-white text-sm">
                      <template v-for="categoryGroup in groupedExpenses" :key="'category-' + categoryGroup.category">
                        <!-- Category Header Row -->
                        <tr class="bg-gradient-to-r from-violet-50 to-violet-100 border-b border-violet-200">
                          <td colspan="3" class="px-3 py-2 font-bold text-violet-800 border-r border-violet-300">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              {{ categoryGroup.category }}
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'category-header-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'category-cell-' + year + '-' + label"
                                class="px-1 py-1 text-center border border-violet-200 bg-violet-50"
                              ></td>
                              <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                            </template>
                            <template v-else>
                              <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                            </template>
                          </template>
                        </tr>
                        
                        <!-- Expense Rows for this Category -->
                        <tr
                          v-for="expense in categoryGroup.expenses"
                          :key="'expense-' + expense"
                          class="even:bg-gray-50 hover:bg-violet-50 transition-all duration-200 border-b border-gray-100"
                        >
                          <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-600">
                            <div class="flex items-center gap-1">
                              <Hash class="w-2 h-2 text-gray-400" />
                              {{ getExpenseDetailsLocal(expense).code }}
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-violet-200">
                            <div class="flex items-center gap-1">
                              <Receipt class="w-3 h-3 text-violet-500" />
                              {{ expense }}
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-600">
                            <div class="flex items-center gap-1">
                              <Tag class="w-2 h-2 text-gray-400" />
                              {{ getExpenseDetailsLocal(expense).costType }}
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'row-' + year + '-' + expense">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'cell-' + year + '-' + label"
                                contenteditable="true"
                                class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                @input="handleCellInput({ year, label, expense, event: $event })"
                                @focus="handleCellFocus({ year, label, expense, event: $event })"
                                @blur="handleCellEditWrapper({ year, label, expense, event: $event })"
                              >
                                <span class="font-mono text-xs">{{ getAmountForExpense(expenseData, expense, year, label, advancedModes[year] || displayMode) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700">
                                  {{ calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal) }}
                                </span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700">
                                  {{ calculateTotalForExpense(expenseData, expense, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal) }}
                                </span>
                              </td>
                            </template>
                          </template>
                        </tr>
                        
                        <!-- Category Total Row -->
                        <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-y-2 border-violet-400">
                          <td colspan="3" class="px-3 py-2 font-bold text-violet-900 border-r border-violet-300">
                            <div class="flex items-center gap-1">
                              <Calculator class="w-3 h-3" />
                              Total
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'category-total-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'category-total-cell-' + year + '-' + label"
                                class="px-1 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                              >
                                <span class="font-mono text-xs">
                                  {{ calculateCategoryMonthTotal(expenseData, categoryGroup.expenses, year, label, advancedModes[year] || displayMode) }}
                                </span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">
                                  {{ calculateCategoryTotal(expenseData, categoryGroup.expenses, year, advancedModes[year] || displayMode) }}
                                </span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">
                                  {{ calculateCategoryTotal(expenseData, categoryGroup.expenses, year, advancedModes[year] || displayMode) }}
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

          <!-- No Data for Selected Years State -->
          <template v-else-if="visibleYears.length && !hasDataForSelectedYears">
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                <Receipt class="w-8 h-8 text-blue-600" />
              </div>
              <h3 class="text-lg text-gray-800 font-semibold mb-2">No Expense Data Found</h3>
              <p class="text-gray-600 text-center max-w-md leading-relaxed text-sm">
                No expense data found for the selected years ({{ fromYear }} - {{ toYear }}) in project <span class="font-semibold text-violet-600">{{ selectedProject?.project_name }}</span>.
              </p>
              <button 
                @click="showAddExpenseModal = true"
                class="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Plus class="w-4 h-4" />
                Add First Expense
              </button>
            </div>
          </template>

          <!-- Enhanced No Years Selected State -->
          <template v-else>
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
              <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <CircleAlert class="w-8 h-8 text-violet-500" />
              </div>
              <h3 class="text-lg text-violet-700 font-semibold mb-2">
                {{ fromYear && !toYear ? 'Select "To Year"' : !fromYear && toYear ? 'Select "From Year"' : 'No Years Selected' }}
              </h3>
              <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the expense table.' : 
                   !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the expense table.' :
                     'Please select both "From Year" and "To Year" in the left panel to display the expense table.' }}
              </p>
              <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                <ArrowLeft class="w-3 h-3" />
                <span>Use the filters on the left to get started</span>
              </div>
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
          <Settings class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Advanced Display Mode Settings</h2>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pt-6">
          <!-- Message when no years selected -->
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure advanced settings.</span>
          </div>

          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'adv-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
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
            <X class="w-6 h-6" />
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
              <!-- Add Expense Category UI -->
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <FolderOpen class="w-5 h-5 text-violet-600" />
                  <span class="text-md font-semibold text-gray-700">Create New Expense Category</span>
                </div>
                <div class="flex gap-2 items-center">
                  <input
                    v-model="newCategoryName"
                    type="text"
                    placeholder="Enter new category name"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    @keyup.enter="createExpenseCategory"
                  />
                  <button
                    :disabled="creatingCategory || !newCategoryName.trim()"
                    @click="createExpenseCategory"
                    class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Plus class="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              <!-- Add Account UI -->
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <Receipt class="w-5 h-5 text-violet-600" />
                  <span class="text-md font-semibold text-gray-700">Create New Account</span>
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
                    <th class="text-left px-6 py-4 font-semibold"><Receipt class="w-4 h-4 inline mr-1" /> Expense Name</th>
                    <th v-if="hospitalityExperience" class="text-left px-6 py-4 font-semibold"><FolderOpen class="w-4 h-4 inline mr-1" /> Category</th>
                    <th class="text-left px-6 py-4 font-semibold"><Tag class="w-4 h-4 inline mr-1" /> Cost Type</th>
                    <th class="text-left px-6 py-4 font-semibold"><DollarSign class="w-4 h-4 inline mr-1" /> Amount</th>
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
                        <Trash2 class="w-5 h-5" />
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

</template>






<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import Sidebar from "@/components/ui/Sidebar.vue";
import { CircleAlert, AlertTriangle, Calculator, Table, Download, RefreshCw, FolderOpen, Receipt, Tag, ChevronDown, ChevronRight, ChevronLeft, Hash, Calendar, ArrowLeft, Settings, X, Check, PlusCircle, Plus, Trash2, DollarSign } from 'lucide-vue-next';
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
  loadAllExpensesAndCategories,
  extractAllExpenses,
  
  // Table display and interaction
  toggleCollapse,
  isYearCollapsed,

  getExpensesGroupedByCategory,
  getAllExpensesGroupedByCategory,
  getExpenseDetails,
  getExpenseDetailsFromAllExpenses,
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
  calculateCategoryMonthTotal // <-- add this import
} from "@/components/utility/expense_assumption/expense_estimate_utils.js";
import { saveChanges } from "@/components/utility/expense_assumption/save_changes.js";
import { submitAddExpense } from "@/components/utility/expense_assumption/submit_add_expense.js";
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';


// Reactive state
const years = ref([]);
const displayMode = ref("monthly");
const expenses = ref([]);
const expenseData = ref({});
const allExpensesData = ref([]); // New: All expenses from Expense Assumptions doctype
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

// Pinia store for year settings
const yearSettingsStore = useYearSettingsStore();
const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;

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
  // Use all expenses data to show all expenses, regardless of year data
  if (allExpensesData.value.length > 0) {
    return getAllExpensesGroupedByCategory(allExpensesData.value);
  }
  // Fallback to the old method if no all expenses data is available
  return getExpensesGroupedByCategory(expenseData.value, visibleYears.value);
});

// Check if there's data for the selected years
const hasDataForSelectedYears = computed(() => {
  // If no years are selected, return false
  if (!visibleYears.value.length) {
    return false;
  }
  
  // If expenseData has a status (error, no_data, etc.), return false
  if (expenseData.value.status) {
    return false;
  }
  
  // Check if there's any data for the selected years
  for (const year of visibleYears.value) {
    if (expenseData.value[year] && Object.keys(expenseData.value[year]).length > 0) {
      // Check if any month has data
      for (const month in expenseData.value[year]) {
        if (expenseData.value[year][month] && expenseData.value[year][month].length > 0) {
          return true;
        }
      }
    }
  }
  
  return false;
});

// Computed property to get column labels for a specific year
const getColumnLabelsForYearLocal = (year) => {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Function to get expense details using the new approach
const getExpenseDetailsLocal = (expense) => {
  if (allExpensesData.value.length > 0) {
    return getExpenseDetailsFromAllExpenses(allExpensesData.value, expense);
  }
  return getExpenseDetails(expenseData.value, expense, visibleYears.value);
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
      // console.log('Project changed, reloading expense data for:', newProject.project_name);
      
      // Reload all expenses and categories for the new project
      const allExpensesResult = await loadAllExpensesAndCategories();
      if (allExpensesResult.status === 'success') {
        allExpensesData.value = allExpensesResult.expenses;
      }
      
      // Reload expense data for the new project (for cell values)
      expenseData.value = await loadExpenseData();
      
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
      
      // console.log("Expense data loaded for project:", newProject.project_name);
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
    const response = await fetch("/api/v2/method/ex_forcast.api.account_list.get_group_accounts");
    const result = await response.json();
    if (result.data && result.data.group_accounts) {
      groupAccounts.value = result.data.group_accounts;
    }
    
    isSaved.value = true;
    
    // Check if we should show refresh success alert
    if (localStorage.getItem('showRefreshSuccess') === 'true') {
      localStorage.removeItem('showRefreshSuccess');
      alertService.success("Page refreshed successfully");
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
});


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
    groupedExpenses.value.forEach(categoryGroup => {
      categoryGroup.expenses.forEach(expense => {
        const row = [
          getExpenseDetailsLocal(expense).code,
          expense,
          getExpenseDetailsLocal(expense).costType
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_name: newCategoryName.value.trim() })
    });
    const result = await response.json();
    // console.log('create_expense_category API result:', result);
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
      headers: { "Content-Type": "application/json" },
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
</script>



<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
