<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
    <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
      <Loader2 class="w-8 h-8 text-violet-500 animate-spin" />
    </div>
    <h3 class="text-lg text-violet-700 font-semibold mb-2">Loading Payroll Data</h3>
    <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
      Please wait while we load your payroll data...
    </p>
    <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
      <RefreshCw class="w-3 h-3 animate-spin" />
      <span>Loading data from server</span>
    </div>
  </div>
</template>

<script setup>
import { Loader2, RefreshCw } from 'lucide-vue-next';
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 