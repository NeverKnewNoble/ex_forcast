// Payroll Data Service - Handles API calls and modal functionality

import { ref, reactive } from 'vue';
import alertService from "@/components/ui/ui_utility/alertService.js";

// Modal state
export const showAddPayrollModal = ref(false);
export const isSubmittingPayroll = ref(false);
export const payrollModalError = ref('');

// Form data
export const addPayrollForm = reactive({
  year: '',
  month: '',
  rows: []
});

// Options data
export const departmentOptions = ref([]);
export const departmentLocationOptions = ref([]);
export const designationOptions = ref([]);

// Payroll data state
export const payrollData = ref({});
export const payrollRows = ref([]);

// Import months from expense assumption
import { months } from "@/components/utility/expense_assumption/index.js";
export { months };

// API calls
export async function loadDepartmentOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.get_departments_list');
    const data = await response.json();
    
    if (data.message && data.message.success) {
      departmentOptions.value = data.message.departments.map(dept => ({
        value: dept.name,
        label: dept.department_name || dept.name
      }));
    } else {
      console.error('Failed to load departments:', data.message?.error || 'Unknown error');
      // Fallback to sample departments if API fails
      departmentOptions.value = [
        { value: 'ROOMS', label: 'ROOMS' },
        { value: 'FOOD & BEVERAGE', label: 'FOOD & BEVERAGE' },
        { value: 'SALES & MARKETING', label: 'SALES & MARKETING' },
        { value: 'ADMINISTRATION', label: 'ADMINISTRATION' }
      ];
      console.log('Using fallback department options');
    }
  } catch (error) {
    console.error('Error loading departments:', error);
    // Fallback to sample departments if API fails
    departmentOptions.value = [
      { value: 'ROOMS', label: 'ROOMS' },
      { value: 'FOOD & BEVERAGE', label: 'FOOD & BEVERAGE' },
      { value: 'SALES & MARKETING', label: 'SALES & MARKETING' },
      { value: 'ADMINISTRATION', label: 'ADMINISTRATION' }
    ];
    console.log('Using fallback department options due to error');
  }
}

export async function loadDepartmentLocationOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.get_department_locations_list');
    const data = await response.json();
    
    if (data.message && data.message.success) {
      departmentLocationOptions.value = data.message.locations.map(location => ({
        value: location.name,
        label: location.department_location || location.name
      }));
    } else {
      console.error('Failed to load department locations:', data.message?.error || 'Unknown error');
      // Fallback to sample locations if API fails
      departmentLocationOptions.value = [
        { value: 'Front Desk', label: 'Front Desk' },
        { value: 'Housekeeping', label: 'Housekeeping' },
        { value: 'Restaurant', label: 'Restaurant' },
        { value: 'Kitchen', label: 'Kitchen' },
        { value: 'Sales Office', label: 'Sales Office' },
        { value: 'Administration', label: 'Administration' }
      ];
      console.log('Using fallback department location options');
    }
  } catch (error) {
    console.error('Error loading department locations:', error);
    // Fallback to sample locations if API fails
    departmentLocationOptions.value = [
      { value: 'Front Desk', label: 'Front Desk' },
      { value: 'Housekeeping', label: 'Housekeeping' },
      { value: 'Restaurant', label: 'Restaurant' },
      { value: 'Kitchen', label: 'Kitchen' },
      { value: 'Sales Office', label: 'Sales Office' },
      { value: 'Administration', label: 'Administration' }
    ];
    console.log('Using fallback department location options due to error');
  }
}

export async function loadDesignationOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.get_designations_list');
    const data = await response.json();
    
    if (data.message && data.message.success) {
      designationOptions.value = data.message.designations.map(designation => ({
        value: designation.name,
        label: designation.designation_name || designation.name
      }));
    } else {
      console.error('Failed to load designations:', data.message?.error || 'Unknown error');
      // Fallback to sample designations if API fails
      designationOptions.value = [
        { value: 'Front Office Manager', label: 'Front Office Manager' },
        { value: 'Receptionist', label: 'Receptionist' },
        { value: 'Housekeeping Manager', label: 'Housekeeping Manager' },
        { value: 'Room Attendant', label: 'Room Attendant' },
        { value: 'Restaurant Manager', label: 'Restaurant Manager' },
        { value: 'Waiter', label: 'Waiter' },
        { value: 'Executive Chef', label: 'Executive Chef' },
        { value: 'Sous Chef', label: 'Sous Chef' },
        { value: 'Sales Manager', label: 'Sales Manager' },
        { value: 'Sales Executive', label: 'Sales Executive' },
        { value: 'General Manager', label: 'General Manager' },
        { value: 'Accountant', label: 'Accountant' }
      ];
      console.log('Using fallback designation options');
    }
  } catch (error) {
    console.error('Error loading designations:', error);
    // Fallback to sample designations if API fails
    designationOptions.value = [
      { value: 'Front Office Manager', label: 'Front Office Manager' },
      { value: 'Receptionist', label: 'Receptionist' },
      { value: 'Housekeeping Manager', label: 'Housekeeping Manager' },
      { value: 'Room Attendant', label: 'Room Attendant' },
      { value: 'Restaurant Manager', label: 'Restaurant Manager' },
      { value: 'Waiter', label: 'Waiter' },
      { value: 'Executive Chef', label: 'Executive Chef' },
      { value: 'Sous Chef', label: 'Sous Chef' },
      { value: 'Sales Manager', label: 'Sales Manager' },
      { value: 'Sales Executive', label: 'Sales Executive' },
      { value: 'General Manager', label: 'General Manager' },
      { value: 'Accountant', label: 'Accountant' }
    ];
    console.log('Using fallback designation options due to error');
  }
}

// Fetch payroll data from API
export async function fetchPayrollData(projectName) {
  try {
    if (!projectName) {
      console.warn('No project name provided for payroll data fetch');
      return;
    }

    const response = await fetch(`/api/method/ex_forcast.api.call_and_save_payroll_data.payroll_data_display?project=${encodeURIComponent(projectName)}`);
    const data = await response.json();
    
    if (data.message && !data.message.error) {
      // Transform API data to match frontend structure
      const transformedData = {};
      const transformedRows = [];
      
      Object.keys(data.message).forEach(year => {
        Object.keys(data.message[year]).forEach(month => {
          data.message[year][month].forEach(item => {
            const rowId = Date.now() + Math.random(); // Generate unique ID
            const row = {
              id: rowId,
              department: item.department,
              departmentLocation: item.department_location,
              position: item.position,
              designation: item.designation,
              salary: item.salary,
              count: item.amount,
              category: item.department, // Assuming category is based on department
              year: year,
              month: month
            };
            
            transformedRows.push(row);
            
            // Initialize payrollData structure
            if (!transformedData[year]) {
              transformedData[year] = {};
            }
            if (!transformedData[year][month]) {
              transformedData[year][month] = {};
            }
            if (!transformedData[year][month][rowId]) {
              transformedData[year][month][rowId] = {};
            }
            
            transformedData[year][month][rowId] = {
              count: item.amount,
              salary: item.salary
            };
          });
        });
      });
      
      payrollData.value = transformedData;
      payrollRows.value = transformedRows;
      
      console.log('Payroll data loaded successfully:', transformedRows.length, 'rows');
    } else {
      console.error('Failed to load payroll data:', data.message?.error);
      alertService.error('Failed to load payroll data');
    }
  } catch (error) {
    console.error('Error loading payroll data:', error);
    alertService.error('Error loading payroll data');
  }
}

// Save payroll changes to API
export async function savePayrollChanges(changes, projectName) {
  try {
    if (!projectName) {
      throw new Error('Project name is required');
    }

    if (!changes || changes.length === 0) {
      return { status: 'success', message: 'No changes to save' };
    }

    // Transform changes to API format
    const apiChanges = changes.map(change => {
      const row = payrollRows.value.find(r => r.id === change.rowId);
      if (!row) {
        throw new Error(`Row with ID ${change.rowId} not found`);
      }

      return {
        year: row.year,
        month: row.month,
        department: row.department,
        department_location: row.departmentLocation,
        position: row.position,
        designation: row.designation,
        salary: change.fieldType === 'salary' ? change.newValue : row.salary,
        amount: change.fieldType === 'count' ? change.newValue : row.count
      };
    });

    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        changes: apiChanges,
        project: projectName
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      console.log('Payroll changes saved successfully:', data.message);
      return { status: 'success', message: 'Changes saved successfully' };
    } else {
      throw new Error(data.message?.error || 'Failed to save changes');
    }
  } catch (error) {
    console.error('Error saving payroll changes:', error);
    throw error;
  }
}

// Modal functions
export function openAddPayrollModal() {
  showAddPayrollModal.value = true;
  resetPayrollForm();
  payrollModalError.value = '';
  
  // Load options if not already loaded
  if (departmentOptions.value.length === 0) {
    loadDepartmentOptions();
  }
  if (departmentLocationOptions.value.length === 0) {
    loadDepartmentLocationOptions();
  }
  if (designationOptions.value.length === 0) {
    loadDesignationOptions();
  }
}

export function closeAddPayrollModal() {
  showAddPayrollModal.value = false;
  resetPayrollForm();
}

export function resetPayrollForm() {
  addPayrollForm.year = '';
  addPayrollForm.month = '';
  addPayrollForm.rows = [];
  addPayrollRow(); // Add initial row
}

export function addPayrollRow() {
  addPayrollForm.rows.push({
    department: '',
    departmentLocation: '',
    position: '',
    designation: '',
    salary: 0,
    count: 0
  });
}

export function removePayrollRow(index) {
  if (addPayrollForm.rows.length > 1) {
    addPayrollForm.rows.splice(index, 1);
  }
}

export async function submitPayrollData(selectedProject, payrollRows, reloadData) {
  if (!selectedProject) {
    alertService.error("Please select a project first");
    return;
  }
  
  if (!addPayrollForm.year || !addPayrollForm.month || addPayrollForm.rows.length === 0) {
    alertService.error('Please select year, month, and add at least one payroll entry.');
    return;
  }
  
  const cleanRows = addPayrollForm.rows.filter(row => 
    row.department && 
    row.departmentLocation && 
    row.position && 
    row.designation && 
    row.salary > 0 && 
    row.count > 0
  );
  
  if (cleanRows.length === 0) {
    alertService.error('Please fill in all required fields with valid values.');
    return;
  }
  
  isSubmittingPayroll.value = true;
  payrollModalError.value = '';
  
  try {
    // Transform data for API
    const apiChanges = cleanRows.map(row => ({
      year: addPayrollForm.year,
      month: addPayrollForm.month,
      department: row.department,
      department_location: row.departmentLocation,
      position: row.position,
      designation: row.designation,
      salary: row.salary,
      amount: row.count
    }));

    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        changes: apiChanges,
        project: selectedProject.project_name
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      alertService.success("Payroll data added successfully!");
      showAddPayrollModal.value = false;
      resetPayrollForm();
      
      // Reload data if callback provided
      if (reloadData) {
        await reloadData();
      }
    } else {
      throw new Error(data.message?.error || 'Failed to add payroll data');
    }
    
  } catch (error) {
    payrollModalError.value = "Failed to add payroll data. Please try again.";
    console.error("Error adding payroll data:", error);
  } finally {
    isSubmittingPayroll.value = false;
  }
}