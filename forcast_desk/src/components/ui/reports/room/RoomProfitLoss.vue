<template>
  <div class="bg-white rounded-lg border border-blue-300 dark:border-blue-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">          
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
                <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                    <Building2 class="w-6 h-6 text-blue-200" />
                    <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
                </td>
            </tr>
            
            <!-- Rooms Section Header Row -->
            <tr class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
                <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <h2 class="text-xl font-semibold tracking-wide">Room Profit & Loss Report</h2>
                </div>
                </td>
            </tr>
            
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-blue-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1"
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
            <tr class="bg-blue-500 dark:bg-blue-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="year + '-' + label">
                    <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-medium">
                      {{ label }}
                    </th>
                    <th class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium text-blue-200">
                      %
                    </th>
                  </template>
                  <th class="px-2 py-1 text-center border border-blue-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-blue-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
              </template>
            </tr>

          </thead>

          <!-- Table Body -->
          <tbody class="text-gray-700 bg-white text-sm dark:text-gray-200 dark:bg-gray-800">
            <!-- Statistics Divider -->
            <tr class="bg-blue-800 border-b-2 border-blue-900">
              <td :colspan="2 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-blue-700">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
              </td>
            </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  NO OF ROOMS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'no-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

            <!-- NO OF DAYS -->
            <tr v-if="hasNoOfDaysData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  NO OF DAYS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'no-days-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'no-days-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNoOfDays(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  AVAILABLE ROOMS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'available-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  SOLD ROOMS (excl. comp)
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'sold-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  ROOM OCCUPANCY %
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'occupancy-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
              </template>
          </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  NUMBER OF GUESTS
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'guests-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

                                                 <!-- NUMBER OF F&B COVERS -->
            <tr v-if="hasCoversData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  NUMBER OF F&B COVERS
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'covers-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'covers-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNumberOfCovers(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

            <!-- AVERAGE F&B SPENT PER COVER -->
            <tr v-if="hasFnbSpentData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  AVERAGE F&B SPENT PER COVER
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-fnb-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'avg-fnb-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getAverageFnbSpent(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

            <!-- AVERAGE ROOM RATE -->
            <tr v-if="hasRoomRateData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  AVERAGE ROOM RATE
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-rate-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'avg-rate-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getAverageRoomRate(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
              </template>
          </tr>

                        <!-- REV PER AVAILABLE ROOM -->
            <tr v-if="hasRevPerRoomData()" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  REVENUE PER AVAILABLE ROOM
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'rev-per-room-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'rev-per-room-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getRevPerAvailableRoom(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1">
                  
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-stats-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-1-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 2 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1">
                  
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-stats-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-2-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Revenue Divider -->
            <tr class="bg-blue-800 border-b-2 border-blue-900">
              <td :colspan="2 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-blue-700">
                <div class="flex items-center ">
                  Rooms Revenue
                </div>
              </td>
            </tr>

            <!-- No Room Revenue Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasRoomRevenueSectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Room Revenue"
              :icon="Bed"
              message="No room revenue data available for the selected period."
            />

            <!-- Market Segmentation Revenue Rows -->
            <template v-if="isMarketSegmentationEnabled()">
              <!-- Dynamic segments from Market Segmentation cache (keys starting with 'Room Revenue:') -->
              <template v-for="segment in roomRevenueSegments" :key="'segment-' + segment">
                <tr v-if="hasSegmentData(segment)" class="bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-200 border-b border-blue-200 dark:border-blue-700">
                  <td class="px-3 py-2 font-medium border-r border-blue-200 dark:border-blue-700">
                    <div class="flex items-center gap-1">
                      {{ segment }}
                    </div>
                  </td>
                  <template v-for="year in visibleYears" :key="'segment-' + segment + '-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <template v-for="label in getColumnLabelsForYear(year)" :key="'segment-cell-' + segment + '-' + year + '-' + label">
                        <td class="px-2 py-1 text-right border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-200">
                          <span class="font-mono text-xs">{{ formatMoney(getSegmentRevenue(year, label, segment)) }}</span>
                        </td>
                        <td class="px-2 py-1 text-right border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-200">
                          <span class="font-mono text-xs text-blue-600">{{ formatPercentage(getSegmentRevenuePercentage(year, label, segment)) }}%</span>
                        </td>
                      </template>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                        <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getSegmentRevenueTotal(year, segment)) }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                        <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getSegmentRevenueTotal(year, segment)) }}</span>
                      </td>
                    </template>
                  </template>
                </tr>
              </template>

              <!-- TOTAL REVENUE -->
              <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
                <td class="px-2 py-1 font-bold border-r border-blue-600">
                  <div class="flex items-center gap-1 text-white">
                    TOTAL REVENUE
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'total-rooms-revenue-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'total-rooms-revenue-cell-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                        <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenue(year, label)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>

              <!-- Empty Row 1 -->
              <tr class="bg-gray-100 border-b border-gray-200">
                <td class="px-3 py-2 border-r border-gray-200">
                  <div class="flex items-center gap-1">
                    
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'empty-row-1-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-row-1-cell-' + year + '-' + label">
                      <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                        
                      </td>
                      <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                </template>
              </tr>

              <!-- Empty Row 2 -->
              <tr class="bg-gray-100 border-b border-gray-200">
                <td class="px-3 py-2 border-r border-gray-200">
                  <div class="flex items-center gap-1">
                    
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'empty-row-2-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-row-2-cell-' + year + '-' + label">
                      <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                        
                      </td>
                      <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Room Packages Revenue Rows (when market segmentation is off) -->
            <template v-if="!isMarketSegmentationEnabled()">
              <!-- Dynamic room types from Room Revenue Assumptions cache (keys starting with 'Room Type:') -->
              <template v-for="pkg in roomTypePackages" :key="'pkg-' + pkg">
                <tr v-if="hasRoomTypeData(pkg)" class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200 border-b border-blue-300 dark:border-blue-700">
                  <td class="px-3 py-2 font-medium border-r border-blue-200 dark:border-blue-700">
                    <div class="flex items-center gap-1">
                      {{ pkg }}
                    </div>
                  </td>
                  <template v-for="year in visibleYears" :key="'pkg-' + pkg + '-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <template v-for="label in getColumnLabelsForYear(year)" :key="'pkg-cell-' + pkg + '-' + year + '-' + label">
                        <td class="px-2 py-1 text-right border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-200">
                          <span class="font-mono text-xs">{{ formatMoney(getRoomTypeRevenue(year, label, pkg)) }}</span>
                        </td>
                        <td class="px-2 py-1 text-right border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-200">
                          <span class="font-mono text-xs text-blue-600">{{ formatPercentage(getRoomTypeRevenuePercentage(year, label, pkg)) }}%</span>
                        </td>
                      </template>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                        <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRoomTypeRevenueTotal(year, pkg)) }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-100 dark:bg-blue-800/30">
                        <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRoomTypeRevenueTotal(year, pkg)) }}</span>
                      </td>
                    </template>
                  </template>
                </tr>
              </template>

              <!-- Total Rooms Revenue -->
              <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
                <td class="px-2 py-1 font-bold border-r border-blue-600">
                  <div class="flex items-center gap-1 text-white">
                    TOTAL ROOMS REVENUE
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'total-rooms-revenue-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'total-rooms-revenue-cell-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                        <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenue(year, label)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Room Expenses Divider -->
            <tr class="bg-blue-800 border-b-2 border-blue-900">
              <td :colspan="2 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-blue-700">
                <div class="flex items-center ">
                  Room Expenses
                </div>
              </td>
            </tr>

            <!-- Expense Sub Header -->
            <tr class="bg-blue-700 border-b border-blue-700">
              <td class="px-3 py-2 font-semibold border-r border-blue-700">
                <div class="flex items-center gap-1 text-white">
                  Expense
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'expense-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'expense-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Expense Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasExpenseSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Expense"
              :icon="DollarSign"
              message="No expense data available for Room department in the selected period."
            />

            <!-- Dynamic Room Department Expenses -->
            <template v-for="exp in roomDepartmentExpenses" :key="'room-expense-' + exp">
              <tr v-if="hasRoomExpenseData(exp)" class="bg-white border-b border-blue-300 dark:border-blue-700">
                <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                  <div class="flex items-center gap-1">
                    {{ exp }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'room-expense-' + exp + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'room-expense-cell-' + exp + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        <span class="font-mono text-xs">{{ formatMoney(getRoomExpenseAmount(year, label, exp)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRoomExpenseTotal(year, exp)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getRoomExpenseTotal(year, exp)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Gross Total Expenses -->
            <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
              <td class="px-3 py-2 font-bold border-r border-blue-600">
                <div class="flex items-center gap-1 text-white">
                  Gross Total Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'gross-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'gross-expenses-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getGrossRoomExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatPercentage(getGrossRoomExpensesPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Payroll Sub Header -->
            <tr class="bg-blue-700 border-b border-blue-700">
              <td class="px-3 py-2 font-semibold border-r border-blue-700">
                <div class="flex items-center gap-1 text-white">
                  Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Payroll Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasPayrollSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Payroll"
              :icon="Bed"
              message="No payroll data available for Room department in the selected period."
            />

            <!-- Payroll: Management Group Header -->
            <tr v-if="hasPayrollGroupData('management')" class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'mgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200"></td>
                    <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management per-location rows -->
            <template v-for="loc in payrollLocationsManagement" :key="'mgmt-loc-' + loc">
              <tr class="bg-white border-b border-blue-300 dark:border-blue-700">
                <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                  <div class="flex items-center gap-1">
                    {{ loc }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'mgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-cell-' + loc + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        <span class="font-mono text-xs">{{ formatMoney(getPayrollMonthlySalaryByLocation(year, label, loc, 'management')) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Payroll: Non-Management Group Header -->
            <tr v-if="hasPayrollGroupData('non-management')" class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200 border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 font-medium border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Non-Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'nonmgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200"></td>
                    <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Non-Management per-location rows -->
            <template v-for="loc in payrollLocationsNonManagement" :key="'nonmgmt-loc-' + loc">
              <tr class="bg-white border-b border-blue-300 dark:border-blue-700">
                <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                  <div class="flex items-center gap-1">
                    {{ loc }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'nonmgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-cell-' + loc + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        <span class="font-mono text-xs">{{ formatMoney(getPayrollMonthlySalaryByLocation(year, label, loc, 'non-management')) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                      <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Total Payroll -->
            <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
              <td class="px-3 py-2 font-bold border-r border-blue-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayroll(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatPercentage(getTotalPayrollPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>


            <!-- Payroll Related Sub Header -->
            <tr class="bg-blue-700 border-b border-blue-700">
              <td class="px-3 py-2 font-semibold border-r border-blue-700">
                <div class="flex items-center gap-1 text-white">
                  Payroll Related
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-related-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-related-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Payroll Related Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasPayrollRelatedSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Payroll Related"
              :icon="Bed"
              message="No payroll related data available for Room department in the selected period."
            />

            <!-- NSSIT Row -->
            <tr v-if="hasPayrollRelatedData('NSSIT')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  NSSIT
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'nssit-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'nssit-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'NSSIT')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Vacation Row -->
            <tr v-if="hasPayrollRelatedData('Vacation')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Vacation
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'vacation-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'vacation-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Vacation')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Relocation Row -->
            <tr v-if="hasPayrollRelatedData('Relocation')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Relocation
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'relocation-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'relocation-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Relocation')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Severence & Indemnity Row -->
            <tr v-if="hasPayrollRelatedData('Severence & Indemnity')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Severence & Indemnity
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'severence-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'severence-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Severence & Indemnity')) }}</span>
                  </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Row -->
            <tr v-if="hasPayrollRelatedData('Other')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Other
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'other-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'other-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Other')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Medical Row -->
            <tr v-if="hasPayrollRelatedData('Medical')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Medical
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'medical-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'medical-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Medical')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Uniforms Row -->
            <tr v-if="hasPayrollRelatedData('Uniforms')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Uniforms
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'uniforms-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'uniforms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Uniforms')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Employee Meal Row -->
            <tr v-if="hasPayrollRelatedData('Employee Meal')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Employee Meal
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'employee-meal-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'employee-meal-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Employee Meal')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Transport Row -->
            <tr v-if="hasPayrollRelatedData('Transport')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Transport
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'transport-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'transport-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Transport')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Telephone Row -->
            <tr v-if="hasPayrollRelatedData('Telephone')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Telephone
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'telephone-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'telephone-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Telephone')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Air Ticket Row -->
            <tr v-if="hasPayrollRelatedData('Air Ticket')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Air Ticket
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'air-ticket-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'air-ticket-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Air Ticket')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
  </td>
                </template>
              </template>
            </tr>

            <!-- Other Benefits Row -->
            <tr v-if="hasPayrollRelatedData('Other Benefits')" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Other Benefits
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'other-benefits-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'other-benefits-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollRelatedValue(year, label, 'Other Benefits')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-200 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Payroll Related Expenses -->
            <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
              <td class="px-3 py-2 font-bold border-r border-blue-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll Related Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-related-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-related-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatPercentage(getTotalPayrollRelatedExpensesPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Bonus Sub Header -->
            <tr class="bg-blue-700 border-b border-blue-700">
              <td class="px-3 py-2 font-semibold border-r border-blue-700">
                <div class="flex items-center gap-1 text-white">
                  Bonus
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                    <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-700 bg-blue-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Bonus Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasBonusSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Bonus"
              :icon="Bed"
              message="No bonus data available for Room department in the selected period."
            />

            <!-- Bonus Details Row -->
            <tr v-if="hasBonusData()" class="bg-white border-b border-blue-300 dark:border-blue-700">
              <td class="px-3 py-2 border-r border-blue-300 dark:border-blue-700">
                <div class="flex items-center gap-1">
                  Bonus Details
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-details-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-details-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs">{{ formatMoney(getBonusValue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                      <span class="font-mono text-xs text-blue-600">{{ formatPercentage(getBonusPercentage(year, label)) }}%</span>
                      <!-- Debug: {{ getBonusValue(year, label) }} / {{ getBonusTotal(year) }} = {{ getBonusPercentage(year, label) }}% -->
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-200">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getBonusTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 dark:border-blue-700 bg-white">
                    <span class="font-mono text-xs text-blue-700 dark:text-blue-300">{{ formatMoney(getBonusTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1">
                  
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-row-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100">
                    
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL EXPENSES Row -->
            <tr class="bg-blue-700 border-b-2 border-blue-800">
              <td class="px-3 py-2 font-bold border-r border-blue-800">
                <div class="flex items-center gap-1 text-white">
                  TOTAL EXPENSES
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-expenses-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-800 font-semibold bg-blue-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-800 font-semibold bg-blue-700">
                      <span class="font-mono text-xs text-blue-200">{{ formatPercentage(getTotalExpensesPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-800 font-bold bg-blue-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-800 font-bold bg-blue-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- DEPARTMENTAL INCOME (LOSS) Row -->
            <tr class="bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000 border-b-2 border-blue-600">
              <td class="px-3 py-2 font-bold border-r border-blue-600">
                <div class="flex items-center gap-1 text-white">
                  DEPARTMENTAL INCOME (LOSS)
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'departmental-income-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'departmental-income-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getDepartmentalIncome(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-600 font-semibold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-blue-200">{{ formatPercentage(getDepartmentalIncomePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getDepartmentalIncomeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-600 font-bold bg-blue-500 dark:bg-blue-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getDepartmentalIncomeYear(year)) }}</span>
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



<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/_master_utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Building2,
  Bed,
  DollarSign
} from 'lucide-vue-next';
import { loadExpenseData } from '@/components/utility/expense_assumption/index.js';
import reportDataService from '@/components/utility/reports/reportDataService.js';
import ReportSectionNoDataRow from '@/components/ui/reports/general/ReportSectionNoDataRow.vue';

// Props
const props = defineProps({
  visibleYears: {
    type: Array,
    required: true
  }
});

// Store and cache
const yearSettingsStore = useYearSettingsStore();
const { advancedModes } = storeToRefs(yearSettingsStore);
const calculationCache = useCalculationCache();

// Market segmentation utility function
function isMarketSegmentationEnabled() {
  try {
    return localStorage.getItem('marketSegmentation') === 'true';
  } catch (e) {
    return false;
  }
}

// Computed properties
const projectName = computed(() => {
  const name = selectedProject.value?.project_name || 'Project Name';
 //  // console.log('Room P&L: Project name computed:', {
  //   selectedProject: selectedProject.value,
  //   projectName: name,
  //   hasProject: !!selectedProject.value
  // });
  return name;
});

// Watch for project changes to refresh data
watch(selectedProject, () => {
  // Force a reactive update when project changes
  // This will trigger recalculation of room counts from the new project's cache
 //  // console.log('Room P&L: Project changed to:', selectedProject.value?.project_name);
  // Reload Room department expenses for the new project
  loadRoomExpensesFromApi();
}, { deep: true });

// Watch for visible years changes to reload data
watch(() => props.visibleYears, async (newYears) => {
  if (newYears && newYears.length > 0) {
    await ensureDataLoaded();
  }
}, { deep: true });

// Function to ensure data is loaded in cache
async function ensureDataLoaded() {
  try {
    if (!projectName.value || !props.visibleYears?.length) return;
    
    // Check if we have any revenue data in cache
    const hasRevenueData = roomRevenueSegments.value.length > 0 || roomTypePackages.value.length > 0;
    
    if (!hasRevenueData) {
      console.log('Room P&L: No revenue data found, loading from report service...');
      
      // Load data for room profit & loss report
      await reportDataService.getReportSpecificData(
        'room-pnl',
        projectName.value,
        props.visibleYears
      );
    }
  } catch (error) {
    console.warn('Room P&L: Failed to ensure data loaded:', error);
  }
}

// Add debugging for cache access
onMounted(async () => {
  // Load Room department expenses from Expense Assumptions API
  loadRoomExpensesFromApi();
  
  // The parent component (Reports.vue) now handles data loading via the unified service
  // This eliminates the need to visit other pages first
  // console.log('Room P&L: Component mounted, data should be loaded by parent component');
  
  // Force data loading if cache is empty
  await ensureDataLoaded();
  
  // Debug: Log what's available in cache
  if (selectedProject.value?.project_name) {
    // console.log('Room P&L: Debugging cache access for project:', selectedProject.value.project_name);
    // console.log('Room P&L: Available cache pages:', Object.keys(calculationCache.cache[selectedProject.value.project_name] || {}));
  }
});

// The unified data service is now handled by the parent component (Reports.vue)
// This eliminates the need for individual components to manage data loading



// Utility functions
const expenseDataCache = ref({});
const roomDepartmentExpenses = computed(() => {
  try {
    const expensesSet = new Set();
    const project = projectName.value;
    
    // Prefer new normalized expenses structure if available
    if (project && calculationCache?.expenses?.[project]) {
      const projectExpenses = calculationCache.expenses[project];
      // Collect from any department key that maps to Room/Rooms
      Object.keys(projectExpenses).forEach((deptKey) => {
        const isRoomDept = ['room', 'rooms'].includes((deptKey || '').toLowerCase());
        if (!isRoomDept) return;
        const byExpenseName = projectExpenses[deptKey] || {};
        Object.keys(byExpenseName).forEach((expenseName) => {
          if (expenseName) expensesSet.add(expenseName);
        });
      });
      if (expensesSet.size > 0) return Array.from(expensesSet);
    }
    
    // Fallback to local cache if normalized cache is not populated yet
    const data = expenseDataCache.value || {};
    for (const [year, months] of Object.entries(data)) {
      for (const [month, entries] of Object.entries(months)) {
        (entries || []).forEach(entry => {
          const dept = (entry.department || '').toLowerCase();
          if (dept === 'room' || dept === 'rooms') {
            const name = entry.expense;
            if (name) expensesSet.add(name);
          }
        });
      }
    }
    return Array.from(expensesSet);
  } catch (e) {
    return [];
  }
});
function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

async function loadRoomExpensesFromApi() {
  try {
    // First check if we have cached expense data
    if (projectName.value) {
      const cachedRoomExpenses = calculationCache.getRowValues(projectName.value, `${PAGE.EXPENSE_ASSUMPTIONS}:Room`);
      if (cachedRoomExpenses && Object.keys(cachedRoomExpenses).length > 0) {
        // console.log('[ROOM P&L] Using cached expense data for room department');
        // Convert cached data back to the format expected by the component
        const convertedData = {};
        Object.entries(cachedRoomExpenses).forEach(([year, months]) => {
          convertedData[year] = {};
          Object.entries(months).forEach(([month, expenses]) => {
            convertedData[year][month] = Object.entries(expenses).map(([expenseName, amount]) => ({
              expense: expenseName,
              amount: amount,
              department: 'Room'
            }));
          });
        });
        expenseDataCache.value = convertedData;
        return;
      }
    }
    
    // Fallback to API call if no cached data
    // console.log('[ROOM P&L] No cached data found, loading from API');
    const exp = await loadExpenseData();
    if (exp && !exp.status) {
      expenseDataCache.value = exp;
    } else {
      expenseDataCache.value = {};
    }
  } catch (e) {
    expenseDataCache.value = {};
  }
}

function formatMoney(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatPercentage(value) {
  return getNumber(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toggleCollapse(year) {
  yearSettingsStore.toggleCollapse(year);
}

function isYearCollapsed(year) {
  return yearSettingsStore.isYearCollapsed(year);
}

function getColumnLabelsForYear(year) {
  const mode = advancedModes.value[year] || 'monthly';
  if (mode === 'monthly') {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
  if (mode === 'quarterly') {
    return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  }
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

// Data retrieval functions - these will be connected to your calculation cache
function getRoomExpenseAmount(year, label, expenseName) {
  try {
    // Prefer normalized expenses cache first
    const monthKeys = getMonthsForLabel(label);
    let sum = 0;
    const project = projectName.value;
    
    for (const m of monthKeys) {
      // Try normalized lookups under both 'Room' and 'Rooms' department keys
      const amtRoom = calculationCache.getExpense(project, 'Room', expenseName, year, m);
      const amtRooms = calculationCache.getExpense(project, 'Rooms', expenseName, year, m);
      const normalizedAmt = getNumber(amtRoom || amtRooms || 0);
      if (normalizedAmt > 0) {
        sum += normalizedAmt;
        continue;
      }
      
      // Fallback to local API-shaped cache
      const entries = expenseDataCache.value?.[year]?.[m] || [];
      const filtered = entries.filter(e => {
        const dept = (e.department || '').toLowerCase();
        return (dept === 'room' || dept === 'rooms') && e.expense === expenseName;
      });
      sum += filtered.reduce((acc, e) => acc + getNumber(e.amount), 0);
    }
    return sum;
  } catch (e) {
    return 0;
  }
}

function getRoomExpenseTotal(year, expenseName) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomExpenseAmount(year, label, expenseName)), 0);
  } catch (e) {
    return 0;
  }
}

function getRoomExpensePercentage(year, label, expenseName) {
  try {
    const monthValue = getRoomExpenseAmount(year, label, expenseName);
    const yearTotal = getRoomExpenseTotal(year, expenseName);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room expense percentage:', error);
    return 0;
  }
}

function hasRoomExpenseData(expenseName) {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getRoomExpenseAmount(year, label, expenseName) > 0) {
        return true;
      }
    }
  }
  return false;
}

function getGrossRoomExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Gross Total Expenses';
    
    // Check if value is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Gross Total Expenses retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate total from all room department expenses
    let total = 0;
    for (const exp of roomDepartmentExpenses.value) {
      total += getNumber(getRoomExpenseAmount(year, label, exp));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, label, total);
    console.log('[ROOM P&L] Cached Gross Total Expenses:', { project, year, label, total });
    
    return total;
  } catch (e) {
    return 0;
  }
}

// Utility function to get expenses for any department from cache
function getDepartmentExpensesFromCache(department) {
  try {
    if (!projectName.value) return [];
    
    const cachedExpenses = calculationCache.getRowValues(projectName.value, `Expense Assumptions:${department}`);
    if (cachedExpenses && Object.keys(cachedExpenses).length > 0) {
      // Extract unique expense names from cached data
      const expensesSet = new Set();
      Object.values(cachedExpenses).forEach(yearData => {
        Object.values(yearData).forEach(monthData => {
          Object.keys(monthData).forEach(expenseName => {
            if (expenseName) expensesSet.add(expenseName);
          });
        });
      });
      return Array.from(expensesSet);
    }
    return [];
  } catch (e) {
    return [];
  }
}

// Utility function to get expense amount for any department from cache
function getDepartmentExpenseAmount(department, expenseName, year, label) {
  try {
    if (!projectName.value) return 0;
    
    const monthKeys = getMonthsForLabel(label);
    let sum = 0;
    
    for (const m of monthKeys) {
      // Try to get from calculation cache first
      const cachedAmount = calculationCache.getValue(projectName.value, `Expense Assumptions:${department}`, expenseName, year, m);
      if (cachedAmount > 0) {
        sum += cachedAmount;
        continue;
      }
      
      // Fallback to local cache if calculation cache doesn't have it
      const entries = expenseDataCache.value?.[year]?.[m] || [];
      const filtered = entries.filter(e => {
        const dept = (e.department || '').toLowerCase();
        return dept === department.toLowerCase() && e.expense === expenseName;
      });
      sum += filtered.reduce((acc, e) => acc + getNumber(e.amount), 0);
    }
    return sum;
  } catch (e) {
    return 0;
  }
}

function getGrossRoomExpensesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Gross Total Expenses';
    
    // Check if yearly total is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Gross Total Expenses Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getGrossRoomExpenses(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total', total);
    console.log('[ROOM P&L] Cached Gross Total Expenses Year Total:', { project, year, total });
    
    return total;
  } catch (e) {
    return 0;
  }
}

function getGrossRoomExpensesPercentage(year, label) {
  try {
    const monthValue = getGrossRoomExpenses(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating gross room expenses percentage:', error);
    return 0;
  }
}

function getNoOfRooms(year, label) {
  try {
    // Check if market segmentation is enabled
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';
    
    // Get room count from room revenue page via calculation cache
    // Both scenarios (market segmentation on/off) now cache to the same location
    const roomCount = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    
    if (roomCount !== undefined && roomCount !== null) {
      // console.log(`Room P&L: Retrieved room count for ${year}/${label}:`, roomCount, 'Market segmentation:', isMarketSegmentationEnabled);
      return getNumber(roomCount);
    }
    
    // Debug: Log what's available in cache
    // console.log(`Room P&L: No cached room count found for ${year}/${label}`);
    // console.log(`Room P&L: Available cache for project ${projectName.value}:`, Object.keys(calculationCache.cache[projectName.value] || {}));
    
    // Default fallback
    // console.log(`Room P&L: Using default room count: 100`);
    return 100;
  } catch (error) {
    console.error('Error fetching room count:', error);
    return 100; // Default fallback
  }
}

function getNoOfRoomsTotal(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let total = 0;
    
    for (const label of labels) {
      const roomCount = getNoOfRooms(year, label);
      total += getNumber(roomCount);
    }
    
    return total;
  } catch (error) {
    console.error('Error calculating total rooms:', error);
      return 0;
  }
}

function getNoOfRoomsPercentage(year, label) {
  try {
    const monthValue = getNoOfRooms(year, label);
    const yearTotal = getNoOfRoomsTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room percentage:', error);
    return 0;
  }
}

function getNoOfDays(year, label) {
  // TODO: Connect to calculation cache for days in month/quarter
  if (label === 'Jan' || label === 'Mar' || label === 'May' || label === 'Jul' || 
      label === 'Aug' || label === 'Oct' || label === 'Dec') return 31;
  if (label === 'Apr' || label === 'Jun' || label === 'Sep' || label === 'Nov') return 30;
  if (label === 'Feb') return 28; // Simplified leap year logic
  if (label === 'Jan-Mar') return 90;
  if (label === 'Apr-Jun') return 91;
  if (label === 'Jul-Sep') return 92;
  if (label === 'Oct-Dec') return 92;
  return 30;
}

function getNoOfDaysTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNoOfDays(year, label)), 0);
}

function getNoOfDaysPercentage(year, label) {
  try {
    const monthValue = getNoOfDays(year, label);
    const yearTotal = getNoOfDaysTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating no of days percentage:', error);
    return 0;
  }
}

function getAvailableRooms(year, label) {
  try {
    // First try: Get from F&B page - Number of rooms available row
    let availableRooms = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Number of rooms available', year, label);
    
    // console.log(`Room P&L: Available Rooms cache lookup for ${year}/${label}:`, {
    //   projectName: projectName.value,
    //   cacheKey: 'Number of rooms available',
    //   cachedValue: availableRooms,
    //   cacheExists: availableRooms !== undefined && availableRooms !== null
    // });
    
    if (availableRooms !== undefined && availableRooms !== null) {
      return getNumber(availableRooms);
    }
    
    // Second try: Get from Room Revenue page - Total Available Rooms (if market segmentation is on)
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';
    if (isMarketSegmentationEnabled) {
      const totalRooms = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
      if (totalRooms !== undefined && totalRooms !== null) {
        const days = getNoOfDays(year, label);
        const calculatedValue = getNumber(totalRooms) * days;
        // console.log(`Room P&L: Calculated from Room Revenue Total Rooms:`, {
        //   totalRooms,
        //   days,
        //   calculatedValue
        // });
        return calculatedValue;
      }
    }
    
    // Fallback calculation: Use cached room count × days
    const rooms = getNoOfRooms(year, label);
    const days = getNoOfDays(year, label);
    const fallbackValue = rooms * days;
    
    // console.log(`Room P&L: Using fallback calculation for available rooms:`, {
    //   rooms,
    //   days,
    //   fallbackValue
    // });
    
    return fallbackValue;
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    // Fallback calculation
    const rooms = getNoOfRooms(year, label);
    const days = getNoOfDays(year, label);
    return rooms * days;
  }
}

function getAvailableRoomsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(year, label)), 0);
}

function getAvailableRoomsPercentage(year, label) {
  try {
    const monthValue = getAvailableRooms(year, label);
    const yearTotal = getAvailableRoomsTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating available rooms percentage:', error);
    return 0;
  }
}

function getSoldRooms(year, label) {
  try {
    // Get from F&B page - Number of rooms sold (excl.) row (note: lowercase in cache)
    const soldRooms = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Number of rooms sold (excl.)', year, label);
    
    // console.log(`Room P&L: Sold Rooms cache lookup for ${year}/${label}:`, {
    //   projectName: projectName.value,
    //   cacheKey: 'Number of rooms sold (excl.)',
    //   cachedValue: soldRooms,
    //   cacheExists: soldRooms !== undefined && soldRooms !== null
    // });
    
    if (soldRooms !== undefined && soldRooms !== null) {
      return getNumber(soldRooms);
    }
    
    // Fallback: Calculate based on occupancy percentage if available
    const occupancy = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Occupancy (excl.) %', year, label);
    if (occupancy !== undefined && occupancy !== null) {
      const availableRooms = getAvailableRooms(year, label);
      const calculatedSoldRooms = Math.round((getNumber(occupancy) / 100) * availableRooms);
      // console.log(`Room P&L: Calculated sold rooms from occupancy:`, {
      //   occupancy,
      //   availableRooms,
      //   calculatedSoldRooms
      // });
      return calculatedSoldRooms;
    }
    
    // Default fallback: Use 75% occupancy as placeholder
    const availableRooms = getAvailableRooms(year, label);
    const placeholderSoldRooms = Math.round(availableRooms * 0.75);
    // console.log(`Room P&L: Using placeholder 75% occupancy for sold rooms:`, {
    //   availableRooms,
    //   placeholderSoldRooms
    // });
    return placeholderSoldRooms;
  } catch (error) {
    console.error('Error fetching sold rooms:', error);
    return 0;
  }
}

function getSoldRoomsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getSoldRooms(year, label)), 0);
}

function getSoldRoomsPercentage(year, label) {
  try {
    const monthValue = getSoldRooms(year, label);
    const yearTotal = getSoldRoomsTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating sold rooms percentage:', error);
    return 0;
  }
}

function getOccupancyPercentage(year, label) {
  try {
    // Get from F&B page - Occupancy (excl.) % row
    const occupancy = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Occupancy (excl.) %', year, label);
    if (occupancy !== undefined && occupancy !== null) {
      return getNumber(occupancy);
    }
    
    // Calculate occupancy percentage if we have sold rooms and available rooms
    const soldRooms = getSoldRooms(year, label);
    const availableRooms = getAvailableRooms(year, label);
    if (availableRooms > 0) {
      return Number(((soldRooms / availableRooms) * 100).toFixed(2));
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching occupancy percentage:', error);
    return 0;
  }
}

function getOccupancyPercentageTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const totalSold = labels.reduce((sum, label) => sum + getNumber(getSoldRooms(year, label)), 0);
  const totalAvailable = labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(year, label)), 0);
  
  if (totalAvailable > 0) {
    return Number(((totalSold / totalAvailable) * 100).toFixed(2));
  }
  return 0;
}

function getOccupancyPercentagePercentage(year, label) {
  try {
    const monthValue = getOccupancyPercentage(year, label);
    const yearTotal = getOccupancyPercentageTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating occupancy percentage percentage:', error);
    return 0;
  }
}

function getNumberOfGuests(year, label) {
  try {
    // Get from F&B page - Number of guests row
    const guests = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, ROW.NUMBER_OF_GUESTS, year, label);
    if (guests !== undefined && guests !== null) {
      return getNumber(guests);
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching number of guests:', error);
    return 0;
  }
}

function getNumberOfGuestsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfGuests(year, label)), 0);
}

function getNumberOfGuestsPercentage(year, label) {
  try {
    const monthValue = getNumberOfGuests(year, label);
    const yearTotal = getNumberOfGuestsTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating number of guests percentage:', error);
    return 0;
  }
}

function getNumberOfCovers(year, label) {
  try {
    // Get from F&B page - Total Covers row
    const covers = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Total Covers', year, label);
    if (covers !== undefined && covers !== null) {
      return getNumber(covers);
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching number of covers:', error);
      return 0;
  }
}

function getNumberOfCoversTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfCovers(year, label)), 0);
}

function getNumberOfCoversPercentage(year, label) {
  try {
    const monthValue = getNumberOfCovers(year, label);
    const yearTotal = getNumberOfCoversTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating number of covers percentage:', error);
    return 0;
  }
}

function getAverageFnbSpent(year, label) {
  try {
    // Get from F&B page - Average Spent Per F&B Customer row
    const avgSpent = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Average Spent Per F&B Customer', year, label);
    if (avgSpent !== undefined && avgSpent !== null) {
      return getNumber(avgSpent);
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching average F&B spent:', error);
    return 0;
  }
}

function getAverageFnbSpentTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const totalSpent = labels.reduce((sum, label) => sum + getNumber(getAverageFnbSpent(year, label)), 0);
  return totalSpent > 0 ? totalSpent / labels.length : 0;
}

function getAverageFnbSpentPercentage(year, label) {
  try {
    const monthValue = getAverageFnbSpent(year, label);
    const yearTotal = getAverageFnbSpentTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating average F&B spent percentage:', error);
    return 0;
  }
}

function getAverageRoomRate(year, label) {
  try {
    // Get from F&B page - Average Room Rate row
    const avgRate = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, ROW.AVERAGE_ROOM_RATE, year, label);
    if (avgRate !== undefined && avgRate !== null) {
      return getNumber(avgRate);
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching average room rate:', error);
    return 0;
  }
}

function getAverageRoomRateTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const totalRate = labels.reduce((sum, label) => sum + getNumber(getAverageRoomRate(year, label)), 0);
  return totalRate > 0 ? totalRate / labels.length : 0;
}

function getAverageRoomRatePercentage(year, label) {
  try {
    const monthValue = getAverageRoomRate(year, label);
    const yearTotal = getAverageRoomRateTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating average room rate percentage:', error);
    return 0;
  }
}

function getRevPerAvailableRoom(year, label) {
  try {
    // Get from F&B page - Revenue Per Available Room row
    const revPerRoom = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Revenue Per Available Room', year, label);
    if (revPerRoom !== undefined && revPerRoom !== null) {
      return getNumber(revPerRoom);
    }
    
    // Calculate if we have the components
    const soldRooms = getSoldRooms(year, label);
    const avgRate = getAverageRoomRate(year, label);
    const availableRooms = getAvailableRooms(year, label);
    
    if (availableRooms > 0) {
      return (soldRooms * avgRate) / availableRooms;
    }
    
    // Default fallback
    return 0;
  } catch (error) {
    console.error('Error fetching revenue per available room:', error);
    return 0;
  }
}

function getRevPerAvailableRoomTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const totalRev = labels.reduce((sum, label) => sum + getNumber(getRevPerAvailableRoom(year, label)), 0);
  return totalRev > 0 ? totalRev / labels.length : 0;
}

function getRevPerAvailableRoomPercentage(year, label) {
  try {
    const monthValue = getRevPerAvailableRoom(year, label);
    const yearTotal = getRevPerAvailableRoomTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating revenue per available room percentage:', error);
    return 0;
  }
}

// Data availability checking functions
function hasNoOfRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfRooms(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasNoOfDaysData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfDays(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasAvailableRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAvailableRooms(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasSoldRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getSoldRooms(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasOccupancyData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOccupancyPercentage(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasGuestsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNumberOfGuests(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasCoversData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNumberOfCovers(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasFnbSpentData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAverageFnbSpent(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasRoomRateData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAverageRoomRate(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasRevPerRoomData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getRevPerAvailableRoom(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================================
// ROOMS REVENUE FUNCTIONS
// ============================================================================

// Market Segmentation Revenue Functions
// Helper: map quarter label to months
function getMonthsForLabel(label) {
  if (label === 'Jan-Mar') return ['Jan', 'Feb', 'Mar'];
  if (label === 'Apr-Jun') return ['Apr', 'May', 'Jun'];
  if (label === 'Jul-Sep') return ['Jul', 'Aug', 'Sep'];
  if (label === 'Oct-Dec') return ['Oct', 'Nov', 'Dec'];
  return [label];
}

// ==========================================================================
// PAYROLL (Room Department) - Management vs Non-Management by Location
// Uses values cached by Payroll page under keys like:
//   MonthlySalary|position:...|location:...|designation:...
// ==========================================================================

function parseMonthlySalaryRowCode(rowCode) {
  try {
    if (!rowCode || !rowCode.startsWith('MonthlySalary|')) return null;
    const regex = /^MonthlySalary\|department:(.*?)\|position:(.*?)\|location:(.*?)\|designation:(.*)$/;
    const match = rowCode.match(regex);
    if (!match) return null;
    return {
      department: (match[1] || '').trim(),
      position: (match[2] || '').trim(),
      location: (match[3] || '').trim(),
      designation: (match[4] || '').trim()
    };
  } catch (e) {
    return null;
  }
}

function isManagementPositionName(position) {
  if (!position) return false;
  const lower = position.toLowerCase();
  return (lower.includes('manager') && !lower.includes('non-manager')) || lower.includes('director') || lower.includes('supervisor');
}

const payrollLocationsManagement = computed(() => {
  try {
    const locs = new Set();
    const project = projectName.value;
    // Prefer normalized payroll cache across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasMgmt = Object.keys(byPosition).some((pos) => isManagementPositionName(pos));
          if (hasMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('Room P&L: Error discovering payroll management locations:', e);
    return [];
  }
});

const payrollLocationsNonManagement = computed(() => {
  try {
    const locs = new Set();
    const project = projectName.value;
    // Prefer normalized payroll cache across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasNonMgmt = Object.keys(byPosition).some((pos) => !isManagementPositionName(pos));
          if (hasNonMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && !isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('Room P&L: Error discovering payroll non-management locations:', e);
    return [];
  }
});

function getPayrollMonthlySalaryByLocation(year, label, location, group) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure
    const payrollNorm = calculationCache?.payroll?.[project]?.[year] || {};
    const isMgmtGroup = group === 'management';
    const isNonMgmtGroup = group === 'non-management';
    Object.keys(payrollNorm).forEach((departmentKey) => {
      const byLocation = payrollNorm[departmentKey] || {};
      const locBucket = byLocation?.[location];
      if (!locBucket) return;
      Object.keys(locBucket).forEach((positionKey) => {
        const mgmt = isManagementPositionName(positionKey);
        if ((isMgmtGroup && !mgmt) || (isNonMgmtGroup && mgmt)) return;
        const byDesignation = locBucket[positionKey] || {};
        Object.keys(byDesignation).forEach((designationKey) => {
          const byLabel = byDesignation[designationKey] || {};
          for (const m of months) {
            const v = byLabel?.[m];
            if (v !== undefined && v !== null) sum += getNumber(v);
          }
        });
      });
    });

    if (sum > 0) return sum;

    // Fallback to legacy PAGE-based cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (!parsed || !parsed.location || parsed.location !== location) return;
      const isMgmt = isManagementPositionName(parsed.position);
      if ((group === 'management' && !isMgmt) || (group === 'non-management' && isMgmt)) return;
      for (const m of months) {
        const val = calculationCache.getValue(project, page, rowCode, year, m);
        if (val !== undefined && val !== null) sum += getNumber(val);
      }
    });
    return sum;
  } catch (e) {
    return 0;
  }
}

function getPayrollMonthlySalaryTotal(year, location, group) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getPayrollMonthlySalaryByLocation(year, lab, location, group)), 0);
  } catch (e) {
    return 0;
  }
}

function getPayrollMonthlySalaryPercentage(year, label, location, group) {
  try {
    const monthValue = getPayrollMonthlySalaryByLocation(year, label, location, group);
    const yearTotal = getPayrollMonthlySalaryTotal(year, location, group);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating payroll monthly salary percentage:', error);
    return 0;
  }
}

function hasPayrollGroupData(group) {
  try {
    const locs = group === 'management' ? payrollLocationsManagement.value : payrollLocationsNonManagement.value;
    if (!locs || locs.length === 0) return false;
    for (const year of (Array.isArray(props.visibleYears) ? props.visibleYears : [])) {
      for (const loc of locs) {
        const total = getPayrollMonthlySalaryTotal(year, loc, group);
        if (getNumber(total) > 0) return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Get total payroll for a specific year and period (sum of management + non-management)
function getTotalPayroll(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if value is already cached
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    // if (hasCachedValue) {
    //   console.log('[ROOM P&L] Total Payroll retrieved from cache:', { project, year, label, cachedValue });
    //   return cachedValue;
    // }
    
    let total = 0;
    
    // Add management payroll
    for (const loc of payrollLocationsManagement.value) {
      total += getNumber(getPayrollMonthlySalaryByLocation(year, label, loc, 'management'));
    }
    
    // Add non-management payroll
    for (const loc of payrollLocationsNonManagement.value) {
      total += getNumber(getPayrollMonthlySalaryByLocation(year, label, loc, 'non-management'));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, label, total);
    // console.log('[ROOM P&L] Cached Total Payroll:', { project, year, label, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total payroll:', error);
    return 0;
  }
}

// Get total payroll for a specific year
function getTotalPayrollYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if yearly total is already cached
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    // if (hasCachedValue) {
    //   console.log('[ROOM P&L] Total Payroll Year retrieved from cache:', { project, year, cachedValue });
    //   return cachedValue;
    // }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getTotalPayroll(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total', total);
    // console.log('[ROOM P&L] Cached Total Payroll Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total payroll for year:', error);
    return 0;
  }
}

function getTotalPayrollPercentage(year, label) {
  try {
    const monthValue = getTotalPayroll(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total payroll percentage:', error);
    return 0;
  }
}

// Discover room revenue segments from cache for the current project
const roomRevenueSegments = computed(() => {
  try {
    const project = projectName.value;
    const page = PAGE.MARKET_SEGMENTATION;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const segments = new Set();
    
    // console.log(`Room P&L: Looking for market segmentation data in page "${page}"`);
    // console.log(`Room P&L: Available row codes:`, Object.keys(pageData));
    
    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Revenue:')) {
        const name = rowCode.replace('Room Revenue:', '').trim();
        if (name) segments.add(name);
      }
    });
    
    // console.log(`Room P&L: Found ${segments.size} market segments:`, Array.from(segments));
    return Array.from(segments);
  } catch (e) {
    console.error('Room P&L: Error discovering room revenue segments:', e);
    return [];
  }
});

function getSegmentRevenue(year, label, segmentName) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(project, PAGE.MARKET_SEGMENTATION, `Room Revenue:${segmentName}`, year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    return sum;
  } catch (error) {
    console.error('Error fetching segment revenue:', segmentName, error);
    return 0;
  }
}

function getSegmentRevenueTotal(year, segmentName) {
  try {
    const project = projectName.value;
    const yearly = calculationCache.getValue(project, PAGE.MARKET_SEGMENTATION, `Room Revenue Year:${segmentName}`, year, 'ALL');
    if (yearly !== undefined && yearly !== null) {
      return getNumber(yearly);
    }
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getSegmentRevenue(year, label, segmentName)), 0);
  } catch (e) {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getSegmentRevenue(year, label, segmentName)), 0);
  }
}

function getSegmentRevenuePercentage(year, label, segmentName) {
  try {
    const monthValue = getSegmentRevenue(year, label, segmentName);
    const yearTotal = getTotalRoomsRevenueTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating segment revenue percentage:', error);
    return 0;
  }
}

function hasSegmentData(segmentName) {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getSegmentRevenue(year, label, segmentName) > 0) {
        return true;
      }
    }
  }
  return false;
}

function getDirectRetailRevenue(year, label) {
  try {
    // Prefer Market Segmentation cache: Room Revenue for Direct Retail
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(project, PAGE.MARKET_SEGMENTATION, 'Room Revenue:Direct Retail', year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    if (sum > 0) {
      return sum;
    }
    // Fallback: Room Revenue Assumptions if segmentation not available
    const fallback = calculationCache.getValue(project, PAGE.ROOM_REVENUE, 'Direct Retail', year, label);
    if (fallback !== undefined && fallback !== null) {
      return getNumber(fallback);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching Direct Retail revenue:', error);
    return 0;
  }
}

function getDirectRetailRevenueTotal(year) {
  try {
    const project = projectName.value;
    // If yearly total exists in cache, prefer it
    const yearly = calculationCache.getValue(project, PAGE.MARKET_SEGMENTATION, 'Room Revenue Year:Direct Retail', year, 'ALL');
    if (yearly !== undefined && yearly !== null) {
      return getNumber(yearly);
    }
    // Else sum all visible period labels
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getDirectRetailRevenue(year, label)), 0);
  } catch (e) {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getDirectRetailRevenue(year, label)), 0);
  }
}

function getCorporateRevenue(year, label) {
  try {
    // Get from Room Revenue page - Corporate revenue
    const revenue = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, 'Corporate', year, label);
    if (revenue !== undefined && revenue !== null) {
      return getNumber(revenue);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching Corporate revenue:', error);
    return 0;
  }
}

function getCorporateRevenueTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getCorporateRevenue(year, label)), 0);
}

function getOTARevenue(year, label) {
  try {
    // Get from Room Revenue page - OTA revenue
    const revenue = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, 'OTA', year, label);
    if (revenue !== undefined && revenue !== null) {
      return getNumber(revenue);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching OTA revenue:', error);
    return 0;
  }
}

function getOTARevenueTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getOTARevenue(year, label)), 0);
}

function getTravelAgentRevenue(year, label) {
  try {
    // Get from Room Revenue page - Travel Agent revenue
    const revenue = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, 'Travel Agent', year, label);
    if (revenue !== undefined && revenue !== null) {
      return getNumber(revenue);
    }
    return 0;
  } catch (error) {
    console.error('Error fetching Travel Agent revenue:', error);
    return 0;
  }
}

function getTravelAgentRevenueTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getTravelAgentRevenue(year, label)), 0);
}

// Room Packages Revenue Functions (when market segmentation is off)
const roomTypePackages = computed(() => {
  try {
    const project = projectName.value;
    const page = PAGE.ROOM_REVENUE;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const types = new Set();
    
    // console.log(`Room P&L: Looking for room type packages in page "${page}"`);
    // console.log(`Room P&L: Available row codes:`, Object.keys(pageData));
    
    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Type:')) {
        const name = rowCode.replace('Room Type:', '').trim();
        if (name) types.add(name);
      }
    });
    
    // console.log(`Room P&L: Found ${types.size} room type packages:`, Array.from(types));
    return Array.from(types);
  } catch (e) {
    console.error('Room P&L: Error discovering room type packages:', e);
    return [];
  }
});

function getRoomTypeRevenue(year, label, typeName) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(project, PAGE.ROOM_REVENUE, `Room Type:${typeName}`, year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    return sum;
  } catch (error) {
    console.error('Error fetching Room Type revenue:', typeName, error);
    return 0;
  }
}

function getRoomTypeRevenueTotal(year, typeName) {
  try {
    const project = projectName.value;
    const yearly = calculationCache.getValue(project, PAGE.ROOM_REVENUE, `Room Type Year:${typeName}`, year, 'ALL');
    if (yearly !== undefined && yearly !== null) {
      return getNumber(yearly);
    }
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomTypeRevenue(year, label, typeName)), 0);
  } catch (e) {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getRoomTypeRevenue(year, label, typeName)), 0);
  }
}

function getRoomTypeRevenuePercentage(year, label, typeName) {
  try {
    const monthValue = getRoomTypeRevenue(year, label, typeName);
    const yearTotal = getTotalRoomsRevenueTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating room type revenue percentage:', error);
    return 0;
  }
}

function hasRoomTypeData(typeName) {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getRoomTypeRevenue(year, label, typeName) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Total Rooms Revenue Functions (works for both market segmentation and room packages)
function getTotalRoomsRevenue(year, label) {
  try {
    // Prefer normalized F&B totals if present (aggregated across restaurants)
    const months = getMonthsForLabel(label);
    let totalFromFnb = 0;
    try {
      const project = projectName.value;
      const yearBucket = calculationCache?.fnb?.[project]?.[year] || {};
      // Sum restaurant metric 'totalRevenue' and also include __ALL__/totalRevenue if present
      Object.keys(yearBucket).forEach((restaurantKey) => {
        const metrics = yearBucket[restaurantKey] || {};
        const revenueSeries = metrics?.totalRevenue || {};
        for (const m of months) {
          const v = revenueSeries?.[m];
          if (v !== undefined && v !== null) totalFromFnb += getNumber(v);
        }
      });
    } catch (e) {
      // ignore and fallback below
    }
    if (totalFromFnb > 0) return totalFromFnb;

    // Fallbacks: market segmentation or room packages caches
    if (isMarketSegmentationEnabled()) {
      return roomRevenueSegments.value.reduce((sum, seg) => sum + getNumber(getSegmentRevenue(year, label, seg)), 0);
    }
    return roomTypePackages.value.reduce((sum, pkg) => sum + getNumber(getRoomTypeRevenue(year, label, pkg)), 0);
  } catch (error) {
    console.error('Error calculating total rooms revenue:', error);
    return 0;
  }
}

function getTotalRoomsRevenueTotal(year) {
  // Prefer normalized F&B yearly totals if present
  try {
    const project = projectName.value;
    const yearBucket = calculationCache?.fnb?.[project]?.[year] || {};
    let total = 0;
    Object.keys(yearBucket).forEach((restaurantKey) => {
      const metrics = yearBucket[restaurantKey] || {};
      const yearly = metrics?.totalRevenue?.ALL;
      if (yearly !== undefined && yearly !== null) total += getNumber(yearly);
    });
    if (total > 0) return total;
  } catch (e) {
    // ignore and fallback below
  }

  if (isMarketSegmentationEnabled()) {
    const perSegmentTotals = roomRevenueSegments.value.map(seg => getSegmentRevenueTotal(year, seg));
    const sumSegments = perSegmentTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumSegments > 0) return sumSegments;
  } else {
    const perTypeTotals = roomTypePackages.value.map(pkg => getRoomTypeRevenueTotal(year, pkg));
    const sumTypes = perTypeTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumTypes > 0) return sumTypes;
  }
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getTotalRoomsRevenue(year, label)), 0);
}

function getTotalRoomsRevenuePercentage(year, label) {
  try {
    const monthValue = getTotalRoomsRevenue(year, label);
    const yearTotal = getTotalRoomsRevenueTotal(year);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total rooms revenue percentage:', error);
    return 0;
  }
}

// Data availability checking functions for revenue
function hasDirectRetailData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getDirectRetailRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasCorporateData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getCorporateRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasOTAData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOTARevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasTravelAgentData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTravelAgentRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasStandardRoomData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getStandardRoomRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasDeluxeRoomData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getDeluxeRoomRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

function hasSuiteData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getSuiteRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// All functions are automatically available in the template in Vue 3 composition API

// ============================================================================
// PAYROLL RELATED FUNCTIONS
// ============================================================================

// Get payroll related value for a specific benefit type, year, and period
function getPayrollRelatedValue(year, label, benefitType) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payrollRelated structure sum across all positions/locations/designations
    const normYearBucket = calculationCache?.payrollRelated?.[project]?.[year];
    if (normYearBucket) {
      const typeBucket = normYearBucket[benefitType] || normYearBucket[benefitType.toUpperCase()] || normYearBucket[benefitType.toLowerCase()];
      if (typeBucket) {
        Object.keys(typeBucket).forEach((positionKey) => {
          const byLocation = typeBucket[positionKey] || {};
          Object.keys(byLocation).forEach((locationKey) => {
            const byDesignation = byLocation[locationKey] || {};
            Object.keys(byDesignation).forEach((designationKey) => {
              const byLabel = byDesignation[designationKey] || {};
              for (const m of months) {
                const v = byLabel?.[m];
                if (v !== undefined && v !== null) sum += getNumber(v);
              }
            });
          });
        });
      }
    }

    if (sum > 0) return sum;

    // Fallback to legacy PAGE/rowCode cache
    const fieldMapping = {
      'NSSIT': { page: PAGE.PAYROLL_TAXES, rowCode: 'NSSIT' },
      'Vacation': { page: PAGE.PAYROLL_RELATED, rowCode: 'vacation' },
      'Relocation': { page: PAGE.PAYROLL_RELATED, rowCode: 'relocation' },
      'Severence & Indemnity': { page: PAGE.PAYROLL_RELATED, rowCode: 'severence & indemnity' },
      'Other': { page: PAGE.PAYROLL_RELATED, rowCode: 'other' },
      'Medical': { page: PAGE.PAYROLL_RELATED, rowCode: 'medical' },
      'Uniforms': { page: PAGE.PAYROLL_RELATED, rowCode: 'uniforms' },
      'Employee Meal': { page: PAGE.PAYROLL_RELATED, rowCode: 'employee_meal' },
      'Transport': { page: PAGE.PAYROLL_RELATED, rowCode: 'transport' },
      'Telephone': { page: PAGE.PAYROLL_RELATED, rowCode: 'telephone' },
      'Air Ticket': { page: PAGE.PAYROLL_RELATED, rowCode: 'air_ticket' },
      'Other Benefits': { page: PAGE.PAYROLL_RELATED, rowCode: 'other_benefits' }
    };
    const mapping = fieldMapping[benefitType];
    if (!mapping) return 0;
    for (const month of months) {
      const val = calculationCache.getValue(project, mapping.page, mapping.rowCode, year, month);
      if (val !== undefined && val !== null) sum += getNumber(val);
    }
    return sum;
  } catch (error) {
    console.error('Error fetching payroll related value:', benefitType, error);
    return 0;
  }
}

// Get payroll related total for a specific benefit type and year
function getPayrollRelatedTotal(year, benefitType) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getPayrollRelatedValue(year, label, benefitType)), 0);
  } catch (error) {
    console.error('Error calculating payroll related total:', benefitType, error);
    return 0;
  }
}

function getPayrollRelatedPercentage(year, label, benefitType) {
  try {
    const monthValue = getPayrollRelatedValue(year, label, benefitType);
    const yearTotal = getPayrollRelatedTotal(year, benefitType);
    
    if (yearTotal > 0) {
      return Number(((monthValue / yearTotal) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating payroll related percentage:', error);
    return 0;
  }
}

// Check if payroll related data exists for a specific benefit type
function hasPayrollRelatedData(benefitType) {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getPayrollRelatedValue(year, label, benefitType) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Get bonus value for a specific year and period from Bonus page cache
function getBonusValue(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Bonus Details';
    
    // Check if value is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Bonus Details retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate bonus from Bonus page cache using "Total Hotel" row code
    const months = getMonthsForLabel(label);
    let sum = 0;
    
    for (const month of months) {
      const val = calculationCache.getValue(project, PAGE.BONUS, 'Total Hotel', year, month);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, label, sum);
    console.log('[ROOM P&L] Cached Bonus Details:', { project, year, label, sum });
    
    return sum;
  } catch (error) {
    console.error('Error fetching bonus value:', error);
    return 0;
  }
}

// Get bonus total for a specific year from Bonus page cache
function getBonusTotal(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Bonus Details';
    
    // Check if yearly total is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Bonus Details Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    // First try to get the yearly total directly from Bonus page cache
    const yearlyTotal = calculationCache.getValue(project, PAGE.BONUS, 'Total Hotel', year, 'Total');
    if (yearlyTotal !== undefined && yearlyTotal !== null) {
      const total = getNumber(yearlyTotal);
      // Cache the yearly total
      calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total', total);
      console.log('[ROOM P&L] Cached Bonus Details Year Total from Bonus page:', { project, year, total });
      return total;
    }
    
    // Fallback: sum all period labels if yearly total not available
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getBonusValue(year, label)), 0);
    
    // Cache the calculated yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total', total);
    console.log('[ROOM P&L] Cached Bonus Details Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating bonus total for year:', error);
    return 0;
  }
}

function getBonusPercentage(year, label) {
  try {
    const monthValue = getBonusValue(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating bonus percentage:', error);
    return 0;
  }
}

// Get total payroll related expenses for a specific year and period
function getTotalPayrollRelatedExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll Related Expenses';
    
    // Check if value is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Total Payroll Related Expenses retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate total from all benefit types
    const benefitTypes = [
      'NSSIT',
      'Vacation',
      'Relocation',
      'Severence & Indemnity',
      'Other',
      'Medical',
      'Uniforms',
      'Employee Meal',
      'Transport',
      'Telephone',
      'Air Ticket',
      'Other Benefits'
    ];
    
    let total = 0;
    for (const benefitType of benefitTypes) {
      total += getNumber(getPayrollRelatedValue(year, label, benefitType));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, label, total);
    console.log('[ROOM P&L] Cached Total Payroll Related Expenses:', { project, year, label, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total payroll related expenses:', error);
    return 0;
  }
}

// Get total payroll related expenses for a specific year
function getTotalPayrollRelatedExpensesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll Related Expenses';
    
    // Check if yearly total is already cached in Room Report
    const cachedValue = calculationCache.getValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.ROOM_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[ROOM P&L] Total Payroll Related Expenses Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getTotalPayrollRelatedExpenses(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.ROOM_REPORT, cacheKey, year, 'Total', total);
    console.log('[ROOM P&L] Cached Total Payroll Related Expenses Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total payroll related expenses for year:', error);
    return 0;
  }
}

function getTotalPayrollRelatedExpensesPercentage(year, label) {
  try {
    const monthValue = getTotalPayrollRelatedExpenses(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total payroll related expenses percentage:', error);
    return 0;
  }
}

// Get total expenses for a specific year and period (sum of all expense components)
function getTotalExpenses(year, label) {
  try {
    let total = 0;
    
    // Add Gross Total Expenses
    total += getNumber(getGrossRoomExpenses(year, label));
    
    // Add Total Payroll
    total += getNumber(getTotalPayroll(year, label));
    
    // Add Total Payroll Related Expenses
    total += getNumber(getTotalPayrollRelatedExpenses(year, label));
    
    // Add Bonus Details
    total += getNumber(getBonusValue(year, label));
    
    return total;
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    return 0;
  }
}

// Get total expenses for a specific year
function getTotalExpensesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getTotalExpenses(year, label)), 0);
  } catch (error) {
    console.error('Error calculating total expenses for year:', error);
    return 0;
  }
}

function getTotalExpensesPercentage(year, label) {
  try {
    const monthValue = getTotalExpenses(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total expenses percentage:', error);
    return 0;
  }
}

// Get departmental income (loss) for a specific year and period
function getDepartmentalIncome(year, label) {
  try {
    // Calculate: TOTAL REVENUE - TOTAL EXPENSES
    const totalRevenue = getNumber(getTotalRoomsRevenue(year, label));
    const totalExpenses = getNumber(getTotalExpenses(year, label));
    
    return totalRevenue - totalExpenses;
  } catch (error) {
    console.error('Error calculating departmental income:', error);
    return 0;
  }
}

// Get departmental income (loss) for a specific year
function getDepartmentalIncomeYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getDepartmentalIncome(year, label)), 0);
  } catch (error) {
    console.error('Error calculating departmental income for year:', error);
    return 0;
  }
}

function getDepartmentalIncomePercentage(year, label) {
  try {
    const monthValue = getDepartmentalIncome(year, label);
    const monthRevenue = getTotalRoomsRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating departmental income percentage:', error);
    return 0;
  }
}

// Check if bonus data exists for any visible years and periods
function hasBonusData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getBonusValue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================================
// SECTION-LEVEL DATA CHECKS
// ============================================================================

// Check if entire Room Revenue section has any data
function hasRoomRevenueSectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  // Check if any segment has data
  for (const segment of roomRevenueSegments.value) {
    if (hasSegmentData(segment)) {
      return true;
    }
  }
  
  return false;
}

// Check if entire Expenses subsection has any data
function hasExpenseSubsectionData() {
  if (!roomDepartmentExpenses.value || roomDepartmentExpenses.value.length === 0) return false;
  
  for (const exp of roomDepartmentExpenses.value) {
    if (hasRoomExpenseData(exp)) {
      return true;
    }
  }
  
  return false;
}

// Check if entire Payroll subsection has any data
function hasPayrollSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  // Check if any payroll group has data
  const groups = ['management', 'staff', 'supervisors'];
  for (const group of groups) {
    if (hasPayrollGroupData(group)) {
      return true;
    }
  }
  
  return false;
}

// Check if entire Payroll Related subsection has any data
function hasPayrollRelatedSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  // List of all actual payroll related items displayed in the report
  const payrollRelatedItems = [
    'NSSIT',
    'Vacation',
    'Relocation',
    'Severence & Indemnity',
    'Other',
    'Medical',
    'Uniforms',
    'Employee Meal',
    'Transport',
    'Telephone',
    'Air Ticket',
    'Other Benefits'
  ];
  
  // Check if any payroll related item has data
  for (const item of payrollRelatedItems) {
    if (hasPayrollRelatedData(item)) {
      return true;
    }
  }
  
  return false;
}

// Check if entire Bonus subsection has any data
function hasBonusSubsectionData() {
  return hasBonusData();
}

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
