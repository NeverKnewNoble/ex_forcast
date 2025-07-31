/**
 * PayrollYear Model
 * 
 * Represents payroll data for a specific year.
 * Manages a collection of PayrollItems and provides year-level operations.
 */

import { PayrollItem } from './PayrollItem.js';

export class PayrollYear {
  constructor(year, data = {}) {
    this._year = year;
    this._items = new Map(); // Map of itemId -> PayrollItem
    this._project = data.project || '';
    
    // Load items if provided
    if (data.items) {
      data.items.forEach(itemData => {
        const item = new PayrollItem(itemData);
        this._items.set(item.id, item);
      });
    }
  }
  
  // Getters
  get year() { return this._year; }
  get project() { return this._project; }
  get items() { return Array.from(this._items.values()); }
  get itemCount() { return this._items.size; }
  
  // Item management
  addItem(item) {
    if (!(item instanceof PayrollItem)) {
      throw new Error('Item must be an instance of PayrollItem');
    }
    
    this._items.set(item.id, item);
    return item;
  }
  
  removeItem(itemId) {
    return this._items.delete(itemId);
  }
  
  getItem(itemId) {
    return this._items.get(itemId);
  }
  
  updateItem(itemId, updates) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }
    
    item.updateBaseProperties(updates);
    return item;
  }
  
  // Monthly count management
  setItemMonthlyCount(itemId, month, count) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }
    
    item.setMonthlyCount(month, count);
    return item;
  }
  
  getItemMonthlyCount(itemId, month) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }
    
    return item.getMonthlyCount(month);
  }
  
  removeItemMonthlyCount(itemId, month) {
    const item = this.getItem(itemId);
    if (!item) {
      throw new Error(`Item with id ${itemId} not found`);
    }
    
    item.removeMonthlyCount(month);
    return item;
  }
  
  // Filtering and grouping
  getItemsByCategory(category) {
    return this.items.filter(item => item.category === category);
  }
  
  getItemsByDepartment(department) {
    return this.items.filter(item => item.department === department);
  }
  
  getItemsByLocation(departmentLocation) {
    return this.items.filter(item => item.departmentLocation === departmentLocation);
  }
  
  getItemsByPosition(position) {
    return this.items.filter(item => item.position === position);
  }
  
  getUniqueCategories() {
    const categories = new Set();
    this.items.forEach(item => categories.add(item.category));
    return Array.from(categories);
  }
  
  getUniqueDepartments() {
    const departments = new Set();
    this.items.forEach(item => departments.add(item.department));
    return Array.from(departments);
  }
  
  getUniqueLocations() {
    const locations = new Set();
    this.items.forEach(item => locations.add(item.departmentLocation));
    return Array.from(locations);
  }
  
  // Calculations
  getTotalMonthlyCount(month) {
    let total = 0;
    this.items.forEach(item => {
      total += item.getMonthlyCount(month);
    });
    return total;
  }
  
  getTotalMonthlySalary(month) {
    let total = 0;
    this.items.forEach(item => {
      total += item.getMonthlySalary(month);
    });
    return total;
  }
  
  getCategoryMonthlyCount(category, month) {
    let total = 0;
    this.getItemsByCategory(category).forEach(item => {
      total += item.getMonthlyCount(month);
    });
    return total;
  }
  
  getCategoryMonthlySalary(category, month) {
    let total = 0;
    this.getItemsByCategory(category).forEach(item => {
      total += item.getMonthlySalary(month);
    });
    return total;
  }
  
  getLocationMonthlyCount(departmentLocation, month) {
    let total = 0;
    this.getItemsByLocation(departmentLocation).forEach(item => {
      total += item.getMonthlyCount(month);
    });
    return total;
  }
  
  getLocationMonthlySalary(departmentLocation, month) {
    let total = 0;
    this.getItemsByLocation(departmentLocation).forEach(item => {
      total += item.getMonthlySalary(month);
    });
    return total;
  }
  
  // Management vs Non-Management calculations
  getManagementItems() {
    return this.items.filter(item => item.position === 'Manager');
  }
  
  getNonManagementItems() {
    return this.items.filter(item => item.position === 'Non-manager');
  }
  
  getManagementMonthlyCount(month) {
    let total = 0;
    this.getManagementItems().forEach(item => {
      total += item.getMonthlyCount(month);
    });
    return total;
  }
  
  getManagementMonthlySalary(month) {
    let total = 0;
    this.getManagementItems().forEach(item => {
      total += item.getMonthlySalary(month);
    });
    return total;
  }
  
  getNonManagementMonthlyCount(month) {
    let total = 0;
    this.getNonManagementItems().forEach(item => {
      total += item.getMonthlyCount(month);
    });
    return total;
  }
  
  getNonManagementMonthlySalary(month) {
    let total = 0;
    this.getNonManagementItems().forEach(item => {
      total += item.getMonthlySalary(month);
    });
    return total;
  }
  
  // Serialization
  toJSON() {
    return {
      year: this._year,
      project: this._project,
      items: this.items.map(item => item.toJSON())
    };
  }
  
  // Clone method
  clone() {
    const cloned = new PayrollYear(this._year, {
      project: this._project,
      items: this.items.map(item => item.toJSON())
    });
    
    return cloned;
  }
  
  // Validation
  validate() {
    const errors = [];
    
    if (!this._year) {
      errors.push('Year is required');
    }
    
    this.items.forEach(item => {
      try {
        item._validate();
      } catch (error) {
        errors.push(`Item ${item.id}: ${error.message}`);
      }
    });
    
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }
  }
} 