/**
 * @fileoverview View management - switching between different app views.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { clearHandoffCountdown } from '../reveal.js';

// Internal reference to avoid circular dependency
let _renderSummaryList = null;
let _updateNarratorUI = null;
let _toggleLanguageMenu = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setViewCallbacks({ renderSummaryList, updateNarratorUI, toggleLanguageMenu }) {
    if (renderSummaryList) _renderSummaryList = renderSummaryList;
    if (updateNarratorUI) _updateNarratorUI = updateNarratorUI;
    if (toggleLanguageMenu) _toggleLanguageMenu = toggleLanguageMenu;
}

/**
 * Shows the lobby view for online games.
 */
export function showLobbyView() {
    showView("lobby");
    // Ensure the lobby view shows the main menu when first displayed
    if (el.viewLobby && typeof el.viewLobby.resetToMainMenu === 'function') {
        el.viewLobby.resetToMainMenu();
    }
}

/**
 * Shows the client role view for online players.
 * @param {string} playerName - The player's name
 * @param {Object|null} roleData - The role data to display
 */
export function showClientRoleView(playerName, roleData = null) {
    // Hide all main views
    [el.landingView, el.setupView, el.revealView, el.summaryView, el.finalView, el.lobbyView, el.clientRoleView].forEach((section) => {
        if (section) section.classList.add("hidden");
    });
    // Show client role view
    if (el.clientRoleView) el.clientRoleView.classList.remove("hidden");
    state.view = "client-role";
    // If roleData is provided, render the role
    if (roleData && el.clientRole) {
        el.clientRole.setRole(roleData);
    } else if (el.clientRole) {
        el.clientRole.setRole(null);
    }
    updateFooterVisibility();
    persistState();
}

/**
 * Shows a specific view and hides all others.
 * @param {string} view - The view to show: 'landing', 'setup', 'reveal', 'summary', 'final', 'lobby', 'client-role'
 */
export function showView(view) {
    if (view !== "reveal" && view !== "client-role") clearHandoffCountdown();
    [el.landingView, el.setupView, el.revealView, el.summaryView, el.finalView, el.lobbyView, el.clientRoleView].forEach((section) => {
        if (section) section.classList.add("hidden");
    });
    if (view === "landing" && el.landingView) el.landingView.classList.remove("hidden");
    if (view === "setup" && el.setupView) el.setupView.classList.remove("hidden");
    if (view === "reveal" && el.revealView) el.revealView.classList.remove("hidden");
    if (view === "summary" && el.summaryView) el.summaryView.classList.remove("hidden");
    if (view === "final" && el.finalView) el.finalView.classList.remove("hidden");
    if (view === "lobby" && el.lobbyView) el.lobbyView.classList.remove("hidden");
    if (view === "client-role" && el.clientRoleView) el.clientRoleView.classList.remove("hidden");

    if (view === "setup" && el.rolesDetails) {
        el.rolesDetails.open = state.rolesDetailsOpen;
    }
    state.view = view;
    if (_toggleLanguageMenu) _toggleLanguageMenu(false);
    updateFooterVisibility();
    persistState();
}

/**
 * Shows the summary view with narrator tools.
 */
export function showSummary() {
    clearHandoffCountdown();
    if (_renderSummaryList) _renderSummaryList();
    if (_updateNarratorUI) _updateNarratorUI();
    showView("summary");
    persistState();
}

/**
 * Updates the footer visibility based on current view.
 */
export function updateFooterVisibility() {
    if (!el.infoFooter) return;
    // Show footer on all views (always visible)
    el.infoFooter.classList.remove("hidden");

    // Show restart button only after cards have been dealt (reveal, summary, final views)
    if (el.restartBtn) {
        const showRestart = state.view === "reveal" || state.view === "summary" || state.view === "final";
        el.restartBtn.classList.toggle("hidden", !showRestart);
    }
}
