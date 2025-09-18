<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/30" @click="closeModal"></div>
    
    <!-- Modal -->
    <div class="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl border border-violet-200">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Plus class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-base font-semibold text-gray-800">Add New Category</h3>
        </div>
        <button 
          @click="closeModal" 
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Content -->
      <div class="p-5 space-y-4">
        <!-- Mode Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Add Category From
          </label>
          <div class="flex gap-2">
            <button
              @click="setMode('select')"
              :class="[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                mode === 'select' 
                  ? 'bg-violet-100 text-violet-700 border-2 border-violet-300' 
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              ]"
            >
              <Database class="w-4 h-4 inline mr-2" />
              Select Existing
            </button>
            <button
              @click="setMode('create')"
              :class="[
                'flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                mode === 'create' 
                  ? 'bg-violet-100 text-violet-700 border-2 border-violet-300' 
                  : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
              ]"
            >
              <Plus class="w-4 h-4 inline mr-2" />
              Create New
            </button>
          </div>
        </div>

        <!-- Select Existing Item Group -->
        <div v-if="mode === 'select'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Item Group
          </label>
          <select
            v-model="selectedItemGroup"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            @change="clearError"
          >
            <option value="">Choose an existing Item Group...</option>
            <option v-for="itemGroup in itemGroups" :key="itemGroup.name" :value="itemGroup.item_group_name">
              {{ itemGroup.item_group_name }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Select from existing Item Groups in the system
          </p>
        </div>

        <!-- Create New Category -->
        <div v-if="mode === 'create'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            v-model="categoryName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            placeholder="Enter category name (e.g., Planning, Site Prep)"
            @keyup.enter="handleSubmit"
            @input="clearError"
            ref="categoryNameInput"
          />
          <p class="mt-1 text-xs text-gray-500">
            This will create a new Item Group in the system
          </p>
        </div>

        <!-- Error Message -->
        <p v-if="error" class="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle class="w-4 h-4" />
          {{ error }}
        </p>
      </div>
      
      <!-- Footer -->
      <div class="px-5 py-4 border-t border-gray-200 flex items-center justify-end gap-2 bg-gray-50 rounded-b-xl">
        <button 
          @click="closeModal" 
          class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="isLoading || !isFormValid"
          class="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 text-white hover:from-violet-700 hover:to-violet-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
          <Plus v-else class="w-4 h-4" />
          {{ isLoading ? 'Processing...' : (mode === 'select' ? 'Add Category' : 'Create Category') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import { Plus, X, AlertCircle, Loader2, Database } from 'lucide-vue-next'
import { contractorEstimatorService } from '@/components/utility/contractor_estimator/ContractorEstimatorService.js'

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'create'])

// Reactive state
const mode = ref('select') // 'select' or 'create'
const categoryName = ref('')
const selectedItemGroup = ref('')
const itemGroups = ref([])
const error = ref('')
const isLoading = ref(false)
const categoryNameInput = ref(null)

// Computed properties
const isFormValid = computed(() => {
  if (mode.value === 'select') {
    return selectedItemGroup.value.trim() !== ''
  } else {
    return categoryName.value.trim() !== '' && categoryName.value.trim().length >= 2
  }
})

// Methods
const clearError = () => {
  error.value = ''
}

const setMode = (newMode) => {
  mode.value = newMode
  clearError()
  // Reset form values when switching modes
  if (newMode === 'select') {
    categoryName.value = ''
  } else {
    selectedItemGroup.value = ''
  }
}

const loadItemGroups = async () => {
  try {
    isLoading.value = true
    const groups = await contractorEstimatorService.getItemGroups()
    itemGroups.value = groups
  } catch (error) {
    console.error('Failed to load item groups:', error)
    error.value = 'Failed to load existing Item Groups'
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  if (isLoading.value) return // Prevent closing while loading
  
  categoryName.value = ''
  selectedItemGroup.value = ''
  error.value = ''
  isLoading.value = false
  mode.value = 'select'
  emit('close')
}

const handleSubmit = async () => {
  if (isLoading.value) return
  
  let categoryNameToUse = ''
  
  if (mode.value === 'select') {
    if (!selectedItemGroup.value.trim()) {
      error.value = 'Please select an Item Group'
      return
    }
    categoryNameToUse = selectedItemGroup.value.trim()
  } else {
    const name = categoryName.value.trim()
    if (!name) {
      error.value = 'Category name is required'
      return
    }
    
    if (name.length < 2) {
      error.value = 'Category name must be at least 2 characters'
      return
    }
    categoryNameToUse = name
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    emit('create', categoryNameToUse, mode.value)
  } catch (err) {
    error.value = err.message || 'Failed to process category'
  } finally {
    isLoading.value = false
  }
}

// Watch for modal visibility to load data and focus input
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    loadItemGroups()
    nextTick(() => {
      if (mode.value === 'create') {
        categoryNameInput.value?.focus()
      }
    })
  }
})

// Load item groups on component mount
onMounted(() => {
  if (props.isVisible) {
    loadItemGroups()
  }
})

// Expose methods for parent component
defineExpose({
  closeModal,
  setError: (message) => {
    error.value = message
  },
  setLoading: (loading) => {
    isLoading.value = loading
  }
})
</script>

<style scoped>
/* Custom focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease;
}
</style>
