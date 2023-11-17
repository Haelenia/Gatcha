<template>

    <GenshinCharactersList v-if="store.getSelectedGame === 'Genshin'"/>
    <HSRCharactersList v-if="store.getSelectedGame === 'HSR'"/>

  </template>

<script setup>
import { useTestStore } from '../../stores/test'

import GenshinCharactersList from "./Genshin/GenshinCharactersList.vue";
import HSRCharactersList from "./HSR/HSRCharactersList.vue";

const store = useTestStore()

</script>

<style lang="scss">

</style>