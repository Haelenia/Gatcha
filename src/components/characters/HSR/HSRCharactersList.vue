<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'character-create'}"> + Nouveau</v-btn>
    </div>
    
    <div class="filters-bloc">
        <div class="filters-bloc__input">
            <v-text-field label="Pièce de set (torse, bottes...)" v-model="filter.type" class="label"></v-text-field>
            <v-text-field label="Stat" v-model="filter.stat" class="label"></v-text-field>
            <v-select
                label="Donjon"
                :items="sortByName(djList)"
                :item-props="itemProps"
                v-model="filter.dj"
                ></v-select>
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
                        <div v-for="(el, index2) in role.set" :key="index2" class="m-right16">
                            <span :class="{ 'toto' : surligne.includes(el.armor)}">{{ el.armor }}</span>
                            <span> / </span>
                            <span :class="{ 'toto' : surligne.includes(el.jewel)}">{{ el.jewel }}</span>
                        </div>
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
import { ref, computed, watch } from "vue";
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


let djRef = collection(db, 'dungeons')
let qu = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(qu, { ssrKey: 'justToStopWarning' })

let filter = ref({type:'', stat: '', dj: ''})

let surligne = ref([])

function sortByName(list) {
    return list.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }) 
}


const filteredList = computed(() => {
    const { type, stat, dj } = filter.value

    let list = charactersList.value

    if (dj) {
        const sets = dj.set
        list = charactersList.value.filter(character => {
            let roles =  character.roles?.filter(r => {
                let test2 =  r.set && r.set.filter(s => {
                    return sets.some(el => {
                        if (el.toLowerCase().includes(s.armor.toLowerCase())) {
                            surligne.value.push(s.armor)
                        }
                        if (el.toLowerCase().includes(s.jewel.toLowerCase())) {
                            surligne.value.push(s.jewel)
                        }
                        return el.toLowerCase().includes(s.armor.toLowerCase()) || el.toLowerCase().includes(s.jewel.toLowerCase())
                    }) 
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    } else if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
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
    filter.value = { type: '', stat: '', dj: '' }
    surligne.value = []
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
    await deleteDoc(doc(db, 'characters', pnj.id))
    charactersRef = collection(db, 'characters')
    q = query(charactersRef, where("game", "==", store.getSelectedGame))
    charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function updateCharacter(pnj) {
    router.push({ name: 'character-edit', params: {id: pnj.id }})
}

function itemProps (item) {
    return {
        title: item.name
    }
}

watch(() => filter, (newFilter, oldFilter) =>{
    if (newFilter.dj?.name != oldFilter.dj?.name) {
        surligne.value = []
    }
})

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
#app main .characters-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    
    .toto {
        background-color: forestgreen;
        font-weight: bold;
    }
}
</style>