import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#007BFF',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',

        'lonjas-base': '#1b1b31',
        'lonjas-base-2': '#85586F',

        'dark-1': '#2e3141',
        'dark-2': '#333443',
        'dark-3': '#2c2b3a',
        'dark-4': '#232530',
        'dark-5': '#0f0c19'

      }
    }
  }
})