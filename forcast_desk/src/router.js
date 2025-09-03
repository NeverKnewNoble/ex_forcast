import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'
import { selectedProject, getStoredSelectedProject } from '@/components/utility/dashboard/projectService.js'
import { getProjectDepartments } from '@/components/utility/dashboard/projectService.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/general/Home.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/system/Login.vue'),
  },
  {
    name: 'Reset',
    path: '/reset',
    component: () => import('@/pages/system/Reset.vue'),
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: () => import('@/pages/general/Dashboard.vue'),
  },
  {
    name: 'Expense_Estimate',
    path: '/expense_estimate',
    component: () => import('@/pages/general/Expense_Estimate.vue'),
  },
  {
    name: 'Room_Revenue',
    path: '/room_revenue_assumptions',
    component: () => import('@/pages/hospitality/Room_Revenue.vue'),
    meta: { requiresDepartment: 'Rooms' }
  },
  {
    name: 'F&B_Revenue_Assumptions',
    path: '/f&b_revenue_assumptions',
    component: () => import('@/pages/hospitality/F&B_Revenue_Assumpt.vue'),
    meta: { requiresDepartment: 'Food And Beverage' }
  },
  {
    name: 'Banquet_Revenue',
    path: '/banquet_revenue',
    component: () => import('@/pages/hospitality/Banquet_Revenue.vue'),
    meta: { requiresDepartment: 'Banquet' }
  },
  {
    name: 'OOD_Data',
    path: '/ood_data_input',
    component: () => import('@/pages/hospitality/OOD_Data.vue'),
    meta: { requiresDepartment: 'Other Operating Departments' }
  },
  {
    name: 'Payroll_Data',
    path: '/payroll_data',
    component: () => import('@/pages/general/payroll/Payroll_Data.vue'),
  },
  {
    name: 'Payroll_Related',
    path: '/payroll_related',
    component: () => import('@/pages/general/payroll/Payroll_Related.vue'),
  },
  {
    name: 'Bonus',
    path: '/bonus',
    component: () => import('@/pages/general/payroll/Bonus.vue'),
  },
  {
    name: 'Receipts & Payments',
    path: '/receipts_payments',
    component: () => import('@/pages/general/Receipts_Payments.vue'),
  },
  {
    name: 'Reports',
    path: '/reports',
    component: () => import('@/pages/general/Reports.vue'),
  },
  {
    name: 'Construction_Budget',
    path: '/construction_budget',
    component: () => import('@/pages/non-hospitality/construction_budget_revenue.vue'),
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
  } else {
    // Enforce department-based access if route requires a department
    const requiredDept = to.meta?.requiresDepartment
    // Enforce hospitality experience flag for hospitality pages
    const hospitalityDisabled = (localStorage.getItem('hospitalityExperience') === null)
      ? false === false && false // placeholder no-op to keep syntax; logic below handles default
      : localStorage.getItem('hospitalityExperience') !== 'true'
    const hospitalityRoutes = new Set([
      '/room_revenue_assumptions',
      '/f&b_revenue_assumptions',
      '/banquet_revenue',
      '/ood_data_input'
    ])
    const isHospitalityRoute = hospitalityRoutes.has(to.path)
    // Default behavior: if key is absent we treat hospitalityExperience as enabled (true)
    const stored = localStorage.getItem('hospitalityExperience')
    const hospitalityEnabled = stored === null ? true : stored === 'true'
    if (isHospitalityRoute && !hospitalityEnabled) {
      return next({ name: 'Home' })
    }
    if (requiredDept) {
      try {
        // Determine current project
        const project = selectedProject?.value || getStoredSelectedProject()
        if (!project || !project.project_name) {
          return next({ name: 'Home' })
        }
        const departments = await getProjectDepartments(project.project_name)
        if (Array.isArray(departments) && departments.includes(requiredDept)) {
          return next()
        }
        return next({ name: 'Home' })
      } catch (e) {
        return next({ name: 'Home' })
      }
    }
    // Proceed to route
    next()
  }
})


export default router
