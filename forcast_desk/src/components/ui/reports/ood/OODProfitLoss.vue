<template>
  <div class="bg-white rounded-lg border border-orange-300 dark:border-orange-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-orange-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- OOD Section Header Row -->
            <tr class="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-semibold tracking-wide">Other Operating Departments (OOD) Profit & Loss Report</h2>
                </div>
              </td>
            </tr>

            <!-- Year headers -->
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-orange-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
                class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-orange-700 transition-all duration-200 group text-sm"
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
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <th
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-orange-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
                  <th class="px-2 py-1 text-center border border-orange-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-orange-300 min-w-[110px] font-semibold">
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
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  Statistics
                </div>
              </td>
            </tr>

            <!-- NO OF ROOMS -->
            <tr v-if="hasNoOfRoomsData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">NO OF ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'no-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNoOfRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NO OF DAYS -->
            <tr v-if="hasNoOfDaysData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">NO OF DAYS</div>
              </td>
              <template v-for="year in visibleYears" :key="'no-days-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'no-days-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getNoOfDays(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNoOfDaysTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr v-if="hasAvailableRoomsData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">AVAILABLE ROOMS</div>
              </td>
              <template v-for="year in visibleYears" :key="'available-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'available-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getAvailableRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getAvailableRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr v-if="hasSoldRoomsData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">SOLD ROOMS (excl. comp)</div>
              </td>
              <template v-for="year in visibleYears" :key="'sold-rooms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sold-rooms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getSoldRooms(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getSoldRoomsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr v-if="hasOccupancyData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">ROOM OCCUPANCY %</div>
              </td>
              <template v-for="year in visibleYears" :key="'occupancy-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'occupancy-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatPercentage(getOccupancyPercentage(year, label)) }}%</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatPercentage(getOccupancyPercentageTotal(year)) }}%</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NUMBER OF GUESTS -->
            <tr v-if="hasGuestsData()" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">NUMBER OF GUESTS</div>
              </td>
              <template v-for="year in visibleYears" :key="'guests-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'guests-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20">
                    <span class="font-mono text-xs">{{ formatNumber(getNumberOfGuests(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatNumber(getNumberOfGuestsTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
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
              <template v-for="year in visibleYears" :key="'empty-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-2-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- HEALTH CLUB - SPA REVENUE Section Divider -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  <Dumbbell class="w-4 h-4" />
                  HEALTH CLUB - SPA REVENUE
                </div>
              </td>
            </tr>

            <!-- Club Use Revenue Header -->
            <tr class="bg-orange-600 border-b border-orange-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-orange-700">
                <div class="flex items-center gap-1">Club Use Revenue</div>
              </td>
            </tr>

            <!-- Sauna -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Sauna</div>
              </td>
              <template v-for="year in visibleYears" :key="'sauna-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sauna-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getSaunaRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSaunaRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSaunaRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Gym -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Gym</div>
              </td>
              <template v-for="year in visibleYears" :key="'gym-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'gym-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getGymRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Swimming Pool -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Swimming Pool</div>
              </td>
              <template v-for="year in visibleYears" :key="'swimming-pool-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'swimming-pool-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getSwimmingPoolRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSwimmingPoolRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSwimmingPoolRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Treatments & Other Services Header -->
            <tr class="bg-orange-600 border-b border-orange-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-orange-700">
                <div class="flex items-center gap-1">Treatments & Other Services</div>
              </td>
            </tr>

            <!-- Fitness Lessons (group) -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Fitness Lessons (group)</div>
              </td>
              <template v-for="year in visibleYears" :key="'fitness-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fitness-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getFitnessLessonsRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getFitnessLessonsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getFitnessLessonsRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Health / Wellness Services -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Health / Wellness Services</div>
              </td>
              <template v-for="year in visibleYears" :key="'wellness-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'wellness-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getHealthWellnessRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getHealthWellnessRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getHealthWellnessRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Massage -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Massage</div>
              </td>
              <template v-for="year in visibleYears" :key="'massage-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'massage-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getMassageRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getMassageRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getMassageRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Personal Training & Swimming Lessons -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Personal Training & Swimming Lessons</div>
              </td>
              <template v-for="year in visibleYears" :key="'training-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'training-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getPersonalTrainingRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPersonalTrainingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPersonalTrainingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Spa Treatment -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Spa Treatment</div>
              </td>
              <template v-for="year in visibleYears" :key="'spa-treatment-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'spa-treatment-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getSpaRevenueItem(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSpaRevenueItemTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSpaRevenueItemTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Salon Treatment -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Salon Treatment</div>
              </td>
              <template v-for="year in visibleYears" :key="'salon-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'salon-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getSalonTreatmentRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSalonTreatmentRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSalonTreatmentRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Merchandise Header -->
            <tr class="bg-orange-600 border-b border-orange-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-orange-700">
                <div class="flex items-center gap-1">Merchandise</div>
              </td>
            </tr>

            <!-- Clothing -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Clothing</div>
              </td>
              <template v-for="year in visibleYears" :key="'clothing-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'clothing-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getClothingRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getClothingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getClothingRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Memberships Header -->
            <tr class="bg-orange-600 border-b border-orange-700">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white border-r border-orange-700">
                <div class="flex items-center gap-1">Memberships</div>
              </td>
            </tr>

            <!-- Pool/SPA -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Pool/SPA</div>
              </td>
              <template v-for="year in visibleYears" :key="'pool-spa-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pool-spa-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getPoolSpaMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Gym Membership -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Gym</div>
              </td>
              <template v-for="year in visibleYears" :key="'gym-membership-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'gym-membership-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getGymMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Pool / Gym -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Pool / Gym</div>
              </td>
              <template v-for="year in visibleYears" :key="'pool-gym-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pool-gym-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getPoolGymMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Spa / Gym -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Spa / Gym</div>
              </td>
              <template v-for="year in visibleYears" :key="'spa-gym-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'spa-gym-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getSpaGymMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSpaGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getSpaGymMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Gym / Pool / Spa -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Gym / Pool / Spa</div>
              </td>
              <template v-for="year in visibleYears" :key="'gym-pool-spa-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'gym-pool-spa-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getGymPoolSpaMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getGymPoolSpaMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Pool -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Pool</div>
              </td>
              <template v-for="year in visibleYears" :key="'pool-membership-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pool-membership-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getPoolMembershipRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getPoolMembershipRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL CLUB USE REVENUE -->
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-200 border-b-2 border-orange-600">
              <td class="px-3 py-2 font-bold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">TOTAL CLUB USE REVENUE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-club-use-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-club-use-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-600 font-semibold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalClubUseRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalClubUseRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalClubUseRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL TREATMENTS & OTHER SERVICES -->
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-200 border-b-2 border-orange-600">
              <td class="px-3 py-2 font-bold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">TOTAL TREATMENTS & OTHER SERVICES</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-treatments-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-treatments-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-600 font-semibold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalTreatmentsOtherServices(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalTreatmentsOtherServicesYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalTreatmentsOtherServicesYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL MEMBERSHIPS -->
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-200 border-b-2 border-orange-600">
              <td class="px-3 py-2 font-bold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">TOTAL MEMBERSHIPS</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-memberships-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-memberships-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-600 font-semibold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalMemberships(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalMembershipsYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalMembershipsYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL HEALTH CLUB & SPA -->
            <tr class="bg-orange-700 border-b-2 border-orange-800">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL HEALTH CLUB & SPA</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-health-club-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-health-club-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubSpa(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubSpaYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubSpaYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SERVICE CHARGE -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">SERVICE CHARGE</div>
              </td>
              <template v-for="year in visibleYears" :key="'service-charge-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'service-charge-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getHealthClubServiceCharge(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getHealthClubServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getHealthClubServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL HEALTH CLUB REV INCLUDING SC. -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL HEALTH CLUB REV INCLUDING SC.</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-health-club-incl-sc-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-health-club-incl-sc-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubRevInclSC(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalHealthClubRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-laundry-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-laundry-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
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
              <template v-for="year in visibleYears" :key="'empty-laundry-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-laundry-2-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- LAUNDRY REVENUE Section Divider -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  <Shirt class="w-4 h-4" />
                  LAUNDRY REVENUE
                </div>
              </td>
            </tr>

            <!-- In House Guest Laundry & Dry cleaning -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">In House Guest Laundry & Dry cleaning</div>
              </td>
              <template v-for="year in visibleYears" :key="'in-house-laundry-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'in-house-laundry-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getInHouseGuestLaundryRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getInHouseGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getInHouseGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Dry Cleaning -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Dry Cleaning</div>
              </td>
              <template v-for="year in visibleYears" :key="'dry-cleaning-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'dry-cleaning-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getDryCleaningRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getDryCleaningRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getDryCleaningRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Outside Guest Laundry -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Outside Guest Laundry</div>
              </td>
              <template v-for="year in visibleYears" :key="'outside-laundry-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'outside-laundry-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOutsideGuestLaundryRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOutsideGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOutsideGuestLaundryRevenueTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL LAUNDRY REVENUE -->
            <tr class="bg-orange-700 border-b-2 border-orange-800">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL LAUNDRY REVENUE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-laundry-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-laundry-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevenue(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevenueYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- SERVICE CHARGE -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">SERVICE CHARGE</div>
              </td>
              <template v-for="year in visibleYears" :key="'laundry-service-charge-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'laundry-service-charge-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getLaundryServiceCharge(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getLaundryServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getLaundryServiceChargeTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL LAUNDRY REVENUE INCLUDING SC. -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL LAUNDRY REVENUE INCLUDING SC.</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-laundry-incl-sc-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-laundry-incl-sc-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevInclSC(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalLaundryRevInclSCYear(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-ood-revenue-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-ood-revenue-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- TOTAL OOD REVENUE -->
            <tr class="bg-orange-700 border-b-2 border-orange-800">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL OOD REVENUE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-ood-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-ood-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodRevenueYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-cost-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-cost-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
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
              <template v-for="year in visibleYears" :key="'empty-cost-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-cost-2-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- COST OF SALES Section Divider -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  <TrendingDown class="w-4 h-4" />
                  COST OF SALES
                </div>
              </td>
            </tr>

            <!-- Cost Of Laundry -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Cost Of Laundry</div>
              </td>
              <template v-for="year in visibleYears" :key="'cost-laundry-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'cost-laundry-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getCostOfLaundry(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfLaundryTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfLaundryTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Cost of Merchandise Sales -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Cost of Merchandise Sales</div>
              </td>
              <template v-for="year in visibleYears" :key="'cost-merchandise-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'cost-merchandise-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getCostOfMerchandiseSales(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfMerchandiseSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfMerchandiseSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Cost of Clothing Sales -->
            <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Cost of Clothing Sales</div>
              </td>
              <template v-for="year in visibleYears" :key="'cost-clothing-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'cost-clothing-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getCostOfClothingSales(calculationCache, projectName, year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfClothingSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getCostOfClothingSalesTotal(calculationCache, projectName, year, getColumnLabelsForYear)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL COST OF SALES -->
            <tr class="bg-orange-700 border-b-2 border-orange-800">
              <td class="px-3 py-2 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">TOTAL COST OF SALES</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-cost-sales-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-cost-sales-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 font-semibold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSalesCached(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSalesYearCached(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 font-bold bg-orange-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCostOfSalesYearCached(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 1 before Payroll -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-payroll-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-payroll-1-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- Empty Row 2 before Payroll -->
            <tr class="bg-gray-100 border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200">
                <div class="flex items-center gap-1"></div>
              </td>
              <template v-for="year in visibleYears" :key="'empty-payroll-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-payroll-2-cell-' + year + '-' + label" class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-gray-200 bg-gray-100"></td>
                </template>
              </template>
            </tr>

            <!-- PAYROLL Divider -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  <Users class="w-4 h-4" />
                  PAYROLL
                </div>
              </td>
            </tr>

            <!-- Payroll Sub Header -->
            <tr class="bg-orange-600 border-b border-orange-600">
              <td class="px-3 py-2 font-semibold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">
                  Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management Group Header -->
            <tr v-if="hasOodPayrollGroupData('management')" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">
                  Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'mgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Management per-designation rows -->
            <template v-for="des in oodPayrollDesignationsManagement" :key="'mgmt-des-' + des.designation + '-' + des.location">
              <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
                <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                  <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">{{ des.designation }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'mgmt-row-' + des.designation + '-' + des.location + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td v-for="label in getColumnLabelsForYear(year)" :key="'mgmt-cell-' + des.designation + '-' + des.location + '-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30 dark:text-gray-200">
                      <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollMonthlySalaryByDesignation(year, label, des)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollMonthlySalaryTotal(year, des)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollMonthlySalaryTotal(year, des)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Payroll: Non-Management Group Header -->
            <tr v-if="hasOodPayrollGroupData('non-management')" class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1">
                  Non-Management
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'nonmgmt-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30"></td>
                </template>
              </template>
            </tr>

            <!-- Payroll: Non-Management per-designation rows -->
            <template v-for="des in oodPayrollDesignationsNonManagement" :key="'nonmgmt-des-' + des.designation + '-' + des.location">
              <tr class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
                <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                  <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">{{ des.designation }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'nonmgmt-row-' + des.designation + '-' + des.location + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td v-for="label in getColumnLabelsForYear(year)" :key="'nonmgmt-cell-' + des.designation + '-' + des.location + '-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30 dark:text-gray-200">
                      <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollMonthlySalaryByDesignation(year, label, des)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollMonthlySalaryTotal(year, des)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollMonthlySalaryTotal(year, des)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Total Payroll -->
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000 border-b-2 border-orange-600">
              <td class="px-3 py-2 font-bold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-orange-600 font-semibold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                      <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayroll(year, label)) }}</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayrollYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayrollYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Payroll Related Sub Header -->
            <tr class="bg-orange-600 border-b border-orange-600">
              <td class="px-3 py-2 font-semibold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">
                  Payroll Related
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'payroll-related-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'payroll-related-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
              </template>
            </tr>

            <!-- NSSIT Row -->
            <tr v-if="hasOodPayrollRelatedData('NSSIT')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">NSSIT</div>
              </td>
              <template v-for="year in visibleYears" :key="'nssit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'nssit-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'NSSIT')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'NSSIT')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Vacation Row -->
            <tr v-if="hasOodPayrollRelatedData('Vacation')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Vacation</div>
              </td>
              <template v-for="year in visibleYears" :key="'vacation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'vacation-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Vacation')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Vacation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Relocation Row -->
            <tr v-if="hasOodPayrollRelatedData('Relocation')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Relocation</div>
              </td>
              <template v-for="year in visibleYears" :key="'relocation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'relocation-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Relocation')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Relocation')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Severence & Indemnity Row -->
            <tr v-if="hasOodPayrollRelatedData('Severence & Indemnity')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Severence & Indemnity</div>
              </td>
              <template v-for="year in visibleYears" :key="'severence-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'severence-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Severence & Indemnity')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Severence & Indemnity')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Row -->
            <tr v-if="hasOodPayrollRelatedData('Other')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Other</div>
              </td>
              <template v-for="year in visibleYears" :key="'other-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'other-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Other')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Other')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Medical Row -->
            <tr v-if="hasOodPayrollRelatedData('Medical')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Medical</div>
              </td>
              <template v-for="year in visibleYears" :key="'medical-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'medical-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Medical')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Medical')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Uniforms Row -->
            <tr v-if="hasOodPayrollRelatedData('Uniforms')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Uniforms</div>
              </td>
              <template v-for="year in visibleYears" :key="'uniforms-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'uniforms-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Uniforms')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Uniforms')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Employee Meal Row -->
            <tr v-if="hasOodPayrollRelatedData('Employee Meal')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Employee Meal</div>
              </td>
              <template v-for="year in visibleYears" :key="'employee-meal-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'employee-meal-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Employee Meal')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Employee Meal')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Transport Row -->
            <tr v-if="hasOodPayrollRelatedData('Transport')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Transport</div>
              </td>
              <template v-for="year in visibleYears" :key="'transport-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'transport-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Transport')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Transport')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Telephone Row -->
            <tr v-if="hasOodPayrollRelatedData('Telephone')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Telephone</div>
              </td>
              <template v-for="year in visibleYears" :key="'telephone-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'telephone-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Telephone')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Telephone')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Air Ticket Row -->
            <tr v-if="hasOodPayrollRelatedData('Air Ticket')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Air Ticket</div>
              </td>
              <template v-for="year in visibleYears" :key="'air-ticket-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'air-ticket-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Air Ticket')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Air Ticket')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Benefits Row -->
            <tr v-if="hasOodPayrollRelatedData('Other Benefits')" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Other Benefits</div>
              </td>
              <template v-for="year in visibleYears" :key="'other-benefits-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'other-benefits-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                    <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodPayrollRelatedValue(year, label, 'Other Benefits')) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodPayrollRelatedTotal(year, 'Other Benefits')) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Payroll Related Expenses -->
            <tr class="bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000 border-b-2 border-orange-600">
              <td class="px-3 py-2 font-bold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">
                  Total Payroll Related Expenses
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-payroll-related-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-payroll-related-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-600 font-semibold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayrollRelatedExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-600 font-bold bg-orange-500 dark:bg-orange-900/20 text-white dark:text-gray-2000">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalOodPayrollRelatedExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Bonus Sub Header -->
            <tr class="bg-orange-600 border-b border-orange-600">
              <td class="px-3 py-2 font-semibold border-r border-orange-600">
                <div class="flex items-center gap-1 text-white">
                  Bonus
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-subheader-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-subheader-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                  </template>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-center border border-orange-600 bg-orange-600"></td>
                </template>
              </template>
            </tr>

            <!-- Bonus Details Row -->
            <tr v-if="hasOodBonusData()" class="bg-orange-100 dark:bg-orange-800/30 border-b border-orange-300 dark:border-orange-700">
              <td class="px-3 py-2 font-medium border-r border-orange-300 dark:border-orange-700">
                <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">Bonus Details</div>
              </td>
              <template v-for="year in visibleYears" :key="'bonus-details-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <template v-for="label in getColumnLabelsForYear(year)" :key="'bonus-details-cell-' + year + '-' + label">
                    <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-800/30">
                      <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodBonusValue(year, label)) }}</span>
                    </td>
                  </template>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodBonusTotal(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-300 dark:border-orange-700 font-semibold bg-orange-200 dark:bg-orange-700/30">
                    <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodBonusTotal(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Expenses Divider -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white border-r border-orange-700">
                <div class="flex items-center gap-2">
                  <DollarSign class="w-4 h-4" />
                  OOD Expenses
                </div>
              </td>
            </tr>

            <!-- OOD Expense Line Items -->
            <template v-for="expense in oodExpenseCategories" :key="'ood-expense-' + expense">
              <tr class="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
                <td class="px-3 py-2 font-medium border-r border-orange-200 dark:border-orange-800">
                  <div class="flex items-center gap-1 text-orange-800 dark:text-orange-200">{{ expense }}</div>
                </td>
                <template v-for="year in visibleYears" :key="'ood-expense-' + expense + '-' + year">
                  <template v-if="!isYearCollapsed(year)">
                    <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-expense-cell-' + expense + '-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 dark:text-gray-200">
                      <span class="font-mono text-xs text-orange-700 dark:text-orange-300">{{ formatMoney(getOodExpense(expense, year, label)) }}</span>
                    </td>
                    <td class="px-2 py-1 text-right border border-orange-200 dark:border-orange-800 font-semibold bg-orange-100 dark:bg-orange-900/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodExpenseYear(expense, year)) }}</span>
                    </td>
                  </template>
                  <template v-else>
                    <td class="px-2 py-1 text-right border border-orange-200 dark:border-orange-800 font-semibold bg-orange-100 dark:bg-orange-900/30">
                      <span class="font-mono text-xs text-orange-800 dark:text-orange-200">{{ formatMoney(getOodExpenseYear(expense, year)) }}</span>
                    </td>
                  </template>
                </template>
              </tr>
            </template>

            <!-- Empty row for spacing -->
            <tr>
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>

            <!-- TOTAL OOD EXPENSES Row -->
            <tr class="bg-orange-600 border-b-2 border-orange-700">
              <td class="px-3 py-2 font-bold border-r border-orange-700">
                <div class="flex items-center gap-1 text-white">
                  TOTAL OOD EXPENSES
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-ood-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-ood-expenses-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-700 bg-orange-600 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalOodExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-700 bg-orange-700 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalOodExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-700 bg-orange-700 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalOodExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty row for spacing -->
            <tr>
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>
            <tr>
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>

            <!-- TOTAL EXPENSES Row -->
            <tr class="bg-orange-700 border-b-2 border-orange-800">
              <td class="px-3 py-3 font-bold border-r border-orange-800">
                <div class="flex items-center gap-1 text-white">
                  TOTAL EXPENSES
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'total-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-expenses-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-800 bg-orange-700 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalExpenses(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-800 bg-orange-800 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-800 bg-orange-800 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getTotalExpensesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty row for spacing -->
            <tr>
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>
            <tr>
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-1"></td>
            </tr>

            <!-- DEPARTMENTAL INCOME (LOSS) Row -->
            <tr class="bg-orange-800 border-b-2 border-orange-900">
              <td class="px-3 py-3 font-bold border-r border-orange-900">
                <div class="flex items-center gap-1 text-white">
                  DEPARTMENTAL INCOME (LOSS)
                </div>
              </td>
              <template v-for="year in visibleYears" :key="'departmental-income-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'departmental-income-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-orange-900 bg-orange-800 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getDepartmentalIncome(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-orange-900 bg-orange-900 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getDepartmentalIncomeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-orange-900 bg-orange-900 text-white">
                    <span class="font-mono text-xs font-bold">{{ formatMoney(getDepartmentalIncomeYear(year)) }}</span>
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
  formatNumber,
  formatMoney,
  formatPercentage,
  getNoOfDays as getNoOfDaysUtil,
  getNoOfRooms as getNoOfRoomsUtil,
  getNoOfRoomsTotal as getNoOfRoomsTotalUtil,
  getNoOfDaysTotal as getNoOfDaysTotalUtil,
  getAvailableRooms as getAvailableRoomsUtil,
  getAvailableRoomsTotal as getAvailableRoomsTotalUtil,
  getSoldRooms as getSoldRoomsUtil,
  getSoldRoomsTotal as getSoldRoomsTotalUtil,
  getOccupancyPercentage as getOccupancyPercentageUtil,
  getOccupancyPercentageTotal as getOccupancyPercentageTotalUtil,
  getNumberOfGuests as getNumberOfGuestsUtil,
  getNumberOfGuestsTotal as getNumberOfGuestsTotalUtil,
  // Health Club functions
  hasHealthClubData,
  getSaunaRevenue,
  getSaunaRevenueTotal,
  getGymRevenue,
  getGymRevenueTotal,
  getSwimmingPoolRevenue,
  getSwimmingPoolRevenueTotal,
  getFitnessLessonsRevenue,
  getFitnessLessonsRevenueTotal,
  getHealthWellnessRevenue,
  getHealthWellnessRevenueTotal,
  getMassageRevenue,
  getMassageRevenueTotal,
  getPersonalTrainingRevenue,
  getPersonalTrainingRevenueTotal,
  getSpaRevenueItem,
  getSpaRevenueItemTotal,
  getSalonTreatmentRevenue,
  getSalonTreatmentRevenueTotal,
  getClothingRevenue,
  getClothingRevenueTotal,
  getPoolSpaMembershipRevenue,
  getPoolSpaMembershipRevenueTotal,
  getGymMembershipRevenue,
  getGymMembershipRevenueTotal,
  getPoolGymMembershipRevenue,
  getPoolGymMembershipRevenueTotal,
  getSpaGymMembershipRevenue,
  getSpaGymMembershipRevenueTotal,
  getGymPoolSpaMembershipRevenue,
  getGymPoolSpaMembershipRevenueTotal,
  getPoolMembershipRevenue,
  getPoolMembershipRevenueTotal,
  getTotalClubUseRevenue,
  getTotalClubUseRevenueYear,
  getTotalTreatmentsOtherServices,
  getTotalTreatmentsOtherServicesYear,
  getTotalMemberships,
  getTotalMembershipsYear,
  getTotalHealthClubSpa,
  getTotalHealthClubSpaYear,
  getHealthClubServiceCharge,
  getHealthClubServiceChargeTotal,
  getTotalHealthClubRevInclSC,
  getTotalHealthClubRevInclSCYear,
  // Laundry functions
  getInHouseGuestLaundryRevenue,
  getInHouseGuestLaundryRevenueTotal,
  getDryCleaningRevenue,
  getDryCleaningRevenueTotal,
  getOutsideGuestLaundryRevenue,
  getOutsideGuestLaundryRevenueTotal,
  getTotalLaundryRevenue,
  getTotalLaundryRevenueYear,
  getLaundryServiceCharge,
  getLaundryServiceChargeTotal,
  getTotalLaundryRevInclSC,
  getTotalLaundryRevInclSCYear,
  // Cost of Sales functions
  getCostOfLaundry,
  getCostOfLaundryTotal,
  getCostOfMerchandiseSales,
  getCostOfMerchandiseSalesTotal,
  getCostOfClothingSales,
  getCostOfClothingSalesTotal,
  getTotalCostOfSales,
  getTotalCostOfSalesYear,
  // Expense functions
  getOodExpenseCategories,
  getOodExpenseByCategory,
  getOodExpenseByCategoryYear,
  getTotalOodExpensesByCategory,
  getTotalOodExpensesByCategoryYear,
  hasOodExpenseCategoryData
} from './utility/index.js';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building2,
  Dumbbell,
  Shirt,
  TrendingDown,
  Users,
  DollarSign
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
  if (mode === 'quarterly') return ['Q1', 'Q2', 'Q3', 'Q4'];
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

// ============================================================================
// STATISTICS FUNCTIONS
// ============================================================================

// Statistics from OOD page cache - wrapping utility functions
function getNoOfRooms(year, label) {
  return getNoOfRoomsUtil(calculationCache, projectName.value, year, label);
}

function getNoOfRoomsTotal(year) {
  return getNoOfRoomsTotalUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

function getNoOfDays(year, label) {
  return getNoOfDaysUtil(year, label);
}

function getNoOfDaysTotal(year) {
  return getNoOfDaysTotalUtil(year, getColumnLabelsForYear);
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

// Data validation checks
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

// Check if Health Club section should be shown
function showHealthClubSection() {
  return hasHealthClubData(calculationCache, projectName.value, props.visibleYears, getColumnLabelsForYear);
}

// ============================================================================
// OOD PAYROLL FUNCTIONS
// ============================================================================

import { PAGE, DEPARTMENT } from '@/components/utility/_master_utility/cacheKeys.js';

// Helper function to get months for a label
function getMonthsForLabel(label) {
  if (label === 'Q1') return ['Jan', 'Feb', 'Mar'];
  if (label === 'Q2') return ['Apr', 'May', 'Jun'];
  if (label === 'Q3') return ['Jul', 'Aug', 'Sep'];
  if (label === 'Q4') return ['Oct', 'Nov', 'Dec'];
  return [label];
}

// Helper function to parse OOD payroll row codes
function parseOodMonthlySalaryRowCode(rowCode) {
  try {
    if (!rowCode || !rowCode.startsWith('MonthlySalary|')) return null;
    const regex = /^MonthlySalary\|department:Other Operating Departments\|position:(.*?)\|location:(.*?)\|designation:(.*)$/;
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

// Helper function to determine if position is management
function isOodManagementPositionName(position) {
  if (!position) return false;
  const lower = position.toLowerCase().trim();
  
  // Explicitly check for non-management first
  if (lower.includes('non-manager') || lower === 'non-manager') return false;
  
  // Check for management positions
  return lower.includes('manager') || lower.includes('director') || lower.includes('supervisor') || lower.includes('head');
}

// Get number helper
function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Computed properties for OOD payroll designations
const oodPayrollDesignationsManagement = computed(() => {
  try {
    const designations = [];
    const project = projectName.value;
    const oodDepartmentKeys = ['Other Operating Departments', 'OOD', 'Other Operating Department'];
    const seen = new Set();
    
    // Prefer normalized payroll structure across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        // Only process OOD department
        if (!oodDepartmentKeys.includes(departmentKey)) return;
        
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          Object.keys(byPosition).forEach((positionKey) => {
            // Only include management positions
            if (!isOodManagementPositionName(positionKey)) return;
            
            const byDesignation = byPosition[positionKey] || {};
            Object.keys(byDesignation).forEach((designationKey) => {
              const key = `${locationKey}|${designationKey}`;
              if (!seen.has(key)) {
                seen.add(key);
                designations.push({
                  designation: designationKey,
                  location: locationKey,
                  position: positionKey
                });
              }
            });
          });
        });
      });
    });
    
    return designations.sort((a, b) => a.designation.localeCompare(b.designation));
  } catch (e) {
    console.error('OOD P&L: Error discovering payroll management designations:', e);
    return [];
  }
});

const oodPayrollDesignationsNonManagement = computed(() => {
  try {
    const designations = [];
    const project = projectName.value;
    const oodDepartmentKeys = ['Other Operating Departments', 'OOD', 'Other Operating Department'];
    const seen = new Set();
    
    // Prefer normalized payroll structure across visible years
    (Array.isArray(props.visibleYears) ? props.visibleYears : []).forEach((yr) => {
      const yearBucket = calculationCache?.payroll?.[project]?.[yr] || {};
      Object.keys(yearBucket).forEach((departmentKey) => {
        // Only process OOD department
        if (!oodDepartmentKeys.includes(departmentKey)) return;
        
        const byLocation = yearBucket[departmentKey] || {};
        Object.keys(byLocation).forEach((locationKey) => {
          const byPosition = byLocation[locationKey] || {};
          Object.keys(byPosition).forEach((positionKey) => {
            // Only include non-management positions
            if (isOodManagementPositionName(positionKey)) return;
            
            const byDesignation = byPosition[positionKey] || {};
            Object.keys(byDesignation).forEach((designationKey) => {
              const key = `${locationKey}|${designationKey}`;
              if (!seen.has(key)) {
                seen.add(key);
                designations.push({
                  designation: designationKey,
                  location: locationKey,
                  position: positionKey
                });
              }
            });
          });
        });
      });
    });
    
    return designations.sort((a, b) => a.designation.localeCompare(b.designation));
  } catch (e) {
    console.error('OOD P&L: Error discovering payroll non-management designations:', e);
    return [];
  }
});

// Get OOD payroll monthly salary by designation
function getOodPayrollMonthlySalaryByDesignation(year, label, designationObj) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payroll structure
    const payrollNorm = calculationCache?.payroll?.[project]?.[year] || {};
    
    // Look for OOD department data (support multiple department name variations)
    const oodDepartmentKeys = ['Other Operating Departments', 'OOD', 'Other Operating Department'];
    
    Object.keys(payrollNorm).forEach((departmentKey) => {
      // Only process OOD department
      if (!oodDepartmentKeys.includes(departmentKey)) return;
      
      const byLocation = payrollNorm[departmentKey] || {};
      const locBucket = byLocation?.[designationObj.location];
      if (!locBucket) return;
      
      const posBucket = locBucket?.[designationObj.position];
      if (!posBucket) return;
      
      const desBucket = posBucket?.[designationObj.designation];
      if (!desBucket) return;
      
      for (const m of months) {
        const v = desBucket?.[m];
        if (v !== undefined && v !== null) {
          sum += getNumber(v);
        }
      }
    });

    if (sum > 0) return sum;

    // Fallback to legacy PAGE-based cache
    const page = PAGE.PAYROLL;
    const pageData = calculationCache?.cache?.[project]?.[page] || {};
    Object.keys(pageData).forEach((rowCode) => {
      const parsed = parseOodMonthlySalaryRowCode(rowCode);
      if (!parsed || 
          parsed.location !== designationObj.location || 
          parsed.designation !== designationObj.designation) return;
      
      for (const m of months) {
        const val = calculationCache.getValue(project, page, rowCode, year, m);
        if (val !== undefined && val !== null) sum += getNumber(val);
      }
    });
    return sum;
  } catch (e) {
    console.error('Error getting OOD payroll by designation:', e);
    return 0;
  }
}

// Get OOD payroll monthly salary total for designation
function getOodPayrollMonthlySalaryTotal(year, designationObj) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((acc, lab) => acc + getNumber(getOodPayrollMonthlySalaryByDesignation(year, lab, designationObj)), 0);
  } catch (e) {
    return 0;
  }
}

// Check if OOD payroll group has data
function hasOodPayrollGroupData(group) {
  try {
    const designations = group === 'management' ? oodPayrollDesignationsManagement.value : oodPayrollDesignationsNonManagement.value;
    if (!designations || designations.length === 0) return false;
    
    for (const year of (Array.isArray(props.visibleYears) ? props.visibleYears : [])) {
      for (const des of designations) {
        const total = getOodPayrollMonthlySalaryTotal(year, des);
        if (getNumber(total) > 0) return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Get total OOD payroll
function getTotalOodPayroll(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Total Payroll retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    let total = 0;

    // Add management payroll
    for (const des of oodPayrollDesignationsManagement.value) {
      total += getNumber(getOodPayrollMonthlySalaryByDesignation(year, label, des));
    }

    // Add non-management payroll
    for (const des of oodPayrollDesignationsNonManagement.value) {
      total += getNumber(getOodPayrollMonthlySalaryByDesignation(year, label, des));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, total);
    console.log('[OOD P&L] Cached Total Payroll:', { project, year, label, total });

    return total;
  } catch (e) {
    return 0;
  }
}

// Get total OOD payroll for year
function getTotalOodPayrollYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Total Payroll Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((acc, lab) => acc + getNumber(getTotalOodPayroll(year, lab)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', total);
    console.log('[OOD P&L] Cached Total Payroll Year Total:', { project, year, total });
    
    return total;
  } catch (e) {
    return 0;
  }
}

// Check if OOD payroll subsection has any data
function hasOodPayrollSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;

  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getTotalOodPayroll(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// ============================================================================
// OOD PAYROLL RELATED FUNCTIONS
// ============================================================================

// Get payroll related value for OOD
function getOodPayrollRelatedValue(year, label, benefitType) {
  try {
    const project = projectName.value;
    const months = getMonthsForLabel(label);
    let sum = 0;

    // Prefer normalized payrollRelated structure
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
    console.error('Error fetching OOD payroll related value:', benefitType, error);
    return 0;
  }
}

// Get payroll related total for OOD
function getOodPayrollRelatedTotal(year, benefitType) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getOodPayrollRelatedValue(year, label, benefitType)), 0);
  } catch (error) {
    console.error('Error calculating OOD payroll related total:', benefitType, error);
    return 0;
  }
}

// Check if payroll related data exists for OOD
function hasOodPayrollRelatedData(benefitType) {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOodPayrollRelatedValue(year, label, benefitType) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Get total payroll related expenses for OOD
function getTotalOodPayrollRelatedExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll Related Expenses';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Total Payroll Related Expenses retrieved from cache:', { project, year, label, cachedValue });
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
      total += getNumber(getOodPayrollRelatedValue(year, label, benefitType));
    }
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, total);
    console.log('[OOD P&L] Cached Total Payroll Related Expenses:', { project, year, label, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total OOD payroll related expenses:', error);
    return 0;
  }
}

// Get total payroll related expenses for year
function getTotalOodPayrollRelatedExpensesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Total Payroll Related Expenses';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Total Payroll Related Expenses Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getTotalOodPayrollRelatedExpenses(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', total);
    console.log('[OOD P&L] Cached Total Payroll Related Expenses Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating total OOD payroll related expenses for year:', error);
    return 0;
  }
}

// Check if entire Payroll Related subsection has any data
function hasOodPayrollRelatedSubsectionData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
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
  
  for (const item of payrollRelatedItems) {
    if (hasOodPayrollRelatedData(item)) {
      return true;
    }
  }
  return false;
}

// ============================================================================
// OOD BONUS FUNCTIONS
// ============================================================================

// Get bonus value for OOD
function getOodBonusValue(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'Bonus Details';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Bonus Details retrieved from cache:', { project, year, label, cachedValue });
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
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, sum);
    console.log('[OOD P&L] Cached Bonus Details:', { project, year, label, sum });
    
    return sum;
  } catch (error) {
    console.error('Error fetching OOD bonus value:', error);
    return 0;
  }
}

// Get bonus total for year
function getOodBonusTotal(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'Bonus Details';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] Bonus Details Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    // First try to get the yearly total directly from Bonus page cache
    const yearlyTotal = calculationCache.getValue(project, PAGE.BONUS, 'Total Hotel', year, 'Total');
    if (yearlyTotal !== undefined && yearlyTotal !== null) {
      const total = getNumber(yearlyTotal);
      // Cache the yearly total
      calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', total);
      console.log('[OOD P&L] Cached Bonus Details Year Total from Bonus page:', { project, year, total });
      return total;
    }
    
    // Fallback: sum all period labels if yearly total not available
    const labels = getColumnLabelsForYear(year);
    const total = labels.reduce((sum, label) => sum + getNumber(getOodBonusValue(year, label)), 0);
    
    // Cache the calculated yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', total);
    console.log('[OOD P&L] Cached Bonus Details Year Total:', { project, year, total });
    
    return total;
  } catch (error) {
    console.error('Error calculating OOD bonus total for year:', error);
    return 0;
  }
}

// Check if bonus data exists
function hasOodBonusData() {
  if (!props.visibleYears || props.visibleYears.length === 0) return false;
  
  for (const year of props.visibleYears) {
    const labels = getColumnLabelsForYear(year);
    for (const label of labels) {
      if (getOodBonusValue(year, label) > 0) {
        return true;
      }
    }
  }
  return false;
}

// Check if entire Bonus subsection has any data
function hasOodBonusSubsectionData() {
  return hasOodBonusData();
}

// ============================================================================
// OOD EXPENSES FUNCTIONS
// ============================================================================

// Get all OOD expense categories from the cache
const oodExpenseCategories = computed(() => {
  try {
    return getOodExpenseCategories(calculationCache, projectName.value);
  } catch (error) {
    console.error('Error getting OOD expense categories:', error);
    return [];
  }
});

// Get OOD expense value for a specific category and period
function getOodExpense(expense, year, label) {
  try {
    return getOodExpenseByCategory(calculationCache, projectName.value, expense, year, label);
  } catch (error) {
    console.error(`Error getting OOD expense ${expense} for ${year} ${label}:`, error);
    return 0;
  }
}

// Get OOD expense value for entire year
function getOodExpenseYear(expense, year) {
  try {
    return getOodExpenseByCategoryYear(calculationCache, projectName.value, expense, year, getColumnLabelsForYear);
  } catch (error) {
    console.error(`Error getting OOD expense ${expense} for year ${year}:`, error);
    return 0;
  }
}

// Get total of all OOD expenses for a period
function getTotalOodExpenses(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL OOD EXPENSES';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL OOD EXPENSES retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate using the imported function
    const total = getNumber(getTotalOodExpensesByCategory(calculationCache, projectName.value, year, label));
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, total);
    console.log('[OOD P&L] Cached TOTAL OOD EXPENSES:', { project, year, label, total });
    
    return total;
  } catch (error) {
    console.error(`Error getting total OOD expenses for ${year} ${label}:`, error);
    return 0;
  }
}

// Get total of all OOD expenses for entire year
function getTotalOodExpensesYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL OOD EXPENSES';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL OOD EXPENSES Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    // Calculate using the imported function
    const yearTotal = getNumber(getTotalOodExpensesByCategoryYear(calculationCache, projectName.value, year, getColumnLabelsForYear));
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[OOD P&L] Cached TOTAL OOD EXPENSES Year Total:', { project, year, yearTotal });
    
    return yearTotal;
  } catch (error) {
    console.error(`Error getting total OOD expenses for year ${year}:`, error);
    return 0;
  }
}

// Check if there's any OOD expense data
function hasOodExpensesData() {
  try {
    return hasOodExpenseCategoryData(calculationCache, projectName.value, props.visibleYears, getColumnLabelsForYear);
  } catch (error) {
    return false;
  }
}

// ============================================================================
// TOTAL COST OF SALES FUNCTIONS (Cached Wrappers)
// ============================================================================

// Get total cost of sales (cached wrapper)
function getTotalCostOfSalesCached(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL COST OF SALES';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL COST OF SALES retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate using the imported function
    const total = getNumber(getTotalCostOfSales(calculationCache, projectName.value, year, label));
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, total);
    console.log('[OOD P&L] Cached TOTAL COST OF SALES:', { project, year, label, total });
    
    return total;
  } catch (error) {
    console.error(`Error calculating total cost of sales for ${year} ${label}:`, error);
    return 0;
  }
}

// Get total cost of sales for entire year (cached wrapper)
function getTotalCostOfSalesYearCached(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL COST OF SALES';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL COST OF SALES Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    // Calculate using the imported function
    const yearTotal = getNumber(getTotalCostOfSalesYear(calculationCache, projectName.value, year, getColumnLabelsForYear));
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[OOD P&L] Cached TOTAL COST OF SALES Year Total:', { project, year, yearTotal });
    
    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total cost of sales for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// TOTAL EXPENSES FUNCTIONS
// ============================================================================

// Get total expenses (Cost of Sales + Payroll + Payroll Related + Bonus + OOD Expenses)
function getTotalExpenses(year, label) {
  try {
    let total = 0;
    
    // Add Total Cost of Sales
    total += getNumber(getTotalCostOfSalesCached(year, label));
    
    // Add Total Payroll
    total += getNumber(getTotalOodPayroll(year, label));
    
    // Add Total Payroll Related Expenses
    total += getNumber(getTotalOodPayrollRelatedExpenses(year, label));
    
    // Add Bonus Details
    total += getNumber(getOodBonusValue(year, label));
    
    // Add Total OOD Expenses
    total += getNumber(getTotalOodExpenses(year, label));
    
    return total;
  } catch (error) {
    console.error(`Error calculating total expenses for ${year} ${label}:`, error);
    return 0;
  }
}

// Get total expenses for entire year
function getTotalExpensesYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getTotalExpenses(year, label)), 0);
  } catch (error) {
    console.error(`Error calculating total expenses for year ${year}:`, error);
    return 0;
  }
}

// ============================================================================
// TOTAL OOD REVENUE FUNCTIONS
// ============================================================================

// Get total OOD revenue (Health Club + Laundry, both including SC) for a specific year and period
function getTotalOodRevenue(year, label) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL OOD REVENUE';
    
    // Check if value is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, label);
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.[label] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL OOD REVENUE retrieved from cache:', { project, year, label, cachedValue });
      return cachedValue;
    }
    
    // Calculate: TOTAL HEALTH CLUB REV INCLUDING SC + TOTAL LAUNDRY REVENUE INCLUDING SC
    const healthClubRevenue = getNumber(getTotalHealthClubRevInclSC(calculationCache, projectName.value, year, label));
    const laundryRevenue = getNumber(getTotalLaundryRevInclSC(calculationCache, projectName.value, year, label));
    const totalRevenue = healthClubRevenue + laundryRevenue;
    
    // Cache the calculated total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, label, totalRevenue);
    console.log('[OOD P&L] Cached TOTAL OOD REVENUE:', { project, year, label, totalRevenue });
    
    return totalRevenue;
  } catch (error) {
    console.error(`Error calculating total OOD revenue for ${year} ${label}:`, error);
    return 0;
  }
}

// Get total OOD revenue for entire year
function getTotalOodRevenueYear(year) {
  try {
    const project = projectName.value;
    const cacheKey = 'TOTAL OOD REVENUE';
    
    // Check if yearly total is already cached in OOD Report
    const cachedValue = calculationCache.getValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total');
    // Verify this is a real cached value (not the default 0.00 from getValue)
    const hasCachedValue = calculationCache.cache?.[project]?.[PAGE.OOD_REPORT]?.[cacheKey]?.[year]?.['Total'] !== undefined;
    
    if (hasCachedValue) {
      console.log('[OOD P&L] TOTAL OOD REVENUE Year retrieved from cache:', { project, year, cachedValue });
      return cachedValue;
    }
    
    const labels = getColumnLabelsForYear(year);
    const yearTotal = labels.reduce((sum, label) => sum + getNumber(getTotalOodRevenue(year, label)), 0);
    
    // Cache the yearly total (including 0) to avoid recalculation
    calculationCache.setValue(project, PAGE.OOD_REPORT, cacheKey, year, 'Total', yearTotal);
    console.log('[OOD P&L] Cached TOTAL OOD REVENUE Year Total:', { project, year, yearTotal });
    
    return yearTotal;
  } catch (error) {
    console.error(`Error calculating total OOD revenue for year ${year}:`, error);
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
    // Total Revenue includes: Health Club Revenue + Laundry Revenue (both including SC)
    const totalRevenue = getNumber(getTotalOodRevenue(year, label));
    const totalExpenses = getNumber(getTotalExpenses(year, label));
    
    return totalRevenue - totalExpenses;
  } catch (error) {
    console.error(`Error calculating departmental income for ${year} ${label}:`, error);
    return 0;
  }
}

// Get departmental income for entire year
function getDepartmentalIncomeYear(year) {
  try {
    const labels = getColumnLabelsForYear(year);
    return labels.reduce((sum, label) => sum + getNumber(getDepartmentalIncome(year, label)), 0);
  } catch (error) {
    console.error(`Error calculating departmental income for year ${year}:`, error);
    return 0;
  }
}
</script>

