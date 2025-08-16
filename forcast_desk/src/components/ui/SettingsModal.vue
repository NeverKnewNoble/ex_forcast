<template>
  <transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click="closeModal">
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-6xl h-[60vh] overflow-hidden" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-violet-700 border-b border-violet-200">
          <div class="flex items-center gap-3">
            <Settings class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Settings</h2>
          </div>
          <button @click="closeModal" class="w-8 h-8 rounded-lg hover:bg-violet-600 flex items-center justify-center transition-colors">
            <X class="w-5 h-5 text-white" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex h-full">
          <!-- Sidebar -->
          <div class="w-64 bg-gray-50 border-r border-violet-200 overflow-y-auto">
            <div class="p-4">
              <nav class="space-y-2">
                <button v-for="section in settingsSections" :key="section.id" @click="activeSection = section.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group"
                  :class="[activeSection === section.id ? 'bg-violet-100 text-violet-700 border border-violet-200 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800']">
                  <component :is="section.icon" class="w-5 h-5" />
                  <span class="font-medium">{{ section.title }}</span>
                </button>
              </nav>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto bg-white">
            <!-- User Settings -->
            <div v-if="activeSection === 'user'" class="p-8 pb-20">
              <div class="max-w-4xl">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">User Settings</h3>
                <div class="space-y-8">
                  <!-- Profile Information -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User class="w-5 h-5 text-violet-600" />Profile Information
                    </h4>
                    <p class="text-sm text-gray-600 mb-4">Your profile information is automatically populated from your active session.</p>
                    
                    <div v-if="isLoadingUserDetails" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div class="flex items-center gap-2 text-blue-700">
                        <RefreshCw class="w-4 h-4 animate-spin" />
                        <span class="text-sm">Loading user details...</span>
                      </div>
                    </div>
                    
                      <div class="grid grid-cols-3 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input 
                          disabled
                          type="text" 
                          :value="userSettings.username || 'Loading...'" 
                          readonly 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" 
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          disabled
                          type="text" 
                          :value="userSettings.email || 'Not available'" 
                          readonly 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" 
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          disabled
                          type="text" 
                          :value="userSettings.fullName || 'Not available'" 
                          readonly 
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed" 
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Preferences -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Palette class="w-5 h-5 text-violet-600" />Preferences
                    </h4>
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Dark Mode</p>
                          <p class="text-sm text-gray-600">Switch to dark theme</p>
                        </div>
                        <button @click="userSettings.darkMode = !userSettings.darkMode" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="userSettings.darkMode ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="userSettings.darkMode ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Auto-logout</p>
                          <p class="text-sm text-gray-600">Automatically logout after inactivity</p>
                        </div>
                        <button @click="userSettings.autoLogout = !userSettings.autoLogout" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="userSettings.autoLogout ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="userSettings.autoLogout ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Project Settings -->
            <div v-if="activeSection === 'project'" class="p-8 pb-20">
              <div class="max-w-4xl">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">Project Settings</h3>
                <div class="space-y-8">
                  <!-- Export Settings -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Download class="w-5 h-5 text-violet-600" />Export Settings
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Default Export Format</label>
                        <select v-model="projectSettings.exportFormat" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all">
                          <option value="excel">Excel (.xlsx)</option>
                          <option value="csv">CSV (.csv)</option>
                          <option value="pdf">PDF (.pdf)</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Include Charts</label>
                        <select v-model="projectSettings.includeCharts" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                          <option value="ask">Ask each time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Settings -->
            <div v-if="activeSection === 'system'" class="p-8 pb-20">
              <div class="max-w-4xl">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">System Settings</h3>
                <div class="space-y-8">
                  <!-- Performance -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Zap class="w-5 h-5 text-violet-600" />Performance
                    </h4>
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Enable Caching</p>
                          <p class="text-sm text-gray-600">Cache frequently accessed data</p>
                        </div>
                        <button @click="systemSettings.enableCaching = !systemSettings.enableCaching" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="systemSettings.enableCaching ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="systemSettings.enableCaching ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Lazy Loading</p>
                          <p class="text-sm text-gray-600">Load data on demand</p>
                        </div>
                        <button @click="systemSettings.lazyLoading = !systemSettings.lazyLoading" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="systemSettings.lazyLoading ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="systemSettings.lazyLoading ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cache Expiry (minutes)</label>
                        <input type="number" v-model="systemSettings.cacheExpiry" min="1" max="1440" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" />
                      </div>
                    </div>
                  </div>

                  <!-- Security -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Shield class="w-5 h-5 text-violet-600" />Security
                    </h4>
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Session Timeout</p>
                          <p class="text-sm text-gray-600">Auto-logout after inactivity</p>
                        </div>
                        <button @click="systemSettings.sessionTimeout = !systemSettings.sessionTimeout" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="systemSettings.sessionTimeout ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="systemSettings.sessionTimeout ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <input type="number" v-model="systemSettings.sessionTimeoutMinutes" min="5" max="480" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all" />
                      </div>
                    </div>
                  </div>

                  <!-- Updates -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <RefreshCw class="w-5 h-5 text-violet-600" />Updates
                    </h4>
                    <div class="space-y-4">
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Auto-updates</p>
                          <p class="text-sm text-gray-600">Automatically check for updates</p>
                        </div>
                        <button @click="systemSettings.autoUpdates = !systemSettings.autoUpdates" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="systemSettings.autoUpdates ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="systemSettings.autoUpdates ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="font-medium text-gray-800">Beta Features</p>
                          <p class="text-sm text-gray-600">Enable experimental features</p>
                        </div>
                        <button @click="systemSettings.betaFeatures = !systemSettings.betaFeatures" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400" :class="systemSettings.betaFeatures ? 'bg-violet-500' : 'bg-gray-200'">
                          <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform" :class="systemSettings.betaFeatures ? 'translate-x-5' : 'translate-x-1'" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- About -->
            <div v-if="activeSection === 'about'" class="p-8 pb-20">
              <div class="max-w-4xl">
                <h3 class="text-2xl font-bold text-gray-800 mb-6">About</h3>
                <div class="space-y-8">
                  <!-- Application Information -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Info class="w-5 h-5 text-violet-600" />Application Information
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <div class="flex justify-between">
                          <span class="text-gray-600">Version:</span>
                          <span class="font-medium text-gray-800">0.0.1</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Build Date:</span>
                          <span class="font-medium text-gray-800">{{ new Date().toLocaleDateString() }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">License:</span>
                          <span class="font-medium text-gray-800">Commercial</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Developer:</span>
                          <span class="font-medium text-gray-800">Carbonite Solutions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- System Requirements -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Monitor class="w-5 h-5 text-violet-600" />System Requirements
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <h5 class="font-medium text-gray-800 mb-2">Minimum Requirements</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                          <li>• Modern web browser (Chrome 90+, Firefox 88+)</li>
                          <li>• 4GB RAM</li>
                          <li>• 2GB free disk space</li>
                          <li>• Internet connection</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-medium text-gray-800 mb-2">Recommended</h5>
                        <ul class="text-sm text-gray-600 space-y-1">
                          <li>• Chrome 100+ or Firefox 100+</li>
                          <li>• 8GB RAM</li>
                          <li>• 5GB free disk space</li>
                          <li>• High-speed internet</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Support -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <HelpCircle class="w-5 h-5 text-violet-600" />Support
                    </h4>
                    <div class="grid grid-cols-2 gap-6">
                      <div>
                        <h5 class="font-medium text-gray-800 mb-2">Support</h5>
                        <div class="space-y-2">
                          <a href="#" class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
                            <MessageCircle class="w-4 h-4" />
                            <span class="text-sm">Contact Support</span>
                          </a>
                          <a href="#" class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
                            <Code class="w-4 h-4" />
                            <span class="text-sm">GitHub Issues</span>
                          </a>
                          <a href="#" class="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors">
                            <Mail class="w-4 h-4" />
                            <span class="text-sm">Email Support</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-violet-200">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <Info class="w-4 h-4" />
            <span>Settings are automatically saved</span>
          </div>
          <div class="flex gap-3">
            <button @click="resetToDefaults" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Reset to Defaults</button>
            <button @click="closeModal" class="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">Done</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Settings, X, User, Zap, Info, Palette, Database, 
  Download, Shield, RefreshCw, Monitor, HelpCircle, 
  MessageCircle, Code, Mail 
} from 'lucide-vue-next'
import { session } from '@/data/session'
import { createResource } from 'frappe-ui'

const props = defineProps({
  isVisible: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const activeSection = ref('user')

const userSettings = ref({
  username: '',
  email: '',
  fullName: '',
  darkMode: false,
  autoLogout: true
})

const isLoadingUserDetails = ref(false)

// Create resource to fetch user details
const userDetailsResource = createResource({
  url: 'frappe.client.get_value',
  makeParams() {
    return {
      doctype: 'User',
      filters: { name: session.user },
      fieldname: ['name', 'email', 'full_name']
    }
  },
    onSuccess(data) {
    isLoadingUserDetails.value = false
    // console.log('User details fetched:', data)
    if (data) {
      const userData = data
      // console.log('User data:', userData)
      userSettings.value.username = userData.name || session.user || ''
      userSettings.value.email = userData.email || ''
      userSettings.value.fullName = userData.full_name || userData.name || session.user || ''
      // console.log('Updated user settings:', userSettings.value)
      // console.log('Username field value:', userSettings.value.username)
      // console.log('Email field value:', userSettings.value.email)
      // console.log('Full Name field value:', userSettings.value.fullName)
    }
  },
  onError(error) {
    isLoadingUserDetails.value = false
    console.error('Error fetching user details:', error)
    // Fallback to basic session data
    userSettings.value.username = session.user || ''
    userSettings.value.email = ''
    userSettings.value.fullName = session.user || ''
  }
})



// Populate user settings from session data
const populateUserSettingsFromSession = () => {
  // console.log('Session data:', session)
  if (session && session.user) {
    // console.log('User ID from session:', session.user)
    isLoadingUserDetails.value = true
    
    // Set basic session data first
    userSettings.value.username = session.user || ''
    
    // Try to fetch detailed user information
    userDetailsResource.reload()
  } else {
    // console.log('No session or user data available')
  }
}

const projectSettings = ref({
  exportFormat: 'excel',
  includeCharts: 'ask'
})

const systemSettings = ref({
  enableCaching: true,
  lazyLoading: true,
  cacheExpiry: 30,
  sessionTimeout: true,
  sessionTimeoutMinutes: 30,
  autoUpdates: true,
  betaFeatures: false
})

const settingsSections = [
  { id: 'user', title: 'User', icon: User },
  { id: 'project', title: 'Project Settings', icon: Database },
  { id: 'system', title: 'System', icon: Settings },
  { id: 'about', title: 'About', icon: Info }
]

const closeModal = () => emit('close')

const resetToDefaults = () => {
  userSettings.value = { 
    username: '', email: '', fullName: '', darkMode: false, 
    autoLogout: true
  }
  projectSettings.value = { 
    exportFormat: 'excel', includeCharts: 'ask'
  }
  systemSettings.value = { 
    enableCaching: true, lazyLoading: true, cacheExpiry: 30, 
    sessionTimeout: true, sessionTimeoutMinutes: 30, 
    autoUpdates: true, betaFeatures: false 
  }
}

onMounted(() => {
  loadSettings()
})

const loadSettings = () => {
  try {
    // First populate from session data
    populateUserSettingsFromSession()
    
    // Then load saved settings from localStorage (these will override session defaults)
    const savedUserSettings = localStorage.getItem('userSettings')
    if (savedUserSettings) userSettings.value = { ...userSettings.value, ...JSON.parse(savedUserSettings) }
    
    const savedProjectSettings = localStorage.getItem('projectSettings')
    if (savedProjectSettings) projectSettings.value = { ...projectSettings.value, ...JSON.parse(savedProjectSettings) }
    
    const savedSystemSettings = localStorage.getItem('systemSettings')
    if (savedSystemSettings) systemSettings.value = { ...systemSettings.value, ...JSON.parse(savedSystemSettings) }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

// Watch for session changes to update user settings
watch(() => session, () => {
  populateUserSettingsFromSession()
}, { immediate: true, deep: true })

// Watch for settings changes to save to localStorage
watch(userSettings, (newSettings) => localStorage.setItem('userSettings', JSON.stringify(newSettings)), { deep: true })
watch(projectSettings, (newSettings) => localStorage.setItem('projectSettings', JSON.stringify(newSettings)), { deep: true })
watch(systemSettings, (newSettings) => localStorage.setItem('systemSettings', JSON.stringify(newSettings)), { deep: true })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
