<template>
  <div class="bg-white rounded-lg border border-purple-300 dark:border-purple-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-purple-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- P&L Statement Header Row -->
            <tr class="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-semibold tracking-wide">Profit & Loss Statement</h2>
                </div>
              </td>
            </tr>

            <!-- Year headers -->
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-purple-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
                class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-purple-700 transition-all duration-200 group text-sm"
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
            <tr class="bg-purple-500 dark:bg-purple-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <th
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-purple-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
                  <th class="px-2 py-1 text-center border border-purple-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-purple-300 min-w-[110px] font-semibold">
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
            <tr class="bg-purple-800 border-b-2 border-purple-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-purple-700">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
              </td>
            </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">NO OF ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'no-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">AVAILABLE ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'available-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">SOLD ROOMS (excl. comp)</div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sold-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">ROOM OCCUPANCY %</div>
              </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'occupancy-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">NUMBER OF GUESTS</div>
              </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'guests-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVERAGE ROOM RATE -->
            <tr v-if="hasRoomRateData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">AVERAGE ROOM RATE</div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-rate-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'avg-rate-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatMoney(getAverageRoomRate(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- REV PER AVAILABLE ROOM -->
            <tr v-if="hasRevPerRoomData()" class="bg-purple-50 dark:bg-purple-900/20 border-b border-purple-300 dark:border-purple-700">
              <td class="px-3 py-2 font-medium border-r border-purple-300 dark:border-purple-700">
                <div class="flex items-center gap-1">REVENUE PER AVAILABLE ROOM</div>
              </td>
              <template v-for="year in visibleYears" :key="'rev-per-room-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rev-per-room-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20">
                    <span class="font-mono text-xs">{{ formatMoney(getRevPerAvailableRoom(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 dark:border-purple-700 font-semibold bg-purple-100 dark:bg-purple-800/30">
                    <span class="font-mono text-xs text-purple-700 dark:text-purple-300">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row After Statistics -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-1-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Separator Line -->
            <tr class="bg-gray-300 border-b-2 border-gray-400">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>

            <!-- OPERATING REVENUE Section Header -->
            <tr class="bg-purple-800 border-b-2 border-purple-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  OPERATING REVENUE
                </div>
              </td>
            </tr>

            <!-- ROOMS Revenue -->
            <tr class="bg-purple-100 dark:bg-purple-800/30 border-b border-purple-300">
              <td class="px-3 py-2 font-medium border-r border-purple-300">ROOMS</td>
              <template v-for="year in visibleYears" :key="'rooms-rev-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-rev-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- FOOD AND BEVERAGE Revenue -->
            <tr class="bg-purple-100 dark:bg-purple-800/30 border-b border-purple-300">
              <td class="px-3 py-2 font-medium border-r border-purple-300">FOOD AND BEVERAGE</td>
              <template v-for="year in visibleYears" :key="'fnb-rev-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-rev-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OTHER OPERATED DEPARTMENTS Revenue -->
            <tr class="bg-purple-100 dark:bg-purple-800/30 border-b border-purple-300">
              <td class="px-3 py-2 font-medium border-r border-purple-300">OTHER OPERATED DEPARTMENTS</td>
              <template v-for="year in visibleYears" :key="'ood-rev-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-rev-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 font-semibold bg-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-2-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- TOTAL OPERATING REVENUE -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td class="px-3 py-2 font-bold border-r border-purple-800 text-white">TOTAL OPERATING REVENUE</td>
              <template v-for="year in visibleYears" :key="'total-op-rev-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-op-rev-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- DEPARTMENTAL EXPENSES Section Header -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  DEPARTMENTAL EXPENSES
                </div>
              </td>
            </tr>

            <!-- ROOMS Expenses -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">ROOMS</td>
              <template v-for="year in visibleYears" :key="'rooms-exp-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-exp-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- FOOD AND BEVERAGE Expenses -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">FOOD AND BEVERAGE</td>
              <template v-for="year in visibleYears" :key="'fnb-exp-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-exp-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalFnbExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OTHER OPERATED DEPARTMENTS Expenses -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">OTHER OPERATED DEPARTMENTS</td>
              <template v-for="year in visibleYears" :key="'ood-exp-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-exp-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">{{ formatMoney(getTotalOodExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL DEPARTMENTAL EXPENSES -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL DEPARTMENTAL EXPENSES</td>
              <template v-for="year in visibleYears" :key="'total-dept-exp-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-dept-exp-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOperatingExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL DEPARTMENTAL PROFIT -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL DEPARTMENTAL PROFIT</td>
              <template v-for="year in visibleYears" :key="'dept-profit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'dept-profit-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalDepartmentalProfit(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalDepartmentalProfitYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalDepartmentalProfitYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- UNDISTRIBUTED OPERATING EXPENSES Section Header -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  UNDISTRIBUTED OPERATING EXPENSES
                </div>
              </td>
            </tr>

            <!-- ADMINISTRATION AND GENERAL -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">ADMINISTRATION AND GENERAL</td>
              <template v-for="year in visibleYears" :key="'admin-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'admin-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUndistributedExpense(year, label, 'Administration and General')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- INFORMATION AND TELECOMMUNICATIONS SYSTEMS -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">INFORMATION AND TELECOMMUNICATIONS SYSTEMS</td>
              <template v-for="year in visibleYears" :key="'it-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUndistributedExpense(year, label, 'Information and Telecommunications Systems')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SALES AND MARKETING -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">SALES AND MARKETING</td>
              <template v-for="year in visibleYears" :key="'sales-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sales-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUndistributedExpense(year, label, 'Sales and Marketing')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- PROPERTY OPERATION AND MAINTENANCE -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">PROPERTY OPERATION AND MAINTENANCE</td>
              <template v-for="year in visibleYears" :key="'property-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'property-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUndistributedExpense(year, label, 'Property Operation and Maintenance')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- UTILITIES -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">UTILITIES</td>
              <template v-for="year in visibleYears" :key="'utilities-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'utilities-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUndistributedExpense(year, label, 'Utilities')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL UNDISTRIBUTED EXPENSES -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL UNDISTRIBUTED EXPENSES</td>
              <template v-for="year in visibleYears" :key="'total-undist-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-undist-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalUndistributedExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalUndistributedExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalUndistributedExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- GROSS OPERATING PROFIT -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td class="px-3 py-2 font-bold border-r border-purple-800 text-white">GROSS OPERATING PROFIT</td>
              <template v-for="year in visibleYears" :key="'gop-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'gop-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossOperatingProfit(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossOperatingProfitYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getGrossOperatingProfitYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- MANAGEMENT FEES Section Header -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  MANAGEMENT FEES
                </div>
              </td>
            </tr>

            <!-- BASE FEE -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">BASE FEE</td>
              <template v-for="year in visibleYears" :key="'base-fee-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'base-fee-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getManagementFee(year, label, 'Base Fee')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- INCENTIVE FEE -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">INCENTIVE FEE</td>
              <template v-for="year in visibleYears" :key="'incentive-fee-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'incentive-fee-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getManagementFee(year, label, 'Incentive Fee')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-3-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-3-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- TOTAL MANAGEMENT FEES -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL MANAGEMENT FEES</td>
              <template v-for="year in visibleYears" :key="'total-mgmt-fees-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-mgmt-fees-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalManagementFees(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalManagementFeesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalManagementFeesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-4-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-4-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- INCOME BEFORE NON-OPERATING INCOME & EXPENSES -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td class="px-3 py-2 font-bold border-r border-purple-800 text-white">INCOME BEFORE NON-OPERATING INCOME & EXPENSES</td>
              <template v-for="year in visibleYears" :key="'income-before-non-op-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'income-before-non-op-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getIncomeBeforeNonOperating(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-800 font-bold bg-purple-700">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-5-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-5-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- NON-OPERATING INCOME AND EXPENSES Section Header -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  NON-OPERATING INCOME AND EXPENSES
                </div>
              </td>
            </tr>

            <!-- INCOME -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">INCOME</td>
              <template v-for="year in visibleYears" :key="'non-op-income-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'non-op-income-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Income')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- RENT -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">RENT</td>
              <template v-for="year in visibleYears" :key="'rent-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rent-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Rent')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- PROPERTY AND OTHER TAXES -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">PROPERTY AND OTHER TAXES</td>
              <template v-for="year in visibleYears" :key="'taxes-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'taxes-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Property and Other Taxes')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- INSURANCE -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">INSURANCE</td>
              <template v-for="year in visibleYears" :key="'insurance-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'insurance-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Insurance')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- DIRECTORS REMUNERATION -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">DIRECTORS REMUNERATION</td>
              <template v-for="year in visibleYears" :key="'directors-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'directors-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Directors Remuneration')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OTHER -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">OTHER</td>
              <template v-for="year in visibleYears" :key="'other-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'other-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNonOperatingItem(year, label, 'Other')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL NON-OPERATING INCOME AND EXPENSES -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL NON-OPERATING INCOME AND EXPENSES</td>
              <template v-for="year in visibleYears" :key="'total-non-op-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-non-op-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalNonOperating(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-6-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-6-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- EBITDA -->
            <tr class="bg-purple-800 border-b-2 border-purple-900">
              <td class="px-3 py-2 font-bold border-r border-purple-900 text-white">EBITDA</td>
              <template v-for="year in visibleYears" :key="'ebitda-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ebitda-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getEBITDA(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-7-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-7-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- INTEREST, DEPRECIATION, AMORTIZATION Section Header -->
            <tr class="bg-purple-700 border-b-2 border-purple-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  INTEREST, DEPRECIATION, AMORTIZATION
                </div>
              </td>
            </tr>

            <!-- LOAN INTEREST -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">LOAN INTEREST</td>
              <template v-for="year in visibleYears" :key="'interest-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'interest-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getIDAItem(year, label, 'Loan Interest')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- DEPRECIATION -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">DEPRECIATION</td>
              <template v-for="year in visibleYears" :key="'depreciation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'depreciation-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getIDAItem(year, label, 'Depreciation')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AMORTIZATION -->
            <tr class="bg-purple-50 border-b border-purple-200">
              <td class="px-3 py-2 font-medium border-r border-purple-200">AMORTIZATION</td>
              <template v-for="year in visibleYears" :key="'amortization-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'amortization-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-200">
                    <span class="font-mono text-xs">{{ formatMoney(getIDAItem(year, label, 'Amortization')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-200 font-semibold bg-purple-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL INTEREST, DEPRECIATION AND AMORTIZATION -->
            <tr class="bg-purple-600 border-b-2 border-purple-700">
              <td class="px-3 py-2 font-bold border-r border-purple-700 text-white">TOTAL INTEREST, DEPRECIATION AND AMORTIZATION</td>
              <template v-for="year in visibleYears" :key="'total-ida-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-ida-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalIDA(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-700 font-bold bg-purple-600">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-8-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-8-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- EARNINGS BEFORE INCOME TAXES -->
            <tr class="bg-purple-800 border-b-2 border-purple-900">
              <td class="px-3 py-2 font-bold border-r border-purple-900 text-white">EARNINGS BEFORE INCOME TAXES</td>
              <template v-for="year in visibleYears" :key="'ebit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ebit-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getEarningsBeforeTaxes(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-900 font-bold bg-purple-800">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-9-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-9-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- REPLACEMENT RESERVE -->
            <tr class="bg-purple-100 border-b border-purple-300">
              <td class="px-3 py-2 font-bold border-r border-purple-300">REPLACEMENT RESERVE</td>
              <template v-for="year in visibleYears" :key="'reserve-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'reserve-' + year + '-' + label" class="px-2 py-1 text-right border border-purple-300 font-bold">
                    <span class="font-mono text-xs">{{ formatMoney(getReplacementReserve(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-purple-300 font-bold bg-purple-200">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-purple-300 font-bold bg-purple-200">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-10-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-10-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- EARNINGS BEFORE TAXES LESS REPLACEMENT RESERVE -->
            <tr class="bg-purple-900 border-b-2 border-black">
              <td class="px-3 py-2 font-bold border-r border-black text-white">EARNINGS BEFORE TAXES LESS REPLACEMENT RESERVE</td>
              <template v-for="year in visibleYears" :key="'final-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'final-' + year + '-' + label" class="px-2 py-1 text-right border border-black font-bold bg-purple-900">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getEarningsBeforeTaxesLessReserve(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-black font-bold bg-purple-900">
                    <span class="font-mono text-xs text-white">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-black font-bold bg-purple-900">
                    <span class="font-mono text-xs text-white">0</span>
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
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/_master_utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building2
} from 'lucide-vue-next';

// Import utility functions
import {
  formatMoney,
  formatNumber,
  formatPercentage,
  getNumber,
  getColumnLabelsForYear as getLabelsHelper,
  getNoOfRooms as getNoOfRoomsUtil,
  getNoOfRoomsTotal as getNoOfRoomsTotalUtil,
  getAvailableRooms as getAvailableRoomsUtil,
  getAvailableRoomsTotal as getAvailableRoomsTotalUtil,
  getSoldRooms as getSoldRoomsUtil,
  getSoldRoomsTotal as getSoldRoomsTotalUtil,
  getOccupancyPercentage as getOccupancyPercentageUtil,
  getOccupancyPercentageTotal as getOccupancyPercentageTotalUtil,
  getNumberOfGuests as getNumberOfGuestsUtil,
  getNumberOfGuestsTotal as getNumberOfGuestsTotalUtil,
  getAverageRoomRate as getAverageRoomRateUtil,
  getAverageRoomRateTotal as getAverageRoomRateTotalUtil,
  getRevPerAvailableRoom as getRevPerAvailableRoomUtil,
  getRevPerAvailableRoomTotal as getRevPerAvailableRoomTotalUtil,
  getTotalRoomRevenue as getTotalRoomRevenueUtil,
  getTotalRoomRevenueYear as getTotalRoomRevenueYearUtil,
  getTotalFnbRevenue as getTotalFnbRevenueUtil,
  getTotalFnbRevenueYear as getTotalFnbRevenueYearUtil,
  getTotalOodRevenue as getTotalOodRevenueUtil,
  getTotalOodRevenueYear as getTotalOodRevenueYearUtil,
  getTotalOperatingRevenue as getTotalOperatingRevenueUtil,
  getTotalOperatingRevenueYear as getTotalOperatingRevenueYearUtil,
  // Expense functions
  getTotalRoomExpenses as getTotalRoomExpensesUtil,
  getTotalRoomExpensesYear as getTotalRoomExpensesYearUtil,
  getTotalFnbExpenses as getTotalFnbExpensesUtil,
  getTotalFnbExpensesYear as getTotalFnbExpensesYearUtil,
  getTotalOodExpenses as getTotalOodExpensesUtil,
  getTotalOodExpensesYear as getTotalOodExpensesYearUtil,
  getTotalOperatingExpenses as getTotalOperatingExpensesUtil,
  getTotalOperatingExpensesYear as getTotalOperatingExpensesYearUtil,
  getTotalDepartmentalProfit as getTotalDepartmentalProfitUtil,
  getTotalDepartmentalProfitYear as getTotalDepartmentalProfitYearUtil,
  // Undistributed and other functions
  getUndistributedExpense as getUndistributedExpenseUtil,
  getTotalUndistributedExpenses as getTotalUndistributedExpensesUtil,
  getTotalUndistributedExpensesYear as getTotalUndistributedExpensesYearUtil,
  getGrossOperatingProfit as getGrossOperatingProfitUtil,
  getGrossOperatingProfitYear as getGrossOperatingProfitYearUtil,
  getManagementFee as getManagementFeeUtil,
  getTotalManagementFees as getTotalManagementFeesUtil,
  getTotalManagementFeesYear as getTotalManagementFeesYearUtil,
  getIncomeBeforeNonOperating as getIncomeBeforeNonOperatingUtil,
  getNonOperatingItem as getNonOperatingItemUtil,
  getTotalNonOperating as getTotalNonOperatingUtil,
  getEBITDA as getEBITDAUtil,
  getIDAItem as getIDAItemUtil,
  getTotalIDA as getTotalIDAUtil,
  getEarningsBeforeTaxes as getEarningsBeforeTaxesUtil,
  getReplacementReserve as getReplacementReserveUtil,
  getEarningsBeforeTaxesLessReserve as getEarningsBeforeTaxesLessReserveUtil
} from './utility/index.js';

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
  return getLabelsHelper(year, advancedModes.value);
}

// Statistics wrappers
function getNoOfRooms(year, label) {
  return getNoOfRoomsUtil(calculationCache, projectName.value, year, label);
}
function getNoOfRoomsTotal(year) {
  return getNoOfRoomsTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAvailableRooms(year, label) {
  return getAvailableRoomsUtil(calculationCache, projectName.value, year, label);
}
function getAvailableRoomsTotal(year) {
  return getAvailableRoomsTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSoldRooms(year, label) {
  return getSoldRoomsUtil(calculationCache, projectName.value, year, label);
}
function getSoldRoomsTotal(year) {
  return getSoldRoomsTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOccupancyPercentage(year, label) {
  return getOccupancyPercentageUtil(calculationCache, projectName.value, year, label);
}
function getOccupancyPercentageTotal(year) {
  return getOccupancyPercentageTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getNumberOfGuests(year, label) {
  return getNumberOfGuestsUtil(calculationCache, projectName.value, year, label);
}
function getNumberOfGuestsTotal(year) {
  return getNumberOfGuestsTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAverageRoomRate(year, label) {
  return getAverageRoomRateUtil(calculationCache, projectName.value, year, label);
}
function getAverageRoomRateTotal(year) {
  return getAverageRoomRateTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getRevPerAvailableRoom(year, label) {
  return getRevPerAvailableRoomUtil(calculationCache, projectName.value, year, label);
}
function getRevPerAvailableRoomTotal(year) {
  return getRevPerAvailableRoomTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

// Revenue wrappers
function getTotalRoomRevenue(year, label) {
  return getTotalRoomRevenueUtil(calculationCache, projectName.value, year, label);
}
function getTotalRoomRevenueYear(year) {
  return getTotalRoomRevenueYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalFnbRevenue(year, label) {
  return getTotalFnbRevenueUtil(calculationCache, projectName.value, year, label);
}
function getTotalFnbRevenueYear(year) {
  return getTotalFnbRevenueYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalOodRevenue(year, label) {
  return getTotalOodRevenueUtil(calculationCache, projectName.value, year, label);
}
function getTotalOodRevenueYear(year) {
  return getTotalOodRevenueYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalOperatingRevenue(year, label) {
  return getTotalOperatingRevenueUtil(calculationCache, projectName.value, year, label, getColumnLabelsForYear);
}
function getTotalOperatingRevenueYear(year) {
  return getTotalOperatingRevenueYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

// Expense wrappers
function getTotalRoomExpenses(year, label) {
  return getTotalRoomExpensesUtil(calculationCache, projectName.value, year, label);
}
function getTotalRoomExpensesYear(year) {
  return getTotalRoomExpensesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalFnbExpenses(year, label) {
  return getTotalFnbExpensesUtil(calculationCache, projectName.value, year, label);
}
function getTotalFnbExpensesYear(year) {
  return getTotalFnbExpensesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalOodExpenses(year, label) {
  return getTotalOodExpensesUtil(calculationCache, projectName.value, year, label);
}
function getTotalOodExpensesYear(year) {
  return getTotalOodExpensesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalOperatingExpenses(year, label) {
  return getTotalOperatingExpensesUtil(calculationCache, projectName.value, year, label, getColumnLabelsForYear);
}
function getTotalOperatingExpensesYear(year) {
  return getTotalOperatingExpensesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalDepartmentalProfit(year, label) {
  return getTotalDepartmentalProfitUtil(calculationCache, projectName.value, year, label, getTotalOperatingRevenueUtil, getColumnLabelsForYear);
}
function getTotalDepartmentalProfitYear(year) {
  return getTotalDepartmentalProfitYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear, getTotalOperatingRevenueYearUtil, getTotalOperatingExpensesYearUtil);
}

// Undistributed and other wrappers
function getUndistributedExpense(year, label, category) {
  return getUndistributedExpenseUtil(calculationCache, projectName.value, year, label, category);
}
function getTotalUndistributedExpenses(year, label) {
  return getTotalUndistributedExpensesUtil(calculationCache, projectName.value, year, label);
}
function getTotalUndistributedExpensesYear(year) {
  return getTotalUndistributedExpensesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getGrossOperatingProfit(year, label) {
  return getGrossOperatingProfitUtil(calculationCache, projectName.value, year, label, getTotalDepartmentalProfitUtil, getColumnLabelsForYear, getTotalOperatingRevenueUtil);
}
function getGrossOperatingProfitYear(year) {
  return getGrossOperatingProfitYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear, getTotalDepartmentalProfitYearUtil, getTotalOperatingRevenueYearUtil, getTotalOperatingExpensesYearUtil);
}
function getManagementFee(year, label, feeType) {
  return getManagementFeeUtil(calculationCache, projectName.value, year, label, feeType);
}
function getTotalManagementFees(year, label) {
  return getTotalManagementFeesUtil(calculationCache, projectName.value, year, label);
}
function getTotalManagementFeesYear(year) {
  return getTotalManagementFeesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getIncomeBeforeNonOperating(year, label) {
  return getIncomeBeforeNonOperatingUtil(calculationCache, projectName.value, year, label, getGrossOperatingProfitUtil, getTotalDepartmentalProfitUtil, getColumnLabelsForYear, getTotalOperatingRevenueUtil);
}
function getNonOperatingItem(year, label, itemType) {
  return getNonOperatingItemUtil(calculationCache, projectName.value, year, label, itemType);
}
function getTotalNonOperating(year, label) {
  return getTotalNonOperatingUtil(calculationCache, projectName.value, year, label);
}
function getEBITDA(year, label) {
  return getEBITDAUtil(calculationCache, projectName.value, year, label, getIncomeBeforeNonOperatingUtil, getGrossOperatingProfitUtil, getTotalDepartmentalProfitUtil, getColumnLabelsForYear, getTotalOperatingRevenueUtil);
}
function getIDAItem(year, label, itemType) {
  return getIDAItemUtil(calculationCache, projectName.value, year, label, itemType);
}
function getTotalIDA(year, label) {
  return getTotalIDAUtil(calculationCache, projectName.value, year, label);
}
function getEarningsBeforeTaxes(year, label) {
  return getEarningsBeforeTaxesUtil(calculationCache, projectName.value, year, label, getEBITDAUtil, getIncomeBeforeNonOperatingUtil, getGrossOperatingProfitUtil, getTotalDepartmentalProfitUtil, getColumnLabelsForYear, getTotalOperatingRevenueUtil);
}
function getReplacementReserve(year, label) {
  return getReplacementReserveUtil(calculationCache, projectName.value, year, label);
}
function getEarningsBeforeTaxesLessReserve(year, label) {
  return getEarningsBeforeTaxesLessReserveUtil(calculationCache, projectName.value, year, label, getEarningsBeforeTaxesUtil, getEBITDAUtil, getIncomeBeforeNonOperatingUtil, getGrossOperatingProfitUtil, getTotalDepartmentalProfitUtil, getColumnLabelsForYear, getTotalOperatingRevenueUtil);
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
</script>

<style scoped>
/* Component-specific styles, if any */
</style>

