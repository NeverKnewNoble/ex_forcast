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
    },


    
    clearPageCache(projectId, pageId) {
      if (this.cache[projectId] && this.cache[projectId][pageId]) {
        delete this.cache[projectId][pageId];
        console.log('[CACHE CLEAR] Page cache cleared:', { projectId, pageId });
      }
    },

    clearCache(projectId, pageId = null, rowCode = null, year = null) {
      if (!projectId) {
        // Clear all cache
        this.cache = {};
        console.log('[CACHE CLEAR] All cache cleared');
        return;
      }
      
      if (!pageId) {
        // Clear all cache for a project
        delete this.cache[projectId];
        console.log('[CACHE CLEAR] Project cache cleared:', projectId);
        return;
      }
      
      if (!rowCode) {
        // Clear all cache for a page
        if (this.cache[projectId]) {
          delete this.cache[projectId][pageId];
          console.log('[CACHE CLEAR] Page cache cleared:', { projectId, pageId });
        }
        return;
      }
      
      if (!year) {
        // Clear all cache for a row
        if (this.cache[projectId]?.[pageId]) {
          delete this.cache[projectId][pageId][rowCode];
          console.log('[CACHE CLEAR] Row cache cleared:', { projectId, pageId, rowCode });
        }
        return;
      }
      
      // Clear specific cache entry
      if (this.cache[projectId]?.[pageId]?.[rowCode]?.[year]) {
        delete this.cache[projectId][pageId][rowCode][year];
        console.log('[CACHE CLEAR] Year cache cleared:', { projectId, pageId, rowCode, year });
      }
    }
  },
  persist: {
    storage: localStorage,
    key: 'calculation-cache'
  }
});
 
