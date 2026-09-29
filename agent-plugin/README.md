# FitKeep Agent 插件

插件使用现有 Spring Boot 应用的 `/api/agent/chat` 接口。用户首页加载悬浮窗，模型请求由 Java 服务端发出，浏览器不接触模型密钥。

## 配置和启动

默认使用 DeepSeek 的 Chat Completions API 和 `deepseek-flash` 模型。先在 [DeepSeek 开放平台](https://platform.deepseek.com/) 创建 API Key，然后只在运行 Spring Boot 的服务器上设置环境变量：

```sh
export DEEPSEEK_API_KEY='你的 DeepSeek API Key'
cd server
JAVA_HOME=$(/usr/libexec/java_home -v 21) mvn spring-boot:run
```

启动后登录 `/user/index.html`，点击右下角“运动助手”。未设置密钥时页面仍可加载，但聊天接口返回配置提示。项目依然需要现有的 MySQL 和 JWT 配置。不要把密钥写入 `application.properties`、前端脚本或提交到 Git。Linux 服务器应使用自己的 Java 21 路径启动；上面的 `java_home` 命令仅适用于 macOS。

当前 VPS 上运行的是 `fitkeep.service`，已通过 systemd 读取权限为 `600` 的 `/opt/fitkeep/fitkeep.env`。线上只需在这个服务器文件中增加一行 `DEEPSEEK_API_KEY=你的密钥`，再重启 `fitkeep.service`；不需要新建环境文件或修改仓库中的部署模板。请勿把密钥上传到 Git。2026-09-29 核实时线上 JAR 尚未包含 Agent，需先发布新版应用才能使用悬浮窗。

可通过 `AGENT_API_URL`、`AGENT_API_MODEL` 覆盖默认端点和模型；`AGENT_API_KEY` 仍可用于其他 OpenAI 兼容服务。DeepSeek 当前工具调用示例使用 `deepseek-flash` 和 `https://api.deepseek.com`，参见 [官方工具调用文档](https://api-docs.deepseek.com/guides/tool_calls/)。

## API 契约

请求需要现有登录得到的 `Authorization: Bearer <JWT>`。`POST /api/agent/chat` 接收：

```json
{"message":"我今天打卡了吗？","history":[]}
```

成功时沿用项目 `Result` 包装，`data` 包含 `reply`、`pendingAction`、`confirmationToken`。普通回答的后两项为 `null`。打卡请求只生成预览和五分钟有效的确认令牌。用户确认时再次请求：

```json
{"confirmationToken":"预览响应中的令牌"}
```

确认令牌签名绑定当前用户、打卡内容和时长；后端再调用现有 `POST /api/checkin/do`。模型仅能调用固定工具：`GET /api/courses/list`、`GET /api/checkin/status`、`GET /api/pomodoro/stats`，以及需要用户确认的打卡。所有项目 API 调用都携带当前用户的 JWT。模型无法自选 URL 或调用管理员接口。聊天记录只由当前页面内存保存，刷新即清空。

当前 MVP 仅嵌入用户首页。模型服务需支持 OpenAI 的 `tool_calls` 返回格式；不支持该格式的服务无法调用项目工具。服务端调用模型超时 25 秒，内部 API 超时 5 秒；错误仅返回通用信息，不向浏览器泄露密钥或上游响应内容。
