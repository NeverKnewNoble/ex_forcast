<template>
    <div class="flex ">
      <Sidebar @open-settings="openSettings" />
  
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
                  <HandCoins class="w-7 h-7 mx-2 text-white" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Payroll</h1>
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

              <button 
                @click="openAddPayrollModal"
                :disabled="!selectedProject"          
                class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
              >
                <Plus class="w-5 h-5" />
                Add Payroll Row
              </button>

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
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Clear
                    </button>
                    <button 
                      @click="showAdvanced = true" 
                      class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
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
                          min="1"
                          class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-lg font-semibold text-gray-900 rooms-input"
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
                    
                    <p class="text-xs text-gray-500 flex items-center gap-1">
                      This value is used for payroll calculations and projections
                    </p>
                    
                    <!-- Annual Percentage Increment Button -->
                    <div class="mt-3">
                      <button 
                        @click="showAnnualIncrement = true" 
                        class="w-full flex items-center justify-left gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                      >
                        <!-- <TrendingUp class="w-4 h-4" /> -->
                        Annual Percentage Increment
                      </button>
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
                  <h2 class="text-lg font-bold text-gray-800">Payroll Data Overview</h2>
                </div>
                <div class="mt-2">
                  <button 
                    v-if="deletedPayrollRows.size > 0"
                    @click="restoreOriginal"
                    class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium shadow-sm transition-all"
                  >
                    <RotateCcw class="w-4 h-4" />
                    Restore ({{ deletedPayrollRows.size }})
                  </button>
                </div>
              </div>
  
              <!-- No Payroll Data State -->
              <template v-if="!hasPayrollDataComputed">
                <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                  <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                    <HandCoins class="w-8 h-8 text-violet-500" />
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
                              :colspan="isYearCollapsed(visibleYears[0]) ? 1 : 25" 
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
                            <!-- Annual Percentage Increment Column -->
                            <th 
                              v-if="visibleYears.length > 1" 
                              :colspan="visibleYears.length - 1" 
                              class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm"
                            >
                              Annual Percentage Increment
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
                            <!-- Monthly Salary Sub-column -->
                            <th 
                              v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])" 
                              :colspan="12" 
                              class="px-2 py-1 text-center border border-violet-300 font-medium"
                            >
                              Monthly Salary
                            </th>
                            <!-- Total Sub-column -->
                            <th
                              :rowspan="2"
                              v-if="visibleYears.length > 0" 
                              class="px-2 py-1 text-center border border-violet-300 font-semibold min-w-[100px]"
                            >
                              Total
                            </th>
                            <!-- Annual Percentage Increment Sub-columns -->
                            <th
                              :rowspan="2"
                              v-for="year in visibleYears.slice(1)" 
                              :key="'annual-' + year"
                              class="px-2 py-1 text-center border border-violet-300 font-medium"
                            >
                              {{ year }}
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
                            <!-- Month columns for Monthly Salary -->
                            <th 
                              v-if="!isYearCollapsed(visibleYears[0])"
                              v-for="month in months" 
                              :key="'salary-' + month"
                              class="px-2 py-1 text-center border border-violet-300 min-w-[80px] font-medium"
                            >
                              {{ month }}
                            </th>

                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <!-- Group by actual categories from data -->
                          <template v-for="category in getUniqueCategoriesLocal()" :key="category">
                            <tr class="bg-gradient-to-r from-violet-600 to-violet-700 border-b-2 border-violet-800">
                              <td 
                                :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0)" 
                                 class="px-3 py-2 font-bold text-white text-left"
                              >
                                {{ category }}
                              </td>
                            </tr>
                            <!-- Group by Department Location within each category -->
                            <template v-for="location in getUniqueLocationsForCategoryLocal(category)" :key="'location-' + location">
                              <!-- Department Location Subdivider -->
                              <tr class="bg-violet-50 border-b border-violet-200">
                                <td 
                                  :colspan="4 + (visibleYears.length > 0 ? (isYearCollapsed(visibleYears[0]) ? 1 : 25) : 0) + (visibleYears.length > 1 ? visibleYears.length - 1 : 0)" 
                                  class="px-3 py-1.5 font-semibold text-violet-700 text-left text-sm"
                                >
                                  {{ location }}
                                </td>
                              </tr>
                              <!-- Payroll rows for this location -->
                              <template v-for="row in getVisiblePayrollRows(getPayrollRowsForLocationLocal(category, location))" :key="row.id">
                                <tr class="border-b border-gray-200 hover:bg-violet-50 transition-all duration-200">
                                  <!-- Position -->
                                  <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                    {{ row.position }}
                                  </td>
                                  <!-- Designation -->
                                  <td class="px-3 py-2 font-medium border-r border-violet-200 text-gray-700">
                                    <div class="flex items-center justify-between gap-2">
                                      <span>{{ row.designation }}</span>
                                      <button 
                                        @click="deletePayrollRow(row.id)" 
                                        class="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all" 
                                        title="Delete payroll row"
                                      >
                                        <X class="w-4 h-4" />
                                      </button>
                                    </div>
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
                                    :contenteditable="!row._isDefault"
                                  >
                                    {{ formatMoney(row.salary) }}
                                  </td>
                                  <!-- Count (Editable, Reactive, row.count) -->
                                  <td
                                    class="px-3 py-2 text-right border-r border-violet-200 font-mono text-sm"
                                    :contenteditable="row._isDefault"
                                    @input="row._isDefault && handleTableCountInput(row, $event)"
                                    @focus="row._isDefault && handleTableCountFocus(row, $event)"
                                    @blur="row._isDefault && handleTableCountBlur(row, $event)"
                                    @keypress="row._isDefault && allowOnlyNumbers($event)"
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
                                  <!-- Monthly Salary cells -->
                                  <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                    <td 
                                      v-for="month in months" 
                                      :key="'salary-cell-' + month + '-' + (payrollData[visibleYears[0]]?.[row.id]?._lastUpdate || 0) + '-' + (payrollData[visibleYears[0]]?.[row.id]?._forceUpdate || 0) + '-' + (getPayrollCellValueLocal(row.id, 'count', visibleYears[0], month) || 0)"
                                      class="px-2 py-1 text-right border border-violet-200 bg-gray-50"
                                    >
                                      <span class="font-mono text-xs">{{ formatMoney(getPayrollCellValueLocal(row.id, 'salary', visibleYears[0], month)) }}</span>
                                    </td>
                                  </template>
                                  <!-- Total cell (always visible) -->
                                  <template v-if="visibleYears.length > 0">
                                    <td class="px-2 py-1 text-right border border-violet-200 font-semibold bg-violet-50">
                                      <span class="font-mono text-xs text-violet-700">
                                        {{ formatMoney(calculatePayrollTotalLocal(row.id, visibleYears[0])) }}
                                      </span>
                                    </td>
                                  </template>
                                  <!-- Annual Percentage Increment cells -->
                                  <template v-if="visibleYears.length > 1">
                                    <td 
                                      v-for="year in visibleYears.slice(1)" 
                                      :key="'annual-cell-' + year"
                                      contenteditable="true"
                                      class="px-2 py-1 text-right border border-violet-200 hover:bg-violet-50 outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-200"
                                      @input="handlePayrollCellInput(row.id, 'annual', year, '', $event)"
                                      @focus="handlePayrollCellFocus(row.id, 'annual', year, '', $event)"
                                      @blur="handlePayrollCellEditLocal(row.id, 'annual', year, '', $event)"
                                    >
                                      <span class="font-mono text-xs">{{ formatMoney(calculateAnnualIncrementLocal(row.id, year)) }}</span>
                                    </td>
                                  </template>
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
                                <!-- Monthly Salary cells for subtotal -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-mgmt-salary-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalManagementMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for subtotal -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-1.5 text-right border border-violet-300 font-semibold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateSubTotalManagementTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for subtotal -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'subtotal-mgmt-annual-' + year"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalManagementAnnualIncrementLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
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
                                <!-- Monthly Salary cells for subtotal -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'subtotal-nonmgmt-salary-' + month"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalNonManagementMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for subtotal -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-1.5 text-right border border-violet-300 font-semibold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateSubTotalNonManagementTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for subtotal -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'subtotal-nonmgmt-annual-' + year"
                                    class="px-2 py-1.5 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-semibold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateSubTotalNonManagementAnnualIncrementLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
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
                                <!-- Monthly Salary cells for total -->
                                <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                                  <td 
                                    v-for="month in months" 
                                    :key="'total-salary-' + month"
                                    class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateLocationTotalMonthlySalaryLocal(category, location, visibleYears[0], month)) }}</span>
                                  </td>
                                </template>
                                <!-- Total cell for total -->
                                <template v-if="visibleYears.length > 0">
                                  <td class="px-2 py-2 text-right border border-violet-300 font-bold bg-violet-200 shadow-inner">
                                    <span class="font-mono text-xs text-violet-900">
                                      {{ formatMoney(calculateLocationTotalTotalLocal(category, location, visibleYears[0])) }}
                                    </span>
                                  </td>
                                </template>
                                <!-- Annual Percentage Increment cells for total -->
                                <template v-if="visibleYears.length > 1">
                                  <td 
                                    v-for="year in visibleYears.slice(1)" 
                                    :key="'total-annual-' + year"
                                    class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-purple-100 font-bold"
                                  >
                                    <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateLocationTotalAnnualIncrementLocal(category, location, year)) }}</span>
                                  </td>
                                </template>
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
                            <!-- Monthly Salary cells for hotel total -->
                            <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                              <td 
                                v-for="month in months" 
                                :key="'hotel-salary-' + month"
                                class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-indigo-100 font-bold"
                              >
                                <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateHotelTotalMonthlySalaryLocal(visibleYears[0], month)) }}</span>
                              </td>
                            </template>
                            <!-- Total cell for hotel total -->
                            <template v-if="visibleYears.length > 0">
                              <td class="px-2 py-2 text-right border border-violet-300 font-bold bg-violet-200 shadow-inner">
                                <span class="font-mono text-xs text-violet-900">
                                  {{ formatMoney(calculateHotelTotalTotalLocal(visibleYears[0])) }}
                                </span>
                              </td>
                            </template>
                            <!-- Annual Percentage Increment cells for hotel total -->
                            <template v-if="visibleYears.length > 1">
                              <td 
                                v-for="year in visibleYears.slice(1)" 
                                :key="'hotel-annual-' + year"
                                class="px-2 py-2 text-right border border-violet-300 bg-gradient-to-r from-violet-100 to-indigo-100 font-bold"
                              >
                                <span class="font-mono text-xs text-violet-900">{{ formatMoney(calculateHotelTotalAnnualIncrementLocal(year)) }}</span>
                              </td>
                            </template>
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
                            <!-- Monthly Salary cells for ratio -->
                            <template v-if="visibleYears.length > 0 && !isYearCollapsed(visibleYears[0])">
                              <td 
                                v-for="month in months" 
                                :key="'ratio-salary-' + month"
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 font-bold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ formatMoney(calculateEmployeeRoomRatioSalaryLocal(visibleYears[0], month)) }}</span>
                              </td>
                            </template>
                            <!-- Total cell for ratio -->
                            <template v-if="visibleYears.length > 0">
                              <td class="px-2 py-2 text-right border border-green-300 font-bold bg-green-200 shadow-inner">
                                <span class="font-mono text-xs text-green-900">
                                  {{ formatMoney(calculateEmployeeRoomRatioTotalLocal(visibleYears[0])) }}
                                </span>
                              </td>
                            </template>
                            <!-- Annual Percentage Increment cells for ratio -->
                            <template v-if="visibleYears.length > 1">
                              <td 
                                v-for="year in visibleYears.slice(1)" 
                                :key="'ratio-annual-' + year"
                                class="px-2 py-2 text-right border border-green-300 bg-gradient-to-r from-green-100 to-emerald-100 font-bold"
                              >
                                <span class="font-mono text-xs text-green-900">{{ formatMoney(calculateEmployeeRoomRatioAnnualIncrementLocal(year)) }}</span>
                              </td>
                            </template>
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
              <NoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
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

    <!-- Annual Percentage Increment Modal -->
    <transition name="fade">
      <div
        v-if="showAnnualIncrement"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-4xl p-0 overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <h2 class="text-xl font-bold text-white">Annual Percentage Increment</h2>
          </div>

          <!-- Modal Body -->
          <div class="p-8 pt-6">
            <!-- Message when no years selected -->
            <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
              <AlertTriangle class="w-6 h-6 text-yellow-600" />
              <span class="text-yellow-800 font-medium">Please select both "From Year" and "To Year" to configure annual increments.</span>
            </div>

            <div v-if="visibleYears.length" class="space-y-6">
              <!-- Instructions -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-medium text-blue-800">Instructions</span>
                </div>
                <p class="text-blue-700 text-sm">
                  Set the annual percentage increment for each year (excluding the first year). This will be applied to all payroll rows for the specified years.
                  The increment will be displayed in the "Annual Percentage Increment" column in the table.
                </p>
              </div>

              <!-- Year Increments -->
              <div class="space-y-4 max-h-[50vh] overflow-auto pr-2">
                <div
                  v-for="year in visibleYears.slice(1)"
                  :key="'increment-' + year"
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <span class="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar class="w-4 h-4 text-violet-600" />
                    {{ year }}
                  </span>
                  <div class="flex items-center gap-2">
                    <input
                      v-model.number="annualIncrementData[year]"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0.00"
                      required
                      @keypress="allowOnlyNumbers($event)"
                      class="px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-right w-24"
                    />
                    <span class="text-gray-600 font-medium">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
            <button
              @click="cancelAnnualIncrement"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Cancel
            </button>
            <button
              v-if="visibleYears.length"
              @click="applyAnnualIncrement"
              class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Add Payroll Data Modal -->
    <transition name="fade">
      <div
        v-if="showAddPayrollModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
            <div class="flex items-center gap-3">
              <HandCoins class="w-7 h-7 text-white" />
              <div>
                <h2 class="text-2xl font-bold text-white">Add New Payroll Data</h2>
                <p class="text-violet-100 mt-1 text-sm">Enter payroll details for the selected period</p>
              </div>
            </div>
            <button 
              @click="closeAddPayrollModal"
              class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
            >
              <X class="w-6 h-6" />
            </button>
          </div>


          <!-- Modal Body -->
          <div class="p-8 pb-0 space-y-6 overflow-y-auto max-h-[calc(95vh-140px)]">
            <!-- Year Select -->
            <div class="w-full max-w-md">
              <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                Year *
              </label>
              <select 
                v-model="addPayrollForm.year"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
              >
                <option value="">Select Year</option>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

                        <!-- Quick Actions Tab -->
            <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200 shadow-sm">
              <div class="flex items-center justify-between mb-4 cursor-pointer" @click="toggleQuickActions">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-violet-800">Quick Actions</h3>
                  <span class="text-sm text-violet-600">Create new items on the fly</span>
                </div>
                <svg 
                  :class="['w-5 h-5 text-violet-600 transition-transform duration-200', showQuickActions ? 'rotate-180' : '']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              <div v-show="showQuickActions" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Create Department -->
                <div class="bg-white rounded-lg p-4 border border-violet-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <h4 class="font-medium text-violet-800">Create Department</h4>
                  </div>
                  <div class="flex gap-2">
                    <input 
                      v-model="newDepartmentName"
                      type="text"
                      placeholder="Enter department name"
                      class="flex-1 px-3 py-2 border border-violet-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all text-sm bg-white"
                    />
                    <button 
                      @click="createNewDepartment"
                      :disabled="!newDepartmentName.trim() || isCreatingDepartment"
                      class="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <svg v-if="isCreatingDepartment" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span v-else>Create</span>
                    </button>
                  </div>
                </div>

                <!-- Create Department Location -->
                <div class="bg-white rounded-lg p-4 border border-violet-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h4 class="font-medium text-violet-800">Create Location</h4>
                  </div>
                  <div class="flex gap-2">
                    <input 
                      v-model="newLocationName"
                      type="text"
                      placeholder="Enter location name"
                      class="flex-1 px-3 py-2 border border-violet-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all text-sm bg-white"
                    />
                    <button 
                      @click="createNewLocation"
                      :disabled="!newLocationName.trim() || isCreatingLocation"
                      class="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <svg v-if="isCreatingLocation" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span v-else>Create</span>
                    </button>
                  </div>
                </div>

                <!-- Create Designation -->
                <div class="bg-white rounded-lg p-4 border border-violet-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <h4 class="font-medium text-violet-800">Create Designation</h4>
                  </div>
                  <div class="flex gap-2">
                    <input 
                      v-model="newDesignationName"
                      type="text"
                      placeholder="Enter designation name"
                      class="flex-1 px-3 py-2 border border-violet-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all text-sm bg-white"
                    />
                    <button 
                      @click="createNewDesignation"
                      :disabled="!newDesignationName.trim() || isCreatingDesignation"
                      class="px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      <svg v-if="isCreatingDesignation" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                      </svg>
                      <span v-else>Create</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payroll Data Cards -->
            <div class="space-y-4">
              <div 
                v-for="(row, index) in addPayrollForm.rows" 
                :key="'payroll-row-' + index"
                class="bg-white hover:border-violet-200 rounded-lg p-6 hover:shadow-md border-2 transition-all"
              >
                <!-- Row Header -->
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-800">Payroll Entry {{ index + 1 }}</h4>
                  <button
                    @click="removePayrollRow(index)"
                    :disabled="addPayrollForm.rows.length === 1"
                    class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove entry"
                  >
                    <Trash2 class="w-5 h-5" />
                  </button>
                </div>

                <!-- Form Fields Grid -->
                <div class="grid grid-cols-2 rounded-lg p-4 gap-6">
                  <!-- Department -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      v-model="row.department"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Department</option>
                      <option v-for="dept in projectDepartments" :key="'proj-dept-' + dept" :value="dept">
                        {{ dept }}
                      </option>
                    </select>
                  </div>

                  <!-- Department Location -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Department Location *
                    </label>
                    <select
                      v-model="row.departmentLocation"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Location</option>
                      <option v-for="option in departmentLocationOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Position -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Position *
                    </label>
                    <select
                      v-model="row.position"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Position</option>
                      <option value="Manager">Manager</option>
                      <option value="Non-manager">Non-manager</option>
                    </select>
                  </div>

                  <!-- Designation -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Designation *
                    </label>
                    <select
                      v-model="row.designation"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    >
                      <option disabled value="">Select Designation</option>
                      <option v-for="option in designationOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Salary -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <div class="relative">
                      <input 
                        v-model="row.salary"
                        type="text"
                        placeholder="0.00"
                        @keypress="allowOnlyNumbers($event)"
                        @input="handleModalSalaryInput($event, row)"
                        @focus="handleModalSalaryFocus($event, row)"
                        @blur="handleModalSalaryBlur($event, row)"
                        class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <!-- Count -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Count *
                    </label>
                    <input 
                      v-model.number="row.count"
                      type="number"
                      min="0"
                      placeholder="0"
                      @keypress="allowOnlyNumbers($event)"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="payrollModalError" class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span class="text-red-800 text-sm">{{ payrollModalError }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center px-10 pt-3 pb-3 border-t border-gray-200 bg-white sticky bottom-0">
            <button 
              @click="addPayrollRow" 
              class="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
            >
              <Plus class="w-5 h-5" />
              Add Row
            </button>
            <div class="flex gap-3">
              <button
                @click="closeAddPayrollModal"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <X class="w-5 h-5" />
                Cancel
              </button>
              <button 
                @click="submitPayrollDataWrapper" 
                :disabled="isSubmittingPayroll"
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg v-if="isSubmittingPayroll" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <Check v-else class="w-5 h-5" />
                {{ isSubmittingPayroll ? 'Submitting...' : 'Submit' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  
    <!-- Settings Modal -->
    <SettingsModal 
      :is-visible="showSettingsModal" 
      @close="closeSettings" 
    />
  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted, reactive, nextTick } from "vue";
  import { storeToRefs } from 'pinia';
  import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
  import Sidebar from "@/components/ui/Sidebar.vue";
import SettingsModal from "@/components/ui/SettingsModal.vue";
  import NoYearsSelectedState from '@/components/ui/payroll/NoYearsSelectedState.vue';
  import { 
    CircleAlert, 
    AlertTriangle, 
    HandCoins, 
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
    TrendingUp,
    Building2,
    Users,
    BedDouble,
    Download,
    Loader2,
    AlertCircle,
    Filter,
    RotateCcw
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
import { getProjectDepartments } from '@/components/utility/dashboard/projectService.js';
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
    defaultPayrollRows,
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
    calculatePayrollTotal,
    calculateSubTotalManagement,
    calculateSubTotalManagementCount,
    calculateSubTotalManagementMonthlyCount,
    calculateSubTotalManagementMonthlySalary,
    calculateSubTotalManagementTotal,
    calculateSubTotalManagementAnnual,
    calculateSubTotalNonManagement,
    calculateSubTotalNonManagementCount,
    calculateSubTotalNonManagementMonthlyCount,
    calculateSubTotalNonManagementMonthlySalary,
    calculateSubTotalNonManagementTotal,
    calculateSubTotalNonManagementAnnual,
    calculateLocationTotal,
    calculateLocationTotalCount,
    calculateLocationTotalMonthlyCount,
    calculateLocationTotalMonthlySalary,
    calculateLocationTotalTotal,
    calculateLocationTotalAnnual,
    calculateHotelTotal,
    calculateHotelTotalMonthlyCount,
    calculateHotelTotalMonthlySalary,
    calculateHotelTotalTotal,
    calculateHotelTotalAnnual,
    calculateEmployeeRoomRatio,
    calculateEmployeeRoomRatioMonthly,
    calculateEmployeeRoomRatioSalary,
    calculateEmployeeRoomRatioTotal,
    calculateEmployeeRoomRatioAnnual,
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
  const showAnnualIncrement = ref(false);
  const tempAdvancedModes = ref({});
  // Use Pinia store for annual increment data persistence
  // (will be consolidated with existing yearSettingsStore below)
  const isSaved = ref(false);
  const originalPayrollData = ref({});
  const changedCells = ref([]); // {rowId, fieldType, year, month, newValue}
  const isSaving = ref(false);
  const saveError = ref("");
  const sidebarCollapsed = ref(false);
  
  // Settings Modal State
  const showSettingsModal = ref(false);
  
const isComponentReady = ref(false); // Add a flag to track if component is ready
const projectDepartments = ref([]);

// ************ Payroll Row Management ****************
const deletedPayrollRows = ref(new Set()); // Track deleted payroll rows for restore functionality

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
  const { fromYear, toYear, advancedModes, annualIncrementData } = storeToRefs(yearSettingsStore);
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
    const visibleRows = getVisiblePayrollRows(payrollRows.value);
    const visibleDefaultRows = getVisiblePayrollRows(defaultPayrollRows.value);
    return hasPayrollData(visibleRows) || (visibleDefaultRows?.length > 0);
  });
  // Merge live payroll rows with default payroll rows for display (non-editable defaults)
  function normalizeDepartmentName(name) {
    return (name || '').toString().trim().toLowerCase();
  }

  const payrollRowsSource = computed(() => {
    const rows = Array.isArray(payrollRows.value) ? [...payrollRows.value] : [];
    const keySet = new Set(
      rows.map(r => `${r.department}__${r.departmentLocation}__${r.position}__${r.designation}`)
    );
    const selectedSet = new Set((projectDepartments.value || []).map(normalizeDepartmentName));

    if (Array.isArray(defaultPayrollRows.value) && defaultPayrollRows.value.length) {
      defaultPayrollRows.value.forEach((d) => {
        const dept = d.department;
        if (!dept) return;
        if (selectedSet.size && !selectedSet.has(normalizeDepartmentName(dept))) return; // only for selected depts
        const key = `${dept}__${d.department_location || ''}__${d.position || ''}__${d.designation || ''}`;
        if (keySet.has(key)) return; // skip if already present in live data

        const idSafe = key.replace(/\s+/g, '_');
        rows.push({
          id: `default_${idSafe}`,
          department: dept,
          departmentLocation: d.department_location || 'Default',
          position: d.position || 'Non-manager',
          designation: d.designation || '',
          salary: Number(d.salary) || 0,
          count: Number(d.count) || 0,
          category: dept,
          _isDefault: true
        });
      });
    }
    
    // Filter out deleted rows
    return getVisiblePayrollRows(rows);
  });


  // Computed property to track monthly count changes for better reactivity
  const monthlyCountTracker = computed(() => {
    if (!visibleYears.value.length || !payrollRows.value.length) return 0;
    
    const year = visibleYears.value[0];
    let tracker = 0;
    
    getVisiblePayrollRows(payrollRows.value).forEach(row => {
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
    
    getVisiblePayrollRows(payrollRows.value).forEach(row => {
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
      getVisiblePayrollRows(newRows).forEach((newRow, index) => {
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

  function applyAnnualIncrement() {
    // Apply the annual increment data
    // This will be used to display the annual percentage increment column
    showAnnualIncrement.value = false;
    alertService.success("Annual percentage increments applied successfully");
  }

  function cancelAnnualIncrement() {
    showAnnualIncrement.value = false;
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

      // Load selected project departments for filtering defaults
      if (selectedProject.value?.project_name) {
        try {
          projectDepartments.value = await getProjectDepartments(selectedProject.value.project_name);
        } catch (e) {
          projectDepartments.value = [];
        }
      }

      // Load initial payroll data if project is selected
      if (selectedProject.value) {
        await fetchPayrollData(selectedProject.value.project_name, fromYear.value, toYear.value);
      }

      originalPayrollData.value = cloneDeep(payrollRows.value);
      deletedPayrollRows.value = new Set();
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
        // Refresh selected departments
        try {
          projectDepartments.value = await getProjectDepartments(newProject.project_name);
        } catch (e) {
          projectDepartments.value = [];
        }
        
        // Reset any unsaved changes
        changedCells.value = [];
        deletedPayrollRows.value = new Set();
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
      projectDepartments.value = [];
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
        deletedPayrollRows.value = new Set();
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
    deletedPayrollRows.value = new Set();
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
      
      // Clear deleted rows after successful save
      deletedPayrollRows.value = new Set();
      
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

  // ************ Payroll Row Management Functions ****************
function deletePayrollRow(rowId) {
  const next = new Set(deletedPayrollRows.value);
  next.add(rowId);
  deletedPayrollRows.value = next;
  isSaved.value = false;
  alertService.info(`Removed payroll row. Click Restore to undo before saving.`);
}

function isPayrollRowDeleted(rowId) {
  return deletedPayrollRows.value.has(rowId);
}

function getVisiblePayrollRows(rowsArray) {
  const deleted = deletedPayrollRows.value;
  return (rowsArray || []).filter((row) => !deleted.has(row.id));
}

function restoreOriginal() {
  try {
    if (originalPayrollData.value && Object.keys(originalPayrollData.value).length) {
      payrollRows.value = cloneDeep(originalPayrollData.value);
    }
    deletedPayrollRows.value = new Set();
    isSaved.value = false;
    alertService.info('Restored to original');
  } catch (e) {
    console.error('Error restoring original data:', e);
  }
}

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
    deletedPayrollRows.value = new Set();
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
      const amount = (countValue || 0) * (row.salary || 0);
      
      // Cache monthly salary per position, designation, and location (> 0 only)
      try {
        const projectId = selectedProject.value?.project_name || 'default';
        const position = (row.position || '').toString();
        const designation = (row.designation || '').toString();
        const location = (row.departmentLocation || '').toString();
        const rowCode = `MonthlySalary|position:${position}|location:${location}|designation:${designation}`;
        calculationCache.setValue(projectId, 'Payroll', rowCode, year, month, amount);
      } catch (e) {}
      
      return amount;
    }
    
    return getPayrollCellValue(payrollRows.value, payrollData, rowId, fieldType, year, month);
  }

  function calculatePayrollTotalLocal(rowId, year) {
    // Use the local months array
    return calculatePayrollTotal(rowId, year, months, getPayrollCellValueLocal);
  }

  function calculateAnnualIncrementLocal(rowId, year) {
    // Get the total for the first year (baseline)
    const firstYear = visibleYears.value[0];
    const firstYearTotal = calculatePayrollTotalLocal(rowId, firstYear);
    
    // Get the percentage increment for this year
    const percentageIncrement = annualIncrementData.value[year] || 0;
    
    // Calculate: First year total + (First year total × Percentage increment)
    const incrementAmount = (firstYearTotal * percentageIncrement) / 100;
    return firstYearTotal + incrementAmount;
  }

  function getUniqueCategoriesLocal() {
    return getUniqueCategories(getVisiblePayrollRows(payrollRowsSource.value));
  }

  function getPayrollRowsForCategoryLocal(category) {
    return getPayrollRowsForCategory(payrollRowsSource.value, category);
  }

  function getUniqueLocationsForCategoryLocal(category) {
    return getUniqueLocationsForCategory(getVisiblePayrollRows(payrollRowsSource.value), category);
  }

  function getUniquePositionsForLocationLocal(category, location) {
    return getUniquePositionsForLocation(payrollRowsSource.value, category, location);
  }

  function getPayrollRowsForPositionLocal(category, location, position) {
    return getPayrollRowsForPosition(payrollRowsSource.value, category, location, position);
  }

  function getPayrollRowsForLocationLocal(category, location) {
    return getPayrollRowsForLocation(getVisiblePayrollRows(payrollRowsSource.value), category, location);
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

  function calculateSubTotalManagementMonthlySalaryLocal(category, location, year, month) {
    return calculateSubTotalManagementMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalManagementTotalLocal(category, location, year) {
    return calculateSubTotalManagementTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
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

  function calculateSubTotalNonManagementMonthlySalaryLocal(category, location, year, month) {
    return calculateSubTotalNonManagementMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateSubTotalNonManagementTotalLocal(category, location, year) {
    return calculateSubTotalNonManagementTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
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

  function calculateLocationTotalMonthlySalaryLocal(category, location, year, month) {
    return calculateLocationTotalMonthlySalary(payrollRows.value, category, location, year, month, getPayrollCellValueLocal);
  }

  function calculateLocationTotalTotalLocal(category, location, year) {
    return calculateLocationTotalTotal(payrollRows.value, category, location, year, calculatePayrollTotalLocal);
  }

  function calculateLocationTotalAnnualLocal(category, location, year) {
    return calculateLocationTotalAnnual(payrollRows.value, category, location, year, getPayrollCellValueLocal);
  }

  // Hotel Total Local Functions
  function calculateHotelTotalLocal() {
    // console.log('calculateHotelTotalLocal called');
    // console.log('payrollRows.value:', payrollRows.value);
    const result = calculateHotelTotal(getVisiblePayrollRows(payrollRows.value));
    // console.log('calculateHotelTotalLocal result:', result);
    return result;
  }

  function calculateHotelTotalMonthlyCountLocal(year, month) {
    return calculateHotelTotalMonthlyCount(getVisiblePayrollRows(payrollRows.value), year, month, getPayrollCellValueLocal);
  }

  function calculateHotelTotalMonthlySalaryLocal(year, month) {
    return calculateHotelTotalMonthlySalary(getVisiblePayrollRows(payrollRows.value), year, month, getPayrollCellValueLocal);
  }

  function calculateHotelTotalTotalLocal(year) {
    return calculateHotelTotalTotal(getVisiblePayrollRows(payrollRows.value), year, calculatePayrollTotalLocal);
  }

  function calculateHotelTotalAnnualLocal(year) {
    return calculateHotelTotalAnnual(payrollRows.value, year, getPayrollCellValueLocal);
  }

  // Employee/Room Ratio Local Functions
  function calculateEmployeeRoomRatioLocal() {
    return calculateEmployeeRoomRatio(getVisiblePayrollRows(payrollRows.value), totalRooms.value);
  }

  function calculateEmployeeRoomRatioMonthlyLocal(year, month) {
    return calculateEmployeeRoomRatioMonthly(getVisiblePayrollRows(payrollRows.value), year, month, getPayrollCellValueLocal, totalRooms.value);
  }

  function calculateEmployeeRoomRatioSalaryLocal(year, month) {
    return calculateEmployeeRoomRatioSalary(getVisiblePayrollRows(payrollRows.value), year, month, getPayrollCellValueLocal, totalRooms.value);
  }

  function calculateEmployeeRoomRatioTotalLocal(year) {
    return calculateEmployeeRoomRatioTotal(getVisiblePayrollRows(payrollRows.value), year, calculatePayrollTotalLocal, totalRooms.value);
  }

  function calculateEmployeeRoomRatioAnnualLocal(year) {
    return calculateEmployeeRoomRatioAnnual(payrollRows.value, year, getPayrollCellValueLocal, totalRooms.value);
  }

  // Hotel Total Annual Increment Local Functions
  function calculateHotelTotalAnnualIncrementLocal(year) {
    const hotelRows = getVisiblePayrollRows(payrollRows.value);
    
    return hotelRows.reduce((sum, row) => {
      return sum + calculateAnnualIncrementLocal(row.id, year);
    }, 0);
  }

  // Employee/Room Ratio Annual Increment Local Functions
  function calculateEmployeeRoomRatioAnnualIncrementLocal(year) {
    // Get hotel total annual increment (sum of all payroll rows across all categories)
    const hotelTotalAnnualIncrement = calculateHotelTotalAnnualIncrementLocal(year);
    return totalRooms.value > 0 ? (hotelTotalAnnualIncrement / totalRooms.value) : 0;
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

  function calculateSubTotalManagementAnnualIncrementLocal(category, location, year) {
    const managementRows = getPayrollRowsForLocationLocal(category, location).filter(row => 
      row.position === 'Manager'
    );
    
    return managementRows.reduce((sum, row) => {
      return sum + calculateAnnualIncrementLocal(row.id, year);
    }, 0);
  }

  function calculateSubTotalNonManagementAnnualIncrementLocal(category, location, year) {
    const nonManagementRows = getPayrollRowsForLocationLocal(category, location).filter(row => 
      row.position === 'Non-manager'
    );
    
    return nonManagementRows.reduce((sum, row) => {
      return sum + calculateAnnualIncrementLocal(row.id, year);
    }, 0);
  }

  function calculateLocationTotalAnnualIncrementLocal(category, location, year) {
    // Total = Sub-Total Management + Sub-Total Non-Management
    const managementSubtotal = calculateSubTotalManagementAnnualIncrementLocal(category, location, year);
    const nonManagementSubtotal = calculateSubTotalNonManagementAnnualIncrementLocal(category, location, year);
    
    return managementSubtotal + nonManagementSubtotal;
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
    // For default rows, ensure explicit 0 shows when empty
    if (row._isDefault && (rawValue === undefined || rawValue === null || rawValue === '' || Number.isNaN(rawValue))) {
      rawValue = 0;
    }
    event.target.textContent = (rawValue !== undefined && rawValue !== null && rawValue !== '') ? rawValue : '';
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
    // For default rows, ensure an explicit 0 shows when empty
    if (row._isDefault && (rawValue === undefined || rawValue === null || rawValue === '' || Number.isNaN(rawValue))) {
      rawValue = 0;
    }
    event.target.textContent = (rawValue !== undefined && rawValue !== null && rawValue !== '') ? rawValue : '';
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

      // If this is a default row, promote it to a real working row and add a change entry
      if (row._isDefault) {
        // Ensure row is present in live payrollRows so save pipeline can find it
        const exists = payrollRows.value.find(r => r.id === row.id);
        if (!exists) {
          payrollRows.value.push({ ...row });
        }
        // Add/replace a base count change so Save button has something to persist
        if (visibleYears.value.length > 0) {
          const year = visibleYears.value[0];
          const changeData = {
            rowId: row.id,
            fieldType: 'count',
            year,
            month: null,
            newValue: value,
            isOverride: false
          };
          const existingIdx = changedCells.value.findIndex(
            c => c.rowId === row.id && c.fieldType === 'count' && c.year === year && (c.month === null || c.month === undefined)
          );
          if (existingIdx >= 0) changedCells.value[existingIdx] = changeData; else changedCells.value.push(changeData);
        }
        // Persist the count visually on default row to avoid clearing on rerender
        row.count = value;
      }
      
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
  