import Vue from 'vue'
import App from './App2.vue'
import store from './store'
import './plugins/iview'
import './plugins/muse-ui.js'
import StartTime from "./components/StartTime"
Vue.config.productionTip = false
window.Vue = Vue

const uintInc = {
  "": "K",
  K: "M",
  M: "G",
  G: null
};

function unitFormat(value, unit = "") {
  if (value > 1024 && uintInc[unit]) {
      return unitFormat(value / 1024, uintInc[unit]);
  }
  return value.toFixed(2).replace(".00", "") + unit + "B";
}
Vue.prototype.ajax = window.ajax
Vue.prototype.unitFormat = unitFormat
Vue.component('StartTime', StartTime)
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
