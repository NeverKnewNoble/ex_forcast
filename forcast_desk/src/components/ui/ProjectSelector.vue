<template>
  <div class="relative">
    <!-- Project Selector Container -->
    <div class="flex items-center space-x-3">
      <!-- Project Dropdown -->
      <div class="relative min-w-[200px]">
        <button
          @click="toggleDropdown"
          class="w-full flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-xl border border-violet-200/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          :class="{ 'ring-2 ring-violet-400/50': isDropdownOpen }"
        >
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FolderOpen class="w-4 h-4 text-white" />
            </div>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-700">
                {{ selectedProject ? selectedProject.project_name : 'Select Project' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ selectedProject ? 'Active Project' : 'No project selected' }}
              </p>
            </div>
          </div>
          <ChevronDown 
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isDropdownOpen }"
          />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-violet-200/50 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          <div class="p-2">
            <div
              v-for="project in projects"
              :key="project.name"
              @click="selectProject(project)"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-violet-50/80 cursor-pointer transition-colors duration-200 group"
              :class="{ 'bg-violet-100/80': selectedProject?.name === project.name }"
            >
              <div class="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FolderOpen class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-800 truncate">
                  {{ project.project_name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ project.project_description }}
                </p>
              </div>
              <div
                v-if="selectedProject?.name === project.name"
                class="w-2 h-2 bg-violet-500 rounded-full"
              ></div>
            </div>
            
            <!-- No projects message -->
            <div
              v-if="projects.length === 0 && !isLoading"
              class="p-4 text-center text-gray-500"
            >
              <FolderOpen class="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p class="text-sm">No projects available</p>
            </div>
            
            <!-- Loading state -->
            <div
              v-if="isLoading"
              class="p-4 text-center text-gray-500"
            >
              <div class="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p class="text-sm">Loading projects...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New Project Button -->
      <button
        @click="openCreateModal"
        class="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      >
        <Plus class="w-6 h-6" />
        <span class="text-md font-medium">New Project</span>
      </button>
    </div>

    <!-- Create Project Modal -->
    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeCreateModal"
    >
      <div
        class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-200/50 p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Plus class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Create New Project</h3>
              <p class="text-sm text-gray-500">Add a new forecast project</p>
            </div>
          </div>
          <button
            @click="closeCreateModal"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
          >
            <X class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Modal Form -->
        <form @submit.prevent="handleCreateProject" class="space-y-4">
          <!-- Project Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              v-model="newProject.name"
              type="text"
              required
              placeholder="Enter project name"
              class="w-full px-4 py-3 border border-violet-200/50 rounded-xl focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all duration-200 bg-white/80 backdrop-blur-xl"
              :class="{ 'border-red-300 focus:ring-red-400/50': formErrors.name }"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">
              {{ formErrors.name }}
            </p>
          </div>

          <!-- Project Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              v-model="newProject.description"
              required
              rows="4"
              placeholder="Enter project description"
              class="w-full px-4 py-3 border border-violet-200/50 rounded-xl focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all duration-200 bg-white/80 backdrop-blur-xl resize-none"
              :class="{ 'border-red-300 focus:ring-red-400/50': formErrors.description }"
            ></textarea>
            <p v-if="formErrors.description" class="mt-1 text-sm text-red-600">
              {{ formErrors.description }}
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Modal Actions -->
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <div v-if="isLoading" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{{ isLoading ? 'Creating...' : 'Create Project' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Click outside to close dropdown -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { 
  FolderOpen, 
  ChevronDown, 
  Plus, 
  X 
} from 'lucide-vue-next'
import { 
  projects, 
  selectedProject, 
  isLoading, 
  error,
  fetchProjects, 
  createProject, 
  setSelectedProject,
  clearError,
  initializeProjectService
} from '@/components/utility/dashboard/projectService.js'

// Component state
const isDropdownOpen = ref(false)
const isCreateModalOpen = ref(false)
const formErrors = reactive({
  name: '',
  description: ''
})

const newProject = reactive({
  name: '',
  description: ''
})

// Methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const selectProject = (project) => {
  setSelectedProject(project)
  closeDropdown()
}

const openCreateModal = () => {
  isCreateModalOpen.value = true
  clearError()
  resetForm()
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
  resetForm()
}

const resetForm = () => {
  newProject.name = ''
  newProject.description = ''
  formErrors.name = ''
  formErrors.description = ''
}

const validateForm = () => {
  let isValid = true
  formErrors.name = ''
  formErrors.description = ''

  if (!newProject.name.trim()) {
    formErrors.name = 'Project name is required'
    isValid = false
  }

  if (!newProject.description.trim()) {
    formErrors.description = 'Project description is required'
    isValid = false
  }

  return isValid
}

const handleCreateProject = async () => {
  if (!validateForm()) return

  try {
    const createdProject = await createProject(newProject.name, newProject.description)
    setSelectedProject(createdProject)
    closeCreateModal()
  } catch (err) {
    // Error is already handled in the service
  }
}

// Lifecycle
onMounted(async () => {
  await initializeProjectService()
})

// Watch for project changes
watch(selectedProject, (newProject) => {
  if (newProject) {
    // Emit event for parent components
    emit('project-changed', newProject)
  }
})

// Define emits
const emit = defineEmits(['project-changed'])
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(139, 92, 246, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}
</style> 