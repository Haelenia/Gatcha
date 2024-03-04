<template>
    <v-main class="hsr-form">
        <div class="header" :class="{ 'read-only': !isLoggedIn }">
            <h1>{{props.isEditMode ? currentCharacter.name : 'Nouveau personnage'}}</h1>
            <div v-if="isLoggedIn" class="actions">
                <v-btn @click="resetElement">Annuler</v-btn>
                <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
            </div>
            <template v-else>
                <span>
                    <v-icon v-for="(el, index) in [1,1,1,1]" :key=index icon="mdi-star" size="small" :class="currentCharacter?.star === 5 ? 'text-yellow-darken-2' : 'text-deep-purple-lighten-1'"></v-icon>
                    <v-icon v-if="currentCharacter?.star == 5" icon="mdi-star" size="small" :class="'text-yellow-darken-2'"></v-icon>
                </span>
                <span class="text-h6 mr-4 ml-4 mt-1"> {{ currentCharacter?.role }}</span>
                <span class="text-h6 mt-1"> {{ currentCharacter?.type }}</span>
            </template>
        </div>

        <div v-if="isLoggedIn" class="identity">
            <v-text-field label="Nom" v-model="currentCharacter.name" class="label" ></v-text-field>
            <v-select label="Voix"
                    clearable
                    :items="getRoles.sort()"
                    v-model="currentCharacter.role"
            ></v-select>
            <v-select label="Element"
                    clearable
                    :items="getElement.sort()"
                    v-model="currentCharacter.type"
            ></v-select>
            <v-radio-group v-model="currentCharacter.star" inline>
                <v-radio :value="5">
                    <template v-slot:label>
                        <v-icon icon="mdi-star" class="text-yellow-darken-2"></v-icon>
                    </template>
                </v-radio>
                <v-radio :value="4">
                    <template v-slot:label>
                        <v-icon icon="mdi-star" class="text-deep-purple-lighten-1"></v-icon>
                    </template>
                </v-radio>
            </v-radio-group>

            <!-- For admin only, to see if profile as been updated -->
            <v-checkbox v-if="isLoggedIn" label="video check" v-model="currentCharacter.isUpdated" ></v-checkbox>
            <v-checkbox v-if="isLoggedIn" label="complet" v-model="currentCharacter.completed" ></v-checkbox>
            <v-checkbox v-if="isLoggedIn" label="possédé" v-model="currentCharacter.isOwned" ></v-checkbox>
        </div>

        <div class="roles-list" :class="{ 'read-only': !isLoggedIn }">
            <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">
                <!-- Equipment Sets -->
                <v-sheet rounded>
                    <h2 class="mb-2 v-card-title">Set de reliques et d'ornements planaires recommandés</h2>
                    <!-- <div class="sets-content ga-1"> -->
                        <div class="d-flex ga-6 justify-space-between flex-wrap">
                            <v-card min-width="600" max-width="964" flat class="flex-grow-1">
                                <v-card-subtitle class="text-subtitle-1">Reliques des cavernes</v-card-subtitle>
                                <v-card-text>
                                    <template v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                        <div v-if="set.type === 'relic'" class="set-line mb-4">
                                            <div class="set-line-radio flex-grow-0 flex-shrink-0">
                                                <v-radio-group v-model="set.nbPieces" inline :readonly="!isLoggedIn" density="comfortable">
                                                <v-radio :value="4" v-if="isLoggedIn || !isLoggedIn && set.nbPieces === 4">
                                                    <template v-slot:label>
                                                        <span>4 pièces</span>
                                                    </template>
                                                </v-radio>
                                                <v-radio :value="2" v-if="isLoggedIn || !isLoggedIn && set.nbPieces === 2">
                                                    <template v-slot:label>
                                                        <span>2 pièces</span>
                                                    </template>
                                                </v-radio>
                                            </v-radio-group>
                                            </div>
                                            
                                            <div class="set-line-select relic flex-grow-1 flex-shrink-0">
                                                <v-select
                                                    :items="relicSetList"
                                                    :item-props="itemProps"
                                                    v-model="set.relic[0]"
                                                    :readonly="!isLoggedIn"
                                                    density="comfortable"
                                                ></v-select>
                                                <v-select v-if="set.nbPieces === 2"
                                                    :items="sortByName(setList.filter(el => el.type === 'Relique des cavernes'))"
                                                    :item-props="itemProps"
                                                    v-model="set.relic[1]"
                                                    :readonly="!isLoggedIn"
                                                    density="comfortable"
                                                ></v-select>
                                            </div>
                                            
                                            <div class="set-line-textarea flex-grow-1 flex-shrink-0 relic">
                                                <v-textarea label="Notes" v-model="set.comment" rows="1" auto-grow :readonly="!isLoggedIn" density="comfortable"></v-textarea>
                                            </div>
                                            
                                            <v-btn v-if="role.set.length > 1 && isLoggedIn"
                                                class="set-line-delete flex-grow-0 flex-shrink-0"
                                                @click="removeElement('set', index, indexRelic, set)">
                                                <v-icon icon="mdi-trash-can-outline"></v-icon>
                                            </v-btn>
                                        </div>
                                    </template>
                                </v-card-text>
                                <v-card-actions v-if="isLoggedIn">
                                    <v-btn @click="addElement('set', index, 'relic')">+ Ajouter une relique</v-btn>
                                </v-card-actions>
                            </v-card>  

                            <v-card class="flex-grow-1" flat min-width="400" max-width="800">
                                <v-card-subtitle class="text-subtitle-1">Ornement planaire</v-card-subtitle>
                                <v-card-text>
                                    <template v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                        <div v-if="set.type === 'ornment'" class="set-line mb-4">
                                            <v-select class="set-line-select ornment flex-grow-1 flex-shrink-0"
                                                :items="sortByName(setList.filter(el => el.type === 'Ornement planaire'))"
                                                :item-props="itemProps"
                                                v-model="set.ornment"
                                                :readonly="!isLoggedIn"
                                                density="comfortable"
                                            ></v-select>

                                            <div class="set-line-textarea flex-grow-1 flex-shrink-0 ornment">
                                                <v-textarea label="Notes" v-model="set.comment" rows="1" auto-grow :readonly="!isLoggedIn" density="comfortable"></v-textarea>
                                            </div>

                                            <v-btn v-if="role.set.length > 1 && isLoggedIn"
                                                class="set-line-delete"
                                                @click="removeElement('set', index, indexRelic, set)">
                                                <v-icon icon="mdi-trash-can-outline"></v-icon>
                                            </v-btn>
                                        </div>
                                    </template>

                                </v-card-text>
                                <v-card-actions v-if="isLoggedIn">
                                    <v-btn @click="addElement('set', index, 'ornment')">+ Ajouter un ornement planaire</v-btn>
                                </v-card-actions>
                            </v-card>
                        </div>
                    
                    <!-- </div> -->
                </v-sheet>

                <!-- Equipment Main Stat -->
                <v-card class="m-top32">
                    <v-card-title class="mb-2"> Main stat par equipement </v-card-title>
                    <div class="group">
                        <!-- Stat for Chest -->
                        <div class="card ">
                            <v-card-subtitle>Torse</v-card-subtitle>
                            <v-card-text class="pt-1">
                                <v-select :items="getStats.sort()"
                                        multiple
                                        chips
                                        :clearable="!!isLoggedIn"
                                        density="compact"
                                        v-model="role.torse"
                                        :readonly="!isLoggedIn"
                            ></v-select>
                            </v-card-text>
                        </div>

                        <!-- Stat for Boots-->
                        <div class="card ">
                            <v-card-subtitle>Bottes</v-card-subtitle>
                            <v-card-text  class="pt-1">
                                <v-select :items="getStats.sort()"
                                        multiple
                                        chips
                                        :clearable="!!isLoggedIn"
                                        density="compact"
                                        v-model="role.botte"
                                        :readonly="!isLoggedIn"
                                ></v-select>
                            </v-card-text>
                            
                        </div>

                        <!-- Stat for Sphere -->
                        <div class="card ">
                            <v-card-subtitle>Sphère planaire</v-card-subtitle>
                            <v-card-text  class="pt-1">
                                <v-select :items="getStats.sort()"
                                            multiple
                                            chips
                                            :clearable="!!isLoggedIn"
                                            density="compact"
                                            v-model="role.orbe"
                                            :readonly="!isLoggedIn"
                                ></v-select>
                            </v-card-text>
                        </div>

                        <!-- Stat for Cord -->
                        <div class="card">
                            <v-card-subtitle>Corde de liaison</v-card-subtitle>
                            <v-card-text class="pt-1">
                                <v-select :items="getStats.sort()"
                                        multiple
                                        chips
                                        :clearable="!!isLoggedIn"
                                        density="compact"
                                        v-model="role.chaine"
                                        :readonly="!isLoggedIn"
                                ></v-select>
                            </v-card-text>
                        </div>
                    </div>
                </v-card>
                

                <!-- Substat to focus and Trace priority-->
                <div class="m-top32 d-flex flex-wrap ga-8">
                    <v-card class="card  flex-grow-1">
                        <v-card-title class="mb-2">Substat à focus</v-card-title>
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    density="compact"
                                    :clearable="!!isLoggedIn"
                                    v-model="role.statToFocus"
                                    :readonly="!isLoggedIn"
                            ></v-select>
                        </v-card-text>
                    </v-card>
                    <v-card class="card  flex-grow-1">
                        <v-card-title class="mb-2">Objectif de stat</v-card-title>
                        <v-card-text>
                            <v-textarea v-model="role.obj" rows="1" auto-grow :readonly="!isLoggedIn" density="compact"></v-textarea>
                        </v-card-text>
                    </v-card>
                    <v-card class="card  flex-grow-1">
                        <v-card-title class="mb-2">Ordre de priorité des traces</v-card-title>
                        <v-card-text>
                            <v-textarea v-model="role.priority" rows="1" auto-grow :readonly="!isLoggedIn" density="compact"></v-textarea>
                        </v-card-text>
                    </v-card>
                </div>
                

                <div class="d-flex flex-wrap ga-8 m-top32">
                    <!-- Weapons -->
                    <v-card class="flex-grow-1" max-width="45%" min-width="800px">
                        <v-card-title class="mb-2">Cônes de lumière</v-card-title>
                        <v-card-text v-if="typeof role.weapons === 'string'">
                            <v-textarea v-model="role.weapons" auto-grow :readonly="!isLoggedIn"></v-textarea>
                        </v-card-text>
                        <v-card-text v-else class="weapon-content">
                                <template v-for="(weapon, indexW) in role.weapons" :key="indexW">
                                    <div class="weapon-line mb-4">
                                        <v-select
                                            :items="sortByName(getWeaponList)"
                                            :item-props="itemPropsWeapon"
                                            v-model="weapon.data"
                                            :readonly="!isLoggedIn"
                                            density="compact"
                                        ></v-select>
                                        <v-textarea label="Notes" density="compact" v-model="weapon.comment"  rows="1" auto-grow :readonly="!isLoggedIn"></v-textarea>

                                        <v-btn v-if="role.weapons.length > 1 && isLoggedIn" @click="removeElement('weapons', index, indexW, weapon)">
                                            <v-icon icon="mdi-trash-can-outline"></v-icon>
                                        </v-btn>
                                    </div>
                                </template>

                            </v-card-text>
                            <v-card-actions v-if="isLoggedIn">
                                <v-btn @click="addElement('weapons', index)">+ Ajouter un cône de lumière</v-btn>
                            </v-card-actions>
                        
                    </v-card>
                    <!-- Team -->
                    <v-card class="flex-grow-1">
                        <v-card-title class="mb-2">Team</v-card-title>
                        <v-card-text>
                            <v-textarea v-model="role.team" auto-grow :readonly="!isLoggedIn" density="compact"></v-textarea>
                        </v-card-text>
                    </v-card>
                    <!-- Notes -->
                    <v-card class="flex-grow-1">
                        <v-card-title class="mb-2">Notes</v-card-title>
                        <v-card-text>
                            <v-textarea v-model="role.note" auto-grow :readonly="!isLoggedIn" density="compact"></v-textarea>
                        </v-card-text>
                    </v-card>
                </div>


                <v-btn v-if="currentCharacter.roles.length > 1 && isLoggedIn" @click="removeRole(index)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                </v-btn>
            </div>

        </div>
        <v-btn v-show="false" v-if="isLoggedIn" @click="addRole">+ Ajouter un rôle</v-btn>
    </v-main>
</template>


<script setup>
import { ref, watch, computed, watchEffect } from "vue"
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire"
import { collection, where, query } from "firebase/firestore"
import { sortByName, copy } from '../../../tools/tools'
import { HSR_ATTRIBUTES, HSR_ELEMENT, HSR_ROLE } from '../../../tools/constants'
import { useTools } from '../../../composables/tools';


// Global declaration
const db = useFirestore()
const store = useTestStore()
const { isLoggedIn } = useTools()

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])

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

// list of weapons
let weaponRef = collection(db, 'weapons')
let qW = query(weaponRef, where("game", "==", store.getSelectedGame))
let getWeaponList = useCollection(qW, { ssrKey: 'justToStopWarning' })

if (getWeaponList && currentCharacter.value.role) {
    getWeaponList.value = getWeaponList.value.filter(el => el.type === currentCharacter.value.role)
}

let getStats = HSR_ATTRIBUTES
let getRoles = HSR_ROLE
let getElement = HSR_ELEMENT


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
    } else if (type === 'weapons') {
        currentCharacter.value.roles[roleIndex][type]
            ? currentCharacter.value.roles[roleIndex][type].push({ data: null, comment: null})
            : (currentCharacter.value.roles[roleIndex][type] = [{ data: null, comment: null }])
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

function itemPropsWeapon (item) {
    return {
        title: `${item.name} ${item.stars}* - ${item.origin}`,
        value: {
            id: item.id,
            name: item.name
        }
    }
}

watch(() => props.source, (characterSource) => {
    currentCharacter.value = {
      ...characterSource,
    }
    initCharacter.value = JSON.parse(JSON.stringify(currentCharacter.value))
    if (currentCharacter.value.name ) {
        store.pageTitle = `${store.selectedGame} - ${currentCharacter.value.name}`
    }
})

watchEffect(() => {
    if (currentCharacter.value.name ) store.pageTitle = `${store.selectedGame} - ${currentCharacter.value.name}` 
})



watch(() => currentCharacter.value.role, role => {
    if (role) {
        getWeaponList.value = getWeaponList.value.filter(el => el.type === role)
    }
})

</script>

<style scoped lang="scss">
.label {
    width: 50%;
}




</style>
