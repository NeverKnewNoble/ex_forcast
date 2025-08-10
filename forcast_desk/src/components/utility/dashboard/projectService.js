// Project Service for handling forecast project operations
import { ref } from 'vue'
import { makeApiRequest, makeFormDataRequest, handleApiError } from './apiUtils.js'

// API base URL - adjust based on your Frappe server configuration
const API_BASE = '/api/method/ex_forcast.api.read_and_save_project'

// Reactive state
export const projects = ref([])
export const selectedProject = ref(null)
export const isLoading = ref(false)
export const error = ref(null)

/**
 * Fetch all projects from the server
 */
export const fetchProjects = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const result = await makeApiRequest(`${API_BASE}.get_projects`)
    
    // Handle the wrapped response structure
    const apiResponse = result.message || result
    
    if (apiResponse && apiResponse.status === 'success') {
      projects.value = apiResponse.data || []
      return apiResponse.data
    } else {
      const errorMsg = apiResponse?.message || 'Failed to fetch projects'
      throw new Error(errorMsg)
    }
  } catch (err) {
    const errorMsg = handleApiError(err, 'Failed to fetch projects')
    error.value = errorMsg
    throw err
  } finally {
    isLoading.value = false
  }
}

/**
 * Create a new project
 */
export const createProject = async (projectName, projectDescription, departments = null, departmentDetails = null) => {
  isLoading.value = true
  error.value = null
  
  try {
    const formData = new FormData()
    formData.append('project_name', projectName)
    formData.append('project_description', projectDescription)
    
    // Add departments if provided
    if (departments) {
      formData.append('departments', JSON.stringify(departments))
    }
    
    // Add department details if provided
    if (departmentDetails) {
      formData.append('department_details', JSON.stringify(departmentDetails))
    }
    
    const result = await makeFormDataRequest(`${API_BASE}.create_project`, formData)
    
    // Handle the wrapped response structure
    const apiResponse = result.message || result
    
    if (apiResponse && apiResponse.status === 'success') {
      // Add the new project to the list
      projects.value.unshift(apiResponse.data)
      return apiResponse.data
    } else {
      const errorMsg = apiResponse?.message || 'Failed to create project'
      throw new Error(errorMsg)
    }
  } catch (err) {
    const errorMsg = handleApiError(err, 'Failed to create project')
    error.value = errorMsg
    throw err
  } finally {
    isLoading.value = false
  }
}

/**
 * Get a specific project by name
 */
export const getProjectByName = async (projectName) => {
  try {
    const formData = new FormData()
    formData.append('project_name', projectName)
    
    const result = await makeFormDataRequest(`${API_BASE}.get_project_by_name`, formData)
    
    // Handle the wrapped response structure
    const apiResponse = result.message || result
    
    if (apiResponse && apiResponse.status === 'success') {
      return apiResponse.data
    } else {
      throw new Error(apiResponse?.message || 'Failed to fetch project')
    }
  } catch (err) {
    throw err
  }
}

/**
 * Get departments for a project
 */
export const getProjectDepartments = async (projectName) => {
  try {
    const formData = new FormData()
    formData.append('project_name', projectName)

    const result = await makeFormDataRequest(`${API_BASE}.get_project_departments`, formData)

    const apiResponse = result.message || result

    if (apiResponse && apiResponse.status === 'success') {
      return Array.isArray(apiResponse.data) ? apiResponse.data : []
    } else {
      throw new Error(apiResponse?.message || 'Failed to fetch project departments')
    }
  } catch (err) {
    throw err
  }
}

/**
 * Set the selected project
 */
export const setSelectedProject = (project) => {
  selectedProject.value = project
  // Store in localStorage for persistence
  if (project) {
    localStorage.setItem('selectedProject', JSON.stringify(project))
  } else {
    localStorage.removeItem('selectedProject')
  }
}

/**
 * Get the selected project from localStorage
 */
export const getStoredSelectedProject = () => {
  try {
    const stored = localStorage.getItem('selectedProject')
    return stored ? JSON.parse(stored) : null
  } catch (err) {
    console.error('Error parsing stored project:', err)
    return null
  }
}

/**
 * Initialize project service
 */
export const initializeProjectService = async () => {
  try {
    await fetchProjects()
    
    // Restore selected project from localStorage
    const storedProject = getStoredSelectedProject()
    if (storedProject) {
      // Verify the project still exists in the list
      const exists = projects.value.find(p => p.name === storedProject.name)
      if (exists) {
        selectedProject.value = storedProject
        // console.log('Project service initialized with stored project:', storedProject.project_name)
      } else {
        console.log('Stored project not found in project list, clearing selection')
        selectedProject.value = null
      }
    } else {
              // console.log('No stored project found')
    }
    
    // Don't auto-select first project - let user choose
    // if (!selectedProject.value && projects.value.length > 0) {
    //   setSelectedProject(projects.value[0])
    // }
  } catch (err) {
    console.error('Error initializing project service:', err)
  }
}

/**
 * Clear error state
 */
export const clearError = () => {
  error.value = null
} 