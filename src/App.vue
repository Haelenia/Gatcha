<template>
    <header class="main-header">
        <nav>
            <RouterLink v-if="store.getSelectedGame" to="/">Home</RouterLink>
            <RouterLink v-if="store.getSelectedGame" to="/characters">Liste des personnages</RouterLink>
            <RouterLink v-if="store.getSelectedGame" :to="{ name: 'character-create'}">Ajouter un personnage</RouterLink>
            <RouterLink v-if="store.getSelectedGame" :to="{ name: 'dungeons'}">Listes des donjons</RouterLink>
            <RouterLink v-if="store.getSelectedGame" :to="{ name: 'dungeon-create'}">Ajouter un donjon</RouterLink>
            <RouterLink v-if="store.getSelectedGame"
                :to="{ name: 'sets'}">{{ `Listes des sets ${store.getSelectedGame === 'Genshin' ? 'd`\'artefacts' : 'de reliques'}`}}</RouterLink>
            <RouterLink v-if="store.getSelectedGame"
                :to="{ name: 'set-create'}">{{ `Ajouter un set ${store.getSelectedGame === 'Genshin' ? 'd`\'artefacts' : 'de reliques'}`}}</RouterLink>
            <span>{{ store.selectedGame }}</span>
            <div class="action">
                <v-btn @click="goToList('Genshin')">Genshin</v-btn>
                <v-btn @click="goToList('HSR')">HSR</v-btn>
            </div>
            
        </nav>
    </header>

    /<main>
        <RouterView />
    </main>

    
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import { useTestStore } from './stores/test'

const router = useRouter()
const store = useTestStore()

store.selectGame()

function goToList(game) {
    store.selectGame(game)
    window.localStorage.setItem('game', game)
    router.push({ name: 'characters' })
}


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

nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    span {
        margin-left: 32px;   
    }
    .action {
        display: inline-block;
        float: right;
        .v-btn {
            margin-right: 32px;
        }
    }
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
    border: 0;
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

    nav {
        text-align: left;
        margin-left: -1rem;
        font-size: 1rem;

        padding: 1rem 0;
        margin-top: 1rem;
    }
}
</style>
