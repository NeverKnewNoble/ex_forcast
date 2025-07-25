import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useYearSettingsStore = defineStore('yearSettings', () => {
  // State - Don't load from localStorage on initialization to avoid pre-populating on fresh installs
  const fromYear = ref('');
  const toYear = ref('');
  const advancedModes = ref({});

  // Actions
  function setFromYear(year) {
    fromYear.value = year;
    localStorage.setItem('expenseEstimateFromYear', year);
  }

  function setToYear(year) {
    toYear.value = year;
    localStorage.setItem('expenseEstimateToYear', year);
  }

  function setAdvancedMode(year, mode) {
    advancedModes.value[year] = mode;
    localStorage.setItem('expenseEstimateAdvancedModes', JSON.stringify(advancedModes.value));
  }

  function setAdvancedModes(modes) {
    advancedModes.value = { ...modes };
    localStorage.setItem('expenseEstimateAdvancedModes', JSON.stringify(advancedModes.value));
  }

  function clearYearSettings() {
    fromYear.value = '';
    toYear.value = '';
    advancedModes.value = {};
    localStorage.removeItem('expenseEstimateFromYear');
    localStorage.removeItem('expenseEstimateToYear');
    localStorage.removeItem('expenseEstimateAdvancedModes');
  }

  // Function to load settings from localStorage (call this when user explicitly wants to restore settings)
  function loadFromLocalStorage() {
    const savedFromYear = localStorage.getItem('expenseEstimateFromYear');
    const savedToYear = localStorage.getItem('expenseEstimateToYear');
    const savedAdvancedModes = localStorage.getItem('expenseEstimateAdvancedModes');
    
    if (savedFromYear && savedFromYear !== '') fromYear.value = savedFromYear;
    if (savedToYear && savedToYear !== '') toYear.value = savedToYear;
    if (savedAdvancedModes && savedAdvancedModes !== '{}') {
      try {
        const parsed = JSON.parse(savedAdvancedModes);
        if (Object.keys(parsed).length > 0) {
          advancedModes.value = parsed;
        }
      } catch (error) {
        console.error('Error parsing advanced modes from localStorage:', error);
        advancedModes.value = {};
      }
    }
  }

  // Watchers to keep localStorage in sync if values change elsewhere
  watch(fromYear, (val) => localStorage.setItem('expenseEstimateFromYear', val));
  watch(toYear, (val) => localStorage.setItem('expenseEstimateToYear', val));
  watch(advancedModes, (val) => localStorage.setItem('expenseEstimateAdvancedModes', JSON.stringify(val)), { deep: true });

  return {
    fromYear,
    toYear,
    advancedModes,
    setFromYear,
    setToYear,
    setAdvancedMode,
    setAdvancedModes,
    clearYearSettings,
    loadFromLocalStorage,
  };
}); 