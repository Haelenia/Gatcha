<template>
  <div v-if="!choice" class="add">
    <div @click="setChoice('dj')">Ajouter un donjon</div>
    <div @click="setChoice('pnj')">Ajouter un personnage</div>
  </div>
  <div v-else-if="choice === 'dj'">
    <div>
      <label for="name">Nom</label>
      <input id="name" type="text" v-model="name">
    </div>
    <div>
      <label for="sets">Sets disponibles</label>
      <ul id="sets">
        <li v-for="(s, index) in sets" :key="index">
          <input type="text" :value="s" @input="e => updateSet(e, index)" :placeholder="index">
          <button v-if="sets.length > 1" @click="removeSet(index)">-</button>
        </li>
      </ul>
      
      <button @click="addSet">+</button>

      <div>
        <label for="">results: {{ name }} - {{ sets }}</label>
      </div>
    </div>
    
  </div>
  <div v-else-if="choice === 'pnj'">
    
    pnj
  </div>
  <div v-if="choice">
    <button @click="setChoice(null)">Annuler</button>
    <button @click="saveElement">Enregistrer</button>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useFirestore, useCollection } from "vuefire";
import { collection, addDoc } from "firebase/firestore";
import { useTestStore } from '../stores/test'
import router from '../router';

const store = useTestStore()
const choice = ref()

const dj = ref({})
const name = ref('')
const sets = ref([''])

function setChoice(c) {
  choice.value = c
}

function addSet() {
  sets.value.push('')
}

function removeSet(index) {
  sets.value.splice(index, 1)
}

function updateSet(e, index) {
  console.log('e', e.target.value, index)
  sets.value[index] = e.target.value
}

const db = useFirestore();




async function saveElement() {
  // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "dungeons"), {
    game: store.getSelectedGame,
    name: name.value,
    set: sets.value
    });
    if (choice.value === 'dj') {
      router.push({ name: 'dongeons'})
    } else {
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
