# 网关插件

该插件提供一下功能：
1. 提供HTTP协议的API接口
2. 提供控制台UI界面的框架，可以展示其他插件的UI界面
3. 自身提供一个显示系统实时状态的界面

# 插件名称

GateWay

# 配置
目前仅有的配置是监听的端口号

```toml
[GateWay]
ListenAddr = ":8081"
```

# 使用方法

插件随实例启动而启动，打开浏览器访问配置好的端口即可，例如http://localhost:8081,根据实际情况访问


# API
 - /api/sysInfo 获取系统信息，包含引擎版本和实例启动时间
 - /api/summary 获取系统实时状态，包括cpu、内存、网卡流量数据
 - /api/config 获取配置文件
 - /api/plugins 获取所有插件信息
 - /api/listenInfo 收听流的缓冲信息
 - /api/snapshot 获取缓冲快照数据
 - /api/tagRaw 获取音视频Tag的原始二进制数据
 - /api/modifyConfig 修改插件配置