import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useTestStore } from '../stores/test'

let game = window.localStorage.getItem('game')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
          path: '/',
          name: 'home',
          component: HomeView,
          meta: { title: 'Welcome'}
        },
        {
          path: '/characters',
          name: 'characters',
          component: () => import('../components/characters/CharacterList.vue'),
          meta: { title: `${game} - Liste des personnages`}
        },
        {
          path: '/character',
          name: 'character-create',
          component: () => import('../components/characters/EditCharacters.vue'),
          meta: { title: `${game} - Création de personnage`}
        },
        {
          path: '/character/:id',
          name: 'character-edit',
          component: () => import('../components/characters/EditCharacters.vue'),
        },
        {
          path: '/dungeons',
          name: 'dungeons',
          component: () => import('../components/dungeons/DungeonList.vue'),
          meta: { title: `${game} - Liste des donjons`}
        },
        {
          path: '/dungeon',
          name: 'dungeon-create',
          component: () => import('../components/dungeons/EditDungeon.vue'),
          meta: { title: `${game} - Création de donjon`}
        },
        {
          path: '/dungeon/:id',
          name: 'dungeon-edit',
          component: () => import('../components/dungeons/EditDungeon.vue'),
        },
        {
          path: '/sets',
          name: 'sets',
          component: () => import('../components/set/SetList.vue'),
          meta: { title: `${game} - Liste des sets`}
        },
        {
          path: '/set',
          name: 'set-create',
          component: () => import('../components/set/EditSet.vue'),
          meta: { title: `${game} - Création de set`}
        },
        {
          path: '/set/:id',
          name: 'set-edit',
          component: () => import('../components/set/EditSet.vue'),
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/LoginPage.vue'),
          meta: { title: 'Login'}
        },
    ]
})

router.beforeEach((to) => {
    let store = useTestStore()

    if (to.meta?.title) {
        document.title = to.meta.title
    } else {
        document.title = game
    }

    if (game && !store.getSelectedGame) {
        store.selectGame(game)
    }
    if (!game && to.name !== 'home') {
        return { name: 'home'}
    }
})

export default router
