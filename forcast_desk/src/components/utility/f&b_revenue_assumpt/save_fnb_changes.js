// Save changes utility for F&B Revenue data
import { saveFnbRevenueChanges } from './fnb_data_service.js';
import alertService from '@/components/ui/ui_utility/alertService.js';

/**
 * Save F&B revenue changes to the server
 * @param {Array} changedCells - Array of changed cell objects
 * @param {Object} isSaving - Reactive reference for saving state
 * @param {Object} saveError - Reactive reference for save error
 * @param {Object} fnbData - Current F&B data
 * @param {Object} originalFnbData - Original F&B data for comparison
 * @param {Object} isSaved - Reactive reference for saved state
 * @param {Function} loadFnbData - Function to reload F&B data
 * @param {string} project - Project name to filter data
 */
export async function saveFnbChanges(changedCells, isSaving, saveError, fnbData, originalFnbData, isSaved, loadFnbData, project = null) {
  if (isSaving.value) {
    return; // Already saving
  }

  if (changedCells.value.length === 0) {
    alertService.info("No changes to save");
    return;
  }

  isSaving.value = true;
  saveError.value = "";

  try {
    // Convert changed cells to the format expected by the API
    const changes = [];
    
   //  // console.log('Processing changedCells:', changedCells.value);
    
    for (const change of changedCells.value) {
      try {
        const rowKeyObj = JSON.parse(change.row);
       //  // console.log('Parsed rowKeyObj:', rowKeyObj);
        
        // Skip calculated totals and invalid data
        if (rowKeyObj.type && (
          rowKeyObj.type.startsWith('Total ') || 
          rowKeyObj.section === 'Total' ||
          rowKeyObj.type === 'Breakfast Revenue' ||
          rowKeyObj.type === 'Lunch Revenue' ||
          rowKeyObj.type === 'Dinner Revenue'
        )) {
       //  //   console.log('Skipping calculated total:', rowKeyObj);
          continue;
        }
        
        changes.push({
          year: change.year,
          month: change.label,
          restaurant: rowKeyObj.restaurant,
          cover_category: rowKeyObj.section,
          cover_detail: rowKeyObj.type,
          amount: parseFloat(change.newValue) || 0
        });
      } catch (error) {
        console.warn('Failed to parse row key for change:', change);
        continue;
      }
    }

   //  // console.log('Prepared changes for API:', changes);

    // Save only the specific changes to server
    const result = await saveFnbRevenueChanges(changes, project);
    
    if (result.message?.status === 'success') {
      // Update original data to match current data
      Object.assign(originalFnbData, cloneDeep(fnbData));
      
      // Clear changed cells
      changedCells.value = [];
      
      // Mark as saved
      isSaved.value = true;
      
      alertService.success(`Successfully saved changes`);
    } else {
      const errorMsg = typeof result.message?.message === 'string' ? result.message.message : 'Save failed.';
      throw new Error(errorMsg);
    }

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error saving F&B changes:', error);
    }
    saveError.value = error.message || 'Failed to save changes';
    alertService.error(`Save failed: ${saveError.value}`);
  } finally {
    isSaving.value = false;
  }
}

/**
 * Clone deep utility function
 * @param {*} obj - Object to clone
 * @returns {*} Deep cloned object
 */
function cloneDeep(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => cloneDeep(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = cloneDeep(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
} 