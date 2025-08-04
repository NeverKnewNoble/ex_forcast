<template>
  <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
    <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
      <CircleAlert class="w-8 h-8 text-violet-500" />
    </div>
    <h3 class="text-lg text-violet-700 font-semibold mb-2">
      {{ fromYear && !toYear ? 'Select "To Year"' : !fromYear && toYear ? 'Select "From Year"' : 'No Years Selected' }}
    </h3>
    <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
      {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the room revenue tables.' : 
         !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the room revenue tables.' :
           'Please select both "From Year" and "To Year" in the left panel to display the room revenue tables.' }}
    </p>
    <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
      <ArrowLeft class="w-3 h-3" />
      <span>Use the filters on the left to get started</span>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert, ArrowLeft } from 'lucide-vue-next';

// Props
defineProps({
  fromYear: {
    type: String,
    default: ''
  },
  toYear: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 