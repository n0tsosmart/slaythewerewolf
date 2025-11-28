import { applyTranslations } from '../modules/i18n.js';

export class GlobalControls extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <div class="global-controls">
      <div class="menu-container">
        <button type="button" id="menuBtn" class="btn-ghost btn-icon" aria-label="Menu" aria-expanded="false"
          aria-controls="mainMenu">
          <span class="hamburger-icon">☰</span>
        </button>
        <div id="mainMenu" class="main-menu hidden" role="menu" aria-hidden="true">
          <div class="menu-section">
            <p class="menu-label" data-i18n="language.label">Language</p>
            <div class="language-options">
              <button type="button" class="language-btn" data-lang-button="en" role="menuitem"
                aria-label="English">🇬🇧</button>
              <button type="button" class="language-btn" data-lang-button="es" role="menuitem"
                aria-label="Español">🇪🇸</button>
              <button type="button" class="language-btn" data-lang-button="it" role="menuitem"
                aria-label="Italiano">🇮🇹</button>
            </div>
          </div>
          <div class="menu-section">
            <p class="menu-label" data-i18n="theme.label">Theme</p>
            <div class="theme-toggle-container">
              <span class="theme-label" data-i18n="theme.mafia">Mafia Edition</span>
              <label class="toggle-switch">
                <input type="checkbox" id="themeToggle">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          <hr class="menu-divider">
          <button type="button" id="menuVotingBtn" class="menu-item" role="menuitem" data-i18n="menu.voting">🗳️ Voting
            Rules</button>
          <button type="button" id="menuImmersionBtn" class="menu-item" role="menuitem" data-i18n="info.button">📖
            Immersion tips & rules</button>
          <a id="menuFeedbackLink" href="https://github.com/n0tsosmart/slaythewerewolf" target="_blank"
            rel="noopener noreferrer" class="menu-item" role="menuitem" data-i18n="info.feedback">💬 Send feedback</a>
          <hr class="menu-divider">
          <a id="menuDonateLink" href="https://www.paypal.com/donate/?hosted_button_id=QRPBSBNR88J8C" target="_blank"
            rel="noopener noreferrer" class="menu-item" role="menuitem" data-i18n="menu.donate">❤️ Support this project</a>
        </div>
      </div>
      <button id="restartBtn" class="btn-ghost btn-small" type="button" data-i18n="buttons.restart">🔄 New game</button>
      
      <div id="mafiaWarningModal" class="modal-overlay hidden">
        <div class="modal-panel">
          <h3 class="modal-title" data-i18n="mafiaWarning.title">⚠️ Warning</h3>
          <p class="help" data-i18n="mafiaWarning.message">Activating Mafia Edition will refresh the page and return you to the home screen. Current game progress will be lost.</p>
          <div class="modal-actions">
            <button id="cancelMafiaBtn" class="btn-secondary btn-small" type="button" data-i18n="buttons.cancel">Cancel</button>
            <button id="confirmMafiaBtn" class="btn-primary btn-small" type="button" data-i18n="buttons.confirm">Confirm</button>
          </div>
        </div>
      </div>
    </div>
    `;
    applyTranslations(this);
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'default';
    const toggle = this.querySelector('#themeToggle');
    const modal = this.querySelector('#mafiaWarningModal');
    const confirmBtn = this.querySelector('#confirmMafiaBtn');
    const cancelBtn = this.querySelector('#cancelMafiaBtn');

    if (toggle) {
      toggle.checked = savedTheme === 'purple';
      this.setTheme(savedTheme);

      toggle.addEventListener('click', (e) => {
        e.preventDefault(); // Always intercept
        modal.classList.remove('hidden');
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        // Toggle the theme based on current state (which was prevented from changing visually)
        const newTheme = toggle.checked ? 'default' : 'purple';
        this.setTheme(newTheme);
        if (toggle) toggle.checked = newTheme === 'purple';

        modal.classList.add('hidden');

        // Force redirect to landing page logic
        try {
          const raw = localStorage.getItem('SLAY_STATE');
          if (raw) {
            const data = JSON.parse(raw);
            data.view = 'setup';
            data.players = [];
            data.deck = [];
            data.revealIndex = 0;
            data.narratorDay = 1;
            data.victory = null;
            localStorage.setItem('SLAY_STATE', JSON.stringify(data));
          }
        } catch (err) {
          console.error("Error resetting state for theme transition", err);
        }

        window.location.reload();
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        // No need to revert toggle checked state because we prevented default
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    applyTranslations(document.body);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }
}

customElements.define('global-controls', GlobalControls);