<template>
  <div class="flex flex-col items-center justify-center h-96">
    <div class="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-6">
      <Receipt class="w-12 h-12 text-blue-600" />
    </div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">No Expense Data Found</h3>
    <p class="text-gray-600 mb-6 text-center max-w-md">
      The project <span class="font-semibold text-violet-600">{{ project }}</span> doesn't have any expense data yet.
    </p>
    <button 
      @click="$emit('add-expense')"
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      <Plus class="w-4 h-4" />
      Add First Expense
    </button>
  </div>
</template>

<script setup>
import { Receipt, Plus } from 'lucide-vue-next';

// Props
defineProps({
  project: {
    type: String,
    default: ''
  }
});

// Emits
defineEmits(['add-expense']);
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 