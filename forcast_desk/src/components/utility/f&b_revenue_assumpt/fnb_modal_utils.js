import { ref, watch } from 'vue';
import { currentDoubleOccupancyByYear } from './fnb_table_utils.js';
import alertService from "@/components/ui/ui_utility/alertService.js";
import { getProjectKey } from '@/components/utility/_master_utility/projectLocalStorage.js';

// Modal state management
export const showAdvanced = ref(false);
export const showDoubleOccupancyModal = ref(false);
export const showDefaultBreakfastModal = ref(false);
export const showCreateRestaurantModal = ref(false);
export const showDeleteRestaurantModal = ref(false);
export const showResetRestaurantsModal = ref(false);
export const showUnsavedWarning = ref(false);

// Modal form data
export const tempAdvancedModes = ref({});
export const tempDoubleOccupancyByYear = ref({});
export const tempDefaultBreakfastOutlet = ref("");
export const newRestaurantName = ref("");
export const isCreatingRestaurant = ref(false);
export const createRestaurantError = ref("");
export const restaurantToDelete = ref(null);

// Advanced Settings Modal Functions
export function applyAdvancedSettings(advancedModes) {
  advancedModes.value = { ...tempAdvancedModes.value };
  showAdvanced.value = false;
}

export function cancelAdvancedSettings() {
  showAdvanced.value = false;
}

// Double Occupancy Modal Functions
export function applyDoubleOccupancySettings(doubleOccupancyByYear, projectName = null) {
  // Update the main double occupancy ref
  doubleOccupancyByYear.value = { ...tempDoubleOccupancyByYear.value };
  
  // Save to project-specific localStorage for persistence
  if (projectName) {
    localStorage.setItem(getProjectKey('doubleOccupancyByYear'), JSON.stringify(doubleOccupancyByYear.value));
  } else {
    // Fallback to generic key if no project specified
    localStorage.setItem('doubleOccupancyByYear', JSON.stringify(doubleOccupancyByYear.value));
  }
  
  // Update reactive source so tables update immediately
  try {
    currentDoubleOccupancyByYear.value = { ...doubleOccupancyByYear.value };
  } catch (e) {}
  
  alertService.success('Double occupancy updated');
  showDoubleOccupancyModal.value = false;
  
  // Set flag to show refresh success alert and trigger page refresh
  localStorage.setItem('showRefreshSuccess', 'true');
  setTimeout(() => {
    window.location.reload();
  }, 500); // Small delay to ensure the success message is shown
}

export function cancelDoubleOccupancySettings() {
  showDoubleOccupancyModal.value = false;
}

// Default Breakfast Outlet Modal Functions
export function applyDefaultBreakfastSettings(defaultBreakfastOutlet, projectName = null) {
  // Ensure defaultBreakfastOutlet is a ref object
  if (defaultBreakfastOutlet && typeof defaultBreakfastOutlet === 'object' && 'value' in defaultBreakfastOutlet) {
    defaultBreakfastOutlet.value = tempDefaultBreakfastOutlet.value;
  }
  // Save to project-specific localStorage for persistence
  if (projectName) {
    localStorage.setItem(getProjectKey('defaultBreakfastOutlet'), tempDefaultBreakfastOutlet.value);
  } else {
    // Fallback to generic key if no project specified
    localStorage.setItem('defaultBreakfastOutlet', tempDefaultBreakfastOutlet.value);
  }
  showDefaultBreakfastModal.value = false;
  alertService.success('Default breakfast outlet updated successfully!');
  
  // Set flag to show success alert after reload and refresh the page
  localStorage.setItem('showRefreshSuccess', 'true');
  setTimeout(() => {
    window.location.reload();
  }, 500); // Small delay to ensure the success message is shown
}

export function cancelDefaultBreakfastSettings() {
  showDefaultBreakfastModal.value = false;
}

// Create Restaurant Modal Functions
export function handleCreateRestaurant(createRestaurant, getRestaurants, restaurantList, project = null) {
  if (!newRestaurantName.value.trim()) {
    createRestaurantError.value = "Restaurant name is required.";
    return;
  }
  
  if (!project) {
    createRestaurantError.value = "No project selected. Please select a project first.";
    return;
  }
  
  isCreatingRestaurant.value = true;
  createRestaurantError.value = "";
  
  createRestaurant({ cover_name: newRestaurantName.value, project: project })
    .then(result => {
      isCreatingRestaurant.value = false;
      if (result.success) {
        alertService.success("Restaurant created successfully!");
        showCreateRestaurantModal.value = false;
        newRestaurantName.value = "";
        // Refresh restaurant list to include the new restaurant
        return getRestaurants(project);
      } else {
        createRestaurantError.value = result.error || "Failed to create restaurant.";
      }
    })
    .then(restaurants => {
      if (restaurants) {
        restaurantList.value = restaurants;
      }
    })
    .catch(error => {
      isCreatingRestaurant.value = false;
      createRestaurantError.value = "An error occurred while creating the restaurant.";
      console.error('Error creating restaurant:', error);
    });
}

// Delete Restaurant Modal Functions
export function cancelDeleteRestaurant() {
  showDeleteRestaurantModal.value = false;
  restaurantToDelete.value = null;
}

export function confirmDeleteRestaurant(deleteRestaurant) {
  if (restaurantToDelete.value) {
    deleteRestaurant(restaurantToDelete.value);
    showDeleteRestaurantModal.value = false;
    restaurantToDelete.value = null;
  }
}

// Reset Restaurants Modal Functions
export function cancelResetRestaurants() {
  showResetRestaurantsModal.value = false;
}

export function confirmResetRestaurants(resetToDefaultRestaurants) {
  resetToDefaultRestaurants();
  showResetRestaurantsModal.value = false;
}

// Unsaved Changes Warning Modal Functions
export function cancelNavigation() {
  showUnsavedWarning.value = false;
}

export function confirmNavigation() {
  showUnsavedWarning.value = false;
  // Allow the navigation to proceed by removing the event listener temporarily
  window.removeEventListener('beforeunload', handleBeforeUnload);
  // Trigger the actual navigation (refresh, close, etc.)
  window.location.reload();
}

// Input validation functions
export function allowOnlyNumbers(event) {
  // Allow: backspace, delete, tab, escape, enter, decimal point
  const allowedKeys = [8, 9, 27, 13, 46, 110, 190]; // backspace, tab, escape, enter, delete, decimal
  const allowedKeyCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // 0-9
  
  if (allowedKeys.includes(event.keyCode) || allowedKeyCodes.includes(event.keyCode)) {
    return;
  }
  
  // Prevent the input
  event.preventDefault();
}

export function handleDoubleOccupancyInput(event, year) {
  // Accept decimals and store as number
  let value = event.target.value;
  // Remove any non-numeric characters except decimal point
  value = value.replace(/[^0-9.]/g, '');
  // Ensure only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  // Store as number if valid, otherwise empty string
  const num = parseFloat(value);
  tempDoubleOccupancyByYear.value[year] = !isNaN(num) ? num : '';
}

// Before unload handler for unsaved changes
export function handleBeforeUnload(event, isSaved) {
  if (!isSaved.value) {
    // Standard browser warning
    event.preventDefault();
    event.returnValue = 'You have unsaved changes that may be discarded if not saved. Are you sure you want to leave?';
    return event.returnValue;
  }
}

// Modal watchers for copying current settings
export function setupModalWatchers(advancedModes, doubleOccupancyByYear, defaultBreakfastOutlet) {
  // When opening the advanced modal, copy the current settings
  watch(showAdvanced, (val) => {
    if (val) {
      tempAdvancedModes.value = { ...advancedModes.value };
    }
  });
  
  // When opening the double occupancy modal, copy the current settings
  watch(showDoubleOccupancyModal, (val) => {
    if (val) {
      tempDoubleOccupancyByYear.value = { ...doubleOccupancyByYear.value };
    }
  });
  
  // When opening the default breakfast outlet modal, copy the current setting
  watch(showDefaultBreakfastModal, (val) => {
    if (val) {
      // Ensure defaultBreakfastOutlet is a ref object before accessing .value
      if (defaultBreakfastOutlet && typeof defaultBreakfastOutlet === 'object' && 'value' in defaultBreakfastOutlet) {
        tempDefaultBreakfastOutlet.value = defaultBreakfastOutlet.value || "";
      } else {
        tempDefaultBreakfastOutlet.value = "";
      }
    }
  });
}

// Clean up function for modal event listeners
export function cleanupModalListeners() {
  window.removeEventListener('beforeunload', handleBeforeUnload);
} 