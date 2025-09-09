/**
 * Production Error Handling Utility
 * Provides centralized error handling for production environment
 */

class ProductionErrorHandler {
  constructor() {
    this.errorQueue = []
    this.maxQueueSize = 100
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  /**
   * Log error with appropriate level based on environment
   * @param {Error|string} error - Error object or message
   * @param {string} context - Context where error occurred
   * @param {Object} metadata - Additional metadata
   */
  logError(error, context = 'Unknown', metadata = {}) {
    const errorInfo = {
      message: error?.message || error,
      stack: error?.stack,
      context,
      metadata,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Add to error queue
    this.addToQueue(errorInfo)

    // Log based on environment
    if (this.isProduction) {
      // In production, only log critical errors
      if (this.isCriticalError(error)) {
        console.error(`[CRITICAL] ${context}:`, errorInfo)
      }
    } else {
      // In development, log all errors
      console.error(`[${context}]`, errorInfo)
    }
  }

  /**
   * Handle API errors with user-friendly messages
   * @param {Error} error - API error
   * @param {string} operation - Operation being performed
   * @returns {string} User-friendly error message
   */
  handleApiError(error, operation = 'API request') {
    let userMessage = 'An unexpected error occurred. Please try again.'

    if (error.message) {
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        userMessage = 'Network connection failed. Please check your internet connection.'
      } else if (error.message.includes('403') || error.message.includes('401')) {
        userMessage = 'Session expired. Please refresh the page and log in again.'
      } else if (error.message.includes('500')) {
        userMessage = 'Server error. Please try again later.'
      } else if (error.message.includes('timeout')) {
        userMessage = 'Request timed out. Please try again.'
      }
    }

    this.logError(error, `API Error - ${operation}`)
    return userMessage
  }

  /**
   * Handle localStorage errors
   * @param {Error} error - localStorage error
   * @param {string} operation - Operation being performed
   */
  handleStorageError(error, operation = 'localStorage operation') {
    let userMessage = 'Unable to save data locally. Some features may not work properly.'

    if (error.name === 'QuotaExceededError') {
      userMessage = 'Storage quota exceeded. Please clear some data and try again.'
    } else if (error.name === 'SecurityError') {
      userMessage = 'Storage access denied. Please check your browser settings.'
    }

    this.logError(error, `Storage Error - ${operation}`)
    return userMessage
  }

  /**
   * Handle cache errors
   * @param {Error} error - Cache error
   * @param {string} operation - Cache operation
   */
  handleCacheError(error, operation = 'cache operation') {
    this.logError(error, `Cache Error - ${operation}`)
    return 'Data caching error. Performance may be affected.'
  }

  /**
   * Check if error is critical
   * @param {Error|string} error - Error to check
   * @returns {boolean} True if critical
   */
  isCriticalError(error) {
    const criticalPatterns = [
      'NetworkError',
      'ChunkLoadError',
      'Loading chunk',
      'Script error',
      'ResizeObserver loop limit exceeded'
    ]

    const errorMessage = error?.message || error || ''
    return criticalPatterns.some(pattern => 
      errorMessage.includes(pattern)
    )
  }

  /**
   * Add error to queue
   * @param {Object} errorInfo - Error information
   */
  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo)
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift()
    }
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentErrors = this.errorQueue.filter(error => 
      new Date(error.timestamp) > last24h
    )

    const criticalErrors = recentErrors.filter(error => 
      this.isCriticalError(error)
    )

    return {
      totalErrors: this.errorQueue.length,
      recentErrors: recentErrors.length,
      criticalErrors: criticalErrors.length,
      lastError: this.errorQueue[this.errorQueue.length - 1]
    }
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = []
  }

  /**
   * Export errors for debugging
   * @returns {string} JSON string of errors
   */
  exportErrors() {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      errors: this.errorQueue,
      stats: this.getErrorStats()
    }, null, 2)
  }
}

// Create singleton instance
export const productionErrorHandler = new ProductionErrorHandler()

// Export for global access in development
if (process.env.NODE_ENV === 'development') {
  window.productionErrorHandler = productionErrorHandler
}

export default productionErrorHandler
