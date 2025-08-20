<template>
  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <div class="min-w-full w-max">
        <table class="w-full">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white">
            <tr>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Position
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-left align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Designation
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Salary
                </div>
              </th>
              <th rowspan="2" class="px-3 py-2 text-center align-middle border-r border-yellow-400 font-semibold text-sm">
                <div class="flex items-center gap-1">
                  <FolderOpen class="w-3 h-3" />
                  Count
                </div>
              </th>
              <!-- Vacation Column -->
              <th v-if="hasVacationData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Vacation</span>
                </div>
              </th>
              <!-- Relocation Column -->
              <th v-if="hasRelocationData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Relocation</span>
                </div>
              </th>
              <!-- Severence & Indemnity Column -->
              <th v-if="hasSeverenceIndemnityData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Severence & Indemnity</span>
                </div>
              </th>
              <!-- Other Column -->
              <th v-if="hasOtherData" colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Other</span>
                </div>
              </th>
            </tr>
            <tr class="bg-yellow-500/90 text-xs">
              <!-- Vacation Monthly Sub-columns -->
              <template v-if="hasVacationData">
                <th 
                  v-for="month in months" 
                  :key="'vacation-' + month"
                  class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Vacation Total Sub-column -->
                <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                  Total
                </th>
              </template>
              <!-- Relocation Monthly Sub-columns -->
              <template v-if="hasRelocationData">
                <th 
                  v-for="month in months" 
                  :key="'relocation-' + month"
                  class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Relocation Total Sub-column -->
                <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                  Total
                </th>
              </template>
              <!-- Severence & Indemnity Monthly Sub-columns -->
              <template v-if="hasSeverenceIndemnityData">
                <th 
                  v-for="month in months" 
                  :key="'severence-indemnity-' + month"
                  class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Severence & Indemnity Total Sub-column -->
                <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                  Total
                </th>
              </template>
              <!-- Other Monthly Sub-columns -->
              <template v-if="hasOtherData">
                <th 
                  v-for="month in months" 
                  :key="'other-' + month"
                  class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
                >
                  {{ month }}
                </th>
                <!-- Other Total Sub-column -->
                <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                  Total
                </th>
              </template>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Group by categories -->
            <template v-for="category in getUniqueCategories()" :key="category">
              <tr class="bg-yellow-100 border-b-2 border-yellow-300">
                <td 
                  :colspan="4 + (hasVacationData ? 13 : 0) + (hasRelocationData ? 13 : 0) + (hasSeverenceIndemnityData ? 13 : 0) + (hasOtherData ? 13 : 0)" 
                  class="px-3 py-2 font-bold text-yellow-800 text-left"
                >
                  {{ category }}
                </td>
              </tr>
              <!-- Group by Department Location within each category -->
              <template v-for="location in getUniqueLocationsForCategory(category)" :key="'location-' + location">
                <!-- Department Location Subdivider -->
                <tr class="bg-yellow-50 border-b border-yellow-200">
                  <td 
                    :colspan="4 + (hasVacationData ? 13 : 0) + (hasRelocationData ? 13 : 0) + (hasSeverenceIndemnityData ? 13 : 0) + (hasOtherData ? 13 : 0)" 
                    class="px-3 py-1.5 font-semibold text-yellow-700 text-left text-sm"
                  >
                    {{ location }}
                  </td>
                </tr>
                <!-- Payroll rows for this location -->
                <template v-for="row in getPayrollRowsForLocation(props.payrollRows, category, location)" :key="row.id">
            <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-all duration-200">
                    <!-- Position -->
                    <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                      {{ row.position }}
                    </td>
                    <!-- Designation -->
              <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                      {{ row.designation }}
                    </td>
                    <!-- Salary -->
                    <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                      {{ formatMoney(row.salary) }}
                    </td>
                    <!-- Count -->
                    <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                      {{ row.count }}
                    </td>
                    <!-- Vacation Monthly Values -->
                    <template v-if="hasVacationData">
                      <td 
                        v-for="month in months" 
                        :key="'vacation-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-yellow-700">{{ calculateMonthlyVacationValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Vacation Total -->
                      <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                        <span class="font-mono text-xs text-yellow-900">{{ calculateTotalVacationValueLocal(row, visibleYears[0], months) }}</span>
                      </td>
                    </template>
                    <!-- Relocation Monthly Values -->
                    <template v-if="hasRelocationData">
                      <td 
                        v-for="month in months" 
                        :key="'relocation-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-yellow-700">{{ calculateMonthlyRelocationValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Relocation Total -->
                      <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                        <span class="font-mono text-xs text-yellow-900">{{ calculateTotalRelocationValueLocal(row, visibleYears[0], months) }}</span>
                      </td>
                    </template>
                    <!-- Severence & Indemnity Monthly Values -->
                    <template v-if="hasSeverenceIndemnityData">
                      <td 
                        v-for="month in months" 
                        :key="'severence-indemnity-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-yellow-700">{{ calculateMonthlySeverenceIndemnityValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Severence & Indemnity Total -->
                      <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                        <span class="font-mono text-xs text-yellow-900">{{ calculateTotalSeverenceIndemnityValueLocal(row, visibleYears[0], months) }}</span>
                      </td>
                    </template>
                    <!-- Other Monthly Values -->
                    <template v-if="hasOtherData">
                      <td 
                        v-for="month in months" 
                        :key="'other-value-' + month + '-' + row.id"
                        class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                      >
                        <span class="font-mono text-xs text-yellow-700">{{ calculateMonthlyOtherValueLocal(row, visibleYears[0], month) }}</span>
                      </td>
                      <!-- Other Total -->
                      <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                        <span class="font-mono text-xs text-yellow-900">{{ calculateTotalOtherValueLocal(row, visibleYears[0], months) }}</span>
                      </td>
                    </template>
                  </tr>
                </template>
                
                <!-- Sub-Total Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-yellow-700" />
                      Sub-Total Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-semibold text-yellow-900">{{ calculateSubTotalManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Vacation Monthly cells for subtotal -->
                  <template v-if="hasVacationData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-mgmt-vacation-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementVacationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Vacation Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementVacationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Relocation Monthly cells for subtotal -->
                  <template v-if="hasRelocationData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-mgmt-relocation-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementRelocationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Relocation Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementRelocationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Severence & Indemnity Monthly cells for subtotal -->
                  <template v-if="hasSeverenceIndemnityData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-mgmt-severence-indemnity-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementSeverenceIndemnityMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Severence & Indemnity Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementSeverenceIndemnityTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Other Monthly cells for subtotal -->
                  <template v-if="hasOtherData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-mgmt-other-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementOtherTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                </tr>
                
                <!-- Sub-Total Non-Management Row -->
                <tr class="border-b border-gray-300 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <CheckCircle class="w-4 h-4 text-yellow-700" />
                      Sub-Total Non-Management
                    </div>
                  </td>
                  <td class="px-3 py-2.5 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-semibold text-yellow-900">{{ calculateSubTotalNonManagementCountLocal(category, location) }}</span>
                  </td>
                  <!-- Vacation Monthly cells for subtotal -->
                  <template v-if="hasVacationData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-nonmgmt-vacation-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementVacationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Vacation Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementVacationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Relocation Monthly cells for subtotal -->
                  <template v-if="hasRelocationData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-nonmgmt-relocation-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementRelocationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Relocation Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementRelocationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Severence & Indemnity Monthly cells for subtotal -->
                  <template v-if="hasSeverenceIndemnityData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-nonmgmt-severence-indemnity-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementSeverenceIndemnityMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Severence & Indemnity Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementSeverenceIndemnityTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Other Monthly cells for subtotal -->
                  <template v-if="hasOtherData">
                    <td 
                      v-for="month in months" 
                      :key="'subtotal-nonmgmt-other-' + month"
                      class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for subtotal -->
                    <td class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementOtherTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                </tr>
                
                <!-- Total Row -->
                <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
                  <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                    <div class="flex items-center gap-2">
                      <BarChart3 class="w-5 h-5 text-yellow-700" />
                      Total
                    </div>
                  </td>
                  <td class="px-3 py-3 text-right border-r border-yellow-300">
                    <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateLocationTotalCountLocal(category, location) }}</span>
                  </td>
                  <!-- Vacation Monthly cells for total -->
                  <template v-if="hasVacationData">
                    <td 
                      v-for="month in months" 
                      :key="'total-vacation-' + month"
                      class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalVacationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Vacation Total for total -->
                    <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalVacationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Relocation Monthly cells for total -->
                  <template v-if="hasRelocationData">
                    <td 
                      v-for="month in months" 
                      :key="'total-relocation-' + month"
                      class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalRelocationMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Relocation Total for total -->
                    <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalRelocationTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Severence & Indemnity Monthly cells for total -->
                  <template v-if="hasSeverenceIndemnityData">
                    <td 
                      v-for="month in months" 
                      :key="'total-severence-indemnity-' + month"
                      class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalSeverenceIndemnityMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Severence & Indemnity Total for total -->
                    <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalSeverenceIndemnityTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                  <!-- Other Monthly cells for total -->
                  <template v-if="hasOtherData">
                    <td 
                      v-for="month in months" 
                      :key="'total-other-' + month"
                      class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                    >
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalOtherMonthlyLocal(category, location, visibleYears[0], month) }}</span>
                    </td>
                    <!-- Other Total for total -->
                    <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                      <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalOtherTotalLocal(category, location, visibleYears[0], months) }}</span>
                    </td>
                  </template>
                </tr>
              </template>
            </template>
            
            <!-- 2 Empty Rows -->
            <tr class="h-4 bg-gradient-to-r from-yellow-100 to-yellow-200"></tr>
            <tr class="h-4 bg-gradient-to-r from-yellow-100 to-yellow-200"></tr>
            
            <!-- Total Hotel Row -->
            <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                <div class="flex items-center gap-2">
                  <Building2 class="w-5 h-5 text-yellow-700" />
                  Total Hotel
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-yellow-300">
                <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateHotelTotalCountLocal() }}</span>
              </td>
              <!-- Vacation Monthly cells for hotel total -->
              <template v-if="hasVacationData">
                <td 
                  v-for="month in months" 
                  :key="'hotel-vacation-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalVacationMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Vacation Total for hotel total -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalVacationTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Relocation Monthly cells for hotel total -->
              <template v-if="hasRelocationData">
                <td 
                  v-for="month in months" 
                  :key="'hotel-relocation-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalRelocationMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Relocation Total for hotel total -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalRelocationTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Severence & Indemnity Monthly cells for hotel total -->
              <template v-if="hasSeverenceIndemnityData">
                <td 
                  v-for="month in months" 
                  :key="'hotel-severence-indemnity-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalSeverenceIndemnityMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Severence & Indemnity Total for hotel total -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalSeverenceIndemnityTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Other Monthly cells for hotel total -->
              <template v-if="hasOtherData">
                <td 
                  v-for="month in months" 
                  :key="'hotel-other-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalOtherMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Other Total for hotel total -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalOtherTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
            </tr>
            
            <!-- Employee/Room Ratio Row -->
            <tr class="border-b-2 border-yellow-400 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-sm">
              <td :colspan="3" class="px-3 py-3 font-bold border-r border-yellow-300 text-yellow-900">
                <div class="flex items-center gap-2">
                  <Users class="w-5 h-5 text-yellow-700" />
                  Employee/Room Ratio
                </div>
              </td>
              <td class="px-3 py-3 text-right border-r border-yellow-300">
                <span class="font-mono text-sm font-bold text-yellow-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
              </td>
              <!-- Vacation Monthly cells for ratio -->
              <template v-if="hasVacationData">
                <td 
                  v-for="month in months" 
                  :key="'ratio-vacation-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioVacationMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Vacation Total for ratio -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioVacationTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Relocation Monthly cells for ratio -->
              <template v-if="hasRelocationData">
                <td 
                  v-for="month in months" 
                  :key="'ratio-relocation-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioRelocationMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Relocation Total for ratio -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioRelocationTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Severence & Indemnity Monthly cells for ratio -->
              <template v-if="hasSeverenceIndemnityData">
                <td 
                  v-for="month in months" 
                  :key="'ratio-severence-indemnity-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioSeverenceIndemnityMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Severence & Indemnity Total for ratio -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioSeverenceIndemnityTotalLocal(visibleYears[0], months) }}</span>
                </td>
              </template>
              <!-- Other Monthly cells for ratio -->
              <template v-if="hasOtherData">
                <td 
                  v-for="month in months" 
                  :key="'ratio-other-' + month"
                  class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                >
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioOtherMonthlyLocal(visibleYears[0], month) }}</span>
                </td>
                <!-- Other Total for ratio -->
                <td class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold">
                  <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioOtherTotalLocal(visibleYears[0], months) }}</span>
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

// Import the new monthly calculation functions for supplementary pay
import {
  calculateMonthlyVacationValue,
  calculateMonthlyRelocationValue,
  calculateMonthlySeverenceIndemnityValue,
  calculateMonthlyOtherValue,
  calculateTotalVacationValue,
  calculateTotalRelocationValue,
  calculateTotalSeverenceIndemnityValue,
  calculateTotalOtherValue
} from '@/components/utility/payroll_related/calculation_handlers.js';

// Import calculation cache and project service for supplementary pay caching
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

// Initialize calculation cache for supplementary pay values
const calculationCache = useCalculationCache();

// Debug props
watch(() => props, (newProps) => {
  // console.log('SupplementaryPayTable props updated:', {
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
  // console.log('Getting monthly count for:', { rowId, year, month, payrollData: props.payrollData }); 
  
  // Defensive check for payrollData - handle both ref and direct object
  const payrollDataValue = props.payrollData?.value || props.payrollData;
  if (!payrollDataValue) {
    // console.log('No payrollData available');
    return 0;
  }
  
  const row = props.payrollRows.find(r => r.id === rowId);
  if (!row) {
    // console.log('No row found for ID:', rowId);
    return 0;
  }
  
  // console.log('Found row:', row);
  
  // Check if there's an override for this specific month
  const countData = payrollDataValue[year]?.[rowId]?.['count'];
  // console.log('Count data for year/month:', countData);
  
  if (countData && typeof countData === 'object' && countData !== null && !Array.isArray(countData)) {
    const overrideValue = countData[month];
    // console.log('Override value for month', month, ':', overrideValue);
    if (overrideValue !== undefined && overrideValue !== null) {
      return overrideValue;
    }
  }
  
  // If no override exists, return the main count value (getter behavior)
  const mainCount = row.count || 0;
  // console.log('Using main count value:', mainCount);
  return mainCount;
}

// Helper function to get supplementary pay values from payroll related data
function getSupplementaryPayValue(row, field) {
  if (!props.visibleYears || props.visibleYears.length === 0) {
    // console.log('No visible years available');
    return 0;
  }
  
  const year = props.visibleYears[0];
  // console.log('Getting supplementary pay value for:', { rowId: row.id, field, year, payrollRelatedData: props.payrollRelatedData });
  
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
    // console.log('No year data found for year:', year);
    return 0;
  }
  
  // console.log('Year data found:', yearData);
  
  // Map field names to the expected format
  const fieldMappings = {
    'vacation': 'vacation',
    'relocation': 'relocation', 
    'severence_indemnity': 'severence_indemnity',
    'other': 'other'
  };
  
  const mappedField = fieldMappings[field];
  if (!mappedField) {
    console.log('No mapping found for field:', field);
    return 0;
  }
  
  // Try different data structures for supplementary pay
  let supplementaryPayData = yearData.supplementary_pay?.[row.id];
  
  if (!supplementaryPayData) {
    // Try alternative structure
    supplementaryPayData = yearData[row.id]?.supplementary_pay;
  }
  
  if (!supplementaryPayData) {
    // Try direct access
    supplementaryPayData = yearData[row.id];
  }
  
  // console.log('Supplementary pay data for row:', row.id, supplementaryPayData);
  
  const value = supplementaryPayData?.[mappedField] || 0;
  // console.log('Final value for field', field, ':', value);
  
  return value;
}

// Computed properties to check for data presence in each column
const hasVacationData = computed(() => {
  return props.payrollRows.some(row => {
    const value = getSupplementaryPayValue(row, 'vacation');
    return value && value > 0;
  });
});

const hasRelocationData = computed(() => {
  return props.payrollRows.some(row => {
    const value = getSupplementaryPayValue(row, 'relocation');
    return value && value > 0;
  });
});

const hasSeverenceIndemnityData = computed(() => {
  return props.payrollRows.some(row => {
    const value = getSupplementaryPayValue(row, 'severence_indemnity');
    return value && value > 0;
  });
});

const hasOtherData = computed(() => {
  return props.payrollRows.some(row => {
    const value = getSupplementaryPayValue(row, 'other');
    return value && value > 0;
  });
});

// Updated calculation functions to use the new helper
function calculateMonthlyVacationValueLocal(row, year, month) {
  const vacationBase = getSupplementaryPayValue(row, 'vacation');
  const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
  const monthlyValue = vacationBase * monthlyCount;
  
  // console.log('Vacation calculation:', { rowId: row.id, vacationBase, monthlyCount, monthlyValue });
  return formatMoney(monthlyValue);
}

function calculateMonthlyRelocationValueLocal(row, year, month) {
  const relocationBase = getSupplementaryPayValue(row, 'relocation');
  const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
  const monthlyValue = relocationBase * monthlyCount;
  
  // console.log('Relocation calculation:', { rowId: row.id, relocationBase, monthlyCount, monthlyValue });
  return formatMoney(monthlyValue);
}

function calculateMonthlySeverenceIndemnityValueLocal(row, year, month) {
  const severenceBase = getSupplementaryPayValue(row, 'severence_indemnity');
  const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
  const monthlyValue = severenceBase * monthlyCount;
  
  // console.log('Severence calculation:', { rowId: row.id, severenceBase, monthlyCount, monthlyValue });
  return formatMoney(monthlyValue);
}

function calculateMonthlyOtherValueLocal(row, year, month) {
  const otherBase = getSupplementaryPayValue(row, 'other');
  const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
  const monthlyValue = otherBase * monthlyCount;
  
  // console.log('Other calculation:', { rowId: row.id, otherBase, monthlyCount, monthlyValue });
  return formatMoney(monthlyValue);
}

function calculateTotalVacationValueLocal(row, year, months) {
  const vacationBase = getSupplementaryPayValue(row, 'vacation');
  const totalCount = months.reduce((sum, month) => {
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    return sum + monthlyCount;
  }, 0);
  const totalValue = vacationBase * totalCount;
  
  return formatMoney(totalValue);
}

function calculateTotalRelocationValueLocal(row, year, months) {
  const relocationBase = getSupplementaryPayValue(row, 'relocation');
  const totalCount = months.reduce((sum, month) => {
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    return sum + monthlyCount;
  }, 0);
  const totalValue = relocationBase * totalCount;
  
  return formatMoney(totalValue);
}

function calculateTotalSeverenceIndemnityValueLocal(row, year, months) {
  const severenceBase = getSupplementaryPayValue(row, 'severence_indemnity');
  const totalCount = months.reduce((sum, month) => {
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    return sum + monthlyCount;
  }, 0);
  const totalValue = severenceBase * totalCount;
  
  return formatMoney(totalValue);
}

function calculateTotalOtherValueLocal(row, year, months) {
  const otherBase = getSupplementaryPayValue(row, 'other');
  const totalCount = months.reduce((sum, month) => {
    const monthlyCount = getMonthlyCountValueLocal(row.id, year, month);
    return sum + monthlyCount;
  }, 0);
  const totalValue = otherBase * totalCount;
  
  return formatMoney(totalValue);
}

// Subtotal calculation functions for supplementary pay
function calculateSubTotalManagementVacationMonthlyLocal(category, location, year, month) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyVacationValueLocal(row, year, month);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache management vacation subtotal monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | vacation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementVacationTotalLocal(category, location, year, months) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const totalValue = calculateTotalVacationValueLocal(row, year, months);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache management vacation subtotal yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | vacation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementRelocationMonthlyLocal(category, location, year, month) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyRelocationValueLocal(row, year, month);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache management relocation subtotal monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | relocation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementRelocationTotalLocal(category, location, year, months) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const totalValue = calculateTotalRelocationValueLocal(row, year, months);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache management relocation subtotal yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | relocation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementSeverenceIndemnityMonthlyLocal(category, location, year, month) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlySeverenceIndemnityValueLocal(row, year, month);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache management severence indemnity subtotal monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | severence & indemnity`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementSeverenceIndemnityTotalLocal(category, location, year, months) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const totalValue = calculateTotalSeverenceIndemnityValueLocal(row, year, months);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache management severence indemnity subtotal yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | severence & indemnity`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementOtherMonthlyLocal(category, location, year, month) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyOtherValueLocal(row, year, month);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache management other subtotal monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | other`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateSubTotalManagementOtherTotalLocal(category, location, year, months) {
  const managementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isManagementPosition(row.position)
  );
  
  const totalValue = managementRows.reduce((sum, row) => {
    const totalValue = calculateTotalOtherValueLocal(row, year, months);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache management other subtotal yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `category: ${category} | other`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

// Non-management subtotal calculation functions
function calculateSubTotalNonManagementVacationMonthlyLocal(category, location, year, month) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyVacationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementVacationTotalLocal(category, location, year, months) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const totalValue = calculateTotalVacationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementRelocationMonthlyLocal(category, location, year, month) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyRelocationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementRelocationTotalLocal(category, location, year, months) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const totalValue = calculateTotalRelocationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementSeverenceIndemnityMonthlyLocal(category, location, year, month) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlySeverenceIndemnityValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementSeverenceIndemnityTotalLocal(category, location, year, months) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const totalValue = calculateTotalSeverenceIndemnityValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementOtherMonthlyLocal(category, location, year, month) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyOtherValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateSubTotalNonManagementOtherTotalLocal(category, location, year, months) {
  const nonManagementRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location && 
    isNonManagementPosition(row.position)
  );
  
  const totalValue = nonManagementRows.reduce((sum, row) => {
    const totalValue = calculateTotalOtherValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

// Location total calculation functions
function calculateLocationTotalVacationMonthlyLocal(category, location, year, month) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyVacationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalVacationTotalLocal(category, location, year, months) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const totalValue = calculateTotalVacationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalRelocationMonthlyLocal(category, location, year, month) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyRelocationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalRelocationTotalLocal(category, location, year, months) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const totalValue = calculateTotalRelocationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalSeverenceIndemnityMonthlyLocal(category, location, year, month) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlySeverenceIndemnityValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalSeverenceIndemnityTotalLocal(category, location, year, months) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const totalValue = calculateTotalSeverenceIndemnityValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalOtherMonthlyLocal(category, location, year, month) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyOtherValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

function calculateLocationTotalOtherTotalLocal(category, location, year, months) {
  const locationRows = props.payrollRows.filter(row => 
    row.category === category && 
    row.departmentLocation === location
  );
  
  const totalValue = locationRows.reduce((sum, row) => {
    const totalValue = calculateTotalOtherValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  return formatMoney(totalValue);
}

// Hotel total calculation functions
function calculateHotelTotalVacationMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyVacationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache hotel vacation total monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | vacation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalVacationTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalVacationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache hotel vacation total yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | vacation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalRelocationMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyRelocationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache hotel relocation total monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | relocation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalRelocationTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalRelocationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache hotel relocation total yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | relocation`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalSeverenceIndemnityMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlySeverenceIndemnityValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache hotel severence indemnity total monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | severence & indemnity`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalSeverenceIndemnityTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalSeverenceIndemnityValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache hotel severence indemnity total yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | severence & indemnity`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalOtherMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyOtherValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  // Cache hotel other total monthly value (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | other`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, month, totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

function calculateHotelTotalOtherTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalOtherValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  // Cache hotel other total yearly total (> 0 only)
  try {
    const projectId = selectedProject.value?.project_name || 'default';
    if (totalValue > 0) {
      const rowCode = `hotel | other`;
      calculationCache.setValue(projectId, 'Payroll Related', rowCode, year, 'Total', totalValue);
    }
  } catch (e) {
    // Silently handle caching errors
  }
  
  return formatMoney(totalValue);
}

// Employee/Room ratio calculation functions
function calculateEmployeeRoomRatioVacationMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyVacationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioVacationTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalVacationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioRelocationMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyRelocationValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioRelocationTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalRelocationValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioSeverenceIndemnityMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlySeverenceIndemnityValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioSeverenceIndemnityTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalSeverenceIndemnityValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioOtherMonthlyLocal(year, month) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const monthlyValue = calculateMonthlyOtherValue(row, year, month, getMonthlyCountValueLocal);
    return sum + parseFloat(monthlyValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

function calculateEmployeeRoomRatioOtherTotalLocal(year, months) {
  const totalValue = props.payrollRows.reduce((sum, row) => {
    const totalValue = calculateTotalOtherValue(row, year, months, getMonthlyCountValueLocal);
    return sum + parseFloat(totalValue) || 0;
  }, 0);
  
  const totalRooms = parseInt(localStorage.getItem('totalRooms')) || 100;
  return totalRooms > 0 ? formatMoney(totalValue / totalRooms) : formatMoney(0);
}

// Helper functions to check position types
function isManagementPosition(position) {
  if (!position) return false;
  const lowerPosition = position.toLowerCase();
  return (lowerPosition.includes('manager') && !lowerPosition.includes('non-manager')) ||
         lowerPosition.includes('director') ||
         lowerPosition.includes('supervisor');
}

function isNonManagementPosition(position) {
  if (!position) return true; // Default to non-management if no position
  return !isManagementPosition(position);
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 