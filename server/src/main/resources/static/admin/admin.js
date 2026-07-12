const token = localStorage.getItem('token');
const role = parseInt(localStorage.getItem('role'));
if (!token || role !== 1) window.location.href = '/user/login.html';

let currentSection = 'dashboard';

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2500);
}

async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
    ...opts
  });
  return res.json();
}

function showSection(sec) {
  currentSection = sec;
  document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
  // match by onclick attribute text to avoid relying on global event object
  document.querySelectorAll('.sb-item').forEach(el => {
    if (el.getAttribute('onclick') && el.getAttribute('onclick').includes(`'${sec}'`)) {
      el.classList.add('active');
    }
  });
  const renders = { dashboard: renderDashboard, users: renderUsers, courses: renderCourses, posts: renderPosts, checkins: renderCheckins };
  if (renders[sec]) renders[sec]();
}

async function renderDashboard() {
  const main = document.getElementById('mainContent');
  main.innerHTML = '<div class="page-title">仪表盘</div><div class="stats-grid" id="statsGrid"></div>';
  try {
    const d = await api('/api/admin/stats');
    if (d.code === 200) {
      document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card"><div class="icon ic-orange"><i class="bi bi-people-fill"></i></div><div class="num">${d.data.users}</div><div class="lbl">注册用户</div></div>
        <div class="stat-card"><div class="icon ic-teal"><i class="bi bi-play-circle-fill"></i></div><div class="num">${d.data.courses}</div><div class="lbl">课程总数</div></div>
        <div class="stat-card"><div class="icon ic-blue"><i class="bi bi-calendar2-check-fill"></i></div><div class="num">${d.data.checkins}</div><div class="lbl">打卡记录</div></div>
        <div class="stat-card"><div class="icon ic-red"><i class="bi bi-chat-square-text-fill"></i></div><div class="num">${d.data.posts}</div><div class="lbl">社区帖子</div></div>`;
    }
  } catch(e) {}
}

async function renderUsers() {
  const main = document.getElementById('mainContent');
  main.innerHTML = '<div class="page-title">用户管理</div><div class="content-card"><div class="card-header"><h3>用户列表</h3></div><div class="card-body"><table><thead><tr><th>ID</th><th>用户名</th><th>昵称</th><th>角色</th><th>状态</th><th>注册时间</th><th>操作</th></tr></thead><tbody id="userTbody"></tbody></table></div></div>';
  try {
    const d = await api('/api/admin/users');
    if (d.code !== 200) return;
    const tbody = document.getElementById('userTbody');
    if (!d.data.length) { tbody.innerHTML = '<tr><td colspan="7" class="empty">暂无用户</td></tr>'; return; }
    tbody.innerHTML = d.data.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.nickname || '-'}</td>
        <td><span class="badge ${u.role === 1 ? 'badge-orange' : 'badge-grey'}">${u.role === 1 ? '管理员' : '用户'}</span></td>
        <td><span class="badge ${u.status === 1 ? 'badge-green' : 'badge-red'}">${u.status === 1 ? '正常' : '禁用'}</span></td>
        <td>${u.createTime ? new Date(u.createTime).toLocaleDateString('zh-CN') : '-'}</td>
        <td>
          <button class="btn-sm btn-warn" onclick="toggleUser(${u.id},${u.status})">${u.status === 1 ? '禁用' : '启用'}</button>
          ${u.role !== 1 ? `<button class="btn-sm btn-danger" style="margin-left:6px" onclick="deleteUser(${u.id})">删除</button>` : ''}
        </td>
      </tr>`).join('');
  } catch(e) {}
}

async function toggleUser(id, status) {
  const newStatus = status === 1 ? 0 : 1;
  try {
    await api('/api/admin/user/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    showToast(newStatus === 1 ? '已启用用户' : '已禁用用户');
    renderUsers();
  } catch(e) { showToast('操作失败'); }
}

async function deleteUser(id) {
  if (!confirm('确定删除该用户？')) return;
  try {
    await api('/api/admin/user/' + id, { method: 'DELETE' });
    showToast('删除成功'); renderUsers();
  } catch(e) { showToast('删除失败'); }
}
