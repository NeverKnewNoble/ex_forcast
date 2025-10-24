<template>
  <div 
    class="absolute top-4 left-4 z-30 w-[660px] max-w-[95vw] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-violet-200/60 shadow-2xl ring-1 ring-violet-300/30 dark:bg-[#151823]/80 dark:border-violet-900/40 dark:ring-violet-900/30"
    @mouseenter="onHoverEnter"
    @mouseleave="onHoverLeave"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-violet-700 text-white">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-sm">
          <component :is="icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold">{{ title }}</h1>
          <p class="text-xs opacity-80">{{ subtitle }}</p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-show="!collapsed" class="px-5 pb-5 bg-white/70 dark:bg-[#151823]/70">
        
        <!-- Data Status Section -->
        <div class="mb-4 pt-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 dark:text-gray-200">
            <Database class="w-4 h-4 text-violet-600" />
            Data Status
          </h3>
          
          <!-- Loading State -->
          <div v-if="dataLoading" class="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-900/30">
            <Loader2 class="w-4 h-4 text-blue-600 animate-spin" />
            <span class="text-sm text-blue-700">Loading report data...</span>
          </div>
          
          <!-- Error State -->
          <div v-else-if="dataError" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-900/30">
            <AlertCircle class="w-4 h-4 text-red-600" />
            <span class="text-sm text-red-700">{{ dataError }}</span>
            <button 
              @click="$emit('load-data')"
              class="ml-auto px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-all dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40"
            >
              Retry
            </button>
          </div>
          
          <!-- Success State -->
          <div v-else-if="dataCompleteness > 0" class="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-900/30">
            <CheckCircle class="w-4 h-4 text-green-600" />
            <span class="text-sm text-green-700">Data loaded successfully</span>
            <div class="ml-auto flex items-center gap-2">
              <span class="text-xs text-green-600">{{ dataCompleteness }}% complete</span>
              <button 
                @click="$emit('load-data')"
                class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-all dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40"
              >
                Refresh
              </button>
            </div>
          </div>
          
          <!-- No Data State -->
          <div v-else class="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-900/30">
            <AlertTriangle class="w-4 h-4 text-yellow-600" />
            <span class="text-sm text-yellow-700">No report data available</span>
            <button 
              @click="$emit('load-data')"
              class="ml-auto px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-all dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40"
            >
              Load Data
            </button>
          </div>
        </div>

        <!-- Action Buttons Section -->
        <div class="mb-4 pt-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2 dark:text-gray-200">
            <Plus class="w-4 h-4 text-violet-600" />
            Quick Actions
          </h3>              
          <div class="flex gap-2">
            <button 
              @click="$emit('refresh')"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
            >
              <RefreshCw class="w-4 h-4" />
              Refresh
            </button>
            <button 
              @click="$emit('export')"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
            >
              <Download class="w-4 h-4" />
              Export
            </button>
            <button 
              @click="$emit('print')"
              class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/90 border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40 dark:text-violet-300 dark:hover:bg-[#151823]/90"
            >
              <Printer class="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <!-- Filters Section -->
        <div>
          <div class="bg-white/90 rounded-xl p-5 border border-violet-100 shadow-sm dark:bg-[#151823]/80 dark:border-violet-900/40">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 dark:text-gray-200">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              Year Range Filter
            </h3>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 dark:text-gray-300">
                    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    From Year
                  </label>
                  <select 
                    :value="fromYear" 
                    @input="$emit('update:fromYear', $event.target.value)"
                    class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                  >
                    <option value="">Select Year</option>
                    <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 dark:text-gray-300">
                    <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    To Year
                  </label>
                  <select 
                    :value="toYear" 
                    @input="$emit('update:toYear', $event.target.value)"
                    class="w-full px-3 py-2.5 rounded-lg border border-violet-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm shadow-sm dark:bg-[#111318] dark:text-gray-200 dark:border-violet-900/40"
                  >
                    <option value="">Select Year</option>
                    <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>

              <div class="flex gap-2">
                <button 
                  @click="$emit('clear-years')" 
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/90 text-gray-700 border border-violet-200 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium shadow-sm dark:bg-[#151823]/80 dark:text-gray-300 dark:border-violet-900/40 dark:hover:bg-[#151823]/90"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Clear
                </button>
                <button 
                  @click="$emit('show-advanced')" 
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 text-sm font-medium shadow"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Advanced
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  AlertTriangle,
  AlertCircle,
  Loader2,
  Plus,
  Database,
  CheckCircle,
  RefreshCw,
  Download,
  Printer
} from 'lucide-vue-next'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    required: true
  },
  years: {
    type: Array,
    default: () => []
  },
  fromYear: {
    type: String,
    default: ''
  },
  toYear: {
    type: String,
    default: ''
  },
  dataLoading: {
    type: Boolean,
    default: false
  },
  dataError: {
    type: String,
    default: null
  },
  dataCompleteness: {
    type: Number,
    default: 0
  }
})

// Emits
defineEmits([
  'update:fromYear',
  'update:toYear',
  'clear-years',
  'show-advanced',
  'load-data',
  'refresh',
  'export',
  'print'
])

// Local state
const collapsed = ref(true)
let hoverCloseTimer = null

// Computed
const filteredToYears = computed(() => {
  if (!props.fromYear) return props.years
  return props.years.filter(y => parseInt(y) >= parseInt(props.fromYear))
})

// Hover handlers
function onHoverEnter() {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
  collapsed.value = false
}

function onHoverLeave() {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
  hoverCloseTimer = setTimeout(() => {
    collapsed.value = true
    hoverCloseTimer = null
  }, 180)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

