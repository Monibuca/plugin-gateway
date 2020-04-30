package gateway

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/BurntSushi/toml"
	. "github.com/Monibuca/engine"
	"github.com/Monibuca/engine/avformat"
	. "github.com/Monibuca/engine/util"
	. "github.com/logrusorgru/aurora"
)

var (
	config        = new(ListenerConfig)
	startTime     = time.Now()
	dashboardPath string
)

func init() {
	plugin := &PluginConfig{
		Name:   "GateWay",
		Type:   PLUGIN_HOOK,
		Config: config,
		Run:    run,
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
	http.HandleFunc("/plugin/", getPluginUI)
	http.HandleFunc("/", website)
	Print(Green("server gateway start at "), BrightBlue(config.ListenAddr))
	log.Fatal(http.ListenAndServe(config.ListenAddr, nil))
}

func getConfig(w http.ResponseWriter, r *http.Request) {
	w.Write(ConfigRaw)
}

func stopPublish(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if b, ok := AllRoom.Load(streamPath); ok {
			b.(*Room).Cancel()
			w.Write([]byte("success"))
		} else {
			w.Write([]byte("no query stream"))
		}
	} else {
		w.Write([]byte("no such stream"))
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
	if f, err := ioutil.ReadFile(dashboardPath + filePath); err == nil {
		if _, err = w.Write(f); err != nil {
			w.WriteHeader(505)
		}
	} else {
		w.Header().Set("Location", "/")
		w.WriteHeader(302)
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
	Name    string //插件名称
	Type    byte   //类型
	Config  string //插件配置
	UIDir   string //界面路径
	ReadMe  string //README.md
	Version string //插件版本
}

func getPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var plugins []*PluginInfo
	for _, plugin := range Plugins {
		p := &PluginInfo{
			plugin.Name, plugin.Type, "", plugin.UIDir, "", plugin.Version,
		}
		// if plugin.UI != "" {

		// 	if bytes, err := ioutil.ReadFile(plugin.UI); err == nil {
		// 		p.UI = string(bytes)
		// 	}
		// }
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
func getPluginUI(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	filePath := strings.TrimPrefix(r.URL.Path, "/plugin/")
	pluginName := filePath[:strings.Index(filePath, "/")]
	filePath = filePath[len(pluginName)+1:]
	if plugin, ok := Plugins[pluginName]; ok {
		filePath := filepath.Join(plugin.UIDir, filePath)
		if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
			w.Header().Set("Content-Type", mime)
		}
		if f, err := ioutil.ReadFile(filePath); err == nil {
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
		if b, ok := AllRoom.Load(streamPath); ok {
			room := b.(*Room)

			sse := NewSSE(w, r.Context())
			stream := new(OutputStream)
			stream.Type = "GateWay"
			stream.ID = r.RemoteAddr
			stream.SendHandler = func(packet *avformat.SendPacket) (err error) {
				l := maxSub
				if l > len(room.SubscriberInfo) {
					l = len(room.SubscriberInfo)
				}
				l += 2
				sendList := make([]byte, l)
				sendList[0] = room.AVRing.Index
				sendList[1] = room.FirstScreen.Index
				for i := 0; i < maxSub && i < len(room.SubscriberInfo); i++ {
					sendList[i+2] = room.SubscriberInfo[i].BufferLength
				}
				err = sse.WriteJSON(sendList)
				return
			}
			go stream.Play(streamPath)
			<-r.Context().Done()
			Println("cancel listenInfo")
			stream.Cancel()
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}

}

type SnapShot struct {
	Type      byte
	Timestamp uint32
	Payload   []byte
}

func snapshot(w http.ResponseWriter, r *http.Request) {
	if streamPath := r.URL.Query().Get("stream"); streamPath != "" {
		if b, ok := AllRoom.Load(streamPath); ok {
			room := b.(*Room)
			output := make([]*SnapShot, RING_SIZE)
			p := room.AVRing.Clone()

			for i := 0; i < RING_SIZE; i++ {
				output[i] = &SnapShot{
					Type:      p.Type,
					Timestamp: p.Timestamp,
				}
				if len(p.Payload) < 10 {
					output[i].Payload = p.Payload
				} else {
					output[i].Payload = p.Payload[:10]
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
		if b, ok := AllRoom.Load(streamPath); ok {
			room := b.(*Room)
			t := r.URL.Query().Get("t")
			if t == "a" {
				if room.AudioTag == nil {
					w.Write([]byte("no audio tag"))
					return
				}
				w.Write(room.AudioTag.Payload)
			} else {
				if room.VideoTag == nil {
					w.Write([]byte("no video tag"))
					return
				}
				w.Write(room.VideoTag.Payload)
			}
		} else {
			w.Write([]byte("no such stream"))
		}
	} else {
		w.Write([]byte("no query stream"))
	}
}
