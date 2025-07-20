// API Utilities for Frappe integration

/**
 * Get CSRF token from meta tag
 */
export const getCSRFToken = () => {
  // Try multiple ways to get CSRF token
  let token = ''
  
  // Method 1: Check meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  if (metaTag) {
    token = metaTag.getAttribute('content')
  }
  
  // Method 2: Check for frappe CSRF token
  if (!token) {
    const frappeMetaTag = document.querySelector('meta[name="frappe-csrf-token"]')
    if (frappeMetaTag) {
      token = frappeMetaTag.getAttribute('content')
    }
  }
  
  // Method 3: Check localStorage
  if (!token) {
    const storedToken = localStorage.getItem('csrf_token')
    if (storedToken) {
      token = storedToken
    }
  }
  
  // Method 4: Check for any script tag with CSRF
  if (!token) {
    const scripts = document.querySelectorAll('script')
    for (const script of scripts) {
      const content = script.textContent || script.innerHTML
      if (content.includes('csrf_token')) {
        const match = content.match(/csrf_token['"]?\s*[:=]\s*['"]([^'"]+)['"]/)
        if (match) {
          token = match[1]
          break
        }
      }
    }
  }
  
  return token
}

/**
 * Make API request with proper headers
 */
export const makeApiRequest = async (url, options = {}) => {
  const csrfToken = getCSRFToken()
  
  // Try different header configurations
  const headerConfigs = [
    {
      'Content-Type': 'application/json',
      'X-Frappe-CSRF-Token': csrfToken
    },
    {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    {
      'Content-Type': 'application/json'
    }
  ]

  for (let i = 0; i < headerConfigs.length; i++) {
    try {
      const config = {
        ...options,
        headers: {
          ...headerConfigs[i],
          ...options.headers
        }
      }
      
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorText = await response.text()
        
        // If it's a 403 or 401, try next header config
        if ((response.status === 403 || response.status === 401) && i < headerConfigs.length - 1) {
          continue
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const responseText = await response.text()
      
      if (!responseText) {
        throw new Error('Empty response from server')
      }
      
      try {
        return JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText}`)
      }
    } catch (error) {
      // If this is the last attempt, throw the error
      if (i === headerConfigs.length - 1) {
        throw error
      }
    }
  }
}

/**
 * Make POST request with FormData
 */
export const makeFormDataRequest = async (url, formData) => {
  const config = {
    method: 'POST',
    headers: {
      'X-Frappe-CSRF-Token': getCSRFToken()
    },
    body: formData
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const responseText = await response.text()
    
    if (!responseText) {
      throw new Error('Empty response from server')
    }
    
    try {
      return JSON.parse(responseText)
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }
  } catch (error) {
    throw error
  }
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.message) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return defaultMessage
}

/**
 * Validate required fields
 */
export const validateRequired = (data, requiredFields) => {
  const errors = {}
  
  requiredFields.forEach(field => {
    if (!data[field] || !data[field].toString().trim()) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
} 