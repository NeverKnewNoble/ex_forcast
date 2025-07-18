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
    <div v-if="item.children">
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
      <div v-if="expandedMenus[item.text]" class="pl-8">
        <router-link
          v-for="child in item.children"
          :key="child.text"
          :to="child.route"
          class="flex items-center space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white"
          :class="[
            { 'justify-center': !is_expanded },
            $route.path === child.route
              ? 'bg-violet-100 border-r-4 border-violet-400 text-violet-500 font-semibold'
              : ''
          ]"
        >
          <component :is="child.icon" class="w-5 h-5" />
          <span v-if="is_expanded" class="text-sm">{{ child.text }}</span>
        </router-link>
      </div>
    </div>
    <router-link
      v-else
      :to="item.route"
      :class="[
        'flex items-center space-x-3 px-4 py-2 rounded transition hover:bg-violet-500 hover:text-white',
        { 'justify-center': !is_expanded },
        $route.path === item.route
          ? 'bg-violet-100 border-r-4 border-violet-400 text-violet-500 font-semibold'
          : ''
      ]"
    >
      <component :is="item.icon" class="w-6 h-6" />
      <span v-if="is_expanded" class="text-sm">{{ item.text }}</span>
    </router-link>
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
import { ref, watch, computed } from 'vue'
import logoURL from '@/assets/images/icon_logo.png'
import logoURL2 from '@/assets/images/ex_forest_logo.png'
import { session } from '@/data/session' 

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
  Book,
  HandCoins,
  Ellipsis,
  Plus,
  Building2,
  ReceiptText,
  Sheet,
} from 'lucide-vue-next'

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

const menuItems = [
  { text: "Home", route: "/", icon: Home },
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard  },
  { text: "Expense Assumptions", route: "/expense_estimate", icon: Calculator   },
  { text: "Room Revenue Assumptions", route: "/room_revenue_assumptions", icon: BedDouble },
  { text: "F&B Revenue Assumptions", route: "/f&b_revenue_assumptions", icon: UtensilsCrossed },
  { text: "Banquet Revenue Forcast", route: "/banquet_revenue", icon: HandPlatter},
  { text: "OOD Data", route: "/ood_data_input", icon: Building2},
  {
    text: "Payroll",
    icon: Sheet,
    children: [
      { text: "Payroll Data", route: "/payroll", icon: HandCoins },
      { text: "Payroll Related", route: "/payroll_related", icon: Ellipsis }
    ]
  },
  { text: "Receipts & Payments", route: "/receipts_and_payments", icon: ReceiptText },
  {
    text: "Reports",
    icon: Plus,
    children: [
      { text: "Room P&L", route: "/room_p&l", icon: Book  },
      { text: "F&B P&L", route: "/f&b_p&l", icon: Book },
      { text: "OOD P&L", route: "/ood_p&l", icon: Book },
      { text: "Profit & Loss Statement", route: "/profit_and_loss_statement", icon: Book },
      { text: "Balance Sheet", route: "/balance_sheet", icon: Book },
      { text: "Cash Flow", route: "/cash_flow", icon: Book },
    ]
  },
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

const filteredMenuItems = computed(() => {
  // Recursively filter children if needed
  function filterItems(items) {
    return items
      .map(item => {
        if (item.text === "Room Revenue Assumptions" && !hospitalityExperience.value) {
          return null;
        }
        if (item.children) {
          const filteredChildren = filterItems(item.children)
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
  return filterItems(menuItems)
})
</script>
