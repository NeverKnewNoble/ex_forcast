import { defineStore } from 'pinia'

export const useCalculationCache = defineStore('calculationCache', {
  state: () => ({
    cache: {}  // project -> page -> row -> year -> label
  }),

  actions: {
    setValue(projectId, pageId, rowCode, year, label, value) {
      if (value > 0) {
        if (!this.cache[projectId]) this.cache[projectId] = {};
        if (!this.cache[projectId][pageId]) this.cache[projectId][pageId] = {};
        if (!this.cache[projectId][pageId][rowCode]) this.cache[projectId][pageId][rowCode] = {};
        if (!this.cache[projectId][pageId][rowCode][year]) this.cache[projectId][pageId][rowCode][year] = {};
        this.cache[projectId][pageId][rowCode][year][label] = value;
        // console.log('[CACHE SET]', { projectId, pageId, rowCode, year, label, value });
      }
    },

    getValue(projectId, pageId, rowCode, year, label) {
      return this.cache?.[projectId]?.[pageId]?.[rowCode]?.[year]?.[label] ?? 0.00;
    },

    getRowValues(projectId, pageId, rowCode) {
      return this.cache?.[projectId]?.[pageId]?.[rowCode] ?? {};
    }
  },
  persist: true
});
 
