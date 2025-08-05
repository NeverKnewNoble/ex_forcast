<template>
  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
    <!-- Tab Navigation -->
    <div class="bg-gradient-to-r from-violet-50 to-violet-100 border-b border-violet-200">
      <div class="flex space-x-1 p-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            activeTab === tab.id
              ? 'bg-white text-violet-700 shadow-sm border border-violet-200'
              : 'text-violet-600 hover:text-violet-700 hover:bg-violet-50'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="p-4">
      <!-- Payroll Taxes Tab -->
      <div v-if="activeTab === 'payroll-taxes'" class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield class="w-4 h-4 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Payroll Taxes</h3>
        </div>
            <PayrollTaxesTable 
            :payroll-rows="payrollRows" 
            :payroll-data="payrollData"
            :visible-years="visibleYears"
            :months="months"
            :payroll-related-data="payrollRelatedData"
            :add-payroll-related-change="addPayrollRelatedChange"
            :get-payroll-related-value="getPayrollRelatedValue"
            :set-payroll-related-value="setPayrollRelatedValue"
          />
      </div>

      <!-- Supplementary Pay Tab -->
      <div v-if="activeTab === 'supplementary-pay'" class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Gift class="w-4 h-4 text-yellow-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Supplementary Pay</h3>
        </div>
            <SupplementaryPayTable 
            :payroll-rows="payrollRows" 
            :payroll-data="payrollData"
            :visible-years="visibleYears"
            :months="months"
            :payroll-related-data="payrollRelatedData"
            :add-payroll-related-change="addPayrollRelatedChange"
            :get-payroll-related-value="getPayrollRelatedValue"
            :set-payroll-related-value="setPayrollRelatedValue"
          />
      </div>

      <!-- Total Tab -->
      <div v-if="activeTab === 'total'" class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 class="w-4 h-4 text-blue-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Total</h3>
        </div>
            <TotalTable 
            :payroll-rows="payrollRows" 
            :payroll-data="payrollData"
            :visible-years="visibleYears"
            :months="months"
            :payroll-related-data="payrollRelatedData"
            :add-payroll-related-change="addPayrollRelatedChange"
            :get-payroll-related-value="getPayrollRelatedValue"
            :set-payroll-related-value="setPayrollRelatedValue"
          />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Shield, Gift, BarChart3 } from 'lucide-vue-next';
import PayrollTaxesTable from './PayrollTaxesTable.vue';
import SupplementaryPayTable from './SupplementaryPayTable.vue';
import TotalTable from './TotalTable.vue';

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

// Tab state
const activeTab = ref('payroll-taxes');

// Tab definitions
const tabs = [
  {
    id: 'payroll-taxes',
    name: 'Payroll Taxes',
    icon: Shield
  },
  {
    id: 'supplementary-pay',
    name: 'Supplementary Pay',
    icon: Gift
  },
  {
    id: 'total',
    name: 'Total',
    icon: BarChart3
  }
];
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 