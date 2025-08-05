<template>
  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">

    
    <div v-if="props.payrollRows.length > 0" class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-blue-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Position
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-blue-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Designation
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-blue-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Salary
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-blue-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Count
                </div>
              </th>
              <!-- Total Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Total</span>
                </div>
              </th>
            </tr>
            <tr class="bg-blue-500/90 text-xs">
              <!-- Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'total-' + month"
                class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Total Sub-column -->
              <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Group by categories -->
            <template v-for="category in getUniqueCategories()" :key="category">
              <tr class="bg-blue-100 border-b-2 border-blue-300">
                <td 
                  :colspan="4 + 13" 
                  class="px-3 py-2 font-bold text-blue-800 text-left"
                >
                  {{ category }}
                </td>
              </tr>
              <!-- Group by Department Location within each category -->
              <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                <!-- Department Location Subdivider -->
                <tr class="bg-blue-50 border-b border-blue-200">
                  <td 
                    :colspan="4 + 13" 
                    class="px-3 py-1.5 font-semibold text-blue-700 text-left text-sm"
                  >
                    {{ location }}
                  </td>
                </tr>
                <!-- Payroll rows for this location -->
                <template v-for="row in getPayrollRowsForLocation(category, location)" :key="row.id">
            <tr class="border-b border-gray-200 hover:bg-blue-50 transition-all duration-200">
                    <!-- Position -->
                    <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                      {{ row.position }}
                    </td>
                    <!-- Designation -->
              <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                      {{ row.designation }}
                    </td>
                    <!-- Salary -->
                    <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                      {{ formatMoney(row.salary) }}
                    </td>
                    <!-- Count -->
                    <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                      {{ row.count }}
                    </td>
                    <!-- Total Monthly Values -->
                    <td 
                      v-for="month in months" 
                      :key="'total-value-' + month + '-' + row.id"
                      class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      <span class="font-mono text-xs text-blue-700">0.00</span>
                    </td>
                    <!-- Total -->
                    <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                      <span class="font-mono text-xs text-blue-900">0.00</span>
                    </td>
                  </tr>
                </template>
                
                <!-- Sub-Total Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-blue-300 text-blue-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-blue-700" />
                      Sub-Total Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-blue-300">
                    <span class="font-mono text-sm font-semibold text-blue-900">{{ calculateSubTotalManagementCount(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-mgmt-total-' + month"
                    class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                  <!-- Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                </tr>
                
                <!-- Sub-Total Non-Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-blue-300 text-blue-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-blue-700" />
                      Sub-Total Non-Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-blue-300">
                    <span class="font-mono text-sm font-semibold text-blue-900">{{ calculateSubTotalNonManagementCount(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-nonmgmt-total-' + month"
                    class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                  <!-- Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                </tr>
                
                <!-- Total Row -->
                <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                    <div class="flex items-center gap-2">
                      <BarChart3 class="w-5 h-5 text-blue-700" />
                      Total
                    </div>
                  </td>
                  <td class="px-3 py-3 text-right border-r border-blue-300">
                    <span class="font-mono text-sm font-bold text-blue-900">{{ calculateLocationTotalCount(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for total -->
                  <td 
                    v-for="month in months" 
                    :key="'total-total-' + month"
                    class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                  >
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                  <!-- Total for total -->
                  <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                    <span class="font-mono text-xs text-blue-900">0.00</span>
                  </td>
                </tr>
              </template>
            </template>
            
            <!-- 2 Empty Rows -->
            <tr class="h-4 bg-gradient-to-r from-blue-100 to-blue-200"></tr>
            <tr class="h-4 bg-gradient-to-r from-blue-100 to-blue-200"></tr>
            
            <!-- Total Hotel Row -->
            <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                <div class="flex items-center gap-2">
                  <Building2 class="w-5 h-5 text-blue-700" />
                  Total Hotel
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-blue-300">
                <span class="font-mono text-sm font-bold text-blue-900">{{ calculateHotelTotalCount() }}</span>
              </td>
              <!-- Monthly cells for hotel total -->
              <td 
                v-for="month in months" 
                :key="'hotel-total-' + month"
                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
              >
                <span class="font-mono text-xs text-blue-900">0.00</span>
              </td>
              <!-- Total for hotel total -->
              <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                <span class="font-mono text-xs text-blue-900">0.00</span>
              </td>
            </tr>
            
            <!-- Employee/Room Ratio Row -->
            <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                <div class="flex items-center gap-2">
                  <Users class="w-5 h-5 text-blue-700" />
                  Employee/Room Ratio
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-blue-300">
                <span class="font-mono text-sm font-bold text-blue-900">{{ calculateEmployeeRoomRatio() }}</span>
              </td>
              <!-- Monthly cells for ratio -->
              <td 
                v-for="month in months" 
                :key="'ratio-total-' + month"
                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
              >
                <span class="font-mono text-xs text-blue-900">0.00</span>
              </td>
              <!-- Total for ratio -->
              <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                <span class="font-mono text-xs text-blue-900">0.00</span>
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

function getPayrollRowsForLocation(category, location) {
  return props.payrollRows.filter(row => 
    row.category === category && row.departmentLocation === location
  );
}

// Calculation functions
function calculateSubTotalManagementCount(category, location) {
  const managementRows = getPayrollRowsForLocation(category, location).filter(row => 
    row.position_type === 'management' || row.position?.toLowerCase().includes('manager')
  );
  return managementRows.reduce((sum, row) => sum + (row.count || 0), 0);
}

function calculateSubTotalNonManagementCount(category, location) {
  const nonManagementRows = getPayrollRowsForLocation(category, location).filter(row => 
    !(row.position_type === 'management' || row.position?.toLowerCase().includes('manager'))
  );
  return nonManagementRows.reduce((sum, row) => sum + (row.count || 0), 0);
}

function calculateLocationTotalCount(category, location) {
  const rows = getPayrollRowsForLocation(category, location);
  return rows.reduce((sum, row) => sum + (row.count || 0), 0);
}

function calculateHotelTotalCount() {
  return props.payrollRows.reduce((sum, row) => sum + (row.count || 0), 0);
}

function calculateEmployeeRoomRatio() {
  const totalEmployees = calculateHotelTotalCount();
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? (totalEmployees / totalRooms).toFixed(2) : '0.00';
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 