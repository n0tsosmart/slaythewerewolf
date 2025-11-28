import { applyTranslations } from '../modules/i18n.js';

export class AppHeader extends HTMLElement {
  connectedCallback() {
    this.style.display = 'contents';
    this.innerHTML = `
    <header class="app-header">
      <div class="logo-row">
        <img src="assets/logo.png" alt="Slay the Werewolf logo" class="site-logo" />
        <div>
          <p class="eyebrow" data-i18n="header.label">SLAY THE WEREWOLF</p>
          <h1 data-i18n="header.title">Slay the Werewolf</h1>
          <p class="tagline" data-i18n="header.tagline1">Ricordati di uccidere il lupo.</p>
        </div>
      </div>
    </header>
    `;
    applyTranslations(this);
  }
}

customElements.define('app-header', AppHeader);