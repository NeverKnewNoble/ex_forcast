<template>
  <div class="flex flex-col items-center justify-center h-96">
    <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-8 text-center max-w-md">
      <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CircleAlert class="w-8 h-8 text-amber-600" />
      </div>
      <h3 class="text-xl font-semibold text-amber-800 mb-2">No Project Selected</h3>
      <p class="text-amber-700 mb-4">
        Please go to the Dashboard and select a project to view and manage F&B revenue data.
      </p>
      <router-link to="/dashboard" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200">
        <ArrowLeft class="w-4 h-4" />
        Go to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert, ArrowLeft } from 'lucide-vue-next';
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 