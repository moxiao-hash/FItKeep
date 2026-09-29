-- 创建数据库
CREATE DATABASE IF NOT EXISTS keep_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE keep_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    role INT DEFAULT 0 COMMENT '0=user,1=admin',
    status INT DEFAULT 1 COMMENT '0=disabled,1=enabled',
    create_time DATETIME,
    update_time DATETIME
);

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover VARCHAR(255),
    category VARCHAR(50),
    difficulty INT DEFAULT 1,
    duration INT DEFAULT 0,
    teacher_id BIGINT,
    teacher_name VARCHAR(50),
    status INT DEFAULT 1,
    view_count INT DEFAULT 0,
    enroll_count INT DEFAULT 0,
    create_time DATETIME,
    update_time DATETIME
);

-- 视频表
CREATE TABLE IF NOT EXISTS videos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    duration INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    create_time DATETIME
);

-- 打卡表
CREATE TABLE IF NOT EXISTS checkins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    check_date DATE NOT NULL,
    content VARCHAR(500),
    duration INT DEFAULT 0,
    image_url VARCHAR(255),
    like_count INT DEFAULT 0,
    create_time DATETIME
);

-- 帖子表
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200),
    content TEXT,
    image_url VARCHAR(255),
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    status INT DEFAULT 1,
    create_time DATETIME,
    update_time DATETIME
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content VARCHAR(500) NOT NULL,
    create_time DATETIME
);

-- 番茄钟记录表
CREATE TABLE IF NOT EXISTS pomodoro_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    focus_minutes INT DEFAULT 25,
    break_minutes INT DEFAULT 5,
    cycles INT DEFAULT 1,
    note VARCHAR(255),
    create_time DATETIME
);

-- 管理员账号安全设置说明：
-- 为防范预置弱口令与固定凭据泄露，新装库默认不再包含可直接登录的默认管理员账号。
-- 部署管理员必须在部署上线时通过安全生成的随机高强度密码（经 BCrypt 哈希）单独录入管理员账号，
-- 或在首次运维配置流程中进行初始化，切勿在 SQL 脚本中使用公开固定哈希。
-- 示例（请替换真实用户名与高强度BCrypt哈希值）：
-- INSERT INTO users(username, password, nickname, role, status, create_time, update_time)
-- VALUES('secure_admin', '<BCRYPT_HASH_GENERATED_AT_DEPLOYMENT>', '系统管理员', 1, 1, NOW(), NOW());

-- 示例课程数据
INSERT IGNORE INTO courses(id, title, description, cover, category, difficulty, duration, teacher_name, status, view_count, enroll_count, create_time, update_time) VALUES
(1, '零基础入门跑步训练', '适合初学者的跑步入门课程，从走路到慢跑循序渐进，帮助你建立良好的有氧基础。', '', 'cardio', 1, 30, '张教练', 1, 128, 45, NOW(), NOW()),
(2, '核心力量强化训练', '专注于腹部和核心肌群的强化训练，提升身体稳定性和运动表现。', '', 'strength', 2, 45, '李教练', 1, 256, 89, NOW(), NOW()),
(3, '瑜伽放松舒缓课程', '每天20分钟瑜伽练习，缓解压力、改善柔韧性，让身心得到全面放松。', '', 'yoga', 1, 20, '王老师', 1, 312, 120, NOW(), NOW()),
(4, 'HIIT高强度间歇训练', '高效燃脂的HIIT训练，短时间内最大化运动效果，适合有一定基础的练习者。', '', 'hiit', 3, 25, '张教练', 1, 198, 67, NOW(), NOW());

-- 示例视频数据
INSERT IGNORE INTO videos(id, course_id, title, url, duration, sort_order, create_time) VALUES
(1, 1, '第一课：热身与走路训练', 'https://www.w3schools.com/html/mov_bbb.mp4', 300, 1, NOW()),
(2, 1, '第二课：慢跑基础姿势', 'https://www.w3schools.com/html/mov_bbb.mp4', 420, 2, NOW()),
(3, 2, '第一课：平板支撑入门', 'https://www.w3schools.com/html/mov_bbb.mp4', 360, 1, NOW()),
(4, 2, '第二课：卷腹训练进阶', 'https://www.w3schools.com/html/mov_bbb.mp4', 480, 2, NOW()),
(5, 3, '第一课：晨间唤醒瑜伽', 'https://www.w3schools.com/html/mov_bbb.mp4', 600, 1, NOW()),
(6, 4, '第一课：HIIT基础动作', 'https://www.w3schools.com/html/mov_bbb.mp4', 300, 1, NOW());
