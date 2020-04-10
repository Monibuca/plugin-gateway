import Vue from 'vue'
import App from './App2.vue'
import store from './store'
import './plugins/iview'
import './plugins/muse-ui.js'
Vue.config.productionTip = false
window.Vue = Vue
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
