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
    // Base multiplier: per_day = 1, per_week = 4
    let baseMultiplier = 1;
    if (base === 'per_week') baseMultiplier = 4;
    // per_day is default (1)
    return pct * baseMultiplier * avgAmount * Number(numberOfGuests || 0);
}

