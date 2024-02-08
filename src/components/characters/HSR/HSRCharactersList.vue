<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn v-if="isLoggedIn" :to="{ name: 'character-create'}"> + Nouveau</v-btn>
    </div>
    
    <!-- Filters zone -->
    <div class="filters-zone">
        <span class="notice">Utilisez les filtres ci-dessous pour savoir quel personnage pourrait avoir besoin de la relique ou de l'ornement planaire que vous avez, ou pour savoir si un donjon est rentable à farmer.</span>
        <div class="filters-bloc mt-2">
            <v-select
                label="Reliques et ornements"
                :items="sortByName(setList)"
                :item-props="itemProps1"
                v-model="filter.set"
                clearable
                ></v-select>
            <v-select
                label="Type d'équipement"
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

            <v-btn class="mb-5" variant="text" @click="clearFilter">Reset</v-btn>
            <v-btn class="mb-5" variant="text" @click="reduceCard"><v-icon icon="mdi-apps"></v-icon></v-btn>
        </div>
    </div>
    
    <!-- Content Zone -->
    <div class="characters-list" :class="{ 'mini': isReduced }">
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id" >
            <!-- Title zone -->
            <v-toolbar :color="getColor(character?.type?.toLowerCase())">
                <v-toolbar-title>
                    <span>{{ character.name }}</span>
                    <template v-if="character.star">
                        <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" size="x-small" :class="getStarColor(character.star, character?.type)"></v-icon>
                        <v-icon v-if="character.star == 5" icon="mdi-star" size="x-small" :class="getStarColor(5, character?.type)"></v-icon>
                    </template>
                </v-toolbar-title>
                <v-icon v-if="!character.isUpdated && isLoggedIn" icon="mdi-video-box"></v-icon>
                <v-icon v-if="!character.completed && isLoggedIn" icon="mdi-alert-circle"></v-icon>
                <router-link :to="{ name: 'character-edit', params: {id: character.id }}" class="mr-4" :class="getEyeColor(character?.type)"><v-icon icon="mdi-eye"></v-icon></router-link>
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
                                <span v-if="set.nbPieces == 4 && set.relic && set.relic[0]" :class="{ 'match-filter' : surligne.includes(set.relic[0].name)}">{{ `4p ${set.relic[0].name}` }}</span>
                                <span v-if="set.nbPieces == 2 && set.relic && set.relic[0]">
                                    <span :class="{ 'match-filter' : surligne.includes(set.relic[0].name)}">{{ `2p ${set.relic[0].name} / ` }}</span>
                                    <span :class="{ 'match-filter' : surligne.includes(set.relic[1].name)}">{{ `2p ${set.relic[1].name}` }}</span>
                                </span>
                            </li>
                        </ul>
                        <div class="underline m-top16">Ornement planaire : </div>
                        <ul>
                            <li v-for="(el, setIndex) in getOrnments(role.set)" :key="setIndex" :class="{ 'match-filter' : surligne.includes(el.ornment?.name)}">
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
                        <span v-for="(el, index2) in role.torse" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Bottes</span>
                        <span v-for="(el, index2) in role.botte" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Sphère planaire</span>
                        <span v-for="(el, index2) in role.orbe" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Corde de liaison</span>
                        <span v-for="(el, index2) in role.chaine" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <!-- Substat to focus -->
                <v-list-item>
                    <v-list-item-title>Substat à privilégier</v-list-item-title>
                    <v-list-item-subtitle >
                        <span v-for="(el, index2) in role.statToFocus" :key="index2"
                        class="m-right16"
                        :class="{ 'match-filter' : surligne.includes(el)}"
                        >{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-divider v-if="index + 1 !== character.roles.length"></v-divider>
            </v-list>
    
        </v-card>
    </div>
  </template>

<script setup>
import { ref, computed, watch, reactive } from "vue"
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire"
import { collection, where, query, deleteDoc, doc } from "firebase/firestore"
import { sortByName, copy } from '../../../tools/tools'
import { useTools } from '../../../composables/tools';
import { HSR_ATTRIBUTES, HSR_EQUIPMENT } from '../../../tools/constants'

const db = useFirestore()
const store = useTestStore()
const { isLoggedIn } = useTools()


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

const filteredList = computed(() => {
    const { type, stat, dj, set, owned, fourstars, fivestars, todo, completed } = filter

    let list = charactersList.value
    if (owned) {
        list = list.filter(el => el.isOwned === true)
    }
    if (fourstars && !fivestars) {
        list = list.filter(el => el.star == 4)
    } else if (fivestars && !fourstars) {
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
                    let matchedRelic = s.relic?.length && s.relic.filter(el => el.dj == chosenDjId) || []
                    if (matchedRelic.length) {
                        matchedRelic.forEach(rel => {
                            surligne.value.push(rel.name)
                        })
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
                    let matchedRelic = s.relic?.length && s.relic.filter(el => el.id === selectedSetId) || []
                    if (isOrnment) {
                        surligne.value.push(s.ornment.name)
                        return true
                    } else if (matchedRelic.length) {
                        matchedRelic.forEach(rel => {
                            surligne.value.push(rel.name)
                        })
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
        return 'teal'
    }
}

function getStarColor(nbStars, element) {
    if (nbStars ===  5) {
        if ([ 'Imaginaire'].includes(element)) return 'text-yellow-darken-4';
        if ([ 'Glace'].includes(element)) return 'text-amber-darken-4';
        return 'text-yellow-darken-2'
    } else if (nbStars === 4) {
        if (['Foudre'].includes(element)) return 'text-deep-purple-lighten-3';
        if (['Physique', 'Quantique'].includes(element)) return 'text-deep-purple-lighten-2';
        if (['Feu', 'Vent', 'Glace, '].includes(element)) return 'text-deep-purple-darken-1';
        return 'text-deep-purple-lighten-1'
    }
}

function getEyeColor(element) {
    if ([ 'Glace', 'Imaginaire'].includes(element)) return 'text-grey-darken-4';
    return 'text-white'
}

async function deleteCharacter(pnj) {
    // TODO ajouter une popup de confirmation...
    return
   /* await deleteDoc(doc(db, 'characters', pnj.id))
    charactersRef = collection(db, 'characters')
    q = query(charactersRef, where("game", "==", store.getSelectedGame))
    charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })*/
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
    if (newFilter?.dj?.name != oldFilter?.dj?.name) {
        surligne.value = []
    }
    if (newFilter?.set?.name != oldFilter?.set?.name) {
        surligne.value = []
    }
    if (newFilter?.stat != oldFilter?.stat) {
        surligne.value = []
    }
    
})

</script>

<style lang="scss">
#app main .characters-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

}
</style>