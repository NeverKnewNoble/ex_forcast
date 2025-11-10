<template>
  <div class="bg-white rounded-lg border border-amber-300 dark:border-amber-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-amber-600 to-amber-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-amber-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- Cashflow Header Row -->
            <tr class="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-semibold tracking-wide">Cashflow Statement</h2>
                </div>
              </td>
            </tr>

            <!-- Year headers -->
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-amber-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
                class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-amber-700 transition-all duration-200 group text-sm"
                @click="toggleCollapse(year)"
                title="Click to collapse/expand"
              >
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">{{ year }}</span>
                  <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                  <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                </div>
              </th>
            </tr>
            <tr class="bg-amber-500 dark:bg-amber-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <th
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-amber-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
                  <th class="px-2 py-1 text-center border border-amber-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-amber-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
              </template>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="text-gray-700 bg-white text-sm dark:text-gray-200 dark:bg-gray-800">
            <!-- CASH INFLOW Section Header -->
            <tr class="bg-amber-800 border-b-2 border-amber-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  CASH INFLOW
                </div>
              </td>
            </tr>

            <!-- Cash Received from Operations -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Cash Received from Operations</td>
              <template v-for="year in visibleYears" :key="'cash-ops-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'cash-ops-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getCashReceivedFromOperations(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getCashReceivedFromOperationsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getCashReceivedFromOperationsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Accounts Receivable Receipts -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Accounts Receivable Receipts</td>
              <template v-for="year in visibleYears" :key="'ar-receipts-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ar-receipts-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountsReceivableReceipts(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountsReceivableReceiptsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountsReceivableReceiptsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Other Operating Receipts -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Other Operating Receipts</td>
              <template v-for="year in visibleYears" :key="'other-receipts-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'other-receipts-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOtherOperatingReceipts(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOtherOperatingReceiptsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOtherOperatingReceiptsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Interest Received -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Interest Received</td>
              <template v-for="year in visibleYears" :key="'interest-received-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'interest-received-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getInterestReceived(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getInterestReceivedYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getInterestReceivedYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Long Term Loan -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Long Term Loan</td>
              <template v-for="year in visibleYears" :key="'lt-loan-inflow-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'lt-loan-inflow-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoanInflow(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoanInflowYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoanInflowYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- TOTAL CASH INFLOW -->
            <tr class="bg-amber-600 border-b-2 border-amber-700">
              <td class="px-3 py-2 font-bold border-r border-amber-700 text-white">TOTAL CASH INFLOW</td>
              <template v-for="year in visibleYears" :key="'total-inflow-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-inflow-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-700 font-bold bg-amber-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCashInflow(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-700 font-bold bg-amber-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCashInflowYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-700 font-bold bg-amber-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCashInflowYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- CASH OUTFLOW Section Header -->
            <tr class="bg-amber-800 border-b-2 border-amber-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  CASH OUTFLOW
                </div>
              </td>
            </tr>

            <!-- Rooms Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Rooms Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'rooms-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Rooms Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'rooms-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Rooms Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'rooms-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Rooms Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'rooms-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'rooms-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Cost of Sales -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">F&B Cost of Sales</td>
              <template v-for="year in visibleYears" :key="'fnb-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-cost-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbCostOfSales(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbCostOfSalesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">F&B Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'fnb-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">F&B Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'fnb-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">F&B Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'fnb-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">F&B Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'fnb-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnb-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Cost Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">OOD Cost Payments</td>
              <template v-for="year in visibleYears" :key="'ood-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-cost-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodCostPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">OOD Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'ood-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">OOD Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'ood-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">OOD Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'ood-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">OOD Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'ood-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ood-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getOodExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">A&G Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'ag-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ag-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">A&G Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'ag-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ag-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">A&G Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'ag-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ag-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">A&G Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'ag-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'ag-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAgExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">IT Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'it-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">IT Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'it-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">IT Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'it-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Cost Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">IT Cost Payments</td>
              <template v-for="year in visibleYears" :key="'it-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-cost-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItCostPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">IT Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'it-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'it-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getItExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">S&M Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'sm-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sm-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">S&M Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'sm-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sm-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">S&M Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'sm-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sm-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">S&M Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'sm-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sm-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSmExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Net Salaries & Wages Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">POM Net Salaries & Wages Payments</td>
              <template v-for="year in visibleYears" :key="'pom-salaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pom-salaries-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomSalariesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomSalariesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Bonus Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">POM Bonus Payments</td>
              <template v-for="year in visibleYears" :key="'pom-bonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pom-bonus-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomBonusPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomBonusPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Payroll Related Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">POM Payroll Related Payments</td>
              <template v-for="year in visibleYears" :key="'pom-payroll-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pom-payroll-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomPayrollRelatedPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomPayrollRelatedPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Expenses Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">POM Expenses Payments</td>
              <template v-for="year in visibleYears" :key="'pom-expenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pom-expenses-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomExpensesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPomExpensesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Utilities Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Utilities Payments</td>
              <template v-for="year in visibleYears" :key="'utilities-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'utilities-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUtilitiesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getUtilitiesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getUtilitiesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Base Fee Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Base Fee Payments</td>
              <template v-for="year in visibleYears" :key="'base-fee-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'base-fee-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getBaseFeePayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getBaseFeePaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getBaseFeePaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Incentive Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Incentive Payments</td>
              <template v-for="year in visibleYears" :key="'incentive-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'incentive-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getIncentivePayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getIncentivePaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getIncentivePaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Property & Other Taxes -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Property & Other Taxes</td>
              <template v-for="year in visibleYears" :key="'property-taxes-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'property-taxes-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPropertyTaxesPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPropertyTaxesPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPropertyTaxesPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Insurance Payments -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Insurance Payments</td>
              <template v-for="year in visibleYears" :key="'insurance-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'insurance-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getInsurancePayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getInsurancePaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getInsurancePaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Replacement Reserve -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Replacement Reserve</td>
              <template v-for="year in visibleYears" :key="'reserve-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'reserve-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getReplacementReservePayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getReplacementReservePaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getReplacementReservePaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Project Cost -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Project Cost</td>
              <template v-for="year in visibleYears" :key="'project-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'project-cost-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getProjectCostPayments(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getProjectCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getProjectCostPaymentsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Loan Principal Repayment -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Loan Principal Repayment</td>
              <template v-for="year in visibleYears" :key="'loan-principal-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'loan-principal-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanPrincipalRepayment(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanPrincipalRepaymentYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanPrincipalRepaymentYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Loan Interest payment -->
            <tr class="bg-amber-50 border-b border-amber-200">
              <td class="px-3 py-2 font-medium border-r border-amber-200">Loan Interest payment</td>
              <template v-for="year in visibleYears" :key="'loan-interest-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'loan-interest-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanInterestPayment(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanInterestPaymentYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-200 font-semibold bg-amber-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanInterestPaymentYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-1-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-1-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Net cash flows from Investing activities -->
            <tr class="bg-amber-700 border-b-2 border-amber-800">
              <td class="px-3 py-2 font-bold border-r border-amber-800 text-white">Net cash flows from Investing activities</td>
              <template v-for="year in visibleYears" :key="'investing-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'investing-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetInvestingActivities(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetInvestingActivitiesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetInvestingActivitiesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- NET CASH FLOW -->
            <tr class="bg-amber-700 border-b-2 border-amber-800">
              <td class="px-3 py-2 font-bold border-r border-amber-800 text-white">NET CASH FLOW</td>
              <template v-for="year in visibleYears" :key="'net-flow-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'net-flow-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetCashFlow(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetCashFlowYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-800 font-bold bg-amber-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getNetCashFlowYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Opening Balance for the Month -->
            <tr class="bg-amber-100 border-b border-amber-300">
              <td class="px-3 py-2 font-bold border-r border-amber-300">Opening Balance for the Month</td>
              <template v-for="year in visibleYears" :key="'opening-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'opening-' + year + '-' + label" class="px-2 py-1 text-right border border-amber-300 font-semibold">
                    <span class="font-mono text-xs">{{ formatMoney(getOpeningBalance(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-amber-300 font-bold bg-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOpeningBalanceYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-amber-300 font-bold bg-amber-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOpeningBalanceYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Closing Balance for the Month -->
            <tr class="bg-amber-800 border-b-2 border-black">
              <td class="px-3 py-2 font-bold border-r border-black text-white">Closing Balance for the Month</td>
              <template v-for="year in visibleYears" :key="'closing-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'closing-' + year + '-' + label" class="px-2 py-1 text-right border border-black font-bold bg-amber-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getClosingBalance(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-black font-bold bg-amber-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getClosingBalanceYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-black font-bold bg-amber-800">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getClosingBalanceYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/_master_utility/yearSettingsStore.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Building2
} from 'lucide-vue-next';

// Import utility functions
import {
  formatMoney,
  getNumber,
  getColumnLabelsForYear as getLabelsHelper,
  // Inflows
  getCashReceivedFromOperations as getCashReceivedFromOperationsUtil,
  getCashReceivedFromOperationsYear as getCashReceivedFromOperationsYearUtil,
  getAccountsReceivableReceipts as getAccountsReceivableReceiptsUtil,
  getAccountsReceivableReceiptsYear as getAccountsReceivableReceiptsYearUtil,
  getOtherOperatingReceipts as getOtherOperatingReceiptsUtil,
  getOtherOperatingReceiptsYear as getOtherOperatingReceiptsYearUtil,
  getInterestReceived as getInterestReceivedUtil,
  getInterestReceivedYear as getInterestReceivedYearUtil,
  getLongTermLoanInflow as getLongTermLoanInflowUtil,
  getLongTermLoanInflowYear as getLongTermLoanInflowYearUtil,
  getTotalCashInflow as getTotalCashInflowUtil,
  getTotalCashInflowYear as getTotalCashInflowYearUtil,
  // Outflows
  getRoomsSalariesPayments as getRoomsSalariesPaymentsUtil,
  getRoomsSalariesPaymentsYear as getRoomsSalariesPaymentsYearUtil,
  getRoomsBonusPayments as getRoomsBonusPaymentsUtil,
  getRoomsBonusPaymentsYear as getRoomsBonusPaymentsYearUtil,
  getRoomsPayrollRelatedPayments as getRoomsPayrollRelatedPaymentsUtil,
  getRoomsPayrollRelatedPaymentsYear as getRoomsPayrollRelatedPaymentsYearUtil,
  getRoomsExpensesPayments as getRoomsExpensesPaymentsUtil,
  getRoomsExpensesPaymentsYear as getRoomsExpensesPaymentsYearUtil,
  getFnbCostOfSales as getFnbCostOfSalesUtil,
  getFnbCostOfSalesYear as getFnbCostOfSalesYearUtil,
  getFnbSalariesPayments as getFnbSalariesPaymentsUtil,
  getFnbSalariesPaymentsYear as getFnbSalariesPaymentsYearUtil,
  getFnbBonusPayments as getFnbBonusPaymentsUtil,
  getFnbBonusPaymentsYear as getFnbBonusPaymentsYearUtil,
  getFnbPayrollRelatedPayments as getFnbPayrollRelatedPaymentsUtil,
  getFnbPayrollRelatedPaymentsYear as getFnbPayrollRelatedPaymentsYearUtil,
  getFnbExpensesPayments as getFnbExpensesPaymentsUtil,
  getFnbExpensesPaymentsYear as getFnbExpensesPaymentsYearUtil,
  getOodCostPayments as getOodCostPaymentsUtil,
  getOodCostPaymentsYear as getOodCostPaymentsYearUtil,
  getOodSalariesPayments as getOodSalariesPaymentsUtil,
  getOodSalariesPaymentsYear as getOodSalariesPaymentsYearUtil,
  getOodBonusPayments as getOodBonusPaymentsUtil,
  getOodBonusPaymentsYear as getOodBonusPaymentsYearUtil,
  getOodPayrollRelatedPayments as getOodPayrollRelatedPaymentsUtil,
  getOodPayrollRelatedPaymentsYear as getOodPayrollRelatedPaymentsYearUtil,
  getOodExpensesPayments as getOodExpensesPaymentsUtil,
  getOodExpensesPaymentsYear as getOodExpensesPaymentsYearUtil,
  getAgSalariesPayments as getAgSalariesPaymentsUtil,
  getAgSalariesPaymentsYear as getAgSalariesPaymentsYearUtil,
  getAgBonusPayments as getAgBonusPaymentsUtil,
  getAgBonusPaymentsYear as getAgBonusPaymentsYearUtil,
  getAgPayrollRelatedPayments as getAgPayrollRelatedPaymentsUtil,
  getAgPayrollRelatedPaymentsYear as getAgPayrollRelatedPaymentsYearUtil,
  getAgExpensesPayments as getAgExpensesPaymentsUtil,
  getAgExpensesPaymentsYear as getAgExpensesPaymentsYearUtil,
  getItSalariesPayments as getItSalariesPaymentsUtil,
  getItSalariesPaymentsYear as getItSalariesPaymentsYearUtil,
  getItBonusPayments as getItBonusPaymentsUtil,
  getItBonusPaymentsYear as getItBonusPaymentsYearUtil,
  getItPayrollRelatedPayments as getItPayrollRelatedPaymentsUtil,
  getItPayrollRelatedPaymentsYear as getItPayrollRelatedPaymentsYearUtil,
  getItCostPayments as getItCostPaymentsUtil,
  getItCostPaymentsYear as getItCostPaymentsYearUtil,
  getItExpensesPayments as getItExpensesPaymentsUtil,
  getItExpensesPaymentsYear as getItExpensesPaymentsYearUtil,
  getSmSalariesPayments as getSmSalariesPaymentsUtil,
  getSmSalariesPaymentsYear as getSmSalariesPaymentsYearUtil,
  getSmBonusPayments as getSmBonusPaymentsUtil,
  getSmBonusPaymentsYear as getSmBonusPaymentsYearUtil,
  getSmPayrollRelatedPayments as getSmPayrollRelatedPaymentsUtil,
  getSmPayrollRelatedPaymentsYear as getSmPayrollRelatedPaymentsYearUtil,
  getSmExpensesPayments as getSmExpensesPaymentsUtil,
  getSmExpensesPaymentsYear as getSmExpensesPaymentsYearUtil,
  getPomSalariesPayments as getPomSalariesPaymentsUtil,
  getPomSalariesPaymentsYear as getPomSalariesPaymentsYearUtil,
  getPomBonusPayments as getPomBonusPaymentsUtil,
  getPomBonusPaymentsYear as getPomBonusPaymentsYearUtil,
  getPomPayrollRelatedPayments as getPomPayrollRelatedPaymentsUtil,
  getPomPayrollRelatedPaymentsYear as getPomPayrollRelatedPaymentsYearUtil,
  getPomExpensesPayments as getPomExpensesPaymentsUtil,
  getPomExpensesPaymentsYear as getPomExpensesPaymentsYearUtil,
  getUtilitiesPayments as getUtilitiesPaymentsUtil,
  getUtilitiesPaymentsYear as getUtilitiesPaymentsYearUtil,
  getBaseFeePayments as getBaseFeePaymentsUtil,
  getBaseFeePaymentsYear as getBaseFeePaymentsYearUtil,
  getIncentivePayments as getIncentivePaymentsUtil,
  getIncentivePaymentsYear as getIncentivePaymentsYearUtil,
  getPropertyTaxesPayments as getPropertyTaxesPaymentsUtil,
  getPropertyTaxesPaymentsYear as getPropertyTaxesPaymentsYearUtil,
  getInsurancePayments as getInsurancePaymentsUtil,
  getInsurancePaymentsYear as getInsurancePaymentsYearUtil,
  getReplacementReservePayments as getReplacementReservePaymentsUtil,
  getReplacementReservePaymentsYear as getReplacementReservePaymentsYearUtil,
  getProjectCostPayments as getProjectCostPaymentsUtil,
  getProjectCostPaymentsYear as getProjectCostPaymentsYearUtil,
  getLoanPrincipalRepayment as getLoanPrincipalRepaymentUtil,
  getLoanPrincipalRepaymentYear as getLoanPrincipalRepaymentYearUtil,
  getLoanInterestPayment as getLoanInterestPaymentUtil,
  getLoanInterestPaymentYear as getLoanInterestPaymentYearUtil,
  getTotalCashOutflow as getTotalCashOutflowUtil,
  getTotalCashOutflowYear as getTotalCashOutflowYearUtil,
  getNetInvestingActivities as getNetInvestingActivitiesUtil,
  getNetInvestingActivitiesYear as getNetInvestingActivitiesYearUtil,
  getNetCashFlow as getNetCashFlowUtil,
  getNetCashFlowYear as getNetCashFlowYearUtil,
  getOpeningBalance as getOpeningBalanceUtil,
  getOpeningBalanceYear as getOpeningBalanceYearUtil,
  getClosingBalance as getClosingBalanceUtil,
  getClosingBalanceYear as getClosingBalanceYearUtil
} from './utility/index.js';

// Props
const props = defineProps({
  visibleYears: {
    type: Array,
    required: true
  }
});

// Store and cache
const yearSettingsStore = useYearSettingsStore();
const { advancedModes } = storeToRefs(yearSettingsStore);
const calculationCache = useCalculationCache();

// Computed properties
const projectName = computed(() => selectedProject.value?.project_name || 'Project Name');

// UI helpers
function toggleCollapse(year) {
  yearSettingsStore.toggleCollapse(year);
}
function isYearCollapsed(year) {
  return yearSettingsStore.isYearCollapsed(year);
}
function getColumnLabelsForYear(year) {
  return getLabelsHelper(year, advancedModes.value);
}

// INFLOW wrappers
function getCashReceivedFromOperations(year, label) {
  return getCashReceivedFromOperationsUtil(calculationCache, projectName.value, year, label);
}
function getCashReceivedFromOperationsYear(year) {
  return getCashReceivedFromOperationsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAccountsReceivableReceipts(year, label) {
  return getAccountsReceivableReceiptsUtil(calculationCache, projectName.value, year, label);
}
function getAccountsReceivableReceiptsYear(year) {
  return getAccountsReceivableReceiptsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOtherOperatingReceipts(year, label) {
  return getOtherOperatingReceiptsUtil(calculationCache, projectName.value, year, label);
}
function getOtherOperatingReceiptsYear(year) {
  return getOtherOperatingReceiptsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getInterestReceived(year, label) {
  return getInterestReceivedUtil(calculationCache, projectName.value, year, label);
}
function getInterestReceivedYear(year) {
  return getInterestReceivedYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getLongTermLoanInflow(year, label) {
  return getLongTermLoanInflowUtil(calculationCache, projectName.value, year, label);
}
function getLongTermLoanInflowYear(year) {
  return getLongTermLoanInflowYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalCashInflow(year, label) {
  return getTotalCashInflowUtil(calculationCache, projectName.value, year, label);
}
function getTotalCashInflowYear(year) {
  return getTotalCashInflowYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

// OUTFLOW wrappers
function getRoomsSalariesPayments(year, label) {
  return getRoomsSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getRoomsSalariesPaymentsYear(year) {
  return getRoomsSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getRoomsBonusPayments(year, label) {
  return getRoomsBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getRoomsBonusPaymentsYear(year) {
  return getRoomsBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getRoomsPayrollRelatedPayments(year, label) {
  return getRoomsPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getRoomsPayrollRelatedPaymentsYear(year) {
  return getRoomsPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getRoomsExpensesPayments(year, label) {
  return getRoomsExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getRoomsExpensesPaymentsYear(year) {
  return getRoomsExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getFnbCostOfSales(year, label) {
  return getFnbCostOfSalesUtil(calculationCache, projectName.value, year, label);
}
function getFnbCostOfSalesYear(year) {
  return getFnbCostOfSalesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getFnbSalariesPayments(year, label) {
  return getFnbSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getFnbSalariesPaymentsYear(year) {
  return getFnbSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getFnbBonusPayments(year, label) {
  return getFnbBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getFnbBonusPaymentsYear(year) {
  return getFnbBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getFnbPayrollRelatedPayments(year, label) {
  return getFnbPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getFnbPayrollRelatedPaymentsYear(year) {
  return getFnbPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getFnbExpensesPayments(year, label) {
  return getFnbExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getFnbExpensesPaymentsYear(year) {
  return getFnbExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOodCostPayments(year, label) {
  return getOodCostPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getOodCostPaymentsYear(year) {
  return getOodCostPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOodSalariesPayments(year, label) {
  return getOodSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getOodSalariesPaymentsYear(year) {
  return getOodSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOodBonusPayments(year, label) {
  return getOodBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getOodBonusPaymentsYear(year) {
  return getOodBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOodPayrollRelatedPayments(year, label) {
  return getOodPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getOodPayrollRelatedPaymentsYear(year) {
  return getOodPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getOodExpensesPayments(year, label) {
  return getOodExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getOodExpensesPaymentsYear(year) {
  return getOodExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAgSalariesPayments(year, label) {
  return getAgSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getAgSalariesPaymentsYear(year) {
  return getAgSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAgBonusPayments(year, label) {
  return getAgBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getAgBonusPaymentsYear(year) {
  return getAgBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAgPayrollRelatedPayments(year, label) {
  return getAgPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getAgPayrollRelatedPaymentsYear(year) {
  return getAgPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAgExpensesPayments(year, label) {
  return getAgExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getAgExpensesPaymentsYear(year) {
  return getAgExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getItSalariesPayments(year, label) {
  return getItSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getItSalariesPaymentsYear(year) {
  return getItSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getItBonusPayments(year, label) {
  return getItBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getItBonusPaymentsYear(year) {
  return getItBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getItPayrollRelatedPayments(year, label) {
  return getItPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getItPayrollRelatedPaymentsYear(year) {
  return getItPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getItCostPayments(year, label) {
  return getItCostPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getItCostPaymentsYear(year) {
  return getItCostPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getItExpensesPayments(year, label) {
  return getItExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getItExpensesPaymentsYear(year) {
  return getItExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSmSalariesPayments(year, label) {
  return getSmSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getSmSalariesPaymentsYear(year) {
  return getSmSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSmBonusPayments(year, label) {
  return getSmBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getSmBonusPaymentsYear(year) {
  return getSmBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSmPayrollRelatedPayments(year, label) {
  return getSmPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getSmPayrollRelatedPaymentsYear(year) {
  return getSmPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSmExpensesPayments(year, label) {
  return getSmExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getSmExpensesPaymentsYear(year) {
  return getSmExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPomSalariesPayments(year, label) {
  return getPomSalariesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getPomSalariesPaymentsYear(year) {
  return getPomSalariesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPomBonusPayments(year, label) {
  return getPomBonusPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getPomBonusPaymentsYear(year) {
  return getPomBonusPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPomPayrollRelatedPayments(year, label) {
  return getPomPayrollRelatedPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getPomPayrollRelatedPaymentsYear(year) {
  return getPomPayrollRelatedPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPomExpensesPayments(year, label) {
  return getPomExpensesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getPomExpensesPaymentsYear(year) {
  return getPomExpensesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getUtilitiesPayments(year, label) {
  return getUtilitiesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getUtilitiesPaymentsYear(year) {
  return getUtilitiesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getBaseFeePayments(year, label) {
  return getBaseFeePaymentsUtil(calculationCache, projectName.value, year, label);
}
function getBaseFeePaymentsYear(year) {
  return getBaseFeePaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getIncentivePayments(year, label) {
  return getIncentivePaymentsUtil(calculationCache, projectName.value, year, label);
}
function getIncentivePaymentsYear(year) {
  return getIncentivePaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPropertyTaxesPayments(year, label) {
  return getPropertyTaxesPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getPropertyTaxesPaymentsYear(year) {
  return getPropertyTaxesPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getInsurancePayments(year, label) {
  return getInsurancePaymentsUtil(calculationCache, projectName.value, year, label);
}
function getInsurancePaymentsYear(year) {
  return getInsurancePaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getReplacementReservePayments(year, label) {
  return getReplacementReservePaymentsUtil(calculationCache, projectName.value, year, label);
}
function getReplacementReservePaymentsYear(year) {
  return getReplacementReservePaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getProjectCostPayments(year, label) {
  return getProjectCostPaymentsUtil(calculationCache, projectName.value, year, label);
}
function getProjectCostPaymentsYear(year) {
  return getProjectCostPaymentsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getLoanPrincipalRepayment(year, label) {
  return getLoanPrincipalRepaymentUtil(calculationCache, projectName.value, year, label);
}
function getLoanPrincipalRepaymentYear(year) {
  return getLoanPrincipalRepaymentYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getLoanInterestPayment(year, label) {
  return getLoanInterestPaymentUtil(calculationCache, projectName.value, year, label);
}
function getLoanInterestPaymentYear(year) {
  return getLoanInterestPaymentYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

// Summary functions
function getNetInvestingActivities(year, label) {
  return getNetInvestingActivitiesUtil(calculationCache, projectName.value, year, label);
}
function getNetInvestingActivitiesYear(year) {
  return getNetInvestingActivitiesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getNetCashFlow(year, label) {
  return getNetCashFlowUtil(calculationCache, projectName.value, year, label, getTotalCashInflowUtil);
}
function getNetCashFlowYear(year) {
  return getNetCashFlowYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear, getTotalCashInflowUtil);
}
function getOpeningBalance(year, label) {
  return getOpeningBalanceUtil(calculationCache, projectName.value, year, label);
}
function getOpeningBalanceYear(year) {
  return getOpeningBalanceYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getClosingBalance(year, label) {
  return getClosingBalanceUtil(calculationCache, projectName.value, year, label, getTotalCashInflowUtil);
}
function getClosingBalanceYear(year) {
  return getClosingBalanceYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear, getTotalCashInflowUtil);
}
</script>

<style scoped>
/* Component-specific styles, if any */
</style>
