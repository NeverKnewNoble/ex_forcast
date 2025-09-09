// API Utilities for Frappe integration

/**
 * Get CSRF token from meta tag
 */
export const getCSRFToken = () => {
  // Try multiple ways to get CSRF token
  let token = ''
  let methodUsed = ''
  
  console.log('🔍 [CSRF] Starting CSRF token detection...')
  
  // Method 1: Check frappe global object (most reliable)
  if (window.frappe && window.frappe.csrf_token) {
    token = window.frappe.csrf_token
    methodUsed = 'window.frappe.csrf_token'
    console.log('✅ [CSRF] Found via method 1 (frappe global):', token.substring(0, 10) + '...')
  }
  
  // Method 2: Check meta tag
  if (!token) {
    const metaTag = document.querySelector('meta[name="csrf-token"]')
    if (metaTag) {
      token = metaTag.getAttribute('content')
      methodUsed = 'meta[name="csrf-token"]'
      console.log('✅ [CSRF] Found via method 2 (meta tag):', token.substring(0, 10) + '...')
    }
  }
  
  // Method 3: Check for frappe CSRF token meta tag
  if (!token) {
    const frappeMetaTag = document.querySelector('meta[name="frappe-csrf-token"]')
    if (frappeMetaTag) {
      token = frappeMetaTag.getAttribute('content')
      methodUsed = 'meta[name="frappe-csrf-token"]'
      console.log('✅ [CSRF] Found via method 3 (frappe meta tag):', token.substring(0, 10) + '...')
    }
  }
  
  // Method 4: Check localStorage
  if (!token) {
    const storedToken = localStorage.getItem('csrf_token')
    if (storedToken) {
      token = storedToken
      methodUsed = 'localStorage'
      console.log('✅ [CSRF] Found via method 4 (localStorage):', token.substring(0, 10) + '...')
    }
  }
  
  // Method 5: Check cookies
  if (!token) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'csrf_token') {
        token = value
        methodUsed = 'cookies'
        console.log('✅ [CSRF] Found via method 5 (cookies):', token.substring(0, 10) + '...')
        break
      }
    }
  }
  
  // Method 6: Check for any script tag with CSRF
  if (!token) {
    const scripts = document.querySelectorAll('script')
    for (const script of scripts) {
      const content = script.textContent || script.innerHTML
      if (content.includes('csrf_token')) {
        const match = content.match(/csrf_token['"]?\s*[:=]\s*['"]([^'"]+)['"]/)
        if (match) {
          token = match[1]
          methodUsed = 'script tag'
          console.log('✅ [CSRF] Found via method 6 (script tag):', token.substring(0, 10) + '...')
          break
        }
      }
    }
  }
  
  // Final result logging
  if (token) {
    console.log('🎉 [CSRF] SUCCESS! Token found via:', methodUsed)
    console.log('🔑 [CSRF] Token length:', token.length)
    console.log('🔑 [CSRF] Token preview:', token.substring(0, 20) + '...')
  } else {
    console.error('❌ [CSRF] FAILED! No token found in any method')
    console.warn('🔍 [CSRF] Available sources check:', {
      frappeGlobal: !!window.frappe?.csrf_token,
      metaTag: !!document.querySelector('meta[name="csrf-token"]'),
      frappeMetaTag: !!document.querySelector('meta[name="frappe-csrf-token"]'),
      localStorage: !!localStorage.getItem('csrf_token'),
      cookies: document.cookie.includes('csrf_token'),
      allCookies: document.cookie
    })
  }
  
  return token
}

/**
 * Test CSRF token detection (for debugging)
 * Call this from browser console: testCSRFToken()
 */
export const testCSRFToken = () => {
  console.log('🧪 [CSRF TEST] Starting CSRF token test...')
  console.log('🧪 [CSRF TEST] Current URL:', window.location.href)
  console.log('🧪 [CSRF TEST] Document ready state:', document.readyState)
  
  const token = getCSRFToken()
  
  console.log('🧪 [CSRF TEST] Final result:', {
    token: token ? token.substring(0, 20) + '...' : 'NOT FOUND',
    length: token?.length || 0,
    isValid: token && token.length > 0
  })
  
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
        
        // Log detailed error information in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`API Request Failed (Attempt ${i + 1}):`, {
            url,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            requestHeaders: headerConfigs[i],
            responseText: errorText,
            csrfToken: csrfToken ? 'Present' : 'Missing'
          })
        }
        
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
  // Import production error handler dynamically to avoid circular dependencies
  import('@/components/utility/_master_utility/productionErrorHandler.js').then(({ productionErrorHandler }) => {
    productionErrorHandler.handleApiError(error, 'API Request')
  }).catch(() => {
    // Fallback if error handler fails to load
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error)
    }
  })
  
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