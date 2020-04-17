import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.prototype.apiHost = "//" + (process.env.NODE_ENV == "development" ? location.hostname + ":8081" : location.host)
export default new Vuex.Store({
  state: {
    plugins: [],
    engineInfo: {},
  },
  mutations: {
    update(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    fetchEngineInfo({ commit }) {
      return window.ajax.getJSON(Vue.prototype.apiHost + "/api/sysInfo").then(engineInfo => commit("update", { engineInfo }))
    },
    fetchPlugins({ commit }) {
      return window.ajax.getJSON(Vue.prototype.apiHost + "/api/plugins").then(plugins => {
        plugins.sort((a, b) => a.Name > b.Name ? 1 : -1)
        commit("update", { plugins })
        return plugins
      })
    }
  },
})
