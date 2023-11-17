<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'character-create'}"> + Nouveau</v-btn>
    </div>
    
    <div class="filters-bloc">
        <div class="filters-bloc__input">
            <v-text-field label="Piéce d'artefact (plume, couronne...)" v-model="filter.type" class="label"></v-text-field>
            <v-text-field label="stat" v-model="filter.stat" class="label"></v-text-field>
        </div>
        <div class="filters-bloc__action">
            <v-btn @click="clearFilter">Reset</v-btn>
            
        </div>
    </div>
    
    <div class="characters-list">
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id" >
            <v-toolbar :color="getColor(character?.type?.toLowerCase())">
                <v-toolbar-title>{{ character.name }}</v-toolbar-title>
                <v-btn @click="updateCharacter(character)">
                    <v-icon icon="mdi-pencil"></v-icon>
                </v-btn>
                <v-btn @click="deleteCharacter(character)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                 </v-btn>
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ character.role }}</v-list-subheader>
        
                <v-list-item>
                    <v-list-item-title>Substat à privilégier</v-list-item-title>
                    <v-list-item-subtitle >
                        <span v-for="(el, index2) in role.statToFocus" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>
        
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle class="long-item">
                        <div v-for="(el, index2) in role.set" :key="index2" class="m-right16">{{ `${el.armor} / ${el.jewel}` }}</div>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Torse</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.torse" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Bottes</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.botte" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Sphère planaire</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.orbe" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Corde de liaison</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.chaine" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-divider v-if="index + 1 !== character.roles.length"></v-divider>
            </v-list>
    
        </v-card>
    </div>
  </template>

<script setup>
import { ref, computed } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()

let charactersRef = collection(db, 'characters')
let q = query(charactersRef, where("game", "==", store.getSelectedGame))
let charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
let filter = ref({type:'', stat: ''})

const filteredList = computed(() => {
    const { type, stat } = filter.value

    let list = charactersList.value
    
    if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        const { stat } = filter.value 
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => r.statToFocus && r.statToFocus.includes(stat)) || []
            return test.length > 0
        })
    } else if (type && stat) {
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => r[type] && r[type].includes(stat)) || []
            return test.length > 0
        })
    }
    return list && list.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }) || []
})

function clearFilter() {
    filter.value = { type: '', stat: '' }
}

function getColor(element) {
    if (element === 'imaginaire') {
        return 'yellow'
    }
    if (element === 'foudre') {
        return 'purple'
    }
    if (element === 'physique') {
        return 'gray'
    }
    if (element === 'quantique') {
        return 'deep-purple-darken-3'
    }
    if (element === 'glace') {
        return 'light-blue-accent-1'
    }
    if (element === 'feu') {
        return 'red'
    }
    if (element === 'vent') {
        return 'teal-accent-3'
    }
}

async function deleteCharacter(pnj) {
    console.log('')
    await deleteDoc(doc(db, 'characters', pnj.id))
    charactersRef = collection(db, 'characters')
    q = query(charactersRef, where("game", "==", store.getSelectedGame))
    charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function updateCharacter(pnj) {
    router.push({ name: 'character-edit', params: {id: pnj.id }})
}

/* without vueFire
const q = query(collection(db, "characters"));//, where("capital", "==", true));
const q = query(citiesRef, where("regions", "array-contains", "west_coast"));
const charactersList = ref([])
onMounted(async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        charactersList.value.push(doc.data())
    })
})*/

</script>

<style lang="scss">
.characters-list {
    .v-card { 
        .long-item {
            -webkit-line-clamp: unset;
        }
    }
}
</style>