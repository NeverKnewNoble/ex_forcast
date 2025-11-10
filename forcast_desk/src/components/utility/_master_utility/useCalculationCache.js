import { defineStore } from 'pinia'

export const useCalculationCache = defineStore('calculationCache', {
  state: () => ({
    cache: {},  // project -> page -> row -> year -> label
    // Normalized structure specifically for Payroll data to avoid fragile rowCode strings
    // Shape:
    // payroll[projectId][year][department][location][position][designation][label] = value
    payroll: {},
    // Normalized structure for F&B by restaurant and metric
    // fnb[projectId][year][restaurant][metricKey][label] = value
    fnb: {},
    // Normalized structure for Expenses by department and expense name
    // expenses[projectId][department][expenseName][year][label] = value
    expenses: {},
    // Normalized structure for Payroll Related/Taxes by type and staff attributes
    // payrollRelated[projectId][year][type][position][location][designation][label] = value
    payrollRelated: {}
  }),

  actions: {
    // =============================
    //! Generic cache (existing API)
    // =============================
    setValue(projectId, pageId, rowCode, year, label, value) {
      const isNullish = value === null || value === undefined || Number.isNaN(value)
      if (isNullish) return
      if (!this.cache[projectId]) this.cache[projectId] = {};
      if (!this.cache[projectId][pageId]) this.cache[projectId][pageId] = {};
      if (!this.cache[projectId][pageId][rowCode]) this.cache[projectId][pageId][rowCode] = {};
      if (!this.cache[projectId][pageId][rowCode][year]) this.cache[projectId][pageId][rowCode][year] = {};
      this.cache[projectId][pageId][rowCode][year][label] = value;
      console.log('[CACHE SET]', { projectId, pageId, rowCode, year, label, value });
    },

    getValue(projectId, pageId, rowCode, year, label) {
      return this.cache?.[projectId]?.[pageId]?.[rowCode]?.[year]?.[label] ?? 0.00;
    },

    getRowValues(projectId, pageId, rowCode) {
      return this.cache?.[projectId]?.[pageId]?.[rowCode] ?? {};
    },


    
    clearPageCache(projectId, pageId) {
      if (this.cache[projectId] && this.cache[projectId][pageId]) {
        delete this.cache[projectId][pageId];
        // console.log('[CACHE CLEAR] Page cache cleared:', { projectId, pageId });
      }
    },

    clearCache(projectId, pageId = null, rowCode = null, year = null) {
      if (!projectId) {
        // Clear all cache
        this.cache = {};
        // console.log('[CACHE CLEAR] All cache cleared');
        return;
      }
      
      if (!pageId) {
        // Clear all cache for a project
        delete this.cache[projectId];
        // console.log('[CACHE CLEAR] Project cache cleared:', projectId);
        return;
      }
      
      if (!rowCode) {
        // Clear all cache for a page
        if (this.cache[projectId]) {
          delete this.cache[projectId][pageId];
          // console.log('[CACHE CLEAR] Page cache cleared:', { projectId, pageId });
        }
        return;
      }
      
      if (!year) {
        // Clear all cache for a row
        if (this.cache[projectId]?.[pageId]) {
          delete this.cache[projectId][pageId][rowCode];
          // console.log('[CACHE CLEAR] Row cache cleared:', { projectId, pageId, rowCode });
        }
        return;
      }
      
      // Clear specific cache entry
      if (this.cache[projectId]?.[pageId]?.[rowCode]?.[year]) {
        delete this.cache[projectId][pageId][rowCode][year];
        // console.log('[CACHE CLEAR] Year cache cleared:', { projectId, pageId, rowCode, year });
      }
    }
    ,

    // =============================
    //! Payroll-specific normalized API
    // =============================
    _normalizeKeyPart(part) {
      return (part ?? '').toString().trim();
    },

    _ensurePayrollPath(projectId, year, department, location, position, designation) {
      if (!this.payroll[projectId]) this.payroll[projectId] = {};
      if (!this.payroll[projectId][year]) this.payroll[projectId][year] = {};

      const deptKey = this._normalizeKeyPart(department);
      const locKey = this._normalizeKeyPart(location);
      const posKey = this._normalizeKeyPart(position);
      const desKey = this._normalizeKeyPart(designation);

      if (!this.payroll[projectId][year][deptKey]) this.payroll[projectId][year][deptKey] = {};
      if (!this.payroll[projectId][year][deptKey][locKey]) this.payroll[projectId][year][deptKey][locKey] = {};
      if (!this.payroll[projectId][year][deptKey][locKey][posKey]) this.payroll[projectId][year][deptKey][locKey][posKey] = {};
      if (!this.payroll[projectId][year][deptKey][locKey][posKey][desKey]) this.payroll[projectId][year][deptKey][locKey][posKey][desKey] = {};

      return this.payroll[projectId][year][deptKey][locKey][posKey][desKey];
    },

    setPayrollMonthly(projectId, department, location, position, designation, year, label, amount) {
      const isNullish = amount === null || amount === undefined || Number.isNaN(amount);
      if (isNullish) return;
      const target = this._ensurePayrollPath(projectId, year, department, location, position, designation);
      target[this._normalizeKeyPart(label)] = Number(amount) || 0;
      console.log('[PAYROLL CACHE SET]', { projectId, year, department, location, position, designation, label, amount });
    },

    getPayrollMonthly(projectId, department, location, position, designation, year, label) {
      const deptKey = this._normalizeKeyPart(department);
      const locKey = this._normalizeKeyPart(location);
      const posKey = this._normalizeKeyPart(position);
      const desKey = this._normalizeKeyPart(designation);
      const labKey = this._normalizeKeyPart(label);
      return this.payroll?.[projectId]?.[year]?.[deptKey]?.[locKey]?.[posKey]?.[desKey]?.[labKey] ?? 0.00;
    },

    getPayrollYearTotal(projectId, department, location, position, designation, year) {
      const deptKey = this._normalizeKeyPart(department);
      const locKey = this._normalizeKeyPart(location);
      const posKey = this._normalizeKeyPart(position);
      const desKey = this._normalizeKeyPart(designation);
      const monthsObj = this.payroll?.[projectId]?.[year]?.[deptKey]?.[locKey]?.[posKey]?.[desKey] || {};
      return Object.values(monthsObj).reduce((sum, v) => sum + (Number(v) || 0), 0);
    },

    getPayrollHierarchy(projectId, year) {
      // Useful for discovery of available keys
      return this.payroll?.[projectId]?.[year] || {};
    },

    clearPayroll(projectId, year = null) {
      if (!projectId) return;
      if (!this.payroll[projectId]) return;
      if (year === null || year === undefined) {
        delete this.payroll[projectId];
        return;
      }
      if (this.payroll[projectId]?.[year]) {
        delete this.payroll[projectId][year];
      }
    },

    // =============================
    //! F&B normalized API
    // =============================
    _ensureFnbPath(projectId, year, restaurant, metricKey) {
      if (!this.fnb[projectId]) this.fnb[projectId] = {};
      if (!this.fnb[projectId][year]) this.fnb[projectId][year] = {};
      const restKey = this._normalizeKeyPart(restaurant);
      const metKey = this._normalizeKeyPart(metricKey);
      if (!this.fnb[projectId][year][restKey]) this.fnb[projectId][year][restKey] = {};
      if (!this.fnb[projectId][year][restKey][metKey]) this.fnb[projectId][year][restKey][metKey] = {};
      return this.fnb[projectId][year][restKey][metKey];
    },

    setFnbMetric(projectId, restaurant, metricKey, year, label, value) {
      const isNullish = value === null || value === undefined || Number.isNaN(value);
      if (isNullish) return;
      const target = this._ensureFnbPath(projectId, year, restaurant, metricKey);
      target[this._normalizeKeyPart(label)] = Number(value) || 0;
      console.log('[FNB CACHE SET]', { projectId, restaurant, metricKey, year, label, value });
    },

    getFnbMetric(projectId, restaurant, metricKey, year, label) {
      return (
        this.fnb?.[projectId]?.[year]?.[this._normalizeKeyPart(restaurant)]?.[this._normalizeKeyPart(metricKey)]?.[this._normalizeKeyPart(label)]
      ) ?? 0.00;
    },

    // =============================
    //! Expenses normalized API
    // =============================
    _ensureExpensePath(projectId, department, expenseName, year) {
      if (!this.expenses[projectId]) this.expenses[projectId] = {};
      const deptKey = this._normalizeKeyPart(department);
      const expKey = this._normalizeKeyPart(expenseName);
      if (!this.expenses[projectId][deptKey]) this.expenses[projectId][deptKey] = {};
      if (!this.expenses[projectId][deptKey][expKey]) this.expenses[projectId][deptKey][expKey] = {};
      if (!this.expenses[projectId][deptKey][expKey][year]) this.expenses[projectId][deptKey][expKey][year] = {};
      return this.expenses[projectId][deptKey][expKey][year];
    },

    setExpense(projectId, department, expenseName, year, label, amount) {
      // Allow caching of 0 values, but not null/undefined/NaN
      const isNullish = amount === null || amount === undefined || Number.isNaN(amount);
      if (isNullish) return;
      const target = this._ensureExpensePath(projectId, department, expenseName, year);
      // Store the amount even if it's 0
      target[this._normalizeKeyPart(label)] = Number(amount) || 0;
      console.log('[EXPENSE CACHE SET]', { projectId, department, expenseName, year, label, amount });
    },

    getExpense(projectId, department, expenseName, year, label) {
      return (
        this.expenses?.[projectId]?.[this._normalizeKeyPart(department)]?.[this._normalizeKeyPart(expenseName)]?.[year]?.[this._normalizeKeyPart(label)]
      ) ?? 0.00;
    }



    ,

    // =============================
    //! Payroll Related / Taxes normalized API
    // =============================
    _ensurePayrollRelatedPath(projectId, year, type, position, location, designation) {
      if (!this.payrollRelated[projectId]) this.payrollRelated[projectId] = {};
      if (!this.payrollRelated[projectId][year]) this.payrollRelated[projectId][year] = {};

      const typeKey = this._normalizeKeyPart(type);
      const posKey = this._normalizeKeyPart(position);
      const locKey = this._normalizeKeyPart(location);
      const desKey = this._normalizeKeyPart(designation);

      if (!this.payrollRelated[projectId][year][typeKey]) this.payrollRelated[projectId][year][typeKey] = {};
      if (!this.payrollRelated[projectId][year][typeKey][posKey]) this.payrollRelated[projectId][year][typeKey][posKey] = {};
      if (!this.payrollRelated[projectId][year][typeKey][posKey][locKey]) this.payrollRelated[projectId][year][typeKey][posKey][locKey] = {};
      if (!this.payrollRelated[projectId][year][typeKey][posKey][locKey][desKey]) this.payrollRelated[projectId][year][typeKey][posKey][locKey][desKey] = {};

      return this.payrollRelated[projectId][year][typeKey][posKey][locKey][desKey];
    },

    setPayrollRelatedMonthly(projectId, type, position, location, designation, year, label, amount) {
      const isNullish = amount === null || amount === undefined || Number.isNaN(amount);
      if (isNullish) return;
      const target = this._ensurePayrollRelatedPath(projectId, year, type, position, location, designation);
      target[this._normalizeKeyPart(label)] = Number(amount) || 0;
      console.log('[PAYROLL RELATED CACHE SET]', { projectId, year, type, position, location, designation, label, amount });
    },

    getPayrollRelatedMonthly(projectId, type, position, location, designation, year, label) {
      const typeKey = this._normalizeKeyPart(type);
      const posKey = this._normalizeKeyPart(position);
      const locKey = this._normalizeKeyPart(location);
      const desKey = this._normalizeKeyPart(designation);
      const labKey = this._normalizeKeyPart(label);
      return this.payrollRelated?.[projectId]?.[year]?.[typeKey]?.[posKey]?.[locKey]?.[desKey]?.[labKey] ?? 0.00;
    },

    getPayrollRelatedYearTotal(projectId, type, position, location, designation, year) {
      const typeKey = this._normalizeKeyPart(type);
      const posKey = this._normalizeKeyPart(position);
      const locKey = this._normalizeKeyPart(location);
      const desKey = this._normalizeKeyPart(designation);
      const monthsObj = this.payrollRelated?.[projectId]?.[year]?.[typeKey]?.[posKey]?.[locKey]?.[desKey] || {};
      return Object.values(monthsObj).reduce((sum, v) => sum + (Number(v) || 0), 0);
    },

    clearPayrollRelated(projectId, year = null) {
      if (!projectId) return;
      if (!this.payrollRelated[projectId]) return;
      if (year === null || year === undefined) {
        delete this.payrollRelated[projectId];
        return;
      }
      if (this.payrollRelated[projectId]?.[year]) {
        delete this.payrollRelated[projectId][year];
      }
    }
    
  },
  persist: {
    storage: localStorage,
    key: 'calculation-cache'
  }
});
 
