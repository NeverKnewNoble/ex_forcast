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
              <!-- Medical Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Medical</span>
                </div>
              </th>
              <!-- Employee Meal Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Employee Meal</span>
                </div>
              </th>
              <!-- Transport Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Transport</span>
                </div>
              </th>
            </tr>
            <tr class="bg-yellow-500/90 text-xs">
              <!-- Medical Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'medical-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Medical Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
              <!-- Employee Meal Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'meal-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Employee Meal Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
              <!-- Transport Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'transport-' + month"
                class="px-2 py-1 text-center border border-yellow-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Transport Total Sub-column -->
              <th class="px-2 py-1 text-center border border-yellow-300 min-w-[100px] font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Sample Data Row -->
            <tr class="border-b border-gray-200 hover:bg-yellow-50 transition-all duration-200">
              <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                Manager
              </td>
              <td class="px-3 py-2 font-medium border-r border-yellow-200 text-gray-700">
                General Manager
              </td>
              <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                5,000.00
              </td>
              <td class="px-3 py-2 text-right border-r border-yellow-200 font-mono text-sm">
                1
              </td>
              <!-- Medical Monthly Values -->
              <td 
                v-for="month in months" 
                :key="'medical-value-' + month"
                class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                contenteditable="true"
              >
                <span class="font-mono text-xs text-yellow-700">200.00</span>
              </td>
              <!-- Medical Total -->
              <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                <span class="font-mono text-xs text-yellow-900">2,400.00</span>
              </td>
              <!-- Employee Meal Monthly Values -->
              <td 
                v-for="month in months" 
                :key="'meal-value-' + month"
                class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                contenteditable="true"
              >
                <span class="font-mono text-xs text-yellow-700">150.00</span>
              </td>
              <!-- Employee Meal Total -->
              <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                <span class="font-mono text-xs text-yellow-900">1,800.00</span>
              </td>
              <!-- Transport Monthly Values -->
              <td 
                v-for="month in months" 
                :key="'transport-value-' + month"
                class="px-2 py-1 text-right border border-yellow-200 hover:bg-yellow-50 outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                contenteditable="true"
              >
                <span class="font-mono text-xs text-yellow-700">100.00</span>
              </td>
              <!-- Transport Total -->
              <td class="px-2 py-1 text-right border border-yellow-200 font-semibold bg-yellow-50">
                <span class="font-mono text-xs text-yellow-900">1,200.00</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderOpen } from 'lucide-vue-next';

// Months array
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 