import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useYearSettingsStore = defineStore('yearSettings', () => {
  // State
  const fromYear = ref(localStorage.getItem('expenseEstimateFromYear') || '');
  const toYear = ref(localStorage.getItem('expenseEstimateToYear') || '');
  const advancedModes = ref(
    JSON.parse(localStorage.getItem('expenseEstimateAdvancedModes') || '{}')
  );

  // Actions
  function setFromYear(year) {
    fromYear.value = year;
    localStorage.setItem('expenseEstimateFromYear', year);
    
    // If toYear is now invalid (before fromYear), clear it
    if (toYear.value && parseInt(toYear.value) < parseInt(year)) {
      setToYear('');
    }
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

  // Function to get filtered years for "To Year" dropdown
  function getFilteredToYears(allYears) {
    if (!fromYear.value) {
      return allYears; // If no fromYear is selected, show all years
    }
    
    const fromYearInt = parseInt(fromYear.value);
    return allYears.filter(year => {
      const yearInt = parseInt(year);
      return yearInt >= fromYearInt; // Only show years >= fromYear
    });
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
    getFilteredToYears,
  };
}); 