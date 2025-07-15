// Utility for formatting banquet revenue field values

const INTEGER_FIELDS = ['events', 'pax'];

export function formatBanquetValue(fieldCode, value) {
  if (INTEGER_FIELDS.includes(fieldCode)) {
    // Show 0 as '0', otherwise show as integer with commas
    if (value === 0 || value === '0' || value === 0.0 || value === '0.00') {
      return '0';
    }
    // If value is a number, show as integer with commas
    if (!isNaN(value)) {
      return Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    return value;
  }
  // Default: show as float with commas if number
  if (!isNaN(value) && value !== '' && value !== null) {
    return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return value;
}

export { INTEGER_FIELDS }; 