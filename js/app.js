import { initApp } from './modules/engine.js';

// Components
import './components/GlobalControls.js';
import './components/AppHeader.js';
import './components/ViewSetup.js';
import './components/ViewReveal.js';
import './components/ViewSummary.js';
import './components/ViewFinal.js';
import './components/ViewGlobal.js';

// Debug log to verify app.js execution
console.log("[SlayTheWerewolf] app.js loaded");

// Start the application
initApp();
