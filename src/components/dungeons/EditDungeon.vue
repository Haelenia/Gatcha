<template>
    <div class="header">
        <h1>{{ isEditMode ? currentDj.name : 'Nouveau donjon' }}</h1>
        <div class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="saveElement(currentDj)">Enregistrer</v-btn>
        </div>
    </div>
    <div>
        <div>
            <v-text-field label="Nom" v-model="currentDj.name" class="label"></v-text-field>
        </div>
        <div>
            <div v-for="(s, index) in currentDj.set" :key="index" class="set-list">
                <v-text-field label="Set disponible" v-model="currentDj.set[index]" placeholder="nom du set"></v-text-field>
                <v-btn v-if="currentDj.set.length > 1" @click="removeSet(index)">-</v-btn>
            </div>


            <v-btn @click="addSet">+ Ajouter un set</v-btn>
        </div>
    </div>
</template>
  
  
<script setup>
import { useTestStore } from '../../stores/test';
import { ref, watch, onUnmounted } from 'vue'
import { useFirestore, useDocument } from "vuefire";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const db = useFirestore();
const store = useTestStore()

let isEditMode = ref(false)
const currentDj = ref({ name: '', set: [''] })
const initDj = ref()

let docRef = null
let djSource = null

if (route.params?.id) {
    isEditMode.value = true
    docRef = doc(db, 'dungeons', route.params.id)
    djSource = useDocument(docRef)
    console.log('djsoure', djSource)
} else {
    isEditMode.value = false
}

watch(() => djSource?.value, (djSource) => {
    currentDj.value = {
      ...djSource,
    }
    initDj.value = JSON.parse(JSON.stringify(currentDj.value))
})

watch(() => route.params.id, newId => {
    if (!newId) {
        clearDj()
    }
})

onUnmounted(() => {
    clearDj()
})

async function saveElement(element) {
    if (isEditMode.value) {
        await updateDoc(docRef, {
            ...element,
        })
    } else {
        // Add a new document with a generated id.
        await addDoc(collection(db, "dungeons"), {
            game: store.getSelectedGame,
            ...element
        });
    }
    router.push({ name: 'dungeons' })
}

function resetElement() {
    if (isEditMode.value) {
        currentDj.value = initDj.value
    } else {
        clearDj()
    }
}

function clearDj() {
    currentDj.value = { name: '', set: [''] }
}

function addSet() {
    currentDj.value.set.push('')
}

function removeSet(index) {
    currentDj.value.set.splice(index, 1)
}

</script>
  
  
<style scoped lang="scss">

.label {
    width: 50%;
}

.set-list {
    display: flex;
    gap: 16px;
    width: 50%;
    align-items: center;
}
</style>
  