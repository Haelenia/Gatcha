<template>
    <ul>
        <li v-for="item in setsList" :key="item.id">{{  item.name }} - {{ item.set }}</li>
    </ul>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, query, where, getDocs } from "firebase/firestore";



const db = useFirestore();
const setsList = useCollection(collection(db, 'dungeons'))
</script>