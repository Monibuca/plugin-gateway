<template>
    <div>

        <div v-if="active1===0">
            <i-circle dashboard :size="250" :trail-width="4" :stroke-width="5" :percent="Memory.Usage"
                :stroke-color="['#c52dd0','#40d3fc']" trail-color="#000000">
                <div class="demo-Circle-custom">
                    <h1>{{unitFormat(Memory.Used,"M")}}</h1>
                    <p>内存使用</p>
                    <span>
                        占总内存
                        <i>{{Memory.Usage.toFixed(2)}}%</i>
                    </span>
                </div>
            </i-circle>
            <i-circle dashboard :size="250" :trail-width="4" :stroke-width="5" :percent="HardDisk.Usage"
                :stroke-color="['#c52dd0','#40d3fc']" trail-color="#000000">
                <div class="demo-Circle-custom">
                    <h1>{{unitFormat(HardDisk.Used,"M")}}</h1>
                    <p>硬盘使用</p>
                    <span>
                        占总硬盘
                        <i>{{HardDisk.Usage.toFixed(2)}}%</i>
                    </span>
                </div>
            </i-circle>
            <i-circle :percent="CPUUsage" dashboard trail-color="#000000" :stroke-color="['#c52dd0','#40d3fc']">
                <p>CPU使用率</p>
                <span style="font-size:24px">{{CPUUsage.toFixed(2)}}%</span>
            </i-circle>
            <mu-data-table :columns="netWorkColumns" :data="NetWork">
                <template slot-scope="scope">
                    <td>{{scope.row.Name}}</td>
                    <td>{{unitFormat(scope.row.ReceiveSpeed) + "/S"}}</td>
                    <td>{{unitFormat(scope.row.SentSpeed) + "/S"}}</td>
                </template>
            </mu-data-table>
        </div>
        <mu-data-table :columns="columns" :data="$store.state.Rooms" :min-col-width="50" @row-click="showDetail=true">
            <template slot-scope="scope">
                <td class="is-center">{{scope.row.StreamPath}}</td>
                <td class="is-center">{{scope.row.Type||"await"}}</td>
                <td class="is-center">
                    <StartTime :value="scope.row.StartTime"></StartTime>
                </td>
                <td class="is-center">{{SoundFormat(scope.row.AudioInfo.SoundFormat)}}</td>
                <td class="is-center">{{SoundRate(scope.row.AudioInfo.SoundRate)}}</td>
                <td class="is-center">{{scope.row.AudioInfo.SoundType}}</td>
                <td class="is-center">{{CodecID(scope.row.VideoInfo.CodecID)}}</td>
                <td class="is-center">{{scope.row.VideoInfo.SPSInfo.Width}}x{{scope.row.VideoInfo.SPSInfo.Height}}</td>
                <td class="is-center">{{scope.row.AudioInfo.PacketCount}}/{{scope.row.VideoInfo.PacketCount}}</td>
                <td class="is-center">{{scope.row.SubscriberInfo.length}}</td>
            </template>
        </mu-data-table>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "home",
    data() {
        return {
            active1: 0,
            showDetail: false,
            netWorkColumns: [
                {
                    title: "接口",
                    name: "Name"
                },
                {
                    title: "接收",
                    name: "ReceiveSpeed"
                },
                {
                    title: "发送",
                    name: "SentSpeed"
                }
            ],
            columns: [
                {
                    title: "房间",
                    name: "StreamPath",
                    sortable: true
                },
                {
                    title: "类型",
                    name: "Type",
                    sortable: true
                },
                {
                    title: "开始时间",
                    name: "StartTime",
                    sortable: true
                },
                {
                    title: "音频格式",
                    name: "AudioInfo"
                },
                {
                    title: "采样率",
                    name: "AudioInfo"
                },
                {
                    title: "声道",
                    name: "AudioInfo"
                },
                {
                    title: "视频格式",
                    name: "VideoInfo"
                },
                {
                    title: "分辨率",
                    name: "VideoInfo"
                },
                {
                    title: "数据包",
                    name: ""
                },
                {
                    title: "订阅者",
                    name: "Subscribes"
                }
            ]
        };
    },
    mounted() {
        const _this = this;
        this.$parent.pluginAppbar = {
            data() {
                return {
                    active1: 0
                };
            },
            watch: {
                active1(v) {
                    _this.active1 = v;
                }
            },
            template: `
            <mu-tabs :value.sync="active1" indicator-color="#80deea" inverse center>
            <mu-tab>服务器状态</mu-tab>
            <mu-tab>房间列表</mu-tab>
        </mu-tabs>`
        };
    },
    computed: {
        ...mapState([
            "Address",
            "NetWork",
            "Rooms",
            "Memory",
            "CPUUsage",
            "HardDisk",
            "Children"
        ]),
        totalInNetSpeed() {
            return (
                this.unitFormat(
                    this.NetWork
                        ? this.NetWork.reduce(
                              (aac, c) => aac + c.ReceiveSpeed,
                              0
                          )
                        : 0
                ) + "/S"
            );
        },
        totalOutNetSpeed() {
            return (
                this.unitFormat(
                    this.NetWork
                        ? this.NetWork.reduce((aac, c) => aac + c.SentSpeed, 0)
                        : 0
                ) + "/S"
            );
        }
    }
};
</script>

<style lang="less">
.demo-Circle-custom {
    & h1 {
        color: #feeb73;
        font-size: 28px;
        font-weight: normal;
    }

    & p {
        color: #d11b58;
        font-size: 14px;
        margin: 10px 0 15px;
    }

    & span {
        display: block;
        padding-top: 15px;
        color: #d11b58;
        font-size: 14px;

        & :before {
            content: "";
            display: block;
            width: 50px;
            height: 1px;
            margin: 0 auto;
            background: #e0e3e6;
            position: relative;
            top: -15px;
        }
    }
    & span i {
        font-style: normal;
        color: #feeb73;
    }
}
</style>