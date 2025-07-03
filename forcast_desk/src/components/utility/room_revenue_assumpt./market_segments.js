export const MARKET_SEGMENT_CATEGORIES = [
    "RETAIL",
    "DISCOUNT",
    "QUALIFIED",
    "NEGOTIATED (CORPORATE)",
    "WHOLESALE",
    "GROUP ROOMS REVENUE",
    "CONTRACT ROOMS REVENUE",
    "OTHER ROOMS REVENUE",
];


export const MARKET_SEGMENTS = [
  { market_segment: "NO-SHOW /DAY USE / EXTRA BED / LATE CHECK OUT", segment_category: "OTHER ROOMS REVENUE" },
  { market_segment: "HOUSE USE ROOMS", segment_category: "OTHER ROOMS REVENUE" },
  { market_segment: "COMPLIMENTERY ROOMS", segment_category: "OTHER ROOMS REVENUE" },
  { market_segment: "Long Term Stays", segment_category: "CONTRACT ROOMS REVENUE" },
  { market_segment: "Crew", segment_category: "CONTRACT ROOMS REVENUE" },
  { market_segment: "Groups S.M.E.R.F", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Groups Tours / Wholesalers", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Groups Sports", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Groups Association / Conventions / Events", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Groups Government", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Groups Corporate", segment_category: "GROUP ROOMS REVENUE" },
  { market_segment: "Transient Tours / Travel", segment_category: "WHOLESALE" },
  { market_segment: "Wholesale Allotment / Static", segment_category: "WHOLESALE" },
  { market_segment: "Wholesale Dynamic", segment_category: "WHOLESALE" },
  { market_segment: "TMC / Consortia", segment_category: "NEGOTIATED (CORPORATE)" },
  { market_segment: "Government Global / Local", segment_category: "NEGOTIATED (CORPORATE)" },
  { market_segment: "Negotiated Local", segment_category: "NEGOTIATED (CORPORATE)" },
  { market_segment: "Negotiated Global", segment_category: "NEGOTIATED (CORPORATE)" },
  { market_segment: "Members Discount - Government Mandated", segment_category: "QUALIFIED" },
  { market_segment: "Staff Rate Discount / Management Discretion Discount", segment_category: "QUALIFIED" },
  { market_segment: "Loyalty", segment_category: "DISCOUNT" },
  { market_segment: "Hotel Discount", segment_category: "DISCOUNT" },
  { market_segment: "OTA Promotion / OTA Package", segment_category: "DISCOUNT" },
  { market_segment: "Local Promotion", segment_category: "DISCOUNT" },
  { market_segment: "Global Promotion", segment_category: "DISCOUNT" },
  { market_segment: "OTA Retail", segment_category: "RETAIL" },
  { market_segment: "Direct Retail", segment_category: "RETAIL" }
]; 


//! Function To Get Average Daily Rate Calculation
export function AverageDailyRateCalculation(room_rate, VAT, Breakfast_Rate, exchange_rate) {
    if (!room_rate > 0 ) {
        return 0.00
    } else {
        const result = ((room_rate *(1 + VAT / 100)) + Breakfast_Rate) * exchange_rate;
        return result;
    }
};