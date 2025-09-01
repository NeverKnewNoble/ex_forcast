<template>
  <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-green-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- F&B Section Header Row -->
            <tr class="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
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
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
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
            <tr class="bg-green-500/90 text-xs">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <th
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-green-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
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
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Statistics Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'stats-divider-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'stats-divider-cell-' + year + '-' + label" class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                  <td class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                </template>
              </template>
            </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">NO OF ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'no-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NO OF DAYS -->
            <tr v-if="hasNoOfDaysData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">NO OF DAYS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-days-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'no-days-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfDays(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">AVAILABLE ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'available-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">SOLD ROOMS (excl. comp)</div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sold-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">ROOM OCCUPANCY %</div>
              </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'occupancy-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">NUMBER OF GUESTS</div>
              </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'guests-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF F&B COVERS -->
            <tr v-if="hasCoversData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">NUMBER OF F&B COVERS</div>
              </td>
              <template v-for="year in visibleYears" :key="'covers-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'covers-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfCovers(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVERAGE F&B SPENT PER COVER -->
            <tr v-if="hasFnbSpentData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">AVERAGE F&B SPENT PER COVER</div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-fnb-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'avg-fnb-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatMoney(getAverageFnbSpent(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVERAGE ROOM RATE -->
            <tr v-if="hasRoomRateData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">AVERAGE ROOM RATE</div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-rate-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'avg-rate-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatMoney(getAverageRoomRate(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- REV PER AVAILABLE ROOM -->
            <tr v-if="hasRevPerRoomData()" class="bg-green-50 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1">REVENUE PER AVAILABLE ROOM</div>
              </td>
              <template v-for="year in visibleYears" :key="'rev-per-room-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rev-per-room-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-50">
                    <span class="font-mono text-xs">{{ formatMoney(getRevPerAvailableRoom(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
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
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
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
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-stats-2-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Divider -->
            <tr class="bg-green-800 border-b-2 border-green-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-green-700">
                <div class="flex items-center">Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'revenue-divider-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'revenue-divider-cell-' + year + '-' + label" class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                  <td class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-green-700 bg-green-800"></td>
                </template>
              </template>
            </tr>

            <!-- Food Revenue Sub-header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Utensils class="w-4 h-4" />
                  Food Revenue
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'food-revenue-header-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'food-revenue-header-cell-' + year + '-' + label" class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                  <td class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                </template>
              </template>
            </tr>



            <!-- Individual Restaurant Food Revenue Rows -->
            <template v-for="restaurant in getRestaurantList()" :key="'food-revenue-' + restaurant">
              <tr class="bg-green-100 border-b border-green-200">
                <td class="px-3 py-2 font-medium border-r border-green-200">
                  <div class="flex items-center gap-1 text-green-800">{{ restaurant.name || restaurant }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'food-revenue-' + restaurant + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td v-for="label in getColumnLabelsForYear(year)" :key="'food-revenue-cell-' + restaurant + '-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                      <span class="font-mono text-xs text-green-700">{{ formatMoney(getRestaurantFoodRevenue(restaurant, year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                      <span class="font-mono text-xs text-green-800">{{ formatMoney(getRestaurantFoodRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                      <span class="font-mono text-xs text-green-800">{{ formatMoney(getRestaurantFoodRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Banquet Food Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Banquet Food</div>
              </td>
              <template v-for="year in visibleYears" :key="'banquet-food-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'banquet-food-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getBanquetFoodRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getBanquetFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getBanquetFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Outside Catering Food Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Outside Catering Food</div>
              </td>
              <template v-for="year in visibleYears" :key="'outside-catering-food-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'outside-catering-food-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getOutsideCateringFoodRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getOutsideCateringFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getOutsideCateringFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Food Revenue Row -->
            <tr class="bg-green-500 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Food Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-food-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-food-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row between Food and Beverage -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-food-bev-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-food-bev-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Beverage Revenue Sub-header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-2">
                  <Coffee class="w-4 h-4" />
                  Beverage Revenue
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'beverage-revenue-header-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'beverage-revenue-header-cell-' + year + '-' + label" class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                  <td class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-green-600 bg-green-600"></td>
                </template>
              </template>
            </tr>

            <!-- Individual Restaurant Beverage Revenue Rows -->
            <template v-for="restaurant in getRestaurantList()" :key="'beverage-revenue-' + restaurant">
              <tr class="bg-green-100 border-b border-green-200">
                <td class="px-3 py-2 font-medium border-r border-green-200">
                  <div class="flex items-center gap-1 text-green-800">{{ restaurant.name || restaurant }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'beverage-revenue-' + restaurant + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td v-for="label in getColumnLabelsForYear(year)" :key="'beverage-revenue-cell-' + restaurant + '-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                      <span class="font-mono text-xs text-green-700">{{ formatMoney(getRestaurantBeverageRevenue(restaurant, year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                      <span class="font-mono text-xs text-green-800">{{ formatMoney(getRestaurantBeverageRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                      <span class="font-mono text-xs text-green-800">{{ formatMoney(getRestaurantBeverageRevenueYear(restaurant, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Banquet Beverage Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Banquet Beverage</div>
              </td>
              <template v-for="year in visibleYears" :key="'banquet-beverage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'banquet-beverage-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getBanquetBeverageRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getBanquetBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getBanquetBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Outside Catering Beverage Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Outside Catering Beverage</div>
              </td>
              <template v-for="year in visibleYears" :key="'outside-catering-beverage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'outside-catering-beverage-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getOutsideCateringBeverageRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getOutsideCateringBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getOutsideCateringBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Beverage Revenue Row -->
            <tr class="bg-green-500 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">Total Beverage Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-beverage-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-beverage-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalBeverageRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalBeverageRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
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
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-fnb-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-800 font-semibold bg-green-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFoodAndBeverageRevenue(year, label)) }}</span>
                  </td>
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

            <!-- Empty Row before Other Revenue -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-before-other-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-before-other-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Other Revenue Section Header -->
            <tr class="bg-green-600 border-b border-green-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-green-700">
                <div class="flex items-center gap-1">
                  <DollarSign class="w-4 h-4" />
                  Other Revenue
                </div>
              </td>
            </tr>

            <!-- Function Room Rental Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Function Room Rental</div>
              </td>
              <template v-for="year in visibleYears" :key="'function-room-rental-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'function-room-rental-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getFunctionRoomRentalRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getFunctionRoomRentalRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getFunctionRoomRentalRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Miscellaneous Other Revenue Row -->
            <tr class="bg-green-100 border-b border-green-200">
              <td class="px-3 py-2 font-medium border-r border-green-200">
                <div class="flex items-center gap-1 text-green-800">Miscellaneous Other Revenue</div>
              </td>
              <template v-for="year in visibleYears" :key="'misc-other-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'misc-other-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-200 bg-green-100">
                    <span class="font-mono text-xs text-green-700">{{ formatMoney(getMiscellaneousOtherRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getMiscellaneousOtherRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-200">
                    <span class="font-mono text-xs text-green-800">{{ formatMoney(getMiscellaneousOtherRevenueYear(year)) }}</span>
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
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { getRestaurants } from '@/components/utility/f&b_revenue_assumpt/get_restaurants.js';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Building2,
  DollarSign,
  Utensils,
  Coffee
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
    const roomCount = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Total Rooms', year, label);
    
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
    // First try: Get from F&B page - Number of rooms available row
    let availableRooms = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Number of rooms available', year, label);
    
    if (availableRooms !== undefined && availableRooms !== null) {
      return getNumber(availableRooms);
    }
    
    // Second try: Get from Room Revenue page - Total Available Rooms (if market segmentation is on)
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';
    if (isMarketSegmentationEnabled) {
      const totalRooms = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Total Rooms', year, label);
      if (totalRooms !== undefined && totalRooms !== null) {
        const days = getNoOfDays(year, label);
        const calculatedValue = getNumber(totalRooms) * days;
        return calculatedValue;
      }
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
    // Get from F&B page - Number of rooms sold (excl.) row (note: lowercase in cache)
    const soldRooms = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Number of rooms sold (excl.)', year, label);
    
    if (soldRooms !== undefined && soldRooms !== null) {
      return getNumber(soldRooms);
    }
    
    // Fallback: Calculate based on occupancy percentage if available
    const occupancy = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Occupancy (excl.) %', year, label);
    if (occupancy !== undefined && occupancy !== null) {
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
    // Get from F&B page - Occupancy (excl.) % row
    const occupancy = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Occupancy (excl.) %', year, label);
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
function getNumberOfGuests(year, label) {
  try {
    // Get from F&B page - Number of guests row
    const guests = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Number of guests', year, label);
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
function getNumberOfCovers(year, label) {
  try {
    // Get from F&B page - Total Covers row
    const covers = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Total Covers', year, label);
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
function getAverageFnbSpent(year, label) {
  try {
    // Get from F&B page - Average Spent Per F&B Customer row
    const avgSpent = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Average Spent Per F&B Customer', year, label);
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
    const avgRate = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Average Room Rate', year, label);
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
    // Get from F&B page - Revenue Per Available Room row
    const revPerRoom = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Revenue Per Available Room', year, label);
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

// Revenue
function getTotalFnbRevenue(year, label) {
  const val = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Total F&B Revenue', year, label);
  if (val !== undefined && val !== null) return getNumber(val);
  // Fallback: sum of food + beverage if available
  const food = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Total Food Revenue', year, label);
  const bev = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Total Beverage Revenue', year, label);
  return getNumber(food) + getNumber(bev);
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
      console.log('🍽️ Loaded restaurants from API:', restaurantList);
      
      // Log each restaurant to see the structure
      restaurantList.forEach((restaurant, index) => {
        console.log(`Restaurant ${index + 1}:`, restaurant);
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
      console.log('Reloaded restaurants for new project:', restaurantList);
    } catch (error) {
      console.error('Error reloading restaurants for new project:', error);
      restaurants.value = [];
    }
  }
});

function getRestaurantList() {
  return restaurants.value;
}

function getRestaurantFoodRevenue(restaurant, year, label) {
  try {
    // Get restaurant name (handle both object and string)
    const restaurantName = restaurant.name || restaurant;
    
    // Based on the cache structure you showed, the key format is:
    // "Total Food Revenue:Fine Dining" for the cacheKey
    const cacheKey = `Total Food Revenue:${restaurantName}`;
    
    console.log(`🔍 Looking for food revenue: ${cacheKey} for ${year} ${label}`);
    
    // Try to get from the calculation cache using the proper page and row structure
    const val = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', cacheKey, year, label);
    
    if (val !== undefined && val !== null) {
      console.log(`✅ Found food revenue for ${restaurantName}: ${val}`);
      return getNumber(val);
    }
    
    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: 'Total Food Revenue'
    };
    
    const fallbackVal = calculationCache.getValue(
      projectName.value, 
      'F&B Revenue Assumptions', 
      JSON.stringify(rowData), 
      year, 
      label
    );
    
    if (fallbackVal !== undefined && fallbackVal !== null) {
      console.log(`✅ Found food revenue (fallback) for ${restaurantName}: ${fallbackVal}`);
      return getNumber(fallbackVal);
    }
    
    console.log(`❌ No food revenue data found for ${restaurantName} in ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting food revenue for ${restaurant}:`, error);
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
    
    // Based on the cache structure you showed, the key format is:
    // "Total Beverage Revenue:Fine Dining" for the cacheKey
    const cacheKey = `Total Beverage Revenue:${restaurantName}`;
    
    console.log(`🔍 Looking for beverage revenue: ${cacheKey} for ${year} ${label}`);
    
    // Try to get from the calculation cache using the proper page and row structure
    const val = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', cacheKey, year, label);
    
    if (val !== undefined && val !== null) {
      console.log(`✅ Found beverage revenue for ${restaurantName}: ${val}`);
      return getNumber(val);
    }
    
    // Fallback: try to get from the restaurant-specific row structure
    const rowData = {
      restaurant: restaurantName,
      section: 'Total',
      type: 'Total Beverage Revenue'
    };
    
    const fallbackVal = calculationCache.getValue(
      projectName.value, 
      'F&B Revenue Assumptions', 
      JSON.stringify(rowData), 
      year, 
      label
    );
    
    if (fallbackVal !== undefined && fallbackVal !== null) {
      console.log(`✅ Found beverage revenue (fallback) for ${restaurantName}: ${val}`);
      return getNumber(fallbackVal);
    }
    
    console.log(`❌ No beverage revenue data found for ${restaurantName} in ${year} ${label}`);
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
    // Based on your cache logs, this uses the exact row code: "Food"
    const val = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'Food', year, label);
    
    if (val !== undefined && val !== null) {
      console.log(`✅ Found banquet food revenue: ${val} for ${year} ${label}`);
      return getNumber(val);
    }
    
    console.log(`❌ No banquet food revenue data found for ${year} ${label}`);
    return 0;
  } catch (error) {
    console.error(`Error getting banquet food revenue for ${year} ${label}:`, error);
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
      const val = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', rowCode, year, label);
      if (val !== undefined && val !== null) {
        console.log(`✅ Found outside catering food revenue from ${rowCode}: ${val} for ${year} ${label}`);
        return getNumber(val);
      }
    }
    
    console.log(`❌ No outside catering food revenue data found for ${year} ${label}`);
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
    const liquorValue = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'Liquor', year, label);
    const softDrinksValue = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'Soft Drinks', year, label);
    
    const liquor = getNumber(liquorValue) || 0;
    const softDrinks = getNumber(softDrinksValue) || 0;
    const total = liquor + softDrinks;
    
    if (liquor > 0 || softDrinks > 0) {
      console.log(`✅ Found banquet beverage revenue for ${year} ${label}: Liquor: ${liquor}, Soft Drinks: ${softDrinks}, Total: ${total}`);
      return total;
    }
    
    console.log(`❌ No banquet beverage revenue data found for ${year} ${label}`);
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
    const val = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'outside_service_beverage_catering', year, label);
    
    if (val !== undefined && val !== null) {
      console.log(`✅ Found outside catering beverage revenue: ${val} for ${year} ${label}`);
      return getNumber(val);
    }
    
    console.log(`❌ No outside catering beverage revenue data found for ${year} ${label}`);
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
    const val = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'Hall Space Charges', year, label);
    
    if (val !== undefined && val !== null) {
      console.log(`✅ Found function room rental revenue: ${val} for ${year} ${label}`);
      return getNumber(val);
    }
    
    console.log(`❌ No function room rental revenue data found for ${year} ${label}`);
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
    const tobaccoValue = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'tobacco', year, label);
    const nonFnbValue = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'non_fnb', year, label);
    const othersValue = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', 'others', year, label);
    
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
      const val = calculationCache.getValue(projectName.value, 'Banquet Revenue Assumptions', rowCode, year, label);
      if (val !== undefined && val !== null) {
        const additionalValue = getNumber(val) || 0;
        additionalTotal += additionalValue;
        console.log(`✅ Found additional revenue from ${rowCode}: ${additionalValue} for ${year} ${label}`);
      }
    }
    
    const total = tobacco + nonFnb + others + additionalTotal;
    
    if (total > 0) {
      console.log(`✅ Found miscellaneous other revenue for ${year} ${label}: Tobacco: ${tobacco}, non_fnb: ${nonFnb}, Others: ${others}, Additional: ${additionalTotal}, Total: ${total}`);
      return total;
    }
    
    console.log(`❌ No miscellaneous other revenue data found for ${year} ${label}`);
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
</script>

<style scoped>
/* Component-specific styles, if any */
</style>


