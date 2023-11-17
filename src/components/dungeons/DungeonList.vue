<template>
    <div class="header">
        <h1>{{`Liste des donjons (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'dungeon-create' }"> + Nouveau</v-btn>
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
        <v-card class="mx-auto" v-for="dj in filteredList" :key="dj.id" >
            <v-toolbar>
                <v-toolbar-title>{{ dj.name }}</v-toolbar-title>
                <v-btn @click="updateDj(dj)">
                    <v-icon icon="mdi-pencil"></v-icon>
                </v-btn>
                <v-btn @click="deleteDj(dj)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                 </v-btn>
            </v-toolbar>
    
            <v-list lines="five">
                <v-list-item >
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle>
                        <div v-for="(el, index2) in dj.set" :key="index2" class="m-right16">{{ el }}</div>
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>


    
        </v-card>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTestStore } from '../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query,  deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()

let djRef = collection(db, 'dungeons')
let q = query(djRef, where("game", "==", store.getSelectedGame))

let djList = useCollection(q, { ssrKey: 'justToStopWarning' })

let filter = ref({type:'', stat: ''})

const filteredList = computed(() => {
    const { type, stat } = filter.value

    let list = djList.value
    
    if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        const { stat } = filter.value 
        list = djList.value.filter(character => {
            let test =  character.roles?.filter(r => r.statToFocus && r.statToFocus.includes(stat)) || []
            return test.length > 0
        })
    } else if (type && stat) {
        list = djList.value.filter(character => {
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

async function deleteDj(dj) {
    await deleteDoc(doc(db, 'dungeons', dj.id))
    djRef = collection(db, 'dungeons')
    q = query(djRef, where("game", "==", store.getSelectedGame))
    djList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function updateDj(dj) {
    console.log('dj', dj)
    router.push({ name: 'dungeon-edit', params: {id: dj.id }})
}


</script>