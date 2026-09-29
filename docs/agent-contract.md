# FitKeep 双端 Agent 跨端契约（Task 00 提案）

版本：`0.1-draft`，2026-09-29。本文冻结拟新增的 Java、独立 Agent 服务与静态页面之间的语义，**尚未实现，也尚未由用户验收**。现有 `POST /api/agent/chat` 是未提交用户端 MVP，不因本文自动获得管理员能力。用户确认 Task 00 后，后续 Task 才以本契约为开发基线。

## 参与方与数据流

1. 浏览器只调用 Java 公开接口，并携带当前登录凭据。Java 校验用户账号状态和当前角色。
2. Java 以服务端身份调用本机 Agent 服务。独立服务调用 DeepSeek，仅提出已登记工具及结构化参数。
3. Agent 服务向 Java 内部工具网关提交 `turnId`、工具名、版本和参数。Java 从服务端保存的 `turnId` 上下文取得真实操作人 ID、角色及允许的工具集合，绝不采用模型生成的 `actorUserId`。管理员可通过类型化参数指定 `targetUserId`；这是查询/变更目标，仍需该次审批。
4. Java 决定直接读取、返回待审批动作，或拒绝。对于审批动作，浏览器只把管理员/用户的单次确认发送给 Java；Java 重新验证后执行。只有执行结果可作为 Agent 的最终回答依据。
5. Java 返回课程定位时使用固定路由名与实体 ID。现有静态页面把它映射为本项目内的路径并渲染；模型不得提供 URL、DOM 选择器或脚本。

浏览器和 DeepSeek 不能直连业务数据库或内部工具接口。Agent 服务不得保管用户 JWT、管理员万能令牌或数据库密码。服务间凭据只用于调用指定内部接口，不能替代用户审批。

## 身份与工具目录

| Profile | 入口（拟定） | Java 允许的工具 | 数据权限 |
| --- | --- | --- | --- |
| `USER` | `POST /api/agent/user/chat` | `docs/agent-capability-matrix.md` 的用户工具 | 当前用户数据及已发布的公开内容；写入需用户确认 |
| `ADMIN` | `POST /api/agent/admin/chat` | 管理员工具，不继承 `USER` 的越权变体 | 每次用户/平台数据查询和写入均需该次管理员审批 |
| `MODERATOR` | 无浏览器聊天入口；由 Java 监管任务创建 | 仅 `community.post.hide_clear_violation` | 管理员事先开启的规则、对象和期限范围内自动隐藏；事后复核 |

同一账号进入 `USER` 入口时只取得用户端工具。更改账号角色或禁用账号后，Java 必须按当前数据库状态拒绝旧会话执行新的敏感动作。工具目录由 Java 生成，不由模型/客户端选择。模型不能提供操作人身份；`targetUserId` 只允许在已登记管理员工具中作为被操作对象。禁止“call_url”“execute_sql”“run_shell”“call_bean”“read_file”等通用工具。

## 公共对象与规则

下面 JSON 是拟定形状，字段名和状态名待 Task 00 用户验收后固定。服务端仍须严格校验类型、长度、额外字段和可用值；客户端校验不构成授权。

### 工具描述

```json
{
  "name": "checkin.mine",
  "version": 1,
  "profile": "USER",
  "effect": "READ",
  "approval": "NONE",
  "scope": "CURRENT_USER",
  "inputSchema": {"type": "object", "additionalProperties": false},
  "maxOutputBytes": 16384
}
```

`effect` 允许 `READ`、`WRITE`、`NAVIGATE`；`approval` 允许 `NONE`、`USER_CONFIRM`、`ADMIN_EACH_CALL`、`MODERATION_PREAUTH`。`ADMIN_EACH_CALL` 同时用于管理员读取和写入。工具名、版本、输入/输出结构与审批级别由 Java 登记；变更版本必须保持旧动作不可被新定义误执行。

### 对话响应

```json
{
  "turnId": "由 Java 生成的 UUID",
  "profile": "USER",
  "status": "COMPLETED",
  "reply": "找到《零基础入门跑步训练》。",
  "navigation": {"routeKey": "COURSE_DETAIL", "courseId": 1},
  "pendingAction": null
}
```

`status` 允许 `COMPLETED`、`WAITING_APPROVAL`、`FAILED`。`reply` 是面向人的说明，不能作为已执行证据。`navigation` 只允许 Java 登记的 `routeKey` 和正整数业务 ID；`COURSE_DETAIL` 目前由页面映射至 `/user/course-detail.html?id=<courseId>`。课程名称匹配多个结果时返回候选列表并要求用户选择，不猜测 ID。未发布或不存在的课程不返回可打开目标。课程定位查询不应增加浏览量；真正加载详情页时是否增加浏览量沿用 Java 业务规则。

### 待审批动作

```json
{
  "actionId": "由 Java 生成的 UUID",
  "turnId": "所属对话 UUID",
  "toolName": "admin.checkin.list",
  "toolVersion": 1,
  "profile": "ADMIN",
  "status": "WAITING_APPROVAL",
  "summary": "查询用户 123 的打卡记录，仅返回日期和时长。",
  "target": {"userId": 123},
  "fields": ["checkDate", "duration"],
  "expiresAt": "ISO-8601 时间",
  "risk": "SENSITIVE_READ"
}
```

`target`、`fields` 和参数摘要由 Java 从经过校验的工具请求生成，不能由浏览器改写。审批卡自创建起最多五分钟有效，不包含尚未获准的敏感查询结果。管理员每次分页或更换过滤条件视为新动作；批量操作列出对象和数量上限。用户写入同样使用审批卡，但 `risk` 和 `profile` 对应 `USER`。

`POST /api/agent/actions/{actionId}/approve` 和 `/reject` 是拟定的公开确认入口；`GET /api/agent/actions/{actionId}` 查询状态。Java 只允许动作所属用户/管理员处理，确认时重新检查账号角色、工具版本、目标版本和参数摘要。动作状态仅允许 `WAITING_APPROVAL → RUNNING → SUCCEEDED/FAILED` 或 `WAITING_APPROVAL → REJECTED/EXPIRED`。同一 `actionId` 的重复批准只返回既有结果，不再执行。冲突或过期返回确定性错误。不能以聊天文字“我同意”替代确认接口。

审批通过后，Java 执行敏感读取或写入，并保存最小化结果及审计。若需要模型总结，Java 只把该动作获准字段的有界结果送回原 `turnId`；不能把授权扩大给新的工具调用。删除、用户状态变化和课程批量修改需在审批卡说明实际影响。动作被拒绝时模型不得继续假设已完成。

### 社区监管决策

```json
{
  "itemType": "POST",
  "itemId": 456,
  "contentVersion": "服务端计算的摘要",
  "ruleId": "管理员已开启的规则 ID",
  "decision": "HIDE_CLEAR_VIOLATION",
  "reason": "对应规则的具体命中原因",
  "reviewStatus": "PENDING_REVIEW"
}
```

`decision` 只允许 `HIDE_CLEAR_VIOLATION` 或 `QUEUE_REVIEW`。Java 只在规则启用、对象版本未变、对象仍可见且证据满足该规则时接受自动隐藏；模型自报置信分数不能单独成为隐藏条件。已隐藏项目进入管理员复核队列，可维持隐藏或恢复显示。管理员恢复后，同一 `contentVersion` 不得被旧判断再次隐藏。模型不可用、规则不匹配或内容含糊时只入待审，不删除、不封号。评论目前没有状态字段，Task 15 前只能 `QUEUE_REVIEW`。

## 错误与审计

Agent 网关使用现有 `Result` 风格包装业务数据，但认证/权限错误需使用相应 HTTP 401/403，不能把 HTTP 200 的业务错误误认成成功。拟定稳定错误码：`INVALID_ARGUMENT`、`UNKNOWN_TOOL`、`FORBIDDEN`、`ACTION_EXPIRED`、`ACTION_CONFLICT`、`TARGET_CHANGED`、`MODEL_UNAVAILABLE`、`INTERNAL_TOOL_UNAVAILABLE`。错误正文不包含堆栈、密钥、JWT、服务间凭据或其他用户数据。

每次工具请求记录 `turnId`、工具名/版本、发起身份、目标范围、审批动作 ID、结果状态、时间和可回查业务结果；不在普通日志中记录完整提示词或个人资料。只读管理员查询也有审批和审计。工具结果要限制字段、分页和字节量；裁剪必须显式标记 `truncated`，不能让模型把缺失字段解释为“没有数据”。

## 实施与变更门禁

Task 00 只冻结契约，不新增运行时接口。MiniMax Code 实现 Java/独立服务，ZCode 实现静态页面；两方不得各自改公共字段。需要改变工具级别、审批规则、响应字段或内部身份方案时，先由 Codex 更新本文并重新评估已有动作兼容性。每个 Task 必须经 Codex 技术验收，再由用户亲自验收；用户未确认前不启动下一 Task。
