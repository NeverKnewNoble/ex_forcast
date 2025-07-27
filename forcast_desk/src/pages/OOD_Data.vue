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
                  <Building2 class="w-7 h-7 mx-2 text-white" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Other Operating Departments Revenue Assumptions</h1>
              </div>
              <p class="text-sm text-gray-500">Manage and configure your other operating departments data</p>
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
              <div class="flex gap-2">
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
                  Please select a project from the dashboard to view and manage other operating departments data.
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                  <ArrowLeft class="w-3 h-3" />
                  <span>Use the project selector in the dashboard to get started</span>
                </div>
                </div>
            </template>
            
            
            <!-- Tables when years are selected -->
            <template v-else-if="visibleYears.length && isComponentReady">
              <!-- Laundry Assumptions Matrix Table -->
              <div class="mb-10">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Table class="w-4 h-4 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Laundry</h2>
              </div>
                <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-x-auto">
                  <table class="min-w-full w-max text-sm border border-blue-300">
                    <thead class="bg-blue-50">
                      <tr>
                        <th rowspan="2" class="px-3 py-2 text-left font-semibold text-white  bg-blue-700 w-[300px] border border-blue-300">
                              <div class="flex items-center gap-1">
                                <FolderOpen class="w-3 h-3" />
                                Assumption Details
                              </div>
                            </th>
                        <th v-for="year in visibleYears" :key="'header-' + year"
                          :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length"
                          class="px-2 py-2 text-center font-semibold text-white bg-blue-700 border border-blue-300 cursor-pointer select-none group"
                            @click="toggleCollapse(year)"
                            title="Click to collapse/expand"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">{{ year }}</span>
                            <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                            <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                            </div>
                          </th>
                        </tr>
                      <tr>
                          <template v-for="year in visibleYears" :key="'months-' + year">
                            <template v-if="!isYearCollapsed(year)">
                            <th v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label" class="px-2 py-1 text-center font-medium text-xs border border-white min-w-[100px] bg-blue-500 text-white">{{ label }}</th>
                              </template>
                              <template v-else>
                            <th class="px-2 py-1 text-center font-medium text-xs border border-blue-300 min-w-[110px]">Forecast</th>
                            </template>
                          </template>
                        </tr>
                      </thead>
                    <tbody>
                      <!-- Section: In House Guest Laundry Revenue -->
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold text-blue-900 px-4 py-2 border border-blue-300">In House Guest Laundry Revenue</td>
                      </tr>
                      <!-- Percentage Row (Guest Laundry) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Percentage</td>
                        <template v-for="year in visibleYears" :key="'perc-guest-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'perc-guest-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.in_house_guest_laundry_percentage[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.in_house_guest_laundry_percentage[year]) laundryAssumptions.in_house_guest_laundry_percentage[year] = {}; laundryAssumptions.in_house_guest_laundry_percentage[year][label] = val; }"
                                placeholder="0%"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_guest_laundry_percentage', event: e })" />
                              </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                            </tr>
                      <!-- Base Row (Guest Laundry) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Base</td>
                        <template v-for="year in visibleYears" :key="'base-guest-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'base-guest-' + year + '-' + label" class="border border-blue-300">
                              <select
                                :value="laundryAssumptions.in_house_guest_laundry_base[year]?.[label] || ''"
                                @change="e => { if (!laundryAssumptions.in_house_guest_laundry_base[year]) laundryAssumptions.in_house_guest_laundry_base[year] = {}; laundryAssumptions.in_house_guest_laundry_base[year][label] = e.target.value; }"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_guest_laundry_base', event: e })">
                                <option disabled value="">Select base</option>
                                <option value="per_month">per month</option>
                                <option value="per_week">per week</option>
                              </select>
                              </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <!-- Average Amount Row (Guest Laundry) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Average Amount</td>
                        <template v-for="year in visibleYears" :key="'amt-guest-' + year">
                                <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'amt-guest-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.in_house_guest_laundry_amount[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.in_house_guest_laundry_amount[year]) laundryAssumptions.in_house_guest_laundry_amount[year] = {}; laundryAssumptions.in_house_guest_laundry_amount[year][label] = val; }"
                                placeholder="0"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_guest_laundry_amount', event: e })" />
                                  </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <!-- Section: In House Dry Cleaning Revenue -->
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold text-blue-900 px-4 py-2 border border-blue-300">In House Dry Cleaning Revenue</td>
                      </tr>
                      <!-- Percentage Row (Dry Cleaning) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Percentage</td>
                        <template v-for="year in visibleYears" :key="'perc-dry-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'perc-dry-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.in_house_dry_cleaning_percentage[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.in_house_dry_cleaning_percentage[year]) laundryAssumptions.in_house_dry_cleaning_percentage[year] = {}; laundryAssumptions.in_house_dry_cleaning_percentage[year][label] = val; }"
                                placeholder="0%"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_dry_cleaning_percentage', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <!-- Base Row (Dry Cleaning) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Base</td>
                        <template v-for="year in visibleYears" :key="'base-dry-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'base-dry-' + year + '-' + label" class="border border-blue-300">
                              <select
                                :value="laundryAssumptions.in_house_dry_cleaning_base[year]?.[label] || ''"
                                @change="e => { if (!laundryAssumptions.in_house_dry_cleaning_base[year]) laundryAssumptions.in_house_dry_cleaning_base[year] = {}; laundryAssumptions.in_house_dry_cleaning_base[year][label] = e.target.value; }"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_dry_cleaning_base', event: e })">
                                <option disabled value="">Select base</option>
                                <option value="per_month">per month</option>
                                <option value="per_week">per week</option>
                              </select>
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <!-- Average Amount Row (Dry Cleaning) -->
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Average Amount</td>
                        <template v-for="year in visibleYears" :key="'amt-dry-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'amt-dry-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.in_house_dry_cleaning_amount[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.in_house_dry_cleaning_amount[year]) laundryAssumptions.in_house_dry_cleaning_amount[year] = {}; laundryAssumptions.in_house_dry_cleaning_amount[year][label] = val; }"
                                placeholder="0"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'in_house_dry_cleaning_amount', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <!-- Section: Outside Guest Laundry -->
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold text-blue-900 px-4 py-2 border border-blue-300">Outside Guest Laundry</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Number</td>
                        <template v-for="year in visibleYears" :key="'num-outside-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'num-outside-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.outside_guest_laundry_number[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.outside_guest_laundry_number[year]) laundryAssumptions.outside_guest_laundry_number[year] = {}; laundryAssumptions.outside_guest_laundry_number[year][label] = val; }"
                                placeholder="0"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'outside_guest_laundry_number', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Base</td>
                        <template v-for="year in visibleYears" :key="'base-outside-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'base-outside-' + year + '-' + label" class="border border-blue-300">
                              <select
                                :value="laundryAssumptions.outside_guest_laundry_base[year]?.[label] || ''"
                                @change="e => { if (!laundryAssumptions.outside_guest_laundry_base[year]) laundryAssumptions.outside_guest_laundry_base[year] = {}; laundryAssumptions.outside_guest_laundry_base[year][label] = e.target.value; }"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'outside_guest_laundry_base', event: e })">
                                <option disabled value="">Select base</option>
                                <option value="per_month">per month</option>
                                <option value="per_week">per week</option>
                              </select>
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Average Amount</td>
                        <template v-for="year in visibleYears" :key="'amt-outside-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'amt-outside-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.outside_guest_laundry_amount[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.outside_guest_laundry_amount[year]) laundryAssumptions.outside_guest_laundry_amount[year] = {}; laundryAssumptions.outside_guest_laundry_amount[year][label] = val; }"
                                placeholder="0"
                                class="borderless-input w-full"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'outside_guest_laundry_amount', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold text-blue-900 px-4 py-2 border border-blue-300">Guest Laundry Cost</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Percentage</td>
                        <template v-for="year in visibleYears" :key="'perc-cost-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'perc-cost-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.guest_laundry_cost_percentage[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.guest_laundry_cost_percentage[year]) laundryAssumptions.guest_laundry_cost_percentage[year] = {}; laundryAssumptions.guest_laundry_cost_percentage[year][label] = val; if (val > 0) { if (!laundryAssumptions.guest_laundry_cost_amount[year]) laundryAssumptions.guest_laundry_cost_amount[year] = {}; laundryAssumptions.guest_laundry_cost_amount[year][label] = ''; } }"
                                :disabled="Number(laundryAssumptions.guest_laundry_cost_amount[year]?.[label] || 0) > 0"
                                placeholder="0%"
                                :class="['borderless-input w-full', Number(laundryAssumptions.guest_laundry_cost_amount[year]?.[label] || 0) > 0 ? 'bg-gray-100 cursor-not-allowed' : '']"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'guest_laundry_cost_percentage', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Average Amount</td>
                        <template v-for="year in visibleYears" :key="'amt-cost-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'amt-cost-' + year + '-' + label" class="border border-blue-300">
                              <input type="number"
                                :value="laundryAssumptions.guest_laundry_cost_amount[year]?.[label] || ''"
                                @input="e => { const val = sanitizeNumberInput(e); if (!laundryAssumptions.guest_laundry_cost_amount[year]) laundryAssumptions.guest_laundry_cost_amount[year] = {}; laundryAssumptions.guest_laundry_cost_amount[year][label] = val; if (val > 0) { if (!laundryAssumptions.guest_laundry_cost_percentage[year]) laundryAssumptions.guest_laundry_cost_percentage[year] = {}; laundryAssumptions.guest_laundry_cost_percentage[year][label] = ''; } }"
                                :disabled="Number(laundryAssumptions.guest_laundry_cost_percentage[year]?.[label] || 0) > 0"
                                placeholder="0"
                                :class="['borderless-input w-full', Number(laundryAssumptions.guest_laundry_cost_percentage[year]?.[label] || 0) > 0 ? 'bg-gray-100 cursor-not-allowed' : '']"
                                @blur="e => handleCellEditWrapper({ year, label, field: 'guest_laundry_cost_amount', event: e })" />
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold bg-blue-700 text-white px-4 py-2 border border-blue-300">Revenue</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border flex justify-between items-end">
                          <span>In House</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Auto
                                    </span>
                        </td>
                        <template v-for="year in visibleYears" :key="'rev-inhouse-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'rev-inhouse-' + year + '-' + label"
                              class="px-2 py-1 text-right text-blue-700 font-mono bg-blue-50 min-w-[110px] border border-blue-300">
                              {{ formatOODValue('revenue_in_house', calculateInHouseRevenueReactive(year, label)) }}
                                  </td>
                                </template>
                                <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700  flex justify-between items-end">
                          <span>Outside</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Auto
                                    </span>
                        </td>
                        <template v-for="year in visibleYears" :key="'rev-outside-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'rev-outside-' + year + '-' + label"
                              class="px-2 py-1 text-right text-blue-700 font-mono bg-blue-50 min-w-[110px] border border-blue-300">
                              {{ formatOODValue('revenue_outside', calculateOutsideGuestLaundryRevenue(laundryAssumptions, year, label)) }}
                                  </td>
                                </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                                </template>
                            </template>
                          </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Other Revenue</td>
                        <template v-for="year in visibleYears" :key="'rev-other-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'rev-other-' + year + '-' + label"
                              class="px-2 py-1 text-right font-mono text-blue-700 bg-blue-50 min-w-[110px] border border-blue-300"
                                    contenteditable="true"
                              @input="e => handleContentEditableInput(e, laundryAssumptions.revenue_other, year, label)"
                              @paste="handleContentEditablePaste"
                              @blur="e => handleCellEditWrapper({ year, label, field: 'revenue_other', event: e })"
                            >
                              {{ formatOODValue('revenue_other', laundryAssumptions.revenue_other?.[year]?.[label] || '') }}
                                  </td>
                          </template>
                                <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                      <tr class="bg-blue-100">
                        <td colspan="100" class="font-semibold bg-blue-700 text-white px-4 py-2 border border-blue-300">COST OF LAUNDRY</td>
                      </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 flex justify-between items-end">
                          <span>Guest Laundry Cost</span>
                          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Auto
                          </span>
                        </td>
                        <template v-for="year in visibleYears" :key="'cost-guest-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'cost-guest-' + year + '-' + label"
                              class="px-2 py-1 text-right text-blue-700 font-mono bg-blue-50 min-w-[110px] border border-blue-300">
                              {{ formatOODValue('guest_laundry_cost', calculateGuestLaundryCostReactive(year, label)) }}
                                  </td>
                                </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                                </template>
                            </template>
                          </tr>
                      <tr>
                        <td class="px-4 py-2 font-medium text-gray-700 border border-blue-300">Other Laundry Costs</td>
                        <template v-for="year in visibleYears" :key="'cost-other-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'cost-other-' + year + '-' + label"
                              class="px-2 py-1 text-right font-mono text-blue-700 bg-blue-50 min-w-[110px] border border-blue-300"
                              contenteditable="true"
                              @input="e => handleContentEditableInput(e, laundryAssumptions.other_laundry_costs, year, label)"
                              @paste="handleContentEditablePaste"
                              @blur="e => handleCellEditWrapper({ year, label, field: 'other_laundry_costs', event: e })"
                            >
                              {{ formatOODValue('other_laundry_costs', laundryAssumptions.other_laundry_costs?.[year]?.[label] || '') }}
                            </td>
                          </template>
                          <template v-else>
                            <td class="bg-blue-50 text-center font-semibold text-blue-700 border border-blue-300">-</td>
                          </template>
                        </template>
                      </tr>
                        </tbody>
                      </table>
                </div>
              </div>


              <!-- Health Club Table -->
              <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Table class="w-4 h-4 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Health Club</h2>
                </div>
                
                <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
                  <div class="overflow-x-auto">
                    <div class="min-w-full w-max">
                      <table class="w-full border border-green-300">
                        <!-- Table Header -->
                        <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
                          <tr>
                            <th rowspan="2" class="px-3 py-2 text-left border-r font-semibold text-sm w-[300px] border border-green-300">
                              <div class="flex items-center gap-1">
                                <FolderOpen class="w-3 h-3" />
                              Details
                              </div>
                            </th>
                            <th
                              v-for="year in visibleYears"
                              :key="'header-' + year"
                              :colspan="isYearCollapsed(year) ? 2 : (getColumnLabelsForYearLocal(year).length * 2) + 2"
                              class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-green-700 transition-all duration-200 group text-sm"
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
                          <tr class="bg-green-500/90 text-xs">
                            <template v-for="year in visibleYears" :key="'months-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                  <th class="px-2 py-1 text-center border border-green-300 min-w-[100px] font-medium">
                                    {{ label }}
                                  </th>
                                  <th class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-medium">
                                    %
                                  </th>
                                </template>
                                <th class="px-2 py-1 text-center border border-green-300 min-w-[110px] font-semibold">
                                  <div class="flex items-center justify-center gap-1">
                                    Forecast
                                  </div>
                                </th>
                                <th class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-semibold">
                                  %
                                </th>
                              </template>
                              <template v-else>
                                <th class="px-2 py-1 text-center border border-green-300 min-w-[110px] font-semibold">
                                  <div class="flex items-center justify-center gap-1">
                                    Forecast
                                  </div>
                                </th>
                                <th class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-semibold">
                                  %
                                </th>
                              </template>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <template v-for="(field, idx) in healthClubFields" :key="field.code">
                            <!-- Section Divider Rows -->
                            <tr v-if="['Club Use Revenue', 'Treatments & Other Services', 'Memberships'].includes(field.label)">
                              <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 2 : (getColumnLabelsForYearLocal(visibleYears[0]).length * 2) + 2)"
                                  class="bg-green-100 text-green-900 font-bold text-left px-3 py-2 border-t-2 border-b-2  uppercase tracking-wider border border-green-300">
                                {{ field.label }}
                              </td>
                            </tr>
                            <!-- TOTAL CLUB USE REVENUE -->
                            <tr v-else-if="field.code === 'total_club_use_revenue'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200 flex justify-between items-end">
                                <span>Total Club Use Revenue</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Auto</span>
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code, calculateTotalClubUseRevenue(healthClubData, year, label)) }}
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code + '_pct', calculateTotalClubUseRevenuePct(healthClubData, year, label)) }}
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code, calculateTotalClubUseRevenue(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code + '_pct', calculateTotalClubUseRevenuePct(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- TOTAL TREATMENTS & OTHER SERVICES -->
                            <tr v-else-if="field.code === 'total_treatments_other_services'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200 flex justify-between items-end">
                                <span>Total Treatments & Other Services</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Auto</span>
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code, calculateTotalTreatmentsOtherServices(healthClubData, year, label)) }}
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code + '_pct', calculateTotalTreatmentsOtherServicesPct(healthClubData, year, label)) }}
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code, calculateTotalTreatmentsOtherServices(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code + '_pct', calculateTotalTreatmentsOtherServicesPct(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- TOTAL MEMBERSHIPS -->
                            <tr v-else-if="field.code === 'total_memberships'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200 flex justify-between items-end">
                                <span>Total Memberships</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Auto</span>
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code, calculateTotalMemberships(healthClubData, year, label)) }}
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code + '_pct', calculateTotalMembershipsPct(healthClubData, year, label)) }}
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code, calculateTotalMemberships(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code + '_pct', calculateTotalMembershipsPct(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- TOTAL HEALTH CLUB & SPA -->
                            <tr v-else-if="field.code === 'total_health_club_spa'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200 flex justify-between items-end">
                                <span>Total Health Club & Spa</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Auto</span>
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code, calculateTotalHealthClubSpa(healthClubData, year, label)) }}
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      0.00%
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code, calculateTotalHealthClubSpa(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    0.00%
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- SERVICE CHARGE -->
                            <tr v-else-if="field.code === 'service_charge'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200">
                                Service Charge
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td
                                      contenteditable="true"
                                      class="px-2 py-1 text-right border border-green-200 bg-green-50 font-mono"
                                      @input="e => { sanitizeNumberInput(e); handleHealthClubCellInput({ year, label, field: field.code, event: e }); }"
                                      @focus="handleOODCellFocus({ year, label, field: field.code, event: $event })"
                                      @blur="handleCellEditWrapper({ year, label, field: field.code, event: $event })"
                                    >
                                      <span>{{ formatOODValue(field.code, getOODCellValue(healthClubData, field.code, year, label, advancedModes[year] || displayMode)) }}</span>
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      0.00%
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-green-200 bg-green-50 font-mono"
                                    @input="e => { sanitizeNumberInput(e); handleHealthClubCellInput({ year, label, field: field.code, event: e }); }"
                                    @focus="handleOODCellFocus({ year, label, field: field.code, event: $event })"
                                    @blur="handleCellEditWrapper({ year, label, field: field.code, event: $event })"
                                  >
                                    <span>{{ formatOODValue(field.code, getOODCellValue(healthClubData, field.code, year, getColumnLabelsForYearLocal(year)[0], advancedModes[year] || displayMode)) }}</span>
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    0.00%
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- TOTAL HEALTH CLUB REV INCLUDING SC -->
                            <tr v-else-if="field.code === 'total_health_club_rev_including_sc'">
                              <td class="px-3 py-2 border-r w-[300px] font-bold text-green-800 bg-green-200 flex justify-between items-end">
                                <span>Total Health Club Rev Including SC</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Auto</span>
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      {{ formatOODValue(field.code, calculateTotalHealthClubRevIncludingSC(healthClubData, year, label)) }}
                                    </td>
                                    <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                      0.00%
                                    </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    {{ formatOODValue(field.code, calculateTotalHealthClubRevIncludingSC(healthClubData, year, getColumnLabelsForYearLocal(year)[0])) }}
                                  </td>
                                  <td class="px-2 py-1 text-right border border-green-200 bg-green-100 font-semibold font-mono" style="pointer-events: none; opacity: 1;">
                                    0.00%
                                  </td>
                                </template>
                              </template>
                            </tr>
                            <!-- All other rows -->
                            <tr v-else :class="[
                              'transition-all duration-200 border-b border-gray-100 hover:bg-green-50',
                              isTotalField(field.code) 
                                ? 'bg-gradient-to-r from-green-100 to-green-50 border-green-300 font-semibold' 
                                : 'even:bg-gray-50'
                            ]">
                              <td :class="[
                                'px-3 py-2 border-r w-[300px]',
                                isTotalField(field.code)
                                  ? 'font-bold text-green-800 bg-green-200'
                                  : 'font-medium text-gray-600'
                              ]">
                                {{ field.label }}
                            </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                  <template v-for="label in getColumnLabelsForYearLocal(year)" :key="year + '-' + label">
                                    <td
                                        contenteditable="true"
                                        :class="[
                                            'px-2 py-1 text-right border border-green-200 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200',
                                            isTotalField(field.code)
                                            ? 'bg-green-100 hover:bg-green-200 font-semibold'
                                            : 'hover:bg-green-50'
                                        ]"
                                        @input="e => { sanitizeNumberInput(e); handleHealthClubCellInput({ year, label, field: field.code, event: e }); }"
                                        @focus="handleOODCellFocus({ year, label, field: field.code, event: $event })"
                                        @blur="handleCellEditWrapper({ year, label, field: field.code, event: $event })"
                                        >
                                        <span :class="[
                                            'font-mono text-xs',
                                            isTotalField(field.code) ? 'text-green-800 font-semibold' : ''
                                        ]">{{ formatOODValue(field.code, getOODCellValue(healthClubData, field.code, year, label, advancedModes[year] || displayMode)) }}</span>
                                    </td>
                                    <td
                                      :class="[
                                        'px-2 py-1 text-right border border-green-200 outline-none font-mono text-xs',
                                        isTotalField(field.code)
                                          ? 'bg-green-100 font-semibold'
                                          : 'bg-green-50'
                                      ]"
                                      style="pointer-events: none; opacity: 1;"
                                    >
                                      <!-- Only show percentage for SERVICE CHARGE, leave empty for others -->
                                      <template v-if="field.code === 'service_charge'">
                                        <!-- Editable or not depending on your logic -->
                                  </template>
                                  </td>
                                  </template>
                                </template>
                                <template v-else>
                                  <td
                                    :class="[
                                      'px-2 py-1 text-right border border-green-200 outline-none font-mono text-xs',
                                      isTotalField(field.code)
                                        ? 'bg-green-100 font-semibold'
                                        : 'bg-green-50'
                                    ]"
                                    style="pointer-events: none; opacity: 1;"
                                  >
                                    <!-- Only show percentage for SERVICE CHARGE, leave empty for others -->
                                    <template v-if="field.code === 'service_charge'">
                                      <!-- Editable or not depending on your logic -->
                                    </template>
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
                  {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the tables.' : 
                     !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the tables.' :
                       'Please select both "From Year" and "To Year" in the left panel to display the tables.' }}
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
              <span class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure advanced settings.</span>
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
  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted, reactive, nextTick } from "vue";
  import { storeToRefs } from 'pinia';
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
  import Sidebar from "@/components/ui/Sidebar.vue";
  import { 
    CircleAlert, 
    AlertTriangle, 
    Building2, 
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
  LAUNDRY_FIELDS,
  HEALTH_CLUB_FIELDS,
  formatOODValue, 
  getVisibleYears,
  getColumnLabels,
  getAmountForOOD,
  handleOODCellEdit,
  handleOODCellInput,
  handleOODCellFocus,
  loadOODData, 
  saveOODChanges,
  convertOODServerDataToFrontend, 
    toNum,
  toggleCollapse as toggleCollapseUtil,
  loadYearOptions,
  isYearCollapsed as isYearCollapsedUtil,
  calculateLaundryRevenue,
    calculateInHouseRevenue,
  calculateOutsideGuestLaundryRevenue,
  calculateGuestLaundryCost,
  calculateTotalClubUseRevenue,
  calculateTotalTreatmentsOtherServices,
  calculateTotalMemberships,
  calculateTotalHealthClubSpa,
  calculateTotalHealthClubRevIncludingSC,
  calculateTotalClubUseRevenuePct,
  calculateTotalTreatmentsOtherServicesPct,
  calculateTotalMembershipsPct,
  loadLaundryTableData,
  saveLaundryTableData,
  loadHealthClubTableData,
  saveHealthClubTableData
} from "@/components/utility/ood_data/index.js";
  import { cloneDeep } from 'lodash-es';
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  
  // Import project service
  import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';
  
  // Reactive state
  const years = ref([]);
  const displayMode = ref("monthly");
  const laundryData = reactive({});
  const healthClubData = reactive({});
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalLaundryData = ref({});
  const originalHealthClubData = ref({});
  const changedCells = ref([]); // {year, label, field, newValue}
  const isSaving = ref(false);
  const saveError = ref("");
  const sidebarCollapsed = ref(false);
  const isComponentReady = ref(false);
  const collapsedYears = ref([]);
  const calculationCache = useCalculationCache();
  // Matrix/grid state for laundry assumptions per year/month
  const laundryAssumptions = reactive({
    // For each assumption, store year -> label -> value
    in_house_guest_laundry_percentage: {},
    in_house_guest_laundry_base: {},
    in_house_guest_laundry_amount: {},
    in_house_dry_cleaning_percentage: {},
    in_house_dry_cleaning_base: {},
    in_house_dry_cleaning_amount: {},
    outside_guest_laundry_number: {},
    outside_guest_laundry_base: {},
    outside_guest_laundry_amount: {},
    guest_laundry_cost_percentage: {},
    guest_laundry_cost_amount: {},
    revenue_in_house: {},
    revenue_outside: {},
    revenue_other: {},
    other_laundry_costs: {},
  });

  // Pinia store for year settings
  const yearSettingsStore = useYearSettingsStore();
  const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
  const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;

  // Computed properties
  const visibleYears = computed(() => {
    return getVisibleYears(fromYear.value, toYear.value);
  });

  // Computed property for filtered years in "To Year" dropdown
  const filteredToYears = computed(() => {
    return getFilteredToYears(years.value);
  });

  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    return getColumnLabels(advancedModes.value[year] || displayMode.value);
  };
  


  const healthClubFields = computed(() => {
    return HEALTH_CLUB_FIELDS;
  });

  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        yearSettingsStore.setAdvancedMode(year, displayMode.value);
      }
    });
  });

  // Watch for changes in data to ensure calculated fields update
  watch([laundryData, healthClubData], (newData, oldData) => {
    // console.log('OOD data changed:', newData);
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
  
  // On mount, initialize years
  onMounted(async () => {
    try {
      await initializeProjectService();
      await new Promise(resolve => setTimeout(resolve, 100));
      years.value = await loadYearOptions();
      if (selectedProject.value) {
        const [laundryResult, healthClubResult] = await Promise.all([
          loadLaundryTableData(selectedProject.value.project_name),
          loadHealthClubTableData(selectedProject.value.project_name)
        ]);
        Object.assign(laundryData, normalizeLaundryData(laundryResult || {}));
        populateLaundryAssumptionsFromData(laundryData);
        isSaved.value = true;
        Object.assign(healthClubData, normalizeHealthClubData(healthClubResult || {}));
      } else {
        laundryData.value = { status: 'no_project_selected', message: 'No project selected' };
        healthClubData.value = { status: 'no_project_selected', message: 'No project selected' };
      }
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
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
    if (newProject) {
      try {
        const [laundryResult, healthClubResult] = await Promise.all([
          loadLaundryTableData(newProject.project_name),
          loadHealthClubTableData(newProject.project_name)
        ]);
        Object.assign(laundryData, normalizeLaundryData(laundryResult || {}));
        populateLaundryAssumptionsFromData(laundryData);
        isSaved.value = true;
        Object.assign(healthClubData, normalizeHealthClubData(healthClubResult || {}));
        originalLaundryData.value = cloneDeep(laundryData);
        originalHealthClubData.value = cloneDeep(healthClubData);
        changedCells.value = [];
        saveError.value = "";
        alertService.success(`Switched to project: ${newProject.project_name}`);
      } catch (error) {
        console.error('Error reloading OOD data for new project:', error);
        alertService.error("Failed to load project data. Please try again.");
      }
    } else {
      laundryData.value = { status: 'no_project_selected', message: 'No project selected' };
      healthClubData.value = { status: 'no_project_selected', message: 'No project selected' };
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
    }
  }, { deep: true });
  
  function clearYearSelection() {
    clearYearSettings();
    isSaved.value = false;
  }
  
  function handleCellEditWrapper({ year, label, field, event }) {
    handleOODCellEdit({
    year,
    label,
      field,
    event,
      originalOODData: originalLaundryData, // This will be updated based on which table is being edited
    changedCells,
      oodData: laundryData, // This will be updated based on which table is being edited
    isSaved,
    isComponentReady
  });
}
  
  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    try {
      isSaving.value = true;
      saveError.value = "";
      
      // Log changedCells to see if health club changes are tracked
      // console.log('[OOD Save] changedCells:', JSON.parse(JSON.stringify(changedCells.value)));

      // Group changed cells by year and month
      const changesByYearMonth = {};
      for (const cell of changedCells.value) {
        const { year, label: month } = cell;
        if (!changesByYearMonth[year]) changesByYearMonth[year] = {};
        if (!changesByYearMonth[year][month]) changesByYearMonth[year][month] = true;
      }

      // For each changed year/month, gather and save laundry and health club data
      const laundryFields = [
        { section: "In House Guest Laundry Revenue", detail: "Percentage", key: "in_house_guest_laundry_percentage" },
        { section: "In House Guest Laundry Revenue", detail: "Base", key: "in_house_guest_laundry_base" },
        { section: "In House Guest Laundry Revenue", detail: "Average Amount", key: "in_house_guest_laundry_amount" },
        { section: "In House Dry Cleaning Revenue", detail: "Percentage", key: "in_house_dry_cleaning_percentage" },
        { section: "In House Dry Cleaning Revenue", detail: "Base", key: "in_house_dry_cleaning_base" },
        { section: "In House Dry Cleaning Revenue", detail: "Average Amount", key: "in_house_dry_cleaning_amount" },
        { section: "Outside Guest Laundry", detail: "Number", key: "outside_guest_laundry_number" },
        { section: "Outside Guest Laundry", detail: "Base", key: "outside_guest_laundry_base" },
        { section: "Outside Guest Laundry", detail: "Average Amount", key: "outside_guest_laundry_amount" },
        { section: "Guest Laundry Cost", detail: "Percentage", key: "guest_laundry_cost_percentage" },
        { section: "Guest Laundry Cost", detail: "Amount", key: "guest_laundry_cost_amount" },
        { section: "Revenue", detail: "Other Revenue", key: "revenue_other" },
        { section: "COST OF LAUNDRY", detail: "Other Laundry Costs", key: "other_laundry_costs" }
      ];
      const savePromises = [];
      for (const year in changesByYearMonth) {
        for (const month in changesByYearMonth[year]) {
          // Gather laundry table data
          const laundry_table = [];
          for (const field of laundryFields) {
            const value = laundryAssumptions[field.key]?.[year]?.[month];
            if (value !== undefined && value !== "") {
              laundry_table.push({
                section: field.section,
                detail: field.detail,
                amount: value
              });
            }
          }
          // Gather health club table data
          const health_club_table = [];
          if (healthClubData[year] && healthClubData[year][month]) {
            // console.log('[OOD Save] healthClubData for', year, month, ':', JSON.parse(JSON.stringify(healthClubData[year][month])));
            for (const row of healthClubData[year][month]) {
              if (row.section && row.detail && row.amount !== undefined && row.amount !== "") {
                health_club_table.push({
                  section: row.section,
                  detail: row.detail,
                  amount: row.amount
                });
              }
            }
          }
          // Save laundry table if there are changes
          if (laundry_table.length > 0) {
            savePromises.push(
              saveLaundryTableData(year, month, laundry_table, selectedProject.value?.project_name)
            );
          }
          // Save health club table if there are changes
          if (health_club_table.length > 0) {
            // console.log('[OOD Save] Health Club Table Payload:', { year, month, health_club_table });
            savePromises.push(
              saveHealthClubTableData(year, month, health_club_table, selectedProject.value?.project_name)
            );
          }
        }
      }
      if (savePromises.length === 0) {
        isSaving.value = false;
        return;
      }
      await Promise.all(savePromises);
      // After saving, reload and normalize both tables
      const [laundryResult, healthClubResult] = await Promise.all([
        loadLaundryTableData(selectedProject.value?.project_name),
        loadHealthClubTableData(selectedProject.value?.project_name)
      ]);
      Object.assign(laundryData, normalizeLaundryData(laundryResult || {}));
      populateLaundryAssumptionsFromData(laundryData);
      isSaved.value = true;
      Object.assign(healthClubData, normalizeHealthClubData(healthClubResult || {}));
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
      changedCells.value = [];
      alertService.success("Changes saved successfully");
      isSaving.value = false;
      return;
    } catch (err) {
      saveError.value = err.message || "Failed to save changes";
      alertService.error(saveError.value);
      isSaving.value = false;
    }
  };
  
  // Unsaved Changes Warning Modal
  watch(isSaved, (newValue) => {
    if (!newValue) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });
  
  function handleBeforeUnload(event) {
    if (!isSaved.value) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes that may be discarded if not saved. Are you sure you want to leave?';
      return event.returnValue;
    }
  }
  
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

  function getOODCellValue(oodData, fieldCode, year, label, displayMode = 'monthly') {
    // Auto-calc for laundry revenue rows
    if (
      fieldCode === 'in_house_guest_laundry' ||
      fieldCode === 'in_house_dry_cleaning'
    ) {
      const projectName = selectedProject.value?.project_name;
      const pageId = 'F&B Revenue Assumptions';
      const rowCode = 'Number of guests';
      const numberOfGuests = calculationCache.getValue(
        projectName,
        pageId,
        rowCode,
        year,
        label
      );
      // console.log('[Cache Lookup] project:', projectName, 'page:', pageId, 'row:', rowCode, 'year:', year, 'label:', label, '=>', numberOfGuests);
      return calculateLaundryRevenue(
        laundryData.static,
        fieldCode,
        year,
        label,
        numberOfGuests
      );
    }
    // Default for other fields
    return getAmountForOOD(oodData, fieldCode, year, label, displayMode);
  }

  // Toggle collapse functionality - using imported function
  function toggleCollapse(year) {
    toggleCollapseUtil(year, collapsedYears);
  }

  // Check if year is collapsed - using imported function
  function isYearCollapsed(year) {
    return isYearCollapsedUtil(year, collapsedYears);
  }



  // Check if a field is a total field in Health Club table
  function isTotalField(fieldCode) {
    const totalFields = [
      'total_club_use_revenue',
      'total_treatments_other_services', 
      'total_memberships',
      'total_health_club_spa',
      'service_charge',
      'total_health_club_rev_including_sc'
    ];
    return totalFields.includes(fieldCode);
  }

  // Utility: Only allow numbers and dot in input
  function sanitizeNumberInput(e) {
    let val;
    if ('value' in e.target) {
      val = e.target.value;
    } else if ('innerText' in e.target) {
      val = e.target.innerText;
    } else {
      val = '';
    }
    // Remove all except digits and dot, allow only one dot
    val = val.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    // Remove leading zeros unless before dot
    val = val.replace(/^0+(?!\.)/, '');
    if ('value' in e.target) {
      e.target.value = val;
    } else if ('innerText' in e.target) {
      e.target.innerText = val;
    }
    return val;
  }

  // In the <script setup> section, add a handler for contenteditable numeric enforcement:
  function handleContentEditableInput(e, obj, year, label) {
    let val = e.target.innerText.replace(/[^\d.]/g, '');
    // Only allow one dot
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    // Remove leading zeros unless before dot
    val = val.replace(/^0+(?!\.)/, '');
    e.target.innerText = val;
    if (!obj[year]) obj[year] = {};
    obj[year][label] = val;
  }
  function handleContentEditablePaste(e) {
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (/[^\d.]/.test(text)) {
      e.preventDefault();
      // Only paste numbers and dot
      document.execCommand('insertText', false, text.replace(/[^\d.]/g, ''));
    }
  }

  // In the <script setup> section, add a computed property for the In House revenue calculation:
  const calculateInHouseRevenueReactive = (year, label) => {
    const projectName = selectedProject.value?.project_name;
    const pageId = 'F&B Revenue Assumptions';
    const rowCode = 'Number of guests';
    const numberOfGuests = calculationCache.getValue(projectName, pageId, rowCode, year, label);
    
    // Get current values from laundryAssumptions
    const guestLaundryPct = Number(laundryAssumptions.in_house_guest_laundry_percentage?.[year]?.[label] || 0) / 100;
    const guestLaundryBase = laundryAssumptions.in_house_guest_laundry_base?.[year]?.[label] || 'per_month';
    const guestLaundryAmount = Number(laundryAssumptions.in_house_guest_laundry_amount?.[year]?.[label] || 0);
    
    const dryCleaningPct = Number(laundryAssumptions.in_house_dry_cleaning_percentage?.[year]?.[label] || 0) / 100;
    const dryCleaningBase = laundryAssumptions.in_house_dry_cleaning_base?.[year]?.[label] || 'per_month';
    const dryCleaningAmount = Number(laundryAssumptions.in_house_dry_cleaning_amount?.[year]?.[label] || 0);
    
    // Calculate base multipliers
    const guestLaundryBaseMultiplier = guestLaundryBase === 'per_week' ? 4 : 1;
    const dryCleaningBaseMultiplier = dryCleaningBase === 'per_week' ? 4 : 1;
    
    // Calculate revenues
    const guestLaundryRevenue = guestLaundryPct * guestLaundryBaseMultiplier * guestLaundryAmount * Number(numberOfGuests || 0);
    const dryCleaningRevenue = dryCleaningPct * dryCleaningBaseMultiplier * dryCleaningAmount * Number(numberOfGuests || 0);
    
    return guestLaundryRevenue + dryCleaningRevenue;
  };

  // Reactive function for Guest Laundry Cost calculation
  const calculateGuestLaundryCostReactive = (year, label) => {
    return calculateGuestLaundryCost(
      laundryAssumptions, 
      year, 
      label, 
      calculateInHouseRevenueReactive, 
      (assumptions, y, l) => calculateOutsideGuestLaundryRevenue(assumptions, y, l)
    );
  };

  // Watch for changes in laundryAssumptions to mark as unsaved
  watch(laundryAssumptions, () => {
    if (!isPopulatingLaundryAssumptions && isSaved.value) {
    isSaved.value = false;
  }
  }, { deep: true });

  // Helper to get section and detail for a health club field code
  function getHealthClubSectionDetail(fieldCode) {
    const field = HEALTH_CLUB_FIELDS.find(f => f.code === fieldCode);
    if (!field) return { section: '', detail: fieldCode };
    return { section: field.section, detail: field.label };
  }

  // In the health club table template, update @input handler:
  // @input="e => { sanitizeNumberInput(e); handleHealthClubCellInput({ year, label, field: field.code, event: e }); }"
  function handleHealthClubCellInput({ year, label, field, event }) {
    const value = (typeof event.target.value === 'string') ? event.target.value.trim() : event.target.textContent.trim();
    const amount = value === '' ? 0 : Number(value.replace(/[^\d.-]/g, ''));
    if (!healthClubData[year]) healthClubData[year] = {};
    if (!Array.isArray(healthClubData[year][label])) healthClubData[year][label] = [];
    const { section, detail } = getHealthClubSectionDetail(field);
    // Find by field (code) for uniqueness
    const existingIndex = healthClubData[year][label].findIndex(e => e.field === field);
    if (existingIndex >= 0) {
      healthClubData[year][label][existingIndex].amount = amount;
      healthClubData[year][label][existingIndex].section = section;
      healthClubData[year][label][existingIndex].detail = detail;
    } else {
      healthClubData[year][label].push({ field, section, detail, amount });
    }
  }

  // Helper to find code for section/detail
  function findHealthClubCode(section, detail) {
    const match = HEALTH_CLUB_FIELDS.find(f => f.section === section && f.label === detail);
    return match ? match.code : undefined;
  }

  // Normalize health club data after loading
  function normalizeHealthClubData(raw) {
    const normalized = {};
    for (const year in raw) {
      normalized[year] = {};
      for (const month in raw[year]) {
        const arr = (raw[year][month]?.health_club_table || []).map(row => ({
          ...row,
          field: findHealthClubCode(row.section, row.detail)
        }));
        normalized[year][month] = arr;
      }
    }
    return normalized;
  }

  // Helper to find code for section/detail in laundry fields
  function findLaundryCode(section, detail) {
    const match = LAUNDRY_FIELDS.find(f => f.label === section && f.detail === detail);
    // If LAUNDRY_FIELDS does not have 'detail', fallback to label only
    if (!match) {
      const fallback = LAUNDRY_FIELDS.find(f => f.label === section);
      return fallback ? fallback.code : undefined;
    }
    return match.code;
  }

  // Normalize laundry data after loading
  function normalizeLaundryData(raw) {
    const normalized = {};
    for (const year in raw) {
      normalized[year] = {};
      for (const month in raw[year]) {
        const arr = (raw[year][month]?.laundry_table || []).map(row => ({
          ...row,
          field: findLaundryCode(row.section, row.detail)
        }));
        normalized[year][month] = arr;
      }
    }
    return normalized;
  }

  // Map normalized laundryData to laundryAssumptions
  function populateLaundryAssumptionsFromData(laundryData) {
    isPopulatingLaundryAssumptions = true;
    // Clear existing
    Object.keys(laundryAssumptions).forEach(key => {
      laundryAssumptions[key] = {};
    });
    for (const year in laundryData) {
      for (const month in laundryData[year]) {
        for (const row of laundryData[year][month]) {
          // Map by field
          switch (row.field) {
            case 'in_house_guest_laundry':
              if (row.detail === 'Percentage') {
                if (!laundryAssumptions.in_house_guest_laundry_percentage[year]) laundryAssumptions.in_house_guest_laundry_percentage[year] = {};
                laundryAssumptions.in_house_guest_laundry_percentage[year][month] = row.amount;
              } else if (row.detail === 'Base') {
                if (!laundryAssumptions.in_house_guest_laundry_base[year]) laundryAssumptions.in_house_guest_laundry_base[year] = {};
                laundryAssumptions.in_house_guest_laundry_base[year][month] = row.base;
              } else if (row.detail === 'Average Amount') {
                if (!laundryAssumptions.in_house_guest_laundry_amount[year]) laundryAssumptions.in_house_guest_laundry_amount[year] = {};
                laundryAssumptions.in_house_guest_laundry_amount[year][month] = row.amount;
              }
              break;
            case 'in_house_dry_cleaning':
              if (row.detail === 'Percentage') {
                if (!laundryAssumptions.in_house_dry_cleaning_percentage[year]) laundryAssumptions.in_house_dry_cleaning_percentage[year] = {};
                laundryAssumptions.in_house_dry_cleaning_percentage[year][month] = row.amount;
              } else if (row.detail === 'Base') {
                if (!laundryAssumptions.in_house_dry_cleaning_base[year]) laundryAssumptions.in_house_dry_cleaning_base[year] = {};
                laundryAssumptions.in_house_dry_cleaning_base[year][month] = row.base;
              } else if (row.detail === 'Average Amount') {
                if (!laundryAssumptions.in_house_dry_cleaning_amount[year]) laundryAssumptions.in_house_dry_cleaning_amount[year] = {};
                laundryAssumptions.in_house_dry_cleaning_amount[year][month] = row.amount;
              }
              break;
            // Add similar mapping for other fields as needed
          }
        }
      }
    }
    nextTick(() => {
      isPopulatingLaundryAssumptions = false;
    });
  }

  // Add at the top of <script setup>
  let isPopulatingLaundryAssumptions = false;

  </script>
  


  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .input {
    @apply w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 text-sm bg-blue-50/50;
  }
  .borderless-input {
    @apply w-full px-3 py-2 bg-blue-50/50 focus:ring-2 focus:ring-blue-400 text-sm outline-none border-0 shadow-none;
  }
  </style>
  