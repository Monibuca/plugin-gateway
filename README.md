# 网关插件

该插件是为web控制台界面提供api，用来采集服务器的信息。是核心插件，强烈建议使用。

## 插件名称

GateWay

## 配置
目前仅有的配置是监听的端口号

```toml
[Plugins.GateWay]
ListenAddr = ":80"
```