<template>
    <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <div class="min-w-full w-max">
          <table class="w-full">
            <!-- Table Header -->
            <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-blue-400 font-semibold text-sm">
                  <div class="flex items-center gap-1">
                    <FolderOpen class="w-3 h-3" />
                    Position
                  </div>
                </th>
                <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-blue-400 font-semibold text-sm">
                  <div class="flex items-center gap-1">
                    <FolderOpen class="w-3 h-3" />
                    Designation
                  </div>
                </th>
                <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-blue-400 font-semibold text-sm">
                  <div class="flex items-center gap-1">
                    <FolderOpen class="w-3 h-3" />
                    Salary
                  </div>
                </th>
                <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-blue-400 font-semibold text-sm">
                  <div class="flex items-center gap-1">
                    <FolderOpen class="w-3 h-3" />
                    Count
                  </div>
                </th>
                <!-- Medical Column -->
                <th v-if="hasMedicalData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Medical</span>
                  </div>
                </th>
                <!-- Uniforms Column -->
                <th v-if="hasUniformsData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Uniforms</span>
                  </div>
                </th>
                <!-- Employee Meal Column -->
                <th v-if="hasEmployeeMealData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Employee Meal</span>
                  </div>
                </th>
                <!-- Transport Column -->
                <th v-if="hasTransportData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Transport</span>
                  </div>
                </th>
                <!-- Telephone Column -->
                <th v-if="hasTelephoneData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Telephone</span>
                  </div>
                </th>
                <!-- Air Ticket Column -->
                <th v-if="hasAirTicketData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Air Ticket</span>
                  </div>
                </th>
                <!-- Other Column -->
                <th v-if="hasBenefitsOtherData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                  <div class="flex items-center justify-center gap-1">
                    <span class="font-semibold">Other</span>
                  </div>
                </th>
              </tr>
              <tr class="bg-blue-500/90 text-xs">
                <!-- Medical Monthly Sub-columns -->
                <template v-if="hasMedicalData">
                <th 
                  v-for="month in monthsList" 
                  :key="'medical-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Medical Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Uniforms Monthly Sub-columns -->
                <template v-if="hasUniformsData">
                <th 
                  v-for="month in monthsList" 
                  :key="'uniforms-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Uniforms Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Employee Meal Monthly Sub-columns -->
                <template v-if="hasEmployeeMealData">
                <th 
                  v-for="month in monthsList" 
                  :key="'employee-meal-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Employee Meal Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Transport Monthly Sub-columns -->
                <template v-if="hasTransportData">
                <th 
                  v-for="month in monthsList" 
                  :key="'transport-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Transport Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Telephone Monthly Sub-columns -->
                <template v-if="hasTelephoneData">
                <th 
                  v-for="month in monthsList" 
                  :key="'telephone-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Telephone Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Air Ticket Monthly Sub-columns -->
                <template v-if="hasAirTicketData">
                <th 
                  v-for="month in monthsList" 
                  :key="'air-ticket-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Air Ticket Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
                <!-- Other Monthly Sub-columns -->
                <template v-if="hasBenefitsOtherData">
                <th 
                  v-for="month in monthsList" 
                  :key="'other-' + month"
                  class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Other Total Sub-column -->
                <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                  Total
                </th>
                </template>
              </tr>
            </thead>
            <tbody class="text-gray-700 bg-white text-sm">
              <!-- Group by categories -->
              <template v-for="category in getUniqueCategories()" :key="category">
                <tr class="bg-blue-100 border-b-2 border-blue-300">
                  <td 
                    :colspan="4 + (hasMedicalData ? 13 : 0) + (hasUniformsData ? 13 : 0) + (hasEmployeeMealData ? 13 : 0) + (hasTransportData ? 13 : 0) + (hasTelephoneData ? 13 : 0) + (hasAirTicketData ? 13 : 0) + (hasBenefitsOtherData ? 13 : 0)" 
                    class="px-3 py-2 font-bold text-blue-800 text-left"
                  >
                    {{ category }}
                  </td>
                </tr>
                <!-- Group by Department Location within each category -->
                <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                  <!-- Department Location Subdivider -->
                  <tr class="bg-blue-50 border-b border-blue-200">
                    <td 
                      :colspan="4 + (hasMedicalData ? 13 : 0) + (hasUniformsData ? 13 : 0) + (hasEmployeeMealData ? 13 : 0) + (hasTransportData ? 13 : 0) + (hasTelephoneData ? 13 : 0) + (hasAirTicketData ? 13 : 0) + (hasBenefitsOtherData ? 13 : 0)" 
                      class="px-3 py-1.5 font-semibold text-blue-700 text-left text-sm"
                    >
                      {{ location }}
                    </td>
                  </tr>
                  <!-- Payroll rows for this location -->
                  <template v-for="row in getPayrollRowsForLocation(props.payrollRows, category, location)" :key="row.id">
              <tr class="border-b border-gray-200 hover:bg-blue-50 transition-all duration-200">
                      <!-- Position -->
                      <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                        {{ row.position }}
                      </td>
                      <!-- Designation -->
                <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                        {{ row.designation }}
                      </td>
                      <!-- Salary -->
                      <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                        {{ formatMoney(row.salary) }}
                      </td>
                      <!-- Count -->
                      <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                        {{ row.count }}
                      </td>
                      <!-- Medical Monthly Values -->
                      <template v-if="hasMedicalData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'medical-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyMedicalValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Medical Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalMedicalValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Uniforms Monthly Values -->
                      <template v-if="hasUniformsData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'uniforms-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyUniformsValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Uniforms Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalUniformsValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Employee Meal Monthly Values -->
                      <template v-if="hasEmployeeMealData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'employee-meal-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyEmployeeMealValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Employee Meal Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalEmployeeMealValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Transport Monthly Values -->
                      <template v-if="hasTransportData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'transport-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyTransportValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Transport Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalTransportValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Telephone Monthly Values -->
                      <template v-if="hasTelephoneData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'telephone-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyTelephoneValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Telephone Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalTelephoneValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Air Ticket Monthly Values -->
                      <template v-if="hasAirTicketData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'air-ticket-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyAirTicketValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Air Ticket Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalAirTicketValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                      <!-- Other Monthly Values -->
                      <template v-if="hasBenefitsOtherData">
                      <td 
                        v-for="month in monthsList" 
                        :key="'other-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-blue-700">{{ calculateMonthlyBenefitsOtherValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Other Total -->
                      <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-900">{{ calculateTotalBenefitsOtherValueLocal(row, visibleYears[0], monthsList) }}</span>
                      </td>
                      </template>
                    </tr>
                  </template>
                  
                  <!-- Sub-Total Management Row -->
                  <tr class="border-b border-gray-300 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                    <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-blue-300 text-blue-900">
                      <div class="flex items-center gap-2">
                        <CheckCircle class="w-4 h-4 text-blue-700" />
                        Sub-Total Management
                      </div>
                    </td>
                    <td class="px-3 py-2.5 text-right border-r border-blue-300">
                      <span class="font-mono text-sm font-semibold text-blue-900">{{ calculateSubTotalManagementCountLocal(category, location) }}</span>
                    </td>
                    <!-- Medical Monthly cells for subtotal -->
                    <template v-if="hasMedicalData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-medical-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementMedicalMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Medical Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementMedicalTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Uniforms Monthly cells for subtotal -->
                    <template v-if="hasUniformsData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-uniforms-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementUniformsMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Uniforms Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementUniformsTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Employee Meal Monthly cells for subtotal -->
                    <template v-if="hasEmployeeMealData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-employee-meal-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementEmployeeMealMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Employee Meal Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementEmployeeMealTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Transport Monthly cells for subtotal -->
                    <template v-if="hasTransportData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-transport-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTransportMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Transport Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTransportTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Telephone Monthly cells for subtotal -->
                    <template v-if="hasTelephoneData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-telephone-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTelephoneMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Telephone Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTelephoneTotalLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    </template>
                    <!-- Air Ticket Monthly cells for subtotal -->
                    <template v-if="hasAirTicketData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-air-ticket-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementAirTicketMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Air Ticket Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementAirTicketTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Other Monthly cells for subtotal -->
                    <template v-if="hasBenefitsOtherData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-mgmt-other-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementBenefitsOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementBenefitsOtherTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                  </tr>
                  
                  <!-- Sub-Total Non-Management Row -->
                  <tr class="border-b border-gray-300 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                    <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-blue-300 text-blue-900">
                      <div class="flex items-center gap-2">
                        <CheckCircle class="w-4 h-4 text-blue-700" />
                        Sub-Total Non-Management
                      </div>
                    </td>
                    <td class="px-3 py-2.5 text-right border-r border-blue-300">
                      <span class="font-mono text-sm font-semibold text-blue-900">{{ calculateSubTotalNonManagementCountLocal(category, location) }}</span>
                    </td>
                    <!-- Medical Monthly cells for subtotal -->
                    <template v-if="hasMedicalData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-medical-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementMedicalMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Medical Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementMedicalTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Uniforms Monthly cells for subtotal -->
                    <template v-if="hasUniformsData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-uniforms-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementUniformsMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Uniforms Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementUniformsTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Employee Meal Monthly cells for subtotal -->
                    <template v-if="hasEmployeeMealData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-employee-meal-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementEmployeeMealMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Employee Meal Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementEmployeeMealTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Transport Monthly cells for subtotal -->
                    <template v-if="hasTransportData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-transport-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTransportMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Transport Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTransportTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Telephone Monthly cells for subtotal -->
                    <template v-if="hasTelephoneData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-telephone-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTelephoneMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Telephone Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTelephoneTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Air Ticket Monthly cells for subtotal -->
                    <template v-if="hasAirTicketData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-air-ticket-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementAirTicketMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Air Ticket Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementAirTicketTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Other Monthly cells for subtotal -->
                    <template v-if="hasBenefitsOtherData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'subtotal-nonmgmt-other-' + month"
                      class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementBenefitsOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementBenefitsOtherTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                  </tr>
                  
                  <!-- Total Row -->
                  <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                    <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                      <div class="flex items-center gap-2">
                        <BarChart3 class="w-5 h-5 text-blue-700" />
                        Total
                      </div>
                    </td>
                    <td class="px-3 py-3 text-right border-r border-blue-300">
                      <span class="font-mono text-sm font-bold text-blue-900">{{ calculateLocationTotalCountLocal(category, location) }}</span>
                    </td>
                    <!-- Medical Monthly cells for total -->
                    <template v-if="hasMedicalData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-medical-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalMedicalMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Medical Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalMedicalTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Uniforms Monthly cells for total -->
                    <template v-if="hasUniformsData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-uniforms-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalUniformsMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Uniforms Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalUniformsTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Employee Meal Monthly cells for total -->
                    <template v-if="hasEmployeeMealData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-employee-meal-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalEmployeeMealMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Employee Meal Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalEmployeeMealTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Transport Monthly cells for total -->
                    <template v-if="hasTransportData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-transport-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTransportMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Transport Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTransportTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Telephone Monthly cells for total -->
                    <template v-if="hasTelephoneData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-telephone-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTelephoneMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Telephone Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTelephoneTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Air Ticket Monthly cells for total -->
                    <template v-if="hasAirTicketData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-air-ticket-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalAirTicketMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Air Ticket Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalAirTicketTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                    <!-- Other Monthly cells for total -->
                    <template v-if="hasBenefitsOtherData">
                    <td 
                      v-for="month in monthsList" 
                      :key="'total-other-' + month"
                      class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                    >
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalBenefitsOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for total -->
                    <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                      <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalBenefitsOtherTotalLocal(category, location, visibleYears[0], monthsList) }}</span>
                    </td>
                    </template>
                  </tr>
                </template>
              </template>
              
              <!-- 2 Empty Rows -->
              <tr class="h-4 bg-gradient-to-r from-blue-100 to-blue-200"></tr>
              <tr class="h-4 bg-gradient-to-r from-blue-100 to-blue-200"></tr>
              
              <!-- Total Hotel Row -->
              <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                  <div class="flex items-center gap-2">
                    <Building2 class="w-5 h-5 text-blue-700" />
                    Total Hotel
                  </div>
                </td>
                <td class="px-3 py-3 text-right border-r border-blue-300">
                  <span class="font-mono text-sm font-bold text-blue-900">{{ calculateHotelTotalCountLocal() }}</span>
                </td>
                <!-- Medical Monthly cells for hotel total -->
                <template v-if="hasMedicalData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-medical-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalMedicalMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Medical Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalMedicalTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Uniforms Monthly cells for hotel total -->
                <template v-if="hasUniformsData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-uniforms-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalUniformsMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Uniforms Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalUniformsTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Employee Meal Monthly cells for hotel total -->
                <template v-if="hasEmployeeMealData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-employee-meal-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalEmployeeMealMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Employee Meal Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalEmployeeMealTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Transport Monthly cells for hotel total -->
                <template v-if="hasTransportData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-transport-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTransportMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Transport Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTransportTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Telephone Monthly cells for hotel total -->
                <template v-if="hasTelephoneData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-telephone-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTelephoneMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Telephone Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTelephoneTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Air Ticket Monthly cells for hotel total -->
                <template v-if="hasAirTicketData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-air-ticket-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalAirTicketMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Air Ticket Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalAirTicketTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Other Monthly cells for hotel total -->
                <template v-if="hasBenefitsOtherData">
                <td 
                  v-for="month in monthsList" 
                  :key="'hotel-other-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalBenefitsOtherMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Other Total for hotel total -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalBenefitsOtherTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
              </tr>
              
              <!-- Employee/Room Ratio Row -->
              <tr class="border-b-2 border-blue-400 bg-gradient-to-r from-blue-100 to-blue-200 shadow-sm">
                <td :colspan="3" class="px-3 py-3 font-bold border-r border-blue-300 text-blue-900">
                  <div class="flex items-center gap-2">
                    <Users class="w-5 h-5 text-blue-700" />
                    Employee/Room Ratio
                  </div>
                </td>
                <td class="px-3 py-3 text-right border-r border-blue-300">
                  <span class="font-mono text-sm font-bold text-blue-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
                </td>
                <!-- Medical Monthly cells for ratio -->
                <template v-if="hasMedicalData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-medical-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioMedicalMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Medical Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioMedicalTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Uniforms Monthly cells for ratio -->
                <template v-if="hasUniformsData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-uniforms-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioUniformsMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Uniforms Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioUniformsTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Employee Meal Monthly cells for ratio -->
                <template v-if="hasEmployeeMealData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-employee-meal-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioEmployeeMealMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Employee Meal Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioEmployeeMealTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Transport Monthly cells for ratio -->
                <template v-if="hasTransportData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-transport-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTransportMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Transport Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTransportTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Telephone Monthly cells for ratio -->
                <template v-if="hasTelephoneData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-telephone-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTelephoneMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Telephone Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTelephoneTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Air Ticket Monthly cells for ratio -->
                <template v-if="hasAirTicketData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-air-ticket-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioAirTicketMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Air Ticket Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioAirTicketTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
                <!-- Other Monthly cells for ratio -->
                <template v-if="hasBenefitsOtherData">
                <td 
                  v-for="month in monthsList" 
                  :key="'ratio-other-' + month"
                  class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                >
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioBenefitsOtherMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Other Total for ratio -->
                <td class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                  <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioBenefitsOtherTotalLocal(visibleYears[0], monthsList) }}</span>
                </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { FolderOpen, CheckCircle, BarChart3, Building2, Users } from 'lucide-vue-next';
  import { getPayrollRowsForLocation } from '@/components/utility/payroll/payroll_data_utils.js';
  import { watch, computed } from 'vue';
  // Import the standardized calculation functions from payroll utility
  import {
    calculateSubTotalManagementCount,
    calculateSubTotalNonManagementCount,
    calculateLocationTotalCount,
    calculateHotelTotal,
    calculateEmployeeRoomRatio
  } from '@/components/utility/payroll/payroll_calculations.js';

  // Import the new monthly calculation functions for employee benefits
  import {
    calculateMonthlyMedicalValue,
    calculateMonthlyUniformsValue,
    calculateMonthlyEmployeeMealValue,
    calculateMonthlyTransportValue,
    calculateMonthlyTelephoneValue,
    calculateMonthlyAirTicketValue,
    calculateMonthlyBenefitsOtherValue,
    calculateTotalMedicalValue,
    calculateTotalUniformsValue,
    calculateTotalEmployeeMealValue,
    calculateTotalTransportValue,
    calculateTotalTelephoneValue,
    calculateTotalAirTicketValue,
    calculateTotalBenefitsOtherValue
  } from '@/components/utility/payroll_related/calculation_handlers.js';

  // Import calculation cache for performance optimization
  import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
  import { selectedProject } from '@/components/utility/dashboard/projectService.js';

  // Props
  const props = defineProps({
    payrollRows: {
      type: Array,
      default: () => []
    },
    payrollData: {
      type: Object,
      default: () => ({})
    },
    payrollRelatedData: {
      type: Object,
      default: () => ({})
    },
    visibleYears: {
      type: Array,
      default: () => []
    },
    months: {
      type: Array,
      default: () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    }
  });

  // Computed property to ensure months are reactive
  const monthsList = computed(() => props.months || ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);

  // Initialize calculation cache and project service
  const calculationCache = useCalculationCache();

  // Computed properties to check if columns have data
  const hasMedicalData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'medical');
      return value && value > 0;
    });
  });

  const hasUniformsData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'uniforms');
      return value && value > 0;
    });
  });

  const hasEmployeeMealData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'employee_meal');
      return value && value > 0;
    });
  });

  const hasTransportData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'transport');
      return value && value > 0;
    });
  });

  const hasTelephoneData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'telephone');
      return value && value > 0;
    });
  });

  const hasAirTicketData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'air_ticket');
      return value && value > 0;
    });
  });

  const hasBenefitsOtherData = computed(() => {
    return props.payrollRows.some(row => {
      const value = getEmployeeBenefitsValue(row, 'benefits_other');
      return value && value > 0;
    });
  });

  // Debug props
  watch(() => props, (newProps) => {
   //  // console.log('EmployeeBenefitsTable props updated:', {
    //   payrollRowsLength: newProps.payrollRows?.length,
    //   payrollData: newProps.payrollData,
    //   payrollRelatedData: newProps.payrollRelatedData,
    //   visibleYears: newProps.visibleYears,
    //   months: newProps.months
    // });
  }, { deep: true, immediate: true });

  // Helper function to format money
  function formatMoney(value) {
    if (value === null || value === undefined || isNaN(value)) {
      return '0.00';
    }
    const num = parseFloat(value);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Helper functions to get unique categories and locations
  function getUniqueCategories() {
    const categories = new Set();
    props.payrollRows.forEach(row => {
      if (row.category) {
        categories.add(row.category);
      }
    });
    return Array.from(categories).sort();
  }

  function getUniqueLocationsForCategory(category) {
    const locations = new Set();
    props.payrollRows.forEach(row => {
      if (row.category === category && row.departmentLocation) {
        locations.add(row.departmentLocation);
      }
    });
    return Array.from(locations).sort();
  }

  // Local wrapper functions for calculations - using the same functions as Payroll_Related.vue
  function calculateSubTotalManagementCountLocal(category, location) {
    return calculateSubTotalManagementCount(props.payrollRows, category, location);
  }

  function calculateSubTotalNonManagementCountLocal(category, location) {
    return calculateSubTotalNonManagementCount(props.payrollRows, category, location);
  }

  function calculateLocationTotalCountLocal(category, location) {
    return calculateLocationTotalCount(props.payrollRows, category, location);
  }

  function calculateHotelTotalCountLocal() {
    // Defensive check for payrollRows
    if (!props.payrollRows || !Array.isArray(props.payrollRows)) {
      return 0;
    }
    
    return calculateHotelTotal(props.payrollRows);
  }

  function calculateEmployeeRoomRatioLocal() {
    // Defensive check for payrollRows
    if (!props.payrollRows || !Array.isArray(props.payrollRows)) {
      return 0;
    }
    
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    return calculateEmployeeRoomRatio(props.payrollRows, totalRooms);
  }

  // Helper function to get monthly count value (similar to Payroll_Related.vue)
  function getMonthlyCountValueLocal(rowId, year, month) {
   //  // console.log('Getting monthly count for:', { rowId, year, month, payrollData: props.payrollData }); 
    
    // Defensive check for payrollData - handle both ref and direct object
    const payrollDataValue = props.payrollData?.value || props.payrollData;
    if (!payrollDataValue) {
     //  // console.log('No payrollData available');
      return 0;
    }
    
    const row = props.payrollRows.find(r => r.id === rowId);
    if (!row) {
     //  // console.log('No row found for ID:', rowId);
      return 0;
    }
    
   //  // console.log('Found row:', row);
    
    // Check if there's an override for this specific month
    const countData = payrollDataValue[year]?.[rowId]?.['count'];
   //  // console.log('Count data for year/month:', countData);
    
    if (countData && typeof countData === 'object' && countData !== null && !Array.isArray(countData)) {
      const overrideValue = countData[month];
     //  // console.log('Override value for month', month, ':', overrideValue);
      if (overrideValue !== undefined && overrideValue !== null) {
        return overrideValue;
      }
    }
    
    // If no override exists, return the main count value (getter behavior)
    const mainCount = row.count || 0;
   //  // console.log('Using main count value:', mainCount);
    return mainCount;
  }

  // Helper function to get employee benefits values from payroll related data
  function getEmployeeBenefitsValue(row, field) {
    if (!props.visibleYears || props.visibleYears.length === 0) {
     //  // console.log('No visible years available');
      return 0;
    }
    
    const year = props.visibleYears[0];
   //  // console.log('Getting employee benefits value for:', { rowId: row.id, field, year, payrollRelatedData: props.payrollRelatedData });
    
    // Handle different data structures for payrollRelatedData
    let payrollRelatedDataValue = props.payrollRelatedData;
    
    // If it's a ref, get the value
    if (payrollRelatedDataValue?.value) {
      payrollRelatedDataValue = payrollRelatedDataValue.value;
    }
    
    // Try different data structures
    let yearData = payrollRelatedDataValue?.[year];
    
    if (!yearData) {
      // Try alternative structure
      yearData = payrollRelatedDataValue?.relatedData?.[year];
    }
    
    if (!yearData) {
     //  // console.log('No year data found for year:', year);
      return 0;
    }
    
   //  // console.log('Year data found:', yearData);
    
    // Map field names to the expected format
    const fieldMappings = {
      'medical': 'medical',
      'uniforms': 'uniforms',
      'employee_meal': 'employee_meal',
      'transport': 'transport',
      'telephone': 'telephone',
      'air_ticket': 'air_ticket',
      'benefits_other': 'other'
    };
    
    const mappedField = fieldMappings[field];
    if (!mappedField) {
     //  // console.log('No mapping found for field:', field);
      return 0;
    }
    
    // Try different data structures for employee benefits
    let employeeBenefitsData = yearData.employee_benefits?.[row.id];
    
    if (!employeeBenefitsData) {
      // Try alternative structure
      employeeBenefitsData = yearData[row.id]?.employee_benefits;
    }
    
    if (!employeeBenefitsData) {
      // Try direct access
      employeeBenefitsData = yearData[row.id];
    }
    
   //  // console.log('Employee benefits data for row:', row.id, employeeBenefitsData); 
    
    const value = employeeBenefitsData?.[mappedField] || 0;
   //  // console.log('Final value for field', field, ':', value);
    
    return value;
  }

  // Local wrapper functions for monthly employee benefits calculations
  function calculateMonthlyMedicalValueLocal(row, year, month) {
    const medicalBase = getEmployeeBenefitsValue(row, 'medical');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = medicalBase * monthlyCount;
   //  // console.log('Medical calculation:', { rowId: row.id, medicalBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyUniformsValueLocal(row, year, month) {
    const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = uniformsBase * monthlyCount;
   //  // console.log('Uniforms calculation:', { rowId: row.id, uniformsBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyEmployeeMealValueLocal(row, year, month) {
    const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = employeeMealBase * monthlyCount;
   //  // console.log('Employee meal calculation:', { rowId: row.id, employeeMealBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyTransportValueLocal(row, year, month) {
    const transportBase = getEmployeeBenefitsValue(row, 'transport');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = transportBase * monthlyCount;
   //  // console.log('Transport calculation:', { rowId: row.id, transportBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyTelephoneValueLocal(row, year, month) {
    const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = telephoneBase * monthlyCount;
   //  // console.log('Telephone calculation:', { rowId: row.id, telephoneBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyAirTicketValueLocal(row, year, month) {
    const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = airTicketBase * monthlyCount;
   //  // console.log('Air ticket calculation:', { rowId: row.id, airTicketBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateMonthlyBenefitsOtherValueLocal(row, year, month) {
    const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    const monthlyValue = benefitsOtherBase * monthlyCount;
   //  // console.log('Benefits other calculation:', { rowId: row.id, benefitsOtherBase, monthlyCount, monthlyValue });
    return formatMoney(monthlyValue);
  }

  function calculateTotalMedicalValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const medicalBase = getEmployeeBenefitsValue(row, 'medical');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = medicalBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalUniformsValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = uniformsBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalEmployeeMealValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = employeeMealBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalTransportValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const transportBase = getEmployeeBenefitsValue(row, 'transport');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = transportBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalTelephoneValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = telephoneBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalAirTicketValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = airTicketBase * totalCount;
    return formatMoney(totalValue);
  }

  function calculateTotalBenefitsOtherValueLocal(row, year, months) {
    const monthsToUse = months || monthsList.value;
    const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
    const totalCount = monthsToUse.reduce((sum, month) => {
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + monthlyCount;
    }, 0);
    const totalValue = benefitsOtherBase * totalCount;
    return formatMoney(totalValue);
  }

  // New local wrapper functions for Sub-Total Management calculations
  function calculateSubTotalManagementMedicalMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (medicalBase * monthlyCount);
    }, 0);
    
    // Cache medical management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | medical`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementUniformsMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (uniformsBase * monthlyCount);
    }, 0);
    
    // Cache uniforms management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | uniforms`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementEmployeeMealMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (employeeMealBase * monthlyCount);
    }, 0);
    
    // Cache employee meal management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | employee_meal`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementTransportMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (transportBase * monthlyCount);
    }, 0);
    
    // Cache transport management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | transport`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementTelephoneMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (telephoneBase * monthlyCount);
    }, 0);
    
    // Cache telephone management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | telephone`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementAirTicketMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (airTicketBase * monthlyCount);
    }, 0);
    
    // Cache air ticket management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | air_ticket`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementBenefitsOtherMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (benefitsOtherBase * monthlyCount);
    }, 0);
    
    // Cache other benefits management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | other_benefits`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementMedicalTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (medicalBase * totalCount);
    }, 0);
    
    // Cache medical management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | medical`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementUniformsTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (uniformsBase * totalCount);
    }, 0);
    
    // Cache uniforms management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | uniforms`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementEmployeeMealTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (employeeMealBase * totalCount);
    }, 0);
    
    // Cache employee meal management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | employee_meal`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementTransportTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (transportBase * totalCount);
    }, 0);
    
    // Cache transport management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | transport`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementTelephoneTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (telephoneBase * totalCount);
    }, 0);
    
    // Cache telephone management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | telephone`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementAirTicketTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (airTicketBase * totalCount);
    }, 0);
    
    // Cache air ticket management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | air_ticket`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalManagementBenefitsOtherTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (benefitsOtherBase * totalCount);
    }, 0);
    
    // Cache other benefits management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | other_benefits`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  // New local wrapper functions for Sub-Total Non-Management calculations
  function calculateSubTotalNonManagementMedicalMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (medicalBase * monthlyCount);
    }, 0);
    
    // Cache medical non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | medical`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementUniformsMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (uniformsBase * monthlyCount);
    }, 0);
    
    // Cache uniforms non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | uniforms`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementEmployeeMealMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (employeeMealBase * monthlyCount);
    }, 0);
    
    // Cache employee meal non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | employee_meal`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementTransportMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (transportBase * monthlyCount);
    }, 0);
    
    // Cache transport non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | transport`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementTelephoneMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (telephoneBase * monthlyCount);
    }, 0);
    
    // Cache telephone non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | telephone`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementAirTicketMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (airTicketBase * monthlyCount);
    }, 0);
    
    // Cache air ticket non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | air_ticket`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementBenefitsOtherMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (benefitsOtherBase * monthlyCount);
    }, 0);
    
    // Cache other benefits non-management subtotal monthly value (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | other_benefits`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementMedicalTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (medicalBase * totalCount);
    }, 0);
    
    // Cache medical non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | medical`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementUniformsTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (uniformsBase * totalCount);
    }, 0);
    
    // Cache uniforms non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | uniforms`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementEmployeeMealTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (employeeMealBase * totalCount);
    }, 0);
    
    // Cache employee meal non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | employee_meal`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementTransportTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (transportBase * totalCount);
    }, 0);
    
    // Cache transport non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | transport`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementTelephoneTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (telephoneBase * totalCount);
    }, 0);
    
    // Cache telephone non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | telephone`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementAirTicketTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (airTicketBase * totalCount);
    }, 0);
    
    // Cache air ticket non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | air_ticket`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  function calculateSubTotalNonManagementBenefitsOtherTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (benefitsOtherBase * totalCount);
    }, 0);
    
    // Cache other benefits non-management subtotal yearly total (> 0 only)
    try {
      const projectId = selectedProject.value?.project_name || 'default';
      if (totalValue > 0) {
        const rowCode = `category: ${category} | other_benefits`;
        calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
      }
    } catch (e) {
      // Silently handle caching errors
    }
    
    return formatMoney(totalValue);
  }

  // New local wrapper functions for Location Total calculations
  function calculateLocationTotalMedicalMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (medicalBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalUniformsMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (uniformsBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalEmployeeMealMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (employeeMealBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalTransportMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (transportBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalTelephoneMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (telephoneBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalAirTicketMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (airTicketBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalBenefitsOtherMonthlyLocal(category, location, year, month) {
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (benefitsOtherBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalMedicalTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (medicalBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalUniformsTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (uniformsBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalEmployeeMealTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (employeeMealBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalTransportTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (transportBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalTelephoneTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (telephoneBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalAirTicketTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (airTicketBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateLocationTotalBenefitsOtherTotalLocal(category, location, year, months) {
    const monthsToUse = months || monthsList.value;
    const rows = props.payrollRows.filter(row => row.category === category && row.departmentLocation === location);
    const totalValue = rows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (benefitsOtherBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  // New local wrapper functions for Hotel Total calculations
  function calculateHotelTotalMedicalMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (medicalBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalMedicalTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (medicalBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalUniformsMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (uniformsBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalUniformsTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (uniformsBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalEmployeeMealMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (employeeMealBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalEmployeeMealTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (employeeMealBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalTransportMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (transportBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalTransportTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (transportBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalTelephoneMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (telephoneBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalTelephoneTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (telephoneBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalAirTicketMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (airTicketBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalAirTicketTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (airTicketBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalBenefitsOtherMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (benefitsOtherBase * monthlyCount);
    }, 0);
    return formatMoney(totalValue);
  }

  function calculateHotelTotalBenefitsOtherTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (benefitsOtherBase * totalCount);
    }, 0);
    return formatMoney(totalValue);
  }

  // New local wrapper functions for Employee/Room Ratio calculations
  function calculateEmployeeRoomRatioMedicalMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (medicalBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioMedicalTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const medicalBase = getEmployeeBenefitsValue(row, 'medical');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (medicalBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioUniformsMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (uniformsBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioUniformsTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const uniformsBase = getEmployeeBenefitsValue(row, 'uniforms');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (uniformsBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioEmployeeMealMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (employeeMealBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioEmployeeMealTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const employeeMealBase = getEmployeeBenefitsValue(row, 'employee_meal');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (employeeMealBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioTransportMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (transportBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioTransportTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const transportBase = getEmployeeBenefitsValue(row, 'transport');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (transportBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioTelephoneMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (telephoneBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioTelephoneTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const telephoneBase = getEmployeeBenefitsValue(row, 'telephone');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (telephoneBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioAirTicketMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (airTicketBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioAirTicketTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const airTicketBase = getEmployeeBenefitsValue(row, 'air_ticket');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (airTicketBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioBenefitsOtherMonthlyLocal(year, month) {
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
      return sum + (benefitsOtherBase * monthlyCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }

  function calculateEmployeeRoomRatioBenefitsOtherTotalLocal(year, months) {
    const monthsToUse = months || monthsList.value;
    const totalValue = props.payrollRows.reduce((sum, row) => {
      const benefitsOtherBase = getEmployeeBenefitsValue(row, 'benefits_other');
      const totalCount = monthsToUse.reduce((monthSum, month) => {
        const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
        return monthSum + monthlyCount;
      }, 0);
      return sum + (benefitsOtherBase * totalCount);
    }, 0);
    const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
    const ratioValue = totalRooms > 0 ? totalValue / totalRooms : 0;
    return formatMoney(ratioValue);
  }
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style> 