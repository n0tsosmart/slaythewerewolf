/**
 * @fileoverview Settings handlers - language and theme changes, menu toggles.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { setLanguage, applyTranslations, getRoleContent } from '../i18n.js';
import {
    renderRoleOptions,
    enforceRoleLimits,
    updateWolfHint,
    updateRoleSummary,
    getSelectedSpecials,
    renderPlayerList
} from '../setup.js';
import { prepareReveal, revealCard, updateHandoffTimer } from '../reveal.js';

// Callback references to avoid circular dependencies
let _renderSummaryList = null;
let _updateNarratorUI = null;
let _renderVictoryFromState = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setSettingsCallbacks({ renderSummaryList, updateNarratorUI, renderVictoryFromState }) {
    if (renderSummaryList) _renderSummaryList = renderSummaryList;
    if (updateNarratorUI) _updateNarratorUI = updateNarratorUI;
    if (renderVictoryFromState) _renderVictoryFromState = renderVictoryFromState;
}

/**
 * Handles language change.
 * @param {string} lang - Language code ('en', 'es', 'it')
 * @param {Object} options - Options object
 * @param {boolean} options.skipPersist - Whether to skip persisting state
 */
export async function handleLanguageChange(lang, { skipPersist = false } = {}) {
    await setLanguage(lang);

    // Refresh UI elements dependent on language
    const selectedRoles = getSelectedSpecials().map((item) => item.roleId);
    renderRoleOptions();
    if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
    selectedRoles.forEach((roleId) => {
        const input = el.roleOptions.querySelector(`.role-option[value="${roleId}"]`);
        if (input) input.checked = true;
    });
    enforceRoleLimits();
    applyTranslations();
    renderPlayerList();
    updateHandoffTimer();

    updateWolfHint();
    if (_renderSummaryList) _renderSummaryList();
    if (state.view === "summary" && _updateNarratorUI) {
        _updateNarratorUI({ preserveGuideStep: true });
    }
    if (state.view === "reveal") {
        if (el.hideBtn && !el.hideBtn.classList.contains("hidden")) {
            revealCard();
        } else {
            prepareReveal();
        }
    }
    if (state.view === "final" && state.victory && _renderVictoryFromState) {
        _renderVictoryFromState();
    }

    updateRoleSummary();
    if (!skipPersist) persistState();
}

/**
 * Handles theme change.
 * @param {string} theme - Theme name ('werewolf' or 'mafia')
 */
export function handleThemeChange(theme) {
    // Re-render role options to update names/descriptions
    const selectedRoles = getSelectedSpecials().map((item) => item.roleId);
    renderRoleOptions();

    // Restore selection
    selectedRoles.forEach((roleId) => {
        const input = el.roleOptions.querySelector(`.role-option[value="${roleId}"]`);
        if (input) input.checked = true;
    });

    enforceRoleLimits();
    renderPlayerList();
    updateRoleSummary();

    // Update client role view if active
    if (state.view === "client-role" && state.assignedRole && el.clientRole) {
        el.clientRole.setRole(state.assignedRole);
    }

    // Update summary view if active
    if (state.view === "summary") {
        if (_renderSummaryList) _renderSummaryList();
        if (_updateNarratorUI) _updateNarratorUI({ preserveGuideStep: true });
    }
}

/**
 * Toggles the main hamburger menu.
 * @param {boolean} [forceState] - Force open (true) or close (false)
 */
export function toggleMainMenu(forceState) {
    if (!el.mainMenu || !el.menuBtn) return;
    const shouldShow = typeof forceState === "boolean" ? forceState : el.mainMenu.classList.contains("hidden");
    el.mainMenu.classList.toggle("hidden", !shouldShow);
    el.mainMenu.setAttribute("aria-hidden", String(!shouldShow));
    el.menuBtn.setAttribute("aria-expanded", String(shouldShow));
}

/**
 * Toggles the language menu.
 * @param {boolean} [forceState] - Force open (true) or close (false)
 */
export function toggleLanguageMenu(forceState) {
    if (!el.languageMenu || !el.languageToggle) return;
    const shouldShow = typeof forceState === "boolean" ? forceState : el.languageMenu.classList.contains("hidden");
    el.languageMenu.classList.toggle("hidden", !shouldShow);
    el.languageMenu.setAttribute("aria-hidden", String(!shouldShow));
    el.languageToggle.classList.toggle("active", shouldShow);
    el.languageToggle.setAttribute("aria-expanded", String(shouldShow));
}
