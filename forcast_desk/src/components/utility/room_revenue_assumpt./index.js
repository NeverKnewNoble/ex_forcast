// Room Revenue Assumption Utilities - Main Export File
    
// Data loading and API services
export {
    getRoomPackagesList
} from './revenue_packages.js';


// create Room Revenue Document
export {
    createRoomRevenueAssumption
} from './create_room_revenue.js';

// Room Revenue Modal
export {
    showAddRoomRevenueModal,
    addRoomRevenueForm,
    addRoomRevenueRow,
    removeRoomRevenueRow,
    resetRoomRevenueForm,
    cancelAddRoomRevenue
} from './roomRevenue_modal.js';

// Data Service
export {
    getRoomRevenueList,
    extractAllRoomRevenuePackages
} from './data_service.js';

// Core Room Revenue Utilities
export {
    ROOM_TYPES,
    collapsedYears,
    toggleCollapse,
    isYearCollapsed,
    getVisibleYears,
    getColumnLabels,
    quarterToMonths,
    getRoomData,
    getFormattedValue,
    getAvailableBeds,
    getOccupiedBeds,
    getRate,
    calculateRevenue,
    calculateRoomTypeTotal,
    calculateMonthlyTotal,
    calculateGrandTotal,
    calculateTableTotal,
    extractAllRoomTypes,
    getNumberOfRoomsForType,
    calculateTotalRoomCount
} from './room_revenue_utils.js';

// Table Utilities
export {
    handleRoomCellEdit,
    handleRoomCellInput,
    handleRoomCellFocus,
    handleRoomCountEdit,
    saveRoomChanges,
    formatRoomAmountInput,
    cleanRoomAmountValue
} from './room_revenue_table_utils.js';