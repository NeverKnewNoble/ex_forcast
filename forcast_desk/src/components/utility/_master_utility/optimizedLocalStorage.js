/**
 * Optimized localStorage Utility
 * Provides debounced localStorage operations and error handling
 */

import { productionErrorHandler } from './productionErrorHandler.js'

class OptimizedLocalStorage {
  constructor() {
    this.pendingWrites = new Map()
    this.writeTimeouts = new Map()
    this.debounceDelay = 300 // 300ms debounce
    this.maxRetries = 3
    this.retryDelay = 1000
  }

  /**
   * Set item with debouncing
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @param {number} debounceMs - Custom debounce delay
   */
  setItem(key, value, debounceMs = this.debounceDelay) {
    try {
      // Store pending write
      this.pendingWrites.set(key, value)

      // Clear existing timeout
      if (this.writeTimeouts.has(key)) {
        clearTimeout(this.writeTimeouts.get(key))
      }

      // Set new timeout
      const timeoutId = setTimeout(() => {
        this._performWrite(key, value)
        this.pendingWrites.delete(key)
        this.writeTimeouts.delete(key)
      }, debounceMs)

      this.writeTimeouts.set(key, timeoutId)
    } catch (error) {
      productionErrorHandler.handleStorageError(error, `setItem(${key})`)
    }
  }

  /**
   * Get item with error handling
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  getItem(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key)
      return value !== null ? JSON.parse(value) : defaultValue
    } catch (error) {
      productionErrorHandler.handleStorageError(error, `getItem(${key})`)
      return defaultValue
    }
  }

  /**
   * Remove item
   * @param {string} key - Storage key
   */
  removeItem(key) {
    try {
      // Clear pending write
      this.pendingWrites.delete(key)
      if (this.writeTimeouts.has(key)) {
        clearTimeout(this.writeTimeouts.get(key))
        this.writeTimeouts.delete(key)
      }

      localStorage.removeItem(key)
    } catch (error) {
      productionErrorHandler.handleStorageError(error, `removeItem(${key})`)
    }
  }

  /**
   * Clear all items
   */
  clear() {
    try {
      // Clear all pending writes
      this.pendingWrites.clear()
      this.writeTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
      this.writeTimeouts.clear()

      localStorage.clear()
    } catch (error) {
      productionErrorHandler.handleStorageError(error, 'clear()')
    }
  }

  /**
   * Get storage usage information
   * @returns {Object} Storage usage stats
   */
  getStorageInfo() {
    try {
      let totalSize = 0
      let itemCount = 0

      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key)
          totalSize += key.length + (value ? value.length : 0)
          itemCount++
        }
      }

      return {
        totalSize,
        itemCount,
        pendingWrites: this.pendingWrites.size,
        estimatedQuota: this._estimateQuota()
      }
    } catch (error) {
      productionErrorHandler.handleStorageError(error, 'getStorageInfo()')
      return { totalSize: 0, itemCount: 0, pendingWrites: 0, estimatedQuota: 0 }
    }
  }

  /**
   * Perform actual write operation with retry logic
   * @private
   */
  async _performWrite(key, value, retryCount = 0) {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      if (retryCount < this.maxRetries) {
        // Retry after delay
        setTimeout(() => {
          this._performWrite(key, value, retryCount + 1)
        }, this.retryDelay * (retryCount + 1))
      } else {
        productionErrorHandler.handleStorageError(error, `_performWrite(${key})`)
      }
    }
  }

  /**
   * Estimate storage quota
   * @private
   */
  _estimateQuota() {
    try {
      // Test storage capacity
      let testKey = 'test_quota_'
      let testValue = 'x'
      let quota = 0

      while (true) {
        try {
          localStorage.setItem(testKey + quota, testValue)
          quota += testValue.length
          testValue += testValue
        } catch (e) {
          break
        }
      }

      // Clean up test data
      for (let i = 0; i < quota; i++) {
        try {
          localStorage.removeItem(testKey + i)
        } catch (e) {
          // Ignore cleanup errors
        }
      }

      return quota
    } catch (error) {
      return 0
    }
  }

  /**
   * Force flush all pending writes
   */
  flush() {
    this.pendingWrites.forEach((value, key) => {
      this._performWrite(key, value)
    })
    this.pendingWrites.clear()
    this.writeTimeouts.forEach(timeoutId => clearTimeout(timeoutId))
    this.writeTimeouts.clear()
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if storage is available
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Get all keys
   * @returns {string[]} Array of storage keys
   */
  keys() {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      productionErrorHandler.handleStorageError(error, 'keys()')
      return []
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean} True if key exists
   */
  hasKey(key) {
    try {
      return localStorage.getItem(key) !== null
    } catch (error) {
      productionErrorHandler.handleStorageError(error, `hasKey(${key})`)
      return false
    }
  }
}

// Create singleton instance
export const optimizedLocalStorage = new OptimizedLocalStorage()

// Export for global access in development
if (process.env.NODE_ENV === 'development') {
  window.optimizedLocalStorage = optimizedLocalStorage
}

export default optimizedLocalStorage
