<template>
    <div class="header">
        <h1>Nouveau personnage</h1>
        <div class="actions">
            <v-btn @click="$emit('cancel')">Annuler</v-btn>
            <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
        </div>
    </div>
    <div class="identity">
        <v-text-field label="Nom" v-model="currentCharacter.name" class="label"></v-text-field>
        <v-text-field label="Element" v-model="currentCharacter.element" class="label"></v-text-field>
    </div>
    <div>
        <div class="roles-list">
            <div v-for="(role, index) in currentCharacter.roles" :key="index" class="fieldset-card">
                <v-text-field label="Nom du rôle" v-model="role.name" placeholder="nom du rôle"></v-text-field>
                <div class="group">
                    <div class="card">
                        <div v-for="(s, index2) in role.set" :key="index2" class="individual-bloc">
                            <v-text-field label="Sets à privilégier" v-model="role.set[index2]"
                                placeholder="ombre de la verte chasseuse"></v-text-field>
                            <v-btn v-if="role.set.length > 1" @click="removeElement('set', index, index2)">
                                <v-icon icon="mdi-trash-can-outline"></v-icon>
                            </v-btn>
                        </div>
                        <v-btn @click="addElement('set', index)">+ Ajouter un set</v-btn>
                    </div>

                    <div class="card">
                        <div class="group-bloc">
                            <div v-for="(st, index2) in role.statToFocus" :key="index2" class="individual-bloc">
                                <v-text-field label="Stat a privilégier" v-model="role.statToFocus[index2]"
                                    placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.statToFocus.length > 1"
                                    @click="removeElement('statToFocus', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <v-btn @click="addElement('statToFocus', index)">+ Ajouter une stat</v-btn>
                    </div>

                    <div class="card">
                        <div class="group-bloc">
                            <div v-for="(sa, index2) in role.sablier" :key="index2" class="individual-bloc">
                                <v-text-field label="Sablier" v-model="role.sablier[index2]"
                                    placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.sablier.length > 1" @click="removeElement('sablier', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <v-btn @click="addElement('sablier', index)">+ Ajouter une stat</v-btn>
                    </div>

                    <div class="card">
                        <div class="group-bloc">
                            <div v-for="(c, index2) in role.coupe" :key="index2" class="individual-bloc">
                                <v-text-field label="Coupe" v-model="role.coupe[index2]" placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.coupe.length > 1" @click="removeElement('coupe', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <v-btn @click="addElement('coupe', index)">+ Ajouter une stat</v-btn>
                    </div>

                    <div class="card">
                        <div class="group-bloc">
                            <div v-for="(p, index2) in role.couronne" :key="index2" class="individual-bloc">
                                <v-text-field label="Couronne" v-model="role.couronne[index2]"
                                    placeholder="PV%"></v-text-field>
                                <v-btn v-if="role.couronne.length > 1" @click="removeElement('couronne', index, index2)">
                                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <v-btn @click="addElement('couronne', index)">+ Ajouter une stat</v-btn>
                    </div>

                </div>

                <v-btn v-if="currentCharacter.roles.length > 1" @click="removeRole(index)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                </v-btn>
            </div>

        </div>
        <v-btn @click="addRole">+ Ajouter un rôle</v-btn>
    </div>

    <div class="m-top16">
        <label for="">results: {{ currentCharacter }}</label>
    </div>
</template>


<script setup>
import { ref, watch } from 'vue'

defineEmits(['cancel', 'save'])
const props = defineProps(['id', 'isEditMode', 'source'])

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
    currentCharacter.value.roles[roleIndex][type].push('')
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
</style>
