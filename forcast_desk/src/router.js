import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    name: 'Reset',
    path: '/reset',
    component: () => import('@/pages/Reset.vue'),
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
  {
    name: 'Expense_Estimate',
    path: '/expense_estimate',
    component: () => import('@/pages/Expense_Estimate.vue'),
  },
  {
    name: 'Room_Revenue',
    path: '/room_revenue_assumptions',
    component: () => import('@/pages/Room_Revenue.vue'),
  },
  {
    name: 'F&B_Revenue_Assumptions',
    path: '/f&b_revenue_assumptions',
    component: () => import('@/pages/F&B_Revenue_Assumpt.vue'),
  },
  {
    name: 'Banquet_Revenue',
    path: '/banquet_revenue',
    component: () => import('@/pages/Banquet_Revenue.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/forcast_desk'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn

  try {
    await userResource.promise
  } catch (error) {
    isLoggedIn = false
  }

  // Routes that can be accessed without login
  const publicPages = ['Login', 'Reset']

  if (!isLoggedIn && !publicPages.includes(to.name)) {
    // If not logged in and trying to access a protected route
    next({ name: 'Login' })
  } else if (isLoggedIn && to.name === 'Login') {
    // If logged in and trying to go to login, redirect to home
    next({ name: 'Home' })
  } else if (to.name === 'Room_Revenue') {
    // Check if hospitality experience is enabled for room revenue assumptions
    const hospitalityExperience = localStorage.getItem('hospitalityExperience')
    const isHospitalityEnabled = hospitalityExperience === null ? true : hospitalityExperience === 'true'
    
    if (!isHospitalityEnabled) {
      // Redirect to home if hospitality experience is disabled
      next({ name: 'Home' })
    } else {
      // Proceed to room revenue page
      next()
    }
  } else {
    // Proceed to route
    next()
  }
})


export default router
