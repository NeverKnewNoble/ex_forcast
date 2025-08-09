// Filter utilities for year selection and validation
export function validateYearRange(from, to) {
  const fromYear = parseInt(from);
  const toYear = parseInt(to);
  return fromYear && toYear && fromYear <= toYear;
}

export function generateYearOptions(startYear = 2020, endYear = 2060) {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

export function getMonthOptions() {
  return [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
}

// Months array for select fields
export const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  "Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"
]; 