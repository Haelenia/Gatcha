import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useTestStore } from '../stores/test'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/add',
      name: 'add',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AddView.vue')
    },
    {
      path: '/characters',
      name: 'characters',
      component: () => import('../views/CharacterList.vue')
    },
    {
      path: '/dongeons',
      name: 'dongeons',
      component: () => import('../views/DungeonList.vue')
    },
    {
      path: '/sets',
      name: 'about',
      component: () => import('../views/SetList.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  let store = useTestStore()
  if (!store.getSelectedGame && to.name !== 'home') {
    return { name: 'home'}
  }
})

export default router
