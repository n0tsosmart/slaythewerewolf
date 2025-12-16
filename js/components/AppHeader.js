import { applyTranslations } from '../modules/i18n.js';

export class AppHeader extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <header class="app-header">
      <div class="logo-row">
        <img src="assets/logo.png" alt="Slay the Werewolf logo" class="site-logo" id="appLogo" />
        <div class="header-text">
          <div class="eyebrow-row">
            <p class="eyebrow" data-i18n="header.label">SLAY THE WEREWOLF</p>
            <span id="mafiaBadge" class="mafia-badge">Mafia Edition</span>
          </div>
          <h1 data-i18n="header.title">Slay the Werewolf</h1>
          <p class="tagline" data-i18n="header.tagline1">Remember to slay the wolf.</p>
        </div>
      </div>
    </header>
    `;
    applyTranslations(this);
    this.updateLogo();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.updateLogo();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  updateLogo() {
    const logo = this.querySelector('#appLogo');
    const badge = this.querySelector('#mafiaBadge');

    if (!logo) return;

    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'purple') {
      logo.src = 'assets/mafia_logo.png';
      if (badge) badge.style.display = 'inline-block';
    } else {
      logo.src = 'assets/logo.png';
      if (badge) badge.style.display = 'none';
    }
  }
}

customElements.define('app-header', AppHeader);