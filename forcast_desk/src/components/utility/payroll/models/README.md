# Payroll Data ORM Models

This directory contains ORM models for the payroll data system to fix the relationship issues between base counts and monthly overrides.

## Problem Statement

The current payroll system has a problematic relationship between:
- **Base Count**: The main count value in `payroll_data_items.amount`
- **Monthly Counts**: Month-specific overrides in `payroll_monthly_count.count`

The issue is that changes to monthly counts are incorrectly affecting the base count, and vice versa.

## ORM Solution

### Core Models

1. **PayrollItem** - Represents a payroll position with base salary and count
2. **PayrollMonthlyCount** - Represents month-specific count overrides
3. **PayrollYear** - Represents a year's payroll data
4. **PayrollProject** - Represents project-specific payroll data

### Key Features

- **Proper Separation**: Base counts and monthly overrides are completely separate
- **Immutable Base Values**: Base salary and count cannot be modified by monthly changes
- **Override System**: Monthly counts are pure overrides that don't affect base values
- **Type Safety**: Strong typing prevents incorrect data relationships
- **Validation**: Built-in validation ensures data integrity

### Usage

```javascript
// Create a payroll item
const item = new PayrollItem({
  department: 'ROOMS',
  departmentLocation: 'Front Desk',
  position: 'Manager',
  designation: 'Front Office Manager',
  salary: 5000,
  count: 1
});

// Add monthly overrides (these don't affect the base count)
item.setMonthlyCount('Jan', 2);
item.setMonthlyCount('Feb', 3);

// Get calculated values
const janCount = item.getMonthlyCount('Jan'); // Returns 2 (override)
const marCount = item.getMonthlyCount('Mar'); // Returns 1 (base count)
const janSalary = item.getMonthlySalary('Jan'); // Returns 10000 (5000 * 2)
```

## Migration Strategy

1. **Phase 1**: Create sandbox models and test with dummy data
2. **Phase 2**: Implement model adapters for existing data
3. **Phase 3**: Gradually migrate frontend to use models
4. **Phase 4**: Update backend to use model structure

## Benefits

- **Data Integrity**: Prevents incorrect relationships between base and monthly values
- **Type Safety**: Compile-time checking prevents runtime errors
- **Maintainability**: Clear separation of concerns
- **Testability**: Easy to unit test individual components
- **Extensibility**: Easy to add new features without breaking existing code 