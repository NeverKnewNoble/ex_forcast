/**
 * API Debug Utility
 * Helps debug API request issues in development
 */

import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js'

export const debugApiRequest = async (url, options = {}) => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('debugApiRequest only works in development mode')
    return
  }

  const csrfToken = getCSRFToken()
  
  console.group('🔍 API Request Debug')
  // console.log('URL:', url)
  // console.log('Method:', options.method || 'POST')
  // console.log('CSRF Token:', csrfToken ? `Present (${csrfToken.substring(0, 10)}...)` : 'Missing')
  // console.log('Headers:', options.headers)
  // console.log('Body:', options.body)
  
  // Check if CSRF token is valid format
  if (csrfToken) {
    const isValidFormat = /^[a-zA-Z0-9+/=]+$/.test(csrfToken)
    // console.log('CSRF Token Valid Format:', isValidFormat)
    // console.log('CSRF Token Length:', csrfToken.length)
  }
  
  // Check available CSRF sources
  // console.log('Available CSRF Sources:', {
    frappeGlobal: !!window.frappe?.csrf_token,
    metaTag: !!document.querySelector('meta[name="csrf-token"]'),
    frappeMetaTag: !!document.querySelector('meta[name="frappe-csrf-token"]'),
    localStorage: !!localStorage.getItem('csrf_token'),
    cookies: document.cookie.includes('csrf_token')
  })
  
  console.groupEnd()
  
  try {
    const response = await fetch(url, options)
    // console.log('Response Status:', response.status)
    // console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error Response:', errorText)
    } else {
      const responseText = await response.text()
      // console.log('Success Response:', responseText)
    }
    
    return response
  } catch (error) {
    console.error('Request Error:', error)
    throw error
  }
}

export const testCSRFToken = () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testCSRFToken only works in development mode')
    return
  }

  console.group('🔐 CSRF Token Test')
  
  const token = getCSRFToken()
  // console.log('Current Token:', token)
  // console.log('Token Length:', token?.length || 0)
  // console.log('Token Valid:', token && token.length > 0)
  
  // Test all sources
  // console.log('All Sources:')
  // console.log('  window.frappe.csrf_token:', window.frappe?.csrf_token)
  // console.log('  meta[name="csrf-token"]:', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'))
  // console.log('  meta[name="frappe-csrf-token"]:', document.querySelector('meta[name="frappe-csrf-token"]')?.getAttribute('content'))
  // console.log('  localStorage csrf_token:', localStorage.getItem('csrf_token'))
  
  const cookies = document.cookie.split(';').map(c => c.trim())
  const csrfCookie = cookies.find(c => c.startsWith('csrf_token='))
  // console.log('  cookie csrf_token:', csrfCookie)
  
  console.groupEnd()
  
  return token
}

// Make available globally in development
if (process.env.NODE_ENV === 'development') {
  window.debugApiRequest = debugApiRequest
  window.testCSRFToken = testCSRFToken
}
