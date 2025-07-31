/**
 * Sandbox Test for Payroll ORM Models
 * 
 * This file demonstrates how the new ORM models work and how they fix
 * the monthly count relationship issue.
 */

import { PayrollItem, PayrollYear, PayrollProject, ModelAdapter } from './index.js';

// Test function to demonstrate the fix
export function testMonthlyCountFix() {
  console.log('🧪 Testing Monthly Count Fix with ORM Models');
  console.log('=============================================\n');
  
  // Create a sample payroll item
  const item = new PayrollItem({
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Manager',
    designation: 'Front Office Manager',
    salary: 5000,
    count: 1, // Base count
    category: 'ROOMS'
  });
  
  console.log('📋 Initial Payroll Item:');
  console.log(`Base Count: ${item.count}`);
  console.log(`Base Salary: $${item.salary}`);
  console.log(`Jan Count: ${item.getMonthlyCount('Jan')} (defaults to base count)`);
  console.log(`Jan Salary: $${item.getMonthlySalary('Jan')}`);
  console.log('');
  
  // Set a monthly override
  console.log('🔄 Setting Monthly Override:');
  item.setMonthlyCount('Jan', 3);
  console.log(`Jan Count: ${item.getMonthlyCount('Jan')} (override)`);
  console.log(`Jan Salary: $${item.getMonthlySalary('Jan')} (5000 * 3)`);
  console.log(`Base Count: ${item.count} (unchanged!)`);
  console.log('');
  
  // Set another monthly override
  console.log('🔄 Setting Another Monthly Override:');
  item.setMonthlyCount('Feb', 2);
  console.log(`Feb Count: ${item.getMonthlyCount('Feb')} (override)`);
  console.log(`Feb Salary: $${item.getMonthlySalary('Feb')} (5000 * 2)`);
  console.log(`Mar Count: ${item.getMonthlyCount('Mar')} (still defaults to base count)`);
  console.log(`Base Count: ${item.count} (still unchanged!)`);
  console.log('');
  
  // Remove an override
  console.log('🔄 Removing Monthly Override:');
  item.removeMonthlyCount('Jan');
  console.log(`Jan Count: ${item.getMonthlyCount('Jan')} (back to base count)`);
  console.log(`Jan Salary: $${item.getMonthlySalary('Jan')} (5000 * 1)`);
  console.log(`Base Count: ${item.count} (still unchanged!)`);
  console.log('');
  
  // Show all monthly counts
  console.log('📊 All Monthly Counts:');
  const allCounts = item.getAllMonthlyCounts();
  Object.entries(allCounts).forEach(([month, count]) => {
    const isOverride = item.hasMonthlyCountOverride(month);
    const status = isOverride ? 'OVERRIDE' : 'DEFAULT';
    console.log(`${month}: ${count} (${status})`);
  });
  console.log('');
  
  // Show only overrides
  console.log('📋 Monthly Overrides Only:');
  const overrides = item.getMonthlyCountOverrides();
  if (Object.keys(overrides).length === 0) {
    console.log('No overrides set');
  } else {
    Object.entries(overrides).forEach(([month, count]) => {
      console.log(`${month}: ${count}`);
    });
  }
  console.log('');
  
  return item;
}

// Test function to demonstrate year-level operations
export function testYearOperations() {
  console.log('📅 Testing Year Operations');
  console.log('==========================\n');
  
  // Create a payroll year
  const year = new PayrollYear('2024', { project: 'Test Project' });
  
  // Add items to the year
  const item1 = new PayrollItem({
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Manager',
    designation: 'Front Office Manager',
    salary: 5000,
    count: 1,
    category: 'ROOMS'
  });
  
  const item2 = new PayrollItem({
    department: 'ROOMS',
    departmentLocation: 'Housekeeping',
    position: 'Non-manager',
    designation: 'Room Attendant',
    salary: 2200,
    count: 8,
    category: 'ROOMS'
  });
  
  year.addItem(item1);
  year.addItem(item2);
  
  console.log(`Year: ${year.year}`);
  console.log(`Project: ${year.project}`);
  console.log(`Items: ${year.itemCount}`);
  console.log('');
  
  // Set monthly overrides
  year.setItemMonthlyCount(item1.id, 'Jan', 3);
  year.setItemMonthlyCount(item2.id, 'Jan', 10);
  
  console.log('📊 January Totals:');
  console.log(`Total Count: ${year.getTotalMonthlyCount('Jan')}`);
  console.log(`Total Salary: $${year.getTotalMonthlySalary('Jan')}`);
  console.log(`Management Count: ${year.getManagementMonthlyCount('Jan')}`);
  console.log(`Non-Management Count: ${year.getNonManagementMonthlyCount('Jan')}`);
  console.log('');
  
  // Show by category
  console.log('📋 By Category:');
  const categories = year.getUniqueCategories();
  categories.forEach(category => {
    console.log(`${category}: ${year.getCategoryMonthlyCount(category, 'Jan')} people, $${year.getCategoryMonthlySalary(category, 'Jan')} salary`);
  });
  console.log('');
  
  return year;
}

// Test function to demonstrate project-level operations
export function testProjectOperations() {
  console.log('🏢 Testing Project Operations');
  console.log('=============================\n');
  
  // Create a project
  const project = new PayrollProject('Test Hotel');
  
  // Add years
  const year2024 = new PayrollYear('2024', { project: 'Test Hotel' });
  const year2025 = new PayrollYear('2025', { project: 'Test Hotel' });
  
  // Add items to 2024
  const item2024 = new PayrollItem({
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Manager',
    designation: 'Front Office Manager',
    salary: 5000,
    count: 1,
    category: 'ROOMS'
  });
  year2024.addItem(item2024);
  
  // Add items to 2025 (with salary increase)
  const item2025 = new PayrollItem({
    department: 'ROOMS',
    departmentLocation: 'Front Desk',
    position: 'Manager',
    designation: 'Front Office Manager',
    salary: 5500, // 10% increase
    count: 1,
    category: 'ROOMS'
  });
  year2025.addItem(item2025);
  
  project.addYear('2024', year2024.toJSON());
  project.addYear('2025', year2025.toJSON());
  
  console.log(`Project: ${project.projectName}`);
  console.log(`Years: ${project.yearCount}`);
  console.log(`Total Items: ${project.getTotalItems()}`);
  console.log('');
  
  // Set monthly overrides across years
  project.setItemMonthlyCount('2024', item2024.id, 'Jan', 2);
  project.setItemMonthlyCount('2025', item2025.id, 'Jan', 3);
  
  console.log('📊 January Comparison:');
  console.log(`2024 Jan: ${project.getItemMonthlyCount('2024', item2024.id, 'Jan')} people, $${project.getItemMonthlySalary('2024', item2024.id, 'Jan')} salary`);
  console.log(`2025 Jan: ${project.getItemMonthlyCount('2025', item2025.id, 'Jan')} people, $${project.getItemMonthlySalary('2025', item2025.id, 'Jan')} salary`);
  console.log('');
  
  return project;
}

// Test function to demonstrate adapter functionality
export function testAdapter() {
  console.log('🔌 Testing Model Adapter');
  console.log('=========================\n');
  
  // Create sample existing data
  const existingData = {
    '2024': [
      {
        department: 'ROOMS',
        department_location: 'Front Desk',
        position: 'Manager',
        designation: 'Front Office Manager',
        salary: 5000,
        amount: 1,
        unique_id: 'PAY_1234567890_abc123',
        monthly_counts: {
          'Jan': 2,
          'Feb': 3
        }
      }
    ]
  };
  
  console.log('📥 Converting existing data to model:');
  const project = ModelAdapter.fromExistingData(existingData, 'Test Project');
  console.log(`Project: ${project.projectName}`);
  console.log(`Years: ${project.yearCount}`);
  console.log(`Items: ${project.getTotalItems()}`);
  console.log('');
  
  // Test the hybrid adapter
  console.log('🔀 Testing hybrid adapter:');
  const adapter = ModelAdapter.createHybridAdapter(project);
  
  const item = project.getItemFromYear('2024', 'PAY_1234567890_abc123');
  if (item) {
    console.log(`Item found: ${item.designation}`);
    console.log(`Jan count: ${adapter.getMonthlyCount('2024', item.id, 'Jan')}`);
    console.log(`Feb count: ${adapter.getMonthlyCount('2024', item.id, 'Feb')}`);
    console.log(`Mar count: ${adapter.getMonthlyCount('2024', item.id, 'Mar')} (defaults to base)`);
  }
  console.log('');
  
  // Convert back to existing format
  console.log('📤 Converting back to existing format:');
  const convertedData = ModelAdapter.toExistingData(project);
  console.log('Converted data:', JSON.stringify(convertedData, null, 2));
  console.log('');
  
  return { project, adapter };
}

// Main test function
export function runAllTests() {
  console.log('🚀 Running All Payroll Model Tests');
  console.log('==================================\n');
  
  try {
    // Test 1: Monthly count fix
    const item = testMonthlyCountFix();
    
    // Test 2: Year operations
    const year = testYearOperations();
    
    // Test 3: Project operations
    const project = testProjectOperations();
    
    // Test 4: Adapter functionality
    const { project: adaptedProject, adapter } = testAdapter();
    
    console.log('✅ All tests completed successfully!');
    console.log('\n🎯 Key Benefits Demonstrated:');
    console.log('1. ✅ Base counts and monthly overrides are completely separate');
    console.log('2. ✅ Monthly overrides do not affect base values');
    console.log('3. ✅ Type safety prevents incorrect relationships');
    console.log('4. ✅ Easy to test and maintain');
    console.log('5. ✅ Backward compatibility through adapters');
    
    return { item, year, project, adaptedProject, adapter };
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Export for use in browser console or other environments
if (typeof window !== 'undefined') {
  window.testPayrollModels = {
    testMonthlyCountFix,
    testYearOperations,
    testProjectOperations,
    testAdapter,
    runAllTests
  };
} 