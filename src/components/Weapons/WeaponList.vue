<template>
    <div class="header">
        <h1>{{`Liste des armes (${filteredList.length})`}}</h1>
        <v-btn v-if="isLoggedIn" :to="{ name: 'weapon-create' }"> + Nouveau</v-btn>
    </div>

    <!-- Filters zone -->
    <div class="filters-zone">
        <div class="filters-bloc mt-2">
            <v-select
                    label="Provenance"
                    clearable
                    :items="getOrigin"
                    v-model="filter.origin"
            ></v-select>

            <v-checkbox v-if="isLoggedIn" label="possédé" v-model="filter.owned"></v-checkbox>
            <v-checkbox label="4*" v-model="filter.fourstars"></v-checkbox>
            <v-checkbox label="5*" v-model="filter.fivestars"></v-checkbox>
            
            <v-spacer></v-spacer>

            <v-btn class="mb-5" variant="text" @click="clearFilter">Reset</v-btn>
        </div>
    </div>

    <div class="characters-list">
        <v-card class="mx-auto" v-for="weapon in filteredList" :key="weapon.id">
            <v-toolbar :color="getColor(weapon?.type)">
                <v-toolbar-title>
                    <span>{{ weapon.name }}</span>
                    <template v-if="weapon.stars">
                        <v-icon v-for="(el, index) in [1,1,1]" :key=index icon="mdi-star" size="x-small" :class="getStarColor(weapon.stars, weapon?.type)"></v-icon>
                        <v-icon v-if="weapon.stars == 4 || weapon.star == 5" icon="mdi-star" size="x-small" :class="getStarColor(weapon.stars, weapon?.type)"></v-icon>
                        <v-icon v-if="weapon.stars == 5" icon="mdi-star" size="x-small" :class="getStarColor(weapon.stars, weapon?.type)"></v-icon>
                    </template>
                </v-toolbar-title>
                <router-link v-if="isLoggedIn" :to="{ name: 'weapon-edit', params: {id: weapon.id }}" class="mr-4" :class="getEyeColor(weapon?.type)"><v-icon icon="mdi-eye"></v-icon></router-link>
                <v-btn v-if="isLoggedIn" @click="deleteWeapon(weapon)">
                    <v-icon icon="mdi-trash-can-outline" class="text-white"></v-icon>
                </v-btn>
            </v-toolbar>
    
            <v-list lines="five">
                <v-list-item >
                    <v-list-item-title>{{ weapon.type }}</v-list-item-title>
                    <v-list-item-title>{{ weapon.origin }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
    </div>
</template>

<script setup>
import { computed,reactive } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query,  deleteDoc, doc } from "firebase/firestore";
import { useTestStore } from '../../stores/test'
import { sortByName, copy } from "../../tools/tools";
import { useTools } from '../../composables/tools';
import { HSR_WEAPON_ORIGIN, GENSHIN_WEAPON_ORIGIN } from "../../tools/constants";

const db = useFirestore()
const store = useTestStore()

// db declarations
let docRef = collection(db, 'weapons')
let q = query(docRef, where("game", "==", store.getSelectedGame))


const { isLoggedIn } = useTools()

let weaponList = useCollection(q, { ssrKey: 'justToStopWarning' })
const getOrigin = store.selectedGame === 'HSR'
    ? [...HSR_WEAPON_ORIGIN, 'Aucune'].sort()
    : [...GENSHIN_WEAPON_ORIGIN, 'Aucune'].sort()



const defaultFilter = { origin: null, owned: false, fourstars: false, fivestars: false }
let filter = reactive(copy(defaultFilter))

const filteredList = computed(() => {
    const { origin, owned, fourstars, fivestars } = filter

    let list = weaponList.value
    if (owned) {
        list = list.filter(el => el.isOwned === true)
    }
    if (fourstars && !fivestars) {
        list = list.filter(el => el.stars == 4)
    } else if (fivestars && !fourstars) {
        list = list.filter(el => el.stars == 5)
    } else if (fourstars && fivestars) {
        list = list.filter(el => el.stars == 5 || el.stars == 4)
    }
    if (origin) {
        if (origin === 'Aucune') {
            list = list.filter(el => !el.origin)
        } else {
            list = list.filter(el => el.origin == origin)
        }
    }
    
    return list && sortByName(list) || []
})

async function deleteWeapon(data) {
    await deleteDoc(doc(db, 'weapons', data.id))
}

function getColor(type) {
    if (type === 'Chasse') {
        return 'teal-accent-3'
    }
    if (type === 'Erudition') {
        return 'purple'
    }
    if (type === 'Destruction') {
        return 'gray'
    }
    if (type === 'Nihilité') {
        return 'deep-purple-darken-3'
    }
    if (type === 'Harmonie') {
        return 'yellow'
    }
    if (type === 'Abondance') {
        return 'green'
    }
    if (type === 'Préservation') {
        return 'light-blue-accent-1'
    }
}

function getStarColor(nbStars, element) {
    if (nbStars ===  5) {
        if ([ 'Imaginaire'].includes(element)) return 'text-yellow-darken-4';
        if ([ 'Glace'].includes(element)) return 'text-amber-darken-4';
        return 'text-yellow-darken-2'
    } else if (nbStars === 4) {
        if (['Foudre'].includes(element)) return 'text-deep-purple-lighten-3';
        if (['Physique', 'Quantique'].includes(element)) return 'text-deep-purple-lighten-2';
        if (['Feu', 'Vent', 'Glace, '].includes(element)) return 'text-deep-purple-darken-1';
        return 'text-deep-purple-lighten-1'
    } else if (nbStars === 3) {
        return 'text-blue'
    }
}

function getEyeColor(element) {
    if ([ 'Glace', 'Imaginaire'].includes(element)) return 'text-grey-darken-4';
    return 'text-white'
}

function clearFilter() {
    Object.keys(filter).forEach(key => {
         filter[key] = copy(defaultFilter)[key]
    })
}

</script>

<style lang="scss">
#app main .characters-list {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

}
</style>
