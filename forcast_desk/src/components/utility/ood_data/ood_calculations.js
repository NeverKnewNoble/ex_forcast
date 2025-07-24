/**
 * Calculate laundry revenue for auto-calculated rows.
 * @param {Object} laundryStatic - The static assumptions object from laundryData.static
 * @param {string} fieldCode - The code for the row (e.g., 'in_house_guest_laundry')
 * @param {number|string} year - The year
 * @param {string} label - The month/quarter label
 * @param {number} numberOfGuests - The number of guests for the given year/label
 * @returns {number}
 */
export function calculateLaundryRevenue(laundryStatic, fieldCode, year, label, numberOfGuests) {
    if (!laundryStatic) return 0;
    const pct = Number(laundryStatic.percentage?.[fieldCode] || 0) / 100;
    const base = laundryStatic.base?.[fieldCode] || 'per_month';
    const avgAmount = Number(laundryStatic.amount?.[fieldCode] || 0);
    // Base multiplier: per_month = 1, per_week = 4
    let baseMultiplier = 1;
    if (base === 'per_week') baseMultiplier = 4;
    // per_day is default (1)
    return pct * baseMultiplier * avgAmount * Number(numberOfGuests || 0);
}

/**
 * Calculate the total In House revenue (Guest Laundry + Dry Cleaning).
 * @param {Object} laundryStatic - The static assumptions object from laundryData.static
 * @param {number|string} year - The year
 * @param {string} label - The month/quarter label
 * @param {number} numberOfGuests - The number of guests for the given year/label
 * @returns {number}
 */
export function calculateInHouseRevenue(laundryStatic, year, label, numberOfGuests) {
    const guestLaundryRevenue = calculateLaundryRevenue(laundryStatic, 'in_house_guest_laundry', year, label, numberOfGuests);
    const dryCleaningRevenue = calculateLaundryRevenue(laundryStatic, 'in_house_dry_cleaning', year, label, numberOfGuests);
    return guestLaundryRevenue + dryCleaningRevenue;
}

/**
 * Calculate Outside Guest Laundry revenue based on Number * Base * Average Amount.
 * @param {Object} laundryAssumptions - The laundry assumptions object containing outside guest laundry data
 * @param {number|string} year - The year
 * @param {string} label - The month/quarter label
 * @returns {number}
 */
export function calculateOutsideGuestLaundryRevenue(laundryAssumptions, year, label) {
    if (!laundryAssumptions) return 0;
    
    const number = Number(laundryAssumptions.outside_guest_laundry_number?.[year]?.[label] || 0);
    const base = laundryAssumptions.outside_guest_laundry_base?.[year]?.[label] || 'per_month';
    const avgAmount = Number(laundryAssumptions.outside_guest_laundry_amount?.[year]?.[label] || 0);
    
    // Base multiplier: per_month = 1, per_week = 4
    let baseMultiplier = 1;
    if (base === 'per_week') baseMultiplier = 4;
    
    return number * baseMultiplier * avgAmount;
}

/**
 * Calculate Guest Laundry Cost with conditional logic.
 * If percentage is entered: Percentage * (In House + Outside + Other Revenue)
 * If average amount is entered: Use the average amount directly
 * @param {Object} laundryAssumptions - The laundry assumptions object
 * @param {number|string} year - The year
 * @param {string} label - The month/quarter label
 * @param {Function} calculateInHouseRevenue - Function to calculate In House revenue
 * @param {Function} calculateOutsideRevenue - Function to calculate Outside revenue
 * @returns {number}
 */
export function calculateGuestLaundryCost(laundryAssumptions, year, label, calculateInHouseRevenue, calculateOutsideRevenue) {
    if (!laundryAssumptions) return 0;
    
    const percentage = Number(laundryAssumptions.guest_laundry_cost_percentage?.[year]?.[label] || 0);
    const avgAmount = Number(laundryAssumptions.guest_laundry_cost_amount?.[year]?.[label] || 0);
    
    // If percentage is entered, calculate based on percentage of total revenue
    if (percentage > 0) {
        const inHouseRevenue = calculateInHouseRevenue(laundryAssumptions, year, label);
        const outsideRevenue = calculateOutsideRevenue(laundryAssumptions, year, label);
        const otherRevenue = Number(laundryAssumptions.revenue_other?.[year]?.[label] || 0);
        
        const totalRevenue = inHouseRevenue + outsideRevenue + otherRevenue;
        return (percentage / 100) * totalRevenue;
    }
    
    // If average amount is entered, use it directly
    if (avgAmount > 0) {
        return avgAmount;
    }
    
    return 0;
}

