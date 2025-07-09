// Computed properties utilities for F&B Revenue Assumptions page
import { getVisibleYears } from "@/components/utility/expense_assumption/index.js";

// Computed property for visible years
export function createVisibleYearsComputed(fromYear, toYear, computed) {
  return computed(() => {
    if (fromYear && toYear && fromYear.value !== undefined && toYear.value !== undefined) {
      const years = getVisibleYears(fromYear.value, toYear.value);
      return years;
    }
    return [];
  });
}

// Computed property for room revenue sync status
export function createRoomRevenueSyncComputed(totalRooms, computed) {
  return computed(() => {
    if (totalRooms && totalRooms.value !== undefined) {
      const roomRevenueTotal = localStorage.getItem('totalNumberOfRooms');
      return roomRevenueTotal && parseInt(roomRevenueTotal) > 0 && 
             parseInt(roomRevenueTotal) === totalRooms.value;
    }
    return false;
  });
} 