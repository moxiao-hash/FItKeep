const token = localStorage.getItem('token');
if (!token) window.location.href = '/user/login.html';

const cfg = { focus:25, short:5, long:15, target:4 };
const lblMap = { focus:'专注时间', short:'短暂休息', long:'长时休息' };
let mode = 'focus', timeLeft = 1500, totalTime = 1500;
let running = false, iv = null;
let doneCycles = 0, sessionCycles = 0, sessionFocus = 0;

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 2500);
}
function pad(n){ return String(n).padStart(2,'0'); }

function updateDisplay() {
  document.getElementById('timerDisp').textContent = pad(Math.floor(timeLeft/60))+':'+pad(timeLeft%60);
  const circ = 2*Math.PI*88;
  // offset goes from 0 (full) to circ (empty) as time runs out
  document.getElementById('ringProg').style.strokeDashoffset = circ*(1 - timeLeft/totalTime);
  document.getElementById('ringProg').style.stroke = mode==='focus' ? '#FF6B35' : '#2EC4B6';
}

function updateDots() {
  // completed cycles within current round of cfg.target
  const filled = doneCycles % cfg.target === 0 && doneCycles > 0 ? cfg.target : doneCycles % cfg.target;
  document.getElementById('cycleDots').innerHTML =
    Array.from({length:cfg.target},(_,i)=>
      `<div class="cdot ${i<filled?'done':''}"></div>`).join('');
}

function setMode(m, btn) {
  if (running) return;
  mode = m;
  document.querySelectorAll('.mode-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  totalTime = cfg[m]*60; timeLeft = totalTime;
  document.getElementById('timerLbl').textContent = lblMap[m];
  updateDisplay(); updateDots();
}

function toggleTimer() {
  if (running) {
    clearInterval(iv); running = false;
    document.getElementById('playIcon').className = 'bi bi-play-fill';
  } else {
    running = true;
    document.getElementById('playIcon').className = 'bi bi-pause-fill';
    iv = setInterval(() => {
      timeLeft--; updateDisplay();
      if (timeLeft <= 0) { clearInterval(iv); running = false; document.getElementById('playIcon').className='bi bi-play-fill'; onComplete(); }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(iv); running = false;
  document.getElementById('playIcon').className = 'bi bi-play-fill';
  timeLeft = totalTime = cfg[mode]*60; updateDisplay();
}

function skipTimer() { clearInterval(iv); running=false; document.getElementById('playIcon').className='bi bi-play-fill'; onComplete(); }

function onComplete() {
  if (mode === 'focus') {
    doneCycles++; sessionCycles++; sessionFocus += cfg.focus;
    document.getElementById('sCycles').textContent = sessionCycles;
    document.getElementById('sFocus').textContent = sessionFocus;
    updateDots(); showToast('专注完成！休息一下 🎉');
    saveRecord();
    switchM(doneCycles % cfg.target === 0 ? 'long' : 'short');
  } else {
    showToast('休息结束，继续加油！'); switchM('focus');
  }
}

function switchM(m) {
  mode = m; totalTime = cfg[m]*60; timeLeft = totalTime;
  document.querySelectorAll('.mode-tab').forEach((b,i) =>
    b.classList.toggle('active',(i===0&&m==='focus')||(i===1&&m==='short')||(i===2&&m==='long')));
  document.getElementById('timerLbl').textContent = lblMap[m];
  updateDisplay();
}

function adj(key, delta) {
  if (running) return;
  const bounds = {focus:[5,90],short:[1,30],long:[5,60],target:[1,12]};
  const [mn,mx] = bounds[key];
  cfg[key] = Math.max(mn, Math.min(mx, cfg[key]+delta));
  document.getElementById(key+'Val').textContent = cfg[key];
  if (key === mode) { totalTime = cfg[key]*60; timeLeft = totalTime; updateDisplay(); }
  if (key === 'target') updateDots();
}

async function saveRecord() {
  try {
    await fetch('/api/pomodoro/save', {
      method:'POST',
      headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
      body: JSON.stringify({focusMinutes:cfg.focus, breakMinutes:cfg.short, cycles:1, note:''})
    });
    loadData();
  } catch(e){}
}

async function loadData() {
  try {
    const [s, h] = await Promise.all([
      fetch('/api/pomodoro/stats',{headers:{'Authorization':'Bearer '+token}}).then(r=>r.json()),
      fetch('/api/pomodoro/records',{headers:{'Authorization':'Bearer '+token}}).then(r=>r.json())
    ]);
    if (s.code===200) document.getElementById('tCycles').textContent = s.data.totalCycles;
    if (h.code===200) {
      const el = document.getElementById('histList');
      if (!h.data.length) { el.innerHTML='<p style="color:#bbb;text-align:center;padding:20px">暂无记录</p>'; return; }
      el.innerHTML = h.data.map(r => {
        const d = r.createTime ? new Date(r.createTime).toLocaleDateString('zh-CN',{month:'short',day:'numeric'}) : '';
        return `<div class="hist-item">
          <div><div class="hi-title">专注 ${r.focusMinutes} 分钟</div><div class="hi-sub">${r.note||'番茄专注'}</div></div>
          <div class="hi-right"><div class="hi-num">${r.cycles} 轮</div><div class="hi-time">${d}</div></div>
        </div>`;
      }).join('');
    }
  } catch(e){}
}

updateDisplay();
updateDots();
loadData();
