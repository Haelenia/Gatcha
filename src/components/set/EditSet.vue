<template>
    <div class="header">
        <h1>{{ getPageTitle }}</h1>
        <div class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="saveElement(currentSet)">Enregistrer</v-btn>
        </div>
    </div>
    <div>
        <div>
            <v-text-field label="Nom" v-model="currentSet.name" class="label"></v-text-field>
            <v-select v-if="store.selectedGame === 'HSR'"
                v-model="currentSet.type"
                label="Type"
                :items="['Relique des cavernes','Ornement planaire']"
            ></v-select>
            <v-select
                v-model="currentSet.dj"
                label="Donjon"
                :items="djList"
                item-title="name"
                item-value="id"
            ></v-select>
        </div>
    </div>
</template>
  
  
<script setup>
import { useTestStore } from '../../stores/test';
import { ref, watch, onUnmounted, computed } from 'vue'
import { useFirestore, useDocument, useCollection } from "vuefire";
import { collection, addDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const db = useFirestore();
const store = useTestStore()

let isEditMode = ref(false)
const currentSet = ref({ name: '', dj: null })
const initSet = ref()

let docRef = null
let setSource = null

let djRef = collection(db, 'dungeons')
let q = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(q, { ssrKey: 'justToStopWarning' })

if (route.params?.id) {
    isEditMode.value = true
    docRef = doc(db, 'sets', route.params.id)
    setSource = useDocument(docRef)
} else {
    isEditMode.value = false
}

let getPageTitle = computed(() => {
    return isEditMode.value
        ? currentSet.value.name
        : store.getSelectedGame === 'Genshin' ? 'Nouveau set d\'artefacts' : 'Nouveau set de reliques'
})

watch(() => setSource?.value, (setSource) => {
    currentSet.value = {
      ...setSource,
    }
    initSet.value = JSON.parse(JSON.stringify(currentSet.value))
})

watch(() => route.params.id, newId => {
    if (!newId) {
        clearEntity()
    }
})

onUnmounted(() => {
    clearEntity()
})

async function saveElement(element) {
    if (isEditMode.value) {
        await updateDoc(docRef, {
            ...element,
        })
    } else {
        // Add a new document with a generated id.
        await addDoc(collection(db, "sets"), {
            game: store.getSelectedGame,
            ...element
        });
    }
    router.push({ name: 'sets' })
}

function resetElement() {
    if (isEditMode.value) {
        currentSet.value = initSet.value
    } else {
        clearEntity()
    }
}

function clearEntity() {
    currentSet.value = { name: '', set: [''] }
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
  