<template>
  <div class="flex">
    <Sidebar />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 px-6 py-8 relative overflow-hidden">
      <!-- Background decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      
      <!-- Header Section -->
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              Welcome back! 👋
            </h1>
            <p class="text-gray-600 mt-2 text-lg">Here's what's happening with your forecasts today</p>
          </div>
        </div>

        <!-- Statistic Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            v-for="(card, index) in statCards"
            :key="card.label"
            class="group relative overflow-hidden rounded-2xl p-6 bg-white/70 backdrop-blur-xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out"
          >
            <!-- Card background gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Animated border -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-3">
                <p class="text-gray-600 text-sm font-medium">{{ card.label }}</p>
                <div class="p-2 rounded-lg" :class="card.bgClass">
                  <component :is="card.icon" class="w-5 h-5" :class="card.iconClass" />
                </div>
              </div>
              <div class="flex items-end justify-between">
                <p :class="card.accentClass + ' text-3xl font-bold'">{{ card.value }}</p>
                <div class="flex items-center space-x-1 text-sm" :class="card.trendClass">
                  <component :is="card.trendIcon" class="w-4 h-4" />
                  <span>{{ card.trend }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        <!-- Recent Forecasts Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Recent Forecasts</h2>
            <button class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors duration-200">
              <span>View All</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <div class="rounded-2xl shadow-xl overflow-hidden bg-white/80 backdrop-blur-xl border border-white/20">
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead class="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Expenses</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created By</th>
                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100/50">
                  <tr
                    v-for="item in recentForecasts"
                    :key="item.id"
                    class="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span class="font-medium text-gray-800">{{ item.month }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-gray-600">{{ item.year }}</td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-gray-800">GHS {{ item.amount.toLocaleString() }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {{ item.created_by.charAt(0) }}
                        </div>
                        <span class="text-gray-700">{{ item.created_by }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="item.statusClass">
                        {{ item.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" :class="activity.bgClass">
                  {{ activity.icon }}
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 font-medium">{{ activity.title }}</p>
                  <p class="text-xs text-gray-500">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-xl font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
            <div class="space-y-4">
              <div v-for="deadline in upcomingDeadlines" :key="deadline.id" class="flex items-center justify-between p-3 rounded-lg" :class="deadline.bgClass">
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ deadline.title }}</p>
                  <p class="text-xs text-gray-600">{{ deadline.date }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold" :class="deadline.textClass">{{ deadline.daysLeft }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/ui/Sidebar.vue"
import { BarChart3, CalendarDays, AlertTriangle, FileText, TrendingUp, TrendingDown, Users, DollarSign } from "lucide-vue-next"

const statCards = [
  {
    label: "Total Forecasts",
    value: "128",
    icon: FileText,
    iconClass: "text-blue-600",
    bgClass: "bg-blue-100",
    accentClass: "text-blue-600",
    trend: "+12%",
    trendIcon: TrendingUp,
    trendClass: "text-green-600"
  },
  {
    label: "Current Year",
    value: "2025",
    icon: CalendarDays,
    iconClass: "text-purple-600",
    bgClass: "bg-purple-100",
    accentClass: "text-purple-600",
    trend: "Active",
    trendIcon: TrendingUp,
    trendClass: "text-purple-600"
  },
  {
    label: "Upcoming Expenses",
    value: "GHS 4,820",
    icon: DollarSign,
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
    accentClass: "text-emerald-600",
    trend: "+8%",
    trendIcon: TrendingUp,
    trendClass: "text-emerald-600"
  },
  {
    label: "Alerts",
    value: "3",
    icon: AlertTriangle,
    iconClass: "text-red-600",
    bgClass: "bg-red-100",
    accentClass: "text-red-600",
    trend: "-2",
    trendIcon: TrendingDown,
    trendClass: "text-green-600"
  }
]

const recentForecasts = [
  { 
    id: 1, 
    month: "June", 
    year: "2025", 
    amount: 1800, 
    created_by: "Larry",
    status: "Completed",
    statusClass: "bg-green-100 text-green-800"
  },
  { 
    id: 2, 
    month: "May", 
    year: "2025", 
    amount: 2200, 
    created_by: "Larry",
    status: "In Progress",
    statusClass: "bg-yellow-100 text-yellow-800"
  },
  { 
    id: 3, 
    month: "April", 
    year: "2025", 
    amount: 1650, 
    created_by: "Admin",
    status: "Completed",
    statusClass: "bg-green-100 text-green-800"
  }
]

const recentActivity = [
  { id: 1, icon: "📊", title: "New forecast created for June 2025", time: "2 hours ago", bgClass: "bg-blue-500" },
  { id: 2, icon: "💰", title: "Expense updated in May forecast", time: "4 hours ago", bgClass: "bg-green-500" },
  { id: 3, icon: "⚠️", title: "Alert triggered for budget limit", time: "6 hours ago", bgClass: "bg-yellow-500" },
  { id: 4, icon: "👥", title: "Team member Larry joined project", time: "1 day ago", bgClass: "bg-purple-500" }
]

const upcomingDeadlines = [
  { id: 1, title: "Q1 Review Meeting", date: "March 15, 2025", daysLeft: "5 days", bgClass: "bg-red-50", textClass: "text-red-600" },
  { id: 2, title: "Budget Approval", date: "March 20, 2025", daysLeft: "10 days", bgClass: "bg-yellow-50", textClass: "text-yellow-600" },
  { id: 3, title: "Annual Report", date: "March 25, 2025", daysLeft: "15 days", bgClass: "bg-blue-50", textClass: "text-blue-600" }
]
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Smooth hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Glass morphism effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}
</style>
