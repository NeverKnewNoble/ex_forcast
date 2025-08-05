<template>
  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Position
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Designation
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Salary
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Count
                </div>
              </th>
              <!-- Medical Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Medical</span>
                </div>
              </th>
              <!-- Employee Meal Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Employee Meal</span>
                </div>
              </th>
              <!-- Transport Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Transport</span>
                </div>
              </th>
            </tr>
            <tr class="bg-yellow-500/90 text-xs">
              <!-- Medical Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'medical-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Medical Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
              <!-- Employee Meal Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'meal-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Employee Meal Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
              <!-- Transport Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'transport-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Transport Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Group by categories -->
            <template v-for="category in getUniqueCategories()" :key="category">
              <tr class="bg-yellow-100 border-b-2 border-yellow-300">
                <td 
                  :colspan="4 + 39" 
                  class="px-3 py-2 font-bold text-yellow-800 text-left"
                >
                  {{ category }}
                </td>
              </tr>
              <!-- Group by Department Location within each category -->
              <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                <!-- Department Location Subdivider -->
                <tr class="bg-yellow-50 border-b border-yellow-200">
                  <td 
                    :colspan="4 + 39" 
                    class="px-3 py-1.5 font-semibold text-yellow-700 text-left text-sm"
                  >
                    {{ location }}
                  </td>
                </tr>
                <!-- Payroll rows for this location -->
                <template v-for="row in getPayrollRowsForLocation(props.payrollRows, category, location)" :key="row.id">
            <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-all duration-200">
                    <!-- Position -->
                    <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                      {{ row.position }}
                    </td>
                    <!-- Designation -->
              <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                      {{ row.designation }}
                    </td>
                    <!-- Salary -->
                    <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                      {{ formatMoney(row.salary) }}
                    </td>
                    <!-- Count -->
                    <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                      {{ row.count }}
                    </td>
                    <!-- Medical Monthly Values -->
                    <td 
                      v-for="month in months" 
                      :key="'medical-value-' + month + '-' + row.id"
                      class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                    >
                      <span class="font-mono text-xs text-yellow-700">0.00</span>
                    </td>
                    <!-- Medical Total -->
                    <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                      <span class="font-mono text-xs text-yellow-900">0.00</span>
                    </td>
                    <!-- Employee Meal Monthly Values -->
                    <td 
                      v-for="month in months" 
                      :key="'meal-value-' + month + '-' + row.id"
                      class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                    >
                      <span class="font-mono text-xs text-yellow-700">0.00</span>
                    </td>
                    <!-- Employee Meal Total -->
                    <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                      <span class="font-mono text-xs text-yellow-900">0.00</span>
                    </td>
                    <!-- Transport Monthly Values -->
                    <td 
                      v-for="month in months" 
                      :key="'transport-value-' + month + '-' + row.id"
                      class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                    >
                      <span class="font-mono text-xs text-yellow-700">0.00</span>
                    </td>
                    <!-- Transport Total -->
                    <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                      <span class="font-mono text-xs text-yellow-900">0.00</span>
                    </td>
                  </tr>
                </template>
                
                <!-- Sub-Total Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-yellow-700" />
                      Sub-Total Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-semibold text-yellow-900">{{ calculateSubTotalManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Medical Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-mgmt-medical-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Medical Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-mgmt-meal-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-mgmt-transport-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                </tr>
                
                <!-- Sub-Total Non-Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-yellow-700" />
                      Sub-Total Non-Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-semibold text-yellow-900">{{ calculateSubTotalNonManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Medical Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-nonmgmt-medical-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Medical Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-nonmgmt-meal-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-nonmgmt-transport-' + month"
                    class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                </tr>
                
                <!-- Total Row -->
                <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <BarChart3 class="w-5 h-5 text-yellow-700" />
                      Total
                    </div>
                  </td>
                  <td class="px-3 py-3 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateLocationTotalCountLocal(category, location) }}</span>
                  </td>
                  <!-- Medical Monthly cells for total -->
                  <td 
                    v-for="month in months" 
                    :key="'total-medical-' + month"
                    class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Medical Total for total -->
                  <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Monthly cells for total -->
                  <td 
                    v-for="month in months" 
                    :key="'total-meal-' + month"
                    class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Employee Meal Total for total -->
                  <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Monthly cells for total -->
                  <td 
                    v-for="month in months" 
                    :key="'total-transport-' + month"
                    class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                  >
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                  <!-- Transport Total for total -->
                  <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                    <span class="font-mono text-xs text-yellow-900">0.00</span>
                  </td>
                </tr>
              </template>
            </template>
            
            <!-- 2 Empty Rows -->
            <tr class="h-4 bg-gradient-to-r from-yellow-100 to-yellow-200"></tr>
            <tr class="h-4 bg-gradient-to-r from-yellow-100 to-yellow-200"></tr>
            
            <!-- Total Hotel Row -->
            <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                <div class="flex items-center gap-2">
                  <Building2 class="w-5 h-5 text-yellow-700" />
                  Total Hotel
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-yellow-300">
                <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateHotelTotalCountLocal() }}</span>
              </td>
              <!-- Medical Monthly cells for hotel total -->
              <td 
                v-for="month in months" 
                :key="'hotel-medical-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Medical Total for hotel total -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Employee Meal Monthly cells for hotel total -->
              <td 
                v-for="month in months" 
                :key="'hotel-meal-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Employee Meal Total for hotel total -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Transport Monthly cells for hotel total -->
              <td 
                v-for="month in months" 
                :key="'hotel-transport-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Transport Total for hotel total -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
            </tr>
            
            <!-- Employee/Room Ratio Row -->
            <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                <div class="flex items-center gap-2">
                  <Users class="w-5 h-5 text-yellow-700" />
                  Employee/Room Ratio
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-yellow-300">
                <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
              </td>
              <!-- Medical Monthly cells for ratio -->
              <td 
                v-for="month in months" 
                :key="'ratio-medical-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Medical Total for ratio -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Employee Meal Monthly cells for ratio -->
              <td 
                v-for="month in months" 
                :key="'ratio-meal-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Employee Meal Total for ratio -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Transport Monthly cells for ratio -->
              <td 
                v-for="month in months" 
                :key="'ratio-transport-' + month"
                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
              >
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
              <!-- Transport Total for ratio -->
              <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                <span class="font-mono text-xs text-yellow-900">0.00</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderOpen, CheckCircle, BarChart3, Building2, Users } from 'lucide-vue-next';
import { getPayrollRowsForLocation } from '@/components/utility/payroll/payroll_data_utils.js';
// Import the standardized calculation functions from payroll utility
import {
  calculateSubTotalManagementCount,
  calculateSubTotalNonManagementCount,
  calculateLocationTotalCount,
  calculateHotelTotal,
  calculateEmployeeRoomRatio
} from '@/components/utility/payroll/payroll_calculations.js';

// Props
const props = defineProps({
  payrollRows: {
    type: Array,
    default: () => []
  },
  payrollData: {
    type: Object,
    default: () => ({})
  },
  visibleYears: {
    type: Array,
    default: () => []
  },
  months: {
    type: Array,
    default: () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
});

// Helper function to format money
function formatMoney(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00';
  }
  const num = parseFloat(value);
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Helper functions to get unique categories and locations
function getUniqueCategories() {
  const categories = new Set();
  props.payrollRows.forEach(row => {
    if (row.category) {
      categories.add(row.category);
    }
  });
  return Array.from(categories).sort();
}

function getUniqueLocationsForCategory(category) {
  const locations = new Set();
  props.payrollRows.forEach(row => {
    if (row.category === category && row.departmentLocation) {
      locations.add(row.departmentLocation);
    }
  });
  return Array.from(locations).sort();
}

// Local wrapper functions for calculations - using the same functions as Payroll_Related.vue
function calculateSubTotalManagementCountLocal(category, location) {
  return calculateSubTotalManagementCount(props.payrollRows, category, location);
}

function calculateSubTotalNonManagementCountLocal(category, location) {
  return calculateSubTotalNonManagementCount(props.payrollRows, category, location);
}

function calculateLocationTotalCountLocal(category, location) {
  return calculateLocationTotalCount(props.payrollRows, category, location);
}

function calculateHotelTotalCountLocal() {
  // Defensive check for payrollRows
  if (!props.payrollRows || !Array.isArray(props.payrollRows)) {
    return 0;
  }
  
  return calculateHotelTotal(props.payrollRows);
}

function calculateEmployeeRoomRatioLocal() {
  // Defensive check for payrollRows
  if (!props.payrollRows || !Array.isArray(props.payrollRows)) {
    return 0;
  }
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return calculateEmployeeRoomRatio(props.payrollRows, totalRooms);
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 