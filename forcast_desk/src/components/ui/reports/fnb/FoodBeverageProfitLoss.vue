<template>
  <div class="bg-white rounded-lg border border-green-300 dark:border-green-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-green-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- F&B Section Header Row -->
            <tr class="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-semibold tracking-wide">Food & Beverage Profit & Loss Report</h2>
                </div>
              </td>
            </tr>

            <!-- Year headers -->
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-green-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1"
                class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-green-700 transition-all duration-200 group text-sm"
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
            <tr class="bg-green-500 dark:bg-green-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="year + '-' + label">
                    <th class="px-2 py-1 text-center border border-green-300 min-w-[100px] font-medium">
                      {{ label }}
                    </th>
                    <th class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-medium text-green-200">
                      %
                    </th>
                  </template>
                  <th class="px-2 py-1 text-center border border-green-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-green-300 min-w-[110px] font-semibold">
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
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
              </td>
            </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">NO OF ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'no-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NO OF DAYS -->
            <tr v-if="hasNoOfDaysData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">NO OF DAYS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-days-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'no-days-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNoOfDays(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">AVAILABLE ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'available-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">SOLD ROOMS (excl. comp)</div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'sold-rooms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">ROOM OCCUPANCY %</div>
              </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'occupancy-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">NUMBER OF GUESTS</div>
              </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'guests-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF F&B COVERS -->
            <tr v-if="hasCoversData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">NUMBER OF F&B COVERS</div>
              </td>
              <template v-for="year in visibleYears" :key="'covers-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'covers-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatNumber(getNumberOfCovers(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVERAGE F&B SPENT PER COVER -->
            <tr v-if="hasFnbSpentData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">AVERAGE F&B SPENT PER COVER</div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-fnb-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'avg-fnb-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getAverageFnbSpent(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVERAGE ROOM RATE -->
            <tr v-if="hasRoomRateData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">AVERAGE ROOM RATE</div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-rate-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'avg-rate-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getAverageRoomRate(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- REV PER AVAILABLE ROOM -->
            <tr v-if="hasRevPerRoomData()" class="bg-green-50 dark:bg-green-900/20 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">REVENUE PER AVAILABLE ROOM</div>
              </td>
              <template v-for="year in visibleYears" :key="'rev-per-room-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'rev-per-room-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      <span class="font-mono text-xs">{{ formatMoney(getRevPerAvailableRoom(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-stats-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-1-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 2 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-stats-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-2-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center">Revenue</div>
              </td>
            </tr>

            <!-- No F&B Revenue Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasFnbRevenueSectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="F&B Revenue"
              :icon="Utensils"
              message="No food & beverage revenue data available for the selected period."
            />

            <!-- Food Revenue Sub-header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Utensils class="w-4 h-4" />
                  Food Revenue
                </div>
              </td>
            </tr>



            <!-- Individual Restaurant Food Revenue Rows -->
            <template v-for="restaurant in getRestaurantList()" :key="'food-revenue-' + restaurant">
              <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
                <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                  <div class="flex items-center gap-1 text-green-800 dark:text-green-200">{{ restaurant.name || restaurant }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'food-revenue-' + restaurant + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'food-revenue-cell-' + restaurant + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                        <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getRestaurantFoodRevenue(restaurant, year, label)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                        <span class="font-mono text-xs text-green-600">{{ formatPercentage(getRestaurantFoodRevenuePercentage(restaurant, year, label)) }}%</span>
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getRestaurantFoodRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getRestaurantFoodRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Banquet Food Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Banquet Food</div>
              </td>
              <template v-for="year in visibleYears" :key="'banquet-food-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'banquet-food-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getBanquetFoodRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getBanquetFoodRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBanquetFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBanquetFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Outside Catering Food Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Outside Catering Food</div>
              </td>
              <template v-for="year in visibleYears" :key="'outside-catering-food-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'outside-catering-food-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getOutsideCateringFoodRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getOutsideCateringFoodRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getOutsideCateringFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getOutsideCateringFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Food Revenue Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Food Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-food-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-food-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalFoodRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>



            <!-- Beverage Revenue Sub-header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Coffee class="w-4 h-4" />
                  Beverage Revenue
                </div>
              </td>
            </tr>

            <!-- Individual Restaurant Beverage Revenue Rows -->
            <template v-for="restaurant in getRestaurantList()" :key="'beverage-revenue-' + restaurant">
              <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
                <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                  <div class="flex items-center gap-1 text-green-800 dark:text-green-200">{{ restaurant.name || restaurant }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'beverage-revenue-' + restaurant + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'beverage-revenue-cell-' + restaurant + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                        <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getRestaurantBeverageRevenue(restaurant, year, label)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                        <span class="font-mono text-xs text-green-600">{{ formatPercentage(getRestaurantBeverageRevenuePercentage(restaurant, year, label)) }}%</span>
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getRestaurantBeverageRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getRestaurantBeverageRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Banquet Beverage Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Banquet Beverage</div>
              </td>
              <template v-for="year in visibleYears" :key="'banquet-beverage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'banquet-beverage-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getBanquetBeverageRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getBanquetBeverageRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBanquetBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBanquetBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Outside Catering Beverage Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Outside Catering Beverage</div>
              </td>
              <template v-for="year in visibleYears" :key="'outside-catering-beverage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'outside-catering-beverage-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getOutsideCateringBeverageRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getOutsideCateringBeverageRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getOutsideCateringBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getOutsideCateringBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Beverage Revenue Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Beverage Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-beverage-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-beverage-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalBeverageRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalBeverageRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL FOOD & BEVERAGE Row -->
            <tr class="bg-green-700 border-b-2 border-green-800">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">TOTAL FOOD & BEVERAGE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-fnb-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-fnb-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodAndBeverageRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalFoodAndBeverageRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodAndBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodAndBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>



            <!-- Other Revenue Section Header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-1">
                  <DollarSign class="w-4 h-4" />
                  Other Revenue
                </div>
              </td>
            </tr>

            <!-- Function Room Rental Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Function Room Rental</div>
              </td>
              <template v-for="year in visibleYears" :key="'function-room-rental-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'function-room-rental-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getFunctionRoomRentalRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getFunctionRoomRentalRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFunctionRoomRentalRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFunctionRoomRentalRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Miscellaneous Other Revenue Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Miscellaneous Other Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'misc-other-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'misc-other-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getMiscellaneousOtherRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getMiscellaneousOtherRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getMiscellaneousOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getMiscellaneousOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Audiovisual Revenue Row -->
            <!-- <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Audiovisual</div>
              </td>
              <template v-for="year in visibleYears" :key="'audiovisual-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'audiovisual-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                    <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAudiovisualRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getAudiovisualRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getAudiovisualRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr> -->

            <!-- Total Other Revenue Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Other Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-other-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-other-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOtherRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalOtherRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row before Total Revenue -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-before-total-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-before-total-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- TOTAL REVENUE Row -->
            <tr class="bg-green-700 border-b-2 border-green-800">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">TOTAL REVENUE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-revenue-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalRevenuePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SERVICE CHARGE Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Service Charge</div>
              </td>
              <template v-for="year in visibleYears" :key="'service-charge-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'service-charge-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getServiceCharge(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getServiceChargeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getServiceChargeYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL REVENUE Incl. SC Row -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">TOTAL REVENUE Incl. SC</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-revenue-incl-sc-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-revenue-incl-sc-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-800">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenueInclServiceCharge(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-800">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenueInclServiceChargeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalRevenueInclServiceChargeYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>


            <!-- Empty Row 2 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-stats-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-2-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                    <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Expenses Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  Expenses
                </div>
              </td>
            </tr>

            <!-- COST OF FOOD & BEVERAGE SALES Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Utensils class="w-4 h-4" />
                  COST OF FOOD & BEVERAGE SALES
                </div>
              </td>
            </tr>

            <!-- Cost of Food Sales Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Cost of Food Sales</div>
              </td>
              <template v-for="year in visibleYears" :key="'cost-food-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'cost-food-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getCostOfFoodSales(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getCostOfFoodSalesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getCostOfFoodSalesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Cost of Beverage Sales Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Cost of Beverage Sales</div>
              </td>
              <template v-for="year in visibleYears" :key="'cost-beverage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'cost-beverage-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getCostOfBeverageSales(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getCostOfBeverageSalesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getCostOfBeverageSalesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total F&B Cost of Sales Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total F&B Cost of Sales</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-fnb-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-fnb-cost-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbCostOfSales(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>



            <!-- Audiovisual Cost Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Audiovisual Cost</div>
              </td>
              <template v-for="year in visibleYears" :key="'audiovisual-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'audiovisual-cost-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getAudiovisualCost(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getAudiovisualCostYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getAudiovisualCostYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Miscellaneous Cost Row -->
            <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Miscellaneous Cost</div>
              </td>
              <template v-for="year in visibleYears" :key="'misc-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'misc-cost-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getMiscellaneousCost(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getMiscellaneousCostYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getMiscellaneousCostYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Cost of Other Revenue Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Cost of Other Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-other-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-other-cost-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfOtherRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL COST OF SALES Row -->
            <tr class="bg-green-700 border-b-2 border-green-800">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">TOTAL COST OF SALES</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-cost-sales-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-cost-sales-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSales(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- GROSS PROFIT Row -->
            <tr class="bg-green-700 border-b-2 border-green-800">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">GROSS PROFIT</div>
              </td>
              <template v-for="year in visibleYears" :key="'gross-profit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'gross-profit-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getGrossProfit(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossProfitYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossProfitYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Expenses Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <DollarSign class="w-4 h-4" />
                  F&B Expenses
                </div>
              </td>
            </tr>

            <!-- No F&B Expenses Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasFnbExpenseSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="F&B Expenses"
              :icon="DollarSign"
              message="No food & beverage expense data available for the selected period."
            />

            <!-- F&B Expenses functions -->
            <template v-for="expense in getFnbExpenses()" :key="'fnb-expense-' + expense">
              <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
                <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                  <div class="flex items-center gap-1 text-green-800 dark:text-green-200">{{ expense }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'fnb-expense-' + expense + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'fnb-expense-cell-' + expense + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getFnbExpense(expense, year, label)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbExpenseYear(expense, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbExpenseYear(expense, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Total F&B Expenses Row -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total F&B Expenses</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-fnb-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-fnb-expenses-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- PAYROLL Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Users class="w-4 h-4" />
                  PAYROLL
                </div>
              </td>
            </tr>

            <!-- Payroll Sub Header -->
            <tr class="bg-green-700 border-b border-green-700">
              <td class="px-3 py-2 font-semibold border-r border-green-700">
                <div class="flex items-center gap-1 text-white">
                  Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
              </template>
            </tr>

            <!-- No F&B Payroll Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasFnbPayrollSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Payroll"
              :icon="Users"
              message="No payroll data available for Food & Beverage department in the selected period."
            />

            <!-- Payroll: Management Group Header -->
            <tr v-if="hasFnbPayrollGroupData('management')" class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">
                  Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'mgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200"></td>
                    <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management per-location rows -->
            <template v-for="loc in fnbPayrollLocationsManagement" :key="'mgmt-loc-' + loc">
              <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
                <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                  <div class="flex items-center gap-1 text-green-800 dark:text-green-200">{{ loc }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'mgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-cell-' + loc + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getFnbPayrollMonthlySalaryByLocation(year, label, loc, 'management')) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Payroll: Non-Management Group Header -->
            <tr v-if="hasFnbPayrollGroupData('non-management')" class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1">
                  Non-Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'nonmgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200"></td>
                    <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-200"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Non-Management per-location rows -->
            <template v-for="loc in fnbPayrollLocationsNonManagement" :key="'nonmgmt-loc-' + loc">
              <tr class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
                <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                  <div class="flex items-center gap-1 text-green-800 dark:text-green-200">{{ loc }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'nonmgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <template v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-cell-' + loc + '-' + year + '-' + label">
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getFnbPayrollMonthlySalaryByLocation(year, label, loc, 'non-management')) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30 dark:text-gray-200">
                        
                      </td>
                    </template>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                      <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getFnbPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Total Payroll -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbPayroll(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatPercentage(getTotalFnbPayrollPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbPayrollYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbPayrollYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Payroll Related Sub Header -->
            <tr class="bg-green-700 border-b border-green-700">
              <td class="px-3 py-2 font-semibold border-r border-green-700">
                <div class="flex items-center gap-1 text-white">
                  Payroll Related
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-related-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-related-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Payroll Related Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasPayrollRelatedSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Payroll Related"
              :icon="Users"
              message="No payroll related data available for Food & Beverage department in the selected period."
            />

            <!-- NSSIT Row -->
            <tr v-if="hasPayrollRelatedData('NSSIT')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">NSSIT</div>
              </td>
              <template v-for="year in visibleYears" :key="'nssit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'nssit-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'NSSIT')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Vacation Row -->
            <tr v-if="hasPayrollRelatedData('Vacation')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Vacation</div>
              </td>
              <template v-for="year in visibleYears" :key="'vacation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'vacation-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Vacation')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Relocation Row -->
            <tr v-if="hasPayrollRelatedData('Relocation')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Relocation</div>
              </td>
              <template v-for="year in visibleYears" :key="'relocation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'relocation-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Relocation')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Severence & Indemnity Row -->
            <tr v-if="hasPayrollRelatedData('Severence & Indemnity')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Severence & Indemnity</div>
              </td>
              <template v-for="year in visibleYears" :key="'severence-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'severence-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Severence & Indemnity')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Row -->
            <tr v-if="hasPayrollRelatedData('Other')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Other</div>
              </td>
              <template v-for="year in visibleYears" :key="'other-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'other-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Other')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Medical Row -->
            <tr v-if="hasPayrollRelatedData('Medical')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Medical</div>
              </td>
              <template v-for="year in visibleYears" :key="'medical-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'medical-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Medical')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Uniforms Row -->
            <tr v-if="hasPayrollRelatedData('Uniforms')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Uniforms</div>
              </td>
              <template v-for="year in visibleYears" :key="'uniforms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'uniforms-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Uniforms')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Employee Meal Row -->
            <tr v-if="hasPayrollRelatedData('Employee Meal')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Employee Meal</div>
              </td>
              <template v-for="year in visibleYears" :key="'employee-meal-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'employee-meal-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Employee Meal')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Transport Row -->
            <tr v-if="hasPayrollRelatedData('Transport')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Transport</div>
              </td>
              <template v-for="year in visibleYears" :key="'transport-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'transport-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Transport')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Telephone Row -->
            <tr v-if="hasPayrollRelatedData('Telephone')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Telephone</div>
              </td>
              <template v-for="year in visibleYears" :key="'telephone-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'telephone-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Telephone')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Air Ticket Row -->
            <tr v-if="hasPayrollRelatedData('Air Ticket')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Air Ticket</div>
              </td>
              <template v-for="year in visibleYears" :key="'air-ticket-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'air-ticket-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Air Ticket')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Benefits Row -->
            <tr v-if="hasPayrollRelatedData('Other Benefits')" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Other Benefits</div>
              </td>
              <template v-for="year in visibleYears" :key="'other-benefits-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'other-benefits-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getPayrollRelatedValue(year, label, 'Other Benefits')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Payroll Related Expenses -->
            <tr class="bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll Related Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-related-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-related-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Bonus Sub Header -->
            <tr class="bg-green-700 border-b border-green-700">
              <td class="px-3 py-2 font-semibold border-r border-green-700">
                <div class="flex items-center gap-1 text-white">
                  Bonus
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                    <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-green-700 bg-green-700"></td>
                </template>
              </template>
            </tr>

            <!-- No Bonus Data Message -->
            <ReportSectionNoDataRow
              :has-data="hasBonusSubsectionData()"
              :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length * 2 + 1), 0)"
              section-name="Bonus"
              :icon="Users"
              message="No bonus data available for Food & Beverage department in the selected period."
            />

            <!-- Bonus Details Row -->
            <tr v-if="hasBonusData()" class="bg-green-100 dark:bg-green-800/30 border-b border-green-300 dark:border-green-700">
              <td class="px-3 py-2 font-medium border-r border-green-300 dark:border-green-700">
                <div class="flex items-center gap-1 text-green-800 dark:text-green-200">Bonus Details</div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-details-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-details-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-700 dark:text-green-300">{{ formatMoney(getBonusValue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-800/30">
                      <span class="font-mono text-xs text-green-600">{{ formatPercentage(getBonusPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBonusTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-300 dark:border-green-700 font-semibold bg-green-200 dark:bg-green-700/30">
                    <span class="font-mono text-xs text-green-800 dark:text-green-200">{{ formatMoney(getBonusTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL EXPENSES Row -->
            <tr class="bg-green-700 border-b-2 border-green-800">
              <td class="px-3 py-2 font-bold border-r border-green-800">
                <div class="flex items-center gap-1 text-white">
                  TOTAL EXPENSES
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-expenses-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpenses(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getTotalExpensesPercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-800 font-bold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- DEPARTMENTAL INCOME (LOSS) Row -->
            <tr class="bg-green-600 dark:bg-green-900/20 text-white dark:text-gray-2000 border-b-2 border-green-700">
              <td class="px-3 py-2 font-bold border-r border-green-700">
                <div class="flex items-center gap-1 text-white">
                  DEPARTMENTAL INCOME (LOSS)
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'departmental-income-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'departmental-income-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-green-700 font-semibold bg-green-600 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getDepartmentalIncome(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-700 font-semibold bg-green-600 dark:bg-green-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-green-200">{{ formatPercentage(getDepartmentalIncomePercentage(year, label)) }}%</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-green-700 font-bold bg-green-600 dark:bg-green-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getDepartmentalIncomeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-700 font-bold bg-green-600 dark:bg-green-900/20 text-white dark:text-gray-2000">
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
import { computed, ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/_master_utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { PAGE, ROW, DEPARTMENT, EXPENSE } from '@/components/utility/_master_utility/cacheKeys.js';
import { getRestaurants } from '@/components/utility/f&b_revenue_assumpt/get_restaurants.js';
import ReportSectionNoDataRow from '@/components/ui/reports/general/ReportSectionNoDataRow.vue';
import { getAudiovisualRevenue } from './utility/revenueData.js';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building2,
  DollarSign,
  Utensils,
  Coffee,
  Users
} from 'lucide-vue-next';

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

// Computed properties
const projectName = computed(() => selectedProject.value?.project_name || 'Project Name');

// UI helpers
function toggleCollapse(year) {
  yearSettingsStore.toggleCollapse(year);
}
function isYearCollapsed(year) {
  return yearSettingsStore.isYearCollapsed(year);
}
function getColumnLabelsForYear(year) {
  const mode = advancedModes.value[year] || 'monthly';
  if (mode === 'monthly') return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (mode === 'quarterly') return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

// Utilities
function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
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

// Period mapping for quarterly labels
function getMonthsForLabel(label) {
  if (label === 'Jan-Mar') return ['Jan', 'Feb', 'Mar'];
  if (label === 'Apr-Jun') return ['Apr', 'May', 'Jun'];
  if (label === 'Jul-Sep') return ['Jul', 'Aug', 'Sep'];
  if (label === 'Oct-Dec') return ['Oct', 'Nov', 'Dec'];
  return [label];
}

// Statistics from F&B page cache
function getNoOfRooms(year, label) {
  try {
    // Check if market segmentation is enabled
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';

    // Get room count from room revenue page via calculation cache
    // Both scenarios (market segmentation on/off) now cache to the same location
    const roomCount = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);

    if (roomCount !== undefined && roomCount !== null) {
      return getNumber(roomCount);
    }

    // Default fallback
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
function getAvailableRooms(year, label) {
  try {
    // First try: Get from normalized F&B cache (stored as '__ALL__' restaurant)
    let availableRooms = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'roomsAvailable', year, label);

    if (availableRooms !== undefined && availableRooms !== null && availableRooms !== 0) {
      return getNumber(availableRooms);
    }

    // Second try: Calculate from Room Revenue page - Total Rooms * Days
    const totalRooms = calculationCache.getValue(projectName.value, PAGE.ROOM_REVENUE, ROW.TOTAL_ROOMS, year, label);
    if (totalRooms !== undefined && totalRooms !== null) {
      const days = getNoOfDays(year, label);
      const calculatedValue = getNumber(totalRooms) * days;
      return calculatedValue;
    }

    // Fallback calculation: Use cached room count × days
    const rooms = getNoOfRooms(year, label);
    const days = getNoOfDays(year, label);
    const fallbackValue = rooms * days;

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
function getSoldRooms(year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const soldRooms = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'roomsSoldExcl', year, label);

    if (soldRooms !== undefined && soldRooms !== null && soldRooms !== 0) {
      return getNumber(soldRooms);
    }

    // Fallback: Calculate based on occupancy percentage if available
    const occupancy = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
      const availableRooms = getAvailableRooms(year, label);
      const calculatedSoldRooms = Math.round((getNumber(occupancy) / 100) * availableRooms);
      return calculatedSoldRooms;
    }

    // Default fallback: Use 75% occupancy as placeholder
    const availableRooms = getAvailableRooms(year, label);
    const placeholderSoldRooms = Math.round(availableRooms * 0.75);
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
function getOccupancyPercentage(year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const occupancy = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'occupancyExcl', year, label);
    if (occupancy !== undefined && occupancy !== null && occupancy !== 0) {
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
function getNumberOfGuests(year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const guests = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'numberOfGuests', year, label);
    if (guests !== undefined && guests !== null && guests !== 0) {
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
function getNumberOfCovers(year, label) {
  try {
    // Get from normalized F&B cache - sum up all restaurant covers
    const restaurantList = getRestaurantList();
    let totalCovers = 0;

    for (const restaurant of restaurantList) {
      const restaurantName = restaurant.name || restaurant;
      const covers = calculationCache.getFnbMetric(projectName.value, restaurantName, 'totalCover', year, label);
      if (covers !== undefined && covers !== null) {
        totalCovers += getNumber(covers);
      }
    }

    if (totalCovers > 0) {
      return totalCovers;
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
function getRevPerAvailableRoom(year, label) {
  try {
    // Get from normalized F&B cache (stored as '__ALL__' restaurant)
    const revPerRoom = calculationCache.getFnbMetric(projectName.value, '__ALL__', 'revpar', year, label);
    if (revPerRoom !== undefined && revPerRoom !== null && revPerRoom !== 0) {
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

// Revenue
function getTotalFnbRevenue(year, label) {
  // Calculate from restaurant revenues (normalized cache)
  const foodRevenue = getTotalFoodRevenue(year, label);
  const beverageRevenue = getTotalBeverageRevenue(year, label);
  return getNumber(foodRevenue) + getNumber(beverageRevenue);
}
function getTotalFnbRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getTotalFnbRevenue(year, label)), 0);
}

// Data availability checks
function hasNoOfRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfRooms(year, label) > 0) return true;
    }
  }
  return false;
}
function hasNoOfDaysData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNoOfDays(year, label) > 0) return true;
    }
  }
  return false;
}
function hasAvailableRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAvailableRooms(year, label) > 0) return true;
    }
  }
  return false;
}
function hasSoldRoomsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getSoldRooms(year, label) > 0) return true;
    }
  }
  return false;
}
function hasOccupancyData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOccupancyPercentage(year, label) > 0) return true;
    }
  }
  return false;
}
function hasGuestsData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNumberOfGuests(year, label) > 0) return true;
    }
  }
  return false;
}
function hasCoversData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getNumberOfCovers(year, label) > 0) return true;
    }
  }
  return false;
}
function hasFnbSpentData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAverageFnbSpent(year, label) > 0) return true;
    }
  }
  return false;
}
function hasRoomRateData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getAverageRoomRate(year, label) > 0) return true;
    }
  }
  return false;
}
function hasRevPerRoomData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getRevPerAvailableRoom(year, label) > 0) return true;
    }
  }
  return false;
}

// Restaurant-specific revenue functions
const restaurants = ref([]);

// Load restaurants from the API
onMounted(async () => {
  try {
    if (selectedProject.value?.project_name) {
      const restaurantList = await getRestaurants(selectedProject.value.project_name);
      restaurants.value = restaurantList;
      //  // console.log('🍽️ Loaded restaurants from API:', restaurantList);

      // Log each restaurant to see the structure
      restaurantList.forEach((restaurant, index) => {
        //  // console.log(`Restaurant ${index + 1}:`, restaurant);
      });
    }
  } catch (error) {
    console.error('Error loading restaurants:', error);
    restaurants.value = [];
  }
});

// Watch for project changes to reload restaurants
watch(selectedProject, async (newProject) => {
  if (newProject?.project_name) {
    try {
      const restaurantList = await getRestaurants(newProject.project_name);
      restaurants.value = restaurantList;
      // console.log('Reloaded restaurants for new project:', restaurantList);
    } catch (error) {
      console.error('Error reloading restaurants for new project:', error);
      restaurants.value = [];
    }
  }
});

function getRestaurantList() {
  try {
    const names = new Set();
    const project = projectName.value;
    // Prefer normalized F&B cache to auto-discover restaurants
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.fnb?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((restaurantKey) => {
        if (!restaurantKey || restaurantKey === '__ALL__') return;
        names.add(restaurantKey);
      });
    });

    // Debug logging
    if (names.size === 0) {
      console.log('[FNB PnL] No restaurants found in normalized cache');
      console.log('[FNB PnL] Project:', project);
      console.log('[FNB PnL] Years:', props.visibleYears);
      console.log('[FNB PnL] FNB Cache structure:', calculationCache?.fnb?.[project]);
      console.log('[FNB PnL] Fallback restaurants:', restaurants.value);
    } else {
      // console.log('[FNB PnL] Found restaurants:', Array.from(names));
    }

    if (names.size > 0) {
      return Array.from(names).map(n => ({ name: n }));
    }
    // Fallback to existing list when normalized cache not yet hydrated
    return restaurants.value;
  } catch (e) {
    console.error('[FNB PnL] Error getting restaurant list:', e);
    return restaurants.value;
  }
}

function getRestaurantFoodRevenue(restaurant, year, label) {
  try {
    // Get restaurant name (handle both object and string)
    const restaurantName = restaurant.name || restaurant;
    const project = projectName.value;

    // Prefer normalized F&B metric
    const normalized = calculationCache.getFnbMetric(project, restaurantName, 'totalFoodRevenue', year, label);

    // Debug logging for first call
    // if (label === 'Jan' && props.visibleYears && year === props.visibleYears[0]) {
    //   console.log(`[FNB PnL] Getting food revenue for ${restaurantName} (${year}-${label}):`, normalized);
    // }

    if (normalized !== undefined && normalized !== null && normalized !== 0) return getNumber(normalized);

    // Legacy PAGE cache using concatenated row key
    const cacheKey = `Total Food Revenue:${restaurantName}`;
    const val = calculationCache.getValue(project, PAGE.FNB_REVENUE, cacheKey, year, label);
    if (val !== undefined && val !== null) return getNumber(val);

    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: ROW.TOTAL_FOOD_REVENUE
    };

    const fallbackVal = calculationCache.getValue(
      project,
      PAGE.FNB_REVENUE,
      JSON.stringify(rowData),
      year,
      label
    );
    if (fallbackVal !== undefined && fallbackVal !== null) return getNumber(fallbackVal);

    console.log(`[FNB PnL] ❌ No food revenue data found for ${restaurantName} in ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`[FNB PnL] Error getting food revenue for ${restaurant}:`, error);
    return 0;
  }
}
function getRestaurantFoodRevenueYear(restaurant, year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getRestaurantFoodRevenue(restaurant, year, label)), 0);
}

function getRestaurantBeverageRevenue(restaurant, year, label) {
  try {
    // Get restaurant name (handle both object and string)
    const restaurantName = restaurant.name || restaurant;
    const project = projectName.value;

    // Prefer normalized F&B metric
    const normalized = calculationCache.getFnbMetric(project, restaurantName, 'totalBeverageRevenue', year, label);
    if (normalized !== undefined && normalized !== null && normalized !== 0) return getNumber(normalized);

    // Legacy PAGE cache using concatenated row key
    const cacheKey = `Total Beverage Revenue:${restaurantName}`;
    const val = calculationCache.getValue(project, PAGE.FNB_REVENUE, cacheKey, year, label);
    if (val !== undefined && val !== null) return getNumber(val);

    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: ROW.TOTAL_BEVERAGE_REVENUE
    };

    const fallbackVal = calculationCache.getValue(
      project,
      PAGE.FNB_REVENUE,
      JSON.stringify(rowData),
      year,
      label
    );
    if (fallbackVal !== undefined && fallbackVal !== null) return getNumber(fallbackVal);

    // console.log(`❌ No beverage revenue data found for ${restaurantName} in ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting beverage revenue for ${restaurant}:`, error);
    return 0;
  }
}
function getRestaurantBeverageRevenueYear(restaurant, year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getRestaurantBeverageRevenue(restaurant, year, label)), 0);
}

// Hardcoded Food Revenue functions
function getBanquetFoodRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    const val = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, ROW.FOOD, year, label);
    
    if (val !== undefined && val !== null && val !== 0) {
      return getNumber(val);
    }
    
    return 0;

  } catch (error) {
    console.error(`[FNB PnL] Error getting banquet food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getBanquetFoodRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getBanquetFoodRevenue(year, label)), 0);
}

function getOutsideCateringFoodRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Try common row codes for outside catering food revenue
    const possibleRowCodes = [
      'outside_service_food_catering',
      'outside_catering_food',
      'catering_food',
      'outside_food_service',
      'external_catering_food'
    ];

    for (const rowCode of possibleRowCodes) {
      const val = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, rowCode, year, label);
      if (val !== undefined && val !== null) {
        //  // console.log(`✅ Found outside catering food revenue from ${rowCode}: ${val} for ${year} ${label}`);
        return getNumber(val);
      }
    }

    // console.log(`❌ No outside catering food revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting outside catering food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getOutsideCateringFoodRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getOutsideCateringFoodRevenue(year, label)), 0);
}

// Hardcoded Beverage Revenue functions
function getBanquetBeverageRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Sum up Liquor + Soft Drinks for the month
    const liquorValue = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, ROW.LIQUOR, year, label);
    const softDrinksValue = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, ROW.SOFT_DRINKS, year, label);

    const liquor = getNumber(liquorValue) || 0;
    const softDrinks = getNumber(softDrinksValue) || 0;
    const total = liquor + softDrinks;

    if (liquor > 0 || softDrinks > 0) {
      //  // console.log(`✅ Found banquet beverage revenue for ${year} ${label}: Liquor: ${liquor}, Soft Drinks: ${softDrinks}, Total: ${total}`);
      return total;
    }

    //  // console.log(`❌ No banquet beverage revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting banquet beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getBanquetBeverageRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getBanquetBeverageRevenue(year, label)), 0);
}

function getOutsideCateringBeverageRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Based on your cache logs, this uses the exact row code: "outside_service_beverage_catering"
    const val = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, 'outside_service_beverage_catering', year, label);

    if (val !== undefined && val !== null) {
      //  // console.log(`✅ Found outside catering beverage revenue: ${val} for ${year} ${label}`);
      return getNumber(val);
    }

    // console.log(`❌ No outside catering beverage revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting outside catering beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getOutsideCateringBeverageRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getOutsideCateringBeverageRevenue(year, label)), 0);
}

// Other Revenue functions
function getFunctionRoomRentalRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Based on your cache logs, this uses the exact row code: "Hall Space Charges"
    const val = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, 'Hall Space Charges', year, label);

    if (val !== undefined && val !== null) {
      //  // console.log(`✅ Found function room rental revenue: ${val} for ${year} ${label}`);
      return getNumber(val);
    }

    //  // console.log(`❌ No function room rental revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting function room rental revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getFunctionRoomRentalRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getFunctionRoomRentalRevenue(year, label)), 0);
}

function getMiscellaneousOtherRevenue(year, label) {
  try {
    // Get from Banquet Revenue Assumptions page cache
    // Sum up Tobacco + non_fnb + Others for the month
    const tobaccoValue = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, 'tobacco', year, label);
    const nonFnbValue = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, 'non_fnb', year, label);
    const othersValue = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, 'others', year, label);

    const tobacco = getNumber(tobaccoValue) || 0;
    const nonFnb = getNumber(nonFnbValue) || 0;
    const others = getNumber(othersValue) || 0;

    // Try to find any additional banquet detail rows that might exist
    const additionalRowCodes = [
      'additional_revenue',
      'extra_revenue',
      'supplementary_revenue',
      'additional_income',
      'extra_income'
    ];

    let additionalTotal = 0;
    for (const rowCode of additionalRowCodes) {
      const val = calculationCache.getValue(projectName.value, PAGE.BANQUET_REVENUE, rowCode, year, label);
      if (val !== undefined && val !== null) {
        const additionalValue = getNumber(val) || 0;
        additionalTotal += additionalValue;
        //  // console.log(`✅ Found additional revenue from ${rowCode}: ${additionalValue} for ${year} ${label}`);
      }
    }

    const total = tobacco + nonFnb + others + additionalTotal;

    if (total > 0) {
      //  // console.log(`✅ Found miscellaneous other revenue for ${year} ${label}: Tobacco: ${tobacco}, non_fnb: ${nonFnb}, Others: ${others}, Additional: ${additionalTotal}, Total: ${total}`);
      return total;
    }

    //  // console.log(`❌ No miscellaneous other revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting miscellaneous other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getMiscellaneousOtherRevenueYear(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getMiscellaneousOtherRevenue(year, label)), 0);
}

// Total Other Revenue functions
function getTotalOtherRevenue(year, label) {
  try {
    const functionRoomRental = getFunctionRoomRentalRevenue(year, label);
    const miscellaneousOther = getMiscellaneousOtherRevenue(year, label);
    const total = getNumber(functionRoomRental) + getNumber(miscellaneousOther);

    return total;
  } catch (error) {
    console.error(`Error calculating total other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalOtherRevenueYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalOtherRevenue(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total other revenue for year ${year}:`, error);
    return 0;
  }
}

// Total Food Revenue functions
function getTotalFoodRevenue(year, label) {
  try {
    const restaurantList = getRestaurantList();
    let total = 0;

    for (const restaurant of restaurantList) {
      const revenue = getRestaurantFoodRevenue(restaurant, year, label);
      total += getNumber(revenue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total food revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalFoodRevenueYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalFoodRevenue(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total food revenue for year ${year}:`, error);
    return 0;
  }
}

// Total Beverage Revenue functions
function getTotalBeverageRevenue(year, label) {
  try {
    const restaurantList = getRestaurantList();
    let total = 0;

    for (const restaurant of restaurantList) {
      const revenue = getRestaurantBeverageRevenue(restaurant, year, label);
      total += getNumber(revenue);
    }

    return total;
  } catch (error) {
    console.error(`Error calculating total beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalBeverageRevenueYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalBeverageRevenue(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total beverage revenue for year ${year}:`, error);
    return 0;
  }
}

// Total Food & Beverage Revenue functions
function getTotalFoodAndBeverageRevenue(year, label) {
  try {
    const foodRevenue = getTotalFoodRevenue(year, label);
    const beverageRevenue = getTotalBeverageRevenue(year, label);
    const total = getNumber(foodRevenue) + getNumber(beverageRevenue);

    return total;
  } catch (error) {
    console.error(`Error calculating total food & beverage revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalFoodAndBeverageRevenueYear(year) {
  try {
    const foodYearTotal = getTotalFoodRevenueYear(year);
    const beverageYearTotal = getTotalBeverageRevenueYear(year);
    const yearTotal = getNumber(foodYearTotal) + getNumber(beverageYearTotal);

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total food & beverage revenue for year ${year}:`, error);
    return 0;
  }
}

// Total Revenue functions (F&B + Other Revenue)
function getTotalRevenue(year, label) {
  try {
    const fnbRevenue = getTotalFoodAndBeverageRevenue(year, label);
    const otherRevenue = getTotalOtherRevenue(year, label);
    const total = getNumber(fnbRevenue) + getNumber(otherRevenue);

    return total;
  } catch (error) {
    console.error(`Error calculating total revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalRevenueYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalRevenue(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total revenue for year ${year}:`, error);
    return 0;
  }
}

// Revenue percentage functions (relative to TOTAL REVENUE)
function getRestaurantFoodRevenuePercentage(restaurant, year, label) {
  try {
    const revenue = getRestaurantFoodRevenue(restaurant, year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating restaurant food revenue percentage:', error);
    return 0;
  }
}

function getRestaurantBeverageRevenuePercentage(restaurant, year, label) {
  try {
    const revenue = getRestaurantBeverageRevenue(restaurant, year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating restaurant beverage revenue percentage:', error);
    return 0;
  }
}

function getBanquetFoodRevenuePercentage(year, label) {
  try {
    const revenue = getBanquetFoodRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating banquet food revenue percentage:', error);
    return 0;
  }
}

function getBanquetBeverageRevenuePercentage(year, label) {
  try {
    const revenue = getBanquetBeverageRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating banquet beverage revenue percentage:', error);
    return 0;
  }
}

function getOutsideCateringFoodRevenuePercentage(year, label) {
  try {
    const revenue = getOutsideCateringFoodRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating outside catering food revenue percentage:', error);
    return 0;
  }
}

function getOutsideCateringBeverageRevenuePercentage(year, label) {
  try {
    const revenue = getOutsideCateringBeverageRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating outside catering beverage revenue percentage:', error);
    return 0;
  }
}

function getFunctionRoomRentalRevenuePercentage(year, label) {
  try {
    const revenue = getFunctionRoomRentalRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating function room rental revenue percentage:', error);
    return 0;
  }
}

function getMiscellaneousOtherRevenuePercentage(year, label) {
  try {
    const revenue = getMiscellaneousOtherRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating miscellaneous other revenue percentage:', error);
    return 0;
  }
}

function getTotalFoodRevenuePercentage(year, label) {
  try {
    const revenue = getTotalFoodRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total food revenue percentage:', error);
    return 0;
  }
}

function getTotalBeverageRevenuePercentage(year, label) {
  try {
    const revenue = getTotalBeverageRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total beverage revenue percentage:', error);
    return 0;
  }
}

function getTotalFoodAndBeverageRevenuePercentage(year, label) {
  try {
    const revenue = getTotalFoodAndBeverageRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total food & beverage revenue percentage:', error);
    return 0;
  }
}

function getTotalOtherRevenuePercentage(year, label) {
  try {
    const revenue = getTotalOtherRevenue(year, label);
    const totalRevenue = getTotalRevenue(year, label);
    if (totalRevenue > 0) {
      return Number(((revenue / totalRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total other revenue percentage:', error);
    return 0;
  }
}

function getTotalRevenuePercentage(year, label) {
  try {
    // Total revenue percentage is always 100%
    return 100;
  } catch (error) {
    console.error('Error calculating total revenue percentage:', error);
    return 0;
  }
}

// Service Charge functions
function getServiceCharge(year, label) {
  try {
    // Get from calculation cache - you can adjust the page and row code as needed
    // For now, returning 0 as placeholder - you'll need to connect this to your data source
    const serviceCharge = calculationCache.getValue(projectName.value, PAGE.FNB_REVENUE, 'Service Charge', year, label);

    if (serviceCharge !== undefined && serviceCharge !== null) {
      return getNumber(serviceCharge);
    }

    // Default fallback - you can adjust this calculation as needed
    // For example, if service charge is typically 10% of total revenue
    const totalRevenue = getTotalRevenue(year, label);
    const defaultServiceCharge = totalRevenue * 0.10; // 10% service charge

    return defaultServiceCharge;
  } catch (error) {
    console.error(`Error getting service charge for ${year} ${label}:`, error);
    return 0;
  }
}

function getServiceChargeYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthServiceCharge = getServiceCharge(year, label);
      yearTotal += getNumber(monthServiceCharge);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating service charge for year ${year}:`, error);
    return 0;
  }
}

// Total Revenue Including Service Charge functions
function getTotalRevenueInclServiceCharge(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL REVENUE Incl. SC';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] TOTAL REVENUE Incl. SC retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    const totalRevenue = getTotalRevenue(year, label);
    const serviceCharge = getServiceCharge(year, label);
    const total = getNumber(totalRevenue) + getNumber(serviceCharge);
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, total);
    console.log('[F&B P&L] Cached TOTAL REVENUE Incl. SC:', { project, year, label, total });

    return total;
  } catch (error) {
    console.error(`Error calculating total revenue including service charge for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalRevenueInclServiceChargeYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL REVENUE Incl. SC';
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] TOTAL REVENUE Incl. SC Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const yearTotal = labels.reduce((sum, label) => sum + getNumber(getTotalRevenueInclServiceCharge(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[F&B P&L] Cached TOTAL REVENUE Incl. SC Year Total:', { project, year, yearTotal });

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total revenue including service charge for year ${year}:`, error);
    return 0;
  }
}

// Cost of Food Sales functions
function getCostOfFoodSales(year, label) {
  try {
    // Fetch amount directly from normalized expense cache
    // Note: Using exact name as cached (with trailing space and uppercase S)
    const amount = calculationCache.getExpense(
      projectName.value,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      'Cost of Food Sales ',
      year,
      label
    );
    return getNumber(amount);
  } catch (error) {
    console.error(`Error getting cost of food sales for ${year} ${label}:`, error);
    return 0;
  }
}

function getCostOfFoodSalesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthCostOfFoodSales = getCostOfFoodSales(year, label);
      yearTotal += getNumber(monthCostOfFoodSales);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating cost of food sales for year ${year}:`, error);
    return 0;
  }
}

// Cost of Beverage Sales functions
function getCostOfBeverageSales(year, label) {
  try {
    // Fetch amount directly from normalized expense cache
    // Note: Using exact name as cached (with trailing space and uppercase S)
    const amount = calculationCache.getExpense(
      projectName.value,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      'Cost of Beverage Sales ',
      year,
      label
    );
    return getNumber(amount);
  } catch (error) {
    console.error(`Error getting cost of beverage sales for ${year} ${label}:`, error);
    return 0;
  }
}

function getCostOfBeverageSalesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthCostOfBeverageSales = getCostOfBeverageSales(year, label);
      yearTotal += getNumber(monthCostOfBeverageSales);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating cost of beverage sales for year ${year}:`, error);
    return 0;
  }
}

// Total F&B Cost of Sales functions
function getTotalFnbCostOfSales(year, label) {
  try {
    const costOfFoodSales = getCostOfFoodSales(year, label);
    const costOfBeverageSales = getCostOfBeverageSales(year, label);
    const total = getNumber(costOfFoodSales) + getNumber(costOfBeverageSales);

    return total;
  } catch (error) {
    console.error(`Error calculating total F&B cost of sales for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalFnbCostOfSalesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalFnbCostOfSales(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total F&B cost of sales for year ${year}:`, error);
    return 0;
  }
}

// Audiovisual Cost functions
function getAudiovisualCost(year, label) {
  try {
    // Audiovisual Cost = Cost of Beverage sales * (Audiovisual Revenue)
    // Rate source: normalized expense cache -> Cost of Beverage sales
    const rateRaw = calculationCache.getExpense(
      projectName.value,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_BEVERAGE_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const avRevenue = getAudiovisualRevenue(calculationCache, projectName.value, year, label);
    return getNumber(avRevenue) * rate;
  } catch (error) {
    console.error(`Error getting audiovisual costs for ${year} ${label}:`, error);
    return 0;
  }
}

function getAudiovisualCostYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthAudiovisuals = getAudiovisualCost(year, label);
      yearTotal += getNumber(monthAudiovisuals);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating audiovisual costs for year ${year}:`, error);
    return 0;
  }
}

// Miscellaneous Cost functions
function getMiscellaneousCost(year, label) {
  try {
    // Miscellaneous Cost = Cost of Beverage sales * (Miscellaneous Other Revenue)
    // Rate source: normalized expense cache -> Cost of Beverage sales
    const rateRaw = calculationCache.getExpense(
      projectName.value,
      DEPARTMENT.FOOD_AND_BEVERAGE,
      EXPENSE.COST_OF_BEVERAGE_SALES,
      year,
      label
    );
    const rateNum = getNumber(rateRaw);
    const rate = rateNum > 1 ? rateNum / 100 : rateNum; // accept 30 or 0.30
    const miscOtherRevenue = getMiscellaneousOtherRevenue(year, label);
    return getNumber(miscOtherRevenue) * rate;
  } catch (error) {
    console.error(`Error getting miscellaneous costs for ${year} ${label}:`, error);
    return 0;
  }
}

function getMiscellaneousCostYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthMiscellaneous = getMiscellaneousCost(year, label);
      yearTotal += getNumber(monthMiscellaneous);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating miscellaneous costs for year ${year}:`, error);
    return 0;
  }
}

// Total Cost of Other Revenue functions
function getTotalCostOfOtherRevenue(year, label) {
  try {
    const miscellaneousCost = getMiscellaneousCost(year, label);
    const audiovisualCost = getAudiovisualCost(year, label);
    const total = getNumber(miscellaneousCost) + getNumber(audiovisualCost);

    return total;
  } catch (error) {
    console.error(`Error calculating total cost of other revenue for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalCostOfOtherRevenueYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthTotal = getTotalCostOfOtherRevenue(year, label);
      yearTotal += getNumber(monthTotal);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total cost of other revenue for year ${year}:`, error);
    return 0;
  }
}

// Total Cost of Sales functions
function getTotalCostOfSales(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL COST OF SALES';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] TOTAL COST OF SALES retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    const totalFnbCostOfSales = getTotalFnbCostOfSales(year, label);
    const totalCostOfOtherRevenue = getTotalCostOfOtherRevenue(year, label);
    const total = getNumber(totalFnbCostOfSales) + getNumber(totalCostOfOtherRevenue);
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, total);
    console.log('[F&B P&L] Cached TOTAL COST OF SALES:', { project, year, label, total });

    return total;
  } catch (error) {
    console.error(`Error calculating total cost of sales for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalCostOfSalesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL COST OF SALES';
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] TOTAL COST OF SALES Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const yearTotal = labels.reduce((sum, label) => sum + getNumber(getTotalCostOfSales(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[F&B P&L] Cached TOTAL COST OF SALES Year Total:', { project, year, yearTotal });

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total cost of sales for year ${year}:`, error);
    return 0;
  }
}

// Gross Profit functions
function getGrossProfit(year, label) {
  try {
    const totalRevenue = getTotalRevenue(year, label);
    const totalCostOfSales = getTotalCostOfSales(year, label);
    const grossProfit = getNumber(totalRevenue) - getNumber(totalCostOfSales);

    return grossProfit;
  } catch (error) {
    console.error(`Error calculating gross profit for ${year} ${label}:`, error);
    return 0;
  }
}

function getGrossProfitYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthGrossProfit = getGrossProfit(year, label);
      yearTotal += getNumber(monthGrossProfit);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating gross profit for year ${year}:`, error);
    return 0;
  }
}

// F&B Expenses functions
function getFnbExpenses() {
  // Dynamically read F&B expense categories from the normalized expense cache
  try {
    const projectId = projectName.value;
    const fnbExpenses = calculationCache.expenses?.[projectId]?.[DEPARTMENT.FOOD_AND_BEVERAGE] || {};

    // Get all expense names (keys) from the F&B department
    const expenseNames = Object.keys(fnbExpenses);

    // Exclude Cost of Food sales and Cost of Beverage sales rows from F&B expenses list
    const normalize = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
    const excluded = new Set(['cost of food sales', 'cost of beverage sales', 'miscellaneous cost', 'audiovisual cost']);
    const filteredExpenses = expenseNames.filter(name => !excluded.has(normalize(name)));

    // Sort for stable display
    return filteredExpenses.sort();
  } catch (error) {
    console.error('Error reading F&B expense categories from cache:', error);
    return [];
  }
}

function getFnbExpense(expense, year, label) {
  try {
    // Get the expense value from the normalized expense cache
    const value = calculationCache.getExpense(projectName.value, DEPARTMENT.FOOD_AND_BEVERAGE, expense, year, label);

    if (value !== undefined && value !== null) {
      return getNumber(value);
    }

    return 0;
  } catch (error) {
    console.error(`Error getting F&B expense ${expense} for ${year} ${label}:`, error);
    return 0;
  }
}

function getFnbExpenseYear(expense, year) {
  try {
    const labels = getColumnLabelsForYear(year);
    let yearTotal = 0;

    for (const label of labels) {
      const monthExpense = getFnbExpense(expense, year, label);
      yearTotal += getNumber(monthExpense);
    }

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating F&B expense ${expense} for year ${year}:`, error);
    return 0;
  }
}

function getTotalFnbExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total F&B Expenses';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total F&B Expenses retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    const expenses = getFnbExpenses();
    let total = 0;

    for (const expense of expenses) {
      const expenseValue = getFnbExpense(expense, year, label);
      total += getNumber(expenseValue);
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, total);
    console.log('[F&B P&L] Cached Total F&B Expenses:', { project, year, label, total });

    return total;
  } catch (error) {
    console.error(`Error calculating total F&B expenses for ${year} ${label}:`, error);
    return 0;
  }
}

function getTotalFnbExpensesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total F&B Expenses';
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total F&B Expenses Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const yearTotal = labels.reduce((sum, label) => sum + getNumber(getTotalFnbExpenses(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[F&B P&L] Cached Total F&B Expenses Year Total:', { project, year, yearTotal });

    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total F&B expenses for year ${year}:`, error);
    return 0;
  }
}

// ==========================================================================
// F&B PAYROLL FUNCTIONS
// Uses values cached by Payroll page under keys like:
//   MonthlySalary|department:Food And Beverage|position:...|location:...|designation:...
// ==========================================================================

function parseFnbMonthlySalaryRowCode(rowCode) {
  try {
    if (!rowCode || !rowCode.startsWith('MonthlySalary|')) return null;
    const regex = /^MonthlySalary\|department:Food And Beverage\|position:(.*?)\|location:(.*?)\|designation:(.*)$/;
    const match = rowCode.match(regex);
    if (!match) return null;
    return {
      position: (match[1] || '').trim(),
      location: (match[2] || '').trim(),
      designation: (match[3] || '').trim()
    };
  } catch (e) {
    return null;
  }
}

function isFnbManagementPositionName(position) {
  if (!position) return false;
  const lower = position.toLowerCase();
  return (lower.includes('manager') && !lower.includes('non-manager')) || lower.includes('director') || lower.includes('supervisor');
}

const fnbPayrollLocationsManagement = computed(() => {
  try {
    const locs = new Set();
    const project = projectName.value;
    const depts = ['Food And Beverage', 'F&B'];
    // Prefer normalized payroll structure across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        if (!depts.includes(departmentKey)) return;
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasMgmt = Object.keys(byPosition).some((pos) => isFnbManagementPositionName(pos));
          if (hasMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (parsed && isFnbManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('F&B P&L: Error discovering payroll management locations:', e);
    return [];
  }
});

const fnbPayrollLocationsNonManagement = computed(() => {
  try {
    const locs = new Set();
    const project = projectName.value;
    const depts = ['Food And Beverage', 'F&B'];
    // Prefer normalized payroll structure across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        if (!depts.includes(departmentKey)) return;
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          const hasNonMgmt = Object.keys(byPosition).some((pos) => !isFnbManagementPositionName(pos));
          if (hasNonMgmt && locationKey) locs.add(locationKey);
        });
      });
    });
    if (locs.size > 0) return Array.from(locs);

    // Fallback to legacy PAGE cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (parsed && !isFnbManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    console.error('F&B P&L: Error discovering payroll non-management locations:', e);
    return [];
  }
});

function getFnbPayrollMonthlySalaryByLocation(year, label, location, group) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure - same approach as RoomProfitLoss.vue
    const payrollNorm = calculationCache?.payroll?.[project]?.[year] || {};
    const isMgmtGroup = group === 'management';
    const isNonMgmtGroup = group === 'non-management';
    Object.keys(payrollNorm).forEach((departmentKey) => {
      const byLocation = payrollNorm[departmentKey] || {};
      const locBucket = byLocation?.[location];
      if (!locBucket) return;
      Object.keys(locBucket).forEach((positionKey) => {
        const mgmt = isFnbManagementPositionName(positionKey);
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
      const parsed = parseFnbMonthlySalaryRowCode(rowCode);
      if (!parsed || !parsed.location || parsed.location !== location) return;
      const isMgmt = isFnbManagementPositionName(parsed.position);
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

function getFnbPayrollMonthlySalaryTotal(year, location, group) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getFnbPayrollMonthlySalaryByLocation(year, lab, location, group)), 0);
  } catch (e) {
    return 0;
  }
}

function getFnbPayrollMonthlySalaryPercentage(year, label, location, group) {
  try {
    const total = getFnbPayrollMonthlySalaryByLocation(year, label, location, group);
    const yearTotal = getFnbPayrollMonthlySalaryTotal(year, location, group);
    if (yearTotal === 0) return 0;
    return (total / yearTotal) * 100;
  } catch (error) {
    console.error('Error calculating F&B payroll monthly salary percentage:', error);
    return 0;
  }
}

function hasFnbPayrollGroupData(group) {
  try {
    const locs = group === 'management' ? fnbPayrollLocationsManagement.value : fnbPayrollLocationsNonManagement.value;
    if (!locs || locs.length === 0) return false;
    for (const year of (Array.isArray(props.visibleYears) ? props.visibleYears : [])) {
      for (const loc of locs) {
        const total = getFnbPayrollMonthlySalaryTotal(year, loc, group);
        if (getNumber(total) > 0) return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

function getTotalFnbPayroll(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total Payroll retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    let total = 0;

    // Add management payroll
    for (const loc of fnbPayrollLocationsManagement.value) {
      total += getNumber(getFnbPayrollMonthlySalaryByLocation(year, label, loc, 'management'));
    }

    // Add non-management payroll
    for (const loc of fnbPayrollLocationsNonManagement.value) {
      total += getNumber(getFnbPayrollMonthlySalaryByLocation(year, label, loc, 'non-management'));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, total);
    console.log('[F&B P&L] Cached Total Payroll:', { project, year, label, total });

    return total;
  } catch (e) {
    return 0;
  }
}

function getTotalFnbPayrollYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total Payroll Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((acc, lab) => acc + getNumber(getTotalFnbPayroll(year, lab)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', total);
    console.log('[F&B P&L] Cached Total Payroll Year Total:', { project, year, total });
    
    return total;
  } catch (e) {
    return 0;
  }
}

function getTotalFnbPayrollPercentage(year, label) {
  try {
    const totalRevenue = getTotalFnbRevenue(year, label);
    const totalPayroll = getTotalFnbPayroll(year, label);
    if (totalRevenue === 0) return 0;
    return (totalPayroll / totalRevenue) * 100;
  } catch (error) {
    console.error('Error calculating F&B payroll percentage:', error);
    return 0;
  }
}

// ============================================================================
// PAYROLL RELATED FUNCTIONS
// ============================================================================

// Get payroll related value for a specific benefit type, year, and period
function getPayrollRelatedValue(year, label, benefitType) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payrollRelated structure - sum across all positions/locations/designations
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

// Get total payroll related expenses for a specific year and period
function getTotalPayrollRelatedExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll Related Expenses';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total Payroll Related Expenses retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
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
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, total);
    console.log('[F&B P&L] Cached Total Payroll Related Expenses:', { project, year, label, total });
    
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
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Total Payroll Related Expenses Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getTotalPayrollRelatedExpenses(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', total);
    console.log('[F&B P&L] Cached Total Payroll Related Expenses Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total payroll related expenses for year:', error);
    return 0;
  }
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

// ============================================================================
// BONUS FUNCTIONS
// ============================================================================

// Get bonus value for a specific year and period from Bonus page cache
function getBonusValue(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Bonus Details';
    
    // Check if value is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Bonus Details retrieved from cache:', { project, year, label, cachedValue });
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
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, label, sum);
    console.log('[F&B P&L] Cached Bonus Details:', { project, year, label, sum });
    
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
    
    // Check if yearly total is already cached in F&B Report
    const cachedValue = calculationCache.getValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.FNB_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[F&B P&L] Bonus Details Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    // First try to get the yearly total directly from Bonus page cache
    const yearlyTotal = calculationCache.getValue(project, PAGE.BONUS, 'Total Hotel', year, 'Total');
    if (yearlyTotal !== undefined && yearlyTotal !== null) {
      const total = getNumber(yearlyTotal);
      // Cache the yearly total
      calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', total);
      console.log('[F&B P&L] Cached Bonus Details Year Total from Bonus page:', { project, year, total });
      return total;
    }
    
    // Fallback: sum all period labels if yearly total not available
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getBonusValue(year, label)), 0);
    
    // Cache the calculated yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.FNB_REPORT, cacheKey, year, 'Total', total);
    console.log('[F&B P&L] Cached Bonus Details Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating bonus total for year:', error);
    return 0;
  }
}

// Get bonus percentage relative to F&B revenue
function getBonusPercentage(year, label) {
  try {
    const monthValue = getBonusValue(year, label);
    const monthRevenue = getTotalFoodAndBeverageRevenue(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating bonus percentage:', error);
    return 0;
  }
}

// Check if bonus data exists
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

// Check if entire Bonus subsection has any data
function hasBonusSubsectionData() {
  return hasBonusData();
}

// ============================================================================
// TOTAL EXPENSES FUNCTIONS
// ============================================================================

// Get total expenses for a specific year and period
function getTotalExpenses(year, label) {
  try {
    let total = 0;
    
    // Add Total Cost of Sales
    total += getNumber(getTotalCostOfSales(year, label));
    
    // Add Total F&B Expenses
    total += getNumber(getTotalFnbExpenses(year, label));
    
    // Add Total Payroll
    total += getNumber(getTotalFnbPayroll(year, label));
    
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

// Get total expenses percentage relative to F&B revenue
function getTotalExpensesPercentage(year, label) {
  try {
    const monthValue = getTotalExpenses(year, label);
    const monthRevenue = getTotalRevenueInclServiceCharge(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating total expenses percentage:', error);
    return 0;
  }
}

// ============================================================================
// DEPARTMENTAL INCOME (LOSS) FUNCTIONS
// ============================================================================

// Get departmental income (loss) for a specific year and period
function getDepartmentalIncome(year, label) {
  try {
    // Calculate: TOTAL REVENUE (Incl. SC) - TOTAL EXPENSES
    const totalRevenue = getNumber(getTotalRevenueInclServiceCharge(year, label));
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

// Get departmental income percentage relative to F&B revenue
function getDepartmentalIncomePercentage(year, label) {
  try {
    const monthValue = getDepartmentalIncome(year, label);
    const monthRevenue = getTotalRevenueInclServiceCharge(year, label);
    
    if (monthRevenue > 0) {
      return Number(((monthValue / monthRevenue) * 100).toFixed(2));
    }
    return 0;
  } catch (error) {
    console.error('Error calculating departmental income percentage:', error);
    return 0;
  }
}

// ============================================================================
// SECTION-LEVEL DATA CHECKS for F&B
// ============================================================================

// Check if F&B Revenue section has any data
function hasFnbRevenueSectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;

  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalFnbRevenue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Check if F&B Expenses subsection has any data
function hasFnbExpenseSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;

  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalFnbExpenses(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Check if F&B Payroll subsection has any data
function hasFnbPayrollSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;

  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalFnbPayroll(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

</script>

<style scoped>
/* Component-specific styles, if any */
</style>


