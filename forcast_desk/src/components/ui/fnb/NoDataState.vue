<template>
  <div class="flex flex-col items-center justify-center h-96">
    <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 text-center max-w-md">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Table class="w-8 h-8 text-blue-600" />
      </div>
      <h3 class="text-xl font-semibold text-blue-800 mb-2">No F&B Revenue Data</h3>
      <p class="text-blue-700 mb-4">
        The project <span class="font-semibold text-blue-600">{{ project }}</span> doesn't have any F&B revenue data yet.
      </p>
      <p class="text-blue-600 text-sm">
        Start by creating restaurants and adding revenue data.
      </p>
    </div>
  </div>
</template>

<script setup>
import { Table } from 'lucide-vue-next';

// Props
defineProps({
  project: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 