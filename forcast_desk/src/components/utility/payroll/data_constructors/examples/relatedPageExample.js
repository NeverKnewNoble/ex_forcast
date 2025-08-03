// Related Page Example - Demonstrates foreign key relationships with payroll

import { 
  transformRelatedPageData, 
  transformRelatedPageToApi, 
  validateRelatedPageData,
  createDefaultRelatedRow 
} from '../index.js';

// Example payroll rows (reference data)
const examplePayrollRows = [
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
];

// Example Bonus API response
const exampleBonusApiResponse = {
  message: {
    "2024": [
      {
        unique_id: "bonus_001",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Manager",
        designation: "Front Office Manager",
        bonus_amount: 5000.00,
        bonus_type: "annual",
        bonus_percentage: 10
      },
      {
        unique_id: "bonus_002",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Non-manager",
        designation: "Receptionist",
        bonus_amount: 1500.00,
        bonus_type: "annual",
        bonus_percentage: 6
      }
    ]
  }
};

// Example Overtime API response
const exampleOvertimeApiResponse = {
  message: {
    "2024": [
      {
        unique_id: "overtime_001",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Manager",
        designation: "Front Office Manager",
        overtime_hours: 20,
        overtime_rate: 25.00,
        overtime_type: "monthly"
      },
      {
        unique_id: "overtime_002",
        department: "ROOMS",
        department_location: "Front Desk",
        position: "Non-manager",
        designation: "Receptionist",
        overtime_hours: 40,
        overtime_rate: 15.00,
        overtime_type: "monthly"
      }
    ]
  }
};

// Example usage functions
export function demonstrateBonusTransformation() {
  console.log('=== Bonus Data Transformation ===');
  
  try {
    const result = transformRelatedPageData(
      exampleBonusApiResponse, 
      'bonus', 
      examplePayrollRows, 
      'Test Project', 
      2024, 
      2024
    );
    
    console.log('Transformed bonus data:', result);
    
    // Validate the transformed data
    const validation = validateRelatedPageData(result, 'bonus', 'frontend');
    console.log('Bonus validation result:', validation);
    
    return result;
  } catch (error) {
    console.error('Error in bonus transformation:', error);
    throw error;
  }
}

export function demonstrateOvertimeTransformation() {
  console.log('=== Overtime Data Transformation ===');
  
  try {
    const result = transformRelatedPageData(
      exampleOvertimeApiResponse, 
      'overtime', 
      examplePayrollRows, 
      'Test Project', 
      2024, 
      2024
    );
    
    console.log('Transformed overtime data:', result);
    
    // Validate the transformed data
    const validation = validateRelatedPageData(result, 'overtime', 'frontend');
    console.log('Overtime validation result:', validation);
    
    return result;
  } catch (error) {
    console.error('Error in overtime transformation:', error);
    throw error;
  }
}

export function demonstrateBonusToApi() {
  console.log('=== Bonus Frontend to API Transformation ===');
  
  const bonusFrontendData = {
    bonusRows: [
      {
        id: "bonus_001",
        payroll_reference: {
          id: "payroll_001",
          unique_id: "payroll_001",
          department: "ROOMS",
          departmentLocation: "Front Desk",
          position: "Manager",
          designation: "Front Office Manager"
        },
        bonus_amount: 5000.00,
        bonus_type: "annual",
        bonus_percentage: 10,
        year: "2024",
        unique_id: "bonus_001",
        pageType: "bonus"
      }
    ],
    bonusData: {
      "2024": {
        "bonus_001": {
          bonus_amount: 5000.00,
          bonus_type: "annual",
          bonus_percentage: 10,
          unique_id: "bonus_001"
        }
      }
    }
  };
  
  try {
    const result = transformRelatedPageToApi(
      bonusFrontendData.bonusRows,
      bonusFrontendData.bonusData,
      'bonus',
      'Test Project'
    );
    
    console.log('Bonus API payload:', result);
    
    return result;
  } catch (error) {
    console.error('Error in bonus to API transformation:', error);
    throw error;
  }
}

export function demonstrateDefaultRelatedRow() {
  console.log('=== Default Related Row Creation ===');
  
  // Create default bonus row with payroll reference
  const payrollReference = examplePayrollRows[0];
  const defaultBonusRow = createDefaultRelatedRow('bonus', payrollReference);
  console.log('Default bonus row:', defaultBonusRow);
  
  // Create default overtime row without payroll reference
  const defaultOvertimeRow = createDefaultRelatedRow('overtime');
  console.log('Default overtime row:', defaultOvertimeRow);
  
  return { defaultBonusRow, defaultOvertimeRow };
}

export function demonstrateForeignKeyMatching() {
  console.log('=== Foreign Key Matching ===');
  
  // Example of how foreign key matching works
  const matchingExample = {
    payrollRow: examplePayrollRows[0],
    bonusItem: {
      department: "ROOMS",
      department_location: "Front Desk",
      position: "Manager",
      designation: "Front Office Manager",
      bonus_amount: 5000.00
    }
  };
  
  console.log('Matching example:', matchingExample);
  console.log('The bonus item will match the payroll row based on:');
  console.log('- department: ROOMS');
  console.log('- department_location: Front Desk');
  console.log('- position: Manager');
  console.log('- designation: Front Office Manager');
  
  return matchingExample;
}

// Run examples if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.relatedPageExamples = {
    demonstrateBonusTransformation,
    demonstrateOvertimeTransformation,
    demonstrateBonusToApi,
    demonstrateDefaultRelatedRow,
    demonstrateForeignKeyMatching
  };
} 