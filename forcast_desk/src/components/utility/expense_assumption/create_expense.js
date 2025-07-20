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
    expense_name: expense.expense, 
    amount: expense.amount,
    // Add hospitality category if available
    ...(expense.category && { hospitality_category: expense.category }),
    // Add cost type if available
    ...(expense.costType && { cost_type: expense.costType }),
  }))

  const doc = {
    year,
    month,
    project: currentProject.project_name, // Add project field
    expense_items: expenseItems,
  }

  console.log('Creating expense document with data:', {
    year,
    month,
    project: currentProject.project_name,
    expenseItems,
    fullDoc: doc
  })

  try {
    const result = await expenseResource.submit({
      doctype: "Expense Assumptions",
      doc
    })
    
    console.log('Document created successfully:', result)
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