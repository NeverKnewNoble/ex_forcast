<template>
  <div class="flex flex-col items-center justify-center h-96">
    <div class="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
      <AlertTriangle class="w-12 h-12 text-red-600" />
    </div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h3>
    <p class="text-gray-600 mb-6 text-center max-w-md">
      {{ message }}
    </p>
    <button 
      @click="$emit('retry')"
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      <RefreshCw class="w-4 h-4" />
      Try Again
    </button>
  </div>
</template>

<script setup>
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';

// Props
defineProps({
  message: {
    type: String,
    default: 'An error occurred while loading data.'
  }
});

// Emits
defineEmits(['retry']);
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 