<template>
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
                        {{ role.plume }}
                    </v-list-item-subtitle>
                </v-list-item>

                <v-divider></v-divider>
            </v-list>
    
        </v-card>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, query, where, getDocs } from "firebase/firestore";



const db = useFirestore();

// const charactersList = useCollection(collection(db, 'characters', where('role', 'array-contains', 'coupe')))
let charactersList = useCollection(collection(db, 'characters'))


const filteredList = computed(() => {
    let type = 'plume'
    
    //return charactersList.value

   return charactersList.value.filter(character => {
        let test =  character.roles?.filter(r => r[type] && r[type].includes('ME')) || []
        return test.length > 0
    })
})


let data = [ { id: 1, role: [{ name: 'toto'}]}, { id:2, role: [{ name: 'titi'}]}]

console.log('test',data.filter(e => e.role.filter(r => r.name === 'toto').length > 0))

function getColor(element) {
    console.log('element', element)
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
        return 'light blue'
    }
    if (element === 'pyro') {
        return 'red'
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
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    column-gap: 16px;
    row-gap: 16px;

    .v-card { width: 100%;}
}
</style>