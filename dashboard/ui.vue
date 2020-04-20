<template>
    <div>
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
</template>


<script>
import { mapState } from "vuex";
export default {
    name: "home",
    data() {
        return {
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
            ]
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