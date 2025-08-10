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

    <!-- Stepper Modal -->
    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      @click="closeCreateModal"
    >
      <div
        class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-violet-200/50 p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
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
              <p class="text-sm text-gray-500">Step {{ getCurrentStepNumber() }} of {{ getTotalSteps() }}</p>
            </div>
          </div>
          <button
            @click="closeCreateModal"
            class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
          >
            <X class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Stepper Progress -->
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              class="flex items-center"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
                :class="getStepClass(index)"
              >
                <component :is="step.icon" v-if="currentStep > index" class="w-4 h-4" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div 
                v-if="index < steps.length - 1"
                class="w-16 h-1 mx-2 transition-all duration-300"
                :class="currentStep > index ? 'bg-violet-500' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
          <div class="mt-2 text-center">
            <p class="text-sm font-medium text-gray-700">
              {{ getCurrentStepTitle() }}
            </p>
          </div>
        </div>

        <!-- Step 1: Project Details -->
        <div v-if="currentStep === 1" class="space-y-4">
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
        </div>

        <!-- Step 2: Department Selection -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Choose Your Departments *
            </label>
            <p class="text-sm text-gray-600 mb-4">
              Select the departments you want to include in your project. Main departments are recommended for most projects.
            </p>
            
            <!-- Main Mandatory Departments -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Star class="w-4 h-4 mr-2 text-yellow-500" />
                Main Departments (Recommended)
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="dept in mainDepartments"
                  :key="dept.value"
                  @click="toggleDepartment(dept.value)"
                  class="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
                  :class="selectedDepartments.includes(dept.value) 
                    ? 'border-violet-500 bg-violet-50' 
                    : 'border-gray-200 hover:border-violet-300'"
                >
                  <div class="flex items-center justify-center w-5 h-5 rounded-full border-2 mr-3 transition-all duration-200"
                       :class="selectedDepartments.includes(dept.value) 
                         ? 'border-violet-500 bg-violet-500' 
                         : 'border-gray-300'">
                    <Check class="w-3 h-3 text-white" v-if="selectedDepartments.includes(dept.value)" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800">{{ dept.label }}</p>
                    <p class="text-xs text-gray-500">{{ dept.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Other Departments (Collapsible) -->
            <div class="border-t border-violet-200 pt-4">
              <button
                @click="toggleOtherDepartments"
                class="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 group"
              >
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <FolderOpen class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex gap-1">
                    <span class="text-sm font-semibold text-violet-800">More Departments</span>
                    <span class="block text-xs text-violet-600">({{ otherDepartments.length }} available)</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-xs text-violet-600 font-medium">Click to expand</span>
                  <ChevronDown 
                    class="w-5 h-5 text-violet-500 transition-transform duration-300 group-hover:scale-110"
                    :class="{ 'rotate-180': showOtherDepartments }"
                  />
                </div>
              </button>
              
              <div v-if="showOtherDepartments" class="mt-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  <div
                    v-for="dept in otherDepartments"
                    :key="dept.value"
                    @click="toggleDepartment(dept.value)"
                    class="flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md"
                    :class="selectedDepartments.includes(dept.value) 
                      ? 'border-violet-500 bg-violet-50' 
                      : 'border-gray-200 hover:border-violet-300'"
                  >
                    <div class="flex items-center justify-center w-5 h-5 rounded-full border-2 mr-3 transition-all duration-200"
                         :class="selectedDepartments.includes(dept.value) 
                           ? 'border-violet-500 bg-violet-500' 
                           : 'border-gray-300'">
                      <Check class="w-3 h-3 text-white" v-if="selectedDepartments.includes(dept.value)" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-800">{{ dept.label }}</p>
                    </div>
                  </div>
                </div>
                
                <div v-if="otherDepartments.length === 0" class="text-center py-4 text-gray-500">
                  <FolderOpen class="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p class="text-sm">No other departments available</p>
                </div>
              </div>
            </div>
            
            <p v-if="formErrors.departments" class="mt-2 text-sm text-red-600">
              {{ formErrors.departments }}
            </p>
          </div>
        </div>

        <!-- Step 3: Department Details -->
        <div v-if="currentStep === 3" class="space-y-4">
          <div>
            <!-- Animated Interactive Message -->
            <div class="bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 border-2 border-violet-300 rounded-xl p-6 mb-6 shadow-lg animate-pulse relative overflow-hidden">
              <!-- Animated background elements -->
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-400/20 to-purple-400/20 rounded-full blur-xl animate-ping"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-violet-400/20 rounded-full blur-lg animate-pulse" style="animation-delay: 1s;"></div>
              
              <div class="relative z-10 flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-r from-violet-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                  <Settings class="w-6 h-6 text-white animate-spin" style="animation-duration: 3s;" />
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-violet-900 mb-2 animate-pulse">
                    <!-- <span class="inline-block animate-bounce" style="animation-delay: 0.5s;">🎯</span> -->
                    Hold up a second!
                    <span class="inline-block animate-bounce" style="animation-delay: 1s;">⚡</span>
                  </h3>
                  <p class="text-sm text-violet-800 leading-relaxed">
                    Look at this <span class="font-semibold text-purple-700">department details</span> regarding the departments you chose. 
                    You can configure specific <span class="font-semibold text-purple-700">locations and facilities</span> for each department.
                  </p>
                </div>
              </div>
              
              <!-- Sparkle effects -->
              <div class="absolute top-4 right-4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style="animation-delay: 0.5s;"></div>
              <div class="absolute bottom-4 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style="animation-delay: 1.5s;"></div>
              <div class="absolute top-8 left-8 w-1 h-1 bg-blue-400 rounded-full animate-ping" style="animation-delay: 2s;"></div>
            </div>
            
            
            <!-- Rooms Department Details -->
            <div v-if="selectedDepartments.includes('Rooms')" class="mb-6">
              <div class="border border-violet-200 rounded-xl overflow-hidden">
                <button
                  @click="toggleRoomsDetails"
                  class="w-full flex items-center justify-between p-4 bg-blue-50 border-b border-violet-200 hover:bg-blue-100 transition-all duration-200"
                >
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Building class="w-4 h-4 text-white" />
                    </div>
                    <div class="flex flex-col justify-left">
                      <span class="text-sm font-semibold text-blue-800">Rooms Department</span>
                    </div>
                  </div>
                  <ChevronDown 
                    class="w-5 h-5 text-blue-500 transition-transform duration-200"
                    :class="{ 'rotate-180': showRoomsDetails }"
                  />
                </button>
                
                <div v-if="showRoomsDetails" class="p-4 bg-white">
                  <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-blue-800 mb-3">Payroll Department Locations</h4>
                    <div v-for="location in roomsLocations" :key="location.value" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span class="text-sm font-medium text-gray-700">{{ location.label }}</span>
                      <button @click="removeRoomsLocation(location.value)" class="text-red-500 hover:text-red-700">
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div class="flex gap-2 pt-2">
                      <input
                        v-model="newRoomsLocation"
                        type="text"
                        placeholder="Enter new location name"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                      <button
                        @click="addRoomsLocation"
                        :disabled="!newRoomsLocation.trim()"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Food & Beverage Department Details -->
            <div v-if="selectedDepartments.includes('Food And Beverage')" class="mb-6">
              <div class="border border-violet-200 rounded-xl overflow-hidden">
                <button
                  @click="toggleFbDetails"
                  class="w-full flex items-center justify-between p-4 bg-green-50 border-b border-violet-200 hover:bg-green-100 transition-all duration-200"
                >
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <Utensils class="w-4 h-4 text-white" />
                    </div>
                    <div  class="flex align-left justify-left flex-col  w-full">
                      <span class="text-sm font-semibold text-green-800">Food & Beverage Department</span>
                    </div>
                  </div>
                  <ChevronDown 
                    class="w-5 h-5 text-green-500 transition-transform duration-200"
                    :class="{ 'rotate-180': showFbDetails }"
                  />
                </button>
                
                <div v-if="showFbDetails" class="p-4 bg-white">
                  <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-green-800 mb-3">Restaurants & Outlets</h4>
                    <!-- Show restaurants if they exist -->
                    <div v-if="fbRestaurants.length > 0">
                      <div v-for="restaurant in fbRestaurants" :key="restaurant.value" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="text-sm font-medium text-gray-700">{{ restaurant.label }}</span>
                        <button @click="removeFbRestaurant(restaurant.value)" class="text-red-500 hover:text-red-700">
                          <X class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <!-- Show empty state if no restaurants -->
                    <div v-else class="text-center py-6">
                      <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Utensils class="w-6 h-6 text-green-600" />
                      </div>
                      <p class="text-sm text-gray-600 mb-3">No restaurants or outlets created yet</p>
                      <p class="text-xs text-gray-500">Add your first restaurant below</p>
                    </div>
                    
                    <!-- Add new restaurant section -->
                    <div class="border-t border-gray-200 pt-3">
                      <div class="flex gap-2">
                        <input
                          v-model="newFbRestaurant"
                          type="text"
                          placeholder="Enter new restaurant name"
                          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        />
                        <button
                          @click="addFbRestaurant"
                          :disabled="!newFbRestaurant.trim()"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Completion Animation -->
        <div v-if="currentStep === 4" class="text-center space-y-6">
          <div class="relative">
            <!-- Animated checkmark -->
            <div class="w-20 h-20 mx-auto mb-4 relative">
              <div class="w-full h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center animate-pulse">
                <Check class="w-10 h-10 text-white" />
              </div>
              <!-- Ripple effect -->
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 animate-ping opacity-75"></div>
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">You're Ready to Go!</h3>
            <p class="text-gray-600 mb-6">
              Your project "<span class="font-semibold text-violet-600">{{ newProject.name }}</span>" is ready to be created with 
              <span class="font-semibold text-violet-600">{{ selectedDepartments.length }}</span> department(s) selected.
            </p>
            
            <div class="bg-violet-50 rounded-lg p-4 mb-6">
              <h4 class="text-sm font-medium text-violet-800 mb-2">Selected Departments:</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="dept in selectedDepartments" 
                  :key="dept"
                  class="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium"
                >
                  {{ getDepartmentLabel(dept) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-between pt-4">
          <button
            v-if="currentStep > 1"
            type="button"
            @click="previousStep"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Previous</span>
          </button>
          <div v-else></div>

          <div class="flex items-center space-x-3">
            <button
              v-if="currentStep < 4"
              type="button"
              @click="nextStep"
              :disabled="!canProceedToNextStep"
              class="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight class="w-4 h-4" />
            </button>
            
            <button
              v-if="currentStep === 4"
              type="button"
              @click="handleCreateProject"
              :disabled="isLoading"
              class="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <div v-if="isLoading" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{{ isLoading ? 'Creating...' : 'Create Project' }}</span>
            </button>
          </div>
        </div>
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
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { 
  FolderOpen, 
  ChevronDown, 
  Plus, 
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  FileText,
  Users,
  CheckCircle,
  Star,
  Building,
  Utensils,
  Settings
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
import { loadProjectDepartmentOptions } from '@/components/utility/payroll/payroll_data_service.js'
import alertService from '@/components/ui/ui_utility/alertService.js'

// Component state
const isDropdownOpen = ref(false)
const isCreateModalOpen = ref(false)
const currentStep = ref(1)
const selectedDepartments = ref([])
const projectDepartmentOptions = ref([])
const showOtherDepartments = ref(false)

// Department details state
const showRoomsDetails = ref(true)
const showFbDetails = ref(true)
const roomsLocations = ref([])
const fbRestaurants = ref([])
const newRoomsLocation = ref('')
const newFbRestaurant = ref('')

// Load department details from API
const loadDepartmentDetails = async () => {
  try {
    // Load Rooms locations from payroll department locations API
    const roomsResponse = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.get_payroll_department_location_list')
    const roomsData = await roomsResponse.json()
    if (roomsData.message && roomsData.message.success) {
      roomsLocations.value = roomsData.message.locations.map(location => ({
        value: location.name,
        label: location.department_location || location.name
      }))
    } else {
      // Fallback to default rooms locations
      roomsLocations.value = [
        { value: 'Front Desk', label: 'Front Desk' },
        { value: 'Housekeeping', label: 'Housekeeping' },
        { value: 'Reservations', label: 'Reservations' }
      ]
    }

    // Load F&B restaurants from F&B revenue assumptions
    // Removed API call to avoid unnecessary network request
    // Start with empty F&B restaurants list - users can add their own
    fbRestaurants.value = []

  } catch (error) {
    console.error('Error loading department details:', error)
    // Set fallback values if API calls fail
    roomsLocations.value = [
      { value: 'Front Desk', label: 'Front Desk' },
      { value: 'Housekeeping', label: 'Housekeeping' },
      { value: 'Reservations', label: 'Reservations' }
    ]
    fbRestaurants.value = []
  }
}

const formErrors = reactive({
  name: '',
  description: '',
  departments: ''
})

const newProject = reactive({
  name: '',
  description: ''
})

// Stepper configuration
const steps = [
  { title: 'Project Details', icon: FileText },
  { title: 'Choose Departments', icon: Users },
  { title: 'Department Details', icon: Settings },
  { title: 'Ready to Create', icon: CheckCircle }
]

// Computed properties
const canProceedToNextStep = computed(() => {
  switch (currentStep.value) {
    case 1:
      return newProject.name.trim() && newProject.description.trim()
    case 2:
      return selectedDepartments.value.length > 0
    case 3:
      return true // Department details are optional
    default:
      return true
  }
})

// Main departments (mandatory/recommended)
const mainDepartments = computed(() => [
  { 
    value: 'Rooms',   
    label: 'Rooms', 
    description: 'Front desk, housekeeping, reservations'
  },
  { 
    value: 'Food And Beverage', 
    label: 'Food & Beverage', 
    description: 'Restaurant, bar, room service'
  },
  { 
    value: 'Banquet', 
    label: 'Banquet', 
    description: 'Events, conferences, catering'
  },
  { 
    value: 'Other Operating Departments', 
    label: 'Other Operating Departments', 
    description: 'Spa, gym, pool, recreation'
  }
])

// Other departments (from API, excluding main departments)
const otherDepartments = computed(() => {
  const mainDeptValues = mainDepartments.value.map(dept => dept.value)
  return projectDepartmentOptions.value.filter(dept => 
    !mainDeptValues.includes(dept.value)
  )
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

const openCreateModal = async () => {
  isCreateModalOpen.value = true
  clearError()
  resetForm()
  currentStep.value = 1
  
  // Load filtered department options and department details
  try {
    projectDepartmentOptions.value = await loadProjectDepartmentOptions()
    await loadDepartmentDetails() // Load department details for step 3
  } catch (error) {
    console.error('Error loading project departments:', error)
    // Fallback to empty array if loading fails
    projectDepartmentOptions.value = []
  }
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
  resetForm()
  currentStep.value = 1
  selectedDepartments.value = []
}

const resetForm = () => {
  newProject.name = ''
  newProject.description = ''
  selectedDepartments.value = []
  showOtherDepartments.value = false
  showRoomsDetails.value = true
  showFbDetails.value = true
  newRoomsLocation.value = ''
  newFbRestaurant.value = ''
  formErrors.name = ''
  formErrors.description = ''
  formErrors.departments = ''
}

const validateStep = (step) => {
  let isValid = true
  
  switch (step) {
    case 1:
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
      break
      
    case 2:
      formErrors.departments = ''
      
      if (selectedDepartments.value.length === 0) {
        formErrors.departments = 'Please select at least one department'
        isValid = false
      }
      break
  }
  
  return isValid
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    // If we're on step 2 and no main departments are selected, skip to step 4
    if (currentStep.value === 2) {
      const mainDepartmentsSelected = selectedDepartments.value.some(dept => 
        ['Rooms', 'Food And Beverage'].includes(dept)
      )
      if (!mainDepartmentsSelected) {
        currentStep.value = 4 // Skip step 3
      } else {
        currentStep.value++
      }
    } else {
      currentStep.value++
    }
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    // If we're on step 4 and no main departments are selected, go back to step 2
    if (currentStep.value === 4) {
      const mainDepartmentsSelected = selectedDepartments.value.some(dept => 
        ['Rooms', 'Food And Beverage'].includes(dept)
      )
      if (!mainDepartmentsSelected) {
        currentStep.value = 2 // Skip step 3 when going back
      } else {
        currentStep.value--
      }
    } else {
      currentStep.value--
    }
  }
}

const toggleDepartment = (deptValue) => {
  const index = selectedDepartments.value.indexOf(deptValue)
  if (index > -1) {
    selectedDepartments.value.splice(index, 1)
  } else {
    selectedDepartments.value.push(deptValue)
  }
}

const toggleOtherDepartments = () => {
  showOtherDepartments.value = !showOtherDepartments.value
}

// Department details methods
const toggleRoomsDetails = () => {
  showRoomsDetails.value = !showRoomsDetails.value
}

const toggleFbDetails = () => {
  showFbDetails.value = !showFbDetails.value
}

const addRoomsLocation = () => {
  if (newRoomsLocation.value.trim()) {
    roomsLocations.value.push({
      value: newRoomsLocation.value.trim(),
      label: newRoomsLocation.value.trim()
    })
    newRoomsLocation.value = ''
  }
}

const removeRoomsLocation = (value) => {
  const index = roomsLocations.value.findIndex(loc => loc.value === value)
  if (index > -1) {
    roomsLocations.value.splice(index, 1)
  }
}

const addFbRestaurant = () => {
  if (newFbRestaurant.value.trim()) {
    fbRestaurants.value.push({
      value: newFbRestaurant.value.trim(),
      label: newFbRestaurant.value.trim()
    })
    newFbRestaurant.value = ''
  }
}

const removeFbRestaurant = (value) => {
  const index = fbRestaurants.value.findIndex(rest => rest.value === value)
  if (index > -1) {
    fbRestaurants.value.splice(index, 1)
  }
}

const getDepartmentLabel = (deptValue) => {
  // Check main departments first
  const mainDept = mainDepartments.value.find(d => d.value === deptValue)
  if (mainDept) {
    return mainDept.label
  }
  
  // Check other departments
  const otherDept = projectDepartmentOptions.value.find(d => d.value === deptValue)
  return otherDept ? otherDept.label : deptValue
}

const getStepClass = (index) => {
  if (currentStep.value > index + 1) {
    return 'bg-violet-500 text-white'
  } else if (currentStep.value === index + 1) {
    return 'bg-violet-500 text-white'
  } else {
    return 'bg-gray-200 text-gray-500'
  }
}

const getCurrentStepTitle = () => {
  // If we're on step 4 and no main departments were selected, show "Ready to Create"
  if (currentStep.value === 4) {
    const mainDepartmentsSelected = selectedDepartments.value.some(dept => 
      ['Rooms', 'Food And Beverage', 'Other Operating Departments'].includes(dept)
    )
    if (!mainDepartmentsSelected) {
      return 'Ready to Create'
    }
  }
  return steps[currentStep.value - 1]?.title || ''
}

const getCurrentStepNumber = () => {
  // If we're on step 4 and no main departments were selected, show step 3
  if (currentStep.value === 4) {
    const mainDepartmentsSelected = selectedDepartments.value.some(dept => 
      ['Rooms', 'Food And Beverage', 'Other Operating Departments'].includes(dept)
    )
    if (!mainDepartmentsSelected) {
      return 3
    }
  }
  return currentStep.value
}

const getTotalSteps = () => {
  // If no main departments are selected, total steps is 3 (skip step 3)
  const mainDepartmentsSelected = selectedDepartments.value.some(dept => 
    ['Rooms', 'Food And Beverage', 'Other Operating Departments'].includes(dept)
  )
  return mainDepartmentsSelected ? 4 : 3
}

const handleCreateProject = async () => {
  if (!validateStep(currentStep.value)) return

  try {
    // NOTE: All department creation is now handled by the backend API
    // The API will create departments, locations, and restaurants based on the data passed
    
    // Prepare department details object
    const departmentDetails = {}
    
    // Add rooms locations if Rooms department is selected
    if (selectedDepartments.value.includes('Rooms') && roomsLocations.value.length > 0) {
      departmentDetails.roomsLocations = roomsLocations.value.map(loc => loc.label)
    }
    
    // Add F&B restaurants if Food And Beverage department is selected
    if (selectedDepartments.value.includes('Food And Beverage') && fbRestaurants.value.length > 0) {
      departmentDetails.fbRestaurants = fbRestaurants.value.map(rest => rest.label)
    }
    
    const createdProject = await createProject(
      newProject.name, 
      newProject.description, 
      selectedDepartments.value,
      departmentDetails
    )
    setSelectedProject(createdProject)
    closeCreateModal()
    
    // Show success message
    alertService.success('Project created successfully!')
  } catch (err) {
    // Error is already handled in the service
  }
}

// Lifecycle
onMounted(async () => {
  await initializeProjectService()
  await loadDepartmentDetails() // Load department details on mount
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

/* Animation for step completion */
@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-checkmark {
  animation: checkmark 0.5s ease-out forwards;
}
</style> 