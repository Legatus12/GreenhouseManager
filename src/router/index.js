import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboad from '../views/Dashboard.vue'
import Config from '../views/Config.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboad
    },
    {
      path: '/config',
      name: 'config',
      component: Config
    }
  ]
})

export default router
