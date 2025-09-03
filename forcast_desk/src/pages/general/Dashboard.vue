<template>
  <div class="flex">
    <Sidebar @open-settings="openSettings" />

    <div class="flex-1 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:bg-[#0f0f12] dark:from-[#0f0f12] dark:via-[#0f0f12] dark:to-[#0f0f12] px-6 py-8 relative overflow-hidden">
      <!-- Background decorative elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/10 to-purple-400/10 rounded-full blur-3xl dark:opacity-10"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl dark:opacity-10"></div>
      
      <!-- Header Section -->
      <div class="relative z-10">
        <div class="flex items-center justify-between mb-8">
          <div>

          </div>
          
          <!-- Project Selector -->
          <ProjectSelector @project-changed="handleProjectChange" />
        </div>

        <!-- Animated Project Display -->
        <div class="mb-8">
          <div 
            v-if="selectedProject" 
            class="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-violet-600 via-purple-600 to-white shadow-xl border dark:to-violet-700"
          >
            <!-- Animated background elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" style="animation-delay: 1s;"></div>
            
            <!-- Project display content -->
            <div class="relative z-10 text-center">
              <div class="mb-4">
                <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-white/90 text-sm font-medium">Active Project</span>
                </div>
              </div>
              
              <h2 
                class="text-[60px] md:text-[80px] font-bold text-white mb-2 animate-text"
                :key="selectedProject.project_name"
              >
                {{ selectedProject.project_name || "Welcome to Your Forecastor" }}
              </h2>
              
              <p class="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
                Welcome to your project dashboard. Manage forecasts, track expenses, and monitor your financial projections all in one place.
              </p>
              
              <!-- Project stats -->
              <div class="mt-8 flex justify-center gap-8">
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ getCurrentDate() }}</div>
                  <div class="text-white/70 text-sm">Current Date</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ getCurrentTime() }}</div>
                  <div class="text-white/70 text-sm">Local Time</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- No project selected state -->
          <div 
            v-else 
            class="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-violet-500 via-violet-500 to-purple-400 shadow-2xl "
          >
            <div class="relative z-10 text-center">
              <div class="mb-4">
                <div class="inline-flex items-center gap-3 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span class="text-white/90 text-sm font-medium">No Project Selected</span>
                </div>
              </div>
              
              <h2 class="text-[60px] md:text-[80px] font-bold text-white mb-4">
                Welcome to Your Forecastor
              </h2>
              
              <p class="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
                Please select a project from the dropdown above to start managing your forecasts and financial data.
              </p>
            </div>
          </div>
        </div>

        <!-- Statistic Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            v-for="(card, index) in statCards"
            :key="card.label"
            class="group relative  overflow-hidden rounded-2xl p-6 bg-white/70 backdrop-blur-xl shadow-lg border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out"
          >
            <!-- Card background gradient -->
            <div class="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <!-- Animated border -->
            <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-600/30 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-3">
                <p class="text-gray-600 group-hover:text-white text-sm font-medium transition-colors duration-300">{{ card.label }}</p>
                <div class="p-2 rounded-lg" :class="card.bgClass">
                  <component :is="card.icon" class="w-5 h-5" :class="card.iconClass" />
                </div>
              </div>
              <div class="flex items-end justify-between">
                <p :class="card.accentClass + ' text-3xl font-bold group-hover:text-white transition-colors duration-300'">{{ card.value }}</p>
                <div class="flex items-center space-x-1 text-sm" :class="card.trendClass">
                  <component :is="card.trendIcon" class="w-4 h-4" />
                  <span>{{ card.trend }}</span>
                </div>
              </div>
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
    
    <!-- Settings Modal -->
    <SettingsModal 
      :is-visible="showSettingsModal" 
      @close="closeSettings" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from "@/components/ui/Sidebar.vue"
import ProjectSelector from "@/components/ui/ProjectSelector.vue"
import SettingsModal from "@/components/ui/SettingsModal.vue"
import { selectedProject, initializeProjectService } from '@/components/utility/dashboard/projectService.js'
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

// Reactive state for time display
const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

// Settings modal state
const showSettingsModal = ref(false)

// Initialize project service and time display
onMounted(async () => {
  await initializeProjectService()
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Update time and date
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
  currentDate.value = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Get current date and time for display
function getCurrentDate() {
  return currentDate.value
}

function getCurrentTime() {
  return currentTime.value
}

// Project change handler
const handleProjectChange = (project) => {
  // console.log('Project changed to:', project)
  // You can add additional logic here when project changes
  // For example, refresh data based on selected project
}

// Settings modal handlers
const openSettings = () => {
  showSettingsModal.value = true
}

const closeSettings = () => {
  showSettingsModal.value = false
}
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

/* Text animation for project name */
@keyframes textReveal {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  50% {
    opacity: 0.5;
    transform: translateY(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-text {
  animation: textReveal 0.8s ease-out forwards;
}

/* Pulse animation for status indicators */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
