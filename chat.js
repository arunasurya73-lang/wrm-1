/**
 * AirSense AI Chatbot Client Component
 * Provides a floating launcher, sleek glassmorphism chat modal,
 * quick suggestion pills, streaming/typing indicator, and markdown formatting.
 * Connected directly via apiClient with resilient client-side AI fallback.
 */

import { apiClient } from './assets/js/apiClient.js';
import { STATIONS } from './assets/js/stationData.js';

class AirSenseChatbot {
  constructor() {
    this.isOpen = false;
    this.isProcessing = false;
    this.messages = [];
    this.currentContext = null;
    
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }
  }

  init() {
    this.initElements();
    this.bindEvents();
    this.renderInitialGreeting();
  }

  initElements() {
    if (typeof document === 'undefined') return;
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

  getLiveCityContext() {
    try {
      const appStations = window.airSenseApp?.stations || STATIONS || [];
      const valid = appStations.filter(s => s.aqi && s.aqi > 0);
      if (valid.length > 0) {
        const sum = valid.reduce((acc, curr) => acc + curr.aqi, 0);
        const avgAqi = Math.round(sum / valid.length);
        const sorted = [...valid].sort((a, b) => b.aqi - a.aqi);
        
        let status = 'Moderate';
        if (avgAqi <= 50) status = 'Good';
        else if (avgAqi <= 100) status = 'Satisfactory';
        else if (avgAqi <= 200) status = 'Moderate';
        else if (avgAqi <= 300) status = 'Poor';
        else if (avgAqi <= 400) status = 'Very Poor';
        else status = 'Severe';

        return {
          avgAqi,
          status,
          worstStation: `${sorted[0].name || sorted[0].id} (AQI ${sorted[0].aqi})`,
          bestStation: `${sorted[sorted.length - 1].name || sorted[sorted.length - 1].id} (AQI ${sorted[sorted.length - 1].aqi})`
        };
      }
    } catch (e) {
      // fallback
    }

    return {
      avgAqi: 265,
      status: 'Poor',
      worstStation: 'Anand Vihar, East Delhi (AQI ~385)',
      bestStation: 'Mandir Marg, Central Delhi (AQI ~145)'
    };
  }

  generateClientDomainResponse(userText) {
    const query = userText.toLowerCase();
    const city = this.getLiveCityContext();
    const avgAqi = city.avgAqi;
    const status = city.status;
    const worstStation = city.worstStation;
    const bestStation = city.bestStation;

    if (query.includes('jog') || query.includes('run') || query.includes('walk') || query.includes('exercise') || query.includes('outdoor')) {
      if (avgAqi > 200) {
        return `⚠️ **Exercise Advisory (Current Delhi Avg AQI: ${avgAqi} - ${status})**:
- **Avoid vigorous outdoor workouts** today, especially during early morning and late evening inversion hours (6:00 AM - 9:00 AM & 7:00 PM - 10:00 PM).
- Switch to indoor cardio, yoga, or gym training with HEPA air filtration.
- If you must step outside, wear a well-fitted **N95/FFP2 mask** and avoid high-traffic corridors.`;
      } else {
        return `✅ **Outdoor Exercise Advisory (Current AQI: ${avgAqi})**:
- Air quality is acceptable for moderate exercise.
- Sensitive individuals should limit prolonged heavy outdoor exertion during peak traffic hours.`;
      }
    }

    if (query.includes('clean') || query.includes('lowest') || query.includes('fresh') || query.includes('safe area')) {
      return `🍃 **Cleanest Air Pockets in Delhi NCR**:
- **Best currently reporting area**: ${bestStation}
- Generally, areas with dense green cover such as **Lodi Road**, **Mandir Marg**, and parts of Central Ridge maintain lower particulate concentrations compared to border industrial zones.`;
    }

    if (query.includes('worst') || query.includes('hotspot') || query.includes('high') || query.includes('danger') || query.includes('anand vihar')) {
      return `🚨 **Delhi AQI Hotspots**:
- **Highest Particulate Zone**: ${worstStation}
- Key severe hotspots in the region typically include **Anand Vihar**, **Jahangirpuri**, **Wazirpur**, **Bawana**, and **Mundka** due to heavy trans-boundary vehicular movement, biomass smoke, and localized industrial dust.`;
    }

    if (query.includes('mask') || query.includes('n95') || query.includes('protection') || query.includes('purifier')) {
      return `🛡️ **Health & Air Protection Guidelines**:
1. **Mask Selection**: Standard cloth or surgical masks do NOT filter microscopic PM2.5. Always use certified **N95 or FFP2 respirators** with a tight nose seal.
2. **Indoor Air**: Keep doors and windows closed during smog peaks. Run **HEPA H13/H14 air purifiers** in bedrooms.
3. **Hydration & Diet**: Stay well-hydrated, consume antioxidant-rich foods, and use saline nasal sprays to soothe mucosal inflammation.`;
    }

    if (query.includes('stubble') || query.includes('fire') || query.includes('parali') || query.includes('farm') || query.includes('satellite')) {
      return `🛰️ **Satellite Smoke & Farm Fire Telemetry**:
- Stubble burning (parali) plumes from Punjab and Haryana are monitored via NASA VIIRS & MODIS satellite feeds.
- North-westerly winds often transport dense smoke into the Indo-Gangetic plains, combining with nocturnal thermal inversion to create severe winter smog layers.`;
    }

    if (query.includes('grap') || query.includes('stage') || query.includes('rule') || query.includes('restriction')) {
      return `📋 **GRAP (Graded Response Action Plan) Status**:
- **Stage I (AQI 201-300)**: Dust mitigation & mechanical sweeping.
- **Stage II (AQI 301-400)**: Ban on diesel gensets, enhanced parking fees.
- **Stage III (AQI 401-450)**: Ban on non-essential construction & BS-III petrol / BS-IV diesel vehicles.
- **Stage IV (AQI >450)**: Entry ban on commercial trucks, online school advisories, and emergency industrial curbs.`;
    }

    return `🤖 **AirSense Atmospheric Intelligence Advisory**:
- **Delhi NCR Current AQI**: **${avgAqi}** (${status})
- **Top Hotspot**: ${worstStation}
- **Cleanest Zone**: ${bestStation}

**Key Recommendations**:
1. Vulnerable groups (children, elderly, and respiratory patients) should avoid outdoor exertion.
2. Ensure N95 masks are worn during commutes.
3. Keep indoor air purifiers on auto-mode.

*Ask me anything specific like: "Is it safe to go cycling now?", "Which areas have the worst pollution?", or "What mask should I buy?"*`;
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
      // First attempt via apiClient
      const data = await apiClient.sendChatMessage(userText, this.currentContext || this.getLiveCityContext());
      this.removeTypingIndicator(typingId);

      const reply = data?.reply || this.generateClientDomainResponse(userText);
      const provider = data?.provider || 'AirSense Atmospheric AI Engine';

      this.appendMessage('assistant', reply, provider, true);
    } catch (err) {
      console.warn('Backend chat unreachable or returned error, switching to resilient client-side domain engine:', err.message);
      this.removeTypingIndicator(typingId);

      // Resilient local atmospheric intelligence engine fallback
      const fallbackReply = this.generateClientDomainResponse(userText);
      this.appendMessage('assistant', fallbackReply, 'AirSense Atmospheric AI Engine', true);
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
