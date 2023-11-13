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
                  <legend>Rôle</legend>
                        <v-text-field label="Nom" v-model="role.name" placeholder="nom du rôle"></v-text-field>
                        
                        <fieldset class="role-card" >
                            <template v-for="(s, index2) in role.set" :key="index2">
                              <v-text-field label="Sets à privilégier" v-model="role.set[index2]" placeholder="ombre de la verte chasseuse"></v-text-field>
                            </template>
                            <v-btn @click="addElement('set', index)">+ Ajouter un set</v-btn>
                        </fieldset>

                        <fieldset class="m-top16 role-card">
                            <template v-for="(st, index2) in role.statToFocus" :key="index2">
                                <v-text-field label="Stat a privilégier" v-model="role.statToFocus[index2]" placeholder="PV%"></v-text-field>
                            </template>
                            <v-btn @click="addElement('statToFocus', index)">+ Ajouter une stat</v-btn>
                          
                        </fieldset>

                        <fieldset class="m-top16 role-card" >
                            <template v-for="(sa, index2) in role.sablier" :key="index2">
                                <v-text-field label="Sablier" v-model="role.sablier[index2]" placeholder="PV%"></v-text-field>
                            </template>
                            <v-btn @click="addElement('sablier', index)">+ Ajouter une stat</v-btn>
                        </fieldset>

                        <fieldset class="m-top16 role-card">
                            <template v-for="(c, index2) in role.coupe" :key="index2">
                                <v-text-field label="Coupe" v-model="role.coupe[index2]" placeholder="PV%"></v-text-field>
                            </template>
                            <v-btn @click="addElement('coupe', index)">+ Ajouter une stat</v-btn>
                        </fieldset>

                        <fieldset class="m-top16 role-card">
                            <template v-for="(p, index2) in role.couronne" :key="index2">
                                <v-text-field label="Couronne" v-model="role.couronne[index2]" placeholder="PV%"></v-text-field>
                            </template>
                            <v-btn @click="addElement('couronne', index)">+ Ajouter une stat</v-btn>
                        </fieldset>

                        <v-btn v-if="currentCharacter.roles.length > 1" @click="removeRole(index)">
                          <v-icon icon="mdi-trash-can-outline"></v-icon>
                        </v-btn>
                </fieldset>
                
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
            set: [''],
            statToFocus: [''],
            sablier: [''],
            coupe: [''],
            couronne: [''],
            weapon: [''],
        }
    ]
  })  


  
  function addRole() {
    currentCharacter.value.roles.push('')
  }
  
  function removeRole(index) {
    currentCharacter.value.roles.splice(index, 1)
  }

  function addElement(type, roleIndex) {
    currentCharacter.value.roles[roleIndex][type].push('')
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
            couronne: ['ME', 'DC', 'TC'],
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
  