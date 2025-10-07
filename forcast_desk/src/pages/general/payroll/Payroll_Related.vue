<template>
  <!-- Skeleton Loading State -->
  <PayrollSkeleton v-if="isLoading" :sidebar-collapsed="sidebarCollapsed" />
  
  <!-- Main Content -->
  <div v-else class="flex">
    <Sidebar @open-settings="openSettings" />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
          <!-- Collapse/Expand Button -->
          <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all dark:bg-violet-900/30 dark:hover:bg-violet-800/40">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-5 h-5 text-violet-700 dark:text-white" />
            <ChevronRight v-else class="w-5 h-5 text-violet-700 dark:text-white" />
            <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium dark:text-white">Collapse</span>
          </button>
          <transition name="fade">
              <div v-show="!sidebarCollapsed">
                <!-- Header Section -->
                <div class="mb-8">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Ellipsis class="w-7 h-7 mx-2 text-white" />
              </div>
              <h1 class="text-2xl font-bold text-gray-900">Payroll Related</h1>
            </div>
            <p class="text-sm text-gray-500">Manage and configure your payroll data</p>
          </div>

          <!-- Save Status Section -->
          <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div
                    v-if="hasUnsavedChanges"
                    class="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                  >
                    <AlertTriangle class="w-4 h-4" />
                    Unsaved
                  </div>
                  <div
                    v-else
                    class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                  >
                    <Check class="w-4 h-4" />
                    All Saved
                  </div>
                </div>
                
                <button
                  v-if="!isSaving && hasUnsavedChanges"
                  :disabled="isSaving"
                  @click="saveChangesWrapper"
                  class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Download class="w-4 h-4" />
                  Save
                </button>
                <button
                  v-if="isSaving"
                  class="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg cursor-not-allowed"
                >
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Saving...
                </button>
              </div>
            <span v-if="saveError" class="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle class="w-3 h-3" />
              {{ saveError }}
            </span>
          </div>
          
          <!-- Action Buttons Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Plus class="w-4 h-4 text-violet-600" />
              Quick Actions
            </h3>


            <div class="flex gap-2 mt-3">
              <button 
                @click="refreshTable"
                class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 transition-all text-sm font-medium"
              >
                <RefreshCw class="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          <!-- Filters Section -->
          <div class="flex-1">
            <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Filter class="w-5 h-5 text-violet-600" />
                Year Range Filter
              </h3>
              
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar class="w-3 h-3 text-gray-500" />
                      From Year
                    </label>
                    <select 
                      disabled
                      v-model="fromYear" 
                      class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm"
                    >
                      <option value="">Select Year</option>
                      <option v-for="year in years" :key="'from-' + year" :value="year">{{ year }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar class="w-3 h-3 text-gray-500" />
                      To Year
                    </label>
                    <select 
                      disabled
                      v-model="toYear" 
                      class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-gray-100 text-sm"
                    >
                      <option value="">Select Year</option>
                      <option v-for="year in filteredToYears" :key="'to-' + year" :value="year">{{ year }}</option>
                    </select>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button 
                    @click="clearYearSelection" 
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                  >
                    <X class="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>

              
            </div>

            <!-- Total Number of Rooms Section -->
            <div class="mt-4">
              <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BedDouble class="w-5 h-5 text-violet-600" />
                  Total Number of Rooms
                </h3>
                <div class="space-y-3">
                  <div>
                    <div class="relative">
                      <input
                        v-model="totalRooms"
                        type="number"
                        disabled
                        min="1"
                        class="w-full px-4 py-3 rounded-lg border bg-gray-100 border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all  text-lg font-semibold text-gray-900 rooms-input"
                        placeholder="Enter total number of rooms"
                        @input="handleTotalRoomsChange"
                        @blur="handleTotalRoomsBlur"
                        @keyup.enter="$event.target.blur()"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span class="text-gray-400 text-sm mr-8 font-medium">rooms</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Sync Button -->
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    
                    <button 
                      @click="syncWithRoomRevenue"
                      class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm"
                      :class="isSyncedWithRoomRevenueComputed 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                        : 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-200'"
                    >
                      <RefreshCw class="w-4 h-4" />
                      {{ isSyncedWithRoomRevenueComputed ? 'Synced' : 'Unsynced' }}
                    </button>
                    
                    <p class="text-xs text-gray-500 mt-2 text-center">
                      {{ isSyncedWithRoomRevenueComputed 
                        ? 'Your total rooms are synchronized with the Room Revenue page' 
                        : 'Click to sync with the total rooms from Room Revenue page' }}
                    </p>
                  </div>
          
                </div>
              </div>
            </div>



          </div>
            </div>
          </transition>
        </div>


        <!-- Right Side - Table Area -->
        <div class="flex-1 p-4">
          <!-- No Project Selected State -->
          <template v-if="!selectedProject">
            <PayrollNoProjectSelectedState />
          </template>
          
          <!-- Table Header with Stats -->
          <template v-else-if="visibleYears.length && isComponentReady">
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Table class="w-3 h-3 text-white" />
                </div>
                <h2 class="text-lg font-bold text-gray-800">Payroll Related Overview</h2>
              </div>
            </div>

            <!-- No Payroll Data State -->
            <template v-if="!hasPayrollDataComputed">
              <NoPayrollDataState />
            </template>



            <!-- Modern Table Container -->
            <template v-else>
              <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                <div class="overflow-x-auto max-w-[100%] md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">  
                  <div class="min-w-full w-max">
                    <table class="w-full">
                      <!-- Table Header -->
                      <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
                        <tr>
                          <th rowspan="3" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                            Position
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-left align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                            Designation
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-center align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                            Salary
                            </div>
                          </th>
                          <th rowspan="3" class="px-3 py-2 text-center align-middle border-r border-violet-400 font-semibold text-sm">
                            <div class="flex items-center gap-1">
                              <FolderOpen class="w-3 h-3" />
                            Count
                            </div>
                          </th>
                          <!-- First Year Column -->
                          <th 
                            v-if="visibleYears.length > 0" 
                            colspan="12" 
                            class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">{{ visibleYears[0] }}</span>
                            </div>
                          </th>
                          <!-- Payroll Taxes Column -->
                          <th 
                            :colspan="2" 
                            class="px-2 py-2 text-center border-x-2 border-green-400 font-semibold text-sm bg-gradient-to-r from-green-600 to-green-700"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">Payroll Taxes</span>
                            </div>
                          </th>
                          <!-- Supplementary Pay Column -->
                          <th 
                            :colspan="4" 
                            class="px-2 py-2 text-center border-x-2 border-yellow-400 font-semibold text-sm bg-gradient-to-r from-yellow-600 to-yellow-700"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">Supplementary Pay</span>
                            </div>
                          </th>
                          <!-- Employee Benefits Column -->
                          <th 
                            :colspan="7" 
                            class="px-2 py-2 text-center border-x-2 border-blue-400 font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-700"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">Employee Benefits</span>
                            </div>
                          </th>
                        </tr>
                        <tr class="bg-violet-500/90 text-xs">
                          <!-- Monthly Count Sub-column -->
                          <th 
                            v-if="visibleYears.length > 0" 
                            colspan="12" 
                            class="px-2 py-1 text-center border border-violet-300 font-medium"
                          >
                            Monthly Count
                          </th>
                          <!-- Payroll Taxes Sub-columns -->
                          <th 
                            :colspan="2" 
                            class="px-2 py-1 text-center border border-green-300 font-medium bg-green-500/90"
                          >
                            Tax Details
                          </th>
                          <!-- Supplementary Pay Sub-columns -->
                          <th 
                            :colspan="4" 
                            class="px-2 py-1 text-center border border-yellow-300 font-medium bg-yellow-500/90"
                          >
                            Supplementary Details
                          </th>
                          <!-- Employee Benefits Sub-columns -->
                          <th 
                            :colspan="7" 
                            class="px-2 py-1 text-center border border-blue-300 font-medium bg-blue-500/90"
                          >
                            Benefits Details
                          </th>

                        </tr>
                        <tr class="bg-violet-400/90 text-xs">
                          <!-- Month columns for Monthly Count -->
                          <th 
                            v-for="month in months" 
                            :key="'count-' + month"
                            class="px-2 py-1 text-center border border-violet-300 min-w-[80px] font-medium"
                          >
                            {{ month }}
                          </th>
                          <!-- Payroll Taxes Sub-columns -->
                          <th 
                            class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-medium bg-green-400/90"
                          >
                            Tax %
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-green-300 min-w-[80px] font-medium bg-green-400/90"
                          >
                            Tax Total
                          </th>
                          <!-- Supplementary Pay Sub-columns -->
                          <th 
                            class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium bg-yellow-400/90"
                          >
                            Vacation
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium bg-yellow-400/90"
                          >
                            Relocation
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium bg-yellow-400/90"
                          >
                            Severence & Indemnity
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium bg-yellow-400/90"
                          >
                            Other
                          </th>
                          <!-- Employee Benefits Sub-columns -->
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Medical
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Uniforms
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Employee Meal
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Transport
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Telephone
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Air Ticket
                          </th>
                          <th 
                            class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium bg-blue-400/90"
                          >
                            Other
                          </th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-700 bg-white text-sm">
                        <!-- Group by actual categories from data -->
                        <template v-for="category in getUniqueCategoriesLocal()" :key="category">
                          <tr class="bg-violet-100 border-b-2 border-violet-300">
                            <td 
                              :colspan="4 + (visibleYears.length > 0 ? 25 : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0) + 13" 
                              class="px-3 py-2 font-bold text-violet-800 text-left"
                            >
                              {{ category }}
                            </td>
                          </tr>
                          <!-- Group by Department Location within each category -->
                          <template v-for="location in getUniqueLocationsForCategoryLocal(category)" :key="'location-' + location">
                            <!-- Department Location Subdivider -->
                            <tr class="bg-violet-50 border-b border-violet-200">
                              <td 
                                :colspan="4 + (visibleYears.length > 0 ? 25 : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0) + 13" 
                                class="px-3 py-1.5 font-semibold text-violet-700 text-left text-sm"
                              >
                                {{ location }}
                              </td>
                            </tr>
                            <!-- Payroll rows for this location -->
                            <template v-for="row in getPayrollRowsForLocationLocal(category, location)" :key="row.id">
                              <tr class="border-b border-gray-200 hover:bg-violet-50 transition-all duration-200">
                                <!-- Position -->
                                <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                  {{ row.position }}
                                </td>
                                <!-- Designation -->
                                <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                  {{ row.designation }}
                                </td>
                                <!-- Salary (Editable, Reactive, row.salary) -->
                                <td
                                  class="px-3 py-2 text-right border-r border-violet-200  text-sm"
                                  :key="row.id + '-salary'"
                                >
                                  {{ formatMoney(row.salary) }}
                                </td>
                                <!-- Count (Editable, Reactive, row.count) -->
                                <td
                                  class="px-3 py-2 text-right border-r border-violet-200  text-sm"
                                >
                                  {{ row.count }}
                                </td>
                                <!-- Monthly Count cells -->
                                <template v-if="visibleYears.length > 0">
                                  <td 
                                    v-for="month in months" 
                                    :key="'count-cell-' + month + '-' + (getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) || 0)"
                                    class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                  >
                                    <span class=" text-xs">{{ getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) }}</span>
                                  </td>
                                </template>
                                
                                <!-- Payroll Taxes cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-green-200 hover:bg-green-50 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 bg-green-50"
                                  contenteditable="true"
                                  :key="row.id + '-tax-percentage'"
                                  @input="handleTaxPercentageInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleTaxPercentageFocus(row, $event)"
                                  @blur="handleTaxPercentageBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-green-700">{{ getTaxPercentage(row) || '0.00' }}%</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-green-200 hover:bg-green-50 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 bg-green-50"                           
                                  :key="row.id + '-tax-total'"
                                >
                                  <span class=" text-xs text-green-700">{{ getTaxTotal(row) || '0.00' }}</span>
                                </td>
                                
                                <!-- Supplementary Pay cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-vacation'"
                                  @input="handleVacationInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleVacationFocus(row, $event)"
                                  @blur="handleVacationBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-yellow-700">{{ getVacation(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-relocation'"
                                  @input="handleRelocationInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleRelocationFocus(row, $event)"
                                  @blur="handleRelocationBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-yellow-700">{{ getRelocation(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-severence-indemnity'"
                                  @input="handleSeverenceIndemnityInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleSeverenceIndemnityFocus(row, $event)"
                                  @blur="handleSeverenceIndemnityBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-yellow-700">{{ getSeverenceIndemnity(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-other'"
                                  @input="handleOtherInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleOtherFocus(row, $event)"
                                  @blur="handleOtherBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-yellow-700">{{ getOther(row) || '0.00' }}</span>
                                </td>
                                
                                <!-- Employee Benefits cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-medical'"
                                  @input="handleMedicalInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleMedicalFocus(row, $event)"
                                  @blur="handleMedicalBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getMedical(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-uniforms'"
                                  @input="handleUniformsInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleUniformsFocus(row, $event)"
                                  @blur="handleUniformsBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getUniforms(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-employee-meal'"
                                  @input="handleEmployeeMealInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleEmployeeMealFocus(row, $event)"
                                  @blur="handleEmployeeMealBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getEmployeeMeal(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-transport'"
                                  @input="handleTransportInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleTransportFocus(row, $event)"
                                  @blur="handleTransportBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getTransport(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-telephone'"
                                  @input="handleTelephoneInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleTelephoneFocus(row, $event)"
                                  @blur="handleTelephoneBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getTelephone(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-air-ticket'"
                                  @input="handleAirTicketInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleAirTicketFocus(row, $event)"
                                  @blur="handleAirTicketBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getAirTicket(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-benefits-other'"
                                  @input="handleBenefitsOtherInput(row, $event, isSaved, visibleYears)"
                                  @focus="handleBenefitsOtherFocus(row, $event)"
                                  @blur="handleBenefitsOtherBlur(row, $event, isSaved, visibleYears)"
                                  @keypress="allowOnlyNumbersAndDecimal($event)"
                                >
                                  <span class=" text-xs text-blue-700">{{ getBenefitsOther(row) || '0.00' }}</span>
                                </td>

                              </tr>
                            </template>
                            
                            <!-- Sub-Total Management Row -->
                            <tr class="border-b border-gray-300 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                              <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-violet-300 text-violet-900">
                                <div class="flex items-center gap-2">
                                  <CheckCircle class="w-4 h-4 text-violet-700" />
                                  Sub-Total Management
                                </div>
                              </td>
                              <td class="px-3 py-2.5 text-right border-r border-violet-300">
                                <span class=" text-sm font-semibold text-violet-900">{{ calculateSubTotalManagementLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for subtotal -->
                              <template v-if="visibleYears.length > 0">
                                <td 
                                  v-for="month in months" 
                                  :key="'subtotal-mgmt-count-' + month"
                                  class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                >
                                  <span class=" text-xs text-violet-900">{{ calculateSubTotalManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class=" text-xs text-green-900"></span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class=" text-xs text-green-900">{{ calculateSubTotalManagementTaxTotalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalManagementVacationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalManagementRelocationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalManagementSeverenceIndemnityLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalManagementOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementMedicalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementUniformsLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementEmployeeMealLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementTransportLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementTelephoneLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementAirTicketLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalManagementBenefitsOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>

                            </tr>
                            
                            <!-- Sub-Total Non-Management Row -->
                            <tr class="border-b border-gray-300 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                              <td :colspan="3" class="px-3 py-2.5 font-semibold border-r border-violet-300 text-violet-900">
                                <div class="flex items-center gap-2">
                                  <CheckCircle class="w-4 h-4 text-violet-700" />
                                  Sub-Total Non-Management
                                </div>
                              </td>
                              <td class="px-3 py-2.5 text-right border-r border-violet-300">
                                <span class=" text-sm font-semibold text-violet-900">{{ calculateSubTotalNonManagementLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for subtotal -->
                              <template v-if="visibleYears.length > 0">
                                <td 
                                  v-for="month in months" 
                                  :key="'subtotal-nonmgmt-count-' + month"
                                  class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                >
                                  <span class=" text-xs text-violet-900">{{ calculateSubTotalNonManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class=" text-xs text-green-900"></span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class=" text-xs text-green-900">{{ calculateSubTotalNonManagementTaxTotalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalNonManagementVacationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalNonManagementRelocationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalNonManagementSeverenceIndemnityLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateSubTotalNonManagementOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementMedicalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementUniformsLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementEmployeeMealLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementTransportLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementTelephoneLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementAirTicketLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateSubTotalNonManagementBenefitsOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>

                            </tr>
                            
                            <!-- Total Row -->
                            <tr class="border-b-2 border-violet-400 bg-gradient-to-r from-violet-100 to-purple-100 shadow-sm">
                              <td :colspan="3" class="px-3 py-3 font-bold border-r border-violet-300 text-violet-900">
                                <div class="flex items-center gap-2">
                                  <BarChart3 class="w-5 h-5 text-violet-700" />
                                  Total
                                </div>
                              </td>
                              <td class="px-3 py-3 text-right border-r border-violet-300">
                                <span class=" text-sm font-bold text-violet-900">{{ calculateLocationTotalLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for total -->
                              <template v-if="visibleYears.length > 0">
                                <td 
                                  v-for="month in months" 
                                  :key="'total-count-' + month"
                                  class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                >
                                  <span class=" text-xs text-violet-900">{{ calculateLocationTotalMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                              >
                                <span class=" text-xs text-green-900"></span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                              >
                                <span class=" text-xs text-green-900">{{ calculateLocationTotalTaxTotalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateLocationTotalVacationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateLocationTotalRelocationLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateLocationTotalSeverenceIndemnityLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class=" text-xs text-yellow-900">{{ calculateLocationTotalOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalMedicalLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalUniformsLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalEmployeeMealLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalTransportLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalTelephoneLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalAirTicketLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class=" text-xs text-blue-900">{{ calculateLocationTotalBenefitsOtherLocal(getPayrollRowsForLocationLocal(category, location), category, location) }}</span>
                              </td>

                            </tr>
                          </template>
                        </template>
                        
                        <!-- 2 Empty Rows -->
                        <tr class="h-4 bg-gradient-to-r from-violet-100 to-indigo-100"></tr>
                        <tr class="h-4 bg-gradient-to-r from-violet-100 to-indigo-100"></tr>
                        
                        <!-- Total Hotel Row -->
                        <tr class="border-b-2 border-violet-400 bg-gradient-to-r from-violet-100 to-indigo-100 shadow-sm">
                          <td :colspan="3" class="px-3 py-3 font-bold border-r border-violet-300 text-violet-900">
                            <div class="flex items-center gap-2">
                              <Building2 class="w-5 h-5 text-violet-700" />
                              Total Hotel
                            </div>
                          </td>
                          <td class="px-3 py-3 text-right border-r border-violet-300">
                            <span class=" text-sm font-bold text-violet-900">{{ calculateHotelTotalLocal() }}</span>
                          </td>
                          
                          <!-- Monthly Count cells for hotel total -->
                          <template v-if="visibleYears.length > 0">
                            <td 
                              v-for="month in months" 
                              :key="'hotel-count-' + month"
                              class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-indigo-100 font-bold"
                            >
                              <span class=" text-xs text-violet-900">{{ calculateHotelTotalMonthlyCountLocal(visibleYears[0], month) }}</span>
                            </td>
                          </template>
                          
                          <!-- Payroll Taxes cells for hotel total -->
                                                    <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class=" text-xs text-green-900"></span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class=" text-xs text-green-900">{{ safeCalculateHotelTotalTaxTotalLocal() }}</span>
                          </td>
                          
                          <!-- Supplementary Pay cells for hotel total -->
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class=" text-xs text-yellow-900">{{ safeCalculateHotelTotalVacationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class=" text-xs text-yellow-900">{{ safeCalculateHotelTotalRelocationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class=" text-xs text-yellow-900">{{ safeCalculateHotelTotalSeverenceIndemnityLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class=" text-xs text-yellow-900">{{ safeCalculateHotelTotalOtherLocal() }}</span>
                          </td>
                          
                          <!-- Employee Benefits cells for hotel total -->
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalMedicalLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalUniformsLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalEmployeeMealLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalTransportLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalTelephoneLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalAirTicketLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class=" text-xs text-blue-900">{{ safeCalculateHotelTotalBenefitsOtherLocal() }}</span>
                          </td>

                        </tr>
                        

                        <!-- Employee/Room Ratio Row -->
                        <tr class="border-b-2 border-green-400 bg-gradient-to-r from-green-100 to-emerald-100 shadow-sm">
                          <td :colspan="3" class="px-3 py-3 font-bold border-r border-green-300 text-green-900">
                            <div class="flex items-center gap-2">
                              <Users class="w-5 h-5 text-green-700" />
                              Employee/Room Ratio
                            </div>
                          </td>
                          <td class="px-3 py-3 text-right border-r border-green-300">
                            <span class=" text-sm font-bold text-green-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
                          </td>
                          
                          <!-- Monthly Count cells for ratio -->
                          <template v-if="visibleYears.length > 0">
                            <td 
                              v-for="month in months" 
                              :key="'ratio-count-' + month"
                              class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 font-bold"
                            >
                              <span class=" text-xs text-green-900">{{ calculateEmployeeRoomRatioMonthlyLocal(visibleYears[0], month) }}</span>
                            </td>
                          </template>
                          
                          <!-- Payroll Taxes cells for ratio -->
                                                    <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class=" text-xs text-green-900"></span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                                                            <span class=" text-xs text-green-900">{{ calculateEmployeeRoomRatioTaxTotalLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          
                          <!-- Supplementary Pay cells for ratio -->
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                                                            <span class=" text-xs text-yellow-900">{{ calculateEmployeeRoomRatioVacationLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                                                            <span class=" text-xs text-yellow-900">{{ calculateEmployeeRoomRatioRelocationLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                                                            <span class=" text-xs text-yellow-900">{{ calculateEmployeeRoomRatioSeverenceIndemnityLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                                                            <span class=" text-xs text-yellow-900">{{ calculateEmployeeRoomRatioOtherLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          
                          <!-- Employee Benefits cells for ratio -->
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioMedicalLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioUniformsLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioEmployeeMealLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioTransportLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioTelephoneLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioAirTicketLocal(payrollRows, totalRooms) }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                                                            <span class=" text-xs text-blue-900">{{ calculateEmployeeRoomRatioBenefitsOtherLocal(payrollRows, totalRooms) }}</span>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <!-- Tabbed Related Tables Container -->
          <div v-if="visibleYears.length && isComponentReady" class="mt-8">
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Table class="w-3 h-3 text-white" />
                </div>
                <h2 class="text-lg font-bold text-gray-800">Payroll Related Data</h2>
              </div>
            </div>
            <PayrollRelatedTabs 
              :payroll-rows="payrollRows"
              :payroll-data="payrollData"
              :visible-years="visibleYears"
              :months="months"
              :payroll-related-data="payrollRelatedData"
              :add-payroll-related-change="addPayrollRelatedChange"
              :get-payroll-related-value="getPayrollRelatedValue"
              :set-payroll-related-value="setPayrollRelatedValue"
            />
          </div>

          <!-- Enhanced No Years Selected State -->
          <template v-else-if="selectedProject">
            <PayrollNoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
          </template>
          
          <!-- Fallback for when project is selected but no years -->
          <template v-else>
            <PayrollNoProjectSelectedState />
          </template>
        </div>
      </div>
    </div>
    
    <!-- Settings Modal -->
    <SettingsModal 
      :is-visible="showSettingsModal" 
      @close="closeSettings" 
    />
  </div>
</template>




<script setup>
import { ref, onMounted, computed, watch, onUnmounted, reactive, nextTick } from "vue";
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import Sidebar from "@/components/ui/Sidebar.vue";
import SettingsModal from "@/components/ui/SettingsModal.vue";
import PayrollSkeleton from '@/components/ui/skeleton/PayrollSkeleton.vue';
import { 
  CircleAlert, 
  AlertTriangle, 
  Ellipsis, 
  Table, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  ArrowLeft, 
  Settings, 
  X, 
  Check, 
  CheckCircle, 
  BarChart3, 
  Plus, 
  Trash2,
  FolderOpen,
  ChevronDown,
  Building2,
  Users,
  BedDouble,
  Download,
  Loader2,
  AlertCircle,
  Filter
} from 'lucide-vue-next';
import alertService from "@/components/ui/ui_utility/alertService.js";
import { 
  getVisibleYears,
  getColumnLabels
} from "@/components/utility/banquet_revenue_assumpt/index.js";
import {
  toggleCollapse,
  loadYearOptions,
  isYearCollapsed
} from "@/components/utility/expense_assumption/index.js";
import { cloneDeep } from 'lodash-es';
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';
import PayrollRelatedTabs from '@/components/ui/payroll/PayrollRelatedTabs.vue';
import NoPayrollDataState from '@/components/ui/payroll/NoPayrollDataState.vue';
import PayrollNoProjectSelectedState from '@/components/ui/payroll/PayrollNoProjectSelectedState.vue';
import PayrollNoYearsSelectedState from '@/components/ui/payroll/PayrollNoYearsSelectedState.vue';
import LoadingState from '@/components/ui/payroll/LoadingState.vue';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { PAGE, ROW } from '@/components/utility/_master_utility/cacheKeys.js';
import { getProjectKey } from '@/components/utility/projectLocalStorage.js';  
import {
  showAddPayrollModal,
  isSubmittingPayroll,
  payrollModalError,
  addPayrollForm,
  departmentOptions,
  departmentLocationOptions,
  designationOptions,
  payrollData,
  payrollRows,
  openAddPayrollModal,
  closeAddPayrollModal,
  resetPayrollForm,
  addPayrollRow,
  removePayrollRow,
  submitPayrollData,
  fetchPayrollData,
  savePayrollChanges,
  createDepartment,
  createDepartmentLocation,
  createDesignation,
  // Calculation functions
  calculateSubTotalManagement,
  calculateSubTotalManagementCount,
  calculateSubTotalManagementMonthlyCount,

  calculateSubTotalNonManagement,
  calculateSubTotalNonManagementCount,
  calculateSubTotalNonManagementMonthlyCount,
  calculateLocationTotal,
  calculateLocationTotalCount,
  calculateLocationTotalMonthlyCount,
  calculateHotelTotal,
  calculateHotelTotalMonthlyCount,
  calculateEmployeeRoomRatio,
  calculateEmployeeRoomRatioMonthly,
  // Utility functions
  getUniqueCategories,
  getPayrollRowsForCategory,
  getUniqueLocationsForCategory,
  getUniquePositionsForLocation,
  getPayrollRowsForPosition,
  getPayrollRowsForLocation,
  formatCurrency,
  getPayrollCellValue,
  handlePayrollCellEdit,
  addSamplePayrollData,
  resetToDefault,
  hasPayrollData,
  // Constants
  PAYROLL_CATEGORIES,
  POSITION_TYPES,
  DEFAULT_PAYROLL_ROW,
  FIELD_TYPES,
  POSITION_FILTERS,
  // Utility functions
  allowOnlyNumbers,
} from '@/components/utility/payroll/index.js';
// Import payroll related data constructor and utilities
import {
  payrollRelatedDataConstructor,
  getRelatedFieldValue,
  setRelatedFieldValue,
  formatCurrency as formatRelatedCurrency,
  formatPercentage,
  allowOnlyNumbers as allowOnlyNumbersRelated,
  allowOnlyNumbersAndDecimal,
  findMatchingPayrollRow,
  generateRelatedRowId,
  hasRelatedDataChanges,
  getRelatedDataSummary,
  // Import extracted functions
  formatMoney,
  getTaxPercentage,
  getTaxTotal,
  handleTaxPercentageInput,
  handleTaxPercentageFocus,
  handleTaxPercentageBlur,
  handleTaxTotalInput,
  handleTaxTotalFocus,
  handleTaxTotalBlur,
  getVacation,
  getRelocation,
  getSeverenceIndemnity,
  getOther,
  handleVacationInput,
  handleVacationFocus,
  handleVacationBlur,
  handleRelocationInput,
  handleRelocationFocus,
  handleRelocationBlur,
  handleSeverenceIndemnityInput,
  handleSeverenceIndemnityFocus,
  handleSeverenceIndemnityBlur,
  handleOtherInput,
  handleOtherFocus,
  handleOtherBlur,
  getMedical,
  getUniforms,
  getEmployeeMeal,
  getTransport,
  getTelephone,
  getAirTicket,
  getBenefitsOther,
  handleMedicalInput,
  handleMedicalFocus,
  handleMedicalBlur,
  handleUniformsInput,
  handleUniformsFocus,
  handleUniformsBlur,
  handleEmployeeMealInput,
  handleEmployeeMealFocus,
  handleEmployeeMealBlur,
  handleTransportInput,
  handleTransportFocus,
  handleTransportBlur,
  handleTelephoneInput,
  handleTelephoneFocus,
  handleTelephoneBlur,
  handleAirTicketInput,
  handleAirTicketFocus,
  handleAirTicketBlur,
  handleBenefitsOtherInput,
  handleBenefitsOtherFocus,
  handleBenefitsOtherBlur,
  calculateSubTotalManagementTaxPercentageLocal,
  calculateSubTotalManagementTaxTotalLocal,
  calculateSubTotalNonManagementTaxPercentageLocal,
  calculateSubTotalNonManagementTaxTotalLocal,
  calculateLocationTotalTaxPercentageLocal,
  calculateLocationTotalTaxTotalLocal,
  calculateHotelTotalTaxPercentageLocal,
  calculateHotelTotalTaxTotalLocal,
  calculateEmployeeRoomRatioTaxPercentageLocal,
  calculateEmployeeRoomRatioTaxTotalLocal,
  calculateSubTotalManagementVacationLocal,
  calculateSubTotalManagementRelocationLocal,
  calculateSubTotalManagementSeverenceIndemnityLocal,
  calculateSubTotalManagementOtherLocal,
  calculateSubTotalNonManagementVacationLocal,
  calculateSubTotalNonManagementRelocationLocal,
  calculateSubTotalNonManagementSeverenceIndemnityLocal,
  calculateSubTotalNonManagementOtherLocal,
  calculateLocationTotalVacationLocal,
  calculateLocationTotalRelocationLocal,
  calculateLocationTotalSeverenceIndemnityLocal,
  calculateLocationTotalOtherLocal,
  calculateHotelTotalVacationLocal,
  calculateHotelTotalRelocationLocal,
  calculateHotelTotalSeverenceIndemnityLocal,
  calculateHotelTotalOtherLocal,
  calculateEmployeeRoomRatioVacationLocal,
  calculateEmployeeRoomRatioRelocationLocal,
  calculateEmployeeRoomRatioSeverenceIndemnityLocal,
  calculateEmployeeRoomRatioOtherLocal,
  calculateSubTotalManagementMedicalLocal,
  calculateSubTotalManagementUniformsLocal,
  calculateSubTotalManagementEmployeeMealLocal,
  calculateSubTotalManagementTransportLocal,
  calculateSubTotalManagementTelephoneLocal,
  calculateSubTotalManagementAirTicketLocal,
  calculateSubTotalManagementBenefitsOtherLocal,
  calculateSubTotalNonManagementMedicalLocal,
  calculateSubTotalNonManagementUniformsLocal,
  calculateSubTotalNonManagementEmployeeMealLocal,
  calculateSubTotalNonManagementTransportLocal,
  calculateSubTotalNonManagementTelephoneLocal,
  calculateSubTotalNonManagementAirTicketLocal,
  calculateSubTotalNonManagementBenefitsOtherLocal,
  calculateLocationTotalMedicalLocal,
  calculateLocationTotalUniformsLocal,
  calculateLocationTotalEmployeeMealLocal,
  calculateLocationTotalTransportLocal,
  calculateLocationTotalTelephoneLocal,
  calculateLocationTotalAirTicketLocal,
  calculateLocationTotalBenefitsOtherLocal,
  calculateHotelTotalMedicalLocal,
  calculateHotelTotalUniformsLocal,
  calculateHotelTotalEmployeeMealLocal,
  calculateHotelTotalTransportLocal,
  calculateHotelTotalTelephoneLocal,
  calculateHotelTotalAirTicketLocal,
  calculateHotelTotalBenefitsOtherLocal,
  calculateEmployeeRoomRatioMedicalLocal,
  calculateEmployeeRoomRatioUniformsLocal,
  calculateEmployeeRoomRatioEmployeeMealLocal,
  calculateEmployeeRoomRatioTransportLocal,
  calculateEmployeeRoomRatioTelephoneLocal,
  calculateEmployeeRoomRatioAirTicketLocal,
  calculateEmployeeRoomRatioBenefitsOtherLocal,
  isSyncedWithRoomRevenue,
  handleTotalRoomsChange,
  handleTotalRoomsBlur,
  syncWithRoomRevenue,
  refreshTable,
  handleBeforeUnload,
  applyAdvancedSettings,
  cancelAdvancedSettings,
  clearYearSelection,
  ensureCountDataStructure,
  ensureSalaryDataStructure,
  getMonthlyCountValue,
  setMonthlyCountValue,
  handlePayrollCellEditLocal,
  handlePayrollCellInput,
  handlePayrollCellFocus,
  handleModalSalaryInput,
  handleModalSalaryFocus,
  handleModalSalaryBlur,
  handleTableSalaryInput,
  handleTableSalaryFocus,
  handleTableSalaryBlur,
  handleTableCountInput,
  handleTableCountFocus,
  handleTableCountBlur
} from '@/components/utility/payroll_related/index.js';

// Import payroll related data service
import {
  fetchPayrollRelatedData,
  savePayrollRelatedChanges,
  addPayrollRelatedChange,
  getPayrollRelatedValue,
  setPayrollRelatedValue,
  hasPayrollRelatedChanges,
  clearPayrollRelatedChanges,
  getPayrollRelatedChangesForAPI,
  payrollRelatedData,
  payrollRelatedChanges,
  isSavingPayrollRelated,
  payrollRelatedSaveError
} from '@/components/utility/payroll_related/payroll_related_data_service.js';

// ************ Reactive state ****************
const years = ref([]);
const displayMode = ref("monthly");
const showAdvanced = ref(false);
const tempAdvancedModes = ref({});
// Use Pinia store for annual increment data persistence
// (will be consolidated with existing yearSettingsStore below)
const isSaved = ref(false);
const originalPayrollData = ref({});
const changedCells = ref([]); // {rowId, fieldType, year, month, newValue}
const isSaving = ref(false);
const saveError = ref("");
const sidebarCollapsed = ref(false);
const isLoading = ref(false); // Add loading state for skeleton

// Settings Modal State
const showSettingsModal = ref(false);

const isComponentReady = ref(false); // Add a flag to track if component is ready

// Ensure payrollRows is always initialized as an array (never undefined)
// Note: payrollRows is imported from the payroll service, but we ensure it's always an array
// Utility function to safely assign fetched data to payrollRows
function setPayrollRowsSafe(fetchedRows) {
  // Ensure payrollRows.value is always an array
  if (!payrollRows.value) {
    payrollRows.value = [];
  }
  payrollRows.value = Array.isArray(fetchedRows) ? fetchedRows : [];
}

// ************ Quick Actions state ****************
const newDepartmentName = ref('');
const newLocationName = ref('');
const newDesignationName = ref('');
const isCreatingDepartment = ref(false);  
const isCreatingLocation = ref(false);
const isCreatingDesignation = ref(false);
const showQuickActions = ref(false);

// Total Rooms functionality
const totalRooms = ref(0); // Default value

// Check if total rooms is synced with Room Revenue page
const isSyncedWithRoomRevenueComputed = computed(() => {
  return isSyncedWithRoomRevenue(totalRooms.value);
});


// Months
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ! Cache for calculations
const calculationCache = useCalculationCache();  
// Pinia store for year settings
const yearSettingsStore = useYearSettingsStore();
const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;

// Computed properties
const visibleYears = computed(() => {
  const yearsArr = getVisibleYears(fromYear.value, toYear.value);
  return yearsArr;
});

// Computed property for filtered years in "To Year" dropdown
const filteredToYears = computed(() => {
  return getFilteredToYears(years.value);
});

// Computed property to check if there's any payroll data
const hasPayrollDataComputed = computed(() => {
  return hasPayrollData(payrollRows.value);
});

// Computed property to check if there are unsaved changes (including payroll related)
const hasUnsavedChanges = computed(() => {
  return changedCells.value.length > 0 || hasPayrollRelatedChanges();
});

// Computed property to track monthly count changes for better reactivity
const monthlyCountTracker = computed(() => {
  if (!visibleYears.value.length || !payrollRows.value.length) return 0;
  
  const year = visibleYears.value[0];
  let tracker = 0;
  
  payrollRows.value.forEach(row => {
    months.forEach(month => {
      const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
      tracker += countValue || 0;
    });
  });
  
  return tracker;
});

// Computed property for monthly salary calculations to ensure reactivity
const monthlySalaryTracker = computed(() => {
  if (!visibleYears.value.length || !payrollRows.value.length) return 0;
  
  const year = visibleYears.value[0];
  let tracker = 0;
  
  payrollRows.value.forEach(row => {
    months.forEach(month => {
      const countValue = getPayrollCellValueLocal(row.id, 'count', year, month);
      const salary = row.salary || 0;
      tracker += (countValue || 0) * salary;
    });
  });
  
  return tracker;
});


// Watch for changes in visible years to initialize advanced modes
watch(visibleYears, () => {
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      yearSettingsStore.setAdvancedMode(year, displayMode.value);
    }
  });
  
  // Set the current visible years for the payroll related functions
  window.__currentVisibleYears = visibleYears.value;
});

// Watch for changes in payrollData to ensure calculated fields update
watch(payrollData, (newData, oldData) => {
 //  // console.log('payrollData changed:', newData);
}, { deep: true, immediate: true });

// Watch for payroll related data changes
watch(payrollRelatedData, (newData, oldData) => {
 //  // console.log('payrollRelatedData changed:', newData);
  
  // Make payroll related data available globally for the utility functions
  window.__payrollRelatedData = newData;
}, { deep: true, immediate: true });

// Watch for changes in payrollRows to trigger reactive updates for monthly cells
watch(payrollRows, (newRows, oldRows) => {
  // Ensure payrollRows is always an array
  if (!newRows || !Array.isArray(newRows)) {
    payrollRows.value = [];
    return;
  }
  
  if (newRows && oldRows) {
    // Check if any row's salary or count has changed
    newRows.forEach((newRow, index) => {
      const oldRow = oldRows[index];
      if (oldRow && (newRow.salary !== oldRow.salary || newRow.count !== oldRow.count)) {
        // Force reactive update for all monthly cells of this row
        if (visibleYears.value.length > 0) {
          const year = visibleYears.value[0];
          
          // Ensure data structure is properly initialized
          if (!payrollData.value[year]) {
            payrollData.value[year] = {};
          }
          if (!payrollData.value[year][newRow.id]) {
            payrollData.value[year][newRow.id] = {};
          }
          
          // Ensure count and salary structures are objects
          ensureCountDataStructure(newRow.id, year, payrollData);
          ensureSalaryDataStructure(newRow.id, year, payrollData);
          
          // Add a timestamp to force reactivity
          payrollData.value[year][newRow.id]._lastUpdate = Date.now();
          
          // If salary changed, update all monthly salary calculations
          if (newRow.salary !== oldRow.salary) {
            months.forEach(month => {
              const countValue = getPayrollCellValueLocal(newRow.id, 'count', year, month);
              const calculatedSalary = (countValue || 0) * (newRow.salary || 0);
              
              // Ensure salary data structure is correct
              ensureSalaryDataStructure(newRow.id, year, payrollData);
              payrollData.value[year][newRow.id].salary[month] = calculatedSalary;
            });
          }
        }
      }
    });
  }
  
  // No need to initialize monthly count cells since we're using getter/setter pattern
  // The monthly count cells will automatically get the main count value when no override exists
  
  // Cache the calculated values when payroll data changes
  cachePayrollRelatedValues();
}, { deep: true });

// When opening the modal, copy the current settings
watch(showAdvanced, (val) => {
  if (val) {
    tempAdvancedModes.value = { ...advancedModes.value };
  }
});



// Wrapper function for submitting payroll data
const submitPayrollDataWrapper = async () => {
  await submitPayrollData(selectedProject.value, payrollRows.value, async () => {
    // Reload data after submission
    await fetchPayrollData(selectedProject.value?.project_name);
  });
};

// On mount, initialize years
onMounted(async () => {
  try {
    isLoading.value = true;
    await initializeProjectService();
    await new Promise(resolve => setTimeout(resolve, 100));
    years.value = await loadYearOptions();

    // Ensure payrollRows is always an array
    if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
      payrollRows.value = [];
    }

    // Load initial payroll data if project is selected
    if (selectedProject.value) {
      await fetchPayrollData(selectedProject.value.project_name, fromYear.value, toYear.value);
      // Also load payroll related data
      await fetchPayrollRelatedData(selectedProject.value.project_name, fromYear.value, toYear.value);
      
      // Initialize global variables for payroll related functions
      window.__currentVisibleYears = visibleYears.value;
      window.__payrollRelatedData = payrollRelatedData.value;
    }

    originalPayrollData.value = cloneDeep(payrollRows.value);
    isSaved.value = true;
    isComponentReady.value = true;
    
    // Initialize total rooms from localStorage
    const savedRooms = localStorage.getItem('totalRooms');
    if (savedRooms) {
      totalRooms.value = parseInt(savedRooms) || 100;
    }
    
    // Check if we should show refresh success alert
    if (localStorage.getItem('showRefreshSuccess') === 'true') {
      localStorage.removeItem('showRefreshSuccess');
      alertService.success("Page refreshed successfully");
    }
    
    // Cache the calculated values after data is loaded
    cachePayrollRelatedValues();
  } catch (err) {
    console.error("Error loading data:", err);
  } finally {
    isLoading.value = false;
  }
});

// Watch for project changes and reload data
watch(selectedProject, async (newProject, oldProject) => {
 //  // console.log('Project changed from:', oldProject?.project_name, 'to:', newProject?.project_name);
  
  if (newProject) {
    try {
      isLoading.value = true;
     //  // console.log('Reloading Payroll data for new project:', newProject.project_name);
      
      // Reload Payroll data for the new project
      await fetchPayrollData(newProject.project_name, fromYear.value, toYear.value);
      originalPayrollData.value = cloneDeep(payrollRows.value);
      
      // Reload Payroll Related data for the new project
      await fetchPayrollRelatedData(newProject.project_name, fromYear.value, toYear.value);
      
      // Update global variables for payroll related functions
      window.__currentVisibleYears = visibleYears.value;
      window.__payrollRelatedData = payrollRelatedData.value;
      
      // Reset any unsaved changes
      changedCells.value = [];
      clearPayrollRelatedChanges();
      isSaved.value = true;
      saveError.value = "";
      
     //  // console.log('Payroll data reloaded successfully for project:', newProject.project_name);
      alertService.success(`Switched to project: ${newProject.project_name}`);
    } catch (error) {
      console.error('Error reloading Payroll data for new project:', error);
      alertService.error("Failed to load project data. Please try again.");
    } finally {
      isLoading.value = false;
    }
  } else {
    // Clear data when no project is selected
    payrollRows.value = [];
    originalPayrollData.value = cloneDeep(payrollRows.value);
    changedCells.value = [];
    clearPayrollRelatedChanges();
    isSaved.value = true;
    saveError.value = "";
  }
}, { deep: true });

// Watch for year range changes and reload data
watch([fromYear, toYear], async ([newFromYear, newToYear], [oldFromYear, oldToYear]) => {
  // Only reload if both years are selected and they've actually changed
  if (selectedProject.value && newFromYear && newToYear && 
      (newFromYear !== oldFromYear || newToYear !== oldToYear)) {
    try {
      isLoading.value = true;
      await fetchPayrollData(selectedProject.value.project_name, newFromYear, newToYear);
      // Also load payroll related data for the new year range
      await fetchPayrollRelatedData(selectedProject.value.project_name, newFromYear, newToYear);
      originalPayrollData.value = cloneDeep(payrollRows.value);
      
      // Update global variables for payroll related functions
      window.__currentVisibleYears = visibleYears.value;
      window.__payrollRelatedData = payrollRelatedData.value;
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
      
     //  // console.log(`Payroll data filtered for years ${newFromYear}-${newToYear}`);
    } catch (error) {
      console.error('Error reloading Payroll data for new year range:', error);
      alertService.error("Failed to load data for selected year range. Please try again.");
    } finally {
      isLoading.value = false;
    }
  }
}, { deep: true });


// Quick Actions functions
function toggleQuickActions() {
  showQuickActions.value = !showQuickActions.value;
}

async function createNewDepartment() {
  if (!newDepartmentName.value.trim()) {
    alertService.error('Please enter a department name');
    return;
  }

  try {
    isCreatingDepartment.value = true;
    const department = await createDepartment(newDepartmentName.value.trim());
    newDepartmentName.value = '';
    alertService.success(`Department "${department.department_name}" created successfully!`);
  } catch (error) {
    console.error('Error creating department:', error);
  } finally {
    isCreatingDepartment.value = false;
  }
}

async function createNewLocation() {
  if (!newLocationName.value.trim()) {
    alertService.error('Please enter a location name');
    return;
  }

  try {
    isCreatingLocation.value = true;
    const location = await createDepartmentLocation(newLocationName.value.trim());
    newLocationName.value = '';
    alertService.success(`Location "${location.department_location}" created successfully!`);
  } catch (error) {
    console.error('Error creating location:', error);
  } finally {
    isCreatingLocation.value = false;
  }
}

async function createNewDesignation() {
  if (!newDesignationName.value.trim()) {
    alertService.error('Please enter a designation name');
    return;
  }

  try {
    isCreatingDesignation.value = true;
    const designation = await createDesignation(newDesignationName.value.trim());
    newDesignationName.value = '';
    alertService.success(`Designation "${designation.designation_name}" created successfully!`);
  } catch (error) {
    console.error('Error creating designation:', error);
  } finally {
    isCreatingDesignation.value = false;
  }
}

// Wrapper function for saveChanges
const saveChangesWrapper = async () => {
  try {
    isSaving.value = true;
    saveError.value = "";
    
    let hasChanges = false;
    
    // Save payroll data changes
    if (changedCells.value.length > 0) {
      const result = await savePayrollChanges(changedCells.value, selectedProject.value?.project_name);
      changedCells.value = [];
      hasChanges = true;
    }
    
    // Save payroll related data changes
    if (hasPayrollRelatedChanges()) {
      const payrollRelatedChangesForAPI = getPayrollRelatedChangesForAPI();
      await savePayrollRelatedChanges(payrollRelatedChangesForAPI, selectedProject.value?.project_name);
      clearPayrollRelatedChanges();
      hasChanges = true;
    }
    
    if (!hasChanges) {
      isSaving.value = false;
      return;
    }
    
    // Reload from backend after save
    await fetchPayrollData(selectedProject.value?.project_name, fromYear.value, toYear.value);
    await fetchPayrollRelatedData(selectedProject.value?.project_name, fromYear.value, toYear.value);
    originalPayrollData.value = cloneDeep(payrollRows.value);
    
    // Update global variables for payroll related functions
    window.__currentVisibleYears = visibleYears.value;
    window.__payrollRelatedData = payrollRelatedData.value;
    
    isSaved.value = true;
    alertService.success("Changes saved successfully");
    isSaving.value = false;
  } catch (err) {
    saveError.value = err.message || "Failed to save changes";
    alertService.error(saveError.value);
    isSaving.value = false;
  }
};

// ************ Unsaved Changes Warning Modal ****************
// ************ Watch for unsaved changes to show warning on page refresh ****************
watch(isSaved, (newValue) => {
  if (!newValue) {
    // Add beforeunload event listener when there are unsaved changes
    window.addEventListener('beforeunload', handleBeforeUnload);
  } else {
    // Remove beforeunload event listener when changes are saved
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
});


// Clean up event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Watch for totalRooms changes
watch(totalRooms, (newValue) => {
  localStorage.setItem('totalRooms', newValue.toString());
});

// Check for Room Revenue total changes periodically
setInterval(() => {
  const roomRevenueTotal = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  if (roomRevenueTotal && parseInt(roomRevenueTotal) > 0) {
    const newTotal = parseInt(roomRevenueTotal);
    if (newTotal !== totalRooms.value && isSyncedWithRoomRevenue.value) {
      totalRooms.value = newTotal;
      localStorage.setItem('totalRooms', newTotal.toString());
    }
  }
}, 1000);



function getPayrollCellValueLocal(rowId, fieldType, year, month) {
  // Use the new getter/setter pattern for monthly count cells
  if (fieldType === 'count' && month) {
    return getMonthlyCountValue(rowId, year, month, payrollRows, payrollData);
  }
  
  // For salary calculations, ensure reactivity to monthly count changes
  if (fieldType === 'salary' && month) {
    // Force reactivity by accessing the monthly count data
    const countValue = getMonthlyCountValue(rowId, year, month, payrollRows, payrollData);
    const row = payrollRows.value.find(r => r.id === rowId);
    if (!row) return 0;
    
    // Calculate salary as count * base salary
    return (countValue || 0) * (row.salary || 0);
  }
  
  return getPayrollCellValue(payrollRows.value, payrollData, rowId, fieldType, year, month);
}

// ************ Getters ****************
function getUniqueCategoriesLocal() {
  return getUniqueCategories(payrollRows.value);
}

function getPayrollRowsForCategoryLocal(category) {
  return getPayrollRowsForCategory(payrollRows.value, category);
}

function getUniqueLocationsForCategoryLocal(category) {
  return getUniqueLocationsForCategory(payrollRows.value, category);
}

function getUniquePositionsForLocationLocal(category, location) {
  return getUniquePositionsForLocation(payrollRows.value, category, location);
}

function getPayrollRowsForPositionLocal(category, location, position) {
  return getPayrollRowsForPosition(payrollRows.value, category, location, position);
}

function getPayrollRowsForLocationLocal(category, location) {
  return getPayrollRowsForLocation(payrollRows.value, category, location);
}

function formatCurrencyLocal(value) {
  return formatCurrency(value);
}

function resetToDefaultLocal() {
  resetToDefault(payrollRows.value);
  alertService.success('Payroll data has been reset to default.');
}

// Local wrapper functions for calculations
function calculateSubTotalManagementLocal(category, location) {
  return calculateSubTotalManagement(payrollRows.value, category, location);
}

function calculateSubTotalManagementCountLocal(category, location) {
  return calculateSubTotalManagementCount(payrollRows.value, category, location);
}

function calculateSubTotalManagementMonthlyCountLocal(category, location, year, month) {
  return calculateSubTotalManagementMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
}

// ************ Local Functions ****************
function calculateSubTotalManagementAnnualLocal(category, location, year) {
  return calculateSubTotalManagementAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
}

function calculateSubTotalNonManagementLocal(category, location) {
  return calculateSubTotalNonManagement(payrollRows.value, category, location);
}

function calculateSubTotalNonManagementCountLocal(category, location) {
  return calculateSubTotalNonManagementCount(payrollRows.value, category, location);
}

function calculateSubTotalNonManagementMonthlyCountLocal(category, location, year, month) {
  return calculateSubTotalNonManagementMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
}


function calculateSubTotalNonManagementAnnualLocal(category, location, year) {
  return calculateSubTotalNonManagementAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
}

function calculateLocationTotalLocal(category, location) {
  return calculateLocationTotal(payrollRows.value, category, location);
}

function calculateLocationTotalCountLocal(category, location) {
  return calculateLocationTotalCount(payrollRows.value, category, location);
}

function calculateLocationTotalMonthlyCountLocal(category, location, year, month) {
  return calculateLocationTotalMonthlyCount(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
}


function calculateLocationTotalAnnualLocal(category, location, year) {
  return calculateLocationTotalAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
}

// Hotel Total Local Functions
function calculateHotelTotalLocal() {
 //  // console.log('calculateHotelTotalLocal called');
 //  // console.log('payrollRows.value:', payrollRows.value);
  
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  const result = calculateHotelTotal(payrollRows.value);
 //  // console.log('calculateHotelTotalLocal result:', result);
  return result;
}

function calculateHotelTotalMonthlyCountLocal(year, month) {
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  return calculateHotelTotalMonthlyCount(payrollRows.value, year, month, getPayrollCellValueLocal);
}


function calculateHotelTotalAnnualLocal(year) {
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  return calculateHotelTotalAnnual(payrollRows.value, year, getPayrollCellValueLocal);
}

// Employee/Room Ratio Local Functions
function calculateEmployeeRoomRatioLocal() {
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  return calculateEmployeeRoomRatio(payrollRows.value, totalRooms.value);
}

function calculateEmployeeRoomRatioMonthlyLocal(year, month) {
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  return calculateEmployeeRoomRatioMonthly(payrollRows.value, year, month, getPayrollCellValueLocal, totalRooms.value);
}


function calculateEmployeeRoomRatioAnnualLocal(year) {
  // Defensive check for payrollRows.value
  if (!payrollRows.value || !Array.isArray(payrollRows.value)) {
    return 0;
  }
  
  return calculateEmployeeRoomRatioAnnual(payrollRows.value, year, getPayrollCellValueLocal, totalRooms.value);
}


// Safe wrapper methods for hotel total calculations
function safeCalculateHotelTotalTaxPercentageLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    console.warn('safeCalculateHotelTotalTaxPercentageLocal called with empty or undefined payrollRows');
    return '0.00';
  }
  return calculateHotelTotalTaxPercentageLocal(payrollRows.value);
}

// Function to get column labels for a specific year
const getColumnLabelsForYear = (year) => {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Function to cache payroll related values
function cachePayrollRelatedValues() {
  try {
    if (!selectedProject.value?.project_name || !visibleYears.value?.length) return;
    
    const project = selectedProject.value.project_name;
    const years = visibleYears.value;
    
    // Cache NSSIT (Payroll Taxes)
    const nssitValue = parseFloat(safeCalculateHotelTotalTaxTotalLocal().replace(/[,$]/g, '') || '0');
    if (nssitValue > 0) {
      years.forEach(year => {
        const labels = getColumnLabelsForYear(year);
        labels.forEach(label => {
          calculationCache.setValue(project, PAGE.PAYROLL_TAXES, 'NSSIT', year, label, nssitValue);
        });
        // Cache yearly total
        calculationCache.setValue(project, PAGE.PAYROLL_TAXES, 'NSSIT', year, 'ALL', nssitValue * labels.length);
      });
    }
    
    // Cache Payroll Related values
    const payrollRelatedValues = {
      'vacation': parseFloat(safeCalculateHotelTotalVacationLocal().replace(/[,$]/g, '') || '0'),
      'relocation': parseFloat(safeCalculateHotelTotalRelocationLocal().replace(/[,$]/g, '') || '0'),
      'severence & indemnity': parseFloat(safeCalculateHotelTotalSeverenceIndemnityLocal().replace(/[,$]/g, '') || '0'),
      'other': parseFloat(safeCalculateHotelTotalOtherLocal().replace(/[,$]/g, '') || '0'),
      'medical': parseFloat(safeCalculateHotelTotalMedicalLocal().replace(/[,$]/g, '') || '0'),
      'uniforms': parseFloat(safeCalculateHotelTotalUniformsLocal().replace(/[,$]/g, '') || '0'),
      'employee_meal': parseFloat(safeCalculateHotelTotalEmployeeMealLocal().replace(/[,$]/g, '') || '0'),
      'transport': parseFloat(safeCalculateHotelTotalTransportLocal().replace(/[,$]/g, '') || '0'),
      'telephone': parseFloat(safeCalculateHotelTotalTelephoneLocal().replace(/[,$]/g, '') || '0'),
      'air_ticket': parseFloat(safeCalculateHotelTotalAirTicketLocal().replace(/[,$]/g, '') || '0'),
      'other_benefits': parseFloat(safeCalculateHotelTotalBenefitsOtherLocal().replace(/[,$]/g, '') || '0')
    };
    
    // Cache each payroll related value
    Object.entries(payrollRelatedValues).forEach(([rowCode, value]) => {
      if (value > 0) {
        years.forEach(year => {
          const labels = getColumnLabelsForYear(year);
          labels.forEach(label => {
            calculationCache.setValue(project, PAGE.PAYROLL_RELATED, rowCode, year, label, value);
          });
          // Cache yearly total
          calculationCache.setValue(project, PAGE.PAYROLL_RELATED, rowCode, year, 'ALL', value * labels.length);
        });
      }
    });
    
    console.log('Payroll Related: Cached values to calculationCache');
  } catch (error) {
    console.error('Payroll Related: Error caching values:', error);
  }
}

function safeCalculateHotelTotalTaxTotalLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalTaxTotalLocal(payrollRows.value);
}

function safeCalculateHotelTotalVacationLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalVacationLocal(payrollRows.value);
}

function safeCalculateHotelTotalRelocationLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalRelocationLocal(payrollRows.value);
}

function safeCalculateHotelTotalSeverenceIndemnityLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalSeverenceIndemnityLocal(payrollRows.value);
}

function safeCalculateHotelTotalOtherLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalOtherLocal(payrollRows.value);
}

function safeCalculateHotelTotalMedicalLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalMedicalLocal(payrollRows.value);
}

function safeCalculateHotelTotalUniformsLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalUniformsLocal(payrollRows.value);
}

function safeCalculateHotelTotalEmployeeMealLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalEmployeeMealLocal(payrollRows.value);
}

function safeCalculateHotelTotalTransportLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalTransportLocal(payrollRows.value);
}

function safeCalculateHotelTotalTelephoneLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalTelephoneLocal(payrollRows.value);
}

function safeCalculateHotelTotalAirTicketLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalAirTicketLocal(payrollRows.value);
}

function safeCalculateHotelTotalBenefitsOtherLocal() {
  if (!payrollRows.value || !Array.isArray(payrollRows.value) || payrollRows.value.length === 0) {
    return formatMoney(0);
  }
  return calculateHotelTotalBenefitsOtherLocal(payrollRows.value);
}

// Settings Modal Functions
function openSettings() {
  showSettingsModal.value = true;
}

function closeSettings() {
  showSettingsModal.value = false;
}
</script>


<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>