<template>
    <div>
        <mu-data-table :columns="columns" :data="$store.state.Streams" :min-col-width="50">
            <template #expand="prop">
                <div>
                    <m-button @click="showCircle(prop.row)">缓冲环</m-button>
                    <m-button @click="snapshot(prop.row)">缓冲快照</m-button>
                    <m-button @click="videoTag(prop.row)">VideoTag</m-button>
                    <m-button @click="audioTag(prop.row)">AudioTag</m-button>
                    <slot v-bind="prop"/>
                </div>
            </template>
            <template #default="scope">
                <td class="is-center">{{scope.row.StreamPath}}</td>
                <td class="is-center">{{scope.row.Type||"await"}}</td>
                <td class="is-center">
                    <StartTime :value="scope.row.StartTime"></StartTime>
                </td>
                <td class="is-center">{{SoundFormat(scope.row.AudioInfo.SoundFormat)}}</td>
                <td class="is-center">{{SoundRate(scope.row.AudioInfo.SoundRate)}}</td>
                <td class="is-center">{{scope.row.AudioInfo.SoundType}}</td>
                <td class="is-center">{{CodecID(scope.row.VideoInfo.CodecID)}}</td>
                <td
                    class="is-center"
                >{{scope.row.VideoInfo.SPSInfo.Width}}x{{scope.row.VideoInfo.SPSInfo.Height}}</td>
                <td class="is-center">{{scope.row.VideoInfo.GOP}}</td>
                <td
                    class="is-center"
                >{{unitFormat(scope.row.AudioInfo.BPS)}}/{{unitFormat(scope.row.VideoInfo.BPS)}}</td>
                <td class="is-center">{{scope.row.SubscriberInfo.length}}</td>
            </template>
        </mu-data-table>
        <mu-dialog
            width="330"
            transition="slide-top"
            @close="onCloseDetail"
            :open.sync="showDetail"
        >
            <div>实时缓冲读写环</div>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="330" height="330">
                <filter id="track">
                    <feColorMatrix
                        type="matrix"
                        result="color"
                        values="
                    0 0 0 0  0
                    0 0 0 .9 0
                    0 0 0 .9 0
                    0 0 0 1  0
                    "
                    />
                    <feGaussianBlur in="color" stdDeviation="4" result="blur" />
                    <feOffset in="blur" dx="0" dy="0" result="offset" />
                    <feMerge>
                        <feMergeNode in="offset" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <circle r="5" cx="100" cy="115" fill="yellow" />
                <text x="120" y="120" fill="white">publisher</text>
                <circle r="5" cx="100" cy="130" fill="tomato" />
                <text x="120" y="135" fill="white">subscriber</text>
                <circle r="5" cx="100" cy="145" fill="#c52dd0" />
                <text x="120" y="150" fill="white">keyframe</text>
                <a @click="showSlider">
                    <text x="90" y="175" fill="wheat">最大显示个数：{{maxSubDetail}}</text>
                </a>
                <circle
                    stroke-dasharray="10 2"
                    :cx="offset"
                    :cy="offset"
                    :r="ringR"
                    stroke="cyan"
                    stroke-width="8"
                    fill="none"
                    filter="url(#track)"
                />
                <circle
                    v-for="(n,i) in currentRoomInfo"
                    :key="i"
                    fill="tomato"
                    r="5"
                    :cx="Math.sin((pubIndex-n)*Math.PI/ringR)*subR+offset"
                    :cy="Math.cos((pubIndex-n)*Math.PI/ringR)*subR+offset"
                />
                <circle
                    :cx="offset"
                    :cy="offset"
                    :r="gopR"
                    stroke="#40d3fcac"
                    stroke-width="20"
                    fill="none"
                />
                <path
                    stroke="#40d3fc"
                    stroke-width="20"
                    fill="none"
                    :d="'M' + (Math.sin(firstIndex*Math.PI/ringR)*gopR+offset) + ' ' + (Math.cos(firstIndex*Math.PI/ringR)*gopR+offset) + ' A' + gopR + ' ' + gopR + ' 0 '+ largeARCflag +' ' + 0 + ' ' +  (Math.sin(pubIndex*Math.PI/ringR)*gopR+offset)  + ' ' + (Math.cos(pubIndex*Math.PI/ringR)*gopR+offset) + ' '"
                />
                <circle
                    fill="#c52dd0"
                    r="5"
                    :cx="Math.sin(firstIndex*Math.PI/ringR)*pubR+offset"
                    :cy="Math.cos(firstIndex*Math.PI/ringR)*pubR+offset"
                />
                <circle
                    fill="yellow"
                    r="5"
                    :cx="Math.sin(pubIndex*Math.PI/ringR)*pubR+offset"
                    :cy="Math.cos(pubIndex*Math.PI/ringR)*pubR+offset"
                />
            </svg>
        </mu-dialog>
        <mu-dialog width="550" transition="slide-top" :open.sync="showSnapshot">
            <div>缓冲快照</div>
            <mu-data-table
                :columns="snapshotColumns"
                :data="snapshotData.slice((currentSnapshotPage-1)*10,currentSnapshotPage*10)"
            >
                <mu-pagination
                    slot="footer"
                    :total="snapshotData.length"
                    :current.sync="currentSnapshotPage"
                ></mu-pagination>
            </mu-data-table>
        </mu-dialog>
        <mu-dialog width="550" transition="slide-top" :open.sync="showTag">
            <pre>{{tagData}}</pre>
        </mu-dialog>
    </div>
</template>
        
        <script>
let es = null;
export default {
    data() {
        return {
            pubR: 120,
            gopR: 110,
            subR: 135,
            ringR: 128,
            offset: 140, //中心
            showDetail: false,
            showSnapshot: false,
            maxSubDetail: 5,
            currentRoom: null,
            pubIndex: 0,
            firstIndex: 0,
            lastIndex: 0,
            currentRoomInfo: [],
            currentSnapshotPage: 1,
            showTag: false,
            tagData: "",
            snapshotColumns: [
                {
                    title: "类型",
                    name: "Type",
                    formatter(value) {
                        return value == 8 ? "Audio" : "Video";
                    },
                    width: 90
                },
                { title: "字节数", name: "Size", width: 90 },
                {
                    title: "前14个字节",
                    name: "Payload",
                    formatter(value) {
                        return atob(value)
                            .split("")
                            .map(x => {
                                x = x
                                    .charCodeAt(0)
                                    .toString(16)
                                    .toUpperCase();
                                return x.length == 1 ? "0" + x : x;
                            })
                            .join(" ");
                    }
                }
            ],
            snapshotData: [],
            columns: [
                {
                    title: "StreamPath",
                    align: "center"
                },
                {
                    title: "类型",
                    align: "center"
                },
                {
                    title: "开始时间",
                    align: "center"
                },
                {
                    title: "音频格式",
                    align: "center"
                },
                {
                    title: "采样率",
                    align: "center"
                },
                {
                    title: "声道",
                    align: "center"
                },
                {
                    title: "视频格式",
                    align: "center"
                },
                {
                    title: "分辨率",
                    align: "center"
                },
                {
                    title: "GOP",
                    align: "center"
                },
                {
                    title: "码率A/V",
                    align: "center"
                },
                {
                    title: "订阅者",
                    align: "center"
                }
            ]
        };
    },
    methods: {
        showCircle(row) {
            this.showDetail = true;
            this.currentRoom = row;
            if (es) {
                es.close();
            }
            this.startListen();
        },
        onCloseDetail() {
            es.close();
        },
        startListen() {
            es = new EventSource(
                "/api/listenInfo?stream=" +
                    this.currentRoom.StreamPath +
                    "&max=" +
                    this.maxSubDetail
            );
            es.onmessage = evt => {
                let data = JSON.parse(evt.data);
                this.lastIndex = this.firstIndex;
                let ringSize = this.$store.state.engineInfo.RingSize - 8
                this.pubIndex = data[0] >> ringSize;
                this.firstIndex = data[1] >> ringSize;
                this.currentRoomInfo = data.slice(2).map(x => x >> ringSize);
            };
        },
        showSlider() {
            this.$confirm(
                h =>
                    h("mu-slider", {
                        props: {
                            value: this.maxSubDetail,
                            max: this.currentRoomInfo.length,
                            min: 1,
                            step: 1
                        },
                        on: {
                            change: v => {
                                this.maxSubDetail = v;
                            }
                        }
                    }),
                "修改最大显示个数"
            ).then(({ result }) => {
                if (result) {
                    es.close();
                    this.startListen();
                }
            });
        },
        snapshot(row) {
            this.showSnapshot = true;
            this.currentRoom = row;
            this.ajax
                .getJSON("/api/snapshot?stream=" + this.currentRoom.StreamPath)
                .then(data => (this.snapshotData = data));
        },
        audioTag(row) {
            this.showTag = true;
            this.currentRoom = row;
            this.ajax.get(
                "/api/tagRaw?stream=" + this.currentRoom.StreamPath + "&t=a",
                data => {
                    this.tagData = "";
                    data = new Uint8Array(data);
                    for (let j = 0; j < data.length; this.tagData += "\n") {
                        for (let i = 0; i < 16 && j < data.length; i++, j++) {
                            let x = data[j].toString(16).toUpperCase();
                            if (x.length == 1) x = "0" + x;
                            this.tagData += " " + x;
                        }
                    }
                },
                "arraybuffer"
            );
        },
        videoTag(row) {
            this.showTag = true;
            this.currentRoom = row;
            this.ajax.get(
                "/api/tagRaw?stream=" + this.currentRoom.StreamPath + "&t=v",
                data => {
                    this.tagData = "";
                    data = new Uint8Array(data);
                    for (let j = 0; j < data.length; this.tagData += "\n") {
                        for (let i = 0; i < 16 && j < data.length; i++, j++) {
                            let x = data[j].toString(16).toUpperCase();
                            if (x.length == 1) x = "0" + x;
                            this.tagData += " " + x;
                        }
                    }
                },
                "arraybuffer"
            );
        }
    },
    computed: {
        largeARCflag() {
            let d = this.pubIndex - this.firstIndex;
            if (d < 0) {
                d += 256;
            }
            return d > 128 ? 1 : 0;
        }
    },
    destroyed() {
        if (es) es.close();
    }
};
</script>
    <style lang="less" scoped>
.circle {
    width: 300px;
    height: 300px;
    position: relative;
    & div {
        color: darkslategray;
        position: absolute;
        &.publisher {
            color: yellow;
            text-shadow: 2px 2px 3px yellow, 2px -2px 3px yellow,
                -2px -2px 3px yellow, -2px 2px 3px yellow;
        }
        &.subscriber {
            color: cyan;
            text-shadow: 2px 2px 3px cyan, 2px -2px 3px cyan, -2px -2px 3px cyan,
                -2px 2px 3px cyan;
        }
    }
}
</style>