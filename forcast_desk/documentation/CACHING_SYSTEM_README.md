# Caching System Documentation

## Overview

This document describes the comprehensive caching system implemented in the ExForecast application to ensure data persistence across page refreshes and browser sessions.

## Architecture

### 1. Unified Cache Service (`unifiedCacheService.js`)

The core caching service that provides:
- **In-memory caching** for fast access
- **localStorage persistence** for data survival across sessions
- **Project-specific isolation** to prevent data conflicts
- **Automatic data recovery** on page load
- **Error handling** and validation

### 2. Pinia Store (`useCalculationCache.js`)

Enhanced Pinia store with:
- **localStorage persistence** (not sessionStorage)
- **Automatic data serialization**
- **Project-scoped data organization**

### 3. Data Recovery Hooks

Composable hooks for automatic data recovery:
- `usePageDataRecovery` - Basic recovery functionality
- `usePageDataRecoveryWithRetry` - Enhanced with retry logic
- `useFormDataRecovery` - Specialized for form data

### 4. Data Recovery Modal

User interface for:
- **Cache monitoring** and health checks
- **Data export/import** functionality
- **Manual cache management**
- **Recovery status** display

## Key Features

### ✅ Data Persistence
- All cached data is stored in `localStorage` (not `sessionStorage`)
- Data survives page refreshes, browser restarts, and tab closures
- Project-specific isolation prevents data conflicts

### ✅ Automatic Recovery
- Data is automatically restored when pages load
- Fallback mechanisms ensure data availability
- Error handling prevents crashes from corrupted data

### ✅ Performance Optimization
- In-memory cache for fast access
- Lazy loading of stored data
- Efficient data serialization

### ✅ Data Integrity
- Validation of cached data structure
- Error recovery and fallback mechanisms
- Export/import capabilities for data backup

## Usage Examples

### Basic Page Implementation

```vue
<script setup>
import { usePageDataRecovery } from '@/components/utility/_master_utility/usePageDataRecovery.js'

// Automatically recover data for this page
const { 
  isRecovering, 
  recoveryStatus, 
  recoveredDataCount,
  hasData 
} = usePageDataRecovery('Expense_Estimate', {
  autoRecover: true,
  onDataRecovered: (data) => {
    console.log('Data recovered:', data)
    // Restore your page state here
  }
})
</script>
```

### Form Data Recovery

```vue
<script setup>
import { useFormDataRecovery } from '@/components/utility/_master_utility/usePageDataRecovery.js'

const formFields = [
  { key: 'totalRooms', required: true, validator: (val) => ({ valid: val > 0, message: 'Must be positive' }) },
  { key: 'hospitalityExperience', defaultValue: false },
  { key: 'marketSegmentation', defaultValue: true }
]

const { 
  formData, 
  restoredFields, 
  isHealthy 
} = useFormDataRecovery('Room_Revenue', formFields, {
  autoRestore: true,
  validateOnRestore: true
})
</script>
```

### Manual Cache Management

```javascript
import { unifiedCacheService } from '@/components/utility/_master_utility/unifiedCacheService.js'

// Set cache value
unifiedCacheService.setValue('projectName', 'pageId', 'rowCode', 'year', 'label', value)

// Get cache value
const value = unifiedCacheService.getValue('projectName', 'pageId', 'rowCode', 'year', 'label')

// Clear specific cache
unifiedCacheService.clearCache('projectName', 'pageId', 'rowCode', 'year')

// Get cache statistics
const stats = unifiedCacheService.getCacheStats()
```

## Data Structure

### Cache Organization
```
cache[projectName][pageId][rowCode][year][label] = value
```

### Example Structure
```json
{
  "Hotel_Project": {
    "Room_Revenue": {
      "Total Rooms": {
        "2025": {
          "January": 100,
          "February": 95,
          "March": 110
        }
      }
    }
  }
}
```

## Configuration

### Pinia Persistence
The calculation cache store is configured with:
```javascript
persist: {
  storage: localStorage,
  key: 'calculation-cache'
}
```

### Project-Specific Keys
All localStorage keys are automatically prefixed with the project name:
- `calculationCache_Hotel_Project`
- `expenseEstimateFromYear_Hotel_Project`
- `totalNumberOfRooms_Hotel_Project`

## Troubleshooting

### Common Issues

#### 1. Data Not Persisting
- Check if `localStorage` is available and not full
- Verify project selection is working
- Check browser console for errors

#### 2. Data Corruption
- Use the Data Recovery Modal to validate cache
- Export data before clearing cache
- Check for JavaScript errors during data operations

#### 3. Performance Issues
- Monitor cache size in Data Recovery Modal
- Clear unused project data
- Check for memory leaks in development tools

### Debug Commands

The following functions are available in the browser console:

```javascript
// Debug project-specific localStorage
window.debugProjectLocalStorage()

// Get all project keys
window.getAllProjectKeys()

// Access unified cache service
window.unifiedCacheService.getCacheStats()
window.unifiedCacheService.validateCache()
```

## Best Practices

### 1. Page Implementation
- Always use the recovery hooks for data persistence
- Implement proper error handling for recovery failures
- Provide user feedback during recovery operations

### 2. Data Management
- Regularly validate cache integrity
- Export important data before major changes
- Monitor cache size and performance

### 3. Error Handling
- Implement fallback mechanisms for missing data
- Log recovery errors for debugging
- Provide user-friendly error messages

## Migration Guide

### From Old Caching System
1. **Replace direct localStorage calls** with unified cache service
2. **Add recovery hooks** to existing pages
3. **Test data persistence** across page refreshes
4. **Update error handling** to use new validation methods

### Example Migration
```javascript
// Old way
localStorage.setItem('totalRooms', value)

// New way
unifiedCacheService.setValue(projectName, 'Room_Revenue', 'Total Rooms', '2025', 'ALL', value)
```

## Monitoring and Maintenance

### Regular Checks
- Monitor cache health in Data Recovery Modal
- Check browser console for cache-related errors
- Validate data integrity periodically

### Performance Metrics
- Cache hit/miss ratios
- Storage size usage
- Recovery success rates

### Maintenance Tasks
- Clear unused project data
- Export and backup important data
- Monitor localStorage quota usage

## Support

For issues with the caching system:
1. Check the browser console for error messages
2. Use the Data Recovery Modal to diagnose problems
3. Review this documentation for common solutions
4. Contact the development team with specific error details

---

**Last Updated**: March 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
