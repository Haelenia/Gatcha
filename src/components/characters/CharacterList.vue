<template>
    <div class="header">
        <h1>{{`Liste des personnages (${filteredList.length})`}}</h1>
        <v-btn :to="{ name: 'add', hash: '#pnj'}"> + Nouveau</v-btn>
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
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id" >
            <v-toolbar :color="getColor(character?.element?.toLowerCase())">
                <v-toolbar-title>{{ character.name }}</v-toolbar-title>
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
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.set" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Sablier</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.sablier" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Coupe</v-list-item-title>
                    <v-list-item-subtitle>
                        <span v-for="(el, index2) in role.coupe" :key="index2" class="m-right16">{{ el }}</span>
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
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
import { ref, computed } from "vue";
import { useTestStore } from '../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query } from "firebase/firestore";

const db = useFirestore()
const store = useTestStore()

let charactersRef = collection(db, 'characters')
const q = query(charactersRef, where("game", "==", store.getSelectedGame))

let charactersList = useCollection(q, { ssrKey: 'justToStopWarning' })
let filter = ref({type:'', stat: ''})

const filteredList = computed(() => {
    const { type, stat } = filter.value

    let list = charactersList.value
    
    if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        const { stat } = filter.value 
        list = charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => r.statToFocus && r.statToFocus.includes(stat)) || []
            return test.length > 0
        })
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
    filter.value = { type: '', stat: '' }
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

.characters-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    column-gap: 16px;
    row-gap: 16px;

    .v-card { 
        width: 100%;
        .v-list-subheader {
            font-size: 1.1rem;
        }
    }
}
</style>