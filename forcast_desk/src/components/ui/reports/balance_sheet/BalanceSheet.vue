<template>
  <div class="bg-white rounded-lg border border-teal-300 dark:border-teal-700 shadow-sm overflow-hidden">
    <!-- Table Container -->
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
            <!-- Project Name Header Row -->
            <tr class="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <Building2 class="w-6 h-6 text-teal-200" />
                  <h1 class="text-3xl font-bold tracking-tight">{{ projectName }}</h1>
                </div>
              </td>
            </tr>

            <!-- Balance Sheet Header Row -->
            <tr class="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <h2 class="text-xl font-semibold tracking-wide">Balance Sheet</h2>
                </div>
              </td>
            </tr>

            <!-- Year headers -->
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-teal-400 font-semibold text-sm min-w-[200px]">
                <div class="flex items-center gap-1">
                  Details
                </div>
              </th>
              <th
                v-for="year in visibleYears"
                :key="'header-' + year"
                :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1"
                class="px-2 py-2 text-center border-x-2 border-white cursor-pointer select-none hover:bg-teal-700 transition-all duration-200 group text-sm"
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
            <tr class="bg-teal-500 dark:bg-teal-900/20 text-xs text-white dark:text-gray-200">
              <template v-for="year in visibleYears" :key="'months-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <th
                    v-for="label in getColumnLabelsForYear(year)"
                    :key="year + '-' + label"
                    class="px-2 py-1 text-center border border-teal-300 min-w-[100px] font-medium"
                  >
                    {{ label }}
                  </th>
                  <th class="px-2 py-1 text-center border border-teal-300 min-w-[110px] font-semibold">
                    <div class="flex items-center justify-center gap-1">
                      <BookOpen class="w-2 h-2" />
                      Total
                    </div>
                  </th>
                </template>
                <template v-else>
                  <th class="px-2 py-1 text-center border border-teal-300 min-w-[110px] font-semibold">
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

            <!-- ASSETS Section Header -->
            <tr class="bg-teal-800 border-b-2 border-teal-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  ASSETS
                </div>
              </td>
            </tr>

            <!-- Tangible Assets Sub-Header -->
            <tr class="bg-teal-700 border-b-2 border-teal-800">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-2 font-semibold text-white text-left">
                <div class="flex items-center gap-2">
                  Tangible Assets
                </div>
              </td>
            </tr>

            <!-- Assets Cost -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Assets Cost</td>
              <template v-for="year in visibleYears" :key="'assets-cost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'assets-cost-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAssetsCost(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAssetsCostYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAssetsCostYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Depreciation -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Depreciation</td>
              <template v-for="year in visibleYears" :key="'depreciation-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'depreciation-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getDepreciation(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getDepreciationYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getDepreciationYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Net Book Value -->
            <tr class="bg-teal-100 border-b-2 border-teal-300">
              <td class="px-3 py-2 font-bold border-r border-teal-300">Net Book Value</td>
              <template v-for="year in visibleYears" :key="'nbv-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'nbv-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-300 font-semibold">
                    <span class="font-mono text-xs">{{ formatMoney(getNetBookValue(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-300 font-bold bg-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNetBookValueYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-300 font-bold bg-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNetBookValueYear(year)) }}</span>
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

            <!-- Current Assets Section Header -->
            <tr class="bg-teal-800 border-b-2 border-teal-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  CURRENT ASSETS
                </div>
              </td>
            </tr>

            <!-- Account Receivables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Account receivables</td>
              <template v-for="year in visibleYears" :key="'receivables-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'receivables-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountReceivables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountReceivablesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getAccountReceivablesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Cash & Bank -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Cash & Bank</td>
              <template v-for="year in visibleYears" :key="'cash-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'cash-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getCashAndBank(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getCashAndBankYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getCashAndBankYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Current Assets -->
            <tr class="bg-teal-600 border-b-2 border-teal-700">
              <td class="px-3 py-2 font-bold border-r border-teal-700 text-white">Total Current Assets</td>
              <template v-for="year in visibleYears" :key="'total-current-assets-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-current-assets-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentAssets(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentAssetsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentAssetsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>


            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-2-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-2-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Current Liabilities Section Header -->
            <tr class="bg-teal-800 border-b-2 border-teal-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  CURRENT LIABILITIES
                </div>
              </td>
            </tr>

            <!-- Rooms Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Rooms Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'roomssalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'roomssalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Rooms Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'roomsbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'roomsbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Rooms Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'roomspayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'roomspayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Rooms Expenses Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Rooms Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'roomsexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'roomsexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getRoomsExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Cost Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">F&B Cost Payables</td>
              <template v-for="year in visibleYears" :key="'fnbcost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnbcost-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbCostPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">F&B Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'fnbsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnbsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">F&B Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'fnbbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnbbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&B Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">F&B Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'fnbpayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnbpayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- F&Bs Expenses Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">F&Bs Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'fnbexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'fnbexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getFnbExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Cost Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">OOD Cost Payables</td>
              <template v-for="year in visibleYears" :key="'oodcost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'oodcost-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodCostPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">OOD Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'oodsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'oodsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">OOD Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'oodbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'oodbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">OOD Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'oodpayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'oodpayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- OOD Expenses Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">OOD Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'oodexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'oodexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getOodExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">A&G Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'agsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'agsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">A&G Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'agbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'agbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">A&G Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'agpayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'agpayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- A&G Expenses Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">A&G Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'agexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'agexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getAgExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">IT Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'itsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'itsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">IT Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'itbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'itbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">IT Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'itpayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'itpayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Cost Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">IT Cost Payables</td>
              <template v-for="year in visibleYears" :key="'itcost-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'itcost-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItCostPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- IT Expenses Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">IT Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'itexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'itexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getItExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Net Salaries & Wages Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">S&M Net Salaries & Wages Payables</td>
              <template v-for="year in visibleYears" :key="'smsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'smsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Bonus Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">S&M Bonus Payables</td>
              <template v-for="year in visibleYears" :key="'smbonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'smbonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Payroll Related Payables -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">S&M Payroll Related Payables</td>
              <template v-for="year in visibleYears" :key="'smpayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'smpayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- S&M Expenses Payables -->
            <tr class="bg-teal-50 border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">S&M Expenses Payables</td>
              <template v-for="year in visibleYears" :key="'smexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'smexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSmExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Net Salaries & Wages -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">POM Net Salaries & Wages</td>
              <template v-for="year in visibleYears" :key="'pomsalaries-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pomsalaries-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomSalariesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Bonus -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">POM Bonus</td>
              <template v-for="year in visibleYears" :key="'pombonus-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pombonus-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomBonusPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Payroll Related -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">POM Payroll Related</td>
              <template v-for="year in visibleYears" :key="'pompayrollrelated-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pompayrollrelated-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomPayrollRelatedPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- POM Expenses -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">POM Expenses</td>
              <template v-for="year in visibleYears" :key="'pomexpenses-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pomexpenses-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPomExpensesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Utilities Payments -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Utilities Payments</td>
              <template v-for="year in visibleYears" :key="'utilities-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'utilities-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getUtilitiesPayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Base Fee Payments -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Base Fee Payments</td>
              <template v-for="year in visibleYears" :key="'basefee-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'basefee-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getBaseFeePayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Incentive Payments -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Incentive Payments</td>
              <template v-for="year in visibleYears" :key="'incentive-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'incentive-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getIncentivePayables(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>


            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-3-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-3-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Total Current Liabilities -->
            <tr class="bg-teal-600 border-b-2 border-teal-700">
              <td class="px-3 py-2 font-bold border-r border-teal-700 text-white">Total Current Liabilities</td>
              <template v-for="year in visibleYears" :key="'total-liabilities-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-liabilities-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentLiabilities(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentLiabilitiesYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-700 font-bold bg-teal-600">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalCurrentLiabilitiesYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>


            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-4-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-4-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Working Capital -->
            <tr class="bg-teal-700 border-b-2 border-teal-800">
              <td class="px-3 py-2 font-bold border-r border-teal-800 text-white">Working Capital</td>
              <template v-for="year in visibleYears" :key="'working-capital-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'working-capital-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getWorkingCapital(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getWorkingCapitalYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getWorkingCapitalYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Total Assets -->
            <tr class="bg-teal-700 border-b-2 border-teal-800">
              <td class="px-3 py-2 font-bold border-r border-teal-800 text-white">Total Assets</td>
              <template v-for="year in visibleYears" :key="'total-assets-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'total-assets-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalAssets(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalAssetsYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-800 font-bold bg-teal-700">
                    <span class="font-mono text-xs text-white">{{ formatMoney(getTotalAssetsYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-5-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-5-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Long Term Loan Section -->
            <tr class="bg-teal-800 border-b-2 border-teal-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  LONG TERM LOAN
                </div>
              </td>
            </tr>

            <!-- Long Term Loan -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Long Term Loan</td>
              <template v-for="year in visibleYears" :key="'lt-loan-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'lt-loan-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoan(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoanYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getLongTermLoanYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Loan Facility -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Loan Facility</td>
              <template v-for="year in visibleYears" :key="'loan-facility-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'loan-facility-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanFacility(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Interest -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Interest</td>
              <template v-for="year in visibleYears" :key="'loan-interest-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'loan-interest-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getLoanInterest(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">0</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Empty Row -->
            <tr class="bg-white border-b border-gray-200">
              <td class="px-3 py-2 border-r border-gray-200"></td>
              <template v-for="year in visibleYears" :key="'empty-6-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'empty-6-' + year + '-' + label" class="px-2 py-1 border border-gray-200"></td>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 border border-gray-200"></td>
                </template>
              </template>
            </tr>

            <!-- Equity Section -->
            <tr class="bg-teal-800 border-b-2 border-teal-900">
              <td :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYear(year).length + 1), 0)" class="px-3 py-3 font-bold text-white text-left">
                <div class="flex items-center gap-2">
                  EQUITY
                </div>
              </td>
            </tr>

            <!-- Monthly Profit/(Loss) -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Monthly Profit/(Loss)</td>
              <template v-for="year in visibleYears" :key="'monthly-profit-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'monthly-profit-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getMonthlyProfit(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getMonthlyProfitYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getMonthlyProfitYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Profit for the Period -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Profit for the Period</td>
              <template v-for="year in visibleYears" :key="'profit-period-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'profit-period-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getProfitForPeriod(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getProfitForPeriodYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getProfitForPeriodYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Sweep/Transfer from Related Party -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Sweep/Transfer from Related Party</td>
              <template v-for="year in visibleYears" :key="'sweep-from-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sweep-from-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepFromRelatedParty(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepFromRelatedPartyYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepFromRelatedPartyYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Sweep/Transfer to Related Party -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Sweep/Transfer to Related Party</td>
              <template v-for="year in visibleYears" :key="'sweep-to-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'sweep-to-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepToRelatedParty(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepToRelatedPartyYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getSweepToRelatedPartyYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Pre-Opening Funding -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Pre-Opening Funding</td>
              <template v-for="year in visibleYears" :key="'pre-opening-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'pre-opening-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getPreOpeningFunding(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPreOpeningFundingYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getPreOpeningFundingYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Net Increase/decrease in cash -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Net Increase/decrease in cash</td>
              <template v-for="year in visibleYears" :key="'net-cash-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'net-cash-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getNetCashChange(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getNetCashChangeYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getNetCashChangeYear(year)) }}</span>
                  </td>
                </template>
              </template>
            </tr>

            <!-- Diff -->
            <tr class="bg-teal-50 border-b border-teal-200">
              <td class="px-3 py-2 font-medium border-r border-teal-200">Diff</td>
              <template v-for="year in visibleYears" :key="'diff-' + year">
                <template v-if="!isYearCollapsed(year)">
                  <td v-for="label in getColumnLabelsForYear(year)" :key="'diff-' + year + '-' + label" class="px-2 py-1 text-right border border-teal-200">
                    <span class="font-mono text-xs">{{ formatMoney(getDiff(year, label)) }}</span>
                  </td>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getDiffYear(year)) }}</span>
                  </td>
                </template>
                <template v-else>
                  <td class="px-2 py-1 text-right border border-teal-200 font-semibold bg-teal-100">
                    <span class="font-mono text-xs">{{ formatMoney(getDiffYear(year)) }}</span>
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
  formatNumber,
  getNumber,
  getColumnLabelsForYear as getLabelsHelper,
  // Assets
  getAssetsCost as getAssetsCostUtil,
  getAssetsCostYear as getAssetsCostYearUtil,
  getDepreciation as getDepreciationUtil,
  getDepreciationYear as getDepreciationYearUtil,
  getNetBookValue as getNetBookValueUtil,
  getNetBookValueYear as getNetBookValueYearUtil,
  getAccountReceivables as getAccountReceivablesUtil,
  getAccountReceivablesYear as getAccountReceivablesYearUtil,
  getCashAndBank as getCashAndBankUtil,
  getCashAndBankYear as getCashAndBankYearUtil,
  getTotalCurrentAssets as getTotalCurrentAssetsUtil,
  getTotalCurrentAssetsYear as getTotalCurrentAssetsYearUtil,
  getTotalAssets as getTotalAssetsUtil,
  getTotalAssetsYear as getTotalAssetsYearUtil,
  // Liabilities
  getRoomsSalariesPayables as getRoomsSalariesPayablesUtil,
  getRoomsBonusPayables as getRoomsBonusPayablesUtil,
  getRoomsPayrollRelatedPayables as getRoomsPayrollRelatedPayablesUtil,
  getRoomsExpensesPayables as getRoomsExpensesPayablesUtil,
  getFnbCostPayables as getFnbCostPayablesUtil,
  getFnbSalariesPayables as getFnbSalariesPayablesUtil,
  getFnbBonusPayables as getFnbBonusPayablesUtil,
  getFnbPayrollRelatedPayables as getFnbPayrollRelatedPayablesUtil,
  getFnbExpensesPayables as getFnbExpensesPayablesUtil,
  getOodCostPayables as getOodCostPayablesUtil,
  getOodSalariesPayables as getOodSalariesPayablesUtil,
  getOodBonusPayables as getOodBonusPayablesUtil,
  getOodPayrollRelatedPayables as getOodPayrollRelatedPayablesUtil,
  getOodExpensesPayables as getOodExpensesPayablesUtil,
  getAgSalariesPayables as getAgSalariesPayablesUtil,
  getAgBonusPayables as getAgBonusPayablesUtil,
  getAgPayrollRelatedPayables as getAgPayrollRelatedPayablesUtil,
  getAgExpensesPayables as getAgExpensesPayablesUtil,
  getItSalariesPayables as getItSalariesPayablesUtil,
  getItBonusPayables as getItBonusPayablesUtil,
  getItPayrollRelatedPayables as getItPayrollRelatedPayablesUtil,
  getItCostPayables as getItCostPayablesUtil,
  getItExpensesPayables as getItExpensesPayablesUtil,
  getSmSalariesPayables as getSmSalariesPayablesUtil,
  getSmBonusPayables as getSmBonusPayablesUtil,
  getSmPayrollRelatedPayables as getSmPayrollRelatedPayablesUtil,
  getSmExpensesPayables as getSmExpensesPayablesUtil,
  getPomSalariesPayables as getPomSalariesPayablesUtil,
  getPomBonusPayables as getPomBonusPayablesUtil,
  getPomPayrollRelatedPayables as getPomPayrollRelatedPayablesUtil,
  getPomExpensesPayables as getPomExpensesPayablesUtil,
  getUtilitiesPayables as getUtilitiesPayablesUtil,
  getBaseFeePayables as getBaseFeePayablesUtil,
  getIncentivePayables as getIncentivePayablesUtil,
  getTotalCurrentLiabilities as getTotalCurrentLiabilitiesUtil,
  getTotalCurrentLiabilitiesYear as getTotalCurrentLiabilitiesYearUtil,
  getWorkingCapital as getWorkingCapitalUtil,
  getWorkingCapitalYear as getWorkingCapitalYearUtil,
  getLongTermLoan as getLongTermLoanUtil,
  getLongTermLoanYear as getLongTermLoanYearUtil,
  getLoanFacility as getLoanFacilityUtil,
  getLoanInterest as getLoanInterestUtil,
  // Equity
  getMonthlyProfit as getMonthlyProfitUtil,
  getMonthlyProfitYear as getMonthlyProfitYearUtil,
  getProfitForPeriod as getProfitForPeriodUtil,
  getProfitForPeriodYear as getProfitForPeriodYearUtil,
  getSweepFromRelatedParty as getSweepFromRelatedPartyUtil,
  getSweepFromRelatedPartyYear as getSweepFromRelatedPartyYearUtil,
  getSweepToRelatedParty as getSweepToRelatedPartyUtil,
  getSweepToRelatedPartyYear as getSweepToRelatedPartyYearUtil,
  getPreOpeningFunding as getPreOpeningFundingUtil,
  getPreOpeningFundingYear as getPreOpeningFundingYearUtil,
  getNetCashChange as getNetCashChangeUtil,
  getNetCashChangeYear as getNetCashChangeYearUtil,
  getDiff as getDiffUtil,
  getDiffYear as getDiffYearUtil,
  getTotalEquity as getTotalEquityUtil,
  getTotalEquityYear as getTotalEquityYearUtil
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

// Assets wrappers
function getAssetsCost(year, label) {
  return getAssetsCostUtil(calculationCache, projectName.value, year, label);
}
function getAssetsCostYear(year) {
  return getAssetsCostYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getDepreciation(year, label) {
  return getDepreciationUtil(calculationCache, projectName.value, year, label);
}
function getDepreciationYear(year) {
  return getDepreciationYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getNetBookValue(year, label) {
  return getNetBookValueUtil(calculationCache, projectName.value, year, label);
}
function getNetBookValueYear(year) {
  return getNetBookValueYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getAccountReceivables(year, label) {
  return getAccountReceivablesUtil(calculationCache, projectName.value, year, label);
}
function getAccountReceivablesYear(year) {
  return getAccountReceivablesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getCashAndBank(year, label) {
  return getCashAndBankUtil(calculationCache, projectName.value, year, label);
}
function getCashAndBankYear(year) {
  return getCashAndBankYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalCurrentAssets(year, label) {
  return getTotalCurrentAssetsUtil(calculationCache, projectName.value, year, label);
}
function getTotalCurrentAssetsYear(year) {
  return getTotalCurrentAssetsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getTotalAssets(year, label) {
  return getTotalAssetsUtil(calculationCache, projectName.value, year, label, getColumnLabelsForYear);
}
function getTotalAssetsYear(year) {
  return getTotalAssetsYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}

// Liabilities wrappers - Rooms
function getRoomsSalariesPayables(year, label) {
  return getRoomsSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getRoomsBonusPayables(year, label) {
  return getRoomsBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getRoomsPayrollRelatedPayables(year, label) {
  return getRoomsPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getRoomsExpensesPayables(year, label) {
  return getRoomsExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - F&B
function getFnbCostPayables(year, label) {
  return getFnbCostPayablesUtil(calculationCache, projectName.value, year, label);
}
function getFnbSalariesPayables(year, label) {
  return getFnbSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getFnbBonusPayables(year, label) {
  return getFnbBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getFnbPayrollRelatedPayables(year, label) {
  return getFnbPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getFnbExpensesPayables(year, label) {
  return getFnbExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - OOD
function getOodCostPayables(year, label) {
  return getOodCostPayablesUtil(calculationCache, projectName.value, year, label);
}
function getOodSalariesPayables(year, label) {
  return getOodSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getOodBonusPayables(year, label) {
  return getOodBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getOodPayrollRelatedPayables(year, label) {
  return getOodPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getOodExpensesPayables(year, label) {
  return getOodExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - A&G
function getAgSalariesPayables(year, label) {
  return getAgSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getAgBonusPayables(year, label) {
  return getAgBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getAgPayrollRelatedPayables(year, label) {
  return getAgPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getAgExpensesPayables(year, label) {
  return getAgExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - IT
function getItSalariesPayables(year, label) {
  return getItSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getItBonusPayables(year, label) {
  return getItBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getItPayrollRelatedPayables(year, label) {
  return getItPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getItCostPayables(year, label) {
  return getItCostPayablesUtil(calculationCache, projectName.value, year, label);
}
function getItExpensesPayables(year, label) {
  return getItExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - S&M
function getSmSalariesPayables(year, label) {
  return getSmSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getSmBonusPayables(year, label) {
  return getSmBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getSmPayrollRelatedPayables(year, label) {
  return getSmPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getSmExpensesPayables(year, label) {
  return getSmExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - POM
function getPomSalariesPayables(year, label) {
  return getPomSalariesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getPomBonusPayables(year, label) {
  return getPomBonusPayablesUtil(calculationCache, projectName.value, year, label);
}
function getPomPayrollRelatedPayables(year, label) {
  return getPomPayrollRelatedPayablesUtil(calculationCache, projectName.value, year, label);
}
function getPomExpensesPayables(year, label) {
  return getPomExpensesPayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - Other
function getUtilitiesPayables(year, label) {
  return getUtilitiesPayablesUtil(calculationCache, projectName.value, year, label);
}
function getBaseFeePayables(year, label) {
  return getBaseFeePayablesUtil(calculationCache, projectName.value, year, label);
}
function getIncentivePayables(year, label) {
  return getIncentivePayablesUtil(calculationCache, projectName.value, year, label);
}

// Liabilities wrappers - Totals
function getTotalCurrentLiabilities(year, label) {
  return getTotalCurrentLiabilitiesUtil(calculationCache, projectName.value, year, label);
}
function getTotalCurrentLiabilitiesYear(year) {
  return getTotalCurrentLiabilitiesYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getWorkingCapital(year, label) {
  return getWorkingCapitalUtil(calculationCache, projectName.value, year, label, getTotalCurrentAssetsUtil);
}
function getWorkingCapitalYear(year) {
  return getWorkingCapitalYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear, getTotalCurrentAssetsYearUtil, getTotalCurrentLiabilitiesYearUtil);
}

// Loan wrappers
function getLongTermLoan(year, label) {
  return getLongTermLoanUtil(calculationCache, projectName.value, year, label);
}
function getLongTermLoanYear(year) {
  return getLongTermLoanYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getLoanFacility(year, label) {
  return getLoanFacilityUtil(calculationCache, projectName.value, year, label);
}
function getLoanInterest(year, label) {
  return getLoanInterestUtil(calculationCache, projectName.value, year, label);
}

// Equity wrappers
function getMonthlyProfit(year, label) {
  return getMonthlyProfitUtil(calculationCache, projectName.value, year, label);
}
function getMonthlyProfitYear(year) {
  return getMonthlyProfitYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getProfitForPeriod(year, label) {
  return getProfitForPeriodUtil(calculationCache, projectName.value, year, label);
}
function getProfitForPeriodYear(year) {
  return getProfitForPeriodYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSweepFromRelatedParty(year, label) {
  return getSweepFromRelatedPartyUtil(calculationCache, projectName.value, year, label);
}
function getSweepFromRelatedPartyYear(year) {
  return getSweepFromRelatedPartyYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getSweepToRelatedParty(year, label) {
  return getSweepToRelatedPartyUtil(calculationCache, projectName.value, year, label);
}
function getSweepToRelatedPartyYear(year) {
  return getSweepToRelatedPartyYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getPreOpeningFunding(year, label) {
  return getPreOpeningFundingUtil(calculationCache, projectName.value, year, label);
}
function getPreOpeningFundingYear(year) {
  return getPreOpeningFundingYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getNetCashChange(year, label) {
  return getNetCashChangeUtil(calculationCache, projectName.value, year, label);
}
function getNetCashChangeYear(year) {
  return getNetCashChangeYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
function getDiff(year, label) {
  return getDiffUtil(calculationCache, projectName.value, year, label);
}
function getDiffYear(year) {
  return getDiffYearUtil(calculationCache, projectName.value, year, getColumnLabelsForYear);
}
</script>

<style scoped>
/* Component-specific styles, if any */
</style>
