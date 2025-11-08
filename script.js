const backendUrl = 'https://auwal-backend.vercel.app'; // Canza bayan deploy

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  const historyDiv = document.getElementById('chat-history');
  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const imgBtn = document.getElementById('image-btn');
  const newChat = document.getElementById('new-chat');
  const modeBtn = document.getElementById('toggle-mode');

  let history = JSON.parse(localStorage.getItem('auwal-history')) || [];
  renderHistory();

  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => { loading.classList.add('hidden'); app.classList.remove('hidden'); }, 500);
  }, 3000);

  modeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  newChat.addEventListener('click', () => {
    history = []; localStorage.setItem('auwal-history', '[]'); historyDiv.innerHTML = '';
  });

  sendBtn.addEventListener('click', sendPrompt);
  imgBtn.addEventListener('click', generateImage);
  input.addEventListener('keypress', e => e.key === 'Enter' && sendPrompt());

  async function sendPrompt() {
    const prompt = input.value.trim(); if (!prompt) return;
    addMsg('user', prompt); input.value = '';
    const res = await fetch(`${backendUrl}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    addMsg('ai', data.text || data.error);
  }

  async function generateImage() {
    const prompt = input.value.trim(); if (!prompt) return;
    addMsg('user', `Generate: ${prompt}`); input.value = '';
    const res = await fetch(`${backendUrl}/api/image`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    const data = await res.json();
    if (data.imageUrl) addMsg('ai', 'Hoto:', data.imageUrl);
    else addMsg('ai', data.error);
  }

  function addMsg(sender, text, img = null) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.textContent = text;
    if (img) { const i = document.createElement('img'); i.src = img; i.className = 'ai-image'; div.appendChild(i); }
    historyDiv.appendChild(div); historyDiv.scrollTop = historyDiv.scrollHeight;
    history.push({ sender, text, img }); localStorage.setItem('auwal-history', JSON.stringify(history));
  }

  function renderHistory() {
    history.forEach(m => addMsg(m.sender, m.text, m.img));
  }
});
