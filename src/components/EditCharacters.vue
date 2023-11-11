<template>
    <div>
        <h1>Nouveau personnage</h1>
        <v-btn @click="$emit('cancel')">Annuler</v-btn>
        <v-btn @click="$emit('save', currentCharacter)">Enregistrer</v-btn>
        <div>
            <v-text-field label="Nom" v-model="currentCharacter.name" class="label"></v-text-field>
            <v-text-field label="Element" v-model="currentCharacter.element" class="label"></v-text-field>
        </div>
        <div>
            <div  class="roles-list">
                <fieldset v-for="(role, index) in currentCharacter.roles" :key="index" class="role-card">
                        <v-text-field label="Nom" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        <fieldset class="role-card">
                            <v-text-field label="Set" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        </fieldset>
                        <fieldset class="m-top16 role-card">
                            <v-text-field label="Stat a privilégier" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        </fieldset>
                        <fieldset class="m-top16 role-card">
                            <v-text-field label="Sablier" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        </fieldset>
                        <fieldset class="m-top16 role-card">
                            <v-text-field label="Coupe" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        </fieldset>
                        <fieldset class="m-top16 role-card">
                            <v-text-field label="Plume" v-model="currentCharacter.roles[index].name" placeholder="nom du rôle"></v-text-field>
                        </fieldset>
                </fieldset>
                <v-btn v-if="currentCharacter.roles.length > 1" @click="removeRole(index)">
                    <v-icon icon="mdi-trash-can-outline"></v-icon>
                </v-btn>
            </div>

            <v-btn @click="addRole">+ Ajouter un rôle</v-btn>  
        </div>

        


        <div class="m-top16">
          <label for="">results: {{ currentCharacter }}</label>
        </div>
    </div>
  </template>
  
  
  <script setup>
  import { ref } from 'vue'
  

 
  const currentCharacter = ref({ 
    name: '',
    element: '',
    roles: [
        {
            name: '',
            set: [],
            statToFocus: {},
            sablier: [],
            coupe: [],
            plume: [],
            weapon: [],
        }
    ]
  })  


  
  function addRole() {
    currentCharacter.value.roles.push('')
  }
  
  function removeRole(index) {
    currentCharacter.value.roles.splice(index, 1)
  }
  

  const ex = {
    name: 'Nahida',
    element: 'Dendro',
    game: 'Genshin',
    roles: [
        {
            name: 'support DPS',
            set: ['rêve doré', 'souvenir de forêt'],
            statToFocus:['DC', 'TC', 'ME', 'ATQ%', 'RE%'],
            sablier: 'ME',
            coupe: ['ME', 'Dendro%'],
            plume: ['ME', 'DC', 'TC'],
            weapon: ['Mille rêves flottants', 'vérité de kagura', 'mouvement vagabond'],
        }
    ]    
}
  </script>
  
  
  
  
  
  <style scoped lang="scss">
  .m-top16 { margin-top: 16px;}
  .label { width: 50%;}

 .roles-list {
    display: grid;
    grid-template-columns: 50% 50%;
    column-gap: 16px;
    row-gap: 16px;
    

    .role-card {
        padding: 16px;
    }
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
  