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
  
  // Auto-calculate Monthly Cover based on Daily Cover
  if (row.includes('Monthly Cover')) {
    // Extract restaurant name and section from the row
    const parts = row.split('-');
    if (parts.length >= 3) {
      const restaurantName = parts[0];
      const section = parts[1];
      
      // Construct the Daily Cover row name with the month label
      const dailyCoverRow = `${restaurantName}-${section}-Daily Cover-${label}`;
      
      // Get the Daily Cover value
      const dailyCoverRaw = fnbData?.[dailyCoverRow]?.[year]?.[label];

      if (dailyCoverRaw !== undefined && dailyCoverRaw !== null && dailyCoverRaw !== "") {
        const dailyCover = parseFloat(dailyCoverRaw.toString().replace(/,/g, '')) || 0;
        
        // Get the number of days for this month/quarter
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
        
        // Calculate Monthly Cover = Daily Cover × Days
        const monthlyCover = dailyCover * days;
        return monthlyCover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }
  
  // For restaurant data, look up the specific row in fnbData
  const raw = fnbData?.[row]?.[year]?.[label];
  let num = parseFloat(raw?.toString().replace(/,/g, ''));
  if (isNaN(num)) num = 0;
  
  // Log any restaurant cell that has a non-zero value
  // if (row.includes('-') && num > 0) {
  //   console.log('Restaurant cell with non-zero value:', {
  //     row,
  //     year,
  //     label,
  //     rawValue: raw,
  //     parsedValue: num,
  //     formattedValue: num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  //   });
  // }
  
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function setFnbCellValue(fnbData, row, year, label, value) {
  // console.log('setFnbCellValue called with:', { row, year, label, value, fnbDataExists: !!fnbData });
  if (!fnbData || typeof fnbData !== 'object') {
    console.warn('setFnbCellValue: fnbData is not an object');
    return;
  }
  if (!fnbData[row]) fnbData[row] = {};
  if (!fnbData[row][year]) fnbData[row][year] = {};
  fnbData[row][year][label] = value;
  // console.log('setFnbCellValue completed. Data structure:', fnbData[row][year]);
}

// --- Shared Utility for Formatting and Cleaning (copied from expense_estimate_utils.js) ---
function formatNumberInput(event) {
  let value = event.target.innerText;
  value = value.replace(/[^\d.]/g, '');
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  const shouldFormat = !value.includes('.') || (parts.length === 2 && parts[1].length === 2);
  if (shouldFormat) {
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    const numValue = parseFloat(value) || 0;
    const formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    if (formattedValue !== event.target.innerText) {
      event.target.innerText = formattedValue;
      const range = document.createRange();
      const selection = window.getSelection();
      const textNode = event.target.firstChild || event.target;
      range.setStart(textNode, textNode.textContent.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    if (value !== event.target.innerText) {
      event.target.innerText = value;
    }
  }
  return value;
}

function cleanNumberValue(event) {
  let newValue = event.target.innerText.replace(/,/g, '').trim();
  if (newValue === '') newValue = '0.00';
  const numValue = parseFloat(newValue) || 0;
  newValue = numValue.toFixed(2);
  const formatted = numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  event.target.innerText = formatted;
  return newValue;
}

// --- Refactored Handlers ---
export function handleFnbCellInput({ row, year, label, event, fnbData, changedCells, isSaved }) {
  // console.log('handleFnbCellInput called with:', { row, year, label, event: !!event, fnbData: !!fnbData });
  if (!event || !event.target) {
    console.log('handleFnbCellInput: event or event.target is not valid, returning');
    return;
  }
  
  // Initialize fnbData if it's not valid
  if (!fnbData || typeof fnbData !== 'object') {
    console.log('handleFnbCellInput: fnbData is not valid, initializing as empty object');
    fnbData = {};
  }
  
  // Format and validate input
  const value = formatNumberInput(event);
  // Log cell change for debugging
  // console.log('Cell changed:', { row, year, label, value });
  setFnbCellValue(fnbData, row, year, label, value);
  // Track changes
  if (changedCells && isSaved) {
    const numValue = parseFloat(value) || 0;
    const newValue = numValue.toFixed(2);
    const existingChange = changedCells.find(c => c.row === row && c.year === year && c.label === label);
    if (existingChange) {
      existingChange.newValue = newValue;
    } else {
      changedCells.push({ row, year, label, newValue });
    }
    if (isSaved.value) isSaved.value = false;
  }
}

export function handleFnbCellEdit({ row, year, label, event, fnbData, changedCells, isSaved }) {
  // console.log('handleFnbCellEdit called with:', { row, year, label, event: !!event, fnbData: !!fnbData });
  if (!event || !event.target) {
    console.log('handleFnbCellEdit: event or event.target is not valid, returning');
    return;
  }
  
  // Initialize fnbData if it's not valid
  if (!fnbData || typeof fnbData !== 'object') {
    console.log('handleFnbCellEdit: fnbData is not valid, initializing as empty object');
    fnbData = {};
  }
  
  // Clean and format value on blur
  const newValue = cleanNumberValue(event);
  // console.log('Cell edited (blur):', { row, year, label, newValue });
  setFnbCellValue(fnbData, row, year, label, newValue);
  // Track changes
  if (changedCells && isSaved) {
    const existingChange = changedCells.find(c => c.row === row && c.year === year && c.label === label);
    if (existingChange) {
      existingChange.newValue = newValue;
    } else {
      changedCells.push({ row, year, label, newValue });
    }
    if (isSaved.value) isSaved.value = false;
  }
}

export function handleFnbCellFocus({ row, year, label, event }) {
  // console.log('handleFnbCellFocus called with:', { row, year, label, event: !!event });
  if (!event || !event.target) {
    console.log('handleFnbCellFocus: event or event.target is not valid, returning');
    return;
  }
  let value = event.target.innerText;
  const rawValue = value.replace(/,/g, '');
  event.target.innerText = rawValue;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(event.target);
  selection.removeAllRanges();
  selection.addRange(range);
}

// Legacy wrapper for backward compatibility
export function handleFnbCellInputLegacy(fnbData, params) {
  return handleFnbCellInput({ ...params, fnbData });
}

export function handleFnbCellEditWrapper(fnbData, params) {
  return handleFnbCellEdit({ ...params, fnbData });
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

