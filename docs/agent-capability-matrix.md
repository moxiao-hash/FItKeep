# FitKeep Agent 能力矩阵（Task 00 契约基线）

版本：2026-09-29，来源为当前本地 Java 控制器、`SecurityConfig`、Mapper 和静态页面。状态是**计划**，不是已实现清单。`AgentController` 和悬浮窗尚为未提交草稿；除其现有三个读取工具与确认后打卡外，下列 Agent 工具均未开发或验收。

## 能力分级

| 级别 | 执行条件 |
| --- | --- |
| `USER_READ` | Java 按当前用户身份或公开发布状态查询，可直接执行。 |
| `USER_CONFIRM` | 用户先看完整预览，再确认一次写入。 |
| `ADMIN_APPROVE_READ` | 管理员批准该次具体查询的目标、过滤范围和字段后，Java 执行。 |
| `ADMIN_APPROVE_WRITE` | 管理员批准该次具体变更的对象、参数和影响后，Java 执行。 |
| `MODERATE_HIDE` | 管理员事先开启窄范围规则后，监管身份仅可自动隐藏明确违规内容并进入事后复核。 |
| `HUMAN_ONLY` | 登录凭据、选择本地文件等由人操作，Agent 不接收明文。 |
| `BLOCKED` | 现有权限/可见性问题未修，或缺真实 Java 接口；修复前不得注册为 Agent 工具。 |

管理员即使只查平台统计，也属于 `ADMIN_APPROVE_READ`。管理员进入用户端 Agent 时只得到用户端工具。已有 HTTP 接口的 `当前可访问` 不等于可立即提供给 Agent；当前安全问题见 Task 01。

## 现有 HTTP 接口盘点

路径以控制器组合后的完整 URL 为准。“现状”指 Spring Security 路径规则；部分业务方法可能再用 `Authentication` 提取用户 ID。`目标工具` 是计划名称，Task 02 冻结后才能启用。

| HTTP 接口 | 现状 | Agent 目标工具与级别 | 前置 Task / 约束 |
| --- | --- | --- | --- |
| `POST /api/auth/register` | 公开 | `HUMAN_ONLY` | 用户亲自输入凭据；不提供模型工具 |
| `POST /api/auth/login` | 公开 | `HUMAN_ONLY` | 用户亲自输入凭据；不提供模型工具 |
| `GET /api/courses/list` | 公开 | `course.list`，`USER_READ` | 只返回已发布课程；Task 05 统一有界响应 |
| `GET /api/courses/detail/{id}` | 公开 | `course.detail`，暂 `BLOCKED` | 当前按 ID 查库未校验发布状态且增加浏览量；Task 01/05 修正读取语义 |
| `GET /api/courses/videos/{courseId}` | 公开 | `course.videos`，暂 `BLOCKED` | 当前按课程 ID 返回视频，未核实课程发布状态；Task 01 修复 |
| `GET /api/checkin/status` | 登录 | `checkin.status`，`USER_READ` | Task 05 按当前用户读取 |
| `GET /api/checkin/my` | 登录 | `checkin.mine`，`USER_READ` | Task 05 加分页/结果上限 |
| `POST /api/checkin/do` | 登录 | `checkin.create`，`USER_CONFIRM` | 当前 MVP 可预览确认；Task 03/07 换成一次性持久化审批 |
| `GET /api/checkin/all` | 登录 | `BLOCKED`；管理员改用 `admin.checkin.list` | 当前任意已登录用户可读全部打卡；Task 01 限权或移除 |
| `GET /api/pomodoro/records` | 登录 | `pomodoro.records`，`USER_READ` | Task 05 加分页/结果上限 |
| `GET /api/pomodoro/stats` | 登录 | `pomodoro.stats`，`USER_READ` | 当前 MVP 已登记；Task 05 统一契约 |
| `POST /api/pomodoro/save` | 登录 | `pomodoro.save`，`USER_CONFIRM` | Task 03/07 参数校验和一次性确认 |
| `GET /api/community/posts` | 公开 | `community.posts`，`USER_READ` | 已按 `status=1` 过滤；Task 05 加分页 |
| `GET /api/community/post/{id}` | 公开 | `community.post`，暂 `BLOCKED` | 当前按 ID 可取隐藏帖；Task 01 修复可见性 |
| `POST /api/community/post` | 登录 | `community.post.create`，`USER_CONFIRM` | Task 07 校验长度、内容与一次性确认 |
| `POST /api/community/post/{id}/like` | 登录 | `community.post.like`，暂 `BLOCKED` | 当前未按用户去重；Task 01/07 修复后按用户确认策略 |
| `POST /api/community/post/{id}/comment` | 登录 | `community.comment.create`，`USER_CONFIRM` | Task 07 校验归属、内容及确认 |
| `DELETE /api/community/post/{id}` | 登录 | `community.post.delete_own`，暂 `BLOCKED` | 当前未检查作者归属；Task 01 修复，Task 07 确认 |
| `POST /api/file/upload` | 登录 | `HUMAN_ONLY` 文件选择，之后按用途受控上传 | Task 01 文件类型/大小；Task 07 不让模型读取本地路径 |
| `GET /api/admin/stats` | 管理员 | `admin.stats`，`ADMIN_APPROVE_READ` | Task 09；统计也需该次审批 |
| `GET /api/admin/users` | 管理员 | `admin.user.list`，暂 `BLOCKED` | 当前返回含密码哈希的 `User`；Task 01 改最小化 DTO，Task 09 审批 |
| `PUT /api/admin/user/{id}/status` | 管理员 | `admin.user.status`，`ADMIN_APPROVE_WRITE` | Task 11；确认时重查角色和状态 |
| `DELETE /api/admin/user/{id}` | 管理员 | `admin.user.delete`，`ADMIN_APPROVE_WRITE` | Task 11；不可恢复影响单独说明 |
| `GET /api/admin/courses` | 管理员 | `admin.course.list`，`ADMIN_APPROVE_READ` | Task 09 分页和字段范围 |
| `POST /api/admin/course` | 管理员 | `admin.course.create`，`ADMIN_APPROVE_WRITE` | Task 11；结构化字段与预览 |
| `POST /api/admin/course/upload-cover` | 管理员 | `HUMAN_ONLY` 文件选择 + `ADMIN_APPROVE_WRITE` | Task 01/11 校验文件与该次审批 |
| `PUT /api/admin/course` | 管理员 | `admin.course.update`，`ADMIN_APPROVE_WRITE` | Task 11；展示前后差异 |
| `DELETE /api/admin/course/{id}` | 管理员 | `admin.course.delete`，`ADMIN_APPROVE_WRITE` | Task 11；连带视频影响需展示 |
| `POST /api/admin/video` | 管理员 | `admin.video.create`，`ADMIN_APPROVE_WRITE` | Task 11；课程归属核对 |
| `POST /api/admin/video/upload` | 管理员 | `HUMAN_ONLY` 文件选择 + `ADMIN_APPROVE_WRITE` | Task 01/11 校验文件与该次审批 |
| `DELETE /api/admin/video/{id}` | 管理员 | `admin.video.delete`，`ADMIN_APPROVE_WRITE` | Task 11；不可恢复影响说明 |
| `GET /api/admin/posts` | 管理员 | `admin.post.list`，`ADMIN_APPROVE_READ` | Task 09 分页和字段范围 |
| `PUT /api/admin/post/{id}/status` | 管理员 | `admin.post.set_status`，`ADMIN_APPROVE_WRITE` | Task 11；Task 13 的自动隐藏另走专用窄接口 |
| `DELETE /api/admin/post/{id}` | 管理员 | `admin.post.delete`，`ADMIN_APPROVE_WRITE` | Task 11；不纳入自动监管 |
| `GET /api/admin/checkins` | 管理员 | `admin.checkin.list`，`ADMIN_APPROVE_READ` | Task 09 分页、过滤和最小化字段 |
| `DELETE /api/admin/checkin/{id}` | 管理员 | `admin.checkin.delete`，`ADMIN_APPROVE_WRITE` | Task 11；展示用户与日期 |
| `POST /api/agent/chat` | 登录；本地未提交草稿 | 迁移至双端网关；当前仅用户端 MVP | Task 02/04；禁止把旧端点升级成管理员万能工具 |

以上行来自 `AuthController`、`CourseController`、`CheckInController`、`PomodoroController`、`CommunityController`、`FileController`、`AdminController` 和本地草稿 `AgentController`。管理员接口由 `SecurityConfig` 的 `/api/admin/**` 规则保护。后端仍需对对象状态和当前角色做二次判断。

## 缺失接口与不代办项

| 需求 | 当前情况 | 计划处理 |
| --- | --- | --- |
| “打开某课程” | 有已发布课程列表和详情，但无按名称定位/固定路由结果 | Task 05 新增 Java 课程定位；同名返回候选；`COURSE_DETAIL + courseId` 交现有页面跳转 |
| 个人资料读取/修改 | 页面主要使用浏览器本地存储；无 `/api/me` | Task 05/07 新增按当前用户限定的 `GET/PATCH /api/me` |
| 管理员完整业务增删改查 | 用户建档/档案编辑、视频修改、打卡纠错等缺接口 | Task 11 在能力矩阵冻结后补 Java API；账号凭据与角色提升先标 `BLOCKED`，由用户另定范围 |
| 评论隐藏/恢复 | `comments` 无状态字段与管理接口 | Task 13 仅待审；Task 15/16 增加可恢复状态、接口和复核界面 |
| 社区明确违规自动隐藏 | 帖子已有 `status=0/1`，缺预授权、审计和复核队列 | Task 13/14 只允许专用监管身份自动隐藏明确违规帖；不能自动删除 |
| 登录、注册、密码、选择本地文件 | 必须由人提供凭据/文件 | `HUMAN_ONLY`；Agent 可说明操作位置但不代填、不读本地路径 |
| 计时器开始/暂停、视频播放控制 | 当前是页面本地状态，不对应 Java 业务接口 | 本期 `BLOCKED`；若后续纳入，先定义真实 Java 会话接口，不用模型直接操作 DOM |

## 状态与验证

本矩阵是 Task 00 的**契约提案**。源码盘点已完成，尚无双端 Agent 运行验证；安全缺口仍待 Task 01 修复。Codex 技术核对后交用户亲自验收。用户确认前，本矩阵不能被执行者当作已授权开发下一 Task 的正式基线。
