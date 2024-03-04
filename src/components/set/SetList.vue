<template>
    <v-main>
        <div class="header">
            <h1>{{`Liste des Sets (${filteredList.length})`}}</h1>
            <v-btn v-if="isLoggedIn" :to="{ name: 'set-create' }"> + Nouveau</v-btn>
        </div>

        <div class="characters-list">
            <v-card class="mx-auto" v-for="set in filteredList" :key="set.id" >
                <v-toolbar :color="getColor(set.region)">
                    <v-toolbar-title>{{ set.name }}</v-toolbar-title>
                    <v-btn v-if="isLoggedIn" @click="updateSet(set)">
                        <v-icon icon="mdi-pencil"></v-icon>
                    </v-btn>
                    <v-btn v-if="isLoggedIn" @click="deleteSet(set)">
                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                    </v-btn>
                </v-toolbar>

                <div>{{ set.djName }}</div>

                <!-- ornement planaire ou relique des cavernes-->
                <div v-if="store.selectGame === 'HSR'">{{ set.djType }}</div>
        
                
            </v-card>
        </div>
    </v-main>
</template>

<script setup>
import { computed } from "vue";
import { useTestStore } from '../../stores/test'
import { useFirestore, useCollection, useCurrentUser } from "vuefire";
import { collection, where, query,  deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { sortByName } from "../../tools/tools";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()
const connectedUser = useCurrentUser()


let setRef = collection(db, 'sets')
let q = query(setRef, where("game", "==", store.getSelectedGame))
let setList = useCollection(q, { ssrKey: 'justToStopWarning' })

let djRef = collection(db, 'dungeons')
let djquery = query(djRef, where("game", "==", store.getSelectedGame))
let djList = useCollection(djquery, { ssrKey: 'justToStopWarning' })

const isLoggedIn = computed(() => {
    return connectedUser?.value?.email
})

const filteredList = computed(() => {
    let list = setList.value.map(el => {
        let dj = djList.value.find(dj => dj.id === el.dj)
        return {
            ...el,
            id: el.id,
            djName: dj?.name || '-',
            djType: dj?.type || '-'
        }
    })
    return sortByName(list) || []
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