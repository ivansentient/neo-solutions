(() => {
  'use strict';

  const styleId = 'neo-builderbot-style';
  const shadowStyles = `
    .chat-widget-container,
    .dark-mode {
      --chat-white: #ffffff !important;
      --chat-send-button: #1f5eff !important;
      --chat-send-button-hover: #3158ff !important;
      --chat-accent-color: #1f5eff !important;
      --chat-background: rgba(5, 8, 20, 0.97) !important;
      --chat-background-chat: rgba(2, 3, 10, 0.97) !important;
      --chat-input-background: rgba(255, 255, 255, 0.08) !important;
      --chat-border-color: rgba(125, 162, 255, 0.18) !important;
    }

    .chat-widget-container {
      border: 1px solid rgba(125, 162, 255, 0.2) !important;
      box-shadow:
        0 26px 90px rgba(0, 0, 0, 0.48),
        0 22px 76px rgba(31, 94, 255, 0.22) !important;
      backdrop-filter: blur(22px);
    }

    .chat-header,
    .chat-input {
      background: rgba(5, 8, 20, 0.97) !important;
    }

    .input-container {
      border: 1px solid rgba(125, 162, 255, 0.16) !important;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .send-button {
      color: #ffffff !important;
      box-shadow: 0 12px 28px rgba(31, 94, 255, 0.3);
    }

    .selector-btn {
      display: none !important;
    }

    /* Neo Thinking / Typing Indicator */
    @keyframes neoDotPulse {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.35;
      }
      40% {
        transform: scale(1.18);
        opacity: 1;
      }
    }

    @keyframes neoFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .neo-thinking-row {
      display: flex !important;
      align-items: flex-end !important;
      gap: 8px !important;
      margin: 10px 0 6px !important;
      animation: neoFadeIn 220ms ease-out forwards;
    }

    .neo-thinking-avatar {
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.82), transparent 24%), #1f5eff !important;
      box-shadow: 0 0 14px rgba(31, 94, 255, 0.5) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
      overflow: hidden !important;
    }

    .neo-thinking-avatar img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }

    .neo-thinking-bubble {
      background: rgba(255, 255, 255, 0.08) !important;
      border: 1px solid rgba(125, 162, 255, 0.22) !important;
      border-radius: 16px !important;
      border-bottom-left-radius: 4px !important;
      padding: 11px 15px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
    }

    .neo-thinking-dots {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
    }

    .neo-thinking-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 50% !important;
      background: #4be2ff !important;
      box-shadow: 0 0 10px rgba(75, 226, 255, 0.9) !important;
      display: inline-block !important;
      animation: neoDotPulse 1.2s infinite ease-in-out both;
    }

    .neo-thinking-dot:nth-child(1) { animation-delay: -0.32s; }
    .neo-thinking-dot:nth-child(2) { animation-delay: -0.16s; }
    .neo-thinking-dot:nth-child(3) { animation-delay: 0s; }

    @media (max-width: 768px) {
      .chat-widget-container {
        border-radius: 0 !important;
        border-left: 0 !important;
        border-right: 0 !important;
      }
    }
  `;

  let thinkingTimeout = 0;

  const removeThinkingIndicator = (root) => {
    if (!root) return;
    const indicator = root.querySelector('.neo-thinking-row');
    if (indicator) {
      indicator.remove();
    }
    if (thinkingTimeout) {
      clearTimeout(thinkingTimeout);
      thinkingTimeout = 0;
    }
  };

  const showThinkingIndicator = (root) => {
    if (!root) return;
    const messagesContainer = root.querySelector('.messages-container') || root.querySelector('.chat-messages');
    if (!messagesContainer) return;

    removeThinkingIndicator(root);

    const row = document.createElement('div');
    row.className = 'neo-thinking-row';
    row.innerHTML = `
      <div class="neo-thinking-avatar">
        <img src="assets/brand/favicon.png" alt="Neo" />
      </div>
      <div class="neo-thinking-bubble">
        <div class="neo-thinking-dots">
          <span class="neo-thinking-dot"></span>
          <span class="neo-thinking-dot"></span>
          <span class="neo-thinking-dot"></span>
        </div>
      </div>
    `;

    messagesContainer.appendChild(row);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Safety timeout: remove after 25s if no response
    thinkingTimeout = setTimeout(() => {
      removeThinkingIndicator(root);
    }, 25000);
  };

  const setupRootListeners = (root) => {
    if (!root || root._neoListenersAttached) return;
    root._neoListenersAttached = true;

    // Delegated Enter key inside shadowRoot
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const target = e.target;
        if (target && (target.classList.contains('input-field') || target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
          if (target.value && target.value.trim()) {
            setTimeout(() => showThinkingIndicator(root), 60);
          }
        }
      }
    }, true);

    // Delegated click on send button
    root.addEventListener('click', (e) => {
      const sendBtn = e.target.closest && (e.target.closest('.send-button') || e.target.closest('button[type="submit"]'));
      if (sendBtn) {
        const input = root.querySelector('.input-field') || root.querySelector('textarea, input');
        if (input && input.value && input.value.trim()) {
          setTimeout(() => showThinkingIndicator(root), 60);
        }
      }
    }, true);

    // Mutation observer on the entire shadowRoot to watch for new messages arriving
    const rootObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            // Ignore our own indicator
            if (node.classList && node.classList.contains('neo-thinking-row')) {
              continue;
            }
            // If any assistant message or element was added by BuilderBot SDK
            const isAgentMsg = node.classList && (
              node.classList.contains('agent') ||
              node.classList.contains('message-wrapper') ||
              node.classList.contains('message-bubble') ||
              node.classList.contains('message') ||
              node.classList.contains('message-item') ||
              node.classList.contains('agent-message') ||
              node.classList.contains('chat-message')
            ) || (node.tagName && node.tagName.toLowerCase().includes('message'));

            if (isAgentMsg && (!node.classList || !node.classList.contains('user'))) {
              removeThinkingIndicator(root);
              const mc = root.querySelector('.messages-container') || root.querySelector('.chat-messages');
              if (mc) mc.scrollTop = mc.scrollHeight;
            }
          }
        }
      }
    });

    rootObserver.observe(root, { childList: true, subtree: true });
  };

  const injectNeoChatStyle = () => {
    document.querySelectorAll('chat-widget-container, chat-widget-button').forEach((widget) => {
      const root = widget.shadowRoot;
      if (!root) return;

      if (!root.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = shadowStyles;
        root.appendChild(style);
      }

      setupRootListeners(root);
    });
  };

  injectNeoChatStyle();
  window.addEventListener('load', injectNeoChatStyle, { once: true });

  if ('MutationObserver' in window) {
    const observer = new MutationObserver(injectNeoChatStyle);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.setTimeout(injectNeoChatStyle, 500);
  window.setTimeout(injectNeoChatStyle, 1500);
  window.setTimeout(injectNeoChatStyle, 3000);
})();
