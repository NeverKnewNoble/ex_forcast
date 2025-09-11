import { createResource } from "frappe-ui"
import { selectedProject } from '@/components/utility/dashboard/projectService.js'

// Create a resource for expense document operations
const expenseResource = createResource({
  url: 'frappe.client.insert',
  makeParams({ doctype, doc }) {
    return {
      doc: {
        doctype,
        ...doc
      }
    }
  }
})

export async function createExpenseDocument({ year, month, expenses }) {
  // Get the currently selected project
  const currentProject = selectedProject.value
  
  if (!currentProject) {
    throw new Error('No project selected. Please select a project first.')
  }

  // Transform the expenses array to match the Expense Items table structure
  const expenseItems = expenses.map(expense => ({
    department: expense.department,
    department_location: expense.department_location,
    expense_name: expense.expense, 
    amount: expense.amount,
    // Add cost type if available
    ...(expense.costType && { cost_type: expense.costType }),
    // Add flag to indicate this is not a default expense (expenses from modal are always regular)
    is_default_expense: false,
  }))

  const doc = {
    year,
    month,
    project: currentProject.project_name, // Add project field
    expense_items: expenseItems,
  }


  try {
    const result = await expenseResource.submit({
      doctype: "Expense Assumptions",
      doc
    })
    
   //  // console.log('Document created successfully:', result)
    return { success: true, name: result.name }
  } catch (error) {
    console.error('Error creating expense document:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    })
    return { success: false, error }
  }
}