import { state } from './state.js';
import { persistState, restoreFromStorage } from './store.js';
import { el } from './dom.js';
import { t, getRoleContent, setLanguage, applyTranslations } from './i18n.js';
import { ROLE_LIBRARY, MIN_PLAYERS } from './config.js';
import {
  getSelectedSpecials,
  buildPlayerList,
  buildDeck,
  updateWolfHint,
  clampWolfCount,
  enforceRoleLimits,
  updateDeckPreview,
  createCard,
  renderPlayerList,
  renderRoleOptions,
  updateRoleSummary,
  handleAddPlayer,
  autoAdjustWolvesFromPlayers,
  adjustNumberInput
} from './setup.js';
import { prepareReveal, revealCard, nextPlayer, clearHandoffCountdown, updateHandoffTimer } from './reveal.js';
import { initUI, scrollToBottom, getRoleImage } from './utils.js';
import { detectMythStatusFromDeck, determineMythOutcome } from './logic.js';
import { setNetworkCallbacks, isClient, getLocalPlayerName, isHost, getConnectedPlayers, broadcast, sendToPeer, disconnect as networkDisconnect, notifyPlayerEliminated } from './network.js';
import { initBrowserCompatibility } from './browser-compat.js';

// Map to store peerId to playerName for easy lookup when distributing roles
const peerIdToPlayerName = new Map();

// --- APP INITIALIZATION ---

export function initApp() {
  console.log("[SlayTheWerewolf] Engine initializing...");
  initUI();
  // Network callbacks are now handled by ViewLobby component to avoid duplicate toasts
  // Only essential callbacks that affect engine state are registered here
  setNetworkCallbacks({
    gameStart: (gameData) => {
      // Transition the client to a waiting screen or directly to client role view
      if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
        el.clientRole.updateConnectionStatus('connected');
      }
      showClientRoleView(getLocalPlayerName());
    },
    hostDisconnected: () => {
      if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
        el.clientRole.updateConnectionStatus('disconnected');
      }
      showView("landing"); // Return client to match selection if host disconnects
    },
    receiveRole: (roleData) => {
      if (el.clientRole && typeof el.clientRole.updateConnectionStatus === 'function') {
        el.clientRole.updateConnectionStatus('connected');
      }
      showClientRoleView(getLocalPlayerName(), roleData);
    },
    playerEliminated: (playerName) => {
      // Show ghost reminder to eliminated player
      if (el.clientRole && typeof el.clientRole.showEliminated === 'function') {
        if (getLocalPlayerName() === playerName) {
          el.clientRole.showEliminated();
        }
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
  // Use handleLanguageChange to ensure all UI is updated according to the restored language
  handleLanguageChange(state.language, { skipPersist: true });

  // Determine initial view based on network state and assigned role
  // Only show client role view if there's an assigned role (persisted from previous session)
  if (state.assignedRole) {
    // Client has a persisted role, show it
    showClientRoleView(getLocalPlayerName(), state.assignedRole);
  } else {
    // Normal flow - check state or default to landing
    if ((!state.view || state.view === "setup" || state.view === "lobby" || state.view === "client-role") && state.deck.length === 0) {
      showView("landing");
    } else if (state.view === "client-role") {
      // If view was client-role but no assigned role, go to landing
      showView("landing");
    } else {
      showView(state.view || "landing");
    }
  }

  // Check browser compatibility and show warnings if needed
  initBrowserCompatibility();
}

function handleLanguageChange(lang, { skipPersist = false } = {}) {
  setLanguage(lang);

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
  renderSummaryList();
  if (state.view === "summary") {
    updateNarratorUI({ preserveGuideStep: true });
  }
  if (state.view === "reveal") {
    if (el.hideBtn && !el.hideBtn.classList.contains("hidden")) {
      revealCard();
    } else {
      prepareReveal();
    }
  }
  if (state.view === "final" && state.victory) renderVictoryFromState();

  updateRoleSummary();
  if (!skipPersist) persistState();
}

function handleThemeChange(theme) {
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
    renderSummaryList();
    updateNarratorUI({ preserveGuideStep: true });
  }
}


function attachEvents() {
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
    el.clearPlayersBtn.addEventListener("click", () => confirmAction(t("confirmation.clearPlayers"), () => {
      state.customNames = [];
      renderPlayerList();
      persistState();
    }));
  }

  if (el.setupForm) {
    el.setupForm.addEventListener("submit", (event) => {
      event.preventDefault();
      startGame();
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
      confirmAction(t("confirmation.handoff"), () => {
        showSummary();
      });
    });
  }

  if (el.restartBtn) el.restartBtn.addEventListener("click", () => confirmAction(t("confirmation.restart"), resetGame));
  if (el.backToLandingFromSetup) el.backToLandingFromSetup.addEventListener("click", () => showView("landing"));
  if (el.nextDayBtn) el.nextDayBtn.addEventListener("click", advanceDay);

  if (el.prevGuideStep) el.prevGuideStep.addEventListener("click", () => changeGuideStep(-1));
  if (el.nextGuideStep) el.nextGuideStep.addEventListener("click", () => changeGuideStep(1));

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
          renderSummaryList();
          persistState();
        }
        return;
      }

      const button = event.target.closest(".mini-action");
      if (!button) return;

      if (button.classList.contains("lynch-btn")) {
        lynchPlayer(button.dataset.player || "");
      } else {
        toggleElimination(button.dataset.player || "");
      }
    });
  }

  if (el.finalNewGameBtn) el.finalNewGameBtn.addEventListener("click", () => confirmAction(t("confirmation.newGame"), resetGame));

  if (el.livingDetails) {
    el.livingDetails.addEventListener("toggle", () => {
      if (suppressLivingToggle) return;
      state.playersCollapsed = !el.livingDetails.open;
      persistState();
    });
  }

  if (el.toggleGuideMode) el.toggleGuideMode.addEventListener("click", toggleGuideMode);

  if (el.eliminateBtn) el.eliminateBtn.addEventListener("click", eliminateFromSelect);

  if (el.mythConfirmBtn) el.mythConfirmBtn.addEventListener("click", applyMythTransformation);

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
      handleLanguageChange(event.target.value);
    });
  }

  if (el.languageToggle && el.languageMenu) {
    el.languageToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLanguageMenu(el.languageMenu.classList.contains("hidden"));
    });
    document.addEventListener("click", (event) => {
      if (!el.languageMenu || el.languageMenu.classList.contains("hidden")) return;
      if (el.languagePicker && event.target instanceof Node && el.languagePicker.contains(event.target)) return;
      toggleLanguageMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleLanguageMenu(false);
    });
  }

  if (el.languageButtons && el.languageButtons.length) {
    el.languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.dataset.langButton;
        if (lang) {
          handleLanguageChange(lang);
          toggleMainMenu(false);
        }
      });
    });
  }

  if (el.menuBtn && el.mainMenu) {
    el.menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMainMenu(el.mainMenu.classList.contains("hidden"));
    });
    document.addEventListener("click", (event) => {
      if (!el.mainMenu || el.mainMenu.classList.contains("hidden")) return;
      if (el.menuBtn && event.target instanceof Node && el.menuBtn.contains(event.target)) return;
      if (el.mainMenu.contains(event.target)) return;
      toggleMainMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleMainMenu(false);
    });
  }

  if (el.menuVotingBtn) {
    el.menuVotingBtn.addEventListener("click", () => {
      toggleMainMenu(false);
      openVotingModal();
    });
  }
  const openVotingFromSummary = document.getElementById("openVotingFromSummary");
  if (openVotingFromSummary) {
    openVotingFromSummary.addEventListener("click", openVotingModal);
  }
  if (el.votingClose) {
    el.votingClose.addEventListener("click", closeVotingModal);
  }

  if (el.menuImmersionBtn) {
    el.menuImmersionBtn.addEventListener("click", () => {
      toggleMainMenu(false);
      openInfoModal();
    });
  }

  if (el.menuFeedbackLink) {
    el.menuFeedbackLink.addEventListener("click", () => {
      toggleMainMenu(false);
    });
  }

  if (el.menuDonateLink) {
    el.menuDonateLink.addEventListener("click", () => {
      toggleMainMenu(false);
    });
  }

  document.querySelectorAll(".step-btn").forEach((button) => {
    const targetId = button.dataset.target;
    const delta = Number(button.dataset.delta) || 0;
    const targetInput = document.getElementById(targetId);
    if (!targetInput) return;
    button.addEventListener("click", () => adjustNumberInput(targetInput, delta));
  });

  if (el.infoButton) el.infoButton.addEventListener("click", openInfoModal);

}

// --- ENGINE FUNCTIONS ---

let suppressLivingToggle = false;

export function showLobbyView() {
  showView("lobby");
  // Ensure the lobby view shows the main menu when first displayed
  if (el.viewLobby && typeof el.viewLobby.resetToMainMenu === 'function') {
    el.viewLobby.resetToMainMenu();
  }
}

export function showClientRoleView(playerName, roleData = null) {
  // Hide all main views
  [el.landingView, el.setupView, el.revealView, el.summaryView, el.finalView, el.lobbyView, el.clientRoleView].forEach((section) => {
    if (section) section.classList.add("hidden");
  });
  // Show client role view
  if (el.clientRoleView) el.clientRoleView.classList.remove("hidden");
  state.view = "client-role"; // Update state
  // If roleData is provided, render the role
  if (roleData && el.clientRole) { // Assume el.clientRole is the custom element instance
    el.clientRole.setRole(roleData);
  } else if (el.clientRole) {
    el.clientRole.setRole(null); // Clear previous role if any
  }
  updateFooterVisibility();
  persistState();
}

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
  toggleLanguageMenu(false);
  updateFooterVisibility();
  persistState();
}

export function showSummary() {
  clearHandoffCountdown();
  renderSummaryList();
  updateNarratorUI();
  showView("summary");
  persistState();
}

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

export function startGame() {
  enforceRoleLimits();
  if (!updateDeckPreview()) return;

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specials = getSelectedSpecials();

  let allPlayerNames = [];

  // For online games (host mode), use ONLY the connected network players
  // The narrator (host) does NOT receive a card
  if (isHost()) {
    const connectedPeers = getConnectedPlayers(); // {id, name}
    allPlayerNames = connectedPeers.map(peer => peer.name);

    // Map peer IDs to player names for role distribution
    peerIdToPlayerName.clear();
    connectedPeers.forEach(peer => {
      peerIdToPlayerName.set(peer.id, peer.name);
    });
  } else if (isClient()) {
    // Client doesn't start the game, this shouldn't be called
    console.warn("Client cannot start the game");
    return;
  } else {
    // For local games, use custom names or player count from setup
    allPlayerNames = [...state.customNames];
  }

  if (!isHost() && !isClient()) {
    if (allPlayerNames.length > 0 && allPlayerNames.length !== playerTotal) {
      el.validationMessage.textContent = t("errors.playerCountMismatch", { count: playerTotal, current: allPlayerNames.length });
      return;
    }
  } else if (isHost()) {
    if (allPlayerNames.length < 5) {
      el.validationMessage.textContent = t("errors.minPlayers", { count: 5 });
      return;
    }
  }

  state.players = buildPlayerList(allPlayerNames.length > 0 ? allPlayerNames : playerTotal);


  state.deck = buildDeck({ playerTotal: state.players.length, wolfTotal, specials }); // Use actual number of players now
  state.revealIndex = 0;
  state.activeSpecialIds = Array.from(new Set(specials.map((item) => item.roleId)));
  state.mythStatus = detectMythStatusFromDeck(state.players, state.deck);

  state.eliminatedPlayers = [];
  state.narratorDay = 1;
  state.maxDays = state.activeSpecialIds.includes("bodyguard") ? null : Math.max(1, state.players.length);
  state.guideSteps = [];
  state.guideStepIndex = 0;
  state.victory = null;
  state.revealComplete = false;
  state.playerVotes = {};
  state.benvenutoPlayer = null;

  // --- Hybrid Reveal Logic ---
  const localRevealPlayers = [];
  const networkRevealPlayers = [];

  state.players.forEach((playerName, index) => {
    const card = state.deck[index];
    const localizedCard = {
      roleId: card.roleId,
      name: getRoleContent(card.roleId)?.name || card.name,
      team: card.team,
      teamLabel: getRoleContent(card.roleId)?.teamLabel || card.teamLabel,
      description: getRoleContent(card.roleId)?.description || card.description,
      image: card.image,
    };

    // Check if this player is a network player
    let isNetworkPlayer = false;
    if (isHost()) {
      for (const [peerId, name] of peerIdToPlayerName.entries()) {
        if (name === playerName) {
          networkRevealPlayers.push({ peerId, playerName, roleData: localizedCard });
          isNetworkPlayer = true;
          break;
        }
      }
    }

    if (!isNetworkPlayer) {
      localRevealPlayers.push({ playerName, index, roleData: localizedCard });
    }
  });

  // If hosting, send roles to network players first
  if (isHost()) {
    broadcast({ type: 'START_GAME', gameData: { playerNames: state.players } });
    networkRevealPlayers.forEach(({ peerId, roleData }) => {
      sendToPeer(peerId, { type: 'YOUR_ROLE', roleData });
    });
  }

  if (localRevealPlayers.length > 0) {
    // If there are local players, proceed with the traditional reveal flow
    // The `reveal.js` module will use `state.deck` and `state.players`
    // For `prepareReveal`, ensure it knows to only show *unrevealed* (local) players.
    // This part needs adjustment in reveal.js or an abstraction layer.
    prepareReveal(); // This will need to be smart enough to only show local players
    state.revealIndex = 0; // Reset reveal index for local players
    state.localPlayersToReveal = localRevealPlayers; // New state property
    showView("reveal");
  } else {
    // If all players are online or no players, skip reveal and go to summary
    state.revealComplete = true; // Mark as complete
    showSummary();
  }
  persistState();
}

export function resetGame({ preserveNames = true } = {}) {
  // Disconnect from network if connected
  if (isHost() || isClient()) {
    networkDisconnect();
    el.toastInfo(t("network.disconnected"));
  }

  const preservedPlayerCount = el.playerCount.value;
  const preservedWolfCount = el.wolfCount.value;

  clearHandoffCountdown();
  state.deck = [];
  state.players = [];
  state.revealIndex = 0;
  if (!preserveNames) state.customNames = [];
  state.activeSpecialIds = getSelectedSpecials().map((item) => item.roleId);
  state.eliminatedPlayers = [];
  state.narratorDay = 1;
  state.maxDays = 1;
  state.mythStatus = null;
  state.guideSteps = [];
  state.guideStepIndex = 0;
  state.victory = null;
  state.playersCollapsed = false;
  state.rolesDetailsOpen = false;
  state.guideExpanded = true;
  state.revealComplete = false;
  state.playerVotes = {};
  state.benvenutoPlayer = null;

  el.playerNameInput.value = "";
  el.playerCount.value = preservedPlayerCount || el.playerCount.min || String(MIN_PLAYERS);
  el.wolfCount.value = preservedWolfCount || el.wolfCount.min || "1";

  el.openSummaryBtn.classList.add("hidden");
  renderPlayerList();
  updateWolfHint();
  clampWolfCount();
  enforceRoleLimits();
  updateDeckPreview();
  el.handoffNotice.classList.add("hidden");
  showView("landing"); // Go to landing page to choose mode
}

export function confirmAction(message, onConfirm) {
  el.modalTitle.textContent = t("modal.title");
  el.modalMessage.textContent = message;
  el.modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const cleanup = () => {
    el.modalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
    el.modalCancel.removeEventListener("click", cancelHandler);
    el.modalConfirm.removeEventListener("click", confirmHandler);
  };
  const cancelHandler = () => cleanup();
  const confirmHandler = () => {
    cleanup();
    if (typeof onConfirm === "function") onConfirm();
  };
  el.modalCancel.addEventListener("click", cancelHandler);
  el.modalConfirm.addEventListener("click", confirmHandler);
}

export function openInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

export function closeInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

export function openPrivacyModal() {
  if (!el.privacyOverlay) return;
  el.privacyOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

export function closePrivacyModal() {
  if (!el.privacyOverlay) return;
  el.privacyOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// Mythomaniac Logic

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
  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
  persistState();
}

export function isMythActive() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName)
  );
}

export function mythRequiresAction() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName) &&
    state.narratorDay >= 2
  );
}

export function getMythResultText(status) {
  if (!status || !status.playerName) return "";
  const mythName = status.playerName;
  const target = status.targetName || t("myth.noTargets");
  if (status.outcome === "wolf") return t("myth.result.wolf", { name: mythName, target });
  if (status.outcome === "seer") return t("myth.result.seer", { name: mythName, target });
  return t("myth.result.human", { name: mythName, target });
}

export function hideMythUI() {
  if (el.mythPanel) el.mythPanel.classList.add("hidden");
  if (el.mythSummary) el.mythSummary.classList.add("hidden");
}

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

// Narrator Logic

export function updateNarratorUI({ preserveGuideStep = false } = {}) {
  el.dayCounter.textContent = String(state.narratorDay);
  const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
  const maxReached = hasCap && state.narratorDay >= state.maxDays;
  const mythBlocked = mythRequiresAction();
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
  renderMythPanel();
  persistState();
  updateEliminationSelect();
  evaluateVictoryConditions();
}

export function hasSpecial(roleId) {
  return state.activeSpecialIds.includes(roleId);
}

export function buildNarrationSteps(day) {
  const steps = [];
  steps.push(t("guide.step.closeEyes", { day }));
  if (hasSpecial("mason") && day === 1) steps.push(t("guide.step.masons"));
  if (hasSpecial("bodyguard") && day >= 2) steps.push(t("guide.step.bodyguard"));
  steps.push(t("guide.step.seer"));
  if (hasSpecial("medium") && day >= 2) steps.push(t("guide.step.medium"));
  if (hasSpecial("owl")) steps.push(t("guide.step.owl"));
  if (isMythActive() && day === 2) steps.push(t("guide.step.mythomaniac"));
  steps.push(t("guide.step.wolves"));
  if (hasSpecial("werehamster")) steps.push(t("guide.step.hamster"));
  steps.push(t("guide.step.dawn", { day }));
  if (hasSpecial("owl")) steps.push(t("guide.step.owlReveal"));
  if (hasSpecial("possessed")) steps.push(t("guide.step.possessed"));
  steps.push(t("guide.step.dayDiscuss", { day }));
  return steps;
}

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

export function toggleGuideMode() {
  state.guideExpanded = !state.guideExpanded;
  renderGuide();
  persistState();
}

export function changeGuideStep(delta) {
  if (!state.guideSteps.length) return;
  const nextIndex = state.guideStepIndex + delta;
  if (nextIndex < 0 || nextIndex >= state.guideSteps.length) return;
  state.guideStepIndex = nextIndex;
  renderGuide();
  persistState();
}

export function advanceDay() {
  if (state.victory) return;
  if (mythRequiresAction()) {
    renderMythPanel();
    if (el.mythResultMessage) el.mythResultMessage.textContent = t("myth.completeWarning");
    return;
  }
  const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
  if (hasCap && state.narratorDay >= state.maxDays) return;

  const nextDay = state.narratorDay + 1;
  confirmAction(
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
      renderSummaryList();
      updateNarratorUI();
    },
  );
}

// Summary and Elimination Logic

export function computeIndiziatoPlayers() {
  const votes = state.playerVotes;
  const candidates = [];
  const voteCounts = {};

  state.players.forEach((player) => {
    const isAlive = !state.eliminatedPlayers.some((e) => e.name === player);
    if (isAlive) {
      voteCounts[player] = votes[player] || 0;
    }
  });

  const sortedPlayers = Object.keys(voteCounts).sort((a, b) => voteCounts[b] - voteCounts[a]);
  if (sortedPlayers.length === 0) return [];

  if (voteCounts[sortedPlayers[0]] === 0) return [];

  candidates.push(sortedPlayers[0]);

  if (sortedPlayers.length > 1) {
    const firstScore = voteCounts[sortedPlayers[0]];
    const firstTies = sortedPlayers.filter((p) => voteCounts[p] === firstScore);

    if (firstTies.length >= 2) {
      const benIdx = state.benvenutoPlayer ? state.players.indexOf(state.benvenutoPlayer) : -1;
      firstTies.sort((a, b) => {
        const idxA = state.players.indexOf(a);
        const idxB = state.players.indexOf(b);
        if (benIdx === -1) return idxA - idxB;
        const benvenutoLeftIdx = (benIdx + 1) % state.players.length;
        const distA = (idxA - benvenutoLeftIdx + state.players.length) % state.players.length;
        const distB = (idxB - benvenutoLeftIdx + state.players.length) % state.players.length;
        return distA - distB;
      });
      return [firstTies[0], firstTies[1]].filter(Boolean);
    } else {
      const secondScore = voteCounts[sortedPlayers[1]];
      if (secondScore === 0) return candidates;

      const secondTies = sortedPlayers.filter((p) => voteCounts[p] === secondScore);

      if (secondTies.length === 1) {
        candidates.push(secondTies[0]);
      } else {
        const benIdx = state.benvenutoPlayer ? state.players.indexOf(state.benvenutoPlayer) : -1;
        secondTies.sort((a, b) => {
          const idxA = state.players.indexOf(a);
          const idxB = state.players.indexOf(b);
          if (benIdx === -1) return idxA - idxB;
          const benvenutoLeftIdx = (benIdx + 1) % state.players.length;
          const distA = (idxA - benvenutoLeftIdx + state.players.length) % state.players.length;
          const distB = (idxB - benvenutoLeftIdx + state.players.length) % state.players.length;
          return distA - distB;
        });
        candidates.push(secondTies[0]);
      }
    }
  }

  return candidates.slice(0, 2);
}

export function renderSummaryList() {
  const list = el.summaryList;
  if (!list) {
    renderFallenList();
    renderMythPanel();
    updateEliminationSelect();
    return;
  }

  if (el.livingDetails) {
    suppressLivingToggle = true;
    el.livingDetails.open = !state.playersCollapsed;
    suppressLivingToggle = false;
  }

  list.innerHTML = "";
  const winnerEntries = state.victory ? getVictorySurvivors() : null;
  const winnersSet = winnerEntries ? new Set(winnerEntries.map((entry) => entry.name)) : null;
  let renderedCount = 0;

  const indiziatoPlayers = computeIndiziatoPlayers();
  const frag = document.createDocumentFragment();

  state.players.forEach((player, index) => {
    if (winnersSet && !winnersSet.has(player)) return;

    const card = state.deck[index];
    const eliminationEntry = state.eliminatedPlayers.find((entry) => entry.name === player);
    const eliminated = Boolean(eliminationEntry);
    const isAlive = !eliminated;
    const isBenvenuto = player === state.benvenutoPlayer;
    const isIndiziato = indiziatoPlayers.includes(player);

    const listItem = document.createElement("li");
    listItem.className = "summary-item";
    if (eliminated) listItem.classList.add("eliminated");
    if (isBenvenuto) listItem.classList.add("benvenuto");

    if (card && card.image) {
      const localized = getRoleContent(card.roleId);
      const img = document.createElement("img");
      img.className = "summary-thumb";
      img.src = getRoleImage(card.roleId);
      img.alt = localized ? localized.name : "Role image";
      listItem.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "summary-info";

    const nameRow = document.createElement("div");
    nameRow.className = "summary-name-row";
    const name = document.createElement("span");
    name.className = "summary-name";
    name.textContent = player;
    nameRow.appendChild(name);
    info.appendChild(nameRow);

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "badge-container";

    if (isBenvenuto) {
      const benBadge = document.createElement("span");
      benBadge.className = "status-badge benvenuto-badge";
      benBadge.textContent = "🎭 " + t("status.benvenuto");
      benBadge.title = t("status.benvenuto");
      badgeContainer.appendChild(benBadge);
    }
    if (isIndiziato) {
      const indBadge = document.createElement("span");
      indBadge.className = "status-badge indiziato-badge";
      indBadge.textContent = "⚠️ " + t("status.indiziato");
      indBadge.title = t("status.indiziato");
      badgeContainer.appendChild(indBadge);
    }
    if (eliminated) {
      const ghostBadge = document.createElement("span");
      ghostBadge.className = "status-badge ghost-badge";
      ghostBadge.textContent = "👻 " + t("status.ghost");
      ghostBadge.title = t("status.ghostTooltip");
      badgeContainer.appendChild(ghostBadge);
    }
    listItem.appendChild(badgeContainer);

    const role = document.createElement("span");
    role.className = "summary-role";
    const roleText = card ? getRoleContent(card.roleId) : null;
    role.textContent = roleText ? roleText.name : "-";
    info.appendChild(role);

    if (isAlive) {
      const voteRow = document.createElement("div");
      voteRow.className = "vote-controls";
      const voteLabel = document.createElement("span");
      voteLabel.className = "vote-label";
      voteLabel.textContent = t("votes.label") + ":";

      const voteCount = document.createElement("span");
      voteCount.className = "vote-count";
      voteCount.textContent = String(state.playerVotes[player] || 0);

      const decrementBtn = document.createElement("button");
      decrementBtn.type = "button";
      decrementBtn.className = "vote-btn vote-decrement";
      decrementBtn.textContent = "−";
      decrementBtn.title = t("votes.decrement");
      decrementBtn.dataset.player = player;
      decrementBtn.dataset.action = "decrement";

      const incrementBtn = document.createElement("button");
      incrementBtn.type = "button";
      incrementBtn.className = "vote-btn vote-increment";
      incrementBtn.textContent = "+";
      incrementBtn.title = t("votes.increment");
      incrementBtn.dataset.player = player;
      incrementBtn.dataset.action = "increment";

      voteRow.append(voteLabel, decrementBtn, voteCount, incrementBtn);
      info.appendChild(voteRow);
    }

    listItem.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "summary-actions";

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "mini-action";
    actionBtn.dataset.player = player;

    const isWolfOrHamster = card && (card.team === "wolves" || card.roleId === "werehamster");

    if (eliminated) {
      if (eliminationEntry?.locked) {
        actionBtn.classList.add("revive");
        actionBtn.textContent = t("buttons.locked");
        actionBtn.disabled = true;
      } else {
        actionBtn.classList.add("revive");
        actionBtn.textContent = t("buttons.revive");
      }
    } else {
      if (isWolfOrHamster) {
        actionBtn.classList.add("remove");
        actionBtn.textContent = t("buttons.eliminate");
        actionBtn.disabled = true;
        actionBtn.style.opacity = "0.5";
      } else {
        actionBtn.classList.add("remove");
        actionBtn.textContent = t("buttons.eliminate");
      }
    }
    actions.appendChild(actionBtn);

    const alreadyLynchedThisTurn = state.eliminatedPlayers.some(
      (e) => e.type === 'lynched' && e.day === state.narratorDay && !e.locked
    );
    if (isAlive && !alreadyLynchedThisTurn) {
      const lynchBtn = document.createElement("button");
      lynchBtn.type = "button";
      lynchBtn.className = "mini-action lynch-btn";
      lynchBtn.dataset.player = player;
      lynchBtn.textContent = t("buttons.lynch");
      lynchBtn.title = t("buttons.lynch");
      actions.insertBefore(lynchBtn, actionBtn);
    }

    listItem.appendChild(actions);
    frag.appendChild(listItem);
    if (isAlive) renderedCount += 1;
  });

  list.appendChild(frag);

  if (renderedCount === 0) {
    const empty = document.createElement("li");
    empty.className = "help";
    empty.textContent = t("living.empty");
    list.appendChild(empty);
  }
  if (el.livingCount) el.livingCount.textContent = String(renderedCount);
  renderFallenList();
  renderMythPanel();
  updateEliminationSelect();
}

export function renderFallenList() {
  if (!el.fallenList || !el.fallenCount) return;
  const fallen = state.eliminatedPlayers;
  el.fallenCount.textContent = String(fallen.length);
  el.fallenList.innerHTML = "";
  if (!fallen.length) {
    const li = document.createElement("li");
    li.className = "fallen-empty";
    li.textContent = t("fallen.empty");
    el.fallenList.appendChild(li);
    return;
  }
  fallen.forEach((entry) => {
    const li = document.createElement("li");
    const pending = entry.locked ? "" : ` ${t("fallen.pending")}`;
    li.textContent = `${t("log.entry", {
      name: entry.name,
      day: entry.day ?? "?",
      role: getRoleNameFromEntry(entry),
    })} ${pending}`.trim();
    el.fallenList.appendChild(li);
  });
}

export function getRoleNameFromEntry(entry) {
  if (!entry) return t("log.unknownRole");
  if (entry.roleId) {
    const localized = getRoleContent(entry.roleId);
    if (localized?.name) return localized.name;
  }
  const index = state.players.findIndex((player) => player === entry.name);
  const fallbackCard = index >= 0 ? state.deck[index] : null;
  if (fallbackCard) {
    const localized = getRoleContent(fallbackCard.roleId);
    if (localized?.name) return localized.name;
  }
  return t("log.unknownRole");
}

export function lynchPlayer(player) {
  if (!player) return;

  confirmAction(t("confirmation.lynch", { player }), () => {
    const outcome = predictVictoryOnElimination(player);
    const doLynch = () => {
      if (!state.eliminatedPlayers.some((e) => e.name === player)) {
        state.eliminatedPlayers.push({
          name: player,
          locked: false,
          type: 'lynched',
          day: state.narratorDay
        });
      }
      state.benvenutoPlayer = player;
      state.playerVotes = {};
      renderSummaryList();
      persistState();
      evaluateVictoryConditions();
      // Notify eliminated player in online mode
      if (isHost()) {
        notifyPlayerEliminated(player);
      }
    };

    if (outcome) {
      const victoryText = getVictoryText(outcome.team);
      confirmAction(t("confirmation.eliminationVictory", { player, outcome: victoryText.title }), () => {
        doLynch();
      });
    } else {
      doLynch();
    }
  });
}

export function toggleElimination(player) {
  if (state.victory) return;
  if (!player) return;
  const index = state.eliminatedPlayers.findIndex((e) => e.name === player);
  if (index >= 0) {
    if (state.eliminatedPlayers[index].locked) return;
    state.eliminatedPlayers.splice(index, 1);

    if (state.benvenutoPlayer === player) {
      state.benvenutoPlayer = null;
    }
  } else {
    state.eliminatedPlayers.push({ name: player, locked: false, type: 'sbranato', day: state.narratorDay });
    // Notify eliminated player in online mode
    if (isHost()) {
      notifyPlayerEliminated(player);
    }
  }
  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
}

export function addEliminationEntry(name, type = "lynch") {
  const playerIndex = state.players.findIndex((player) => player === name);
  const roleId = playerIndex >= 0 && state.deck[playerIndex] ? state.deck[playerIndex].roleId : null;
  state.eliminatedPlayers.push({ name, roleId, day: state.narratorDay, locked: false, type });

  if (type === "lynch") {
    state.benvenutoPlayer = name;
  }

  // Notify eliminated player in online mode
  if (isHost()) {
    notifyPlayerEliminated(name);
  }

  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
}

export function updateEliminationSelect() {
  if (!el.eliminationSelect) return;
  const alivePlayers = getLivingPlayers();
  el.eliminationSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = alivePlayers.length ? t("elimination.placeholder") : t("elimination.none");
  placeholder.disabled = true;
  placeholder.selected = true;
  el.eliminationSelect.appendChild(placeholder);
  alivePlayers.forEach(({ name }) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    el.eliminationSelect.appendChild(option);
  });
  const disabled = alivePlayers.length === 0;
  el.eliminationSelect.disabled = disabled;
  if (el.eliminateBtn) el.eliminateBtn.disabled = disabled;
}

export function eliminateFromSelect() {
  if (!el.eliminationSelect) return;
  const name = el.eliminationSelect.value;
  if (!name || isEliminated(name)) return;
  promptElimination(name, {
    afterConfirm: () => {
      el.eliminationSelect.value = "";
    },
  });
}

export function promptElimination(name, { afterConfirm } = {}) {
  const proceed = () => {
    addEliminationEntry(name, "lynch");
    if (typeof afterConfirm === "function") afterConfirm();
  };
  const outcome = predictVictoryOnElimination(name);
  if (outcome) {
    const texts = getVictoryText(outcome.team);
    confirmAction(t("confirmation.eliminationVictory", { player: name, outcome: texts.title }), proceed);
  } else {
    confirmAction(t("confirmation.lynch", { player: name }), proceed);
  }
}

export function isEliminated(name) {
  return state.eliminatedPlayers.some((entry) => entry.name === name);
}

export function getLivingPlayers() {
  return state.players
    .map((name, index) => ({ name, card: state.deck[index] }))
    .filter((entry) => !isEliminated(entry.name));
}

// Victory Logic

export function predictVictoryOnElimination(name, isNightKill = false) {
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  eliminatedSet.add(name);
  return computeVictoryOutcomeFromSet(eliminatedSet, isNightKill);
}

export function computeVictoryOutcomeFromSet(eliminatedSet, isNightKill = false) {
  if (!state.deck.length || !state.players.length) return null;
  if (state.deck.length < state.players.length) return null;

  const living = state.players
    .map((name, index) => ({ name, card: state.deck[index] }))
    .filter((entry) => !eliminatedSet.has(entry.name));

  if (!living.length) return null;

  const wolves = living.filter((entry) => entry.card?.team === "wolves");
  const humans = living.filter((entry) => entry.card?.team === "humans");
  const hamsters = living.filter((entry) => entry.card?.roleId === "werehamster");

  if (hamsters.length && hamsters.length === living.length) {
    return { team: "loner", survivors: living };
  }

  if (!wolves.length) {
    if (hamsters.length) return { team: "loner", survivors: hamsters };
    return { team: "humans", survivors: living };
  }

  const unstoppableWolves = isNightKill && !hamsters.length && wolves.length > 0 && humans.length === wolves.length + 1 && humans.length > 1;
  if (unstoppableWolves) {
    return { team: "wolves", survivors: wolves };
  }
  if (wolves.length >= humans.length) {
    if (hamsters.length) return { team: "loner", survivors: hamsters };
    return { team: "wolves", survivors: living };
  }
  return null;
}

export function evaluateVictoryConditions() {
  if (state.victory) return;
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  const outcome = computeVictoryOutcomeFromSet(eliminatedSet, false);
  if (outcome) {
    showVictoryScreen(outcome);
  }
}

export function getVictorySurvivors() {
  if (!state.victory) return getLivingPlayers();
  if (state.victory.winners) {
    return state.victory.winners.map((entry) => ({
      name: entry.name,
      card: entry.card ? createCard(ROLE_LIBRARY[entry.card.roleId]) : null,
    }));
  }
  if (Array.isArray(state.victory.survivors)) {
    return state.victory.survivors.map((entry) => ({
      name: entry.name,
      card: entry.roleId ? createCard(ROLE_LIBRARY[entry.roleId]) : null,
    }));
  }
  return getLivingPlayers();
}

export function getVictoryText(team) {
  if (team === "wolves") {
    return { title: t("victory.wolves.title"), subtitle: t("victory.wolves.subtitle") };
  }
  if (team === "loner") {
    return { title: t("victory.hamster.title"), subtitle: t("victory.hamster.subtitle") };
  }
  return { title: t("victory.village.title"), subtitle: t("victory.village.subtitle") };
}

export function showVictoryScreen({ team }) {
  const allPlayers = state.players.map((name, index) => ({
    name,
    card: state.deck[index],
    eliminated: isEliminated(name)
  }));

  let winners = [];
  if (team === "wolves") {
    winners = allPlayers.filter(p => p.card.team === "wolves");
  } else if (team === "humans") {
    winners = allPlayers.filter(p => p.card.team === "humans");
  } else if (team === "loner") {
    winners = allPlayers.filter(p => p.card.roleId === "werehamster");
  }

  state.victory = {
    team,
    winners: winners.map((entry) => ({
      name: entry.name,
      roleId: entry.card?.roleId || null,
      card: entry.card,
      eliminated: entry.eliminated
    })),
  };

  const texts = getVictoryText(team);
  el.victoryTitle.textContent = texts.title;
  el.victorySubtitle.textContent = texts.subtitle;
  el.victoryList.innerHTML = "";

  state.victory.winners.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    if (entry.eliminated) li.classList.add("dead");

    if (entry.card && entry.card.image) {
      const localized = getRoleContent(entry.card.roleId);
      const img = document.createElement("img");
      img.className = "summary-thumb";
      img.src = getRoleImage(entry.card.roleId);
      img.alt = localized ? localized.name : "Role image";
      li.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "summary-info";
    const name = document.createElement("span");
    name.className = "summary-name";
    name.textContent = entry.name;
    const role = document.createElement("span");
    role.className = "summary-role";
    const localized = entry.card ? getRoleContent(entry.card.roleId) : null;
    role.textContent = localized ? localized.name : "-";
    info.append(name, role);
    li.appendChild(info);
    el.victoryList.appendChild(li);
  });
  showView("final");
}

export function renderVictoryFromState() {
  if (!state.victory) return;
  const winners = state.victory.winners || [];
  const texts = getVictoryText(state.victory.team);
  el.victoryTitle.textContent = texts.title;
  el.victorySubtitle.textContent = texts.subtitle;
  el.victoryList.innerHTML = "";

  winners.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    if (entry.eliminated) li.classList.add("dead");

    if (entry.card && entry.card.image) {
      const localized = getRoleContent(entry.card.roleId);
      const img = document.createElement("img");
      img.className = "summary-thumb";
      img.src = getRoleImage(entry.card.roleId);
      img.alt = localized ? localized.name : "Role image";
      li.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "summary-info";
    const name = document.createElement("span");
    name.className = "summary-name";
    name.textContent = entry.name;
    const role = document.createElement("span");
    role.className = "summary-role";
    const localized = entry.card ? getRoleContent(entry.card.roleId) : null;
    role.textContent = localized ? localized.name : "-";
    info.append(name, role);
    li.appendChild(info);
    el.victoryList.appendChild(li);
  });
}

// Helpers for UI

function toggleMainMenu(forceState) {
  if (!el.mainMenu || !el.menuBtn) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.mainMenu.classList.contains("hidden");
  el.mainMenu.classList.toggle("hidden", !shouldShow);
  el.mainMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.menuBtn.setAttribute("aria-expanded", String(shouldShow));
}

function toggleLanguageMenu(forceState) {
  if (!el.languageMenu || !el.languageToggle) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.languageMenu.classList.contains("hidden");
  el.languageMenu.classList.toggle("hidden", !shouldShow);
  el.languageMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.languageToggle.classList.toggle("active", shouldShow);
  el.languageToggle.setAttribute("aria-expanded", String(shouldShow));
}

export function openVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

export function closeVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}