// src/csrf-shim.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
  }
  
  // Immediately set up a global frappe object with csrf_token
  (function ensureFrappeCsrf() {
    const token = getCookie("csrf_token") || "";
    if (!window.frappe) {
      window.frappe = {};
    }
    window.frappe.csrf_token = token;
  })();
  
  // Optional: call this after login to refresh the token
  export function refreshCsrfFromCookie() {
    const token = getCookie("csrf_token") || "";
    if (!window.frappe) {
      window.frappe = {};
    }
    window.frappe.csrf_token = token;
  }
  
  // Utility if you just want to grab it directly
  export function getFrappeCsrfToken() {
    return (window.frappe && window.frappe.csrf_token) || "";
  }