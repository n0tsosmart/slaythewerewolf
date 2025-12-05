import { el } from '../modules/dom.js';
import { showView, showLobbyView } from '../modules/engine/index.js';
import { applyTranslations } from '../modules/i18n.js';

export class ViewLanding extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.render();
        this.attachEvents();
    }

    disconnectedCallback() {
        this.removeEvents();
    }

    render() {
        this.innerHTML = `
            <section id="landingView" class="panel">
                <h2 data-i18n="landing.title" class="animate-entry stagger-1">Welcome</h2>
                <p class="landing-subtitle animate-entry stagger-2" data-i18n="landing.subtitle">Choose your game mode</p>
                
                <div class="landing-actions animate-entry stagger-3">
                    <button id="localGameBtn" class="btn-primary large-btn" type="button">
                        <span class="btn-icon">🏠</span>
                        <span data-i18n="landing.localGame">Local Game</span>
                        <span class="btn-desc" data-i18n="landing.localDesc">Pass one device around</span>
                    </button>
                    
                    <button id="onlineGameBtn" class="btn-secondary large-btn" type="button">
                        <span class="beta-badge" data-i18n="general.betaBadge"></span>
                        <span class="btn-icon">🌐</span>
                        <span class="mode-title" data-i18n="landing.onlineGame"></span>
                        <span class="btn-desc" data-i18n="landing.onlineDesc">Join with multiple devices</span>
                    </button>
                </div>
            </section>
        `;
        applyTranslations(this);
    }

    attachEvents() {
        el.localGameBtn?.addEventListener('click', () => {
            // Remove online-mode class when switching to local game
            document.body.classList.remove('online-mode');
            showView('setup');
        });
        el.onlineGameBtn?.addEventListener('click', () => showLobbyView());
    }

    removeEvents() {
        // Event listeners are typically removed automatically when the element is removed from DOM if references aren't held,
        // but explicit removal is good practice if we were swapping listeners on the same element.
        // Since we are just navigating away, it's fine.
    }
}

customElements.define('view-landing', ViewLanding);
