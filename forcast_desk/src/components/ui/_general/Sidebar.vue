<template>
  <aside :class="['flex-shrink-0 flex flex-col min-h-screen transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] border border-r-violet-400 bg-white text-gray-800 shadow dark:bg-black dark:text-white dark:border-violet-900/30', is_expanded ? 'w-64' : 'w-16']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- Logo -->
    <div class="p-4 justify-center relative h-[40px]">
      <img v-show="!is_expanded" :src="logoURL" alt="Ex Forecast" class="w-8 mx-auto absolute inset-0 m-auto transition-opacity duration-300" :class="is_expanded ? 'opacity-0' : 'opacity-100'" />
      <!-- <img v-show="is_expanded" :src="logoURL2" alt="Ex Forecast" class="w-[140px] mx-auto pt-2 absolute inset-0 m-auto transition-opacity duration-300 delay-150" :class="is_expanded ? 'opacity-100' : 'opacity-0'" /> -->
    </div>

    

    <!-- Toggle -->
    <div class="flex justify-center px-4 items-center h-[28px]">
      <span v-show="is_expanded" class="font-bold mr-6 text-[16px] dark:text-white transition-opacity duration-300 delay-150" :class="is_expanded ? 'opacity-100' : 'opacity-0'">Welcome, {{ session.user }}</span>
      <button @click="ToggleMenu" class="transition-all duration-200 hover:text-violet-400 dark:text-white dark:hover:text-violet-300">
        <CircleArrowRight v-show="!is_expanded" class="transition-opacity duration-200" :class="!is_expanded ? 'opacity-100' : 'opacity-0'" />
        <CircleArrowLeft v-show="is_expanded" class="transition-opacity duration-200 delay-100" :class="is_expanded ? 'opacity-100' : 'opacity-0'" />
      </button>
    </div>

    

    <!-- Menu Heading -->
    <div class="overflow-hidden">
      <h3 v-show="is_expanded" class="text-gray-500 uppercase text-sm px-4 pt-4 dark:text-white transition-all duration-300 delay-150" :class="is_expanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'">Menu</h3>
    </div>

    <!-- Menu Links -->
	<div class="mt-2 flex-1 space-y-1">
		<template v-for="item in filteredMenuItems" :key="item.text">
    <div v-if="item.children" class="relative">
      <button
        @click="toggleMenuExpand(item.text)"
        class="flex items-center w-full space-x-3 px-4 py-2 rounded transition-all duration-200 hover:bg-violet-500 hover:text-white dark:text-white overflow-hidden"
        :class="[{ 'justify-center': !is_expanded }]"
      >
        <component :is="item.icon" class="w-6 h-6 dark:text-white flex-shrink-0" />
        <span v-show="is_expanded" class="text-sm flex-1 text-left dark:text-white transition-opacity duration-300 delay-150 whitespace-nowrap" :class="is_expanded ? 'opacity-100' : 'opacity-0'">{{ item.text }}</span>
        <component
          v-show="is_expanded"
          :is="expandedMenus[item.text] ? ChevronUp : ChevronDown"
          class="w-4 h-4 ml-auto dark:text-white flex-shrink-0 transition-opacity duration-300 delay-150"
          :class="is_expanded ? 'opacity-100' : 'opacity-0'"
        />
      </button>
      
      <!-- Expanded state for full sidebar -->
      <transition
        enter-active-class="transition-all duration-400 ease-out"
        leave-active-class="transition-all duration-250 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[500px]"
        leave-from-class="opacity-100 max-h-[500px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-if="expandedMenus[item.text] && is_expanded" class="pl-8 overflow-hidden">
          <router-link
            v-for="child in item.children"
            :key="child.text"
            :to="child.route"
            class="flex items-center space-x-3 px-4 py-2 rounded transition-all duration-200 hover:bg-violet-500 hover:text-white dark:text-white"
            :class="[
              $route.path === child.route
                ? 'bg-violet-600 border-r-4 border-violet-800 text-white font-semibold'
                : ''
            ]"
          >
            <component :is="child.icon" class="w-5 h-5 dark:text-white flex-shrink-0" />
            <span class="text-sm dark:text-white">{{ child.text }}</span>
          </router-link>
        </div>
      </transition>
      
      <!-- Popup for minimized sidebar -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 scale-95 -translate-x-2"
        enter-to-class="opacity-100 scale-100 translate-x-0"
        leave-from-class="opacity-100 scale-100 translate-x-0"
        leave-to-class="opacity-0 scale-95 -translate-x-2"
      >
        <div 
          v-if="expandedMenus[item.text] && !is_expanded" 
          class="absolute left-full top-0 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 dark:bg-black dark:border-[#1F2430] dark:shadow-black/40 dark:text-white"
        >
          <div class="p-2">
            <div class="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-100 dark:text-white dark:border-[#1F2430]">
              {{ item.text }}
            </div>
            <router-link
              v-for="child in item.children"
              :key="child.text"
              :to="child.route"
              class="flex items-center space-x-3 px-3 py-2 rounded transition-all duration-200 hover:bg-violet-500 hover:text-white text-sm dark:hover:bg-violet-600 dark:text-white"
              :class="[
                $route.path === child.route
                  ? 'bg-violet-600 text-white font-semibold'
                  : ''
              ]"
              @click="expandedMenus[item.text] = false"
            >
              <component :is="child.icon" class="w-4 h-4 dark:text-white" />
              <span class="dark:text-white">{{ child.text }}</span>
            </router-link>
          </div>
        </div>
      </transition>
    </div>
    <router-link
      v-else-if="!item.action"
      :to="item.route"
      :class="[
        'flex items-center space-x-3 px-4 py-2 rounded transition-all duration-200 hover:bg-violet-500 hover:text-white dark:text-white overflow-hidden',
        { 'justify-center': !is_expanded },
        $route.path === item.route
          ? 'bg-violet-600 border-r-4 border-violet-800 text-white font-semibold'
          : ''
      ]"
    >
      <component :is="item.icon" class="w-6 h-6 dark:text-white flex-shrink-0" />
      <span v-show="is_expanded" class="text-sm dark:text-white transition-opacity duration-300 delay-150 whitespace-nowrap" :class="is_expanded ? 'opacity-100' : 'opacity-0'">{{ item.text }}</span>
    </router-link>
    
    <button
      v-else
      @click="handleItemAction(item.action)"
      :class="[
        'flex items-center space-x-3 px-4 py-2 rounded transition-all duration-200 hover:bg-violet-500 hover:text-white w-full dark:text-white overflow-hidden',
        { 'justify-center': !is_expanded }
      ]"
    >
      <component :is="item.icon" class="w-6 h-6 dark:text-white flex-shrink-0" />
      <span v-show="is_expanded" class="text-sm dark:text-white transition-opacity duration-300 delay-150 whitespace-nowrap" :class="is_expanded ? 'opacity-100' : 'opacity-0'">{{ item.text }}</span>
    </button>
  </template>
</div>

    <!-- Footer Greeting -->
    <div class="mt-auto pb-4 px-4">

      <hr v-if="is_expanded" class="my-3 border-t border-gray-200" />
      
    </div>

  </aside>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import logoURL from '@/assets/images/icon_logo.png'
import logoURL2 from '@/assets/images/ex_forest_logo.png'
import { session } from '@/data/session' 
import { selectedProject } from '@/components/utility/dashboard/projectService.js'
import { getProjectDepartments } from '@/components/utility/dashboard/projectService.js'

// Lucide icons
import { 
  Home, 
  LayoutDashboard, 
  Calculator, 
  CircleArrowRight,
  BedDouble, 
  HandPlatter,
  UtensilsCrossed, 
  CircleArrowLeft,
  ChevronDown,
  ChevronUp,
  HandCoins,
  Ellipsis,
  BookOpen,
  Building2,
  Hammer,
  ReceiptText,
  Sheet,
  ChartNoAxesCombined,
  Settings,
  DollarSign,
  Wallet,
  HardHat,
  FileText,
  CircleDollarSign,
  TrendingUp,
  Wrench,
} from 'lucide-vue-next'

// Get the current route
const route = useRoute()

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

// Auto expand state
const autoExpandSidebar = ref(localStorage.getItem('autoExpandSidebar') === 'true')
watch(autoExpandSidebar, (newVal) => {
  localStorage.setItem('autoExpandSidebar', String(newVal))
})

// Hover handlers for auto expand with smooth transitions
const handleMouseEnter = () => {
  if (autoExpandSidebar.value) {
    // Delay for premium feel
    setTimeout(() => {
      is_expanded.value = true
    }, 150)
  }
}
const handleMouseLeave = () => {
  if (autoExpandSidebar.value) {
    // Delay for premium feel
    setTimeout(() => {
      is_expanded.value = false
    }, 200)
  }
}

const menuItems = [
  { text: "Home", route: "/", icon: Home },
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard  },
  { text: "Expense Assumptions", route: "/expense_estimate", icon: Calculator },
  {
    text: "Revenue",
    icon: ChartNoAxesCombined ,
    children: [
      { text: "Room Revenue Assumptions", route: "/room_revenue_assumptions", icon: BedDouble },
      { text: "F&B Revenue Assumptions", route: "/f&b_revenue_assumptions", icon: UtensilsCrossed },
      { text: "Banquet Revenue Assumptions", route: "/banquet_revenue", icon: HandPlatter},
      { text: "OOD Revenue Assumptions", route: "/ood_data_input", icon: Building2},
    ]
  },
  {
    text: "Payroll",
    icon: Sheet,
    children: [
      { text: "Payroll Data", route: "/payroll_data", icon: HandCoins },
      { text: "Payroll Related", route: "/payroll_related", icon: Ellipsis },
      { text: "Bonus", route: "/bonus", icon: Ellipsis }
    ]
  },
  {
    text: "Cost Of Sales",
    icon: DollarSign,
    children: [
      { text: "Project Budget", route: "/project_budget", icon: Wallet},
      { text: "Contractor Estimator", route: "/contractor_estimator", icon: HardHat},
    ]
  },
  { text: "Receipts & Payments", route: "/receipts_payments", icon: ReceiptText },
  {
    text: "Reports",
    icon: BookOpen,
    children: [
      { text: "Room Profit & Loss", route: "/reports/room-pnl", icon: BedDouble },
      { text: "F&B Profit & Loss", route: "/reports/fnb-pnl", icon: UtensilsCrossed },
      { text: "OOD Profit & Loss", route: "/reports/ood-pnl", icon: Building2 },
      { text: "P&L Statement", route: "/reports/pl-statement", icon: FileText },
      { text: "Balance Sheet", route: "/reports/balance-sheet", icon: CircleDollarSign },
      { text: "Cashflow", route: "/reports/cashflow", icon: TrendingUp },
      { text: "Capex Schedule", route: "/reports/capex-schedule", icon: Wrench },
    ]
  },
  { text: "Settings", route: "#", icon: Settings, action: "openSettings" },
]

const expandedMenus = ref({})
const toggleMenuExpand = (text) => {
  // If opening a menu, close all others first
  if (!expandedMenus.value[text]) {
    Object.keys(expandedMenus.value).forEach(key => {
      if (key !== text) {
        expandedMenus.value[key] = false
      }
    })
  }
  expandedMenus.value[text] = !expandedMenus.value[text]
}

const hospitalityExperience = ref(
  localStorage.getItem('hospitalityExperience') === null
    ? true
    : localStorage.getItem('hospitalityExperience') === 'true'
)

watch(hospitalityExperience, (newVal) => {
  localStorage.setItem('hospitalityExperience', newVal)
})

// Click outside handler for popup menus
const handleClickOutside = (event) => {
  const sidebar = event.target.closest('aside')
  if (!sidebar) {
    // Close all expanded menus when clicking outside
    Object.keys(expandedMenus.value).forEach(key => {
      expandedMenus.value[key] = false
    })
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const handler = (event) => {
    const detail = event && event.detail ? event.detail : null
    if (!detail) return
    if (detail.key === 'autoExpandSidebar') {
      autoExpandSidebar.value = detail.value
    }
    if (detail.key === 'hospitalityExperience') {
      hospitalityExperience.value = detail.value
    }
  }
  window.addEventListener('settings-updated', handler)
  
  // Store references for cleanup
  window.__sidebarSettingsHandler = handler
  
  // Use optimized localStorage and reduce sync frequency
  const sync = () => {
    try {
      const autoVal = localStorage.getItem('autoExpandSidebar') === 'true'
      if (autoExpandSidebar.value !== autoVal) autoExpandSidebar.value = autoVal
      const hospItem = localStorage.getItem('hospitalityExperience')
      const hospVal = hospItem === null ? true : hospItem === 'true'
      if (hospitalityExperience.value !== hospVal) hospitalityExperience.value = hospVal
    } catch (error) {
      // Handle localStorage errors silently
      if (process.env.NODE_ENV === 'development') {
        console.warn('Sidebar sync error:', error)
      }
    }
  }
  
  // Reduce sync frequency to 5 seconds instead of 1 second
  const intervalId = setInterval(sync, 5000)
  window.__sidebarSyncInterval = intervalId
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (window.__sidebarSettingsHandler) {
    window.removeEventListener('settings-updated', window.__sidebarSettingsHandler)
    window.__sidebarSettingsHandler = null
  }
  if (window.__sidebarSyncInterval) {
    clearInterval(window.__sidebarSyncInterval)
    window.__sidebarSyncInterval = null
  }
})



// Project departments state
const projectDepartments = ref([])

//? Load departments when selected project changes
watch(selectedProject, async (project) => {
  try {
    if (project && project.project_name) {
      projectDepartments.value = await getProjectDepartments(project.project_name)
    } else {
      projectDepartments.value = []
    }
  } catch (e) {
    projectDepartments.value = []
  }
}, { immediate: true })



const filteredMenuItems = computed(() => {
  // Recursively filter children if needed
  function filterItems(items) {
    return items
      .map(item => {
        if (item.text === "Room Revenue Assumptions" && !hospitalityExperience.value) {
          return null;
        }
        if (item.children) {
          // If this is Revenue group, conditionally include children based on project departments
          let childrenToFilter = item.children
          if (item.text === 'Revenue') {
            const depts = projectDepartments.value || []
            childrenToFilter = item.children.filter(child => {
              // Hide hospitality pages if hospitality experience is disabled
              if (!hospitalityExperience.value && (
                child.route === '/room_revenue_assumptions' ||
                child.route === '/f&b_revenue_assumptions' ||
                child.route === '/banquet_revenue' ||
                child.route === '/ood_data_input'
              )) {
                return false
              }
              // If no project selected, show all revenue items
              if (!selectedProject.value || !selectedProject.value.project_name) {
                return true
              }
              if (child.text.includes('Room Revenue')) {
                return depts.includes('Rooms')
              }
              if (child.text.includes("F&B Revenue") || child.text.includes('F&B')) {
                return depts.includes('Food And Beverage')
              }
              if (child.text.includes('Banquet')) {
                return depts.includes('Banquet')
              }
              if (child.text.includes('OOD')) {
                return depts.includes('Other Operating Departments')
              }
              return true
            })
          }
          const filteredChildren = filterItems(childrenToFilter)
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren }
          } else {
            return null
          }
        }
        return item
      })
      .filter(Boolean)
  }
  
  // Filter out settings if on home page
  const baseItems = filterItems(menuItems)
  return baseItems.filter(item => {
    // Always show settings if not on home page
    if (item.text === "Settings") {
      return route.path !== "/"
    }
    return true
  })
})

// Handle item actions
const handleItemAction = (action) => {
  if (action === 'openSettings') {
    emit('open-settings')
  }
}

// Define emits
const emit = defineEmits(['project-changed', 'open-settings'])
</script>
