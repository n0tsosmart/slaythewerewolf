/**
 * @fileoverview Main engine module - orchestrates all game logic.
 * This is the entry point that wires together all engine submodules.
 */
import { state } from '../state.js';
import { restoreFromStorage } from '../store.js';
import { el } from '../dom.js';
import { setNetworkCallbacks, isClient, getLocalPlayerName } from '../network.js';
import { initUI } from '../utils.js';
import { initBrowserCompatibility } from '../browser-compat.js';
import { initOfflineDetection } from '../offline.js';
import { initTimer } from '../timer.js';
import {
    renderRoleOptions,
    updateWolfHint,
    clampWolfCount,
    enforceRoleLimits,
    updateDeckPreview,
    updateRoleSummary,
    renderPlayerList
} from '../setup.js';

// Import submodules
import {
    confirmAction,
    openInfoModal,
    closeInfoModal,
    openPrivacyModal,
    closePrivacyModal,
    openVotingModal,
    closeVotingModal
} from './modals.js';

import {
    showView,
    showLobbyView,
    showClientRoleView,
    showSummary,
    updateFooterVisibility,
    setViewCallbacks
} from './views.js';

import {
    applyMythTransformation,
    isMythActive,
    mythRequiresAction,
    getMythResultText,
    hideMythUI,
    showMythSummary,
    renderMythPanel,
    setMythCallbacks
} from './mythomaniac.js';

import {
    predictVictoryOnElimination,
    computeVictoryOutcomeFromSet,
    evaluateVictoryConditions,
    getVictorySurvivors,
    getVictoryText,
    showVictoryScreen,
    renderVictoryFromState,
    setVictoryCallbacks
} from './victory.js';

import {
    renderSummaryList,
    renderFallenList,
    computeIndiziatoPlayers,
    lynchPlayer,
    toggleElimination,
    addEliminationEntry,
    updateEliminationSelect,
    eliminateFromSelect,
    promptElimination,
    isEliminated,
    getLivingPlayers,
    getRoleNameFromEntry,
    getSuppressLivingToggle,
    setEliminationCallbacks
} from './elimination.js';

import {
    updateNarratorUI,
    buildNarrationSteps,
    renderGuide,
    toggleGuideMode,
    changeGuideStep,
    advanceDay,
    hasSpecial,
    setNarratorCallbacks
} from './narrator.js';

import {
    handleLanguageChange,
    handleThemeChange,
    toggleMainMenu,
    toggleLanguageMenu,
    setSettingsCallbacks
} from './settings.js';

import {
    startGame,
    resetGame,
    setGameLifecycleCallbacks
} from './game-lifecycle.js';

import {
    attachEvents,
    setEventCallbacks
} from './events.js';

// Wire up all the callbacks to avoid circular dependencies
function wireCallbacks() {
    // Views callbacks
    setViewCallbacks({
        renderSummaryList,
        updateNarratorUI,
        toggleLanguageMenu
    });

    // Mythomaniac callbacks
    setMythCallbacks({
        renderSummaryList,
        updateNarratorUI,
        isEliminated,
        getLivingPlayers
    });

    // Victory callbacks
    setVictoryCallbacks({
        showView,
        isEliminated,
        getLivingPlayers
    });

    // Elimination callbacks
    setEliminationCallbacks({
        confirmAction,
        renderMythPanel,
        updateNarratorUI,
        evaluateVictoryConditions,
        predictVictoryOnElimination,
        getVictoryText,
        getVictorySurvivors
    });

    // Narrator callbacks
    setNarratorCallbacks({
        renderMythPanel,
        updateEliminationSelect,
        evaluateVictoryConditions,
        mythRequiresAction,
        isMythActive,
        renderSummaryList,
        confirmAction
    });

    // Settings callbacks
    setSettingsCallbacks({
        renderSummaryList,
        updateNarratorUI,
        renderVictoryFromState
    });

    // Game lifecycle callbacks
    setGameLifecycleCallbacks({
        showView,
        showSummary
    });

    // Events callbacks
    setEventCallbacks({
        startGame,
        resetGame,
        confirmAction,
        showView,
        showSummary,
        advanceDay,
        changeGuideStep,
        toggleGuideMode,
        lynchPlayer,
        toggleElimination,
        eliminateFromSelect,
        applyMythTransformation,
        renderSummaryList,
        handleLanguageChange,
        toggleMainMenu,
        toggleLanguageMenu,
        openInfoModal,
        openVotingModal,
        closeVotingModal,
        getSuppressLivingToggle
    });
}

/**
 * Initializes the application.
 */
export function initApp() {
    console.log("[SlayTheWerewolf] Engine initializing...");

    // Wire up all callbacks first
    wireCallbacks();

    initUI();

    // Network callbacks for essential engine state
    setNetworkCallbacks({
        gameStart: (gameData) => {
            if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
                el.clientRole.updateConnectionStatus('connected');
            }
            showClientRoleView(getLocalPlayerName());
        },
        hostDisconnected: () => {
            if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
                el.clientRole.updateConnectionStatus('disconnected');
            }
            showView("landing");
        },
        receiveRole: (roleData) => {
            if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
                el.clientRole.updateConnectionStatus('connected');
            }
            showClientRoleView(getLocalPlayerName(), roleData);
        },
        playerEliminated: (playerName) => {
            if (el.clientRole && typeof el.clientRole.showEliminated === 'function') {
                if (getLocalPlayerName() === playerName) {
                    el.clientRole.showEliminated();
                }
            }
        },
        playerRevived: (playerName) => {
            if (el.clientRole && typeof el.clientRole.showRevived === 'function') {
                if (getLocalPlayerName() === playerName) {
                    el.clientRole.showRevived();
                }
            }
        },
        statusUpdate: (status) => {
            if (el.clientRole && typeof el.clientRole.updateStatus === 'function') {
                el.clientRole.updateStatus(status);
            }
        },
    });

    renderRoleOptions();
    attachEvents();
    document.addEventListener('themeChanged', (e) => handleThemeChange(e.detail.theme));
    updateWolfHint();
    clampWolfCount();
    enforceRoleLimits();
    updateDeckPreview();
    updateRoleSummary();
    renderPlayerList();
    restoreFromStorage();

    handleLanguageChange(state.language, { skipPersist: true });

    // Determine initial view based on network state and assigned role
    if (state.assignedRole) {
        showClientRoleView(getLocalPlayerName(), state.assignedRole);
    } else {
        if ((!state.view || state.view === "setup" || state.view === "lobby" || state.view === "client-role") && state.deck.length === 0) {
            showView("landing");
        } else if (state.view === "client-role") {
            showView("landing");
        } else {
            showView(state.view || "landing");
        }
    }

    initBrowserCompatibility();
    initOfflineDetection();
    initTimer();
}

// Re-export all public functions for external use
export {
    // Views
    showView,
    showLobbyView,
    showClientRoleView,
    showSummary,
    updateFooterVisibility,

    // Modals
    confirmAction,
    openInfoModal,
    closeInfoModal,
    openPrivacyModal,
    closePrivacyModal,
    openVotingModal,
    closeVotingModal,

    // Game lifecycle
    startGame,
    resetGame,

    // Mythomaniac
    applyMythTransformation,
    isMythActive,
    mythRequiresAction,
    getMythResultText,
    hideMythUI,
    showMythSummary,
    renderMythPanel,

    // Narrator
    updateNarratorUI,
    buildNarrationSteps,
    renderGuide,
    toggleGuideMode,
    changeGuideStep,
    advanceDay,
    hasSpecial,

    // Elimination
    renderSummaryList,
    renderFallenList,
    computeIndiziatoPlayers,
    lynchPlayer,
    toggleElimination,
    addEliminationEntry,
    updateEliminationSelect,
    eliminateFromSelect,
    promptElimination,
    isEliminated,
    getLivingPlayers,
    getRoleNameFromEntry,

    // Victory
    predictVictoryOnElimination,
    computeVictoryOutcomeFromSet,
    evaluateVictoryConditions,
    getVictorySurvivors,
    getVictoryText,
    showVictoryScreen,
    renderVictoryFromState,

    // Settings
    handleLanguageChange,
    handleThemeChange,
    toggleMainMenu,
    toggleLanguageMenu
};
