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
                        <option v-for="year in years" :key="'to-' + year" :value="year">{{ year }}</option>
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
                  <button
                    @click="showLaundryDetails = true"
                    class="w-full flex items-center justify-left gap-2 px-3 py-2.5 bg-white border border-blue-500 text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200 text-sm font-medium mt-2"
                  >
                    <FolderOpen class="w-4 h-4" />
                    Laundry Assumptions
                  </button>
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
              <!-- Laundry Table -->
              <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Laundry</h2>
              </div>
  
                <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Table Header -->
                        <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <tr>
                            <th rowspan="2" class="px-3 py-2 text-left border-r font-semibold text-sm w-[300px]">
                              <div class="flex items-center gap-1">
                                <FolderOpen class="w-3 h-3" />
                                Details
                              </div>
                            </th>
                          <th
                            v-for="year in visibleYears"
                            :key="'header-' + year"
                            :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                              class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-blue-700 transition-all duration-200 group text-sm"
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
                          <tr class="bg-blue-500/90 text-xs">
                          <template v-for="year in visibleYears" :key="'months-' + year">
                            <template v-if="!isYearCollapsed(year)">
                                                              <th
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="year + '-' + label"
                                  class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-medium text-xs"
                                >
                                  {{ label }}
                                </th>
                                                                <th class="px-2 py-1 text-center border border-blue-300 min-w-[110px] font-semibold text-xs">
                                  <div class="flex items-center justify-center gap-1">
                                    Forecast
                                  </div>
                                </th>
                              </template>
                              <template v-else>
                                <th class="px-2 py-1 text-center border border-blue-300 min-w-[110px] font-semibold text-xs">
                                <div class="flex items-center justify-center gap-1">
                                  Forecast
                                </div>
                              </th>
                            </template>
                          </template>
                        </tr>
                      </thead>
                      <tbody class="text-gray-700 bg-white text-sm">
                          <template v-for="(field, idx) in laundryFields" :key="field.code">
                            <tr v-if="field.label === 'COST OF LAUNDRY'">
                              <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)"
                                  class="bg-blue-100 text-blue-900 font-bold text-left px-3 py-2 border-t-2 border-b-2 border-blue-300 uppercase tracking-wider">
                                {{ field.label }}
                              </td>
                            </tr>
                            <tr v-else class="transition-all duration-200 border-b border-gray-100 even:bg-gray-50 hover:bg-blue-50">
                              <td class="px-3 py-2 font-medium border-r text-gray-600 w-[300px]">
                                {{ field.label }}
                              </td>
                              <template v-for="year in visibleYears" :key="'row-' + year + '-' + field.code">
                                <template v-if="!isYearCollapsed(year)">
                                                                    <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'cell-editable-' + year + '-' + label"
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-w-[100px]"
                                    @input="handleOODCellInput({ year, label, field: field.code, event: $event, oodData: laundryData })"
                                    @focus="handleOODCellFocus({ year, label, field: field.code, event: $event })"
                                    @blur="handleCellEditWrapper({ year, label, field: field.code, event: $event })"
                                  >
                                    <span class="font-mono text-xs">{{ formatOODValue(field.code, getOODCellValue(laundryData, field.code, year, label, advancedModes[year] || displayMode)) }}</span>
                                  </td>
                                                                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50 min-w-[110px]">
                                    <span class="font-mono text-xs text-blue-700">
                                      {{ formatOODValue(field.code, calculateTotalForOOD(laundryData, field.code, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50 min-w-[110px]">
                                    <span class="font-mono text-xs text-blue-700">
                                      {{ formatOODValue(field.code, calculateTotalForOOD(laundryData, field.code, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
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
              </div>

              <!-- Health Club Table -->
              <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Health Club</h2>
                </div>
                
                <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
                  <div class="overflow-x-auto">
                    <div class="min-w-full w-max">
                      <table class="w-full">
                        <!-- Table Header -->
                        <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
                          <tr>
                            <th rowspan="2" class="px-3 py-2 text-left border-r font-semibold text-sm w-[300px]">
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
                                  class="bg-green-100 text-green-900 font-bold text-left px-3 py-2 border-t-2 border-b-2 border-green-300 uppercase tracking-wider">
                                {{ field.label }}
                              </td>
                            </tr>
                            <!-- Normal Data Rows -->
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
                                      @input="handleOODCellInput({ year, label, field: field.code, event: $event, oodData: healthClubData })"
                                      @focus="handleOODCellFocus({ year, label, field: field.code, event: $event })"
                                      @blur="handleCellEditWrapper({ year, label, field: field.code, event: $event })"
                                    >
                                      <span :class="[
                                        'font-mono text-xs',
                                        isTotalField(field.code) ? 'text-green-800 font-semibold' : ''
                                      ]">{{ formatOODValue(field.code, getOODCellValue(healthClubData, field.code, year, label, advancedModes[year] || displayMode)) }}</span>
                                    </td>
                                    <td
                                      contenteditable="true"
                                      :class="[
                                        'px-2 py-1 text-right border border-green-200 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200',
                                        isTotalField(field.code)
                                          ? 'bg-green-100 hover:bg-green-200 font-semibold'
                                          : 'hover:bg-green-50'
                                      ]"
                                      @input="handleOODCellInput({ year, label, field: field.code + '_pct', event: $event, oodData: healthClubData })"
                                      @focus="handleOODCellFocus({ year, label, field: field.code + '_pct', event: $event })"
                                      @blur="handleCellEditWrapper({ year, label, field: field.code + '_pct', event: $event })"
                                    >
                                      <span :class="[
                                        'font-mono text-xs',
                                        isTotalField(field.code) ? 'text-green-800 font-semibold' : ''
                                      ]">{{ formatOODValue(field.code + '_pct', getOODCellValue(healthClubData, field.code + '_pct', year, label, advancedModes[year] || displayMode)) }}</span>
                                    </td>
                                  </template>
                                  <td :class="[
                                    'px-2 py-1 text-right border border-green-200 font-semibold',
                                    isTotalField(field.code) ? 'bg-green-200' : 'bg-green-50'
                                  ]">
                                    <span :class="[
                                      'font-mono text-xs',
                                      isTotalField(field.code) ? 'text-green-900 font-bold' : 'text-green-700'
                                    ]">
                                      {{ formatOODValue(field.code, calculateTotalForOOD(healthClubData, field.code, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
                                    </span>
                                  </td>
                                  <td :class="[
                                    'px-2 py-1 text-right border border-green-200 font-semibold',
                                    isTotalField(field.code) ? 'bg-green-200' : 'bg-green-50'
                                  ]">
                                    <span :class="[
                                      'font-mono text-xs',
                                      isTotalField(field.code) ? 'text-green-900 font-bold' : 'text-green-700'
                                    ]">
                                      {{ formatOODValue(field.code + '_pct', calculateTotalForOOD(healthClubData, field.code + '_pct', year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td :class="[
                                    'px-2 py-1 text-right border border-green-200 font-semibold',
                                    isTotalField(field.code) ? 'bg-green-200' : 'bg-green-50'
                                  ]">
                                    <span :class="[
                                      'font-mono text-xs',
                                      isTotalField(field.code) ? 'text-green-900 font-bold' : 'text-green-700'
                                    ]">
                                      {{ formatOODValue(field.code, calculateTotalForOOD(healthClubData, field.code, year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
                                    </span>
                                  </td>
                                  <td :class="[
                                    'px-2 py-1 text-right border border-green-200 font-semibold',
                                    isTotalField(field.code) ? 'bg-green-200' : 'bg-green-50'
                                  ]">
                                    <span :class="[
                                      'font-mono text-xs',
                                      isTotalField(field.code) ? 'text-green-900 font-bold' : 'text-green-700'
                                    ]">
                                      {{ formatOODValue(field.code + '_pct', calculateTotalForOOD(healthClubData, field.code + '_pct', year, advancedModes[year] || displayMode, getColumnLabelsForYearLocal)) }}
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
  
  <!-- Laundry Details Modal -->
  <transition name="fade">
    <div
      v-if="showLaundryDetails"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-blue-200 w-[99%] max-w-5xl p-0">
        <!-- Modal Header -->
        <div class="flex items-center gap-4 px-12 py-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-3xl">
          <Settings class="w-7 h-7 text-white" />
          <h2 class="text-2xl font-bold text-white tracking-wide">Laundry Assumptions</h2>
        </div>
        <!-- Modal Body -->
        <div class="p-10 pt-8 bg-blue-50/30">
          <div class="overflow-x-auto">
            <table class="min-w-full w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th class="text-left text-base font-semibold text-blue-900 pb-2 pl-2">Detail</th>
                  <th class="text-center text-base font-semibold text-blue-900 pb-2">Number</th>
                  <th class="text-center text-base font-semibold text-blue-900 pb-2">Percentage</th>
                  <th class="text-center text-base font-semibold text-blue-900 pb-2">Base</th>
                  <th class="text-center text-base font-semibold text-blue-900 pb-2">Average Amount</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="field in laundryFields" :key="'laundry-detail-' + field.code">
                  <tr v-if="field.label === 'COST OF LAUNDRY'">
                    <td colspan="5" class="bg-blue-100 text-blue-900 font-bold text-left px-4 py-3 border-t-2 border-b-2 border-blue-300 uppercase tracking-wider rounded-xl">
                      {{ field.label }}
                    </td>
                  </tr>
                  <tr v-else class="bg-white hover:bg-blue-100 transition-all border border-blue-100 rounded-xl shadow-sm">
                    <td class="py-3 px-4 font-medium text-blue-800 rounded-l-xl">{{ field.label }}</td>
                    <td class="py-3 px-2 text-center">
                      <input
                        type="number"
                        v-model="laundryDetailsModalData[field.code + '_number']"
                        class="px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 w-28 text-sm bg-blue-50/50"
                        placeholder="0"
                      />
                    </td>
                    <td class="py-3 px-2 text-center">
                      <input
                        type="number"
                        v-model="laundryDetailsModalData[field.code + '_percentage']"
                        class="px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 w-28 text-sm bg-blue-50/50"
                        placeholder="0%"
                      />
                    </td>
                    <td class="py-3 px-2 text-center">
                      <select
                        v-model="laundryDetailsModalData[field.code + '_base']"
                        class="px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 w-32 text-sm bg-blue-50/50"
                      >
                        <option disabled value="">Select a base</option>
                        <option value="per_day">per day</option>
                        <option value="per_week">per week</option>
                      </select>
                    </td>
                    <td class="py-3 px-2 text-center rounded-r-xl">
                      <input
                        type="number"
                        v-model="laundryDetailsModalData[field.code + '_amount']"
                        class="px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400 w-32 text-sm bg-blue-50/50"
                        placeholder="0.00"
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Modal Footer -->
        <div class="flex justify-end gap-4 px-12 py-6 bg-blue-50 border-t border-blue-100 rounded-b-3xl">
          <button
            @click="cancelLaundryDetails"
            class="px-5 py-2.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 text-base font-medium shadow-sm"
          >
            <X class="w-5 h-5" />
            Cancel
          </button>
          <button
            @click="applyLaundryDetails"
            class="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-base font-semibold shadow-md"
          >
            <Check class="w-5 h-5" />
            Apply
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
  calculateTotalForOOD,
  handleOODCellEdit,
  handleOODCellInput,
  handleOODCellFocus,
  loadOODData, 
  saveOODChanges,
  convertOODServerDataToFrontend, 
  toNum,
  toggleCollapse as toggleCollapseUtil,
  loadYearOptions,
  isYearCollapsed as isYearCollapsedUtil
} from "@/components/utility/ood_data/index.js";
  import { cloneDeep } from 'lodash-es';
  
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
  const showLaundryDetails = ref(false);
  const laundryDetailsModalData = ref({});

  // Pinia store for year settings
  const yearSettingsStore = useYearSettingsStore();
  const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
  const { setFromYear, setToYear, setAdvancedModes, clearYearSettings } = yearSettingsStore;

  // Computed properties
  const visibleYears = computed(() => {
    return getVisibleYears(fromYear.value, toYear.value);
  });

  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    return getColumnLabels(advancedModes.value[year] || displayMode.value);
  };
  
  // Computed properties for table fields
  const laundryFields = computed(() => {
    return LAUNDRY_FIELDS.map(field => ({
      ...field,
      number: ref(0),
      percentage: ref(0),
      base: ref(0)
    }));
  });

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
        const loaded = await loadOODData(selectedProject.value.project_name) || {};
        const converted = convertOODServerDataToFrontend(loaded);
        Object.assign(laundryData, converted.laundry || {});
        Object.assign(healthClubData, converted.health_club || {});
      } else {
        laundryData.value = { status: 'no_project_selected', message: 'No project selected' };
        healthClubData.value = { status: 'no_project_selected', message: 'No project selected' };
      }
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
      isSaved.value = true;
      isComponentReady.value = true;
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  

  // Watch for project changes and reload data
  watch(selectedProject, async (newProject, oldProject) => {
    if (newProject) {
      try {
        // Reload OOD data for the new project
        const loaded = await loadOODData(newProject.project_name) || {};
        const converted = convertOODServerDataToFrontend(loaded);
        
        // Separate laundry and health club data
        Object.assign(laundryData, converted.laundry || {});
        Object.assign(healthClubData, converted.health_club || {});
        
        originalLaundryData.value = cloneDeep(laundryData);
        originalHealthClubData.value = cloneDeep(healthClubData);
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        saveError.value = "";
        
        alertService.success(`Switched to project: ${newProject.project_name}`);
      } catch (error) {
        console.error('Error reloading OOD data for new project:', error);
        alertService.error("Failed to load project data. Please try again.");
      }
    } else {
      // Clear data when no project is selected
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
      
      // Prepare changes for API
      const changes = changedCells.value.map(cell => ({
        year: cell.year,
        month: cell.label,
        field: cell.field,
        amount: cell.newValue
      }));
      
      if (changes.length === 0) {
        isSaving.value = false;
        return;
      }
      
      const result = await saveOODChanges(changes, selectedProject.value?.project_name);
      
      // Reload from backend after save
      const loaded = await loadOODData(selectedProject.value?.project_name) || {};
      const converted = convertOODServerDataToFrontend(loaded);
      
      // Separate laundry and health club data
      Object.assign(laundryData, converted.laundry || {});
      Object.assign(healthClubData, converted.health_club || {});
      
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
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
  
  // Refresh table functionality
  async function refreshTable() {
    try {
      const loaded = await loadOODData(selectedProject.value?.project_name) || {};
      const converted = convertOODServerDataToFrontend(loaded);
      
      // Separate laundry and health club data
      Object.assign(laundryData, converted.laundry || {});
      Object.assign(healthClubData, converted.health_club || {});
      
      originalLaundryData.value = cloneDeep(laundryData);
      originalHealthClubData.value = cloneDeep(healthClubData);
      changedCells.value = [];
      isSaved.value = true;
      alertService.success("Page refreshed successfully");
    } catch (error) {
      console.error("Error refreshing table:", error);
      alertService.error("Failed to refresh data. Please try again.");
    }
  }

  function getOODCellValue(oodData, fieldCode, year, label, displayMode = 'monthly') {
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

  // Handle base change for laundry fields
  function handleBaseChange(fieldCode, value) {
    // Store the base value for the field
    if (!laundryData.static) laundryData.static = {};
    if (!laundryData.static.base) laundryData.static.base = {};
    laundryData.static.base[fieldCode] = value;
    
    // Mark as unsaved
    isSaved.value = false;
  }

  // Get base value for a field
  function getBaseValue(fieldCode) {
    return laundryData?.static?.base?.[fieldCode] || '';
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

  // Open modal and populate modal data from laundryData
  function openLaundryDetails() {
    laundryDetailsModalData.value = {};
    laundryFields.value.forEach(field => {
      laundryDetailsModalData.value[field.code + '_number'] = laundryData?.static?.number?.[field.code] || '';
      laundryDetailsModalData.value[field.code + '_percentage'] = laundryData?.static?.percentage?.[field.code] || '';
      laundryDetailsModalData.value[field.code + '_base'] = laundryData?.static?.base?.[field.code] || '';
      laundryDetailsModalData.value[field.code + '_amount'] = laundryData?.static?.amount?.[field.code] || '';
    });
    showLaundryDetails.value = true;
  }

  // Watch for modal open
  watch(showLaundryDetails, (val) => {
    if (val) openLaundryDetails();
  });

  function cancelLaundryDetails() {
    showLaundryDetails.value = false;
  }

  function applyLaundryDetails() {
    if (!laundryData.static) laundryData.static = {};
    if (!laundryData.static.number) laundryData.static.number = {};
    if (!laundryData.static.percentage) laundryData.static.percentage = {};
    if (!laundryData.static.base) laundryData.static.base = {};
    if (!laundryData.static.amount) laundryData.static.amount = {};
    laundryFields.value.forEach(field => {
      laundryData.static.number[field.code] = laundryDetailsModalData.value[field.code + '_number'];
      laundryData.static.percentage[field.code] = laundryDetailsModalData.value[field.code + '_percentage'];
      laundryData.static.base[field.code] = laundryDetailsModalData.value[field.code + '_base'];
      laundryData.static.amount[field.code] = laundryDetailsModalData.value[field.code + '_amount'];
    });
    isSaved.value = false;
    showLaundryDetails.value = false;
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
  