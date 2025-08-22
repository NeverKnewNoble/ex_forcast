<template>
  <div>
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
          <Table class="w-3 h-3 text-white" />
        </div>
        <h2 class="text-lg font-bold text-gray-800">Market Segmentation Overview</h2>
      </div>
      
      <!-- Management Buttons -->
      <div class="flex items-center gap-2">
        <button 
          @click="showAddCategoryModal = true"
          class="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-medium"
        >
          <Plus class="w-4 h-4" />
          Add Category
        </button>
        <button 
          @click="showAddSegmentModal = true"
          class="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
        >
          <Plus class="w-4 h-4" />
          Add Segment
        </button>
        <button 
          @click="handleResetToDefaults"
          class="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
        >
          <Edit3 class="w-4 h-4" />
          Reset to Defaults
        </button>
        <button 
          @click="refreshCache"
          class="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh Cache
        </button>
      </div>
    </div>
    <div class="space-y-8">
      <!-- Table 1: Room Nights -->
      <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
        <div class="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-4">
          <h2 class="text-xl font-bold flex items-center gap-2"><BedDouble class="w-5 h-5" /> Room Nights</h2>
          <p class="text-violet-100 text-sm">Number of room nights by market segment</p>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-violet-50 to-violet-100 text-violet-800 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold border-r border-violet-200">Segment</th>
                  <template v-for="year in visibleYears" :key="'roomnights-header-' + year">
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
                  <template v-for="year in visibleYears" :key="'roomnights-months-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <th
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="year + '-roomnights-' + label"
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
                <template v-for="category in marketSegmentCategories" :key="'cat-roomnights-' + category">
                  <tr>
                    <td
                      :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1), 0)"
                      class="bg-violet-50 font-bold text-violet-700 px-4 py-2 border-t border-violet-200"
                    >
                      <div class="flex items-center justify-between">
                        <span>{{ category }}</span>
                        <button 
                          @click="openRemoveCategoryModal(category)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Category"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="segment in marketSegments.filter(seg => seg.segment_category === category)"
                    :key="'seg-roomnights-' + segment.market_segment"
                    class="even:bg-violet-50 hover:bg-violet-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-violet-200">
                      <div class="flex items-center justify-between">
                        <span>{{ segment.market_segment }}</span>
                        <button 
                          @click="openRemoveSegmentModal(segment.market_segment)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Segment"
                        >
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <template v-for="year in visibleYears" :key="'roomnights-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'roomnights-cell-' + year + '-' + label + '-' + segment.market_segment"
                          class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                        >
                          <div
                            contenteditable="true"
                            class="font-mono text-xs min-h-[1.2em] focus:outline-none"
                            @input="handleRoomNightsCellInput({ year, label, segment, event: $event })"
                            @focus="handleRoomNightsCellFocus({ event: $event })"
                            @blur="handleRoomNightsCellEditWrapper({ year, label, segment, event: $event })"
                          >
                            {{ getMarketSegmentValue(marketSegmentData, segment, year, label, 'room_nights') }}
                          </div>
                        </td>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                          <span class="font-mono text-xs text-violet-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_nights', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                          <span class="font-mono text-xs text-violet-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_nights', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
                <!-- After all segment rows, add the Total Occupied Room row -->
                <tr class="bg-violet-200 font-bold text-violet-900">
                  <td class="px-4 py-3 border-r border-violet-200">Total Occupied Room</td>
                  <template v-for="year in visibleYears" :key="'total-roomnights-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'total-roomnights-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-violet-200"
                      >
                        <span class="font-mono text-xs">{{ getTotalOccupiedRoom(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getTotalOccupiedRoomYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getTotalOccupiedRoomYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
                <!-- Add the Total Available Rooms row -->
                <tr class="bg-violet-200 font-bold text-violet-900">
                  <td class="px-4 py-3 border-r border-violet-200">Total Available Rooms</td>
                  <template v-for="year in visibleYears" :key="'total-available-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'total-available-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-violet-200"
                      >
                        <span class="font-mono text-xs">{{ getTotalAvailableRooms(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getTotalAvailableRoomsYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getTotalAvailableRoomsYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
                <!-- Add the Occupancy (%) row -->
                <tr class="bg-violet-200 font-bold text-violet-900">
                  <td class="px-4 py-3 border-r border-violet-200">Occupancy (%)</td>
                  <template v-for="year in visibleYears" :key="'occupancy-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'occupancy-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-violet-200"
                      >
                        <span class="font-mono text-xs">{{ getOccupancyPercentage(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getOccupancyPercentageYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                        <span class="font-mono text-xs text-violet-700">
                          {{ getOccupancyPercentageYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Table 2: Room Rate -->
      <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
        <div class="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
          <h2 class="text-xl font-bold flex items-center gap-2"><DollarSign class="w-5 h-5" /> Room Rate <span class="text-xl font-bold">(USD)</span></h2>
          <p class="text-green-100 text-sm">Room rate by market segment</p>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-green-50 to-green-100 text-green-800 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold border-r border-green-200">Segment</th>
                  <template v-for="year in visibleYears" :key="'roomrate-header-' + year">
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
                  <template v-for="year in visibleYears" :key="'roomrate-months-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <th
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="year + '-roomrate-' + label"
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
                <template v-for="category in marketSegmentCategories" :key="'cat-rate-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-green-50 font-bold text-green-700 px-4 py-2 border-t border-green-200">
                      <div class="flex items-center justify-between">
                        <span>{{ category }}</span>
                        <button 
                          @click="openRemoveCategoryModal(category)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Category"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="segment in marketSegments.filter(seg => seg.segment_category === category)"
                    :key="'seg-rate-' + segment.market_segment"
                    class="even:bg-green-50 hover:bg-green-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-green-200">
                      <div class="flex items-center justify-between">
                        <span>{{ segment.market_segment }}</span>
                        <button 
                          @click="openRemoveSegmentModal(segment.market_segment)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Segment"
                        >
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <template v-for="year in visibleYears" :key="'roomrate-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'roomrate-cell-' + year + '-' + label + '-' + segment.market_segment"
                          class="px-2 py-2 text-right border border-green-200 hover:bg-green-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        >
                          <div
                            contenteditable="true"
                            class="font-mono text-xs min-h-[1.2em] focus:outline-none"
                            @input="handleRoomRateCellInput({ year, label, segment, event: $event })"
                            @focus="handleRoomRateCellFocus({ event: $event })"
                            @blur="handleRoomRateCellEditWrapper({ year, label, segment, event: $event })"
                          >
                            {{ getMarketSegmentValue(marketSegmentData, segment, year, label, 'room_rate') }}
                          </div>
                        </td>
                        <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                          <span class="font-mono text-xs text-green-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_rate', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                          <span class="font-mono text-xs text-green-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_rate', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Table 3: Average Daily Rate -->
      <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <h2 class="text-xl font-bold flex items-center gap-2"><Calculator class="w-5 h-5" />Average Daily Rate</h2>
          <p class="text-blue-100 text-sm">Average daily rate by market segment</p>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold border-r border-blue-200">Segment</th>
                  <template v-for="year in visibleYears" :key="'adr-header-' + year">
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
                  <template v-for="year in visibleYears" :key="'adr-months-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <th
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="year + '-adr-' + label"
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
                <template v-for="category in marketSegmentCategories" :key="'cat-adr-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-blue-50 font-bold text-blue-700 px-4 py-2 border-t border-blue-200">
                      <div class="flex items-center justify-between">
                        <span>{{ category }}</span>
                        <button 
                          @click="openRemoveCategoryModal(category)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Category"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="segment in marketSegments.filter(seg => seg.segment_category === category)"
                    :key="'seg-adr-' + segment.market_segment"
                    class="even:bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-blue-200">
                      <div class="flex items-center justify-between">
                        <span>{{ segment.market_segment }}</span>
                        <button 
                          @click="openRemoveSegmentModal(segment.market_segment)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Segment"
                        >
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <template v-for="year in visibleYears" :key="'adr-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'adr-cell-' + year + '-' + label + '-' + segment.market_segment"
                          class="px-2 py-2 text-right border border-blue-200 bg-blue-50"
                        >
                          <span class="font-mono text-xs">{{ getADRValue(segment, year, label) }}</span>
                        </td>
                        <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                          <span class="font-mono text-xs text-blue-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'average_daily_rate', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                          <span class="font-mono text-xs text-blue-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'average_daily_rate', getColumnLabelsForYearLocal) }}
                          </span>
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
                <!-- Add ADR row -->
                <tr class="bg-blue-200 font-bold text-blue-900">
                  <td class="px-4 py-3 border-r border-blue-200">ADR</td>
                  <template v-for="year in visibleYears" :key="'adr-total-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'adr-total-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-blue-200"
                      >
                        <span class="font-mono text-xs">{{ getADRTotal(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-700">
                          {{ getADRTotalYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-700">
                          {{ getADRTotalYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
                <!-- Add REVPAR row -->
                <tr class="bg-blue-200 font-bold text-blue-900">
                  <td class="px-4 py-3 border-r border-blue-200">REVPAR</td>
                  <template v-for="year in visibleYears" :key="'revpar-total-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'revpar-total-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-blue-200"
                      >
                        <span class="font-mono text-xs">{{ getREVPARTotal(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-700">
                          {{ getREVPARTotalYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                        <span class="font-mono text-xs text-blue-700">
                          {{ getREVPARTotalYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Table 4: Room Revenue -->
      <div class="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden md:max-w-[1800px] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2000px]">
        <div class="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4">
          <h2 class="text-xl font-bold flex items-center gap-2"><Calculator class="w-5 h-5" /> Room Revenue</h2>
          <p class="text-orange-100 text-sm">Room revenue by market segment</p>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-full w-max">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold border-r border-orange-200">Segment</th>
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
                <template v-for="category in marketSegmentCategories" :key="'cat-revenue-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-orange-50 font-bold text-orange-700 px-4 py-2 border-t border-orange-200">
                      <div class="flex items-center justify-between">
                        <span>{{ category }}</span>
                        <button 
                          @click="openRemoveCategoryModal(category)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Category"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="segment in marketSegments.filter(seg => seg.segment_category === category)"
                    :key="'seg-revenue-' + segment.market_segment"
                    class="even:bg-orange-50 hover:bg-orange-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-orange-200">
                      <div class="flex items-center justify-between">
                        <span>{{ segment.market_segment }}</span>
                        <button 
                          @click="openRemoveSegmentModal(segment.market_segment)"
                          class="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove Segment"
                        >
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <template v-for="year in visibleYears" :key="'revenue-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'revenue-cell-' + year + '-' + label + '-' + segment.market_segment"
                          class="px-2 py-2 text-right border border-orange-200 bg-orange-50"
                        >
                          <span class="font-mono text-xs">{{ getCalculatedRoomRevenue(segment, year, label) }}</span>
                        </td>
                        <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                          <span class="font-mono text-xs text-orange-700">
                            {{ getCalculatedRoomRevenueTotal(segment, year) }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                          <span class="font-mono text-xs text-orange-700">
                            {{ getCalculatedRoomRevenueTotal(segment, year) }}
                          </span>
                        </td>
                      </template>
                    </template>
                  </tr>
                </template>
                <!-- Add Total Room Revenue row -->
                <tr class="bg-orange-200 font-bold text-orange-900">
                  <td class="px-4 py-3 border-r border-orange-200">Total Room Revenue</td>
                  <template v-for="year in visibleYears" :key="'total-roomrevenue-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'total-roomrevenue-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-orange-200"
                      >
                        <span class="font-mono text-xs">{{ getTotalRoomRevenue(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getTotalRoomRevenueYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getTotalRoomRevenueYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
                <!-- Add Service Charge row -->
                <tr class="bg-orange-200 font-bold text-orange-900">
                  <td class="px-4 py-3 border-r border-orange-200">Service Charge</td>
                  <template v-for="year in visibleYears" :key="'service-charge-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'service-charge-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-orange-200"
                      >
                        <span class="font-mono text-xs">{{ getServiceChargeValue(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getServiceChargeTotal(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getServiceChargeTotal(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
                <!-- Add Total Revenue row (Room Revenue + Service Charge) -->
                <tr class="bg-orange-300 font-bold text-orange-900">
                  <td class="px-4 py-3 border-r border-orange-200">Total Rooms Revenue Including SC</td>
                  <template v-for="year in visibleYears" :key="'total-revenue-' + year">
                    <template v-if="!isYearCollapsed(year)">
                      <td
                        v-for="label in getColumnLabelsForYearLocal(year)"
                        :key="'total-revenue-cell-' + year + '-' + label"
                        class="px-2 py-2 text-right border border-orange-200"
                      >
                        <span class="font-mono text-xs">{{ getTotalRevenue(year, label) }}</span>
                      </td>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getTotalRevenueYear(year) }}
                        </span>
                      </td>
                    </template>
                    <template v-else>
                      <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                        <span class="font-mono text-xs text-orange-700">
                          {{ getTotalRevenueYear(year) }}
                        </span>
                      </td>
                    </template>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Category Modal -->
  <transition name="fade">
    <div
      v-if="showAddCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-violet-100 w-[95%] max-w-md p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-violet-600 to-violet-700">
          <div class="flex items-center gap-3">
            <Plus class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Add Market Segment Category</h2>
          </div>
          <button 
            @click="showAddCategoryModal = false"
            class="text-violet-100 hover:text-white transition-colors p-2 rounded-full hover:bg-violet-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="Enter category name"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all bg-white"
              @keyup.enter="handleAddCategory"
            />
            <p v-if="categoryError" class="mt-2 text-sm text-red-600">{{ categoryError }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-violet-100">
          <button
            @click="showAddCategoryModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            @click="handleAddCategory"
            class="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all font-medium"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Add Segment Modal -->
  <transition name="fade">
    <div
      v-if="showAddSegmentModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-green-100 w-[95%] max-w-md p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 to-green-700">
          <div class="flex items-center gap-3">
            <Plus class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Add Market Segment</h2>
          </div>
          <button 
            @click="showAddSegmentModal = false"
            class="text-green-100 hover:text-white transition-colors p-2 rounded-full hover:bg-green-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Segment Name</label>
            <input
              v-model="newSegmentName"
              type="text"
              placeholder="Enter segment name"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white"
              @keyup.enter="handleAddSegment"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              v-model="selectedCategoryForSegment"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white"
            >
              <option value="">Select a category</option>
              <option v-for="category in marketSegmentCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
            <p v-if="segmentError" class="mt-2 text-sm text-red-600">{{ segmentError }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-green-100">
          <button
            @click="showAddSegmentModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            @click="handleAddSegment"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
          >
            Add Segment
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Remove Category Modal -->
  <transition name="fade">
    <div
      v-if="showRemoveCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-red-100 w-[95%] max-w-md p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
          <div class="flex items-center gap-3">
            <Trash2 class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Remove Category</h2>
          </div>
          <button 
            @click="showRemoveCategoryModal = false"
            class="text-red-100 hover:text-white transition-colors p-2 rounded-full hover:bg-red-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="mb-4">
            <p class="text-gray-700">
              Are you sure you want to remove the category <strong>"{{ categoryToRemove }}"</strong>?
            </p>
            <p class="text-sm text-red-600 mt-2">
              This will also remove all segments belonging to this category.
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-red-100">
          <button
            @click="showRemoveCategoryModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            @click="handleRemoveCategory"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Remove Category
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Remove Segment Modal -->
  <transition name="fade">
    <div
      v-if="showRemoveSegmentModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-red-100 w-[95%] max-w-md p-0 overflow-hidden">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-red-700">
          <div class="flex items-center gap-3">
            <X class="w-6 h-6 text-white" />
            <h2 class="text-xl font-bold text-white">Remove Segment</h2>
          </div>
          <button 
            @click="showRemoveSegmentModal = false"
            class="text-red-100 hover:text-white transition-colors p-2 rounded-full hover:bg-red-600"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="mb-4">
            <p class="text-gray-700">
              Are you sure you want to remove the segment <strong>"{{ segmentToRemove }}"</strong>?
            </p>
            <p class="text-sm text-red-600 mt-2">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-red-100">
          <button
            @click="showRemoveSegmentModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
          >
            Cancel
          </button>
          <button 
            @click="handleRemoveSegment"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Remove Segment
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { BedDouble, Table, DollarSign, Calculator, ChevronDown, ChevronRight, Plus, X, Trash2, Edit3, RefreshCw } from 'lucide-vue-next';
import { AverageDailyRateCalculation } from '@/components/utility/room_revenue_assumpt./market_segments.js';
import { getDaysInMonth, calculateTotalRoomCount } from '@/components/utility/room_revenue_assumpt./room_revenue_utils.js';
import { 
  marketSegmentCategories, 
  marketSegments, 
  addMarketSegmentCategory, 
  removeMarketSegmentCategory, 
  addMarketSegment, 
  removeMarketSegment,
  loadFromLocalStorage,
  resetToDefaults,
  initializeData
} from '@/components/utility/room_revenue_assumpt./market_segment_manager.js';
import { 
  handleMarketSegmentCellInput,
  handleMarketSegmentCellFocus,
  handleMarketSegmentCellEdit,
  getMarketSegmentValue,
  calculateMarketSegmentTotal
} from '@/components/utility/room_revenue_assumpt./market_segment_table_utils.js';
import { getMarketSegmentList } from '@/components/utility/room_revenue_assumpt./data_service.js';
import alertService from '@/components/ui/ui_utility/alertService.js';
import { useCalculationCache } from '@/components/utility/_master_utility/useCalculationCache.js';
import { selectedProject } from '@/components/utility/dashboard/projectService.js';

const props = defineProps({
  visibleYears: Array,
  fromYear: [String, Number],
  toYear: [String, Number],
  displayMode: String,
  advancedModes: Object,
  getColumnLabelsForYearLocal: Function,
  toggleCollapse: Function,
  isYearCollapsed: Function,
  marketSegmentData: Object,
  roomPackages: {
    type: Array,
    default: () => []
  },
  roomData: {
    type: Object,
    default: () => ({})
  },
  totalNumberOfRooms: {
    type: Number,
    default: 0
  },
  vatByYear: {
    type: Object,
    default: () => ({})
  },
  breakfastByYear: {
    type: Object,
    default: () => ({})
  },
  exchangeRateByYear: {
    type: Object,
    default: () => ({})
  },
  serviceChargeByYear: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['market-segment-changed', 'data-loaded']);

// Load market segments from API or localStorage on component mount
initializeData();

// Reactive state for add/remove modals
const showAddCategoryModal = ref(false);
const showAddSegmentModal = ref(false);
const showRemoveCategoryModal = ref(false);
const showRemoveSegmentModal = ref(false);

// Form data for adding categories and segments
const newCategoryName = ref('');
const newSegmentName = ref('');
const selectedCategoryForSegment = ref('');
const categoryToRemove = ref('');
const segmentToRemove = ref('');

// Error messages
const categoryError = ref('');
const segmentError = ref('');

// Track changes for market segment data
const marketSegmentChanges = ref([]);

// Load market segment data on mount
onMounted(async () => {
  try {
    const data = await getMarketSegmentList();
    if (data && Object.keys(data).length > 0) {
      // Update the parent's marketSegmentData
      Object.assign(props.marketSegmentData, data);
      emit('data-loaded', data);
    }
  } catch (error) {
    console.error('Error loading market segment data:', error);
  }
});

// Watch for changes in market segment data and emit events
watch(() => props.marketSegmentData, (newData) => {
  if (newData && Object.keys(newData).length > 0) {
    emit('market-segment-changed', newData);
    
    // Clear the Total Occupied Room cache when market segment data changes
    const project = getProjectName();
    if (calculationCache.cache[project]?.[PAGE_KEY]) {
      calculationCache.cache[project][PAGE_KEY]['Total Occupied Room'] = {};
      calculationCache.cache[project][PAGE_KEY]['Total Occupied Room Year'] = {};
    }
    

  }
}, { deep: true });

// Watch for changes in totalNumberOfRooms and clear cache
watch(() => props.totalNumberOfRooms, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    console.log('TotalNumberOfRooms changed from', oldValue, 'to', newValue, '- clearing cache');
    // Clear the Total Available Rooms cache when totalRooms changes
    const project = getProjectName();
    if (calculationCache.cache[project]?.[PAGE_KEY]) {
      // Clear the specific cache keys for total available rooms
      calculationCache.cache[project][PAGE_KEY]['Total Available Rooms'] = {};
      calculationCache.cache[project][PAGE_KEY]['Total Available Rooms Year'] = {};
    }
    
    // Force a re-render by triggering a reactive update
    nextTick(() => {
      // This will force the component to recalculate the total available rooms
      marketSegmentChanges.value = [...marketSegmentChanges.value];
    });
  }
});

// --- Category and Segment Management Functions ---
async function handleAddCategory() {
  categoryError.value = '';
  
  if (!newCategoryName.value.trim()) {
    categoryError.value = 'Category name is required';
    return;
  }
  
  try {
    // Convert category name to uppercase before sending
    const categoryName = newCategoryName.value.trim().toUpperCase();
    await addMarketSegmentCategory(categoryName);
    newCategoryName.value = '';
    showAddCategoryModal.value = false;
    // Show success message
    alertService.success('Category added successfully!');
  } catch (error) {
    categoryError.value = error.message;
    alertService.error(error.message);
  }
}

async function handleAddSegment() {
  segmentError.value = '';
  
  if (!newSegmentName.value.trim()) {
    segmentError.value = 'Segment name is required';
    return;
  }
  
  if (!selectedCategoryForSegment.value) {
    segmentError.value = 'Please select a category';
    return;
  }
  
  try {
    await addMarketSegment(newSegmentName.value, selectedCategoryForSegment.value);
    newSegmentName.value = '';
    selectedCategoryForSegment.value = '';
    showAddSegmentModal.value = false;
    // Show success message
    alertService.success('Segment added successfully!');
  } catch (error) {
    segmentError.value = error.message;
    alertService.error(error.message);
  }
}

async function handleRemoveCategory() {
  if (!categoryToRemove.value) return;
  
  try {
    await removeMarketSegmentCategory(categoryToRemove.value);
    categoryToRemove.value = '';
    showRemoveCategoryModal.value = false;
    // Show success message
    alertService.success('Category removed successfully!');
  } catch (error) {
    console.error('Error removing category:', error);
    // Show error message to user
    alertService.error('Error removing category: ' + error.message);
  }
}

async function handleRemoveSegment() {
  if (!segmentToRemove.value) return;
  
  try {
    await removeMarketSegment(segmentToRemove.value);
    segmentToRemove.value = '';
    showRemoveSegmentModal.value = false;
    // Show success message
    alertService.success('Segment removed successfully!');
  } catch (error) {
    console.error('Error removing segment:', error);
    // Show error message to user
    alertService.error('Error removing segment: ' + error.message);
  }
}

function openRemoveCategoryModal(category) {
  categoryToRemove.value = category;
  showRemoveCategoryModal.value = true;
}

function openRemoveSegmentModal(segment) {
  segmentToRemove.value = segment;
  showRemoveSegmentModal.value = true;
}

// --- Local Handlers for Each Table ---
function updateMarketSegmentData({ year, label, segment, field, value }) {
  if (!props.marketSegmentData[year]) props.marketSegmentData[year] = {};
  if (!props.marketSegmentData[year][segment.market_segment]) props.marketSegmentData[year][segment.market_segment] = {};
  if (!props.marketSegmentData[year][segment.market_segment][label]) props.marketSegmentData[year][segment.market_segment][label] = {};
  props.marketSegmentData[year][segment.market_segment][label][field] = value;
  
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
  
  // Emit change event to parent
  emit('market-segment-changed', props.marketSegmentData);
}

// --- Total Revenue Functions (Room Revenue + Service Charge) ---
function getTotalRevenue(year, label) {
  const project = getProjectName();
  const cacheKey = 'Total Rooms Revenue Including SC';
  const cached = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, label);
  if (cached && cached > 0) {
    return cached.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const roomRevenue = parseFloat(getTotalRoomRevenue(year, label).replace(/,/g, ''));
  const serviceCharge = parseFloat(getServiceChargeValue(year, label).replace(/,/g, ''));
  const totalRevenue = roomRevenue + serviceCharge;
  if (totalRevenue > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, label, totalRevenue);
  }
  return totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalRevenueYear(year) {
  const project = getProjectName();
  const cacheKey = 'Total Rooms Revenue Including SC Year';
  const cached = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, 'ALL');
  if (cached && cached > 0) {
    return cached.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const roomRevenue = parseFloat(getTotalRoomRevenueYear(year).replace(/,/g, ''));
  const serviceCharge = parseFloat(getServiceChargeTotal(year).replace(/,/g, ''));
  const totalRevenue = roomRevenue + serviceCharge;
  if (totalRevenue > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, 'ALL', totalRevenue);
  }
  return totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Room Nights Handlers
function handleRoomNightsCellInput({ year, label, segment, event }) {
  const value = event.target.textContent.replace(/[^\d.]/g, '');
  // Store cursor position
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const cursorPosition = range.startOffset;
  
  updateMarketSegmentData({ year, label, segment, field: 'room_nights', value });
  
  // Restore cursor position after Vue updates the DOM
  nextTick(() => {
    if (event.target && event.target.textContent) {
      const newRange = document.createRange();
      const textNode = event.target.firstChild || event.target;
      const newPosition = Math.min(cursorPosition, textNode.textContent.length);
      newRange.setStart(textNode, newPosition);
      newRange.setEnd(textNode, newPosition);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  });
}

function handleRoomNightsCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}

function handleRoomNightsCellEditWrapper({ year, label, segment, event }) {
  const value = event.target.textContent.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'room_nights', value });
}

// Room Rate Handlers
function handleRoomRateCellInput({ year, label, segment, event }) {
  const value = event.target.textContent.replace(/[^\d.]/g, '');
  // Store cursor position
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const cursorPosition = range.startOffset;
  
  updateMarketSegmentData({ year, label, segment, field: 'room_rate', value });
  
  // Restore cursor position after Vue updates the DOM
  nextTick(() => {
    if (event.target && event.target.textContent) {
      const newRange = document.createRange();
      const textNode = event.target.firstChild || event.target;
      const newPosition = Math.min(cursorPosition, textNode.textContent.length);
      newRange.setStart(textNode, newPosition);
      newRange.setEnd(textNode, newPosition);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  });
}

function handleRoomRateCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}

function handleRoomRateCellEditWrapper({ year, label, segment, event }) {
  const value = event.target.textContent.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'room_rate', value });
}


// ************ CALCULATIONS *****************
// Pinia calculation cache
const calculationCache = useCalculationCache();

// Helper: get project name for cache
function getProjectName() {
  return selectedProject.value?.project_name || 'default';
}


const PAGE_KEY = 'Market Segmentation';

// --- Total Occupied Room helpers ---
function getTotalOccupiedRoom(year, label) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Total Occupied Room', year, label);
  if (cacheVal && cacheVal > 0) {
    // Cache stores numeric values, so format them
    return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  let total = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === "OTHER ROOMS REVENUE") continue;
    const value = Number(
      props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0
    );
    total += value;
  }
  

  
  const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  // Store the numeric value in cache, not the formatted string
  calculationCache.setValue(project, PAGE_KEY, 'Total Occupied Room', year, label, total);
  return formattedTotal;    
}

function getTotalOccupiedRoomYear(year) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Total Occupied Room Year', year, 'ALL');
  if (cacheVal && cacheVal > 0) {
    // Cache stores numeric values, so format them
    return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  let total = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === "OTHER ROOMS REVENUE") continue;
    const segmentData = props.marketSegmentData?.[year]?.[segment.market_segment] || {};
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      total += Number(segmentData?.[label]?.room_nights || 0);
    }
  }
  

  
  const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  // Store the numeric value in cache, not the formatted string
  calculationCache.setValue(project, PAGE_KEY, 'Total Occupied Room Year', year, 'ALL', total);
  return formattedTotal;
}

// --- Total Available Rooms helpers ---
function getTotalAvailableRooms(year, label) {
  const project = getProjectName();
  
  // First try to get total rooms from cache (Room Revenue page)
  let totalRooms = calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Rooms', year, label);
  
  // If not found in cache, fall back to prop
  if (!totalRooms || totalRooms === 0) {
    totalRooms = props.totalNumberOfRooms || 0;
  }
  
  // Debug logging - uncomment to troubleshoot
  console.log('Total Available Rooms Debug:', {
    year,
    label,
    totalRooms,
    project,
    fromCache: calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Rooms', year, label),
    fromProp: props.totalNumberOfRooms,
    cacheKeys: Object.keys(calculationCache.cache[project]?.[PAGE_KEY] || {})
  });
  
  // If totalRooms is still 0, return 0
  if (totalRooms === 0) {
    return 0;
  }
  
  // Use a simple cache key that doesn't include totalRooms value
  const cacheKey = 'Total Available Rooms';
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, label);
  if (cacheVal && cacheVal > 0) {
    // console.log('Using cached value:', cacheVal);
    return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  
  const days = getDaysInMonth(year, label);
  const val = days * totalRooms;
  
  // Only cache if value is greater than 0
  if (val > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, label, val);
  }
  
  return val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getTotalAvailableRoomsYear(year) {
  const project = getProjectName();
  
  // First try to get total rooms from cache (Room Revenue page) - use first month of year as reference
  const firstLabel = props.getColumnLabelsForYearLocal(year)[0];
  let totalRooms = calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Rooms', year, firstLabel);
  
  // If not found in cache, fall back to prop
  if (!totalRooms || totalRooms === 0) {
    totalRooms = props.totalNumberOfRooms || 0;
  }
  
  // If totalRooms is still 0, return 0
  if (totalRooms === 0) {
    return 0;
  }
  
  // Use a simple cache key that doesn't include totalRooms value
  const cacheKey = 'Total Available Rooms Year';
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, 'ALL');
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  
  let total = 0;
  for (const label of props.getColumnLabelsForYearLocal(year)) {
    const days = getDaysInMonth(year, label);
    total += days * totalRooms;
  }
  
  // Only cache if value is greater than 0
  if (total > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, 'ALL', total);
  }
  
  return total.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// --- Occupancy Percentage helpers ---
function getOccupancyPercentage(year, label) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Occupancy (%)', year, label);
  if (cacheVal && cacheVal > 0) return cacheVal.toFixed(2) + '%';
  const occupied = getTotalOccupiedRoom(year, label);
  const available = getTotalAvailableRooms(year, label);
  let percent = 0;
  if (available > 0) percent = (occupied / available) * 100;
  calculationCache.setValue(project, PAGE_KEY, 'Occupancy (%)', year, label, percent);
  return percent.toFixed(2) + '%';
}

function getOccupancyPercentageYear(year) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Occupancy (%) Year', year, 'ALL');
  if (cacheVal && cacheVal > 0) return cacheVal.toFixed(2) + '%';
  const occupied = getTotalOccupiedRoomYear(year);
  const available = getTotalAvailableRoomsYear(year);
  let percent = 0;
  if (available > 0) percent = (occupied / available) * 100;
  calculationCache.setValue(project, PAGE_KEY, 'Occupancy (%) Year', year, 'ALL', percent);
  return percent.toFixed(2) + '%';
}

// --- ADR Calculation Helper ---
function getADRValue(segment, year, label) {
  const project = getProjectName();
  const cacheKey = `ADR:${segment.market_segment}`;
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, label);
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const room_rate = parseFloat(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_rate || 0);
  const VAT = parseFloat(props.vatByYear?.[year] || 1);
  const Breakfast_Rate = parseFloat(props.breakfastByYear?.[year] || 0);
  const exchange_rate = parseFloat(props.exchangeRateByYear?.[year] || 1);
  const adr = AverageDailyRateCalculation(room_rate, VAT, Breakfast_Rate, exchange_rate);
  calculationCache.setValue(project, PAGE_KEY, cacheKey, year, label, adr);
  return adr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Room Revenue Calculation Helpers ---
function getCalculatedRoomRevenue(segment, year, label) {
  // Cache lookup for per-segment monthly Room Revenue
  const project = getProjectName();
  const cacheKey = `Room Revenue:${segment.market_segment}`;
  const cached = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, label);
  if (cached && cached > 0) {
    return cached.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  // Get ADR for this segment and month
  const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
  // Get room nights for this segment and month
  const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
  // Calculate Room Revenue = ADR * Room Nights
  const roomRevenue = adr * roomNights;
  // Cache only if > 0
  if (roomRevenue > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, label, roomRevenue);
  }
  return roomRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getCalculatedRoomRevenueTotal(segment, year) {
  // Cache lookup for per-segment yearly Room Revenue
  const project = getProjectName();
  const cacheKey = `Room Revenue Year:${segment.market_segment}`;
  const cached = calculationCache.getValue(project, PAGE_KEY, cacheKey, year, 'ALL');
  if (cached && cached > 0) {
    return cached.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  let total = 0;
  for (const label of props.getColumnLabelsForYearLocal(year)) {
    const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
    const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
    total += adr * roomNights;
  }
  if (total > 0) {
    calculationCache.setValue(project, PAGE_KEY, cacheKey, year, 'ALL', total);
  }
  return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Add helper methods in <script setup>:
function getTotalRoomRevenue(year, label) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Total Room Revenue', year, label);
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let total = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
    const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
    total += adr * roomNights;
  }
  calculationCache.setValue(project, PAGE_KEY, 'Total Room Revenue', year, label, total);
  return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalRoomRevenueYear(year) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Total Room Revenue Year', year, 'ALL');
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  let total = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
      const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
      total += adr * roomNights;
    }
  }
  calculationCache.setValue(project, PAGE_KEY, 'Total Room Revenue Year', year, 'ALL', total);
  return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Service Charge Functions ---
function getServiceChargeValue(year, label) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Service Charge', year, label);
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const yearlyServiceCharge = Number(props.serviceChargeByYear?.[year] || 0);
  if (yearlyServiceCharge === 0) return '0.00';
  calculationCache.setValue(project, PAGE_KEY, 'Service Charge', year, label, yearlyServiceCharge);
  return yearlyServiceCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getServiceChargeTotal(year) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'Service Charge Year', year, 'ALL');
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const yearlyServiceCharge = Number(props.serviceChargeByYear?.[year] || 0);
  calculationCache.setValue(project, PAGE_KEY, 'Service Charge Year', year, 'ALL', yearlyServiceCharge);
  return yearlyServiceCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getADRTotal(year, label) {
  // Total Room Revenue (excluding OTHER ROOMS REVENUE)
  let totalRevenue = 0;
  let totalOccupied = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
    const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
    totalRevenue += adr * roomNights;
    totalOccupied += roomNights;
  }
  if (!totalOccupied) return '0.00';
  return (totalRevenue / totalOccupied).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getADRTotalYear(year) {
  let totalRevenue = 0;
  let totalOccupied = 0;
  for (const segment of marketSegments.value) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      const adr = parseFloat(getADRValue(segment, year, label).replace(/,/g, ''));
      const roomNights = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
      totalRevenue += adr * roomNights;
      totalOccupied += roomNights;
    }
  }
  if (!totalOccupied) return '0.00';
  return (totalRevenue / totalOccupied).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- REVPAR Calculation Helpers ---
function getREVPARTotal(year, label) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'REVPAR', year, label);
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const adr = parseFloat(getADRTotal(year, label).replace(/,/g, ''));
  const occupancyStr = getOccupancyPercentage(year, label);
  const occupancy = parseFloat(occupancyStr.replace('%', '')) / 100;
  const revpar = adr * occupancy;
  calculationCache.setValue(project, PAGE_KEY, 'REVPAR', year, label, revpar);
  return revpar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getREVPARTotalYear(year) {
  const project = getProjectName();
  const cacheVal = calculationCache.getValue(project, PAGE_KEY, 'REVPAR Year', year, 'ALL');
  if (cacheVal && cacheVal > 0) return cacheVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const adr = parseFloat(getADRTotalYear(year).replace(/,/g, ''));
  const occupancyStr = getOccupancyPercentageYear(year);
  const occupancy = parseFloat(occupancyStr.replace('%', '')) / 100;
  const revpar = adr * occupancy;
  calculationCache.setValue(project, PAGE_KEY, 'REVPAR Year', year, 'ALL', revpar);
  return revpar.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function handleResetToDefaults() {
  try {
    await resetToDefaults();
  } catch (error) {
    console.error('Error in reset to defaults:', error);
  }
}

// Function to manually refresh the cache
function refreshCache() {
  const project = getProjectName();
  console.log('Refreshing cache for project:', project);
  console.log('Current cache state:', calculationCache.cache[project]?.[PAGE_KEY]);
  
  // Log the total rooms from cache vs prop
  const firstYear = props.visibleYears?.[0];
  const firstLabel = firstYear ? props.getColumnLabelsForYearLocal(firstYear)?.[0] : null;
  if (firstYear && firstLabel) {
    const cachedTotalRooms = calculationCache.getValue(project, 'Room Revenue Assumptions', 'Total Rooms', firstYear, firstLabel);
    console.log('Cache comparison:', {
      fromCache: cachedTotalRooms,
      fromProp: props.totalNumberOfRooms,
      project,
      year: firstYear,
      label: firstLabel
    });
  }
  
  // Clear the total available rooms cache
  if (calculationCache.cache[project]?.[PAGE_KEY]) {
    calculationCache.cache[project][PAGE_KEY]['Total Available Rooms'] = {};
    calculationCache.cache[project][PAGE_KEY]['Total Available Rooms Year'] = {};
  }
  
  // Force a re-render
  nextTick(() => {
    marketSegmentChanges.value = [...marketSegmentChanges.value];
  });
  
  console.log('Cache refreshed');
}

// Expose functions for parent component
defineExpose({
  marketSegmentChanges,
  getMarketSegmentValue: (data, segment, year, label, field) => getMarketSegmentValue(data, segment, year, label, field),
  calculateMarketSegmentTotal: (data, segment, year, field) => calculateMarketSegmentTotal(data, segment, year, field)
});
</script> 

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 