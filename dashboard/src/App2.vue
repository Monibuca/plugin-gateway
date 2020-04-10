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
            <div slot="right">
                启动时间：{{engineInfo.StartTime}}
            </div>
        </mu-appbar>
        <mu-drawer open width="200" :z-depth="0">
            <mu-appbar :z-depth="0">
                <div style="line-height:24px">Monibuca </div>
                <div style="font-size:10px;line-height:24px">{{'engine: v'+engineInfo.Version}}</div>
            </mu-appbar>
            <mu-divider></mu-divider>
            <mu-list :value="currentPluginData.Name" @change="selectPlugin">
                <mu-list-item :value="item.Name" button v-for="item in plugins" :key="item.Name">
                    <mu-list-item-title>{{(item.UI?'📈':'🧩')+item.Name}}</mu-list-item-title>
                    <mu-list-item-action>
                        <mu-badge :content="item.Version" />
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
        </mu-drawer>
        <mu-container style=" padding-left: 200px;padding-top:80px">
            <vue-markdown style="padding: 24px;" :source="currentPluginData.ReadMe" v-if="!currentPluginData.UI" />
            <component v-else ref="plugin" :is="currentPlugin" v-bind="currentConfig" />
        </mu-container>
        <mu-dialog width="360" transition="slide-bottom" fullscreen :open.sync="openFullscreen">
            <mu-appbar color="primary" :title="currentPluginData.Name">
                <mu-button slot="left" icon @click="closeFullscreenDialog">
                    <mu-icon value="close"></mu-icon>
                </mu-button>
                <mu-button slot="right" flat @click="closeFullscreenDialog">
                    Done
                </mu-button>
            </mu-appbar>
            <vue-markdown style="padding: 24px;" :source="currentPluginData.ReadMe" />
        </mu-dialog>
        <mu-dialog width="360" transition="slide-bottom" :open.sync="openSettings">
            <pre>{{currentPluginData.Config}}</pre>
        </mu-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueMarkdown from "vue-markdown";
import toml from "@iarna/toml";
const appStyle = new CSSStyleSheet();
const appCSSs = document.styleSheets;
for (var i = 0; i < appCSSs.length; i++) {
    for (var j = 0; j < appCSSs[i].cssRules.length; j++) {
        appStyle.insertRule(appCSSs[i].cssRules[j].cssText);
    }
}
window.appStyle = appStyle;
export default {
    components: {
        VueMarkdown
    },
    data() {
        return {
            openFullscreen: false,
            openSettings: false,
            currentPluginData: {}
        };
    },
    computed: {
        ...mapState({
            plugins: state => state.plugins,
            engineInfo: state => state.engineInfo
        }),
        currentPlugin() {
            return "plugin-" + this.currentPluginData.Name;
        },
        currentConfig() {
            return toml.parse(this.currentPluginData.Config);
        }
    },
    mounted() {
        this.fetchEngineInfo();
        this.fetchPlugins().then(() => this.selectPlugin("GateWay"));
    },
    methods: {
        ...mapActions(["fetchEngineInfo", "fetchPlugins"]),
        closeFullscreenDialog() {
            this.openFullscreen = false;
        },
        selectPlugin(name) {
            this.currentPluginData = this.plugins.find(x => x.Name == name);
            this.$nextTick(() => {
                this.$refs.plugin.shadowRoot.adoptedStyleSheets = [
                    window.appStyle
                ];
            });
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
</style>