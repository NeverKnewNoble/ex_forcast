/**
 * Model Adapter
 * 
 * Converts between the existing payroll data structure and the new ORM models.
 * This allows for gradual migration without breaking existing functionality.
 */

import { PayrollItem } from './PayrollItem.js';
import { PayrollYear } from './PayrollYear.js';
import { PayrollProject } from './PayrollProject.js';

export class ModelAdapter {
  /**
   * Convert existing payroll data structure to PayrollProject model
   * @param {Object} existingData - Existing payroll data from API
   * @param {string} projectName - Project name
   * @returns {PayrollProject} - New PayrollProject instance
   */
  static fromExistingData(existingData, projectName) {
    const project = new PayrollProject(projectName);
    
    // Convert existing data structure to new model structure
    Object.entries(existingData).forEach(([year, yearData]) => {
      const payrollYear = new PayrollYear(year, { project: projectName });
      
      // Convert items from existing format to new format
      yearData.forEach(itemData => {
        const item = new PayrollItem({
          id: itemData.unique_id || this._generateId(),
          department: itemData.department,
          departmentLocation: itemData.department_location,
          position: itemData.position,
          designation: itemData.designation,
          salary: itemData.salary || 0,
          count: itemData.amount || 0,
          category: this._determineCategory(itemData.department),
          uniqueId: itemData.unique_id,
          monthlyCounts: itemData.monthly_count || {}
        });
        
        payrollYear.addItem(item);
      });
      
      project.addYear(year, payrollYear.toJSON());
    });
    
    return project;
  }
  
  /**
   * Convert PayrollProject model to existing data structure
   * @param {PayrollProject} project - PayrollProject instance
   * @returns {Object} - Data in existing format for API compatibility
   */
  static toExistingData(project) {
    const result = {};
    
    project.years.forEach(year => {
      const yearData = [];
      
      year.items.forEach(item => {
        yearData.push({
          department: item.department,
          department_location: item.departmentLocation,
          position: item.position,
          designation: item.designation,
          salary: item.salary,
          amount: item.count,
          unique_id: item.uniqueId,
          monthly_count: item.getMonthlyCountOverrides()
        });
      });
      
      result[year.year] = yearData;
    });
    
    return result;
  }
  
  /**
   * Convert existing payroll rows to PayrollItem instances
   * @param {Array} payrollRows - Existing payroll rows
   * @param {Object} payrollData - Existing payroll data
   * @returns {Array} - Array of PayrollItem instances
   */
  static fromExistingRows(payrollRows, payrollData = {}) {
    return payrollRows.map(row => {
      // Extract monthly counts from existing payrollData structure
      const monthlyCounts = {};
      Object.entries(payrollData).forEach(([year, yearData]) => {
        const itemData = yearData[row.id];
        if (itemData && itemData.count && typeof itemData.count === 'object') {
          Object.entries(itemData.count).forEach(([month, count]) => {
            monthlyCounts[month] = count;
          });
        }
      });
      
      return new PayrollItem({
        id: row.id,
        department: row.department,
        departmentLocation: row.departmentLocation,
        position: row.position,
        designation: row.designation,
        salary: row.salary,
        count: row.count,
        category: row.category,
        uniqueId: row.uniqueId,
        monthlyCounts
      });
    });
  }
  
  /**
   * Convert PayrollItem instances to existing payroll rows format
   * @param {Array} items - Array of PayrollItem instances
   * @returns {Array} - Array in existing payroll rows format
   */
  static toExistingRows(items) {
    return items.map(item => ({
      id: item.id,
      department: item.department,
      departmentLocation: item.departmentLocation,
      position: item.position,
      designation: item.designation,
      salary: item.salary,
      count: item.count,
      category: item.category,
      uniqueId: item.uniqueId
    }));
  }
  
  /**
   * Convert existing payroll data to new payrollData structure
   * @param {Array} items - Array of PayrollItem instances
   * @param {Array} years - Array of years
   * @returns {Object} - New payrollData structure
   */
  static toNewPayrollData(items, years) {
    const payrollData = {};
    
    years.forEach(year => {
      payrollData[year] = {};
      
      items.forEach(item => {
        payrollData[year][item.id] = {
          count: item.getMonthlyCountOverrides(),
          salary: {}, // Will be calculated on-demand
          annual: {} // Will be populated separately
        };
      });
    });
    
    return payrollData;
  }
  
  /**
   * Create a hybrid adapter that works with both old and new structures
   * @param {PayrollProject} project - PayrollProject instance
   * @returns {Object} - Hybrid adapter with both old and new methods
   */
  static createHybridAdapter(project) {
    return {
      // New model methods
      getItem: (year, itemId) => project.getItemFromYear(year, itemId),
      getMonthlyCount: (year, itemId, month) => project.getItemMonthlyCount(year, itemId, month),
      setMonthlyCount: (year, itemId, month, count) => project.setItemMonthlyCount(year, itemId, month, count),
      getMonthlySalary: (year, itemId, month) => {
        const item = project.getItemFromYear(year, itemId);
        return item ? item.getMonthlySalary(month) : 0;
      },
      
      // Old structure compatibility
      getPayrollRows: () => {
        const rows = [];
        project.years.forEach(year => {
          year.items.forEach(item => {
            rows.push({
              id: item.id,
              department: item.department,
              departmentLocation: item.departmentLocation,
              position: item.position,
              designation: item.designation,
              salary: item.salary,
              count: item.count,
              category: item.category,
              uniqueId: item.uniqueId
            });
          });
        });
        return rows;
      },
      
      getPayrollData: () => {
        const payrollData = {};
        project.years.forEach(year => {
          payrollData[year.year] = {};
          year.items.forEach(item => {
            payrollData[year.year][item.id] = {
              count: item.getMonthlyCountOverrides(),
              salary: {},
              annual: {}
            };
          });
        });
        return payrollData;
      },
      
      // Utility methods
      getVisibleYears: (fromYear, toYear) => {
        return project.getYearRange(fromYear, toYear).map(year => year.year);
      },
      
      getUniqueCategories: () => project.getUniqueCategories(),
      getUniqueDepartments: () => project.getUniqueDepartments(),
      getUniqueLocations: () => project.getUniqueLocations(),
      
      // Calculations
      calculateTotal: (year, month) => project.getTotalMonthlySalary(year, month),
      calculateCategoryTotal: (year, category, month) => project.getCategoryMonthlySalary(year, category, month),
      calculateLocationTotal: (year, location, month) => project.getLocationMonthlySalary(year, location, month),
      
      // Management calculations
      calculateManagementTotal: (year, month) => project.getManagementMonthlySalary(year, month),
      calculateNonManagementTotal: (year, month) => project.getNonManagementMonthlySalary(year, month)
    };
  }
  
  /**
   * Determine category based on department
   * @param {string} department - Department name
   * @returns {string} - Category
   */
  static _determineCategory(department) {
    const departmentUpper = department.toUpperCase();
    
    if (departmentUpper.includes('ROOM')) {
      return 'ROOMS';
    } else if (departmentUpper.includes('FOOD') || departmentUpper.includes('BEVERAGE') || 
               departmentUpper.includes('F&B') || departmentUpper.includes('RESTAURANT') ||
               departmentUpper.includes('KITCHEN')) {
      return 'FOOD & BEVERAGE';
    } else if (departmentUpper.includes('BANQUET')) {
      return 'BANQUET';
    } else if (departmentUpper.includes('ADMIN') || departmentUpper.includes('MANAGEMENT')) {
      return 'ADMINISTRATION';
    } else {
      return 'OTHER';
    }
  }
  
  /**
   * Generate a unique ID
   * @returns {string} - Unique ID
   */
  static _generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
} 