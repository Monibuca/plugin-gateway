<template>
    <div>
        <mu-appbar class="title">
            {{currentPluginData.Name}}
            <mu-button icon color="primary" @click="getHelp">
                <mu-icon value="help"></mu-icon>
            </mu-button>
            <mu-button icon color="primary" @click="showSettings">
                <mu-icon value="settings"></mu-icon>
            </mu-button>
            <mu-button flat v-for="item in menus" :key="item.label" color="primary" @click="item.action()">
                {{item.label}}
            </mu-button>
            <div slot="right">
                启动时间：{{engineInfo.StartTime}}
            </div>
        </mu-appbar>
        <mu-drawer open width="200">
            <mu-appbar :z-depth="0">
                <div style="line-height:24px"><img src="favicon.ico" width="24" style="    vertical-align: top;">onibuca
                </div>
                <div style="font-size:10px;line-height:24px">engine: {{engineInfo.Version}}</div>
            </mu-appbar>
            <mu-divider></mu-divider>
            <mu-list :value="currentPluginData.Name" @change="selectPlugin">
                <mu-list-item :value="item.Name" button v-for="item in plugins" :key="item.Name">
                    <mu-list-item-title>{{(item.UIDir?'📈':'🧩')+item.Name}}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-badge :content="item.Version.split('-')[0]" />
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
        </mu-drawer>
        <div style="padding:100px 20px 20px 220px">
            <vue-markdown style="padding: 24px;" :source="currentPluginData.ReadMe" v-if="!currentPluginData.UIDir" />
            <component v-else ref="plugin" :is="currentPlugin" v-bind="currentConfig" />
        </div>
        <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
            <mu-appbar color="#009688AF" :title="currentPluginData.Name">
                <mu-button slot="left" icon @click="closeFullscreenDialog">
                    <mu-icon value="close"></mu-icon>
                </mu-button>
                <mu-button slot="right" flat @click="closeFullscreenDialog">
                    Done
                </mu-button>
            </mu-appbar>
            <vue-markdown class="readme" :source="currentPluginData.ReadMe" />
        </mu-dialog>
        <mu-dialog width="360" transition="slide-bottom" :open.sync="openSettings">
            <pre>{{currentPluginData.Config}}</pre>
        </mu-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState } from "vuex";
import VueMarkdown from "vue-markdown";
import toml from "@iarna/toml";
// const appStyle = [];

export default {
    components: {
        VueMarkdown
    },
    data() {
        return {
            openFullscreen: false,
            openSettings: false,
            currentPluginData: {},
            menus: []
        };
    },
    watch: {},
    computed: {
        ...mapState({
            plugins: state => state.plugins,
            engineInfo: state => state.engineInfo
        }),
        currentPlugin() {
            return "plugin-" + this.currentPluginData.Name.toLowerCase();
        },
        currentConfig() {
            return toml.parse(this.currentPluginData.Config);
        }
    },
    mounted() {
        this.fetchEngineInfo();
        this.fetchPlugins().then(plugins => {
            for (let i = 0; i < plugins.length; i++) {
                if (plugins[i].UIDir) {
                    const pluginName =
                        "plugin-" + plugins[i].Name.toLowerCase();
                    Vue.component(pluginName, (resolve, reject) => {
                        let s = document.createElement("script");
                        s.setAttribute(
                            "src",
                            this.apiHost +
                                "/plugin/" +
                                plugins[i].Name +
                                "/" +
                                pluginName +
                                ".umd.min.js"
                        );
                        s.onload = function() {
                            resolve(window[pluginName]);
                        };
                        s.onerror = reject;
                        document.body.appendChild(s);
                    });
                    let linkTag = document.createElement("link");
                    linkTag.href =
                        this.apiHost +
                        "/plugin/" +
                        plugins[i].Name +
                        "/" +
                        pluginName +
                        ".css";
                    linkTag.setAttribute("rel", "stylesheet");
                    linkTag.setAttribute("type", "text/css");
                    document.head.appendChild(linkTag);
                }
            }
            this.selectPlugin("GateWay");
        });
        this.fetchSummary()
    },
    methods: {
        ...mapActions(["fetchEngineInfo", "fetchPlugins"]),
        closeFullscreenDialog() {
            this.openFullscreen = false;
        },
        selectPlugin(name) {
            this.currentPluginData = this.plugins.find(x => x.Name == name);
        },
        getHelp() {
            this.openFullscreen = true;
        },
        showSettings() {
            this.openSettings = true;
        }
    }
};
</script>

<style>
.title {
    position: fixed;
    left: 200px;
    right: 0;
    top: 0;
}
.plugin-container {
    display: flex;
    flex-wrap: wrap;
}
.plugin-container > * {
    margin: 10px;
}
@font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: url(assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNZ.ttf) format("truetype");
}

.material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
}
.readme {
    padding: 24px;
    overflow: auto;
    position: absolute;
    top: 64px;
    bottom: 0;
    left: 0;
    right: 0;
}
.ivu-modal-content {
   box-shadow: 0 4px 12px #00BCD4;
   background-color: #73737369;
}
.ivu-modal-header-inner {
    color: #ffc107;
}
.ivu-modal-header {
    border-bottom: 2px groove #6f6f6f;;
}
.ivu-modal-footer {
    border-top: unset;
}
</style>