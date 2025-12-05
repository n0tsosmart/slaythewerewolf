import { applyTranslations } from '../modules/i18n.js';
import { openTutorial, shouldShowTutorial } from './ViewTutorial.js';

export class GlobalControls extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <div class="global-controls">
      <div class="menu-container">
        <button type="button" id="menuBtn" class="btn-ghost btn-icon" aria-label="Menu" aria-expanded="false"
          aria-controls="mainMenu">
          <span class="hamburger-icon"><span></span></span>
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
          <button type="button" id="menuTutorialBtn" class="menu-item" role="menuitem" data-i18n="menu.tutorial">📖 How to Play</button>
          <button type="button" id="menuRulesBtn" class="menu-item" role="menuitem" data-i18n="menu.rules">📜 Game rules</button>
          <hr class="menu-divider">
          <button type="button" id="installAppBtn" class="menu-item" role="menuitem" data-i18n="menu.install" style="display: none;">📱 Install App</button>
          <a id="menuFeedbackLink" href="https://github.com/n0tsosmart/slaythewerewolf" target="_blank"
            rel="noopener noreferrer" class="menu-item" role="menuitem" data-i18n="info.feedback">💬 Send feedback</a>
          <a id="menuDonateLink" href="https://www.paypal.com/donate/?hosted_button_id=QRPBSBNR88J8C" target="_blank"
            rel="noopener noreferrer" class="menu-item menu-item-donate" role="menuitem" data-i18n="menu.donate">❤️ Support this project</a>
        </div>
      </div>
      <button id="restartBtn" class="restart-btn" type="button" data-i18n="buttons.restart">New game</button>
      
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
    this.initTutorial();
    this.initRulesPanel();
  }

  initTutorial() {
    const tutorialBtn = this.querySelector('#menuTutorialBtn');
    if (tutorialBtn) {
      tutorialBtn.addEventListener('click', () => {
        // Close menu first
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
          mainMenu.classList.add('hidden');
          mainMenu.setAttribute('aria-hidden', 'true');
          const menuBtn = document.getElementById('menuBtn');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
        openTutorial();
      });
    }

    // Show tutorial on first visit after a short delay
    if (shouldShowTutorial()) {
      setTimeout(() => openTutorial(), 500);
    }
  }

  initRulesPanel() {
    const rulesBtn = this.querySelector('#menuRulesBtn');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', () => {
        // Close menu first
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
          mainMenu.classList.add('hidden');
          mainMenu.setAttribute('aria-hidden', 'true');
          const menuBtn = document.getElementById('menuBtn');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
        // Open the voting rules modal (reusing existing modal)
        const votingOverlay = document.getElementById('votingOverlay');
        if (votingOverlay) {
          votingOverlay.classList.remove('hidden');
        }
      });
    }
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
        // Close hamburger menu if open
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
          mainMenu.classList.add('hidden');
          mainMenu.setAttribute('aria-hidden', 'true');
          const menuBtn = document.getElementById('menuBtn');
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        }
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