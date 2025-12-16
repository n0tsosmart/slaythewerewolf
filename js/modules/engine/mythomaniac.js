/**
 * @fileoverview Mythomaniac role logic - handling the special role that copies others.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { t } from '../i18n.js';
import { ROLE_LIBRARY } from '../config.js';
import { determineMythOutcome } from '../logic.js';
import { createCard } from '../setup.js';

// Callback references to avoid circular dependencies
let _renderSummaryList = null;
let _updateNarratorUI = null;
let _isEliminated = null;
let _getLivingPlayers = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setMythCallbacks({ renderSummaryList, updateNarratorUI, isEliminated, getLivingPlayers }) {
    if (renderSummaryList) _renderSummaryList = renderSummaryList;
    if (updateNarratorUI) _updateNarratorUI = updateNarratorUI;
    if (isEliminated) _isEliminated = isEliminated;
    if (getLivingPlayers) _getLivingPlayers = getLivingPlayers;
}

/**
 * Checks if a player is eliminated using the registered callback.
 * @param {string} name - Player name
 * @returns {boolean}
 */
function isEliminated(name) {
    if (_isEliminated) return _isEliminated(name);
    return state.eliminatedPlayers.some((entry) => entry.name === name);
}

/**
 * Gets living players using the registered callback.
 * @returns {Array}
 */
function getLivingPlayers() {
    if (_getLivingPlayers) return _getLivingPlayers();
    return state.players
        .map((name, index) => ({ name, card: state.deck[index] }))
        .filter((entry) => !isEliminated(entry.name));
}

/**
 * Applies the mythomaniac transformation when a target is selected.
 */
export function applyMythTransformation() {
    if (!state.mythStatus || state.mythStatus.completed) return;
    if (state.narratorDay < 2) return;
    if (!el.mythTargetSelect) return;
    const targetName = el.mythTargetSelect.value;
    if (!targetName) return;
    const targetIndex = state.players.findIndex((name) => name === targetName);
    if (targetIndex === -1) return;
    const targetCard = state.deck[targetIndex];
    const outcome = determineMythOutcome(targetCard);

    if (outcome === "wolf") {
        state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.werewolf);
    } else if (outcome === "seer") {
        state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.seer);
    }

    state.mythStatus = {
        ...state.mythStatus,
        completed: true,
        targetName,
        outcome,
    };
    if (_renderSummaryList) _renderSummaryList();
    if (_updateNarratorUI) _updateNarratorUI({ preserveGuideStep: true });
    persistState();
}

/**
 * Checks if the mythomaniac role is active and not eliminated.
 * @returns {boolean}
 */
export function isMythActive() {
    return Boolean(
        state.mythStatus &&
        !state.mythStatus.completed &&
        state.mythStatus.playerName &&
        !isEliminated(state.mythStatus.playerName)
    );
}

/**
 * Checks if the mythomaniac requires action (day 2+, not completed).
 * @returns {boolean}
 */
export function mythRequiresAction() {
    return Boolean(
        state.mythStatus &&
        !state.mythStatus.completed &&
        state.mythStatus.playerName &&
        !isEliminated(state.mythStatus.playerName) &&
        state.narratorDay >= 2
    );
}

/**
 * Gets the result text for a mythomaniac transformation.
 * @param {Object} status - The mythStatus object
 * @returns {string}
 */
export function getMythResultText(status) {
    if (!status || !status.playerName) return "";
    const mythName = status.playerName;
    const target = status.targetName || t("myth.noTargets");
    if (status.outcome === "wolf") return t("myth.result.wolf", { name: mythName, target });
    if (status.outcome === "seer") return t("myth.result.seer", { name: mythName, target });
    return t("myth.result.human", { name: mythName, target });
}

/**
 * Hides the mythomaniac UI panels.
 */
export function hideMythUI() {
    if (el.mythPanel) el.mythPanel.classList.add("hidden");
    if (el.mythSummary) el.mythSummary.classList.add("hidden");
}

/**
 * Shows the mythomaniac summary text.
 * @param {string} text - Text to display, or empty to hide
 */
export function showMythSummary(text) {
    if (!el.mythSummary) return;
    if (!text) {
        el.mythSummary.classList.add("hidden");
        if (el.mythSummaryText) el.mythSummaryText.textContent = "";
        return;
    }
    el.mythSummary.classList.remove("hidden");
    if (el.mythSummaryText) el.mythSummaryText.textContent = text;
}

/**
 * Renders the mythomaniac panel with current state.
 */
export function renderMythPanel() {
    if (!el.mythPanel && !el.mythSummary) return;
    if (!state.mythStatus) {
        hideMythUI();
        return;
    }
    const status = state.mythStatus;
    if (!status.playerName || isEliminated(status.playerName)) {
        state.mythStatus = null;
        hideMythUI();
        return;
    }
    if (el.mythPlayerLabel) {
        el.mythPlayerLabel.textContent = t("myth.playerLabel", { name: status.playerName });
    }
    const completed = Boolean(status.completed);
    const waiting = state.narratorDay < 2;
    const livingTargets = getLivingPlayers().filter((entry) => entry.name !== status.playerName);
    const hasTargets = livingTargets.length > 0;
    const actionable = !completed && !waiting && hasTargets;

    const statusKey = completed
        ? "myth.status.done"
        : waiting
            ? "myth.status.waiting"
            : "myth.status.ready";
    if (el.mythStatusTag) el.mythStatusTag.textContent = t(statusKey);

    if (!actionable) {
        if (el.mythPanel) el.mythPanel.classList.add("hidden");
        const summaryText = completed
            ? getMythResultText(status)
            : waiting
                ? t("myth.waitingDescription")
                : hasTargets
                    ? t("myth.pendingDescription")
                    : t("myth.noTargets");
        showMythSummary(summaryText);
        return;
    }

    if (el.mythPanel) el.mythPanel.classList.remove("hidden");
    showMythSummary("");

    if (el.mythTargetSelect) {
        el.mythTargetSelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = t("myth.selectPlaceholder");
        placeholder.disabled = true;
        placeholder.selected = true;
        el.mythTargetSelect.appendChild(placeholder);
        livingTargets.forEach(({ name }) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            el.mythTargetSelect.appendChild(option);
        });
        el.mythTargetSelect.disabled = false;
        if (el.mythConfirmBtn) el.mythConfirmBtn.disabled = false;
    }
    if (el.mythInstructions) {
        el.mythInstructions.textContent = t("myth.pendingDescription");
    }
    if (el.mythResultMessage) {
        el.mythResultMessage.textContent = "";
    }
}
