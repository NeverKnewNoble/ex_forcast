z<template>
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
              <td colspan="2" class="px-3 py-3 font-bold text-white border-r border-green-700">
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
              <td colspan="2" class="px-3 py-3 font-bold text-white border-r border-green-700">
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
              <td colspan="2" class="px-3 py-2 font-semibold text-white border-r border-green-700">
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

            <!-- TOTAL F&B REVENUE -->
            <tr class="bg-green-500 border-b-2 border-green-600">
              <td class="px-3 py-2 font-bold border-r border-green-600">
                <div class="flex items-center gap-1 text-white">TOTAL F&B REVENUE</div>
              </td>
              <template v-for="year in visibleYears" :key="'total-fnb-revenue-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-fnb-revenue-cell-' + year + '-' + label" class="px-2 py-1 text-right border border-green-600 font-semibold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbRevenue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbRevenueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-green-600 font-bold bg-green-500">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalFnbRevenueYear(year)) }}</span>
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
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Building2,
  Utensils
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
</script>

<style scoped>
/* Component-specific styles, if any */
</style>


