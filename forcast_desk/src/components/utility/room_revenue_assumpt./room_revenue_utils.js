// Room Revenue Utilities - Core calculations and table display functions
import { ref } from 'vue'

//? Default room types (will be overridden by dynamic packages)
export const DEFAULT_ROOM_TYPES = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential']

// Dynamic room types based on available packages
export let ROOM_TYPES = [...DEFAULT_ROOM_TYPES]

// Function to update room types based on available packages
export function updateRoomTypes(roomPackages) {
  if (roomPackages && roomPackages.length > 0) {
    // Start with default packages in the correct order
    const orderedRoomTypes = [...DEFAULT_ROOM_TYPES];
    
    // Add any custom packages that are not in the default list
    roomPackages.forEach(pkg => {
      const packageName = pkg.package_name || pkg.name;
      if (!DEFAULT_ROOM_TYPES.includes(packageName)) {
        orderedRoomTypes.push(packageName);
      }
    });
    
    ROOM_TYPES = orderedRoomTypes;
  } else {
    ROOM_TYPES = [...DEFAULT_ROOM_TYPES];
  }
}

// ! Table collapse state management
export const collapsedYears = ref(new Set())

export function toggleCollapse(year) {
  if (collapsedYears.value.has(year)) {
    collapsedYears.value.delete(year)
  } else {
    collapsedYears.value.add(year)
  }
}

export function isYearCollapsed(year) {
  return collapsedYears.value.has(year)
}

// Get visible years based on from/to selection
export function getVisibleYears(fromYear, toYear) {
  if (!fromYear || !toYear) return []
  
  const from = parseInt(fromYear)
  const to = parseInt(toYear)
  if (from > to) return []
  
  const years = []
  for (let year = from; year <= to; year++) {
    years.push(year.toString())
  }
  return years
}

// ! Get column labels for monthly/quarterly display
export function getColumnLabels(displayMode = "monthly") {
  if (displayMode === "quarterly") {
    return ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"]
  }
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}

// Quarter to months mapping
export const quarterToMonths = {
  "Jan-Mar": ["Jan", "Feb", "Mar"],
  "Apr-Jun": ["Apr", "May", "Jun"],
  "Jul-Sep": ["Jul", "Aug", "Sep"],
  "Oct-Dec": ["Oct", "Nov", "Dec"]
}

// ! Utility function to get number of days in a month for a given year
export function getDaysInMonth(year, month) {
  // Month mapping (0-indexed for Date constructor)
  const monthMap = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
    "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
  }
  
  const monthIndex = monthMap[month]
  if (monthIndex === undefined) {
    // console.warn(`Invalid month: ${month}`)
    return 0
  }
  
  // ? Create a date for the first day of the next month, then subtract 1 day
  // ? This gives us the last day of the current month
  const lastDay = new Date(parseInt(year), monthIndex + 1, 0)
  return lastDay.getDate()
}

// ! Get data for a specific room type, year, and month/quarter
export function getRoomData(roomRevenueData, roomType, year, label, displayMode = "monthly") {
  if (displayMode === "quarterly" && quarterToMonths[label]) {
    // For quarterly, we need to aggregate data from the three months
    const quarterData = {
      number_of_rooms: 0,
      rate: 0,
      occupied_beds: 0,
      count: 0
    }
    
    for (const month of quarterToMonths[label]) {
      const entries = roomRevenueData?.[year]?.[month] || []
      const found = entries.find(e => e.room_package === roomType)
      if (found) {
        quarterData.number_of_rooms += parseFloat(found.number_of_rooms) || 0
        quarterData.rate += parseFloat(found.rate) || 0
        quarterData.occupied_beds += parseFloat(found.occupied_beds) || 0
        quarterData.count++
      }
    }
    
    // Return averages for quarterly display
    if (quarterData.count > 0) {
      return {
        number_of_rooms: quarterData.number_of_rooms / quarterData.count,
        rate: quarterData.rate / quarterData.count,
        occupied_beds: quarterData.occupied_beds / quarterData.count
      }
    }
    return { number_of_rooms: 0, rate: 0, occupied_beds: 0 }
  } else {
    // Monthly mode
    const entries = roomRevenueData?.[year]?.[label] || []
    const found = entries.find(e => e.room_package === roomType)
    return found ? {
      number_of_rooms: parseFloat(found.number_of_rooms) || 0,
      rate: parseFloat(found.rate) || 0,
      occupied_beds: parseFloat(found.occupied_beds) || 0
    } : { number_of_rooms: 0, rate: 0, occupied_beds: 0 }
  }
}

// ! Get formatted value for table display
export function getFormattedValue(value, type = "number") {
  if (type === "percentage") {
    return value.toFixed(1) + "%"
  } else if (type === "currency") {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
}

// ! Get available beds (number of rooms × days in month) for display
export function getAvailableBeds(roomRevenueData, roomType, year, label, displayMode = "monthly", roomPackages = []) {
  const data = getRoomData(roomRevenueData, roomType, year, label, displayMode)
  const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
  
  if (displayMode === "quarterly" && quarterToMonths[label]) {
    // For quarterly, sum up the days for all months in the quarter
    let totalDays = 0
    for (const month of quarterToMonths[label]) {
      totalDays += getDaysInMonth(year, month)
    }
    const availableBeds = numberOfRooms * totalDays
    return getFormattedValue(availableBeds, "number")
  } else {
    // For monthly, multiply by days in that specific month
    const daysInMonth = getDaysInMonth(year, label)
    const availableBeds = numberOfRooms * daysInMonth
    return getFormattedValue(availableBeds, "number")
  }
}

// ! Get occupied beds percentage for display
export function getOccupiedBeds(roomRevenueData, roomType, year, label, displayMode = "monthly") {
  const data = getRoomData(roomRevenueData, roomType, year, label, displayMode)
  return getFormattedValue(data.occupied_beds, "percentage")
}

// ! Get rate for display
export function getRate(roomRevenueData, roomType, year, label, displayMode = "monthly") {
  const data = getRoomData(roomRevenueData, roomType, year, label, displayMode)
  return getFormattedValue(data.rate, "currency")
}

// ! Calculate revenue: available beds * occupied beds % * rate
export function calculateRevenue(roomRevenueData, roomType, year, label, displayMode = "monthly", roomPackages = []) {
  const data = getRoomData(roomRevenueData, roomType, year, label, displayMode)
  const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
  
  let availableBeds
  if (displayMode === "quarterly" && quarterToMonths[label]) {
    // For quarterly, sum up the days for all months in the quarter
    let totalDays = 0
    for (const month of quarterToMonths[label]) {
      totalDays += getDaysInMonth(year, month)
    }
    availableBeds = numberOfRooms * totalDays
  } else {
    // For monthly, multiply by days in that specific month
    const daysInMonth = getDaysInMonth(year, label)
    availableBeds = numberOfRooms * daysInMonth
  }
  
  const revenue = availableBeds * (data.occupied_beds / 100) * data.rate
  return getFormattedValue(revenue, "currency")
}

// ! Calculate totals for a room type across all months/quarters in a year
export function calculateRoomTypeTotal(roomRevenueData, roomType, year, displayMode, calculationType = "revenue", roomPackages = []) {
  const months = getColumnLabels(displayMode)
  let total = 0
  
  for (const month of months) {
    let value = 0
    const data = getRoomData(roomRevenueData, roomType, year, month, displayMode)
    const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
    
    switch (calculationType) {
      case "available_beds":
        if (displayMode === "quarterly" && quarterToMonths[month]) {
          // For quarterly, sum up the days for all months in the quarter
          let totalDays = 0
          for (const quarterMonth of quarterToMonths[month]) {
            totalDays += getDaysInMonth(year, quarterMonth)
          }
          value = numberOfRooms * totalDays
        } else {
          // For monthly, multiply by days in that specific month
          const daysInMonth = getDaysInMonth(year, month)
          value = numberOfRooms * daysInMonth
        }
        break
      case "occupied_beds":
        value = data.occupied_beds
        break
      case "rate":
        value = data.rate
        break
      case "revenue":
        let availableBeds
        if (displayMode === "quarterly" && quarterToMonths[month]) {
          // For quarterly, sum up the days for all months in the quarter
          let totalDays = 0
          for (const quarterMonth of quarterToMonths[month]) {
            totalDays += getDaysInMonth(year, quarterMonth)
          }
          availableBeds = numberOfRooms * totalDays
        } else {
          // For monthly, multiply by days in that specific month
          const daysInMonth = getDaysInMonth(year, month)
          availableBeds = numberOfRooms * daysInMonth
        }
        value = availableBeds * (data.occupied_beds / 100) * data.rate
        break
    }
    
    total += value
  }
  
  const type = calculationType === "occupied_beds" ? "percentage" : 
               calculationType === "rate" || calculationType === "revenue" ? "currency" : "number"
  return getFormattedValue(total, type)
}

// Calculate monthly totals for all room types in a specific month/quarter
export function calculateMonthlyTotal(roomRevenueData, year, label, displayMode, calculationType = "revenue", roomPackages = []) {
  let total = 0
  let roomTypeCount = 0
  
  for (const roomType of ROOM_TYPES) {
    const data = getRoomData(roomRevenueData, roomType, year, label, displayMode)
    const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
    let value = 0
    
    switch (calculationType) {
      case "available_beds":
        if (displayMode === "quarterly" && quarterToMonths[label]) {
          // For quarterly, sum up the days for all months in the quarter
          let totalDays = 0
          for (const month of quarterToMonths[label]) {
            totalDays += getDaysInMonth(year, month)
          }
          value = numberOfRooms * totalDays
        } else {
          // For monthly, multiply by days in that specific month
          const daysInMonth = getDaysInMonth(year, label)
          value = numberOfRooms * daysInMonth
        }
        break
      case "occupied_beds":
        value = data.occupied_beds
        break
      case "rate":
        value = data.rate
        break
      case "revenue":
        let availableBeds
        if (displayMode === "quarterly" && quarterToMonths[label]) {
          // For quarterly, sum up the days for all months in the quarter
          let totalDays = 0
          for (const month of quarterToMonths[label]) {
            totalDays += getDaysInMonth(year, month)
          }
          availableBeds = numberOfRooms * totalDays
        } else {
          // For monthly, multiply by days in that specific month
          const daysInMonth = getDaysInMonth(year, label)
          availableBeds = numberOfRooms * daysInMonth
        }
        value = availableBeds * (data.occupied_beds / 100) * data.rate
        break
    }
    
    total += value
    roomTypeCount++
  }
  
  // For occupied_beds and rate, calculate average (total divided by number of room types)
  // For available_beds and revenue, keep the sum
  if (calculationType === "occupied_beds" || calculationType === "rate") {
    total = roomTypeCount > 0 ? total / roomTypeCount : 0
  }
  
  const type = calculationType === "occupied_beds" ? "percentage" : 
               calculationType === "rate" || calculationType === "revenue" ? "currency" : "number"
  return getFormattedValue(total, type)
}

// Calculate grand totals for all room types in a year
export function calculateGrandTotal(roomRevenueData, year, displayMode, calculationType = "revenue", roomPackages = []) {
  let total = 0
  
  for (const roomType of ROOM_TYPES) {
    const months = getColumnLabels(displayMode)
    for (const month of months) {
      const data = getRoomData(roomRevenueData, roomType, year, month, displayMode)
      const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
      let value = 0
      
      switch (calculationType) {
        case "available_beds":
          if (displayMode === "quarterly" && quarterToMonths[month]) {
            // For quarterly, sum up the days for all months in the quarter
            let totalDays = 0
            for (const quarterMonth of quarterToMonths[month]) {
              totalDays += getDaysInMonth(year, quarterMonth)
            }
            value = numberOfRooms * totalDays
          } else {
            // For monthly, multiply by days in that specific month
            const daysInMonth = getDaysInMonth(year, month)
            value = numberOfRooms * daysInMonth
          }
          break
        case "occupied_beds":
          value = data.occupied_beds
          break
        case "rate":
          value = data.rate
          break
        case "revenue":
          let availableBeds
          if (displayMode === "quarterly" && quarterToMonths[month]) {
            // For quarterly, sum up the days for all months in the quarter
            let totalDays = 0
            for (const quarterMonth of quarterToMonths[month]) {
              totalDays += getDaysInMonth(year, quarterMonth)
            }
            availableBeds = numberOfRooms * totalDays
          } else {
            // For monthly, multiply by days in that specific month
            const daysInMonth = getDaysInMonth(year, month)
            availableBeds = numberOfRooms * daysInMonth
          }
          value = availableBeds * (data.occupied_beds / 100) * data.rate
          break
      }
      
      total += value
    }
  }
  
  const type = calculationType === "occupied_beds" ? "percentage" : 
               calculationType === "rate" || calculationType === "revenue" ? "currency" : "number"
  return getFormattedValue(total, type)
}

// Calculate table totals for all room types across all visible years
export function calculateTableTotal(roomRevenueData, visibleYears, displayMode, calculationType = "revenue", roomPackages = []) {
  let total = 0
  
  for (const year of visibleYears) {
    const months = getColumnLabels(displayMode)
    for (const month of months) {
      for (const roomType of ROOM_TYPES) {
        const data = getRoomData(roomRevenueData, roomType, year, month, displayMode)
        const numberOfRooms = getNumberOfRoomsForType(roomPackages, roomType, roomRevenueData)
        let value = 0
        
        switch (calculationType) {
          case "available_beds":
            if (displayMode === "quarterly" && quarterToMonths[month]) {
              // For quarterly, sum up the days for all months in the quarter
              let totalDays = 0
              for (const quarterMonth of quarterToMonths[month]) {
                totalDays += getDaysInMonth(year, quarterMonth)
              }
              value = numberOfRooms * totalDays
            } else {
              // For monthly, multiply by days in that specific month
              const daysInMonth = getDaysInMonth(year, month)
              value = numberOfRooms * daysInMonth
            }
            break
          case "occupied_beds":
            value = data.occupied_beds
            break
          case "rate":
            value = data.rate
            break
          case "revenue":
            let availableBeds
            if (displayMode === "quarterly" && quarterToMonths[month]) {
              // For quarterly, sum up the days for all months in the quarter
              let totalDays = 0
              for (const quarterMonth of quarterToMonths[month]) {
                totalDays += getDaysInMonth(year, quarterMonth)
              }
              availableBeds = numberOfRooms * totalDays
            } else {
              // For monthly, multiply by days in that specific month
              const daysInMonth = getDaysInMonth(year, month)
              availableBeds = numberOfRooms * daysInMonth
            }
            value = availableBeds * (data.occupied_beds / 100) * data.rate
            break
        }
        
        total += value
      }
    }
  }
  
  const type = calculationType === "occupied_beds" ? "percentage" : 
               calculationType === "rate" || calculationType === "revenue" ? "currency" : "number"
  return getFormattedValue(total, type)
}

// ! Extract all room types from data (for dynamic room types if needed)
export function extractAllRoomTypes(roomRevenueData) {
  const all = new Set()
  for (const year in roomRevenueData) {
    for (const month in roomRevenueData[year]) {
      roomRevenueData[year][month].forEach(e => all.add(e.room_package))
    }
  }
  return [...all].sort()
}

// Get number of rooms for a specific room type from room packages data
export function getNumberOfRoomsForType(roomPackages, roomType, roomData = null) {
  // First check if there are edited room counts in roomData
  if (roomData && roomData.room_packages) {
    const editedRoomPackage = roomData.room_packages.find(pkg => pkg.name === roomType)
    if (editedRoomPackage) {
      return editedRoomPackage.number_of_rooms
    }
  }
  
  // Fall back to original room packages data
  const roomPackage = roomPackages.find(pkg => pkg.name === roomType)
  return roomPackage ? roomPackage.number_of_rooms : 0
}

// Calculate total room count across all room types
export function calculateTotalRoomCount(roomPackages, roomData = null) {
  let total = 0
  
  for (const roomType of ROOM_TYPES) {
    total += getNumberOfRoomsForType(roomPackages, roomType, roomData)
  }
  
  return total
} 