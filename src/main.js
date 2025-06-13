import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'
import { registerSW } from 'virtual:pwa-register'

registerSW()

createApp(App).use(router).mount('#app')
