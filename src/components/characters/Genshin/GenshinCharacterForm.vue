<template>
    <div class="header genshin-form">
        <h1>{{props.isEditMode ? currentCharacter.name : 'Nouveau personnage'}}</h1>
        <div class="actions">
            <v-btn @click="resetElement">Annuler</v-btn>
            <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
        </div>
    </div>

    <div class="identity genshin-form">
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
        <v-checkbox label="maj OK" v-model="currentCharacter.isUpdated"></v-checkbox>
    </div>


    <div class="roles-list genshin-form">
        <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">
            <v-text-field label="Nom du rôle" v-model="role.name" placeholder="nom du rôle"></v-text-field>

            <!-- Relique Sets -->
            <v-card class="set-zone">
                <v-card-title>Sets à privilégier</v-card-title>
                <!-- TODO ajouter la notion de 4piece ou 2 piece pour les set d'arté -->
                <v-card-text>
                    <v-select 
                                multiple
                                chips
                                density="compact"
                                :items="sortByName(setList)"
                                :item-props="itemProps"
                                v-model="role.set"
                    ></v-select>
                    <div v-for="(s, index2) in role.set" :key="index2" class="individual-bloc">

                        <v-text-field v-if="typeof role.set[index2] === 'string'"
                            label="Sets à privilégier" v-model="role.set[index2]"
                            placeholder="ombre de la verte chasseuse"></v-text-field>
                        
                        <v-select
                            label="Set"
                            :items="sortByName(setList)"
                            :item-props="itemProps"
                            v-model="role.set[index2]"
                        ></v-select>

                        <v-btn v-if="role.set.length > 1" @click="removeElement('set', index, index2)">
                            <v-icon icon="mdi-trash-can-outline"></v-icon>
                        </v-btn>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="addElement('set', index)">+ Ajouter un set</v-btn>
                </v-card-actions>
            </v-card>

            <!-- Equipment Main Stat -->
            <v-card class="m-top32">
                <v-card-title> Stat par equipement </v-card-title>
                <div class="group">
                    <!-- Stat for Hourglass -->
                    
                    <div class="card short-text">
                        <v-card-subtitle>Sablier</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(sa, index2) in role.sablier" :key="index2" class="individual-bloc">
                                <template v-if="!getStats.includes(role.sablier[index2])">
                                    <v-text-field label="Sablier" v-model="role.sablier[index2]"
                                        placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.sablier.length > 1" @click="removeElement('sablier', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </template>
                            </div>
                        </div>
                        
                        <v-card-text>
                            <v-select :items="getStats"
                                    multiple
                                    chips
                                    density="compact"
                                    v-model="role.sablier"
                        ></v-select>
                        </v-card-text>
                        
                    </div>

                    <!-- Stat for Cup -->
                    <div class="card short-text">
                        <v-card-subtitle>Coupe</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(c, index2) in role.coupe" :key="index2" class="individual-bloc">
                                <template v-if="!getStats.includes(role.coupe[index2])">
                                    <v-text-field label="Coupe" v-model="role.coupe[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.coupe.length > 1" @click="removeElement('coupe', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </template> 
                            </div>
                        </div>
                        
                        <v-card-text>
                            <v-select :items="getStats"
                                    multiple
                                    chips
                                    density="compact"
                                    v-model="role.coupe"
                            ></v-select>
                        </v-card-text>
                        
                    </div>

                    <!-- Stat for Crown -->
                    <div class="card short-text">
                        <v-card-subtitle>Diadème</v-card-subtitle>
                        <div class="group-bloc">
                            <div v-for="(p, index2) in role.couronne" :key="index2" class="individual-bloc">
                                <template v-if="!getStats.includes(role.couronne[index2])">
                                    <v-text-field label="Couronne" v-model="role.couronne[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.couronne.length > 1" @click="removeElement('couronne', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </template> 
                            </div>
                        </div>
                        
                        <v-card-text>
                            <v-select :items="getStats"
                                        multiple
                                        chips
                                        density="compact"
                                        v-model="role.couronne"
                            ></v-select>
                        </v-card-text>
                    </div>
                </div>
            </v-card>

            <!-- Substat to focus -->
            <v-card class="card short-text m-top32">
                <v-card-title>Substat à focus</v-card-title>
                <v-card-text>
                    <v-select :items="getStats"
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
import { ref, watch } from "vue";
import { useTestStore } from '../../../stores/test'
import { useFirestore, useCollection } from "vuefire";
import { collection, where, query } from "firebase/firestore";
import { sortByName, sortByKey } from '../../../tools/tools';
import { GENSHIN_ATTRIBUTES, GENSHIN_ELEMENT, GENSHIN_WEAPON } from '../../../tools/constants';

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])

const db = useFirestore()
const store = useTestStore()

const role = {
    name: '',
    set: [''],
    statToFocus: [''],
    sablier: [''],
    coupe: [''],
    couronne: [''],
    weapon: [''],
}

const currentCharacter = ref({
    name: '',
    element: '',
    weapon: null,
    star: '4',
    isUpdated: false,
    roles: [
        JSON.parse(JSON.stringify(role))
    ]
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
    currentCharacter.value.roles[roleIndex][type].push('')
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
</style>
