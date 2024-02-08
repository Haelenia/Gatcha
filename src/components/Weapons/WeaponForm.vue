<template>
    <div class="header">
        <h1>{{ isEditMode ? currentWeapon.name : getSelectedGame === "HSR" ? "Nouveau cône de lumière" : 'Nouvelle arme' }}</h1>
        <div class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="saveElement(currentWeapon)">Enregistrer</v-btn>
        </div>
    </div>
    <div>
        <div>
            <v-text-field label="Nom" v-model="currentWeapon.name" class="label"></v-text-field>
            <v-checkbox v-if="isLoggedIn" label="possédé" v-model="currentWeapon.isOwned" ></v-checkbox>

            <v-select v-if="getSelectedGame !== 'HSR'"
                label="Type"
                :items="getWeapons"
                item-title="label"
                item-value="key"
                v-model="currentWeapon.type"
            ></v-select>
            <v-select v-if="getSelectedGame === 'HSR'"
                    label="Voix"
                    clearable
                    :items="getPath"
                    v-model="currentWeapon.type"
            ></v-select>
            <v-radio-group v-model="currentWeapon.stars" inline>
                <v-radio :value="5">
                    <template v-slot:label>
                        5<v-icon icon="mdi-star" class="text-yellow-darken-2"></v-icon>
                    </template>
                </v-radio>
                <v-radio :value="4">
                    <template v-slot:label>
                        4<v-icon icon="mdi-star" class="text-deep-purple-lighten-1"></v-icon>
                    </template>
                </v-radio>
                <v-radio :value="3">
                    <template v-slot:label>
                        3<v-icon icon="mdi-star" class="text-blue"></v-icon>
                    </template>
                </v-radio>
            </v-radio-group>
            <v-select
                    label="Provenance"
                    clearable
                    :items="getOrigin"
                    v-model="currentWeapon.origin"
            ></v-select>
        </div>
    </div>
</template>
  
  
<script setup>
import { useTestStore } from '../../stores/test';
import { ref, watch, onUnmounted,computed } from 'vue'
import { useFirestore, useDocument } from "vuefire";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import {  GENSHIN_WEAPON, HSR_ROLE, HSR_WEAPON_ORIGIN, GENSHIN_WEAPON_ORIGIN } from '../../tools/constants';
import { sortByKey } from '../../tools/tools';
import { useTools } from '../../composables/tools';

// global declarations
const router = useRouter()
const route = useRoute()
const db = useFirestore();
const store = useTestStore()
const { isLoggedIn } = useTools()

// db declarations
let docRef = null
let weaponSource = null

let isEditMode = ref(false)
const getSelectedGame = computed(() => store.getSelectedGame)
const getWeapons = sortByKey(GENSHIN_WEAPON)
const getPath = HSR_ROLE.sort()
const getOrigin = store.selectedGame === 'HSR' ? HSR_WEAPON_ORIGIN.sort() : GENSHIN_WEAPON_ORIGIN


// Declare and load current weapon
if (route.params?.id) {
    isEditMode.value = true
    docRef = doc(db, 'weapons', route.params.id)
    weaponSource = useDocument(docRef)
} else {
    isEditMode.value = false
}

const currentWeapon = ref({ name: null, type: null, stars: 4, isOwned: false })
const initWeapon = ref()

watch(() => weaponSource?.value, (weaponSource) => {
    currentWeapon.value = {
        ...weaponSource,
    }
    initWeapon.value = JSON.parse(JSON.stringify(currentWeapon.value))
})


// create or update a weapon in db
async function saveElement(element) {
    if (isEditMode.value) {
        // update existing document
        await updateDoc(docRef, { ...element })
    } else {
        // Add a new document with a generated id.
        await addDoc(collection(db, "weapons"), {
            game: getSelectedGame.value,
            ...element
        });
    }
    router.push({ name: 'weapons' })
}


// Clean and reset form
watch(() => route.params.id, newId => {
    if (!newId) {
        clearForm()
    }
})

onUnmounted(() => {
    clearForm()
})

function resetElement() {
    if (isEditMode.value) {
        currentWeapon.value = initWeapon.value
    } else {
        clearForm()
    }
}

function clearForm() {
    currentWeapon.value = { name: null, type: null, game: null, stars: null, isOwned: false }
}


</script>
