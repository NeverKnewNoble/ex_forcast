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

              <button 
                @click="openAddPayrollModal"
                :disabled="!selectedProject"          
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Payroll Row
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
              </div>
  
              <!-- No Payroll Data State -->
              <template v-if="!hasPayrollDataComputed">
                <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                  <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                    <HandCoins class="w-8 h-8 text-violet-500" />
                  </div>
                  <h3 class="text-lg text-violet-700 font-semibold mb-2">No Payroll Data</h3>
                  <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                    There is no payroll data for the selected year range. Add some payroll data to get started.
                  </p>
                  <div class="mt-6 flex gap-3">
                    <button 
                      @click="openAddPayrollModal"
                      :disabled="!selectedProject"
                      :class="[
                        'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                        selectedProject 
                          ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      ]"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Payroll Data
                    </button>
                  </div>
                </div>
              </template>
  
              <!-- Modern Table Container -->
              <template v-else>
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
                          <template v-for="category in getUniqueCategoriesLocal()" :key="category">
                            <tr class="bg-violet-100 border-b-2 border-violet-300">
                              <td 
                                :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0)" 
                                class="px-3 py-2 font-bold text-violet-800 text-left"
                              >
                                {{ category }}
                              </td>
                            </tr>
                            <!-- Group by Department Location within each category -->
                            <template v-for="location in getUniqueLocationsForCategoryLocal(category)" :key="'location-' + location">
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
                              <template v-for="row in getPayrollRowsForLocationLocal(category, location)" :key="row.id">
                                <tr class="border-b border-gray-200 hover:bg-violet-50 transition-all duration-200">
                                  <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                    {{ row.position }}
                                  </td>
                                  <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                    {{ row.designation }}
                                  </td>
                                  <td class="px-3 py-2 text-right border-r border-violet-200">
                                    <span class="font-mono text-sm">{{ formatMoney(row.salary) }}</span>
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
                                      @blur="handlePayrollCellEditLocal(row.id, 'count', visibleYears[0], month, $event)"
                                      @keypress="allowOnlyNumbers($event)"
                                    >
                                      <span class="font-mono text-xs">{{ getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) }}</span>
                                    </td>
                                    <!-- Monthly Salary cells -->
                                    <td 
                                      v-for="month in months" 
                                      :key="'salary-cell-' + month"
                                      contenteditable="true"
                                      class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                      @input="handlePayrollCellInput(row.id, 'salary', visibleYears[0], month, $event)"
                                      @focus="handlePayrollCellFocus(row.id, 'salary', visibleYears[0], month, $event)"
                                      @blur="handlePayrollCellEditLocal(row.id, 'salary', visibleYears[0], month, $event)"
                                      @keypress="allowOnlyNumbers($event)"
                                    >
                                      <span class="font-mono text-xs">{{ formatMoney(getPayrollCellValueLocal(row.id, 'salary', visibleYears[0], month)) }}</span>
                                    </td>
                                  </template>
                                  <!-- Total cell (always visible) -->
                                  <template v-if="visibleYears.length > 0">
                                    <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50">
                                      <span class="font-mono text-xs text-violet-700">
                                        {{ formatMoney(calculatePayrollTotalLocal(row.id, visibleYears[0])) }}
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
                                      @blur="handlePayrollCellEditLocal(row.id, 'annual', year, '', $event)"
                                    >
                                      <span class="font-mono text-xs">{{ formatMoney(getPayrollCellValueLocal(row.id, 'annual', year, '')) }}</span>
                                    </td>
                                  </template>
                                </tr>
                              </template>
                              
                              <!-- Sub-Total Management Row -->
                              <tr class="border-b border-gray-300 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                                <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-violet-300 text-violet-900">
                                  <div class="flex items-center gap-2">
                                    <CheckCircle class="w-4 h-4 text-violet-700" />
                                    Sub-Total Management
                                  </div>
                                </td>
                                <td class="px-3 py-2.5 text-right border-r border-violet-300">
                                  <span class="font-mono text-sm font-semibold text-violet-900">{{ formatMoney(calculateSubTotalManagementLocal(category, location)) }}</span>
                                </td>
                                
                                <!-- Monthly Count cells for subtotal -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-mgmt-count-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ calculateSubTotalManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                  </td>
                                  <!-- Monthly Salary cells for subtotal -->
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-mgmt-salary-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalManagementMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for subtotal -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-1.5 text-right border border-violet-300 font-semibold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateSubTotalManagementTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for subtotal -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'subtotal-mgmt-annual-' + year"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalManagementAnnualLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
                              </tr>
                              
                              <!-- Sub-Total Non-Management Row -->
                              <tr class="border-b border-gray-300 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                                <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-violet-300 text-violet-900">
                                  <div class="flex items-center gap-2">
                                    <CheckCircle class="w-4 h-4 text-violet-700" />
                                    Sub-Total Non-Management
                                  </div>
                                </td>
                                <td class="px-3 py-2.5 text-right border-r border-violet-300">
                                  <span class="font-mono text-sm font-semibold text-violet-900">{{ formatMoney(calculateSubTotalNonManagementLocal(category, location)) }}</span>
                                </td>
                                
                                <!-- Monthly Count cells for subtotal -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-nonmgmt-count-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ calculateSubTotalNonManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                  </td>
                                  <!-- Monthly Salary cells for subtotal -->
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-nonmgmt-salary-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalNonManagementMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for subtotal -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-1.5 text-right border border-violet-300 font-semibold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateSubTotalNonManagementTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for subtotal -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'subtotal-nonmgmt-annual-' + year"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalNonManagementAnnualLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
                              </tr>
                              
                              <!-- Total Row -->
                              <tr class="border-b-2 border-violet-400 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                                <td :colspan="3" class="px-3 py-3 font-bold border-r border-violet-300 text-violet-900">
                                  <div class="flex items-center gap-2">
                                    <BarChart3 class="w-5 h-5 text-violet-700" />
                                    Total
                                  </div>
                                </td>
                                <td class="px-3 py-3 text-right border-r border-violet-300">
                                  <span class="font-mono text-sm font-bold text-violet-900">{{ formatMoney(calculateLocationTotalLocal(category, location)) }}</span>
                                </td>
                                
                                <!-- Monthly Count cells for total -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'total-count-' + month"
                                    class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ calculateLocationTotalMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                  </td>
                                  <!-- Monthly Salary cells for total -->
                                  <td 
                                    v-for="month in months" 
                                    :key="'total-salary-' + month"
                                    class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateLocationTotalMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for total -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-2 text-right border border-violet-300 font-bold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateLocationTotalTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for total -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'total-annual-' + year"
                                    class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateLocationTotalAnnualLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
                              </tr>
                            </template>
                          </template>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </template>
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <div class="flex items-center gap-3">
              <HandCoins class="w-7 h-7 text-white" />
              <div>
                <h2 class="text-2xl font-bold text-white">Add New Payroll Data</h2>
                <p class="text-violet-100 mt-1 text-sm">Enter payroll details for the selected period</p>
              </div>
            </div>
            <button 
              @click="closeAddPayrollModal"
              class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
            >
              <X class="w-6 h-6" />
            </button>
          </div>


          <!-- Modal Body -->
          <div class="p-8 pb-0 space-y-6 overflow-y-auto max-h-[calc(95vh-140px)]">
            <!-- Year and Month Select -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar class="w-4 h-4 text-violet-600" />
                  Year *
                </label>
                <select 
                  v-model="addPayrollForm.year"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                >
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </div>

              <div>
                <label class=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar class="w-4 h-4 text-violet-600" />
                  Month/Quarter *
                </label>
                <select 
                  v-model="addPayrollForm.month"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                >
                  <option value="">Select Month/Quarter</option>
                  <option v-for="month in importedMonths" :key="month" :value="month">{{ month }}</option>
                </select>
              </div>
            </div>

            <!-- Payroll Data Cards -->
            <div class="space-y-4">
              <div 
                v-for="(row, index) in addPayrollForm.rows" 
                :key="'payroll-row-' + index"
                class="bg-white hover:border-violet-200 rounded-lg p-6 hover:shadow-md border-2 transition-all"
              >
                <!-- Row Header -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-800">Payroll Entry {{ index + 1 }}</h4>
                  <button
                    @click="removePayrollRow(index)"
                    :disabled="addPayrollForm.rows.length === 1"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove entry"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <!-- Form Fields Grid -->
                <div class="grid grid-cols-2 rounded-lg p-4 gap-6">
                  <!-- Department -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      v-model="row.department"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Department</option>
                      <option v-for="option in departmentOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Department Location -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Department Location *
                    </label>
                    <select
                      v-model="row.departmentLocation"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Location</option>
                      <option v-for="option in departmentLocationOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Position -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <select
                      v-model="row.position"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Position</option>
                      <option value="Manager">Manager</option>
                      <option value="Non-manager">Non-manager</option>
                    </select>
                  </div>

                  <!-- Designation -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Designation *
                    </label>
                    <select
                      v-model="row.designation"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Designation</option>
                      <option v-for="option in designationOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Salary -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <div class="relative">
                      <input 
                        v-model="row.salary"
                        type="text"
                        placeholder="0.00"
                        @keypress="allowOnlyNumbers($event)"
                        @input="handleSalaryInput($event, row)"
                        @focus="handleSalaryFocus($event, row)"
                        @blur="formatSalaryValue(row)"
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <!-- Count -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Count *
                    </label>
                    <input 
                      v-model.number="row.count"
                      type="number"
                      min="0"
                      placeholder="0"
                      @keypress="allowOnlyNumbers($event)"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="payrollModalError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="text-red-800 text-sm">{{ payrollModalError }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center px-10 pt-3 pb-3 border-t border-gray-200 bg-white sticky bottom-0">
            <button 
              @click="addPayrollRow" 
              class="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
            >
              <Plus class="w-5 h-5" />
              Add Row
            </button>
            <div class="flex gap-3">
              <button
                @click="closeAddPayrollModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <X class="w-5 h-5" />
                Cancel
              </button>
              <button 
                @click="submitPayrollDataWrapper" 
                :disabled="isSubmittingPayroll"
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmittingPayroll" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <Check v-else class="w-5 h-5" />
                {{ isSubmittingPayroll ? 'Submitting...' : 'Submit' }}
              </button>
            </div>
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
    ChevronRight, 
    ChevronLeft, 
    Calendar, 
    ArrowLeft, 
    Settings, 
    X, 
    Check, 
    CheckCircle, 
    BarChart3, 
    Plus, 
    Trash2,
    FolderOpen,
    ChevronDown
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
  // Import months with fallback
  import { months as importedMonths } from "@/components/utility/expense_assumption/index.js";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Import payroll service and utilities
  import {
    showAddPayrollModal,
    isSubmittingPayroll,
    payrollModalError,
    addPayrollForm,
    departmentOptions,
    departmentLocationOptions,
    designationOptions,
    payrollData,
    payrollRows,
    openAddPayrollModal,
    closeAddPayrollModal,
    resetPayrollForm,
    addPayrollRow,
    removePayrollRow,
    submitPayrollData,
    fetchPayrollData,
    savePayrollChanges,
    // Calculation functions
    calculatePayrollTotal,
    calculateSubTotalManagement,
    calculateSubTotalManagementCount,
    calculateSubTotalManagementMonthlyCount,
    calculateSubTotalManagementMonthlySalary,
    calculateSubTotalManagementTotal,
    calculateSubTotalManagementAnnual,
    calculateSubTotalNonManagement,
    calculateSubTotalNonManagementCount,
    calculateSubTotalNonManagementMonthlyCount,
    calculateSubTotalNonManagementMonthlySalary,
    calculateSubTotalNonManagementTotal,
    calculateSubTotalNonManagementAnnual,
    calculateLocationTotal,
    calculateLocationTotalCount,
    calculateLocationTotalMonthlyCount,
    calculateLocationTotalMonthlySalary,
    calculateLocationTotalTotal,
    calculateLocationTotalAnnual,
    // Utility functions
    getUniqueCategories,
    getPayrollRowsForCategory,
    getUniqueLocationsForCategory,
    getUniquePositionsForLocation,
    getPayrollRowsForPosition,
    getPayrollRowsForLocation,
    formatCurrency,
    getPayrollCellValue,
    handlePayrollCellEdit,
    addSamplePayrollData,
    resetToDefault,
    hasPayrollData,
    // Constants
    PAYROLL_CATEGORIES,
    POSITION_TYPES,
    DEFAULT_PAYROLL_ROW,
    SAMPLE_PAYROLL_DATA,
    FIELD_TYPES,
    POSITION_FILTERS,
    // Utility functions
    allowOnlyNumbers
  } from '@/components/utility/payroll/index.js';






  //! Helper function to safely format numbers to 2 decimal places with commas
  function formatMoney(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  // Reactive state
  const years = ref([]);
  const displayMode = ref("monthly");
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalPayrollData = ref({});
  const changedCells = ref([]); // {rowId, fieldType, year, month, newValue}
  const isSaving = ref(false);
  const saveError = ref("");
  const sidebarCollapsed = ref(false);
  const isComponentReady = ref(false); // Add a flag to track if component is ready
 



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

  // Computed property to check if there's any payroll data
  const hasPayrollDataComputed = computed(() => {
    return hasPayrollData(payrollRows.value);
  });


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

  // Wrapper function for submitting payroll data
  const submitPayrollDataWrapper = async () => {
    await submitPayrollData(selectedProject.value, payrollRows.value, async () => {
      // Reload data after submission
      await fetchPayrollData(selectedProject.value?.project_name);
    });
  };

  // On mount, initialize years
  onMounted(async () => {
    try {
      await initializeProjectService();
      await new Promise(resolve => setTimeout(resolve, 100));
      years.value = await loadYearOptions();

      // Load initial payroll data if project is selected
      if (selectedProject.value) {
        await fetchPayrollData(selectedProject.value.project_name);
      }

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
        await fetchPayrollData(newProject.project_name);
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

  function handlePayrollCellEditLocal(rowId, fieldType, year, month, event) {
    handlePayrollCellEdit(changedCells.value, rowId, fieldType, year, month, event);
    isSaved.value = false;
  }

  function handlePayrollCellInput(rowId, fieldType, year, month, event) {
    // Allow only numbers and decimal point for salary and annual fields
    if (fieldType === 'salary' || fieldType === 'annual') {
      const value = event.target.textContent.replace(/[^0-9.]/g, '');
      event.target.textContent = value;
    }
  }

  function handlePayrollCellFocus(rowId, fieldType, year, month, event) {
    // Format the number when user starts editing salary or annual fields
    if (fieldType === 'salary' || fieldType === 'annual') {
      const value = parseFloat(event.target.textContent);
      if (!isNaN(value)) {
        // Show the raw number without commas for easier editing
        event.target.textContent = value.toString();
      }
    }
  }

  function handleSalaryInput(event, row) {
    // Allow only numbers and decimal point
    let value = event.target.value.replace(/[^0-9.]/g, '');
    
    // Parse the number and format with commas while typing
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Format with commas while typing
      row.salary = numValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      row.salary = value;
    }
  }

  function handleSalaryFocus(event, row) {
    // Show the raw number without commas when user starts editing
    const value = parseFloat(row.salary);
    if (!isNaN(value)) {
      row.salary = value.toString();
    }
  }

  function formatSalaryValue(row) {
    // Format the salary to 2 decimal places with commas when user leaves the field
    const value = parseFloat(row.salary);
    if (!isNaN(value)) {
      row.salary = value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      row.salary = '0.00';
    }
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
      await fetchPayrollData(selectedProject.value?.project_name);
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

  function getPayrollCellValueLocal(rowId, fieldType, year, month) {
    return getPayrollCellValue(payrollRows.value, payrollData, rowId, fieldType, year, month);
  }

  function calculatePayrollTotalLocal(rowId, year) {
    // Use the local months array
    return calculatePayrollTotal(rowId, year, months, getPayrollCellValueLocal);
  }

  function getUniqueCategoriesLocal() {
    return getUniqueCategories(payrollRows.value);
  }

  function getPayrollRowsForCategoryLocal(category) {
    return getPayrollRowsForCategory(payrollRows.value, category);
  }

  function getUniqueLocationsForCategoryLocal(category) {
    return getUniqueLocationsForCategory(payrollRows.value, category);
  }

  function getUniquePositionsForLocationLocal(category, location) {
    return getUniquePositionsForLocation(payrollRows.value, category, location);
  }

  function getPayrollRowsForPositionLocal(category, location, position) {
    return getPayrollRowsForPosition(payrollRows.value, category, location, position);
  }

  function getPayrollRowsForLocationLocal(category, location) {
    return getPayrollRowsForLocation(payrollRows.value, category, location);
  }

  function formatCurrencyLocal(value) {
    return formatCurrency(value);
  }

  function resetToDefaultLocal() {
    resetToDefault(payrollRows.value);
    alertService.success('Payroll data has been reset to default.');
  }

  function addSamplePayrollDataLocal() {
    addSamplePayrollData(payrollRows.value);
    alertService.success('Sample payroll data loaded successfully.');
  }

  // Local wrapper functions for calculations
  function calculateSubTotalManagementLocal(category, location) {
    return calculateSubTotalManagement(payrollRows.value, category, location);
  }

  function calculateSubTotalManagementCountLocal(category, location) {
    return calculateSubTotalManagementCount(payrollRows.value, category, location);
  }

  function calculateSubTotalManagementMonthlyCountLocal(category, location, year, month) {
    return calculateSubTotalManagementMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalManagementMonthlySalaryLocal(category, location, year, month) {
    return calculateSubTotalManagementMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalManagementTotalLocal(category, location, year) {
    return calculateSubTotalManagementTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
  }

  function calculateSubTotalManagementAnnualLocal(category, location, year) {
    return calculateSubTotalManagementAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
  }

  function calculateSubTotalNonManagementLocal(category, location) {
    return calculateSubTotalNonManagement(payrollRows.value, category, location);
  }

  function calculateSubTotalNonManagementCountLocal(category, location) {
    return calculateSubTotalNonManagementCount(payrollRows.value, category, location);
  }

  function calculateSubTotalNonManagementMonthlyCountLocal(category, location, year, month) {
    return calculateSubTotalNonManagementMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalNonManagementMonthlySalaryLocal(category, location, year, month) {
    return calculateSubTotalNonManagementMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalNonManagementTotalLocal(category, location, year) {
    return calculateSubTotalNonManagementTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
  }

  function calculateSubTotalNonManagementAnnualLocal(category, location, year) {
    return calculateSubTotalNonManagementAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
  }

  function calculateLocationTotalLocal(category, location) {
    return calculateLocationTotal(payrollRows.value, category, location);
  }

  function calculateLocationTotalCountLocal(category, location) {
    return calculateLocationTotalCount(payrollRows.value, category, location);
  }

  function calculateLocationTotalMonthlyCountLocal(category, location, year, month) {
    return calculateLocationTotalMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateLocationTotalMonthlySalaryLocal(category, location, year, month) {
    return calculateLocationTotalMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateLocationTotalTotalLocal(category, location, year) {
    return calculateLocationTotalTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
  }

  function calculateLocationTotalAnnualLocal(category, location, year) {
    return calculateLocationTotalAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
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
  