<template>
  <div class="flex flex-col items-center justify-center h-96">
    <div class="w-24 h-24 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mb-6">
      <FolderOpen class="w-12 h-12 text-violet-600" />
    </div>
    <h3 class="text-xl font-semibold text-gray-800 mb-2">No Project Selected</h3>
    <p class="text-gray-600 mb-6 text-center max-w-md">
      Please go to the Dashboard and select a project to view and manage expense data.
    </p>
    <router-link 
      to="/dashboard" 
      class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
    >
      <ArrowLeft class="w-4 h-4" />
      Go to Dashboard
    </router-link>
  </div>
</template>

<script setup>
import { FolderOpen, ArrowLeft } from 'lucide-vue-next';
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 