// Room Revenue Table Utilities - Cell editing and data management

import { cloneDeep } from 'lodash-es'

// Handle cell edits for room revenue data
export function handleRoomCellEdit({ year, label, roomType, field, event, originalRoomData, changedCells, roomData, isSaved }) {
  let newValue = event.target.innerText.replace(/[^\d.-]/g, '').trim()
  if (newValue === '') newValue = '0'
  
  const numValue = parseFloat(newValue) || 0
  let original = 0
  
  // Find original value
  const entries = originalRoomData.value?.[year]?.[label] || []
  const found = entries.find(e => e.room_package === roomType)
  if (found) {
    switch (field) {
      case 'number_of_rooms':
        original = parseFloat(found.number_of_rooms) || 0
        break
      case 'rate':
        original = parseFloat(found.rate) || 0
        break
      case 'occupied_beds':
        original = parseFloat(found.occupied_beds) || 0
        break
    }
  }
  
  if (numValue !== original) {
    isSaved.value = false
    const idx = changedCells.value.findIndex(c => 
      c.year === year && c.label === label && c.roomType === roomType && c.field === field
    )
    
    if (idx !== -1) {
      changedCells.value[idx].newValue = numValue
    } else {
      changedCells.value.push({ year, label, roomType, field, newValue: numValue })
    }
    
    // Update the data
    const dataEntries = roomData.value?.[year]?.[label] || []
    let dataFound = dataEntries.find(e => e.room_package === roomType)
    
    if (dataFound) {
      dataFound[field] = numValue
    } else {
      // Create new entry if it doesn't exist
      const newEntry = {
        room_package: roomType,
        number_of_rooms: field === 'number_of_rooms' ? numValue : 0,
        rate: field === 'rate' ? numValue : 0,
        occupied_beds: field === 'occupied_beds' ? numValue : 0
      }
      dataEntries.push(newEntry)
      if (!roomData.value[year]) roomData.value[year] = {}
      if (!roomData.value[year][label]) roomData.value[year][label] = []
      roomData.value[year][label] = dataEntries
    }
  } else {
    // Remove from changed cells if value is back to original
    changedCells.value = changedCells.value.filter(c => 
      !(c.year === year && c.label === label && c.roomType === roomType && c.field === field)
    )
    if (changedCells.value.length === 0) isSaved.value = true
  }
}

// Handle cell input for real-time formatting
export function handleRoomCellInput({ year, label, roomType, field, event }) {
  let value = event.target.innerText
  value = value.replace(/[^\d.-]/g, '')
  
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  
  if (field === 'occupied_beds' && parts.length === 2 && parts[1].length > 1) {
    value = parts[0] + '.' + parts[1].substring(0, 1)
  } else if (field === 'rate' && parts.length === 2 && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2)
  }
  
  const numValue = parseFloat(value) || 0
  let formattedValue
  
  if (field === 'occupied_beds') {
    formattedValue = numValue.toFixed(1) + '%'
  } else if (field === 'rate') {
    formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  } else {
    formattedValue = numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }
  
  if (formattedValue !== event.target.innerText) {
    event.target.innerText = formattedValue
    const range = document.createRange()
    const selection = window.getSelection()
    const textNode = event.target.firstChild || event.target
    range.setStart(textNode, textNode.textContent.length)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

// Handle cell focus to show raw value for editing
export function handleRoomCellFocus({ year, label, roomType, field, event }) {
  let value = event.target.innerText
  const rawValue = value.replace(/[^\d.-]/g, '')
  event.target.innerText = rawValue
  
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(event.target)
  selection.removeAllRanges()
  selection.addRange(range)
}

// Save changes to room revenue data
export async function saveRoomChanges(changedCells, isSaving, saveError, roomData, originalRoomData, isSaved) {
  if (changedCells.length === 0) {
    isSaved.value = true
    return
  }
  
  isSaving.value = true
  saveError.value = ""
  
  try {
    // Here you would implement the actual API call to save the changes
    // For now, we'll just update the original data
    originalRoomData.value = cloneDeep(roomData.value)
    changedCells.length = 0
    isSaved.value = true
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Error saving room revenue changes:', error)
    saveError.value = "Failed to save changes. Please try again."
  } finally {
    isSaving.value = false
  }
}

// Format amount input for modal forms
export function formatRoomAmountInput(index, form, event) {
  if (!form || !form.value || !form.value.rows) {
    console.warn('Form is not properly initialized')
    return
  }
  
  const row = form.value.rows[index]
  if (!row) {
    console.warn(`Row at index ${index} not found`)
    return
  }
  
  let value = event.target.value
  value = value.replace(/[^\d.]/g, '')
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }
  if (parts.length === 2 && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2)
  }
  row.rate = value
}

// Clean amount value when input loses focus
export function cleanRoomAmountValue(index, form) {
  if (!form || !form.value || !form.value.rows) {
    console.warn('Form is not properly initialized')
    return
  }
  
  const row = form.value.rows[index]
  if (!row) {
    console.warn(`Row at index ${index} not found`)
    return
  }
  
  const numValue = parseFloat(row.rate.replace(/[^\d.]/g, '')) || 0
  row.rate = numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Handle room count edits (for the "No. of Rooms" column)
export function handleRoomCountEdit({ roomType, event, originalRoomData, changedCells, roomData, isSaved }) {
  let newValue = event.target.innerText.replace(/[^\d]/g, '').trim()
  if (newValue === '') newValue = '0'
  
  const numValue = parseInt(newValue) || 0
  
  // Find the room package in the original data
  const originalRoomPackage = originalRoomData.value?.room_packages?.find(pkg => pkg.name === roomType)
  const originalCount = originalRoomPackage ? originalRoomPackage.number_of_rooms : 0
  
  if (numValue !== originalCount) {
    isSaved.value = false
    const idx = changedCells.value.findIndex(c => 
      c.roomType === roomType && c.field === 'room_count'
    )
    
    if (idx !== -1) {
      changedCells.value[idx].newValue = numValue
    } else {
      changedCells.value.push({ roomType, field: 'room_count', newValue: numValue })
    }
    
    // Update the room packages data
    if (!roomData.value.room_packages) {
      roomData.value.room_packages = []
    }
    
    let roomPackage = roomData.value.room_packages.find(pkg => pkg.name === roomType)
    if (roomPackage) {
      roomPackage.number_of_rooms = numValue
    } else {
      // Create new room package if it doesn't exist
      roomPackage = {
        name: roomType,
        number_of_rooms: numValue
      }
      roomData.value.room_packages.push(roomPackage)
    }
  } else {
    // Remove from changed cells if value is back to original
    changedCells.value = changedCells.value.filter(c => 
      !(c.roomType === roomType && c.field === 'room_count')
    )
    if (changedCells.value.length === 0) isSaved.value = true
  }
} 