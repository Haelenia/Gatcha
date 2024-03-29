<template>
    <v-main>
        <div class="header">
            <h1>{{`Liste des donjons (${filteredList.length})`}}</h1>
            <v-btn v-if="isLoggedIn" :to="{ name: 'dungeon-create' }"> + Nouveau</v-btn>
        </div>

        <div class="characters-list">
            <v-card class="mx-auto" v-for="dj in filteredList" :key="dj.id">
                <v-toolbar :color="getColor(dj?.region)">
                    <v-toolbar-title>{{ dj.name }}</v-toolbar-title>
                    <v-btn v-if="isLoggedIn" @click="updateDj(dj)">
                        <v-icon icon="mdi-pencil"></v-icon>
                    </v-btn>
                    <v-btn v-if="isLoggedIn" @click="deleteDj(dj)">
                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                    </v-btn>
                </v-toolbar>
        
                <v-list lines="five">
                    <v-list-item >
                        <v-list-item-title>{{ dj.typeLabel }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item >
                        <v-list-item-title>Sets disponibles</v-list-item-title>
                        <v-list-item-subtitle>
                            <div v-for="(el, index2) in dj.set" :key="index2" class="m-right16">{{ el }}</div>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
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
import { GENSHIN_DJ_TYPE } from "../../tools/constants";

const db = useFirestore()
const store = useTestStore()
const router = useRouter()
const connectedUser = useCurrentUser()

let djRef = collection(db, 'dungeons')
let q = query(djRef, where("game", "==", store.getSelectedGame))

let djList = useCollection(q, { ssrKey: 'justToStopWarning' })

const isLoggedIn = computed(() => {
    return connectedUser?.value?.email
})

const filteredList = computed(() => {
    let list = djList?.value?.map(el => {
        return {
            ...el,
            id: el.id,
            typeLabel: GENSHIN_DJ_TYPE.find(type => type.key === el.type)?.label || '-'
        }
    }) || []
    return sortByName(list) || []
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