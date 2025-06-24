import { ref } from "vue"

export const showAddExpenseModal = ref(false)

export const addExpenseForm = ref({
  year: "",
  month: "",
  rows: [{ expense: "", amount: 0, amountDisplay: "", category: "", costType: "" }],
})

export function addExpenseRow() {
  addExpenseForm.value.rows.push({ expense: "", amount: 0, amountDisplay: "", category: "", costType: "" })
}

export function removeExpenseRow(index) {
  if (addExpenseForm.value.rows.length > 1) {
    addExpenseForm.value.rows.splice(index, 1)
  }
}

export function resetExpenseForm() {
  addExpenseForm.value = {
    year: "",
    month: "",
    rows: [{ expense: "", amount: 0, amountDisplay: "", category: "", costType: "" }],
  }
}

export function cancelAddExpense() {
  resetExpenseForm()
  showAddExpenseModal.value = false
}
