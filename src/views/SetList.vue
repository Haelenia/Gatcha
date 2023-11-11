<template>
    Liste des sets
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, query, where, getDocs } from "firebase/firestore";



const db = useFirestore();
const setsList = useCollection(collection(db, 'dungeons'))
</script>