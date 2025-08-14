// Utility functions for F&B table operations
import { ref } from 'vue'
import { getDaysInMonth } from '../room_revenue_assumpt./room_revenue_utils.js'

// Reactive source for Double Occupancy, to avoid relying on localStorage reads
export const currentDoubleOccupancyByYear = ref({})

// Helper function to create structured row keys
function createRowKey(restaurantName, section, type, label = null) {
  const rowKey = {
    restaurant: restaurantName,
    section: section,
    type: type,
    label: label
  };
  return JSON.stringify(rowKey);
}

// Helper function to parse row key back to object
function parseRowKey(rowKeyString) {
  // Only try to parse if the string looks like JSON (starts with { and ends with })
  if (typeof rowKeyString === 'string' && rowKeyString.trim().startsWith('{') && rowKeyString.trim().endsWith('}')) {
    try {
      return JSON.parse(rowKeyString);
    } catch (error) {
      console.warn('Failed to parse row key:', rowKeyString);
      return null;
    }
  }
  // If it's not a JSON string, return null (this is a simple string row name)
  return null;
}


// Helper function to calculate Monthly Cover without recursion
function calculateMonthlyCoverDirectly(fnbData, restaurantName, section, year, label) {
  // Construct the Daily Cover row key (without label)
  const dailyCoverRowKey = JSON.stringify({
    restaurant: restaurantName,
    section: section,
    type: 'Daily Cover'
  });
  
  // Get the Daily Cover value
  const dailyCoverRaw = fnbData?.[dailyCoverRowKey]?.[year]?.[label];

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
    return dailyCover * days;
  }
  return 0;
}


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
  
  // For restaurant data, first try to parse the row key to see if it's a structured key
  let rowKeyObj = null;
  let rowType = null;
  
  try {
    rowKeyObj = parseRowKey(row);
    if (rowKeyObj) {
      rowType = rowKeyObj.type;
    }
  } catch (error) {
    // If parsing fails, treat as legacy string format
    rowType = row;
  }

  // Auto-calculate Monthly Cover based on Daily Cover
  if (rowType === 'Monthly Cover') {
    if (rowKeyObj) {
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      return monthlyCover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Auto-calculate Lunch food revenue: Monthly Cover × Average check food
  if (rowType === 'Lunch food revenue') {
    if (rowKeyObj) {
      // Get Monthly Cover value using helper function to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      
      // Get Average check food value
      const avgCheckFoodRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check food'
      });
      const avgCheckFoodRaw = fnbData?.[avgCheckFoodRowKey]?.[year]?.[label];
      
      if (avgCheckFoodRaw !== undefined && avgCheckFoodRaw !== null && avgCheckFoodRaw !== "") {
        const avgCheckFood = parseFloat(avgCheckFoodRaw.toString().replace(/,/g, '')) || 0;
        
        // Calculate Lunch food revenue = Monthly Cover × Average check food
        const lunchFoodRevenue = monthlyCover * avgCheckFood;
        return lunchFoodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }

  // Auto-calculate Lunch beverage revenue: Monthly Cover × Average check beverage
  if (rowType === 'Lunch beverage revenue') {
    if (rowKeyObj) {
      // Get Monthly Cover value using helper function to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      
      // Get Average check beverage value
      const avgCheckBeverageRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check beverage'
      });
      const avgCheckBeverageRaw = fnbData?.[avgCheckBeverageRowKey]?.[year]?.[label];
      
      if (avgCheckBeverageRaw !== undefined && avgCheckBeverageRaw !== null && avgCheckBeverageRaw !== "") {
        const avgCheckBeverage = parseFloat(avgCheckBeverageRaw.toString().replace(/,/g, '')) || 0;
        
        // Calculate Lunch beverage revenue = Monthly Cover × Average check beverage
        const lunchBeverageRevenue = monthlyCover * avgCheckBeverage;
        return lunchBeverageRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }

  // Auto-calculate Dinner food revenue: Monthly Cover × Average check food
  if (rowType === 'Dinner food revenue') {
    if (rowKeyObj) {
      // Get Monthly Cover value using helper function to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      
      // Get Average check food value
      const avgCheckFoodRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check food'
      });
      const avgCheckFoodRaw = fnbData?.[avgCheckFoodRowKey]?.[year]?.[label];
      
      if (avgCheckFoodRaw !== undefined && avgCheckFoodRaw !== null && avgCheckFoodRaw !== "") {
        const avgCheckFood = parseFloat(avgCheckFoodRaw.toString().replace(/,/g, '')) || 0;
        
        // Calculate Dinner food revenue = Monthly Cover × Average check food
        const dinnerFoodRevenue = monthlyCover * avgCheckFood;
        return dinnerFoodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }

  // Auto-calculate Dinner beverage revenue: Monthly Cover × Average check beverage
  if (rowType === 'Dinner beverage revenue') {
    if (rowKeyObj) {
      // Get Monthly Cover value using helper function to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      
      // Get Average check beverage value
      const avgCheckBeverageRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check beverage'
      });
      const avgCheckBeverageRaw = fnbData?.[avgCheckBeverageRowKey]?.[year]?.[label];
      
      if (avgCheckBeverageRaw !== undefined && avgCheckBeverageRaw !== null && avgCheckBeverageRaw !== "") {
        const avgCheckBeverage = parseFloat(avgCheckBeverageRaw.toString().replace(/,/g, '')) || 0;
        const dinnerBeverageRevenue = monthlyCover * avgCheckBeverage;
        return dinnerBeverageRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }

  // Auto-calculate Lunch Revenue: Lunch food revenue + Lunch beverage revenue
  if (rowType === 'Lunch Revenue') {
    if (rowKeyObj) {
      // Calculate Lunch food revenue directly to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      const avgCheckFoodRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check food'
      });
      const avgCheckFoodRaw = fnbData?.[avgCheckFoodRowKey]?.[year]?.[label];
      const avgCheckFood = parseFloat(avgCheckFoodRaw?.toString().replace(/,/g, '')) || 0;
      const lunchFoodRevenue = monthlyCover * avgCheckFood;
      
      // Calculate Lunch beverage revenue directly to avoid recursion
      const avgCheckBeverageRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check beverage'
      });
      const avgCheckBeverageRaw = fnbData?.[avgCheckBeverageRowKey]?.[year]?.[label];
      const avgCheckBeverage = parseFloat(avgCheckBeverageRaw?.toString().replace(/,/g, '')) || 0;
      const lunchBeverageRevenue = monthlyCover * avgCheckBeverage;
      
      // Calculate Lunch Revenue = Lunch food revenue + Lunch beverage revenue
      const lunchRevenue = lunchFoodRevenue + lunchBeverageRevenue;
      return lunchRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Auto-calculate Dinner Revenue: Dinner food revenue + Dinner beverage revenue
  if (rowType === 'Dinner Revenue') {
    if (rowKeyObj) {
      // Calculate Dinner food revenue directly to avoid recursion
      const monthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, rowKeyObj.section, year, label);
      const avgCheckFoodRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check food'
      });
      const avgCheckFoodRaw = fnbData?.[avgCheckFoodRowKey]?.[year]?.[label];
      const avgCheckFood = parseFloat(avgCheckFoodRaw?.toString().replace(/,/g, '')) || 0;
      const dinnerFoodRevenue = monthlyCover * avgCheckFood;
      
      // Calculate Dinner beverage revenue directly to avoid recursion
      const avgCheckBeverageRowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: 'Average check beverage'
      });
      const avgCheckBeverageRaw = fnbData?.[avgCheckBeverageRowKey]?.[year]?.[label];
      const avgCheckBeverage = parseFloat(avgCheckBeverageRaw?.toString().replace(/,/g, '')) || 0;
      const dinnerBeverageRevenue = monthlyCover * avgCheckBeverage;
      
      // Calculate Dinner Revenue = Dinner food revenue + Dinner beverage revenue
      const dinnerRevenue = dinnerFoodRevenue + dinnerBeverageRevenue;
      return dinnerRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  
  // Auto-calculate Total Cover: sum of Breakfast, Lunch, and Dinner Monthly Covers
  if (rowType === 'Total Cover') {
    if (rowKeyObj) {
      const lunchMonthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, 'Lunch Revenue', year, label);
      const dinnerMonthlyCover = calculateMonthlyCoverDirectly(fnbData, rowKeyObj.restaurant, 'Dinner Revenue', year, label);
      
      // Get Breakfast Covers value - handle default breakfast outlet properly
      let breakfastCovers = 0;
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      if (defaultBreakfastOutlet === rowKeyObj.restaurant) {
        // For default breakfast outlet, calculate Breakfast Covers (equals Number of guests)
        if (typeof getDaysInMonth === 'function' && totalRooms) {
          const days = getDaysInMonth(year, label);
          const roomsAvailable = days * totalRooms;
          
          // Get double occupancy value (reactive only)
          const reactiveMap = currentDoubleOccupancyByYear.value || {};
          let doubleOccupancy = 0;
          let doubleOccupancyValue = reactiveMap[year];
          if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null && doubleOccupancyValue !== '') {
            doubleOccupancy = parseFloat(doubleOccupancyValue);
          }
          
          // Calculate breakfast covers (equals number of guests for default outlet)
          breakfastCovers = doubleOccupancy * roomsAvailable;
        }
      } else {
        // For non-default breakfast outlets, get from fnbData
        const breakfastCoversRowKey = JSON.stringify({
          restaurant: rowKeyObj.restaurant,
          section: 'Breakfast Revenue',
          type: 'Breakfast Covers'
        });
        const breakfastCoversRaw = fnbData?.[breakfastCoversRowKey]?.[year]?.[label];
        breakfastCovers = parseFloat(breakfastCoversRaw?.toString().replace(/,/g, '')) || 0;
      }
      
      const totalCover = lunchMonthlyCover + dinnerMonthlyCover + breakfastCovers;
      return totalCover.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  // Auto-calculate Total Food Revenue: sum of Lunch food revenue, Dinner food revenue, and Breakfast Revenue
  if (rowType === 'Total Food Revenue') {
    if (rowKeyObj) {
      // Lunch food revenue
      const lunchFoodRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Lunch Revenue', type: 'Lunch food revenue', label }),
        year,
        label
      );
      // Dinner food revenue
      const dinnerFoodRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Dinner Revenue', type: 'Dinner food revenue', label }),
        year,
        label
      );
      // Breakfast Revenue (already a row type)
      const breakfastRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Breakfast Revenue', type: 'Breakfast Revenue', label }),
        year,
        label
      );
      // Parse to float and sum
      const total = [lunchFoodRevenue, dinnerFoodRevenue, breakfastRevenue]
        .map(v => parseFloat((v || '0').toString().replace(/,/g, '')))
        .reduce((a, b) => a + b, 0);
      return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  
  // Auto-calculate Total Beverage Revenue: sum of Lunch beverage revenue and Dinner beverage revenue
  if (rowType === 'Total Beverage Revenue') {
    if (rowKeyObj) {
      // Lunch beverage revenue
      const lunchBeverageRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Lunch Revenue', type: 'Lunch beverage revenue', label }),
        year,
        label
      );
      // Dinner beverage revenue
      const dinnerBeverageRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Dinner Revenue', type: 'Dinner beverage revenue', label }),
        year,
        label
      );
      // Parse to float and sum
      const total = [lunchBeverageRevenue, dinnerBeverageRevenue]
        .map(v => parseFloat((v || '0').toString().replace(/,/g, '')))
        .reduce((a, b) => a + b, 0);
      return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  
  // Auto-calculate Total Revenue: sum of Total Food Revenue and Total Beverage Revenue
  if (rowType === 'Total Revenue') {
    if (rowKeyObj) {
      // Total Food Revenue
      const totalFoodRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Total', type: 'Total Food Revenue', label }),
        year,
        label
      );
      // Total Beverage Revenue
      const totalBeverageRevenue = getFnbCellValue(
        fnbData,
        JSON.stringify({ restaurant: rowKeyObj.restaurant, section: 'Total', type: 'Total Beverage Revenue', label }),
        year,
        label
      );
      // Parse to float and sum
      const total = [totalFoodRevenue, totalBeverageRevenue]
        .map(v => parseFloat((v || '0').toString().replace(/,/g, '')))
        .reduce((a, b) => a + b, 0);
      return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  
  // Auto-calculate Breakfast Covers: if default breakfast outlet, use Number of guests value
  if (rowType === 'Breakfast Covers') {
    if (rowKeyObj) {
      // Check if this restaurant is the default breakfast outlet
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      if (defaultBreakfastOutlet === rowKeyObj.restaurant) {
        // For default breakfast outlet, use Number of guests value
        // Get Number of guests value
        let numberOfGuests = 0;
        if (typeof getDaysInMonth === 'function' && totalRooms) {
          const days = getDaysInMonth(year, label);
          const roomsAvailable = days * totalRooms;
          
          // Get double occupancy value (reactive only)
          const reactiveMap2 = currentDoubleOccupancyByYear.value || {};
          let doubleOccupancy = 0;
          let doubleOccupancyValue = reactiveMap2[year];
          if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null && doubleOccupancyValue !== '') {
            doubleOccupancy = parseFloat(doubleOccupancyValue);
          }
          
          // Calculate number of guests
          numberOfGuests = doubleOccupancy * roomsAvailable;
        }
        return numberOfGuests.toFixed(2);
      } else {
        // For non-default breakfast outlets, use user input value
        const breakfastCoversRowKey = JSON.stringify({
          restaurant: rowKeyObj.restaurant,
          section: rowKeyObj.section,
          type: rowKeyObj.type
        });
        const breakfastCoversRaw = fnbData?.[breakfastCoversRowKey]?.[year]?.[label];
        const breakfastCovers = parseFloat(breakfastCoversRaw?.toString().replace(/,/g, '')) || 0;
        return breakfastCovers.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }

  // Auto-calculate Breakfast Revenue: if default breakfast outlet, use Breakfast Covers × Average check breakfast
  if (rowType === 'Breakfast Revenue') {
    if (rowKeyObj) {
      // Check if this restaurant is the default breakfast outlet
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      if (defaultBreakfastOutlet === rowKeyObj.restaurant) {
        // For default breakfast outlet, calculate: Breakfast Covers × Average check breakfast
        // Get Breakfast Covers value (which equals Number of guests for default outlet)
        let breakfastCovers = 0;
        if (typeof getDaysInMonth === 'function' && totalRooms) {
          const days = getDaysInMonth(year, label);
          const roomsAvailable = days * totalRooms;
          
          // Get double occupancy value (reactive only)
          const reactiveMap3 = currentDoubleOccupancyByYear.value || {};
          let doubleOccupancy = 0;
          let doubleOccupancyValue = reactiveMap3[year];
          if (doubleOccupancyValue !== undefined && doubleOccupancyValue !== null && doubleOccupancyValue !== '') {
            doubleOccupancy = parseFloat(doubleOccupancyValue);
          }
          
          // Calculate breakfast covers (equals number of guests for default outlet)
          breakfastCovers = doubleOccupancy * roomsAvailable;
        }
        
        // Calculate Average check breakfast directly: Breakfast Allocation × Exchange Rate
        const breakfastByYear = JSON.parse(localStorage.getItem('breakfastByYear') || '{}');
        const breakfastAllocation = parseFloat(breakfastByYear[year]) || 0;
        
        const exchangeRateByYear = JSON.parse(localStorage.getItem('exchangeRateByYear') || '{}');
        const exchangeRate = parseFloat(exchangeRateByYear[year]) || 1;
        
        const averageCheckBreakfast = breakfastAllocation * exchangeRate;
        
        // Calculate Breakfast Revenue = Breakfast Covers × Average check breakfast
        const breakfastRevenue = breakfastCovers * averageCheckBreakfast;
        return breakfastRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        // For non-default breakfast outlets, use user input value
        const breakfastRevenueRowKey = JSON.stringify({
          restaurant: rowKeyObj.restaurant,
          section: rowKeyObj.section,
          type: rowKeyObj.type
        });
        const breakfastRevenueRaw = fnbData?.[breakfastRevenueRowKey]?.[year]?.[label];
        const breakfastRevenue = parseFloat(breakfastRevenueRaw?.toString().replace(/,/g, '')) || 0;
        return breakfastRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }
  }
  
  // Auto-calculate Average check breakfast: if default breakfast outlet, use Breakfast Allocation × Exchange Rate
  if (rowType === 'Average check breakfast') {
    if (rowKeyObj) {
      // Check if this restaurant is the default breakfast outlet
      const defaultBreakfastOutlet = localStorage.getItem('defaultBreakfastOutlet');
      if (defaultBreakfastOutlet === rowKeyObj.restaurant) {
        // For default breakfast outlet, calculate: Breakfast Allocation (USD) × Exchange Rate
        // Get Breakfast Allocation (USD) for the year
        const breakfastByYear = JSON.parse(localStorage.getItem('breakfastByYear') || '{}');
        const breakfastAllocation = parseFloat(breakfastByYear[year]) || 0;
        
        // Get Exchange Rate for the year
        const exchangeRateByYear = JSON.parse(localStorage.getItem('exchangeRateByYear') || '{}');
        const exchangeRate = parseFloat(exchangeRateByYear[year]) || 1;
        
        // Calculate Average check breakfast
        const averageCheckBreakfast = breakfastAllocation * exchangeRate;
        return averageCheckBreakfast.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
      
      // For non-default breakfast outlets, use user input value
      const userRaw = fnbData?.[rowKeyObj.restaurant]?.[rowKeyObj.section]?.[rowType]?.[year]?.[label];
      if (userRaw !== undefined && userRaw !== null && userRaw !== "") {
        return userRaw.toString();
      }
      
      // Default fallback
      return "0.00";
    }
  }
  
  // For restaurant data, look up the specific row in fnbData
  if (rowKeyObj) {
    // For structured row keys, remove the label from the key for lookup
    const rowKey = JSON.stringify({
      restaurant: rowKeyObj.restaurant,
      section: rowKeyObj.section,
      type: rowKeyObj.type
    });
    
    // console.log('Looking up data for:', { rowKey, year, label, fnbDataKeys: Object.keys(fnbData) });
    
    const raw = fnbData?.[rowKey]?.[year]?.[label];
    // console.log('Raw value found:', raw);
    
    let num = parseFloat(raw?.toString().replace(/,/g, ''));
    if (isNaN(num)) num = 0;
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    // For simple row names (legacy format), look up directly
    const raw = fnbData?.[row]?.[year]?.[label];
    let num = parseFloat(raw?.toString().replace(/,/g, ''));
    if (isNaN(num)) num = 0;
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

export function setFnbCellValue(fnbData, row, year, label, value) {
  // console.log('setFnbCellValue called with:', { row, year, label, value, fnbDataExists: !!fnbData });
  if (!fnbData || typeof fnbData !== 'object') {
    console.warn('setFnbCellValue: fnbData is not an object');
    return;
  }
  
  // Check if this is a structured row key (JSON string)
  let rowKey = row;
  try {
    const rowKeyObj = JSON.parse(row);
    if (rowKeyObj && rowKeyObj.restaurant && rowKeyObj.section && rowKeyObj.type) {
      // This is a structured row key, remove the label from the key for storage
      rowKey = JSON.stringify({
        restaurant: rowKeyObj.restaurant,
        section: rowKeyObj.section,
        type: rowKeyObj.type
      });
    }
  } catch (error) {
    // Not a JSON string, use as-is
    rowKey = row;
  }
  
  if (!fnbData[rowKey]) fnbData[rowKey] = {};
  if (!fnbData[rowKey][year]) fnbData[rowKey][year] = {};
  fnbData[rowKey][year][label] = value;
  // console.log('setFnbCellValue completed. Data structure:', fnbData[rowKey][year]);
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
    const cellValue = getFnbCellValue(fnbData, row, year, label, totalRooms);
    // Remove commas and parse the value properly
    const val = parseFloat(cellValue.toString().replace(/,/g, ''));
    if (!isNaN(val)) sum += val;
  }
  return sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
} 

