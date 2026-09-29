# Task 01：原业务权限与接口安全修复验收记录

Task：Task 01 原业务权限修复  
基线与分支：基线 `fd26a02`，工作树分支 `codex/fitkeep-agent-task-01`  
角色声明：MiniMax Code 后端执行工程师负责后端 Java、Security、DTO/Mapper、init.sql、测试及本证据文档；静态页面由 ZCode 负责；Codex 拥有架构与技术验收最终决定权；用户本人拥有最终验收权。  
状态：**待 Codex 验收**  

---

## 1. 实现与未实现

### 已实现范围
1. **越权删帖防御（IDOR 修复）**：
   - 在 `CommunityController` 与 `CommunityService` 中引入操作人身份与权限校验。
   - 普通登录用户仅允许删除本人发布的帖子；非作者本人发起删除时，拒绝执行并返回权限错误；
   - 系统管理员（拥有 `ROLE_ADMIN` 角色）保留管理删帖能力。
2. **隐藏内容防泄漏**：
   - **隐藏社区帖子**：公开接口 `GET /api/community/post/{id}` 增加帖子可见性过滤（`status == 1`），已被隐藏（`status == 0`）或不存在的帖子统一返回错误，不再泄漏正文与评论。
   - **未发布课程详情**：公开接口 `GET /api/courses/detail/{id}` 增加课程发布状态过滤（`status == 1`），未发布课程拒绝返回详情且不再累加浏览量。
   - **未发布课程视频列表**：公开接口 `GET /api/courses/videos/{courseId}` 增加课程发布状态检查，未发布课程拒绝返回视频资源列表。
3. **`/api/checkin/all` 权限限制**：
   - 在 `SecurityConfig` 中将 `/api/checkin/all` 明确配置为仅限管理员权限（`.requestMatchers("/api/checkin/all").hasRole("ADMIN")`）；
   - 在 `CheckInController` 业务层增加二次角色核验，普通登录用户访问直接返回 403 Forbidden。
4. **管理员用户列表密码哈希泄露防护**：
   - 新增 `UserAdminDTO` 最小化视图对象，严格排除 `password` 字段；
   - `AdminController.users()` 改为返回 `UserAdminDTO` 列表；
   - 在 `User` 实体类中的 `password` 字段添加 `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)`，形成双重防序列化泄漏屏障。
5. **文件上传安全策略与访问限制**：
   - `FileService.uploadFile` 增加严格的扩展名与 MIME 类型白名单（图片：`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`；视频：`.mp4`, `.webm`, `.mov`），拒绝任何可执行脚本（`.jsp`, `.html`, `.sh` 等）；
   - 增加按类型的文件大小上限校验（图片最大 10MB，视频最大 100MB）；
   - 采用标准随机 UUID 文件名存储，杜绝文件名路径穿越风险（Canonical Path 校验）。
6. **收紧 CORS 跨域策略**：
   - 废除通配符 `config.setAllowedOriginPatterns(List.of("*"))` 配合凭据传输的不安全配置；
   - 收紧为仅允许受信任的本机开发/测试源（`http://localhost:[*]`, `http://127.0.0.1:[*]`），杜绝任意恶意外部域跨域携带 Cookie/Token。
7. **数据库初始化脚本 `init.sql` 安全化**：
   - 移除新装库默认插入固定明文/哈希口令（`admin / admin123`）的 SQL 行；
   - 替换为安全说明注释，防止任何新装库暴露公知弱口令。

### 明确未实现范围
1. **静态前端页面**：依据 `docs/agent-collaboration.md` 边界，静态前端页面属 ZCode Owner 范围，本 Task 未修改任何前端静态文件；
2. **跨端配置文件**：`server/src/main/resources/application.properties`、`server/pom.xml` 属于跨端文件，本 Task 未作修改；
3. **Agent 双端网关与工具目录**：属于 Task 02 范围，本 Task 未提前开发；
4. **生产环境部署与线上数据库执行**：严禁执行，本任务仅在工作树内交付可复现代码与测试。

---

## 2. 接口、文件与数据库变化

### 接口与安全规则变化
- `DELETE /api/community/post/{id}`：增加当前用户判定，仅作者或管理员可成功删除，其他用户返回错误；
- `GET /api/community/post/{id}`：增加 `status=1` 过滤，隐藏帖返回错误；
- `GET /api/courses/detail/{id}`：增加 `status=1` 过滤，未发布课程返回错误并不累加浏览量；
- `GET /api/courses/videos/{courseId}`：增加课程存在与发布校验，未发布课程返回错误；
- `GET /api/checkin/all`：从任意登录用户开放收紧为仅限 `ROLE_ADMIN`（普通登录用户返回 403）；
- `GET /api/admin/users`：响应中的用户对象不再包含 `password` 字段；
- `POST /api/file/upload`：新增白名单扩展名与单文件大小限制，非法文件直接抛异常拒绝；
- `OPTIONS /**`（CORS）：收紧允许 Origin，拒绝任意未知域凭据跨域请求。

### 文件修改清单
- `server/src/main/java/com/server/server/config/SecurityConfig.java`：CORS 收紧与 `/api/checkin/all` 权限；
- `server/src/main/java/com/server/server/controller/AdminController.java`：用户管理列表改用 `UserAdminDTO`；
- `server/src/main/java/com/server/server/controller/CheckInController.java`：打卡全量列表管理员双重核验；
- `server/src/main/java/com/server/server/controller/CommunityController.java`：隐藏帖过滤与删帖越权拦截；
- `server/src/main/java/com/server/server/controller/CourseController.java`：公开视频列表未发布异常捕获包装；
- `server/src/main/java/com/server/server/dto/UserAdminDTO.java`（新增）：脱敏用户视图传输对象；
- `server/src/main/java/com/server/server/entity/User.java`：`password` 增加 WRITE_ONLY 注解；
- `server/src/main/java/com/server/server/service/CommunityService.java`：新增带权限校验的删帖方法；
- `server/src/main/java/com/server/server/service/CourseService.java`：详情与视频列表增加发布状态核实；
- `server/src/main/java/com/server/server/service/FileService.java`：上传白名单、大小限制与路径穿越防护；
- `server/src/main/resources/init.sql`：移除默认固定密码管理员 INSERT 语句；
- `server/src/test/java/com/server/server/security/Task01SecurityVulnerabilityRegressionTest.java`（新增）：TDD 安全回归测试套件。

### 数据库变更
- `init.sql` 中移除了默认写入 `admin / admin123` 的 SQL，新装库不会预存弱口令账号。不需要对既有表结构进行变更。

---

## 3. RED 测试与结果

在代码修复前，新增回归测试 `Task01SecurityVulnerabilityRegressionTest`，精准复现并拦截了 7 项漏洞，运行日志呈现 7 项失败：
- 命令：`mvn -B -ntp -f server/pom.xml test -Dtest=Task01SecurityVulnerabilityRegressionTest`
- 结果：`Tests run: 7, Failures: 7, Errors: 0, Skipped: 0`
- 失败明细：
  1. `nonAuthorCannotDeleteOthersPost`: 普通用户越权删除他人帖子返回 200 成功；
  2. `publicCannotReadHiddenPostDetail`: 隐藏帖子（status=0）被公开接口正常返回并泄漏内容；
  3. `publicCannotReadUnpublishedCourseDetailAndVideos`: 未发布课程及视频被公开接口成功读取并泄漏；
  4. `regularUserCannotAccessAllCheckins`: 普通用户访问 `/api/checkin/all` 返回 200 成功获取全量打卡；
  5. `adminUsersListMustNotExposePasswordHash`: 管理员接口返回了真实的 BCrypt 密码哈希；
  6. `fileUploadMustRejectDangerousFileTypes`: 上传 `webshell.jsp` 成功返回 `/uploads/xxx.jsp`；
  7. `corsMustNotAllowArbitraryOriginWithCredentials`: 任意第三方 Origin 配合 `allowCredentials: true` 返回成功。

---

## 4. GREEN 测试与结果

在完成各项安全逻辑实现后，补充正向合法操作（本人删帖、管理员删帖、发布课程视频正常读取、合法上传等）与 `init.sql` 静态断言，并使用 Java 21 执行全量构建与验证：
- 运行环境：`Eclipse Adoptium OpenJDK 21.0.11 (arm64)`
- 验证命令：`mvn -B -ntp -f server/pom.xml verify`
- 执行结果：
  ```text
  [INFO] Running com.server.server.ServerApplicationTests
  [INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.179 s -- in com.server.server.ServerApplicationTests
  [INFO] Running com.server.server.config.WebConfigRoutesTest
  [INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.162 s -- in com.server.server.config.WebConfigRoutesTest
  [INFO] Running com.server.server.security.Task01SecurityVulnerabilityRegressionTest
  [INFO] Tests run: 8, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.503 s -- in com.server.server.security.Task01SecurityVulnerabilityRegressionTest
  [INFO] Running com.server.server.agent.AgentControllerTest
  [INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.052 s -- in com.server.server.agent.AgentControllerTest
  [INFO] 
  [INFO] Results:
  [INFO] 
  [INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
  [INFO] 
  [INFO] ------------------------------------------------------------------------
  [INFO] BUILD SUCCESS
  [INFO] ------------------------------------------------------------------------
  ```
- 包含基线 6 项测试及本次新增的 8 项安全回归用例（共 14 项测试）全部无错误、无失败、无跳过通过。

---

## 5. 真实联调证据或未运行原因

- **测试级证据**：通过 Spring Boot Test + MockMvc 发起真实 HTTP 过滤链与 Controller 测试，覆盖 JWT 鉴权解析、Security 授权拦截、文件上传 MultiPart 处理与 JSON 序列化脱敏；
- **数据库级别证据**：本地 MySQL 3306 连通，测试通过真实 HikariCP 线程池加载与执行；
- **未运行项及原因**：
  1. 真实浏览器/前端页面未运行：页面属于 ZCode Owner 范围，后续由 ZCode 在管理端与用户端进行真实页面回归；
  2. 真实 DeepSeek 模型未运行：Task 01 仅处理原业务权限，不涉及 Task 04 的独立模型交互；
  3. 生产部署未运行：严格遵守协作规范，任务分支不合并 `main`，不触发 VPS 自动化部署。

---

## 6. 安全边界与已知限制

1. **安全边界确认**：
   - 越权删帖已被彻底阻断；
   - 隐藏内容与未发布资源不再通过公开按 ID 接口泄露；
   - 普通登录用户无法通过 `/api/checkin/all` 窥探全量打卡；
   - 密码哈希完全不离开服务端内存，不进入输出 JSON；
   - 危险扩展名文件被物理拦截，无法写入静态资源目录。
2. **已知限制与后续衔接**：
   - 管理员用户列表返回的字段已脱敏，但 Task 09 还需在此基础上加入管理员逐项审批；
   - `/api/checkin/all` 已限权给管理员，能力矩阵规划管理员端后续将通过审批后的 `admin.checkin.list` 工具操作；
   - 评论目前由于历史表结构尚无 `status` 字段，将在 Task 13–15 中扩展为可恢复隐藏。

---

## 7. 管理员口令安全轮换说明

### 背景
旧版 `init.sql` 曾包含公知弱口令管理员账号（`admin / admin123`）。新装系统已彻底移除该默认凭据。对于已部署系统，运维人员必须立即执行安全轮换，步骤如下：

### 安全轮换标准操作步骤
1. **生成强随机密码的 BCrypt 哈希**：
   在运维安全终端使用 BCrypt 工具（推荐 cost 10 以上）生成随机密码哈希（例如使用 Java 或 Python）：
   ```bash
   # 生成随机口令示例并计算 BCrypt 哈希（不要在公开日志中打印口令明文）
   python3 -c "import bcrypt; print(bcrypt.hashpw(b'<YOUR_STRONG_RANDOM_PASSWORD>', bcrypt.gensalt()).decode())"
   ```
2. **在已部署数据库中更新口令**：
   以安全运维账号登录 MySQL 生产实例：
   ```sql
   USE keep_db;
   -- 将旧 admin 账号密码替换为新生成的高强度哈希，并将 username 改为非默认名称
   UPDATE users 
   SET password = '<NEW_BCRYPT_HASH>', 
       update_time = NOW() 
   WHERE username = 'admin' AND role = 1;
   ```
3. **验证并清理旧会话**：
   - 尝试使用旧口令 `admin123` 登录，确认返回凭据错误（HTTP 401）；
   - 使用新设置的强密码登录，确认能够成功颁发 JWT；
   - 视需要轮换 `jwt.secret` 配置并重启应用，以彻底失效所有由旧口令签署的现存 JWT Token。

---

## 8. 提交号及下一步

- **当前提交号**：`e812709`（分支：`codex/fitkeep-agent-task-01`）
- **当前状态**：**待 Codex 验收**
- **下一步流程**：
  1. 停下当前工作，交付 Codex 进行独立源码审查、安全边界核对与技术验收；
  2. Codex 技术验收通过后交由用户本人亲自验收；
  3. 用户亲自确认验收通过前，严格不启动 Task 02 开发，不合并 `main` 分支。
