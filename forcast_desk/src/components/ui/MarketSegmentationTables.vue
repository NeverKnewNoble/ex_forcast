<template>
  <div>
    <div class="mb-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
          <BedDouble class="w-3 h-3 text-white" />
        </div>
        <h2 class="text-lg font-bold text-gray-800">Market Segmentation Overview</h2>
      </div>
    </div>
    <div class="space-y-8">
      <!-- Table 1: Room Nights -->
      <div class="bg-white rounded-lg border border-violet-200 shadow-sm overflow-hidden">
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
                <template v-for="category in MARKET_SEGMENT_CATEGORIES" :key="'cat-roomnights-' + category">
                  <tr>
                    <td
                      :colspan="1 + visibleYears.reduce((acc, year) => acc + (isYearCollapsed(year) ? 1 : getColumnLabelsForYearLocal(year).length + 1), 0)"
                      class="bg-violet-50 font-bold text-violet-700 px-4 py-2 border-t border-violet-200"
                    >
                      {{ category }}
                    </td>
                  </tr>
                  <tr
                    v-for="segment in MARKET_SEGMENTS.filter(seg => seg.segment_category === category)"
                    :key="'seg-roomnights-' + segment.market_segment"
                    class="even:bg-violet-50 hover:bg-violet-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-violet-200">{{ segment.market_segment }}</td>
                    <template v-for="year in visibleYears" :key="'roomnights-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'roomnights-cell-' + year + '-' + label + '-' + segment.market_segment"
                          contenteditable="true"
                          class="px-2 py-2 text-right border border-violet-200 hover:bg-violet-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                          @input="handleRoomNightsCellInput({ year, label, segment, event: $event })"
                          @focus="handleRoomNightsCellFocus({ event: $event })"
                          @blur="handleRoomNightsCellEditWrapper({ year, label, segment, event: $event })"
                        >
                          <span class="font-mono text-xs">{{ getMarketSegmentValue(marketSegmentData, segment, year, label, 'room_nights') }}</span>
                        </td>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                          <span class="font-mono text-xs text-violet-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_nights') }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-violet-200 font-semibold bg-violet-50">
                          <span class="font-mono text-xs text-violet-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_nights') }}
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
      <div class="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
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
                <template v-for="category in MARKET_SEGMENT_CATEGORIES" :key="'cat-rate-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-green-50 font-bold text-green-700 px-4 py-2 border-t border-green-200">
                      {{ category }}
                    </td>
                  </tr>
                  <tr
                    v-for="segment in MARKET_SEGMENTS.filter(seg => seg.segment_category === category)"
                    :key="'seg-rate-' + segment.market_segment"
                    class="even:bg-green-50 hover:bg-green-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-green-200">{{ segment.market_segment }}</td>
                    <template v-for="year in visibleYears" :key="'roomrate-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'roomrate-cell-' + year + '-' + label + '-' + segment.market_segment"
                          contenteditable="true"
                          class="px-2 py-2 text-right border border-green-200 hover:bg-green-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          @input="handleRoomRateCellInput({ year, label, segment, event: $event })"
                          @focus="handleRoomRateCellFocus({ event: $event })"
                          @blur="handleRoomRateCellEditWrapper({ year, label, segment, event: $event })"
                        >
                          <span class="font-mono text-xs">{{ getMarketSegmentValue(marketSegmentData, segment, year, label, 'room_rate') }}</span>
                        </td>
                        <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                          <span class="font-mono text-xs text-green-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_rate') }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-green-200 font-semibold bg-green-50">
                          <span class="font-mono text-xs text-green-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_rate') }}
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
      <div class="bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
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
                <template v-for="category in MARKET_SEGMENT_CATEGORIES" :key="'cat-adr-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-blue-50 font-bold text-blue-700 px-4 py-2 border-t border-blue-200">
                      {{ category }}
                    </td>
                  </tr>
                  <tr
                    v-for="segment in MARKET_SEGMENTS.filter(seg => seg.segment_category === category)"
                    :key="'seg-adr-' + segment.market_segment"
                    class="even:bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-blue-200">{{ segment.market_segment }}</td>
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
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'average_daily_rate') }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-blue-200 font-semibold bg-blue-50">
                          <span class="font-mono text-xs text-blue-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'average_daily_rate') }}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Table 4: Room Revenue -->
      <div class="bg-white rounded-lg border border-orange-200 shadow-sm overflow-hidden">
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
                <template v-for="category in MARKET_SEGMENT_CATEGORIES" :key="'cat-revenue-' + category">
                  <tr>
                    <td :colspan="1 + visibleYears.length * (isYearCollapsed(visibleYears[0]) ? 1 : getColumnLabelsForYearLocal(visibleYears[0]).length + 1)" class="bg-orange-50 font-bold text-orange-700 px-4 py-2 border-t border-orange-200">
                      {{ category }}
                    </td>
                  </tr>
                  <tr
                    v-for="segment in MARKET_SEGMENTS.filter(seg => seg.segment_category === category)"
                    :key="'seg-revenue-' + segment.market_segment"
                    class="even:bg-orange-50 hover:bg-orange-100 transition"
                  >
                    <td class="px-4 py-3 font-medium border-r border-orange-200">{{ segment.market_segment }}</td>
                    <template v-for="year in visibleYears" :key="'revenue-row-' + year + '-' + segment.market_segment">
                      <template v-if="!isYearCollapsed(year)">
                        <td
                          v-for="label in getColumnLabelsForYearLocal(year)"
                          :key="'revenue-cell-' + year + '-' + label + '-' + segment.market_segment"
                          contenteditable="true"
                          class="px-2 py-2 text-right border border-orange-200 hover:bg-orange-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          @input="handleRoomRevenueCellInput({ year, label, segment, event: $event })"
                          @focus="handleRoomRevenueCellFocus({ event: $event })"
                          @blur="handleRoomRevenueCellEditWrapper({ year, label, segment, event: $event })"
                        >
                          <span class="font-mono text-xs">{{ getMarketSegmentValue(marketSegmentData, segment, year, label, 'room_revenue') }}</span>
                        </td>
                        <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                          <span class="font-mono text-xs text-orange-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_revenue') }}
                          </span>
                        </td>
                      </template>
                      <template v-else>
                        <td class="px-2 py-2 text-right border border-orange-200 font-semibold bg-orange-50">
                          <span class="font-mono text-xs text-orange-700">
                            {{ calculateMarketSegmentTotal(marketSegmentData, segment, year, 'room_revenue') }}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BedDouble, DollarSign, Calculator, ChevronDown, ChevronRight } from 'lucide-vue-next';
import { MARKET_SEGMENT_CATEGORIES, MARKET_SEGMENTS, AverageDailyRateCalculation } from '@/components/utility/room_revenue_assumpt./market_segments.js';
import { getDaysInMonth, calculateTotalRoomCount } from '@/components/utility/room_revenue_assumpt./room_revenue_utils.js';

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
  getMarketSegmentValue: Function,
  calculateMarketSegmentTotal: Function,
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
  }
});

// console.log('visibleYears:', props.visibleYears);

// --- Local Handlers for Each Table ---
function updateMarketSegmentData({ year, label, segment, field, value }) {
  if (!props.marketSegmentData[year]) props.marketSegmentData[year] = {};
  if (!props.marketSegmentData[year][segment.market_segment]) props.marketSegmentData[year][segment.market_segment] = {};
  if (!props.marketSegmentData[year][segment.market_segment][label]) props.marketSegmentData[year][segment.market_segment][label] = {};
  props.marketSegmentData[year][segment.market_segment][label][field] = value;
}

// Room Nights Handlers
function handleRoomNightsCellInput({ year, label, segment, event }) {
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'room_nights', value });
}
function handleRoomNightsCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
}
}
function handleRoomNightsCellEditWrapper({ year, label, segment, event }) {
  // Optionally, add validation or emit changes here
}

// Room Rate Handlers
function handleRoomRateCellInput({ year, label, segment, event }) {
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'room_rate', value });
}
function handleRoomRateCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}
function handleRoomRateCellEditWrapper({ year, label, segment, event }) {
  // Optionally, add validation or emit changes here
}

// ADR Handlers
function handleADRCellInput({ year, label, segment, event }) {
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'average_daily_rate', value });
}
function handleADRCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}
function handleADRCellEditWrapper({ year, label, segment, event }) {
  // Optionally, add validation or emit changes here
}

// Room Revenue Handlers
function handleRoomRevenueCellInput({ year, label, segment, event }) {
  const value = event.target.innerText.replace(/[^\d.]/g, '');
  updateMarketSegmentData({ year, label, segment, field: 'room_revenue', value });
}
function handleRoomRevenueCellFocus({ event }) {
  if (event.target && typeof event.target.select === 'function') {
    event.target.select();
  }
}
function handleRoomRevenueCellEditWrapper({ year, label, segment, event }) {
  // Optionally, add validation or emit changes here
}

// --- Total Occupied Room helpers ---
function getTotalOccupiedRoom(year, label) {
  let total = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === "OTHER ROOMS REVENUE") continue;
    const value = Number(
      props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0
    );
    total += value;
  }
  return total;
}

function getTotalOccupiedRoomYear(year) {
  let total = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === "OTHER ROOMS REVENUE") continue;
    const segmentData = props.marketSegmentData?.[year]?.[segment.market_segment] || {};
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      total += Number(segmentData?.[label]?.room_nights || 0);
    }
  }
  return total;
}

// --- Total Available Rooms helpers ---
function getTotalAvailableRooms(year, label) {
  const days = getDaysInMonth(year, label);
  const totalRooms = props.totalNumberOfRooms || 0;
  return days * totalRooms;
}

function getTotalAvailableRoomsYear(year) {
  let total = 0;
  for (const label of props.getColumnLabelsForYearLocal(year)) {
    total += getTotalAvailableRooms(year, label);
  }
  return total;
}

// --- Occupancy Percentage helpers ---
function getOccupancyPercentage(year, label) {
  const occupied = getTotalOccupiedRoom(year, label);
  const available = getTotalAvailableRooms(year, label);
  if (!available || available === 0) return '0.00%';
  return ((occupied / available) * 100).toFixed(2) + '%';
}

function getOccupancyPercentageYear(year) {
  const occupied = getTotalOccupiedRoomYear(year);
  const available = getTotalAvailableRoomsYear(year);
  if (!available || available === 0) return '0.00%';
  return ((occupied / available) * 100).toFixed(2) + '%';
}

// --- ADR Calculation Helper ---
function getADRValue(segment, year, label) {
  // Get room_rate from marketSegmentData
  const room_rate = parseFloat(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_rate || 0);
  // Get VAT, Breakfast, Exchange Rate for the year
  const VAT = parseFloat(props.vatByYear?.[year] || 1); // Default to 1 if not set
  const Breakfast_Rate = parseFloat(props.breakfastByYear?.[year] || 0);
  const exchange_rate = parseFloat(props.exchangeRateByYear?.[year] || 1); // Default to 1 if not set
  // Calculate ADR
  const adr = AverageDailyRateCalculation(room_rate, VAT, Breakfast_Rate, exchange_rate);
  return adr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Add helper methods in <script setup>:
function getTotalRoomRevenue(year, label) {
  let total = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    const value = Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_revenue || 0);
    total += value;
  }
  return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalRoomRevenueYear(year) {
  let total = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    const segmentData = props.marketSegmentData?.[year]?.[segment.market_segment] || {};
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      total += Number(segmentData?.[label]?.room_revenue || 0);
    }
  }
  return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getADRTotal(year, label) {
  // Total Room Revenue (excluding OTHER ROOMS REVENUE)
  let totalRevenue = 0;
  let totalOccupied = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    totalRevenue += Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_revenue || 0);
    totalOccupied += Number(props.marketSegmentData?.[year]?.[segment.market_segment]?.[label]?.room_nights || 0);
  }
  if (!totalOccupied) return '0.00';
  return (totalRevenue / totalOccupied).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getADRTotalYear(year) {
  let totalRevenue = 0;
  let totalOccupied = 0;
  for (const segment of MARKET_SEGMENTS) {
    if (segment.segment_category === 'OTHER ROOMS REVENUE') continue;
    const segmentData = props.marketSegmentData?.[year]?.[segment.market_segment] || {};
    for (const label of props.getColumnLabelsForYearLocal(year)) {
      totalRevenue += Number(segmentData?.[label]?.room_revenue || 0);
      totalOccupied += Number(segmentData?.[label]?.room_nights || 0);
    }
  }
  if (!totalOccupied) return '0.00';
  return (totalRevenue / totalOccupied).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script> 