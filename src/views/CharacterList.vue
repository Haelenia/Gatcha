

<script setup>
import { ref, onMounted } from "vue";
import { useFirestore, useCollection } from "vuefire";
import { collection, query, where, getDocs } from "firebase/firestore";



const db = useFirestore();
const charactersList = useCollection(collection(db, 'characters'))



let dj = {
    id: '1',
    name: 'Spire of solitary enlightenment',
    game: 'Genshin',
    set: ['rêve doré', 'Souvenir de fôret', 'Miracle', 'Parieur']
}

/* without vueFire
const q = query(collection(db, "characters"));//, where("capital", "==", true));
const charactersList = ref([])
onMounted(async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        charactersList.value.push(doc.data())
    })
})*/

</script>

<template>
    <div>
        <ul>
            <li v-for="c in charactersList" :key="c.id">{{  c.name }} - {{ c.element }}</li>
        </ul>
    </div>
</template>