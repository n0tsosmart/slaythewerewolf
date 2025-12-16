/**
 * @fileoverview Event handlers - attaches all DOM event listeners.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { t } from '../i18n.js';
import {
    updateWolfHint,
    clampWolfCount,
    enforceRoleLimits,
    updateDeckPreview,
    handleAddPlayer,
    autoAdjustWolvesFromPlayers,
    adjustNumberInput,
    renderPlayerList,
    updateRoleSummary
} from '../setup.js';
import { revealCard, nextPlayer } from '../reveal.js';
import { vibrateShort } from '../haptics.js';

// Callback references to avoid circular dependencies
let _startGame = null;
let _resetGame = null;
let _confirmAction = null;
let _showView = null;
let _showSummary = null;
let _advanceDay = null;
let _changeGuideStep = null;
let _toggleGuideMode = null;
let _lynchPlayer = null;
let _toggleElimination = null;
let _eliminateFromSelect = null;
let _applyMythTransformation = null;
let _renderSummaryList = null;
let _handleLanguageChange = null;
let _toggleMainMenu = null;
let _toggleLanguageMenu = null;
let _openInfoModal = null;
let _openVotingModal = null;
let _closeVotingModal = null;
let _getSuppressLivingToggle = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setEventCallbacks({
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
}) {
    if (startGame) _startGame = startGame;
    if (resetGame) _resetGame = resetGame;
    if (confirmAction) _confirmAction = confirmAction;
    if (showView) _showView = showView;
    if (showSummary) _showSummary = showSummary;
    if (advanceDay) _advanceDay = advanceDay;
    if (changeGuideStep) _changeGuideStep = changeGuideStep;
    if (toggleGuideMode) _toggleGuideMode = toggleGuideMode;
    if (lynchPlayer) _lynchPlayer = lynchPlayer;
    if (toggleElimination) _toggleElimination = toggleElimination;
    if (eliminateFromSelect) _eliminateFromSelect = eliminateFromSelect;
    if (applyMythTransformation) _applyMythTransformation = applyMythTransformation;
    if (renderSummaryList) _renderSummaryList = renderSummaryList;
    if (handleLanguageChange) _handleLanguageChange = handleLanguageChange;
    if (toggleMainMenu) _toggleMainMenu = toggleMainMenu;
    if (toggleLanguageMenu) _toggleLanguageMenu = toggleLanguageMenu;
    if (openInfoModal) _openInfoModal = openInfoModal;
    if (openVotingModal) _openVotingModal = openVotingModal;
    if (closeVotingModal) _closeVotingModal = closeVotingModal;
    if (getSuppressLivingToggle) _getSuppressLivingToggle = getSuppressLivingToggle;
}

/**
 * Attaches all DOM event listeners.
 */
export function attachEvents() {
    if (el.playerCount) {
        el.playerCount.addEventListener("input", () => {
            autoAdjustWolvesFromPlayers();
            updateWolfHint();
            clampWolfCount();
            enforceRoleLimits();
            updateDeckPreview();
            updateRoleSummary();
            persistState();
        });
    }

    if (el.wolfCount) {
        el.wolfCount.addEventListener("input", () => {
            clampWolfCount();
            updateDeckPreview();
            updateRoleSummary();
            persistState();
        });
    }

    if (el.roleOptions) {
        el.roleOptions.addEventListener("change", () => {
            updateDeckPreview();
            updateRoleSummary();
            persistState();
        });
    }

    if (el.addPlayerBtn) el.addPlayerBtn.addEventListener("click", handleAddPlayer);
    if (el.playerNameInput) {
        el.playerNameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleAddPlayer();
            }
        });
    }

    if (el.playerList) {
        el.playerList.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;
            const button = event.target.closest("button");
            if (!button) return;
            if (button.classList.contains("chip-remove")) {
                const index = Number(button.dataset.index);
                state.customNames.splice(index, 1);
                renderPlayerList();
                persistState();
            }
        });
    }

    if (el.clearPlayersBtn) {
        el.clearPlayersBtn.addEventListener("click", () => {
            const confirmFn = _confirmAction || ((msg, cb) => cb());
            confirmFn(t("confirmation.clearPlayers"), () => {
                state.customNames = [];
                renderPlayerList();
                persistState();
            });
        });
    }

    if (el.setupForm) {
        el.setupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (_startGame) _startGame();
        });
    }

    if (el.roleCard) {
        el.roleCard.addEventListener("click", () => {
            if (el.roleCard.classList.contains("can-reveal") && el.revealBtn && !el.revealBtn.classList.contains("hidden")) {
                revealCard();
            }
        });
    }
    if (el.revealBtn) el.revealBtn.addEventListener("click", revealCard);
    if (el.hideBtn) el.hideBtn.addEventListener("click", nextPlayer);
    if (el.openSummaryBtn) {
        el.openSummaryBtn.addEventListener("click", () => {
            const confirmFn = _confirmAction || ((msg, cb) => cb());
            confirmFn(t("confirmation.handoff"), () => {
                if (_showSummary) _showSummary();
            });
        });
    }

    if (el.restartBtn) {
        el.restartBtn.addEventListener("click", () => {
            const confirmFn = _confirmAction || ((msg, cb) => cb());
            confirmFn(t("confirmation.restart"), () => {
                if (_resetGame) _resetGame();
            });
        });
    }
    if (el.backToLandingFromSetup) {
        el.backToLandingFromSetup.addEventListener("click", () => {
            if (_showView) _showView("landing");
        });
    }
    if (el.nextDayBtn) {
        el.nextDayBtn.addEventListener("click", () => {
            if (_advanceDay) _advanceDay();
        });
    }

    if (el.prevGuideStep) {
        el.prevGuideStep.addEventListener("click", () => {
            if (_changeGuideStep) _changeGuideStep(-1);
        });
    }
    if (el.nextGuideStep) {
        el.nextGuideStep.addEventListener("click", () => {
            if (_changeGuideStep) _changeGuideStep(1);
        });
    }

    if (el.summaryList) {
        el.summaryList.addEventListener("click", (event) => {
            if (!(event.target instanceof Element)) return;

            const voteBtn = event.target.closest(".vote-btn");
            if (voteBtn) {
                const player = voteBtn.dataset.player;
                const action = voteBtn.dataset.action;
                if (player && action) {
                    if (action === "increment") {
                        state.playerVotes[player] = (state.playerVotes[player] || 0) + 1;
                    } else if (action === "decrement") {
                        state.playerVotes[player] = Math.max(0, (state.playerVotes[player] || 0) - 1);
                    }
                    if (_renderSummaryList) _renderSummaryList();
                    persistState();
                }
                return;
            }

            const button = event.target.closest(".mini-action");
            if (!button) return;

            if (button.classList.contains("lynch-btn")) {
                if (_lynchPlayer) _lynchPlayer(button.dataset.player || "");
            } else if (button.classList.contains("discover-btn")) {
                // Werehamster discovered by seer - instant death
                const player = button.dataset.player || "";
                if (player) {
                    const confirmFn = _confirmAction || ((msg, cb) => cb());
                    confirmFn(t("elimination.discovered", { name: player }), () => {
                        state.eliminatedPlayers.push({
                            name: player,
                            locked: false,
                            type: 'discovered',
                            day: state.narratorDay
                        });
                        if (_renderSummaryList) _renderSummaryList();
                        persistState();
                        vibrateShort();
                    });
                }
            } else {
                if (_toggleElimination) _toggleElimination(button.dataset.player || "");
            }
        });
    }

    if (el.finalNewGameBtn) {
        el.finalNewGameBtn.addEventListener("click", () => {
            const confirmFn = _confirmAction || ((msg, cb) => cb());
            confirmFn(t("confirmation.newGame"), () => {
                if (_resetGame) _resetGame();
            });
        });
    }

    if (el.livingDetails) {
        el.livingDetails.addEventListener("toggle", () => {
            const suppressLivingToggle = _getSuppressLivingToggle ? _getSuppressLivingToggle() : false;
            if (suppressLivingToggle) return;
            state.playersCollapsed = !el.livingDetails.open;
            persistState();
        });
    }

    if (el.toggleGuideMode) {
        el.toggleGuideMode.addEventListener("click", () => {
            if (_toggleGuideMode) _toggleGuideMode();
        });
    }

    if (el.eliminateBtn) {
        el.eliminateBtn.addEventListener("click", () => {
            if (_eliminateFromSelect) _eliminateFromSelect();
        });
    }

    if (el.mythConfirmBtn) {
        el.mythConfirmBtn.addEventListener("click", () => {
            if (_applyMythTransformation) _applyMythTransformation();
        });
    }

    const toggleListViewBtn = document.getElementById("toggleListView");
    if (toggleListViewBtn && el.summaryList) {
        const VIEW_MODE_KEY = "slay_werewolf_view_mode";
        const savedMode = localStorage.getItem(VIEW_MODE_KEY);
        const isHorizontal = savedMode === "horizontal";

        if (isHorizontal) {
            el.summaryList.classList.add("horizontal-scroll");
        } else {
            el.summaryList.classList.remove("horizontal-scroll");
        }

        const icon = toggleListViewBtn.querySelector(".view-icon");
        if (icon) {
            icon.textContent = isHorizontal ? "☰" : "⊞";
        }

        toggleListViewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            el.summaryList.classList.toggle("horizontal-scroll");
            const isNowHorizontal = el.summaryList.classList.contains("horizontal-scroll");
            localStorage.setItem(VIEW_MODE_KEY, isNowHorizontal ? "horizontal" : "vertical");
            if (icon) {
                icon.textContent = isNowHorizontal ? "☰" : "⊞";
            }
        });
    }

    if (el.rolesDetails) {
        el.rolesDetails.addEventListener("toggle", () => {
            state.rolesDetailsOpen = el.rolesDetails.open;
            persistState();
        });
    }

    if (el.languageSelect) {
        el.languageSelect.addEventListener("change", (event) => {
            if (_handleLanguageChange) _handleLanguageChange(event.target.value);
        });
    }

    if (el.languageToggle && el.languageMenu) {
        el.languageToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            if (_toggleLanguageMenu) _toggleLanguageMenu(el.languageMenu.classList.contains("hidden"));
        });
        document.addEventListener("click", (event) => {
            if (!el.languageMenu || el.languageMenu.classList.contains("hidden")) return;
            if (el.languagePicker && event.target instanceof Node && el.languagePicker.contains(event.target)) return;
            if (_toggleLanguageMenu) _toggleLanguageMenu(false);
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && _toggleLanguageMenu) _toggleLanguageMenu(false);
        });
    }

    if (el.languageButtons && el.languageButtons.length) {
        el.languageButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const lang = button.dataset.langButton;
                if (lang) {
                    if (_handleLanguageChange) _handleLanguageChange(lang);
                    if (_toggleMainMenu) _toggleMainMenu(false);
                }
            });
        });
    }

    if (el.menuBtn && el.mainMenu) {
        el.menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            if (_toggleMainMenu) _toggleMainMenu(el.mainMenu.classList.contains("hidden"));
        });
        document.addEventListener("click", (event) => {
            if (!el.mainMenu || el.mainMenu.classList.contains("hidden")) return;
            if (el.menuBtn && event.target instanceof Node && el.menuBtn.contains(event.target)) return;
            if (el.mainMenu.contains(event.target)) return;
            if (_toggleMainMenu) _toggleMainMenu(false);
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && _toggleMainMenu) _toggleMainMenu(false);
        });
    }

    if (el.menuVotingBtn) {
        el.menuVotingBtn.addEventListener("click", () => {
            if (_toggleMainMenu) _toggleMainMenu(false);
            if (_openVotingModal) _openVotingModal();
        });
    }
    const openVotingFromSummary = document.getElementById("openVotingFromSummary");
    if (openVotingFromSummary) {
        openVotingFromSummary.addEventListener("click", () => {
            if (_openVotingModal) _openVotingModal();
        });
    }
    if (el.votingClose) {
        el.votingClose.addEventListener("click", () => {
            if (_closeVotingModal) _closeVotingModal();
        });
    }

    if (el.menuImmersionBtn) {
        el.menuImmersionBtn.addEventListener("click", () => {
            if (_toggleMainMenu) _toggleMainMenu(false);
            if (_openInfoModal) _openInfoModal();
        });
    }

    if (el.menuFeedbackLink) {
        el.menuFeedbackLink.addEventListener("click", () => {
            if (_toggleMainMenu) _toggleMainMenu(false);
        });
    }

    if (el.menuDonateLink) {
        el.menuDonateLink.addEventListener("click", () => {
            if (_toggleMainMenu) _toggleMainMenu(false);
        });
    }

    document.querySelectorAll(".step-btn").forEach((button) => {
        const targetId = button.dataset.target;
        const delta = Number(button.dataset.delta) || 0;
        const targetInput = document.getElementById(targetId);
        if (!targetInput) return;
        button.addEventListener("click", () => adjustNumberInput(targetInput, delta));
    });

    if (el.infoButton) {
        el.infoButton.addEventListener("click", () => {
            if (_openInfoModal) _openInfoModal();
        });
    }

    // Haptics for all buttons
    document.addEventListener("click", (event) => {
        if (event.target.closest("button") || event.target.closest(".btn") || event.target.closest(".toggle-switch")) {
            vibrateShort();
        }
    });
}
