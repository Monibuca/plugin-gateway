<template>
    <div>
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
    </div>
</template>


<script>
let summaryES = null;
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
            netWorkColumns: [
                {
                    title: "接口",
                    key: "Name"
                },
                {
                    title: "接收",
                    render: (h, { row }) =>
                        h("div", this.networkFormat(row.ReceiveSpeed)+ "/S")
                },
                {
                    title: "发送",
                    render: (h, { row }) =>
                        h("div", this.networkFormat(row.SentSpeed)+ "/S")
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
        fetchSummary() {
            summaryES = new EventSource("//" + location.host + "/api/summary");
            summaryES.onmessage = evt => {
                if (!evt.data) return;
                let summary = JSON.parse(evt.data);
                summary.Address = location.hostname;
                if (!summary.Rooms) summary.Rooms = [];
                summary.Rooms.sort((a, b) =>
                    a.StreamPath > b.StreamPath ? 1 : -1
                );
                for (let name in summary) {
                    this[name] = summary[name];
                }
            };
        }
    },
    mounted() {
        this.fetchSummary();
    },
    computed: {
        totalInNetSpeed() {
            return (
                this.networkFormat(
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
                this.networkFormat(
                    this.NetWork
                        ? this.NetWork.reduce((aac, c) => aac + c.SentSpeed, 0)
                        : 0
                ) + "/S"
            );
        }
    },
    destroyed() {
        summaryES.close();
    }
};
</script>

<style lang="less">
@import url("//unpkg.com/view-design/dist/styles/iview.css");
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