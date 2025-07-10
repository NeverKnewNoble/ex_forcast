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
              <div class="mb-4">
                  <button
                    @click="showCreateRestaurantModal = true"
                  class="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                  >
                    <PlusCircle class="w-4 h-4" />
                    Create Restaurant
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
                        <tr v-for="row in fnbRows" :key="'fnb-row-' + row" 
                            :class="[
                              'even:bg-gray-50 hover:bg-violet-50 transition-all duration-200 border-b border-gray-100',
                              (row === 'Number of rooms' || row === 'Days of the Month' || row === 'Number of rooms available' || row === 'Number of Rooms Sold (excl.)' || row === 'Occupancy (excl.) %' || row === 'Number of guests' || row === 'Average Room Rate' || row === 'Revenue Per Available Room') ? 'bg-violet-50/30' : ''
                            ]"
                        >
                          <td class="px-4 py-2 font-medium border-r border-violet-200 flex items-center justify-between">
                            <span>{{ row }}</span>
                            <span v-if="row === 'Number of rooms' || row === 'Days of the Month' || row === 'Number of rooms available' || row === 'Number of Rooms Sold (excl.)' || row === 'Occupancy (excl.) %' || row === 'Number of guests' || row === 'Average Room Rate' || row === 'Revenue Per Available Room'" class="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                              Auto
                            </span>
                          </td>
                          <template v-for="year in visibleYears" :key="'row-' + year + '-' + row">
                            <template v-if="!isYearCollapsed(year)">
                              <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'cell-' + year + '-' + label + '-' + row"
                                :contenteditable="row !== 'Number of rooms' && row !== 'Days of the Month' && row !== 'Number of rooms available' && row !== 'Number of Rooms Sold (excl.)' && row !== 'Occupancy (excl.) %' && row !== 'Number of guests' && row !== 'Average Room Rate' && row !== 'Revenue Per Available Room'"
                              class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 editable-cell font-mono text-xs"
                                :class="{ 'bg-violet-50 cursor-not-allowed': row === 'Number of rooms' || row === 'Days of the Month' || row === 'Number of rooms available' || row === 'Number of Rooms Sold (excl.)' || row === 'Occupancy (excl.) %' || row === 'Number of guests' || row === 'Average Room Rate' || row === 'Revenue Per Available Room' }"
                                @input="(row !== 'Number of rooms' && row !== 'Days of the Month' && row !== 'Number of rooms available' && row !== 'Number of Rooms Sold (excl.)' && row !== 'Occupancy (excl.) %' && row !== 'Number of guests' && row !== 'Average Room Rate' && row !== 'Revenue Per Available Room') ? handleFnbCellInput(fnbData.value, { row, year, label, event: $event }) : null"
                                @keypress="(row !== 'Number of rooms' && row !== 'Days of the Month' && row !== 'Number of rooms available' && row !== 'Number of Rooms Sold (excl.)' && row !== 'Occupancy (excl.) %' && row !== 'Number of guests' && row !== 'Average Room Rate' && row !== 'Revenue Per Available Room') ? allowOnlyNumbers($event) : null"
                              >
                                <span class="font-mono text-xs">{{ getFnbCellValue(fnbData.value, row, year, label, totalRooms) }}</span>
                              </td>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700">
                                  {{ calculateFnbTotal(fnbData.value, row, year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                </span>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                <span class="font-mono text-xs text-violet-700">
                                  {{ calculateFnbTotal(fnbData.value, row, year, getColumnLabelsForYearLocal(year), totalRooms) }}
                                </span>
                              </td>
                            </template>
                          </template>
                        </tr>
                        <!-- Two empty rows for spacing -->
                        <tr>
                          <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                        </tr>
                        <tr>
                          <td class="py-2" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)"></td>
                        </tr>
                        <!-- Restaurants title row (Details column only) -->
                        <tr>
                          <td class="bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800 text-2xl font-bold border-y-2 border-violet-400 py-2 text-left pl-4 align-middle" style="vertical-align: middle;" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)">
                            <UtensilsCrossed class="inline w-6 h-6 mr-2 align-middle text-violet-600" />
                            Restaurants
                          </td>
                        </tr>
                        <!-- Render each restaurant with default rows (Details column only) -->
                        <template v-for="restaurant in restaurantList" :key="restaurant.name">
                          <!-- Restaurant name row -->
                          <tr>
                            <td class="bg-violet-50 text-violet-900 text-lg font-bold border-b border-violet-200 py-2 px-2 pl-4 text-balance" :colspan="1 + visibleYears.length * (getColumnLabelsForYearLocal(visibleYears[0])?.length + 1)">
                              {{ restaurant.cover_name || restaurant.name }}
                            </td>
                          </tr>
                          <template v-for="section in defaultRestaurantRows" :key="section.section">
                            <!-- Section header row -->
                            <tr>
                              <td class="bg-violet-100 text-violet-700 font-semibold border-b border-violet-100 py-2 pl-8">
                                {{ section.section }}
                              </td>
                              <template v-for="year in visibleYears" :key="'section-row-' + restaurant.name + '-' + section.section + '-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'section-row-cell-' + restaurant.name + '-' + section.section + '-' + year + '-' + label"
                                    contenteditable="true"
                                    class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 editable-cell font-mono text-xs"
                                    @input="handleFnbCellInput(fnbData.value, { row: restaurant.name + '-' + section.section + '-' + label, year, label, event: $event })"
                                    @keypress="allowOnlyNumbers($event)"
                                  >
                                    <span class="font-mono text-xs">{{ getFnbCellValue(fnbData.value, restaurant.name + '-' + section.section + '-' + label, year, label) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData.value, restaurant.name + '-' + section.section, year, getColumnLabelsForYearLocal(year)) }}</td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData.value, restaurant.name + '-' + section.section, year, getColumnLabelsForYearLocal(year)) }}</td>
                                </template>
                              </template>
                            </tr>
                            <!-- Section rows -->
                            <tr v-for="row in section.rows" :key="row">
                              <td class="pl-12 py-1 text-gray-700 border-b border-gray-50">
                                {{ row }}
                              </td>
                              <template v-for="year in visibleYears" :key="'section-row-detail-' + restaurant.name + '-' + section.section + '-' + row + '-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'section-row-detail-cell-' + restaurant.name + '-' + section.section + '-' + row + '-' + year + '-' + label"
                                    contenteditable="true"
                                    class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 editable-cell font-mono text-xs"
                                    @input="handleFnbCellInput(fnbData.value, { row: restaurant.name + '-' + section.section + '-' + row + '-' + label, year, label, event: $event })"
                                    @keypress="allowOnlyNumbers($event)"
                                  >
                                    <span class="font-mono text-xs">{{ getFnbCellValue(fnbData.value, restaurant.name + '-' + section.section + '-' + row + '-' + label, year, label) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData.value, restaurant.name + '-' + section.section + '-' + row, year, getColumnLabelsForYearLocal(year)) }}</td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">{{ calculateFnbTotal(fnbData.value, restaurant.name + '-' + section.section + '-' + row, year, getColumnLabelsForYearLocal(year)) }}</td>
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
                                <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'restaurant-total-row-cell-' + restaurant.name + '-' + suffix + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">0.00</td>
                                <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
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
                              <td v-for="label in getColumnLabelsForYearLocal(year)" :key="'total-row-cell-' + totalRow + '-' + year + '-' + label" class="px-2 py-2 text-right border border-violet-200 font-mono text-xs">0.00</td>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
                            </template>
                            <template v-else>
                              <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 font-mono text-xs text-violet-700">0.00</td>
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
  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted } from "vue";
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
    handleFnbCellEditWrapper,
    calculateFnbTotal
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
  const fnbData = ref({}); // { [rowLabel]: { [year]: { [month]: value, ... } } }
  // const fnbChangedCells = ref([]); // {row, year, label, newValue}
  // const fnbIsSaved = ref(true);
  const restaurantList = ref([]);
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
  
  // Refresh table functionality
  async function refreshTable() {
    try {
      // Reload expense data
      expenseData.value = await loadExpenseData();
      originalExpenseData.value = cloneDeep(expenseData.value);
      expenses.value = extractAllExpenses(expenseData.value);
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      
      console.log("Data refreshed successfully");
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
      // Optionally refresh restaurant list here
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
    return originalGetFnbCellValue(fnbData, row, year, label, totalRooms);
  }

  // After data refresh or load, ensure fnbData is always an object
  watch(expenseData, () => {
    if (!fnbData.value || typeof fnbData.value !== 'object') {
      fnbData.value = {};
    }
  });

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
  
  