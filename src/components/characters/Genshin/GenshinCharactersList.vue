<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn v-if="isLoggedIn" :to="{ name: 'character-create' }"> + Nouveau</v-btn>
    </div>

    <!-- Filters zone -->
    <div class="filters-zone">
        <span class="notice">Utilisez les filtres ci-dessous pour savoir quel personnage pourrait avoir besoin de l'artefact que vous avez, ou pour savoir si un donjon est rentable à farmer.</span>
        <div class="filters-bloc mt-2">
            <v-select
                label="Artefact"
                :items="sortByName(setList)"
                :item-props="itemProps1"
                v-model="filter.set"
                clearable
                ></v-select>
            <v-select
                label="Pièce d'équipement"
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
            <v-toolbar :color="getColor(character?.element?.toLowerCase())" class="card-title-zone">
                <v-toolbar-title>
                    <span>{{ character.name }}</span>
                    <template v-if="character.star">
                        <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" size="x-small" :class="getStarColor(character.star, character?.element)"></v-icon>
                        <v-icon v-if="character.star == 5" icon="mdi-star" size="x-small" :class="getStarColor(5, character?.element)"></v-icon>
                    </template>
                </v-toolbar-title>
                <v-icon v-if="!character.isUpdated" icon="mdi-video-box"></v-icon>
                <v-icon v-if="!character.completed" icon="mdi-alert-circle"></v-icon>
                <router-link :to="{ name: 'character-edit', params: {id: character.id }}" class="mr-4" :class="getEyeColor(character?.element)"><v-icon icon="mdi-eye"></v-icon></router-link>
                <v-dialog width="500">
                    <template v-slot:activator="{ props }">
                        <v-btn v-if="isLoggedIn" v-bind="props" class="ml-n3">
                            <v-icon icon="mdi-trash-can-outline" :class="getEyeColor(character?.element)"></v-icon>
                        </v-btn>
                    </template>

                    <template v-slot:default="{ isActive }">
                        <v-card title="Confirmation">
                        <v-card-text>
                            Etes vous sûr de vouloir supprimer {{ character.name }} ?
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn text="Confirmer" @click="deleteCharacter(character, isActive)"
                            ></v-btn>
                        </v-card-actions>
                        </v-card>
                    </template>
                </v-dialog>
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ role.name }}</v-list-subheader>

                <!-- Recommanded Sets of relic -->
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle class="long-item">
                        <ul>
                            <li v-for="(set, setIndex) in role.set" :key="setIndex">
                                <span v-if="set.nbPieces == 4 && set.data && set.data[0]" :class="{ 'match-filter' : surligne.includes(set.data[0].name)}">{{ `4p ${set.data[0].name}` }}</span>
                                <span v-if="set.nbPieces == 2 && set.data && set.data[0]">
                                    <span :class="{ 'match-filter' : surligne.includes(set.data[0].name)}">{{ `2p ${set.data[0].name} / ` }}</span>
                                    <span :class="{ 'match-filter' : surligne.includes(set.data[1].name)}">{{ `2p ${set.data[1].name}` }}</span>
                                </span>
                            </li>
                        </ul>
                    </v-list-item-subtitle>
                </v-list-item>

                <!-- Main stat for each equipment -->
                <v-list-item>
                    <v-list-item-title>Main stat</v-list-item-title>
                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Sablier</span>
                        <span v-for="(el, index2) in role.sablier" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Coupe</span>
                        <span v-for="(el, index2) in role.coupe" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
                    </v-list-item-subtitle>

                    <v-list-item-subtitle>
                        <span class="title m-right16 underline">Couronne</span>
                        <span v-for="(el, index2) in role.couronne" :key="index2" class="m-right16" :class="{ 'match-filter' : surligne.includes(el)}">{{ el }}</span>
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
import { reactive, ref, computed, watch } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query, deleteDoc, doc } from "firebase/firestore";
import { GENSHIN_ATTRIBUTES, GENSHIN_EQUIPMENT } from "../../../tools/constants";
import { sortByName, copy } from '../../../tools/tools';
import { useTools } from '../../../composables/tools';

const db = useFirestore()
const store = useTestStore()
const { isLoggedIn } = useTools()

let charactersRef = collection(db, 'characters')
let characterQuery

if (isLoggedIn.value) {
    characterQuery = query(charactersRef, where("game", "==", store.getSelectedGame))
} else {
    characterQuery = query(charactersRef, where("game", "==", store.getSelectedGame), where("completed", "==", true))
}
let charactersList = useCollection(characterQuery, { ssrKey: 'justToStopWarning' })

// Dungeons list
let djRef = collection(db, 'dungeons')
let qu = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(qu, { ssrKey: 'justToStopWarning' })

// Sets of artefact list
let setRef = collection(db, 'sets')
let q2 = query(setRef, where("game", "==", store.getSelectedGame))
let setList = useCollection(q2, { ssrKey: 'justToStopWarning' })

const defaultFilter = { type: null, stat: null, dj: null, set: null, owned: false, fourstars: false, fivestars: false, todo: false, completed: false }
let filter = reactive(copy(defaultFilter))

let surligne = ref([])

let getStats = GENSHIN_ATTRIBUTES
let getEquipment = GENSHIN_EQUIPMENT
let isReduced = ref(false)

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
            let roles = character.roles?.filter(r => {
                let test2 =  r.set && r.set.filter(s => {
                    if (s.data?.length && s.data.some(el => el.dj == chosenDjId)) {
                        surligne.value.push(s.data)
                        return true
                    }
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    }
    // Sort by set of artefact
    if (set) {
        const selectedSetId = set.id
        list = list.filter(character => {
            let roles =  character.roles?.filter(role => {
                let test2 =  role?.set?.filter(s => {
                    const hasSet = s.data?.length && s?.data?.some(el => el.id === selectedSetId) || false
                    if (hasSet) {
                        surligne.value.push(hasSet.name)
                        return true
                    }
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    }
    // Sort by main stat and type of equipement (boots, torso...)
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

function getColor(element) {
    if (element === 'geo') {
        return 'orange'
    }
    if (element === 'electro') {
        return 'purple'
    }
    if (element === 'dendro') {
        return 'green'
    }
    if (element === 'hydro') {
        return 'blue'
    }
    if (element === 'cryo') {
        return 'light-blue-accent-1'
    }
    if (element === 'pyro') {
        return 'red'
    }
    if (element === 'anemo') {
        return 'teal-accent-3'
    }
}

function getStarColor(nbStars, element) {
    if (nbStars ===  5) {
        if ([ 'Imaginaire'].includes(element)) return 'text-yellow-darken-4';
        if ([ 'Cryo'].includes(element)) return 'text-amber-darken-4';
        return 'text-yellow-darken-2'
    } else if (nbStars === 4) {
        if (['Electro'].includes(element)) return 'text-deep-purple-lighten-3';
        if (['Physique', 'Quantique'].includes(element)) return 'text-deep-purple-lighten-2';
        if (['Pyro', 'Vent', 'Cryo, '].includes(element)) return 'text-deep-purple-darken-1';
        return 'text-deep-purple-lighten-1'
    }
}

function getEyeColor(element) {
    if ([ 'Cryo', 'Geo', 'Anemo'].includes(element)) return 'text-grey-darken-4';
    return 'text-white'
}

function reduceCard() {
    isReduced.value = !isReduced.value
}

async function deleteCharacter(pnj, isActive) {
    console.log('deleteCharacter', pnj, pnj.value)
    // let toto = copy(charactersList.value)
    // let index = toto.findIndex(el => el.id === pnj.id)
    // toto.splice(index, 1)
    // console.log('toto', toto)
    // charactersList.value = toto
    await deleteDoc(doc(db, 'characters', pnj.id))
    return isActive.value = false
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

watch(() => (filter.dj), (newFilter, oldFilter) => {
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


</script>

<style lang="scss">
.toto {
        background-color: forestgreen;
        font-weight: bold;
        padding: 16px;
    }

</style>