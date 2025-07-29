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
                  <HandCoins class="w-7 h-7 mx-2 text-white" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Payroll</h1>
              </div>
              <p class="text-sm text-gray-500">Manage and configure your payroll data</p>
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
            <template v-if="!selectedProject">
              <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <CircleAlert class="w-8 h-8 text-violet-500" />
                </div>
                <h3 class="text-lg text-violet-700 font-semibold mb-2">No Project Selected</h3>
                <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                  Please select a project from the dashboard to view and manage payroll data.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                  <ArrowLeft class="w-3 h-3" />
                  <span>Use the project selector in the dashboard to get started</span>
                </div>
              </div>
            </template>
            
            <!-- Table Header with Stats -->
            <template v-else-if="visibleYears.length && isComponentReady">
              <div class="mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Payroll Data Overview</h2>
                </div>
                <div class="flex gap-2 mt-2">
                  <button 
                    @click="openAddPayrollModal"
                    :disabled="!selectedProject"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium shadow rounded-md transition-all',
                      selectedProject 
                        ? 'bg-violet-600 text-white hover:bg-violet-700' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    ]"
                  >
                    Add Payroll Row
                  </button>
                  <button @click="resetToDefault" class="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium shadow transition-all">
                    Reset to Default
                  </button>
                  <button @click="addSamplePayrollData" class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium shadow transition-all">
                    Load Sample Data
                  </button>
                </div>
              </div>
  
              <!-- Modern Table Container -->
              <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Table Header -->
                      <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                        <tr>
                          <th rowspan="3" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              Position
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              Designation
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-center align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              Salary
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-center align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              Count
                            </div>
                          </th>
                          <!-- First Year Column -->
                          <th 
                            v-if="visibleYears.length > 0" 
                            :colspan="isYearCollapsed(visibleYears[0]) ? 1 : 25" 
                            class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm cursor-pointer select-none hover:bg-violet-700 transition-all duration-200 group"
                            @click="toggleCollapse(visibleYears[0])"
                            title="Click to collapse/expand"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">{{ visibleYears[0] }}</span>
                              <ChevronDown 
                                v-if="!isYearCollapsed(visibleYears[0])" 
                                class="w-3 h-3 transition-transform group-hover:scale-110" 
                              />
                              <ChevronRight 
                                v-else 
                                class="w-3 h-3 transition-transform group-hover:scale-110" 
                              />
                            </div>
                          </th>
                          <!-- Annual Percentage Increment Column -->
                          <th 
                            v-if="visibleYears.length > 1" 
                            :colspan="visibleYears.length - 1" 
                            class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm"
                          >
                            Annual Percentage Increment
                          </th>
                        </tr>
                        <tr class="bg-violet-500/90 text-xs">
                          <!-- Monthly Count Sub-column -->
                          <th 
                            v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])" 
                            :colspan="12" 
                            class="px-2 py-1 text-center border border-violet-300 font-medium"
                          >
                            Monthly Count
                          </th>
                          <!-- Monthly Salary Sub-column -->
                          <th 
                            v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])" 
                            :colspan="12" 
                            class="px-2 py-1 text-center border border-violet-300 font-medium"
                          >
                            Monthly Salary
                          </th>
                          <!-- Total Sub-column -->
                          <th
                            :rowspan="2"
                            v-if="visibleYears.length > 0" 
                            class="px-2 py-1 text-center border border-violet-300 font-semibold min-w-[100px]"
                          >
                            Total
                          </th>
                          <!-- Annual Percentage Increment Sub-columns -->
                          <th
                            :rowspan="2"
                            v-for="year in visibleYears.slice(1)" 
                            :key="'annual-' + year"
                            class="px-2 py-1 text-center border border-violet-300 font-medium"
                          >
                            {{ year }}
                          </th>
                        </tr>
                        <tr class="bg-violet-400/90 text-xs">
                          <!-- Month columns for Monthly Count -->
                          <th 
                            v-if="!isYearCollapsed(visibleYears[0])"
                            v-for="month in months" 
                            :key="'count-' + month"
                            class="px-2 py-1 text-center border border-violet-300 min-w-[80px] font-medium"
                          >
                            {{ month }}
                          </th>
                          <!-- Month columns for Monthly Salary -->
                          <th 
                            v-if="!isYearCollapsed(visibleYears[0])"
                            v-for="month in months" 
                            :key="'salary-' + month"
                            class="px-2 py-1 text-center border border-violet-300 min-w-[80px] font-medium"
                          >
                            {{ month }}
                          </th>

                        </tr>
                      </thead>
                      <tbody class="text-gray-700 bg-white text-sm">
                        <!-- Group by actual categories from data -->
                        <template v-for="category in getUniqueCategories()" :key="category">
                          <tr class="bg-violet-100 border-b-2 border-violet-300">
                            <td 
                              :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0)" 
                              class="px-3 py-2 font-bold text-violet-800 text-left"
                            >
                              {{ category }}
                            </td>
                          </tr>
                          <!-- Group by Department Location within each category -->
                          <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                            <!-- Department Location Subdivider -->
                            <tr class="bg-violet-50 border-b border-violet-200">
                              <td 
                                :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0)" 
                                class="px-3 py-1.5 font-semibold text-violet-700 text-left text-sm"
                              >
                                {{ location }}
                              </td>
                            </tr>
                            <!-- Payroll rows for this location -->
                            <template v-for="row in getPayrollRowsForLocation(category, location)" :key="row.id">
                              <tr class="border-b border-gray-200 hover:bg-violet-50 transition-all duration-200">
                                <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                  {{ row.position }}
                                </td>
                                <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                  {{ row.designation }}
                                </td>
                                <td class="px-3 py-2 text-right border-r border-violet-200">
                                  <span class="font-mono text-sm">{{ formatCurrency(row.salary) }}</span>
                                </td>
                                <td class="px-3 py-2 text-right border-r border-violet-200">
                                  <span class="font-mono text-sm">{{ row.count }}</span>
                                </td>
                                <!-- Monthly Count cells -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'count-cell-' + month"
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                    @input="handlePayrollCellInput(row.id, 'count', visibleYears[0], month, $event)"
                                    @focus="handlePayrollCellFocus(row.id, 'count', visibleYears[0], month, $event)"
                                    @blur="handlePayrollCellEdit(row.id, 'count', visibleYears[0], month, $event)"
                                  >
                                    <span class="font-mono text-xs">{{ getPayrollCellValue(row.id, 'count', visibleYears[0], month) }}</span>
                                  </td>
                                  <!-- Monthly Salary cells -->
                                  <td 
                                    v-for="month in months" 
                                    :key="'salary-cell-' + month"
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                    @input="handlePayrollCellInput(row.id, 'salary', visibleYears[0], month, $event)"
                                    @focus="handlePayrollCellFocus(row.id, 'salary', visibleYears[0], month, $event)"
                                    @blur="handlePayrollCellEdit(row.id, 'salary', visibleYears[0], month, $event)"
                                  >
                                    <span class="font-mono text-xs">{{ getPayrollCellValue(row.id, 'salary', visibleYears[0], month) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell (always visible) -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ formatCurrency(calculatePayrollTotal(row.id, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'annual-cell-' + year"
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                    @input="handlePayrollCellInput(row.id, 'annual', year, '', $event)"
                                    @focus="handlePayrollCellFocus(row.id, 'annual', year, '', $event)"
                                    @blur="handlePayrollCellEdit(row.id, 'annual', year, '', $event)"
                                  >
                                    <span class="font-mono text-xs">{{ getPayrollCellValue(row.id, 'annual', year, '') }}</span>
                                  </td>
                                </template>
                              </tr>
                            </template>
                          </template>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>
  
            <!-- Enhanced No Years Selected State -->
            <template v-else-if="selectedProject">
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
            
            <!-- Fallback for when project is selected but no years -->
            <template v-else>
              <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <CircleAlert class="w-8 h-8 text-violet-500" />
                </div>
                <h3 class="text-lg text-violet-700 font-semibold mb-2">No Project Selected</h3>
                <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                  Please select a project from the dashboard to view and manage payroll data.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                  <ArrowLeft class="w-3 h-3" />
                  <span>Use the project selector in the dashboard to get started</span>
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

    <!-- Add Payroll Data Modal -->
    <transition name="fade">
      <div
        v-if="showAddPayrollModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-2xl p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <HandCoins class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Add Payroll Data</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <form @submit.prevent="submitPayrollData" class="space-y-6">
              <!-- Department Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  Department *
                </label>
                <select 
                  v-model="newPayrollData.department"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                >
                  <option value="">Select Department</option>
                  <option v-for="category in payrollCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Department Location -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Department Location *
                </label>
                <input 
                  v-model="newPayrollData.departmentLocation"
                  type="text"
                  required
                  placeholder="Enter department location"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                />
              </div>

              <!-- Position -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Position *
                </label>
                <select 
                  v-model="newPayrollData.position"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                >
                  <option value="">Select Position</option>
                  <option value="Manager">Manager</option>
                  <option value="Non-manager">Non-manager</option>
                </select>
              </div>

              <!-- Designation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.861-8.96-2.545M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                  </svg>
                  Designation *
                </label>
                <input 
                  v-model="newPayrollData.designation"
                  type="text"
                  required
                  placeholder="Enter designation"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                />
              </div>

              <!-- Salary and Count Row -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Salary -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    Salary *
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input 
                      v-model.number="newPayrollData.salary"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      class="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                    />
                  </div>
                </div>

                <!-- Count -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Count *
                  </label>
                  <input 
                    v-model.number="newPayrollData.count"
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                  />
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="payrollModalError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="text-red-800 text-sm">{{ payrollModalError }}</span>
              </div>
            </form>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="closeAddPayrollModal"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              @click="submitPayrollData"
              :disabled="isSubmittingPayroll"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmittingPayroll" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <Check v-else class="w-4 h-4" />
              {{ isSubmittingPayroll ? 'Adding...' : 'Add Payroll Data' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  

  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted, reactive } from "vue";
  import { storeToRefs } from 'pinia';
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
  import Sidebar from "@/components/ui/Sidebar.vue";
  import { 
    CircleAlert, 
    AlertTriangle, 
    HandCoins, 
    Table, 
    RefreshCw, 
    FolderOpen, 
    ChevronDown, 
    ChevronRight, 
    ChevronLeft, 
    Calendar, 
    ArrowLeft, 
    Settings, 
    X, 
    Check, 
  } from 'lucide-vue-next';
  import alertService from "@/components/ui/ui_utility/alertService.js";
  import { 
    getVisibleYears,
    getColumnLabels
  } from "@/components/utility/banquet_revenue_assumpt/index.js";
  import {
    toggleCollapse,
    loadYearOptions,
    isYearCollapsed
  } from "@/components/utility/expense_assumption/index.js";
  import { cloneDeep } from 'lodash-es';
  // Import project service
  import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  
  
  // Reactive state
  const years = ref([]);
  const displayMode = ref("monthly");
  const payrollData = reactive({});
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalPayrollData = ref({});
  const changedCells = ref([]); // {rowId, fieldType, year, month, newValue}
  const isSaving = ref(false);
  const saveError = ref("");
  const sidebarCollapsed = ref(false);
  const isComponentReady = ref(false); // Add a flag to track if component is ready
  const showAddPayrollRow = ref(false);
  const newPayrollRow = ref({});
  const payrollRows = ref([]); // Will hold payroll rows
  const removedDefaultRows = ref([]); // Track removed default rows
  const showAddPayrollModal = ref(false); // New state for add payroll modal
  const newPayrollData = reactive({ // New reactive object for add payroll data
    department: '',
    departmentLocation: '',
    position: '',
    designation: '',
    salary: 0.00,
    count: 0,
  });
  const isSubmittingPayroll = ref(false); // New state for submitting payroll data
  const payrollModalError = ref(''); // New state for error message in add payroll modal

  // Payroll specific data
  const months = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  const payrollCategories = ref([
    'ROOMS',
    'FOOD & BEVERAGE',
    'OTHER OPERATING DEPARTMENTS',
    'ADMINISTRATION & GENERAL',
    'INFORMATION & TELECOMMUNICATION SYSTEMS',
    'SALES & MARKETING',
    'POM'
  ]);

  // ! Cache for calculations
  const calculationCache = useCalculationCache();  
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
  


  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    return getColumnLabels(advancedModes.value[year] || displayMode.value);
  };
  

  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        yearSettingsStore.setAdvancedMode(year, displayMode.value);
      }
    });
  });

  // Watch for changes in payrollData to ensure calculated fields update
  watch(payrollData, (newData, oldData) => {
    // console.log('payrollData changed:', newData);
  }, { deep: true, immediate: true });
  
  
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

  function openAddPayrollModal() {
    showAddPayrollModal.value = true;
    newPayrollData.department = '';
    newPayrollData.departmentLocation = '';
    newPayrollData.position = '';
    newPayrollData.designation = '';
    newPayrollData.salary = 0.00;
    newPayrollData.count = 0;
    payrollModalError.value = '';
  }

  function closeAddPayrollModal() {
    showAddPayrollModal.value = false;
  }

  async function submitPayrollData() {
    if (!selectedProject.value) {
      alertService.error("Please select a project first");
      return;
    }
    if (!newPayrollData.department || !newPayrollData.departmentLocation || !newPayrollData.position || !newPayrollData.designation || newPayrollData.salary === 0 || newPayrollData.count === 0) {
      payrollModalError.value = "All fields are required and salary and count must be greater than 0.";
      return;
    }

    isSubmittingPayroll.value = true;
    payrollModalError.value = '';

    try {
      const newRow = {
        id: Date.now(),
        department: newPayrollData.department,
        departmentLocation: newPayrollData.departmentLocation,
        position: newPayrollData.position,
        designation: newPayrollData.designation,
        salary: newPayrollData.salary,
        count: newPayrollData.count,
        category: newPayrollData.department // Assuming category is based on department
      };
      payrollRows.value.push(newRow);
      alertService.success("Payroll data added successfully!");
      showAddPayrollModal.value = false;
    } catch (error) {
      payrollModalError.value = "Failed to add payroll data. Please try again.";
      console.error("Error adding payroll data:", error);
    } finally {
      isSubmittingPayroll.value = false;
    }
  }
  
  
  // On mount, initialize years
  onMounted(async () => {
    try {
      await initializeProjectService();
      await new Promise(resolve => setTimeout(resolve, 100));
      years.value = await loadYearOptions();

      originalPayrollData.value = cloneDeep(payrollRows.value);
      isSaved.value = true;
      isComponentReady.value = true;
      
      // Check if we should show refresh success alert
      if (localStorage.getItem('showRefreshSuccess') === 'true') {
        localStorage.removeItem('showRefreshSuccess');
        alertService.success("Page refreshed successfully");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  
  // Watch for project changes and reload data
  watch(selectedProject, async (newProject, oldProject) => {
    // console.log('Project changed from:', oldProject?.project_name, 'to:', newProject?.project_name);
    
    if (newProject) {
      try {
        // console.log('Reloading Payroll data for new project:', newProject.project_name);
        
        // Reload Payroll data for the new project
        // await fetchPayrollData();
        originalPayrollData.value = cloneDeep(payrollRows.value);
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        saveError.value = "";
        
        // console.log('Payroll data reloaded successfully for project:', newProject.project_name);
        alertService.success(`Switched to project: ${newProject.project_name}`);
      } catch (error) {
        console.error('Error reloading Payroll data for new project:', error);
        alertService.error("Failed to load project data. Please try again.");
      }
    } else {
      // Clear data when no project is selected
      payrollRows.value = [];
      originalPayrollData.value = cloneDeep(payrollRows.value);
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
    }
  }, { deep: true });
  
  function clearYearSelection() {
    clearYearSettings();
    isSaved.value = false;
  }
  
  function handlePayrollCellEdit(rowId, fieldType, year, month, event) {
    const newValue = parseFloat(event.target.textContent) || 0;
    const existingChangeIndex = changedCells.value.findIndex(
      cell => cell.rowId === rowId && cell.fieldType === fieldType && cell.year === year && cell.month === month
    );
    
    if (existingChangeIndex >= 0) {
      changedCells.value[existingChangeIndex].newValue = newValue;
    } else {
      changedCells.value.push({
        rowId,
        fieldType,
        year,
        month,
        newValue
      });
    }
    
    isSaved.value = false;
  }

  function handlePayrollCellInput(rowId, fieldType, year, month, event) {
    // Handle input changes
  }

  function handlePayrollCellFocus(rowId, fieldType, year, month, event) {
    // Handle focus events
  }
  
  
  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    try {
      isSaving.value = true;
      saveError.value = "";
      
      if (changedCells.value.length === 0) {
        isSaving.value = false;
        return;
      }
      
      // Save payroll data changes
      const result = await savePayrollChanges(changedCells.value, selectedProject.value?.project_name);
      
      // Reload from backend after save
    //   await fetchPayrollData();
      originalPayrollData.value = cloneDeep(payrollRows.value);
      changedCells.value = [];
      isSaved.value = true;
      alertService.success("Changes saved successfully");
      isSaving.value = false;
      return result;
    } catch (err) {
      saveError.value = err.message || "Failed to save changes";
      alertService.error(saveError.value);
      isSaving.value = false;
    }
  };

  async function savePayrollChanges(changes, projectName) {
    // Implementation for saving payroll changes
    console.log('Saving payroll changes:', changes);
    return true;
  }
  
  
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
  
  
  // Clean up event listeners when component is unmounted
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  
  
  // Refresh table functionality - reload entire page
  function refreshTable() {
    // Set flag to show success alert after reload
    localStorage.setItem('showRefreshSuccess', 'true');
    // Reload the entire page
    window.location.reload();
  }

  function getPayrollCellValue(rowId, fieldType, year, month) {
    // Get the value for a specific payroll cell
    const row = payrollRows.value.find(r => r.id === rowId);
    if (!row) return 0;
    
    if (fieldType === 'count' || fieldType === 'salary') {
      // For monthly data, return the value from payrollData
      return payrollData[year]?.[month]?.[rowId]?.[fieldType] || 0;
    } else if (fieldType === 'annual') {
      // For annual percentage increment
      return payrollData[year]?.[rowId]?.[fieldType] || 0;
    }
    return 0;
  }

  function calculatePayrollTotal(rowId, year) {
    // Calculate total for a payroll row in a specific year
    const row = payrollRows.value.find(r => r.id === rowId);
    if (!row) return 0;
    
    let total = 0;
    months.value.forEach(month => {
      const count = getPayrollCellValue(rowId, 'count', year, month);
      const salary = getPayrollCellValue(rowId, 'salary', year, month);
      total += count * salary;
    });
    return total;
  }

  function getUniqueCategories() {
    const uniqueCategories = new Set();
    payrollRows.value.forEach(row => {
      uniqueCategories.add(row.category);
    });
    return Array.from(uniqueCategories);
  }

  function getPayrollRowsForCategory(category) {
    return payrollRows.value.filter(row => row.category === category);
  }

  function getUniqueLocationsForCategory(category) {
    const uniqueLocations = new Set();
    payrollRows.value
      .filter(row => row.category === category)
      .forEach(row => {
        uniqueLocations.add(row.departmentLocation);
      });
    return Array.from(uniqueLocations);
  }

  function getUniquePositionsForLocation(category, location) {
    const uniquePositions = new Set();
    payrollRows.value
      .filter(row => row.category === category && row.departmentLocation === location)
      .forEach(row => {
        uniquePositions.add(row.position);
      });
    return Array.from(uniquePositions);
  }

  function getPayrollRowsForPosition(category, location, position) {
    return payrollRows.value.filter(row => row.category === category && row.departmentLocation === location && row.position === position);
  }

  function getPayrollRowsForLocation(category, location) {
    return payrollRows.value.filter(row => row.category === category && row.departmentLocation === location);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  function resetToDefault() {
    payrollRows.value = [];
    alertService.success('Payroll data has been reset to default.');
  }

  function addSamplePayrollData() {
    payrollRows.value = [
      {
        id: 1,
        department: 'ROOMS',
        departmentLocation: 'Front Desk',
        position: 'Manager',
        designation: 'Front Office Manager',
        salary: 5000.00,
        count: 1,
        category: 'ROOMS'
      },
      {
        id: 2,
        department: 'ROOMS',
        departmentLocation: 'Front Desk',
        position: 'Non-manager',
        designation: 'Receptionist',
        salary: 2500.00,
        count: 3,
        category: 'ROOMS'
      },
      {
        id: 3,
        department: 'ROOMS',
        departmentLocation: 'Housekeeping',
        position: 'Manager',
        designation: 'Housekeeping Manager',
        salary: 4000.00,
        count: 1,
        category: 'ROOMS'
      },
      {
        id: 4,
        department: 'ROOMS',
        departmentLocation: 'Housekeeping',
        position: 'Non-manager',
        designation: 'Room Attendant',
        salary: 2200.00,
        count: 8,
        category: 'ROOMS'
      },
      {
        id: 5,
        department: 'FOOD & BEVERAGE',
        departmentLocation: 'Restaurant',
        position: 'Manager',
        designation: 'Restaurant Manager',
        salary: 4500.00,
        count: 1,
        category: 'FOOD & BEVERAGE'
      },
      {
        id: 6,
        department: 'FOOD & BEVERAGE',
        departmentLocation: 'Restaurant',
        position: 'Non-manager',
        designation: 'Waiter',
        salary: 2000.00,
        count: 6,
        category: 'FOOD & BEVERAGE'
      },
      {
        id: 7,
        department: 'FOOD & BEVERAGE',
        departmentLocation: 'Kitchen',
        position: 'Manager',
        designation: 'Executive Chef',
        salary: 5500.00,
        count: 1,
        category: 'FOOD & BEVERAGE'
      },
      {
        id: 8,
        department: 'FOOD & BEVERAGE',
        departmentLocation: 'Kitchen',
        position: 'Non-manager',
        designation: 'Sous Chef',
        salary: 3500.00,
        count: 2,
        category: 'FOOD & BEVERAGE'
      }
    ];
    alertService.success('Sample payroll data loaded successfully.');
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
  