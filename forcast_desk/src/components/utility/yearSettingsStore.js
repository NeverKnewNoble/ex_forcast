import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useYearSettingsStore = defineStore('yearSettings', () => {
  // State - Initialize with empty values for fresh installations
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
  };
}); 