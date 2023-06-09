import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from "@/config/vuetify"
import AxiosConfig from "@/config/AxiosConfig"
import LoginService from "@/service/LoginService"
import "@/config/custom-styles.css"
import vueDebounce from 'vue-debounce'
import '@mdi/font/css/materialdesignicons.css'


Vue.config.productionTip = false

Vue.use(vueDebounce)

const vue = new Vue({
  router, store, vuetify,
  render: h => h(App)
}).$mount('#app')

AxiosConfig.init(vue)

LoginService.checkSession(vue)
