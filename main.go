package gateway

import (
	"bytes"
	"context"
	"encoding/json"
	"io/ioutil"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strconv"
	"time"

	"github.com/BurntSushi/toml"
	. "github.com/Monibuca/engine/v3"
	"github.com/Monibuca/utils/v3"
	"github.com/Monibuca/utils/v3/codec"
	. "github.com/logrusorgru/aurora"
)

var (
	config struct {
		ListenAddr    string
		CertFile      string
		KeyFile       string
		ListenAddrTLS string
		StaticPath    string
	}
	startTime = time.Now()
)

func init() {
	plugin := &PluginConfig{
		Name:   "GateWay",
		Config: &config,
		Run:    run,
	}
	InstallPlugin(plugin)
}
func run() {
	http.HandleFunc("/api/gateway/sysInfo", sysInfo)
	http.HandleFunc("/api/gateway/stop", stopPublish)
	http.HandleFunc("/api/gateway/config", getConfig)
	http.HandleFunc("/api/gateway/plugins", getPlugins)
	// http.HandleFunc("/api/gateway/listenInfo", listenInfo)
	// http.HandleFunc("/api/snapshot", snapshot)
	// http.HandleFunc("/api/gateway/tagRaw", tagRaw)
	http.HandleFunc("/api/gateway/modifyConfig", modifyConfig)
	http.HandleFunc("/api/gateway/getIFrame", getIFrame)
	http.HandleFunc("/api/gateway/h264", getH264)
	if config.StaticPath != "" {
		http.HandleFunc("/", website)
	}
	utils.Print(Green("server gateway start at "), BrightBlue(config.ListenAddr), BrightBlue(config.ListenAddrTLS))
	utils.ListenAddrs(config.ListenAddr, config.ListenAddrTLS, config.CertFile, config.KeyFile, nil)
}

func getConfig(w http.ResponseWriter, r *http.Request) {
	w.Write(ConfigRaw)
}

// 输出h264裸码流
func getH264(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		p := Subscriber{
			Type: "h264 raw",
			OnVideo: func(pack VideoPack) {
				for _, nalu := range pack.NALUs {
					w.Write(codec.NALU_Delimiter2)
					w.Write(nalu)
				}
			},
			Ctx2: r.Context(),
		}
		if l := r.URL.Query().Get("len"); l != "" {
			s, _ := strconv.Atoi(l)
			p.Ctx2, _ = context.WithTimeout(p.Ctx2, time.Duration(s))
		}
		if p.Subscribe(streamPath) == nil {
			vt := p.WaitVideoTrack("h264")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Transfer-Encoding", "chunked")
			for _, nalu := range vt.ExtraData.NALUs {
				w.Write(codec.NALU_Delimiter2)
				w.Write(nalu)
			}
			p.PlayVideo(vt)
			return
		}
	}
	w.WriteHeader(404)
}
func stopPublish(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if s := FindStream(streamPath); s != nil {
			s.Close()
			w.Write([]byte("success"))
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}
func website(w http.ResponseWriter, r *http.Request) {
	filePath := r.URL.Path
	if filePath == "/" {
		filePath = "/index.html"
	}
	if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
		w.Header().Set("Content-Type", mime)
	}
	if f, err := ioutil.ReadFile(config.StaticPath + filePath); err == nil {
		if _, err = w.Write(f); err != nil {
			w.WriteHeader(505)
		}
	} else {
		w.Header().Set("Location", "/")
		w.WriteHeader(302)
	}
}

func getIFrame(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		// codec := r.URL.Query().Get("codec")
		if s := FindStream(streamPath); s != nil {
			if v := s.WaitVideoTrack(); v != nil {
				w.Write(v.ExtraData.Payload[5:])
				idr := v.Buffer.GetAt(v.IDRIndex)
				b := make([]byte, 4)
				utils.BigEndian.PutUint32(b, uint32(len(idr.NALUs[0])))
				w.Write(b)
				w.Write(idr.NALUs[0])
			} else {
				w.Write([]byte("no h264 stream"))
			}
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}

func sysInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	bytes, err := json.Marshal(map[string]string{"Version": Version, "StartTime": StartTime.Format("2006-01-02 15:04:05")})
	if err == nil {
		_, err = w.Write(bytes)
	}
}

// PluginInfo 插件信息
type PluginInfo struct {
	Name      string   //插件名称
	Config    string   //插件配置
	ReadMe    string   //README.md
	Version   string   //插件版本
	HotConfig []string //热更新配置
}

func getPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var plugins []*PluginInfo
	for _, plugin := range Plugins {
		p := &PluginInfo{
			plugin.Name, "", "", plugin.Version, nil,
		}
		if plugin.HotConfig != nil {
			for k := range plugin.HotConfig {
				p.HotConfig = append(p.HotConfig, k)
			}
		}
		if bytes, err := ioutil.ReadFile(filepath.Join(plugin.Dir, "README.md")); err == nil {
			p.ReadMe = string(bytes)
		}
		var out bytes.Buffer
		if toml.NewEncoder(&out).Encode(plugin.Config) == nil {
			p.Config = out.String()
		}
		plugins = append(plugins, p)
	}
	bytes, err := json.Marshal(plugins)
	if err != nil {
		return
	}
	_, err = w.Write(bytes)
}

// func listenInfo(w http.ResponseWriter, r *http.Request) {
// 	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
// 		if stream := FindStream(streamPath); stream != nil {
// 			sse := utils.NewSSE(w, r.Context())
// 			sub := Subscriber{Type: "GateWay", ID: r.RemoteAddr, Ctx2: r.Context()}
// 			at := stream.OriginAudioTrack
// 			vt := stream.OriginVideoTrack
// 			sendList := make([]int, 3)
// 			sub.OnAudio = func(pack AudioPack) {
// 				sendList[1] = int(at.Buffer.Index)
// 				sse.WriteJSON(sendList)
// 			}
// 			sub.OnVideo = func(pack VideoPack) {
// 				sendList[0] = int(vt.Buffer.Index)
// 				sendList[1] = int(vt.IDRIndex)
// 				sse.WriteJSON(sendList)
// 			}
// 			sub.Play(at, vt)
// 			utils.Println("cancel listenInfo")
// 		} else {
// 			w.Write([]byte("no such stream"))
// 		}
// 	} else {
// 		w.Write([]byte("no query stream"))
// 	}

// }

type SnapShot struct {
	Type    byte
	Size    int
	Payload []byte
}

// func snapshot(w http.ResponseWriter, r *http.Request) {
// 	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
// 		if stream := FindStream(streamPath); stream != nil {
// 			output := make([]*SnapShot, stream.AVRing.Size)
// 			p := stream.AVRing.Clone()

// 			for i := 0; i < stream.AVRing.Size; i++ {
// 				output[i] = &SnapShot{
// 					Type: p.Type,
// 					Size: len(p.Payload),
// 				}
// 				if len(p.Payload) < 14 {
// 					output[i].Payload = p.Payload
// 				} else {
// 					output[i].Payload = p.Payload[:14]
// 				}
// 				p.GoBack()
// 			}
// 			if bytes, err := json.Marshal(output); err == nil {
// 				_, err = w.Write(bytes)
// 			}
// 		} else {
// 			w.Write([]byte("no such stream"))
// 		}
// 	} else {
// 		w.Write([]byte("no query stream"))
// 	}
// }
// func tagRaw(w http.ResponseWriter, r *http.Request) {
// 	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
// 		if stream := FindStream(streamPath); stream != nil {
// 			t := r.URL.Query().Get("t")
// 			if t == "a" {
// 				if at := stream.OriginAudioTrack; at != nil {
// 					w.Write(at.RtmpTag)
// 				} else {
// 					w.Write([]byte("no OriginAudioTrack"))
// 				}
// 			} else {
// 				if vt := stream.OriginVideoTrack; vt != nil {
// 					w.Write(vt.RtmpTag)
// 				} else {
// 					w.Write([]byte("no OriginVideoTrack"))
// 				}
// 			}
// 		} else {
// 			w.Write([]byte("no such stream"))
// 		}
// 	} else {
// 		w.Write([]byte("no query stream"))
// 	}
// }
func modifyConfig(w http.ResponseWriter, r *http.Request) {
	if pluginName := r.URL.Query().Get("name"); pluginName != "" {
		if plugin, ok := Plugins[pluginName]; ok {
			if key := r.URL.Query().Get("key"); key != "" {
				if plugin.HotConfig != nil {
					if f, ok := plugin.HotConfig[key]; ok {
						value := make([]interface{}, 0)
						if err := json.Unmarshal([]byte(r.URL.Query().Get("value")), &value); err == nil {
							f(value[0])
							w.Write([]byte("success"))
						} else {
							w.Write([]byte(err.Error()))
						}
					} else {
						w.Write([]byte("no such HotConfig"))
					}
				} else {
					w.Write([]byte("no HotConfig"))
				}
			} else {
				w.Write([]byte("no query key"))
			}
		} else {
			w.Write([]byte("no such plugin"))
		}
	} else {
		w.Write([]byte("no query name"))
	}
}
