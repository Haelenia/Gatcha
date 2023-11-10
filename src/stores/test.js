import { ref, computed } from 'vue'
import { defineStore } from 'pinia'


export const useTestStore = defineStore('test', {
    // arrow function recommended for full type inference
    state: () => {
      return {
        // all these properties will have their type inferred automatically
        count: 0,
        name: 'Eduardo',
        isAdmin: true,
        items: [],
        hasChanged: true,
        selectedGame: null,
        initSet: null,
        currentSet: null,
        dungeons: null,
        initDungeon: null,
        currentDungeon: null

      }
    },
    getters: {
        getSelectedGame: state => state.selectedGame
    },
    actions: {
        selectGame(game) {
            console.log('ici', game)
            this.selectedGame = game
        },
        setDungeonsList() {

        },
        setInitialDungeon() {

        },
        updateCurrentDungeon(dj) {
            
        },
        saveDungeon() {

        },
        deleteDungeon(dj) {

        }

    }
  })