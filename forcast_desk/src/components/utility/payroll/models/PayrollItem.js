/**
 * PayrollItem Model
 * 
 * Represents a payroll position with base salary and count.
 * Monthly counts are stored as overrides and don't affect the base values.
 */

export class PayrollItem {
  constructor(data = {}) {
    // Base properties (immutable once set)
    this._id = data.id || this._generateId();
    this._department = data.department || '';
    this._departmentLocation = data.departmentLocation || '';
    this._position = data.position || '';
    this._designation = data.designation || '';
    this._salary = data.salary || 0;
    this._count = data.count || 0;
    this._category = data.category || '';
    this._uniqueId = data.uniqueId || this._generateUniqueId();
    
    // Monthly overrides (separate from base values)
    this._monthlyCounts = new Map();
    this._monthlySalaries = new Map();
    
    // Load monthly data if provided
    if (data.monthlyCounts) {
      Object.entries(data.monthlyCounts).forEach(([month, count]) => {
        this._monthlyCounts.set(month, count);
      });
    }
    
    // Validation
    this._validate();
  }
  
  // Getters for base properties (read-only)
  get id() { return this._id; }
  get department() { return this._department; }
  get departmentLocation() { return this._departmentLocation; }
  get position() { return this._position; }
  get designation() { return this._designation; }
  get salary() { return this._salary; }
  get count() { return this._count; }
  get category() { return this._category; }
  get uniqueId() { return this._uniqueId; }
  
  // Monthly count methods
  setMonthlyCount(month, count) {
    if (!this._isValidMonth(month)) {
      throw new Error(`Invalid month: ${month}`);
    }
    if (typeof count !== 'number' || count < 0) {
      throw new Error(`Invalid count: ${count}`);
    }
    
    this._monthlyCounts.set(month, count);
  }
  
  getMonthlyCount(month) {
    if (!this._isValidMonth(month)) {
      throw new Error(`Invalid month: ${month}`);
    }
    
    // Return override if exists, otherwise return base count
    return this._monthlyCounts.has(month) ? this._monthlyCounts.get(month) : this._count;
  }
  
  removeMonthlyCount(month) {
    if (!this._isValidMonth(month)) {
      throw new Error(`Invalid month: ${month}`);
    }
    
    this._monthlyCounts.delete(month);
  }
  
  hasMonthlyCountOverride(month) {
    return this._monthlyCounts.has(month);
  }
  
  // Monthly salary calculation
  getMonthlySalary(month) {
    const monthlyCount = this.getMonthlyCount(month);
    return this._salary * monthlyCount;
  }
  
  // Get all monthly counts (including overrides and defaults)
  getAllMonthlyCounts() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const result = {};
    months.forEach(month => {
      result[month] = this.getMonthlyCount(month);
    });
    
    return result;
  }
  
  // Get only the override months
  getMonthlyCountOverrides() {
    const result = {};
    this._monthlyCounts.forEach((count, month) => {
      result[month] = count;
    });
    return result;
  }
  
  // Update base properties (with validation)
  updateBaseProperties(updates) {
    if (updates.department !== undefined) {
      this._department = updates.department;
    }
    if (updates.departmentLocation !== undefined) {
      this._departmentLocation = updates.departmentLocation;
    }
    if (updates.position !== undefined) {
      this._position = updates.position;
    }
    if (updates.designation !== undefined) {
      this._designation = updates.designation;
    }
    if (updates.salary !== undefined) {
      if (typeof updates.salary !== 'number' || updates.salary < 0) {
        throw new Error(`Invalid salary: ${updates.salary}`);
      }
      this._salary = updates.salary;
    }
    if (updates.count !== undefined) {
      if (typeof updates.count !== 'number' || updates.count < 0) {
        throw new Error(`Invalid count: ${updates.count}`);
      }
      this._count = updates.count;
    }
    if (updates.category !== undefined) {
      this._category = updates.category;
    }
    
    this._validate();
  }
  
  // Serialization
  toJSON() {
    return {
      id: this._id,
      department: this._department,
      departmentLocation: this._departmentLocation,
      position: this._position,
      designation: this._designation,
      salary: this._salary,
      count: this._count,
      category: this._category,
      uniqueId: this._uniqueId,
      monthlyCounts: this.getMonthlyCountOverrides()
    };
  }
  
  // Clone method
  clone() {
    const cloned = new PayrollItem({
      id: this._id,
      department: this._department,
      departmentLocation: this._departmentLocation,
      position: this._position,
      designation: this._designation,
      salary: this._salary,
      count: this._count,
      category: this._category,
      uniqueId: this._uniqueId,
      monthlyCounts: this.getMonthlyCountOverrides()
    });
    
    return cloned;
  }
  
  // Validation
  _validate() {
    if (!this._department) {
      throw new Error('Department is required');
    }
    if (!this._departmentLocation) {
      throw new Error('Department location is required');
    }
    if (!this._position) {
      throw new Error('Position is required');
    }
    if (!this._designation) {
      throw new Error('Designation is required');
    }
    if (this._salary < 0) {
      throw new Error('Salary cannot be negative');
    }
    if (this._count < 0) {
      throw new Error('Count cannot be negative');
    }
  }
  
  _isValidMonth(month) {
    const validMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return validMonths.includes(month);
  }
  
  _generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }
  
  _generateUniqueId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 8);
    return `PAY_${timestamp}_${random}`;
  }
} 