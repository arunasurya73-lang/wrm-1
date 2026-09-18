/**
 * AirSense AI Chatbot Client Component
 * Provides a floating launcher, sleek glassmorphism chat modal,
 * quick suggestion pills, streaming/typing indicator, and markdown formatting.
 */

class AirSenseChatbot {
  constructor() {
    this.isOpen = false;
    this.isProcessing = false;
    this.messages = [];
    this.currentContext = null;
    
    this.initElements();
    this.bindEvents();
    this.renderInitialGreeting();
  }

  initElements() {
    this.launcherBtn = document.getElementById('ai-chat-launcher');
    this.chatModal = document.getElementById('ai-chat-box');
    this.closeBtn = document.getElementById('ai-chat-close');
    this.minimizeBtn = document.getElementById('ai-chat-minimize');
    this.clearBtn = document.getElementById('ai-chat-clear');
    this.messagesContainer = document.getElementById('ai-chat-messages');
    this.chatForm = document.getElementById('ai-chat-form');
    this.chatInput = document.getElementById('ai-chat-input');
    this.sendBtn = document.getElementById('ai-chat-send');
    this.suggestionPills = document.querySelectorAll('.chat-suggestion-pill');
    this.launcherBadge = document.getElementById('ai-chat-badge');
  }

  bindEvents() {
    if (this.launcherBtn) {
      this.launcherBtn.addEventListener('click', () => this.toggleChat());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeChat());
    }

    if (this.minimizeBtn) {
      this.minimizeBtn.addEventListener('click', () => this.closeChat());
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearChat());
    }

    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserSubmit();
      });
    }

    // Auto-adjust textarea height or submit on enter
    if (this.chatInput) {
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSubmit();
        }
      });
    }

    // Bind quick suggestions
    if (this.suggestionPills) {
      this.suggestionPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const query = pill.getAttribute('data-query') || pill.textContent.trim();
          this.sendMessage(query);
        });
      });
    }

    // ESC key closes chat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeChat();
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    if (this.chatModal) {
      this.chatModal.classList.add('active');
      this.chatModal.setAttribute('aria-hidden', 'false');
    }
    if (this.launcherBtn) {
      this.launcherBtn.classList.add('chat-active');
    }
    if (this.launcherBadge) {
      this.launcherBadge.style.display = 'none';
    }
    setTimeout(() => {
      if (this.chatInput) this.chatInput.focus();
      this.scrollToBottom();
    }, 150);
  }

  closeChat() {
    this.isOpen = false;
    if (this.chatModal) {
      this.chatModal.classList.remove('active');
      this.chatModal.setAttribute('aria-hidden', 'true');
    }
    if (this.launcherBtn) {
      this.launcherBtn.classList.remove('chat-active');
    }
  }

  clearChat() {
    this.messages = [];
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = '';
    }
    this.renderInitialGreeting();
  }

  renderInitialGreeting() {
    const greetingText = `👋 **Hello! I am your AirSense Delhi AI Advisor.**

I analyze real-time Delhi NCR air quality, satellite smoke plumes, and meteorological inversion data to protect your respiratory health.

**Ask me anything, or tap a quick question below!**`;

    this.appendMessage('assistant', greetingText, 'AirSense AI', false);
  }

  setContext(contextData) {
    this.currentContext = contextData;
  }

  async handleUserSubmit() {
    if (!this.chatInput || this.isProcessing) return;
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.chatInput.value = '';
    await this.sendMessage(text);
  }

  async sendMessage(userText) {
    if (!userText || this.isProcessing) return;

    // Append User Message
    this.appendMessage('user', userText);

    // Show Typing Indicator
    this.isProcessing = true;
    this.setSendButtonState(true);
    const typingId = this.showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: this.currentContext
        })
      });

      this.removeTypingIndicator(typingId);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Sorry, I could not generate a response right now. Please try again.';
      const provider = data.provider || 'AirSense AI';

      this.appendMessage('assistant', reply, provider, true);
    } catch (err) {
      console.error('Chat error:', err);
      this.removeTypingIndicator(typingId);
      this.appendMessage('assistant', `⚠️ **Connection Notice**: Unable to contact the AI backend.

*Tip: Check that the local backend is running or verify your network connection.*`, 'System');
    } finally {
      this.isProcessing = false;
      this.setSendButtonState(false);
      this.scrollToBottom();
      if (this.chatInput) this.chatInput.focus();
    }
  }

  setSendButtonState(isLoading) {
    if (!this.sendBtn) return;
    this.sendBtn.disabled = isLoading;
    if (isLoading) {
      this.sendBtn.innerHTML = `
        <svg class="chat-spin" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>`;
    } else {
      this.sendBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>`;
    }
  }

  showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.id = id;
    typingEl.className = 'chat-message chat-message-assistant typing-bubble';
    typingEl.innerHTML = `
      <div class="chat-avatar">
        <span class="ai-sparkle-icon">✨</span>
      </div>
      <div class="chat-content">
        <div class="chat-sender-name">AirSense AI</div>
        <div class="typing-indicator-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typingEl);
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  appendMessage(role, text, senderName = 'You', playChime = false) {
    if (!this.messagesContainer) return;

    const msgEl = document.createElement('div');
    msgEl.className = `chat-message chat-message-${role}`;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedHtml = role === 'assistant' ? this.formatMarkdown(text) : this.escapeHtml(text);

    if (role === 'assistant') {
      msgEl.innerHTML = `
        <div class="chat-avatar">
          <span class="ai-sparkle-icon">✨</span>
        </div>
        <div class="chat-bubble">
          <div class="chat-header-info">
            <span class="chat-sender-name">${senderName}</span>
            <span class="chat-timestamp">${timestamp}</span>
          </div>
          <div class="chat-text-body">${formattedHtml}</div>
        </div>
      `;
    } else {
      msgEl.innerHTML = `
        <div class="chat-bubble">
          <div class="chat-header-info">
            <span class="chat-timestamp">${timestamp}</span>
          </div>
          <div class="chat-text-body">${formattedHtml}</div>
        </div>
        <div class="chat-avatar user-avatar">
          <span>👤</span>
        </div>
      `;
    }

    this.messagesContainer.appendChild(msgEl);
    this.scrollToBottom();

    if (playChime && role === 'assistant') {
      this.playNotificationSound();
    }
  }

  playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  formatMarkdown(str) {
    if (!str) return '';
    let html = str;

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points with hyphens or asterisks at line starts
    html = html.replace(/^\s*[-•]\s+(.*)$/gim, '<li>$1</li>');

    // Wrap adjacent li in ul
    html = html.replace(/(<li>.*<\/li>(\s*<li>.*<\/li>)*)/g, '<ul>$1</ul>');

    // Numbered lists 1. 2.
    html = html.replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li>$2</li>');

    // Line breaks to <br> when not inside lists
    html = html.replace(/\n\n/g, '<div class="chat-para-break"></div>');
    html = html.replace(/\n/g, '<br>');

    // Clean extra br inside lists
    html = html.replace(/<ul><br>/g, '<ul>');
    html = html.replace(/<\/li><br><li>/g, '</li><li>');
    html = html.replace(/<\/li><br><\/ul>/g, '</li></ul>');

    return html;
  }
}

// Export singleton instance
export const airSenseChat = new AirSenseChatbot();
