// List of mandatory Banquet Details fields for the Banquet Revenue table
// Each field has a code (identifier) and a label (display name)

export const BANQUET_FIELDS = [
  { code: 'events', label: 'Events' },
  { code: 'pax', label: 'Number of persons (Pax)' },
  { code: 'avg_food_check', label: 'Average food check' },
  { code: 'avg_liquor_check', label: 'Average liquor check' },
  { code: 'avg_soft_drinks_check', label: 'Average soft drinks check' },
  { code: 'avg_hall_space_charges_check', label: 'Average hall/Space charges check' },

  { code: 'food', label: 'Food' },
  { code: 'liquor', label: 'Liquor' },
  { code: 'soft_drinks', label: 'Soft Drinks' },
  { code: 'hall_space_charges', label: 'Hall/Space Charges' },
  { code: 'tobacco', label: 'Tobacco' },
  { code: 'non_fnb', label: 'Non F&B' },
  { code: 'outside_service_food_catering', label: 'Outside Service Food Catering' },
  { code: 'outside_service_beverage_catering', label: 'Outside Service Beverage Catering' },
  { code: 'others', label: 'Others' },
  
  { code: 'gross', label: 'Gross' },
  { code: 'advance_bal', label: 'Advance(Bal)' },
  { code: 'net_amount', label: 'Net Amount' },
  { code: 'amount_per_event', label: 'Amount / Event*' },
  { code: 'amount_per_pax', label: 'Amount per Pax*' },
  { code: 'avg_pax_per_event', label: 'Average Pax/Event' },
]; 