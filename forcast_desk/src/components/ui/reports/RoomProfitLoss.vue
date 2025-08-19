<template>
  <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">          
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
                <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                    <Building2 class="w-6 h-6 text-blue-200" />
                    <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
                </td>
            </tr>
            
            <!-- Rooms Section Header Row -->
            <tr class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
                <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
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
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
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
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
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
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Statistics Divider -->
            <tr class="bg-gradient-to-r from-blue-100 to-blue-200 border-b-2 border-blue-400">
              <td colspan="2" class="px-3 py-3 font-bold text-blue-900 border-r border-blue-300">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'stats-divider-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'stats-divider-cell-' + year + '-' + label"
                    class="px-1 py-1 text-center border border-blue-300 bg-blue-200"
                  ></td>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
              </template>
          </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  NO OF ROOMS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'no-rooms-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
            </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- NO OF DAYS -->
            <tr v-if="hasNoOfDaysData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  NO OF DAYS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'no-days-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'no-days-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfDays(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
              </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  AVAILABLE ROOMS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'available-rooms-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
              </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  SOLD ROOMS (excl. comp)
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'sold-rooms-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
            </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  ROOM OCCUPANCY %
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'occupancy-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  NUMBER OF GUESTS
                </div>
            </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'guests-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- NUMBER OF F&B COVERS -->
            <tr v-if="hasCoversData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  NUMBER OF F&B COVERS
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'covers-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'covers-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfCovers(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatNumber(getNumberOfCoversTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- AVERAGE F&B SPENT PER COVER -->
            <tr v-if="hasFnbSpentData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  AVERAGE F&B SPENT PER COVER
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-fnb-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'avg-fnb-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatMoney(getAverageFnbSpent(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getAverageFnbSpentTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- AVERAGE ROOM RATE -->
            <tr v-if="hasRoomRateData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  AVERAGE ROOM RATE
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'avg-rate-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'avg-rate-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatMoney(getAverageRoomRate(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getAverageRoomRateTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- REV PER AVAILABLE ROOM -->
            <tr v-if="hasRevPerRoomData()" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  REVENUE PER AVAILABLE ROOM
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'rev-per-room-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'rev-per-room-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                  >
                    <span class="font-mono text-xs">{{ formatMoney(getRevPerAvailableRoom(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRevPerAvailableRoomTotal(year)) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- Rooms Revenue Divider -->
            <tr class="bg-gradient-to-r from-blue-100 to-blue-200 border-b-2 border-blue-400">
              <td colspan="2" class="px-3 py-3 font-bold text-blue-900 border-r border-blue-300">
                <div class="flex items-center ">
                  Rooms Revenue
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'rooms-revenue-divider-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'rooms-revenue-divider-cell-' + year + '-' + label"
                    class="px-1 py-1 text-center border border-blue-300 bg-blue-200"
                  ></td>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
              </template>
            </tr>

            <!-- Market Segmentation Revenue Rows -->
            <template v-if="isMarketSegmentationEnabled()">
              <!-- Dynamic segments from Market Segmentation cache (keys starting with 'Room Revenue:') -->
              <template v-for="segment in roomRevenueSegments" :key="'segment-' + segment">
                <tr v-if="hasSegmentData(segment)" class="bg-blue-50 border-b border-blue-200">
                  <td class="px-3 py-2 font-medium border-r border-blue-200">
                    <div class="flex items-center gap-1">
                      {{ segment }}
                    </div>
                  </td>
                  <template v-for="year in visibleYears" :key="'segment-' + segment + '-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYear(year)"
                        :key="'segment-cell-' + segment + '-' + year + '-' + label"
                        class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                      >
                        <span class="font-mono text-xs">{{ formatMoney(getSegmentRevenue(year, label, segment)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                        <span class="font-mono text-xs text-blue-700">{{ formatMoney(getSegmentRevenueTotal(year, segment)) }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                        <span class="font-mono text-xs text-blue-700">{{ formatMoney(getSegmentRevenueTotal(year, segment)) }}</span>
                      </td>
                    </template>
                  </template>
                </tr>
              </template>

              <!-- Total Rooms Revenue -->
              <tr class="bg-blue-100 border-b-2 border-blue-300">
                <td class="px-3 py-2 font-bold border-r border-blue-300">
                  <div class="flex items-center gap-1">
                    Total Rooms Revenue
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'total-rooms-revenue-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td
                      v-for="label in getColumnLabelsForYear(year)"
                      :key="'total-rooms-revenue-cell-' + year + '-' + label"
                      class="px-2 py-1 text-right border border-blue-300 font-semibold bg-blue-200"
                    >
                      <span class="font-mono text-xs text-blue-800">{{ formatMoney(getTotalRoomsRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                      <span class="font-mono text-xs text-blue-900">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                      <span class="font-mono text-xs text-blue-900">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Room Packages Revenue Rows (when market segmentation is off) -->
            <template v-if="!isMarketSegmentationEnabled()">
              <!-- Dynamic room types from Room Revenue Assumptions cache (keys starting with 'Room Type:') -->
              <template v-for="pkg in roomTypePackages" :key="'pkg-' + pkg">
                <tr v-if="hasRoomTypeData(pkg)" class="bg-blue-50 border-b border-blue-200">
                  <td class="px-3 py-2 font-medium border-r border-blue-200">
                    <div class="flex items-center gap-1">
                      {{ pkg }}
                    </div>
                  </td>
                  <template v-for="year in visibleYears" :key="'pkg-' + pkg + '-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYear(year)"
                        :key="'pkg-cell-' + pkg + '-' + year + '-' + label"
                        class="px-2 py-1 text-right border border-blue-200 bg-blue-50"
                      >
                        <span class="font-mono text-xs">{{ formatMoney(getRoomTypeRevenue(year, label, pkg)) }}</span>
                      </td>
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                        <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRoomTypeRevenueTotal(year, pkg)) }}</span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                        <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRoomTypeRevenueTotal(year, pkg)) }}</span>
                      </td>
                    </template>
                  </template>
                </tr>
              </template>

              <!-- Total Rooms Revenue -->
              <tr class="bg-blue-100 border-b-2 border-blue-300">
                <td class="px-3 py-2 font-bold border-r border-blue-300">
                  <div class="flex items-center gap-1">
                    Total Rooms Revenue
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'total-rooms-revenue-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td
                      v-for="label in getColumnLabelsForYear(year)"
                      :key="'total-rooms-revenue-cell-' + year + '-' + label"
                      class="px-2 py-1 text-right border border-blue-300 font-semibold bg-blue-200"
                    >
                      <span class="font-mono text-xs text-blue-800">{{ formatMoney(getTotalRoomsRevenue(year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                      <span class="font-mono text-xs text-blue-900">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                      <span class="font-mono text-xs text-blue-900">{{ formatMoney(getTotalRoomsRevenueTotal(year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Room Expenses Divider -->
            <tr class="bg-gradient-to-r from-blue-100 to-blue-200 border-b-2 border-blue-400">
              <td colspan="2" class="px-3 py-3 font-bold text-blue-900 border-r border-blue-300">
                <div class="flex items-center ">
                  Room Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'room-expenses-divider-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'room-expenses-divider-cell-' + year + '-' + label"
                    class="px-1 py-1 text-center border border-blue-300 bg-blue-200"
                  ></td>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
                <template v-else>
                  <td class="px-1 py-1 text-center border border-blue-300 bg-blue-200"></td>
                </template>
              </template>
            </tr>

            <!-- Expense Sub Header -->
            <tr class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-semibold border-r border-blue-200">
                <div class="flex items-center gap-1">
                  Expense
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'expense-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'expense-subheader-cell-' + year + '-' + label"
                    class="px-2 py-1 text-center border border-blue-200 bg-blue-50"
                  ></td>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
              </template>
            </tr>

            <!-- Dynamic Room Department Expenses -->
            <template v-for="exp in roomDepartmentExpenses" :key="'room-expense-' + exp">
              <tr v-if="hasRoomExpenseData(exp)" class="bg-white border-b border-blue-200">
                <td class="px-3 py-2 border-r border-blue-200">
                  <div class="flex items-center gap-1">
                    {{ exp }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'room-expense-' + exp + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td
                      v-for="label in getColumnLabelsForYear(year)"
                      :key="'room-expense-cell-' + exp + '-' + year + '-' + label"
                      class="px-2 py-1 text-right border border-blue-200 bg-white"
                    >
                      <span class="font-mono text-xs">{{ formatMoney(getRoomExpenseAmount(year, label, exp)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRoomExpenseTotal(year, exp)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getRoomExpenseTotal(year, exp)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Gross Total Expenses -->
            <tr class="bg-blue-100 border-b-2 border-blue-300">
              <td class="px-3 py-2 font-bold border-r border-blue-300">
                <div class="flex items-center gap-1">
                  Gross Total Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'gross-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'gross-expenses-cell-' + year + '-' + label"
                    class="px-2 py-1 text-right border border-blue-300 font-semibold bg-blue-200"
                  >
                    <span class="font-mono text-xs text-blue-800">{{ formatMoney(getGrossRoomExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                    <span class="font-mono text-xs text-blue-900">{{ formatMoney(getGrossRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-300 font-bold bg-blue-300">
                    <span class="font-mono text-xs text-blue-900">{{ formatMoney(getGrossRoomExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Payroll Sub Header -->
            <tr class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-semibold border-r border-blue-200">
                <div class="flex items-center gap-1">
                  Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'expense-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'expense-subheader-cell-' + year + '-' + label"
                    class="px-2 py-1 text-center border border-blue-200 bg-blue-50"
                  ></td>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management Group Header -->
            <tr v-if="hasPayrollGroupData('management')" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'mgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'mgmt-subheader-cell-' + year + '-' + label"
                    class="px-2 py-1 text-center border border-blue-200 bg-blue-50"
                  ></td>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management per-location rows -->
            <template v-for="loc in payrollLocationsManagement" :key="'mgmt-loc-' + loc">
              <tr class="bg-white border-b border-blue-200">
                <td class="px-3 py-2 border-r border-blue-200">
                  <div class="flex items-center gap-1">
                    {{ loc }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'mgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td
                      v-for="label in getColumnLabelsForYear(year)"
                      :key="'mgmt-cell-' + loc + '-' + year + '-' + label"
                      class="px-2 py-1 text-right border border-blue-200 bg-white"
                    >
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollMonthlySalaryByLocation(year, label, loc, 'management')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'management')) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Payroll: Non-Management Group Header -->
            <tr v-if="hasPayrollGroupData('non-management')" class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  Non-Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'nonmgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="'nonmgmt-subheader-cell-' + year + '-' + label"
                    class="px-2 py-1 text-center border border-blue-200 bg-blue-50"
                  ></td>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-blue-200 bg-blue-100"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Non-Management per-location rows -->
            <template v-for="loc in payrollLocationsNonManagement" :key="'nonmgmt-loc-' + loc">
              <tr class="bg-white border-b border-blue-200">
                <td class="px-3 py-2 border-r border-blue-200">
                  <div class="flex items-center gap-1">
                    {{ loc }}
                  </div>
                </td>
                <template v-for="year in visibleYears" :key="'nonmgmt-row-' + loc + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td
                      v-for="label in getColumnLabelsForYear(year)"
                      :key="'nonmgmt-cell-' + loc + '-' + year + '-' + label"
                      class="px-2 py-1 text-right border border-blue-200 bg-white"
                    >
                      <span class="font-mono text-xs">{{ formatMoney(getPayrollMonthlySalaryByLocation(year, label, loc, 'non-management')) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-700">{{ formatMoney(getPayrollMonthlySalaryTotal(year, loc, 'non-management')) }}</span>
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

<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Building2,
  Bed,
  DollarSign
} from 'lucide-vue-next';
import { loadExpenseData } from '@/components/utility/expense_assumption/index.js';

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
  // console.log('Room P&L: Project name computed:', {
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
  // console.log('Room P&L: Project changed to:', selectedProject.value?.project_name);
  // Reload Room department expenses for the new project
  loadRoomExpensesFromApi();
}, { deep: true });

// Add debugging for cache access
onMounted(() => {
  // console.log('Room P&L: Component mounted, project name:', projectName.value);
  // console.log('Room P&L: Calculation cache available:', !!calculationCache);
  
  // Test cache access
  if (projectName.value && projectName.value !== 'Project Name') {
    // Test multiple cache keys to see what's available
    const testKeys = [
      'Number of rooms available',
      'Number of rooms sold (excl.)',
      'Occupancy (excl.) %',
      'Number of guests',
      'Total Covers',
      'Average Spent Per F&B Customer',
      'Average Room Rate',
      'Revenue Per Available Room'
    ];
    
    // console.log('Room P&L: Testing all cache keys...');
    testKeys.forEach(key => {
      const value = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', key, 2025, 'Jan');
      // console.log(`Room P&L: Cache key "${key}":`, {
      //   value,
      //   exists: value !== undefined && value !== null
      // });
    });
    
    // If no data in cache, wait a bit and try again (F&B page might still be loading)
    const hasAnyData = testKeys.some(key => {
      const value = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', key, 2025, 'Jan');
      return value !== undefined && value !== null;
    });
    
    if (!hasAnyData) {
      // console.log('Room P&L: No data in cache yet, waiting for F&B page to load...');
      console.warn('Room P&L: To get accurate data, please visit the F&B Revenue page first to populate the cache.');
      setTimeout(() => {
        // console.log('Room P&L: Retrying cache access after delay...');
        testKeys.forEach(key => {
          const retryValue = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', key, 2025, 'Jan');
          // console.log(`Room P&L: Retry "${key}":`, {
          //   retryValue,
          //   exists: retryValue !== undefined && retryValue !== null
          // });
        });
      }, 3000); // Wait 3 seconds
    }
  }
  // Load Room department expenses from Expense Assumptions API
  loadRoomExpensesFromApi();
});

// Utility functions
const expenseDataCache = ref({});
const roomDepartmentExpenses = computed(() => {
  try {
    const expensesSet = new Set();
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
    const monthKeys = getMonthsForLabel(label);
    let sum = 0;
    for (const m of monthKeys) {
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
    let total = 0;
    for (const exp of roomDepartmentExpenses.value) {
      total += getNumber(getRoomExpenseAmount(year, label, exp));
    }
    return total;
  } catch (e) {
    return 0;
  }
}

function getGrossRoomExpensesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getGrossRoomExpenses(year, label)), 0);
  } catch (e) {
    return 0;
  }
}
function getNoOfRooms(year, label) {
  try {
    // Check if market segmentation is enabled
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';
    
    // Get room count from room revenue page via calculation cache
    // Both scenarios (market segmentation on/off) now cache to the same location
    const roomCount = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Total Rooms', year, label);
    
    if (roomCount !== undefined && roomCount !== null) {
      // console.log(`Room P&L: Retrieved room count for ${year}/${label}:`, roomCount, 'Market segmentation:', isMarketSegmentationEnabled);
      return getNumber(roomCount);
    }
    
    // Default fallback
    // console.log(`Room P&L: No cached room count found for ${year}/${label}, using default: 100`);
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
      const totalRooms = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Total Rooms', year, label);
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

function getSoldRooms(year, label) {
  try {
    // Get from F&B page - Number of rooms sold (excl.) row (note: lowercase in cache)
    const soldRooms = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Number of rooms sold (excl.)', year, label);
    
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
    const occupancy = calculationCache.getValue(projectName.value, 'F&B Revenue Assumptions', 'Occupancy (excl.) %', year, label);
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
    const regex = /^MonthlySalary\|position:(.*?)\|location:(.*?)\|designation:(.*)$/;
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

function isManagementPositionName(position) {
  if (!position) return false;
  const lower = position.toLowerCase();
  return (lower.includes('manager') && !lower.includes('non-manager')) || lower.includes('director') || lower.includes('supervisor');
}

const payrollLocationsManagement = computed(() => {
  try {
    const project = projectName.value;
    const page = 'Payroll';
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const locs = new Set();
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    return [];
  }
});

const payrollLocationsNonManagement = computed(() => {
  try {
    const project = projectName.value;
    const page = 'Payroll';
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const locs = new Set();
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseMonthlySalaryRowCode(rowCode);
      if (parsed && !isManagementPositionName(parsed.position) && parsed.location) {
        locs.add(parsed.location);
      }
    });
    return Array.from(locs);
  } catch (e) {
    return [];
  }
});

function getPayrollMonthlySalaryByLocation(year, label, location, group) {
  try {
    const project = projectName.value;
    const page = 'Payroll';
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const months = getMonthsForLabel(label);
    let sum = 0;
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

// Discover room revenue segments from cache for the current project
const roomRevenueSegments = computed(() => {
  try {
    const project = projectName.value;
    const page = 'Market Segmentation';
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const segments = new Set();
    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Revenue:')) {
        const name = rowCode.replace('Room Revenue:', '').trim();
        if (name) segments.add(name);
      }
    });
    return Array.from(segments);
  } catch (e) {
    return [];
  }
});

function getSegmentRevenue(year, label, segmentName) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(project, 'Market Segmentation', `Room Revenue:${segmentName}`, year, m);
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
    const yearly = calculationCache.getValue(project, 'Market Segmentation', `Room Revenue Year:${segmentName}`, year, 'ALL');
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
      const val = calculationCache.getValue(project, 'Market Segmentation', 'Room Revenue:Direct Retail', year, m);
      if (val !== undefined && val !== null) {
        sum += getNumber(val);
      }
    }
    if (sum > 0) {
      return sum;
    }
    // Fallback: Room Revenue Assumptions if segmentation not available
    const fallback = calculationCache.getValue(project, 'Room Revenue Assumptions', 'Direct Retail', year, label);
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
    const yearly = calculationCache.getValue(project, 'Market Segmentation', 'Room Revenue Year:Direct Retail', year, 'ALL');
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
    const revenue = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Corporate', year, label);
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
    const revenue = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'OTA', year, label);
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
    const revenue = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Travel Agent', year, label);
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
    const page = 'Room Revenue Assumptions';
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    const types = new Set();
    Object.keys(pageData).forEach((rowCode) => {
      if (rowCode.startsWith('Room Type:')) {
        const name = rowCode.replace('Room Type:', '').trim();
        if (name) types.add(name);
      }
    });
    return Array.from(types);
  } catch (e) {
    return [];
  }
});

function getRoomTypeRevenue(year, label, typeName) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;
    for (const m of months) {
      const val = calculationCache.getValue(project, 'Room Revenue Assumptions', `Room Type:${typeName}`, year, m);
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
    const yearly = calculationCache.getValue(project, 'Room Revenue Assumptions', `Room Type Year:${typeName}`, year, 'ALL');
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
    if (isMarketSegmentationEnabled()) {
      // Sum all discovered market segments
      return roomRevenueSegments.value.reduce((sum, seg) => sum + getNumber(getSegmentRevenue(year, label, seg)), 0);
    } else {
      // Sum all discovered room packages
      return roomTypePackages.value.reduce((sum, pkg) => sum + getNumber(getRoomTypeRevenue(year, label, pkg)), 0);
    }
  } catch (error) {
    console.error('Error calculating total rooms revenue:', error);
    return 0;
  }
}

function getTotalRoomsRevenueTotal(year) {
  if (isMarketSegmentationEnabled()) {
    // Prefer yearly totals per segment if available
    const perSegmentTotals = roomRevenueSegments.value.map(seg => getSegmentRevenueTotal(year, seg));
    const sumSegments = perSegmentTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumSegments > 0) return sumSegments;
  } else {
    // Prefer yearly totals per room type if available
    const perTypeTotals = roomTypePackages.value.map(pkg => getRoomTypeRevenueTotal(year, pkg));
    const sumTypes = perTypeTotals.reduce((a, b) => a + getNumber(b), 0);
    if (sumTypes > 0) return sumTypes;
  }
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getTotalRoomsRevenue(year, label)), 0);
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


</script>

<style scoped>
/* Add any component-specific styles here */
</style>
