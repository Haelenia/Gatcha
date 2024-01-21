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
      path: '/characters',
      name: 'characters',
      component: () => import('../components/characters/CharacterList.vue')
    },
    {
      path: '/character',
      name: 'character-create',
      component: () => import('../components/characters/EditCharacters.vue')
    },
    {
      path: '/character/:id',
      name: 'character-edit',
      component: () => import('../components/characters/EditCharacters.vue')
    },
    {
      path: '/dungeons',
      name: 'dungeons',
      component: () => import('../components/dungeons/DungeonList.vue')
    },
    {
      path: '/dungeon',
      name: 'dungeon-create',
      component: () => import('../components/dungeons/EditDungeon.vue')
    },
    {
      path: '/dungeon/:id',
      name: 'dungeon-edit',
      component: () => import('../components/dungeons/EditDungeon.vue')
    },
    {
      path: '/sets',
      name: 'sets',
      component: () => import('../components/set/SetList.vue')
    },
    {
      path: '/set',
      name: 'set-create',
      component: () => import('../components/set/EditSet.vue')
    },
    {
      path: '/set/:id',
      name: 'set-edit',
      component: () => import('../components/set/EditSet.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
    },
  ]
})

router.beforeEach((to) => {
  let store = useTestStore()
  let game = window.localStorage.getItem('game')

  if (game && !store.getSelectedGame) {
    store.selectGame(game)
  }
  if (!game && to.name !== 'home') {
    return { name: 'home'}
  }
})

export default router
