import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useYearSettingsStore = defineStore('yearSettings', () => {
  // Check if this is a fresh installation (no project selected and no year settings)
  const isFreshInstallation = () => {
    const hasProject = localStorage.getItem('selectedProject');
    const hasYearSettings = localStorage.getItem('expenseEstimateFromYear') || localStorage.getItem('expenseEstimateToYear');
    return !hasProject && !hasYearSettings;
  };

  // Clear localStorage for fresh installations
  const clearForFreshInstallation = () => {
    if (isFreshInstallation()) {
      localStorage.removeItem('expenseEstimateFromYear');
      localStorage.removeItem('expenseEstimateToYear');
      localStorage.removeItem('expenseEstimateAdvancedModes');
      localStorage.removeItem('totalNumberOfRooms');
      localStorage.removeItem('totalRooms');
      localStorage.removeItem('marketSegmentation');
      localStorage.removeItem('hospitalityExperience');
      return true;
    }
    return false;
  };

  // State - Initialize with values from localStorage if they exist
  const fromYear = ref(localStorage.getItem('expenseEstimateFromYear') || '');
  const toYear = ref(localStorage.getItem('expenseEstimateToYear') || '');
  const advancedModes = ref(
    JSON.parse(localStorage.getItem('expenseEstimateAdvancedModes') || '{}')
  );

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
    clearForFreshInstallation,
    isFreshInstallation,
  };
}); 