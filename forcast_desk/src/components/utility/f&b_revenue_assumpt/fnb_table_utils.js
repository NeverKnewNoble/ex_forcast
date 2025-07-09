// Utility functions for F&B table operations
import { getDaysInMonth } from '../room_revenue_assumpt./room_revenue_utils.js'

export function getFnbCellValue(fnbData, row, year, label, totalRooms = null) {
  // If this is the "Number of rooms" row, return the total rooms value
  if (row === "Number of rooms" && totalRooms !== null) {
    return totalRooms.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  // If this is the "Days of the Month" row, return the days in that month/quarter
  if (row === "Days of the Month") {
    // Check if this is quarterly display by looking at the label
    if (label === "Jan-Mar" || label === "Apr-Jun" || label === "Jul-Sep" || label === "Oct-Dec") {
      // Quarterly mode - sum up days for all 3 months in the quarter
      let totalDays = 0;
      const quarterMonths = {
        "Jan-Mar": ["Jan", "Feb", "Mar"],
        "Apr-Jun": ["Apr", "May", "Jun"],
        "Jul-Sep": ["Jul", "Aug", "Sep"],
        "Oct-Dec": ["Oct", "Nov", "Dec"]
      };
      
      const months = quarterMonths[label];
      for (const month of months) {
        totalDays += getDaysInMonth(year, month);
      }
      return totalDays.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      // Monthly mode - return days for single month
      const days = getDaysInMonth(year, label);
      return days.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  }
  
  // If this is the "Number of rooms available" row, return days * total rooms
  if (row === "Number of rooms available" && totalRooms !== null) {
    // Get the days for this month/quarter
    let days = 0;
    if (label === "Jan-Mar" || label === "Apr-Jun" || label === "Jul-Sep" || label === "Oct-Dec") {
      // Quarterly mode - sum up days for all 3 months in the quarter
      const quarterMonths = {
        "Jan-Mar": ["Jan", "Feb", "Mar"],
        "Apr-Jun": ["Apr", "May", "Jun"],
        "Jul-Sep": ["Jul", "Aug", "Sep"],
        "Oct-Dec": ["Oct", "Nov", "Dec"]
      };
      
      const months = quarterMonths[label];
      for (const month of months) {
        days += getDaysInMonth(year, month);
      }
    } else {
      // Monthly mode - get days for single month
      days = getDaysInMonth(year, label);
    }
    
    const roomsAvailable = days * totalRooms;
    return roomsAvailable.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  const raw = fnbData?.[row]?.[year]?.[label];
  let num = parseFloat(raw?.toString().replace(/,/g, ''));
  if (isNaN(num)) num = 0;
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function setFnbCellValue(fnbData, row, year, label, value) {
  if (!fnbData[row]) fnbData[row] = {};
  if (!fnbData[row][year]) fnbData[row][year] = {};
  fnbData[row][year][label] = value;
}

export function handleFnbCellInput(fnbData, params) {
  const { row, year, label, event } = params;
  if (!event || !event.target) {
    console.warn('handleFnbCellInput: event or event.target is undefined');
    return;
  }
  
  // Remove any non-numeric characters except decimal point and minus sign
  let value = event.target.innerText.replace(/[^0-9.-]/g, '');
  
  // Ensure only one decimal point
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Ensure only one minus sign at the beginning
  if (value.startsWith('-')) {
    value = '-' + value.substring(1).replace(/-/g, '');
  } else {
    value = value.replace(/-/g, '');
  }
  
  setFnbCellValue(fnbData, row, year, label, value);
}

export function handleFnbCellEditWrapper(fnbData, params) {
  const { row, year, label, event } = params;
  if (!event || !event.target) {
    console.warn('handleFnbCellEditWrapper: event or event.target is undefined');
    return;
  }
  let value = event.target.innerText.replace(/,/g, '');
  let num = parseFloat(value);
  if (isNaN(num)) num = 0;
  const formatted = num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  event.target.innerText = formatted;
  setFnbCellValue(fnbData, row, year, label, formatted);
}

export function calculateFnbTotal(fnbData, row, year, labels, totalRooms = null) {
  // If this is the "Number of rooms" row, return the total rooms value (same for all months/quarters)
  if (row === "Number of rooms" && totalRooms !== null) {
    return totalRooms.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  // If this is the "Days of the Month" row, return the total days for the year
  if (row === "Days of the Month") {
    let totalDays = 0;
    for (const label of labels) {
      // Check if this is quarterly display
      if (label === "Jan-Mar" || label === "Apr-Jun" || label === "Jul-Sep" || label === "Oct-Dec") {
        // Quarterly mode - sum up days for all 3 months in the quarter
        const quarterMonths = {
          "Jan-Mar": ["Jan", "Feb", "Mar"],
          "Apr-Jun": ["Apr", "May", "Jun"],
          "Jul-Sep": ["Jul", "Aug", "Sep"],
          "Oct-Dec": ["Oct", "Nov", "Dec"]
        };
        
        const months = quarterMonths[label];
        for (const month of months) {
          totalDays += getDaysInMonth(year, month);
        }
      } else {
        // Monthly mode - add days for single month
        totalDays += getDaysInMonth(year, label);
      }
    }
    return totalDays.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  // If this is the "Number of rooms available" row, return total rooms available for the year
  if (row === "Number of rooms available" && totalRooms !== null) {
    let totalRoomsAvailable = 0;
    for (const label of labels) {
      // Get the days for this month/quarter
      let days = 0;
      if (label === "Jan-Mar" || label === "Apr-Jun" || label === "Jul-Sep" || label === "Oct-Dec") {
        // Quarterly mode - sum up days for all 3 months in the quarter
        const quarterMonths = {
          "Jan-Mar": ["Jan", "Feb", "Mar"],
          "Apr-Jun": ["Apr", "May", "Jun"],
          "Jul-Sep": ["Jul", "Aug", "Sep"],
          "Oct-Dec": ["Oct", "Nov", "Dec"]
        };
        
        const months = quarterMonths[label];
        for (const month of months) {
          days += getDaysInMonth(year, month);
        }
      } else {
        // Monthly mode - get days for single month
        days = getDaysInMonth(year, label);
      }
      
      totalRoomsAvailable += days * totalRooms;
    }
    return totalRoomsAvailable.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  let sum = 0;
  for (const label of labels) {
    const val = parseFloat(getFnbCellValue(fnbData, row, year, label, totalRooms));
    if (!isNaN(val)) sum += val;
  }
  return sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
} 