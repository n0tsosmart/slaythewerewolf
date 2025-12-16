import { initApp } from './modules/engine/index.js';

// Components
import './components/GlobalControls.js';
import './components/AppHeader.js';
import './components/ViewSetup.js';
import './components/ViewReveal.js';
import './components/ViewSummary.js';
import './components/ViewFinal.js';
import './components/ViewGlobal.js';
import './components/ViewLobby.js'; // New
import './components/ViewClientRole.js'; // New
import './components/ViewLanding.js'; // New
import './components/ViewTutorial.js'; // Onboarding tutorial

// Debug log to verify app.js execution
console.log("[SlayTheWerewolf] app.js loaded");

// Start the application
initApp();

// Hide splash screen after app is ready (minimum 3 seconds)
const splashStart = Date.now();
const SPLASH_MIN_DURATION = 2000;

function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        const elapsed = Date.now() - splashStart;
        const remaining = Math.max(0, SPLASH_MIN_DURATION - elapsed);

        setTimeout(() => {
            splash.classList.add('fade-out');
            // Remove from DOM after fade animation
            setTimeout(() => splash.remove(), 500);
        }, remaining);
    }
}

// Hide splash when DOM is ready or immediately if already ready
if (document.readyState === 'complete') {
    hideSplash();
} else {
    window.addEventListener('load', hideSplash);
}
