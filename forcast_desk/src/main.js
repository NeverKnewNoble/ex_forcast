import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';


let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);


app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.mount('#app')
