import { createResource } from "frappe-ui"

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
  const doc = {
    year,
    month,
    expense_items: expenses,
  }

  try {
    const result = await expenseResource.submit({
      doctype: "Expense Assumptions",
      doc
    })
    return { success: true, name: result.name }
  } catch (error) {
    return { success: false, error }
  }
}