/**
 * @fileoverview Narrator logic - day cycle, guide steps, narrator UI.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { t } from '../i18n.js';
import { stopTimer, resetTimerPlaceholder } from '../timer.js';

// Callback references to avoid circular dependencies
let _renderMythPanel = null;
let _updateEliminationSelect = null;
let _evaluateVictoryConditions = null;
let _mythRequiresAction = null;
let _isMythActive = null;
let _renderSummaryList = null;
let _confirmAction = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setNarratorCallbacks({
    renderMythPanel,
    updateEliminationSelect,
    evaluateVictoryConditions,
    mythRequiresAction,
    isMythActive,
    renderSummaryList,
    confirmAction
}) {
    if (renderMythPanel) _renderMythPanel = renderMythPanel;
    if (updateEliminationSelect) _updateEliminationSelect = updateEliminationSelect;
    if (evaluateVictoryConditions) _evaluateVictoryConditions = evaluateVictoryConditions;
    if (mythRequiresAction) _mythRequiresAction = mythRequiresAction;
    if (isMythActive) _isMythActive = isMythActive;
    if (renderSummaryList) _renderSummaryList = renderSummaryList;
    if (confirmAction) _confirmAction = confirmAction;
}

/**
 * Checks if a special role is active in the current game.
 * @param {string} roleId - The role ID to check
 * @returns {boolean}
 */
export function hasSpecial(roleId) {
    return state.activeSpecialIds.includes(roleId);
}

/**
 * Builds the narration steps for a given day.
 * @param {number} day - The day number
 * @returns {Array<string>} Array of step texts
 */
export function buildNarrationSteps(day) {
    const steps = [];
    const isMythActive = _isMythActive ? _isMythActive() : false;

    steps.push(t("guide.step.closeEyes", { day }));
    if (hasSpecial("mason") && day === 1) steps.push(t("guide.step.masons"));
    if (hasSpecial("bodyguard") && day >= 2) steps.push(t("guide.step.bodyguard"));
    steps.push(t("guide.step.seer"));
    if (hasSpecial("medium") && day >= 2) steps.push(t("guide.step.medium"));
    if (hasSpecial("owl")) steps.push(t("guide.step.owl"));
    if (isMythActive && day === 2) steps.push(t("guide.step.mythomaniac"));
    steps.push(t("guide.step.wolves"));
    if (hasSpecial("werehamster")) steps.push(t("guide.step.hamster"));
    steps.push(t("guide.step.dawn", { day }));
    if (hasSpecial("owl")) steps.push(t("guide.step.owlReveal"));
    if (hasSpecial("possessed")) steps.push(t("guide.step.possessed"));
    steps.push(t("guide.step.dayDiscuss", { day }));
    return steps;
}

/**
 * Renders the narrator guide panel.
 */
export function renderGuide() {
    const total = state.guideSteps.length;
    if (el.guideProgress) el.guideProgress.classList.toggle("hidden", state.guideExpanded);
    if (total === 0) {
        el.guideProgress.textContent = t("guide.progress", { current: 0, total: 0 });
        el.guideStepText.textContent = t("guide.empty");
        el.prevGuideStep.disabled = true;
        el.nextGuideStep.disabled = true;
        el.guideStepText.classList.remove("hidden");
        el.guideFullList.classList.add("hidden");
        el.guideNav.classList.remove("hidden");
        return;
    }
    const current = state.guideStepIndex;
    el.guideProgress.textContent = t("guide.progress", { current: current + 1, total });
    const showFull = state.guideExpanded;
    if (showFull) {
        el.guideStepText.classList.add("hidden");
        el.guideNav.classList.add("hidden");
        el.guideFullList.classList.remove("hidden");
        el.guideFullList.innerHTML = "";
        state.guideSteps.forEach((step) => {
            const li = document.createElement("li");
            li.textContent = step;
            el.guideFullList.appendChild(li);
        });
        if (el.toggleGuideMode) el.toggleGuideMode.textContent = t("buttons.stepMode");
    } else {
        el.guideFullList.classList.add("hidden");
        el.guideStepText.classList.remove("hidden");
        el.guideNav.classList.remove("hidden");
        el.guideStepText.textContent = state.guideSteps[current];
        el.prevGuideStep.disabled = current <= 0;
        el.nextGuideStep.disabled = current >= total - 1;
        if (el.toggleGuideMode) el.toggleGuideMode.textContent = t("buttons.showList");
    }
}

/**
 * Toggles between step mode and full list mode.
 */
export function toggleGuideMode() {
    state.guideExpanded = !state.guideExpanded;
    renderGuide();
    persistState();
}

/**
 * Changes the current guide step by a delta.
 * @param {number} delta - The step change (+1 or -1)
 */
export function changeGuideStep(delta) {
    if (!state.guideSteps.length) return;
    const nextIndex = state.guideStepIndex + delta;
    if (nextIndex < 0 || nextIndex >= state.guideSteps.length) return;
    state.guideStepIndex = nextIndex;
    renderGuide();
    persistState();
}

/**
 * Updates the narrator UI with current game state.
 * @param {Object} options - Options object
 * @param {boolean} options.preserveGuideStep - Whether to preserve current guide step
 */
export function updateNarratorUI({ preserveGuideStep = false } = {}) {
    el.dayCounter.textContent = String(state.narratorDay);
    const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
    const maxReached = hasCap && state.narratorDay >= state.maxDays;
    const mythBlocked = _mythRequiresAction ? _mythRequiresAction() : false;
    const disableNext = maxReached || mythBlocked || Boolean(state.victory);
    el.nextDayBtn.disabled = disableNext;
    el.nextDayBtn.textContent = mythBlocked
        ? t("myth.blockedButton")
        : maxReached
            ? t("buttons.noMoreDays")
            : t("buttons.nextDay");

    const previousIndex = state.guideStepIndex;
    state.guideSteps = buildNarrationSteps(state.narratorDay);
    if (state.guideSteps.length === 0) {
        state.guideStepIndex = 0;
    } else if (!preserveGuideStep) {
        state.guideStepIndex = 0;
    } else {
        state.guideStepIndex = Math.min(previousIndex, state.guideSteps.length - 1);
    }
    renderGuide();
    if (_renderMythPanel) _renderMythPanel();
    persistState();
    if (_updateEliminationSelect) _updateEliminationSelect();
    if (_evaluateVictoryConditions) _evaluateVictoryConditions();
}

/**
 * Advances to the next day.
 */
export function advanceDay() {
    if (state.victory) return;
    const mythBlocked = _mythRequiresAction ? _mythRequiresAction() : false;
    if (mythBlocked) {
        if (_renderMythPanel) _renderMythPanel();
        if (el.mythResultMessage) el.mythResultMessage.textContent = t("myth.completeWarning");
        return;
    }
    const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
    if (hasCap && state.narratorDay >= state.maxDays) return;

    const nextDay = state.narratorDay + 1;
    const confirmFn = _confirmAction || ((msg, cb) => cb());

    confirmFn(
        t("confirmation.nextDay", { day: nextDay }),
        () => {
            state.narratorDay += 1;
            state.guideStepIndex = 0;
            state.playerVotes = {};
            state.indiziatoPlayers = [];
            state.eliminatedPlayers = state.eliminatedPlayers.map((entry) => ({
                ...entry,
                locked: true,
            }));
            resetTimerPlaceholder(); // Reset timer on day advance
            if (_renderSummaryList) _renderSummaryList();
            updateNarratorUI();
        },
    );
}
