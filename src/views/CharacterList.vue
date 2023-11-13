<template>
    <div class="header">
        <div class="filters">
            <v-text-field label="Piéce d'artefact (plume, couronne...)" v-model="filter.type" class="label"></v-text-field>
            <v-text-field label="stat" v-model="filter.stat" class="label"></v-text-field>
        </div>
        <div class="actions">
            <v-btn @click="clearFilter">Reset</v-btn>
            <v-btn :to="{ name: 'add', hash: '#pnj'}"> + Nouveau</v-btn>
        </div>
    </div>
    
    <div class="characters-list">
        <v-card class="mx-auto" v-for="character in filteredList" :key="character.id">
            <v-toolbar :color="getColor(character?.element?.toLowerCase())">
                <!-- <v-btn icon="mdi-menu"></v-btn> -->
        
                <v-toolbar-title>{{ character.name }}</v-toolbar-title>
        
                <v-spacer></v-spacer>
        
                <!-- <v-btn icon="mdi-magnify"></v-btn> -->
            </v-toolbar>
        
            <v-list lines="two" v-for="(role, index) in character.roles" :key="index">
                <v-list-subheader>{{ role.name }}</v-list-subheader>
        
                <v-list-item>
                    <v-list-item-title>Substat à privilégier</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ role.statToFocus}}
                    </v-list-item-subtitle>
                </v-list-item>
        
                <v-list-item>
                    <v-list-item-title>Set d'artefact</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ role.set }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Sablier</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ role.sablier }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Coupe</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ role.coupe }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Couronne</v-list-item-title>
                    <v-list-item-subtitle>
                        {{ role.couronne }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>
            </v-list>
    
        </v-card>
    </div>
  </template>

<script setup>
import { ref, computed } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection } from "firebase/firestore";



const db = useFirestore();

// const charactersList = useCollection(collection(db, 'characters', where('role', 'array-contains', 'coupe')))
let charactersList = useCollection(collection(db, 'characters'))
let filter = ref({type:'', stat: ''})

const filteredList = computed(() => {
    const { type, stat } = filter.value
    
    if ((stat && (!type || type === 'plume' || type === 'fleur'))) {
        const { stat } = filter.value 
        return charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => r.statToFocus && r.statToFocus.includes(stat)) || []
            return test.length > 0
        })
    } else if (type && stat) {
        return charactersList.value.filter(character => {
            let test =  character.roles?.filter(r => r[type] && r[type].includes(stat)) || []
            return test.length > 0
        })
    }
    return charactersList.value
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
        return 'cyan'
    }
    if (element === 'pyro') {
        return 'red'
    }
    if (element === 'anemo') {
        return 'light green'
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
.header {
    background-color: lightgray;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: none;
    .filters {
        display: flex;
        gap: 32px;
        .v-input {
            width: 300px;
        }
    }
    
    .actions {
        .v-btn {
            margin-left: 16px;
        }
    }
}
.characters-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    column-gap: 16px;
    row-gap: 16px;

    .v-card { width: 100%;}
}
</style>