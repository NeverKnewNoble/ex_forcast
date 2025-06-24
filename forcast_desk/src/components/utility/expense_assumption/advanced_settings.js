import { ref, watch } from 'vue'

// Advanced settings state management
export const showAdvanced = ref(false)
export const advancedModes = ref({})

export function initializeAdvancedModes(visibleYears, displayMode) {
  visibleYears.forEach(year => {
    if (!advancedModes.value[year]) {
      advancedModes.value[year] = displayMode
    }
  })
}

export function applyAdvancedSettings() {
  showAdvanced.value = false
}

export function getColumnLabelsForYear(year, advancedModes, displayMode, getColumnLabels) {
  return getColumnLabels(advancedModes[year] || displayMode)
} 