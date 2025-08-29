# ExForcast Frontend Development Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Project Structure](#project-structure)
3. [Core Technologies](#core-technologies)
4. [Application Architecture](#application-architecture)
5. [Utility System](#utility-system)
6. [Page Components](#page-components)
7. [Data Flow & State Management](#data-flow--state-management)
8. [Caching System](#caching-system)
9. [API Integration](#api-integration)
10. [Development Workflow](#development-workflow)
11. [Common Patterns](#common-patterns)
12. [Troubleshooting](#troubleshooting)

## System Overview

The ExForcast Frontend is a Vue.js 3 application built for hotel financial forecasting and management. It provides a comprehensive interface for managing various aspects of hotel operations including room revenue, F&B revenue, banquet revenue, payroll, expenses, and other operating departments (OOD).

### Key Features
- **Multi-Project Support**: Manage multiple forecast projects with isolated data
- **Department-Based Access Control**: Role-based access to different hotel departments
- **Real-time Calculations**: Dynamic financial calculations with caching
- **Responsive Design**: Modern UI with Tailwind CSS and Lucide icons
- **Data Persistence**: Local storage and server synchronization

## Project Structure

```
forcast_desk/
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── utility/            # Business logic utilities
│   ├── pages/                  # Main application pages
│   ├── data/                   # Session and user management
│   ├── utils/                  # General utilities
│   ├── assets/                 # Images and fonts
│   ├── main.js                 # Application entry point
│   ├── router.js               # Vue Router configuration
│   └── App.vue                 # Root component
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── vite.config.mjs            # Vite build configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

## Core Technologies

### Frontend Framework
- **Vue.js 3**: Progressive JavaScript framework with Composition API
- **Vue Router 4**: Client-side routing
- **Pinia**: State management with persistence
- **Vite**: Build tool and development server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Vue**: Modern icon library (replaces Feather Icons)
- **Frappe UI**: Component library for consistent design

### Data Management
- **Pinia Plugin Persistedstate**: Persistent state across sessions
- **Local Storage**: Client-side data caching
- **Unified Cache Service**: Centralized caching system

## Application Architecture

### Entry Point (`main.js`)
The application starts in `main.js` which:
- Initializes Vue app with Frappe UI components
- Sets up Pinia store with persistence
- Initializes unified cache service
- Provides global debug functions
- Mounts the application

### Routing (`router.js`)
The router implements:
- **Route Guards**: Authentication and department-based access control
- **Lazy Loading**: Code splitting for better performance
- **Meta Requirements**: Department-specific route restrictions

### Core Pages
1. **Dashboard**: Project selection and overview
2. **Room Revenue**: Hotel room forecasting
3. **F&B Revenue**: Food and beverage projections
4. **Banquet Revenue**: Event and banquet planning
5. **Payroll Data**: Employee compensation management
6. **Expense Estimate**: Cost projections
7. **OOD Data**: Other operating departments
8. **Reports**: Financial summaries and analytics

## Utility System

The utility system is organized into domain-specific modules, each handling specific business logic:

### 1. Dashboard Utilities (`/utility/dashboard/`)

#### `projectService.js`
**Purpose**: Manages forecast projects and project selection
**Key Functions**:
- `fetchProjects()`: Retrieves all projects from server
- `createProject()`: Creates new forecast projects
- `getProjectByName()`: Retrieves specific project details
- `getProjectDepartments()`: Gets departments for a project
- `selectedProject`: Reactive reference to current project

#### `apiUtils.js`
**Purpose**: Centralized API request handling
**Key Functions**:
- `makeApiRequest()`: Standard API calls
- `makeFormDataRequest()`: Form data submissions
- `handleApiError()`: Error handling and formatting

### 2. Room Revenue Utilities (`/utility/room_revenue_assumpt/`)

#### `room_revenue_utils.js`
**Purpose**: Core room revenue calculations and data management
**Key Functions**:
- `ROOM_TYPES`: Constants for different room categories
- `calculateRevenue()`: Revenue calculations per room type
- `calculateRoomTypeTotal()`: Aggregated totals
- `getVisibleYears()`: Year range management
- `getColumnLabels()`: Monthly/quarterly display modes

#### `market_segment_manager.js`
**Purpose**: Market segment analysis and management
**Key Functions**:
- Market segment creation and editing
- Segment-based revenue calculations
- Data validation and formatting

#### `room_revenue_table_utils.js`
**Purpose**: Table interaction and data editing
**Key Functions**:
- `handleRoomCellEdit()`: Cell editing handlers
- `saveRoomChanges()`: Data persistence
- `formatRoomAmountInput()`: Input formatting

#### `data_service.js`
**Purpose**: API integration for room revenue data
**Key Functions**:
- `getRoomRevenueList()`: Data retrieval
- `saveMarketSegmentChanges()`: Data persistence
- `extractAllRoomRevenuePackages()`: Data extraction

### 3. Expense Assumption Utilities (`/utility/expense_assumption/`)

#### `expense_formular.js`
**Purpose**: Expense calculation formulas and logic
**Key Functions**:
- `getVisibleYears()`: Year range for expense projections
- `calculateTotal()`: Expense total calculations
- `getColumnLabels()`: Display mode management

#### `table_utils.js`
**Purpose**: Expense table display and interaction
**Key Functions**:
- `getExpensesGroupedByCategory()`: Data organization
- `calculateTotalForExpense()`: Expense-specific calculations
- `extractFieldOptionsFromData()`: Form field options

#### `advanced_settings.js`
**Purpose**: Advanced expense configuration
**Key Functions**:
- `initializeAdvancedModes()`: Mode initialization
- `applyAdvancedSettings()`: Settings application
- `getColumnLabelsForYear()`: Dynamic column generation

#### `save_changes.js`
**Purpose**: Expense data persistence
**Key Functions**:
- `saveChanges()`: Data saving with validation
- Error handling and user feedback

### 4. Payroll Utilities (`/utility/payroll/`)

#### `payroll_data_service.js`
**Purpose**: Payroll data management and API integration
**Key Functions**:
- `showAddPayrollModal()`: Modal management
- `submitPayrollData()`: Data submission
- `loadDepartmentOptions()`: Department data loading
- `savePayrollChanges()`: Data persistence

#### `payroll_calculations.js`
**Purpose**: Complex payroll calculations
**Key Functions**:
- `calculatePayrollTotal()`: Overall payroll calculations
- `calculateSubTotalManagement()`: Management calculations
- `calculateEmployeeRoomRatio()`: Employee-to-room ratios
- Location and category-specific calculations

#### `payroll_data_utils.js`
**Purpose**: Payroll data utilities and formatting
**Key Functions**:
- `getUniqueCategories()`: Category management
- `formatCurrency()`: Currency formatting
- `handlePayrollCellEdit()`: Cell editing
- `addSamplePayrollData()`: Sample data generation

#### `payroll_constants.js`
**Purpose**: Payroll system constants
**Key Constants**:
- `PAYROLL_CATEGORIES`: Available categories
- `POSITION_TYPES`: Employee position types
- `FIELD_TYPES`: Form field definitions

### 5. F&B Revenue Utilities (`/utility/f&b_revenue_assumpt/`)

#### `fnb_table_utils.js`
**Purpose**: F&B table management and calculations
**Key Functions**:
- Table data handling and validation
- Revenue calculations per restaurant
- Monthly/quarterly data management

#### `fnb_data_service.js`
**Purpose**: F&B data API integration
**Key Functions**:
- Restaurant data loading
- Revenue data persistence
- Default data management

#### `fnb_modal_utils.js`
**Purpose**: F&B modal and form management
**Key Functions**:
- Modal state management
- Form validation and submission
- Data editing interfaces

### 6. Banquet Revenue Utilities (`/utility/banquet_revenue_assumpt/`)

#### `banquet_calculations.js`
**Purpose**: Banquet revenue calculations
**Key Functions**:
- `calcFood()`: Food cost calculations
- `calcLiquor()`: Beverage calculations
- `calcGross()`: Gross revenue calculations
- `calcNetAmount()`: Net revenue after costs

#### `banquet_data_service.js`
**Purpose**: Banquet data management
**Key Functions**:
- `loadBanquetRevenueData()`: Data loading
- `saveBanquetRevenueChanges()`: Data persistence
- `convertBanquetServerDataToFrontend()`: Data transformation

#### `banquet_fields.js`
**Purpose**: Banquet form field definitions
**Key Functions**:
- Field type definitions
- Validation rules
- Display formatting

### 7. OOD Data Utilities (`/utility/ood_data/`)

#### `ood_calculations.js`
**Purpose**: Other operating departments calculations
**Key Functions**:
- Revenue calculations for various departments
- Cost analysis and projections
- Performance metrics

#### `ood_defaults.js`
**Purpose**: Default OOD configurations
**Key Functions**:
- Default department settings
- Standard operating parameters
- Initial data structures

### 8. Bonus Utilities (`/utility/bonus/`)

#### `bonus_calculations.js`
**Purpose**: Employee bonus calculations
**Key Functions**:
- `calculateSubTotalManagementBonus()`: Management bonuses
- `calculateLocationTotalBonus()`: Location-based bonuses
- `calculateEmployeeRoomRatioBonus()`: Performance-based bonuses

#### `bonus_data_service.js`
**Purpose**: Bonus data management
**Key Functions**:
- `fetchBonusData()`: Data retrieval
- `saveBonusChanges()`: Data persistence
- `addBonusChange()`: Change tracking

#### `bonus_utils.js`
**Purpose**: Bonus utility functions
**Key Functions**:
- `getBonusPercentage()`: Percentage calculations
- `handleBonusPercentageInput()`: Input handling
- Various bonus total calculations

### 9. Receipts & Payments Utilities (`/utility/receipts/`)

#### `collections.js`
**Purpose**: Receipt collection management
**Key Functions**:
- Collection data handling
- Payment processing
- Data validation

#### `payments.js`
**Purpose**: Payment management
**Key Functions**:
- Payment processing
- Transaction tracking
- Data persistence

#### `payment_ui_helpers.js`
**Purpose**: Payment UI assistance
**Key Functions**:
- Form validation
- User interface helpers
- Data formatting

### 10. Reports Utilities (`/utility/reports/`)

#### `reportDataService.js`
**Purpose**: Unified reporting data service
**Key Functions**:
- `getReportData()`: Comprehensive data collection
- `debugCache()`: Cache inspection
- `loadUnifiedData()`: Unified data loading
- `getReportDataForYears()`: Year-specific data

### 11. Master Utilities (`/utility/_master_utility/`)

#### `unifiedCacheService.js`
**Purpose**: Centralized caching system
**Key Functions**:
- `initialize()`: Service initialization
- `setValue()`: Cache value setting
- `getValue()`: Cache value retrieval
- `loadProjectCache()`: Project-specific cache loading
- `persistToStorage()`: Data persistence

#### `useCalculationCache.js`
**Purpose**: Calculation result caching
**Key Functions**:
- Cache management for calculations
- Performance optimization
- Data consistency

#### `usePageDataRecovery.js`
**Purpose**: Page data recovery and persistence
**Key Functions**:
- Data recovery mechanisms
- State persistence
- Error handling

## Page Components

### Dashboard (`Dashboard.vue`)
**Purpose**: Main application dashboard and project selection
**Key Features**:
- Project selector dropdown
- Project statistics display
- Navigation to other modules
- Real-time project information

**Utility Dependencies**:
- `projectService.js`: Project management
- `yearSettingsStore.js`: Year configuration

### Room Revenue (`Room_Revenue.vue`)
**Purpose**: Hotel room revenue forecasting and management
**Key Features**:
- Room type management
- Market segment analysis
- Revenue projections
- Monthly/quarterly views

**Utility Dependencies**:
- All room revenue utilities
- Market segment management
- Revenue calculations

### F&B Revenue (`F&B_Revenue_Assumpt.vue`)
**Purpose**: Food and beverage revenue projections
**Key Features**:
- Restaurant management
- Revenue calculations
- Cost analysis
- Performance metrics

**Utility Dependencies**:
- F&B revenue utilities
- Restaurant management
- Revenue calculations

### Banquet Revenue (`Banquet_Revenue.vue`)
**Purpose**: Banquet and event revenue management
**Key Features**:
- Event planning
- Cost calculations
- Revenue projections
- Performance analysis

**Utility Dependencies**:
- Banquet utilities
- Calculation engines
- Data services

### Payroll Data (`payroll/Payroll_Data.vue`)
**Purpose**: Employee payroll management
**Key Features**:
- Employee data management
- Salary calculations
- Department organization
- Location management

**Utility Dependencies**:
- Payroll utilities
- Data constructors
- Calculation engines

### Expense Estimate (`Expense_Estimate.vue`)
**Purpose**: Expense forecasting and management
**Key Features**:
- Expense categorization
- Cost projections
- Advanced settings
- Data filtering

**Utility Dependencies**:
- Expense assumption utilities
- Advanced settings
- Data services

### OOD Data (`OOD_Data.vue`)
**Purpose**: Other operating departments management
**Key Features**:
- Department management
- Revenue projections
- Cost analysis
- Performance metrics

**Utility Dependencies**:
- OOD utilities
- Calculation engines
- Data services

### Reports (`Reports.vue`)
**Purpose**: Financial reporting and analytics
**Key Features**:
- Comprehensive reporting
- Data visualization
- Export capabilities
- Performance analysis

**Utility Dependencies**:
- Report data service
- Unified cache service
- All module utilities

## Data Flow & State Management

### State Management Architecture
1. **Pinia Stores**: Centralized state management
2. **Reactive References**: Vue 3 reactivity system
3. **Local Storage**: Persistent data storage
4. **Unified Cache**: Performance optimization

### Data Flow Pattern
1. **User Input** → **Utility Functions** → **State Update** → **Cache Persistence**
2. **API Calls** → **Data Transformation** → **State Update** → **UI Update**
3. **Cache Loading** → **State Restoration** → **UI Rendering**

### State Persistence
- **Pinia Plugin Persistedstate**: Automatic state persistence
- **Project-Specific Keys**: Isolated data per project
- **Local Storage**: Client-side data caching
- **Server Synchronization**: Backend data persistence

## Caching System

### Unified Cache Service
**Purpose**: Centralized caching for all application data
**Features**:
- Project-specific cache isolation
- Automatic persistence to localStorage
- In-memory cache optimization
- Error handling and recovery

### Cache Structure
```
cache[projectId][pageId][rowCode][year][label] = value
```

### Cache Operations
- **Set Value**: Updates cache and persists to storage
- **Get Value**: Retrieves from cache with fallback
- **Load Project Cache**: Project-specific cache loading
- **Clear Cache**: Cache cleanup and management

### Performance Benefits
- Reduced API calls
- Faster data access
- Improved user experience
- Offline capability

## API Integration

### API Structure
- **Base URL**: `/api/method/ex_forcast.api`
- **Endpoints**: Specific method calls for each module
- **Authentication**: Session-based authentication
- **Error Handling**: Centralized error management

### API Utilities
- **Standard Requests**: GET/POST operations
- **Form Data**: File uploads and complex data
- **Error Handling**: Consistent error responses
- **Response Processing**: Data transformation

### Data Transformation
- **API to Frontend**: Server data conversion
- **Frontend to API**: Client data preparation
- **Validation**: Data integrity checks
- **Formatting**: Display-ready data preparation

## Development Workflow

### Setup Instructions
1. **Install Dependencies**: `yarn install` or `npm install`
2. **Development Server**: `yarn dev` or `npm run dev`
3. **Build Production**: `yarn build` or `npm run build`
4. **Preview Build**: `yarn preview` or `npm run preview`

### Development Commands
```bash
# Development
yarn dev                    # Start development server
yarn build                  # Build for production
yarn preview                # Preview production build

# Dependencies
yarn add <package>          # Add new dependency
yarn remove <package>       # Remove dependency
yarn upgrade                # Upgrade dependencies
```

### Code Organization
- **Utility Functions**: Business logic in `/utility/` folders
- **Page Components**: Main views in `/pages/` folder
- **UI Components**: Reusable components in `/components/ui/`
- **Data Management**: State and API in `/data/` and utility files

## Common Patterns

### Utility Module Pattern
Each utility module follows this structure:
1. **Index File**: Exports all functions and constants
2. **Core Logic**: Main business logic functions
3. **Data Services**: API integration and data management
4. **Helper Functions**: Utility and formatting functions

### Component Pattern
Vue components follow this structure:
1. **Template**: HTML structure with Tailwind classes
2. **Script**: Component logic and utility imports
3. **Style**: Component-specific styling

### State Management Pattern
1. **Reactive References**: `ref()` for simple state
2. **Computed Properties**: Derived state calculations
3. **Watchers**: Side effects and state synchronization
4. **Pinia Stores**: Complex state management

## Troubleshooting

### Common Issues

#### Cache Problems
- **Symptoms**: Data not persisting, calculations incorrect
- **Solution**: Check unified cache service initialization
- **Debug**: Use `window.unifiedCacheService` in console

#### Project Selection Issues
- **Symptoms**: Can't access pages, department errors
- **Solution**: Verify project selection in dashboard
- **Debug**: Check `selectedProject.value` in console

#### API Connection Issues
- **Symptoms**: Data not loading, network errors
- **Solution**: Verify API endpoints and authentication
- **Debug**: Check browser network tab and console

#### State Persistence Issues
- **Symptoms**: Data lost on refresh, form resets
- **Solution**: Verify Pinia persistence configuration
- **Debug**: Check localStorage and Pinia devtools

### Debug Tools
- **Console Functions**: Global debug functions available
- **Cache Inspection**: `window.unifiedCacheService.debugCache()`
- **Local Storage**: `window.debugProjectLocalStorage()`
- **Vue Devtools**: Component inspection and state debugging

### Performance Optimization
- **Lazy Loading**: Route-based code splitting
- **Caching**: Unified cache service for data
- **Debouncing**: Input event optimization
- **Virtual Scrolling**: Large table performance

## Best Practices

### Code Organization
1. **Single Responsibility**: Each utility file has one purpose
2. **Consistent Naming**: Clear, descriptive function names
3. **Error Handling**: Comprehensive error management
4. **Documentation**: Detailed function documentation

### Performance
1. **Caching**: Use unified cache service for data
2. **Lazy Loading**: Implement route-based code splitting
3. **Debouncing**: Optimize user input handling
4. **Memory Management**: Clean up unused references

### User Experience
1. **Loading States**: Show progress indicators
2. **Error Messages**: Clear, actionable error feedback
3. **Data Validation**: Real-time input validation
4. **Responsive Design**: Mobile-friendly interfaces

### Security
1. **Input Validation**: Validate all user inputs
2. **Authentication**: Verify user permissions
3. **Data Sanitization**: Clean data before processing
4. **Access Control**: Department-based route protection

This development guide provides a comprehensive overview of the ExForcast frontend system. For specific implementation details, refer to the individual utility files and their documentation comments.
