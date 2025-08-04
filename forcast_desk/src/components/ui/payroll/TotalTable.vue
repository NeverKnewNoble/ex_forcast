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
              <!-- Total Column -->
              <th colspan="13" class="px-2 py-2 text-center border-x-2 border-white font-semibold text-sm">
                <div class="flex items-center justify-center gap-1">
                  <span class="font-semibold">Total</span>
                </div>
              </th>
            </tr>
            <tr class="bg-blue-500/90 text-xs">
              <!-- Monthly Sub-columns -->
              <th 
                v-for="month in months" 
                :key="'total-' + month"
                class="px-2 py-1 text-center border border-blue-300 min-w-[80px] font-medium"
              >
                {{ month }}
              </th>
              <!-- Total Sub-column -->
              <th class="px-2 py-1 text-center border border-blue-300 min-w-[100px] font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="text-gray-700 bg-white text-sm">
            <!-- Sample Data Row -->
            <tr class="border-b border-gray-200 hover:bg-blue-50 transition-all duration-200">
              <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                Manager
              </td>
              <td class="px-3 py-2 font-medium border-r border-blue-200 text-gray-700">
                General Manager
              </td>
              <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                5,000.00
              </td>
              <td class="px-3 py-2 text-right border-r border-blue-200 font-mono text-sm">
                1
              </td>
              <!-- Total Monthly Values -->
              <td 
                v-for="month in months" 
                :key="'total-value-' + month"
                class="px-2 py-1 text-right border border-blue-200 hover:bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                contenteditable="true"
              >
                <span class="font-mono text-xs text-blue-700">8,500.00</span>
              </td>
              <!-- Total -->
              <td class="px-2 py-1 text-right border border-blue-200 font-semibold bg-blue-50">
                <span class="font-mono text-xs text-blue-900">102,000.00</span>
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