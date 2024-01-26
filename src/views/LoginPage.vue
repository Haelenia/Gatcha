<template>
  <v-container>
    <h1 class="mb-4">Sign In</h1>
    <v-card>
      <template v-slot:default>
        <v-form>
          <v-text-field
            v-model="userInput.email"
            type="email"
            label="Email"
            required
            placeholder="eleanorshellstrop@thegoodplace.com"
          />
          <v-text-field
            v-model="userInput.password"
            label="Password"
            type="password"
            required
          />
        </v-form>
      </template>
      <template v-slot:actions>
        <v-btn @click="signInToFirebase" variant="tonal" color="success"> Sign In </v-btn>
        <!-- <v-btn @click="createUser" variant="tonal" color="secondary" outline>
          Create New User
        </v-btn> -->
      </template>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthStore } from '../stores/auth'


const userInput = ref({
  email: '',
  password: '',
})

let store = useAuthStore()
const router = useRouter()

const auth = useFirebaseAuth()

async function createUser() {
    return
    // createUserWithEmailAndPassword(auth, userInput.value.email, userInput.value.password)
    // .then((userCredential) => {
    //     // Signed up 
    //     const user = userCredential.user;
    //     store.setCurrentUser(user)
    // })
    // .catch((error) => {
    //     console.log('error on user creation')
    //     const errorCode = error.code
    //     const errorMessage = error.message
    // });

}

async function signInToFirebase() {
  signInWithEmailAndPassword(
    auth,
    userInput.value.email,
    userInput.value.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      store.setCurrentUser(user)
      router.push({ name: 'home'})
      // ...
    })
    .catch((error) => {
        console.log('error on login', error)
        //const errorCode = error.code
        //const errorMessage = error.message
    })
}



</script>

<style></style>