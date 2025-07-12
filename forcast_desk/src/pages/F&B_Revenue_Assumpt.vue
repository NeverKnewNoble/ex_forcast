<template>
    <div class="flex ">
      <Sidebar />
  
      <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
        <!-- Main Content Area -->
        <div class="flex">
          
          <!-- Left Sidebar - Filters and Controls -->
          <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
            <!-- Collapse/Expand Button -->
            <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-6 flex items-center gap-2 px-3 py-2 bg-violet-100 hover:bg-violet-200 rounded-lg transition-all duration-200 hover:shadow-md">
              <ChevronLeft v-if="!sidebarCollapsed" class="w-4 h-4 text-violet-700" />
              <ChevronRight v-else class="w-4 h-4 text-violet-700" />
              <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium">Collapse</span>
            </button>
            <transition name="fade">
                <div v-show="!sidebarCollapsed">
                  <!-- Header Section -->
                  <div class="mb-6">
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                        <UtensilsCrossed class="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h1 class="text-xl font-bold text-gray-900 leading-tight">F&B Revenue Assumptions</h1>
                      </div>
                    </div>
                    <p class="text-sm text-gray-600">Configure revenue projections and assumptions for your food & beverage operations</p>
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
                  <div class="mb-4">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Quick Actions
                    </h3>

                    
                    <div class="flex gap-2 mt-3">
                      <button 
                        @click="refreshTable"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium"
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
                        Time Period Filter
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
                      </div>
                    </div>
                  </div>


                  <!-- Total Number of Rooms Section -->
                  <div class="mt-4">
                    <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BedDouble class="w-5 h-5 text-violet-600" />
                        Total Number of Rooms
                      </h3>
                      <div class="space-y-3">
                        <div>
                          <div class="relative">
                            <input
                              v-model="totalRooms"
                              type="number"
                              min="1"
                              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-lg font-semibold text-gray-900 rooms-input"
                              placeholder="Enter total number of rooms"
                              @input="handleTotalRoomsChange"
                              @blur="handleTotalRoomsBlur"
                              @keyup.enter="$event.target.blur()"
                            />
                            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                              <span class="text-gray-400 text-sm font-medium">rooms</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Sync Button -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          
                          <button 
                            @click="syncWithRoomRevenue"
                            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                            :class="isSyncedWithRoomRevenue 
                              ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                              : 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-200'"
                          >
                            <RefreshCw class="w-4 h-4" />
                            {{ isSyncedWithRoomRevenue ? 'Synced' : 'Unsynced' }}
                          </button>
                          
                          <p class="text-xs text-gray-500 mt-2 text-center">
                            {{ isSyncedWithRoomRevenue 
                              ? 'Your total rooms are synchronized with the Room Revenue page' 
                              : 'Click to sync with the total rooms from Room Revenue page' }}
                          </p>
                        </div>
                        
                        <p class="text-xs text-gray-500 flex items-center gap-1">
                          This value is used for F&B revenue calculations and projections
                        </p>
                        
                        <!-- Double Occupancy Button -->
                        <div class="mt-3">
                          <button 
                            @click="showDoubleOccupancyModal = true"
                            class="w-full flex items-center justify-left gap-2 px-4 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                          >
                            <Users class="w-4 h-4" />
                            Double Occupancy
                          </button>
                        </div>
                        
                        <!-- Set Default Breakfast Outlet Button -->
                        <div class="mt-3">
                          <button 
                            @click="showDefaultBreakfastModal = true"
                            class="w-full flex items-center justify-left gap-2 px-4 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                          >
                            <UtensilsCrossed class="w-4 h-4" />
                            Default Breakfast Outlet
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
            </transition>
          </div>
  
          
          
  
          <!-- Right Side - Content Area -->
          <div class="flex-1 p-4">
            <!-- Table Header with Stats -->
            <template v-if="visibleYears.length">
              <div class="mb-4 flex items-center gap-2">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed class="w-3 h-3 text-white" />
                    </div>
                    <h2 class="text-lg font-bold text-gray-800">F&amp;B Revenue Overview</h2>
                  </div>
              </div>
              <!-- Move Create Restaurant button here -->
              <div class="mb-4 flex gap-2">
                  <button
                    @click="showCreateRestaurantModal = true"
                  class="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <PlusCircle class="w-4 h-4" />
                    Create Restaurant
                  </button>
                  <button
                    @click="showResetRestaurantsModal = true"
                    class="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <RefreshCw class="w-4 h-4" />
                    Reset to Default
                  </button>
                </div>
                <!-- Modern Table Container -->
                <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Enhanced Table Header -->
                      <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                        <tr>
                          <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center font-bold  gap-1">
                              <FolderOpen class="w-6 h-6" />
                              <span class="text-2xl font-bold">Details</span>
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
                      <!-- Table Body -->
                      <tbody class="text-gray-700 bg-white text-sm">
                        <!-- Robust, expense-style cell handling for all editable cells -->
                        <tr v-for="row in fnbRows" :key="'fnb-row-' + row" 
                            :class="[
                              'even:bg-gray-50 hover:bg-violet-50 transition-all duration-200 border-b border-gray-100',
                              (row === 'Number of rooms' || row === 'Days of the Month' || row === 'Number of rooms available' || row === 'Number of Rooms Sold (excl.)' || row === 'Occupancy (excl.) %' || row === 'Number of guests' || row === 'Average Spent Per F&B Customer' || row === 'Average Room Rate' || row === 'Revenue Per Available Room') ? 'bg-violet-50/30' : ''
                            ]"
                        >
                          <td class="px-4 py-2 font-medium border-r border-violet-200 flex items-center justify-between">
                            <span>{{ row }}</span>
                            <span v-if="row === 'Number of rooms' || row === 'Days of the Month' || row === 'Number of rooms available' || row === 'Number of Rooms Sold (excl.)' || row === 'Occupancy (excl.) %' || row === 'Number of guests' || row === 'Average Spent Per F&B Customer' || row === 'Average Room Rate' || row === 'Revenue Per Available Room'" class="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                              Auto
                            </span>
                          </td>
                          <template v-for="year in visibleYears" :key="'row-' + year + '-' + row">
                            <template v-if="!isYearCollapsed(year)">
                              <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'cell-' + year + '-' + label + '-' + row"
                                :contenteditable="false"
                                class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 editable-cell font-mono text-xs bg-violet-50 cursor-not-allowed"
                              >
                                <span class="font-mono text-xs" v-if="row === 'Average Spent Per F&B Customer'">{{ getAverageSpentPerFnbCustomer(year, label) }}</span>
                                <span class="font-mono text-xs" v-else>{{ getFnbCellValue(fnbData, row, year, label, totalRooms) }}</span>
                              </td>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700" v-if="row === 'Average Spent Per F&B Customer'">
                                  {{ getAverageSpentPerFnbCustomer(year, 'Total') }}
                                </span>
                                <span class="font-mono text-xs text-violet-700" v-else>
                                  {{ calculateFnbTotal(fnbData, row, year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                </span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700" v-if="row === 'Average Spent Per F&B Customer'">
                                  {{ getAverageSpentPerFnbCustomer(year, 'Total') }}
                                </span>
                                <span class="font-mono text-xs text-violet-700" v-else>
                                  {{ calculateFnbTotal(fnbData, row, year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                </span>
                              </td>
                            </template>
                          </template>
                        </tr>
                        <!-- Empty rows after main F&B data -->
                        <tr>
                          <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                        </tr>
                        <tr>
                          <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                        </tr>
                        <!-- Restaurant rows -->
                        <template v-for="restaurant in restaurantList" :key="restaurant.name">
                          <tr>
                            <td class="bg-violet-50 text-violet-900 text-lg font-bold border-b border-violet-200 py-2 px-2 pl-4 text-balance flex items-center justify-between" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)">
                              <span>{{ restaurant.cover_name || restaurant.name }}</span>
                              <button
                                @click="showDeleteRestaurantModal = true; restaurantToDelete = restaurant"
                                class="flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-all duration-200 hover:shadow-md"
                                title="Delete restaurant"
                              >
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                          <template v-for="section in defaultRestaurantRows" :key="section.section">
                            <tr>
                              <td class="bg-violet-100 text-violet-700 font-semibold border-b border-violet-100 py-2 pl-8" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)">
                                {{ section.section }}
                              </td>
                            </tr>
                            <tr v-for="row in section.rows" :key="row">
                              <td class="px-4 py-2 text-gray-700 border-b border-gray-50 flex items-center justify-between">
                                <span class="ml-8">{{ row }}</span>
                                <span v-if="isRestaurantRowAutoCalculated(restaurant.name, section.section, row)" class="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                                  Auto
                                </span>
                              </td>
                              <template v-for="year in visibleYears" :key="'section-row-detail-' + restaurant.name + '-' + section.section + '-' + row + '-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'section-row-detail-cell-' + restaurant.name + '-' + section.section + '-' + row + '-' + year + '-' + label"
                                    :contenteditable="!isRestaurantRowAutoCalculated(restaurant.name, section.section, row)"
                                    class="px-2 py-2 text-right border border-violet-200 font-mono text-xs"
                                    :class="[
                                      isRestaurantRowAutoCalculated(restaurant.name, section.section, row)
                                        ? 'bg-violet-50 cursor-not-allowed' 
                                        : 'hover:bg-violet-50 editable-cell'
                                    ]"
                                    @input="!isRestaurantRowAutoCalculated(restaurant.name, section.section, row) ? handleFnbCellInputWrapper({ row: JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, label, event: $event }) : null"
                                    @focus="!isRestaurantRowAutoCalculated(restaurant.name, section.section, row) ? handleFnbCellFocus({ row: JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, label, event: $event }) : null"
                                    @blur="!isRestaurantRowAutoCalculated(restaurant.name, section.section, row) ? handleFnbCellEditWrapper({ row: JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, label, event: $event }) : null"
                                    @keypress="!isRestaurantRowAutoCalculated(restaurant.name, section.section, row) ? allowOnlyNumbers($event) : null"
                                  >
                                    <span class="font-mono text-xs">{{ getFnbCellValue(fnbData, JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, label, totalRooms) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, getColumnLabelsForYearLocal(year), totalRooms) }}</td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: section.section, type: row}), year, getColumnLabelsForYearLocal(year), totalRooms) }}</td>
                                </template>
                              </template>
                            </tr>
                          </template>
                          <!-- Totals for this restaurant -->
                          <tr v-for="suffix in ['Cover', 'Food Revenue', 'Beverage Revenue', 'Revenue']" :key="'restaurant-total-' + restaurant.name + '-' + suffix">
                            <td class="font-bold text-violet-900 bg-violet-50 border-b border-violet-200 px-4 py-2">
                              Total {{ restaurant.cover_name || restaurant.name }} {{ suffix }}
                            </td>
                            <template v-for="year in visibleYears" :key="'restaurant-total-row-' + restaurant.name + '-' + suffix + '-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <template v-if="suffix === 'Cover'">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">
                                    <span class="font-mono text-xs">
                                      {{ getFnbCellValue(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Cover'}), year, label, totalRooms) }}
                                    </span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Cover'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Food Revenue'">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">
                                    <span class="font-mono text-xs">
                                      {{ getFnbCellValue(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Food Revenue'}), year, label, totalRooms) }}
                                    </span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Food Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Beverage Revenue'">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">
                                    <span class="font-mono text-xs">
                                      {{ getFnbCellValue(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Beverage Revenue'}), year, label, totalRooms) }}
                                    </span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Beverage Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Revenue'">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">
                                    <span class="font-mono text-xs">
                                      {{ getFnbCellValue(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Revenue'}), year, label, totalRooms) }}
                                    </span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">0.00</td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
                                </template>
                              </template>
                              <template v-else>
                                <template v-if="suffix === 'Cover'">
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Cover'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Food Revenue'">
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Food Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Beverage Revenue'">
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Beverage Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else-if="suffix === 'Revenue'">
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                    <span class="font-mono text-xs text-violet-700">
                                      {{ calculateFnbTotal(fnbData, JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Revenue'}), year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
                                </template>
                              </template>
                            </template>
                          </tr>
                          <!-- One empty row after totals -->
                          <tr>
                            <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                          </tr>
                        </template>
                        <!-- After all restaurant rows -->
                        <tr>
                          <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                        </tr>
                        <tr v-for="totalRow in ['Total Covers', 'Total Food Revenue', 'Total Beverage Revenue', 'Total F&B Revenue']" :key="'total-row-' + totalRow">
                          <td class="font-bold text-violet-900 bg-violet-100 border-b border-violet-200 px-4 py-2">{{ totalRow }}</td>
                          <template v-for="year in visibleYears" :key="'total-row-' + totalRow + '-' + year">
                            <template v-if="!isYearCollapsed(year)">
                              <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'total-row-cell-' + totalRow + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">
                                <span v-if="totalRow === 'Total Covers'">{{ calculateTotalCovers(year, label) }}</span>
                                <span v-else-if="totalRow === 'Total Food Revenue'">{{ calculateTotalFoodRevenue(year, label) }}</span>
                                <span v-else-if="totalRow === 'Total Beverage Revenue'">{{ calculateTotalBeverageRevenue(year, label) }}</span>
                                <span v-else-if="totalRow === 'Total F&B Revenue'">{{ calculateTotalFnbRevenue(year, label) }}</span>
                                <span v-else>0.00</span>
                              </td>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                <span v-if="totalRow === 'Total Covers'">{{ calculateTotalCovers(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total Food Revenue'">{{ calculateTotalFoodRevenue(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total Beverage Revenue'">{{ calculateTotalBeverageRevenue(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total F&B Revenue'">{{ calculateTotalFnbRevenue(year, 'Total') }}</span>
                                <span v-else>0.00</span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">
                                <span v-if="totalRow === 'Total Covers'">{{ calculateTotalCovers(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total Food Revenue'">{{ calculateTotalFoodRevenue(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total Beverage Revenue'">{{ calculateTotalBeverageRevenue(year, 'Total') }}</span>
                                <span v-else-if="totalRow === 'Total F&B Revenue'">{{ calculateTotalFnbRevenue(year, 'Total') }}</span>
                                <span v-else>0.00</span>
                              </td>
                            </template>
                          </template>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            <!-- Leave 2 empty rows as space -->
            <div style="height: 3.5rem;"></div>
            <div style="height: 3.5rem;"></div>
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
                  {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the F&B revenue table.' : 
                     !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the F&B revenue table.' :
                       'Please select both "From Year" and "To Year" in the left panel to display the F&B revenue table.' }}
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
  
  
    <!-- Double Occupancy Modal -->
    <transition name="fade">
      <div
        v-if="showDoubleOccupancyModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <Users class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Double Occupancy Settings</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <!-- Message when no years selected -->
            <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle class="w-6 h-6 text-yellow-600" />
              <span class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure double occupancy settings.</span>
            </div>
  
            <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
              <div
                v-for="year in visibleYears"
                :key="'double-occ-' + year"
                class="flex justify-between items-center border-b pb-2"
              >
                <span class="font-medium text-gray-700 flex items-center gap-2">
                  <Calendar class="w-4 h-4 text-violet-600" />
                  {{ year }}
                </span>
                <div class="flex items-center gap-2">
                  <input
                    v-model="tempDoubleOccupancyByYear[year]"
                    type="number"
                    min="0"
                    step="0.01"
                    class="px-4 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 w-24 text-right"
                    placeholder="0.00"
                    @input="handleDoubleOccupancyInput($event, year)"
                    @keypress="allowOnlyNumbers($event)"
                  />
                </div>
              </div>
            </div>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelDoubleOccupancySettings"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              v-if="visibleYears.length"
              @click="applyDoubleOccupancySettings"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </transition>
  
  
    <!-- Unsaved Changes Warning Modal -->
    <transition name="fade">
      <div
        v-if="showUnsavedWarning"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl border border-red-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Unsaved Changes</h2>
          </div>
          
          <p class="text-gray-600 mb-6">
            You have unsaved changes that may be discarded if you leave this page. Are you sure you want to continue?
          </p>
          
          <div class="flex justify-end gap-3">
            <button
              @click="cancelNavigation"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Stay on Page
            </button>
            <button
              @click="confirmNavigation"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
            >
              Leave Anyway
            </button>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Create Restaurant Modal -->
    <transition name="fade">
      <div v-if="showCreateRestaurantModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-lg overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <div class="flex items-center gap-3">
              <PlusCircle class="w-7 h-7 text-white" />
              <div>
                <h2 class="text-2xl font-bold text-white">Create Restaurant</h2>
                <p class="text-violet-100 mt-1 text-sm">Enter the name of the new dining venue</p>
              </div>
            </div>
            <button @click="showCreateRestaurantModal = false" class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600">
              <X class="w-6 h-6" />
            </button>
          </div>
          <!-- Modal Body -->
          <div class="p-8 pb-0 space-y-6 overflow-y-auto">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Restaurant Name</label>
              <input v-model="newRestaurantName" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white" placeholder="e.g. Main Dining Room" />
              <span v-if="createRestaurantError" class="text-red-500 text-xs mt-2 block">{{ createRestaurantError }}</span>
            </div>
          </div>
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button @click="showCreateRestaurantModal = false" class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2">
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button @click="handleCreateRestaurant" :disabled="isCreatingRestaurant" class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2 disabled:opacity-60">
              <Check class="w-4 h-4" />
              <span v-if="!isCreatingRestaurant">Create</span>
              <span v-else>Creating...</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  
  
    <!-- Default Breakfast Outlet Modal -->
    <transition name="fade">
      <div
        v-if="showDefaultBreakfastModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <UtensilsCrossed class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Set Default Breakfast Outlet</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <!-- Message when no restaurants available -->
            <div v-if="!restaurantList.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle class="w-6 h-6 text-yellow-600" />
              <span class="text-yellow-800 font-medium">No restaurants available. Please create a restaurant first.</span>
            </div>
  
            <div v-if="restaurantList.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
              <p class="text-sm text-gray-600 mb-4">
                Select the restaurant that will serve as the default breakfast outlet for calculations:
              </p>
              
              <div class="space-y-2">
                <div
                  v-for="restaurant in restaurantList"
                  :key="'breakfast-outlet-' + restaurant.name"
                  class="flex items-center gap-3 p-3 border rounded-lg hover:bg-violet-50 transition-all cursor-pointer"
                  :class="tempDefaultBreakfastOutlet === restaurant.name ? 'border-violet-500 bg-violet-50' : 'border-gray-200'"
                  @click="tempDefaultBreakfastOutlet = restaurant.name"
                >
                  <input
                    type="radio"
                    :name="'breakfast-outlet-' + restaurant.name"
                    :value="restaurant.name"
                    v-model="tempDefaultBreakfastOutlet"
                    class="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
                  />
                  <div class="flex-1">
                    <span class="font-medium text-gray-900">{{ restaurant.cover_name || restaurant.name }}</span>
                    <p class="text-xs text-gray-500">Restaurant ID: {{ restaurant.name }}</p>
                  </div>
                  <div v-if="tempDefaultBreakfastOutlet === restaurant.name" class="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div v-if="tempDefaultBreakfastOutlet" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-800">
                  <strong>Selected:</strong> {{ restaurantList.find(r => r.name === tempDefaultBreakfastOutlet)?.cover_name || tempDefaultBreakfastOutlet }}
                </p>
              </div>
            </div>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelDefaultBreakfastSettings"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              v-if="restaurantList.length"
              @click="applyDefaultBreakfastSettings"
              :disabled="!tempDefaultBreakfastOutlet"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check class="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Delete Restaurant Modal -->
    <transition name="fade">
      <div
        v-if="showDeleteRestaurantModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-red-600 to-red-700">
            <Delete class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Delete Restaurant</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <div v-if="restaurantToDelete" class="space-y-4">
              <div class="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle class="w-6 h-6 text-red-600" />
                <div>
                  <p class="text-red-800 font-medium">Are you sure you want to delete this restaurant?</p>
                  <p class="text-red-700 text-sm mt-1">{{ restaurantToDelete.cover_name || restaurantToDelete.name }}</p>
                </div>
              </div>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm">
                  <strong>Warning:</strong> This action cannot be undone. All F&B data associated with this restaurant will be permanently removed.
                </p>
              </div>
            </div>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelDeleteRestaurant"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              v-if="restaurantToDelete"
              @click="confirmDeleteRestaurant"
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              <Delete class="w-4 h-4" />
              Delete Restaurant
            </button>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Reset Restaurants Modal -->
    <transition name="fade">
      <div
        v-if="showResetRestaurantsModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <Settings class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Reset Restaurants</h2>
          </div>
  
          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <p class="text-gray-600 mb-4">
              Are you sure you want to reset the restaurant list to the original state? This action cannot be undone.
            </p>
          </div>
  
          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelResetRestaurants"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              @click="confirmResetRestaurants"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted, reactive } from "vue";
  import Sidebar from "@/components/ui/Sidebar.vue";
  import {  
    AlertTriangle, 
    UtensilsCrossed, 
    RefreshCw, 
    ChevronLeft, 
    ChevronRight, 
    Calendar,  
    Settings, 
    X, 
    Check, 
    PlusCircle, 
    FolderOpen, 
    ChevronDown, 
    Calculator,  
    BedDouble,
    Users,
    CircleAlert,
    ArrowLeft,
    Delete,
  } from 'lucide-vue-next';
  import alertService from "@/components/ui/alertService.js";
  import {
    // Core expense calculations
    getVisibleYears,
    getColumnLabels,
    // Data loading and API services
    loadYearOptions,
    loadExpenseData,
    extractAllExpenses,
    // Expense List
    getExpenseList,
    // Expense Field Options
    getExpenseFieldOptions
  } from "@/components/utility/expense_assumption/index.js";
  import { cloneDeep } from 'lodash-es';
  import { saveChanges } from "@/components/utility/expense_assumption/save_changes.js";
  import { 
    createRestaurant, 
    getRestaurants, 
    getDefaultRestaurantRows,
    getFnbCellValue as originalGetFnbCellValue,
    setFnbCellValue,
    handleFnbCellInput,
    handleFnbCellEdit,
    handleFnbCellFocus,
    calculateFnbTotal,
    loadFnbRevenueDataForFrontend,
    saveFnbChanges
  } from "@/components/utility/f&b_revenue_assumpt/index.js";
  import { getMarketSegmentList } from "@/components/utility/room_revenue_assumpt./data_service.js";
  import { MARKET_SEGMENTS } from "@/components/utility/room_revenue_assumpt./market_segments.js";
  import { getDaysInMonth } from "@/components/utility/room_revenue_assumpt./room_revenue_utils.js";
 
  



  // Move totalRooms declaration here
  const totalRooms = ref(0); // Replace 100 with your actual value or make it reactive
  // Reactive state
  const years = ref([]);
  const fromYear = ref("");
  const toYear = ref("");
  const displayMode = ref("monthly");
  const expenses = ref([]);
  const expenseData = ref({});
  const showAdvanced = ref(false);
  const advancedModes = ref({});
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
  // const pendingNavigation = ref(null); // Store the pending navigation action
  const sidebarCollapsed = ref(false);
  const showCreateRestaurantModal = ref(false);
  const newRestaurantName = ref("");
  const isCreatingRestaurant = ref(false);
  const createRestaurantError = ref("");
  
  // Double Occupancy Modal State
  const showDoubleOccupancyModal = ref(false);
  const doubleOccupancyByYear = ref({});
  const tempDoubleOccupancyByYear = ref({});
  
  // Default Breakfast Outlet Modal State
  const showDefaultBreakfastModal = ref(false);
  const defaultBreakfastOutlet = ref("");
  const tempDefaultBreakfastOutlet = ref("");
  
  // Delete Restaurant Modal State
  const showDeleteRestaurantModal = ref(false);
  const restaurantToDelete = ref(null);
  
  // Reset Restaurants Modal State
  const showResetRestaurantsModal = ref(false);
  
  const fnbRows = [
    "Number of rooms",
    "Days of the Month",
    "Number of rooms available",
    "Number of Rooms Sold (excl.)",
    "Occupancy (excl.) %",
    "Double occupancy",
    "Number of guests",
    "Average Spent Per F&B Customer",
    "Average Room Rate",
    "Revenue Per Available Room"
  ]
  const fnbData = reactive({}); // { [rowLabel]: { [year]: { [month]: value, ... } } }
  const originalFnbData = ref({}); // Store original F&B data for comparison
  
  // Debug: Log fnbData initialization
  // console.log('fnbData initialized:', fnbData.value, typeof fnbData.value);
  // const fnbChangedCells = ref([]); // {row, year, label, newValue}
  // const fnbIsSaved = ref(true);
  const restaurantList = ref([]);
  const originalRestaurantList = ref([]); // Store original restaurant list for reset functionality
  const defaultRestaurantRows = getDefaultRestaurantRows();
  const marketSegmentData = ref({});
  
  // Computed properties
  const visibleYears = computed(() => {
    const years = getVisibleYears(fromYear.value, toYear.value);
    return years;
  });
  
  // Check if total rooms is synced with Room Revenue page
  const isSyncedWithRoomRevenue = computed(() => {
    const roomRevenueTotal = localStorage.getItem('totalNumberOfRooms');
    return roomRevenueTotal && parseInt(roomRevenueTotal) > 0 && 
           parseInt(roomRevenueTotal) === totalRooms.value;
  });
  
  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        advancedModes.value[year] = displayMode.value;
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
  
  // Watch for changedCells to update saved state
  watch(changedCells, (newChanges) => {
    if (newChanges.length > 0 && isSaved.value) {
      isSaved.value = false;
    } else if (newChanges.length === 0 && !isSaved.value) {
      // Only mark as saved if there are no changes and the data matches original
      const hasDataChanges = JSON.stringify(fnbData) !== JSON.stringify(originalFnbData.value);
      if (!hasDataChanges) {
        isSaved.value = true;
      }
    }
  }, { deep: true });
  
  // Watch for F&B data changes to track saved state (less aggressive)
  watch(fnbData, (newData, oldData) => {
    // Only check if we have original data to compare against
    if (Object.keys(originalFnbData.value).length > 0) {
      const hasChanges = JSON.stringify(newData) !== JSON.stringify(originalFnbData.value);
      if (hasChanges && isSaved.value) {
        isSaved.value = false;
      }
    }
  }, { deep: true });
  
  // Check for Room Revenue total changes periodically
  setInterval(() => {
    const roomRevenueTotal = localStorage.getItem('totalNumberOfRooms');
    if (roomRevenueTotal && parseInt(roomRevenueTotal) > 0) {
      const newTotal = parseInt(roomRevenueTotal);
      // Only update if the values are different and we're currently synced
      if (newTotal !== totalRooms.value && isSyncedWithRoomRevenue.value) {
        totalRooms.value = newTotal;
        localStorage.setItem('totalRooms', newTotal.toString());
        alertService.info(`Room Revenue total changed to ${newTotal}. F&B total updated automatically.`);
      }
    }
  }, 3000);
  
  // When opening the modal, copy the current settings
  watch(showAdvanced, (val) => {
    if (val) {
      tempAdvancedModes.value = { ...advancedModes.value };
    }
  });
  
  // When opening the double occupancy modal, copy the current settings
  watch(showDoubleOccupancyModal, (val) => {
    if (val) {
      tempDoubleOccupancyByYear.value = { ...doubleOccupancyByYear.value };
    }
  });
  
  // When opening the default breakfast outlet modal, copy the current setting
  watch(showDefaultBreakfastModal, (val) => {
    if (val) {
      tempDefaultBreakfastOutlet.value = defaultBreakfastOutlet.value;
    }
  });
  
  function applyAdvancedSettings() {
    advancedModes.value = { ...tempAdvancedModes.value };
    showAdvanced.value = false;
  }
  
  function cancelAdvancedSettings() {
    showAdvanced.value = false;
  }
  
  function applyDoubleOccupancySettings() {
    doubleOccupancyByYear.value = { ...tempDoubleOccupancyByYear.value };
    // Save to localStorage for persistence
    localStorage.setItem('doubleOccupancyByYear', JSON.stringify(doubleOccupancyByYear.value));
    showDoubleOccupancyModal.value = false;
  }
  
  function cancelDoubleOccupancySettings() {
    showDoubleOccupancyModal.value = false;
  }
  
  function applyDefaultBreakfastSettings() {
    defaultBreakfastOutlet.value = tempDefaultBreakfastOutlet.value;
    // Save to localStorage for persistence
    localStorage.setItem('defaultBreakfastOutlet', defaultBreakfastOutlet.value);
    showDefaultBreakfastModal.value = false;
    alertService.success('Default breakfast outlet updated successfully!');
  }
  
  function cancelDefaultBreakfastSettings() {
    showDefaultBreakfastModal.value = false;
  }
  
  // Input validation functions
  function allowOnlyNumbers(event) {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    const allowedKeys = [8, 9, 27, 13, 46, 110, 190]; // backspace, tab, escape, enter, delete, decimal
    const allowedKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // 0-9
    
    if (allowedKeys.includes(event.keyCode) || allowedKeyCodes.includes(event.keyCode)) {
      return;
    }
    
    // Prevent the input
    event.preventDefault();
  }
  
  function handleDoubleOccupancyInput(event, year) {
    // Remove any non-numeric characters except decimal point
    let value = event.target.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Update the value
    tempDoubleOccupancyByYear.value[year] = value;
  }
  
  // On mount, initialize years from localStorage if available
  onMounted(async () => {
    try {
      years.value = await loadYearOptions();
      expenseData.value = await loadExpenseData();
      originalExpenseData.value = cloneDeep(expenseData.value); // Store original
      expenses.value = extractAllExpenses(expenseData.value);
      expenseOptions.value = (await getExpenseList())?.map(name => ({ label: name, value: name })) || [];
      
      // Use the options API for modal dropdowns (shows all available options)
      const fieldOptions = await getExpenseFieldOptions();
      categoryOptions.value = fieldOptions.hospitality_category.map(category => ({ label: category, value: category }));
      costTypeOptions.value = fieldOptions.cost_type.map(costType => ({ label: costType, value: costType }));
      
      // Restore years from localStorage
      fromYear.value = localStorage.getItem('fnbRevenueFromYear') || "";
      toYear.value = localStorage.getItem('fnbRevenueToYear') || "";
      isSaved.value = true;
      restaurantList.value = await getRestaurants();
      originalRestaurantList.value = [...restaurantList.value]; // Store original list for reset functionality
      
      // Load F&B revenue data
      try {
        const fnbRevenueData = await loadFnbRevenueDataForFrontend();
        Object.assign(fnbData, fnbRevenueData);
        originalFnbData.value = cloneDeep(fnbRevenueData); // Store original
      } catch (error) {
        console.error('Error loading F&B revenue data:', error);
        // Initialize empty fnbData if loading fails
        Object.assign(fnbData, {});
        originalFnbData.value = {};
      }
      
      // Load total rooms from localStorage
      const savedRooms = localStorage.getItem('totalRooms');
      if (savedRooms) {
        totalRooms.value = parseInt(savedRooms) || 100;
      }
      // Fetch market segment data for cross-table reference
      marketSegmentData.value = await getMarketSegmentList();
      
      // Load double occupancy data from localStorage
      const savedDoubleOccupancy = localStorage.getItem('doubleOccupancyByYear');
      if (savedDoubleOccupancy) {
        try {
          doubleOccupancyByYear.value = JSON.parse(savedDoubleOccupancy);
        } catch (error) {
          console.error('Error parsing double occupancy data:', error);
        }
      }
      
      // Load default breakfast outlet from localStorage
      const savedDefaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      if (savedDefaultBreakfastOutlet) {
        defaultBreakfastOutlet.value = savedDefaultBreakfastOutlet;
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });
  
  // Watchers to persist year selection
  watch(fromYear, (newValue) => {
    localStorage.setItem('fnbRevenueFromYear', newValue);
  });
  watch(toYear, (newValue) => {
    localStorage.setItem('fnbRevenueToYear', newValue);
  });
  
  // Watch for total rooms changes to persist to localStorage
  watch(totalRooms, (newValue) => {
    localStorage.setItem('totalRooms', newValue.toString());
    // Total rooms changes don't trigger unsaved state
  });
  
  function clearYearSelection() {
    fromYear.value = "";
    toYear.value = "";
    localStorage.removeItem('fnbRevenueFromYear');
    localStorage.removeItem('fnbRevenueToYear');
    isSaved.value = false;
  }
  

  
  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    await saveFnbChanges(changedCells, isSaving, saveError, fnbData, originalFnbData, isSaved, loadFnbRevenueDataForFrontend);
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
  
  // Refresh table functionality
  async function refreshTable() {
    try {
      // Reload expense data
      expenseData.value = await loadExpenseData();
      originalExpenseData.value = cloneDeep(expenseData.value);
      expenses.value = extractAllExpenses(expenseData.value);
      
      // Reload F&B revenue data
      try {
        const fnbRevenueData = await loadFnbRevenueDataForFrontend();
        Object.assign(fnbData, fnbRevenueData);
        originalFnbData.value = cloneDeep(fnbRevenueData); // Update original
      } catch (error) {
        console.error('Error loading F&B revenue data:', error);
        Object.assign(fnbData, {});
        originalFnbData.value = {};
      }
      
      // Reload restaurant list
      restaurantList.value = await getRestaurants();
      originalRestaurantList.value = [...restaurantList.value]; // Update original list
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      
      alertService.success("Page refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      alertService.error("Failed to refresh data. Please try again.");
    }
  }
  
  async function handleCreateRestaurant() {
    if (!newRestaurantName.value.trim()) {
      createRestaurantError.value = "Restaurant name is required.";
      return;
    }
    isCreatingRestaurant.value = true;
    createRestaurantError.value = "";
    const result = await createRestaurant({ cover_name: newRestaurantName.value });
    isCreatingRestaurant.value = false;
    if (result.success) {
      alertService.success("Restaurant created successfully!");
      showCreateRestaurantModal.value = false;
      newRestaurantName.value = "";
      // Refresh restaurant list to include the new restaurant
      restaurantList.value = await getRestaurants();
    } else {
      createRestaurantError.value = result.error || "Failed to create restaurant.";
    }
  }

  // Collapsed years state
  const collapsedYears = ref([]);
  function isYearCollapsed(year) {
    return collapsedYears.value.includes(year);
  }
  function toggleCollapse(year) {
    if (isYearCollapsed(year)) {
      collapsedYears.value = collapsedYears.value.filter(y => y !== year);
    } else {
      collapsedYears.value.push(year);
    }
  }

  function getColumnLabelsForYearLocal(year) {
    return getColumnLabels(advancedModes.value[year] || displayMode.value);
  }

  // Handle total rooms input change
  function handleTotalRoomsChange(event) {
    const value = parseInt(event.target.value) || 0;
    if (value < 1) {
      totalRooms.value = 1;
    } else {
      totalRooms.value = value;
    }
    // Total rooms changes don't trigger unsaved state
  }

  // Handle total rooms input blur (when user finishes editing)
  function handleTotalRoomsBlur(event) {
    const value = parseInt(event.target.value) || 1;
    totalRooms.value = Math.max(1, value);
    // Save to localStorage for persistence
    localStorage.setItem('totalRooms', totalRooms.value.toString());
  }
  
  // Sync with Room Revenue total
  function syncWithRoomRevenue() {
    const roomRevenueTotal = localStorage.getItem('totalNumberOfRooms');
    if (roomRevenueTotal && parseInt(roomRevenueTotal) > 0) {
      const newTotal = parseInt(roomRevenueTotal);
      totalRooms.value = newTotal;
      localStorage.setItem('totalRooms', newTotal.toString());
      alertService.success(`Synced With Room Revenue Room Total`);
    } else {
      alertService.warning('No Room Revenue total found. Please set a total in the Room Revenue page first.');
    }
  }

  // Utility to compute Total Occupied Room for a year/month from marketSegmentData
  function getTotalOccupiedRoomFromMarketSegmentation(year, month) {
    if (!marketSegmentData.value || !year || !month) return undefined;
    let total = 0;
    for (const seg of MARKET_SEGMENTS) {
      if (seg.segment_category === "OTHER ROOMS REVENUE") continue;
      const value = Number(
        marketSegmentData.value?.[year]?.[seg.market_segment]?.[month]?.room_nights || 0
      );
      total += value;
    }
    return total > 0 ? total : undefined;
  }

  function isRoomsSoldEditable(year, label) {
    const val = getTotalOccupiedRoomFromMarketSegmentation(year, label);
    return !val || val === 0;
  }

  // Patch getFnbCellValue for 'Number of Rooms Sold (excl.)' row
  function getFnbCellValue(fnbData, row, year, label, totalRooms) {
    if (row === "Number of Rooms Sold (excl.)") {
      // Prefer user override if present
      const userRaw = fnbData?.[row]?.[year]?.[label];
      if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
        let num = parseFloat(userRaw.toString().replace(/,/g, ''));
        if (isNaN(num)) num = 0;
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      // Otherwise, fallback to market segment value
      const val = getTotalOccupiedRoomFromMarketSegmentation(year, label);
      if (val && val > 0) {
        return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      }
      // fallback to 0
      return "0";
    }
    if (row === "Occupancy (excl.) %") {
      // Check if there's occupancy data available from Market Segmentation table
      // First, check if we have any room nights data for this year/month
      let hasMarketSegmentData = false;
      let occupied = 0;
      
      if (marketSegmentData.value && year && label) {
        // Sum all segments except OTHER ROOMS REVENUE
        for (const seg of MARKET_SEGMENTS) {
          if (seg.segment_category === "OTHER ROOMS REVENUE") continue;
          const value = Number(
            marketSegmentData.value?.[year]?.[seg.market_segment]?.[label]?.room_nights || 0
          );
          occupied += value;
          if (value > 0) {
            hasMarketSegmentData = true;
          }
        }
      }
      
      // If we have market segment data, calculate occupancy using the same logic as Market Segmentation table
      if (hasMarketSegmentData && typeof getDaysInMonth === 'function' && totalRooms) {
        const days = getDaysInMonth(year, label);
        const available = days * totalRooms;
        if (available > 0) {
          const percent = (occupied / available) * 100;
          return percent.toFixed(2) + '%';
        }
      }
      
      // If no market segment data available, fall back to original calculation or user input
      const userRaw = fnbData?.[row]?.[year]?.[label];
      if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
        return userRaw.toString();
      }
      
      // Final fallback: calculate from available data
      let available = 0;
      if (typeof getDaysInMonth === 'function' && totalRooms) {
        const days = getDaysInMonth(year, label);
        available = days * totalRooms;
      }
      let percent = 0;
      if (available > 0) {
        percent = (occupied / available) * 100;
      }
      return percent.toFixed(2) + '%';
    }
    if (row === "Double occupancy") {
      // Use the double occupancy value from the modal settings
      const doubleOccupancyValue = doubleOccupancyByYear.value[year];
      if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null) {
        return doubleOccupancyValue.toFixed(2);
      }
      // Fallback to user input if no modal setting
      const userRaw = fnbData?.[row]?.[year]?.[label];
      if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
        return userRaw.toString();
      }
      // Default fallback
      return "0.00";
    }
    if (row === "Number of guests") {
      // Calculate: Double occupancy × Number of rooms available
      // Get double occupancy value
      let doubleOccupancy = 0;
      const doubleOccupancyValue = doubleOccupancyByYear.value[year];
      if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null) {
        doubleOccupancy = parseFloat(doubleOccupancyValue);
      } else {
        // Fallback to user input if no modal setting
        const userRaw = fnbData?.["Double occupancy"]?.[year]?.[label];
        if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
          doubleOccupancy = parseFloat(userRaw.toString().replace(/,/g, ''));
        }
      }
      
      // Get number of rooms available
      let roomsAvailable = 0;
      if (typeof getDaysInMonth === 'function' && totalRooms) {
        const days = getDaysInMonth(year, label);
        roomsAvailable = days * totalRooms;
      }
      
      // Calculate number of guests
      const numberOfGuests = doubleOccupancy * roomsAvailable;
      return numberOfGuests.toFixed(2);
    }
    if (row === "Average Room Rate") {
      // Use the exact same calculation as the Market Segmentation table's ADR row
      // This replicates the getADRTotal function from MarketSegmentationTables.vue
      let totalRevenue = 0;
      let totalOccupied = 0;
      
      if (marketSegmentData.value && year && label) {
        // Sum all segments except OTHER ROOMS REVENUE
        for (const seg of MARKET_SEGMENTS) {
          if (seg.segment_category === "OTHER ROOMS REVENUE") continue;
          
          // Get room rate and room nights for this segment
          const roomRate = parseFloat(marketSegmentData.value?.[year]?.[seg.market_segment]?.[label]?.room_rate || 0);
          const roomNights = Number(marketSegmentData.value?.[year]?.[seg.market_segment]?.[label]?.room_nights || 0);
          
          if (roomRate > 0 && roomNights > 0) {
            // Calculate ADR for this segment using the same formula as Market Segmentation table
            // Get VAT, Breakfast, Exchange Rate for the year (default values if not set)
            const VAT = parseFloat(localStorage.getItem('vatByYear') ? JSON.parse(localStorage.getItem('vatByYear'))[year] : 1) || 1;
            const Breakfast_Rate = parseFloat(localStorage.getItem('breakfastByYear') ? JSON.parse(localStorage.getItem('breakfastByYear'))[year] : 0) || 0;
            const exchange_rate = parseFloat(localStorage.getItem('exchangeRateByYear') ? JSON.parse(localStorage.getItem('exchangeRateByYear'))[year] : 1) || 1;
            
            // Calculate ADR using the same formula as Market Segmentation table
            const adr = ((roomRate * (1 + VAT / 100)) + Breakfast_Rate) * exchange_rate;
            totalRevenue += adr * roomNights;
            totalOccupied += roomNights;
          }
        }
      }
      
      // If we have market segment data with occupied rooms, calculate weighted average ADR
      if (totalOccupied > 0) {
        const adr = totalRevenue / totalOccupied;
        return adr.toFixed(2);
      }
      
      // If no market segment data available, fall back to user input
      const userRaw = fnbData?.[row]?.[year]?.[label];
      if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
        return userRaw.toString();
      }
      
      // Default fallback
      return "0.00";
    }
    if (row === "Revenue Per Available Room") {
      // Calculate: Occupancy (excl.) % × Average Room Rate
      
      // Get Occupancy (excl.) % value
      let occupancyPercent = 0;
      const occupancyValue = getFnbCellValue(fnbData, "Occupancy (excl.) %", year, label, totalRooms);
      if (occupancyValue && occupancyValue !== "0.00%") {
        // Remove % and convert to decimal
        occupancyPercent = parseFloat(occupancyValue.replace('%', '')) / 100;
      }
      
      // Get Average Room Rate value
      let averageRoomRate = 0;
      const roomRateValue = getFnbCellValue(fnbData, "Average Room Rate", year, label, totalRooms);
      if (roomRateValue && roomRateValue !== "0.00") {
        averageRoomRate = parseFloat(roomRateValue);
      }
      
      // Calculate Revenue Per Available Room
      const revpar = occupancyPercent * averageRoomRate;
      return revpar.toFixed(2);
    }
    // fallback to original logic for other rows
    // Add debug for Total Cover row
    try {
      const rowKeyObj = JSON.parse(row);
      if (rowKeyObj && rowKeyObj.type === 'Total Cover') {
        const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
        if (defaultBreakfastOutlet === rowKeyObj.restaurant) {
          // For default breakfast outlet, log all input values
          const days = typeof getDaysInMonth === 'function' ? getDaysInMonth(year, label) : 0;
          const totalRoomsValue = totalRooms?.value || totalRooms || 0; // Handle both ref and direct value
          const roomsAvailable = days * totalRoomsValue;
          const doubleOccupancyByYear = JSON.parse(localStorage.getItem('doubleOccupancyByYear') || '{}');
          const doubleOccupancyValue = doubleOccupancyByYear[year];
          let doubleOccupancy = 0;
          if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null) {
            doubleOccupancy = parseFloat(doubleOccupancyValue);
          }
          const breakfastCovers = doubleOccupancy * roomsAvailable;
          // console.debug('[getFnbCellValue] Default Breakfast Outlet:', rowKeyObj.restaurant, 'Year:', year, 'Label:', label, 'days:', days, 'totalRooms:', totalRoomsValue, 'roomsAvailable:', roomsAvailable, 'doubleOccupancy:', doubleOccupancy, 'breakfastCovers:', breakfastCovers);
        }
      }
    } catch (e) {
      // Not a structured row key, skip
    }
    return originalGetFnbCellValue(fnbData, row, year, label, totalRooms?.value || totalRooms);
  }

  // After data refresh or load, ensure fnbData is always an object
  watch(expenseData, () => {
    // console.log('expenseData watcher triggered, fnbData before:', fnbData, typeof fnbData);
    if (!fnbData || typeof fnbData !== 'object') {
      console.log('fnbData is invalid, resetting to empty object');
      fnbData = {};
    }
    // console.log('fnbData after:', fnbData, typeof fnbData);
  });

  // Helper function to check if a row is auto-calculated
  function isAutoCalculatedRow(row) {
    return row === 'Monthly Cover' || 
           row === 'Lunch food revenue' || 
           row === 'Lunch beverage revenue' || 
           row === 'Lunch Revenue' ||
           row === 'Dinner food revenue' || 
           row === 'Dinner beverage revenue' ||
           row === 'Dinner Revenue' ||
           row === 'Average Spent Per F&B Customer';
  }
  
  // Helper function to check if a specific restaurant row is auto-calculated
  function isRestaurantRowAutoCalculated(restaurant, section, row) {
    // Check if this is Breakfast Covers for the default breakfast outlet
    if (row === 'Breakfast Covers' && section === 'Breakfast Revenue') {
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      return defaultBreakfastOutlet === restaurant;
    }
    
    // Check if this is Breakfast Revenue for the default breakfast outlet
    if (row === 'Breakfast Revenue' && section === 'Breakfast Revenue') {
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      return defaultBreakfastOutlet === restaurant;
    }
    
    // Check if this is Average check breakfast for the default breakfast outlet
    if (row === 'Average check breakfast' && section === 'Breakfast Revenue') {
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      return defaultBreakfastOutlet === restaurant;
    }
    
    // For other rows, use the general auto-calculated check
    return isAutoCalculatedRow(row);
  }

  // Wrapper function to handle cell input with proper reactive reference
  function handleFnbCellInputWrapper(params) {
    // console.log('handleFnbCellInputWrapper called with:', params);
    const result = handleFnbCellInput({ ...params, fnbData });
    
    // Manually track the change to ensure saved state is updated
    if (params.event && params.event.target) {
      const value = params.event.target.innerText.replace(/[^\d.]/g, '');
      const numValue = parseFloat(value) || 0;
      const newValue = numValue.toFixed(2);
      
      // console.log('Cell input change detected:', { row: params.row, year: params.year, label: params.label, newValue });
      
      // Add to changedCells if not already present
      const existingChange = changedCells.value.find(c => 
        c.row === params.row && c.year === params.year && c.label === params.label
      );
      
      if (!existingChange) {
        changedCells.value.push({ 
          row: params.row, 
          year: params.year, 
          label: params.label, 
          newValue 
        });
        // console.log('Added new change to changedCells, total changes:', changedCells.value.length);
      } else {
        existingChange.newValue = newValue;
        // console.log('Updated existing change in changedCells');
      }
      
      // Mark as unsaved
      if (isSaved.value) {
        isSaved.value = false;
        console.log('Marked as unsaved');
      }
    }
    
    return result;
  }
  
  // Wrapper function to handle cell edit with proper reactive reference
  function handleFnbCellEditWrapper(params) {
    const result = handleFnbCellEdit({ ...params, fnbData });
    
    // Manually track the change to ensure saved state is updated
    if (params.event && params.event.target) {
      const value = params.event.target.innerText.replace(/[^\d.]/g, '');
      const numValue = parseFloat(value) || 0;
      const newValue = numValue.toFixed(2);
      
      // Add to changedCells if not already present
      const existingChange = changedCells.value.find(c => 
        c.row === params.row && c.year === params.year && c.label === params.label
      );
      
      if (!existingChange) {
        changedCells.value.push({ 
          row: params.row, 
          year: params.year, 
          label: params.label, 
          newValue 
        });
      } else {
        existingChange.newValue = newValue;
      }
      
      // Mark as unsaved
      if (isSaved.value) {
        isSaved.value = false;
      }
    }
    
    return result;
  }

  // Function to calculate total covers across all restaurants
  function calculateTotalCovers(year, label) {
    let total = 0;
    for (const restaurant of restaurantList.value) {
      const restaurantTotalCover = getFnbCellValue(
        fnbData, 
        JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Cover'}), 
        year, 
        label, 
        totalRooms?.value || totalRooms
      );
      // console.debug('[TotalCovers] Restaurant:', restaurant.name, 'Total Cover:', restaurantTotalCover, 'Year:', year, 'Label:', label);
      total += parseFloat((restaurantTotalCover || '0').toString().replace(/,/g, '')) || 0;
    }
    // console.debug('[TotalCovers] Final Total:', total, 'Year:', year, 'Label:', label);
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Function to calculate total food revenue across all restaurants
  function calculateTotalFoodRevenue(year, label) {
    let total = 0;
    for (const restaurant of restaurantList.value) {
      const restaurantTotalFoodRevenue = getFnbCellValue(
        fnbData, 
        JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Food Revenue'}), 
        year, 
        label, 
        totalRooms?.value || totalRooms
      );
      total += parseFloat((restaurantTotalFoodRevenue || '0').toString().replace(/,/g, '')) || 0;
    }
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Function to calculate total beverage revenue across all restaurants
  function calculateTotalBeverageRevenue(year, label) {
    let total = 0;
    for (const restaurant of restaurantList.value) {
      const restaurantTotalBeverageRevenue = getFnbCellValue(
        fnbData, 
        JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Beverage Revenue'}), 
        year, 
        label, 
        totalRooms?.value || totalRooms
      );
      total += parseFloat((restaurantTotalBeverageRevenue || '0').toString().replace(/,/g, '')) || 0;
    }
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Function to calculate total F&B revenue across all restaurants
  function calculateTotalFnbRevenue(year, label) {
    let total = 0;
    for (const restaurant of restaurantList.value) {
      const restaurantTotalRevenue = getFnbCellValue(
        fnbData, 
        JSON.stringify({restaurant: restaurant.name, section: 'Total', type: 'Total Revenue'}), 
        year, 
        label, 
        totalRooms?.value || totalRooms
      );
      total += parseFloat((restaurantTotalRevenue || '0').toString().replace(/,/g, '')) || 0;
    }
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // Calculation for Average Spent Per F&B Customer
  function getAverageSpentPerFnbCustomer(year, label) {
    // Total F&B Revenue
    const totalFnbRevenue = parseFloat((calculateTotalFnbRevenue(year, label) || '0').toString().replace(/,/g, '')) || 0;
    // Total Covers
    const totalCovers = parseFloat((calculateTotalCovers(year, label) || '0').toString().replace(/,/g, '')) || 0;
    if (totalCovers === 0) return '0.00';
    const avg = totalFnbRevenue / totalCovers;
    return avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function deleteRestaurant(restaurant) {
    // Remove restaurant from the list
    restaurantList.value = restaurantList.value.filter(r => r.name !== restaurant.name);
    
    // Clear any F&B data associated with this restaurant
    const restaurantDataKeys = Object.keys(fnbData).filter(key => {
      try {
        const rowKeyObj = JSON.parse(key);
        return rowKeyObj && rowKeyObj.restaurant === restaurant.name;
      } catch (e) {
        return false;
      }
    });
    
    restaurantDataKeys.forEach(key => {
      delete fnbData[key];
    });
    
    // Clear default breakfast outlet if it was this restaurant
    if (defaultBreakfastOutlet.value === restaurant.name) {
      defaultBreakfastOutlet.value = "";
      localStorage.removeItem('defaultBreakfastOutlet');
    }
    
    // Mark as unsaved
    isSaved.value = false;
    
    alertService.success(`Restaurant "${restaurant.cover_name || restaurant.name}" deleted successfully!`);
  }

  async function resetToDefaultRestaurants() {
    try {
      // Reload restaurants from the server (this gets the original list)
      const originalRestaurants = await getRestaurants();
      
      // Update the restaurant list
      restaurantList.value = [...originalRestaurants];
      originalRestaurantList.value = [...originalRestaurants];
      
      // Clear any F&B data for restaurants that no longer exist
      const currentRestaurantNames = originalRestaurants.map(r => r.name);
      const restaurantDataKeys = Object.keys(fnbData).filter(key => {
        try {
          const rowKeyObj = JSON.parse(key);
          return rowKeyObj && rowKeyObj.restaurant && !currentRestaurantNames.includes(rowKeyObj.restaurant);
        } catch (e) {
          return false;
        }
      });
      
      restaurantDataKeys.forEach(key => {
        delete fnbData[key];
      });
      
      // Clear default breakfast outlet if it no longer exists
      if (defaultBreakfastOutlet.value && !currentRestaurantNames.includes(defaultBreakfastOutlet.value)) {
        defaultBreakfastOutlet.value = "";
        localStorage.removeItem('defaultBreakfastOutlet');
      }
      
      // Mark as unsaved
      isSaved.value = false;
      
      alertService.success('Restaurant list reset to original successfully!');
    } catch (error) {
      console.error('Error resetting restaurants:', error);
      alertService.error('Failed to reset restaurant list. Please try again.');
    }
  }

  function cancelDeleteRestaurant() {
    showDeleteRestaurantModal.value = false;
    restaurantToDelete.value = null;
  }

  function confirmDeleteRestaurant() {
    if (restaurantToDelete.value) {
      deleteRestaurant(restaurantToDelete.value);
      showDeleteRestaurantModal.value = false;
      restaurantToDelete.value = null;
    }
  }

  function cancelResetRestaurants() {
    showResetRestaurantsModal.value = false;
  }

  function confirmResetRestaurants() {
    resetToDefaultRestaurants();
    showResetRestaurantsModal.value = false;
  }
  </script>
  
  
  


  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .editable-cell:focus {
    outline: 2px solid #7c3aed;
    background: #fff;
  }
  
  /* Style for the total rooms input */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  /* Custom styling for the rooms input */
  .rooms-input {
    padding-right: 4rem !important;
  }
  
  .rooms-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }
  </style>
  