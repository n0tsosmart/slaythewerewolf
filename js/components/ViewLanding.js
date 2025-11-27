// js/components/ViewLanding.js
import { el } from '../modules/dom.js';
import { showView } from '../modules/engine.js';
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
                <h2 data-i18n="landing.title">Welcome</h2>
                <p class="landing-subtitle" data-i18n="landing.subtitle">Choose your game mode</p>
                
                <div class="landing-actions">
                    <button id="localGameBtn" class="btn-primary large-btn" type="button">
                        <span class="btn-icon">🏠</span>
                        <span data-i18n="landing.localGame">Local Game</span>
                        <span class="btn-desc" data-i18n="landing.localDesc">Pass one device around</span>
                    </button>
                    
                    <button id="onlineGameBtn" class="btn-secondary large-btn" type="button">
                        <span class="btn-icon">🌐</span>
                        <span data-i18n="landing.onlineGame">Online Game</span>
                        <span class="btn-desc" data-i18n="landing.onlineDesc">Join with multiple devices</span>
                    </button>
                </div>
            </section>
        `;
        applyTranslations(this);
    }

    attachEvents() {
        el.localGameBtn?.addEventListener('click', () => showView('setup'));
        el.onlineGameBtn?.addEventListener('click', () => showView('lobby'));
    }

    removeEvents() {
        // Event listeners are typically removed automatically when the element is removed from DOM if references aren't held,
        // but explicit removal is good practice if we were swapping listeners on the same element.
        // Since we are just navigating away, it's fine.
    }
}

customElements.define('view-landing', ViewLanding);
