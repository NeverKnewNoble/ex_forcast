<template>
    <div class="flex ">
      <Sidebar @open-settings="openSettings" />
  
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
                  <HandPlatter class="w-7 h-7 mx-2 text-white" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Banquet Revenue Assumptions</h1>
              </div>
              <p class="text-sm text-gray-500">Manage and configure your banquet revenue data</p>
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
              <!-- Notice: Excludes Taxes -->
              <div v-if="!sidebarCollapsed" class="mb-4">
                <div class="flex items-center gap-2 p-4 bg-red-100 border border-red-200 rounded text-red-800 text-sm">
                  <AlertTriangle class="w-6 h-6 text-red-600" />
                  <span>All figures shown exclude taxes.</span>
                </div>
              </div>
              
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
                        disabled
                        v-model="fromYear" 
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm"
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
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm"
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
              <NoProjectSelectedState />
            </template>
            
            <!-- Table Header with Stats -->
            <template v-else-if="visibleYears.length && isComponentReady">
              <div class="mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Banquet Revenue Assumptions Overview</h2>
                </div>
                <div class="flex gap-2 mt-2">
                  <button 
                    @click="showAddBanquetDetail = true" 
                    :disabled="!selectedProject"
                    :class="[
                      'px-3 py-1.5 text-sm font-medium shadow rounded-md transition-all',
                      selectedProject 
                        ? 'bg-violet-600 text-white hover:bg-violet-700' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    ]"
                  >
                    Add Banquet Detail
                  </button>
                  <button @click="resetToDefault" class="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium shadow transition-all">
                    Reset to Default
                  </button>
                </div>
              </div>
  
              <!-- Modern Table Container -->
              <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                <div class="overflow-x-auto max-w-[100%] md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Table Header -->
                      <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                        <tr>
                          <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                              Banquet Details
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
                                  Forecast
                                </div>
                              </th>
                            </template>
                            <template v-else>
                              <th class="px-2 py-1 text-center border border-violet-300 min-w-[110px] font-semibold">
                                <div class="flex items-center justify-center gap-1">
                                  Forecast
                                </div>
                              </th>
                            </template>
                          </template>
                        </tr>
                      </thead>
                      <tbody class="text-gray-700 bg-white text-sm">
                        <template v-for="(field, idx) in computedBanquetFields" :key="field.code">
                          <tr
                            :class="[
                              'transition-all duration-200 border-b border-gray-100',
                              (['gross','net_amount'].includes(field.code)) ? 'bg-violet-700 text-white font-bold' : 'even:bg-gray-50 hover:bg-violet-50',
                            ]"
                          >
                            <td class="px-3 py-2 font-medium border-r border-violet-200 flex items-center justify-between" :class="['gross','net_amount'].includes(field.code) ? 'bg-violet-700 text-white font-bold' : 'text-gray-600'">
                              <span>{{ field.label }}</span>
                              <div class="flex items-center gap-1">
                                <span v-if="['food','liquor','soft_drinks','hall_space_charges','gross','net_amount','amount_per_event','amount_per_pax','avg_pax_per_event'].includes(field.code)" class="px-2 py-0.5 rounded bg-violet-100 text-violet-700 text-[10px] font-semibold border border-violet-200 align-middle whitespace-nowrap">
                                  Auto
                                </span>
                                <span v-if="customBanquetFields.some(f => f.code === field.code)" class="px-2 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-semibold border border-green-200 align-middle whitespace-nowrap">
                                  Custom
                                </span>
                                <button v-if="!['gross','net_amount','advance_bal','amount_per_event','amount_per_pax','avg_pax_per_event'].includes(field.code)" @click="deleteBanquetDetail(field)" class="ml-2 text-red-500 hover:text-red-700" title="Delete">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            </td>
                            <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-if="['food','liquor','soft_drinks','hall_space_charges','gross','net_amount','amount_per_event','amount_per_pax','avg_pax_per_event'].includes(field.code)"
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'cell-' + year + '-' + label"
                                  class="px-2 py-1 text-right border border-violet-200 bg-gray-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200 font-semibold select-none"
                                  :class="['gross','net_amount'].includes(field.code) ? 'bg-violet-700 text-white font-bold' : ''"
                                >
                                  <span class="font-mono text-xs">
                                    {{ formatBanquetValue(field.code, getBanquetCellValue(banquetData, field.code, year, label, advancedModes[year] || displayMode)) }}
                                  </span>
                                </td>
                                <td
                                  v-else
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'cell-editable-' + year + '-' + label"
                                  contenteditable="true"
                                  class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                  :class="['gross','net_amount'].includes(field.code) ? 'bg-violet-700 text-white font-bold' : ''"
                                  @input="handleBanquetCellInput({ year, label, expense: field.code, event: $event, banquetData })"
                                  @focus="handleBanquetCellFocus({ year, label, expense: field.code, event: $event })"
                                  @blur="handleCellEditWrapper({ year, label, expense: field.code, event: $event })"
                                >
                                  <span class="font-mono text-xs">{{ formatBanquetValue(field.code, getBanquetCellValue(banquetData, field.code, year, label, advancedModes[year] || displayMode)) }}</span>
                                </td>
                                <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50" :class="['gross','net_amount'].includes(field.code) ? 'bg-violet-800 text-white font-bold' : ''">
                                  <span class="font-mono text-xs text-violet-700" :class="['gross','net_amount'].includes(field.code) ? 'text-white' : ''">
                                    {{ formatBanquetValue(field.code, calculateBanquetTotal(banquetData, field.code, year, advancedModes[year] || displayMode)) }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50" :class="['gross','net_amount'].includes(field.code) ? 'bg-violet-800 text-white font-bold' : ''">
                                  <span class="font-mono text-xs text-violet-700" :class="['gross','net_amount'].includes(field.code) ? 'text-white' : ''">
                                    {{ formatBanquetValue(field.code, calculateBanquetTotal(banquetData, field.code, year, advancedModes[year] || displayMode)) }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                          <tr v-if="field.code === 'avg_hall_space_charges_check'">
                            <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1), 0)" class="h-10 font-bold text-xl text-violet-700 bg-violet-200 border px-2 py-2 m-0">
                              Details
                            </td>
                          </tr>
                          <tr v-if="field.code === 'net_amount'">
                            <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1), 0)" class="h-10 font-bold text-xl text-violet-700 bg-violet-200 border px-2 py-2 m-0">
                              Statistics 
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>
  
            <!-- Enhanced No Years Selected State -->
            <template v-else-if="selectedProject">
              <NoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
            </template>
            
            <!-- Fallback for when project is selected but no years -->
            <template v-else>
              <NoProjectSelectedState />
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
  
    <!-- Add Banquet Detail Modal -->
    <transition name="fade">
      <div v-if="showAddBanquetDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-md p-0 overflow-hidden">
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <Settings class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Add Banquet Detail</h2>
          </div>
          <div class="p-8 pt-6">
            <!-- No Project Selected Message -->
            <div v-if="!selectedProject" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle class="w-6 h-6 text-yellow-600" />
              <span class="text-yellow-800 font-medium">Please select a project first to add banquet details.</span>
            </div>
            
            <div v-else class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Banquet Detail</label>
              <input v-model="newBanquetDetail" class="w-full px-3 py-2 border rounded focus:ring-violet-500" placeholder="e.g. Decoration" />
            </div>
          </div>
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button @click="closeAddBanquetDetail" class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button 
              @click="addBanquetDetail" 
              :disabled="!selectedProject || !newBanquetDetail"
              :class="[
                'px-4 py-2 rounded-md flex items-center gap-2',
                selectedProject && newBanquetDetail
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              ]"
            >
              <Check class="w-4 h-4" />
              Add
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
  import { ref, onMounted, computed, watch, onUnmounted, reactive } from "vue";
  import { storeToRefs } from 'pinia';
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
  import Sidebar from "@/components/ui/Sidebar.vue";
  import { 
    CircleAlert, 
    AlertTriangle, 
    HandPlatter, 
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
    BANQUET_FIELDS, 
    formatBanquetValue, 
    calcFood, 
    calcLiquor, 
    calcSoftDrinks, 
    calcHallSpaceCharges, 
    calcGross,
    calcNetAmount,
    calcAmountPerEvent,
    calcAmountPerPax,
    calcAvgPaxPerEvent,
    getVisibleYears,
    getColumnLabels,
    getAmountForBanquet,
    calculateTotalForBanquet,
    handleBanquetCellEdit,
    handleBanquetCellInput,
    handleBanquetCellFocus,
    loadBanquetRevenueData, 
    saveBanquetRevenueChanges,
    convertBanquetServerDataToFrontend, 
    toNum
  } from "@/components/utility/banquet_revenue_assumpt/index.js";
  import {
    toggleCollapse,
    loadYearOptions,
    isYearCollapsed
  } from "@/components/utility/expense_assumption/index.js";
  import { cloneDeep } from 'lodash-es';
  // Import project service
  import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';
  import NoProjectSelectedState from '@/components/ui/banquet/NoProjectSelectedState.vue';
  import NoYearsSelectedState from '@/components/ui/banquet/NoYearsSelectedState.vue';
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  import SettingsModal from '@/components/ui/SettingsModal.vue';
  
  
  // Reactive state
  const years = ref([]);
  const displayMode = ref("monthly");
  const banquetData = reactive({});
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalBanquetData = ref({});
  const changedCells = ref([]); // {year, label, expense, newValue}
  const isSaving = ref(false);
  const saveError = ref("");
  const sidebarCollapsed = ref(false);
  const isComponentReady = ref(false); // Add a flag to track if component is ready
  const showAddBanquetDetail = ref(false);
  const newBanquetDetail = ref("");
  const customBanquetFields = ref([]); // Will hold fetched banquet details
  const removedDefaultFields = ref([]); // Track removed default fields
  const showSettingsModal = ref(false);

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

  // Watch for changes in banquetData to ensure calculated fields update
  watch(banquetData, (newData, oldData) => {
    // console.log('banquetData changed:', newData);
    
    // Clear calculation cache when banquet data changes to ensure consistency
    if (selectedProject.value && selectedProject.value.project_name) {
      const project = selectedProject.value.project_name;
      const cacheKeys = [
        'Food', 'Liquor', 'Soft Drinks', 'Hall Space Charges', 'Gross', 'Net Amount',
        'Amount Per Event', 'Amount Per Pax', 'Avg Pax Per Event',
        'Tobacco', 'Non F&B', 'Others'
      ];
      
      cacheKeys.forEach(baseKey => {
        if (calculationCache.cache[project]?.['Banquet Revenue Assumptions']?.[baseKey]) {
          delete calculationCache.cache[project]['Banquet Revenue Assumptions'][baseKey];
        }
      });
      
      // Also clear any custom field caches
      if (calculationCache.cache[project]?.['Banquet Revenue Assumptions']) {
        Object.keys(calculationCache.cache[project]['Banquet Revenue Assumptions']).forEach(key => {
          if (key.toLowerCase().includes('outside') || 
              key.toLowerCase().includes('catering') ||
              key.toLowerCase().includes('tobacco') ||
              key.toLowerCase().includes('non') ||
              key.toLowerCase().includes('fnb') ||
              key.toLowerCase().includes('others') ||
              // Clear any other custom banquet detail caches
              customBanquetFields.value.some(f => f.code === key)) {
            delete calculationCache.cache[project]['Banquet Revenue Assumptions'][key];
          }
        });
      }
    }
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

  function openSettings() {
    showSettingsModal.value = true;
  }

  function closeSettings() {
    showSettingsModal.value = false;
  }

  function openAddBanquetDetail() {
    newBanquetDetail.value = "";
    showAddBanquetDetail.value = true;
  }
  function closeAddBanquetDetail() {
    showAddBanquetDetail.value = false;
  }
  async function addBanquetDetail() {
    if (!newBanquetDetail.value) return;
    if (!selectedProject.value) {
      alertService.error("Please select a project first");
      return;
    }
    try {
      const res = await fetch("/api/resource/Banquet Details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          banquet_detail: newBanquetDetail.value,
          project: selectedProject.value.project_name
        })
      });
      if (!res.ok) throw new Error("Failed to create");
      newBanquetDetail.value = "";
      showAddBanquetDetail.value = false;
      await fetchBanquetDetails();
      alertService.success("Banquet detail added");
    } catch (err) {
      alertService.error("Failed to add banquet detail");
    }
  }

  async function fetchBanquetDetails() {
    // Frappe REST API: /api/resource/Banquet Details
    try {
      if (!selectedProject.value) {
        customBanquetFields.value = [];
        return;
      }
      
      const res = await fetch(`/api/resource/Banquet Details?fields=["name","banquet_detail"]&filters=[["project","=","${selectedProject.value.project_name}"]]&limit_page_length=1000`);
      const data = await res.json();
      customBanquetFields.value = (data.data || []).map(d => ({ code: d.name, label: d.banquet_detail }));
    } catch (err) {
      alertService.error("Failed to load banquet details");
    }
  }
  
  // On mount, initialize years
  onMounted(async () => {
    try {
      await initializeProjectService();
      await new Promise(resolve => setTimeout(resolve, 100));
      years.value = await loadYearOptions();
      if (selectedProject.value) {
        const loaded = await loadBanquetRevenueData(selectedProject.value.project_name) || {};
        const converted = convertBanquetServerDataToFrontend(loaded);
        Object.assign(banquetData, converted);
      } else {
        banquetData.value = { status: 'no_project_selected', message: 'No project selected' };
      }
      originalBanquetData.value = cloneDeep(banquetData);
      isSaved.value = true;
      isComponentReady.value = true;
      await fetchBanquetDetails();
      
      // Check if we should show refresh success alert
      if (localStorage.getItem('showRefreshSuccess') === 'true') {
        localStorage.removeItem('showRefreshSuccess');
        alertService.success("Page refreshed successfully");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  // Watchers to persist year selection (now handled by Pinia store)
  // watch(fromYear, ...)
  // watch(toYear, ...)
  
  // Watch for project changes and reload data
  watch(selectedProject, async (newProject, oldProject) => {
    // console.log('Project changed from:', oldProject?.project_name, 'to:', newProject?.project_name);
    
    if (newProject) {
      try {
        // console.log('Reloading Banquet revenue data for new project:', newProject.project_name);
        
        // Reload Banquet revenue data for the new project
        const loaded = await loadBanquetRevenueData(newProject.project_name) || {};
        const converted = convertBanquetServerDataToFrontend(loaded);
        Object.assign(banquetData, converted);
        originalBanquetData.value = cloneDeep(banquetData);
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        saveError.value = "";
        
        // Reload banquet details for the new project
        await fetchBanquetDetails();
        
        // console.log('Banquet revenue data reloaded successfully for project:', newProject.project_name);
        alertService.success(`Switched to project: ${newProject.project_name}`);
      } catch (error) {
        console.error('Error reloading Banquet revenue data for new project:', error);
        alertService.error("Failed to load project data. Please try again.");
      }
    } else {
      // Clear data when no project is selected
      banquetData.value = { status: 'no_project_selected', message: 'No project selected' };
      originalBanquetData.value = cloneDeep(banquetData);
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
      
      // Clear banquet details when no project is selected
      customBanquetFields.value = [];
    }
  }, { deep: true });
  
  function clearYearSelection() {
    clearYearSettings();
    isSaved.value = false;
  }
  
  function handleCellEditWrapper({ year, label, expense, event }) {
  handleBanquetCellEdit({
    year,
    label,
    expense,
    event,
    originalBanquetData,
    changedCells,
    banquetData,
    isSaved,
    isComponentReady
  });
}
  
  
  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    try {
      isSaving.value = true;
      saveError.value = "";
      // Prepare changes for API
      const changes = changedCells.value.map(cell => ({
        year: cell.year,
        month: cell.label,
        banquet_detail: cell.expense,
        amount: cell.newValue
      }));
      if (changes.length === 0) {
        isSaving.value = false;
        return;
      }
      const result = await saveBanquetRevenueChanges(changes, selectedProject.value?.project_name);
      // Reload from backend after save
      const loaded = await loadBanquetRevenueData(selectedProject.value?.project_name) || {};
      const converted = convertBanquetServerDataToFrontend(loaded);
      Object.assign(banquetData, converted);
      originalBanquetData.value = cloneDeep(banquetData);
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
    // Clear calculation cache for current project before refresh
    if (selectedProject.value && selectedProject.value.project_name) {
      const project = selectedProject.value.project_name;
      if (calculationCache.cache[project]?.['Banquet Revenue Assumptions']) {
        // Clear all cached calculations
        const cacheKeys = [
          'Food', 'Liquor', 'Soft Drinks', 'Hall Space Charges', 'Gross', 'Net Amount',
          'Amount Per Event', 'Amount Per Pax', 'Avg Pax Per Event',
          'Tobacco', 'Non F&B', 'Others'
        ];
        
        cacheKeys.forEach(baseKey => {
          if (calculationCache.cache[project]['Banquet Revenue Assumptions'][baseKey]) {
            delete calculationCache.cache[project]['Banquet Revenue Assumptions'][baseKey];
          }
        });
        
        // Clear custom field caches
        Object.keys(calculationCache.cache[project]['Banquet Revenue Assumptions']).forEach(key => {
          if (key.toLowerCase().includes('outside') || 
              key.toLowerCase().includes('catering') ||
              key.toLowerCase().includes('tobacco') ||
              key.toLowerCase().includes('non') ||
              key.toLowerCase().includes('fnb') ||
              key.toLowerCase().includes('others') ||
              // Clear any other custom banquet detail caches
              customBanquetFields.value.some(f => f.code === key)) {
            delete calculationCache.cache[project]['Banquet Revenue Assumptions'][key];
          }
        });
      }
    }
    
    // Set flag to show success alert after reload
    localStorage.setItem('showRefreshSuccess', 'true');
    // Reload the entire page
    window.location.reload();
  }

  function getBanquetRowData(banquetData, year, label) {
    // Returns an object with all field values for the given year/label (month/quarter)
    const row = {};
    for (const f of computedBanquetFields.value) {
      const entries = (banquetData?.[year]?.[label]) || [];
      const found = entries.find(e => e.expense === f.code);
      row[f.code] = found ? Number(found.amount) || 0 : 0;
    }
    // Debug logging for pax and avg_food_check
    if (toNum(row.pax) > 0 || toNum(row.avg_food_check) > 0) {
      // console.log(`getBanquetRowData for ${year}/${label}:`, {
      //   pax: toNum(row.pax),
      //   avg_food_check: toNum(row.avg_food_check),
      //   calculated_food: toNum(row.pax) * toNum(row.avg_food_check),
      //   all_data: row
      // });
    }
    return row;
  }

  // Computed helper for calculated values
  function getCalculatedValue(fieldCode, year, label) {
    const row = getBanquetRowData(banquetData, year, label);
    const allFieldCodes = computedBanquetFields.value.map(f => f.code);
    const context = {
      projectName: selectedProject.value?.project_name,
      calculationCache,
      year,
      label
    };
    switch (fieldCode) {
      case 'food':
        return calcFood(row, context);
      case 'liquor':
        return calcLiquor(row, context);
      case 'soft_drinks':
        return calcSoftDrinks(row, context);
      case 'hall_space_charges':
        return calcHallSpaceCharges(row, context);
      case 'gross':
        return calcGross(row, allFieldCodes, context);
      case 'net_amount':
        return calcNetAmount(row, allFieldCodes, context);
      case 'amount_per_event':
        return calcAmountPerEvent(row, context);
      case 'amount_per_pax':
        return calcAmountPerPax(row, context);
      case 'avg_pax_per_event':
        return calcAvgPaxPerEvent(row, context);
      default:
        return 0;
    }
  }

  function getBanquetCellValue(banquetData, fieldCode, year, label, displayMode = 'monthly') {
    const row = getBanquetRowData(banquetData, year, label);
    const allFieldCodes = computedBanquetFields.value.map(f => f.code);
    const context = {
      projectName: selectedProject.value?.project_name,
      calculationCache,
      year,
      label
    };
    
    // Check cache first for calculated fields
    if (['food', 'liquor', 'soft_drinks', 'hall_space_charges', 'gross', 'net_amount', 'amount_per_event', 'amount_per_pax', 'avg_pax_per_event'].includes(fieldCode)) {
      if (context.projectName && context.calculationCache) {
        const cached = context.calculationCache.getValue(context.projectName, 'Banquet Revenue Assumptions', fieldCode, context.year, context.label);
        if (cached !== undefined && cached !== null && cached > 0) {
          return cached;
        }
      }
    }
    
    let value;
    switch (fieldCode) {
      case 'food':
        value = calcFood(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Food', context.year, context.label, value);
        }
        break;
      case 'liquor':
        value = calcLiquor(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Liquor', context.year, context.label, value);
        }
        break;
      case 'soft_drinks':
        value = calcSoftDrinks(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Soft Drinks', context.year, context.label, value);
        }
        break;
      case 'hall_space_charges':
        value = calcHallSpaceCharges(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Hall Space Charges', context.year, context.label, value);
        }
        break;
      case 'gross':
        value = calcGross(row, allFieldCodes);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Gross', context.year, context.label, value);
        }
        break;
      case 'net_amount':
        value = calcNetAmount(row, allFieldCodes);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Net Amount', context.year, context.label, value);
        }
        break;
      case 'amount_per_event':
        value = calcAmountPerEvent(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Amount Per Event', context.year, context.label, value);
        }
        break;
      case 'amount_per_pax':
        value = calcAmountPerPax(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Amount Per Pax', context.year, context.label, value);
        }
        break;
      case 'avg_pax_per_event':
        value = calcAvgPaxPerEvent(row);
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', 'Avg Pax Per Event', context.year, context.label, value);
        }
        break;
      default:
        value = getAmountForBanquet(banquetData, fieldCode, year, label, displayMode);
        // Cache custom fields like Outside Service Food Catering, Outside Service Beverage Catering,
        // Tobacco, Non F&B, Others, and any other banquet details
        if (context.projectName && context.calculationCache && context.year && context.label && value > 0) {
          // Check if this is a field that should be cached
          if (['outside_service_food_catering', 'outside_service_beverage_catering', 'tobacco', 'non_fnb', 'others'].includes(fieldCode) || 
              fieldCode.toLowerCase().includes('outside') || 
              fieldCode.toLowerCase().includes('catering') ||
              fieldCode.toLowerCase().includes('tobacco') ||
              fieldCode.toLowerCase().includes('non') ||
              fieldCode.toLowerCase().includes('fnb') ||
              fieldCode.toLowerCase().includes('others') ||
              // Cache any other custom banquet details
              customBanquetFields.value.some(f => f.code === fieldCode)) {
            context.calculationCache.setValue(context.projectName, 'Banquet Revenue Assumptions', fieldCode, context.year, context.label, value);
          }
        }
    }
    return value;
  }

  // Helper function to calculate totals by summing individual cell values
  function calculateBanquetTotal(banquetData, fieldCode, year, displayMode) {
    const labels = getColumnLabelsForYearLocal(year);
    let total = 0;
    
    for (const label of labels) {
      total += getBanquetCellValue(banquetData, fieldCode, year, label, displayMode);
    }
    
    return total;
  }

  async function deleteBanquetDetail(field) {
    // If it's a custom field (from backend)
    if (customBanquetFields.value.some(f => f.code === field.code)) {
      if (!confirm('Are you sure you want to delete this custom banquet detail? This action cannot be undone.')) return;
      try {
        await fetch(`/api/resource/Banquet Details/${field.code}`, { method: 'DELETE' });
        await fetchBanquetDetails();
        alertService.success('Banquet detail deleted');
      } catch (err) {
        alertService.error('Failed to delete banquet detail');
      }
    } else {
      // Default field: just filter it out for this session
      removedDefaultFields.value.push(field.code);
    }
  }

  function resetToDefault() {
    removedDefaultFields.value = [];
    alertService.success('Default fields have been restored.');
  }

  const computedBanquetFields = computed(() => {
    // Insert fetched banquet details above 'others', and filter out removed fields
    const idx = BANQUET_FIELDS.findIndex(f => f.code === 'others');
    const filteredDefaults = BANQUET_FIELDS.filter(f => !removedDefaultFields.value.includes(f.code));
    const filteredCustoms = customBanquetFields.value.filter(f => !removedDefaultFields.value.includes(f.code));
    if (idx === -1) return [...filteredDefaults, ...filteredCustoms];
    return [
      ...filteredDefaults.slice(0, idx),
      ...filteredCustoms,
      ...filteredDefaults.slice(idx)
    ];
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
  