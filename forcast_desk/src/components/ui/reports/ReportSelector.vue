<template>
  <div class="bg-white/90 rounded-xl p-6 border border-violet-100 shadow-sm">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText class="w-8 h-8 text-white" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">Select a Report</h3>
      <p class="text-gray-600">Choose the financial report you'd like to view and analyze</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Room Profit & Loss -->
      <div 
        @click="selectReport('room-pnl')"
        class="group cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-blue-800">Room Profit & Loss</h4>
            <p class="text-xs text-blue-600">Room department financials</p>
          </div>
        </div>
        <p class="text-sm text-blue-700">Analyze room revenue, expenses, and profitability by month and year.</p>
      </div>

      <!-- Food & Beverage Profit & Loss -->
      <div 
        @click="selectReport('fnb-pnl')"
        class="group cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 hover:border-green-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Utensils class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-green-800">Food & Beverage P&L</h4>
            <p class="text-xs text-green-600">Restaurant & bar financials</p>
          </div>
        </div>
        <p class="text-sm text-green-700">Review F&B revenue, costs, and profit margins across all outlets.</p>
      </div>

      <!-- Other Operating Departments Profit & Loss -->
      <div 
        @click="selectReport('ood-pnl')"
        class="group cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-purple-800">Other Operating Departments</h4>
            <p class="text-xs text-purple-600">Spa, gym, pool, etc.</p>
          </div>
        </div>
        <p class="text-sm text-purple-700">Examine performance of spa, health club, and recreational facilities.</p>
      </div>

      <!-- Profit & Loss Statement -->
      <div 
        @click="selectReport('pl-statement')"
        class="group cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 hover:border-orange-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-orange-800">Profit & Loss Statement</h4>
            <p class="text-xs text-orange-600">Consolidated hotel P&L</p>
          </div>
        </div>
        <p class="text-sm text-orange-700">Complete hotel financial performance overview with all departments.</p>
      </div>

      <!-- Balance Sheet -->
      <div 
        @click="selectReport('balance-sheet')"
        class="group cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-4 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Scale class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-yellow-800">Balance Sheet</h4>
            <p class="text-xs text-yellow-600">Assets, liabilities & equity</p>
          </div>
        </div>
        <p class="text-sm text-yellow-700">View hotel's financial position, assets, liabilities, and equity.</p>
      </div>

      <!-- Cashflow -->
      <div 
        @click="selectReport('cashflow')"
        class="group cursor-pointer bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-xl p-4 hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-teal-800">Cashflow</h4>
            <p class="text-xs text-teal-600">Cash movement analysis</p>
          </div>
        </div>
        <p class="text-sm text-teal-700">Track cash inflows and outflows for operational and investment activities.</p>
      </div>

      <!-- Capex Schedule -->
      <div 
        @click="selectReport('capex-schedule')"
        class="group cursor-pointer bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 hover:border-red-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wrench class="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 class="font-semibold text-rose-800">Capex Schedule</h4>
            <p class="text-xs text-rose-600">Capital expenditure planning</p>
          </div>
        </div>
        <p class="text-sm text-rose-700">Plan and track capital expenditures for property improvements and equipment.</p>
      </div>
    </div>


  </div>
</template>

<script setup>
import { 
  FileText, 
  Building, 
  Utensils, 
  Heart, 
  TrendingUp, 
  Scale, 
  DollarSign, 
  Wrench 
} from 'lucide-vue-next';

const emit = defineEmits(['report-selected']);

const selectReport = (reportType) => {
  emit('report-selected', reportType);
};
</script>

<style scoped>
/* Custom hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Enhanced shadow on hover */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
