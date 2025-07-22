import alertService from "@/components/ui/ui_utility/alertService.js";
import { cloneDeep } from 'lodash-es';
import { saveRoomRevenueChanges } from './data_service.js';

// Helper function to find room details from data
function findRoomDetails(roomData, roomType, year, month) {
  // First try to find in the specific year and month
  const entries = roomData?.[year]?.[month] || [];
  const found = entries.find(e => e.room_package === roomType);
  if (found) {
    return {
      number_of_rooms: found.number_of_rooms || 0,
      rate: found.rate || 0,
      occupied_beds: found.occupied_beds || 0
    };
  }
  
  // If not found in specific month, search through all months in the year
  const yearData = roomData?.[year] || {};
  for (const monthKey in yearData) {
    const monthEntries = yearData[monthKey] || [];
    const monthFound = monthEntries.find(e => e.room_package === roomType);
    if (monthFound) {
      return {
        number_of_rooms: monthFound.number_of_rooms || 0,
        rate: monthFound.rate || 0,
        occupied_beds: monthFound.occupied_beds || 0
      };
    }
  }
  
  // Return default values if not found anywhere
  return {
    number_of_rooms: 0,
    rate: 0,
    occupied_beds: 0
  };
}

export async function saveRoomChanges(changedCells, isSaving, saveError, roomData, originalRoomData, isSaved) {
  if (changedCells.length === 0) {
    isSaved.value = true;
    return;
  }

  isSaving.value = true;
  saveError.value = "";

  try {
    // Prepare the data for saving
    const updates = [];
    
    for (const change of changedCells) {
      const { year, label, roomType, field, newValue } = change;
      
      // Find existing entry or create new one
      let entry = roomData[year]?.[label]?.find(e => e.room_package === roomType);
      
      if (!entry) {
        // Create new entry if it doesn't exist
        const details = findRoomDetails(roomData, roomType, year, label);
        entry = {
          room_package: roomType,
          number_of_rooms: details.number_of_rooms,
          rate: details.rate,
          occupied_beds: details.occupied_beds
        };
        
        // Ensure the year and month structure exists
        if (!roomData[year]) roomData[year] = {};
        if (!roomData[year][label]) roomData[year][label] = [];
        roomData[year][label].push(entry);
      }
      
      // Update the field
      entry[field] = newValue;
      
      updates.push({
        year,
        month: label,
        room_package: roomType,
        [field]: newValue
      });
    }

    // Make the actual API call to save the changes
    
    const result = await saveRoomRevenueChanges(updates);
    
    // Handle both direct response and wrapped response structures
    const responseData = result.data || result;
    if (responseData && responseData.status === 'success') {
      
      // Update original data to reflect saved state
      originalRoomData.value = cloneDeep(roomData);
      changedCells.length = 0;
      isSaved.value = true;
      
      alertService.success("Room revenue changes saved successfully!");
    } else {
      console.error('Failed to save room revenue changes:', result);
      throw new Error(result?.message || 'Failed to save changes');
    }
    
  } catch (error) {
    console.error('Error saving room revenue changes:', error);
    saveError.value = "Failed to save changes. Please try again.";
    alertService.error("Failed to save room revenue changes. Please try again.");
  } finally {
    isSaving.value = false;
  }
}