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
        <mu-data-table v-else :columns="columns" :data="$store.state.Rooms" :min-col-width="50" @row-click="onClickRoom">
            <template slot-scope="scope">
                <td class="is-center">{{scope.row.StreamPath}}</td>
                <td class="is-center">{{scope.row.Type||"await"}}</td>
                <td class="is-center"><StartTime :value="scope.row.StartTime"></StartTime></td>
                <td class="is-center">{{SoundFormat(scope.row.AudioInfo.SoundFormat)}}</td>
                <td class="is-center">{{SoundRate(scope.row.AudioInfo.SoundRate)}}</td>
                <td class="is-center">{{scope.row.AudioInfo.SoundType}}</td>
                <td class="is-center">{{CodecID(scope.row.VideoInfo.CodecID)}}</td>
                <td class="is-center">{{scope.row.VideoInfo.SPSInfo.Width}}x{{scope.row.VideoInfo.SPSInfo.Height}}</td>
                <td class="is-center">{{unitFormat(scope.row.AudioInfo.BPS)}}/{{unitFormat(scope.row.VideoInfo.BPS)}}</td>
                <td class="is-center">{{scope.row.SubscriberInfo.length}}</td>
            </template>
        </mu-data-table>
        <mu-dialog width="300" transition="slide-bottom" :open.sync="showDetail">
            <div class="circle">
                <div v-for="n in 256" :key="n" :style="{top:(Math.cos(n*Math.PI*2/256)*128+128)+'px',left:(Math.sin(n*Math.PI*2/256)*128+128)+'px'}" :class="currentRoomInfo ? n==currentRoomInfo[0]?'publisher':currentRoomInfo.indexOf(currentRoomInfo[0]-n)!=-1?'subscriber':'':''">●</div>
            </div>
        </mu-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex";
let es = null
export default {
    name: "home",
    data() {
        return {
            active1: 0,
            showDetail: false,
            currentRoom:null,
            currentRoomInfo:null,
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
                    title: "房间",align: "center",
                },
                {
                    title: "类型",align: "center",
                },
                {
                    title: "开始时间",align: "center",
                },
                {
                    title: "音频格式",align: "center",
                },
                {
                    title: "采样率",align: "center",
                },
                {
                    title: "声道",align: "center",
                },
                {
                    title: "视频格式",align: "center",
                },
                {
                    title: "分辨率",align: "center",
                },
                {
                    title: "码率A/V",align: "center",
                },
                {
                    title: "订阅者",align: "center",
                }
            ]
        };
    },
    methods:{
        onClickRoom(index,row){
            this.showDetail=true
            this.currentRoom = row
            if(es){
                es.close()
            }
            es = new EventSource("/api/listenInfo?stream="+row.StreamPath)
            es.onmessage = evt=>{
                const data = evt.data.split(',')
                this.currentRoomInfo = data.map(x=>x|0)
            }
        }
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
    },
    destroyed(){
        es.close()
    }
};
</script>

<style lang="less">
.circle {
    width:300px;height:300px;position:relative;
    & div {
        color:darkslategray;
        position: absolute;
        &.publisher {
            color: yellow;
            text-shadow: 2px 2px 3px yellow,
            2px -2px 3px yellow,
            -2px -2px 3px yellow,
            -2px 2px 3px yellow;
        }
        &.subscriber{
            color:cyan;
            text-shadow: 2px 2px 3px cyan,
            2px -2px 3px cyan,
            -2px -2px 3px cyan,
            -2px 2px 3px cyan;
        }
    }
}
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