# Ex Forecast - Business Forecasting Application

A comprehensive business forecasting application built with Vue.js frontend and Python backend, designed to help businesses make data-driven decisions through advanced financial projections and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Front-end User Documentation](#front-end-user-documentation)
- [Development Documentation](#development-documentation)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Ex Forecast is a modern business forecasting application that provides comprehensive financial planning and analysis tools. The application combines real-time data processing with intuitive user interfaces to deliver actionable insights for business decision-making.

### Key Capabilities
- **Revenue Forecasting**: Room revenue, F&B revenue, and banquet revenue projections
- **Expense Management**: Comprehensive expense estimation and tracking
- **Payroll Analytics**: Department-wise payroll analysis and projections
- **Real-time Dashboards**: Interactive analytics and reporting
- **Multi-project Support**: Manage multiple forecasting projects simultaneously

## ✨ Features

### Core Forecasting Modules
- **Room Revenue Forecasting**: Market segment analysis and room package management
- **F&B Revenue Projections**: Restaurant and food service revenue planning
- **Banquet Revenue Management**: Event and banquet service forecasting
- **Expense Estimation**: Comprehensive cost analysis and budgeting
- **Payroll Analytics**: Department and designation-based payroll projections

### Technical Features
- **Modern UI/UX**: Built with Vue.js 3 and Tailwind CSS
- **Real-time Updates**: Live data synchronization and updates
- **Responsive Design**: Mobile-first responsive interface
- **Data Visualization**: Interactive charts and analytics
- **Multi-user Support**: Role-based access and permissions

---

# 📖 Front-end User Documentation

## 🚀 Getting Started

### Accessing the Application
1. Navigate to the application URL
2. Log in with your credentials
3. Select your project from the project dropdown
4. Start exploring the dashboard

### Navigation Overview
The application features a clean, intuitive navigation system:
- **Dashboard**: Overview and key metrics
- **Room Revenue**: Room forecasting and market analysis
- **F&B Revenue**: Food and beverage projections
- **Banquet Revenue**: Event and banquet planning
- **Expense Estimate**: Cost analysis and budgeting
- **OOD Data**: Out-of-door data management
- **Reports**: Comprehensive reporting and analytics

## 📊 Dashboard

### Overview
The dashboard provides a comprehensive overview of your forecasting project with:
- **Project Status**: Active project information and metrics
- **Key Statistics**: Real-time data cards showing important metrics
- **Quick Actions**: Fast access to main forecasting modules
- **Recent Activity**: Latest updates and changes

### Key Features
- **Project Selector**: Switch between different forecasting projects
- **Live Metrics**: Real-time updates of key performance indicators
- **Quick Navigation**: Direct access to all major modules
- **Status Indicators**: Visual status of data completeness and accuracy

## 🏨 Room Revenue Forecasting

### Purpose
Manage and forecast room revenue based on market segments, occupancy rates, and pricing strategies.

### Key Functions
- **Market Segment Analysis**: Define and manage market segments
- **Room Package Management**: Create and manage room packages
- **Revenue Projections**: Generate detailed revenue forecasts
- **Occupancy Planning**: Plan and track occupancy rates
- **Pricing Strategy**: Implement dynamic pricing strategies

### Data Entry
1. **Market Segments**: Define your target market segments
2. **Room Packages**: Create packages with pricing and features
3. **Occupancy Rates**: Set expected occupancy for each segment
4. **Revenue Assumptions**: Configure revenue calculation parameters

## 🍽️ F&B Revenue Forecasting

### Purpose
Forecast food and beverage revenue across different outlets and services.

### Key Functions
- **Restaurant Management**: Manage multiple restaurant outlets
- **Revenue Projections**: Calculate F&B revenue forecasts
- **Menu Analysis**: Analyze menu performance and pricing
- **Service Planning**: Plan service capacity and staffing

### Data Entry
1. **Restaurant Setup**: Configure restaurant outlets and services
2. **Revenue Assumptions**: Set revenue calculation parameters
3. **Service Planning**: Define service hours and capacity
4. **Menu Analysis**: Input menu items and pricing

## 🎉 Banquet Revenue Forecasting

### Purpose
Plan and forecast revenue from events, conferences, and banquet services.

### Key Functions
- **Event Planning**: Schedule and manage events
- **Revenue Projections**: Calculate banquet revenue forecasts
- **Capacity Planning**: Plan venue capacity and staffing
- **Service Packages**: Create and manage service packages

### Data Entry
1. **Event Setup**: Configure event types and services
2. **Revenue Assumptions**: Set revenue calculation parameters
3. **Capacity Planning**: Define venue capacity and availability
4. **Service Packages**: Create banquet service packages

## 💰 Expense Estimation

### Purpose
Comprehensive expense planning and cost analysis for business operations.

### Key Functions
- **Cost Categories**: Organize expenses by categories
- **Budget Planning**: Set and track budget allocations
- **Expense Tracking**: Monitor actual vs. planned expenses
- **Variance Analysis**: Analyze budget variances and trends

### Data Entry
1. **Expense Categories**: Define expense categories and subcategories
2. **Budget Allocation**: Set budget amounts for each category
3. **Cost Assumptions**: Configure cost calculation parameters
4. **Variance Tracking**: Monitor actual vs. planned expenses

## 👥 Payroll Analytics

### Purpose
Analyze and forecast payroll expenses by department and designation.

### Key Functions
- **Department Analysis**: Track payroll by department
- **Designation Planning**: Plan staffing by job roles
- **Cost Projections**: Forecast payroll expenses
- **Staffing Optimization**: Optimize staffing levels

### Data Entry
1. **Department Setup**: Configure departments and structure
2. **Designation Management**: Define job roles and responsibilities
3. **Payroll Assumptions**: Set salary and benefit parameters
4. **Staffing Plans**: Plan headcount by department

## 📈 Reports and Analytics

### Available Reports
- **Revenue Reports**: Comprehensive revenue analysis
- **Expense Reports**: Detailed expense breakdowns
- **Payroll Reports**: Department-wise payroll analysis
- **Variance Reports**: Actual vs. planned comparisons
- **Trend Analysis**: Historical data and trend analysis

### Export Options
- **PDF Reports**: Generate printable reports
- **Excel Export**: Export data for further analysis
- **Data Visualization**: Interactive charts and graphs

---

# 🔧 Development Documentation

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: Vue.js 3, Tailwind CSS, Vite
- **Backend**: Python (Frappe Framework)
- **Database**: MySQL/PostgreSQL
- **Build Tool**: Vite
- **Package Manager**: Yarn/NPM

### Project Structure
```
ex_forcast/
├── ex_forcast/           # Backend Python application
│   ├── api/             # API endpoints
│   ├── config/          # Configuration files
│   ├── hooks.py         # Application hooks
│   └── public/          # Static assets
├── forcast_desk/        # Frontend Vue.js application
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── pages/       # Page components
│   │   ├── router.js    # Vue router configuration
│   │   └── main.js      # Application entry point
│   ├── public/          # Static assets
│   └── package.json     # Frontend dependencies
└── README.md           # This documentation
```

## 🚀 Development Setup

### Prerequisites
- Node.js 16+ and Yarn/NPM
- Python 3.8+
- Frappe Framework
- MySQL/PostgreSQL

### Installation Steps

#### 1. Backend Setup
```bash
# Navigate to the project directory
cd ex_forcast

# Install Python dependencies
pip install -r requirements.txt

# Setup Frappe environment
bench setup requirements
bench migrate
```

#### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd forcast_desk

# Install dependencies
yarn install

# Start development server
yarn dev
```

#### 3. Build Process
```bash
# Build frontend for production
yarn build

# The build process will:
# 1. Build Vue.js application
# 2. Copy assets to backend public directory
# 3. Generate HTML entry point
```

## 📁 Code Organization

### Frontend Structure
```
forcast_desk/src/
├── components/          # Reusable Vue components
├── pages/              # Page-level components
│   ├── Dashboard.vue   # Main dashboard
│   ├── Room_Revenue.vue # Room forecasting
│   ├── F&B_Revenue_Assumpt.vue # F&B forecasting
│   ├── Banquet_Revenue.vue # Banquet forecasting
│   ├── Expense_Estimate.vue # Expense management
│   └── OOD_Data.vue    # Out-of-door data
├── router.js           # Vue router configuration
├── main.js            # Application entry point
└── index.css          # Global styles
```

### Backend Structure
```
ex_forcast/
├── api/                # API endpoints
│   ├── room_revenue_display.py
│   ├── call_and_save_fnb_revenue.py
│   ├── call_and_save_banquet_revenue.py
│   ├── expense_estimate.py
│   └── payroll_*.py   # Payroll-related APIs
├── config/             # Configuration files
├── hooks.py           # Application hooks
└── public/            # Static assets
```


```

## 🎨 UI/UX Guidelines

### Design System
- **Framework**: Tailwind CSS
- **Icons**: Lucide Vue Next
- **Color Scheme**: Violet/Purple gradient theme
- **Typography**: Modern, clean typography

### Component Guidelines
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Optimized for fast loading
- **User Experience**: Intuitive navigation and interactions

### Styling Conventions
```css
/* Use Tailwind utility classes */
.class-name {
  @apply bg-gradient-to-r from-violet-600 to-purple-600;
}

/* Custom animations */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 🧪 Testing

### Frontend Testing
```bash
# Run unit tests
yarn test

# Run component tests
yarn test:unit

# Run E2E tests
yarn test:e2e
```

### Backend Testing
```bash
# Run Python tests
bench run-tests ex_forcast

# Run specific test file
bench run-tests ex_forcast.tests.test_api
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd forcast_desk
yarn build

# Deploy backend
bench deploy
```

### Environment Configuration
```bash
# Set environment variables
export NODE_ENV=production
export VITE_API_BASE_URL=https://your-api-domain.com
```

## 🔧 Development Workflow

### Code Standards
- **Vue.js**: Follow Vue 3 Composition API patterns
- **Python**: Follow PEP 8 style guidelines
- **Git**: Conventional commit messages
- **Documentation**: Inline code documentation

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new forecasting feature"
git push origin feature/new-feature

# Create pull request for review
```

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

## 🐛 Troubleshooting

### Common Issues

#### Frontend Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
yarn install

# Clear Vite cache
yarn dev --force
```

#### Backend API Issues
```bash
# Restart Frappe server
bench restart

# Clear cache
bench clear-cache

# Check logs
bench tail-logs
```

#### Database Issues
```bash
# Reset database
bench reset

# Migrate database
bench migrate
```

## 📚 Additional Resources

### Documentation
- [Vue.js 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Frappe Framework Documentation](https://frappeframework.com/)

### Development Tools
- **VS Code Extensions**: Vue Language Features, Tailwind CSS IntelliSense
- **Browser Tools**: Vue DevTools, React Developer Tools
- **API Testing**: Postman, Insomnia

---

---

**Ex Forecast** - Transform your business decisions with forecasting insights.
