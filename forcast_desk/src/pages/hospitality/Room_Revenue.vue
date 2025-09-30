<template>
    <div class="flex ">
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
                <div class="mb-6">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BedDouble class="w-7 h-7 mx-2 text-white" />
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900">Room Revenue Assumptions</h1>
                  </div>
                  <p class="text-sm text-gray-500">Manage and configure your room revenue data</p>
                </div>



                <!-- Save Status Section -->
                <div class="bg-white rounded-xl p-4 mb-2 border border-gray-200 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        v-if="!isSaved"
                        class="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                      >
                        <X class="w-4 h-4" />
                        Unsaved
                      </div>
                      <div
                        v-else
                        class="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                      >
                        <Check class="w-4 h-4" />
                        Saved
                      </div>
                    </div>
                    <button
                      v-if="!isSaving && !isSaved"
                      :disabled="isSaving"
                      @click="saveChangesWrapper"
                      class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-violet-700 text-white rounded-lg hover:from-violet-700 hover:to-violet-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Save class="w-4 h-4" />
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
                    <CircleAlert class="w-3 h-3" />
                    {{ saveError }}
                  </span>
                </div>

                <!-- Display Format Switch -->
                <div class="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm border-gray-200 mb-10">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Display Format</label>
                    <p class="text-xs text-black">Market segmentation</p>
                  </div>
                  <button 
                    @click="marketSegmentation = !marketSegmentation"
                    :class="[
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2',
                      marketSegmentation ? 'bg-violet-600' : 'bg-gray-200'
                    ]"
                  >
                    <span 
                      :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        marketSegmentation ? 'translate-x-6' : 'translate-x-1'
                      ]"
                    ></span>
                  </button>
                </div>

                <!-- Action Buttons Section -->
                <div class="mb-6">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Plus class="w-4 h-4 text-violet-600" />
                    Quick Actions
                  </h3>
                  <button 
                    v-if="!marketSegmentation"
                    @click="showAddRoomRevenueModal = true" 
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                  >
                    <PlusCircle class="w-5 h-5" />
                    Add Room Revenue
                  </button>
                  <div class="flex gap-2 mt-3">
                    <button 
                      @click="refreshRoomRevenueData"
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
                      <Calendar class="w-5 h-5 text-violet-600" />
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
                          @click="showAdvanced = true" 
                          class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <Settings class="w-4 h-4" />
                          Advanced
                        </button>
                      </div>
                      <div v-if="!marketSegmentation" class="mt-3">
                        <button 
                          @click="openRoomTypeCountModal" 
                          class="w-full flex items-center justify-left gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <Calculator class="w-4 h-4" />
                          Room Package Count
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


                <!-- Total Number of Rooms Section (Market Segmentation Only) -->
                <div v-if="marketSegmentation" class="mt-4">
                  <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <BedDouble class="w-5 h-5 text-violet-600" />
                      Total Number of Rooms
                    </h3>
                    <div class="space-y-4">
                      <div>
                        <label class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Calculator class="w-3 h-3 text-gray-500" />
                          Total Rooms
                        </label>
                        <input 
                          v-model="totalNumberOfRooms" 
                          type="number" 
                          min="0"
                          placeholder="Enter total number of rooms"
                          class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                        />
                        <p class="text-xs text-gray-500 mt-1">This value will be used to calculate in the market segmentation tables.</p>
                      </div>
                      <div class="flex flex-col gap-2 mt-4">
                        <button 
                          @click="showVATModal = true" 
                          class="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <Calculator class="w-4 h-4" />
                          VAT Tax
                        </button>
                        <button 
                          @click="showBreakfastModal = true" 
                          class="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <Coffee  class="w-4 h-4" />
                          Breakfast Allocation
                        </button>
                        <button 
                          @click="showExchangeRateModal = true" 
                          class="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <BadgeCent  class="w-4 h-4" />
                          Exchange Rate
                        </button>
                        <button 
                          @click="showServiceChargeModal = true" 
                          class="flex items-center gap-2 px-3 py-2.5 bg-white border border-violet-500 text-violet-700 rounded-lg hover:bg-violet-50 transition-all duration-200 text-sm font-medium"
                        >
                          <DollarSign  class="w-4 h-4" />
                          Service Charge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            </transition>
          </div>
  
          <!-- Right Side - Table Area -->
          <div class="flex-1 p-4">
            <MarketSegmentationTables
              v-if="marketSegmentation"
              :visible-years="visibleYears"
              :from-year="fromYear"
              :to-year="toYear"
              :display-mode="displayMode"
              :advanced-modes="advancedModes"
              :get-column-labels-for-year-local="getColumnLabelsForYearLocal"
              :toggle-collapse="toggleCollapse"
              :is-year-collapsed="isYearCollapsed"
              :market-segment-data="marketSegmentData"
              :room-packages="filteredRoomPackages"
              :room-data="roomData"
              :total-number-of-rooms="totalNumberOfRooms"
              :vat-by-year="vatByYear"
              :breakfast-by-year="breakfastByYear"
              :exchange-rate-by-year="exchangeRateByYear"
              :service-charge-by-year="serviceChargeByYear"
              @market-segment-changed="handleMarketSegmentDataChanged"
              @data-loaded="handleMarketSegmentDataLoaded"
              ref="marketSegmentationTablesRef"
            />
            <div v-else>
              <!-- Status Messages -->
              <div v-if="roomData.status" class="mb-6">
                <RoomNoProjectSelectedState v-if="roomData.status === 'no_project_selected'" />
                
                <RoomErrorState v-else-if="roomData.status === 'error'" :message="roomData.message" @retry="refreshRoomRevenueData" />
              </div>

              <!-- Table Header with Stats -->
              <template v-if="visibleYears.length">
                <div class="mb-4">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <Table class="w-3 h-3 text-white" />
                    </div>
                    <h2 class="text-lg font-bold text-gray-800">Room Revenue Overview</h2>
                  </div>
                  <div class="mt-2">
                    <button @click="restorePackages"
                      class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm font-medium shadow-sm">
                      <RotateCcw class="w-4 h-4" />
                      Restore
                    </button>
                  </div>
                </div>
                <div class="space-y-8">
                  <!-- Table 1: Available Beds -->
                  <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                    <div class="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-4">
                      <div class="flex items-center gap-2">
                        <h2 class="text-xl font-bold flex items-center gap-2"><BedDouble class="w-5 h-5" /> Available Beds</h2> 
                        <div class="bg-violet-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <Calculator class="w-3 h-3" />
                        Auto Calculated
                        </div>
                      </div>

                      <p class="text-violet-100 text-sm mt-1">Number of rooms available (No. of days for the month x Room package count)</p>
                    </div>
                    <div class="overflow-x-auto">
                      <div class="min-w-full w-max">
                        <table class="w-full">
                          <thead class="bg-gradient-to-r from-violet-50 to-violet-100 text-violet-800 sticky top-0">
                            <tr>
                              <th class="px-4 py-3 text-left font-semibold border-r border-violet-200"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                              <template v-for="year in visibleYears" :key="'available-header-' + year">
                                <th
                                  :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                                  class="px-4 py-3 text-center border-x-2 border-white cursor-pointer select-none hover:bg-violet-100 transition group"
                                  @click="toggleCollapse(year)"
                                  title="Click to collapse/expand"
                                >
                                  <div class="flex items-center justify-center gap-1">
                                    <span class="font-semibold">{{ year }}</span>
                                    <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                                    <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                                  </div>
                                </th>
                              </template>
                            </tr>
                            <tr class="bg-violet-100 text-sm">
                              <th class="px-4 py-2 border-r border-violet-200"></th>
                              <template v-for="year in visibleYears" :key="'available-months-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <th
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="year + '-available-' + label"
                                    class="px-4 py-2 text-center border border-violet-300 min-w-[110px]"
                                  >
                                    {{ label }}
                                  </th>
                                  <th class="px-4 py-2 text-center border border-violet-300 bg-violet-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                                <template v-else>
                                  <th class="px-4 py-2 text-center border border-violet-300 bg-violet-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                              </template>
                            </tr>
                          </thead>
                          <tbody class="text-gray-700 bg-white text-sm">
                              <tr
                              v-for="roomType in visibleRoomTypes"
                              :key="'available-' + roomType"
                              class="even:bg-violet-50 hover:bg-violet-100 transition dark:even:bg-violet-900/20 dark:hover:bg-violet-800/30"
                            >
                              <td class="px-4 py-3 font-medium border-r border-violet-200 flex items-center justify-between dark:border-violet-600 dark:text-gray-200">
                                <div class="flex items-center justify-between w-full">
                                  <span>{{ roomType }}</span>
                                  <!-- <span class="px-2 py-1 mx-1 bg-white text-violet-500 border border-violet-500 text-xs font-medium rounded-full">Auto</span> -->
                                </div>
                                <button
                                  @click="removeRoomPackage(roomType)"
                                  class="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20"
                                  title="Remove package"
                                >
                                  <X class="w-3 h-3" />
                                </button>
                              </td>
                              <template v-for="year in visibleYears" :key="'available-row-' + year + '-' + roomType">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'available-cell-' + year + '-' + label + '-' + roomType"
                                    class="px-2 py-2 text-right border border-violet-200 bg-gray-50 dark:border-violet-600 dark:bg-gray-800"
                                  >
                                    <span class=" text-xs">{{ getAvailableBeds(roomData, roomType, year, label, advancedModes[year] || displayMode, filteredRoomPackages) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 dark:border-violet-600 dark:bg-violet-800/30">
                                    <span class=" text-xs text-violet-700 dark:text-violet-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'available_beds', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50 dark:border-violet-600 dark:bg-violet-800/30">
                                    <span class=" text-xs text-violet-700 dark:text-violet-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'available_beds', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tbody>
                          <!-- Total Row -->
                          <tfoot class="bg-violet-100 border-t-2 border-violet-300 dark:bg-violet-800/30 dark:border-violet-600">
                            <tr class="font-bold text-violet-900 dark:text-violet-200">
                              <td class="px-4 py-3 border-r border-violet-200 dark:border-violet-600">Total</td>
                              <template v-for="year in visibleYears" :key="'available-total-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'available-total-cell-' + year + '-' + label"
                                    class="px-2 py-2 text-right border border-violet-200 font-bold dark:border-violet-600"
                                  >
                                    {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'available_beds', filteredRoomPackages) }}
                                  </td>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-bold text-violet-800 dark:border-violet-600 dark:text-violet-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'available_beds', filteredRoomPackages) }}
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-violet-200 font-bold text-violet-800 dark:border-violet-600 dark:text-violet-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'available_beds', filteredRoomPackages) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Table 2: Occupied Beds -->
                  <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                    <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                      <h2 class="text-xl font-bold flex items-center gap-2"><BedDouble class="w-5 h-5" /> Occupied Beds</h2>
                      <p class="text-blue-100 text-sm">Percentage of beds occupied</p>
                    </div>
                    <div class="overflow-x-auto">
                      <div class="min-w-full w-max">
                        <table class="w-full">
                          <thead class="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 sticky top-0">
                            <tr>
                              <th class="px-4 py-3 text-left font-semibold border-r border-blue-200"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                              <template v-for="year in visibleYears" :key="'occupied-header-' + year">
                                <th
                                  :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                                  class="px-4 py-3 text-center border-x-2 border-white cursor-pointer select-none hover:bg-blue-100 transition group"
                                  @click="toggleCollapse(year)"
                                  title="Click to collapse/expand"
                                >
                                  <div class="flex items-center justify-center gap-1">
                                    <span class="font-semibold">{{ year }}</span>
                                    <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                                    <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                                  </div>
                                </th>
                              </template>
                            </tr>
                            <tr class="bg-blue-100 text-sm">
                              <th class="px-4 py-2 border-r border-blue-200"></th>
                              <template v-for="year in visibleYears" :key="'occupied-months-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <th
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="year + '-occupied-' + label"
                                    class="px-4 py-2 text-center border border-blue-300 min-w-[110px]"
                                  >
                                    {{ label }}
                                  </th>
                                  <th class="px-4 py-2 text-center border border-blue-300 bg-blue-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                                <template v-else>
                                  <th class="px-4 py-2 text-center border border-blue-300 bg-blue-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                              </template>
                            </tr>
                          </thead>
                          <tbody class="text-gray-700 bg-white text-sm">
                              <tr
                              v-for="roomType in visibleRoomTypes"
                              :key="'occupied-' + roomType"
                              class="even:bg-blue-50 hover:bg-blue-100 transition dark:even:bg-blue-900/20 dark:hover:bg-blue-800/30"
                            >
                              <td class="px-4 py-3 font-medium border-r border-blue-200 flex items-center justify-between dark:border-blue-600 dark:text-gray-200">
                                <span>{{ roomType }}</span>
                                <button
                                  @click="removeRoomPackage(roomType)"
                                  class="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20"
                                  title="Remove package"
                                >
                                  <X class="w-3 h-3" />
                                </button>
                              </td>
                              <template v-for="year in visibleYears" :key="'occupied-row-' + year + '-' + roomType">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'occupied-cell-' + year + '-' + label + '-' + roomType"
                                     contenteditable="true"
                                    class="px-2 py-2 text-right border border-blue-200 hover:bg-blue-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:border-blue-600 dark:hover:bg-blue-900/20 dark:focus:bg-gray-700"
                                    @input="handleRoomCellInputWrapper({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                    @focus="handleRoomCellFocus({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                    @blur="handleRoomCellEditWrapper({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                  >
                                    <span class=" text-xs">{{ getOccupiedBeds(roomData, roomType, year, label, advancedModes[year] || displayMode) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50 dark:border-blue-600 dark:bg-blue-800/30">
                                    <span class=" text-xs text-blue-700 dark:text-blue-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'occupied_beds', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50 dark:border-blue-600 dark:bg-blue-800/30">
                                    <span class=" text-xs text-blue-700 dark:text-blue-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'occupied_beds', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tbody>
                          <!-- Total Row -->
                          <tfoot class="bg-blue-100 border-t-2 border-blue-300 dark:bg-blue-800/30 dark:border-blue-600">
                            <tr class="font-bold text-blue-900 dark:text-blue-200">
                              <td class="px-4 py-3 border-r border-blue-200 dark:border-blue-600">Total</td>
                              <template v-for="year in visibleYears" :key="'occupied-total-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'occupied-total-cell-' + year + '-' + label"
                                    class="px-2 py-2 text-right border border-blue-200 font-bold dark:border-blue-600"
                                  >
                                    {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'occupied_beds', filteredRoomPackages) }}
                                  </td>
                                  <td class="px-2 py-2 text-right border border-blue-200 font-bold text-blue-800 dark:border-blue-600 dark:text-blue-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'occupied_beds', filteredRoomPackages) }}
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-blue-200 font-bold text-blue-800 dark:border-blue-600 dark:text-blue-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'occupied_beds', filteredRoomPackages) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Table 3: Rate -->
                  <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                    <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
                      <h2 class="text-xl font-bold flex items-center gap-2"><DollarSign class="w-5 h-5" /> Rate</h2>
                      <p class="text-green-100 text-sm">Room rates per night</p>
                    </div>
                    <div class="overflow-x-auto">
                      <div class="min-w-full w-max">
                        <table class="w-full">
                          <thead class="bg-gradient-to-r from-green-50 to-green-100 text-green-800 sticky top-0">
                            <tr>
                              <th class="px-4 py-3 text-left font-semibold border-r border-green-200"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                              <template v-for="year in visibleYears" :key="'rate-header-' + year">
                                <th
                                  :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                                  class="px-4 py-3 text-center border-x-2 border-white cursor-pointer select-none hover:bg-green-100 transition group"
                                  @click="toggleCollapse(year)"
                                  title="Click to collapse/expand"
                                >
                                  <div class="flex items-center justify-center gap-1">
                                    <span class="font-semibold">{{ year }}</span>
                                    <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                                    <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                                  </div>
                                </th>
                              </template>
                            </tr>
                            <tr class="bg-green-100 text-sm">
                              <th class="px-4 py-2 border-r border-green-200"></th>
                              <template v-for="year in visibleYears" :key="'rate-months-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <th
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="year + '-rate-' + label"
                                    class="px-4 py-2 text-center border border-green-300 min-w-[110px]"
                                  >
                                    {{ label }}
                                  </th>
                                  <th class="px-4 py-2 text-center border border-green-300 bg-green-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                                <template v-else>
                                  <th class="px-4 py-2 text-center border border-green-300 bg-green-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                              </template>
                            </tr>
                          </thead>
                          <tbody class="text-gray-700 bg-white text-sm">
                              <tr
                              v-for="roomType in visibleRoomTypes"
                              :key="'rate-' + roomType"
                              class="even:bg-green-50 hover:bg-green-100 transition dark:even:bg-green-900/20 dark:hover:bg-green-800/30"
                            >
                              <td class="px-4 py-3 font-medium border-r border-green-200 flex items-center justify-between dark:border-green-600 dark:text-gray-200">
                                <span>{{ roomType }}</span>
                                <button
                                  @click="removeRoomPackage(roomType)"
                                  class="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20"
                                  title="Remove package"
                                >
                                  <X class="w-3 h-3" />
                                </button>
                              </td>
                              <template v-for="year in visibleYears" :key="'rate-row-' + year + '-' + roomType">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'rate-cell-' + year + '-' + label + '-' + roomType"
                                     contenteditable="true"
                                    class="px-2 py-2 text-right border border-green-200 hover:bg-green-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:border-green-600 dark:hover:bg-green-900/20 dark:focus:bg-gray-700"
                                    @input="handleRoomCellInputWrapper({ year, label, roomType, field: 'rate', event: $event })"
                                    @focus="handleRoomCellFocus({ year, label, roomType, field: 'rate', event: $event })"
                                    @blur="handleRoomCellEditWrapper({ year, label, roomType, field: 'rate', event: $event })"
                                  >
                                    <span class=" text-xs">{{ getRate(roomData, roomType, year, label, advancedModes[year] || displayMode) }}</span>
                                  </td>
                                  <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50 dark:border-green-600 dark:bg-green-800/30">
                                    <span class=" text-xs text-green-700 dark:text-green-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'rate', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50 dark:border-green-600 dark:bg-green-800/30">
                                    <span class=" text-xs text-green-700 dark:text-green-200">
                                       {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'rate', filteredRoomPackages) }}
                                     </span>
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tbody>
                          <!-- Total Row -->
                          <tfoot class="bg-green-100 border-t-2 border-green-300 dark:bg-green-800/30 dark:border-green-600">
                            <tr class="font-bold text-green-900 dark:text-green-200">
                              <td class="px-4 py-3 border-r border-green-200 dark:border-green-600">Total</td>
                              <template v-for="year in visibleYears" :key="'rate-total-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'rate-total-cell-' + year + '-' + label"
                                    class="px-2 py-2 text-right border border-green-200 font-bold dark:border-green-600"
                                  >
                                    {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'rate', filteredRoomPackages) }}
                                  </td>
                                  <td class="px-2 py-2 text-right border border-green-200 font-bold text-green-800 dark:border-green-600 dark:text-green-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'rate', filteredRoomPackages) }}
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-green-200 font-bold text-green-800 dark:border-green-600 dark:text-green-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'rate', filteredRoomPackages) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>

                  <!-- Table 4: Revenue -->
                  <div class="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
                    <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4">
                      <div class="flex-col items-center gap-2">
                        <div class="flex items-center gap-2">
                          <Calculator class="w-5 h-5" />
                          <h2 class="text-xl font-bold">Revenue</h2>
                          <div class="bg-orange-500 text-white font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Calculator class="w-3 h-3" />
                            Auto Calculated
                          </div>
                        </div>
                        <div class="flex items-center mt-1">
                          <span class="text-orange-100 text-sm">Calculated revenue (Available Beds × Occupied Beds % × Rate)</span>
                        </div>
                      </div>
                    </div>
                    <div class="overflow-x-auto">
                      <div class="min-w-full w-max">
                        <table class="w-full">
                          <thead class="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 sticky top-0">
                            <tr>
                              <th class="px-4 py-3 text-left font-semibold border-r border-orange-200"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                              <template v-for="year in visibleYears" :key="'revenue-header-' + year">
                                <th
                                  :colspan="isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1"
                                  class="px-4 py-3 text-center border-x-2 border-white cursor-pointer select-none hover:bg-orange-100 transition group"
                                  @click="toggleCollapse(year)"
                                  title="Click to collapse/expand"
                                >
                                  <div class="flex items-center justify-center gap-1">
                                    <span class="font-semibold">{{ year }}</span>
                                    <ChevronDown v-if="!isYearCollapsed(year)" class="w-3 h-3 transition-transform group-hover:scale-110" />
                                    <ChevronRight v-else class="w-3 h-3 transition-transform group-hover:scale-110" />
                                  </div>
                                </th>
                              </template>
                            </tr>
                            <tr class="bg-orange-100 text-sm">
                              <th class="px-4 py-2 border-r border-orange-200"></th>
                              <template v-for="year in visibleYears" :key="'revenue-months-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <th
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="year + '-revenue-' + label"
                                    class="px-4 py-2 text-center border border-orange-300 min-w-[110px]"
                                  >
                                    {{ label }}
                                  </th>
                                  <th class="px-4 py-2 text-center border border-orange-300 bg-orange-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                                <template v-else>
                                  <th class="px-4 py-2 text-center border border-orange-300 bg-orange-300 min-w-[120px] font-semibold">Total</th>
                                </template>
                              </template>
                            </tr>
                          </thead>
                          <tbody class="text-gray-700 bg-white text-sm">
                              <tr
                              v-for="roomType in visibleRoomTypes"
                              :key="'revenue-' + roomType"
                              class="even:bg-orange-50 hover:bg-orange-100 transition dark:even:bg-orange-900/20 dark:hover:bg-orange-800/30"
                            >
                              <td class="px-4 py-3 font-medium border-r border-orange-200 flex items-center justify-between dark:border-orange-600 dark:text-gray-200">
                                <span>{{ roomType }}</span>
                                <button
                                  @click="removeRoomPackage(roomType)"
                                  class="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20"
                                  title="Remove package"
                                >
                                  <X class="w-3 h-3" />
                                </button>
                              </td>
                              <template v-for="year in visibleYears" :key="'revenue-row-' + year + '-' + roomType">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'revenue-cell-' + year + '-' + label + '-' + roomType"
                                    class="px-2 py-2 text-right border border-orange-200 font-semibold hover:bg-orange-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all duration-200 dark:border-orange-600 dark:hover:bg-orange-900/20 dark:focus:bg-gray-700"
                                   >
                                     <span class=" text-xs">{{ calculateRevenue(roomData, roomType, year, label, advancedModes[year] || displayMode, roomPackages) }}</span>
                                   </td>
                                  <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 bg-orange-50 dark:border-orange-600 dark:bg-orange-800/30 dark:text-orange-200">
                                    <span class=" text-xs">
                                      {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'revenue', filteredRoomPackages) }}
                                    </span>
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 bg-orange-50 dark:border-orange-600 dark:bg-orange-800/30 dark:text-orange-200">
                                    <span class=" text-xs">
                                      {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', filteredRoomPackages) }}
                                    </span>
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tbody>
                          <!-- Total Row -->
                          <tfoot class="bg-orange-100 border-t-2 border-orange-300 dark:bg-orange-800/30 dark:border-orange-600">
                            <tr class="font-bold text-orange-900 dark:text-orange-200">
                              <td class="px-4 py-3 border-r border-orange-200 dark:border-orange-600">Total</td>
                              <template v-for="year in visibleYears" :key="'revenue-total-' + year">
                                <template v-if="!isYearCollapsed(year)">
                                  <td
                                    v-for="label in getColumnLabelsForYearLocal(year)"
                                    :key="'revenue-total-cell-' + year + '-' + label"
                                    class="px-2 py-2 text-right border border-orange-200 font-bold dark:border-orange-600"
                                  >
                                    {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'revenue', filteredRoomPackages) }}
                                  </td>
                                  <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 dark:border-orange-600 dark:text-orange-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', filteredRoomPackages) }}
                                  </td>
                                </template>
                                <template v-else>
                                  <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 dark:border-orange-600 dark:text-orange-200">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', filteredRoomPackages) }}
                                  </td>
                                </template>
                              </template>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </template>


              <!-- No Years Selected -->
              <template v-else-if="!roomData.status">
                <RoomNoYearsSelectedState :from-year="fromYear" :to-year="toYear" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Add Room Revenue Modal -->
  <transition name="fade">
    <div
      v-if="showAddRoomRevenueModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <div class="flex items-center gap-3">
            <PlusCircle class="w-7 h-7 text-white" />
            <div>
              <h2 class="text-2xl font-bold text-white">Add Room Revenue Assumptions</h2>
              <p class="text-violet-100 mt-1 text-sm">Enter revenue details for the selected period</p>
            </div>
          </div>
          <button 
            @click="cancelAddRoomRevenue"
            class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
          >
            <X class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pb-0 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <!-- Year and Month Select -->
          <div class="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Year</label>
              <select v-model="addRoomRevenueForm.year" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white">
                <option disabled value="">Choose a year</option>
                <option v-for="year in years" :key="'add-year-' + year" :value="year">{{ year }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Select Month</label>
              <select v-model="addRoomRevenueForm.month" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white">
                <option disabled value="">Choose a month</option>
                <option v-for="month in months" :key="'add-month-' + month" :value="month">{{ month }}</option>
              </select>
            </div>
          </div>
          <!-- Add Room Type Input and Button -->
          <div>
            <div class="font-bold text-gray-800 text-base mb-1">New Room Type</div>
            <div class="text-gray-500 text-sm ">If you want to add a new room type, enter the name below and click "Add Room Type".</div>
          </div>
          <div class="flex items-center gap-3 mb-6">
            <input
              v-model="newRoomType"
              type="text"
              placeholder="Add new room type"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
              @keyup.enter="addNewRoomType"
            />
            <input
              v-model="newRoomTypeRoomCount"
              type="number"
              min="1"
              placeholder="No. of Rooms"
              class="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
              @keyup.enter="addNewRoomType"
            />
            <button
              @click="addNewRoomType"
              class="flex items-center gap-1 px-3 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
              :disabled="!newRoomType.trim() || !newRoomTypeRoomCount || isAddingRoomType"
              title="Add Room Type"
            >
              <Plus class="w-4 h-4" />
              Add Room Type
            </button>
          </div>

          <!-- Input Table -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-1 h-6 bg-gradient-to-b from-violet-500 to-violet-600 rounded-full"></div>
              <h3 class="text-lg font-semibold text-gray-800">Revenue Items</h3>
            </div>
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-violet-600 to-violet-700 text-white sticky top-0">
                  <tr>
                    <th class="text-left px-6 py-4 font-semibold"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                    <th class="text-left px-6 py-4 font-semibold"><DollarSign class="w-4 h-4 inline mr-1" /> Rate</th>
                    <th class="text-left px-6 py-4 font-semibold min-w-[100px]"><Percent class="w-4 h-4 inline mr-1" /> Occupied Beds(%)</th>
                    <th class="w-10"></th>
                  </tr>
                </thead> 
                <tbody class="divide-y divide-gray-100">
                  <tr 
                    v-for="(row, index) in addRoomRevenueForm.rows" 
                    :key="index" 
                    class="hover:bg-violet-50/50 transition-colors"
                  >
                    <td class="px-2 py-4 min-w-[300px]">
                      <select
                        v-model="row.revenue_name"
                        placeholder="Select Room Type"
                        class="w-full px-3 mr-8 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
                      >
                        <option disabled value="">Select Room Type</option>
                        <option v-for="room_package in visibleRoomPackagesOptions" :key="room_package.value" :value="room_package.value">
                          {{ room_package.label }}
                        </option>
                      </select>
                    </td>
                    <td class="px-2 py-4">
                      <input
                        type="text"
                        v-model="row.rate"
                        @input="formatAmountInputWrapper(index, $event)"
                        @blur="cleanAmountValueWrapper(index)"
                        class="w-full px-2 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-left"
                        placeholder="0.00"
                      />
                    </td>
                    <td class="px-2 py-4 min-w-[100px]">
                      <input
                        v-model="row.occupied_beds"
                        type="number"
                        min="0"
                        max="100"
                        class="w-full px-2 py-2 border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-left"
                        :default="0"
                        placeholder="0%"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <button 
                        @click="removeRoomRevenueRow(index)"
                        class="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                        v-if="addRoomRevenueForm.rows.length > 1"
                      >
                        <X class="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center pt-3 pb-3 border-t border-gray-200 bg-white sticky bottom-0">
            <button 
              @click="addRoomRevenueRow" 
              class="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-all font-medium"
            >
              <Plus class="w-5 h-5" />
              Add Row
            </button>
            <div class="flex gap-3">
              <button
                @click="cancelAddRoomRevenue"
                class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <X class="w-5 h-5" />
                Cancel
              </button>
              <button 
                @click="submitAddRoomRevenueWrapper" 
                class="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium flex items-center gap-2"
              >
                <Check class="w-5 h-5" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  
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

  
  <!-- VAT Tax Modal -->
  <transition name="fade">
    <div
      v-if="showVATModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <Calculator class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">VAT Tax Settings</h2>
        </div>
        <!-- Modal Body -->
        <div class="p-8 pt-6">
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure VAT tax.</span>
          </div>
          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'vat-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                {{ year }}
              </span>
              <input
                v-model="vatByYear[year]"
                type="number"
                min="0"
                max="100"
                @keypress="allowOnlyNumbers($event)"
                class="px-6 py-2 border rounded-md focus:ring-violet-500 w-32"
                placeholder="VAT %"
              />
            </div>
          </div>
        </div>
        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="showVATModal = false"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Close
          </button>
          <button
            v-if="visibleYears.length"
            @click="showVATModal = false"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>

  
  <!-- Breakfast Allocation Modal -->
  <transition name="fade">
    <div
      v-if="showBreakfastModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <DollarSign class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Breakfast Allocation (USD)</h2>
        </div>
        <div class="p-8 pt-6">
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure breakfast allocation.</span>
          </div>
          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'breakfast-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                {{ year }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 text-sm">$</span>
                <input
                  v-model="breakfastByYear[year]"
                  type="number"
                  min="0"
                  step="0.01"
                  @keypress="allowOnlyNumbers($event)"
                  class="px-6 py-2 border rounded-md focus:ring-violet-500 w-32"
                  placeholder="USD"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="showBreakfastModal = false"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Close
          </button>
          <button
            v-if="visibleYears.length"
            @click="showBreakfastModal = false"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>


  <!-- Exchange Rate Modal -->
  <transition name="fade">
    <div
      v-if="showExchangeRateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <DollarSign class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Exchange Rate (To 1 USD)</h2>
        </div>
        <div class="p-8 pt-6">
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure exchange rate.</span>
          </div>
          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'exchange-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                {{ year }}
              </span>
              <div class="flex items-center gap-2">
                <input
                  v-model="exchangeRateByYear[year]"
                  type="number"
                  min="0"
                  step="0.0001"
                  @keypress="allowOnlyNumbers($event)"
                  class="px-6 py-2 border rounded-md focus:ring-violet-500 w-32"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="showExchangeRateModal = false"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Close
          </button>
          <button
            v-if="visibleYears.length"
            @click="showExchangeRateModal = false"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Service Charge Modal -->
  <transition name="fade">
    <div
      v-if="showServiceChargeModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-lg p-0 overflow-hidden">
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <DollarSign class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Service Charge</h2>
        </div>
        <div class="p-8 pt-6">
          <div v-if="!visibleYears.length" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertTriangle class="w-6 h-6 text-yellow-600" />
            <span class="text-yellow-800 font-medium">Please select both \"From Year\" and \"To Year\" to configure service charge.</span>
          </div>
          <div v-if="visibleYears.length" class="space-y-4 max-h-[50vh] overflow-auto pr-2">
            <div
              v-for="year in visibleYears"
              :key="'service-charge-' + year"
              class="flex justify-between items-center border-b pb-2"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-violet-600" />
                {{ year }}
              </span>
              <div class="flex items-center gap-2">
                <input
                  v-model="serviceChargeByYear[year]"
                  type="number"
                  min="0"
                  step="0.01"
                  @keypress="allowOnlyNumbers($event)"
                  class="px-6 py-2 border rounded-md focus:ring-violet-500 w-32"
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="showServiceChargeModal = false"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Close
          </button>
          <button
            v-if="visibleYears.length"
            @click="showServiceChargeModal = false"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>



  <!-- Room Type Count Modal -->
  <transition name="fade">
    <div
      v-if="showRoomTypeCountModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-200 w-[95%] max-w-2xl p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center gap-3 px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-700">
          <Calculator class="w-6 h-6 text-white" />
          <h2 class="text-xl font-bold text-white">Room Package Count Management</h2>
        </div>

        <!-- Modal Body -->
        <div class="p-8 pt-6">
          <div class="mb-4">
            <p class="text-gray-600 text-sm">Set the number of rooms for each room type. These values will be used in revenue calculations.</p>
          </div>
          
          <div class="space-y-4 max-h-[60vh] overflow-auto pr-2">
            <div
              v-for="roomType in visibleRoomTypes"
              :key="'room-count-' + roomType"
              class="flex justify-between items-center border-b pb-4"
            >
              <span class="font-medium text-gray-700 flex items-center gap-2">
                <BedDouble class="w-4 h-4 text-violet-600" />
                {{ roomType }}
              </span>
              <div class="flex items-center gap-2">
                <input
                  v-model="roomTypeCounts[roomType]"
                  type="number"
                  min="0"
                  @input="validateRoomCountInput($event, roomType)"
                  @keypress="allowOnlyNumbers($event)"
                  class="px-4 py-2 border rounded-lg focus:ring-violet-500 focus:border-violet-500 w-32 text-left"
                  placeholder="0"
                />
                <span class="text-gray-500 text-sm">rooms</span>
                <button
                  @click="removeRoomPackage(roomType)"
                  class="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remove package"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
            <div class="flex justify-between items-center">
              <span class="font-medium text-violet-800">Total Rooms:</span>
              <span class="font-bold text-violet-900 text-lg">
                {{ Object.values(roomTypeCounts).reduce((sum, count) => sum + (parseInt(count) || 0), 0) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-8 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="cancelRoomTypeCountModal"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Cancel
          </button>
          <button
            @click="saveRoomTypeCounts"
            class="px-4 py-2 rounded-md bg-violet-600 text-white hover:bg-violet-700 flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            Save Changes
          </button>
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
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { storeToRefs } from 'pinia';
import { useYearSettingsStore } from '@/components/utility/yearSettingsStore.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import Sidebar from "@/components/ui/Sidebar.vue";
import { CircleAlert, BadgeCent, Coffee, Table, AlertTriangle, BedDouble, Plus, PlusCircle, DollarSign, Calculator, Settings, Calendar, X, Check, Save, Loader2, RefreshCw, ChevronDown, ChevronRight, ArrowLeft, ChevronLeft, FolderOpen, Database, AlertCircle, ArrowRight, Percent, RotateCcw } from 'lucide-vue-next';
import alertService from "@/components/ui/ui_utility/alertService.js";

// Import room revenue utilities
import {
  // Core room revenue utilities
  ROOM_TYPES,
  DEFAULT_ROOM_TYPES,
  updateRoomTypes,
  getVisibleYears,
  getColumnLabels,
  toggleCollapse,
  isYearCollapsed,
  getAvailableBeds,
  getOccupiedBeds,
  getRate,
  calculateRevenue,
  calculateRoomTypeTotal,
  calculateMonthlyTotal,
  calculateGrandTotal,
  calculateTableTotal,
  getNumberOfRoomsForType,
  calculateTotalRoomCount,
  
  // Table utilities
  handleRoomCellEdit,
  handleRoomCellInput,
  handleRoomCellFocus,
  handleRoomCountEdit,
  saveRoomChanges,
  formatRoomAmountInput,
  cleanRoomAmountValue,
  
  // Data services
  getRoomRevenueList,
  getRoomPackagesList,
  createDefaultRoomPackages,
  deleteRoomPackage,
  createRoomRevenueAssumption,
  getMarketSegmentList,
  saveMarketSegmentChanges,
  
  // Modal utilities
  showAddRoomRevenueModal,
  addRoomRevenueForm,
  addRoomRevenueRow,
  removeRoomRevenueRow,
  resetRoomRevenueForm,
  cancelAddRoomRevenue
} from "@/components/utility/room_revenue_assumpt./index.js";

// Import year options utility
import { loadYearOptions, months } from "@/components/utility/expense_assumption/index.js";

// Import project service
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js';

// Import project-specific localStorage utilities
import { getProjectKey, clearOldLocalStorageKeys } from '@/components/utility/projectLocalStorage.js';

import { cloneDeep } from 'lodash-es';

// Import new room package utility
import { createRoomPackage } from '@/components/utility/room_revenue_assumpt./room_package_create.js';

// Import market segmentation utilities
import { MARKET_SEGMENT_CATEGORIES, MARKET_SEGMENTS } from "@/components/utility/room_revenue_assumpt./market_segments.js";
import RoomNoProjectSelectedState from '@/components/ui/room/RoomNoProjectSelectedState.vue';
import RoomErrorState from '@/components/ui/room/RoomErrorState.vue';
import RoomNoYearsSelectedState from '@/components/ui/room/RoomNoYearsSelectedState.vue';

// Import SettingsModal component
import SettingsModal from '@/components/ui/SettingsModal.vue';

// Pinia store for year settings
const yearSettingsStore = useYearSettingsStore();
const { fromYear, toYear, advancedModes } = storeToRefs(yearSettingsStore);
const { setFromYear, setToYear, setAdvancedModes, clearYearSettings, getFilteredToYears } = yearSettingsStore;

// Reactive state
const years = ref([]);
const displayMode = ref("monthly");
const roomData = ref({});
const showAdvanced = ref(false);
const tempAdvancedModes = ref({});
const marketSegmentation = ref(
  localStorage.getItem('marketSegmentation') === null
    ? false
    : localStorage.getItem('marketSegmentation') === 'true'
);

const roomPackages = ref([]);
const roomPackagesOptions = ref([]);
const hospitalityExperience = ref(
  localStorage.getItem('hospitalityExperience') === null
    ? true
    : localStorage.getItem('hospitalityExperience') === 'true'
);

const isSaved = ref(false);
const originalRoomData = ref({});
const changedCells = ref([]); // {year, label, roomType, field, newValue}
const isSaving = ref(false);
const saveError = ref("");
const showUnsavedWarning = ref("");

// New room type input
const newRoomType = ref("");
const newRoomTypeRoomCount = ref("");
const isAddingRoomType = ref(false);

// Add reactive state for market segmentation data
const marketSegmentData = ref({});
const marketSegmentChanges = ref([]); // Track market segment changes
const originalMarketSegmentData = ref({});
const marketSegmentationTablesRef = ref(null);

// Add reactive state for total number of rooms
const totalNumberOfRooms = ref(0);

// Add reactive state for VAT tax
const showVATModal = ref(false);
const vatByYear = ref({});

// Add reactive state for breakfast allocation
const showBreakfastModal = ref(false);
const breakfastByYear = ref({});

// Add reactive state for exchange rate
const showExchangeRateModal = ref(false);
const exchangeRateByYear = ref({});

// Add reactive state for service charge
const showServiceChargeModal = ref(false);
const serviceChargeByYear = ref({});

// Add reactive state for room type count modal
const showRoomTypeCountModal = ref(false);
const roomTypeCounts = ref({});

// Track soft-deleted room packages (for restore)
const deletedPackages = ref(new Set());

// Visible room types honoring deletion and preserving order (defaults first, then customs)
const visibleRoomTypes = computed(() => {
  const names = (roomPackages.value || []).map(p => p.package_name || p.name);
  const ordered = [];
  // include default types that exist in current packages first
  DEFAULT_ROOM_TYPES.forEach(n => {
    if (names.includes(n)) ordered.push(n);
  });
  // then include any custom types
  names.forEach(n => {
    if (!ordered.includes(n)) ordered.push(n);
  });
  return ordered.filter(n => !deletedPackages.value.has(n));
});

// Options list filtered to visible packages
const visibleRoomPackagesOptions = computed(() => {
  return (roomPackagesOptions.value || []).filter(opt => !deletedPackages.value.has(opt.value));
});

// Computed properties
const visibleYears = computed(() => {
  return getVisibleYears(fromYear.value, toYear.value);
});

// Filtered roomPackages array passed to calculators (preserving structure but limited to visible types)
const filteredRoomPackages = computed(() => {
  const set = deletedPackages.value;
  return (roomPackages.value || []).filter(pkg => !set.has(pkg.package_name || pkg.name));
});

// Computed property for filtered years in "To Year" dropdown
const filteredToYears = computed(() => {
  return getFilteredToYears(years.value);
});

// Computed property to get column labels for a specific year
const getColumnLabelsForYearLocal = (year) => {
  return getColumnLabels(advancedModes.value[year] || displayMode.value);
};

// Calculation cache instance to publish totals for other pages
const calculationCache = useCalculationCache();

function getProjectName() {
  return selectedProject.value?.project_name || 'default';
}

function parseCurrencyToNumber(value) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function updateRoomRevenueCache() {
  try {
    const project = getProjectName();
    if (!visibleYears.value.length) return;
    
    // Cache Total Number of Rooms based on market segmentation setting
    if (marketSegmentation.value) {
      // When market segmentation is enabled, cache the totalNumberOfRooms value
      // console.log('Caching manual total rooms:', totalNumberOfRooms.value, 'for market segmentation');
      for (const year of visibleYears.value) {
        const labels = getColumnLabelsForYearLocal(year);
        for (const label of labels) {
          calculationCache.setValue(project, 'Room Revenue Assumptions', 'Total Rooms', year, label, totalNumberOfRooms.value);
        }
      }
    } else {
      // When market segmentation is disabled, cache the total rooms from room package count management
      const totalRoomsFromPackages = Object.values(roomTypeCounts.value).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
      // console.log('Caching calculated total rooms from packages:', totalRoomsFromPackages);
      for (const year of visibleYears.value) {
        const labels = getColumnLabelsForYearLocal(year);
        for (const label of labels) {
          calculationCache.setValue(project, 'Room Revenue Assumptions', 'Total Rooms', year, label, totalRoomsFromPackages);
        }
      }
    }
    
    for (const year of visibleYears.value) {
      const labels = getColumnLabelsForYearLocal(year);
      // Monthly totals
      for (const label of labels) {
        const formatted = calculateMonthlyTotal(roomData.value, year, label, advancedModes.value[year] || displayMode.value, 'revenue', filteredRoomPackages.value);
        const numeric = parseCurrencyToNumber(formatted);
        if (numeric > 0) {
          calculationCache.setValue(project, 'Room Revenue Assumptions', 'Total Room Revenue', year, label, numeric);
        }
      }
      // Year total
      const yearFormatted = calculateGrandTotal(roomData.value, year, advancedModes.value[year] || displayMode.value, 'revenue', filteredRoomPackages.value);
      const yearNumeric = parseCurrencyToNumber(yearFormatted);
      if (yearNumeric > 0) {
        calculationCache.setValue(project, 'Room Revenue Assumptions', 'Total Room Revenue Year', year, 'ALL', yearNumeric);
      }
    }
  } catch (e) {
    // silent fail to avoid UI disruption
  }
}

// Watch for changes in visible years to initialize advanced modes
watch(visibleYears, () => {
  visibleYears.value.forEach(year => {
    if (!advancedModes.value[year]) {
      yearSettingsStore.setAdvancedMode(year, displayMode.value);
    }
  });
});

// Watch for hospitality experience changes
watch(hospitalityExperience, (newValue) => {
  localStorage.setItem('hospitalityExperience', newValue);
});

// Watch for market segmentation changes
watch(marketSegmentation, (newValue) => {
  localStorage.setItem('marketSegmentation', newValue);
  // Update cache when market segmentation setting changes
  updateRoomRevenueCache();
});

// Function to load project-specific settings
function loadProjectSettings() {
  const project = selectedProject.value;
  if (!project || !project.project_name) {
    // Clear settings if no project selected
    totalNumberOfRooms.value = 0;
    vatByYear.value = {};
    breakfastByYear.value = {};
    exchangeRateByYear.value = {};
    serviceChargeByYear.value = {};
    return;
  }

  // Load project-specific settings
  const storedTotalRooms = localStorage.getItem(getProjectKey('totalNumberOfRooms'));
  if (storedTotalRooms) {
    // If there's a stored value, use it
    totalNumberOfRooms.value = parseInt(storedTotalRooms);
  } else {
    // If no stored value, calculate from room packages
    totalNumberOfRooms.value = calculateTotalRoomCount(roomPackages.value, roomData.value);
  }

  // Load VAT by year for this project
  try {
    const storedVat = localStorage.getItem(getProjectKey('vatByYear'));
    vatByYear.value = storedVat ? JSON.parse(storedVat) : {};
  } catch (e) {
    vatByYear.value = {};
  }

  // Load Breakfast allocation by year for this project
  try {
    const storedBreakfast = localStorage.getItem(getProjectKey('breakfastByYear'));
    breakfastByYear.value = storedBreakfast ? JSON.parse(storedBreakfast) : {};
  } catch (e) {
    breakfastByYear.value = {};
  }

  // Load Exchange rate by year for this project
  try {
    const storedExchange = localStorage.getItem(getProjectKey('exchangeRateByYear'));
    exchangeRateByYear.value = storedExchange ? JSON.parse(storedExchange) : {};
  } catch (e) {
    exchangeRateByYear.value = {};
  }

  // Load Service charge by year for this project
  try {
    const storedService = localStorage.getItem(getProjectKey('serviceChargeByYear'));
    serviceChargeByYear.value = storedService ? JSON.parse(storedService) : {};
  } catch (e) {
    serviceChargeByYear.value = {};
  }
}

// Watch for total number of rooms changes
watch(totalNumberOfRooms, (newValue) => {
  // console.log('TotalNumberOfRooms changed to:', newValue, 'Market Segmentation:', marketSegmentation.value);
  localStorage.setItem(getProjectKey('totalNumberOfRooms'), newValue.toString());
  // Update cache when total rooms change
  updateRoomRevenueCache();
});

// Watch for room type counts changes to update cache
watch(roomTypeCounts, () => {
  // Update cache when room type counts change
  updateRoomRevenueCache();
}, { deep: true });

// Watch for room packages changes to recalculate total rooms
watch(roomPackages, () => {
  // Only recalculate total rooms from packages when market segmentation is DISABLED
  // When market segmentation is enabled, user has manual control over total rooms
  if (!marketSegmentation.value) {
    totalNumberOfRooms.value = calculateTotalRoomCount(roomPackages.value, roomData.value);
  }
  // Update cache when room packages change
  updateRoomRevenueCache();
}, { deep: true });

// Function to recalculate total rooms manually
function recalculateTotalRooms() {
  // Only recalculate from room packages when market segmentation is disabled
  if (!marketSegmentation.value) {
    totalNumberOfRooms.value = calculateTotalRoomCount(roomPackages.value, roomData.value);
  }
  updateRoomRevenueCache();
}

// Watch for room type counts changes to update cache in real-time
watch(roomTypeCounts, (newCounts) => {
  // Update cache in real-time as user types
  if (Object.keys(newCounts).length > 0) {
    updateRoomRevenueCache();
  }
}, { deep: true, immediate: false });

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

// On mount, initialize years
onMounted(async () => {
  try {
    await initializeProjectService();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Clear old localStorage keys for migration
    clearOldLocalStorageKeys();
    
    // Load project-specific settings
    loadProjectSettings();
    
    years.value = await loadYearOptions();
    roomData.value = await getRoomRevenueList();    
    originalRoomData.value = cloneDeep(roomData.value); 
    const marketSegmentResponse = await getMarketSegmentList();
    marketSegmentData.value = marketSegmentResponse || {};
    originalMarketSegmentData.value = cloneDeep(marketSegmentData.value);
    const response = await getRoomPackagesList(selectedProject.value?.project_name);
    roomPackages.value = response.data.data.room_packages || [];
    deletedPackages.value = new Set();
    roomPackagesOptions.value = roomPackages.value.map(room_package => ({
      label: room_package.package_name,
      value: room_package.package_name
    }));
    await ensureDefaultPackages();
    updateRoomTypes(roomPackages.value);
    
    // Initialize room type counts for current project
    roomTypeCounts.value = {};
    ROOM_TYPES.forEach(roomType => {
      roomTypeCounts.value[roomType] = getNumberOfRoomsForType(roomPackages.value, roomType, roomData.value);
    });
    
    // Only calculate total rooms from packages if no stored value exists
    // This preserves user input when market segmentation is enabled
    if (!localStorage.getItem(getProjectKey('totalNumberOfRooms'))) {
      totalNumberOfRooms.value = calculateTotalRoomCount(roomPackages.value, roomData.value);
    }
    
    isSaved.value = true;
    // ... keep VAT, breakfast, exchange, service charge, roomTypeCounts logic ...
    // Publish current totals into calculation cache for cross-page usage
    updateRoomRevenueCache();
    
    // Check if we should show refresh success alert
    if (localStorage.getItem('showRefreshSuccess') === 'true') {
      localStorage.removeItem('showRefreshSuccess');
      alertService.success("Page refreshed successfully");
    }
  } catch (err) {
    console.error("Error loading data:", err);
  }
});

// Watchers to persist year selection (now handled by Pinia store)
// watch(fromYear, ...)
// watch(toYear, ...)

// Watch for project changes and reload data
watch(selectedProject, (newProject, oldProject) => {
 //  // console.log('Project changed from:', oldProject?.project_name, 'to:', newProject?.project_name);
  
  if (newProject) {
    // Load project-specific settings
    loadProjectSettings();
    // Call async function to reload data
    reloadDataForProject(newProject);
  } else {
    // Clear data when no project is selected
    roomData.value = { status: 'no_project_selected', message: 'No project selected' };
    marketSegmentData.value = { status: 'no_project_selected', message: 'No project selected' };
    originalRoomData.value = cloneDeep(roomData.value);
    originalMarketSegmentData.value = cloneDeep(marketSegmentData.value);
    // Clear project-specific settings
    totalNumberOfRooms.value = 0;
  }
}, { deep: true });

// Async function to reload data for a project
async function reloadDataForProject(newProject) {
  try {
   //  // console.log('Reloading data for new project:', newProject.project_name);
    
    // Reload room revenue data for the new project
    roomData.value = await getRoomRevenueList();
    originalRoomData.value = cloneDeep(roomData.value);
    
    // Reload market segment data for the new project
    const marketSegmentResponse = await getMarketSegmentList();
    marketSegmentData.value = marketSegmentResponse || {};
    originalMarketSegmentData.value = cloneDeep(marketSegmentData.value);
    
    // Reload room packages for the new project
    await refreshRoomPackages();
    
    // Ensure default packages exist for the new project
    await ensureDefaultPackages();
    
    // Update ROOM_TYPES based on available packages
    updateRoomTypes(roomPackages.value);
    
    // Reset save status
    isSaved.value = true;
    saveError.value = "";
    
    // Update room type counts for new project
    roomTypeCounts.value = {};
    ROOM_TYPES.forEach(roomType => {
      roomTypeCounts.value[roomType] = getNumberOfRoomsForType(roomPackages.value, roomType, roomData.value);
    });
    
    // Only calculate total rooms from packages if no stored value exists for new project
    // This preserves user input when market segmentation is enabled
    if (!localStorage.getItem(getProjectKey('totalNumberOfRooms'))) {
      totalNumberOfRooms.value = calculateTotalRoomCount(roomPackages.value, roomData.value);
    }
    
    // Load project-specific settings after data reload
    loadProjectSettings();
    // Update cache after reloading data
    updateRoomRevenueCache();
    
   //  // console.log('Data reloaded successfully for project:', newProject.project_name);
  } catch (error) {
    console.error('Error reloading data for new project:', error);
  }
}

function clearYearSelection() {
  clearYearSettings();
  isSaved.value = false;
}

// Wrapper functions for room revenue cell editing
function handleRoomCellEditWrapper({ year, label, roomType, field, event }) {
  handleRoomCellEdit({
    year,
    label,
    roomType,
    field,
    event,
    originalRoomData,
    changedCells,
    roomData,
    isSaved
  });
  // Update cache after cell edit
  updateRoomRevenueCache();
}

// Wrapper function for room count editing
function handleRoomCountEditWrapper({ roomType, event }) {
  handleRoomCountEdit({
    roomType,
    event,
    originalRoomData,
    changedCells,
    roomData,
    isSaved
  });
  // Update cache after count edit
  updateRoomRevenueCache();
  
  // Recalculate total rooms after editing room counts
  recalculateTotalRooms();
}

// Wrapper functions for modal form handling
const formatAmountInputWrapper = (index, event) => {
  formatRoomAmountInput(index, addRoomRevenueForm, event);
};

const cleanAmountValueWrapper = (index) => {
  cleanRoomAmountValue(index, addRoomRevenueForm);
};

// Wrapper function for submit room revenue
const submitAddRoomRevenueWrapper = async () => {
  if (addRoomRevenueForm && addRoomRevenueForm.value) {
    try {
      const result = await createRoomRevenueAssumption({
        year: addRoomRevenueForm.value.year,
        month: addRoomRevenueForm.value.month,
        room_revenue_assumptions: addRoomRevenueForm.value.rows
      });
      
      if (result && result.success) {
        // Close modal and reset form
        showAddRoomRevenueModal.value = false;
        resetRoomRevenueForm();
        
        // Reload data to show the newly created room revenue
        roomData.value = await getRoomRevenueList();
        originalRoomData.value = cloneDeep(roomData.value);
        updateRoomRevenueCache();
        
        // Recalculate total rooms after adding new room revenue
        recalculateTotalRooms();
        
        // Show success message
        alertService.success("Room revenue assumption created successfully!");
      }
    } catch (error) {
      console.error('Error creating room revenue assumption:', error);
      // Show error message to user
      alertService.error(error.message || "Failed to create Room Revenue Assumption. Please try again.");
    }
  }
};

// Wrapper function for saveChanges
const saveChangesWrapper = async () => {
  await saveRoomChanges(changedCells, isSaving, saveError, roomData, originalRoomData, isSaved);
  // Update cache after saving
  updateRoomRevenueCache();
  
  // Recalculate total rooms after saving in case room data changed
  recalculateTotalRooms();
  
  // Also save market segment changes if any
  if (marketSegmentationTablesRef.value && marketSegmentationTablesRef.value.marketSegmentChanges) {
    const segmentChanges = marketSegmentationTablesRef.value.marketSegmentChanges;
    if (segmentChanges.length > 0) {
      try {
        const result = await saveMarketSegmentChanges(segmentChanges);
        // Handle both direct response and wrapped response structures
        const responseData = result.data || result;
        if (responseData && responseData.status === 'success') {
         //  // console.log('Market segment changes saved successfully:', responseData);
          // Clear changes after successful save
          marketSegmentationTablesRef.value.marketSegmentChanges = [];
          originalMarketSegmentData.value = cloneDeep(marketSegmentData.value);
          alertService.success('All changes saved successfully!');
        } else {
          console.error('Failed to save market segment changes:', result);
          alertService.error('Failed to save market segment changes. Please try again.');
        }
      } catch (error) {
        console.error('Error saving market segment changes:', error);
        alertService.error('Error saving market segment changes: ' + error.message);
      }
    }
  }
};

// Unsaved Changes Warning Modal
// Watch for unsaved changes to show warning on page refresh
watch(isSaved, (newValue) => {
  if (!newValue) {
    // Add beforeunload event listener when there are unsaved changes
    window.addEventListener('beforeunload', handleBeforeUnload);
  } else {
    // Remove beforeunload event listener when changes are saved
    window.removeEventListener('beforeunload', handleBeforeUnload);
  }
  // Recompute cache when save state toggles (often after apply)
  updateRoomRevenueCache();
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

// Handle navigation cancellation
function cancelNavigation() {
  showUnsavedWarning.value = false;
}

// Handle navigation confirmation
function confirmNavigation() {
  showUnsavedWarning.value = false;
  // Allow the navigation to proceed by removing the event listener temporarily
  window.removeEventListener('beforeunload', handleBeforeUnload);
  // Trigger the actual navigation (refresh, close, etc.)
  window.location.reload();
}

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

async function refreshRoomRevenueData() {
  // Set flag to show success alert after reload
  localStorage.setItem('showRefreshSuccess', 'true');
  // Reload the entire page
  window.location.reload();
}

async function addNewRoomType() {
  const name = newRoomType.value.trim();
  const roomCount = parseInt(newRoomTypeRoomCount.value, 10);
  if (!name || !roomCount || roomCount < 1) return;
  // Prevent duplicates (case-insensitive)
  const exists = roomPackagesOptions.value.some(
    (pkg) => pkg.label.toLowerCase() === name.toLowerCase()
  );
  if (!exists) {
    isAddingRoomType.value = true;
    try {
      const result = await createRoomPackage({ 
        package_name: name, 
        number_of_rooms: roomCount,
        project_name: selectedProject.value?.project_name 
      });
      
     //  // console.log('Create room package result:', result);
      
      // Check for success in different possible response structures
      if (result && (result.success || result.message?.success)) {
        newRoomType.value = "";
        newRoomTypeRoomCount.value = "";
        alertService.success("Room type created successfully!");
        // Refresh room packages list
        await refreshRoomPackages();
      } else {
        // console.error('Failed to create room package:', result);
        alertService.error(result?.error || result?.message?.error || "Failed to create room type. Try again.");
      }
    } catch (error) {
      // console.error('Error creating room package:', error);
      alertService.error("Failed to create room type. Try again.");
    } finally {
      isAddingRoomType.value = false;
    }
  } else {
    alertService && alertService.error && alertService.error("Room type already exists.");
  }
}

// Check if a room type is a default package
function isDefaultPackage(roomType) {
  return DEFAULT_ROOM_TYPES.includes(roomType);
}

// Soft-remove a room package locally with ability to restore
function removeRoomPackage(roomType) {
  const next = new Set(deletedPackages.value);
  next.add(roomType);
  deletedPackages.value = next;
  isSaved.value = false;
  alertService.info(`Removed '${roomType}'. Click Restore to undo before saving.`);
  
  // Recalculate total rooms after removing package
  recalculateTotalRooms();
}

// Restore all removed packages
function restorePackages() {
  deletedPackages.value = new Set();
  isSaved.value = false;
  alertService.info('Restored removed packages');
  
  // Recalculate total rooms after restoring packages
  recalculateTotalRooms();
}

// Refresh room packages list
async function refreshRoomPackages() {
  try {
    const response = await getRoomPackagesList(selectedProject.value?.project_name);
    if (response && response.success) {
      roomPackages.value = response.data.room_packages || [];
      // Reset local deletions when reloading from server
      deletedPackages.value = new Set();
      roomPackagesOptions.value = roomPackages.value.map(room_package => ({
        label: room_package.package_name,
        value: room_package.package_name
      }));
      
      // Update ROOM_TYPES based on available packages
      updateRoomTypes(roomPackages.value);
    }
  } catch (error) {
    console.error('Error refreshing room packages:', error);
  }
}

// Ensure default packages exist for the current project
async function ensureDefaultPackages() {
  if (!selectedProject.value?.project_name) {
    return;
  }

  try {
    const result = await createDefaultRoomPackages(selectedProject.value.project_name);
    if (result && result.success) {
      // console.log('Default packages ensured for project:', selectedProject.value.project_name);
      // Refresh room packages list
      await refreshRoomPackages();
    }
  } catch (error) {
    console.error('Error ensuring default packages:', error);
  }
}

// Example utility functions for market segmentation tables (implement as needed)
function getMarketSegmentValue(data, segment, year, label, field) {
  // Return the value for the given segment, year, label, and field
  // Example: data[segment.market_segment]?.[year]?.[label]?.[field] || 0
  const value = data?.[segment.market_segment]?.[year]?.[label]?.[field] ?? 0;
  return (parseFloat(value) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function calculateMarketSegmentTotal(data, segment, year, field) {
  // Calculate total for the segment, year, and field
  let total = 0;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  for (const month of months) {
    const value = data?.[segment.market_segment]?.[year]?.[month]?.[field] ?? 0;
    total += parseFloat(value) || 0;
  }
  return total.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function handleMarketSegmentCellInput({ year, label, segment, field, event }) {
  // Handle input event for market segment cell
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  
  // Update the data structure
  if (!marketSegmentData.value[year]) marketSegmentData.value[year] = {};
  if (!marketSegmentData.value[year][segment.market_segment]) marketSegmentData.value[year][segment.market_segment] = {};
  if (!marketSegmentData.value[year][segment.market_segment][label]) marketSegmentData.value[year][segment.market_segment][label] = {};
  
  marketSegmentData.value[year][segment.market_segment][label][field] = value;
  
  // Track changes for saving
  const change = {
    year,
    month: label,
    market_segment: segment.market_segment,
    field,
    value
  };
  
  // Check if this change already exists
  const existingIndex = marketSegmentChanges.value.findIndex(
    c => c.year === year && c.month === label && c.market_segment === segment.market_segment && c.field === field
  );
  
  if (existingIndex >= 0) {
    marketSegmentChanges.value[existingIndex] = change;
  } else {
    marketSegmentChanges.value.push(change);
  }
  
  // Mark as unsaved
  isSaved.value = false;
}

function handleMarketSegmentCellFocus({ event }) {
  // Handle focus event for market segment cell
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}

function handleMarketSegmentCellEditWrapper({ year, label, segment, field, event }) {
  // Handle blur/edit event for market segment cell
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  
  if (!marketSegmentData.value[year]) marketSegmentData.value[year] = {};
  if (!marketSegmentData.value[year][segment.market_segment]) marketSegmentData.value[year][segment.market_segment] = {};
  if (!marketSegmentData.value[year][segment.market_segment][label]) marketSegmentData.value[year][segment.market_segment][label] = {};
  
  marketSegmentData.value[year][segment.market_segment][label][field] = value;
  
  // Mark as unsaved
  isSaved.value = false;
}

import MarketSegmentationTables from '@/components/ui/MarketSegmentationTables.vue';

// Preserve caret position while updating reactive data from contenteditable cells
function handleRoomCellInputWrapper({ year, label, roomType, field, event }) {
  const target = event.target;
  if (!target) return;
  const selection = window.getSelection();
  let startOffset = 0;
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    startOffset = range.startOffset;
  }
  handleRoomCellInput({ year, label, roomType, field, event });
  // Restore caret position to previous logical place within the same node
  requestAnimationFrame(() => {
    try {
      const sel = window.getSelection();
      if (!sel) return;
      const node = target.firstChild || target;
      const textLen = (node.textContent || '').length;
      const newOffset = Math.min(startOffset, textLen);
      const newRange = document.createRange();
      newRange.setStart(node, newOffset);
      newRange.setEnd(node, newOffset);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } catch (_) {
      // ignore
    }
  });
}

// Persist VAT and Breakfast allocation to localStorage (project-scoped)
watch(vatByYear, (newValue) => {
  localStorage.setItem(getProjectKey('vatByYear'), JSON.stringify(newValue));
}, { deep: true });

watch(breakfastByYear, (newValue) => {
  localStorage.setItem(getProjectKey('breakfastByYear'), JSON.stringify(newValue));
}, { deep: true });

// Persist Exchange Rate to localStorage (project-scoped)
watch(exchangeRateByYear, (newValue) => {
  localStorage.setItem(getProjectKey('exchangeRateByYear'), JSON.stringify(newValue));
}, { deep: true });

// Persist Service Charge to localStorage (project-scoped)
watch(serviceChargeByYear, (newValue) => {
  localStorage.setItem(getProjectKey('serviceChargeByYear'), JSON.stringify(newValue));
}, { deep: true });

const sidebarCollapsed = ref(false);

// Handle market segment data changes
function handleMarketSegmentDataChanged(newData) {
  marketSegmentData.value = newData;
  isSaved.value = false;
  
  // Clear calculation cache when market segment data changes
  const calculationCache = useCalculationCache();
  const project = selectedProject.value?.project_name || 'default';
  // Clear the cache for market segmentation calculations
  if (calculationCache.cache[project] && calculationCache.cache[project]['Market Segmentation']) {
    calculationCache.cache[project]['Market Segmentation'] = {};
  }
}

// Handle market segment data loaded
function handleMarketSegmentDataLoaded(data) {
  marketSegmentData.value = data;
  originalMarketSegmentData.value = cloneDeep(data);
}

// Room Type Count Modal Functions
function openRoomTypeCountModal() {
  // Initialize roomTypeCounts with current values
  roomTypeCounts.value = {};
  ROOM_TYPES.forEach(roomType => {
    roomTypeCounts.value[roomType] = getNumberOfRoomsForType(roomPackages.value, roomType, roomData.value);
  });
  showRoomTypeCountModal.value = true;
}

function cancelRoomTypeCountModal() {
  showRoomTypeCountModal.value = false;
  roomTypeCounts.value = {};
}

// Input validation functions for room count inputs
function validateRoomCountInput(event, roomType) {
  const input = event.target;
  let value = input.value;
  
  // Remove any non-numeric characters except for the minus sign at the beginning
  value = value.replace(/[^0-9]/g, '');
  
  // Ensure the value is not negative
  if (value < 0) {
    value = 0;
  }
  
  // Update the input value and the reactive data
  input.value = value;
  roomTypeCounts.value[roomType] = value;
}

function allowOnlyNumbers(event) {
  // Allow: backspace, delete, tab, escape, enter, and navigation keys
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  if (allowedKeys.includes(event.key) ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.key === 'a' && event.ctrlKey === true) ||
      (event.key === 'c' && event.ctrlKey === true) ||
      (event.key === 'v' && event.ctrlKey === true) ||
      (event.key === 'x' && event.ctrlKey === true)) {
    return;
  }
  
  // Allow only numbers and decimal point
  const allowedChars = /[0-9.,]/;
  if (allowedChars.test(event.key)) {
    return;
  }
  
  // Prevent the default action for all other keys
  event.preventDefault();
}

async function saveRoomTypeCounts() {
  try {
    // Prepare changes for API
    const changes = [];
    ROOM_TYPES.forEach(roomType => {
      const count = parseInt(roomTypeCounts.value[roomType]) || 0;
      changes.push({
        roomType: roomType,
        field: 'room_count',
        newValue: count
      });
    });

    // Call API to save room package changes
    const { saveRoomRevenueChanges } = await import('@/components/utility/room_revenue_assumpt./data_service.js');
    const result = await saveRoomRevenueChanges(changes);
    
    // Handle the response
    const apiResult = result.data || result;
    if (apiResult.status === 'success') {
      // Update local room packages with new counts
      roomPackages.value.forEach(pkg => {
        if (roomTypeCounts.value[pkg.package_name] !== undefined) {
          pkg.number_of_rooms = parseInt(roomTypeCounts.value[pkg.package_name]) || 0;
        }
      });

      // Update roomData to reflect changes
      if (!roomData.value.room_packages) {
        roomData.value.room_packages = [];
      }
      
      // Update or add room packages in roomData
      ROOM_TYPES.forEach(roomType => {
        const count = parseInt(roomTypeCounts.value[roomType]) || 0;
        const existingIndex = roomData.value.room_packages.findIndex(pkg => pkg.name === roomType);
        
        if (existingIndex >= 0) {
          roomData.value.room_packages[existingIndex].number_of_rooms = count;
        } else {
          roomData.value.room_packages.push({
            name: roomType,
            number_of_rooms: count
          });
        }
      });

      // Update original data to reflect saved state
      originalRoomData.value = cloneDeep(roomData.value);
      isSaved.value = true;
      
      // Update cache with new room counts
      updateRoomRevenueCache();
      
      // Recalculate total rooms after saving room type counts
      recalculateTotalRooms();
      
      // Close modal
      showRoomTypeCountModal.value = false;
      
      // Show success message
      alertService.success("Room type counts updated and saved successfully!");
    } else {
      throw new Error(apiResult.message || 'Failed to save room type counts');
    }
  } catch (error) {
    console.error('Error saving room type counts:', error);
    alertService.error("Failed to save room type counts. Please try again.");
  }
}

// Settings Modal Functions
const showSettingsModal = ref(false);

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
  