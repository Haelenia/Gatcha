import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
            currentUser: null
        }
    },
    getters: {
        getCurrentUser: state => state.currentUser
    },
    actions: {
        setCurrentUser(user) {
            this.currentUser = user
        },
        logoutUser() {
            this.currentUser = null
        }
    }
})