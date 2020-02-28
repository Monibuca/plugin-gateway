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
</style>
<template>
    <div class="layout" id="app">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu theme="dark" width="auto" :class="menuitemClasses" @on-select="selectPlugin">
                    <MenuItem :name="item.Name" v-for="item in plugins" :key="item.Name">
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
                    Monibuca {{engineInfo.Version}} 控制台 启动时间：{{engineInfo.StartTime}}
                </Header>
                <Content :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <component :is="'plugin-'+currentPlugin" />
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            isCollapsed: false,
            currentPlugin: null
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
        },
        collapsedSider() {
            this.$refs.side1.toggleCollapse();
        }
    }
};
</script>