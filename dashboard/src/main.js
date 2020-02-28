import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './plugins/iview.js'

Vue.config.productionTip = false
window.Vue = Vue
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
