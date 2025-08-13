/**
 *! Normalizes percents that might be typed as 80 or 0.8
 * Ensures sum <= 1 (100%)
 */
export function normalizePercents(p) {
    const toDec = (x) => (x > 1 ? x / 100 : x);
    const month = toDec(Number(p?.month ?? 0));
    const following = toDec(Number(p?.following ?? 0));
    const second = toDec(Number(p?.second ?? 0));
    if ([month, following, second].some((v) => isNaN(v) || v < 0)) {
      throw new Error("Percentages must be non-negative numbers.");
    }
    const sum = month + following + second;
    if (sum > 1 + 1e-9) {
      throw new Error(`Collection percentages exceed 100% (got ${(sum * 100).toFixed(2)}%).`);
    }
    return { month, following, second };
  }
  
  /**
   *! Compute cash collections for a single year with 12 monthly labels.
   * Supports spillover to ex1 (next Jan) and ex2 (next Feb).
   *
   * @param {Record<string, number>} revenueByLabel  e.g. { Jan: 1000, Feb: 1200, ... Dec: 1500 }
   * @param {{month:number, following:number, second:number}} percents decimals (0..1). 80%=0.8
   * @param {string[]} labels Monthly labels in order (e.g., ['Jan','Feb',...,'Dec'])
   * @returns {{
   *   sameMonth: Record<string, number>,
   *   following: Record<string, number>,
   *   second: Record<string, number>,
   *   cashInflow: Record<string, number>, // includes months and ex1/ex2
   *   totals: { sameMonth:number, following:number, second:number, cashInflow:number }
   * }}
   */
  export function computeCollectionsForYear(revenueByLabel, percents, labels) {
    const p = normalizePercents(percents);
    const n = labels.length; // expect 12
    const sameMonth = {};
    const following = {};
    const second = {};
    const cashInflow = {};
    let ex1 = 0; // flows landing in next year's January
    let ex2 = 0; // flows landing in next year's February
  
    // init
    labels.forEach((lab) => {
      sameMonth[lab] = 0;
      following[lab] = 0;
      second[lab] = 0;
      cashInflow[lab] = 0;
    });
  
    const get = (lab) => Number(revenueByLabel[lab] ?? 0);
  
    // Distribute each month's revenue into m, m+1, m+2
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      const rev = get(lab);
  
      // same month
      const s0 = rev * p.month;
      sameMonth[lab] += s0;
  
      // following month (i+1)
      const s1 = rev * p.following;
      if (i + 1 < n) {
        following[labels[i + 1]] += s1;
      } else {
        ex1 += s1; // spill to next year's Jan
      }
  
      // second month following (i+2)
      const s2 = rev * p.second;
      if (i + 2 < n) {
        second[labels[i + 2]] += s2;
      } else if (i + 2 === n) {
        ex1 += s2; // lands in next year's Jan
      } else {
        ex2 += s2; // lands in next year's Feb
      }
    }
  
    // Cash inflow per current-year label
    labels.forEach((lab) => {
      cashInflow[lab] = sameMonth[lab] + following[lab] + second[lab];
    });
    // Append ex1/ex2 buckets
    cashInflow.ex1 = ex1;
    cashInflow.ex2 = ex2;
  
    const totals = {
      sameMonth: Object.values(sameMonth).reduce((a, b) => a + b, 0),
      following:
        Object.values(following).reduce((a, b) => a + b, 0) + ex1, // if you want spill in the following bucket, keep separate instead
      second:
        Object.values(second).reduce((a, b) => a + b, 0) + ex2,     // same note as above
      cashInflow:
        Object.values(cashInflow).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0),
    };
  
    return { sameMonth, following, second, cashInflow, totals };
  }
  
  /**
   *! Compute Accounts Receivables for a single year (Excel logic):
   * AR[m] = (following% + second%) * Rev[m] + second% * Rev[m-1]
   * ex1/ex2 for AR are optional (need next year’s revenue to be exact).
   *
   * @param {Record<string, number>} revenueByLabel e.g. { Jan: 1000, ..., Dec: 1500 }
   * @param {{month:number, following:number, second:number}} percents decimals
   * @param {string[]} labels monthly labels ordered
   * @param {Record<string, number>|null} nextYearRevenueByLabel optional next year revenue to compute AR for ex1/ex2 accurately
   * @returns {{
   *   ar: Record<string, number>,  // AR per month
   *   ex1?: number|null,           // AR for next Jan (if nextYearRevenue given)
   *   ex2?: number|null,           // AR for next Feb (if nextYearRevenue given)
   *   total:number
   * }}
   */
  export function computeAccountsReceivablesForYear(
    revenueByLabel,
    percents,
    labels,
    nextYearRevenueByLabel = null
  ) {
    const p = normalizePercents(percents);
    const n = labels.length;
    const ar = {};
    const get = (lab, src = revenueByLabel) => Number(src?.[lab] ?? 0);
  
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      const rev_m = get(lab);
      const rev_prev = i > 0 ? get(labels[i - 1]) : 0;
      ar[lab] = (p.following + p.second) * rev_m + p.second * rev_prev;
    }
  
    let ex1 = null;
    let ex2 = null;
  
    // If we have next year's revenue, expose AR for next Jan/Feb as ex1/ex2 for this row
    if (nextYearRevenueByLabel) {
      const janNext = get('Jan', nextYearRevenueByLabel);
      const febNext = get('Feb', nextYearRevenueByLabel);
      const decThis = get('Dec', revenueByLabel);
      const janPrev = get('Dec', revenueByLabel); // prev for Jan(next) is Dec(this)
  
      // AR at Jan(next) = (pF+pS)*Rev[Jan(next)] + pS * Rev[Dec(this)]
      ex1 = (p.following + p.second) * janNext + p.second * janPrev;
  
      // AR at Feb(next) = (pF+pS)*Rev[Feb(next)] + pS * Rev[Jan(next)]
      ex2 = (p.following + p.second) * febNext + p.second * janNext;
    }
  
    const total = Object.values(ar).reduce((a, b) => a + b, 0)
      + (ex1 ?? 0) + (ex2 ?? 0);
  
    return { ar, ex1, ex2, total };
  }
  