<template>
    <div class="header">
        <h1>{{props.isEditMode ? currentCharacter.name : 'Nouveau personnage'}}</h1>
        <div class="actions">
            <v-btn @click="$emit('cancel')">Annuler</v-btn>
            <v-btn @click="$emit('save1', currentCharacter)">Enregistrer</v-btn>
        </div>
    </div>

    <div class="identity">
        <v-text-field label="Nom" v-model="currentCharacter.name" class="label"></v-text-field>
        <v-text-field label="Rôle" v-model="currentCharacter.role" class="label"></v-text-field>
        <v-text-field label="Type" v-model="currentCharacter.type" class="label"></v-text-field>
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
    </div>

    <div>
        <div class="roles-list">
            <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">
                <!-- Relique Sets -->
                <div class="set-zone">
                    <h2>Sets de reliques recommandés</h2>
                    <div v-for="(s, index2) in role.set" :key="index2" class="individual-bloc">
                        <v-text-field label="Relique des cavernes" v-model="role.set[index2].armor" placeholder="mousquetaire"></v-text-field>
                        <v-text-field label="Ornement planaire" v-model="role.set[index2].jewel"
                            placeholder="salsotto inerte"></v-text-field>
                        <v-btn v-if="role.set.length > 1" @click="removeElement('set', index, index2)">
                            <v-icon icon="mdi-trash-can-outline"></v-icon>
                        </v-btn>
                    </div>
                    <v-btn @click="addElement('set', index)">+ Ajouter un set</v-btn>
                </div>

                <div class="m-top32">
                    <h2> Stat par equipement </h2>
                    <div class="group">
                        <!-- Stat for Chest -->
                        <div class="card short-text">
                            <div class="group-bloc">
                                <div v-for="(sa, index2) in role.torse" :key="index2" class="individual-bloc">
                                    <v-text-field label="torse" v-model="role.torse[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.torse.length > 1" @click="removeElement('torse', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <v-btn @click="addElement('torse', index)">+ Ajouter une stat</v-btn>
                        </div>

                        <!-- Stat for Boots-->
                        <div class="card short-text">
                            <div class="group-bloc">
                                <div v-for="(c, index2) in role.botte" :key="index2" class="individual-bloc">
                                    <v-text-field label="Botte" v-model="role.botte[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.botte.length > 1" @click="removeElement('botte', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <v-btn @click="addElement('botte', index)">+ Ajouter une stat</v-btn>
                        </div>

                        <!-- Stat for Sphere -->
                        <div class="card short-text">
                            <div class="group-bloc">
                                <div v-for="(p, index2) in role.orbe" :key="index2" class="individual-bloc">
                                    <v-text-field label="Sphère planaire" v-model="role.orbe[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.orbe.length > 1" @click="removeElement('orbe', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <v-btn @click="addElement('orbe', index)">+ Ajouter une stat</v-btn>
                        </div>

                        <!-- Stat for Cord -->
                        <div class="card short-text">
                            <div class="group-bloc">
                                <div v-for="(ch, index2) in role.chaine" :key="index2" class="individual-bloc">
                                    <v-text-field label="Corde de liaison" v-model="role.chaine[index2]" placeholder="PV%"></v-text-field>
                                    <v-btn v-if="role.chaine.length > 1" @click="removeElement('chaine', index, index2)">
                                        <v-icon icon="mdi-trash-can-outline"></v-icon>
                                    </v-btn>
                                </div>
                            </div>
                            <v-btn @click="addElement('chaine', index)">+ Ajouter une stat</v-btn>
                        </div>
                    </div>

                </div>
                

                <!-- Substat to focus -->
                <div class="card short-text m-top32">
                    <h2>Substat à focus</h2>
                    <div class="group-bloc">
                        <div v-for="(st, index2) in role.statToFocus" :key="index2" class="individual-bloc">
                            <v-text-field label="Stat a privilégier" v-model="role.statToFocus[index2]" placeholder="PV%"></v-text-field>
                            <v-btn v-if="role.statToFocus.length > 1"
                                @click="removeElement('statToFocus', index, index2)">
                                <v-icon icon="mdi-trash-can-outline"></v-icon>
                            </v-btn>
                        </div>
                    </div>
                    <v-btn @click="addElement('statToFocus', index)">+ Ajouter une stat</v-btn>

                </div>


                <v-btn v-if="currentCharacter.roles.length > 1" @click="removeRole(index)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                </v-btn>
            </div>

        </div>
        <v-btn @click="addRole">+ Ajouter un rôle</v-btn>
    </div>
</template>


<script setup>
import { onMounted, ref, watch } from 'vue'

defineEmits(['cancel', 'save1'])
const props = defineProps(['id', 'isEditMode', 'source'])

const role = {
    set: [{armor: '', jewel: ''}],
    statToFocus: [''],
    torse: [''],
    botte: [''],
    orbe: [''],
    chaine: [''],
}

const currentCharacter = ref({
    name: '',
    role: '',
    type: '',
    star: 4,
    roles: [
        JSON.parse(JSON.stringify(role))
    ]
})

function addRole() {
    currentCharacter.value.roles.push(JSON.parse(JSON.stringify(role)))
}

function removeRole(index) {
    currentCharacter.value.roles.splice(index, 1)
}

function addElement(type, roleIndex) {
    if (type === 'set') {
        currentCharacter.value.roles[roleIndex][type].push({armor: '', jewel: ''})
    } else {
        currentCharacter.value.roles[roleIndex][type].push('')
    }
}

function removeElement(type, roleIndex, index) {
    currentCharacter.value.roles[roleIndex][type].splice(index, 1)
}

watch(() => props.source, (characterSource) => {
    currentCharacter.value = {
      ...characterSource,
    }
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
