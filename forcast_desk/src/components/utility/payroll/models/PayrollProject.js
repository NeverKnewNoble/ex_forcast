/**
 * PayrollProject Model
 * 
 * Represents payroll data for a specific project across multiple years.
 * Manages a collection of PayrollYear objects and provides project-level operations.
 */

import { PayrollYear } from './PayrollYear.js';

export class PayrollProject {
  constructor(projectName, data = {}) {
    this._projectName = projectName;
    this._years = new Map(); // Map of year -> PayrollYear
    this._metadata = data.metadata || {};
    
    // Load years if provided
    if (data.years) {
      Object.entries(data.years).forEach(([year, yearData]) => {
        const payrollYear = new PayrollYear(year, yearData);
        this._years.set(year, payrollYear);
      });
    }
  }
  
  // Getters
  get projectName() { return this._projectName; }
  get years() { return Array.from(this._years.values()); }
  get yearCount() { return this._years.size; }
  get metadata() { return this._metadata; }
  
  // Year management
  addYear(year, yearData = {}) {
    if (this._years.has(year)) {
      throw new Error(`Year ${year} already exists in project ${this._projectName}`);
    }
    
    const payrollYear = new PayrollYear(year, {
      ...yearData,
      project: this._projectName
    });
    
    this._years.set(year, payrollYear);
    return payrollYear;
  }
  
  removeYear(year) {
    return this._years.delete(year);
  }
  
  getYear(year) {
    return this._years.get(year);
  }
  
  hasYear(year) {
    return this._years.has(year);
  }
  
  // Item management across years
  addItemToYear(year, item) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      throw new Error(`Year ${year} not found in project ${this._projectName}`);
    }
    
    return payrollYear.addItem(item);
  }
  
  getItemFromYear(year, itemId) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return null;
    }
    
    return payrollYear.getItem(itemId);
  }
  
  updateItemInYear(year, itemId, updates) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      throw new Error(`Year ${year} not found in project ${this._projectName}`);
    }
    
    return payrollYear.updateItem(itemId, updates);
  }
  
  removeItemFromYear(year, itemId) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      throw new Error(`Year ${year} not found in project ${this._projectName}`);
    }
    
    return payrollYear.removeItem(itemId);
  }
  
  // Monthly count management across years
  setItemMonthlyCount(year, itemId, month, count) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      throw new Error(`Year ${year} not found in project ${this._projectName}`);
    }
    
    return payrollYear.setItemMonthlyCount(itemId, month, count);
  }
  
  getItemMonthlyCount(year, itemId, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getItemMonthlyCount(itemId, month);
  }
  
  removeItemMonthlyCount(year, itemId, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      throw new Error(`Year ${year} not found in project ${this._projectName}`);
    }
    
    return payrollYear.removeItemMonthlyCount(itemId, month);
  }
  
  // Cross-year operations
  getItemsByUniqueId(uniqueId) {
    const items = [];
    this.years.forEach(year => {
      year.items.forEach(item => {
        if (item.uniqueId === uniqueId) {
          items.push({ year: year.year, item });
        }
      });
    });
    return items;
  }
  
  getItemsByDepartment(department) {
    const items = [];
    this.years.forEach(year => {
      year.getItemsByDepartment(department).forEach(item => {
        items.push({ year: year.year, item });
      });
    });
    return items;
  }
  
  getItemsByLocation(departmentLocation) {
    const items = [];
    this.years.forEach(year => {
      year.getItemsByLocation(departmentLocation).forEach(item => {
        items.push({ year: year.year, item });
      });
    });
    return items;
  }
  
  getItemsByCategory(category) {
    const items = [];
    this.years.forEach(year => {
      year.getItemsByCategory(category).forEach(item => {
        items.push({ year: year.year, item });
      });
    });
    return items;
  }
  
  // Calculations across years
  getTotalMonthlyCount(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getTotalMonthlyCount(month);
  }
  
  getTotalMonthlySalary(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getTotalMonthlySalary(month);
  }
  
  getCategoryMonthlyCount(year, category, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getCategoryMonthlyCount(category, month);
  }
  
  getCategoryMonthlySalary(year, category, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getCategoryMonthlySalary(category, month);
  }
  
  getLocationMonthlyCount(year, departmentLocation, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getLocationMonthlyCount(departmentLocation, month);
  }
  
  getLocationMonthlySalary(year, departmentLocation, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getLocationMonthlySalary(departmentLocation, month);
  }
  
  // Management vs Non-Management calculations across years
  getManagementMonthlyCount(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getManagementMonthlyCount(month);
  }
  
  getManagementMonthlySalary(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getManagementMonthlySalary(month);
  }
  
  getNonManagementMonthlyCount(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getNonManagementMonthlyCount(month);
  }
  
  getNonManagementMonthlySalary(year, month) {
    const payrollYear = this.getYear(year);
    if (!payrollYear) {
      return 0;
    }
    
    return payrollYear.getNonManagementMonthlySalary(month);
  }
  
  // Year range operations
  getYearRange(fromYear, toYear) {
    const years = [];
    for (let year = fromYear; year <= toYear; year++) {
      const payrollYear = this.getYear(year.toString());
      if (payrollYear) {
        years.push(payrollYear);
      }
    }
    return years;
  }
  
  // Statistics
  getTotalItems() {
    let total = 0;
    this.years.forEach(year => {
      total += year.itemCount;
    });
    return total;
  }
  
  getUniqueCategories() {
    const categories = new Set();
    this.years.forEach(year => {
      year.getUniqueCategories().forEach(category => {
        categories.add(category);
      });
    });
    return Array.from(categories);
  }
  
  getUniqueDepartments() {
    const departments = new Set();
    this.years.forEach(year => {
      year.getUniqueDepartments().forEach(department => {
        departments.add(department);
      });
    });
    return Array.from(departments);
  }
  
  getUniqueLocations() {
    const locations = new Set();
    this.years.forEach(year => {
      year.getUniqueLocations().forEach(location => {
        locations.add(location);
      });
    });
    return Array.from(locations);
  }
  
  // Serialization
  toJSON() {
    const yearsData = {};
    this._years.forEach((year, payrollYear) => {
      yearsData[year] = payrollYear.toJSON();
    });
    
    return {
      projectName: this._projectName,
      metadata: this._metadata,
      years: yearsData
    };
  }
  
  // Clone method
  clone() {
    const cloned = new PayrollProject(this._projectName, {
      metadata: { ...this._metadata },
      years: this.toJSON().years
    });
    
    return cloned;
  }
  
  // Validation
  validate() {
    const errors = [];
    
    if (!this._projectName) {
      errors.push('Project name is required');
    }
    
    this.years.forEach(year => {
      try {
        year.validate();
      } catch (error) {
        errors.push(`Year ${year.year}: ${error.message}`);
      }
    });
    
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }
} 