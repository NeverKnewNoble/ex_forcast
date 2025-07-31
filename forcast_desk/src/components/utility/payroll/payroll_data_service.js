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
export async function fetchPayrollData(projectName, fromYear = null, toYear = null) {
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
        // Filter by year range if provided
        if (fromYear && toYear) {
          const yearNum = parseInt(year);
          const fromYearNum = parseInt(fromYear);
          const toYearNum = parseInt(toYear);
          
          if (yearNum < fromYearNum || yearNum > toYearNum) {
            return; // Skip this year if it's outside the selected range
          }
        }
        
        // API now returns data directly by year, no month nesting
        data.message[year].forEach(item => {
          // Use the backend's unique_id as the rowId, or generate one if it doesn't exist
          // For existing records without unique_id, we'll use a combination of business fields as fallback
          let rowId;
          if (item.unique_id) {
            rowId = item.unique_id;
          } else {
            // Fallback: create a stable ID from business fields for existing records
            rowId = `${item.department}_${item.department_location}_${item.position}_${item.designation}_${year}`;
          }
          
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
            unique_id: item.unique_id // Include the unique_id from backend
            // Removed month since API no longer uses it
          };
          
          transformedRows.push(row);
          
          // Initialize payrollData structure - simplified without month
          if (!transformedData[year]) {
            transformedData[year] = {};
          }
          if (!transformedData[year][rowId]) {
            transformedData[year][rowId] = {};
          }
          
          transformedData[year][rowId] = {
            salary: item.salary,
            unique_id: item.unique_id, // Store unique_id in payrollData as well
            // Store monthly counts from backend if they exist
            ...(item.monthly_count && Object.keys(item.monthly_count).length > 0 && {
              count: item.monthly_count
            })
          };
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

    console.log('Saving payroll changes:', {
      changesCount: changes.length,
      projectName,
      availableRows: payrollRows.value.length
    });

    // Group changes by row to collect monthly counts
    const changesByRow = {};
    
    changes.forEach(change => {
      console.log('Processing change:', change);
      if (!changesByRow[change.rowId]) {
        changesByRow[change.rowId] = {
          changes: [],
          monthly_count: {},
          baseCountChanged: false
        };
      }
      
      changesByRow[change.rowId].changes.push(change);
      
      // ✅ FIXED: Proper handling of base count vs monthly overrides
      if (change.fieldType === 'count') {
        if (change.month && change.isOverride) {
          // This is a monthly override
          changesByRow[change.rowId].monthly_count[change.month] = change.newValue;
        } else if (!change.month) {
          // This is a base count change
          changesByRow[change.rowId].baseCountChanged = true;
          changesByRow[change.rowId].baseCount = change.newValue;
        }
      }
    });

    console.log('Changes grouped by row:', Object.keys(changesByRow));

    // Transform changes to API format
    const apiChanges = Object.keys(changesByRow).map(rowId => {
      const row = payrollRows.value.find(r => r.id === rowId);
      if (!row) {
        console.error('Row not found. Available rows:', payrollRows.value.map(r => ({ 
          id: r.id, 
          unique_id: r.unique_id,
          department: r.department, 
          position: r.position 
        })));
        throw new Error(`Row with ID ${rowId} not found. Available rows: ${payrollRows.value.length}`);
      }

      const rowChanges = changesByRow[rowId];
      const latestChange = rowChanges.changes[rowChanges.changes.length - 1];

      console.log('Processing change for row:', {
        rowId,
        unique_id: row.unique_id,
        department: row.department,
        position: row.position,
        fieldType: latestChange.fieldType,
        newValue: latestChange.newValue
      });

      const apiChange = {
        year: row.year,
        department: row.department,
        department_location: row.departmentLocation,
        position: row.position,
        designation: row.designation,
        salary: latestChange.fieldType === 'salary' ? latestChange.newValue : row.salary,
        // ✅ FIXED: Use base count from changes if it was modified, otherwise use row count
        amount: rowChanges.baseCountChanged ? rowChanges.baseCount : row.count,
        unique_id: row.unique_id || null, // Include the unique_id, or null if not available
        monthly_count: Object.keys(rowChanges.monthly_count).length > 0 ? rowChanges.monthly_count : undefined
      };
      
      console.log('API change being sent:', apiChange);
      return apiChange;
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
  addPayrollForm.rows = [];
  addPayrollRow(); // Add initial row
}

export function addPayrollRow() {
  addPayrollForm.rows.push({
    department: '',
    departmentLocation: '',
    position: '',
    designation: '',
    salary: '0.00',
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
  
  if (!addPayrollForm.year || addPayrollForm.rows.length === 0) {
    alertService.error('Please select year and add at least one payroll entry.');
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

// Quick Actions - Create new items
export async function createDepartment(departmentName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.department_list.create_department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_name: departmentName
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      alertService.success(data.message.message);
      // Reload department options
      await loadDepartmentOptions();
      return data.message.department;
    } else {
      throw new Error(data.message?.error || 'Failed to create department');
    }
  } catch (error) {
    alertService.error(error.message || 'Failed to create department');
    throw error;
  }
}

export async function createDepartmentLocation(locationName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.create_payroll_department_location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        department_location: locationName
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      alertService.success(data.message.message);
      // Reload location options
      await loadDepartmentLocationOptions();
      return data.message.location;
    } else {
      throw new Error(data.message?.error || 'Failed to create department location');
    }
  } catch (error) {
    alertService.error(error.message || 'Failed to create department location');
    throw error;
  }
}

export async function createDesignation(designationName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.designation_list.create_designation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        designation_name: designationName
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      alertService.success(data.message.message);
      // Reload designation options
      await loadDesignationOptions();
      return data.message.designation;
    } else {
      throw new Error(data.message?.error || 'Failed to create designation');
    }
  } catch (error) {
    alertService.error(error.message || 'Failed to create designation');
    throw error;
  }
}