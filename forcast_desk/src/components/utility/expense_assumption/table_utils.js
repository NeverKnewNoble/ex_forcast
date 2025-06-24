import { ref } from 'vue'

// Table collapse state management
export const collapsedYears = ref(new Set())

export function toggleCollapse(year) {
  collapsedYears.value.has(year)
    ? collapsedYears.value.delete(year)
    : collapsedYears.value.add(year)
}

export function isYearCollapsed(year) {
  return collapsedYears.value.has(year)
}

// Filtered expenses computation
export function getFilteredExpenses(expenseData, visibleYears) {
  const filtered = new Set()
  visibleYears.forEach(year => {
    const yearData = expenseData[year] || {}
    for (const month in yearData) {
      yearData[month].forEach(entry => filtered.add(entry.expense))
    }
  })
  return [...filtered].sort()
} 