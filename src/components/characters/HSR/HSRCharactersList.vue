<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'character-create'}"> + Nouveau</v-btn>
    </div>
    
    <!-- Filters zone -->
    <div class="filters-bloc">
        <div class="filters-bloc__input">
            <v-select
                label="Relique"
                :items="sortByName(setList)"
                :item-props="itemProps"
                v-model="filter.set"
                ></v-select>
            <v-select
                label="Equipement"
                :items="getEquipment.sort()"
                item-title="label"
                item-value="key"
                v-model="filter.type"
                ></v-select>
            <v-select
                label="Stat"
                :items="getStats.sort()"
                v-model="filter.stat"
                ></v-select>
            
            <v-select
                label="Donjon"
                :items="sortByName(djList)"
                :item-props="itemProps"
                v-model="filter.dj"
                ></v-select>
        </div>
        <div class="filters-bloc__action">
            <v-btn @click="clearFilter">Reset</v-btn>
            <v-btn @click="reduceCard"><v-icon icon="mdi-apps"></v-icon></v-btn>
            
        </div>
    </div>
    
    <!-- Content Zone -->
    <div class="characters-list" :class="{ 'mini': isReduced }">
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id" >
            <v-toolbar :color="getColor(character?.type?.toLowerCase())">
                <v-toolbar-title>
                    <span>{{ character.name }}</span>
                    <template v-if="character.star">
                        <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" :class="character.star == 5 ? 'text-yellow-darken-2' : 'text-deep-purple-lighten-1' "></v-icon>
                        <v-icon v-if="character.star == 5" icon="mdi-star" :class="'text-yellow-darken-2'"></v-icon>
                    </template>
                </v-toolbar-title>
                <v-icon v-if="!character.isUpdated" icon="mdi-alert-circle"></v-icon>
                <v-btn @click="updateCharacter(character)">
                    <v-icon icon="mdi-pencil"></v-icon>
                </v-btn>
                <v-btn @click="deleteCharacter(character)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                 </v-btn>
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ character.role }}</v-list-subheader>
        
                
                <!-- Recommanded Sets of relic -->
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle class="long-item">
                        <div v-for="(el, index2) in role.set" :key="index2" class="m-right16">
                            <span :class="{ 'toto' : surligne.includes(el.relic?.name)}">{{ el.relic?.name }}</span>
                            <span> / </span>
                            <span :class="{ 'toto' : surligne.includes(el.ornment?.name)}">{{ el.ornment?.name }}</span>
                        </div>
                    </v-list-item-subtitle>
                </v-list-item>

                <!-- Main stat for each equipment -->
                <v-list-item>
                    <v-list-item-title>Main stat</v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="title m-right16 ">Torse</span>
                        <span v-for="(el, index2) in role.torse" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 ">Bottes</span>
                        <span v-for="(el, index2) in role.botte" :key="index2" class="m-right16" :class="{ 'toto' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 ">Sphère planaire</span>
                        <span v-for="(el, index2) in role.orbe" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 ">Corde de liaison</span>
                        <span v-for="(el, index2) in role.chaine" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <!-- Substat to focus -->
                <v-list-item>
                    <v-list-item-title>Substat à privilégier</v-list-item-title>
                    <v-list-item-subtitle >
                        <span v-for="(el, index2) in role.statToFocus" :key="index2"
                        class="m-right16"
                        :class="{ 'toto' : surligne.includes(el)}"
                        >{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-divider v-if="index + 1 !== character.roles.length"></v-divider>
            </v-list>
    
        </v-card>
    </div>
  </template>

<script setup>
import { ref, computed, watch, reactive } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { sortByName } from '../../../tools/tools';
import { HSR_ATTRIBUTES, HSR_EQUIPMENT } from '../../../tools/constants'

const db = useFirestore()
const store = useTestStore()
const router = useRouter()

let charactersRef = collection(db, 'characters')
let q = query(charactersRef, where("game", "==", store.getSelectedGame))
let charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })

// Dungeons list
let djRef = collection(db, 'dungeons')
let qu = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(qu, { ssrKey: 'justToStopWarning' })

// Sets of relique list
let setRef = collection(db, 'sets')
let q2 = query(setRef, where("game", "==", store.getSelectedGame))
let setList = useCollection(q2, { ssrKey: 'justToStopWarning' })

let filter = reactive({ type: '', stat: '', dj: '', set: '' })

let surligne = ref([])

let getStats = HSR_ATTRIBUTES
let getEquipment = HSR_EQUIPMENT
let isReduced = ref(false)


const filteredList = computed(() => {
    const { type, stat, dj, set } = filter

    let list = charactersList.value
    // Sort by dungeon
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

    // Set + equipment
    // Set + stat
    // Set + stat + equipment
    // Stat + equipment
        

    // Sort by set of relique
    } else if (set) {
        list = charactersList.value.filter(character => {
            let roles =  character.roles?.filter(role => {
                let test2 =  role?.set?.filter(s => {
                    const selectedSetId = set.id
                    if (s?.ornment?.id === selectedSetId || s?.relic?.id === selectedSetId) {
                        if (s?.relic?.id === selectedSetId) {
                                surligne.value.push(s.armor)
                        }
                        if (s?.ornment?.id === selectedSetId) {
                            surligne.value.push(s.jewel)
                        }
                        
                        if (stat && type) {
                            let isOK = false
                            if (role[type] && role[type].includes(stat)) {
                                surligne.value.push(stat)
                                isOK = true
                            }
                            if (!role[type] && role.statToFocus.includes(stat)) {
                                surligne.value.push(stat)
                                isOK = true
                            }
                            return isOK



                        } else if (stat) {


                        } else {
                            
                            return true
                        }
                    
                    
                    
                    
                    }

                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    // Sort by main STAT
    } else if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => {
                let hasStat = r.statToFocus && r.statToFocus.includes(stat)
                if (hasStat) {
                    surligne.value.push(stat)
                }
                return hasStat
            }) || []
            return test.length > 0
        })
    // Sort by stat on a specific piece of equipment
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
    filter.type = ''
    filter.stat = ''
    filter.dj = ''
    filter.set = ''
    surligne.value = []
}

function reduceCard() {
    isReduced.value = !isReduced.value
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

watch(() => ({...filter}), (newFilter, oldFilter) =>{
    if (newFilter.dj?.name != oldFilter.dj?.name) {
        surligne.value = []
    }
    if (newFilter.set?.name != oldFilter.set?.name) {
        surligne.value = []
    }
    if (newFilter.stat != oldFilter.stat) {
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