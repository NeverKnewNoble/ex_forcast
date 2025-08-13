  import { normalizePercents } from './collections.js';
  /**
   *! Compute CASH OUTFLOWS for a single year (per category).
   * Mirrors the Excel pattern:
   *  - pay same-month portion in m
   *  - pay following portion in m+1
   *  - pay second-following portion in m+2
   * Spillover into next year goes to ex1 (Jan next) and ex2 (Feb next).
   *
   * @param {Record<string,number>} baseByLabel  // e.g. monthly totals for Salary & Wages
   * @param {{month:number, following:number, second:number}} percents // 0..1 (80% => 0.8)
   * @param {string[]} labels // e.g. ['Jan',...,'Dec']
   * @returns {{
   *   sameMonth: Record<string,number>,
   *   following: Record<string,number>,
   *   second: Record<string,number>,
   *   cashOutflow: Record<string,number>, // includes ex1/ex2
   *   totals: { sameMonth:number, following:number, second:number, cashOutflow:number }
   * }}
   */
  export function computePaymentsForYear(baseByLabel, percents, labels) {
    const p = normalizePercents(percents);
    const n = labels.length;
  
    const sameMonth = {};
    const following = {};
    const second = {};
    const cashOutflow = {};
    let ex1 = 0; // next Jan
    let ex2 = 0; // next Feb
  
    labels.forEach((lab) => {
      sameMonth[lab] = 0;
      following[lab] = 0;
      second[lab] = 0;
      cashOutflow[lab] = 0;
    });
  
    const get = (lab) => Number(baseByLabel?.[lab] ?? 0);
  
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      const amt = get(lab);
  
      // paid in same month
      const p0 = amt * p.month;
      sameMonth[lab] += p0;
  
      // paid in following month
      const p1 = amt * p.following;
      if (i + 1 < n) following[labels[i + 1]] += p1;
      else ex1 += p1;
  
      // paid in second month following
      const p2 = amt * p.second;
      if (i + 2 < n) second[labels[i + 2]] += p2;
      else if (i + 2 === n) ex1 += p2;
      else ex2 += p2;
    }
  
    labels.forEach((lab) => {
      cashOutflow[lab] = sameMonth[lab] + following[lab] + second[lab];
    });
    cashOutflow.ex1 = ex1;
    cashOutflow.ex2 = ex2;
  
    const totals = {
      sameMonth: Object.values(sameMonth).reduce((a, b) => a + b, 0),
      following: Object.values(following).reduce((a, b) => a + b, 0) + ex1,
      second: Object.values(second).reduce((a, b) => a + b, 0) + ex2,
      cashOutflow: Object.values(cashOutflow).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0),
    };
  
    return { sameMonth, following, second, cashOutflow, totals };
  }
  
  /**
   *! Compute CATEGORY PAYABLES for a single year (end-of-month balances).
   * Excel-equivalent formula:
   *   Payables[m] = (following% + second%) * Base[m] + second% * Base[m-1]
   *
   * @param {Record<string,number>} baseByLabel // monthly totals for the category
   * @param {{month:number, following:number, second:number}} percents // 0..1
   * @param {string[]} labels // months in order
   * @param {Record<string,number>|null} nextYearBaseByLabel // optional, to expose ex1/ex2 as next-year Jan/Feb payables
   * @returns {{ payables: Record<string,number>, ex1?: number|null, ex2?: number|null, total:number }}
   */
  export function computeCategoryPayablesForYear(
    baseByLabel,
    percents,
    labels,
    nextYearBaseByLabel = null
  ) {
    const p = normalizePercents(percents);
    const n = labels.length;
    const payables = {};
  
    const get = (lab, src = baseByLabel) => Number(src?.[lab] ?? 0);
  
    for (let i = 0; i < n; i++) {
      const lab = labels[i];
      const cur = get(lab);
      const prev = i > 0 ? get(labels[i - 1]) : 0;
      payables[lab] = (p.following + p.second) * cur + p.second * prev;
    }
  
    let ex1 = null;
    let ex2 = null;
    if (nextYearBaseByLabel) {
      const janNext = get('Jan', nextYearBaseByLabel);
      const febNext = get('Feb', nextYearBaseByLabel);
      const decThis = get('Dec', baseByLabel);
  
      ex1 = (p.following + p.second) * janNext + p.second * decThis;
      ex2 = (p.following + p.second) * febNext + p.second * janNext;
    }
  
    const total = Object.values(payables).reduce((a, b) => a + b, 0)
      + (ex1 ?? 0) + (ex2 ?? 0);
  
    return { payables, ex1, ex2, total };
  }
  