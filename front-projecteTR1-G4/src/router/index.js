import LoginView from '@/views/LoginView.vue'
import LobbyView from '@/views/LobbyView.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home', 
      component: LoginView,
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: LobbyView,
    },
  ],
})

export default router
