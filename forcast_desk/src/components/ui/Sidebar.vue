<template>
  <aside :class="['flex flex-col min-h-screen transition-all duration-200 ease-in-out border border-r-violet-400 bg-white text-gray-800 shadow', is_expanded ? 'w-64' : 'w-16']">
    <!-- Logo -->
    <div class="p-4 justify-center">
      <img v-if="!is_expanded" :src="logoURL" alt="Ex Forecast" class="w-8 mx-auto" />
	  <img v-if="is_expanded" :src="logoURL2" alt="Ex Forecast" class="w-[140px] mx-auto" />
    </div>

    <!-- Toggle -->
    <div class="flex justify-center px-2">
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
		<router-link
			v-for="item in menuItems"
			:key="item.text"
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
	</div>

    <!-- Footer Greeting -->
    <div class="mt-auto pb-4 px-4">
      <span v-if="is_expanded" class="font-semibold text-[16px]">Welcome, {{ session.user }}</span>
    </div>

  </aside>
</template>

<script setup>
import { ref } from 'vue'
import logoURL from '@/assets/images/icon_logo.png'
import logoURL2 from '@/assets/images/ex_forest_logo.png'
import { session } from '@/data/session' 

// Lucide icons
import { 
  Home, 
  LayoutDashboard, 
  ReceiptText, 
  BanknoteArrowUp, 
  CircleArrowRight,
  MemoryStick, 
  TrendingUpDown, 
  CircleArrowLeft  
} from 'lucide-vue-next'

const is_expanded = ref(localStorage.getItem("is_expanded") === "true")

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  localStorage.setItem("is_expanded", is_expanded.value)
}

const menuItems = [
  { text: "Home", route: "/", icon: Home },
  { text: "Dashboard", route: "/dashboard", icon: LayoutDashboard  },
  { text: "Expense Assumptions", route: "/expense_estimate", icon: ReceiptText  },
  { text: "Room Revenue Budget", route: "/", icon: MemoryStick   },
  { text: "Banquet Revenue Forcast", route: "/", icon: TrendingUpDown  },
  { text: "Profit & Loss Statement", route: "/", icon: BanknoteArrowUp  },
]
</script>
