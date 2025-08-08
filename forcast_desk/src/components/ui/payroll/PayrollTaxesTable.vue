<template>
  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
    
    <div v-if="props.payrollRows.length > 0" class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-green-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Position
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-green-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Designation
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-green-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Salary
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-green-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Count
                </div>
              </th>
              <!-- NSSF Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">NSSF</span>
                </div>
              </th>
            </tr>
            <tr class="bg-green-500/90 text-xs">
              <!-- Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'nssf-' + month"
                class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Total Sub-column -->
              <th class="px-2 py-1 text-center border border-green-300 min-w-[100px] font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Group by categories -->
            <template v-for="category in getUniqueCategories()" :key="category">
              <tr class="bg-green-100 border-b-2 border-green-300">
                <td 
                  :colspan="4 + 13" 
                  class="px-3 py-2 font-bold text-green-800 text-left"
                >
                  {{ category }}
                </td>
              </tr>
              <!-- Group by Department Location within each category -->
              <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                <!-- Department Location Subdivider -->
                <tr class="bg-green-50 border-b border-green-200">
                  <td 
                    :colspan="4 + 13" 
                    class="px-3 py-1.5 font-semibold text-green-700 text-left text-sm"
                  >
                    {{ location }}
                  </td>
                </tr>
                <!-- Payroll rows for this location -->
                <template v-for="row in getPayrollRowsForLocation(props.payrollRows, category, location)" :key="row.id">
            <tr class="border-b border-gray-200 hover:bg-green-50 transition-all duration-200">
                    <!-- Position -->
              <td class="px-3 py-2 font-medium border-r border-green-200 text-gray-700">
                      {{ row.position }}
              </td>
                    <!-- Designation -->
              <td class="px-3 py-2 font-medium border-r border-green-200 text-gray-700">
                      {{ row.designation }}
                    </td>
                    <!-- Salary -->
                    <td class="px-3 py-2 text-right border-r border-green-200 font-mono text-sm">
                      {{ formatMoney(row.salary) }}
              </td>
                    <!-- Count -->
              <td class="px-3 py-2 text-right border-r border-green-200 font-mono text-sm">
                      {{ row.count }}
                    </td>
                    <!-- NSSF Monthly Values -->
                    <td 
                      v-for="month in months" 
                      :key="'nssf-value-' + month + '-' + row.id"
                      class="px-2 py-1 text-right border border-green-200 hover:bg-green-50 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    >
                      <span class="font-mono text-xs text-green-700">{{ calculateNSSFMonthlyValue(row, month) }}</span>
                    </td>
                    <!-- NSSF Total -->
                    <td class="px-2 py-1 text-right border border-green-200 font-semibold bg-green-50">
                      <span class="font-mono text-xs text-green-900">{{ calculateNSSFTotalValue(row) }}</span>
                    </td>
                  </tr>
                </template>
                
                <!-- Sub-Total Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-green-300 text-green-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-green-700" />
                      Sub-Total Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-green-300">
                    <span class="font-mono text-sm font-semibold text-green-900">{{ calculateSubTotalManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-mgmt-nssf-' + month"
                    class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-green-900">{{ calculateSubTotalManagementNSSFMonthly(category, location, month) }}</span>
                  </td>
                  <!-- NSSF Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold">
                    <span class="font-mono text-xs text-green-900">{{ calculateSubTotalManagementNSSFTotal(category, location) }}</span>
                  </td>
                </tr>
                
                <!-- Sub-Total Non-Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-green-300 text-green-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-green-700" />
                      Sub-Total Non-Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-green-300">
                    <span class="font-mono text-sm font-semibold text-green-900">{{ calculateSubTotalNonManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for subtotal -->
                  <td 
                    v-for="month in months" 
                    :key="'subtotal-nonmgmt-nssf-' + month"
                    class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                  >
                    <span class="font-mono text-xs text-green-900">{{ calculateSubTotalNonManagementNSSFMonthly(category, location, month) }}</span>
                  </td>
                  <!-- NSSF Total for subtotal -->
                  <td class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold">
                    <span class="font-mono text-xs text-green-900">{{ calculateSubTotalNonManagementNSSFTotal(category, location) }}</span>
                  </td>
                </tr>
                
                <!-- Total Row -->
                <tr class="border-b-2 border-green-400 bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-3 font-bold border-r border-green-300 text-green-900">
                    <div class="flex items-center gap-2">
                      <BarChart3 class="w-5 h-5 text-green-700" />
                      Total
                    </div>
                  </td>
                  <td class="px-3 py-3 text-right border-r border-green-300">
                    <span class="font-mono text-sm font-bold text-green-900">{{ calculateLocationTotalCountLocal(category, location) }}</span>
                  </td>
                  <!-- Monthly cells for total -->
                  <td 
                    v-for="month in months" 
                    :key="'total-nssf-' + month"
                    class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                  >
                    <span class="font-mono text-xs text-green-900">{{ calculateLocationTotalNSSFMonthly(category, location, month) }}</span>
                  </td>
                  <!-- NSSF Total for total -->
                  <td class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold">
                    <span class="font-mono text-xs text-green-900">{{ calculateLocationTotalNSSFTotal(category, location) }}</span>
                  </td>
                </tr>
              </template>
            </template>
            
            <!-- 2 Empty Rows -->
            <tr class="h-4 bg-gradient-to-r from-green-100 to-green-200"></tr>
            <tr class="h-4 bg-gradient-to-r from-green-100 to-green-200"></tr>
            
            <!-- Total Hotel Row -->
            <tr class="border-b-2 border-green-400 bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-green-300 text-green-900">
                <div class="flex items-center gap-2">
                  <Building2 class="w-5 h-5 text-green-700" />
                  Total Hotel
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-green-300">
                <span class="font-mono text-sm font-bold text-green-900">{{ calculateHotelTotalCountLocal() }}</span>
              </td>
              <!-- Monthly cells for hotel total -->
              <td 
                v-for="month in months" 
                :key="'hotel-nssf-' + month"
                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
              >
                <span class="font-mono text-xs text-green-900">{{ calculateHotelTotalNSSFMonthly(month) }}</span>
              </td>
              <!-- NSSF Total for hotel total -->
              <td class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold">
                <span class="font-mono text-xs text-green-900">{{ calculateHotelTotalNSSFTotal() }}</span>
              </td>
            </tr>
            
            <!-- Employee/Room Ratio Row -->
            <tr class="border-b-2 border-green-400 bg-gradient-to-r from-green-100 to-green-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-green-300 text-green-900">
                <div class="flex items-center gap-2">
                  <Users class="w-5 h-5 text-green-700" />
                  Employee/Room Ratio
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-green-300">
                <span class="font-mono text-sm font-bold text-green-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
              </td>
              <!-- Monthly cells for ratio -->
              <td 
                v-for="month in months" 
                :key="'ratio-nssf-' + month"
                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
              >
                <span class="font-mono text-xs text-green-900">{{ calculateEmployeeRoomRatioNSSFMonthly(month) }}</span>
              </td>
              <!-- NSSF Total for ratio -->
              <td class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold">
                <span class="font-mono text-xs text-green-900">{{ calculateEmployeeRoomRatioNSSFTotal() }}</span>
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
import { ref, computed, watch } from 'vue';
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
  },
  payrollRelatedData: {
    type: Object,
    default: () => ({})
  },
  addPayrollRelatedChange: {
    type: Function,
    default: () => {}
  },
  getPayrollRelatedValue: {
    type: Function,
    default: () => {}
  },
  setPayrollRelatedValue: {
    type: Function,
    default: () => {}
  }
});

// Debug reactive data
// const debugData = computed(() => {
//   console.log('PayrollTaxesTable Debug Data:', {
//     payrollRows: props.payrollRows?.length,
//     payrollData: Object.keys(props.payrollData || {}),
//     visibleYears: props.visibleYears,
//     payrollRelatedData: Object.keys(props.payrollRelatedData || {}),
//     samplePayrollRow: props.payrollRows?.[0],
//     samplePayrollData: props.payrollData?.[props.visibleYears?.[0]],
//     sampleRelatedData: props.payrollRelatedData?.[props.visibleYears?.[0]],
//     globalPayrollRelatedData: window.__payrollRelatedData,
//     globalCurrentVisibleYears: window.__currentVisibleYears
//   });
//   return true;
// });

// Watch for data changes
watch(() => [props.payrollRows, props.payrollData, props.payrollRelatedData, props.visibleYears], () => {
  // console.log('PayrollTaxesTable Data Changed:', {
  //   payrollRowsLength: props.payrollRows?.length,
  //   payrollDataKeys: Object.keys(props.payrollData || {}),
  //   relatedDataKeys: Object.keys(props.payrollRelatedData || {}),
  //   visibleYears: props.visibleYears
  // });
}, { deep: true, immediate: true });

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
  // console.log('PayrollTaxesTable - payrollRows:', props.payrollRows);
  const categories = new Set();
  props.payrollRows.forEach(row => {
    if (row.category) {
      categories.add(row.category);
    }
  });
  const result = Array.from(categories).sort();
  // console.log('PayrollTaxesTable - categories:', result);
  return result;
}

function getUniqueLocationsForCategory(category) {
  const locations = new Set();
  props.payrollRows.forEach(row => {
    if (row.category === category && row.departmentLocation) {
      locations.add(row.departmentLocation);
    }
  });
  const result = Array.from(locations).sort();
  // console.log('PayrollTaxesTable - locations for category', category, ':', result);
  return result;
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

// NSSF Calculation Functions - Made more reactive
function getTaxTotalForRow(row) {
  // Get the tax total from the Payroll_Related.vue data
  // This should match the calculation used in Payroll_Related.vue
  if (!props.visibleYears || props.visibleYears.length === 0) {
    // console.log('getTaxTotalForRow: Missing visibleYears', { visibleYears: props.visibleYears });
    return 0;
  }
  
  const year = props.visibleYears[0];
  const taxPercentage = getTaxPercentageForRow(row);
  const salary = row.salary || 0;
  const count = row.count || 0;
  
  // Calculate tax total: (salary * count * tax percentage) / 100
  const taxTotal = (salary * count * taxPercentage) / 100;
  // console.log('getTaxTotalForRow:', { rowId: row.id, salary, count, taxPercentage, taxTotal });
  return taxTotal;
}

function getTaxPercentageForRow(row) {
  // Get tax percentage from global payroll related data
  if (!props.visibleYears || props.visibleYears.length === 0) {
    return 0;
  }
  
  const year = props.visibleYears[0];
  const rowId = row.id;
  
  // console.log('getTaxPercentageForRow:', { rowId, year });
  
  // Try to get from global payroll related data
  if (window.__payrollRelatedData && window.__payrollRelatedData[year]) {
    const yearData = window.__payrollRelatedData[year];
    const taxPercentage = yearData.payroll_taxes?.[rowId]?.tax_percentage;
    
    // console.log('Found tax percentage from global data:', { rowId, taxPercentage, yearData });
    
    if (taxPercentage !== undefined && taxPercentage !== null) {
      return parseFloat(taxPercentage);
    }
  }
  
  // Try to get from props.payrollRelatedData
  if (props.payrollRelatedData && props.payrollRelatedData[year]) {
    const yearData = props.payrollRelatedData[year];
    const taxPercentage = yearData.payroll_taxes?.[rowId]?.tax_percentage;
    
    // console.log('Found tax percentage from props:', { rowId, taxPercentage });
    
    if (taxPercentage !== undefined && taxPercentage !== null) {
      return parseFloat(taxPercentage);
    }
  }
  
  // Default tax percentage if not found
  // console.log('No tax percentage found for row:', rowId);
  return 0;
}

function getMonthlyCountForRow(row, month) {
  // Get monthly count from payroll data
  if (!props.visibleYears || props.visibleYears.length === 0) {
    return 0;
  }
  
  const year = props.visibleYears[0];
  const rowId = row.id;
  
  // console.log('getMonthlyCountForRow:', { rowId, year, month });
  
  // Try to get monthly count from payroll data
  if (props.payrollData && props.payrollData[year] && props.payrollData[year][rowId]) {
    const rowData = props.payrollData[year][rowId];
    
    // Check if count data exists
    if (rowData.count && rowData.count[month] !== undefined) {
      const monthlyCount = rowData.count[month];
      // console.log('Found monthly count from payrollData:', { rowId, month, monthlyCount });
      return parseFloat(monthlyCount);
    }
  }
  
  // If no monthly count found, use the main count
  // console.log('No monthly count found, using main count:', { rowId, month, mainCount: row.count });
  return row.count || 0;
}

function calculateNSSFMonthlyValue(row, month) {
  // NSSF Monthly Value = Tax Total × Monthly Count for that month
  const taxTotal = getTaxTotalForRow(row);
  const monthlyCount = getMonthlyCountForRow(row, month);
  
  const nssfValue = taxTotal * monthlyCount;
  // console.log('calculateNSSFMonthlyValue:', { rowId: row.id, month, taxTotal, monthlyCount, nssfValue });
  return formatMoney(nssfValue);
}

function calculateNSSFTotalValue(row) {
  // Calculate total NSSF for the year by summing all monthly values
  let totalNSSF = 0;
  
  props.months.forEach(month => {
    const taxTotal = getTaxTotalForRow(row);
    const monthlyCount = getMonthlyCountForRow(row, month);
    totalNSSF += taxTotal * monthlyCount;
  });
  
  // console.log('calculateNSSFTotalValue:', { rowId: row.id, totalNSSF });
  return formatMoney(totalNSSF);
}

// NSSF Calculation Functions for Summary Rows
function calculateSubTotalManagementNSSFMonthly(category, location, month) {
  const managementRows = getPayrollRowsForLocation(props.payrollRows, category, location).filter(row => 
    row.position === 'Manager'
  );
  
  let totalNSSF = 0;
  managementRows.forEach(row => {
    const taxTotal = getTaxTotalForRow(row);
    const monthlyCount = getMonthlyCountForRow(row, month);
    totalNSSF += taxTotal * monthlyCount;
  });
  
  return formatMoney(totalNSSF);
}

function calculateSubTotalManagementNSSFTotal(category, location) {
  let totalNSSF = 0;
  
  props.months.forEach(month => {
    totalNSSF += parseFloat(calculateSubTotalManagementNSSFMonthly(category, location, month).replace(/[^0-9.-]/g, '')) || 0;
  });
  
  return formatMoney(totalNSSF);
}

function calculateSubTotalNonManagementNSSFMonthly(category, location, month) {
  const nonManagementRows = getPayrollRowsForLocation(props.payrollRows, category, location).filter(row => 
    row.position !== 'Manager'
  );
  
  let totalNSSF = 0;
  nonManagementRows.forEach(row => {
    const taxTotal = getTaxTotalForRow(row);
    const monthlyCount = getMonthlyCountForRow(row, month);
    totalNSSF += taxTotal * monthlyCount;
  });
  
  return formatMoney(totalNSSF);
}

function calculateSubTotalNonManagementNSSFTotal(category, location) {
  let totalNSSF = 0;
  
  props.months.forEach(month => {
    totalNSSF += parseFloat(calculateSubTotalNonManagementNSSFMonthly(category, location, month).replace(/[^0-9.-]/g, '')) || 0;
  });
  
  return formatMoney(totalNSSF);
}

function calculateLocationTotalNSSFMonthly(category, location, month) {
  const locationRows = getPayrollRowsForLocation(props.payrollRows, category, location);
  
  let totalNSSF = 0;
  locationRows.forEach(row => {
    const taxTotal = getTaxTotalForRow(row);
    const monthlyCount = getMonthlyCountForRow(row, month);
    totalNSSF += taxTotal * monthlyCount;
  });
  
  return formatMoney(totalNSSF);
}

function calculateLocationTotalNSSFTotal(category, location) {
  let totalNSSF = 0;
  
  props.months.forEach(month => {
    totalNSSF += parseFloat(calculateLocationTotalNSSFMonthly(category, location, month).replace(/[^0-9.-]/g, '')) || 0;
  });
  
  return formatMoney(totalNSSF);
}

function calculateHotelTotalNSSFMonthly(month) {
  let totalNSSF = 0;
  
  props.payrollRows.forEach(row => {
    const taxTotal = getTaxTotalForRow(row);
    const monthlyCount = getMonthlyCountForRow(row, month);
    totalNSSF += taxTotal * monthlyCount;
  });
  
  return formatMoney(totalNSSF);
}

function calculateHotelTotalNSSFTotal() {
  let totalNSSF = 0;
  
  props.months.forEach(month => {
    totalNSSF += parseFloat(calculateHotelTotalNSSFMonthly(month).replace(/[^0-9.-]/g, '')) || 0;
  });
  
  return formatMoney(totalNSSF);
}

function calculateEmployeeRoomRatioNSSFMonthly(month) {
  const hotelTotalNSSF = parseFloat(calculateHotelTotalNSSFMonthly(month).replace(/[^0-9.-]/g, '')) || 0;
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  
  if (totalRooms > 0) {
    return formatMoney(hotelTotalNSSF / totalRooms);
  }
  
  return formatMoney(0);
}

function calculateEmployeeRoomRatioNSSFTotal() {
  const hotelTotalNSSF = parseFloat(calculateHotelTotalNSSFTotal().replace(/[^0-9.-]/g, '')) || 0;
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  
  if (totalRooms > 0) {
    return formatMoney(hotelTotalNSSF / totalRooms);
  }
  
  return formatMoney(0);
}

// Force reactivity by accessing debugData
// debugData.value;
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 