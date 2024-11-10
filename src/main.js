// Import global styles
import './assets/main.css'

// Import necessary libraries and components
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment-jalaali'
import { library } from '@fortawesome/fontawesome-svg-core'
import App from './App.vue'
import router from './router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import {
  faTrash,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faArrowLeft, faArrowRight)

const app = createApp(App)
app.use(createPinia())

// Register global components
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('VueDatePicker', VueDatePicker)

app.use(createPinia())
app.use(router)

app.config.globalProperties.$moment = moment

app.mount('#app')
