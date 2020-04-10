import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const host = process.env.NODE_ENV == "development" ? location.hostname + ":8081" : location.host
export default new Vuex.Store({
  state: {
    plugins: [],
    engineInfo: {},
    apiHost: host
  },
  mutations: {
    update(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    fetchEngineInfo({ commit }) {
      return window.ajax.getJSON("//" + host + "/api/sysInfo").then(engineInfo => commit("update", { engineInfo }))
    },
    fetchPlugins({ commit }) {
      return window.ajax.getJSON("//" + host + "/api/plugins").then(plugins => {
        commit("update", { plugins })
        for (let i = 0; i < plugins.length; i++) {
          let s = document.createElement('script')
          s.innerHTML = plugins[i].UI
          document.body.appendChild(s)
        }
      })
    }
  },
})
