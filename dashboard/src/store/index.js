import Vue from 'vue'
import Vuex from 'vuex'
import Summary from './summary'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    plugins: [],
    engineInfo:{},
  },
  mutations: {
    update(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    fetchEngineInfo(){
     return window.ajax.getJSON(this.gateWayHref(instance) + "/api/sysInfo").then(engineInfo => commit("update", { engineInfo }))
    },
    fetchPlugins({ commit }) {
      return window.ajax.getJSON("//" + location.host + "/api/plugins").then(plugins => commit("update", { plugins }))
    }
  },
  modules: {
    summary: Summary
  }
})
