<template>
  <aside :class="['flex-shrink-0 flex-col min-h-screen transition-all duration-200 ease-in-out border border-r-violet-400 bg-white text-gray-800 shadow', is_expanded ? 'w-64' : 'w-16']">
    <!-- Logo -->
    <div class="p-4 justify-center">
      <img v-if="!is_expanded" :src="logoURL" alt="Ex Forecast" class="w-8 mx-auto" />
	  <img v-if="is_expanded" :src="logoURL2" alt="Ex Forecast" class="w-[140px] mx-auto" />
    </div>

    <!-- Toggle -->
    <div class="flex justify-center px-2">
      <span v-if="is_expanded" class="font-bold mr-6 text-[16px]">Welcome, {{ session.user }}</span>
      <button v-if="!is_expanded" @click="ToggleMenu" class="transition-transform duration-200 hover:text-violet-400">
        <CircleArrowRight />
      </button>
	  <button v-if="is_expanded" @click="ToggleMenu" class="transition-transform duration-200 hover:text-violet-400">
        <CircleArrowLeft />
      </button>
    </div>

    <!-- Menu Heading -->
    <h3 v-if="is_expanded" class="text-gray-500 uppercase text-sm px-4 pt-4">Menu</h3>

    <!-- Menu Links -->
	<div class="mt-2 flex-1 space-y-1">
		<template v-for="item in filteredMenuItems" :key="item.text">
    <div v-if="item.children" class="relative">
      <button
        @click="toggleMenuExpand(item.text)"
        class="flex items-center w-full space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white"
        :class="[{ 'justify-center': !is_expanded }]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span v-if="is_expanded" class="text-sm flex-1 text-left">{{ item.text }}</span>
        <component
          v-if="is_expanded"
          :is="expandedMenus[item.text] ? ChevronUp : ChevronDown"
          class="w-4 h-4 ml-auto"
        />
      </button>
      
      <!-- Expanded state for full sidebar -->
      <div v-if="expandedMenus[item.text] && is_expanded" class="pl-8">
        <router-link
          v-for="child in item.children"
          :key="child.text"
          :to="child.route"
          class="flex items-center space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white"
          :class="[
            $route.path === child.route
              ? 'bg-violet-600 border-r-4 border-violet-800 text-white font-semibold'
              : ''
          ]"
        >
          <component :is="child.icon" class="w-5 h-5" />
          <span class="text-sm">{{ child.text }}</span>
        </router-link>
      </div>
      
      <!-- Popup for minimized sidebar -->
      <div 
        v-if="expandedMenus[item.text] && !is_expanded" 
        class="absolute left-full top-0 ml-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
      >
        <div class="p-2">
          <div class="text-xs font-semibold text-gray-500 px-3 py-2 border-b border-gray-100">
            {{ item.text }}
          </div>
          <router-link
            v-for="child in item.children"
            :key="child.text"
            :to="child.route"
            class="flex items-center space-x-3 px-3 py-2 rounded transition hover:bg-violet-500 hover:text-white text-sm"
            :class="[
              $route.path === child.route
                ? 'bg-violet-600 text-white font-semibold'
                : 'text-gray-700'
            ]"
            @click="expandedMenus[item.text] = false"
          >
            <component :is="child.icon" class="w-4 h-4" />
            <span>{{ child.text }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <router-link
      v-else-if="!item.action"
      :to="item.route"
      :class="[
        'flex items-center space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white',
        { 'justify-center': !is_expanded },
        $route.path === item.route
          ? 'bg-violet-600 border-r-4 border-violet-800 text-white font-semibold'
          : ''
      ]"
    >
      <component :is="item.icon" class="w-6 h-6" />
      <span v-if="is_expanded" class="text-sm">{{ item.text }}</span>
    </router-link>
    
    <button
      v-else
      @click="handleItemAction(item.action)"
      :class="[
        'flex items-center space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white w-full',
        { 'justify-center': !is_expanded }
      ]"
    >
      <component :is="item.icon" class="w-6 h-6" />
      <span v-if="is_expanded" class="text-sm">{{ item.text }}</span>
    </button>
  </template>
</div>

    <!-- Footer Greeting -->
    <div class="mt-auto pb-4 px-4">

      <hr v-if="is_expanded" class="my-3 border-t border-gray-200" />
      <div v-if="is_expanded" class="flex flex-col mt-2">
        <div class="flex items-center group relative">
          <label for="hospitality-experience" class="text-sm mr-3 select-none cursor-pointer">Hospitality Experience</label>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 bg-gray-200"
            :class="hospitalityExperience ? 'bg-violet-500' : 'bg-gray-200'"
            @click="hospitalityExperience = !hospitalityExperience"
            :aria-checked="hospitalityExperience"
            role="switch"
            :title="hospitalityExperience ? 'Enabled' : 'Disabled'"
          >
            <span
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
              :class="hospitalityExperience ? 'translate-x-5' : 'translate-x-1'"
            />
          </button>
          <span class="ml-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap bg-white border border-gray-200 px-2 py-1 rounded shadow z-10">Toggle your hospitality experience preference</span>
        </div>
        <span class="text-xs text-gray-500 mt-1 ml-1">Enhance recommendations with your industry experience.</span>
      </div>
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
  ReceiptText,
  Sheet,
  ChartNoAxesCombined,
  Settings,
} from 'lucide-vue-next'

// Get the current route
const route = useRoute()

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

const menuItems = [
  { text: "Home", route: "/", icon: Home },
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard  },
  { text: "Expense Assumptions", route: "/expense_estimate", icon: Calculator   },
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
  { text: "Receipts & Payments", route: "/receipts_payments", icon: ReceiptText },
  { text: "Reports", route: "/reports", icon: BookOpen },
  { text: "Settings", route: "#", icon: Settings, action: "openSettings" },
]

const expandedMenus = ref({})
const toggleMenuExpand = (text) => {
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
