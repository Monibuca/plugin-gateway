# 网关插件

该插件提供一下功能：
1. 提供HTTP协议的API接口
2. 提供一个简易的静态资源网站（通过配置StaticPath）

# 插件名称

GateWay

# 配置

```toml
[GateWay]
ListenAddr = ":8081"
CertFile   =   "file.cert"
KeyFile      =  "file.key"
ListenAddrTLS = ":8082"
StaticPath   =  "/opt/website"
```

# 使用方法

插件随实例启动而启动，打开浏览器访问配置好的端口即可，例如http://localhost:8081,根据实际情况访问


# API
 - /api/sysInfo 获取系统信息，包含引擎版本和实例启动时间
 - /api/config 获取配置文件
 - /api/plugins 获取所有插件信息
 - /api/listenInfo 收听流的缓冲信息
 - /api/snapshot 获取缓冲快照数据
 - /api/tagRaw 获取音视频Tag的原始二进制数据
 - /api/modifyConfig 修改插件配置