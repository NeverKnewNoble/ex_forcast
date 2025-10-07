// Centralized cache keys to reduce typos and drift across pages

export const PAGE = {
  ROOM_REVENUE: 'Room Revenue Assumptions',
  FNB_REVENUE: 'F&B Revenue Assumptions',
  OOD_REVENUE: 'OOD Revenue Assumptions',
  PAYROLL: 'Payroll',
  PAYROLL_TAXES: 'Payroll Taxes',
  PAYROLL_RELATED: 'Payroll Related',
  EXPENSE_ASSUMPTIONS: 'Expense Assumptions',
  BANQUET_REVENUE: 'Banquet Revenue Assumptions',
  MARKET_SEGMENTATION: 'Market Segmentation',
  BONUS: 'Bonus',
}

export const ROW = {
  // Room Revenue
  TOTAL_ROOMS: 'Total Rooms',
  TOTAL_ROOM_REVENUE: 'Total Room Revenue',
  TOTAL_ROOM_REVENUE_YEAR: 'Total Room Revenue Year',

  // F&B Revenue
  ROOMS_AVAILABLE: 'Number of rooms available',
  ROOMS_SOLD_EXCL: 'Number of rooms sold (excl.)',
  OCCUPANCY_EXCL_PCT: 'Occupancy (excl.) %',
  NUMBER_OF_GUESTS: 'Number of guests',
  AVERAGE_ROOM_RATE: 'Average Room Rate',
  REVPAR: 'Revenue Per Available Room',
  TOTAL_FNB_REVENUE: 'Total F&B Revenue',
  TOTAL_FOOD_REVENUE: 'Total Food Revenue',
  TOTAL_BEVERAGE_REVENUE: 'Total Beverage Revenue',

  // OOD
  TOTAL_LAUNDRY_REVENUE: 'Total Laundry Revenue',
  TOTAL_HEALTH_CLUB_REV_SC: 'Total Health Club Rev Including SC',

  // Banquet
  NET_AMOUNT: 'Net Amount',
  FOOD: 'Food',
  LIQUOR: 'Liquor',
  SOFT_DRINKS: 'Soft Drinks',
  HALL_SPACE_CHARGES: 'Hall Space Charges',
  GROSS: 'Gross',
  AMOUNT_PER_EVENT: 'Amount Per Event',
  AMOUNT_PER_PAX: 'Amount Per Pax',
  AVG_PAX_PER_EVENT: 'Avg Pax Per Event',

  // Market Segmentation
  ADR_TOTAL: 'ADR Total',
  ADR_TOTAL_YEAR: 'ADR Total Year',
  TOTAL_ROOMS_REVENUE_INC_SC: 'Total Rooms Revenue Including SC',
  TOTAL_ROOMS_REVENUE_INC_SC_YEAR: 'Total Rooms Revenue Including SC Year',
}

export default { PAGE, ROW }


