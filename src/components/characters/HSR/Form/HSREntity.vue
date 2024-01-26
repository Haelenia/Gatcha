<template>
    <div class="identity hsr-form">
        <v-text-field label="Nom" v-model="characterIdentity.name" class="label" :disabled="!isLoggedIn"></v-text-field>
        <v-select label="Voix"
                clearable
                :items="getRoles.sort()"
                v-model="characterIdentity.role"
                :disabled="!isLoggedIn"
        ></v-select>
        <v-select label="Element"
                clearable
                :items="getElement.sort()"
                v-model="characterIdentity.type"
                :disabled="!isLoggedIn"
        ></v-select>
        <v-radio-group v-model="characterIdentity.star" inline :disabled="!isLoggedIn">
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
        <v-checkbox v-if="isLoggedIn" label="video check" v-model="characterIdentity.isUpdated" :disabled="!isLoggedIn"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="complet" v-model="characterIdentity.completed" :disabled="!isLoggedIn"></v-checkbox>
        <v-checkbox v-if="isLoggedIn" label="possédé" v-model="characterIdentity.isOwned" :disabled="!isLoggedIn"></v-checkbox>
    </div>
</template>


<script setup>
import { ref, watch, onMounted } from "vue"
import { HSR_ELEMENT, HSR_ROLE } from '../../../../tools/constants'
import { useTools } from "../../../../composables/tools"
import { copy } from "../../../../tools/tools";

defineEmits(['cancel', 'save'])
const props = defineProps({
    currentCharacter: { type: Object, required: true }
})

const { isLoggedIn } = useTools()

const initCharacter = ref()
const characterIdentity = ref({
    completed: false,
    isUpdated: false,
    isOwned: false,
    name: '',
    role: null,
    type: null,
    star: 4,
})


let getRoles = HSR_ROLE
let getElement = HSR_ELEMENT

onMounted(() => {
    characterIdentity.value = copy(props.currentCharacter)
    initCharacter.value = copy(props.currentCharacter)
})




watch(() => props.currentCharacter, (characterSource) => {
    characterIdentity.value = copy(characterSource)
    initCharacter.value = copy(characterSource)
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
