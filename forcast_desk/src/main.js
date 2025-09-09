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
import { debugLocalStorage, migrateToProjectSpecificKeys, getAllProjectKeys } from '@/components/utility/projectLocalStorage.js'

// Import unified cache service
import { unifiedCacheService } from '@/components/utility/_master_utility/unifiedCacheService.js'

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

// Initialize unified cache service
unifiedCacheService.initialize().then(() => {
  // console.log('[MAIN] Cache service initialized')
}).catch(error => {
  console.error('[MAIN] Failed to initialize cache service:', error)
})

// Add global debug functions for testing project-specific localStorage
window.debugProjectLocalStorage = debugLocalStorage
window.migrateToProjectSpecificKeys = migrateToProjectSpecificKeys
window.getAllProjectKeys = getAllProjectKeys

// Add cache service to global scope for debugging
window.unifiedCacheService = unifiedCacheService

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
