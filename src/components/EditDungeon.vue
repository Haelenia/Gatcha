<template>
    <div>
        <h1>Nouveau donjon</h1>
      <div>
        <v-text-field label="Nom" v-model="currentDj.name" class="label"></v-text-field>
      </div>
      <div>
    <div v-for="(s, index) in currentDj.set" :key="index" class="set-list">
        <v-text-field label="Set disponible" v-model="currentDj.set[index]" placeholder="nom du set"></v-text-field>
        <v-btn v-if="currentDj.set.length > 1" @click="removeSet(index)">-</v-btn>
    </div>

        
        <v-btn @click="addSet">+ Ajouter un set</v-btn>  
      </div>

      <v-btn @click="$emit('cancel')">Annuler</v-btn>
      <v-btn @click="$emit('save', currentDj)">Enregistrer</v-btn>


      <div class="m-top16">
          <label for="">results: {{ currentDj?.name }} - {{ currentDj?.set }}</label>
        </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue'
  

 
  const currentDj = ref({ name: '', set: ['']})

  
  function addSet() {
    currentDj.value.set.push('')
  }
  
  function removeSet(index) {
    currentDj.value.set.splice(index, 1)
  }
  
  </script>
  
  
  
  
  
  <style scoped lang="scss">
  .m-top16 { margin-top: 16px;}
  .label { width: 50%;}

 .set-list {
    display: flex;
    gap: 16px;
    width: 50%;
    align-items: center;
  }

  .v-btn {
    //align-items: end;
  }
  
  .add {
    display: flex;
    gap: 20px;
  }
  .add > div {
    width: 50%;
    text-align: center;
    padding: 100px;
    border-radius: 5px;
    border: 1px solid darkgray;
    box-shadow: 8px 8px 2px 1px rgba(0, 0, 255, .2);
    &:hover {
      cursor: pointer;
      border: 1px solid lightblue;
      color: lightseagreen;
      font-weight: bold;
  
    }
  }
  
  
  </style>
  