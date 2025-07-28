import { selectedProject } from '@/components/utility/dashboard/projectService.js';

/**
 * Utility functions for project-specific localStorage management
 */

// Helper function to get project-specific localStorage keys
export function getProjectKey(baseKey) {
  const project = selectedProject.value;
  if (!project || !project.project_name) {
    return baseKey; // Fallback to original key if no project
  }
  return `${baseKey}_${project.project_name}`;
}

// Function to clear old localStorage keys (for migration)
export function clearOldLocalStorageKeys() {
  const oldKeys = [
    'expenseEstimateFromYear', 
    'expenseEstimateToYear', 
    'expenseEstimateAdvancedModes',
    'totalNumberOfRooms'
  ];
  oldKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
}

// Function to get all project-specific keys for debugging
export function getAllProjectKeys() {
  const project = selectedProject.value;
  if (!project || !project.project_name) {
    return [];
  }
  
  const baseKeys = [
    'expenseEstimateFromYear', 
    'expenseEstimateToYear', 
    'expenseEstimateAdvancedModes',
    'totalNumberOfRooms'
  ];
  return baseKeys.map(key => `${key}_${project.project_name}`);
}

// Function to debug localStorage state
export function debugLocalStorage() {
  const project = selectedProject.value;
  console.log('Current project:', project?.project_name);
  console.log('Project-specific keys:', getAllProjectKeys());
  
  getAllProjectKeys().forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value);
  });
}

// Function to migrate old keys to project-specific keys
export function migrateToProjectSpecificKeys() {
  const project = selectedProject.value;
  if (!project || !project.project_name) {
    console.warn('No project selected for migration');
    return;
  }

  const migrations = [
    {
      oldKey: 'expenseEstimateFromYear',
      newKey: getProjectKey('expenseEstimateFromYear')
    },
    {
      oldKey: 'expenseEstimateToYear',
      newKey: getProjectKey('expenseEstimateToYear')
    },
    {
      oldKey: 'expenseEstimateAdvancedModes',
      newKey: getProjectKey('expenseEstimateAdvancedModes')
    },
    {
      oldKey: 'totalNumberOfRooms',
      newKey: getProjectKey('totalNumberOfRooms')
    }
  ];

  migrations.forEach(({ oldKey, newKey }) => {
    const oldValue = localStorage.getItem(oldKey);
    if (oldValue) {
      localStorage.setItem(newKey, oldValue);
      localStorage.removeItem(oldKey);
      console.log(`Migrated ${oldKey} to ${newKey}`);
    }
  });
} 