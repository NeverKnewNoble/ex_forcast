<template>
    <div class="flex ">
      <Sidebar />
  
      <div class="flex-1 min-h-screen bg-gradient-to-br from-white to-violet-50">
        <!-- Main Content Area -->
        <div class="flex">
          <!-- Left Sidebar - Filters and Controls -->
          <div class="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 min-h-screen flex flex-col shadow-sm">
            <!-- Header Section -->
            <div class="mb-8">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BedDouble class="w-5 h-5 mx-3 text-white" />
                </div>
                <h1 class="text-2xl font-bold text-gray-900">Room Revenue Assumptions</h1>
              </div>
              <p class="text-sm text-gray-500">Manage and configure your room revenue data</p>
            </div>

            <!-- Save Status Section -->
            <div class="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
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
            
            <!-- Action Buttons Section -->
            <div class="mb-8">
              <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Plus class="w-4 h-4 text-violet-600" />
                Quick Actions
              </h3>
              <button 
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

            <!-- Display Format Switch -->
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
              <div>
                <label class="text-sm font-medium text-gray-700">Display Format</label>
                <p class="text-xs text-gray-500">Market segmentation</p>
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
                        v-model="fromYear" 
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
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
                        v-model="toYear" 
                        class="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white text-sm"
                      >
                    <option value="">Select Year</option>
                    <option v-for="year in years" :key="'to-' + year" :value="year">{{ year }}</option>
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
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right Side - Table Area -->
          <div class="flex-1 p-4">
            <!-- Table Header with Stats -->
            <template v-if="visibleYears.length">
              <div class="mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <BedDouble class="w-3 h-3 text-white" />
                  </div>
                  <h2 class="text-lg font-bold text-gray-800">Room Revenue Overview</h2>
                </div>
              </div>
              <div class="space-y-8">
                <!-- Table 1: Available Beds -->
                <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-4">
                    <h2 class="text-xl font-bold flex items-center gap-2"><BedDouble class="w-5 h-5" /> Available Beds</h2>
                    <p class="text-violet-100 text-sm">Number of rooms available</p>
                  </div>
                  <div class="overflow-x-auto">
                    <div class="min-w-full w-max">
                      <table class="w-full">
                        <thead class="bg-gradient-to-r from-violet-50 to-violet-100 text-violet-800 sticky top-0">
                          <tr>
                            <th class="px-4 py-3 text-left font-semibold border-r border-violet-200"><BedDouble class="w-4 h-4 inline mr-1" /> Room Type</th>
                            <th class="px-4 py-3 text-left font-semibold border-r border-violet-200">No. of Rooms</th>
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
                            <th class="px-4 py-2 border-r border-violet-200 font-bold">
                              {{ calculateTotalRoomCount(roomPackages, roomData) }}
                            </th>
                            <template v-for="year in visibleYears" :key="'available-months-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <th
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="year + '-available-' + label"
                                  class="px-4 py-2 text-center border border-violet-300 min-w-[110px]"
                                >
                                  {{ label }}
                                </th>
                                <th class="px-4 py-2 text-center border border-violet-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                              <template v-else>
                                <th class="px-4 py-2 text-center border border-violet-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <tr
                            v-for="roomType in ROOM_TYPES"
                            :key="'available-' + roomType"
                            class="even:bg-violet-50 hover:bg-violet-100 transition"
                          >
                            <td class="px-4 py-3 font-medium border-r border-violet-200">{{ roomType }}</td>
                            <td 
                              class="px-4 py-3 font-medium border-r border-violet-200 text-gray-600"
                              contenteditable="true"
                              @input="handleRoomCellInput({ roomType, field: 'room_count', event: $event })"
                              @focus="handleRoomCellFocus({ roomType, field: 'room_count', event: $event })"
                              @blur="handleRoomCountEditWrapper({ roomType, event: $event })"
                            >
                              {{ getNumberOfRoomsForType(roomPackages, roomType, roomData) }}
                            </td>
                            <template v-for="year in visibleYears" :key="'available-row-' + year + '-' + roomType">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'available-cell-' + year + '-' + label + '-' + roomType"
                                  contenteditable="true"
                                  class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                  @input="handleRoomCellInput({ year, label, roomType, field: 'number_of_rooms', event: $event })"
                                  @focus="handleRoomCellFocus({ year, label, roomType, field: 'number_of_rooms', event: $event })"
                                  @blur="handleRoomCellEditWrapper({ year, label, roomType, field: 'number_of_rooms', event: $event })"
                                >
                                  <span class="font-mono text-xs">{{ getAvailableBeds(roomData, roomType, year, label, advancedModes[year] || displayMode, roomPackages) }}</span>
                                </td>
                                <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                  <span class="font-mono text-xs text-violet-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'available_beds', roomPackages) }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                                  <span class="font-mono text-xs text-violet-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'available_beds', roomPackages) }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                        </tbody>
                        <!-- Total Row -->
                        <tfoot class="bg-violet-100 border-t-2 border-violet-300">
                          <tr class="font-bold text-violet-900">
                            <td class="px-4 py-3 border-r border-violet-200">Total</td>
                            <td class="px-4 py-3 border-r border-violet-200 font-bold">
                              {{ calculateTotalRoomCount(roomPackages, roomData) }}
                            </td>
                            <template v-for="year in visibleYears" :key="'available-total-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'available-total-cell-' + year + '-' + label"
                                  class="px-2 py-2 text-right border border-violet-200 font-bold"
                                >
                                  {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'available_beds', roomPackages) }}
                                </td>
                                <td class="px-2 py-2 text-right border border-violet-200 font-bold text-violet-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'available_beds', roomPackages) }}
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-violet-200 font-bold text-violet-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'available_beds', roomPackages) }}
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
                <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
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
                                <th class="px-4 py-2 text-center border border-blue-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                              <template v-else>
                                <th class="px-4 py-2 text-center border border-blue-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <tr
                            v-for="roomType in ROOM_TYPES"
                            :key="'occupied-' + roomType"
                            class="even:bg-blue-50 hover:bg-blue-100 transition"
                          >
                            <td class="px-4 py-3 font-medium border-r border-blue-200">{{ roomType }}</td>
                            <template v-for="year in visibleYears" :key="'occupied-row-' + year + '-' + roomType">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'occupied-cell-' + year + '-' + label + '-' + roomType"
                                  contenteditable="true"
                                  class="px-2 py-2 text-right border border-blue-200 hover:bg-blue-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  @input="handleRoomCellInput({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                  @focus="handleRoomCellFocus({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                  @blur="handleRoomCellEditWrapper({ year, label, roomType, field: 'occupied_beds', event: $event })"
                                >
                                  <span class="font-mono text-xs">{{ getOccupiedBeds(roomData, roomType, year, label, advancedModes[year] || displayMode) }}</span>
                                </td>
                                <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                                  <span class="font-mono text-xs text-blue-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'occupied_beds') }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                                  <span class="font-mono text-xs text-blue-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'occupied_beds') }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                        </tbody>
                        <!-- Total Row -->
                        <tfoot class="bg-blue-100 border-t-2 border-blue-300">
                          <tr class="font-bold text-blue-900">
                            <td class="px-4 py-3 border-r border-blue-200">Total</td>
                            <template v-for="year in visibleYears" :key="'occupied-total-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'occupied-total-cell-' + year + '-' + label"
                                  class="px-2 py-2 text-right border border-blue-200 font-bold"
                                >
                                  {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'occupied_beds') }}
                                </td>
                                <td class="px-2 py-2 text-right border border-blue-200 font-bold text-blue-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'occupied_beds') }}
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-blue-200 font-bold text-blue-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'occupied_beds') }}
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
                <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
                    <h2 class="text-xl font-bold flex items-center gap-2"><DollarSign class="w-5 h-5 text-white" /> Rate</h2>
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
                                <th class="px-4 py-2 text-center border border-green-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                              <template v-else>
                                <th class="px-4 py-2 text-center border border-green-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <tr
                            v-for="roomType in ROOM_TYPES"
                            :key="'rate-' + roomType"
                            class="even:bg-green-50 hover:bg-green-100 transition"
                          >
                            <td class="px-4 py-3 font-medium border-r border-green-200">{{ roomType }}</td>
                            <template v-for="year in visibleYears" :key="'rate-row-' + year + '-' + roomType">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'rate-cell-' + year + '-' + label + '-' + roomType"
                                  contenteditable="true"
                                  class="px-2 py-2 text-right border border-green-200 hover:bg-green-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                  @input="handleRoomCellInput({ year, label, roomType, field: 'rate', event: $event })"
                                  @focus="handleRoomCellFocus({ year, label, roomType, field: 'rate', event: $event })"
                                  @blur="handleRoomCellEditWrapper({ year, label, roomType, field: 'rate', event: $event })"
                                >
                                  <span class="font-mono text-xs">{{ getRate(roomData, roomType, year, label, advancedModes[year] || displayMode) }}</span>
                                </td>
                                <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                                  <span class="font-mono text-xs text-green-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'rate') }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                                  <span class="font-mono text-xs text-green-700">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'rate') }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                        </tbody>
                        <!-- Total Row -->
                        <tfoot class="bg-green-100 border-t-2 border-green-300">
                          <tr class="font-bold text-green-900">
                            <td class="px-4 py-3 border-r border-green-200">Total</td>
                            <template v-for="year in visibleYears" :key="'rate-total-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'rate-total-cell-' + year + '-' + label"
                                  class="px-2 py-2 text-right border border-green-200 font-bold"
                                >
                                  {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'rate') }}
                                </td>
                                <td class="px-2 py-2 text-right border border-green-200 font-bold text-green-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'rate') }}
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-green-200 font-bold text-green-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'rate') }}
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
                <div class="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4">
                    <h2 class="text-xl font-bold flex items-center gap-2"><Calculator class="w-5 h-5" /> Revenue</h2>
                    <p class="text-orange-100 text-sm">Calculated revenue (Available Beds × Occupied Beds % × Rate)</p>
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
                                <th class="px-4 py-2 text-center border border-orange-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                              <template v-else>
                                <th class="px-4 py-2 text-center border border-orange-300 min-w-[120px] font-semibold">Total</th>
                              </template>
                            </template>
                          </tr>
                        </thead>
                        <tbody class="text-gray-700 bg-white text-sm">
                          <tr
                            v-for="roomType in ROOM_TYPES"
                            :key="'revenue-' + roomType"
                            class="even:bg-orange-50 hover:bg-orange-100 transition"
                          >
                            <td class="px-4 py-3 font-medium border-r border-orange-200">{{ roomType }}</td>
                            <template v-for="year in visibleYears" :key="'revenue-row-' + year + '-' + roomType">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'revenue-cell-' + year + '-' + label + '-' + roomType"
                                  class="px-2 py-2 text-right border border-orange-200 font-semibold hover:bg-orange-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                >
                                  <span class="font-mono text-xs">{{ calculateRevenue(roomData, roomType, year, label, advancedModes[year] || displayMode, roomPackages) }}</span>
                                </td>
                                <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 bg-orange-50">
                                  <span class="font-mono text-xs">
                                    {{ calculateRoomTypeTotal(roomData, roomType, year, advancedModes[year] || displayMode, 'revenue', roomPackages) }}
                                  </span>
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800 bg-orange-50">
                                  <span class="font-mono text-xs">
                                    {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', roomPackages) }}
                                  </span>
                                </td>
                              </template>
                            </template>
                          </tr>
                        </tbody>
                        <!-- Total Row -->
                        <tfoot class="bg-orange-100 border-t-2 border-orange-300">
                          <tr class="font-bold text-orange-900">
                            <td class="px-4 py-3 border-r border-orange-200">Total</td>
                            <template v-for="year in visibleYears" :key="'revenue-total-' + year">
                              <template v-if="!isYearCollapsed(year)">
                                <td
                                  v-for="label in getColumnLabelsForYearLocal(year)"
                                  :key="'revenue-total-cell-' + year + '-' + label"
                                  class="px-2 py-2 text-right border border-orange-200 font-bold"
                                >
                                  {{ calculateMonthlyTotal(roomData, year, label, advancedModes[year] || displayMode, 'revenue', roomPackages) }}
                                </td>
                                <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', roomPackages) }}
                                </td>
                              </template>
                              <template v-else>
                                <td class="px-2 py-2 text-right border border-orange-200 font-bold text-orange-800">
                                  {{ calculateGrandTotal(roomData, year, advancedModes[year] || displayMode, 'revenue', roomPackages) }}
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
            <template v-else>
              <div class="flex flex-col items-center justify-center min-h-[400px] bg-white border-2 border-dashed border-violet-300 rounded-xl shadow-sm">
                <div class="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4">
                  <CircleAlert class="w-8 h-8 text-violet-500" />
                </div>
                <h3 class="text-lg text-violet-700 font-semibold mb-2">
                  {{ fromYear && !toYear ? 'Select "To Year"' : !fromYear && toYear ? 'Select "From Year"' : 'No Years Selected' }}
                </h3>
                <p class="text-gray-500 text-center max-w-md leading-relaxed text-sm">
                  {{ fromYear && !toYear ? 'You have selected a From Year, now please select a To Year to display the room revenue tables.' : 
                     !fromYear && toYear ? 'You have selected a To Year, now please select a From Year to display the room revenue tables.' :
                       'Please select both "From Year" and "To Year" in the left panel to display the room revenue tables.' }}
                </p>
                <div class="mt-4 flex items-center gap-2 text-xs text-violet-600">
                  <ArrowLeft class="w-3 h-3" />
                  <span>Use the filters on the left to get started</span>
                </div>
              </div>
            </template>
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
            <div class="grid grid-cols-2 gap-6">
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
                          <option v-for="room_package in roomPackagesOptions" :key="room_package.value" :value="room_package.value">
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
  
    
    <!-- Unsaved Changes Warning Modal -->
    <transition name="fade">
      <div
        v-if="showUnsavedWarning"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <div class="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl border border-red-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Unsaved Changes</h2>
          </div>
          
          <p class="text-gray-600 mb-6">
            You have unsaved changes that may be discarded if you leave this page. Are you sure you want to continue?
          </p>
          
          <div class="flex justify-end gap-3">
            <button
              @click="cancelNavigation"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Stay on Page
            </button>
            <button
              @click="confirmNavigation"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
            >
              Leave Anyway
            </button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  
  
  
  
  
  <script setup>
  import { ref, onMounted, computed, watch, onUnmounted } from "vue";
  import Sidebar from "@/components/ui/Sidebar.vue";
  import { CircleAlert, AlertTriangle, BedDouble, Plus, PlusCircle, DollarSign, Calculator, Settings, Calendar, X, Check, Save, Loader2, RefreshCw, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-vue-next';
  import alertService from "@/components/ui/alertService.js";

  // Import room revenue utilities
  import {
    // Core room revenue utilities
    ROOM_TYPES,
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
    createRoomRevenueAssumption,
    
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

  import { cloneDeep } from 'lodash-es';

  // Reactive state
  const years = ref([]);
  const fromYear = ref("");
  const toYear = ref("");
  const displayMode = ref("monthly");
  const roomData = ref({});
  const showAdvanced = ref(false);
  const advancedModes = ref({});
  const tempAdvancedModes = ref({});
  const marketSegmentation = ref(false);

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

  // Computed properties
  const visibleYears = computed(() => {
    return getVisibleYears(fromYear.value, toYear.value);
  });

  // Computed property to get column labels for a specific year
  const getColumnLabelsForYearLocal = (year) => {
    return getColumnLabels(advancedModes.value[year] || displayMode.value);
  };

  // Watch for changes in visible years to initialize advanced modes
  watch(visibleYears, () => {
    visibleYears.value.forEach(year => {
      if (!advancedModes.value[year]) {
        advancedModes.value[year] = displayMode.value;
      }
    });
  });

  // Watch for hospitality experience changes
  watch(hospitalityExperience, (newValue) => {
    localStorage.setItem('hospitalityExperience', newValue);
  });

  // Watch for localStorage changes to sync with sidebar
  const checkHospitalityExperience = () => {
    const stored = localStorage.getItem('hospitalityExperience');
    const newValue = stored === null ? true : stored === 'true';
    if (hospitalityExperience.value !== newValue) {
      hospitalityExperience.value = newValue;
    }
  };

  // Check for changes periodically
  setInterval(checkHospitalityExperience, 1000);

  // When opening the modal, copy the current settings
  watch(showAdvanced, (val) => {
    if (val) {
      tempAdvancedModes.value = { ...advancedModes.value };
    }
  });

  function applyAdvancedSettings() {
    advancedModes.value = { ...tempAdvancedModes.value };
    showAdvanced.value = false;
  }

  function cancelAdvancedSettings() {
    showAdvanced.value = false;
  }

  // On mount, initialize years from localStorage if available
  onMounted(async () => {
    try {
      years.value = await loadYearOptions();
      roomData.value = await getRoomRevenueList();    
      originalRoomData.value = cloneDeep(roomData.value); 
      
      // ** Room Packages List ** //
      const response = await getRoomPackagesList();
      roomPackages.value = response.data.data.room_packages || [];
      roomPackagesOptions.value = roomPackages.value.map(room_package => ({
        label: room_package.name,
        value: room_package.name
      }));
      
      // Restore years from localStorage
      fromYear.value = localStorage.getItem('roomRevenueFromYear') || "";
      toYear.value = localStorage.getItem('roomRevenueToYear') || "";
      isSaved.value = true;
    } catch (err) {
      console.error("Error loading data:", err);
    }
  });

  // Watchers to persist year selection
  watch(fromYear, (newValue) => {
    localStorage.setItem('roomRevenueFromYear', newValue);
  });
  watch(toYear, (newValue) => {
    localStorage.setItem('roomRevenueToYear', newValue);
  });

  function clearYearSelection() {
    fromYear.value = "";
    toYear.value = "";
    localStorage.removeItem('roomRevenueFromYear');
    localStorage.removeItem('roomRevenueToYear');
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
          // Show success message
          alertService.success("Room revenue assumption created successfully!");
        }
      } catch (error) {
        console.error('Error creating room revenue assumption:', error);
        // Show error message to user
        alertService.error("Failed to create Room Revenue Assumption. Please try again.");
      }
    }
  };

  // Wrapper function for saveChanges
  const saveChangesWrapper = async () => {
    await saveRoomChanges(changedCells, isSaving, saveError, roomData, originalRoomData, isSaved);
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

  function refreshRoomRevenueData() {
    // Implement the logic to refresh room revenue data
    // Example: reload data, then show alert
    // (Replace with actual data reload logic as needed)
    // await getRoomRevenueList() ...
    alertService.success('Page refreshed');
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
  