<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-white via-violet-50 to-white px-6 py-8">
      <h1 class="text-[40px] font-extrabold text-gray-800">Dashboard</h1>

      <!-- Statistic Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="rounded-2xl p-6 bg-white/80 backdrop-blur-md shadow-xl border border-violet-100 hover:scale-[1.02] transition transform duration-300"
        >
          <p class="text-gray-500 text-sm">{{ card.label }}</p>
          <div class="mt-2 flex items-center justify-between">
            <p :class="card.accentClass + ' text-3xl font-bold'">{{ card.value }}</p>
            <component :is="card.icon" class="w-6 h-6 text-violet-400" />
          </div>
        </div>
      </div>

      <!-- Section: Recent Forecasts -->
      <div class="mt-12">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Recent Forecasts</h2>
        <div class="rounded-xl shadow-xl overflow-hidden bg-white/90 backdrop-blur-md border border-gray-100">
          <table class="min-w-full text-sm text-left text-gray-800">
            <thead class="bg-violet-100 text-violet-600 uppercase text-xs tracking-wider">
              <tr>
                <th class="px-6 py-4">Month</th>
                <th class="px-6 py-4">Year</th>
                <th class="px-6 py-4">Total Expenses</th>
                <th class="px-6 py-4">Created By</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="item in recentForecasts"
                :key="item.id"
                class="hover:bg-violet-50/40 transition-all duration-200"
              >
                <td class="px-6 py-4 font-medium">{{ item.month }}</td>
                <td class="px-6 py-4">{{ item.year }}</td>
                <td class="px-6 py-4 text-violet-600 font-semibold">GHS {{ item.amount }}</td>
                <td class="px-6 py-4">{{ item.created_by }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/ui/Sidebar.vue"
import { BarChart3, CalendarDays, AlertTriangle, FileText } from "lucide-vue-next"

const statCards = [
  {
    label: "Total Forecasts",
    value: "128",
    icon: FileText,
    accentClass: "text-violet-600"
  },
  {
    label: "Current Year",
    value: "2025",
    icon: CalendarDays,
    accentClass: "text-violet-600"
  },
  {
    label: "Upcoming Expenses",
    value: "GHS 4,820",
    icon: BarChart3,
    accentClass: "text-violet-600"
  },
  {
    label: "Alerts",
    value: "3",
    icon: AlertTriangle,
    accentClass: "text-red-500"
  }
]

const recentForecasts = [
  { id: 1, month: "June", year: "2025", amount: 1800, created_by: "Larry" },
  { id: 2, month: "May", year: "2025", amount: 2200, created_by: "Larry" },
  { id: 3, month: "April", year: "2025", amount: 1650, created_by: "Admin" }
]
</script>
