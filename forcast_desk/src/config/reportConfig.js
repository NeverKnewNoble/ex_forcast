/**
 * Report Configuration
 * 
 * Centralized configuration for all report types.
 * Defines metadata, icons, components, and behavior for each report.
 * 
 * Adding a new report:
 * 1. Add icon import from lucide-vue-next
 * 2. Add report config object to REPORT_CONFIGS
 * 3. Import report component if implemented
 * 4. Add route to router.js
 */

import { 
  BedDouble, 
  UtensilsCrossed, 
  Building2, 
  FileText, 
  Scale, 
  TrendingUp, 
  Wrench 
} from 'lucide-vue-next'

// Import implemented report components
import RoomProfitLoss from '@/components/ui/reports/RoomProfitLoss.vue'
import FoodBeverageProfitLoss from '@/components/ui/reports/FoodBeverageProfitLoss.vue'

/**
 * Design tokens for consistent styling across reports
 */
export const REPORT_DESIGN_TOKENS = {
  spacing: {
    contentTop: 'mt-28',
    modalMaxHeight: 'max-h-[50vh]'
  },
  modal: {
    zIndex: 'z-50',
    maxWidth: 'max-w-lg'
  },
  transitions: {
    duration: '0.18s'
  }
}

/**
 * Report configuration object
 * 
 * @typedef {Object} ReportConfig
 * @property {string} id - Unique identifier for the report
 * @property {string} title - Display title
 * @property {string} subtitle - Description text
 * @property {Component} icon - Lucide icon component
 * @property {Component|null} component - Vue component for the report (null if not implemented)
 * @property {boolean} isImplemented - Whether the report is fully implemented
 * @property {boolean} enableAdvancedSettings - Whether to show advanced settings modal
 * @property {boolean} loadDataOnMount - Whether to auto-load data on mount
 * @property {string} routeName - Router name for navigation
 * @property {string} routePath - URL path
 */

export const REPORT_CONFIGS = {
  ROOM_PNL: {
    id: 'room-pnl',
    title: 'Room Profit & Loss',
    subtitle: 'Revenue and expense analysis for room operations',
    icon: BedDouble,
    component: RoomProfitLoss,
    isImplemented: true,
    enableAdvancedSettings: true,
    loadDataOnMount: true,
    routeName: 'Room Profit & Loss',
    routePath: '/reports/room-pnl'
  },
  
  FNB_PNL: {
    id: 'fnb-pnl',
    title: 'Food & Beverage Profit & Loss',
    subtitle: 'Revenue and expense analysis for F&B operations',
    icon: UtensilsCrossed,
    component: FoodBeverageProfitLoss,
    isImplemented: true,
    enableAdvancedSettings: true,
    loadDataOnMount: true,
    routeName: 'F&B Profit & Loss',
    routePath: '/reports/fnb-pnl'
  },
  
  OOD_PNL: {
    id: 'ood-pnl',
    title: 'Other Operating Departments Profit & Loss',
    subtitle: 'Revenue and expense analysis for OOD operations',
    icon: Building2,
    component: null,
    isImplemented: false,
    enableAdvancedSettings: true,
    loadDataOnMount: false,
    routeName: 'OOD Profit & Loss',
    routePath: '/reports/ood-pnl'
  },
  
  PL_STATEMENT: {
    id: 'pl-statement',
    title: 'Profit & Loss Statement',
    subtitle: 'Complete profit and loss statement',
    icon: FileText,
    component: null,
    isImplemented: false,
    enableAdvancedSettings: false,
    loadDataOnMount: false,
    routeName: 'P&L Statement',
    routePath: '/reports/pl-statement'
  },
  
  BALANCE_SHEET: {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    subtitle: 'Assets, liabilities and equity statement',
    icon: Scale,
    component: null,
    isImplemented: false,
    enableAdvancedSettings: false,
    loadDataOnMount: false,
    routeName: 'Balance Sheet',
    routePath: '/reports/balance-sheet'
  },
  
  CASHFLOW: {
    id: 'cashflow',
    title: 'Cashflow',
    subtitle: 'Cash inflows and outflows analysis',
    icon: TrendingUp,
    component: null,
    isImplemented: false,
    enableAdvancedSettings: false,
    loadDataOnMount: false,
    routeName: 'Cashflow',
    routePath: '/reports/cashflow'
  },
  
  CAPEX_SCHEDULE: {
    id: 'capex-schedule',
    title: 'Capex Schedule',
    subtitle: 'Capital expenditure schedule and planning',
    icon: Wrench,
    component: null,
    isImplemented: false,
    enableAdvancedSettings: false,
    loadDataOnMount: false,
    routeName: 'Capex Schedule',
    routePath: '/reports/capex-schedule'
  }
}

/**
 * Get report configuration by ID
 * @param {string} reportId - Report identifier
 * @returns {ReportConfig|null} Report configuration or null if not found
 */
export function getReportConfig(reportId) {
  return Object.values(REPORT_CONFIGS).find(config => config.id === reportId) || null
}

/**
 * Get all implemented reports
 * @returns {ReportConfig[]} Array of implemented report configurations
 */
export function getImplementedReports() {
  return Object.values(REPORT_CONFIGS).filter(config => config.isImplemented)
}

/**
 * Get all reports (for navigation, etc.)
 * @returns {ReportConfig[]} Array of all report configurations
 */
export function getAllReports() {
  return Object.values(REPORT_CONFIGS)
}

