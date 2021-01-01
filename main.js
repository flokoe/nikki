import App from './App.js'
import router from './router.js'

Vue.component('app', App)

new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  router: router,
  data: {
    //
  }
})
