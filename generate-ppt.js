const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "FitKeep Team";
pres.title = "FitKeep 智能健身管理平台 - 项目汇报";

// ========== COLOR PALETTE (Tech Blue) ==========
const C = {
  navy:      "0D1B2A",
  darkBlue:  "0A1628",
  primary:   "1565C0",
  lightBlue: "42A5F5",
  accent:    "00ACC1",
  lightBg:   "F0F3F8",
  white:     "FFFFFF",
  textDark:  "1A1A2E",
  textMuted: "64748B",
  cardBg:    "FFFFFF",
  orange:    "FF6B35",
  green:     "10B981",
  purple:    "7C3AED",
  red:       "EF4444",
  border:    "E2E8F0",
};

// ========== HELPERS ==========
const makeShadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.10 });

// Dark slide background with subtle gradient effect
function darkBg(slide) {
  slide.background = { color: C.navy };
  // Top accent line
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.lightBlue } });
}

// Light slide background
function lightBg(slide) {
  slide.background = { color: C.lightBg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.primary } });
}

// Section number circle
function addSectionNum(slide, num, x, y) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: C.primary } });
  slide.addText(String(num), { x, y, w: 0.5, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
}

// Page number
function addPageNum(slide, num) {
  slide.addText(String(num), { x: 9.4, y: 5.2, w: 0.4, h: 0.3, fontSize: 9, fontFace: "Arial", color: C.textMuted, align: "right", margin: 0 });
}

// Divider line
function addDivider(slide, x, y, w) {
  slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: C.border, width: 1.5 } });
}

// ================================================================
// SLIDE 1: COVER
// ================================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBlue };

  // Left decorative vertical bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: C.lightBlue } });

  // Subtle geometric shapes for visual interest
  slide.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 0.5, w: 3, h: 3, fill: { color: C.primary, transparency: 90 }, rotate: 15 });
  slide.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 1.2, w: 2.5, h: 2.5, fill: { color: C.lightBlue, transparency: 85 }, rotate: 30 });

  // Project type tag
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 2.0, h: 0.4, fill: { color: C.primary }, rectRadius: 0.05 });
  slide.addText("软件工程项目答辩", { x: 0.8, y: 1.2, w: 2.0, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  // Main title
  slide.addText("FitKeep", { x: 0.8, y: 1.8, w: 7, h: 1.0, fontSize: 52, fontFace: "Arial Black", color: C.white, bold: true, margin: 0, charSpacing: 4 });

  // Subtitle
  slide.addText("智能健身管理平台", { x: 0.8, y: 2.7, w: 7, h: 0.5, fontSize: 20, fontFace: "Calibri", color: C.lightBlue, margin: 0 });

  // Divider
  slide.addShape(pres.shapes.LINE, { x: 0.8, y: 3.4, w: 3, h: 0, line: { color: C.primary, width: 3 } });

  // Team info
  slide.addText("汇报团队：姬天宇 | 李铭煜 | 马启茂 | 张博鑫 | 封超 | 闫墨存 | 陈灏达", { x: 0.8, y: 3.7, w: 8, h: 0.4, fontSize: 13, fontFace: "Arial", color: "94A3B8", margin: 0 });

  // Date
  slide.addText("2026年5月", { x: 0.8, y: 4.1, w: 3, h: 0.4, fontSize: 12, fontFace: "Arial", color: "64748B", margin: 0 });

  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.425, w: 10, h: 0.2, fill: { color: C.primary } });
})();

// ================================================================
// SLIDE 2: TABLE OF CONTENTS
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("汇报目录", { x: 0.8, y: 0.4, w: 4, h: 0.7, fontSize: 36, fontFace: "Arial Black", color: C.white, margin: 0 });
  slide.addShape(pres.shapes.LINE, { x: 0.8, y: 1.1, w: 1.5, h: 0, line: { color: C.lightBlue, width: 2.5 } });

  const tocItems = [
    ["01", "项目背景与简介"],
    ["02", "开发理念"],
    ["03", "技术栈与架构"],
    ["04", "功能模块详解"],
    ["05", "团队分工与协作"],
    ["06", "项目亮点"],
    ["07", "不足与优化"],
    ["08", "未来展望"],
  ];

  tocItems.forEach((item, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const x = 0.8 + col * 4.5;
    const y = 1.5 + row * 1.0;

    // Number
    slide.addText(item[0], { x, y, w: 0.7, h: 0.7, fontSize: 28, fontFace: "Arial Black", color: C.primary, margin: 0, valign: "middle" });
    // Title
    slide.addText(item[1], { x: x + 0.8, y, w: 3, h: 0.7, fontSize: 16, fontFace: "Arial", color: C.white, margin: 0, valign: "middle" });
    // Underline
    slide.addShape(pres.shapes.LINE, { x: x + 0.8, y: y + 0.65, w: 2.5, h: 0, line: { color: C.textMuted, width: 0.5 } });
  });

  addPageNum(slide, 2);
})();

// ================================================================
// SLIDE 3: PROJECT BACKGROUND
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("项目背景", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  // Left column - problem statement
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 4.2, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.07, h: 3.8, fill: { color: C.orange } });

  slide.addText("市场痛点", { x: 1.2, y: 1.5, w: 3.5, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const painPoints = [
    "健身App功能臃肿、付费门槛高",
    "缺乏系统化的训练课程指导",
    "运动记录分散，难以追踪进展",
    "社区互动弱，缺乏运动氛围",
  ];
  slide.addText(painPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < painPoints.length - 1, indentLevel: 0 } })), { x: 1.2, y: 2.1, w: 3.5, h: 2.8, fontSize: 13, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 28 });

  // Right column - solution
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 4.2, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.3, w: 0.07, h: 3.8, fill: { color: C.green } });

  slide.addText("我们的方案", { x: 5.7, y: 1.5, w: 3.5, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const solutions = [
    "免费、轻量、一站式的健身平台",
    "结构化课程 + 视频教学指导",
    "每日打卡 + 番茄钟双轨追踪",
    "社区互动，打造运动社交圈",
  ];
  slide.addText(solutions.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < solutions.length - 1, indentLevel: 0 } })), { x: 5.7, y: 2.1, w: 3.5, h: 2.8, fontSize: 13, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 28 });

  addPageNum(slide, 3);
})();

// ================================================================
// SLIDE 4: PROJECT INTRODUCTION
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("项目简介", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // 6 feature cards in 2x3 grid
  const features = [
    ["\u{1F3CB}", "课程训练", "结构化健身课程\n视频教学跟练"],
    ["\u{2705}", "每日打卡", "运动打卡记录\n追踪训练历程"],
    ["\u{1F4AC}", "社区互动", "发帖评论点赞\n运动社交圈子"],
    ["\u{23F1}", "番茄钟", "专注计时辅助\n提升训练效率"],
    ["\u{1F4CA}", "数据统计", "ECharts可视化\n训练数据分析"],
    ["\u{1F6E1}", "安全认证", "JWT令牌鉴权\nSpring Security"],
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 3.0;
    const y = 1.3 + row * 2.0;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.7, h: 1.7, fill: { color: C.white, transparency: 95 } });

    slide.addShape(pres.shapes.OVAL, { x: x + 0.95, y: y + 0.12, w: 0.65, h: 0.65, fill: { color: C.primary, transparency: 60 } });
    slide.addText(f[0], { x, y: y + 0.1, w: 2.7, h: 0.5, fontSize: 24, align: "center", margin: 0 });
    slide.addText(f[1], { x, y: y + 0.55, w: 2.7, h: 0.4, fontSize: 15, fontFace: "Arial", color: C.lightBlue, bold: true, align: "center", margin: 0 });
    slide.addText(f[2], { x, y: y + 0.95, w: 2.7, h: 0.6, fontSize: 11, fontFace: "Calibri", color: "94A3B8", align: "center", margin: 0, lineSpacing: 18 });
  });

  addPageNum(slide, 4);
})();

// ================================================================
// SLIDE 5: DEVELOPMENT PHILOSOPHY
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("开发理念", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  const principles = [
    { icon: "\u{1F3AF}", title: "用户导向", desc: "以用户需求为核心，界面简洁直观，降低使用门槛，让每个人都能轻松开始健身之旅。" },
    { icon: "\u{1F4E6}", title: "分层架构", desc: "采用Controller-Service-Mapper三层架构，职责清晰、易于维护和扩展。" },
    { icon: "\u{1F510}", title: "安全优先", desc: "集成Spring Security + JWT双因子认证，保障用户数据和接口安全。" },
    { icon: "\u{1F504}", title: "渐进迭代", desc: "从MVP核心功能出发，逐步完善功能模块。优先保证核心流程的稳定性和可用性。" },
    { icon: "\u{1F310}", title: "全栈一体", desc: "前端页面与后端服务整合在同一项目中，简化部署流程，适合中小型项目快速开发。" },
    { icon: "\u{1F4A1}", title: "实用主义", desc: "不过度设计，选用成熟稳定的技术方案。Lombok减少样板代码，Bootstrap加速UI开发。" },
  ];

  principles.forEach((p, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 3.0;
    const y = 1.2 + row * 2.1;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.7, h: 1.85, fill: { color: C.white }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.7, h: 0.05, fill: { color: C.primary } });

    slide.addText(p.icon, { x, y: y + 0.15, w: 2.7, h: 0.4, fontSize: 20, align: "center", margin: 0 });
    slide.addText(p.title, { x, y: y + 0.52, w: 2.7, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.textDark, bold: true, align: "center", margin: 0 });
    slide.addText(p.desc, { x: x + 0.2, y: y + 0.85, w: 2.3, h: 0.85, fontSize: 10.5, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0, lineSpacing: 16 });
  });

  addPageNum(slide, 5);
})();

// ================================================================
// SLIDE 6: TECH STACK OVERVIEW
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("技术栈总览", { x: 0.8, y: 0.35, w: 5, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // Four categories
  const categories = [
    {
      title: "前端技术",
      color: C.lightBlue,
      items: ["HTML5 + CSS3", "JavaScript (ES6+)", "Bootstrap 5", "Bootstrap Icons", "ECharts 可视化"],
    },
    {
      title: "后端技术",
      color: C.green,
      items: ["Spring Boot 3.2", "Java 21", "MyBatis + MySQL", "Spring Security", "JWT 认证令牌"],
    },
    {
      title: "开发工具",
      color: C.orange,
      items: ["IntelliJ IDEA", "Maven 构建", "Git 版本控制", "Lombok 注解", "DevTools 热重载"],
    },
    {
      title: "数据存储",
      color: C.purple,
      items: ["MySQL 8.0", "本地文件存储", "静态资源托管", "UTF-8 编码", "连接池管理"],
    },
  ];

  categories.forEach((cat, i) => {
    const x = 0.5 + i * 2.35;
    const y = 1.3;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 3.8, fill: { color: C.white, transparency: 95 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 0.05, fill: { color: cat.color } });

    slide.addText(cat.title, { x, y: y + 0.2, w: 2.15, h: 0.4, fontSize: 15, fontFace: "Arial", color: cat.color, bold: true, align: "center", margin: 0 });

    cat.items.forEach((item, j) => {
      slide.addText(item, { x: x + 0.15, y: y + 0.8 + j * 0.55, w: 1.85, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", margin: 0 });
      slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.25, y: y + 0.78 + j * 0.55, w: 1.65, h: 0.35, fill: { color: C.primary, transparency: 85 } });
    });
  });

  addPageNum(slide, 6);
})();

// ================================================================
// SLIDE 7: BACKEND ARCHITECTURE
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("后端架构", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  // Architecture layers - vertical stack
  const layers = [
    { name: "Controller 控制层", desc: "接收HTTP请求，参数校验，调用Service", items: "Auth | Course | CheckIn | Community | Pomodoro | File | Admin", color: C.primary },
    { name: "Service 业务层", desc: "核心业务逻辑，事务管理，数据组装", items: "UserService | CourseService | CheckInService | CommunityService | ...", color: C.lightBlue },
    { name: "Mapper 持久层", desc: "MyBatis XML映射，数据库CRUD操作", items: "UserMapper | CourseMapper | CheckInMapper | PostMapper | ...", color: C.accent },
    { name: "Database 数据库", desc: "MySQL 8.0，7张核心业务表", items: "users | courses | videos | checkins | posts | comments | pomodoro_records", color: C.green },
  ];

  layers.forEach((layer, i) => {
    const y = 1.25 + i * 1.05;

    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.9, fill: { color: C.white }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 0.07, h: 0.9, fill: { color: layer.color } });

    // Layer name
    slide.addText(layer.name, { x: 1.1, y, w: 2.5, h: 0.5, fontSize: 15, fontFace: "Arial", color: C.textDark, bold: true, margin: 0, valign: "middle" });
    // Layer description
    slide.addText(layer.desc, { x: 1.1, y: y + 0.42, w: 7.9, h: 0.35, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });
    // Items
    slide.addText(layer.items, { x: 3.6, y, w: 5.4, h: 0.5, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0, valign: "middle", italic: true });
  });

  // Arrow connections
  for (let i = 0; i < 3; i++) {
    slide.addText("\u{2193}", { x: 4.8, y: 2.2 + i * 1.05, w: 0.4, h: 0.25, fontSize: 14, color: C.textMuted, align: "center", margin: 0 });
  }

  // Right side: security note
  slide.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 0.4, w: 2.3, h: 0.65, fill: { color: C.primary } });
  slide.addText("Security Layer\nJWT Filter + Spring Security", { x: 7.2, y: 0.4, w: 2.3, h: 0.65, fontSize: 10, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0, lineSpacing: 14 });

  addPageNum(slide, 7);
})();

// ================================================================
// SLIDE 8: DATABASE DESIGN
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("数据库设计", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // 7 tables as cards
  const tables = [
    { name: "users", desc: "用户信息，含角色权限", key: "username, password, role" },
    { name: "courses", desc: "课程信息与分类", key: "title, category, difficulty" },
    { name: "videos", desc: "视频资源挂载到课程", key: "course_id, url, duration" },
    { name: "checkins", desc: "每日运动打卡记录", key: "user_id, check_date" },
    { name: "posts", desc: "社区帖子内容", key: "user_id, title, like_count" },
    { name: "comments", desc: "帖子评论关联", key: "post_id, user_id" },
    { name: "pomodoro_records", desc: "番茄钟专注记录", key: "user_id, focus_minutes, cycles" },
  ];

  tables.forEach((t, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cardsInRow = row === 1 ? 3 : 4;
    const totalWidth = cardsInRow * 2.15 + (cardsInRow - 1) * 0.2;
    const startX = (10 - totalWidth) / 2;
    const x = startX + col * 2.35;
    const y = 1.3 + row * 2.0;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 1.7, fill: { color: C.white, transparency: 95 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.15, h: 0.04, fill: { color: C.lightBlue } });

    // Table icon (with circle background)
    slide.addShape(pres.shapes.OVAL, { x: x + 0.05, y: y + 0.02, w: 0.4, h: 0.4, fill: { color: C.primary, transparency: 70 } });
    slide.addText("\u{1F4BE}", { x, y, w: 0.5, h: 0.45, fontSize: 14, align: "center", valign: "middle", margin: 0 });
    // Table name
    slide.addText(t.name, { x: x + 0.55, y: y + 0.05, w: 1.5, h: 0.45, fontSize: 13, fontFace: "Consolas", color: C.lightBlue, bold: true, valign: "middle", margin: 0 });
    // Description
    slide.addText(t.desc, { x: x + 0.15, y: y + 0.55, w: 1.85, h: 0.4, fontSize: 10.5, fontFace: "Calibri", color: C.white, margin: 0 });
    // Key fields
    slide.addText(t.key, { x: x + 0.15, y: y + 0.95, w: 1.85, h: 0.55, fontSize: 9.5, fontFace: "Consolas", color: "94A3B8", margin: 0, italic: true, lineSpacing: 14 });
  });

  // Bottom note
  slide.addText("共计7张核心业务表 | 支持utf8mb4编码 | 包含初始示例数据", { x: 0.5, y: 5.1, w: 9, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0 });

  addPageNum(slide, 8);
})();

// ================================================================
// SLIDE 9: CORE FEATURES SHOWCASE
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("核心功能一览", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  // Feature showcase in 3 big cards per row
  const features = [
    { icon: "\u{1F3E0}", name: "首页", desc: "轮播图、统计卡片、课程推荐", pages: "index.html" },
    { icon: "\u{1F4DA}", name: "课程中心", desc: "课程分类、视频播放、难度分级", pages: "courses.html" },
    { icon: "\u{270F}", name: "每日打卡", desc: "打卡记录、图片上传、连续统计", pages: "checkin.html" },
    { icon: "\u{1F465}", name: "社区广场", desc: "发帖/评论/点赞、互动社交", pages: "community.html" },
    { icon: "\u{23F3}", name: "番茄钟", desc: "专注计时、休息提醒、周期追踪", pages: "pomodoro.html" },
    { icon: "\u{1F6A8}", name: "后台管理", desc: "数据仪表盘、内容管理、ECharts", pages: "admin/index.html" },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 3.1;
    const y = 1.2 + row * 2.1;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.85, h: 1.85, fill: { color: C.white }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.85, h: 0.05, fill: { color: C.primary } });

    // Icon circle
    slide.addShape(pres.shapes.OVAL, { x: x + 1.02, y: y + 0.2, w: 0.7, h: 0.7, fill: { color: C.lightBg } });
    slide.addText(f.icon, { x: x + 1.02, y: y + 0.2, w: 0.7, h: 0.7, fontSize: 22, align: "center", valign: "middle", margin: 0 });

    slide.addText(f.name, { x, y: y + 0.95, w: 2.85, h: 0.35, fontSize: 16, fontFace: "Arial", color: C.textDark, bold: true, align: "center", margin: 0 });
    slide.addText(f.desc, { x, y: y + 1.25, w: 2.85, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0 });
    slide.addText(f.pages, { x, y: y + 1.5, w: 2.85, h: 0.25, fontSize: 9, fontFace: "Consolas", color: C.textMuted, align: "center", margin: 0, italic: true });
  });

  addPageNum(slide, 9);
})();

// ================================================================
// SLIDE 10: DEMO VIDEO PLACEHOLDER
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("项目演示", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // Video placeholder area
  slide.addShape(pres.shapes.RECTANGLE, { x: 1, y: 1.2, w: 8, h: 3.8, fill: { color: C.darkBlue } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 1, y: 1.2, w: 8, h: 3.8, line: { color: C.lightBlue, width: 2, dashType: "dash" } });

  // Play button icon
  slide.addShape(pres.shapes.OVAL, { x: 4.2, y: 2.2, w: 1.6, h: 1.6, fill: { color: C.primary, transparency: 30 } });
  slide.addShape(pres.shapes.OVAL, { x: 4.35, y: 2.35, w: 1.3, h: 1.3, fill: { color: C.primary } });
  slide.addText("\u{25B6}", { x: 4.35, y: 2.35, w: 1.3, h: 1.3, fontSize: 36, color: C.white, align: "center", valign: "middle", margin: 0 });

  // Placeholder text
  slide.addText("此处插入项目演示视频", { x: 1, y: 4.0, w: 8, h: 0.5, fontSize: 18, fontFace: "Arial", color: C.white, bold: true, align: "center", margin: 0 });
  slide.addText("（请在此处放置录制的功能演示视频）", { x: 1, y: 4.45, w: 8, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0 });

  addPageNum(slide, 10);
})();

// ================================================================
// SLIDE 11: MODULE 1-2 (Auth + Course)
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("模块详解", { x: 0.8, y: 0.35, w: 3, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });
  slide.addText("用户认证 & 课程管理", { x: 4.0, y: 0.4, w: 4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.textMuted, margin: 0, valign: "middle" });

  // Module 1: Auth
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.primary } });

  addSectionNum(slide, 1, 0.8, 1.35);
  slide.addText("用户认证模块", { x: 1.4, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const authPoints = [
    "注册/登录：表单校验 + BCrypt加密存储",
    "JWT令牌：无状态认证，24小时有效期",
    "AuthFilter：拦截所有请求，验证Token",
    "角色权限：user / admin 两级权限控制",
    "SecurityConfig：CSRF保护、路径放行配置",
  ];
  slide.addText(authPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < authPoints.length - 1 } })), { x: 0.8, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  // Module 2: Course
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.accent } });

  addSectionNum(slide, 2, 5.5, 1.35);
  slide.addText("课程管理模块", { x: 6.1, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const coursePoints = [
    "课程列表：分类筛选（有氧/力量/瑜伽/HIIT）",
    "课程详情：教练信息、难度评级、浏览/报名数",
    "视频播放：HTML5播放器，按序学习",
    "CourseService + VideoService双Service",
    "course-detail.html 动态加载课程内容",
  ];
  slide.addText(coursePoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < coursePoints.length - 1 } })), { x: 5.5, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  addPageNum(slide, 11);
})();

// ================================================================
// SLIDE 12: MODULE 3-4 (Community + CheckIn)
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("模块详解", { x: 0.8, y: 0.35, w: 3, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });
  slide.addText("社区互动 & 打卡系统", { x: 4.0, y: 0.4, w: 4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.textMuted, margin: 0, valign: "middle" });

  // Module 3: Community
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.orange } });

  addSectionNum(slide, 3, 0.8, 1.35);
  slide.addText("社区互动模块", { x: 1.4, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const commPoints = [
    "帖子发布：支持标题+内容+图片上传",
    "评论功能：帖子下多级评论，实时互动",
    "点赞系统：帖子点赞数统计与展示",
    "CommunityService + CommentService",
    "community.html 承载前端交互界面",
  ];
  slide.addText(commPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < commPoints.length - 1 } })), { x: 0.8, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  // Module 4: CheckIn
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.green } });

  addSectionNum(slide, 4, 5.5, 1.35);
  slide.addText("打卡系统模块", { x: 6.1, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const chkPoints = [
    "每日打卡：日期记录 + 内容描述 + 图片",
    "打卡列表：用户可查看历史打卡记录",
    "运动时长：每次打卡可记录锻炼分钟数",
    "持续激励：通过记录追踪保持运动习惯",
    "checkin.html 提供完整的打卡交互UI",
  ];
  slide.addText(chkPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < chkPoints.length - 1 } })), { x: 5.5, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  addPageNum(slide, 12);
})();

// ================================================================
// SLIDE 13: MODULE 5-6 (Pomodoro + Admin)
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("模块详解", { x: 0.8, y: 0.35, w: 3, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });
  slide.addText("番茄钟 & 后台管理", { x: 4.0, y: 0.4, w: 4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.textMuted, margin: 0, valign: "middle" });

  // Module 5: Pomodoro
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.purple } });

  addSectionNum(slide, 5, 0.8, 1.35);
  slide.addText("番茄钟模块", { x: 1.4, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const pomoPoints = [
    "专注计时：25分钟专注 + 5分钟休息循环",
    "循环管理：支持多周期连续训练",
    "记录追踪：保存每次番茄钟的周期数据",
    "备注功能：为每次记录添加训练备注",
    "pomodoro.html + pomodoro.js 实现交互",
  ];
  slide.addText(pomoPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < pomoPoints.length - 1 } })), { x: 0.8, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  // Module 6: Admin
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.8, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.red } });

  addSectionNum(slide, 6, 5.5, 1.35);
  slide.addText("后台管理模块", { x: 6.1, y: 1.35, w: 3, h: 0.5, fontSize: 20, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const adminPoints = [
    "仪表盘：ECharts图表展示整体数据",
    "用户管理：查看用户列表、启用/禁用",
    "课程管理：课程CRUD、视频管理",
    "帖子管理：内容审核、帖子删除",
    "admin/index.html 独立管理界面",
  ];
  slide.addText(adminPoints.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < adminPoints.length - 1 } })), { x: 5.5, y: 2.1, w: 3.7, h: 2.7, fontSize: 11.5, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  addPageNum(slide, 13);
})();

// ================================================================
// SLIDE 14: MODULE 7 - FRONTEND UI
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("模块详解", { x: 0.8, y: 0.35, w: 3, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });
  slide.addText("前端界面与交互", { x: 4.0, y: 0.4, w: 4, h: 0.5, fontSize: 16, fontFace: "Arial", color: C.textMuted, margin: 0, valign: "middle" });

  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 3.85, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.15, w: 0.07, h: 3.85, fill: { color: C.primary } });

  addSectionNum(slide, 7, 0.8, 1.3);

  // Frontend tech stack cards
  const techItems = [
    { name: "HTML5 + CSS3", desc: "语义化标签，CSS变量管理主题色，响应式弹性布局" },
    { name: "JavaScript ES6+", desc: "原生JS实现AJAX请求、DOM操作、事件处理" },
    { name: "Bootstrap 5", desc: "栅格系统、组件样式、bootstrap.bundle.min.js" },
    { name: "Bootstrap Icons", desc: "矢量图标库，统一视觉风格" },
    { name: "ECharts", desc: "数据可视化图表，用于管理后台仪表盘" },
    { name: "页面结构", desc: "9个HTML页面：用户端8页 + 管理端1页" },
  ];

  techItems.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 2.8;
    const y = 1.9 + row * 1.45;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.55, h: 1.2, fill: { color: C.lightBg } });
    slide.addText(item.name, { x, y: y + 0.1, w: 2.55, h: 0.35, fontSize: 13, fontFace: "Arial", color: C.primary, bold: true, align: "center", margin: 0 });
    slide.addText(item.desc, { x: x + 0.1, y: y + 0.5, w: 2.35, h: 0.6, fontSize: 10.5, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0, lineSpacing: 15 });
  });

  addPageNum(slide, 14);
})();

// ================================================================
// SLIDE 15: TEAM DIVISION
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("团队分工", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // Team members and their assignments
  const team = [
    { name: "姬天宇", role: "后端开发", modules: "用户认证模块 + 课程与视频模块", color: C.primary, tags: ["Spring Security", "JWT", "MyBatis"] },
    { name: "李铭煜", role: "组长 · 前端", modules: "前端界面与交互设计", color: C.lightBlue, tags: ["Bootstrap", "HTML/CSS", "UI/UX"] },
    { name: "马启茂", role: "后端开发", modules: "社区互动模块", color: C.accent, tags: ["PostService", "Comment", "REST API"] },
    { name: "张博鑫", role: "后端开发", modules: "打卡系统模块", color: C.green, tags: ["CheckIn", "文件上传", "记录管理"] },
    { name: "封超", role: "后端开发", modules: "番茄钟模块 + JWT工具类", color: C.purple, tags: ["Pomodoro", "JwtUtil", "定时逻辑"] },
    { name: "闫墨存", role: "后端开发", modules: "后台管理模块", color: C.orange, tags: ["Admin", "ECharts", "数据管理"] },
    { name: "陈灏达", role: "全栈协助", modules: "前后端联调 + 数据库初始化", color: C.red, tags: ["API联调", "SQL", "测试"] },
  ];

  // Table header
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.15, w: 9, h: 0.45, fill: { color: C.primary } });
  slide.addText("姓名", { x: 0.6, y: 1.15, w: 1.2, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0 });
  slide.addText("角色", { x: 1.8, y: 1.15, w: 1.2, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0 });
  slide.addText("负责模块", { x: 3.0, y: 1.15, w: 2.8, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0 });
  slide.addText("关键技术", { x: 5.8, y: 1.15, w: 3.5, h: 0.45, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0 });

  team.forEach((member, i) => {
    const y = 1.6 + i * 0.55;
    const bgColor = i % 2 === 0 ? C.white : C.lightBg;
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 9, h: 0.55, fill: { color: bgColor, transparency: 95 } });

    // Name
    slide.addText(member.name, { x: 0.6, y, w: 1.2, h: 0.55, fontSize: 12, fontFace: "Arial", color: C.white, bold: true, valign: "middle", margin: 0 });
    // Role badge
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.8, y: y + 0.12, w: 1.4, h: 0.3, fill: { color: member.color }, rectRadius: 0.05 });
    slide.addText(member.role, { x: 1.8, y: y + 0.12, w: 1.4, h: 0.3, fontSize: 10, fontFace: "Arial", color: C.white, align: "center", valign: "middle", margin: 0 });
    // Modules
    slide.addText(member.modules, { x: 3.0, y, w: 2.8, h: 0.55, fontSize: 10.5, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0 });
    // Tags
    slide.addText(member.tags.join("  |  "), { x: 5.8, y, w: 3.5, h: 0.55, fontSize: 9.5, fontFace: "Consolas", color: "94A3B8", valign: "middle", margin: 0, italic: true });
  });

  addPageNum(slide, 15);
})();

// ================================================================
// SLIDE 16: DEVELOPMENT PROCESS
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("开发流程", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  // Process steps - horizontal flow
  const steps = [
    { num: "01", title: "需求分析", desc: "确定功能范围\n设计业务流程" },
    { num: "02", title: "数据库设计", desc: "ER图建模\n编写init.sql" },
    { num: "03", title: "后端开发", desc: "分层架构实现\nController-Service-Mapper" },
    { num: "04", title: "前端页面", desc: "HTML/CSS/JS\nBootstrap UI" },
    { num: "05", title: "联调测试", desc: "前后端接口\n功能验证" },
    { num: "06", title: "答辩准备", desc: "PPT汇报\n演示视频录制" },
  ];

  steps.forEach((step, i) => {
    const x = 0.3 + i * 1.6;
    const y = 1.3;

    // Card
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.45, h: 2.5, fill: { color: C.white }, shadow: makeShadow() });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.45, h: 0.05, fill: { color: C.primary } });

    // Step number
    slide.addText(step.num, { x, y: y + 0.2, w: 1.45, h: 0.5, fontSize: 32, fontFace: "Arial Black", color: C.primary, align: "center", margin: 0 });
    // Title
    slide.addText(step.title, { x, y: y + 0.75, w: 1.45, h: 0.35, fontSize: 14, fontFace: "Arial", color: C.textDark, bold: true, align: "center", margin: 0 });
    // Description
    slide.addText(step.desc, { x: x + 0.08, y: y + 1.15, w: 1.29, h: 0.9, fontSize: 10, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0, lineSpacing: 17 });

    // Arrow between cards
    if (i < steps.length - 1) {
      slide.addText("\u{2192}", { x: x + 1.4, y: y + 1.0, w: 0.25, h: 0.4, fontSize: 16, color: C.primary, align: "center", margin: 0 });
    }
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 9, h: 0.8, fill: { color: C.navy } });
  slide.addText("开发模式：单体全栈项目 | 版本控制：Git | 开发周期：16周 | 开发工具：IntelliJ IDEA + Maven", { x: 0.5, y: 4.2, w: 9, h: 0.8, fontSize: 11, fontFace: "Calibri", color: C.white, align: "center", valign: "middle", margin: 0 });

  addPageNum(slide, 16);
})();

// ================================================================
// SLIDE 17: PROJECT HIGHLIGHTS
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("项目亮点", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  const highlights = [
    { icon: "\u{1F4E6}", title: "清晰分层架构", desc: "Controller-Service-Mapper三层分离，职责明确，代码可读性强，便于后续扩展维护。" },
    { icon: "\u{1F510}", title: "安全认证体系", desc: "Spring Security + JWT双保险，密码BCrypt加密存储，接口权限分级控制。" },
    { icon: "\u{1F4F1}", title: "响应式UI设计", desc: "Bootstrap 5栅格系统，一套代码兼容桌面/平板/手机，用户体验统一。" },
    { icon: "\u{1F4CA}", title: "数据可视化", desc: "ECharts集成，管理后台直观展示用户增长、课程热度等核心指标。" },
    { icon: "\u{1F4BE}", title: "完整数据模型", desc: "7张业务表覆盖核心场景，init.sql一键初始化，含示例数据开箱即用。" },
    { icon: "\u{1F916}", title: "功能丰富全面", desc: "涵盖课程、打卡、社区、番茄钟四大业务模块 + 独立管理后台。" },
  ];

  highlights.forEach((h, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.6;
    const y = 1.2 + row * 1.4;

    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.3, h: 1.25, fill: { color: C.white, transparency: 95 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h: 1.25, fill: { color: C.lightBlue } });

    // Icon (with circle background)
    slide.addShape(pres.shapes.OVAL, { x: x + 0.1, y: y + 0.15, w: 0.6, h: 0.6, fill: { color: C.lightBlue, transparency: 70 } });
    slide.addText(h.icon, { x, y: y + 0.1, w: 0.8, h: 0.6, fontSize: 22, align: "center", valign: "middle", margin: 0 });
    // Title
    slide.addText(h.title, { x: 0.9, y, w: 1.5, h: 0.55, fontSize: 15, fontFace: "Arial", color: C.lightBlue, bold: true, margin: 0, valign: "middle" });
    // Description
    slide.addText(h.desc, { x: 2.4, y: y + 0.08, w: 2.2, h: 1.1, fontSize: 10.5, fontFace: "Calibri", color: C.white, margin: 0, valign: "middle", lineSpacing: 17 });
  });

  addPageNum(slide, 17);
})();

// ================================================================
// SLIDE 18: ISSUES & OPTIMIZATION
// ================================================================
(function() {
  const slide = pres.addSlide();
  lightBg(slide);

  slide.addText("不足与优化", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.textDark, margin: 0 });

  // Current issues (left)
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 3.7, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.orange } });

  slide.addText("\u{26A0}  现存不足", { x: 0.8, y: 1.35, w: 3.5, h: 0.45, fontSize: 16, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const issues = [
    "未实现前后端分离，耦合度较高",
    "缺少Redis缓存，高并发性能瓶颈",
    "没有单元测试和集成测试覆盖",
    "文件上传缺乏格式校验和安全防护",
    "API接口未实现限流和防刷机制",
    "配置文件中存在数据库明文密码",
    "用户登录未实现验证码防护",
  ];
  slide.addText(issues.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < issues.length - 1 } })), { x: 0.8, y: 1.9, w: 3.7, h: 2.8, fontSize: 11, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  // Optimization suggestions (right)
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.7, fill: { color: C.white }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.06, fill: { color: C.green } });

  slide.addText("\u{1F4A1}  优化建议", { x: 5.5, y: 1.35, w: 3.5, h: 0.45, fontSize: 16, fontFace: "Arial", color: C.textDark, bold: true, margin: 0 });

  const optimizations = [
    "前后端分离：Vue/React + RESTful API",
    "引入Redis缓存热点数据，提升性能",
    "编写JUnit单元测试，保证代码质量",
    "文件上传增加类型/大小安全校验",
    "API接口引入令牌桶限流算法",
    "敏感配置迁移至环境变量或配置中心",
    "登录增加图形验证码 + 次数限制",
  ];
  slide.addText(optimizations.map((p, i) => ({ text: p, options: { bullet: true, breakLine: i < optimizations.length - 1 } })), { x: 5.5, y: 1.9, w: 3.7, h: 2.8, fontSize: 11, fontFace: "Calibri", color: C.textMuted, valign: "top", lineSpacing: 26 });

  addPageNum(slide, 18);
})();

// ================================================================
// SLIDE 19: FUTURE OUTLOOK
// ================================================================
(function() {
  const slide = pres.addSlide();
  darkBg(slide);

  slide.addText("未来展望", { x: 0.8, y: 0.35, w: 4, h: 0.65, fontSize: 34, fontFace: "Arial Black", color: C.white, margin: 0 });

  // Future plans in a timeline style
  const plans = [
    { phase: "短期计划", time: "本学期", color: C.lightBlue, items: [
      "完善现有模块功能细节和交互体验",
      "增加用户个人资料编辑与头像上传",
      "完成答辩准备与项目演示录制",
    ]},
    { phase: "中期计划", time: "下学期", color: C.accent, items: [
      "引入AI问答指导功能，提供专业运动建议",
      "前后端分离重构，提升架构可扩展性",
      "增加训练计划定制功能，个性化推荐课程",
    ]},
    { phase: "长期规划", time: "未来", color: C.green, items: [
      "小程序/App多端覆盖，扩大用户群体",
      "引入社交化功能：排行榜、挑战赛、好友对战",
      "接入可穿戴设备数据，实现智能训练分析",
    ]},
  ];

  plans.forEach((plan, i) => {
    const x = 0.5 + i * 3.1;
    const y = 1.3;

    // Timeline dot
    slide.addShape(pres.shapes.OVAL, { x: x + 1.25, y: y - 0.1, w: 0.3, h: 0.3, fill: { color: plan.color } });

    // Phase card
    slide.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.4, w: 2.8, h: 3.6, fill: { color: C.white, transparency: 95 } });
    slide.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.4, w: 2.8, h: 0.05, fill: { color: plan.color } });

    // Phase name
    slide.addText(plan.phase, { x, y: y + 0.6, w: 2.8, h: 0.4, fontSize: 18, fontFace: "Arial", color: plan.color, bold: true, align: "center", margin: 0 });
    // Time
    slide.addText(plan.time, { x, y: y + 0.95, w: 2.8, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0, italic: true });

    // Items
    plan.items.forEach((item, j) => {
      slide.addText(item, { x: x + 0.2, y: y + 1.4 + j * 0.65, w: 2.4, h: 0.55, fontSize: 10.5, fontFace: "Calibri", color: C.white, margin: 0, lineSpacing: 16 });
      slide.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: y + 1.38 + j * 0.65, w: 0.05, h: 0.05, fill: { color: plan.color } });
    });
  });

  // Connecting line
  slide.addShape(pres.shapes.LINE, { x: 1.9, y: 1.3, w: 3.0, h: 0, line: { color: C.primary, width: 2, dashType: "dash" } });
  slide.addShape(pres.shapes.LINE, { x: 5.0, y: 1.3, w: 3.0, h: 0, line: { color: C.accent, width: 2, dashType: "dash" } });

  // AI highlight badge
  slide.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 4.9, w: 5, h: 0.4, fill: { color: C.primary }, rectRadius: 0.05 });
  slide.addText("\u{1F916}  核心展望：引入AI运动指导，打造更智能的健身体验", { x: 2.5, y: 4.9, w: 5, h: 0.4, fontSize: 11, fontFace: "Arial", color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  addPageNum(slide, 19);
})();

// ================================================================
// SLIDE 20: THANK YOU
// ================================================================
(function() {
  const slide = pres.addSlide();
  slide.background = { color: C.darkBlue };

  // Left vertical accent
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: C.lightBlue } });

  // Large background shapes
  slide.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: -1, w: 5, h: 5, fill: { color: C.primary, transparency: 92 }, rotate: -20 });

  // Thank you text
  slide.addText("感谢聆听", { x: 0.8, y: 1.5, w: 8, h: 1.0, fontSize: 48, fontFace: "Arial Black", color: C.white, bold: true, margin: 0, charSpacing: 6 });

  slide.addShape(pres.shapes.LINE, { x: 0.8, y: 2.6, w: 3, h: 0, line: { color: C.lightBlue, width: 3 } });

  slide.addText("FitKeep - 智能健身管理平台", { x: 0.8, y: 2.9, w: 8, h: 0.5, fontSize: 18, fontFace: "Calibri", color: "94A3B8", margin: 0 });

  // Team members
  slide.addText("姬天宇  |  李铭煜  |  马启茂  |  张博鑫  |  封超  |  闫墨存  |  陈灏达", { x: 0.8, y: 3.5, w: 8.5, h: 0.4, fontSize: 13, fontFace: "Arial", color: C.textMuted, margin: 0 });

  // QA hint
  slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 3.2, h: 0.5, fill: { color: C.primary }, rectRadius: 0.05 });
  slide.addText("欢迎提问与交流", { x: 0.8, y: 4.2, w: 3.2, h: 0.5, fontSize: 14, fontFace: "Arial", color: C.white, align: "center", valign: "middle", margin: 0 });

  // Bottom bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.425, w: 10, h: 0.2, fill: { color: C.primary } });
})();

// ================================================================
// GENERATE
// ================================================================
pres.writeFile({ fileName: "FitKeep项目汇报.pptx" })
  .then(() => console.log("DONE: FitKeep项目汇报.pptx"))
  .catch(err => console.error("ERROR:", err));
