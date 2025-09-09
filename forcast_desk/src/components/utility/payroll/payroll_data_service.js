// Payroll Data Service - Handles API calls and modal functionality

import { ref, reactive } from 'vue';
import alertService from "@/components/ui/ui_utility/alertService.js";
import { payrollDataConstructor, transformApiToFrontend, transformFrontendToApi, validatePayrollData } from './data_constructors/index.js';
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js';

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
export const defaultPayrollRows = ref([]);
// Helper: ensure required Department Location and Designation records exist before saving
async function ensureLocationsAndDesignationsExist(rows) {
  // Build unique sets from provided rows
  const neededLocations = new Set();
  const neededDesignations = new Set();
  (rows || []).forEach((r) => {
    if (r && typeof r === 'object') {
      if (r.departmentLocation && String(r.departmentLocation).trim()) {
        neededLocations.add(String(r.departmentLocation).trim());
      }
      if (r.designation && String(r.designation).trim()) {
        neededDesignations.add(String(r.designation).trim());
      }
    }
  });

  // Load current options
  try { await loadDepartmentLocationOptions(); } catch (_) {}
  try { await loadDesignationOptions(); } catch (_) {}

  const existingLocations = new Set(
    (departmentLocationOptions.value || []).map(opt => (opt.label || opt.value || '').toString().trim().toLowerCase())
  );
  const existingDesignations = new Set(
    (designationOptions.value || []).map(opt => (opt.label || opt.value || '').toString().trim().toLowerCase())
  );

  // Create missing department locations
  for (const loc of neededLocations) {
    const key = loc.toString().trim().toLowerCase();
    if (!existingLocations.has(key)) {
      try {
        await createDepartmentLocation(loc);
        existingLocations.add(key);
      } catch (_) {
        // ignore; backend will still validate
      }
    }
  }

  // Create missing designations
  for (const desig of neededDesignations) {
    const key = desig.toString().trim().toLowerCase();
    if (!existingDesignations.has(key)) {
      try {
        await createDesignation(desig);
        existingDesignations.add(key);
      } catch (_) {
        // ignore; backend will still validate
      }
    }
  }
}


// Payroll data state
export const payrollData = ref({});
export const payrollRows = ref([]);

// Import months from expense assumption
import { months } from "@/components/utility/expense_assumption/index.js";
export { months };


//! ************ Department Options ****************
export async function loadDepartmentOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.department_list.get_department_list', {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
    const data = await response.json();
    
    if (data.message && data.message.success) {
      departmentOptions.value = data.message.departments.map(dept => ({
        value: dept.department_name,
        label: dept.department_name
      }));
    } else {
      console.error('Failed to load departments:', data.message?.error || 'Unknown error');
      // Fallback to sample departments if API fails
      departmentOptions.value = [
        { value: 'ROOMS', label: 'ROOMS' },
        { value: 'FOOD & BEVERAGE', label: 'FOOD & BEVERAGE' },
        { value: 'BANQUET', label: 'BANQUET' },
        { value: 'OOD', label: 'OOD' },
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

//! ************ Project Department Options (Filtered) ****************
export async function loadProjectDepartmentOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.department_list.get_department_list', {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
    const data = await response.json();
    
    if (data.message && data.message.success) {
      // Filter out "All departments" and group departments
      const filteredDepartments = data.message.departments.filter(dept => {
        const deptName = dept.department_name;
        
        // Exclude "All departments" option
        if (deptName.toLowerCase().includes('all')) {
          return false;
        }
        
        // Exclude group departments (you can add more specific criteria here)
        if (deptName.toLowerCase().includes('group')) {
          return false;
        }
        
        return true;
      });
      
      return filteredDepartments.map(dept => ({
        value: dept.department_name,
        label: dept.department_name
      }));
    } else {
      console.error('Failed to load departments:', data.message?.error || 'Unknown error');
      // Fallback to sample departments if API fails
      return [
        { value: 'ROOMS', label: 'ROOMS' },
        { value: 'FOOD & BEVERAGE', label: 'FOOD & BEVERAGE' },
        { value: 'BANQUET', label: 'BANQUET' },
        { value: 'OOD', label: 'OOD' },
        { value: 'SALES & MARKETING', label: 'SALES & MARKETING' },
        { value: 'ADMINISTRATION', label: 'ADMINISTRATION' }
      ];
    }
  } catch (error) {
    console.error('Error loading project departments:', error);
    // Fallback to sample departments if API fails
    return [
      { value: 'ROOMS', label: 'ROOMS' },
      { value: 'FOOD & BEVERAGE', label: 'FOOD & BEVERAGE' },
      { value: 'SALES & MARKETING', label: 'SALES & MARKETING' },
      { value: 'ADMINISTRATION', label: 'ADMINISTRATION' }
    ];
  }
}


//! ************ Department Location Options ****************
export async function loadDepartmentLocationOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.get_payroll_department_location_list', {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
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


//! ************ Designation Options ****************
export async function loadDesignationOptions() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.designation_list.get_designation_list', {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
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


//! ************ Fetch payroll data from API ****************
export async function fetchPayrollData(projectName, fromYear = null, toYear = null) {
  try {
    if (!projectName) {
      console.warn('No project name provided for payroll data fetch');
      return;
    }

    const response = await fetch(`/api/method/ex_forcast.api.call_and_save_payroll_data.payroll_data_display?project=${encodeURIComponent(projectName)}`, {
      headers: {
        'X-Frappe-CSRF-Token': getCSRFToken()
      }
    });
    const data = await response.json();
    
    if (data.message && !data.message.error) {
      // Use data constructor to transform API response
      const transformedResult = transformApiToFrontend(data, projectName, fromYear, toYear);
      
      // Validate the transformed data
      const validation = validatePayrollData(transformedResult, 'frontend');
      if (!validation.isValid) {
        console.warn('Payroll data validation warnings:', validation.warnings);
        if (validation.errors.length > 0) {
          console.error('Payroll data validation errors:', validation.errors);
          alertService.error('Payroll data contains validation errors');
          return;
        }
      }
      
      payrollData.value = transformedResult.payrollData;
      payrollRows.value = transformedResult.payrollRows;

      // Load default payroll rows for project's departments (for UI assistance)
      try {
        const respDefaults = await fetch(`/api/v2/method/ex_forcast.api.default_payroll.get_default_payroll_for_project?project_name=${encodeURIComponent(projectName)}`);
        const jsonDefaults = await respDefaults.json();
        const dataDefaults = jsonDefaults.data || jsonDefaults;
        if (dataDefaults && dataDefaults.success) {
          defaultPayrollRows.value = dataDefaults.default_payroll || [];
        } else {
          defaultPayrollRows.value = [];
        }
      } catch (_) {
        defaultPayrollRows.value = [];
      }
      
      // console.log('Payroll data loaded successfully:', {
      //   totalRows: transformedResult.totalRows,
      //   payrollRowsLength: transformedResult.payrollRows?.length,
      //   payrollDataKeys: Object.keys(transformedResult.payrollData || {})
      // });
    } else {
      console.error('Failed to load payroll data:', data.message?.error);
      alertService.error('Failed to load payroll data');
    }
  } catch (error) {
    console.error('Error loading payroll data:', error);
    alertService.error('Error loading payroll data');
  }
}


//! ************ Save payroll changes to API ****************
export async function savePayrollChanges(changes, projectName) {
  try {
    if (!projectName) {
      throw new Error('Project name is required');
    }

    if (!changes || changes.length === 0) {
      return { status: 'success', message: 'No changes to save' };
    }

    // console.log('Saving payroll changes:', {
    //   changesCount: changes.length,
    //   projectName,
    //   availableRows: payrollRows.value.length
    // });

    // Group changes by row to collect monthly counts
    const changesByRow = {};
    
    changes.forEach(change => {
      // console.log('Processing change:', change);
      if (!changesByRow[change.rowId]) {
        changesByRow[change.rowId] = {
          changes: [],
          monthly_count: {},
          baseCountChanged: false
        };
      }
      
      changesByRow[change.rowId].changes.push(change);
      
      // Proper handling of base count vs monthly overrides
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

    // console.log('Changes grouped by row:', Object.keys(changesByRow));

    // Ensure related records exist for rows being changed (locations, designations)
    const rowsToEnsure = Object.keys(changesByRow).map(rowId => payrollRows.value.find(r => r.id === rowId)).filter(Boolean);
    await ensureLocationsAndDesignationsExist(rowsToEnsure);

    // Transform changes to API format using data constructor
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

      // console.log('Processing change for row:', {
      //   rowId,
      //   unique_id: row.unique_id,
      //   department: row.department,
      //   position: row.position,
      //   fieldType: latestChange.fieldType,
      //   newValue: latestChange.newValue
      // });

      // Create updated row data for transformation
      const updatedRow = {
        ...row,
        salary: latestChange.fieldType === 'salary' ? latestChange.newValue : row.salary,
        count: rowChanges.baseCountChanged ? rowChanges.baseCount : row.count
      };

      // Use data constructor to transform to API format
      const apiChange = payrollDataConstructor.transformRowToApiFormat(updatedRow, payrollData.value);
      // Ensure year is present for backend upsert
      if (!apiChange.year && latestChange && latestChange.year) {
        apiChange.year = latestChange.year;
      }
      
      // Add monthly count data if exists
      if (Object.keys(rowChanges.monthly_count).length > 0) {
        apiChange.monthly_count = rowChanges.monthly_count;
      }
      
      // console.log('API change being sent:', apiChange);
      return apiChange;
    });

    // Validate API changes before sending
    const validationData = {
      payrollRows: apiChanges.map(change => ({
        department: change.department,
        departmentLocation: change.department_location,
        position: change.position,
        designation: change.designation,
        salary: change.salary,
        count: change.amount
      })),
      projectName
    };
    
    const validation = validatePayrollData(validationData, 'frontend');
    if (!validation.isValid) {
      console.warn('Payroll changes validation warnings:', validation.warnings);
      if (validation.errors.length > 0) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }

    //! ************ Save payroll changes to API ****************
    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify({
        changes: apiChanges,
        project: projectName
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.success) {
      // console.log('Payroll changes saved successfully:', data.message);
      return { status: 'success', message: 'Changes saved successfully' };
    } else {
      throw new Error(data.message?.error || 'Failed to save changes');
    }
  } catch (error) {
    console.error('Error saving payroll changes:', error);
    throw error;
  }
}


//! ************ Modal functions ****************
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
  // Use data constructor to create default row
  const defaultRow = payrollDataConstructor.createDefaultRow();
  addPayrollForm.rows.push(defaultRow);
}

export function removePayrollRow(index) {
  if (addPayrollForm.rows.length > 1) {
    addPayrollForm.rows.splice(index, 1);
  }
}


//! ************ Submit payroll data to API ****************
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
  
  // Validate data using constructor
  const validationData = {
    payrollRows: cleanRows,
    projectName: selectedProject.project_name
  };
  
  const validation = validatePayrollData(validationData, 'frontend');
  if (!validation.isValid) {
    alertService.error(`Validation failed: ${validation.errors.join(', ')}`);
    return;
  }
  
  isSubmittingPayroll.value = true;
  payrollModalError.value = '';
  
  try {
    // Ensure related records exist for new rows
    await ensureLocationsAndDesignationsExist(cleanRows);

    // Use data constructor to transform frontend data to API format
    const apiPayload = transformFrontendToApi(cleanRows, {}, selectedProject.project_name);
    
    // Add year to each item
    apiPayload.changes.forEach(item => {
      item.year = addPayrollForm.year;
    });

    //! ************ Submit payroll data to API ****************
    const response = await fetch('/api/method/ex_forcast.api.call_and_save_payroll_data.upsert_payroll_data_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify(apiPayload)
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


//! ************ Create new items ****************
export async function createDepartment(departmentName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.department_list.create_department', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
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


//! ************ Create new department location ****************
export async function createDepartmentLocation(locationName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.payroll_department_location_list.create_payroll_department_location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
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


//! ************ Create new designation ****************
export async function createDesignation(designationName) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.designation_list.create_designation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
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


//! ************ Create new restaurant ****************
export async function createRestaurant(restaurantName, project = null) {
  try {
    const response = await fetch('/api/method/ex_forcast.api.create_restaurant.create_restaurant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Frappe-CSRF-Token': getCSRFToken()
      },
      body: JSON.stringify({
        cover_name: restaurantName,
        project: project
      })
    });

    const data = await response.json();
    
    if (data.message && data.message.status === 'success') {
      alertService.success(`Restaurant "${restaurantName}" created successfully`);
      return data.message.docname;
    } else {
      throw new Error(data.message?.message || 'Failed to create restaurant');
    }
  } catch (error) {
    alertService.error(error.message || 'Failed to create restaurant');
    throw error;
  }
}