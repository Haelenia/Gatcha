<template>
    <div class="edit-character-view">
        <GenshinCharacterForm v-if="store.getSelectedGame === 'Genshin' && isLoggedIn"
                            :is-edit-mode="isEditMode"
                            :source="characterSource"
                            @save="saveElement"
        />
        <GenshinCharacterForm v-if="store.getSelectedGame === 'Genshin' && !isLoggedIn"
                            :is-edit-mode="isEditMode"
                            :source="characterSource"
                            @save="saveElement"
        />
        <HSREditCharactersForm v-if="store.getSelectedGame === 'HSR' && isLoggedIn"
                            :is-edit-mode="isEditMode"
                            :source="characterSource"          
                            @save="saveElement"
        />
        <HSREditCharactersForm v-if="store.getSelectedGame === 'HSR' && !isLoggedIn"
                            :is-edit-mode="isEditMode"
                            :source="characterSource"          
                            @save="saveElement"
        />
    </div>
</template>
  
  
<script setup>
import HSREditCharactersForm from './HSR/HSREditCharactersForm.vue';
import HSRReadCharactersForm from './HSR/HSRReadCharactersForm.vue';
import GenshinCharacterForm from './Genshin/GenshinCharacterForm.vue';
import { useTestStore } from '../../stores/test';
import { ref, onMounted } from 'vue'
import { useFirestore, useDocument } from "vuefire";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { useTools } from '../../composables/tools';
import { copy } from '../../tools/tools';

const router = useRouter()
const route = useRoute()
const db = useFirestore()
const store = useTestStore()
const { isLoggedIn } = useTools()

let isEditMode = ref(false)

let docRef = null
let characterSource = null

onMounted(() => {
    if (route.params?.id) {
        isEditMode.value = true
        docRef = doc(db, 'characters', route.params.id)
        characterSource = useDocument(docRef)
    } else {
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
  