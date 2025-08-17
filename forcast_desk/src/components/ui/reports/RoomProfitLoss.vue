<template>
  <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
    <!-- Project Name Header -->
    <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white px-6 py-6 shadow-lg border-b-4 border-blue-500">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-inner">
          <Building2 class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
          <p class="text-blue-100 text-sm mt-1 font-medium">Room Profit & Loss Report</p>
        </div>
      </div>
    </div>
    
    <!-- Rooms Section Header -->
    <div class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white px-6 py-4 shadow-md border-b-2 border-blue-400">
        <h2 class="text-xl font-semibold tracking-wide">Rooms</h2>
    </div>
    
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getNoOfRooms(year, label) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNoOfRoomsTotal(year) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNoOfRoomsTotal(year) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NO OF DAYS -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getNoOfDays(year, label) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNoOfDaysTotal(year) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNoOfDaysTotal(year) }}</span>
              </td>
                </template>
              </template>
            </tr>

            <!-- AVAILABLE ROOMS -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getAvailableRooms(year, label) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getAvailableRoomsTotal(year) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getAvailableRoomsTotal(year) }}</span>
              </td>
                </template>
              </template>
            </tr>

            <!-- SOLD ROOMS (excl. comp) -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getSoldRooms(year, label) }}</span>
            </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getSoldRoomsTotal(year) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getSoldRoomsTotal(year) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- ROOM OCCUPANCY % -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getOccupancyPercentage(year, label) }}%</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getOccupancyPercentageTotal(year) }}%</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getOccupancyPercentageTotal(year) }}%</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- NUMBER OF GUESTS -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getNumberOfGuests(year, label) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNumberOfGuestsTotal(year) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNumberOfGuestsTotal(year) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- NUMBER OF F&B COVERS -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
                    <span class="font-mono text-xs">{{ getNumberOfCovers(year, label) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNumberOfCoversTotal(year) }}</span>
            </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-100">
                    <span class="font-mono text-xs text-blue-700">{{ getNumberOfCoversTotal(year) }}</span>
            </td>
                </template>
              </template>
          </tr>

            <!-- AVERAGE F&B SPENT PER COVER -->
            <tr class="bg-blue-50 border-b border-blue-200">
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
            <tr class="bg-blue-50 border-b border-blue-200">
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
            <tr class="bg-blue-50 border-b border-blue-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200">
                <div class="flex items-center gap-1">
                  REV PER AVAILABLE ROOM
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
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen,
  Building2,
  Bed
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

// Watch for project changes to refresh data
watch(selectedProject, () => {
  // Force a reactive update when project changes
  // This will trigger recalculation of room counts from the new project's cache
}, { deep: true });

// Utility functions
function getNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function formatMoney(value) {
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
  } else if (mode === 'quarterly') {
    return ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
  }
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

// Data retrieval functions - these will be connected to your calculation cache
function getNoOfRooms(year, label) {
  try {
    // Check if market segmentation is enabled
    const isMarketSegmentationEnabled = localStorage.getItem('marketSegmentation') === 'true';
    
    // Get room count from room revenue page via calculation cache
    // Both scenarios (market segmentation on/off) now cache to the same location
    const roomCount = calculationCache.getValue(projectName.value, 'Room Revenue Assumptions', 'Total Rooms', year, label);
    
    if (roomCount !== undefined && roomCount !== null) {
      console.log(`Room P&L: Retrieved room count for ${year}/${label}:`, roomCount, 'Market segmentation:', isMarketSegmentationEnabled);
      return getNumber(roomCount);
    }
    
    // Default fallback
    console.log(`Room P&L: No cached room count found for ${year}/${label}, using default: 100`);
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
  const rooms = getNoOfRooms(year, label);
  const days = getNoOfDays(year, label);
  return rooms * days;
}

function getAvailableRoomsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getAvailableRooms(year, label)), 0);
}

function getSoldRooms(year, label) {
  // TODO: Connect to calculation cache for sold rooms
  const available = getAvailableRooms(year, label);
  return Math.floor(available * 0.75); // Placeholder 75% occupancy
}

function getSoldRoomsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getSoldRooms(year, label)), 0);
}

function getOccupancyPercentage(year, label) {
  const available = getAvailableRooms(year, label);
  const sold = getSoldRooms(year, label);
  if (available === 0) return 0;
  return ((sold / available) * 100).toFixed(1);
}

function getOccupancyPercentageTotal(year) {
  const available = getAvailableRoomsTotal(year);
  const sold = getSoldRoomsTotal(year);
  if (available === 0) return 0;
  return ((sold / available) * 100).toFixed(1);
}

function getNumberOfGuests(year, label) {
  // TODO: Connect to calculation cache for guest count
  const soldRooms = getSoldRooms(year, label);
  return Math.floor(soldRooms * 1.8); // Placeholder 1.8 guests per room
}

function getNumberOfGuestsTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfGuests(year, label)), 0);
}

function getNumberOfCovers(year, label) {
  // TODO: Connect to calculation cache for F&B covers
  const guests = getNumberOfGuests(year, label);
  return Math.floor(guests * 0.6); // Placeholder 60% of guests use F&B
}

function getNumberOfCoversTotal(year) {
  const labels = getColumnLabelsForYear(year);
  return labels.reduce((sum, label) => sum + getNumber(getNumberOfCovers(year, label)), 0);
}

function getAverageFnbSpent(year, label) {
  // TODO: Connect to calculation cache for F&B spending
  return 45.00; // Placeholder
}

function getAverageFnbSpentTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const sum = labels.reduce((sum, label) => sum + getNumber(getAverageFnbSpent(year, label)), 0);
  return sum / labels.length;
}

function getAverageRoomRate(year, label) {
  // TODO: Connect to calculation cache for room rates
  return 150.00; // Placeholder
}

function getAverageRoomRateTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const sum = labels.reduce((sum, label) => sum + getNumber(getAverageRoomRate(year, label)), 0);
  return sum / labels.length;
}

function getRevPerAvailableRoom(year, label) {
  const soldRooms = getSoldRooms(year, label);
  const availableRooms = getAvailableRooms(year, label);
  const avgRate = getAverageRoomRate(year, label);
  if (availableRooms === 0) return 0;
  return (soldRooms * avgRate) / availableRooms;
}

function getRevPerAvailableRoomTotal(year) {
  const labels = getColumnLabelsForYear(year);
  const sum = labels.reduce((sum, label) => sum + getNumber(getRevPerAvailableRoom(year, label)), 0);
  return sum / labels.length;
}


</script>

<style scoped>
/* Add any component-specific styles here */
</style>
