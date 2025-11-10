import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Import project-specific localStorage utilities for debugging
import { debugLocalStorage, migrateToProjectSpecificKeys, getAllProjectKeys } from '@/components/utility/_master_utility/projectLocalStorage.js'

// Import unified cache service
import { unifiedCacheService } from '@/components/utility/_master_utility/unifiedCacheService.js'

// Import production error handler
import { productionErrorHandler } from '@/components/utility/_master_utility/productionErrorHandler.js'

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Initialize unified cache service
unifiedCacheService.initialize().then(() => {
  // Cache service initialized successfully
}).catch(error => {
  // Handle cache initialization error with production error handler
  productionErrorHandler.logError(error, 'Cache Service Initialization')
})

// Add global debug functions only in development
if (process.env.NODE_ENV === 'development') {
  window.debugProjectLocalStorage = debugLocalStorage
  window.migrateToProjectSpecificKeys = migrateToProjectSpecificKeys
  window.getAllProjectKeys = getAllProjectKeys
  window.unifiedCacheService = unifiedCacheService
  window.productionErrorHandler = productionErrorHandler
  
  // Import debug API utilities
  import('@/components/utility/_master_utility/debugApi.js').then(module => {
    window.debugApiRequest = module.debugApiRequest
    window.testCSRFToken = module.testCSRFToken
  })
  
  // Import CSRF test function
  import('@/components/utility/dashboard/apiUtils.js').then(module => {
    window.testCSRFToken = module.testCSRFToken
    window.getCSRFToken = module.getCSRFToken
  })
  
  // Import expense data test functions
  import('@/components/utility/expense_assumption/data_service.js').then(module => {
    window.testDefaultExpenses = module.testDefaultExpenses
    window.testExpenseData = module.testExpenseData
  })
}

// Global error handling
window.addEventListener('error', (event) => {
  productionErrorHandler.logError(event.error, 'Global Error Handler', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })
})

window.addEventListener('unhandledrejection', (event) => {
  productionErrorHandler.logError(event.reason, 'Unhandled Promise Rejection')
  event.preventDefault() // Prevent default browser behavior
})

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.mount('#app')

// Apply dark mode based on saved user setting
try {
  const savedUserSettings = localStorage.getItem('userSettings')
  const dark = savedUserSettings ? (JSON.parse(savedUserSettings).darkMode === true) : false
  const root = document.documentElement
  if (dark) root.classList.add('dark'); else root.classList.remove('dark')
  // Listen for settings updates from SettingsModal
  window.addEventListener('settings-updated', (e) => {
    if (!e || !e.detail) return
    if (e.detail.key === 'darkMode') {
      if (e.detail.value) root.classList.add('dark'); else root.classList.remove('dark')
    }
  })
} catch (e) {}

// Frappe CSRF Shim To Fetch CSRF Token From Cookie
import '@/components/utility/_master_utility/csrf-shim.js'
