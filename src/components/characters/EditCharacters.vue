<template>
    <div>
        <GenshinCharacterForm v-if="store.getSelectedGame === 'Genshin'" />
        <HSRCharactersForm v-if="store.getSelectedGame === 'HSR'" />
    </div>
</template>
  
  
<script setup>
import HSRCharactersForm from './HSR/HSRCharactersForm.vue';
import GenshinCharacterForm from './Genshin/GenshinCharacterForm.vue';
import { useTestStore } from '../../stores/test';

const store = useTestStore()

</script>
  
  
  
<style scoped lang="scss">
.header {
    background-color: lightgray;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: none;
    .actions {
        .v-btn {
            margin-left: 16px;
        }
    }
}
.identity {
    display: flex;
    gap: 32px;
    .v-input {
        max-width: 400px;
    }
}

.m-top16 {
    margin-top: 16px;
}

.label {
    width: 50%;
}

.roles-list {
    //display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(500px, 750px));
    column-gap: 16px;
    row-gap: 16px;


    .fieldset-card {
        padding: 16px;
    }

    .group {
        display: flex;
        gap: 16px;
        .group-bloc {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        column-gap: 16px;
    }
        .individual-bloc {
            display: flex;
            align-items: center;
            gap: 16px;
            button {
                width: 40px;
                min-width: 40px;
            }
            
        }
        .fieldset-card {
            &:not(.short-text) {
                min-width: 350px;
            }
            &.short-text {
            //background-color: aqua;
            .v-input {
                //max-width: 150px;
            }
        }
        }
        
    }
    
    

}

.add {
    display: flex;
    gap: 20px;
}

.add>div {
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
}</style>
  