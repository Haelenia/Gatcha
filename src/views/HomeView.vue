<template>
    <h1>Choisis ton jeu</h1>
    <div class="choice">
        <v-btn @click="goToList('Genshin')" role="link">GENSHIN</v-btn>
        <v-btn @click="goToList('HSR')" role="link">HSR</v-btn>
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/test'

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
h1 { margin-bottom: 32px;}
.choice {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 32px;

    .v-btn {
        height: 300px;
    }
}
</style>
