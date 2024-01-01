<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'character-create' }"> + Nouveau</v-btn>
    </div>
    <div class="filters-bloc">
        <div class="filters-bloc__input">
            <v-text-field label="Piéce d'artefact (plume, couronne...)" v-model="filter.type" class="label"></v-text-field>
            <v-text-field label="stat" v-model="filter.stat" class="label"></v-text-field>
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
            <v-toolbar :color="getColor(character?.element?.toLowerCase())">
                <v-toolbar-title>{{ character.name }}</v-toolbar-title>
                <v-btn @click="updateCharacter(character)">
                    <v-icon icon="mdi-pencil"></v-icon>
                </v-btn>
                <v-btn @click="deleteCharacter(character)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                 </v-btn>
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ role.name }}</v-list-subheader>
        
                <v-list-item>
                    <v-list-item-title>Substat à privilégier</v-list-item-title>
                    <v-list-item-subtitle >
                        <span v-for="(el, index2) in role.statToFocus" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>
        
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle class="long-item">
                        <div v-for="(el, index2) in role.set"
                        :key="index2"
                        :class="{ 'toto' : surligne.includes(el)}"
                        class="m-right16">{{ el }}</div>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="small">
                    <v-list-item-title>Sablier</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.sablier" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="small">
                    <v-list-item-title>Coupe</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.coupe" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="small">
                    <v-list-item-title>Couronne</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.couronne" :key="index2" class="m-right16">{{ el }}</span>
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
import { collection, where, query,  deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()

let charactersRef = collection(db, 'characters')
let q = query(charactersRef, where("game", "==", store.getSelectedGame))

let charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
let filter = reactive({type:'', stat: '', dj: ''})
let surligne = ref([])

let djRef = collection(db, 'dungeons')
let qu = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(qu, { ssrKey: 'justToStopWarning' })

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
    const { type, stat } = filter
    let list = charactersList.value
    if (filter.dj) {
        const sets = filter.dj.set
        list = charactersList.value.filter(character => {
            let roles =  character.roles?.filter(r => {
                let test2 =  r.set && r.set.filter(s => {
                    return sets.some(el => {
                        if (el.toLowerCase().includes(s.toLowerCase())) {
                            surligne.value.push(s)
                        }
                        return el.toLowerCase().includes(s.toLowerCase())
                    }) 
                })
                return test2.length > 0
            }) || []
            return roles.length > 0
        })
    } else if ((filter.stat && (!filter.type || filter.type === 'plume' || filter.type === 'fleur'))) {
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => {
                return r.statToFocus && r.statToFocus.map(el => el.toLowerCase()).includes(stat.toLowerCase())
            }) || []
            return test.length > 0
        })
    } else if (filter.type && filter.stat) {
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r =>  {
                return r[type] && r[type].map(el => el.toLowerCase()).includes(stat.toLowerCase())
            }) || []
            return test.length > 0
        })
    }
    return list && sortByName(list) || []
})

function clearFilter() {
    filter.type = ''
    filter.stat = ''
    filter.dj = ''
    surligne.value = []
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

watch(() => (filter.dj), (newFilter, oldFilter) => {
    if (newFilter.id != oldFilter.id) {
        surligne.value = []
    }
})

</script>

<style lang="scss">
.toto {
        background-color: forestgreen;
        font-weight: bold;
    }

</style>