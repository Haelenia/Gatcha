<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn v-if="isLoggedIn" :to="{ name: 'character-create'}"> + Nouveau</v-btn>
    </div>
    
    <!-- Filters zone -->
    <div class="filters-bloc">
        <v-select
            label="Relique"
            :items="sortByName(setList)"
            :item-props="itemProps1"
            v-model="filter.set"
            clearable
            ></v-select>
        <v-select
            label="Equipement"
            :items="getEquipment.sort()"
            item-title="label"
            item-value="key"
            v-model="filter.type"
            clearable
            ></v-select>
        <v-select
            label="Stat"
            :items="getStats.sort()"
            v-model="filter.stat"
            clearable
            ></v-select>
        
        <v-select
            label="Donjon"
            :items="sortByName(djList)"
            :item-props="itemProps2"
            v-model="filter.dj"
            clearable
            ></v-select>

        <v-checkbox v-if="isLoggedIn" label="owned" v-model="filter.owned"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="video a check" v-model="filter.todo"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="incomplet" v-model="filter.completed"></v-checkbox>
        <v-checkbox label="4*" v-model="filter.fourstars"></v-checkbox>
        <v-checkbox label="5*" v-model="filter.fivestars"></v-checkbox>
        
        <v-spacer></v-spacer>

        <v-btn variant="text" @click="clearFilter">Reset</v-btn>
        <v-btn variant="text" @click="reduceCard"><v-icon icon="mdi-apps"></v-icon></v-btn>
    </div>
    
    <!-- Content Zone -->
    <div class="characters-list" :class="{ 'mini': isReduced }">
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id" >
            <!-- Title zone -->
            <v-toolbar :color="getColor(character?.type?.toLowerCase())">
                <v-toolbar-title>
                    <span>{{ character.name }}</span>
                    <template v-if="character.star">
                        <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" :class="character.star == 5 ? 'text-yellow-darken-2' : 'text-deep-purple-lighten-1' "></v-icon>
                        <v-icon v-if="character.star == 5" icon="mdi-star" :class="'text-yellow-darken-2'"></v-icon>
                    </template>
                </v-toolbar-title>
                <v-icon v-if="!character.isUpdated && isLoggedIn" icon="mdi-video-box"></v-icon>
                <v-icon v-if="!character.completed && isLoggedIn" icon="mdi-alert-circle"></v-icon>
                <router-link :to="{ name: 'character-edit', params: {id: character.id }}" class="mr-4 text-white"><v-icon icon="mdi-eye"></v-icon></router-link>
                <v-btn v-if="isLoggedIn" @click="deleteCharacter(character)">
                    <v-icon icon="mdi-trash-can-outline" class="text-white"></v-icon>
                 </v-btn>
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ character.role }}</v-list-subheader>
                
                <!-- Recommanded Sets of relic -->
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle class="long-item">
                        <div class="underline">Relique des cavernes :</div>
                        <ul>
                            <li v-for="(set, setIndex) in getRelics(role.set)" :key="setIndex">
                                <span v-if="set.nbPieces == 4 && set.relic && set.relic[0]" :class="{ 'toto' : surligne.includes(set.relic[0].name)}">{{ `4p ${set.relic[0].name}` }}</span>
                                <span v-if="set.nbPieces == 2 && set.relic && set.relic[0]" :class="{ 'toto' : surligne.includes(set.relic[0].name) || surligne.includes(set.relic[1].name)}">{{ `2p ${set.relic[0].name} / 2p ${set.relic[1].name}` }}</span>
                            </li>
                        </ul>
                        <div class="underline m-top16">Ornement planaire : </div>
                        <ul>
                            <li v-for="(el, setIndex) in getOrnments(role.set)" :key="setIndex" :class="{ 'toto' : surligne.includes(el.ornment?.name)}">
                                {{ el.ornment?.name }}
                            </li>
                        </ul>
                    </v-list-item-subtitle>
                </v-list-item>

                <!-- Main stat for each equipment -->
                <v-list-item>
                    <v-list-item-title>Main stat</v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Torse</span>
                        <span v-for="(el, index2) in role.torse" :key="index2" class="m-right16" :class="{ 'toto' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Bottes</span>
                        <span v-for="(el, index2) in role.botte" :key="index2" class="m-right16" :class="{ 'toto' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Sphère planaire</span>
                        <span v-for="(el, index2) in role.orbe" :key="index2" class="m-right16" :class="{ 'toto' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Corde de liaison</span>
                        <span v-for="(el, index2) in role.chaine" :key="index2" class="m-right16" :class="{ 'toto' : surligne.includes(el)}">{{ el }}</span>
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
import { useFirestore, useCollection, useCurrentUser } from "vuefire";
import { collection, where, query, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { sortByName, copy } from '../../../tools/tools';
import { HSR_ATTRIBUTES, HSR_EQUIPMENT } from '../../../tools/constants'

const db = useFirestore()
const store = useTestStore()
const router = useRouter()
const connectedUser = useCurrentUser()

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

const defaultFilter = { type: null, stat: null, dj: null, set: null, owned: false, fourstars: false, fivestars: false, todo: false, completed: false }
let filter = reactive(copy(defaultFilter))

let surligne = ref([])

let getStats = HSR_ATTRIBUTES
let getEquipment = HSR_EQUIPMENT
let isReduced = ref(false)

const isLoggedIn = computed(() => {
    return connectedUser?.email
})

const filteredList = computed(() => {
    const { type, stat, dj, set, owned, fourstars, fivestars, todo, completed } = filter

    let list = charactersList.value
    if (owned) {
        list = list.filter(el => el.isOwned === true)
    }
    if (fourstars) {
        list = list.filter(el => el.star == 4)
    }
    if (fivestars) {
        list = list.filter(el => el.star == 5)
    }
    if (todo) {
        list = list.filter(el => !el.isUpdated)
    }
    if (completed) {
        list = list.filter(el => !el.completed)
    }
    // Sort by dungeon
    if (dj) {
        const chosenDjId = dj.id
        list = list.filter(character => {
            let roles =  character.roles?.filter(r => {
                let test2 =  r.set && r.set.filter(s => {
                    if (s.relic?.length && s.relic.some(el => el.dj == chosenDjId)) {
                        surligne.value.push(s.relic)
                        return true
                    }
                    if (s.ornment && s.ornment.dj == chosenDjId) {
                        surligne.value.push(s.ornment.name)
                        return true
                    }
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    }
    // Sort by set of relique
    if (set) {
        const selectedSetId = set.id
        list = list.filter(character => {
            let roles =  character.roles?.filter(role => {
                let test2 =  role?.set?.filter(s => {
                    const isOrnment = s?.ornment?.id === selectedSetId
                    const isRelic = s.relic?.length && s?.relic?.some(el => el.id === selectedSetId) || false
                    if (isOrnment) {
                        surligne.value.push(s.ornment.name)
                        return true
                    } else if (isRelic) {
                        surligne.value.push(isRelic.name)
                        return true
                    }
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    }
    // Sort by main stat and type
    if (stat && type) {
        list = list.filter(character => {
            let roles =  character.roles?.filter(role => {
                console.log('role', copy(role))
                let isOK = false
                if (role[type] && role[type].includes(stat)) {
                    console.log('1')
                    surligne.value.push(stat)
                    isOK = true
                }
                if (!role[type] && role.statToFocus.includes(stat)) {
                    console.log('2')
                    surligne.value.push(stat)
                    isOK = true
                }
                return isOK
            }) || []
            return roles.length > 0
        })
    }
    // Sort by main STAT
    if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        list = list.filter(character => {
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
        list = list.filter(character => {
            let test =  character.roles?.filter(r => r[type] && r[type].includes(stat)) || []
            return test.length > 0
        })
    }
    return list && sortByName(list) || []
})

function clearFilter() {
    //filter.type = ''
    //filter.stat = ''
    //filter.dj = ''
    //filter.set = ''
    surligne.value = []
    Object.keys(filter).forEach(key => {
         filter[key] = copy(defaultFilter)[key]
    })
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
    // TODO ajouter une popup de confirmation...
    return
    await deleteDoc(doc(db, 'characters', pnj.id))
    charactersRef = collection(db, 'characters')
    q = query(charactersRef, where("game", "==", store.getSelectedGame))
    charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function itemProps1 (item) {
    return {
        title: item.name,
    }
}

function itemProps2 (item) {
    return {
        title: item.name,
        value: {
            id: item.id,
            name: item.name,
            set: item.set
        }
    }
}

function getRelics(set) {
    return set?.filter(el => el.type === 'relic') || []
}

function getOrnments(set) {
    return set?.filter(el => el.type === 'ornment') || []
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
        background-color: rgb(147, 63, 202);
        font-weight: bold;
        padding: 16px;
    }
}
</style>