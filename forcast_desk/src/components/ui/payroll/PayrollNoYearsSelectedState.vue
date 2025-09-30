<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
    <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
      <CircleAlert class="w-8 h-8 text-violet-500" />
    </div>
    <h3 class="text-lg text-violet-700 font-semibold mb-2">
      {{ fromYear && !toYear ? 'Select "To Year"' : !fromYear && toYear ? 'Select "From Year"' : 'No Years Selected' }}
    </h3>
    <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
      {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the payroll table.' : 
         !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the payroll table.' :
           'Please select both "From Year" and "To Year" in the left panel to display the payroll table.' }}
    </p>
    <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
      <ArrowLeft class="w-3 h-3" />
      <span>Use the filters on the left to get started</span>
    </div>
    <div class="mt-6">
      <router-link
        to="/expense_estimate"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 shadow"
      >
        <Calendar class="w-4 h-4" />
        <span>Set Years in Expense</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert, ArrowLeft, Calendar } from 'lucide-vue-next';

defineProps({
  fromYear: { type: String, default: '' },
  toYear: { type: String, default: '' },
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>


