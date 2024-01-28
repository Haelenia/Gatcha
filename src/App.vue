<template>
    <v-app>
        <v-app-bar color="teal" class="-main-header">
        <v-app-bar-title>
            <v-btn :class="{ 'v-btn--active': store.selectedGame === 'Genshin'}" @click="goToList('Genshin')">Genshin</v-btn>
            <v-btn :class="{ 'v-btn--active': store.selectedGame === 'HSR'}" @click="goToList('HSR')">HSR</v-btn>
            
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <span>	&#x1F477; Site en cours de développement &#x1F609;</span>
        <v-spacer></v-spacer>
        <nav class="pr-4">
            <!-- <v-btn v-if="store.getSelectedGame" to="/"><v-icon icon="mdi-home"></v-icon></v-btn> -->
            <v-btn v-if="store.getSelectedGame" to="/characters">Personnages</v-btn>
            <v-btn v-if="store.getSelectedGame && isLoggedIn" :to="{ name: 'character-create'}">Ajouter un personnage</v-btn>
            <v-btn v-if="store.getSelectedGame" :to="{ name: 'dungeons'}">Donjons</v-btn>
            <v-btn v-if="store.getSelectedGame && isLoggedIn" :to="{ name: 'dungeon-create'}">Ajouter un donjon</v-btn>
            <v-btn v-if="store.getSelectedGame"
                :to="{ name: 'sets'}">{{ `Sets ${store.getSelectedGame === 'Genshin' ? 'd\'artefacts' : 'de reliques'}`}}</v-btn>
            <v-btn v-if="store.getSelectedGame && isLoggedIn"
                :to="{ name: 'set-create'}">{{ `Ajouter un set ${store.getSelectedGame === 'Genshin' ? 'd\'artefacts' : 'de reliques'}`}}</v-btn>

            <v-btn v-if="isLoggedIn" @click="signOutOfFirebase">Sign Out</v-btn>
            <v-btn v-else to="/login">Sign in</v-btn>
        </nav>
    </v-app-bar>

    <v-main>
        <Suspense>
            <RouterView :key="route.fullPath" />
            <template v-slot:fallback>
            <p>Content not found. Contact your developer for more info.</p>
            </template>
        </Suspense>
    </v-main>

    <div v-if="isSourceDisplayed" class="sources">
        <ul>
            <li><a href="https://www.youtube.com/@AlexYukiii">AlexYukii</a></li>
            <li><a href="https://www.youtube.com/@Nokapt">Nokapt</a></li>
            <li><a href="https://sephijin.fr/">Sephijin</a></li>
        </ul>
    </div>

    <v-footer>
        <div @click="isSourceDisplayed = !isSourceDisplayed" >
            Sources
        </div>
        <span>Made with love & hairballs by <a href="mailto: haelovescats@gmail.com" class="ml-1">HaeLovesCats</a></span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRouter, useRoute  } from 'vue-router'
import { useTestStore } from './stores/test'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'
import { signOut } from '@firebase/auth'

const router = useRouter()
const route = useRoute()
const store = useTestStore()
const auth = useFirebaseAuth()
const user = useCurrentUser()

let isSourceDisplayed = ref(false)

store.selectGame()

function goToList(game) {
    store.selectGame(game)
    window.localStorage.setItem('game', game)
    router.push({ name: 'characters' })
}

const isLoggedIn = computed(() => {
    return user?.value?.email || false
})

async function signOutOfFirebase() {
  signOut(auth)
    .then(() => {
      console.log('Bye bye :)')
    })
    .catch((error) => {
      console.error(error)
    })
}


watch(() => store.pageTitle, () => {
    document.title = store.pageTitle
})

</script>

<style scoped lang="scss">
header {
    line-height: 1.5;
    max-height: 100vh;
    flex-direction: column;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
