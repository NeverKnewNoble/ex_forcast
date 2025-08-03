<template>
  <div class="flex ">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
      <!-- Main Content Area -->
      <div class="flex">
        <!-- Left Sidebar - Filters and Controls -->
        <div :class="['bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 min-h-screen flex flex-col shadow-sm transition-all duration-300', sidebarCollapsed ? 'w-14 p-2' : 'w-80 p-6']">
          <!-- Collapse/Expand Button -->
          <button @click="sidebarCollapsed = !sidebarCollapsed" class="mb-4 flex items-center gap-2 px-2 py-1 bg-violet-100 hover:bg-violet-200 rounded transition-all">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-5 h-5 text-violet-700" />
            <ChevronRight v-else class="w-5 h-5 text-violet-700" />
            <span v-if="!sidebarCollapsed" class="text-violet-700 text-sm font-medium">Collapse</span>
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
                  v-if="!isSaved"
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
                v-if="!isSaving && !isSaved"
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
                  <button 
                    disabled
                    @click="showAdvanced = true" 
                    class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-200 border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                  >
                    <Settings class="w-4 h-4" />
                    Advanced
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
                      :class="isSyncedWithRoomRevenue 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                        : 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-200'"
                    >
                      <RefreshCw class="w-4 h-4" />
                      {{ isSyncedWithRoomRevenue ? 'Synced' : 'Unsynced' }}
                    </button>
                    
                    <p class="text-xs text-gray-500 mt-2 text-center">
                      {{ isSyncedWithRoomRevenue 
                        ? 'Your total rooms are synchronized with the Room Revenue page' 
                        : 'Click to sync with the total rooms from Room Revenue page' }}
                    </p>
                  </div>
                  
                  <!-- <p class="text-xs text-gray-500 flex items-center gap-1">
                    This value is used for payroll calculations and projections
                  </p> -->
                  

          
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
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
              <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <CircleAlert class="w-8 h-8 text-violet-500" />
              </div>
              <h3 class="text-lg text-violet-700 font-semibold mb-2">No Project Selected</h3>
              <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                Please select a project from the dashboard to view and manage payroll data.
              </p>
              <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                <ArrowLeft class="w-3 h-3" />
                <span>Use the project selector in the dashboard to get started</span>
              </div>
            </div>
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
              <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <Ellipsis class="w-8 h-8 text-violet-500" />
                </div>
                <h3 class="text-lg text-violet-700 font-semibold mb-2">No Payroll Data</h3>
                <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                  There is no payroll data for the selected year range. Add some payroll data to get started.
                </p>
                <div class="mt-6 flex gap-3">
                  <button 
                    @click="openAddPayrollModal"
                    :disabled="!selectedProject"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                      selectedProject 
                        ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-md' 
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Payroll Data
                  </button>
                </div>
              </div>
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
                            :colspan="isYearCollapsed(visibleYears[0]) ? 1 : 12" 
                            class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm cursor-pointer select-none hover:bg-violet-700 transition-all duration-200 group"
                            @click="toggleCollapse(visibleYears[0])"
                            title="Click to collapse/expand"
                          >
                            <div class="flex items-center justify-center gap-1">
                              <span class="font-semibold">{{ visibleYears[0] }}</span>
                              <ChevronDown 
                                v-if="!isYearCollapsed(visibleYears[0])" 
                                class="w-3 h-3 transition-transform group-hover:scale-110" 
                              />
                              <ChevronRight 
                                v-else 
                                class="w-3 h-3 transition-transform group-hover:scale-110" 
                              />
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
                            v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])" 
                            :colspan="12" 
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
                            v-if="!isYearCollapsed(visibleYears[0])"
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
                              :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0) + 13" 
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
                                :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0) + 13" 
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
                                  class="px-3 py-2 text-right border-r border-violet-200 font-mono text-sm"
                                  contenteditable="true"
                                  :key="row.id + '-salary'"
                                  @input="handleTableSalaryInput(row, $event)"
                                  @focus="handleTableSalaryFocus(row, $event)"
                                  @blur="handleTableSalaryBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  {{ formatMoney(row.salary) }}
                                </td>
                                <!-- Count (Editable, Reactive, row.count) -->
                                <td
                                  class="px-3 py-2 text-right border-r border-violet-200 font-mono text-sm"
                                >
                                  {{ row.count }}
                                </td>
                                <!-- Monthly Count cells -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'count-cell-' + month + '-' + (getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) || 0)"
                                    contenteditable="true"
                                    class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                    @input="handlePayrollCellInput(row.id, 'count', visibleYears[0], month, $event)"
                                    @focus="handlePayrollCellFocus(row.id, 'count', visibleYears[0], month, $event)"
                                    @blur="handlePayrollCellEditLocal(row.id, 'count', visibleYears[0], month, $event)"
                                    @keypress="allowOnlyNumbers($event)"
                                  >
                                    <span class="font-mono text-xs">{{ getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) }}</span>
                                  </td>
                                </template>
                                
                                <!-- Payroll Taxes cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-green-200 hover:bg-green-50 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 bg-green-50"
                                  contenteditable="true"
                                  :key="row.id + '-tax-percentage'"
                                  @input="handleTaxPercentageInput(row, $event)"
                                  @focus="handleTaxPercentageFocus(row, $event)"
                                  @blur="handleTaxPercentageBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-green-700">{{ getTaxPercentage(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-green-200 hover:bg-green-50 outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 bg-green-50"
                                  contenteditable="true"
                                  :key="row.id + '-tax-total'"
                                  @input="handleTaxTotalInput(row, $event)"
                                  @focus="handleTaxTotalFocus(row, $event)"
                                  @blur="handleTaxTotalBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-green-700">{{ getTaxTotal(row) || '0.00' }}</span>
                                </td>
                                
                                <!-- Supplementary Pay cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-vacation'"
                                  @input="handleVacationInput(row, $event)"
                                  @focus="handleVacationFocus(row, $event)"
                                  @blur="handleVacationBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-yellow-700">{{ getVacation(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-relocation'"
                                  @input="handleRelocationInput(row, $event)"
                                  @focus="handleRelocationFocus(row, $event)"
                                  @blur="handleRelocationBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-yellow-700">{{ getRelocation(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-severence-indemnity'"
                                  @input="handleSeverenceIndemnityInput(row, $event)"
                                  @focus="handleSeverenceIndemnityFocus(row, $event)"
                                  @blur="handleSeverenceIndemnityBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-yellow-700">{{ getSeverenceIndemnity(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 bg-yellow-50"
                                  contenteditable="true"
                                  :key="row.id + '-other'"
                                  @input="handleOtherInput(row, $event)"
                                  @focus="handleOtherFocus(row, $event)"
                                  @blur="handleOtherBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-yellow-700">{{ getOther(row) || '0.00' }}</span>
                                </td>
                                
                                <!-- Employee Benefits cells -->
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-medical'"
                                  @input="handleMedicalInput(row, $event)"
                                  @focus="handleMedicalFocus(row, $event)"
                                  @blur="handleMedicalBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getMedical(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-uniforms'"
                                  @input="handleUniformsInput(row, $event)"
                                  @focus="handleUniformsFocus(row, $event)"
                                  @blur="handleUniformsBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getUniforms(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-employee-meal'"
                                  @input="handleEmployeeMealInput(row, $event)"
                                  @focus="handleEmployeeMealFocus(row, $event)"
                                  @blur="handleEmployeeMealBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getEmployeeMeal(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-transport'"
                                  @input="handleTransportInput(row, $event)"
                                  @focus="handleTransportFocus(row, $event)"
                                  @blur="handleTransportBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getTransport(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-telephone'"
                                  @input="handleTelephoneInput(row, $event)"
                                  @focus="handleTelephoneFocus(row, $event)"
                                  @blur="handleTelephoneBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getTelephone(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-air-ticket'"
                                  @input="handleAirTicketInput(row, $event)"
                                  @focus="handleAirTicketFocus(row, $event)"
                                  @blur="handleAirTicketBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getAirTicket(row) || '0.00' }}</span>
                                </td>
                                <td 
                                  class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-blue-50"
                                  contenteditable="true"
                                  :key="row.id + '-benefits-other'"
                                  @input="handleBenefitsOtherInput(row, $event)"
                                  @focus="handleBenefitsOtherFocus(row, $event)"
                                  @blur="handleBenefitsOtherBlur(row, $event)"
                                  @keypress="allowOnlyNumbers($event)"
                                >
                                  <span class="font-mono text-xs text-blue-700">{{ getBenefitsOther(row) || '0.00' }}</span>
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
                                <span class="font-mono text-sm font-semibold text-violet-900">{{ calculateSubTotalManagementLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for subtotal -->
                              <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                <td 
                                  v-for="month in months" 
                                  :key="'subtotal-mgmt-count-' + month"
                                  class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                >
                                  <span class="font-mono text-xs text-violet-900">{{ calculateSubTotalManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateSubTotalManagementTaxPercentageLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateSubTotalManagementTaxTotalLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementVacationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementRelocationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementSeverenceIndemnityLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalManagementOtherLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementMedicalLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementUniformsLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementEmployeeMealLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTransportLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementTelephoneLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementAirTicketLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalManagementBenefitsOtherLocal(category, location) }}</span>
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
                                <span class="font-mono text-sm font-semibold text-violet-900">{{ calculateSubTotalNonManagementLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for subtotal -->
                              <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                <td 
                                  v-for="month in months" 
                                  :key="'subtotal-nonmgmt-count-' + month"
                                  class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                >
                                  <span class="font-mono text-xs text-violet-900">{{ calculateSubTotalNonManagementMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateSubTotalNonManagementTaxPercentageLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateSubTotalNonManagementTaxTotalLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementVacationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementRelocationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementSeverenceIndemnityLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateSubTotalNonManagementOtherLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for subtotal -->
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementMedicalLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementUniformsLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementEmployeeMealLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTransportLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementTelephoneLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementAirTicketLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-1.5 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-semibold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateSubTotalNonManagementBenefitsOtherLocal(category, location) }}</span>
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
                                <span class="font-mono text-sm font-bold text-violet-900">{{ calculateLocationTotalLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Monthly Count cells for total -->
                              <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                <td 
                                  v-for="month in months" 
                                  :key="'total-count-' + month"
                                  class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                >
                                  <span class="font-mono text-xs text-violet-900">{{ calculateLocationTotalMonthlyCountLocal(category, location, visibleYears[0], month) }}</span>
                                </td>
                              </template>
                              
                              <!-- Payroll Taxes cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateLocationTotalTaxPercentageLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ calculateLocationTotalTaxTotalLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Supplementary Pay cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalVacationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalRelocationLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalSeverenceIndemnityLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                              >
                                <span class="font-mono text-xs text-yellow-900">{{ calculateLocationTotalOtherLocal(category, location) }}</span>
                              </td>
                              
                              <!-- Employee Benefits cells for total -->
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalMedicalLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalUniformsLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalEmployeeMealLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTransportLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalTelephoneLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalAirTicketLocal(category, location) }}</span>
                              </td>
                              <td 
                                class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                              >
                                <span class="font-mono text-xs text-blue-900">{{ calculateLocationTotalBenefitsOtherLocal(category, location) }}</span>
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
                            <span class="font-mono text-sm font-bold text-violet-900">{{ calculateHotelTotalLocal() }}</span>
                          </td>
                          
                          <!-- Monthly Count cells for hotel total -->
                          <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                            <td 
                              v-for="month in months" 
                              :key="'hotel-count-' + month"
                              class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-indigo-100 font-bold"
                            >
                              <span class="font-mono text-xs text-violet-900">{{ calculateHotelTotalMonthlyCountLocal(visibleYears[0], month) }}</span>
                            </td>
                          </template>
                          
                          <!-- Payroll Taxes cells for hotel total -->
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class="font-mono text-xs text-green-900">{{ calculateHotelTotalTaxPercentageLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class="font-mono text-xs text-green-900">{{ calculateHotelTotalTaxTotalLocal() }}</span>
                          </td>
                          
                          <!-- Supplementary Pay cells for hotel total -->
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalVacationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalRelocationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalSeverenceIndemnityLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateHotelTotalOtherLocal() }}</span>
                          </td>
                          
                          <!-- Employee Benefits cells for hotel total -->
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalMedicalLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalUniformsLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalEmployeeMealLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTransportLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalTelephoneLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalAirTicketLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateHotelTotalBenefitsOtherLocal() }}</span>
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
                            <span class="font-mono text-sm font-bold text-green-900">{{ calculateEmployeeRoomRatioLocal() }}</span>
                          </td>
                          
                          <!-- Monthly Count cells for ratio -->
                          <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                            <td 
                              v-for="month in months" 
                              :key="'ratio-count-' + month"
                              class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 font-bold"
                            >
                              <span class="font-mono text-xs text-green-900">{{ calculateEmployeeRoomRatioMonthlyLocal(visibleYears[0], month) }}</span>
                            </td>
                          </template>
                          
                          <!-- Payroll Taxes cells for ratio -->
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class="font-mono text-xs text-green-900">{{ calculateEmployeeRoomRatioTaxPercentageLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-green-200 font-bold"
                          >
                            <span class="font-mono text-xs text-green-900">{{ calculateEmployeeRoomRatioTaxTotalLocal() }}</span>
                          </td>
                          
                          <!-- Supplementary Pay cells for ratio -->
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioVacationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioRelocationLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioSeverenceIndemnityLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-yellow-300 bg-gradient-to-r from-yellow-100 to-yellow-200 font-bold"
                          >
                            <span class="font-mono text-xs text-yellow-900">{{ calculateEmployeeRoomRatioOtherLocal() }}</span>
                          </td>
                          
                          <!-- Employee Benefits cells for ratio -->
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioMedicalLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioUniformsLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioEmployeeMealLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTransportLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioTelephoneLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioAirTicketLocal() }}</span>
                          </td>
                          <td 
                            class="px-2 py-2 text-right border border-blue-300 bg-gradient-to-r from-blue-100 to-blue-200 font-bold"
                          >
                            <span class="font-mono text-xs text-blue-900">{{ calculateEmployeeRoomRatioBenefitsOtherLocal() }}</span>
                          </td>

                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <!-- Enhanced No Years Selected State -->
          <template v-else-if="selectedProject">
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
              <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <CircleAlert class="w-8 h-8 text-violet-500" />
              </div>
              <h3 class="text-lg text-violet-700 font-semibold mb-2">
                {{ fromYear && !toYear ? 'Select "To Year"' : !fromYear && toYear ? 'Select "From Year"' : 'No Years Selected' }}
              </h3>
              <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the expense table.' : 
                   !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the expense table.' :
                     'Please select both "From Year" and "To Year" in the left panel to display the expense table.' }}
              </p>
              <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                <ArrowLeft class="w-3 h-3" />
                <span>Use the filters on the left to get started</span>
              </div>
            </div>
          </template>
          
          <!-- Fallback for when project is selected but no years -->
          <template v-else>
            <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
              <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                <CircleAlert class="w-8 h-8 text-violet-500" />
              </div>
              <h3 class="text-lg text-violet-700 font-semibold mb-2">No Project Selected</h3>
              <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                Please select a project from the dashboard to view and manage payroll data.
              </p>
              <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                <ArrowLeft class="w-3 h-3" />
                <span>Use the project selector in the dashboard to get started</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>


  <!-- Advanced Setting Modal -->
  <transition name="fade">
    <div
      v-if="showAdvanced"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <Settings class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Advanced Display Mode Settings</h2>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pt-6">
          <!-- Message when no years selected -->
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure advanced settings.</span>
          </div>

          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'adv-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                {{ year }}
              </span>
              <select
                v-model="tempAdvancedModes[year]"
                class="px-6 py-2 border rounded-md focus:ring-violet-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="cancelAdvancedSettings"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Cancel
          </button>
          <button
            v-if="visibleYears.length"
            @click="applyAdvancedSettings"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>
    </div>
  </transition>



</template>




<script setup>
import { ref, onMounted, computed, watch, onUnmounted, reactive, nextTick } from "vue";
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import Sidebar from "@/components/ui/Sidebar.vue";
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
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
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
import { 
  transformApiToFrontend, 
  transformFrontendToApi, 
  validatePayrollData
} from '@/components/utility/payroll/data_constructors/index.js';




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
const isComponentReady = ref(false); // Add a flag to track if component is ready

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
const isSyncedWithRoomRevenue = computed(() => {
  const roomRevenueTotal = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  return roomRevenueTotal && parseInt(roomRevenueTotal) > 0 && 
         parseInt(roomRevenueTotal) === totalRooms.value;
});


//! Helper function to safely format numbers to 2 decimal places with commas
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
});

// Watch for changes in payrollData to ensure calculated fields update
watch(payrollData, (newData, oldData) => {
  // console.log('payrollData changed:', newData);
}, { deep: true, immediate: true });

// Watch for changes in payrollRows to trigger reactive updates for monthly cells
watch(payrollRows, (newRows, oldRows) => {
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
          ensureCountDataStructure(newRow.id, year);
          ensureSalaryDataStructure(newRow.id, year);
          
          // Add a timestamp to force reactivity
          payrollData.value[year][newRow.id]._lastUpdate = Date.now();
          
          // If salary changed, update all monthly salary calculations
          if (newRow.salary !== oldRow.salary) {
            months.forEach(month => {
              const countValue = getPayrollCellValueLocal(newRow.id, 'count', year, month);
              const calculatedSalary = (countValue || 0) * (newRow.salary || 0);
              
              // Ensure salary data structure is correct
              ensureSalaryDataStructure(newRow.id, year);
              payrollData.value[year][newRow.id].salary[month] = calculatedSalary;
            });
          }
        }
      }
    });
  }
  
  // No need to initialize monthly count cells since we're using getter/setter pattern
  // The monthly count cells will automatically get the main count value when no override exists
}, { deep: true });

// When opening the modal, copy the current settings
watch(showAdvanced, (val) => {
  if (val) {
    tempAdvancedModes.value = { ...advancedModes.value };
  }
});

function applyAdvancedSettings() {
  setAdvancedModes({ ...tempAdvancedModes.value });
  showAdvanced.value = false;
}

function cancelAdvancedSettings() {
  showAdvanced.value = false;
}



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
    await initializeProjectService();
    await new Promise(resolve => setTimeout(resolve, 100));
    years.value = await loadYearOptions();

    // Load initial payroll data if project is selected
    if (selectedProject.value) {
      await fetchPayrollData(selectedProject.value.project_name, fromYear.value, toYear.value);
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
  } catch (err) {
    console.error("Error loading data:", err);
  }
});

// Watch for project changes and reload data
watch(selectedProject, async (newProject, oldProject) => {
  // console.log('Project changed from:', oldProject?.project_name, 'to:', newProject?.project_name);
  
  if (newProject) {
    try {
      // console.log('Reloading Payroll data for new project:', newProject.project_name);
      
      // Reload Payroll data for the new project
      await fetchPayrollData(newProject.project_name, fromYear.value, toYear.value);
      originalPayrollData.value = cloneDeep(payrollRows.value);
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
      
      // console.log('Payroll data reloaded successfully for project:', newProject.project_name);
      alertService.success(`Switched to project: ${newProject.project_name}`);
    } catch (error) {
      console.error('Error reloading Payroll data for new project:', error);
      alertService.error("Failed to load project data. Please try again.");
    }
  } else {
    // Clear data when no project is selected
    payrollRows.value = [];
    originalPayrollData.value = cloneDeep(payrollRows.value);
    changedCells.value = [];
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
      await fetchPayrollData(selectedProject.value.project_name, newFromYear, newToYear);
      originalPayrollData.value = cloneDeep(payrollRows.value);
      
      // Reset any unsaved changes
      changedCells.value = [];
      isSaved.value = true;
      saveError.value = "";
      
      // console.log(`Payroll data filtered for years ${newFromYear}-${newToYear}`);
    } catch (error) {
      console.error('Error reloading Payroll data for new year range:', error);
      alertService.error("Failed to load data for selected year range. Please try again.");
    }
  }
}, { deep: true });

function clearYearSelection() {
  clearYearSettings();
  isSaved.value = false;
}

// Helper function to ensure count data structure is correct
function ensureCountDataStructure(rowId, year) {
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  if (typeof payrollData.value[year][rowId]['count'] !== 'object' || 
      payrollData.value[year][rowId]['count'] === null ||
      Array.isArray(payrollData.value[year][rowId]['count'])) {
    payrollData.value[year][rowId]['count'] = {};
  }
}

// Helper function to ensure salary data structure is correct
function ensureSalaryDataStructure(rowId, year) {
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  if (typeof payrollData.value[year][rowId]['salary'] !== 'object' || 
      payrollData.value[year][rowId]['salary'] === null ||
      Array.isArray(payrollData.value[year][rowId]['salary'])) {
    payrollData.value[year][rowId]['salary'] = {};
  }
}

// Function to get monthly count value with getter/setter pattern
function getMonthlyCountValue(rowId, year, month) {
  const row = payrollRows.value.find(r => r.id === rowId);
  if (!row) return 0;
  
  // Ensure the data structure is correct
  ensureCountDataStructure(rowId, year);
  
  // Check if there's an override for this specific month
  const countData = payrollData.value[year]?.[rowId]?.['count'];
  if (countData && typeof countData === 'object' && countData !== null && !Array.isArray(countData)) {
    const overrideValue = countData[month];
    if (overrideValue !== undefined && overrideValue !== null) {
      return overrideValue;
    }
  }
  
  // If no override exists, return the main count value (getter behavior)
  return row.count || 0;
}

// Function to set monthly count value with getter/setter pattern
function setMonthlyCountValue(rowId, year, month, newValue) {
  // Ensure the data structure is correct
  ensureCountDataStructure(rowId, year);
  
  // Store the override value for this specific month
  payrollData.value[year][rowId]['count'][month] = newValue;
}

function handlePayrollCellEditLocal(rowId, fieldType, year, month, event) {
  const newValue = parseFloat(event.target.textContent) || 0;
  
  // Store the value in payrollData for immediate reactivity
  if (!payrollData.value[year]) {
    payrollData.value[year] = {};
  }
  if (!payrollData.value[year][rowId]) {
    payrollData.value[year][rowId] = {};
  }
  
  // For count fields, use the setter pattern
  if (fieldType === 'count' && month) {
    // Use the setter function to store the override value
    setMonthlyCountValue(rowId, year, month, newValue);
  } else {
    // For other fields, store globally
    payrollData.value[year][rowId][fieldType] = newValue;
  }
  
  // Call the original handler for change tracking
  // This will add the change to changedCells array for saving to backend
  handlePayrollCellEdit(changedCells.value, rowId, fieldType, year, month, event);
  isSaved.value = false;
  
  // If this is a count field change, trigger reactive update for salary cells
  if (fieldType === 'count' && month) {
    // Force a reactive update by triggering a small change to the payrollData
    // This will cause Vue to re-evaluate the salary cells
    payrollData.value[year][rowId]._lastUpdate = Date.now();
    
    // Also trigger a more explicit update for the specific month
    if (!payrollData.value[year][rowId].monthlyUpdates || 
        typeof payrollData.value[year][rowId].monthlyUpdates !== 'object' ||
        Array.isArray(payrollData.value[year][rowId].monthlyUpdates)) {
      payrollData.value[year][rowId].monthlyUpdates = {};
    }
    payrollData.value[year][rowId].monthlyUpdates[month] = Date.now();
    
    // Force reactivity for salary calculations by updating the salary field
    // This ensures Vue detects the dependency change
    const row = payrollRows.value.find(r => r.id === rowId);
    if (row) {
      // Trigger a reactive update by accessing the salary calculation
      const countValue = getMonthlyCountValue(rowId, year, month);
      const calculatedSalary = (countValue || 0) * (row.salary || 0);
      
      // Store this in payrollData to ensure reactivity
      ensureSalaryDataStructure(rowId, year);
      payrollData.value[year][rowId].salary[month] = calculatedSalary;
      
      // Force a reactive update by triggering nextTick
      nextTick(() => {
        // This will ensure Vue re-evaluates the salary cells
        payrollData.value[year][rowId]._forceUpdate = Date.now();
      });
    }
  }
}

function handlePayrollCellInput(rowId, fieldType, year, month, event) {
  // Allow only numbers and decimal point for salary and annual fields
  if (fieldType === 'salary' || fieldType === 'annual') {
    const value = event.target.textContent.replace(/[^0-9.]/g, '');
    event.target.textContent = value;
  }
  // Allow only numbers for count fields
  if (fieldType === 'count') {
    const value = event.target.textContent.replace(/[^0-9]/g, '');
    event.target.textContent = value;
  }
}

function handlePayrollCellFocus(rowId, fieldType, year, month, event) {
  // Format the number when user starts editing salary or annual fields
  if (fieldType === 'salary' || fieldType === 'annual') {
    // For salary cells, get the raw calculated value
    if (fieldType === 'salary' && month) {
      const rawValue = getPayrollCellValueLocal(rowId, fieldType, year, month);
      event.target.textContent = rawValue.toString();
    } else {
      // For other fields, parse the current text content
      const value = parseFloat(event.target.textContent.replace(/[^0-9.]/g, ''));
      if (!isNaN(value)) {
        // Show the raw number without commas for easier editing
        event.target.textContent = value.toString();
      }
    }
  }
  // For count fields, show the raw number for easier editing
  if (fieldType === 'count') {
    const rawValue = getPayrollCellValueLocal(rowId, fieldType, year, month);
    event.target.textContent = rawValue.toString();
  }
}

// Modal Salary Handlers (using robust pattern like monthly cells)
function handleModalSalaryInput(event, row) {
  // Allow only numbers and decimal point
  let value = event.target.value.replace(/[^0-9.]/g, '');
  row.salary = value;
}

function handleModalSalaryFocus(event, row) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.salary;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9.]/g, '');
  }
  event.target.value = rawValue || '';
}

function handleModalSalaryBlur(event, row) {
  // Get the raw value from the input
  let rawValue = event.target.value.replace(/[^0-9.]/g, '');
  
  // If the raw value is empty or invalid, use the original salary
  if (!rawValue || rawValue === '') {
    // Restore the original formatted value
    event.target.value = formatMoney(row.salary);
    return;
  }
  
  // Parse as a number (treat as whole number, not decimal)
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Store the value as a number (not formatted)
    row.salary = value;
    // Display the formatted value
    event.target.value = formatMoney(value);
  } else {
    // If invalid, restore the original value
    event.target.value = formatMoney(row.salary);
  }
}

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
    
    if (changedCells.value.length === 0) {
      isSaving.value = false;
      return;
    }
    
    // Save payroll data changes
    const result = await savePayrollChanges(changedCells.value, selectedProject.value?.project_name);
    
    // Clear changed cells BEFORE reloading data to prevent rowId mismatch
    changedCells.value = [];
    
    // Reload from backend after save
    await fetchPayrollData(selectedProject.value?.project_name, fromYear.value, toYear.value);
    originalPayrollData.value = cloneDeep(payrollRows.value);
    isSaved.value = true;
    alertService.success("Changes saved successfully");
    isSaving.value = false;
    return result;
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

// Handle beforeunload event to show warning
function handleBeforeUnload(event) {
  if (!isSaved.value) {
    // Standard browser warning
    event.preventDefault();
    event.returnValue = 'You have unsaved changes that may be discarded if not saved. Are you sure you want to leave?';
    return event.returnValue;
  }
}

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

// Refresh table functionality - reload entire page
function refreshTable() {
  // Set flag to show success alert after reload
  localStorage.setItem('showRefreshSuccess', 'true');
  // Reload the entire page
  window.location.reload();
}

function getPayrollCellValueLocal(rowId, fieldType, year, month) {
  // Use the new getter/setter pattern for monthly count cells
  if (fieldType === 'count' && month) {
    return getMonthlyCountValue(rowId, year, month);
  }
  
  // For salary calculations, ensure reactivity to monthly count changes
  if (fieldType === 'salary' && month) {
    // Force reactivity by accessing the monthly count data
    const countValue = getMonthlyCountValue(rowId, year, month);
    const row = payrollRows.value.find(r => r.id === rowId);
    if (!row) return 0;
    
    // Calculate salary as count * base salary
    return (countValue || 0) * (row.salary || 0);
  }
  
  return getPayrollCellValue(payrollRows.value, payrollData, rowId, fieldType, year, month);
}


  
  

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
  // console.log('calculateHotelTotalLocal called');
  // console.log('payrollRows.value:', payrollRows.value);
  const result = calculateHotelTotal(payrollRows.value);
  // console.log('calculateHotelTotalLocal result:', result);
  return result;
}

function calculateHotelTotalMonthlyCountLocal(year, month) {
  return calculateHotelTotalMonthlyCount(payrollRows.value, year, month, getPayrollCellValueLocal);
}





function calculateHotelTotalAnnualLocal(year) {
  return calculateHotelTotalAnnual(payrollRows.value, year, getPayrollCellValueLocal);
}

// Employee/Room Ratio Local Functions
function calculateEmployeeRoomRatioLocal() {
  return calculateEmployeeRoomRatio(payrollRows.value, totalRooms.value);
}

function calculateEmployeeRoomRatioMonthlyLocal(year, month) {
  return calculateEmployeeRoomRatioMonthly(payrollRows.value, year, month, getPayrollCellValueLocal, totalRooms.value);
}





function calculateEmployeeRoomRatioAnnualLocal(year) {
  return calculateEmployeeRoomRatioAnnual(payrollRows.value, year, getPayrollCellValueLocal, totalRooms.value);
}



// Total Rooms handlers
function handleTotalRoomsChange(event) {
  const value = parseInt(event.target.value) || 1;
  if (value < 1) {
    totalRooms.value = 1;
  } else {
    totalRooms.value = value;
  }
}

function handleTotalRoomsBlur(event) {
  const value = parseInt(event.target.value) || 1;
  totalRooms.value = Math.max(1, value);
  localStorage.setItem('totalRooms', totalRooms.value.toString());
}

// Sync with Room Revenue total
function syncWithRoomRevenue() {
  const roomRevenueTotal = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  if (roomRevenueTotal && parseInt(roomRevenueTotal) > 0) {
    const newTotal = parseInt(roomRevenueTotal);
    totalRooms.value = newTotal;
    localStorage.setItem('totalRooms', newTotal.toString());
    alertService.success(`Synced With Room Revenue Room Total`);
  } else {
    alertService.warning('No Room Revenue total found. Please set a total in the Room Revenue page first.');
  }
}



// Table Salary Handlers (using robust pattern like monthly cells)
function handleTableSalaryInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.salary = value;
  
  // Trigger reactive update for monthly salary cells
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    // Add a timestamp to force reactivity
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTableSalaryFocus(row, event) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.salary;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9.]/g, '');
  }
  event.target.textContent = rawValue || '';
}

function handleTableSalaryBlur(row, event) {
  // Get the raw value from the cell content
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  // If the raw value is empty or invalid, use the original salary
  if (!rawValue || rawValue === '') {
    // Restore the original formatted value
    event.target.textContent = formatMoney(row.salary);
    return;
  }
  
  // Parse as a number (treat as whole number, not decimal)
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    // Store the value as a number (not formatted)
    row.salary = value;
    // Display the formatted value
    event.target.textContent = formatMoney(value);
    // Mark as unsaved
    isSaved.value = false;
    
    // Trigger reactive update for monthly salary cells
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      // Add a timestamp to force reactivity
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    // If invalid, restore the original value
    event.target.textContent = formatMoney(row.salary);
  }
}

// Table Count Handlers (using robust pattern like monthly cells)
function handleTableCountInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9]/g, '');
  row.count = value;
  
  // Trigger reactive update for monthly count and salary cells
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    // Add a timestamp to force reactivity
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTableCountFocus(row, event) {
  // Show the raw number without any formatting when user starts editing
  let rawValue = row.count;
  if (typeof rawValue === 'string') {
    // Remove any commas and formatting
    rawValue = rawValue.replace(/[^0-9]/g, '');
  }
  event.target.textContent = rawValue || '';
}

function handleTableCountBlur(row, event) {
  // Get the raw value from the cell content
  let rawValue = event.target.textContent.replace(/[^0-9]/g, '');
  
  // If the raw value is empty or invalid, use the original count
  if (!rawValue || rawValue === '') {
    // Restore the original value
    event.target.textContent = row.count || '0';
    return;
  }
  
  // Parse as a number
  let value = parseInt(rawValue, 10);
  if (!isNaN(value)) {
    // ✅ FIXED: Only update the base count, don't affect monthly overrides
    row.count = value;
    // Display the value
    event.target.textContent = value;
    // Mark as unsaved
    isSaved.value = false;
    
    // ✅ FIXED: Trigger reactive update for monthly salary cells only
    // Monthly count cells should NOT be affected by base count changes
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      // Add a timestamp to force reactivity for salary calculations
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    // If invalid, restore the original value
    event.target.textContent = row.count || '0';
  }
}

// Payroll Taxes Handlers
function getTaxPercentage(row) {
  // Get tax percentage from payroll data or default to 0
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const taxData = payrollData.value[year]?.[row.id]?.tax_percentage;
    return taxData !== undefined ? taxData : 0;
  }
  return 0;
}

function getTaxTotal(row) {
  // Calculate tax total based on salary and tax percentage
  const taxPercentage = getTaxPercentage(row);
  const salary = row.salary || 0;
  return (salary * taxPercentage / 100).toFixed(2);
}

function handleTaxPercentageInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.tax_percentage = value;
  
  // Store in payrollData for persistence
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].tax_percentage = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTaxPercentageFocus(row, event) {
  const rawValue = getTaxPercentage(row);
  event.target.textContent = rawValue.toString();
}

function handleTaxPercentageBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.tax_percentage = value;
    event.target.textContent = value.toFixed(2);
    isSaved.value = false;
    
    // Store in payrollData
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].tax_percentage = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

function handleTaxTotalInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.tax_total = value;
  
  // Store in payrollData for persistence
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].tax_total = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTaxTotalFocus(row, event) {
  const rawValue = getTaxTotal(row);
  event.target.textContent = rawValue.toString();
}

function handleTaxTotalBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.tax_total = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    // Store in payrollData
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].tax_total = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Payroll Taxes Calculation Functions
function calculateSubTotalManagementTaxPercentageLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  if (managementRows.length === 0) return 0;
  
  const totalTaxPercentage = managementRows.reduce((sum, row) => {
    return sum + getTaxPercentage(row);
  }, 0);
  
  return (totalTaxPercentage / managementRows.length).toFixed(2);
}

function calculateSubTotalManagementTaxTotalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTaxAmount = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

function calculateSubTotalNonManagementTaxPercentageLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  if (nonManagementRows.length === 0) return 0;
  
  const totalTaxPercentage = nonManagementRows.reduce((sum, row) => {
    return sum + getTaxPercentage(row);
  }, 0);
  
  return (totalTaxPercentage / nonManagementRows.length).toFixed(2);
}

function calculateSubTotalNonManagementTaxTotalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTaxAmount = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

function calculateLocationTotalTaxPercentageLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  if (rows.length === 0) return 0;
  
  const totalTaxPercentage = rows.reduce((sum, row) => {
    return sum + getTaxPercentage(row);
  }, 0);
  
  return (totalTaxPercentage / rows.length).toFixed(2);
}

function calculateLocationTotalTaxTotalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalTaxAmount = rows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

function calculateHotelTotalTaxPercentageLocal() {
  const allRows = payrollRows.value;
  
  if (allRows.length === 0) return 0;
  
  const totalTaxPercentage = allRows.reduce((sum, row) => {
    return sum + getTaxPercentage(row);
  }, 0);
  
  return (totalTaxPercentage / allRows.length).toFixed(2);
}

function calculateHotelTotalTaxTotalLocal() {
  const allRows = payrollRows.value;
  
  const totalTaxAmount = allRows.reduce((sum, row) => {
    return sum + parseFloat(getTaxTotal(row));
  }, 0);
  
  return formatMoney(totalTaxAmount);
}

function calculateEmployeeRoomRatioTaxPercentageLocal() {
  return calculateHotelTotalTaxPercentageLocal();
}

function calculateEmployeeRoomRatioTaxTotalLocal() {
  return calculateHotelTotalTaxTotalLocal();
}

// Supplementary Pay Handlers
function getVacation(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const vacationData = payrollData.value[year]?.[row.id]?.vacation;
    return vacationData !== undefined ? vacationData : 0;
  }
  return 0;
}

function getRelocation(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const relocationData = payrollData.value[year]?.[row.id]?.relocation;
    return relocationData !== undefined ? relocationData : 0;
  }
  return 0;
}

function getSeverenceIndemnity(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const severenceData = payrollData.value[year]?.[row.id]?.severence_indemnity;
    return severenceData !== undefined ? severenceData : 0;
  }
  return 0;
}

function getOther(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const otherData = payrollData.value[year]?.[row.id]?.other;
    return otherData !== undefined ? otherData : 0;
  }
  return 0;
}

// Vacation Handlers
function handleVacationInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.vacation = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].vacation = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleVacationFocus(row, event) {
  const rawValue = getVacation(row);
  event.target.textContent = rawValue.toString();
}

function handleVacationBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.vacation = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].vacation = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Relocation Handlers
function handleRelocationInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.relocation = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].relocation = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleRelocationFocus(row, event) {
  const rawValue = getRelocation(row);
  event.target.textContent = rawValue.toString();
}

function handleRelocationBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.relocation = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].relocation = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Severence & Indemnity Handlers
function handleSeverenceIndemnityInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.severence_indemnity = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].severence_indemnity = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleSeverenceIndemnityFocus(row, event) {
  const rawValue = getSeverenceIndemnity(row);
  event.target.textContent = rawValue.toString();
}

function handleSeverenceIndemnityBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.severence_indemnity = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].severence_indemnity = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Other Handlers
function handleOtherInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.other = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].other = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleOtherFocus(row, event) {
  const rawValue = getOther(row);
  event.target.textContent = rawValue.toString();
}

function handleOtherBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.other = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].other = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Supplementary Pay Calculation Functions
function calculateSubTotalManagementVacationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalVacation = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getVacation(row));
  }, 0);
  
  return formatMoney(totalVacation);
}

function calculateSubTotalManagementRelocationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalRelocation = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getRelocation(row));
  }, 0);
  
  return formatMoney(totalRelocation);
}

function calculateSubTotalManagementSeverenceIndemnityLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalSeverenceIndemnity = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getSeverenceIndemnity(row));
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

function calculateSubTotalManagementOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalOther = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getOther(row));
  }, 0);
  
  return formatMoney(totalOther);
}

function calculateSubTotalNonManagementVacationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalVacation = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getVacation(row));
  }, 0);
  
  return formatMoney(totalVacation);
}

function calculateSubTotalNonManagementRelocationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalRelocation = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getRelocation(row));
  }, 0);
  
  return formatMoney(totalRelocation);
}

function calculateSubTotalNonManagementSeverenceIndemnityLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalSeverenceIndemnity = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getSeverenceIndemnity(row));
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

function calculateSubTotalNonManagementOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalOther = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getOther(row));
  }, 0);
  
  return formatMoney(totalOther);
}

function calculateLocationTotalVacationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalVacation = rows.reduce((sum, row) => {
    return sum + parseFloat(getVacation(row));
  }, 0);
  
  return formatMoney(totalVacation);
}

function calculateLocationTotalRelocationLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalRelocation = rows.reduce((sum, row) => {
    return sum + parseFloat(getRelocation(row));
  }, 0);
  
  return formatMoney(totalRelocation);
}

function calculateLocationTotalSeverenceIndemnityLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalSeverenceIndemnity = rows.reduce((sum, row) => {
    return sum + parseFloat(getSeverenceIndemnity(row));
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

function calculateLocationTotalOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalOther = rows.reduce((sum, row) => {
    return sum + parseFloat(getOther(row));
  }, 0);
  
  return formatMoney(totalOther);
}

function calculateHotelTotalVacationLocal() {
  const allRows = payrollRows.value;
  
  const totalVacation = allRows.reduce((sum, row) => {
    return sum + parseFloat(getVacation(row));
  }, 0);
  
  return formatMoney(totalVacation);
}

function calculateHotelTotalRelocationLocal() {
  const allRows = payrollRows.value;
  
  const totalRelocation = allRows.reduce((sum, row) => {
    return sum + parseFloat(getRelocation(row));
  }, 0);
  
  return formatMoney(totalRelocation);
}

function calculateHotelTotalSeverenceIndemnityLocal() {
  const allRows = payrollRows.value;
  
  const totalSeverenceIndemnity = allRows.reduce((sum, row) => {
    return sum + parseFloat(getSeverenceIndemnity(row));
  }, 0);
  
  return formatMoney(totalSeverenceIndemnity);
}

function calculateHotelTotalOtherLocal() {
  const allRows = payrollRows.value;
  
  const totalOther = allRows.reduce((sum, row) => {
    return sum + parseFloat(getOther(row));
  }, 0);
  
  return formatMoney(totalOther);
}

function calculateEmployeeRoomRatioVacationLocal() {
  return calculateHotelTotalVacationLocal();
}

function calculateEmployeeRoomRatioRelocationLocal() {
  return calculateHotelTotalRelocationLocal();
}

function calculateEmployeeRoomRatioSeverenceIndemnityLocal() {
  return calculateHotelTotalSeverenceIndemnityLocal();
}

function calculateEmployeeRoomRatioOtherLocal() {
  return calculateHotelTotalOtherLocal();
}

// Employee Benefits Handlers
function getMedical(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const medicalData = payrollData.value[year]?.[row.id]?.medical;
    return medicalData !== undefined ? medicalData : 0;
  }
  return 0;
}

function getUniforms(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const uniformsData = payrollData.value[year]?.[row.id]?.uniforms;
    return uniformsData !== undefined ? uniformsData : 0;
  }
  return 0;
}

function getEmployeeMeal(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const employeeMealData = payrollData.value[year]?.[row.id]?.employee_meal;
    return employeeMealData !== undefined ? employeeMealData : 0;
  }
  return 0;
}

function getTransport(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const transportData = payrollData.value[year]?.[row.id]?.transport;
    return transportData !== undefined ? transportData : 0;
  }
  return 0;
}

function getTelephone(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const telephoneData = payrollData.value[year]?.[row.id]?.telephone;
    return telephoneData !== undefined ? telephoneData : 0;
  }
  return 0;
}

function getAirTicket(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const airTicketData = payrollData.value[year]?.[row.id]?.air_ticket;
    return airTicketData !== undefined ? airTicketData : 0;
  }
  return 0;
}

function getBenefitsOther(row) {
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    const benefitsOtherData = payrollData.value[year]?.[row.id]?.benefits_other;
    return benefitsOtherData !== undefined ? benefitsOtherData : 0;
  }
  return 0;
}

// Medical Handlers
function handleMedicalInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.medical = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].medical = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleMedicalFocus(row, event) {
  const rawValue = getMedical(row);
  event.target.textContent = rawValue.toString();
}

function handleMedicalBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.medical = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].medical = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Uniforms Handlers
function handleUniformsInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.uniforms = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].uniforms = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleUniformsFocus(row, event) {
  const rawValue = getUniforms(row);
  event.target.textContent = rawValue.toString();
}

function handleUniformsBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.uniforms = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].uniforms = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Employee Meal Handlers
function handleEmployeeMealInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.employee_meal = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].employee_meal = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleEmployeeMealFocus(row, event) {
  const rawValue = getEmployeeMeal(row);
  event.target.textContent = rawValue.toString();
}

function handleEmployeeMealBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.employee_meal = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].employee_meal = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Transport Handlers
function handleTransportInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.transport = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].transport = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTransportFocus(row, event) {
  const rawValue = getTransport(row);
  event.target.textContent = rawValue.toString();
}

function handleTransportBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.transport = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].transport = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Telephone Handlers
function handleTelephoneInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.telephone = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].telephone = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleTelephoneFocus(row, event) {
  const rawValue = getTelephone(row);
  event.target.textContent = rawValue.toString();
}

function handleTelephoneBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.telephone = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].telephone = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Air Ticket Handlers
function handleAirTicketInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.air_ticket = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].air_ticket = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleAirTicketFocus(row, event) {
  const rawValue = getAirTicket(row);
  event.target.textContent = rawValue.toString();
}

function handleAirTicketBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.air_ticket = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].air_ticket = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Benefits Other Handlers
function handleBenefitsOtherInput(row, event) {
  let value = event.target.textContent.replace(/[^0-9.]/g, '');
  row.benefits_other = value;
  
  if (visibleYears.value.length > 0) {
    const year = visibleYears.value[0];
    if (!payrollData.value[year]) {
      payrollData.value[year] = {};
    }
    if (!payrollData.value[year][row.id]) {
      payrollData.value[year][row.id] = {};
    }
    payrollData.value[year][row.id].benefits_other = parseFloat(value) || 0;
    payrollData.value[year][row.id]._lastUpdate = Date.now();
  }
}

function handleBenefitsOtherFocus(row, event) {
  const rawValue = getBenefitsOther(row);
  event.target.textContent = rawValue.toString();
}

function handleBenefitsOtherBlur(row, event) {
  let rawValue = event.target.textContent.replace(/[^0-9.]/g, '');
  
  if (!rawValue || rawValue === '') {
    event.target.textContent = '0.00';
    return;
  }
  
  let value = parseFloat(rawValue);
  if (!isNaN(value)) {
    row.benefits_other = value;
    event.target.textContent = formatMoney(value);
    isSaved.value = false;
    
    if (visibleYears.value.length > 0) {
      const year = visibleYears.value[0];
      if (!payrollData.value[year]) {
        payrollData.value[year] = {};
      }
      if (!payrollData.value[year][row.id]) {
        payrollData.value[year][row.id] = {};
      }
      payrollData.value[year][row.id].benefits_other = value;
      payrollData.value[year][row.id]._lastUpdate = Date.now();
    }
  } else {
    event.target.textContent = '0.00';
  }
}

// Employee Benefits Calculation Functions
function calculateSubTotalManagementMedicalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalMedical = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

function calculateSubTotalManagementUniformsLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalUniforms = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

function calculateSubTotalManagementEmployeeMealLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalEmployeeMeal = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

function calculateSubTotalManagementTransportLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTransport = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

function calculateSubTotalManagementTelephoneLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalTelephone = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

function calculateSubTotalManagementAirTicketLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalAirTicket = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

function calculateSubTotalManagementBenefitsOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const managementRows = rows.filter(row => 
    row.position && row.position.toLowerCase().includes('manager') ||
    row.position && row.position.toLowerCase().includes('director') ||
    row.position && row.position.toLowerCase().includes('supervisor')
  );
  
  const totalBenefitsOther = managementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

function calculateSubTotalNonManagementMedicalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalMedical = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

function calculateSubTotalNonManagementUniformsLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalUniforms = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

function calculateSubTotalNonManagementEmployeeMealLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalEmployeeMeal = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

function calculateSubTotalNonManagementTransportLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTransport = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

function calculateSubTotalNonManagementTelephoneLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalTelephone = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

function calculateSubTotalNonManagementAirTicketLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalAirTicket = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

function calculateSubTotalNonManagementBenefitsOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  const nonManagementRows = rows.filter(row => 
    !(row.position && row.position.toLowerCase().includes('manager')) &&
    !(row.position && row.position.toLowerCase().includes('director')) &&
    !(row.position && row.position.toLowerCase().includes('supervisor'))
  );
  
  const totalBenefitsOther = nonManagementRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

function calculateLocationTotalMedicalLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalMedical = rows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

function calculateLocationTotalUniformsLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalUniforms = rows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

function calculateLocationTotalEmployeeMealLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalEmployeeMeal = rows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

function calculateLocationTotalTransportLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalTransport = rows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

function calculateLocationTotalTelephoneLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalTelephone = rows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

function calculateLocationTotalAirTicketLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalAirTicket = rows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

function calculateLocationTotalBenefitsOtherLocal(category, location) {
  const rows = getPayrollRowsForLocationLocal(category, location);
  
  const totalBenefitsOther = rows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

function calculateHotelTotalMedicalLocal() {
  const allRows = payrollRows.value;
  
  const totalMedical = allRows.reduce((sum, row) => {
    return sum + parseFloat(getMedical(row));
  }, 0);
  
  return formatMoney(totalMedical);
}

function calculateHotelTotalUniformsLocal() {
  const allRows = payrollRows.value;
  
  const totalUniforms = allRows.reduce((sum, row) => {
    return sum + parseFloat(getUniforms(row));
  }, 0);
  
  return formatMoney(totalUniforms);
}

function calculateHotelTotalEmployeeMealLocal() {
  const allRows = payrollRows.value;
  
  const totalEmployeeMeal = allRows.reduce((sum, row) => {
    return sum + parseFloat(getEmployeeMeal(row));
  }, 0);
  
  return formatMoney(totalEmployeeMeal);
}

function calculateHotelTotalTransportLocal() {
  const allRows = payrollRows.value;
  
  const totalTransport = allRows.reduce((sum, row) => {
    return sum + parseFloat(getTransport(row));
  }, 0);
  
  return formatMoney(totalTransport);
}

function calculateHotelTotalTelephoneLocal() {
  const allRows = payrollRows.value;
  
  const totalTelephone = allRows.reduce((sum, row) => {
    return sum + parseFloat(getTelephone(row));
  }, 0);
  
  return formatMoney(totalTelephone);
}

function calculateHotelTotalAirTicketLocal() {
  const allRows = payrollRows.value;
  
  const totalAirTicket = allRows.reduce((sum, row) => {
    return sum + parseFloat(getAirTicket(row));
  }, 0);
  
  return formatMoney(totalAirTicket);
}

function calculateHotelTotalBenefitsOtherLocal() {
  const allRows = payrollRows.value;
  
  const totalBenefitsOther = allRows.reduce((sum, row) => {
    return sum + parseFloat(getBenefitsOther(row));
  }, 0);
  
  return formatMoney(totalBenefitsOther);
}

function calculateEmployeeRoomRatioMedicalLocal() {
  return calculateHotelTotalMedicalLocal();
}

function calculateEmployeeRoomRatioUniformsLocal() {
  return calculateHotelTotalUniformsLocal();
}

function calculateEmployeeRoomRatioEmployeeMealLocal() {
  return calculateHotelTotalEmployeeMealLocal();
}

function calculateEmployeeRoomRatioTransportLocal() {
  return calculateHotelTotalTransportLocal();
}

function calculateEmployeeRoomRatioTelephoneLocal() {
  return calculateHotelTotalTelephoneLocal();
}

function calculateEmployeeRoomRatioAirTicketLocal() {
  return calculateHotelTotalAirTicketLocal();
}

function calculateEmployeeRoomRatioBenefitsOtherLocal() {
  return calculateHotelTotalBenefitsOtherLocal();
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
