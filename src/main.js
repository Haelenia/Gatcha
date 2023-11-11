import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


import App from './App.vue'
import router from './router'
// the file we created above with `database`, `firestore` and other exports
import { firebaseApp } from './firebase'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    //defaultTheme: 'dark'
  }
})

app.use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  })

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')







