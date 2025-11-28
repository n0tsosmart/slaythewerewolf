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
    </div>
    `;
    applyTranslations(this);
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'default';
    const toggle = this.querySelector('#themeToggle');

    if (toggle) {
      toggle.checked = savedTheme === 'purple';
      this.setTheme(savedTheme);

      toggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'purple' : 'default';
        this.setTheme(theme);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    applyTranslations(document.body);
  }
}

customElements.define('global-controls', GlobalControls);