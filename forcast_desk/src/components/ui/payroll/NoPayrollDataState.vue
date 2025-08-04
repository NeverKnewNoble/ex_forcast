<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
    <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
      <CircleAlert class="w-8 h-8 text-violet-500" />
    </div>
    <h3 class="text-lg text-violet-700 font-semibold mb-2">No Payroll Data</h3>
    <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
      No payroll data found for the selected project and year range. Add some payroll data to get started.
    </p>
    <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
      <Plus class="w-3 h-3" />
      <span>Use the "Add Payroll" button to create your first payroll entry</span>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert, Plus } from 'lucide-vue-next';
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 