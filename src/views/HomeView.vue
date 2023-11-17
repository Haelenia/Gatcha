<template>
  <main>
    <div @click="goToList('Genshin')" role="link">GENSHIN</div>
    <div @click="goToList('HSR')" role="link">HSR</div>
  </main>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { useTestStore } from '../stores/test'

const router = useRouter()
const store = useTestStore()

store.selectGame()

function goToList(game) {
  store.selectGame(game)
  window.sessionStorage.setItem('game', game)
  router.push({name: 'characters'})
}

</script>


<style scoped lang="scss">
main {
  display: flex;
  gap: 20px;
}
main > div {
  width: 50%;
  text-align: center;
  padding: 100px;
  border-radius: 5px;
  border: 1px solid darkgray;
  box-shadow: 8px 8px 2px 1px rgba(0, 0, 255, .2);
  &:hover {
    cursor: pointer;
    border: 1px solid lightblue;
    color: lightseagreen;
    font-weight: bold;

  }
}

</style>
