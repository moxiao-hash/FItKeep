(() => {
  const panel = document.createElement('section');
  panel.className = 'fk-agent-panel';
  panel.setAttribute('aria-label', 'FitKeep 助手');
  panel.innerHTML = '<div class="fk-agent-head"><span>FitKeep 助手</span><button type="button" aria-label="关闭">×</button></div><div class="fk-agent-log" role="log" aria-live="polite"></div><form class="fk-agent-form"><input aria-label="输入消息" maxlength="2000" placeholder="问课程、打卡或番茄钟"><button type="submit">发送</button></form>';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'fk-agent-toggle';
  toggle.textContent = '✦ 运动助手';
  toggle.setAttribute('aria-label', '打开运动助手');
  document.body.append(panel, toggle);
  const log = panel.querySelector('.fk-agent-log');
  const form = panel.querySelector('form');
  const input = form.querySelector('input');
  const send = form.querySelector('button');
  const history = [];
  let busy = false;
  function bubble(content, role) {
    const node = document.createElement('div');
    node.className = 'fk-agent-bubble' + (role === 'user' ? ' user' : '');
    node.textContent = content;
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
  }
  async function chat(body) {
    if (busy) return;
    busy = true;
    send.disabled = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('请先登录。');
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        body: JSON.stringify(body)
      });
      if (response.status === 401 || response.status === 403) throw new Error('登录已失效，请重新登录。');
      const result = await response.json();
      if (result.code !== 200) throw new Error(result.message || '请求失败');
      bubble(result.data.reply, 'assistant');
      if (body.message) {
        history.push({role: 'user', content: body.message}, {role: 'assistant', content: result.data.reply});
        while (history.length > 8) history.shift();
      }
      if (result.data.pendingAction && result.data.confirmationToken) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'fk-agent-confirm';
        button.textContent = '确认打卡';
        button.addEventListener('click', () => {
          button.disabled = true;
          chat({confirmationToken: result.data.confirmationToken});
        });
        log.appendChild(button);
      }
    } catch (error) {
      bubble(error.message || '服务暂时不可用', 'assistant');
    } finally {
      busy = false;
      send.disabled = false;
    }
  }
  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) input.focus();
  });
  panel.querySelector('.fk-agent-head button').addEventListener('click', () => panel.classList.remove('open'));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || busy) return;
    input.value = '';
    bubble(message, 'user');
    chat({message, history: history.slice()});
  });
  bubble('你好！我可以查询课程、打卡和番茄钟数据，也能在你确认后帮你打卡。', 'assistant');
})();
