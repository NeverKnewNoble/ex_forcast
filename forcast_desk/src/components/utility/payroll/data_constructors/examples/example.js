// Payroll Data Constructor Example
// Demonstrates how to use the payroll data constructor

import { payrollDataConstructor, transformApiToFrontend, transformFrontendToApi, validatePayrollData } from '../index.js';

// Example API response structure
const exampleApiResponse = {
  message: {
    "2024": [
      {
        unique_id: "payroll_001",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Manager",
        designation: "Front Office Manager",
        salary: 5000.00,
        amount: 1,
        monthly_count: {
          "01": 1,
          "02": 1,
          "03": 1
        }
      },
      {
        unique_id: "payroll_002",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Non-manager",
        designation: "Receptionist",
        salary: 2500.00,
        amount: 3,
        monthly_count: {
          "01": 3,
          "02": 3,
          "03": 3
        }
      }
    ]
  }
};

// Example frontend data structure
const exampleFrontendData = {
  payrollRows: [
    {
      id: "payroll_001",
      department: "ROOMS",
      departmentLocation: "Front Desk",
      position: "Manager",
      designation: "Front Office Manager",
      salary: 5000.00,
      count: 1,
      category: "ROOMS",
      year: "2024",
      unique_id: "payroll_001"
    },
    {
      id: "payroll_002",
      department: "ROOMS",
      departmentLocation: "Front Desk",
      position: "Non-manager",
      designation: "Receptionist",
      salary: 2500.00,
      count: 3,
      category: "ROOMS",
      year: "2024",
      unique_id: "payroll_002"
    }
  ],
  payrollData: {
    "2024": {
      "payroll_001": {
        salary: 5000.00,
        unique_id: "payroll_001",
        count: {
          "01": 1,
          "02": 1,
          "03": 1
        },
        salary: {}
      },
      "payroll_002": {
        salary: 2500.00,
        unique_id: "payroll_002",
        count: {
          "01": 3,
          "02": 3,
          "03": 3
        },
        salary: {}
      }
    }
  }
};

// Example usage functions
export function demonstrateApiToFrontend() {
  console.log('=== API to Frontend Transformation ===');
  
  try {
    const result = transformApiToFrontend(exampleApiResponse, 'Test Project', 2024, 2024);
    console.log('Transformed result:', result);
    
    // Validate the transformed data
    const validation = validatePayrollData(result, 'frontend');
    console.log('Validation result:', validation);
    
    return result;
  } catch (error) {
    console.error('Error in API to Frontend transformation:', error);
    throw error;
  }
}

export function demonstrateFrontendToApi() {
  console.log('=== Frontend to API Transformation ===');
  
  try {
    const result = transformFrontendToApi(
      exampleFrontendData.payrollRows,
      exampleFrontendData.payrollData,
      'Test Project'
    );
    console.log('Transformed result:', result);
    
    return result;
  } catch (error) {
    console.error('Error in Frontend to API transformation:', error);
    throw error;
  }
}

export function demonstrateValidation() {
  console.log('=== Data Validation ===');
  
  // Test valid data
  const validData = {
    payrollRows: [
      {
        department: "ROOMS",
        departmentLocation: "Front Desk",
        position: "Manager",
        designation: "Front Office Manager",
        salary: 5000.00,
        count: 1
      }
    ]
  };
  
  const validResult = validatePayrollData(validData, 'frontend');
  console.log('Valid data validation:', validResult);
  
  // Test invalid data
  const invalidData = {
    payrollRows: [
      {
        department: "",
        departmentLocation: "",
        position: "",
        designation: "",
        salary: -100,
        count: -5
      }
    ]
  };
  
  const invalidResult = validatePayrollData(invalidData, 'frontend');
  console.log('Invalid data validation:', invalidResult);
  
  return { validResult, invalidResult };
}

export function demonstrateDefaultRow() {
  console.log('=== Default Row Creation ===');
  
  const defaultRow = payrollDataConstructor.createDefaultRow();
  console.log('Default row:', defaultRow);
  
  return defaultRow;
}

// Run examples if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.payrollDataConstructorExamples = {
    demonstrateApiToFrontend,
    demonstrateFrontendToApi,
    demonstrateValidation,
    demonstrateDefaultRow
  };
} 