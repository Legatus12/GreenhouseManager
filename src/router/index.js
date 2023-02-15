import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Dashboad from '../views/Dashboard.vue'
import Settings from '../views/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboad
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    }
  ]
})

export default router
