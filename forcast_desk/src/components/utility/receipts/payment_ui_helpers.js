import { computePaymentsForYear, computeCategoryPayablesForYear } from './payments.js';

export function createPaymentHelpers({
  paymentBases,
  paymentPercentages,
  getDeptKey,
  advancedModes,
  displayMode,
  monthlyLabels,
  quarterToMonths,
  getNumber,
}) {
  function buildPaymentBaseByLabel(department, category, year) {
    const key = getDeptKey(department);
    const out = {};
    monthlyLabels.forEach((lab) => {
      const val = paymentBases.value?.[key]?.[category]?.[year]?.[lab];
      out[lab] = getNumber(val || 0);
    });
    return out;
  }

  function buildNextYearPaymentBaseByLabel(department, category, year) {
    const key = getDeptKey(department);
    const out = {};
    monthlyLabels.forEach((lab) => {
      const val = paymentBases.value?.[key]?.[category]?.[year + 1]?.[lab];
      out[lab] = getNumber(val || 0);
    });
    return out;
  }

  function getPaymentPercents(department, category) {
    const key = getDeptKey(department);
    const p = paymentPercentages.value?.[key]?.[category] || { month: 0, following: 0, second: 0 };
    return { month: getNumber(p.month), following: getNumber(p.following), second: getNumber(p.second) };
  }

  function computePayments(department, category, year) {
    const base = buildPaymentBaseByLabel(department, category, year);
    const perc = getPaymentPercents(department, category);
    return computePaymentsForYear(base, perc, monthlyLabels);
  }

  function getPaymentValue(department, category, year, label, bucket) {
    const mode = advancedModes.value[year] || displayMode.value;
    const result = computePayments(department, category, year);
    if (label === 'ex1') {
      if (bucket === 'sameMonth') return 0;
      if (bucket === 'following') {
        const base = buildPaymentBaseByLabel(department, category, year);
        const perc = getPaymentPercents(department, category);
        const pFollow = perc.following > 1 ? perc.following / 100 : perc.following;
        return getNumber(base.Dec) * pFollow;
      }
      if (bucket === 'second') {
        const base = buildPaymentBaseByLabel(department, category, year);
        const perc = getPaymentPercents(department, category);
        const pSecond = perc.second > 1 ? perc.second / 100 : perc.second;
        return getNumber(base.Nov) * pSecond;
      }
      if (bucket === 'cashOutflow') return getNumber(result.cashOutflow.ex1 || 0);
    }
    if (label === 'ex2') {
      if (bucket === 'sameMonth' || bucket === 'following') return 0;
      if (bucket === 'second') {
        const base = buildPaymentBaseByLabel(department, category, year);
        const perc = getPaymentPercents(department, category);
        const pSecond = perc.second > 1 ? perc.second / 100 : perc.second;
        return getNumber(base.Dec) * pSecond;
      }
      if (bucket === 'cashOutflow') return getNumber(result.cashOutflow.ex2 || 0);
    }

    if (mode === 'monthly') {
      if (bucket === 'sameMonth') return getNumber(result.sameMonth[label] || 0);
      if (bucket === 'following') return getNumber(result.following[label] || 0);
      if (bucket === 'second') return getNumber(result.second[label] || 0);
      if (bucket === 'cashOutflow') return getNumber(result.cashOutflow[label] || 0);
      return 0;
    }

    if (mode === 'quarterly' && quarterToMonths[label]) {
      const monthsInQuarter = quarterToMonths[label];
      if (bucket === 'sameMonth') return monthsInQuarter.reduce((s, m) => s + getNumber(result.sameMonth[m] || 0), 0);
      if (bucket === 'following') return monthsInQuarter.reduce((s, m) => s + getNumber(result.following[m] || 0), 0);
      if (bucket === 'second') return monthsInQuarter.reduce((s, m) => s + getNumber(result.second[m] || 0), 0);
      if (bucket === 'cashOutflow') return monthsInQuarter.reduce((s, m) => s + getNumber(result.cashOutflow[m] || 0), 0);
    }

    return 0;
  }

  function getPaymentTotal(department, category, year, bucket) {
    const result = computePayments(department, category, year);
    if (bucket === 'sameMonth') return getNumber(result.totals.sameMonth || 0);
    if (bucket === 'following') return getNumber(result.totals.following || 0);
    if (bucket === 'second') return getNumber(result.totals.second || 0);
    if (bucket === 'cashOutflow') return getNumber(result.totals.cashOutflow || 0);
    return 0;
  }

  function computePayables(department, category, year) {
    const base = buildPaymentBaseByLabel(department, category, year);
    const nextBase = buildNextYearPaymentBaseByLabel(department, category, year);
    const perc = getPaymentPercents(department, category);
    return computeCategoryPayablesForYear(base, perc, monthlyLabels, nextBase);
  }

  function getPayablesValue(department, category, year, label) {
    const mode = advancedModes.value[year] || displayMode.value;
    const res = computePayables(department, category, year);
    if (label === 'ex1') return getNumber(res.ex1 || 0);
    if (label === 'ex2') return getNumber(res.ex2 || 0);
    if (mode === 'monthly') return getNumber(res.payables[label] || 0);
    if (mode === 'quarterly' && quarterToMonths[label]) {
      const monthsInQuarter = quarterToMonths[label];
      return monthsInQuarter.reduce((s, m) => s + getNumber(res.payables[m] || 0), 0);
    }
    return 0;
  }

  function getPayablesTotal(department, category, year) {
    const res = computePayables(department, category, year);
    return getNumber(res.total || 0);
  }

  return {
    getPaymentValue,
    getPaymentTotal,
    getPayablesValue,
    getPayablesTotal,
  };
}


