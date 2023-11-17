<template>
    <div>
        <GenshinCharacterForm v-if="store.getSelectedGame === 'Genshin'"
                            :is-edit-mode="isEditMode"
                            :id="id"
                            :source="characterSource"
                            @save="saveElement"
                            @cancel="$emit('cancel')"
        />
        <HSRCharactersForm v-if="store.getSelectedGame === 'HSR'"
                            :is-edit-mode="isEditMode"
                            :id="id"
                            :source="characterSource"
                            @save1="saveElement"
                            @cancel="$emit('cancel')"
        />
    </div>
</template>
  
  
<script setup>
import HSRCharactersForm from './HSR/HSRCharactersForm.vue';
import GenshinCharacterForm from './Genshin/GenshinCharacterForm.vue';
import { useTestStore } from '../../stores/test';
import { ref, onMounted } from 'vue'
import { useFirestore, useDocument } from "vuefire";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const db = useFirestore();

const store = useTestStore() 
let id = ref()
let isEditMode = ref(false)

let docRef = null
let characterSource = null

onMounted(() => {
    if (route.params?.id) {
        id.value = route.params.id
        isEditMode.value = true
        docRef = doc(db, 'characters', route.params.id)
        characterSource = useDocument(docRef)
    } else {
        id.value = null
        isEditMode.value = false
    }
})


async function saveElement(element) {
    if (isEditMode.value) {
        await updateDoc(docRef, {
            ...element,
        })
    } else {
        // Add a new document with a generated id.
        await addDoc(collection(db, "characters"), {
            game: store.getSelectedGame,
            ...element
        });
    }
    router.push({ name: 'characters' })
}

</script>
  