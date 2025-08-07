<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="[
          'bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300',
          sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6'
        ]">
          <!-- Collapse/Expand Button -->
          <button 
            @click="sidebarCollapsed = !sidebarCollapsed" 
            class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all"
          >
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
                    <ReceiptText class="w-7 h-7 mx-2 text-white" />
                  </div>
                  <h1 class="text-2xl font-bold text-gray-900">Receipts & Payments</h1>
                </div>
                <p class="text-sm text-gray-500">Manage and configure your receipts and payments data</p>
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
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Table class="w-3 h-3 text-white" />
                </div>
                <h2 class="text-lg font-bold text-gray-800">Receipts & Payments Overview</h2>
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
                                <ReceiptText class="w-2 h-2" />
                                Total
                              </div>
                            </th>
                          </template>
                          <template v-else>
                            <th class="px-2 py-1 text-center border border-violet-300 min-w-[110px] font-semibold">
                              <div class="flex items-center justify-center gap-1">
                                <ReceiptText class="w-2 h-2" />
                                Total
                              </div>
                            </th>
                          </template>
                        </template>
                      </tr>
                    </thead>

                    <!-- Enhanced Table Body -->
                    <tbody class="text-gray-700 bg-white text-sm">
                      <!-- ROOMS REVENUE Section -->
                      <tr class="bg-gradient-to-r from-violet-50 to-violet-100 border-b-2 border-violet-300">
                        <td colspan="2" class="px-3 py-3 font-bold text-violet-900 border-r border-violet-300">
                          <div class="flex items-center gap-2">
                            ROOMS REVENUE
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-header-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-header-cell-' + year + '-' + label"
                              class="px-1 py-1 text-center border border-violet-200 bg-violet-50"
                            ></td>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                          </template>
                          <template v-else>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
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
                        <template v-for="year in visibleYears" :key="'rooms-revenue-subheader-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-revenue-subheader-cell-' + year + '-' + label"
                              class="px-1 py-1 text-center border border-violet-200 bg-violet-100"
                            ></td>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-100"></td>
                          </template>
                          <template v-else>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-100"></td>
                          </template>
                        </template>
                      </tr>

                      <!-- Total monthly Rooms Revenue -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td colspan="2" class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Total monthly Rooms Revenue
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-revenue-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-revenue-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 80% in the month of Revenue (Rooms) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.rooms.month.toFixed(0) }}% in the month of Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('rooms', 'month', $event)" @focus="handleCollectionPercentageFocus({ type: 'rooms', period: 'month', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'rooms', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.rooms.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-collection-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-collection-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 15% in the month following Revenue (Rooms) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.rooms.following.toFixed(0) }}% in the month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('rooms', 'following', $event)" @focus="handleCollectionPercentageFocus({ type: 'rooms', period: 'following', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'rooms', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.rooms.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-collection-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-collection-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 5% in the Second month following Revenue (Rooms) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.rooms.second.toFixed(0) }}% in the Second month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('rooms', 'second', $event)" @focus="handleCollectionPercentageFocus({ type: 'rooms', period: 'second', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'rooms', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.rooms.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-collection-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-collection-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Cash Inflow (Rooms) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Cash Inflow
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-cash-inflow-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-cash-inflow-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Accounts Receivables (Rooms) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Accounts Receivables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-accounts-receivables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-accounts-receivables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
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
                        <template v-for="year in visibleYears" :key="'rooms-payments-subheader-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-payments-subheader-cell-' + year + '-' + label"
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
                        <template v-for="year in visibleYears" :key="'rooms-salary-wages-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-wages-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Payment - 80% in the month of Payroll run (Salary & Wages) -->
                      <tr class="bg-red-50 border-b border-red-200">
                        <td class="px-3 py-2 font-medium border-r border-red-200">
                          <div class="flex items-center gap-1">
                            Payment- {{ paymentPercentages.rooms.salary.month.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'salary', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'salary', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'salary', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.salary.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-salary-payment-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-payment-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.salary.following.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'salary', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'salary', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'salary', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.salary.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-salary-payment-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-payment-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.salary.second.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'salary', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'salary', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'salary', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.salary.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-salary-payment-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-payment-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                        <template v-for="year in visibleYears" :key="'rooms-salary-cash-outflow-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-cash-outflow-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Rooms Net Salaries & Wages Payables -->
                      <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Rooms Net Salaries & Wages Payables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-salary-payables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-salary-payables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
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
                        <template v-for="year in visibleYears" :key="'rooms-bonus-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-bonus-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.bonus.month.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'bonus', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'bonus', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'bonus', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.bonus.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-bonus-payment-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-bonus-payment-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.bonus.following.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'bonus', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'bonus', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'bonus', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.bonus.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-bonus-payment-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-bonus-payment-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.bonus.second.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'bonus', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'bonus', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'bonus', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.bonus.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-bonus-payment-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-bonus-payment-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Rooms Bonus Payables -->
                      <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Rooms Bonus Payables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-bonus-payables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-bonus-payables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
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
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.payroll.month.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'payroll', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'payroll', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'payroll', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.payroll.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-payroll-payment-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-payroll-payment-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.payroll.following.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'payroll', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'payroll', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'payroll', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.payroll.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-payroll-payment-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-payroll-payment-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.payroll.second.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'payroll', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'payroll', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'payroll', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.payroll.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-payroll-payment-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-payroll-payment-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Rooms Payroll Related Payables -->
                      <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Rooms Payroll Related Payables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-payroll-payables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-payroll-payables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
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
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.expenses.month.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'expenses', 'month', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'expenses', period: 'month', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'expenses', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.expenses.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-expenses-payment-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-expenses-payment-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.expenses.following.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'expenses', 'following', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'expenses', period: 'following', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'expenses', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.expenses.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-expenses-payment-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-expenses-payment-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                            Payment- {{ paymentPercentages.rooms.expenses.second.toFixed(0) }}% in the month of Payroll run
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-red-200 text-red-900 hover:bg-red-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updatePaymentPercentage('rooms', 'expenses', 'second', $event)" @focus="handlePaymentPercentageFocus({ type: 'rooms', category: 'expenses', period: 'second', event: $event })" @blur="handlePaymentPercentageEdit({ type: 'rooms', category: 'expenses', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ paymentPercentages.rooms.expenses.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-expenses-payment-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-expenses-payment-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-200 bg-red-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-200 font-semibold bg-red-100">
                              <span class="font-mono text-xs text-red-700">0.00</span>
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
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Rooms Expenses Payables -->
                      <tr class="bg-gradient-to-r from-red-100 to-red-200 border-b-2 border-red-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-red-300 text-red-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Rooms Expenses Payables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'rooms-expenses-payables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'rooms-expenses-payables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-red-300 bg-red-200 font-bold text-red-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- F & B REVENUE Section -->
                      <tr class="bg-gradient-to-r from-violet-50 to-violet-100 border-b-2 border-violet-300">
                        <td colspan="2" class="px-3 py-3 font-bold text-violet-900 border-r border-violet-300">
                          <div class="flex items-center gap-2">
                            F & B REVENUE
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-header-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-header-cell-' + year + '-' + label"
                              class="px-1 py-1 text-center border border-violet-200 bg-violet-50"
                            ></td>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                          </template>
                          <template v-else>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                          </template>
                        </template>
                      </tr>

                      <!-- Total monthly F&B Revenue -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td colspan="2" class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Total monthly F&B Revenue
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-revenue-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-revenue-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 80% in the month of Revenue (F&B) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.fnb.month.toFixed(0) }}% in the month of Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('fnb', 'month', $event)" @focus="handleCollectionPercentageFocus({ type: 'fnb', period: 'month', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'fnb', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.fnb.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-collection-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-collection-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 15% in the month following Revenue (F&B) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.fnb.following.toFixed(0) }}% in the month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('fnb', 'following', $event)" @focus="handleCollectionPercentageFocus({ type: 'fnb', period: 'following', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'fnb', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.fnb.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-collection-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-collection-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 5% in the Second month following Revenue (F&B) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.fnb.second.toFixed(0) }}% in the Second month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('fnb', 'second', $event)" @focus="handleCollectionPercentageFocus({ type: 'fnb', period: 'second', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'fnb', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.fnb.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-collection-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-collection-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Cash Inflow (F&B) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Cash Inflow
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-cash-inflow-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-cash-inflow-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Accounts Receivables (F&B) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Accounts Receivables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'fnb-accounts-receivables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'fnb-accounts-receivables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- OOD REVENUE Section -->
                      <tr class="bg-gradient-to-r from-violet-50 to-violet-100 border-b-2 border-violet-300">
                        <td colspan="2" class="px-3 py-3 font-bold text-violet-900 border-r border-violet-300">
                          <div class="flex items-center gap-2">
                            OOD REVENUE
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-header-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-header-cell-' + year + '-' + label"
                              class="px-1 py-1 text-center border border-violet-200 bg-violet-50"
                            ></td>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                          </template>
                          <template v-else>
                            <td class="px-1 py-1 text-center border border-violet-200 bg-violet-50"></td>
                          </template>
                        </template>
                      </tr>

                      <!-- Total monthly OOD Revenue -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td colspan="2" class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Total monthly OOD Revenue
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-revenue-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-revenue-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 80% in the month of Revenue (OOD) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.ood.month.toFixed(0) }}% in the month of Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('ood', 'month', $event)" @focus="handleCollectionPercentageFocus({ type: 'ood', period: 'month', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'ood', period: 'month', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.ood.month.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-collection-80-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-collection-80-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 15% in the month following Revenue (OOD) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.ood.following.toFixed(0) }}% in the month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('ood', 'following', $event)" @focus="handleCollectionPercentageFocus({ type: 'ood', period: 'following', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'ood', period: 'following', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.ood.following.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-collection-15-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-collection-15-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Collection - 5% in the Second month following Revenue (OOD) -->
                      <tr class="bg-violet-50 border-b border-violet-200">
                        <td class="px-3 py-2 font-medium border-r border-violet-200">
                          <div class="flex items-center gap-1">
                            Collection- {{ collectionPercentages.ood.second.toFixed(0) }}% in the Second month following Revenue
                          </div>
                        </td>
                        <td class="px-3 py-2 font-medium border-r border-violet-200 text-violet-900 hover:bg-violet-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200" contenteditable="true" @input="updateCollectionPercentage('ood', 'second', $event)" @focus="handleCollectionPercentageFocus({ type: 'ood', period: 'second', event: $event })" @blur="handleCollectionPercentageEdit({ type: 'ood', period: 'second', event: $event })">
                          <div class="flex items-center justify-end gap-1">
                            <span class="font-mono text-xs">{{ collectionPercentages.ood.second.toFixed(2) }}%</span>
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-collection-5-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-collection-5-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-200 bg-violet-50"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-100">
                              <span class="font-mono text-xs text-violet-700">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Cash Inflow (OOD) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Cash Inflow
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-cash-inflow-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-cash-inflow-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

                      <!-- Accounts Receivables (OOD) -->
                      <tr class="bg-gradient-to-r from-violet-100 to-violet-200 border-b-2 border-violet-400">
                        <td colspan="2" class="px-3 py-2 font-bold border-r border-violet-300 text-violet-900 text-right">
                          <div class="flex items-center gap-1 justify-end">
                            Accounts Receivables
                          </div>
                        </td>
                        <template v-for="year in visibleYears" :key="'ood-accounts-receivables-' + year">
                          <template v-if="!isYearCollapsed(year)">
                            <td
                              v-for="label in getColumnLabelsForYearLocal(year)"
                              :key="'ood-accounts-receivables-cell-' + year + '-' + label"
                              class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900"
                            >
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                          <template v-else>
                            <td class="px-2 py-1 text-right border border-violet-300 bg-violet-200 font-bold text-violet-900">
                              <span class="font-mono text-xs">0.00</span>
                            </td>
                          </template>
                        </template>
                      </tr>

              
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
import NoYearsSelectedState from '@/components/ui/expense/NoYearsSelectedState.vue';

// Icon imports
import { 
  AlertTriangle, 
  ReceiptText, 
  Table, 
  Download, 
  RefreshCw, 
  FolderOpen, 
  Receipt, 
  Tag, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Hash, 
  Calendar, 
  ArrowLeft, 
  Settings, 
  X, 
  Check, 
  PlusCircle, 
  Plus, 
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

import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';

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

// Collection percentages for each revenue type
const collectionPercentages = ref({
  rooms: {
    month: 80.00,
    following: 15.00,
    second: 5.00
  },
  fnb: {
    month: 80.00,
    following: 15.00,
    second: 5.00
  },
  ood: {
    month: 80.00,
    following: 15.00,
    second: 5.00
  }
});

// Payment percentages for each revenue type and category
const paymentPercentages = ref({
  rooms: {
    salary: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    bonus: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    payroll: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    expenses: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    }
  },
  fnb: {
    salary: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    bonus: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    payroll: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    expenses: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    }
  },
  ood: {
    salary: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    bonus: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    payroll: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    },
    expenses: {
      month: 80.00,
      following: 15.00,
      second: 5.00
    }
  }
});

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
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

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
  await saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData);
};

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
function updateCollectionPercentage(type, period, event) {
  const value = parseFloat(event.target.textContent.replace('%', ''));
  if (!isNaN(value) && value >= 0 && value <= 100) {
    collectionPercentages.value[type][period] = value;
    isSaved.value = false;
  }
}

function handleCollectionPercentageFocus({ type, period, event }) {
  // Handle focus for collection percentage
  console.log('Collection percentage focus:', type, period);
}

function handleCollectionPercentageEdit({ type, period, event }) {
  // Handle edit completion for collection percentage
  const value = parseFloat(event.target.textContent.replace('%', ''));
  if (!isNaN(value) && value >= 0 && value <= 100) {
    collectionPercentages.value[type][period] = value;
    isSaved.value = false;
    console.log('Collection percentage updated:', type, period, value);
  } else {
    // Reset to previous value if invalid
    event.target.textContent = collectionPercentages.value[type][period] + '%';
  }
}

// ============================================================================
// PAYMENT PERCENTAGE HANDLERS
// ============================================================================
function updatePaymentPercentage(type, category, period, event) {
  const value = parseFloat(event.target.textContent.replace('%', ''));
  if (!isNaN(value) && value >= 0 && value <= 100) {
    paymentPercentages.value[type][category][period] = value;
    isSaved.value = false;
  }
}

function handlePaymentPercentageFocus({ type, category, period, event }) {
  // Handle focus for payment percentage
  console.log('Payment percentage focus:', type, category, period);
}

function handlePaymentPercentageEdit({ type, category, period, event }) {
  // Handle edit completion for payment percentage
  const value = parseFloat(event.target.textContent.replace('%', ''));
  if (!isNaN(value) && value >= 0 && value <= 100) {
    paymentPercentages.value[type][category][period] = value;
    isSaved.value = false;
    console.log('Payment percentage updated:', type, category, period, value);
  } else {
    // Reset to previous value if invalid
    event.target.textContent = paymentPercentages.value[type][category][period] + '%';
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
  