/**
 * @fileoverview Onboarding Tutorial Component
 * Shows a step-by-step guide for first-time users
 * Version: 1.2.1
 */

import { el } from '../modules/dom.js';
import { t, applyTranslations } from '../modules/i18n.js';

const TUTORIAL_SEEN_KEY = 'slay_werewolf_tutorial_seen';

const TUTORIAL_STEPS = [
    {
        icon: '🐺',
        titleKey: 'tutorial.step1.title',
        descKey: 'tutorial.step1.desc'
    },
    {
        icon: '📋',
        titleKey: 'tutorial.step2.title',
        descKey: 'tutorial.step2.desc'
    },
    {
        icon: '🎴',
        titleKey: 'tutorial.step3.title',
        descKey: 'tutorial.step3.desc'
    },
    {
        icon: '🌙',
        titleKey: 'tutorial.step4.title',
        descKey: 'tutorial.step4.desc'
    },
    {
        icon: '☀️',
        titleKey: 'tutorial.step5.title',
        descKey: 'tutorial.step5.desc'
    },
    {
        icon: '🏆',
        titleKey: 'tutorial.step6.title',
        descKey: 'tutorial.step6.desc'
    }
];

export class ViewTutorial extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 0;
    }

    connectedCallback() {
        this.style.display = 'contents';
        this.render();
        this.attachEvents();
    }

    render() {
        this.innerHTML = `
            <div id="tutorialOverlay" class="modal-overlay hidden">
                <div class="modal-panel tutorial-panel">
                    <div class="tutorial-header">
                        <h3 class="modal-title" data-i18n="tutorial.title">How to Play</h3>
                        <div class="tutorial-progress">
                            <span id="tutorialStepIndicator">1 / ${TUTORIAL_STEPS.length}</span>
                        </div>
                    </div>
                    
                    <div id="tutorialContent" class="tutorial-content">
                        <!-- Dynamic content -->
                    </div>
                    
                    <div class="tutorial-dots" id="tutorialDots">
                        ${TUTORIAL_STEPS.map((_, i) => `<span class="tutorial-dot${i === 0 ? ' active' : ''}" data-step="${i}"></span>`).join('')}
                    </div>
                    
                    <div class="tutorial-actions">
                        <button id="tutorialSkip" class="btn-secondary btn-small" type="button" data-i18n="tutorial.skip">Skip</button>
                        <div class="tutorial-nav">
                            <button id="tutorialPrev" class="btn-secondary btn-small" type="button" disabled data-i18n="tutorial.prev">← Back</button>
                            <button id="tutorialNext" class="btn-primary btn-small" type="button" data-i18n="tutorial.next">Next →</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        applyTranslations(this);
        this.renderStep();
    }

    renderStep() {
        const content = this.querySelector('#tutorialContent');
        const indicator = this.querySelector('#tutorialStepIndicator');
        const dots = this.querySelectorAll('.tutorial-dot');
        const prevBtn = this.querySelector('#tutorialPrev');
        const nextBtn = this.querySelector('#tutorialNext');

        const step = TUTORIAL_STEPS[this.currentStep];

        content.innerHTML = `
            <div class="tutorial-step animate-entry">
                <div class="tutorial-icon">${step.icon}</div>
                <h4 data-i18n="${step.titleKey}">${t(step.titleKey)}</h4>
                <p data-i18n="${step.descKey}">${t(step.descKey)}</p>
            </div>
        `;

        indicator.textContent = `${this.currentStep + 1} / ${TUTORIAL_STEPS.length}`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentStep);
        });

        prevBtn.disabled = this.currentStep === 0;

        if (this.currentStep === TUTORIAL_STEPS.length - 1) {
            nextBtn.textContent = t('tutorial.done');
            nextBtn.dataset.i18n = 'tutorial.done';
        } else {
            nextBtn.textContent = t('tutorial.next');
            nextBtn.dataset.i18n = 'tutorial.next';
        }
    }

    attachEvents() {
        const overlay = this.querySelector('#tutorialOverlay');
        const skipBtn = this.querySelector('#tutorialSkip');
        const prevBtn = this.querySelector('#tutorialPrev');
        const nextBtn = this.querySelector('#tutorialNext');
        const dots = this.querySelectorAll('.tutorial-dot');

        skipBtn?.addEventListener('click', () => this.close());

        prevBtn?.addEventListener('click', () => {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.renderStep();
            }
        });

        nextBtn?.addEventListener('click', () => {
            if (this.currentStep < TUTORIAL_STEPS.length - 1) {
                this.currentStep++;
                this.renderStep();
            } else {
                this.close();
            }
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                this.currentStep = parseInt(dot.dataset.step, 10);
                this.renderStep();
            });
        });

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!overlay || overlay.classList.contains('hidden')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowRight' || e.key === 'Enter') nextBtn?.click();
            if (e.key === 'ArrowLeft') prevBtn?.click();
        });
    }

    open() {
        const overlay = this.querySelector('#tutorialOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.currentStep = 0;
            this.renderStep();
        }
    }

    close() {
        const overlay = this.querySelector('#tutorialOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
            this.markAsSeen();
        }
    }

    markAsSeen() {
        try {
            localStorage.setItem(TUTORIAL_SEEN_KEY, 'true');
        } catch (e) {
            // Ignore storage errors
        }
    }

    static hasBeenSeen() {
        try {
            return localStorage.getItem(TUTORIAL_SEEN_KEY) === 'true';
        } catch (e) {
            return false;
        }
    }

    static resetTutorial() {
        try {
            localStorage.removeItem(TUTORIAL_SEEN_KEY);
        } catch (e) {
            // Ignore
        }
    }
}

customElements.define('view-tutorial', ViewTutorial);

// Export for external use
export function openTutorial() {
    const tutorial = document.querySelector('view-tutorial');
    if (tutorial) {
        tutorial.open();
    }
}

export function shouldShowTutorial() {
    return !ViewTutorial.hasBeenSeen();
}
