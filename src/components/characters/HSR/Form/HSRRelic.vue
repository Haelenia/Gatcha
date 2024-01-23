<template>
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
</template>


<script setup>
import { ref, watch, computed } from "vue"
import { useTestStore } from '../../../../stores/test'
import { useFirestore, useCollection, useCurrentUser } from "vuefire"
import { collection, where, query } from "firebase/firestore"
import { sortByName } from '../../../../tools/tools'
import { HSR_ATTRIBUTES, HSR_ELEMENT, HSR_ROLE } from '../../../../tools/constants'

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

function removeElement(type, roleIndex, index, set) {
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
