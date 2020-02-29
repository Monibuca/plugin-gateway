package gatewayplugin

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"mime"
	"net/http"
	"path"
	"runtime"
	"time"

	"github.com/BurntSushi/toml"
	. "github.com/Monibuca/engine"
	. "github.com/Monibuca/engine/util"
)

var (
	config        = new(ListenerConfig)
	startTime     = time.Now()
	dashboardPath string
)

func init() {
	_, currentFilePath, _, _ := runtime.Caller(0)
	dashboardPath = path.Join(path.Dir(currentFilePath), "./dashboard/dist")
	log.Println(dashboardPath)
	InstallPlugin(&PluginConfig{
		Name:    "GateWay",
		Type:    PLUGIN_HOOK,
		Config:  config,
		UI:      path.Join(path.Dir(currentFilePath), "./dashboard/ui/plugin-gateway.min.js"),
		Version: "1.0.0",
		Run:     run,
	})
}
func run() {
	http.HandleFunc("/api/sysInfo", sysInfo)
	http.HandleFunc("/api/stop", stopPublish)
	http.HandleFunc("/api/summary", summary)
	http.HandleFunc("/api/logs", watchLogs)
	http.HandleFunc("/api/config", getConfig)
	http.HandleFunc("/api/plugins", getPlugins)
	http.HandleFunc("/", website)
	log.Printf("server gateway start at %s", config.ListenAddr)
	log.Fatal(http.ListenAndServe(config.ListenAddr, nil))
}

func getConfig(w http.ResponseWriter, r *http.Request) {
	w.Write(ConfigRaw)
}
func watchLogs(w http.ResponseWriter, r *http.Request) {
	AddWriter(NewSSE(w, r.Context()))
	<-r.Context().Done()
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
	UI      string //界面路径
	Version string //插件版本
}

func getPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	var plugins []*PluginInfo
	for _, plugin := range Plugins {
		p := &PluginInfo{
			plugin.Name, plugin.Type, "", "", plugin.Version,
		}
		if plugin.UI != "" {
			if bytes, err := ioutil.ReadFile(plugin.UI); err == nil {
				p.UI = string(bytes)
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
