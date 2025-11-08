const backendUrl = 'https://auwal-backend.vercel.app';

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  const historyDiv = document.getElementById('chat-history');
  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const imgBtn = document.getElementById('image-btn');
  const newChat = document.getElementById('new-chat');
  const modeBtn = document.getElementById('toggle-mode');

  // Welcome message
  addMsg('ai', 'Sannu! Ni ne Auwal AI. Me kake so ka tambaya? 😊');

  // Hide loading
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.classList.add('hidden');
      app.classList.remove('hidden');
    }, 500);
  }, 2500);

  // Dark Mode
  modeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    modeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  };

  // New Chat
  newChat.onclick = () => {
    historyDiv.innerHTML = '';
    addMsg('ai', 'Sabon chat! Me kake so ka tambaya? 🚀');
  };

  // Send
  const send = async () => {
    const text = input.value.trim();
    if (!text) return;
    addMsg('user', text);
    input.value = '';

    try {
      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      addMsg('ai', data.text || 'Ba a samu amsa ba');
    } catch {
      addMsg('ai', '🚨 Kuskure: Duba WiFi');
    }
  };
  sendBtn.onclick = send;
  input.addEventListener('keypress', e => e.key === 'Enter' && send());

  // Generate Image
  imgBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;
    addMsg('user', `Kirkiri hoto: ${text}`);
    input.value = '';

    try {
      const res = await fetch(`${backendUrl}/api/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });
      const data = await res.json();
      if (data.imageUrl) {
        addMsg('ai', 'An kirkira hoton! 👇', data.imageUrl);
      } else {
        addMsg('ai', 'Ba a iya kirkirar hoto ba');
      }
    } catch {
      addMsg('ai', '🚨 Kuskure hoto');
    }
  };

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
  }
});
