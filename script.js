const backendUrl = 'https://auwal-backend.vercel.app'; // URL ɗin ka

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

  // Hide loading after 3 sec
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.classList.add('hidden');
      app.classList.remove('hidden');
    }, 500);
  }, 3000);

  // Dark Mode
  modeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  // New Chat
  newChat.addEventListener('click', () => {
    history = [];
    localStorage.setItem('auwal-history', JSON.stringify(history));
    historyDiv.innerHTML = '<div class="message ai-message"><p>Sannu! Ni ne Auwal AI. Me kake so ka tambaya? 😊</p></div>';
  });

  // Send message
  const sendMessage = async () => {
    const prompt = input.value.trim();
    if (!prompt) return;
    addMsg('user', prompt);
    input.value = '';

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      addMsg('ai', data.text || 'Ba a samu amsa ba');
    } catch {
      addMsg('ai', 'Kuskure: Duba WiFi ko internet');
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

  // Generate Image
  imgBtn.addEventListener('click', async () => {
    const prompt = input.value.trim();
    if (!prompt) return;
    addMsg('user', `Kirkiri hoto: ${prompt}`);
    input.value = '';

    try {
      const res = await fetch(`${backendUrl}/api/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.imageUrl) {
        addMsg('ai', 'An kirkira hoton:', data.imageUrl);
      } else {
        addMsg('ai', 'Ba a iya kirkirar hoto ba');
      }
    } catch {
      addMsg('ai', 'Kuskure: Ba a iya haɗi da server ba');
    }
  });

  function addMsg(sender, text, img = null) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.innerHTML = `<p>${text}</p>`;
    if (img) {
      const i = document.createElement('img');
      i.src = img;
      i.className = 'ai-image';
      div.appendChild(i);
    }
    historyDiv.appendChild(div);
    historyDiv.scrollTop = historyDiv.scrollHeight;

    history.push({ sender, text, img });
    localStorage.setItem('auwal-history', JSON.stringify(history));
  }

  function renderHistory() {
    historyDiv.innerHTML = '<div class="message ai-message"><p>Sannu! Ni ne Auwal AI. Me kake so ka tambaya? 😊</p></div>';
    history.forEach(m => addMsg(m.sender, m.text, m.img));
  }
});
