<template>
    <div class="header genshin-form" :class="{ 'read-only': !isLoggedIn }">
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
            <span class="text-h6 mr-4 ml-4 mt-1"> {{ currentCharacter?.element }}</span>
            <span class="text-h6 mt-1"> {{ currentCharacter?.weapon }}</span>
        </template>
    </div>

    <div v-if="isLoggedIn" class="identity genshin-form">
        <v-text-field label="Nom" v-model="currentCharacter.name" class="label"></v-text-field>
        <v-select label="Element"
                :items="getElement"
                v-model="currentCharacter.element"
        ></v-select>
        <v-select label="Type d'arme"
                :items="getWeapon"
                item-title="label"
                item-value="key"
                v-model="currentCharacter.weapon"
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
        <v-checkbox label="video check" v-model="currentCharacter.isUpdated"></v-checkbox>
        <v-checkbox label="complet" v-model="currentCharacter.completed"></v-checkbox>
        <v-checkbox label="possédé" v-model="currentCharacter.isOwned"></v-checkbox>
    </div>


    <div class="roles-list genshin-form" :class="{ 'read-only': !isLoggedIn }">
        <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">
            <v-text-field label="Nom du rôle"
                v-model="role.name"
                placeholder="nom du rôle"
                :readonly="!isLoggedIn"
                class="mb-8"
            ></v-text-field>

            <!-- Equipment Sets -->
            <div class="sets-content multiple-card-zone">
                <v-card class="set-content">
                    <v-card-title>Set d'artefacts à privilégier</v-card-title>
                    <v-card-text>
                        <template v-for="(set, indexSet) in role.set" :key="indexSet">
                            <div class="set-line mb-4">
                                <v-radio-group v-model="set.nbPieces" inline :readonly="!isLoggedIn">
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
                                <div>
                                    <v-select v-if="set.data"
                                        :items="sortByName(setList)"
                                        :item-props="itemProps"
                                        v-model="set.data[0]"
                                        :readonly="!isLoggedIn"
                                    ></v-select>
                                    <v-select v-if="set.nbPieces === 2 && set.data"
                                        :items="sortByName(setList)"
                                        :item-props="itemProps"
                                        v-model="set.data[1]"
                                        :readonly="!isLoggedIn"
                                    ></v-select>
                                </div>
                                
                                <v-textarea label="Notes" v-model="set.comment" rows="1" auto-grow :readonly="!isLoggedIn"></v-textarea>
                                <v-btn v-if="isLoggedIn && role.set.length > 1" @click="removeElement('set', index, indexSet, set)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </template>
                    </v-card-text>
                    <v-card-actions v-if="isLoggedIn">
                        <v-btn @click="addElement('set', index)">+ Ajouter une relique</v-btn>
                    </v-card-actions>
                </v-card>
                <!-- Weapons -->
                <v-card>
                    <v-card-title>Armes</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="role.weapons" auto-grow :readonly="!isLoggedIn"></v-textarea>
                    </v-card-text>
                </v-card>
            </div>

            <div class="multiple-card-zone">
                <!-- Equipment Main Stat -->
                <v-card class="m-top32">
                    <v-card-title> Stat par equipement </v-card-title>
                    <div class="group">
                        <!-- Stat for Hourglass -->
                        <div class="card ">
                            <v-card-subtitle>Sablier</v-card-subtitle>
                            <v-card-text>
                                <v-select 
                                        :items="getStats"
                                        multiple
                                        chips
                                        :clearable="isLoggedIn"
                                        v-model="role.sablier"
                                        :readonly="!isLoggedIn"
                                        density="compact"
                            ></v-select>
                            </v-card-text>
                        </div>

                        <!-- Stat for Cup -->
                        <div class="card ">
                            <v-card-subtitle>Coupe</v-card-subtitle>
                            <v-card-text>
                                <v-select :items="getStats"
                                        multiple
                                        chips
                                        :clearable="isLoggedIn"
                                        v-model="role.coupe"
                                        :readonly="!isLoggedIn"
                                        density="compact"
                                ></v-select>
                            </v-card-text>
                            
                        </div>

                        <!-- Stat for Crown -->
                        <div class="card ">
                            <v-card-subtitle>Diadème</v-card-subtitle>
                            <v-card-text>
                                <v-select :items="getStats"
                                            multiple
                                            chips
                                            :clearable="isLoggedIn"
                                            v-model="role.couronne"
                                            :readonly="!isLoggedIn"
                                            density="compact"
                                ></v-select>
                            </v-card-text>
                        </div>
                    </div>
                </v-card>

                <!-- Substat to focus -->
                <v-card class="card  m-top32">
                    <v-card-title>Substat à focus</v-card-title>
                    <v-card-subtitle>Par ordre de priorité</v-card-subtitle>
                    <v-card-text>
                        <v-select :items="getStats"
                                    multiple
                                    chips
                                    :clearable="isLoggedIn"
                                    :readonly="!isLoggedIn"
                                    v-model="role.statToFocus"
                                    density="compact"
                        ></v-select>
                    </v-card-text>
                    
                </v-card>

            </div>
            
            <div class="multiple-card-zone m-top32">
                <!-- Aptitude -->
                <v-card>
                    <v-card-title>Aptitudes</v-card-title>
                    <v-card-subtitle>Ordre de priorité</v-card-subtitle>
                    <v-card-text>
                        <v-text-field density="compact" v-model="role.aptitude.priority" :readonly="!isLoggedIn" ></v-text-field>
                    </v-card-text>
                    <v-card-subtitle>Jours de farm</v-card-subtitle>
                    <v-card-text>
                        <v-select multiple
                                chips
                                :items="['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']"
                                v-model="role.aptitude.days"
                                :readonly="!isLoggedIn"
                                density="compact"
                    ></v-select>
                    </v-card-text>
                </v-card>
                <!-- Notes -->
                <v-card>
                    <v-card-title>Notes</v-card-title>
                    <v-card-text>
                        <v-textarea v-model="role.note" :readonly="!isLoggedIn" auto-grow></v-textarea>
                    </v-card-text>
                </v-card>

            </div>
            

            <v-btn v-if="isLoggedIn && currentCharacter.roles.length > 1" @click="removeRole(index)">
                <v-icon icon="mdi-trash-can-outline"></v-icon>
            </v-btn>
        </div>

    </div>
    <v-btn  v-if="isLoggedIn" @click="addRole">+ Ajouter un rôle</v-btn>
</template>


<script setup>
import { ref, watch, watchEffect } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query } from "firebase/firestore";
import { sortByName, sortByKey, copy } from '../../../tools/tools';
import { useTools } from '../../../composables/tools';
import { GENSHIN_ATTRIBUTES, GENSHIN_ELEMENT, GENSHIN_WEAPON } from '../../../tools/constants';

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])

const db = useFirestore()
const store = useTestStore()
const { isLoggedIn } = useTools()

const set = { data: [],  comment: null, nbPieces: 4 }
const role = {
    name: '',
    set: [copy(set)],
    statToFocus: [],
    sablier: [],
    coupe: [],
    couronne: [],
    weapon: [],
    aptitude: { priority: null, days: null, materials: null }
}

const currentCharacter = ref({
    name: '',
    element: '',
    weapon: null,
    star: 4,
    roles: [ copy(role) ],
    completed: false,
    isUpdated: false,
    isOwned: false,
})
const initCharacter = ref()

// Sets of relique list
let setRef = collection(db, 'sets')
let q2 = query(setRef, where("game", "==", store.getSelectedGame))
let setList = useCollection(q2, { ssrKey: 'justToStopWarning' })

let getStats = GENSHIN_ATTRIBUTES.sort()
let getWeapon = sortByKey(GENSHIN_WEAPON)
let getElement = GENSHIN_ELEMENT.sort()



function addRole() {
    currentCharacter.value.roles.push(JSON.parse(JSON.stringify(role)))
}

function removeRole(index) {
    currentCharacter.value.roles.splice(index, 1)
}

function addElement(type, roleIndex) {
    if (type === 'set') {
        currentCharacter.value.roles[roleIndex][type].push(copy(set))
    } else {
        currentCharacter.value.roles[roleIndex][type].push('')
    }
}

function removeElement(type, roleIndex, index) {
    currentCharacter.value.roles[roleIndex][type].splice(index, 1)
}

function clearForm() {
    currentCharacter.value = {
        name: '',
        element: '',
        weapon: null,
        star: '4',
        isUpdated: false,
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
    if (characterSource) {
        let formattedRoles = []
        characterSource.roles.forEach(r => {
            let formattedSet = []
            r.set.forEach(s => {
                let newSet = copy(set)
                if (typeof s === 'string') {
                    newSet.data = s
                } else {
                    newSet = s
                }
                formattedSet.push({
                    ...newSet
                })
            })
            formattedRoles.push({
                ...copy(role),
                ...r,
                set: formattedSet
            })
        })
        currentCharacter.value = {
            ...copy(currentCharacter.value),
            ...characterSource,
            roles: formattedRoles
        }
    } else {
        currentCharacter.value = {
            ...copy(currentCharacter.value)
        }
    }
    initCharacter.value = JSON.parse(JSON.stringify(currentCharacter.value))
})

watchEffect(() => {
    if (currentCharacter.value.name ) store.pageTitle = `${store.selectedGame} - ${currentCharacter.value.name}` 
})

</script>

<style scoped lang="scss">




.label {
    width: 50%;
}
</style>
