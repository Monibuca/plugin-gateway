<style scoped>
.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
}
.menu-icon {
    transition: all 0.3s;
}
.rotate-icon {
    transform: rotate(-90deg);
}
.menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width 0.2s ease 0.2s;
}
.menu-item i {
    transform: translateX(0px);
    transition: font-size 0.2s ease, transform 0.2s ease;
    vertical-align: middle;
    font-size: 16px;
}
.collapsed-menu span {
    width: 0px;
    transition: width 0.2s ease;
}
.collapsed-menu i {
    transform: translateX(5px);
    transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
    vertical-align: middle;
    font-size: 22px;
}
.plugin-container{
    display:flex;flex-wrap:wrap;
}
.plugin-container>*{
    margin: 10px;
}
pre{
    margin: 0;
}
</style>
<template>
    <Layout class="layout">
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
            <Menu theme="dark" width="auto" :class="menuitemClasses" @on-select="selectPlugin">
                <MenuItem name="#">
                    <span>插件列表</span>
                </MenuItem>
                <MenuItem
                    :name="item.Name"
                    v-for="item in plugins.filter(x=>x.UI)"
                    :key="item.Name"
                >
                    <span>{{item.Name}}</span>
                </MenuItem>
            </Menu>
        </Sider>
        <Layout>
            <Header :style="{padding: 0}" class="layout-header-bar">
                <Icon
                    @click.native="collapsedSider"
                    :class="rotateIcon"
                    :style="{margin: '0 20px'}"
                    type="md-menu"
                    size="24"
                ></Icon>
                Monibuca 控制台 引擎版本： v{{engineInfo.Version}} 启动时间：{{engineInfo.StartTime}}
            </Header>
            <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                <div v-if="currentPlugin=='#'" class="plugin-container">
                    <Card border v-for="item in plugins" :key="item.Name" :title="(item.UI?'📈':'🧩')+item.Name">
                        <div slot="extra">{{item.Version}}</div>
                        <pre>{{item.Config}}</pre>
                    </Card>
                </div>
                <component :is="'plugin-'+currentPlugin" v-else v-bind="currentConfig" />
            </Content>
        </Layout>
    </Layout>
</template>
<script>
import { mapActions, mapState } from "vuex";
import toml from "@iarna/toml";
export default {
    data() {
        return {
            isCollapsed: false,
            currentPlugin: "#",
            currentConfig: {}
        };
    },
    computed: {
        ...mapState({
            plugins: state => state.plugins,
            engineInfo: state => state.engineInfo
        }),
        rotateIcon() {
            return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
        },
        menuitemClasses() {
            return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
        }
    },
    mounted() {
        this.fetchEngineInfo();
        this.fetchPlugins();
    },
    methods: {
        ...mapActions(["fetchEngineInfo", "fetchPlugins"]),
        selectPlugin(name) {
            this.currentPlugin = name.toLowerCase();
            for (let i = 0; i < this.plugins.length; i++) {
                if (this.plugins[i].Name == name) {
                    this.currentConfig = toml.parse(this.plugins[i].Config);
                    break;
                }
            }
        },
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        }
    }
};
</script>