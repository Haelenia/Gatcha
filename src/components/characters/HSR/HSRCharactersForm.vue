<template>
    <div class="header hsr-form">
        <h1>{{props.isEditMode ? currentCharacter.name : 'Nouveau personnage'}}</h1>
        <div class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
        </div>
    </div>

    <div class="identity hsr-form">
        <v-text-field label="Nom" v-model="currentCharacter.name" class="label"></v-text-field>
        <v-select label="Voix"
                :items="getRoles.sort()"
                v-model="currentCharacter.role"
        ></v-select>
        <v-select label="Element"
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
        <v-checkbox label="maj OK" v-model="currentCharacter.isUpdated"></v-checkbox>
        <v-checkbox label="possédé" v-model="currentCharacter.isOwned"></v-checkbox>
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
                                    <v-text-field v-if="set.armor && !set.relic" label="Relique des cavernes" v-model="set.armor" placeholder="mousquetaire"></v-text-field>
                                    <v-radio-group v-model="set.nbPieces" inline>
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
                                    <v-select
                                        label="Relique des cavernes"
                                        :items="relicSetList"
                                        :item-props="itemProps"
                                        v-model="set.relic[0]"
                                    ></v-select>
                                    <v-select v-if="set.nbPieces === 2"
                                        label="Relique des cavernes"
                                        :items="sortByName(setList.filter(el => el.type === 'Relique des cavernes'))"
                                        :item-props="itemProps"
                                        v-model="set.relic[1]"
                                    ></v-select>
                                    <v-textarea label="Notes" v-model="set.comment" rows="1" auto-grow></v-textarea>
                                    <v-btn v-if="role.set.length > 1" @click="removeElement('set', index, indexRelic, set)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="addElement('set', index, 'relic')">+ Ajouter une relique</v-btn>
                        </v-card-actions>
                    </div>
                    
                    

                    <div class="set-content">
                        <v-card-subtitle>Ornement planaire</v-card-subtitle>
                        <v-card-text>
                            <template  v-for="(set, indexRelic) in role.set" :key="indexRelic">
                                <div v-if="set.type === 'ornment'" class="set-line">
                                    <v-text-field v-if="set.jewel && !role.set[index2].ornment" label="Ornement planaire" v-model="set.jewel"></v-text-field>
                                    
                                    <v-select :items="sortByName(setList.filter(el => el.type === 'Ornement planaire'))"
                                        :item-props="itemProps"
                                        v-model="set.ornment"
                                    ></v-select>

                                    <v-textarea label="Notes" v-model="set.comment"  rows="1" auto-grow></v-textarea>

                                    <v-btn v-if="role.set.length > 1" @click="removeElement('set', index, indexRelic, set)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </template>

                        </v-card-text>
                        <v-card-actions>
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
                        <div class="group-bloc">
                            <div v-for="(sa, index2) in role.torse" :key="index2" class="individual-bloc">
                                <template v-if="!getStats.includes(role.torse[index2])">
                                    <v-text-field  label="torse" v-model="role.torse[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.torse.length > 1" @click="removeElement('torse', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </template>
                                
                            </div>
                        </div>
                        <!-- <v-btn @click="addElement('torse', index)">+ Ajouter une stat</v-btn> -->
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    density="compact"
                                    v-model="role.torse"
                        ></v-select>
                        </v-card-text>
                        
                    </div>

                    <!-- Stat for Boots-->
                    <div class="card short-text">
                        <v-card-subtitle>Bottes</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(c, index2) in role.botte" :key="index2" class="individual-bloc">
                                <v-text-field v-if="!getStats.includes(role.botte[index2])" label="Botte" v-model="role.botte[index2]" placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.botte.length > 1 && !getStats.includes(role.botte[index2])" @click="removeElement('botte', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <!-- <v-btn @click="addElement('botte', index)">+ Ajouter une stat</v-btn> -->
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    density="compact"
                                    v-model="role.botte"
                            ></v-select>
                        </v-card-text>
                        
                    </div>

                    <!-- Stat for Sphere -->
                    <div class="card short-text">
                        <v-card-subtitle>Sphère planaire</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(p, index2) in role.orbe" :key="index2" class="individual-bloc">
                                <v-text-field v-if="!getStats.includes(role.orbe[index2])" label="Sphère planaire" v-model="role.orbe[index2]" placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.orbe.length > 1 && !getStats.includes(role.orbe[index2])" @click="removeElement('orbe', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <!-- <v-btn @click="addElement('orbe', index)">+ Ajouter une stat</v-btn> -->
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                        multiple
                                        chips
                                        density="compact"
                                        v-model="role.orbe"
                            ></v-select>
                        </v-card-text>
                    </div>

                    <!-- Stat for Cord -->
                    <div class="card short-text">
                        <v-card-subtitle>Corde de liaison</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(ch, index2) in role.chaine" :key="index2" class="individual-bloc">
                                <v-text-field v-if="!getStats.includes(role.chaine[index2])" label="Corde de liaison" v-model="role.chaine[index2]" placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.chaine.length > 1 && !getStats.includes(role.chaine[index2])" @click="removeElement('chaine', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <!-- <v-btn @click="addElement('chaine', index)">+ Ajouter une stat</v-btn> -->
                        <v-card-text>
                            <v-select :items="getStats.sort()"
                                    multiple
                                    chips
                                    density="compact"
                                    v-model="role.chaine"
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
                            v-model="role.statToFocus"
                    ></v-select>
                </v-card-text>
                <div class="group-bloc">
                    <div v-for="(st, index2) in role.statToFocus" :key="index2" class="individual-bloc">
                        <v-text-field v-if="!getStats.includes(role.statToFocus[index2])" label="Stat a privilégier" v-model="role.statToFocus[index2]" placeholder="PV%"></v-text-field>
                        <v-btn v-if="role.statToFocus.length > 1 && !getStats.includes(role.statToFocus[index2])"
                            @click="removeElement('statToFocus', index, index2)">
                            <v-icon icon="mdi-trash-can-outline"></v-icon>
                        </v-btn>
                    </div>
                </div>
            </v-card>

            <!-- Note -->
            <v-card class=" m-top32">
                <v-card-title>Notes</v-card-title>
                <v-card-text>
                    <v-textarea v-model="role.note"></v-textarea>
                </v-card-text>
            </v-card>


            <v-btn v-if="currentCharacter.roles.length > 1" @click="removeRole(index)">
                <v-icon icon="mdi-trash-can-outline"></v-icon>
            </v-btn>
        </div>

    </div>
    <v-btn @click="addRole">+ Ajouter un rôle</v-btn>
</template>


<script setup>
import { ref, watch, computed } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query } from "firebase/firestore";
import { sortByName } from '../../../tools/tools';
import { HSR_ATTRIBUTES, HSR_ELEMENT, HSR_ROLE } from '../../../tools/constants'

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])


const db = useFirestore()
const store = useTestStore()

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
    note: null
}

const currentCharacter = ref({
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

function removeElement(type, roleIndex, index, set) {
    console.log('index, set', index, set)
    currentCharacter.value.roles[roleIndex][type].splice(index, 1)
}

function clearForm() {
    currentCharacter.value = {
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


.identity {
    display: flex;
    gap: 32px;

    .v-input {
        max-width: 400px;
    }
}


.label {
    width: 50%;
}


#app main .roles-list .group {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

</style>
