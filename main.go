package gateway

import (
	"bytes"
	"embed"
	"encoding/json"
	"io/ioutil"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/BurntSushi/toml"
	. "github.com/Monibuca/engine/v2"
	"github.com/Monibuca/engine/v2/avformat"
	. "github.com/Monibuca/engine/v2/util"
	"github.com/Monibuca/utils"
	. "github.com/logrusorgru/aurora"
)

var (
	config struct {
		ListenAddr    string
		CertFile      string
		KeyFile       string
		ListenAddrTLS string
	}
	startTime     = time.Now()
	dashboardPath string
)

//go:embed ui/*
//go:embed README.md
var ui embed.FS

//go:embed dashboard/*
var dashboard embed.FS

func init() {
	plugin := &PluginConfig{
		Name:   "GateWay",
		Type:   PLUGIN_HOOK,
		Config: &config,
		Run:    run,
		UIFile: &ui,
	}
	InstallPlugin(plugin)
	dashboardPath = filepath.Join(plugin.Dir, "dashboard", "dist")
}
func run() {
	http.HandleFunc("/api/sysInfo", sysInfo)
	http.HandleFunc("/api/stop", stopPublish)
	http.HandleFunc("/api/summary", summary)
	http.HandleFunc("/api/config", getConfig)
	http.HandleFunc("/api/plugins", getPlugins)
	http.HandleFunc("/api/listenInfo", listenInfo)
	http.HandleFunc("/api/snapshot", snapshot)
	http.HandleFunc("/api/tagRaw", tagRaw)
	http.HandleFunc("/api/modifyConfig", modifyConfig)
	http.HandleFunc("/api/getIFrame", getIFrame)
	http.HandleFunc("/plugin/", getPluginUI)
	http.HandleFunc("/", website)
	Print(Green("server gateway start at "), BrightBlue(config.ListenAddr), BrightBlue(config.ListenAddrTLS))
	utils.ListenAddrs(config.ListenAddr, config.ListenAddrTLS, config.CertFile, config.KeyFile, nil)
}

func getConfig(w http.ResponseWriter, r *http.Request) {
	w.Write(ConfigRaw)
}

func stopPublish(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if s := FindStream(streamPath); s != nil {
			s.Cancel()
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
	if f, err := dashboard.ReadFile("dashboard/dist" + filePath); err == nil {
		if _, err = w.Write(f); err != nil {
			w.WriteHeader(505)
		}
	} else {
		//避免循环重定向
		if r.URL.Path == "/" {
			w.WriteHeader(404)
		} else {
			w.Header().Set("Location", "/")
			w.WriteHeader(302)
		}
	}
}
func getIFrame(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if s := FindStream(streamPath); s != nil {
			w.Write(s.VideoTag.Payload[5:])
			w.Write(s.FirstScreen.Payload[5:])
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}
func summary(w http.ResponseWriter, r *http.Request) {
	sse := NewSSE(w, r.Context())
	Summary.Add()
	defer Summary.Done()
	sse.WriteJSON(&Summary)
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ticker.C:
			if sse.WriteJSON(&Summary) != nil {
				return
			}
		case <-r.Context().Done():
			return
		}
	}
}
func sysInfo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	bytes, err := json.Marshal(EngineInfo)
	if err == nil {
		_, err = w.Write(bytes)
	}
}

// PluginInfo 插件信息
type PluginInfo struct {
	Name      string   //插件名称
	Type      byte     //类型
	Config    string   //插件配置
	UIDir     string   //界面路径
	ReadMe    string   //README.md
	Version   string   //插件版本
	HotConfig []string //热更新配置
}

func getPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var plugins []*PluginInfo
	for _, plugin := range Plugins {
		p := &PluginInfo{
			plugin.Name, plugin.Type, "", "", "", plugin.Version, nil,
		}
		if plugin.HotConfig != nil {
			for k, _ := range plugin.HotConfig {
				p.HotConfig = append(p.HotConfig, k)
			}
		}
		if plugin.UIFile != nil {
			p.UIDir = "ui" // 加这一行供前端判断是否有ui
			if bytes, err := plugin.UIFile.ReadFile("README.md"); err == nil {
				p.ReadMe = string(bytes)
			}
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
func getPluginUI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	filePath := strings.TrimPrefix(r.URL.Path, "/plugin/")
	pluginName := filePath[:strings.Index(filePath, "/")]
	filePath = filePath[len(pluginName)+1:]
	if plugin, ok := Plugins[pluginName]; ok {
		if plugin.UIFile == nil {
			w.WriteHeader(404)
			return
		}
		if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
			w.Header().Set("Content-Type", mime)
		}
		if f, err := plugin.UIFile.ReadFile("ui/dist/" + filePath); err == nil {
			if _, err = w.Write(f); err != nil {
				w.WriteHeader(505)
			}
			return
		}
	}
	w.WriteHeader(404)
}

func listenInfo(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		maxSub := 5
		if max := r.URL.Query().Get("max"); max != "" {
			maxSub, _ = strconv.Atoi(max)
		}
		if stream := FindStream(streamPath); stream != nil {
			sse := NewSSE(w, r.Context())
			sub := new(Subscriber)
			sub.Type = "GateWay"
			sub.ID = r.RemoteAddr
			sub.OnData = func(packet *avformat.SendPacket) (err error) {
				l := maxSub
				if l > len(stream.SubscriberInfo) {
					l = len(stream.SubscriberInfo)
				}
				l += 2
				sendList := make([]int, l)
				sendList[0] = stream.AVRing.Index
				sendList[1] = stream.FirstScreen.Index
				for i := 0; i < maxSub && i < len(stream.SubscriberInfo); i++ {
					sendList[i+2] = stream.SubscriberInfo[i].BufferLength
				}
				err = sse.WriteJSON(sendList)
				return
			}
			go sub.Subscribe(streamPath)
			<-r.Context().Done()
			Println("cancel listenInfo")
			sub.Cancel()
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}

}

type SnapShot struct {
	Type    byte
	Size    int
	Payload []byte
}

func snapshot(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if stream := FindStream(streamPath); stream != nil {
			output := make([]*SnapShot, stream.AVRing.Size)
			p := stream.AVRing.Clone()

			for i := 0; i < stream.AVRing.Size; i++ {
				output[i] = &SnapShot{
					Type: p.Type,
					Size: len(p.Payload),
				}
				if len(p.Payload) < 14 {
					output[i].Payload = p.Payload
				} else {
					output[i].Payload = p.Payload[:14]
				}
				p.GoBack()
			}
			if bytes, err := json.Marshal(output); err == nil {
				_, err = w.Write(bytes)
			}
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}
func tagRaw(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if stream := FindStream(streamPath); stream != nil {
			t := r.URL.Query().Get("t")
			if t == "a" {
				if stream.AudioTag == nil {
					w.Write([]byte("no audio tag"))
					return
				}
				w.Write(stream.AudioTag.Payload)
			} else {
				if stream.VideoTag == nil {
					w.Write([]byte("no video tag"))
					return
				}
				w.Write(stream.VideoTag.Payload)
			}
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}
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
