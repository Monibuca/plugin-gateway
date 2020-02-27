<template>
    <div>
        <Card title="system info">
            <i-circle
                dashboard
                :size="250"
                :trail-width="4"
                :stroke-width="5"
                :percent="Memory.Usage"
                :stroke-color="['#FF0000','#00FF00']"
            >
                <div class="demo-Circle-custom">
                    <h1>{{networkFormat(Memory.Used,"M")}}</h1>
                    <p>内存使用</p>
                    <span>
                        占总内存
                        <i>{{Memory.Usage.toFixed(2)}}%</i>
                    </span>
                </div>
            </i-circle>
            <i-circle
                dashboard
                :size="250"
                :trail-width="4"
                :stroke-width="5"
                :percent="HardDisk.Usage"
                :stroke-color="['#FF0000','#00FF00']"
            >
                <div class="demo-Circle-custom">
                    <h1>{{networkFormat(HardDisk.Used,"M")}}</h1>
                    <p>硬盘使用</p>
                    <span>
                        占总硬盘
                        <i>{{HardDisk.Usage.toFixed(2)}}%</i>
                    </span>
                </div>
            </i-circle>
            <i-circle :percent="CPUUsage" dashboard :stroke-color="['#FF0000','#00FF00']">
                <p>CPU使用率</p>
                <span style="font-size:24px">{{CPUUsage.toFixed(2)}}%</span>
            </i-circle>
            <Table :columns="netWorkColumns" :data="NetWork"></Table>
        </Card>
    </div>
</template>


<script>
import { TinyArea } from "@antv/g2plot";
import { mapActions, mapState } from "vuex";
let tinyAreaReceives = [];
let tinyAreaSents = [];
let tinyAreaReceiveData = [];
let tinyAreaSentData = [];
let eventSource = null;
const uintInc = {
    "": "K",
    K: "M",
    M: "G",
    G: null
};

export default {
    name: "home",
    data() {
        return {
            NetWork: [],
            CPUUsage: 0,
            HardDisk: {
                Used: 0,
                Usage: 0
            },
            Memory: {
                Used: 0,
                Usage: 0
            },
            netWorkColumns: [
                {
                    title: "接口",
                    render: (h, { row }) =>
                        h("ul", [
                            h("li", "name:" + row.Name),
                            h("li", "recv:" + networkFormat(row.ReceiveSpeed)) +
                                "/S",
                            h("li", "sent:" + networkFormat(row.SentSpeed)) +
                                "/S"
                        ])
                },
                {
                    title: "接收",
                    render(h, { index }) {
                        return h("div", {
                            attrs: {
                                id: "receive" + index
                            }
                        });
                    }
                },
                {
                    title: "发送",
                    render(h, { index }) {
                        return h("div", {
                            attrs: {
                                id: "sent" + index
                            }
                        });
                    }
                }
            ]
        };
    },
    methods: {
        networkFormat(value, unit = "") {
            if (value > 1024 && uintInc[unit]) {
                return this.networkFormat(value / 1024, uintInc[unit]);
            }
            return value.toFixed(2).replace(".00", "") + unit + "B";
        },
        ...mapActions(["fetchSummary", "stopFetchSummary"])
    },
    mounted() {
        this.fetchSummary();
    },
    computed: {
        ...mapState({
            Rooms: state => state.summary.Rooms || [],
            Memory: state => state.summary.Memory,
            CPUUsage: state => state.summary.CPUUsage,
            HardDisk: state => state.summary.HardDisk,
            NetWork: state => {
                state.summary.NetWork.forEach((item, index) => {
                    if (!tinyAreaReceiveData[index]) {
                        tinyAreaReceiveData[index] = [];
                    }
                    tinyAreaReceiveData[index].push({
                        index: new Date(),
                        value: item.ReceiveSpeed
                    });
                    if (tinyAreaReceiveData[index].length > 200) {
                        tinyAreaReceiveData[index].shift();
                    }
                    if (!tinyAreaSentData[index]) {
                        tinyAreaSentData[index] = [];
                    }
                    tinyAreaSentData[index].push({
                        index: new Date(),
                        value: item.SentSpeed
                    });
                    if (tinyAreaSentData[index].length > 200) {
                        tinyAreaSentData[index].shift();
                    }
                });
                this.$nextTick(function() {
                    for (let i = 0; i < this.NetWork.length; i++) {
                        if (tinyAreaReceives[i]) {
                            tinyAreaReceives[i].changeData(
                                tinyAreaReceiveData[i]
                            );
                        } else {
                            tinyAreaReceives[i] = new TinyArea(
                                document.getElementById("receive" + i),
                                {
                                    width: 200,
                                    height: 50,
                                    data: tinyAreaReceiveData[i],
                                    xField: "index",
                                    yField: "value"
                                }
                            );
                            tinyAreaReceives[i].render();
                        }
                        if (tinyAreaSents[i]) {
                            tinyAreaSents[i].changeData(tinyAreaSentData[i]);
                        } else {
                            tinyAreaSents[i] = new TinyArea(
                                document.getElementById("sent" + i),
                                {
                                    width: 200,
                                    height: 50,
                                    data: tinyAreaSentData[i],
                                    xField: "index",
                                    yField: "value"
                                }
                            );
                            tinyAreaSents[i].render();
                        }
                    }
                });
                return state.summary.NetWork;
            },
            // cpuStatus: state => {
            //     if (state.summary.CPUUsage > 99) return "error";
            //     return state.summary.CPUUsage > 50 ? "warning" : "success";
            // },
            // memoryStatus(state) {
            //     if (state.summary.CPUUsage > 99) return "error";
            //     return state.summary.CPUUsage > 50 ? "warning" : "success";
            // },
            // hardDiskStatus(state) {
            //     if (state.summary.CPUUsage > 99) return "error";
            //     return state.summary.CPUUsage > 50 ? "warning" : "success";
            // },
            totalInNetSpeed(state) {
                return (
                    this.networkFormat(
                        state.summary.NetWork
                            ? state.summary.NetWork.reduce(
                                  (aac, c) => aac + c.ReceiveSpeed,
                                  0
                              )
                            : 0
                    ) + "/S"
                );
            },
            totalOutNetSpeed(state) {
                return (
                    this.networkFormat(
                        state.summary.NetWork
                            ? state.summary.NetWork.reduce(
                                  (aac, c) => aac + c.SentSpeed,
                                  0
                              )
                            : 0
                    ) + "/S"
                );
            }
        })
    },
    destroyed() {
        tinyAreaReceiveData.length = 0;
        tinyAreaSentData.length = 0;
        tinyAreaReceives.forEach(_ => _.destroy());
        tinyAreaReceives.length = 0;
        tinyAreaSents.forEach(_ => _.destroy());
        tinyAreaSents.length = 0;
        eventSource.close();
        this.stopFetchSummary();
    }
};
</script>

<style lang="less">
.demo-Circle-custom {
    & h1 {
        color: #3f414d;
        font-size: 28px;
        font-weight: normal;
    }

    & p {
        color: #657180;
        font-size: 14px;
        margin: 10px 0 15px;
    }

    & span {
        display: block;
        padding-top: 15px;
        color: #657180;
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
        color: #3f414d;
    }
}
</style>