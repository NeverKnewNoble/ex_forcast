<template>
  <div class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 text-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
        <AlertCircle class="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
        <p class="text-red-700 mb-4">{{ message }}</p>
        <button 
          @click="$emit('retry')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <RefreshCw class="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertCircle, RefreshCw } from 'lucide-vue-next';

defineProps({
  message: { type: String, default: 'An error occurred while loading data.' }
});

defineEmits(['retry']);
</script>

<style scoped>
/* Add any component-specific styles here */
</style>


