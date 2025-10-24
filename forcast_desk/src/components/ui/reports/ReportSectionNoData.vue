<template>
  <div class="flex items-start gap-4 py-6 px-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-[#0f0f12] dark:to-[#1a1a1f] rounded-xl border border-dashed border-gray-300 dark:border-gray-700 shadow-sm">
    <!-- Icon Container -->
    <div class="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm">
      <component 
        :is="icon" 
        class="w-7 h-7 text-gray-400 dark:text-gray-500" 
      />
    </div>
    
    <!-- Content Container -->
    <div class="flex-1 pt-1">
      <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
        {{ computedTitle }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
        {{ message || `No ${sectionName} data available for the selected period.` }}
      </p>
      <p v-if="showHint" class="text-xs text-gray-500 dark:text-gray-500 italic flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Please enter data in the {{ sectionName }} section to see it reflected here.</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Database } from 'lucide-vue-next'

// Props
const props = defineProps({
  sectionName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: () => Database
  },
  showHint: {
    type: Boolean,
    default: true
  }
})

// Computed title with fallback
const computedTitle = computed(() => {
  return props.title || `No ${props.sectionName} Data`
})
</script>

