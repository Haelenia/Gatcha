<template>
  <div v-if="!choice" class="add">
    <div @click="setChoice('dj')">Ajouter un donjon</div>
    <div @click="setChoice('pnj')">Ajouter un personnage</div>
  </div>

  <EditDungeon v-else-if="choice === 'dj'" @cancel="setChoice(null)" @save="saveElement"></EditDungeon>
  <EditCharacters v-else-if="choice === 'pnj'" @cancel="setChoice(null)" @save="saveElement"></EditCharacters>

</template>


<script setup>
import { ref } from 'vue'
import { useFirestore } from "vuefire";
import { collection, addDoc } from "firebase/firestore";
import { useTestStore } from '../stores/test'
import router from '../router';

import EditDungeon from '@/components/EditDungeon.vue'
import EditCharacters from '../components/EditCharacters.vue';

const store = useTestStore()
const choice = ref()

function setChoice(c) {
  choice.value = c
}

const db = useFirestore();


async function saveElement(element) {
  if (choice.value === 'dj') {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "dungeons"), {
      game: store.getSelectedGame,
      ...element
    });
    router.push({ name: 'dongeons'})
    
  } else if (choice.value === 'pnj') {
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "characters"), {
      game: store.getSelectedGame,
      ...element
    });
    router.push({ name: 'characters'})
  }
}


</script>





<style scoped lang="scss">

.add {
  display: flex;
  gap: 20px;
}
.add > div {
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
