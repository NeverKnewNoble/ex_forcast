<template>
  <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6 text-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
        <FolderOpen class="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-amber-800 mb-2">No Project Selected</h3>
        <p class="text-amber-700 mb-4">Please select a project on the dashboard to view room revenue data.</p>
        <router-link 
          to="/dashboard" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <ArrowRight class="w-4 h-4" />
          Go to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderOpen, ArrowRight } from 'lucide-vue-next';
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 