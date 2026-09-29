# Task 01：现有业务接口安全修复

状态：**待用户验收**。基线为 `a5deb26`，复核分支为 `codex/fitkeep-agent-task-01-review-fix`。Codex 已完成独立技术验收；本分支尚未合入或部署，用户尚未验收 Task 01。

## 已实现的行为

- 普通用户只能删除自己的帖子。公开详情不返回隐藏帖、未发布课程及其视频列表。管理员仍可通过管理接口查看隐藏帖。
- `/api/checkin/all` 仅供管理员访问。`/api/admin/users` 使用不含密码字段的 DTO，`User.password` 也禁止 JSON 输出。
- 用户图片入口和管理员封面入口只接收图片，管理员视频入口只接收视频。扩展名、请求 MIME、文件头签名必须一致。图片上限 10 MiB，视频上限 100 MiB；全局 multipart 上限改为单文件 100 MiB、请求 101 MiB。
- `/uploads/<uuid>.<ext>` 保持原有 URL。图片可公开读取。视频只有关联已发布课程时可匿名读取；未关联或未发布视频需当前有效管理员的 Bearer 令牌。非法文件名、目录嵌套和脚本类型不能通过该路径读取。公开视频保留 HTTP Range 播放。
- CORS 默认仅允许同源访问。需要跨域时由运维显式设置 `APP_CORS_ALLOWED_ORIGINS`，以英文逗号分隔准确的可信 Origin，例如 `https://app.example.com`。本机任意端口不再默认获准。
- JWT 每次请求从数据库读取账号当前状态和角色；停用账号不再获得身份，降权账号立即失去管理员权限。`init.sql` 不再创建带固定密码的管理员。
- 生产配置中的 JWT 签名密钥和数据库口令改为必填的 `JWT_SECRET`、`DB_PASSWORD` 环境变量；仓库不再包含原固定值。Spring 测试使用 `application-test.properties` 中无效的测试专用值。

## 验证证据

复核开始时，新增安全测试在原实现上产生 3 个预期失败，分别是伪造 PNG 被接受、任意 localhost 端口通过 CORS、停用管理员旧 JWT 仍能访问。单独加入直链测试后，原静态资源处理器匿名返回未关联 MP4，产生第 4 个预期失败。日志分别保存在本机 `/tmp/fitkeep-task01-red.log` 和 `/tmp/fitkeep-task01-video-red.log`，不作为仓库工件。

固定密钥配置测试在原配置上先失败 1 次。Java 21 执行 `mvn -B -ntp -f server/pom.xml verify` 通过：22 项测试，0 失败、0 错误、0 跳过。其中 Task 01 安全回归类有 16 项，涵盖越权、可见性、身份刷新、上传内容与入口类型、CORS、视频直链、Range 和外部凭据配置。`git diff --check` 通过。打包 JAR 仅含生产 `application.properties`，不含测试用 `application-test.properties`。测试通过 Spring MockMvc 走真实过滤链和 Controller；Post、Course、Video、User、CheckIn、Comment Mapper 均为 mock。本 Task **没有**证明真实 MySQL 数据持久化、真实浏览器或线上行为。

## 管理员初始化与轮换

新装数据库没有默认管理员。部署负责人在安全终端中自选唯一管理员用户名，使用密码管理器生成强随机密码，再本地生成 BCrypt 哈希。不要把明文口令写进命令行、SQL 文件或仓库。例如，已安装 Python `bcrypt` 时运行下列命令，提示符会隐藏输入：

```bash
python3 -c 'import bcrypt,getpass; print(bcrypt.hashpw(getpass.getpass("New admin password: ").encode(), bcrypt.gensalt(rounds=12)).decode())'
```

在受控数据库会话中，把生成的哈希替入下列 SQL。新装库使用 `INSERT`；已部署且仍有旧 `admin` 账号时先用 `UPDATE` 轮换它。执行后验证旧口令不能登录、新口令可以登录，并轮换 JWT 签名密钥以失效既有令牌。

```sql
INSERT INTO users(username, password, nickname, role, status, create_time, update_time)
VALUES('<unique-admin-name>', '<bcrypt-hash>', '管理员', 1, 1, NOW(), NOW());

UPDATE users SET password = '<new-bcrypt-hash>', update_time = NOW()
WHERE username = 'admin' AND role = 1;
```

## 开发与 VPS 配置

本地运行时，在 IDE 的运行配置或启动进程环境中设置 `DB_PASSWORD` 和 `JWT_SECRET`。签名密钥应由密码管理器生成，至少 32 个随机字节，不写进仓库或命令行历史。测试运行自动启用仓库内的 `test` profile；该 profile 的值仅用于 MockMvc，不得用于部署。

仓库的部署说明记录，VPS 上的 `fitkeep.service` 从权限为 `600` 的 `/opt/fitkeep/fitkeep.env` 读取环境变量；本 Task 未重新登录 VPS 核查。**在发布此版本之前**，运维应在该文件中设置真实 `DB_PASSWORD`，并写入一个新生成的 `JWT_SECRET`，替换此前仓库公开过的固定签名密钥。不要打印或提交这些值。检查 systemd 单元仍加载此文件后才发布并重启服务。轮换 JWT 密钥会让所有旧令牌失效，用户和管理员须重新登录。上线后用新令牌验证普通用户和管理员入口，确认旧令牌无法使用；若环境变量缺失则停止发布，不回退到固定密钥。

**发布前核对项。** 目前尚未实际修改 VPS 的环境文件，也未验证线上服务读取新变量。Codex 须在生产合入前完成环境准备和历史媒体路径兼容性检查。本 Task 未变更其他 Agent 凭据配置。

## 兼容性和未完成事项

管理员上传视频后，管理页面只保存返回的 URL，不直接预览；公开课程页面在课程发布后仍可按原 URL 播放。未关联视频需要带管理员 Bearer 的请求才能预览；管理端目前没有这样的预览功能。历史文件若不符合新 UUID 文件名或扩展名规则将不能从 `/uploads` 读取，发布前应检查已有媒体路径并制定迁移或回退方案。旧危险扩展名文件留在磁盘但不再经应用路由公开。

本 Task 未执行生产数据库变更、真实 DeepSeek 调用、浏览器回归、生产部署或用户验收。Task 02 在用户亲自验收 Task 01 后才能开始。
