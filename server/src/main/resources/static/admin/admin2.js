async function renderCourses() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="page-title">课程管理</div>
    <div class="content-card">
      <div class="card-header"><h3>课程列表</h3><button class="btn-primary-sm" onclick="showCourseModal()"><i class="bi bi-plus-lg me-1"></i>添加课程</button></div>
      <div class="card-body"><table><thead><tr><th>ID</th><th>课程名称</th><th>分类</th><th>难度</th><th>时长</th><th>教师</th><th>观看</th><th>操作</th></tr></thead><tbody id="courseTbody"></tbody></table></div>
    </div>`;
  try {
    const d = await api('/api/admin/courses');
    if (d.code !== 200) return;
    const tbody = document.getElementById('courseTbody');
    const diffLbl = {1:'入门',2:'进阶',3:'高阶'};
    if (!d.data.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty">暂无课程</td></tr>'; return; }
    tbody.innerHTML = d.data.map(c => `
      <tr>
        <td>${c.id}</td>
        <td style="max-width:180px;font-weight:700;color:#333">${c.title}</td>
        <td><span class="badge badge-orange">${c.category||'-'}</span></td>
        <td><span class="badge badge-grey">${diffLbl[c.difficulty]||'-'}</span></td>
        <td>${c.duration||0}分钟</td>
        <td>${c.teacherName||'-'}</td>
        <td>${c.viewCount||0}</td>
        <td>
          <button class="btn-sm btn-warn" onclick="editCourse(${c.id})"><i class="bi bi-pencil-square"></i> 编辑</button>
          <button class="btn-sm btn-danger" style="margin-left:6px" onclick="deleteCourse(${c.id})"><i class="bi bi-trash"></i> 删除</button>
        </td>
      </tr>`).join('');
  } catch(e) {}
}

function showCourseModal(c, videos = []) {
  document.getElementById('courseId').value = c ? c.id : '';
  document.getElementById('courseModalTitle').textContent = c ? '编辑课程' : '添加课程';
  document.getElementById('cTitle').value = c ? c.title : '';
  document.getElementById('cDesc').value = c ? c.description : '';
  document.getElementById('cCat').value = c ? c.category : 'cardio';
  document.getElementById('cDiff').value = c ? c.difficulty : '1';
  document.getElementById('cDur').value = c ? c.duration : '';
  document.getElementById('cTeacher').value = c ? c.teacherName : '';
  
  if (document.getElementById('cCover')) {
    document.getElementById('cCover').value = '';
    document.getElementById('cCover').dataset.oldUrl = c ? c.cover : '';
  }

  // Handle single video
  const v = (videos && videos.length > 0) ? videos[0] : null;
  document.getElementById('vAddId').value = v ? v.id : '';
  document.getElementById('vAddUrl').value = v ? v.url : '';
  if (document.getElementById('vAddFile')) document.getElementById('vAddFile').value = '';

  document.getElementById('courseModal').classList.add('show');
}

function hideCourseModal() { document.getElementById('courseModal').classList.remove('show'); }

async function uploadCourseVideo() {
  const file = document.getElementById('vAddFile').files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  showToast('正在上传视频...');
  try {
    const res = await fetch('/api/admin/video/upload', {
      method: 'POST',
      headers: {'Authorization': 'Bearer ' + token},
      body: formData
    });
    const d = await res.json();
    if (d.code === 200) {
      document.getElementById('vAddUrl').value = d.data;
      showToast('视频上传成功');
    } else {
      showToast('上传失败');
    }
  } catch(e) { showToast('网络错误'); }
}

async function saveCourse() {
  const id = document.getElementById('courseId').value;
  const coverFile = document.getElementById('cCover')?.files[0];
  let coverUrl = '';
  
  if (coverFile) {
    const formData = new FormData();
    formData.append('file', coverFile);
    try {
      const uploadRes = await fetch('/api/admin/course/upload-cover', {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + token},
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (uploadData.code === 200) coverUrl = uploadData.data;
    } catch(e) {}
  }
  
  const courseBody = {
    id: id ? parseInt(id) : undefined,
    title: document.getElementById('cTitle').value.trim(),
    description: document.getElementById('cDesc').value.trim(),
    cover: coverUrl || document.getElementById('cCover').dataset.oldUrl || '',
    category: document.getElementById('cCat').value,
    difficulty: parseInt(document.getElementById('cDiff').value),
    duration: parseInt(document.getElementById('cDur').value) || 0,
    teacherName: document.getElementById('cTeacher').value.trim()
  };
  
  if (!courseBody.title) { showToast('请填写课程名称'); return; }
  
  try {
    const method = id ? 'PUT' : 'POST';
    const res = await api('/api/admin/course', { method, body: JSON.stringify(courseBody) });
    if (res.code === 200) {
      // Save Video
      const courseId = id || res.data.id;
      const videoId = document.getElementById('vAddId').value;
      const videoUrl = document.getElementById('vAddUrl').value.trim();
      
      if (videoUrl) {
        const videoBody = {
          id: videoId ? parseInt(videoId) : undefined,
          courseId: parseInt(courseId),
          title: courseBody.title, // Use course title for the single video
          url: videoUrl,
          duration: courseBody.duration * 60, // estimate
          sortOrder: 1
        };
        // Simple add/update logic: just call POST (if backend handles update in POST or I use another endpoint)
        // Actually, let's just call the POST /video endpoint
        await api('/api/admin/video', { method: 'POST', body: JSON.stringify(videoBody) });
      }
      
      showToast('保存成功');
      hideCourseModal();
      renderCourses();
    } else {
      showToast(res.message || '保存失败');
    }
  } catch(e) { showToast('网络错误'); }
}

async function editCourse(id) {
  try {
    const d = await api('/api/courses/detail/' + id);
    if (d.code === 200) showCourseModal(d.data.course, d.data.videos);
    else showToast('获取详情失败');
  } catch(e) { showToast('网络错误'); }
}

async function deleteCourse(id) {
  if (!confirm('确定删除该课程？')) return;
  try {
    await api('/api/admin/course/' + id, { method: 'DELETE' });
    showToast('删除成功'); renderCourses();
  } catch(e) { showToast('删除失败'); }
}

async function renderPosts() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="page-title">社区管理</div>
    <div class="content-card">
      <div class="card-header"><h3>帖子列表</h3></div>
      <div class="card-body"><table><thead><tr><th>ID</th><th>内容</th><th>作者</th><th>状态</th><th>时间</th><th>操作</th></tr></thead><tbody id="postTbody"></tbody></table></div>
    </div>`;
  try {
    const d = await api('/api/admin/posts');
    if (d.code === 200) {
      const tbody = document.getElementById('postTbody');
      tbody.innerHTML = d.data.map(p => `
        <tr>
          <td>${p.id}</td>
          <td style="max-width:250px">${p.content}</td>
          <td>${p.username}</td>
          <td><span class="badge ${p.status===1?'badge-green':'badge-red'}">${p.status===1?'显示':'隐藏'}</span></td>
          <td>${new Date(p.createTime).toLocaleDateString()}</td>
          <td>
            <button class="btn-sm btn-warn" onclick="togglePost(${p.id},${p.status})">${p.status===1?'隐藏':'显示'}</button>
            <button class="btn-sm btn-danger" onclick="deletePost(${p.id})">删除</button>
          </td>
        </tr>`).join('');
    }
  } catch(e) {}
}

async function togglePost(id, status) {
  const newStatus = status === 1 ? 0 : 1;
  await api('/api/admin/post/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
  renderPosts();
}

async function deletePost(id) {
  if (!confirm('确定删除？')) return;
  await api('/api/admin/post/' + id, { method: 'DELETE' });
  renderPosts();
}

async function renderCheckins() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="page-title">打卡管理</div>
    <div class="content-card">
      <div class="card-header"><h3>打卡记录</h3></div>
      <div class="card-body"><table><thead><tr><th>ID</th><th>用户</th><th>日付</th><th>时长</th><th>操作</th></tr></thead><tbody id="checkinTbody"></tbody></table></div>
    </div>`;
  try {
    const d = await api('/api/admin/checkins');
    if (d.code === 200) {
      const tbody = document.getElementById('checkinTbody');
      tbody.innerHTML = d.data.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.username||c.userId}</td>
          <td>${c.checkDate}</td>
          <td>${c.duration}分</td>
          <td><button class="btn-sm btn-danger" onclick="deleteCheckin(${c.id})">删除</button></td>
        </tr>`).join('');
    }
  } catch(e) {}
}

async function deleteCheckin(id) {
  if (!confirm('确定删除？')) return;
  await api('/api/admin/checkin/' + id, { method: 'DELETE' });
  renderCheckins();
}

function logout() {
  localStorage.clear();
  window.location.href = '/user/login.html';
}

renderDashboard();
