import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './config/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import "@/config/custom-styles.css"
import AxiosConfig from "@/config/AxiosConfig"
import '@mdi/font/css/materialdesignicons.css'
import LangModule from "@/store/LangModule"
import { getModule } from "vuex-module-decorators"
import VueDebounce from "vue-debounce"

Vue.config.productionTip = false

let vue: Vue

AxiosConfig.init(vue!)
getModule(LangModule).loadLanguage()
Vue.use(VueDebounce)

vue = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')