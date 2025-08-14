<template>
    <div class="flex">
      <Sidebar />
  
      <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
        <!-- Main Content Area -->
        <div class="relative p-4">
          <!-- Top Filters and Controls -->
          <div v-if="visibleYears.length" class="absolute top-4 left-4 z-30 w-[860px] max-w-[95vw] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-violet-200/60 shadow-2xl ring-1 ring-violet-300/30">
            <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 class="text-xl font-bold">Reports</h1>
                  <p class="text-xs opacity-80">Manage and configure your reports</p>
                </div>
              </div>
              <!-- Collapse/Expand Button (collapses upward) -->
              <button 
                @click="sidebarCollapsed = !sidebarCollapsed" 
                class="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all"
              >
                <ChevronUp v-if="!sidebarCollapsed" class="w-5 h-5 text-white" />
                <ChevronDown v-else class="w-5 h-5 text-white" />
                <span class="text-sm font-medium">{{ sidebarCollapsed ? 'Expand' : 'Collapse' }}</span>
              </button>
            </div>
  
            <transition name="fade">
              <div v-show="!sidebarCollapsed" class="px-5 pb-5 bg-white/70">
                
                
                <!-- Action Buttons Section -->
                <div class="mb-4 pt-4">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Quick Actions
                  </h3>              
                  <div class="flex gap-2">
                    <button 
                      @click="refreshTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <RefreshCw class="w-4 h-4" />
                      Refresh
                    </button>
                    <button 
                      @click="exportTableData"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <Download class="w-4 h-4" />
                      Export
                    </button>
                    <button 
                      @click="printTable"
                      class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm"
                    >
                      <Printer class="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
  
                <!-- Filters Section -->
                <div>
                  <div class="bg-white/90 rounded-xl p-5 border border-violet-100 shadow-sm">
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
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm"
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
                            class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm"
                          >
                            <option value="">Select Year</option>
                            <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                          </select>
                        </div>
                      </div>
  
                      <div class="flex gap-2">
                        <button 
                          @click="clearYearSelection" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/90 text-gray-700 border border-violet-200 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium shadow-sm"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Clear
                        </button>
                        <button 
                          @click="showAdvanced = true" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 text-sm font-medium shadow"
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
          <div class="p-0">
            <!-- No Project Selected State -->
            <div v-if="expenseData.status === 'no_project_selected'">
              <NoProjectSelectedState />
            </div>
  
            <!-- Error State -->
            <div v-else-if="expenseData.status === 'error'">
              <ErrorState :message="expenseData.message" @retry="refreshTable" />
            </div>
  
            <!-- Table Header with Stats -->
            <template v-else-if="visibleYears.length">
              <div class="mb-4">
                <!-- <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <Table class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Receipts & Payments Overview</h2>
                </div> -->
              </div>
  
              <!-- Modern Table Container -->
              <div class="bg-white mt-20 rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                <div class="overflow-x-auto max-w-[100%] md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Enhanced Table Header -->
                      <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                        <tr>
                          <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              Collections
                            </div>
                          </th>
                          <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              Collection %
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
                                  <BookOpen class="w-2 h-2" />
                                  Total
                                </div>
                              </th>
                            </template>
                            <template v-else>
                              <th class="px-2 py-1 text-center border border-violet-300 min-w-[110px] font-semibold">
                                <div class="flex items-center justify-center gap-1">
                                  <BookOpen class="w-2 h-2" />
                                  Total
                                </div>
                              </th>
                            </template>
                          </template>
                        </tr>
                      </thead>
  
                      <!-- Enhanced Table Body -->
                      <tbody class="text-gray-700 bg-white text-sm">
                        <!-- Dynamic Department Sections -->
                        <template v-for="(department, deptIndex) in departments" :key="'dept-' + deptIndex">
                          <!-- Department Header -->
                          <tr class="bg-gradient-to-r from-violet-600 to-violet-700 border-y-2 border-white">
                            <td colspan="2" class="px-3 py-3 font-extrabold text-white border-r border-violet-800">
                            <div class="flex items-center gap-2">
                              {{ department }}
                            </div>
                          </td>
                              <template v-for="year in visibleYears" :key="'dept-header-' + deptIndex + '-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'dept-header-cell-' + deptIndex + '-' + year + '-' + label"
                                    class="px-1 py-1 text-center border border-violet-500 bg-violet-600/30 text-white/90"
                                  ></td>
                                  <td class="px-1 py-1 text-center border border-violet-500 bg-violet-600/30"></td>
                                </template>
                                <template v-else>
                                  <td class="px-1 py-1 text-center border border-violet-500 bg-violet-600/30"></td>
                                </template>
                              </template>
                        </tr>
  
                        <!-- Revenue Sub-section -->
                        <tr class="bg-violet-100 border-b border-violet-200">
                          <td colspan="2" class="px-3 py-2 font-semibold text-violet-800 border-r border-violet-200">
                            <div class="flex items-center gap-2">
                              Revenue
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-revenue-subheader-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-revenue-subheader-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-1 py-1 text-center border border-violet-200 bg-violet-100"
                              ></td>
                              <td class="px-1 py-1 text-center border border-violet-200 bg-violet-100"></td>
                            </template>
                            <template v-else>
                              <td class="px-1 py-1 text-center border border-violet-200 bg-violet-100"></td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Total monthly Department Revenue -->
                        <tr class="bg-violet-50 border-b border-violet-200">
                          <td colspan="2" class="px-3 py-2 font-medium border-r border-violet-200">
                            <div class="flex items-center gap-1">
                              Total monthly {{ department }} Revenue
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-revenue-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-revenue-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getDepartmentMonthlyRevenue(department, year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getDepartmentYearTotal(department, year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getDepartmentYearTotal(department, year)) }}</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Collection - 80% in the month of Revenue -->
                        <tr class="bg-violet-50 border-b border-violet-200">
                          <td class="px-3 py-2 font-medium border-r border-violet-200">
                            <div class="flex items-center gap-1">
                              Collection- {{ collectionPercentages[getDeptKey(department)].month.toFixed(0) }}% in the month of Revenue
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
                          contenteditable="true" 
                          @keypress="allowOnlyNumbers($event)" 
                          @input="updateCollectionPercentage(getDeptKey(department), 'month', $event)" 
                          @focus="handleCollectionPercentageFocus({ type: getDeptKey(department), period: 'month', event: $event })" 
                          @blur="handleCollectionPercentageEdit({ type: getDeptKey(department), period: 'month', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ collectionPercentages[getDeptKey(department)].month.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-collection-80-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-collection-80-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getCollectionValue(department, year, label, 'sameMonth')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getCollectionTotal(department, year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getCollectionTotal(department, year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Collection - 15% in the month following Revenue -->
                        <tr class="bg-violet-50 border-b border-violet-200">
                          <td class="px-3 py-2 font-medium border-r border-violet-200">
                            <div class="flex items-center gap-1">
                              Collection- {{ collectionPercentages[getDeptKey(department)].following.toFixed(0) }}% in the month following Revenue
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
                          contenteditable="true" 
                          @keypress="allowOnlyNumbers($event)" 
                          @input="updateCollectionPercentage(getDeptKey(department), 'following', $event)" 
                          @focus="handleCollectionPercentageFocus({ type: getDeptKey(department), period: 'following', event: $event })" 
                          @blur="handleCollectionPercentageEdit({ type: getDeptKey(department), period: 'following', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ collectionPercentages[getDeptKey(department)].following.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-collection-15-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-collection-15-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-200 bg-violet-100"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getCollectionValue(department, year, label, 'following')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getCollectionTotal(department, year, 'following')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getCollectionTotal(department, year, 'following')) }}</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Collection - 5% in the Second month following Revenue -->
                        <tr class="bg-violet-50 border-b border-violet-200">
                          <td class="px-3 py-2 font-medium border-r border-violet-200">
                            <div class="flex items-center gap-1">
                              Collection- {{ collectionPercentages[getDeptKey(department)].second.toFixed(0) }}% in the Second month following Revenue
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" 
                          contenteditable="true" 
                          @keypress="allowOnlyNumbers($event)" 
                          @input="updateCollectionPercentage(getDeptKey(department), 'second', $event)" 
                          @focus="handleCollectionPercentageFocus({ type: getDeptKey(department), period: 'second', event: $event })" 
                          @blur="handleCollectionPercentageEdit({ type: getDeptKey(department), period: 'second', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ collectionPercentages[getDeptKey(department)].second.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-collection-5-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-collection-5-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getCollectionValue(department, year, label, 'second')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">{{ formatMoney(getCollectionTotal(department, year, 'second')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                                <span class="font-mono text-xs text-violet-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Cash Inflow -->
                        <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              Cash Inflow
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-cash-inflow-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-cash-inflow-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getCollectionValue(department, year, label, 'cashInflow')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">{{ formatMoney(getCollectionTotal(department, year, 'cashInflow')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Department Accounts Receivables -->
                        <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              {{ department }} Accounts Receivables
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-accounts-receivables-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-accounts-receivables-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getARValue(department, year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">{{ formatMoney(getARTotal(department, year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payments Sub-section -->
                        <tr class="bg-red-100 border-b border-red-200">
                          <td colspan="2" class="px-3 py-2 font-semibold text-red-800 border-r border-red-200">
                            <div class="flex items-center gap-2">
                              Payments
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-payments-subheader-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-payments-subheader-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-1 py-1 text-center border border-red-200 bg-red-100"
                              ></td>
                              <td class="px-1 py-1 text-center border border-red-200 bg-red-100"></td>
                            </template>
                            <template v-else>
                              <td class="px-1 py-1 text-center border border-red-200 bg-red-100"></td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Net Salary & Wages -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td colspan="2" class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                              Net Salary & Wages
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-salary-wages-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-salary-wages-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                                contenteditable="true"
                                @keypress="allowOnlyNumbers($event)"
                                @input="handlePaymentBaseInput(department, 'salary', year, label, $event)"
                                @blur="handlePaymentBaseBlur(department, 'salary', year, label, $event)"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentBaseValue(department, 'salary', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentBaseTotal(department, 'salary', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 80% in the month of Payroll run -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].salary.month.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" 
                          contenteditable="true" 
                          @keypress="allowOnlyNumbers($event)" 
                          @input="updatePaymentPercentage(getDeptKey(department), 'salary', 'month', $event)" 
                          @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'salary', period: 'month', event: $event })" 
                          @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'salary', period: 'month', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ (paymentPercentages[getDeptKey(department)].salary.month || 0).toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-salary-payment-80-' + deptIndex + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-salary-payment-80-cell-' + deptIndex + '-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'salary', year, label, 'sameMonth')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'salary', year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 15% in the month of Payroll run (Salary & Wages) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].salary.following.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'salary', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'salary', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'salary', period: 'following', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].salary.following.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-salary-payment-15-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-salary-payment-15-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'salary', year, label, 'following')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'salary', year, 'following')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 5% in the month of Payroll run (Salary & Wages) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].salary.second.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'salary', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'salary', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'salary', period: 'second', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].salary.second.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-salary-payment-5-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-salary-payment-5-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'salary', year, label, 'second')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'salary', year, 'second')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Cash Outflow (Salary & Wages) -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              Cash Outflow
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-salary-cash-outflow-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-salary-cash-outflow-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'salary', year, label, 'cashOutflow')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentTotal(department, 'salary', year, 'cashOutflow')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- {{ department }} Net Salaries & Wages Payables -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              {{ department }} Net Salaries & Wages Payables
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-salary-payables-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-salary-payables-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesValue(department, 'salary', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesTotal(department, 'salary', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Bonus -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td colspan="2" class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                              Bonus
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-bonus-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-bonus-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                                contenteditable="true"
                                @keypress="allowOnlyNumbers($event)"
                                @input="handlePaymentBaseInput(department, 'bonus', year, label, $event)"
                                @blur="handlePaymentBaseBlur(department, 'bonus', year, label, $event)"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentBaseValue(department, 'bonus', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentBaseTotal(department, 'bonus', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 80% in the month of Payroll run (Bonus) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].bonus.month.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'bonus', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'bonus', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'bonus', period: 'month', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].bonus.month.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-bonus-payment-80-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-bonus-payment-80-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'bonus', year, label, 'sameMonth')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'bonus', year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 15% in the month of Payroll run (Bonus) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].bonus.following.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'bonus', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'bonus', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'bonus', period: 'following', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].bonus.following.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-bonus-payment-15-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-bonus-payment-15-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'bonus', year, label, 'following')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'bonus', year, 'following')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 5% in the month of Payroll run (Bonus) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].bonus.second.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'bonus', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'bonus', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'bonus', period: 'second', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].bonus.second.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'dept-' + deptIndex + '-bonus-payment-5-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'dept-' + deptIndex + '-bonus-payment-5-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'bonus', year, label, 'second')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'bonus', year, 'second')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Cash Outflow (Bonus) -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              Cash Outflow
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-bonus-cash-outflow-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-bonus-cash-outflow-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'bonus', year, label, 'cashOutflow')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentTotal(department, 'bonus', year, 'cashOutflow')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- {{ department }} Bonus Payables -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              {{ department }} Bonus Payables
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-bonus-payables-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-bonus-payables-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesValue(department, 'bonus', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesTotal(department, 'bonus', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payroll Related -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td colspan="2" class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                              Payroll Related
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-related-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-related-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                                contenteditable="true"
                                @keypress="allowOnlyNumbers($event)"
                                @input="handlePaymentBaseInput(department, 'payroll', year, label, $event)"
                                @blur="handlePaymentBaseBlur(department, 'payroll', year, label, $event)"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentBaseValue(department, 'payroll', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentBaseTotal(department, 'payroll', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 80% in the month of Payroll run (Payroll Related) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].payroll.month.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'payroll', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'payroll', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'payroll', period: 'month', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].payroll.month.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-payment-80-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-payment-80-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'payroll', year, label, 'sameMonth')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'payroll', year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 15% in the month of Payroll run (Payroll Related) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].payroll.following.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'payroll', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'payroll', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'payroll', period: 'following', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].payroll.following.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-payment-15-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-payment-15-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'payroll', year, label, 'following')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'payroll', year, 'following')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 5% in the month of Payroll run (Payroll Related) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].payroll.second.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'payroll', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'payroll', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'payroll', period: 'second', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].payroll.second.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-payment-5-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-payment-5-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'payroll', year, label, 'second')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'payroll', year, 'second')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Cash Outflow (Payroll Related) -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              Cash Outflow
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-cash-outflow-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-cash-outflow-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'payroll', year, label, 'cashOutflow')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentTotal(department, 'payroll', year, 'cashOutflow')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- {{ department }} Payroll Related Payables -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              {{ department }} Payroll Related Payables
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-payroll-payables-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-payroll-payables-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesValue(department, 'payroll', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesTotal(department, 'payroll', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Expenses -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td colspan="2" class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                              Expenses
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                                contenteditable="true"
                                @keypress="allowOnlyNumbers($event)"
                                @input="handlePaymentBaseInput(department, 'expenses', year, label, $event)"
                                @blur="handlePaymentBaseBlur(department, 'expenses', year, label, $event)"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentBaseValue(department, 'expenses', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentBaseTotal(department, 'expenses', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 80% in the month of Payroll run (Expenses) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].expenses.month.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'expenses', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'expenses', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'expenses', period: 'month', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].expenses.month.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-payment-80-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-payment-80-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'expenses', year, label, 'sameMonth')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'expenses', year, 'sameMonth')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 15% in the month of Payroll run (Expenses) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].expenses.following.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'expenses', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'expenses', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'expenses', period: 'following', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].expenses.following.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-payment-15-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-payment-15-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'expenses', year, label, 'following')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'expenses', year, 'following')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Payment - 5% in the month of Payroll run (Expenses) -->
                        <tr class="bg-red-50 border-b border-red-200">
                          <td class="px-3 py-2 font-medium border-r border-red-200">
                            <div class="flex items-center gap-1">
                             Payment- {{ paymentPercentages[getDeptKey(department)].expenses.second.toFixed(0) }}% in the month of Payroll run
                            </div>
                          </td>
                          <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @keypress="allowOnlyNumbers($event)" @input="updatePaymentPercentage(getDeptKey(department), 'expenses', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: getDeptKey(department), category: 'expenses', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: getDeptKey(department), category: 'expenses', period: 'second', event: $event })">
                            <div class="flex items-center justify-end gap-1">
                              <span class="font-mono text-xs">{{ paymentPercentages[getDeptKey(department)].expenses.second.toFixed(2) }}%</span>
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-payment-5-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-payment-5-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-200 bg-red-50"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'expenses', year, label, 'second')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">{{ formatMoney(getPaymentTotal(department, 'expenses', year, 'second')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                                <span class="font-mono text-xs text-red-700">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- Cash Outflow (Expenses) -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              Cash Outflow
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-cash-outflow-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-cash-outflow-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentValue(department, 'expenses', year, label, 'cashOutflow')) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPaymentTotal(department, 'expenses', year, 'cashOutflow')) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
  
                        <!-- {{ department }} Expenses Payables -->
                        <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                          <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                            <div class="flex items-center gap-1 justify-end">
                              {{ department }} Expenses Payables
                            </div>
                          </td>
                          <template v-for="year in visibleYears" :key="'rooms-expenses-payables-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td
                                v-for="label in getColumnLabelsForYearLocal(year)"
                                :key="'rooms-expenses-payables-cell-' + year + '-' + label"
                                class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                              >
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesValue(department, 'expenses', year, label)) }}</span>
                              </td>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">{{ formatMoney(getPayablesTotal(department, 'expenses', year)) }}</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                                <span class="font-mono text-xs">0.00</span>
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
              <NoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
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
              <AlertTriangle class="w-4 h-4 text-red-600" />
              <span class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure advanced settings.</span>
            </div>
  
            <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
              <div
                v-for="year in visibleYears"
                :key="'adv-' + year"
                class="flex justify-between items-center border-b pb-2"
              >
                <span class="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar class="w-3 h-3 text-gray-500" />
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
              <Check class="w-4 h-4 text-green-600" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </transition>
  </template>
    
  
  
  
  <script setup>
  // ============================================================================
  // IMPORTS
  // ============================================================================
  import { ref, onMounted, computed, watch, onUnmounted } from "vue";
  import { storeToRefs } from 'pinia';
  import { cloneDeep } from 'lodash-es';
  
  // Store imports
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
  
  // Component imports
  import Sidebar from "@/components/ui/Sidebar.vue";
  import NoProjectSelectedState from '@/components/ui/expense/NoProjectSelectedState.vue';
  import ErrorState from '@/components/ui/expense/ErrorState.vue';
  import NoYearsSelectedState from '@/components/ui/reports/NoYearsSelectedState.vue';
  
  // Icon imports
  import { 
    AlertTriangle, 
    BookOpen, 
    Table, 
    Download, 
    Printer,
    RefreshCw, 
    FolderOpen, 
    Receipt, 
    Tag, 
    ChevronDown, 
    ChevronRight, 
    ChevronLeft, 
    ChevronUp,
    Hash, 
    Calendar, 
    ArrowLeft, 
    Settings, 
    X, 
    Check, 
    PlusCircle,  
    Trash2, 
    DollarSign, 
    Percent,
    CircleAlert,
    AlertCircle,
    Save,
    Loader2
  } from 'lucide-vue-next';
  
  // Service imports
  import alertService from "@/components/ui/ui_utility/alertService.js";
  
  // Utility imports
  import {
    // Core calculations
    getVisibleYears,
    getColumnLabels,
    
    // Data loading and API services
    loadYearOptions,
    
    // Table display and interaction
    toggleCollapse,
    isYearCollapsed,
    
    // Filter and validation utilities
    months,
  } from "@/components/utility/expense_assumption/index.js";
  
  import {
    calculateCategoryTotal,
    formatAmountInput,
    cleanAmountValue,
    handleCellEdit,
    handleCellInput,
    handleCellFocus,
    calculateCategoryMonthTotal
  } from "@/components/utility/expense_assumption/expense_estimate_utils.js";
  
  import { selectedProject, initializeProjectService, getProjectDepartments } from '@/components/utility/dashboard/projectService.js';
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  // Collections & AR utilities
  import { computeCollectionsForYear, computeAccountsReceivablesForYear, normalizePercents } from '@/components/utility/receipts/collections.js';
  import { computePaymentsForYear, computeCategoryPayablesForYear } from '@/components/utility/receipts/payments.js';
  import { createPaymentHelpers } from '@/components/utility/receipts/payment_ui_helpers.js';
  import { monthLabels as monthlyBaseLabels, quarterToMonths } from '@/components/utility/expense_assumption/expense_formular.js';
  import { allowOnlyNumbers } from '@/components/utility/payroll/index.js';
  import { loadReceiptsPaymentsData, upsertReceiptsPaymentsItems } from '@/components/utility/receipts/index.js';
  
  // ============================================================================
  // REACTIVE STATE
  // ============================================================================
  const years = ref([]);
  const displayMode = ref("monthly");
  const expenses = ref([]);
  const expenseData = ref({});
  const allExpensesData = ref([]);
  const showAdvanced = ref(false);
  const tempAdvancedModes = ref({});
  const isSaved = ref(false);
  const originalExpenseData = ref({});
  const changedCells = ref([]);
  const isSaving = ref(false);
  const saveError = ref("");
  const showUnsavedWarning = ref(false);
  const pendingNavigation = ref(null);
  const sidebarCollapsed = ref(false);
  const departments = ref([]); // Add departments state
  const calculationCache = useCalculationCache();
  
  // Collection percentages for each revenue type
  const collectionPercentages = ref({
    rooms: {
      month: 0.00,
      following: 0.00,
      second: 0.00
    },
    fnb: {
      month: 0.00,
      following: 0.00,
      second: 0.00
    },
    ood: {
      month: 0.00,
      following: 0.00,
      second: 0.00
    }
  });
  
  // Payment percentages for each revenue type and category
  const paymentPercentages = ref({
    rooms: {
      salary: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      bonus: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      payroll: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      expenses: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      }
    },
    fnb: {
      salary: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      bonus: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      payroll: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      expenses: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      }
    },
    ood: {
      salary: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      bonus: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      payroll: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      },
      expenses: {
        month: 0.00,
        following: 0.00,
        second: 0.00
      }
    }
  });

  // ============================================================================
  // PAYMENTS BASE VALUES (EDITABLE ROWS)
  // ============================================================================
  // Holds user-editable base values for payments per department/category/year/label
  const paymentBases = ref({});

  function ensurePaymentBaseStruct(deptKey, category, year) {
    if (!paymentBases.value[deptKey]) paymentBases.value[deptKey] = {};
    if (!paymentBases.value[deptKey][category]) paymentBases.value[deptKey][category] = {};
    if (!paymentBases.value[deptKey][category][year]) paymentBases.value[deptKey][category][year] = {};
  }

  function parseNumber(text) {
    if (text == null) return 0;
    const n = Number(String(text).replace(/,/g, '').trim());
    return isNaN(n) ? 0 : n;
  }

  function getPaymentBaseValue(department, category, year, label) {
    const key = getDeptKey(department);
    const val = paymentBases.value?.[key]?.[category]?.[year]?.[label];
    return getNumber(val);
  }

  function getPaymentBaseTotal(department, category, year) {
    const key = getDeptKey(department);
    const mode = advancedModes.value[year] || displayMode.value;
    const labels = getColumnLabels(mode); // excludes ex1/ex2
    const yearMap = paymentBases.value?.[key]?.[category]?.[year] || {};
    return labels.reduce((sum, lab) => sum + getNumber(yearMap[lab] || 0), 0);
  }

  function handlePaymentBaseInput(department, category, year, label, event) {
    const key = getDeptKey(department);
    ensurePaymentBaseStruct(key, category, year);
    const value = parseNumber(event.target.textContent);
    paymentBases.value[key][category][year][label] = value;
    isSaved.value = false;
  }

  function handlePaymentBaseBlur(department, category, year, label, event) {
    const key = getDeptKey(department);
    ensurePaymentBaseStruct(key, category, year);
    const value = parseNumber(event.target.textContent);
    paymentBases.value[key][category][year][label] = value;
    setEditableCellText(event, formatMoney(value));
  }

  // =========================================================================
  // DEPARTMENT NORMALIZATION AND DEFAULTS
  // =========================================================================
  function normalizeDepartmentKey(rawName) {
    if (!rawName || typeof rawName !== 'string') return 'rooms';
    const name = rawName.trim().toLowerCase();
    if (name === 'rooms') return 'rooms';
    if (name === 'food and beverage' || name === 'f & b' || name === 'f&b') return 'fnb';
    if (name === 'other operating departments' || name === 'ood') return 'ood';
    // Generic slug: keep spaces to allow bracket access in template; ensure stable key
    return name;
  }

  function ensureDefaultsForKey(key) {
    if (!collectionPercentages.value[key]) {
      // Default new departments to current Rooms baseline (which starts at 0.00s)
      const baseCollection = collectionPercentages.value.rooms || { month: 0.0, following: 0.0, second: 0.0 };
      collectionPercentages.value[key] = cloneDeep(baseCollection);
    }
    if (!paymentPercentages.value[key]) {
      // Try to derive from known defaults based on semantic grouping
      let base;
      if (key === 'rooms') base = paymentPercentages.value.rooms;
      else if (key === 'fnb') base = paymentPercentages.value.fnb;
      else if (key === 'ood') base = paymentPercentages.value.ood;
      else {
        // Use rooms as a sensible default template
        base = paymentPercentages.value.rooms;
      }
      paymentPercentages.value[key] = cloneDeep(base);
    }
  }

  function ensureDepartmentConfigs(deptList) {
    if (!Array.isArray(deptList)) return;
    deptList.forEach((dept) => {
      const key = normalizeDepartmentKey(dept);
      ensureDefaultsForKey(key);
    });
  }
  
  // ============================================================================
  // PINIA STORE
  // ============================================================================
  const yearSettingsStore = useYearSettingsStore();
  const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
  const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;
  
  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  const visibleYears = computed(() => {
    const yearsArr = getVisibleYears(fromYear.value, toYear.value);
    return yearsArr;
  });
  
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
  
  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    // Get the base column labels
    const baseLabels = getColumnLabels(advancedModes.value[year] || displayMode.value);
    
    // Add the two extra columns (ex1 and ex2) before the Total column
    // This is specific to the Receipts_Payments page only
    return [...baseLabels, 'ex1', 'ex2'];
  };

  // Expose a helper to normalize department key for template use
  const getDeptKey = (dept) => normalizeDepartmentKey(dept);

  
  // =========================================================================
  // ROOMS REVENUE LOOKUP FROM PINIA CALCULATION CACHE
  // =========================================================================
  function getProjectName() {
    return selectedProject.value?.project_name || 'default';
  }

  function isMarketSegmentationEnabled() {
    try {
      return localStorage.getItem('marketSegmentation') === 'true';
    } catch (e) {
      return false;
    }
  }

  function getNumber(value) {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  function formatMoney(value) {
    return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  // ============================================================================
  // COLLECTIONS AND ACCOUNTS RECEIVABLES HELPERS
  // ============================================================================
  const monthlyLabels = monthlyBaseLabels;
  const lastValidCollectionPercents = ref({}); // fallback while user edits invalid totals

  // Build a map of monthly revenue for a department and year
  function buildRevenueByLabel(department, year) {
    const map = {};
    monthlyLabels.forEach((lab) => {
      map[lab] = getNumber(getDepartmentMonthlyRevenue(department, year, lab));
    });
    return map;
  }

  // Get normalized percentages (0..1); keep last valid while user types invalid totals
  function getDeptPercents(department) {
    const key = getDeptKey(department);
    const p = collectionPercentages.value[key] || { month: 0, following: 0, second: 0 };
    try {
      const normalized = normalizePercents(p);
      lastValidCollectionPercents.value[key] = normalized;
      return normalized;
    } catch (e) {
      // While user is typing and sum > 100, fall back to last valid percents (or zeros)
      return lastValidCollectionPercents.value[key] || { month: 0, following: 0, second: 0 };
    }
  }

  // Compute collection distribution objects for the department/year
  function computeCollections(department, year) {
    const revenue = buildRevenueByLabel(department, year);
    const perc = getDeptPercents(department);
    return { out: computeCollectionsForYear(revenue, perc, monthlyLabels), revenue, perc };
  }

  // Get a single cell value for the three collection rows and Cash Inflow
  function getCollectionValue(department, year, label, bucket) {
    const { out, revenue, perc } = computeCollections(department, year);
    const mode = advancedModes.value[year] || displayMode.value;

    if (label === 'ex1') {
      if (bucket === 'sameMonth') return 0;
      if (bucket === 'following') return getNumber(revenue.Dec) * perc.following;
      if (bucket === 'second') return getNumber(revenue.Nov) * perc.second;
      if (bucket === 'cashInflow') return getNumber(out.cashInflow.ex1 || 0);
    }
    if (label === 'ex2') {
      if (bucket === 'sameMonth' || bucket === 'following') return 0;
      if (bucket === 'second') return getNumber(revenue.Dec) * perc.second;
      if (bucket === 'cashInflow') return getNumber(out.cashInflow.ex2 || 0);
    }

    if (mode === 'monthly') {
      if (bucket === 'sameMonth') return getNumber(out.sameMonth[label] || 0);
      if (bucket === 'following') return getNumber(out.following[label] || 0);
      if (bucket === 'second') return getNumber(out.second[label] || 0);
      if (bucket === 'cashInflow') return getNumber(out.cashInflow[label] || 0);
      return 0;
    }

    if (mode === 'quarterly' && quarterToMonths[label]) {
      const monthsInQuarter = quarterToMonths[label];
      if (bucket === 'sameMonth') return monthsInQuarter.reduce((s, m) => s + getNumber(out.sameMonth[m] || 0), 0);
      if (bucket === 'following') return monthsInQuarter.reduce((s, m) => s + getNumber(out.following[m] || 0), 0);
      if (bucket === 'second') return monthsInQuarter.reduce((s, m) => s + getNumber(out.second[m] || 0), 0);
      if (bucket === 'cashInflow') return monthsInQuarter.reduce((s, m) => s + getNumber(out.cashInflow[m] || 0), 0);
    }

    return 0;
  }

  // Get the Total column value for a given collection bucket
  function getCollectionTotal(department, year, bucket) {
    const { out } = computeCollections(department, year);
    if (bucket === 'sameMonth') return getNumber(out.totals.sameMonth || 0);
    if (bucket === 'following') return getNumber(out.totals.following || 0);
    if (bucket === 'second') return getNumber(out.totals.second || 0);
    if (bucket === 'cashInflow') return getNumber(out.totals.cashInflow || 0);
    return 0;
  }

  // Build a map of next year's monthly revenue (needed for AR ex1/ex2)
  function buildNextYearRevenueByLabel(department, year) {
    const map = {};
    monthlyLabels.forEach((lab) => {
      map[lab] = getNumber(getDepartmentMonthlyRevenue(department, year + 1, lab));
    });
    return map;
  }

  // Compute Accounts Receivables structure for department/year
  function computeAR(department, year) {
    const revenueThis = buildRevenueByLabel(department, year);
    const revenueNext = buildNextYearRevenueByLabel(department, year);
    const perc = getDeptPercents(department);
    return computeAccountsReceivablesForYear(revenueThis, perc, monthlyLabels, revenueNext);
  }

  // Get a single AR cell value (including ex1/ex2)
  function getARValue(department, year, label) {
    const mode = advancedModes.value[year] || displayMode.value;
    const res = computeAR(department, year);
    if (label === 'ex1') return getNumber(res.ex1 || 0);
    if (label === 'ex2') return getNumber(res.ex2 || 0);
    if (mode === 'monthly') return getNumber(res.ar[label] || 0);
    if (mode === 'quarterly' && quarterToMonths[label]) {
      const monthsInQuarter = quarterToMonths[label];
      return monthsInQuarter.reduce((s, m) => s + getNumber(res.ar[m] || 0), 0);
    }
    return 0;
  }

  // Get AR Total column value
  function getARTotal(department, year) {
    const res = computeAR(department, year);
    return getNumber(res.total || 0);
  }
  
  // ============================================================================
  // PAYMENTS HELPERS (moved to utility)
  // ============================================================================
  const {
    getPaymentValue,
    getPaymentTotal,
    getPayablesValue,
    getPayablesTotal,
  } = createPaymentHelpers({
    paymentBases,
    paymentPercentages,
    getDeptKey,
    advancedModes,
    displayMode,
    monthlyLabels,
    quarterToMonths,
    getNumber,
  });

  function getRoomMonthlyRevenueFromCache(year, label) {
    const project = getProjectName();
    if (isMarketSegmentationEnabled()) {
      // Use Market Segmentation cached totals (including Service Charge)
      return calculationCache.getValue(project, 'Market Segmentation', 'Total Rooms Revenue Including SC', year, label);
    }
    // Use Room Revenue Assumptions page cached monthly total
    return calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Room Revenue', year, label);
  }

  function getRoomYearTotalFromCache(year) {
    const project = getProjectName();
    if (isMarketSegmentationEnabled()) {
      // Prefer yearly cached total, else sum months
      const cached = calculationCache.getValue(project, 'Market Segmentation', 'Total Rooms Revenue Including SC Year', year, 'ALL');
      if (cached > 0) return cached;
      // Sum monthly values as fallback
      return (getColumnLabelsForYearLocal(year) || []).reduce((sum, label) => sum + getNumber(getRoomMonthlyRevenueFromCache(year, label)), 0);
    }
    const cached = calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Room Revenue Year', year, 'ALL');
    if (cached > 0) return cached;
    return (getColumnLabelsForYearLocal(year) || []).reduce((sum, label) => sum + getNumber(getRoomMonthlyRevenueFromCache(year, label)), 0);
  }

  function getFnbMonthlyRevenueFromCache(year, label) {
    const project = getProjectName();
    return calculationCache.getValue(project, 'F&B Revenue Assumptions', 'Total F&B Revenue', year, label);
  }

  function getFnbYearTotalFromCache(year) {
    // Sum monthly cached values for the year
    return (getColumnLabelsForYearLocal(year) || []).reduce((sum, label) => sum + getNumber(getFnbMonthlyRevenueFromCache(year, label)), 0);
  }

  function getBanquetMonthlyRevenueFromCache(year, label) {
    const project = getProjectName();
    return calculationCache.getValue(project, 'Banquet Revenue Assumptions', 'Net Amount', year, label);
  }

  function getBanquetYearTotalFromCache(year) {
    return (getColumnLabelsForYearLocal(year) || []).reduce((sum, label) => sum + getNumber(getBanquetMonthlyRevenueFromCache(year, label)), 0);
  }

  function getOODMonthlyRevenueFromCache(year, label) {
    const project = getProjectName();
    const laundry = calculationCache.getValue(project, 'OOD Revenue Assumptions', 'Total Laundry Revenue', year, label);
    const health = calculationCache.getValue(project, 'OOD Revenue Assumptions', 'Total Health Club Rev Including SC', year, label);
    return getNumber(laundry) + getNumber(health);
  }

  function getOODYearTotalFromCache(year) {
    return (getColumnLabelsForYearLocal(year) || []).reduce((sum, label) => sum + getNumber(getOODMonthlyRevenueFromCache(year, label)), 0);
  }

  function getDepartmentMonthlyRevenue(department, year, label) {
    const key = normalizeDepartmentKey(department);
    if (key === 'rooms') {
      return getRoomMonthlyRevenueFromCache(year, label);
    }
    if (key === 'fnb') {
      return getFnbMonthlyRevenueFromCache(year, label);
    }
    if (key === 'other operating departments' || key === 'banquet' || key === 'banquets') {
      return getBanquetMonthlyRevenueFromCache(year, label);
    }
    if (key === 'ood' || key === 'other operating departments') {
      return getOODMonthlyRevenueFromCache(year, label);
    }
    // TODO: Wire other departments to their respective caches
    return 0;
  }

  function getDepartmentYearTotal(department, year) {
    const key = normalizeDepartmentKey(department);
    if (key === 'rooms') {
      return getRoomYearTotalFromCache(year);
    }
    if (key === 'fnb') {
      return getFnbYearTotalFromCache(year);
    }
    if (key === 'other operating departments' || key === 'banquet' || key === 'banquets') {
      return getBanquetYearTotalFromCache(year);
    }
    if (key === 'ood' || key === 'other operating departments') {
      return getOODYearTotalFromCache(year);
    }
    return 0;
  }
  
  // ============================================================================
  // WATCHERS
  // ============================================================================
  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        // Use Pinia action to set mode for new years
        yearSettingsStore.setAdvancedMode(year, displayMode.value);
      }
    });
  });
  
  // Watch for project changes to reload data
  watch(selectedProject, async (newProject, oldProject) => {
    if (newProject && newProject !== oldProject) {
      try {
        // Reset data for new project
        expenseData.value = {};
        allExpensesData.value = [];
        expenses.value = [];
        
        // Load departments for the new project
        await loadDepartments();
        await loadReceiptsAndHydrate();
        
        // Reset any unsaved changes
        changedCells.value = [];
        isSaved.value = true;
        
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
  
  // Watch for unsaved changes to show warning on page refresh
  watch(isSaved, (newValue) => {
    if (!newValue) {
      // Add beforeunload event listener when there are unsaved changes
      window.addEventListener('beforeunload', handleBeforeUnload);
    } else {
      // Remove beforeunload event listener when changes are saved
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  });
  
  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  onMounted(async () => {
    try {
      await initializeProjectService();
      years.value = await loadYearOptions();
      
      // Initialize with empty data
      expenseData.value = {};
      allExpensesData.value = [];
      expenses.value = [];
      
      isSaved.value = true;
      
      // Load departments and hydrate if a project is selected
      if (selectedProject.value) {
        await loadDepartments();
        await loadReceiptsAndHydrate();
      }
      
      // Check if we should show refresh success alert
      if (localStorage.getItem('showRefreshSuccess') === 'true') {
        localStorage.removeItem('showRefreshSuccess');
        alertService.success("Page refreshed successfully");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
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
  
  // Wrapper functions to ensure addExpenseForm is properly initialized
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
    try {
      isSaving.value = true;
      saveError.value = "";
      const projectName = selectedProject.value?.project_name || null;
      const changes = buildReceiptsPaymentsChanges();
      if (!changes.length) {
        alertService.info('No changes to save');
        return;
      }
      const res = await upsertReceiptsPaymentsItems(changes, projectName);
      if (res.status === 'error') {
        throw new Error(res.message || 'Save failed');
      }
      alertService.success('Receipts & Payments saved');
      isSaved.value = true;
      changedCells.value = [];
    } catch (e) {
      saveError.value = e?.message || 'Save failed';
      alertService.error(saveError.value);
    } finally {
      isSaving.value = false;
    }
  };

  function mapCategoryToPaymentRow(categoryKey) {
    if (categoryKey === 'salary') return 'Net Salary & Wage';
    if (categoryKey === 'bonus') return 'Bonus';
    if (categoryKey === 'payroll') return 'Payroll related';
    if (categoryKey === 'expenses') return 'Expenses';
    return categoryKey;
  }

  function mapPaymentRowToCategoryKey(paymentRow) {
    const row = (paymentRow || '').trim().toLowerCase();
    if (row === 'net salary & wage' || row === 'net salary & wages' || row.includes('net salary')) return 'salary';
    if (row === 'bonus' || row.includes('bonus')) return 'bonus';
    if (row === 'payroll related' || row.includes('payroll')) return 'payroll';
    if (row === 'expenses' || row.includes('expense')) return 'expenses';
    return row;
  }

  async function loadReceiptsAndHydrate() {
    try {
      const projectName = selectedProject.value?.project_name || null;
      const serverData = await loadReceiptsPaymentsData(projectName);
      if (!serverData || typeof serverData !== 'object') return;
      Object.keys(serverData).forEach((year) => {
        const monthsData = serverData[year] || {};
        Object.keys(monthsData).forEach((label) => {
          const items = monthsData[label] || [];
          items.forEach((it) => {
            const deptKey = getDeptKey(it.department || '');
            ensureDefaultsForKey(deptKey);
            if (it.section === 'Revenue' && it.percent_position && it.percent != null) {
              collectionPercentages.value[deptKey][it.percent_position] = Number(it.percent) || 0;
            } else if (it.section === 'Payment') {
              const catKey = mapPaymentRowToCategoryKey(it.payment_row || '');
              if (it.percent_position && it.percent != null) {
                if (!paymentPercentages.value[deptKey][catKey]) {
                  paymentPercentages.value[deptKey][catKey] = { month: 0, following: 0, second: 0 };
                }
                paymentPercentages.value[deptKey][catKey][it.percent_position] = Number(it.percent) || 0;
              }
              if (Number(it.amount) > 0) {
                ensurePaymentBaseStruct(deptKey, catKey, year);
                paymentBases.value[deptKey][catKey][year][label] = Number(it.amount) || 0;
              }
            }
          });
        });
      });
    } catch (e) {
      console.error('Failed to load Receipts & Payments:', e);
      alertService.error('Failed to load Receipts & Payments');
    }
  }

  function buildReceiptsPaymentsChanges() {
    const changes = [];
    // Persist percentages once per year using canonical month 'Jan'
    for (const year of visibleYears.value) {
      for (const department of departments.value) {
        const deptKey = getDeptKey(department);
        // Revenue collection percents
        const c = collectionPercentages.value[deptKey] || { month: 0, following: 0, second: 0 };
        ['month', 'following', 'second'].forEach((pos) => {
          const val = Number(c[pos] || 0);
          if (val > 0) {
            changes.push({
              year,
              month: 'Jan',
              department,
              section: 'Revenue',
              percent_position: pos,
              percent: val,
            });
          }
        });

        // Payment percents per category
        const pAll = paymentPercentages.value[deptKey] || {};
        Object.keys(pAll).forEach((cat) => {
          const p = pAll[cat] || { month: 0, following: 0, second: 0 };
          ['month', 'following', 'second'].forEach((pos) => {
            const val = Number(p[pos] || 0);
            if (val > 0) {
              changes.push({
                year,
                month: 'Jan',
                department,
                section: 'Payment',
                payment_row: mapCategoryToPaymentRow(cat),
                percent_position: pos,
                percent: val,
              });
            }
          });
        });

        // Payment base amounts per label
        const yearMap = paymentBases.value?.[deptKey] || {};
        Object.keys(yearMap).forEach((cat) => {
          const perYear = yearMap[cat]?.[year] || {};
          Object.keys(perYear).forEach((label) => {
            const amt = Number(perYear[label] || 0);
            if (amt > 0) {
              changes.push({
                year,
                month: label,
                department,
                section: 'Payment',
                payment_row: mapCategoryToPaymentRow(cat),
                amount: amt,
              });
            }
          });
        });
      }
    }
    return changes;
  }
  
  // ============================================================================
  // ADVANCED SETTINGS HANDLERS
  // ============================================================================
  function applyAdvancedSettings() {
    setAdvancedModes({ ...tempAdvancedModes.value });
    showAdvanced.value = false;
  }
  
  function cancelAdvancedSettings() {
    showAdvanced.value = false;
  }
  
  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
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
  
  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================
  function exportTableData() {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add headers
      const headers = ["Receipt/Payment"];
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
            expense
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
      link.setAttribute("download", `receipts_payments_data_${fromYear.value}_${toYear.value}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
      alertService.error("Failed to export data. Please try again.");
    }
  }

  // ==========================================================================
  // PRINT FUNCTIONALITY
  // ==========================================================================
  function printTable() {
    try {
      window.print();
    } catch (error) {
      console.error('Error triggering print:', error);
      alertService.error('Failed to open print dialog.');
    }
  }
  
  // ============================================================================
  // REFRESH FUNCTIONALITY
  // ============================================================================
  function refreshTable() {
    // Set flag to show success alert after reload
    localStorage.setItem('showRefreshSuccess', 'true');
    // Reload the entire page
    window.location.reload();
  }
  
  // ============================================================================
  // COLLECTION PERCENTAGE HANDLERS
  // ============================================================================
  function setEditableCellText(event, text) {
    // Keep DOM structure; update inner span content only
    const td = event.currentTarget?.closest?.('td[contenteditable="true"]') || event.currentTarget || event.target;
    if (td && td.querySelector) {
      const span = td.querySelector('span');
      if (span) {
        span.textContent = text;
      }
    }
  }

  function getCollectionSumAfter(deptKey, period, newValue) {
    const current = collectionPercentages.value[deptKey] || { month: 0, following: 0, second: 0 };
    const toDec = (x) => {
      const n = Number(x) || 0;
      return n > 1 ? n / 100 : n;
    };
    const monthVal = toDec(period === 'month' ? newValue : current.month);
    const followingVal = toDec(period === 'following' ? newValue : current.following);
    const secondVal = toDec(period === 'second' ? newValue : current.second);
    return monthVal + followingVal + secondVal; // returns decimal sum (0..1)
  }

  function updateCollectionPercentage(type, period, event) {
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      // During typing, accept value without enforcing sum; final check on blur
      collectionPercentages.value[deptKey][period] = value;
      isSaved.value = false;
    }
  }
  
  function handleCollectionPercentageFocus({ type, period, event }) {}
  
  function handleCollectionPercentageEdit({ type, period, event }) {
    // Handle edit completion for collection percentage
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const totalDec = getCollectionSumAfter(deptKey, period, value);
      if (totalDec > 1) {
        const prev = Number(collectionPercentages.value[deptKey][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Collection percentages cannot exceed 100%. Current total would be ${(totalDec * 100).toFixed(2)}%.`);
        return;
      }
      collectionPercentages.value[deptKey][period] = value;
      isSaved.value = false;
    } else {
      // Reset to previous value if invalid
      setEditableCellText(event, (Number(collectionPercentages.value[deptKey][period]) || 0).toFixed(2) + '%');
    }
  }
  
  // ============================================================================
  // PAYMENT PERCENTAGE HANDLERS
  // ============================================================================
  function getPaymentSumAfter(deptKey, category, period, newValue) {
    const currentCategory = (paymentPercentages.value[deptKey] && paymentPercentages.value[deptKey][category]) || { month: 0, following: 0, second: 0 };
    const monthVal = period === 'month' ? newValue : Number(currentCategory.month) || 0;
    const followingVal = period === 'following' ? newValue : Number(currentCategory.following) || 0;
    const secondVal = period === 'second' ? newValue : Number(currentCategory.second) || 0;
    return monthVal + followingVal + secondVal;
  }

  function updatePaymentPercentage(type, category, period, event) {
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const total = getPaymentSumAfter(deptKey, category, period, value);
      if (total > 100) {
        const prev = Number(paymentPercentages.value[deptKey][category][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Payment percentages for ${category} cannot exceed 100%. Current total would be ${total.toFixed(2)}%.`);
        return;
      }
      paymentPercentages.value[deptKey][category][period] = value;
      isSaved.value = false;
    }
  }
  
  function handlePaymentPercentageFocus({ type, category, period, event }) {}
  
  function handlePaymentPercentageEdit({ type, category, period, event }) {
    // Handle edit completion for payment percentage
    const value = parseFloat(event.target.textContent.replace('%', ''));
    const deptKey = normalizeDepartmentKey(type);
    ensureDefaultsForKey(deptKey);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      const total = getPaymentSumAfter(deptKey, category, period, value);
      if (total > 100) {
        const prev = Number(paymentPercentages.value[deptKey][category][period]) || 0;
        setEditableCellText(event, prev.toFixed(2) + '%');
        alertService.error(`Payment percentages for ${category} cannot exceed 100%. Current total would be ${total.toFixed(2)}%.`);
        return;
      }
      paymentPercentages.value[deptKey][category][period] = value;
      isSaved.value = false;
    } else {
      // Reset to previous value if invalid
      setEditableCellText(event, (Number(paymentPercentages.value[deptKey][category][period]) || 0).toFixed(2) + '%');
    }
  }
  
  // ============================================================================
  // DEPARTMENT LOADING
  // ============================================================================
  async function loadDepartments() {
    try {
      if (selectedProject.value) {
        const response = await getProjectDepartments(selectedProject.value.name);
        // Extract department names from the API response structure
        if (response && response.data && response.data.data) {
          departments.value = response.data.data;
          ensureDepartmentConfigs(departments.value);
        } else if (Array.isArray(response)) {
          // Fallback for direct array response
          departments.value = response;
          ensureDepartmentConfigs(departments.value);
        } else {
          departments.value = [];
        }
      } else {
        departments.value = [];
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      departments.value = [];
    }
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
    