<template>
    <div class="header hsr-form">
        <h1>{{currentCharacter?.name}}</h1>
        <span>
            <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" size="x-small" :class="currentCharacter?.star === 5 ? 'text-yellow-darken-2' : 'text-deep-purple-lighten-1'"></v-icon>
            <v-icon v-if="currentCharacter?.star == 5" icon="mdi-star" size="x-small" :class="'text-yellow-darken-2'"></v-icon>
        </span>
        <span> {{ currentCharacter?.role }}</span>
        <span> {{ currentCharacter?.type }}</span> 
    </div>

²
    <div class="roles-list hsr-form read-only">
        <div v-for="(role, index) in currentCharacter.roles" :key="index" >
            <!-- Equipment Sets -->
            <v-card>
                <v-card-title>Set de reliques et d'ornements planaires recommandés</v-card-title>
                <div class="sets-content">
                    <div class="set-content">
                        <v-card-subtitle>Reliques des cavernes</v-card-subtitle>
                        <v-card-text>
                            <template  v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                <div v-if="set.type === 'relic'" class="set-line">
                                    <span>{{ `${set.nbPieces} pièces` }}</span>
                                    <span v-if="set.nbPieces === 4">{{ set.relic[0]?.name }}</span>
                                    <span v-if="set.nbPieces === 2">{{ ` ${set.relic[0]?.name} / ${set.relic[1]?.name}`}}</span>
                                    <p><i>{{ set.comment }}</i></p>
                                </div>
                            </template>
                        </v-card-text>
                    </div>  

                    <div class="set-content">
                        <v-card-subtitle>Ornement planaire</v-card-subtitle>
                        <v-card-text>
                            <template v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                <div v-if="set?.type === 'ornment'" class="set-line">
                                    <span>{{ set.ornment?.name}}</span>
                                    <p><i>{{ set.comment }}</i></p>
                                </div>
                            </template>

                        </v-card-text>
                    </div>
                </div>
            </v-card>

            <!-- Equipment Main Stat -->
            <v-card class="m-top32">
                <v-card-title> Stat par equipement </v-card-title>
                <div class="group">
                    <!-- Stat for Chest -->
                    <div class="card ">
                        <v-card-subtitle >Torse</v-card-subtitle>
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    clearable
                                    density="compact"
                                    v-model="role.torse"
                                    :disabled="!isLoggedIn"
                        ></v-select>
                        </v-card-text>
                    </div>

                    <!-- Stat for Boots-->
                    <div class="card ">
                        <v-card-subtitle>Bottes</v-card-subtitle>
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    clearable
                                    density="compact"
                                    v-model="role.botte"
                                    :disabled="!isLoggedIn"
                            ></v-select>
                        </v-card-text>
                        
                    </div>

                    <!-- Stat for Sphere -->
                    <div class="card ">
                        <v-card-subtitle>Sphère planaire</v-card-subtitle>
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                        multiple
                                        chips
                                        clearable
                                        density="compact"
                                        v-model="role.orbe"
                                        :disabled="!isLoggedIn"
                            ></v-select>
                        </v-card-text>
                    </div>

                    <!-- Stat for Cord -->
                    <div class="card ">
                        <v-card-subtitle>Corde de liaison</v-card-subtitle>
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    clearable
                                    density="compact"
                                    v-model="role.chaine"
                                    :disabled="!isLoggedIn"
                            ></v-select>
                        </v-card-text>
                        
                    </div>
                </div>
            </v-card>
            

            <!-- Substat to focus -->
            <v-card class="card  m-top32">
                <v-card-title>Substat à focus</v-card-title>
                <v-card-text>
                    <v-select :items="getStats.sort()"
                            multiple
                            chips
                            density="compact"
                            clearable
                            v-model="role.statToFocus"
                            :disabled="!isLoggedIn"
                    ></v-select>
                </v-card-text>
            </v-card>

            <div class="multiple-card-zone m-top32">
                <!-- Weapons -->
                <v-card>
                    <v-card-title>Armes</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="role.weapons" auto-grow :disabled="!isLoggedIn"></v-textarea>
                    </v-card-text>
                </v-card>
                <!-- Team -->
                <v-card>
                    <v-card-title>Team</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="role.team" auto-grow :disabled="!isLoggedIn"></v-textarea>
                    </v-card-text>
                </v-card>
                <!-- Notes -->
                <v-card>
                    <v-card-title>Notes</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="role.note" auto-grow :disabled="!isLoggedIn"></v-textarea>
                    </v-card-text>
                </v-card>
            </div>


            <v-btn v-if="currentCharacter.roles.length > 1 && isLoggedIn" @click="removeRole(index)">
                <v-icon icon="mdi-trash-can-outline"></v-icon>
            </v-btn>
        </div>

    </div>
    <v-btn v-if="isLoggedIn" @click="addRole">+ Ajouter un rôle</v-btn>
</template>


<script setup>
import { ref, watch, computed } from "vue"
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection, useCurrentUser } from "vuefire"
import { collection, where, query } from "firebase/firestore"
import { sortByName } from '../../../tools/tools'
import { HSR_ATTRIBUTES, HSR_ELEMENT, HSR_ROLE } from '../../../tools/constants'

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])


const db = useFirestore()
const store = useTestStore()
const connectedUser = useCurrentUser()

const initCharacter = ref()

const relicSet = { relic: [],  comment: null, type: 'relic', nbPieces: 4 }
const ornmentSet = { ornment: null, comment: null, type: 'ornment',  }
const role = {
    set: [JSON.parse(JSON.stringify(relicSet)), JSON.parse(JSON.stringify(ornmentSet))],
    statToFocus: null,
    torse: null,
    botte: null,
    orbe: [],
    chaine: [],
    note: null,
    team:null,
    weapon: null
}

const currentCharacter = ref({
    completed: false,
    isUpdated: false,
    isOwned: false,
    name: '',
    role: null,
    type: null,
    star: 4,
    roles: [
        JSON.parse(JSON.stringify(role))
    ]
})

// Sets of relique list
let setRef = collection(db, 'sets')
let q2 = query(setRef, where("game", "==", store.getSelectedGame))
let setList = useCollection(q2, { ssrKey: 'justToStopWarning' })

let getStats = HSR_ATTRIBUTES
let getRoles = HSR_ROLE
let getElement = HSR_ELEMENT

const isLoggedIn = computed(() => {
    return connectedUser?.value?.email
})

const relicSetList = computed(() => {
    return sortByName(setList.value.filter(e => e.type === 'Relique des cavernes'))
})

function addRole() {
    currentCharacter.value.roles.push(JSON.parse(JSON.stringify(role)))
}

function removeRole(index) {
    currentCharacter.value.roles.splice(index, 1)
}

function addElement(type, roleIndex, setType) {
    if (type === 'set') {
        if (!setType) {
            currentCharacter.value.roles[roleIndex][type].push({armor: '', jewel: ''})
        } else {
            const set = setType === 'relic' ? relicSet : ornmentSet
            currentCharacter.value.roles[roleIndex][type].push(JSON.parse(JSON.stringify(set)))
        }
    } else {
        currentCharacter.value.roles[roleIndex][type].push('')
    }
}

function removeElement(type, roleIndex, index) {
    currentCharacter.value.roles[roleIndex][type].splice(index, 1)
}

function clearForm() {
    currentCharacter.value = {
        completed: false,
        isUpdated: false,
        name: '',
        role: '',
        type: '',
        star: 4,
        roles: [
            JSON.parse(JSON.stringify(role))
        ]
    }
}

function resetElement() {
    if (props.isEditMode) {
        currentCharacter.value = initCharacter.value
    } else {
        clearForm()
    }
}

function itemProps (item) {
    return {
        title: item.name,
        value: {
            id: item.id,
            name: item.name,
            dj: item.dj
        }
    }
}

watch(() => props.source, (characterSource) => {
    currentCharacter.value = {
      ...characterSource,
    }
    initCharacter.value = JSON.parse(JSON.stringify(currentCharacter.value))
})



</script>







<style scoped lang="scss">





.label {
    width: 50%;
}


#app main .roles-list .group {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

</style>
