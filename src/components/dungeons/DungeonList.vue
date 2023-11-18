<template>
    <div class="header">
        <h1>{{`Liste des donjons (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'dungeon-create' }"> + Nouveau</v-btn>
    </div>

    <div class="characters-list">
        <v-card class="mx-auto" v-for="dj in filteredList" :key="dj.id" >
            <v-toolbar :color="getColor(dj?.region)">
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
                    <v-list-item-title>Sets disponibles</v-list-item-title>
                    <v-list-item-subtitle>
                        <div v-for="(el, index2) in dj.set" :key="index2" class="m-right16">{{ el }}</div>
                    </v-list-item-subtitle>
                </v-list-item>
            </v-list>
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

let djRef = collection(db, 'dungeons')
let q = query(djRef, where("game", "==", store.getSelectedGame))

let djList = useCollection(q, { ssrKey: 'justToStopWarning' })

const filteredList = computed(() => {
    let list = djList.value
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

async function deleteDj(dj) {
    await deleteDoc(doc(db, 'dungeons', dj.id))
    djRef = collection(db, 'dungeons')
    q = query(djRef, where("game", "==", store.getSelectedGame))
    djList = useCollection(q, { ssrKey: 'justToStopWarning' })
}

function updateDj(dj) {
    router.push({ name: 'dungeon-edit', params: {id: dj.id }})
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