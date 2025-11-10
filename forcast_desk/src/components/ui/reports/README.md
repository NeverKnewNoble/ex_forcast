# Reports Structure

This directory contains all report components and their associated utilities, organized by report type.

## Folder Structure

```
reports/
├── general/                          # General UI components used across all reports
│   ├── ReportControls.vue           # Report control buttons and actions
│   ├── ReportSectionNoData.vue      # No data state component (section-level)
│   ├── ReportSectionNoDataRow.vue   # No data state component (row-level)
│   ├── ReportsNoProjectSelectedState.vue  # No project selected state
│   └── ReportsNoYearsSelectedState.vue    # No years selected state
│
├── pl/                               # Profit & Loss Statement
│   ├── ProfitLossStatement.vue      # Complete P&L statement component
│   └── utility/                      # P&L-specific utility functions
│       ├── index.js                  # Central exports for all utilities
│       ├── helpers.js                # Helper functions and formatters
│       ├── statisticsData.js         # Statistics calculations
│       ├── revenueData.js            # Revenue calculations
│       └── expensesData.js           # Expense and profit calculations
│
├── balance_sheet/                    # Balance Sheet Report
│   ├── BalanceSheet.vue             # Balance sheet component
│   └── utility/                      # Balance sheet utility functions
│       ├── index.js                  # Central exports
│       ├── helpers.js                # Helper functions and formatters
│       ├── assetsData.js             # Asset calculations
│       ├── liabilitiesData.js        # Liabilities calculations
│       └── equityData.js             # Equity calculations
│
├── cashflow/                         # Cashflow Statement
│   ├── Cashflow.vue                 # Cashflow statement component
│   └── utility/                      # Cashflow utility functions
│       ├── index.js                  # Central exports
│       ├── helpers.js                # Helper functions and formatters
│       ├── inflowsData.js            # Cash inflow calculations
│       └── outflowsData.js           # Cash outflow calculations
│
├── fnb/                              # Food & Beverage Report
│   ├── FoodBeverageProfitLoss.vue   # Main F&B P&L report component
│   └── utility/                      # F&B-specific utility functions
│       ├── index.js                  # Central exports for all utilities
│       ├── formatters.js             # Number, money, percentage formatting
│       ├── helpers.js                # Helper functions (period mapping, labels, etc.)
│       ├── statisticsData.js         # Statistics calculations (rooms, occupancy, etc.)
│       ├── revenueData.js            # Revenue calculations (food, beverage, other)
│       ├── expensesData.js           # Expense calculations (cost of sales, F&B expenses)
│       ├── payrollData.js            # Payroll calculations (management, non-management)
│       └── dataValidation.js         # Data availability checks for sections
│
├── room/                             # Room Revenue Report
│   ├── RoomProfitLoss.vue           # Main Room P&L report component
│   └── utility/                      # Room-specific utility functions
│       ├── index.js                  # Central export file
│       ├── formatters.js             # Number, money, percentage formatting
│       ├── helpers.js                # Helper functions (period mapping, payroll parsing)
│       ├── statisticsData.js         # Statistics calculations (rooms, occupancy, etc.)
│       ├── revenueData.js            # Revenue calculations (segments, room types)
│       ├── expensesData.js           # Expense calculations (room dept, payroll related)
│       ├── payrollData.js            # Payroll calculations (management, non-management)
│       └── dataValidation.js         # Data availability checks for sections
│
└── ood/                              # Other Operating Departments Report
    ├── OODProfitLoss.vue            # Main OOD P&L report component
    └── utility/                      # OOD-specific utility functions
        ├── index.js                  # Central export file
        ├── formatters.js             # Number, money, percentage formatting
        ├── helpers.js                # Helper functions (period mapping, days calculation)
        ├── statisticsData.js         # Statistics calculations (rooms, occupancy, guests)
        ├── revenueData.js            # Revenue calculations (OOD revenue, service charge)
        ├── expensesData.js           # Expense calculations (OOD departments expenses)
        ├── payrollData.js            # Payroll calculations (OOD payroll, related expenses)
        └── dataValidation.js         # Data availability checks for sections
```

## Design Philosophy

### 1. Separation of Concerns
Each report has its own folder containing:
- **Vue Component**: Handles UI rendering and user interactions
- **Utility Folder**: Contains all business logic, calculations, and data processing

### 2. Modularity
Utility functions are organized by purpose:
- **Formatters**: Handle display formatting (money, numbers, percentages)
- **Helpers**: Provide general utility functions (period mapping, label generation)
- **Data Functions**: Handle specific data retrieval and calculations (statistics, revenue, expenses, payroll)
- **Validation**: Check data availability for conditional rendering

### 3. Reusability
General UI components in the `general/` folder can be used across all reports, promoting consistency and reducing duplication.

## Adding a New Report

To add a new report, follow these steps:

1. **Create Report Folder**
   ```bash
   mkdir -p reports/[report-name]/utility
   ```

2. **Create Vue Component**
   - Create `[ReportName].vue` in the report folder
   - Import utility functions from `./utility/index.js`
   - Focus on UI rendering and user interactions

3. **Create Utility Files**
   Organize your business logic into focused files:
   - `formatters.js` - Number/money formatting
   - `helpers.js` - General helper functions
   - `dataCalculations.js` - Main data calculations
   - `dataValidation.js` - Data availability checks
   - `index.js` - Export all utilities

4. **Update Report Config**
   Add your report to `/src/config/reportConfig.js`

5. **Update Router**
   Add route in `/src/router.js`

## Example: Using Utility Functions

### In Vue Component (FoodBeverageProfitLoss.vue)
```vue
<script setup>
import { computed } from 'vue'
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js'
import * as FnbUtils from './utility/index.js'

const calculationCache = useCalculationCache()
const projectName = computed(() => selectedProject.value?.project_name)

// Use utility functions with proper parameters
const totalRevenue = computed(() => {
  return FnbUtils.getTotalRevenue(
    calculationCache,
    projectName.value,
    2024,
    'Jan',
    getRestaurantList,
    getColumnLabelsForYear
  )
})
</script>
```

### In Utility File (revenueData.js)
```javascript
import { getNumber } from './formatters.js'
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js'

export function getTotalRevenue(calculationCache, projectName, year, label, getRestaurantList, getColumnLabelsForYear) {
  try {
    const fnbRevenue = getTotalFoodAndBeverageRevenue(...)
    const otherRevenue = getTotalOtherRevenue(...)
    return getNumber(fnbRevenue) + getNumber(otherRevenue)
  } catch (error) {
    console.error(`Error calculating total revenue:`, error)
    return 0
  }
}
```

## Benefits of This Structure

1. **Maintainability**: Easier to find and update specific calculations
2. **Testability**: Utility functions can be unit tested independently
3. **Readability**: Vue components focus on UI, utilities focus on logic
4. **Scalability**: Easy to add new reports following the same pattern
5. **Performance**: Can optimize individual utility functions without affecting others
6. **Debugging**: Easier to trace issues to specific utility files

## Migration Notes

All existing imports have been updated to reflect the new structure:
- General components moved from `@/components/ui/reports/[Component].vue` 
  to `@/components/ui/reports/general/[Component].vue`
- Report components moved from `@/components/ui/reports/[Report].vue`
  to `@/components/ui/reports/[report-type]/[Report].vue`

Files updated:
- `/src/config/reportConfig.js`
- `/src/components/layouts/ReportPageLayout.vue`
- `/src/pages/general/Receipts_Payments.vue`
- `/src/components/ui/reports/fnb/FoodBeverageProfitLoss.vue`
- `/src/components/ui/reports/room/RoomProfitLoss.vue`
- `/src/components/ui/reports/ood/OODProfitLoss.vue` (NEW)

