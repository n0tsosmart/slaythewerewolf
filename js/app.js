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

// Debug log to verify app.js execution
console.log("[SlayTheWerewolf] app.js loaded");

// Start the application
initApp();
