<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <Database class="w-6 h-6 text-white" />
              <h3 class="text-lg font-semibold text-white">Data Recovery & Cache Management</h3>
            </div>
            <button @click="closeModal" class="text-white hover:text-gray-200 transition-colors">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <!-- Cache Status -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity class="w-5 h-5 text-violet-600" />
              Cache Status
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-600">Status</div>
                <div class="text-lg font-semibold" :class="cacheStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'">
                  {{ cacheStatus.status === 'healthy' ? 'Healthy' : 'Issues Detected' }}
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-600">Entries</div>
                <div class="text-lg font-semibold text-gray-900">{{ cacheStatus.entries || 0 }}</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-sm text-gray-600">Storage Size</div>
                <div class="text-lg font-semibold text-gray-900">{{ formatBytes(cacheStatus.storageSize || 0) }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Settings class="w-5 h-5 text-violet-600" />
              Actions
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                @click="refreshCache"
                :disabled="isRefreshing"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isRefreshing }" />
                {{ isRefreshing ? 'Refreshing...' : 'Refresh Cache' }}
              </button>
              
              <button 
                @click="validateCache"
                :disabled="isValidating"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Shield class="w-5 h-5" :class="{ 'animate-spin': isValidating }" />
                {{ isValidating ? 'Validating...' : 'Validate Cache' }}
              </button>
              
              <button 
                @click="exportCache"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download class="w-5 h-5" />
                Export Cache
              </button>
              
              <button 
                @click="showImportInput = true"
                class="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Upload class="w-5 h-5" />
                Import Cache
              </button>
            </div>
          </div>

          <!-- Import Input (Hidden by default) -->
          <div v-if="showImportInput" class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">Import Cache Data</h4>
            <div class="flex items-center gap-4">
              <input 
                type="file" 
                ref="fileInput"
                @change="handleFileImport"
                accept=".json"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <button 
                @click="showImportInput = false"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <!-- Cache Details -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <List class="w-5 h-5 text-violet-600" />
              Cache Details
            </h4>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600 mb-2">Project: <span class="font-medium text-gray-900">{{ currentProject }}</span></div>
              <div class="text-sm text-gray-600 mb-2">Last Updated: <span class="font-medium text-gray-900">{{ cacheStatus.lastUpdated || 'Never' }}</span></div>
              <div class="text-sm text-gray-600">Pages Cached: <span class="font-medium text-gray-900">{{ cacheStatus.pages || 0 }}</span></div>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="errorMessage" class="mb-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center gap-2">
                <AlertTriangle class="w-5 h-5 text-red-600" />
                <span class="text-red-800 font-medium">Error:</span>
                <span class="text-red-700">{{ errorMessage }}</span>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="mb-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="text-green-800 font-medium">Success:</span>
                <span class="text-green-700">{{ successMessage }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button 
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Database, 
  X, 
  Activity, 
  Settings, 
  RefreshCw, 
  Shield, 
  Download, 
  Upload, 
  List, 
  AlertTriangle, 
  CheckCircle 
} from 'lucide-vue-next'
import { selectedProject } from '@/components/utility/dashboard/projectService.js'
import { unifiedCacheService } from '@/components/utility/_master_utility/unifiedCacheService.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive state
const isRefreshing = ref(false)
const isValidating = ref(false)
const showImportInput = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const cacheStatus = ref({})

// Computed
const currentProject = computed(() => {
  return selectedProject.value?.project_name || 'No Project Selected'
})

// Methods
const closeModal = () => {
  emit('close')
  errorMessage.value = ''
  successMessage.value = ''
  showImportInput.value = false
}

const refreshCache = async () => {
  try {
    isRefreshing.value = true
    errorMessage.value = ''
    
    await unifiedCacheService.loadProjectCache()
    await updateCacheStatus()
    
    successMessage.value = 'Cache refreshed successfully'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = `Failed to refresh cache: ${error.message}`
  } finally {
    isRefreshing.value = false
  }
}

const validateCache = async () => {
  try {
    isValidating.value = true
    errorMessage.value = ''
    
    const validation = unifiedCacheService.validateCache()
    
    if (validation.valid) {
      successMessage.value = 'Cache validation passed'
    } else {
      errorMessage.value = `Cache validation failed: ${validation.errors.join(', ')}`
    }
    
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = `Validation error: ${error.message}`
  } finally {
    isValidating.value = false
  }
}

const exportCache = () => {
  try {
    unifiedCacheService.exportCache()
    successMessage.value = 'Cache exported successfully'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = `Export failed: ${error.message}`
  }
}

const handleFileImport = async (event) => {
  try {
    const file = event.target.files[0]
    if (!file) return
    
    errorMessage.value = ''
    await unifiedCacheService.importCache(file)
    
    successMessage.value = 'Cache imported successfully'
    showImportInput.value = false
    
    // Update status
    await updateCacheStatus()
    
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = `Import failed: ${error.message}`
  }
}

const updateCacheStatus = async () => {
  try {
    const stats = unifiedCacheService.getCacheStats()
    cacheStatus.value = stats || {}
  } catch (error) {
    console.error('Failed to update cache status:', error)
  }
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  updateCacheStatus()
})

// Watch for project changes
watch(selectedProject, () => {
  updateCacheStatus()
}, { deep: true })

// Watch for visibility changes
watch(() => props.isVisible, (visible) => {
  if (visible) {
    updateCacheStatus()
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
