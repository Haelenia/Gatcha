<template>
    <div class="header">
        <h1>{{`Liste des Sets (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'set-create' }"> + Nouveau</v-btn>
    </div>

    <div class="characters-list">
        <v-card class="mx-auto" v-for="set in filteredList" :key="set.id" >
            <v-toolbar :color="getColor(set?.region)">
                <v-toolbar-title>{{ set.name }}</v-toolbar-title>
                <v-btn @click="updateSet(set)">
                    <v-icon icon="mdi-pencil"></v-icon>
                </v-btn>
                <v-btn @click="deleteSet(set)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                 </v-btn>
            </v-toolbar>

            <div>{{ set.dj ? set.dj : '-' }}</div>
    
            
        </v-card>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useTestStore } from '../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query,  deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()

let setRef = collection(db, 'sets')
let q = query(setRef, where("game", "==", store.getSelectedGame))

let setList = useCollection(q, { ssrKey: 'justToStopWarning' })

const filteredList = computed(() => {
    let list = setList.value
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

async function deleteSet(set) {
    await deleteDoc(doc(db, 'sets', set.id))
    setRef = collection(db, 'sets')
    q = query(setRef, where("game", "==", store.getSelectedGame))
    setList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function updateSet(set) {
    router.push({ name: 'set-edit', params: {id: set.id }})
}

function getColor(region) {
    if (region === 'Mondstadt') {
        return 'teal-accent-3'
    }
    if (region === 'Liyue') {
        return 'orange'
    }
    if (region === 'Inazuma') {
        return 'purple'
    }
    if (region === 'Sumeru') {
        return 'green'
    }
    if (region === 'Fontaine') {
        return 'blue'
    }
}

</script>

<style lang="scss">
#app main .characters-list {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));

    .v-card { 
        width: 100%;
        .v-list-subheader {
            font-size: 1.1rem;
        }
    }
}
</style>