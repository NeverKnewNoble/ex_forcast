# Payroll Data Constructor

A comprehensive data transformation and validation system for payroll data that handles conversion between API responses and frontend format.

## Features

- **Data Transformation**: Seamlessly convert between API and frontend data formats
- **Foreign Key Relationships**: Support for related pages with payroll as reference
- **Validation**: Built-in validation for both API and frontend data
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Type Safety**: Strong typing and validation rules
- **Modular Design**: Easy to extend and maintain

## Usage

### Basic Import

```javascript
import { 
  payrollDataConstructor, 
  transformApiToFrontend, 
  transformFrontendToApi, 
  validatePayrollData 
} from '@/components/utility/payroll/data_constructors/index.js';
```

### Transform API Response to Frontend

```javascript
// API response from backend
const apiResponse = {
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
        monthly_count: { "01": 1, "02": 1, "03": 1 }
      }
    ]
  }
};

// Transform to frontend format
const frontendData = transformApiToFrontend(apiResponse, 'Project Name', 2024, 2024);

console.log(frontendData);
// Output:
// {
//   payrollData: { "2024": { "payroll_001": { salary: 5000, unique_id: "payroll_001", count: {...}, salary: {} } } },
//   payrollRows: [{ id: "payroll_001", department: "ROOMS", ... }],
//   projectName: "Project Name",
//   totalRows: 1
// }
```

### Transform Frontend Data to API

```javascript
// Frontend data structure
const frontendData = {
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
    }
  ],
  payrollData: { /* monthly data */ }
};

// Transform to API format
const apiData = transformFrontendToApi(frontendData.payrollRows, frontendData.payrollData, 'Project Name');

console.log(apiData);
// Output:
// {
//   changes: [{
//     department: "ROOMS",
//     department_location: "Front Desk",
//     position: "Manager",
//     designation: "Front Office Manager",
//     salary: 5000.00,
//     amount: 1,
//     unique_id: "payroll_001"
//   }],
//   project: "Project Name"
// }
```

### Validate Data

```javascript
// Validate frontend data
const validation = validatePayrollData(frontendData, 'frontend');

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  console.warn('Validation warnings:', validation.warnings);
} else {
  console.log('Data is valid');
}
```

### Create Default Row

```javascript
const defaultRow = payrollDataConstructor.createDefaultRow();
// Returns: { id: "payroll_1234567890_abc123", department: "", departmentLocation: "", ... }
```

### Transform Related Page Data (Foreign Key)

```javascript
// Transform bonus data with payroll reference
const bonusData = transformRelatedPageData(
  bonusApiResponse, 
  'bonus', 
  payrollRows, 
  'Project Name', 
  2024, 
  2024
);

// Transform overtime data with payroll reference
const overtimeData = transformRelatedPageData(
  overtimeApiResponse, 
  'overtime', 
  payrollRows, 
  'Project Name', 
  2024, 
  2024
);
```

### Create Default Related Row

```javascript
// Create bonus row with payroll reference
const payrollReference = payrollRows[0];
const defaultBonusRow = createDefaultRelatedRow('bonus', payrollReference);

// Create overtime row without reference
const defaultOvertimeRow = createDefaultRelatedRow('overtime');
```

## API Reference

### PayrollDataConstructor Class

#### Methods

- `transformApiToFrontend(apiResponse, projectName, fromYear?, toYear?)`
  - Transforms API response to frontend format
  - Returns: `{ payrollData, payrollRows, projectName, totalRows }`

- `transformFrontendToApi(payrollRows, payrollData, projectName)`
  - Transforms frontend data to API format
  - Returns: `{ changes, project }`

- `transformRelatedPageData(apiResponse, pageType, payrollRows, projectName, fromYear?, toYear?)`
  - Transforms related page data with foreign key reference to payroll
  - Returns: `{ pageTypeData, pageTypeRows, projectName, totalRows, pageType, foreignKeyRelation }`

- `transformRelatedPageToApi(relatedRows, relatedData, pageType, projectName)`
  - Transforms related page frontend data to API format
  - Returns: `{ changes, project, pageType }`

- `validatePayrollData(data, type)`
  - Validates data structure
  - `type`: 'api' or 'frontend'
  - Returns: `{ isValid, errors, warnings }`

- `validateRelatedPageData(data, pageType, type)`
  - Validates related page data structure
  - `pageType`: 'bonus', 'overtime', 'benefits', etc.
  - `type`: 'api' or 'frontend'
  - Returns: `{ isValid, errors, warnings }`

- `createDefaultRow()`
  - Creates a default payroll row
  - Returns: Default row object with unique ID

- `createDefaultRelatedRow(pageType, payrollReference?)`
  - Creates a default related page row
  - `pageType`: 'bonus', 'overtime', 'benefits', etc.
  - `payrollReference`: Optional reference payroll row
  - Returns: Default related row object with unique ID

- `generateRowId()`
  - Generates unique row ID
  - Returns: Unique string ID

- `mergeApiChanges(existingData, apiChanges)`
  - Merges API changes with existing data
  - Returns: Merged data object

- `extractChanges(payrollData, originalData)`
  - Extracts changes between current and original data
  - Returns: Array of changes

## Data Structures

### Payroll API Format
```javascript
{
  message: {
    "2024": [
      {
        unique_id: "string",
        department: "string",
        department_location: "string",
        position: "string",
        designation: "string",
        salary: number,
        amount: number,
        monthly_count: { "01": number, "02": number, ... }
      }
    ]
  }
}
```

### Payroll Frontend Format
```javascript
{
  payrollData: {
    "2024": {
      "row_id": {
        salary: number,
        unique_id: "string",
        count: { "01": number, "02": number, ... },
        salary: {}
      }
    }
  },
  payrollRows: [
    {
      id: "string",
      department: "string",
      departmentLocation: "string",
      position: "string",
      designation: "string",
      salary: number,
      count: number,
      category: "string",
      year: "string",
      unique_id: "string"
    }
  ]
}
```

### Related Page API Format (e.g., Bonus)
```javascript
{
  message: {
    "2024": [
      {
        unique_id: "string",
        department: "string",
        department_location: "string",
        position: "string",
        designation: "string",
        bonus_amount: number,
        bonus_type: "string",
        bonus_percentage: number
      }
    ]
  }
}
```

### Related Page Frontend Format (e.g., Bonus)
```javascript
{
  bonusData: {
    "2024": {
      "row_id": {
        bonus_amount: number,
        bonus_type: "string",
        bonus_percentage: number,
        unique_id: "string",
        payroll_reference: { ... }
      }
    }
  },
  bonusRows: [
    {
      id: "string",
      payroll_reference: {
        id: "string",
        unique_id: "string",
        department: "string",
        departmentLocation: "string",
        position: "string",
        designation: "string"
      },
      bonus_amount: number,
      bonus_type: "string",
      bonus_percentage: number,
      year: "string",
      unique_id: "string",
      pageType: "bonus"
    }
  ]
}
```

## Validation Rules

### Payroll Required Fields
- department
- departmentLocation
- position
- designation

### Payroll Numeric Fields
- salary (minimum: 0)
- count (minimum: 0)

### Related Page Required Fields
- **Bonus**: bonus_amount, bonus_type
- **Overtime**: overtime_hours, overtime_rate
- **Benefits**: benefit_type, benefit_amount

### Department Categories
- ROOMS
- FOOD & BEVERAGE
- OTHER OPERATING DEPARTMENTS
- ADMINISTRATION & GENERAL
- INFORMATION & TELECOMMUNICATION SYSTEMS
- SALES & MARKETING
- POM

### Foreign Key Relationships
- **bonus**: References payroll by department, departmentLocation, position, designation
- **overtime**: References payroll by department, departmentLocation, position, designation
- **benefits**: References payroll by department, departmentLocation, position, designation

## Error Handling

The constructor includes comprehensive error handling:

- **Invalid API Response**: Throws error for malformed API responses
- **Missing Required Fields**: Validation errors for missing required data
- **Invalid Numeric Values**: Validation for negative or non-numeric values
- **Data Type Mismatches**: Automatic type conversion with validation

## Integration

The data constructor is already integrated into the payroll system:

1. **payroll_data_service.js**: Uses constructor for all data transformations
2. **Payroll_Data.vue**: Benefits from validated and transformed data
3. **payroll_calculations.js**: Works with standardized data format

## Testing

Use the example file to test the constructor:

```javascript
import { demonstrateApiToFrontend, demonstrateFrontendToApi } from './example.js';

// Run examples
demonstrateApiToFrontend();
demonstrateFrontendToApi();
``` 