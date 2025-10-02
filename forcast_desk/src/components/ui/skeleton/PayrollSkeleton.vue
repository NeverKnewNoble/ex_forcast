<template>
  <div class="flex">
    <!-- Left Sidebar Skeleton -->
    <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
      <!-- Collapse/Expand Button Skeleton -->
      <div class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 rounded">
        <div class="w-5 h-5 bg-violet-200 rounded animate-pulse"></div>
        <div v-if="!sidebarCollapsed" class="w-16 h-4 bg-violet-200 rounded animate-pulse"></div>
      </div>
      
      <transition name="fade">
        <div v-show="!sidebarCollapsed" class="space-y-6">
          <!-- Header Section Skeleton -->
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-violet-200 rounded-xl animate-pulse"></div>
              <div class="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div class="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <!-- Save Status Section Skeleton -->
          <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-green-200 rounded animate-pulse"></div>
                <div class="w-20 h-6 bg-green-200 rounded animate-pulse"></div>
              </div>
              <div class="w-20 h-8 bg-violet-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <!-- Action Buttons Section Skeleton -->
          <div class="mb-8">
            <div class="w-32 h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div class="w-full h-12 bg-violet-200 rounded-xl animate-pulse mb-3"></div>
            <div class="flex gap-2">
              <div class="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          <!-- Filters Section Skeleton -->
          <div class="flex-1">
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div class="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <div class="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div class="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div class="w-16 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div class="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <div class="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div class="flex-1 h-10 bg-violet-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Right Side - Table Area Skeleton -->
    <div class="flex-1 p-4">
      <!-- Table Header Skeleton -->
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-6 h-6 bg-violet-200 rounded-lg animate-pulse"></div>
          <div class="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="w-full">
              <!-- Table Header Skeleton -->
              <thead class="bg-gradient-to-r from-violet-600 to-violet-700">
                <tr>
                  <th class="px-3 py-2 border-r border-violet-400">
                    <div class="w-20 h-4 bg-white/20 rounded animate-pulse"></div>
                  </th>
                  <th class="px-3 py-2 border-r border-violet-400">
                    <div class="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
                  </th>
                  <th class="px-3 py-2 border-r border-violet-400">
                    <div class="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                  </th>
                  <th class="px-3 py-2 border-r border-violet-400">
                    <div class="w-16 h-4 bg-white/20 rounded animate-pulse"></div>
                  </th>
                  <!-- Year columns skeleton -->
                  <th v-for="n in 3" :key="n" class="px-2 py-2 border-r border-violet-400">
                    <div class="w-16 h-4 bg-white/20 rounded animate-pulse mx-auto"></div>
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-700 bg-white">
                <!-- Table Rows Skeleton -->
                <tr v-for="n in 8" :key="n" class="border-b border-gray-200">
                  <td class="px-3 py-2 border-r border-violet-200">
                    <div class="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td class="px-3 py-2 border-r border-violet-200">
                    <div class="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                  <td class="px-3 py-2 border-r border-violet-200">
                    <div class="w-20 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </td>
                  <td class="px-3 py-2 border-r border-violet-200">
                    <div class="w-16 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </td>
                  <!-- Year data cells skeleton -->
                  <td v-for="n in 3" :key="n" class="px-2 py-2 border-r border-violet-200">
                    <div class="w-16 h-4 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </td>
                </tr>
                
                <!-- Sub-total rows skeleton -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-violet-100 to-purple-100">
                  <td :colspan="7" class="px-3 py-2.5">
                    <div class="w-40 h-4 bg-violet-200 rounded animate-pulse"></div>
                  </td>
                </tr>
                
                <!-- Total row skeleton -->
                <tr class="border-b-2 border-violet-400 bg-gradient-to-r from-violet-100 to-purple-100">
                  <td :colspan="7" class="px-3 py-3">
                    <div class="w-24 h-5 bg-violet-200 rounded animate-pulse"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
