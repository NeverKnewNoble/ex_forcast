// State management utilities for F&B Revenue Assumptions page
import { cloneDeep } from 'lodash-es';
import { extractAllExpenses } from "@/components/utility/expense_assumption/index.js";

// Wrapper function for saveChanges
export async function saveChangesWrapper(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData, saveChanges) {
  await saveChanges(changedCells, isSaving, saveError, expenseData, originalExpenseData, isSaved, loadExpenseData);
}

// Initialize data on component mount
export async function initializeData(years, expenseData, originalExpenseData, expenses, expenseOptions, categoryOptions, costTypeOptions, fromYear, toYear, isSaved, restaurantList, totalRooms, loadYearOptions, loadExpenseData, getExpenseList, getExpenseFieldOptions, getRestaurants) {
  try {
    years.value = await loadYearOptions();
    expenseData.value = await loadExpenseData();
    originalExpenseData.value = cloneDeep(expenseData.value); // Store original
    expenses.value = extractAllExpenses(expenseData.value);
    expenseOptions.value = (await getExpenseList())?.map(name => ({ label: name, value: name })) || [];
    
    // Use the options API for modal dropdowns (shows all available options)
    const fieldOptions = await getExpenseFieldOptions();
    categoryOptions.value = fieldOptions.hospitality_category.map(category => ({ label: category, value: category }));
    costTypeOptions.value = fieldOptions.cost_type.map(costType => ({ label: costType, value: costType }));
    

    isSaved.value = true;
    restaurantList.value = await getRestaurants();
    
    // Load total rooms from localStorage only if user has explicitly set it
    const savedRooms = localStorage.getItem('totalRooms');
    if (savedRooms && savedRooms !== '0') {
      totalRooms.value = parseInt(savedRooms) || 0;
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
}


// Setup advanced settings watcher
export function setupAdvancedSettingsWatcher(showAdvanced, advancedModes, tempAdvancedModes, watch) {
  // When opening the modal, copy the current settings
  const unwatchShowAdvanced = watch(showAdvanced, (val) => {
    if (val && advancedModes.value && tempAdvancedModes.value) {
      tempAdvancedModes.value = { ...advancedModes.value };
    }
  });

  return { unwatchShowAdvanced };
}

// Setup unsaved changes warning
export function setupUnsavedWarning(isSaved, handleBeforeUnload, watch) {
  // Watch for unsaved changes to show warning on page refresh
  const unwatchIsSaved = watch(isSaved, (newValue) => {
    if (newValue !== undefined) {
      if (!newValue) {
        // Add beforeunload event listener when there are unsaved changes
        window.addEventListener('beforeunload', handleBeforeUnload);
      } else {
        // Remove beforeunload event listener when changes are saved
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    }
  });

  return { unwatchIsSaved };
}

// Setup periodic checks
export function setupPeriodicChecks(hospitalityExperience, totalRooms, isSyncedWithRoomRevenue, checkHospitalityExperience, checkRoomRevenueSync) {
  // Check for changes periodically
  const hospitalityInterval = setInterval(() => {
    if (hospitalityExperience && hospitalityExperience.value !== undefined) {
      checkHospitalityExperience(hospitalityExperience);
    }
  }, 1000);
  
  // Check for Room Revenue total changes periodically
  const roomRevenueInterval = setInterval(() => {
    if (totalRooms && totalRooms.value !== undefined && isSyncedWithRoomRevenue && isSyncedWithRoomRevenue.value !== undefined) {
      checkRoomRevenueSync(totalRooms, isSyncedWithRoomRevenue);
    }
  }, 3000);

  return {
    hospitalityInterval,
    roomRevenueInterval
  };
}

// Cleanup function for intervals
export function cleanupIntervals(intervals) {
  if (intervals.hospitalityInterval) {
    clearInterval(intervals.hospitalityInterval);
  }
  if (intervals.roomRevenueInterval) {
    clearInterval(intervals.roomRevenueInterval);
  }
} 