<template>
    <div>
        <mu-appbar class="title">
            <div style="display: flex;align-items: center;">
                <span class="doubleText">{{currentPluginData.Name}}</span>
                <mu-button icon color="primary" @click="getHelp">
                    <mu-icon value="help"></mu-icon>
                </mu-button>
                <mu-button icon color="primary" @click="showSettings">
                    <mu-icon value="settings"></mu-icon>
                </mu-button>
                <m-button
                    v-for="op in titleOps"
                    :key="op.label"
                    v-bind="op"
                >{{op.label}}</m-button>
                <mu-tabs v-if="titleTabs.length" :value.sync="titleTabActive" indicator-color="#80deea" inverse center>
                    <mu-tab v-for="op in titleTabs" :key="op">{{op}}</mu-tab>
                </mu-tabs>
            </div>
            <div slot="right">
                启动时间：
                <StartTime :value="engineInfo.StartTime"></StartTime>
            </div>
        </mu-appbar>
        <mu-drawer open width="200">
            <mu-appbar :z-depth="0">
                <div style="line-height:24px">
                    <img src="favicon.ico" width="24" style="vertical-align: top;" />onibuca
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
            <vue-markdown
                style="padding: 24px;"
                :source="currentPluginData.ReadMe"
                v-if="!currentPluginData.UIDir"
            />
            <component v-else ref="plugin" :is="currentPlugin" v-bind="currentConfig" />
        </div>
        <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
            <mu-appbar color="#009688AF" :title="currentPluginData.Name">
                <mu-button slot="left" icon @click="closeFullscreenDialog">
                    <mu-icon value="close"></mu-icon>
                </mu-button>
                <mu-button slot="right" flat @click="closeFullscreenDialog">Done</mu-button>
            </mu-appbar>
            <vue-markdown class="readme" :source="currentPluginData.ReadMe" />
        </mu-dialog>
        <mu-dialog width="360" transition="slide-bottom" :open.sync="openSettings">
            <template v-for="(item,key) in currentConfig">
                <template
                    v-if="currentPluginData.HotConfig && currentPluginData.HotConfig.includes(key)"
                >
                    <mu-switch
                        label-left
                        :label="key"
                        :key="key"
                        v-if="typeof item =='boolean'"
                        :input-value="item"
                        @change="v=>modifyConfig(key,v)"
                    ></mu-switch>
                    <mu-text-field
                        :label="key"
                        :key="key"
                        v-else
                        :value="item"
                        @change="v=>modifyConfig(key,v)"
                    ></mu-text-field>
                </template>
                <div v-else :key="key">{{key}}:{{item}}</div>
            </template>
        </mu-dialog>
    </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapState, mapMutations } from "vuex";
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
            titleTabActive: 0,
            titleTabs:[],
            titleOps:[]
        };
    },
    computed: {
        ...mapState({
            plugins: state => state.plugins,
            engineInfo: state => state.engineInfo
        }),
        currentPlugin() {
            return "plugin-" + this.currentPluginData.Name.toLowerCase();
        },
        currentConfig() {
            return this.currentPluginData.Config
                ? toml.parse(this.currentPluginData.Config)
                : {};
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
        this.fetchSummary();
    },
    methods: {
        ...mapActions(["fetchEngineInfo", "fetchPlugins", "fetchSummary"]),
        ...mapMutations(["update"]),
        closeFullscreenDialog() {
            this.openFullscreen = false;
        },
        selectPlugin(name) {
            this.titleTabActive = 0;
            this.titleTabs= []
            this.titleOps = []
            this.currentPluginData = this.plugins.find(x => x.Name == name);
        },
        getHelp() {
            this.openFullscreen = true;
        },
        showSettings() {
            this.openSettings = true;
        },
        modifyConfig(key, item) {
            this.ajax
                .get(
                    "/api/modifyConfig?name=" +
                        this.currentPluginData.Name +
                        "&key=" +
                        key +
                        "&value=" +
                        JSON.stringify([item])
                )
                .then(x => {
                    if (x == "success") {
                        let config = this.currentConfig;
                        config[key] = item;
                        this.currentPluginData.Config = toml.stringify(config);
                    }
                });
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
.doubleText {
    color: #000;
    text-shadow: 1px 1px #40d3fc, -1px -1px #40d3fc, 1px -1px #40d3fc,
        -1px 1px #40d3fc;
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
    box-shadow: 0 4px 12px #00bcd4;
    background-color: #73737369;
}
.ivu-modal-header-inner {
    color: #ffc107;
}
.ivu-modal-header {
    border-bottom: 2px groove #6f6f6f;
}
.ivu-modal-footer {
    border-top: unset;
}
</style>