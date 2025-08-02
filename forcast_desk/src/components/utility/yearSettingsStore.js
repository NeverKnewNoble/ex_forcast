import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { getProjectKey, clearOldLocalStorageKeys, getAllProjectKeys } from '@/components/utility/projectLocalStorage.js';

export const useYearSettingsStore = defineStore('yearSettings', () => {

  // State - initialize with empty values, will be updated when project changes
  const fromYear = ref('');
  const toYear = ref('');
  const advancedModes = ref({});
  const annualIncrementData = ref({});

  // Function to load settings for current project
  function loadProjectSettings() {
    const project = selectedProject.value;
    if (!project || !project.project_name) {
      // Clear settings if no project selected
      fromYear.value = '';
      toYear.value = '';
      advancedModes.value = {};
      return;
    }

    // Load project-specific settings
    fromYear.value = localStorage.getItem(getProjectKey('expenseEstimateFromYear')) || '';
    toYear.value = localStorage.getItem(getProjectKey('expenseEstimateToYear')) || '';
    advancedModes.value = JSON.parse(localStorage.getItem(getProjectKey('expenseEstimateAdvancedModes')) || '{}');
    annualIncrementData.value = JSON.parse(localStorage.getItem(getProjectKey('payrollAnnualIncrementData')) || '{}');
  }

  // Actions
  function setFromYear(year) {
    fromYear.value = year;
    localStorage.setItem(getProjectKey('expenseEstimateFromYear'), year);
    
    // If toYear is now invalid (before fromYear), clear it
    if (toYear.value && parseInt(toYear.value) < parseInt(year)) {
      setToYear('');
    }
  }

  function setToYear(year) {
    toYear.value = year;
    localStorage.setItem(getProjectKey('expenseEstimateToYear'), year);
  }

  function setAdvancedMode(year, mode) {
    advancedModes.value[year] = mode;
    localStorage.setItem(getProjectKey('expenseEstimateAdvancedModes'), JSON.stringify(advancedModes.value));
  }

  function setAdvancedModes(modes) {
    advancedModes.value = { ...modes };
    localStorage.setItem(getProjectKey('expenseEstimateAdvancedModes'), JSON.stringify(advancedModes.value));
  }

  function clearYearSettings() {
    fromYear.value = '';
    toYear.value = '';
    advancedModes.value = {};
    annualIncrementData.value = {};
    
    // Clear project-specific localStorage items
    localStorage.removeItem(getProjectKey('expenseEstimateFromYear'));
    localStorage.removeItem(getProjectKey('expenseEstimateToYear'));
    localStorage.removeItem(getProjectKey('expenseEstimateAdvancedModes'));
    localStorage.removeItem(getProjectKey('payrollAnnualIncrementData'));
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

  // Watch for project changes and reload settings
  watch(selectedProject, () => {
    loadProjectSettings();
  }, { deep: true });

  // Initialize settings for current project
  loadProjectSettings();

  // Watchers to keep localStorage in sync if values change elsewhere
  watch(fromYear, (val) => localStorage.setItem(getProjectKey('expenseEstimateFromYear'), val));
  watch(toYear, (val) => localStorage.setItem(getProjectKey('expenseEstimateToYear'), val));
  watch(advancedModes, (val) => localStorage.setItem(getProjectKey('expenseEstimateAdvancedModes'), JSON.stringify(val)), { deep: true });
  watch(annualIncrementData, (val) => localStorage.setItem(getProjectKey('payrollAnnualIncrementData'), JSON.stringify(val)), { deep: true });

  return {
    fromYear,
    toYear,
    advancedModes,
    annualIncrementData,
    setFromYear,
    setToYear,
    setAdvancedMode,
    setAdvancedModes,
    clearYearSettings,
    getFilteredToYears,
    loadProjectSettings,
    clearOldLocalStorageKeys,
    getAllProjectKeys,
  };
}); 