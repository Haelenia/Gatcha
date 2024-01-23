<template>
    <div class="header hsr-form">
        <h1>{{props.isEditMode ? currentCharacter.name : 'Nouveau personnage'}}</h1>
        <div v-if="isLoggedIn" class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
        </div>
    </div>

    <div class="identity hsr-form">
        <v-text-field label="Nom" v-model="currentCharacter.name" class="label" :disabled="!isLoggedIn"></v-text-field>
        <v-select label="Voix"
                clearable
                :items="getRoles.sort()"
                v-model="currentCharacter.role"
                :disabled="!isLoggedIn"
        ></v-select>
        <v-select label="Element"
                clearable
                :items="getElement.sort()"
                v-model="currentCharacter.type"
                :disabled="!isLoggedIn"
        ></v-select>
        <v-radio-group v-model="currentCharacter.star" inline :disabled="!isLoggedIn">
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
        <v-checkbox v-if="isLoggedIn" label="video check" v-model="currentCharacter.isUpdated" :disabled="!isLoggedIn"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="complet" v-model="currentCharacter.completed" :disabled="!isLoggedIn"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="possédé" v-model="currentCharacter.isOwned" :disabled="!isLoggedIn"></v-checkbox>
    </div>

    <div class="roles-list hsr-form">
        <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">

            <!-- Equipment Sets -->
            <v-card>
                <v-card-title>Set de reliques et d'ornements planaires recommandés</v-card-title>
                <div class="sets-content">
                    <div class="set-content">
                        <v-card-subtitle>Reliques des cavernes</v-card-subtitle>
                        <v-card-text>
                            <template  v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                <div v-if="set.type === 'relic'" class="set-line">
                                    <v-radio-group v-model="set.nbPieces" inline :disabled="!isLoggedIn">
                                        <v-radio :value="4">
                                            <template v-slot:label>
                                                <span>4 pièces</span>
                                            </template>
                                        </v-radio>
                                        <v-radio :value="2">
                                            <template v-slot:label>
                                                <span>2 pièces</span>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                    <div>
                                        <v-select
                                            :items="relicSetList"
                                            :item-props="itemProps"
                                            v-model="set.relic[0]"
                                            :disabled="!isLoggedIn"
                                        ></v-select>
                                        <v-select v-if="set.nbPieces === 2"
                                            :items="sortByName(setList.filter(el => el.type === 'Relique des cavernes'))"
                                            :item-props="itemProps"
                                            v-model="set.relic[1]"
                                            :disabled="!isLoggedIn"
                                        ></v-select>
                                    </div>
                                    
                                    <v-textarea label="Notes" v-model="set.comment" rows="1" auto-grow :disabled="!isLoggedIn"></v-textarea>
                                    <v-btn v-if="role.set.length > 1 && isLoggedIn" @click="removeElement('set', index, indexRelic, set)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-card-text>
                        <v-card-actions v-if="isLoggedIn">
                            <v-btn @click="addElement('set', index, 'relic')">+ Ajouter une relique</v-btn>
                        </v-card-actions>
                    </div>  

                    <div class="set-content">
                        <v-card-subtitle>Ornement planaire</v-card-subtitle>
                        <v-card-text>
                            <template v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                <div v-if="set.type === 'ornment'" class="set-line">                                    
                                    <v-select
                                        :items="sortByName(setList.filter(el => el.type === 'Ornement planaire'))"
                                        :item-props="itemProps"
                                        v-model="set.ornment"
                                        :disabled="!isLoggedIn"
                                    ></v-select>
                                    <v-textarea label="Notes" v-model="set.comment"  rows="1" auto-grow :disabled="!isLoggedIn"></v-textarea>

                                    <v-btn v-if="role.set.length > 1 && isLoggedIn" @click="removeElement('set', index, indexRelic, set)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </template>

                        </v-card-text>
                        <v-card-actions v-if="isLoggedIn">
                            <v-btn @click="addElement('set', index, 'ornment')">+ Ajouter un ornement planaire</v-btn>
                        </v-card-actions>
                    </div>
                </div>
            </v-card>

            <!-- Equipment Main Stat -->
            <v-card class="m-top32">
                <v-card-title> Stat par equipement </v-card-title>
                <div class="group">
                    <!-- Stat for Chest -->
                    <div class="card short-text">
                        <v-card-subtitle>Torse</v-card-subtitle>
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
                    <div class="card short-text">
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
                    <div class="card short-text">
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
                    <div class="card short-text">
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
            <v-card class="card short-text m-top32">
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
