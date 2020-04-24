import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const apiHost = Vue.prototype.apiHost = "//" + (process.env.NODE_ENV == "development" ? location.hostname + ":8081" : location.host)
const SoundFormat = {
  0: "Linear PCM, platform endian",
  1: "ADPCM",
  2: "MP3",
  3: "Linear PCM, little endian",
  4: "Nellymoser 16kHz mono",
  5: "Nellymoser 8kHz mono",
  6: "Nellymoser",
  7: "G.711 A-law logarithmic PCM",
  8: "G.711 mu-law logarithmic PCM",
  9: "reserved",
  10: "AAC",
  11: "Speex",
  14: "MP3 8Khz",
  15: "Device-specific sound"
};
const CodecID = {
  1: "JPEG (currently unused)",
  2: "Sorenson H.263",
  3: "Screen video",
  4: "On2 VP6",
  5: "On2 VP6 with alpha channel",
  6: "Screen video version 2",
  7: "AVC",
  12: "H265"
};
Vue.prototype.SoundFormat = function (soundFormat) {
  return SoundFormat[soundFormat];
}
Vue.prototype.CodecID = function (codec) {
  return CodecID[codec];
}
Vue.prototype.SoundRate = function (rate) {
  return rate > 1000 ? rate / 1000 + "kHz" : rate + "Hz";
}
let summaryES = null;
export default new Vuex.Store({
  state: {
    plugins: [],
    Address: location.hostname,
    NetWork: [],
    Rooms: [],
    Memory: {
      Used: 0,
      Usage: 0
    },
    CPUUsage: 0,
    HardDisk: {
      Used: 0,
      Usage: 0
    },
    Children: {},
    engineInfo: {},
  },
  mutations: {
    update(state, payload) {
      Object.assign(state, payload)
    },
  },
  actions: {
    fetchEngineInfo({ commit }) {
      return window.ajax.getJSON(apiHost + "/api/sysInfo").then(engineInfo => commit("update", { engineInfo }))
    },
    fetchPlugins({ commit }) {
      return window.ajax.getJSON(apiHost + "/api/plugins").then(plugins => {
        plugins.sort((a, b) => a.Name > b.Name ? 1 : -1)
        commit("update", { plugins })
        return plugins
      })
    },
    fetchSummary({ commit }) {
      summaryES = new EventSource(apiHost + "/api/summary");
      summaryES.onmessage = evt => {
        if (!evt.data) return;
        let summary = JSON.parse(evt.data);
        summary.Address = location.hostname;
        if (!summary.Rooms) summary.Rooms = [];
        summary.Rooms.sort((a, b) =>
          a.StreamPath > b.StreamPath ? 1 : -1
        );
        commit("update", summary)
      };
    },
  },
})
