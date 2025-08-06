// Bonus Utilities - Main export file for bonus functionality

// Export bonus data constructor
export { bonusDataConstructor, transformBonusApiToFrontend, transformBonusFrontendToApi, validateBonusData, createDefaultBonusRow } from './data_constructors/bonusConstructor.js';

// Export bonus data service
export { 
  fetchBonusData, 
  saveBonusChanges, 
  addBonusChange, 
  getBonusValue, 
  setBonusValue, 
  hasBonusChanges, 
  clearBonusChanges, 
  getBonusChangesForAPI, 
  validateBonusData as validateBonusDataService,
  bonusData,
  bonusChanges,
  isSavingBonus,
  bonusSaveError
} from './bonus_data_service.js';

// Export bonus utilities
export {
  getBonusPercentage,
  handleBonusPercentageInput,
  handleBonusPercentageFocus,
  handleBonusPercentageBlur,
  getBonusValue as calculateBonusValue,
  getBonusTotal as calculateBonusTotal,
  calculateSubTotalManagementBonus,
  calculateSubTotalManagementBonusTotal,
  calculateSubTotalNonManagementBonus,
  calculateSubTotalNonManagementBonusTotal,
  calculateLocationTotalBonus,
  calculateLocationTotalBonusTotal,
  calculateHotelTotalBonus,
  calculateHotelTotalBonusTotal,
  calculateEmployeeRoomRatioBonus,
  calculateEmployeeRoomRatioBonusTotal
} from './bonus_utils.js';

// Export bonus calculations
export {
  calculateSubTotalManagementBonusPercentage,
  calculateSubTotalNonManagementBonusPercentage,
  calculateLocationTotalBonusPercentage,
  safeCalculateHotelTotalBonusPercentage,
  calculateEmployeeRoomRatioBonusPercentage,
  safeCalculateHotelTotalBonus,
  safeCalculateHotelTotalBonusTotal,
  safeCalculateEmployeeRoomRatioBonus,
  safeCalculateEmployeeRoomRatioBonusTotal
} from './bonus_calculations.js';
