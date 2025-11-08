// === VEREL BACKEND URL (KA SAKA NAKA URL A NAN) ===
const backendUrl = 'https://auwal-backend.vercel.app'; // ← KA SAKA URL DINKA A NAN

document.addEventListener('DOMContentLoaded', () => {
  const loading = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  const historyDiv = document.getElementById('chat-history');
  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const imgBtn = document.getElementById('image-btn');
  const newChat = document.getElementById('new-chat');
  const modeBtn = document.getElementById('toggle-mode');

  // Load chat history from localStorage
  let history = JSON.parse(localStorage.getItem('auwal-history')) || [];
  renderHistory();

  // === LOADING SCREEN (3 seconds + animation) ===
  setTimeout(() => {
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.classList.add('hidden');
      app.classList.remove('hidden');
    }, 500);
  }, 3000);

  // === DARK / LIGHT MODE TOGGLE ===
  modeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    modeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  // === NEW CHAT (Clear history) ===
  newChat.addEventListener('click', () => {
    history = [];
    localStorage.setItem('auwal-history', JSON.stringify(history));
    historyDiv.innerHTML = '';
  });

  // === SEND TEXT PROMPT ===
  sendBtn.addEventListener('click', sendPrompt);
  input.addEventListener('keypress', e => e.key === 'Enter' && sendPrompt());

  async function sendPrompt() {
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
      addMsg('ai', data.text || `Error: ${data.error}`);
    } catch (error) {
      console.error('Chat error:', error);
      addMsg('ai', 'Kuskure: Ba a iya haɗa da server ba. Duba internet.');
    }
  }

  // === GENERATE IMAGE ===
  imgBtn.addEventListener('click', generateImage);

  async function generateImage() {
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
        addMsg('ai', 'An kirkiri hoton:', data.imageUrl);
      } else {
        addMsg('ai', `Kuskure: ${data.error}`);
      }
    } catch (error) {
      console.error('Image error:', error);
      addMsg('ai', 'Kuskure: Ba a iya kirkirar hoto ba.');
    }
  }

  // === ADD MESSAGE TO CHAT ===
  function addMsg(sender, text, imgUrl = null) {
    const div = document.createElement('div');
    div.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const textNode = document.createElement('p');
    textNode.textContent = text;
    div.appendChild(textNode);

    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.className = 'ai-image';
      img.alt = 'Generated image';
      img.style.maxWidth = '100%';
      img.style.borderRadius = '8px';
      img.style.marginTop = '10px';
      div.appendChild(img);
    }

    historyDiv.appendChild(div);
    historyDiv.scrollTop = historyDiv.scrollHeight;

    // Save to localStorage
    history.push({ sender, text, imgUrl });
    localStorage.setItem('auwal-history', JSON.stringify(history));
  }

  // === RENDER SAVED HISTORY ===
  function renderHistory() {
    historyDiv.innerHTML = '';
    history.forEach(msg => addMsg(msg.sender, msg.text, msg.imgUrl));
  }
});
