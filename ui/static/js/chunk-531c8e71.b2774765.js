(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-531c8e71"],{"0cba":function(e,t,i){"use strict";i("1b04")},"11b6":function(e,t,i){},"14e3":function(e,t,i){"use strict";i("4a20")},"1b04":function(e,t,i){},"4a20":function(e,t,i){},"6b39":function(e,t,i){"use strict";i("11b6")},a7ca:function(e,t,i){"use strict";var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"player-wrap"},[i("div",{ref:"container",attrs:{id:"container"}})])},r=[],a=(i("8e6e"),i("ac6a"),i("456d"),i("bd86")),s=i("2f62"),c=(i("4ec3"),i("ed08"));function o(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function l(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?o(Object(i),!0).forEach((function(t){Object(a["a"])(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):o(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var u={name:"JessicaPlayer",jessibuca:null,data:function(){return{}},props:{streamPath:{type:String,default:""},fullPath:{type:String,default:""}},computed:l({},Object(s["b"])({plugins:function(e){return e.plugins}})),mounted:function(){this.create()},methods:{create:function(){var e=this,t=new window.Jessibuca({container:this.$refs.container,forceNoOffscreen:!0,videoBuffer:.2,loadingText:"加载中"});t.onLog=function(e){return console.error(e)},t.hasLoaded()?(this.play(),this.$emit("doPlayed")):t.onLoad=function(){e.play(),e.$emit("doPlayed")},t.on("timeout",(function(){console.log("timeout"),e.$message({type:"error",message:"播放超时"})})),this.$options.jessibuca=t},play:function(){if(this.streamPath){var e=Object(c["h"])(),t=e+this.streamPath;this.$options.jessibuca&&this.$options.jessibuca.play(t),this.$options.jessibuca.cancelMute()}else this.fullPath&&(this.$options.jessibuca&&this.$options.jessibuca.play(this.fullPath),this.$options.jessibuca.cancelMute())}},destroyed:function(){this.$options.jessibuca&&this.$options.jessibuca.destroy()}},h=u,d=(i("6b39"),i("2877")),p=Object(d["a"])(h,n,r,!1,null,"48902910",null);t["a"]=p.exports},caae:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container"},[i("el-row",{attrs:{gutter:10}},[i("el-col",{attrs:{span:6}},[i("el-tree",{staticClass:"tree-block",attrs:{"default-expand-all":"","highlight-current":"","expand-on-click-node":!1,"node-key":"uuid",data:e.treeList,props:{children:"children",label:"label"}},on:{"node-click":e.onTreeNodeSelect}})],1),e._v(" "),i("el-col",{attrs:{span:18}},[i("el-input",{staticStyle:{"margin-bottom":"10px",display:"inline-block",width:"300px"},attrs:{size:"mini",placeholder:"搜索关键词"},model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}}),e._v(" "),i("el-table",{staticStyle:{width:"100%"},attrs:{data:e.gb28181ChannelShowPageList,fit:"",border:""}},[i("el-table-column",{attrs:{prop:"DeviceID",label:"通道编号",width:"180"}}),e._v(" "),i("el-table-column",{attrs:{prop:"Name",label:"名称",width:"180"}}),e._v(" "),i("el-table-column",{attrs:{prop:"Manufacturer",label:"厂商"}}),e._v(" "),i("el-table-column",{attrs:{prop:"Address",label:"地址"}}),e._v(" "),i("el-table-column",{attrs:{prop:"Status",label:"状态"}}),e._v(" "),i("el-table-column",{attrs:{fixed:"right",label:"操作",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(i){return e.onPlay(t.row)}}},[e._v("播放")])]}}])})],1),e._v(" "),i("el-pagination",{staticStyle:{"margin-top":"10px"},attrs:{background:"","hide-on-single-page":"",layout:"prev, pager, next","current-page":e.currentPage,total:e.gb28181ChannelShowList.length},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t}}})],1)],1),e._v(" "),i("el-dialog",{attrs:{title:e.dialogTitle,"show-close":!1,"before-close":e.onCloseRecordsDialog,visible:e.dialogVisible,width:"1500px"},on:{"update:visible":function(t){e.dialogVisible=t}}},[e.dialogVisible&&e.tempRecordSearch.id?[i("records",{attrs:{"record-search":e.tempRecordSearch}})]:e._e(),e._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.onCloseRecordsDialog}},[e._v("关 闭")])],1)],2)],1)},r=[],a=(i("8e6e"),i("456d"),i("bd86")),s=(i("ac6a"),i("2f62")),c=i("ed08"),o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"record-wrap"},[i("div",{staticClass:"record-player"},[i("div",{staticClass:"record-time-select"},[i("el-date-picker",{staticStyle:{width:"330px"},attrs:{type:"datetimerange",size:"small","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",clearable:!1,"value-format":"timestamp","picker-options":e.pickerOptions,placeholder:"选择日期"},on:{change:e.onSearchTimeChange},model:{value:e.searchTimeRange,callback:function(t){e.searchTimeRange=t},expression:"searchTimeRange"}})],1),e._v(" "),e.recordList.length>0&&e.hasInitMinute?[e.recordSP?i("jessibuca-player",{key:e.recordSP,attrs:{"stream-path":e.recordSP},on:{doPlayed:e.handlePlayed}}):i("p",{staticStyle:{"text-align":"center"}},[e._v("初始化...")])]:e._e()],2),e._v(" "),i("div",{staticClass:"record-time-list"},[e.dayList.length>0?i("div",{staticClass:"record-time-list-scroll",style:{width:e.dayWidth+"px"}},[e._l(e.dayList,(function(t){return[i("div",{staticClass:"record-time"},[i("div",{staticClass:"record-time-tip"},[e._v("\n            "+e._s(e._f("parseTimeFilter")(t.day,"{y}-{m}-{d}"))+"\n          ")]),e._v(" "),i("div",{ref:"timeDay",refInFor:!0,staticClass:"time-day"},[e._l(t.minuteList,(function(n){return i("div",{staticClass:"time-minute",class:{active:n.hasRecord},attrs:{title:n.title},on:{click:function(i){return e.onMinuteClick(n,t.day)}}})})),e._v(" "),e._l(e.hourList,(function(t){return i("div",{staticClass:"time-text"},[e._v("\n              "+e._s(t.title)+"\n            ")])}))],2)])]})),e._v(" "),e.playTime.now?i("div",{staticClass:"time-cursor",style:e.playTimeStyle},[i("div",{staticClass:"time-cursor-text"},[e.isPlayTimeMoving?[e._v("\n            "+e._s(e.playMoveTime)+"\n          ")]:[e._v("\n            "+e._s(e._f("parseTimeFilter")(e.playTime.now,"{h}:{i}:{s}"))+"\n          ")]],2)]):e._e()],2):e._e()])])},l=[],u=(i("6b54"),i("a481"),i("96cf"),i("3b8d")),h=(i("7514"),i("a7ca")),d=i("4ec3");function p(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function m(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?p(Object(i),!0).forEach((function(t){Object(a["a"])(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):p(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var f=(new Date).getTime(),y=f-5184e5;function b(){for(var e=[],t=1;t<1440;t++)e.push({title:Object(c["b"])(t),timestamp:t,endTimestamp:"",hasRecord:!1});return e}function v(){for(var e=[],t=0;t<24;t++){var i=t+":00";i<10&&(i="0"+i),e.push({title:i,timestamp:t+1})}return e}f=Object(c["i"])(f).end,y=Object(c["i"])(f).start;var g=null,T=null,O={name:"Record",props:{recordSearch:{type:Object,default:function(){return{}}}},data:function(){return{id:"",channel:"",hasInitMinute:!1,hasQuery:!1,searchTimeRange:[y,f],dayList:[],minuteList:b(),hourList:v(),playTime:{start:"",end:"",now:""},isPlaying:!1,pickerOptions:{onPick:function(e){if(e.maxDate)g=T=null;else{var t=5184e5;g=e.minDate.getTime()-t,T=e.minDate.getTime()+t}},disabledDate:function(e){return g&&T?e.getTime()<g||e.getTime()>T:e.getTime()>Date.now()}},recordSP:null,isPlayTimeMoving:!1,playTimeOffset:0,loading:!1}},created:function(){this.channel=this.recordSearch.deviceId,this.id=this.recordSearch,this.init()},timeInterval:null,components:{JessibucaPlayer:h["a"]},watch:{recordList:function(){!this.hasInitMinute&&this.hasQuery&&(this.hasInitMinute=!0,this.updateMinuteList())}},computed:m(m({},Object(s["b"])({gb28181List:function(e){return e.Gb28181List},gb28181ChannelList:function(e){var t=[];return e.Gb28181List.forEach((function(e){var i=e.Channels||[];i.length>0&&(t=t.concat(i.map((function(t){return t.id=e.ID,t.deviceId=t.DeviceID,t}))))})),t}})),{},{gb28181Channel:function(){var e=this;return this.gb28181ChannelList.find((function(t){return t.deviceId===e.recordSearch.deviceId&&t.id===e.recordSearch.id}))},recordList:function(){var e=[];if(this.gb28181Channel){var t=this.gb28181Channel.Records||[];e=t.map((function(e){var t=new Date(e.StartTime).getTime(),i=new Date(e.EndTime).getTime(),n=i-t,r=Object(c["q"])(t),a=Object(c["q"])(i);return e._startTime=t/1e3>>0,e._endTime=i/1e3>>0,e.timeLength=Math.floor(n/1e3/60%60),e.startTime=r,e.endTime=a,e.startTimestamp=t,e.endTimestamp=i,e}))}return e},playTimeStyle:function(){var e=0;if(this.isPlayTimeMoving)e=this.playTimeOffset;else if(this.playTime.now){var t=this.searchTimeRange[0],i=Object(c["m"])(t,this.playTime.now),n=i.length,r=new Date(this.playTime.now),a=r.getHours(),s=r.getMinutes();e=60*a+s+1439*(n-1)}var o={left:e+"px"};return o},playMoveTime:function(){return Object(c["b"])(this.playTimeOffset)},dayWidth:function(){return 1440*this.dayList.length}}),methods:{init:function(){if(this.gb28181Channel){var e=this.gb28181Channel.RecordStartTime,t=this.gb28181Channel.RecordEndTime;if(e&&t){var i=this.getSearchTimeRange();i.start===e&&i.end===t?(this.hasQuery=!0,this.hasInitMinute||(this.hasInitMinute=!0,this.initDayList(),this.updateMinuteList())):this.onSearchTimeChange()}else this.onSearchTimeChange()}else this.onSearchTimeChange()},fetchList:function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(){var t,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.hasQuery=!1,this.hasInitMinute=!1,this.playTime.now="",t=this.getSearchTimeRange(),i={id:this.recordSearch.id,channel:this.recordSearch.deviceId,startTime:t.start,endTime:t.end},e.next=7,Object(d["s"])(i);case 7:this.hasQuery=!0;case 8:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),getSearchTimeRange:function(){var e=this.searchTimeRange[0],t=this.searchTimeRange[1],i=new Date(e+288e5).toISOString(),n=new Date(t+288e5).toISOString();return{start:i.replace(".000Z",""),end:n.replace(".000Z","")}},initDayList:function(){this.dayList=[];var e=this.searchTimeRange[0],t=this.searchTimeRange[1],i=Object(c["m"])(e,t),n=[];i.forEach((function(e){var t={day:e,minuteList:b()};n.push(t)})),this.dayList=n},onSearchTimeChange:function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.initDayList(),e.next=4,this.fetchList();case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),updateDayList:function(){},updateMinuteList:function(){var e=this;this.playTime.start="",this.playTime.now="",this.playTime.endTime="",this.dayList.forEach((function(t){var i=t.day;t.minuteList.forEach((function(t){var n=e.formatMinuteItemTimestamp(t,i);e.recordList.forEach((function(r){r.startTimestamp<=n&&r.endTimestamp>n&&(t.hasRecord=!0,t.endTimestamp=r.endTimestamp,e.playTime.start||(Object(c["p"])(r.startTimestamp,i)?e.playTime.start=r.startTimestamp:e.playTime.start=Object(c["i"])(i).start,e.playTime.end=r.endTimestamp))}))}))})),this.playTime.start&&this.play()},formatMinuteItemTimestamp:function(e,t){var i=Math.floor(e.timestamp/60)%60,n=Math.floor(e.timestamp%60),r=new Date(t).setHours(i,n,0,0);return r},onStartMove:function(e){this.isPlayTimeMoving=!0,this.updatePlayTimeOffset(e)},onDoingMove:function(e){this.isPlayTimeMoving&&this.updatePlayTimeOffset(e)},onStopMove:function(e){if(this.isPlayTimeMoving){var t=this.minuteList[this.playTimeOffset];t&&this.onMinuteClick(t),this.isPlayTimeMoving=!1,this.playTimeOffset=0}},updatePlayTimeOffset:function(e){var t=this.getTimeRect(),i=e.clientX-t.left;this.playTimeOffset=parseInt(i,10)},getTimeRect:function(){var e=this.$refs.timeDay;return e.getBoundingClientRect()},onMinuteClick:function(e,t){if(e.hasRecord){var i=this.formatMinuteItemTimestamp(e,t);this.playTime.start=i,this.playTime.end=e.endTimestamp,this.play()}},play:function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={id:this.recordSearch.id,channel:this.recordSearch.deviceId,startTime:this.playTime.start/1e3>>0,endTime:this.playTime.end/1e3>>0},e.prev=2,e.next=5,Object(d["q"])(t);case 5:this.recordSP="".concat(t.id,"/").concat(this.recordSearch.deviceId,"/").concat(t.startTime,"-").concat(t.endTime),e.next=11;break;case 8:e.prev=8,e.t0=e["catch"](2),console.error(e.t0);case 11:this.playTime.now=this.playTime.start;case 12:case"end":return e.stop()}}),e,this,[[2,8]])})));function t(){return e.apply(this,arguments)}return t}(),handlePlayed:function(){this.clearInterval(),this.intervalPlayTime()},stop:function(){var e=Object(u["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.clearInterval(),this.isPlaying=!1,e.abrupt("return",Object(d["c"])({id:this.recordSearch.id,channel:this.recordSearch.deviceId,live:!1}));case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),intervalPlayTime:function(){var e=this;this.isPlaying=!0,this.$options.timeInterval=setInterval((function(){e.playTime.now+=1e3,e.checkPlayNext()}),1e3)},checkPlayNext:function(){var e=this;if(this.playTime.now===this.playTime.end){var t=Object(c["i"])(this.playTime.now),i=this.dayList.find((function(e){return e.day===t.start})),n=i.minuteList.find((function(t){var i=e.formatMinuteItemTimestamp(t);return t.hasRecord&&e.playTime.end<=i}));n&&(this.playTime.start=this.formatMinuteItemTimestamp(n),this.playTime.end=n.endTimestamp,this.playTime.now=this.playTime.start,this.play())}},clearInterval:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(){this.$options.timeInterval&&(clearInterval(this.$options.timeInterval),this.$options.timeInterval=null)}))},destroyed:function(){try{this.stop()}catch(e){}}},w=O,j=(i("0cba"),i("2877")),P=Object(j["a"])(w,o,l,!1,null,"5bad96a0",null),S=P.exports;function I(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,n)}return i}function L(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?I(Object(i),!0).forEach((function(t){Object(a["a"])(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):I(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var C={name:"recordIndex",data:function(){return{dialogVisible:!1,searchKey:"",treeList:[],gb28181ChannelList:[],selectId:"",tempRecordSearch:{id:null,deviceId:null,title:""},currentPage:1}},components:{Records:S},watch:{gb28181List:{handler:function(e){if(e&&e.length>0&&0===this.treeList.length){var t={uuid:Object(c["t"])(),label:"设置列表",id:"",children:e.map((function(e){return{uuid:Object(c["t"])(),id:e.id,label:e.label}}))};this.treeList=[t];var i=[];e.forEach((function(e){i=i.concat(e.children)})),this.gb28181ChannelList=i}},immediate:!0}},computed:L(L({},Object(s["b"])({gb28181List:function(e){return e.Gb28181List.map((function(e){var t={uuid:Object(c["t"])(),id:e.ID,label:e.ID,children:[]};return t.children=(e.Channels||[]).map((function(t,i){var n=L({uuid:Object(c["t"])(),id:e.ID,deviceId:t.DeviceID,label:t.Name,isChannel:!0},t);return n})),t}))}})),{},{gb28181ChannelShowList:function(){var e=this;return this.gb28181ChannelList.filter((function(t){return(e.selectId&&t.id===e.selectId||""===e.selectId)&&(""===e.searchKey.trim()||t.Name&&-1!==t.Name.indexOf(e.searchKey))}))},gb28181ChannelShowPageList:function(){return this.gb28181ChannelShowList.slice(10*(this.currentPage-1),10*this.currentPage)},dialogTitle:function(){return"查看录像-"+this.tempRecordSearch.title}}),methods:{onTreeNodeSelect:function(e){this.selectId=e.id||"",this.searchKey=""},onPlay:function(e){this.tempRecordSearch.id=e.id,this.tempRecordSearch.deviceId=e.deviceId,this.tempRecordSearch.title=e.Name+"("+e.deviceId+")",this.dialogVisible=!0},onCloseRecordsDialog:function(){var e=this;this.dialogVisible=!1,this.$nextTick((function(){e.tempRecordSearch.id=null,e.tempRecordSearch.deviceId=null,e.tempRecordSearch.title=""}))}}},R=C,D=(i("14e3"),Object(j["a"])(R,n,r,!1,null,"53ee6778",null));t["default"]=D.exports}}]);