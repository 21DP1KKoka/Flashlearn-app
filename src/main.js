import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)


axios.defaults.baseURL = import.meta.env.VITE_API_URL

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + ""
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
