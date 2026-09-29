# Task 00：基线、能力矩阵与契约验收记录

状态：**待用户验收**。日期：2026-09-29。Owner：Codex。基线分支：`codex/fitkeep-agent-baseline`，从 `main@0145b95` 建立；未合入 `main`，未触发 VPS 自动部署。

## 已交付

1. [能力矩阵](../agent-capability-matrix.md)覆盖当前控制器的 37 个 HTTP 方法/路径，包括未提交的 `POST /api/agent/chat`。区分用户直接读取、用户确认、管理员逐项审批、社区预授权自动隐藏、人手操作和暂时阻断。
2. [跨端契约](../agent-contract.md)定义 `USER`、`ADMIN`、`MODERATOR` 的入口与工具目录、待审批动作、课程导航结果、监管决策、错误与审计规则。管理员每次敏感读取和写入都需该次审批；自动监管只可隐藏明确违规帖，评论在新增可恢复隐藏前只能待审。
3. [开发计划](../superpowers/plans/2026-09-29-fitkeep-dual-agent-development.md)和[协同开发规则](../agent-collaboration.md)已加入“每个 Task 经 Codex 技术验收，再由用户亲自验收；用户未确认不进入下一 Task”的门禁。
4. 隔离工作树只纳入现有 Agent MVP 所需的 `agent-plugin/README.md`、报告、Java `AgentController` 与测试、用户悬浮窗 JS/CSS、首页引用、Agent 配置环境变量引用，以及上述规划文档。原工作树的通用 `README.md` 和 `deploy/` 未纳入。未记录或提交 API Key、SSH 私钥、数据库口令值或生产环境文件。

## 关键核查与设计决定

- 当前 `CourseService.getCourseDetail` 按 ID 查询且增加浏览量；公开课程详情和视频接口尚未校验课程发布状态。社区帖子详情按 ID 也可读取隐藏帖。`/api/checkin/all` 对任意已登录者可用，社区删除帖子没有归属校验，管理员用户列表可能返回密码哈希。上述接口在矩阵中标为接入前阻断，Task 01 先修。
- 操作人身份由 Java 从当前认证和服务端 `turnId` 上下文取得。管理员工具可以有类型化 `targetUserId` 作为对象，但模型不能设置 `actorUserId`。两套 Agent 共用独立服务运行代码，工具目录与会话隔离。
- 课程打开由 Java 返回 `COURSE_DETAIL` 与课程 ID；现有页面映射到 `/user/course-detail.html?id=<id>`。同名课程先返回候选，未发布课程不返回导航目标。纯浏览器本地计时/视频控制不进入本期 Java API 范围。
- 独立服务的实施基线选 Python 3.12 + 轻量 FastAPI 与远端 DeepSeek，不引入本地模型/向量库。VPS 只读核实为 2 vCPU、1740 MiB 总内存、约 635 MiB available、无 swap，Python 为 3.12.3。Task 04 先以 256 MiB RSS 作为资源目标，需在真实负载下测量；若达不到，Codex 先重新评估运行方式，不能直接挤占主站资源上线。
- 当前本地 MVP 仍是 Java 内嵌模型调用，只支持三项读取和确认后打卡。真实 DeepSeek 密钥未配置，管理员端、审批持久化与自动监管均未实现。本 Task 不声称这些功能可用。

## 验证结果

- 在隔离工作树以 Java 21 执行 `mvn -B -ntp -f server/pom.xml verify`：`BUILD SUCCESS`，6 项测试通过，0 失败、0 错误、0 跳过。其中 `AgentControllerTest` 4 项是模拟模型/项目 API 测试，不是 DeepSeek 真实联调。
- `node --check server/src/main/resources/static/user/agent-widget.js` 通过。
- 脚本从各控制器提取 37 个 HTTP 方法/路径，与能力矩阵逐项比对，无遗漏。文档本地链接检查与 `git diff --check` 通过。
- 未运行真实页面、真实模型或数据库写入验收；Task 00 只冻结开发基线与契约。

## 用户亲自验收的检查点

1. 查看能力矩阵，确认用户端与管理员端哪些操作可交给 Agent、哪些仍由人完成。
2. 查看管理员逐项审批和社区自动隐藏的例外，确认“先隐藏、后复核、可恢复”的范围。
3. 查看 Codex、MiniMax Code、ZCode 的文件边界以及每个 Task 的用户验收门禁。

若用户要求调整，继续留在 Task 00 修改并重新交付。收到用户明确确认后才把 Task 00 标记为“用户已验收”，随后派发 Task 01。
