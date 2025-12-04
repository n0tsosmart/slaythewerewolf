// DOM Element References
// Using getters to allow lazy retrieval of elements, which is essential when using Web Components
// or when elements are not present in the DOM at initial load time.

export const el = {
  // Main Views
  get landingView() { return document.getElementById("landingView"); }, // New
  get setupView() { return document.getElementById("setupView"); },
  get revealView() { return document.getElementById("revealView"); },
  get summaryView() { return document.getElementById("summaryView"); },
  get finalView() { return document.getElementById("finalView"); },
  get lobbyView() { return document.getElementById("lobbyView"); },
  get viewLobby() { return document.querySelector("view-lobby"); }, // Custom element
  get clientRoleView() { return document.getElementById("clientRoleView"); },
  get clientRole() { return document.querySelector("view-client-role"); },

  // Landing View Elements
  get localGameBtn() { return document.getElementById("localGameBtn"); },
  get onlineGameBtn() { return document.getElementById("onlineGameBtn"); },

  // Lobby View Elements
  get lobbyMainMenu() { return document.getElementById("lobbyMainMenu"); },
  get lobbyHost() { return document.getElementById("lobbyHost"); },
  get lobbyClient() { return document.getElementById("lobbyClient"); },
  get hostGameBtn() { return document.getElementById("hostGameBtn"); },
  get joinGameBtn() { return document.getElementById("joinGameBtn"); },
  get startNetworkGameBtn() { return document.getElementById("startNetworkGameBtn"); },
  get cancelHostBtn() { return document.getElementById("cancelHostBtn"); },
  get leaveGameBtn() { return document.getElementById("leaveGameBtn"); },
  get joinRoomCodeInput() { return document.getElementById("joinRoomCodeInput"); },
  get joinPlayerNameInput() { return document.getElementById("joinPlayerNameInput"); },
  get hostRoomCodeDisplay() { return document.getElementById("hostRoomCodeDisplay"); },
  get hostPlayerList() { return document.getElementById("hostPlayerList"); },
  get clientPlayerNameDisplay() { return document.getElementById("clientPlayerNameDisplay"); },
  get backToLandingBtn() { return document.getElementById("backToLandingBtn"); },

  // Client Role View Elements
  get clientRoleImage() { return document.getElementById("clientRoleImage"); },
  get clientRoleTeam() { return document.getElementById("clientRoleTeam"); },
  get clientRoleName() { return document.getElementById("clientRoleName"); },
  get clientRoleDescription() { return document.getElementById("clientRoleDescription"); },
  get returnToLobbyBtn() { return document.getElementById("returnToLobbyBtn"); },
  get clientRoleCard() { return document.getElementById("clientRoleCard"); },

  // Setup View Elements
  get rolesDetails() { return document.getElementById("rolesDetails"); },
  get setupForm() { return document.getElementById("setupForm"); },
  get playerCount() { return document.getElementById("playerCount"); },
  get wolfCount() { return document.getElementById("wolfCount"); },
  get wolfHint() { return document.getElementById("wolfHint"); },
  get playerNameInput() { return document.getElementById("playerNameInput"); },
  get addPlayerBtn() { return document.getElementById("addPlayerBtn"); },
  get playerList() { return document.getElementById("playerList"); },
  get reorderHint() { return document.getElementById("reorderHint"); },
  get clearPlayersBtn() { return document.getElementById("clearPlayersBtn"); },
  get validationMessage() { return document.getElementById("validationMessage"); },
  get roleOptions() { return document.getElementById("roleOptions"); },
  get roleSummary() { return document.getElementById("roleSummary"); },
  get roleSummaryContent() { return document.getElementById("roleSummaryContent"); },
  get balanceBadge() { return document.getElementById("balanceBadge"); },
  get hapticsToggle() { return document.getElementById("hapticsToggle"); },
  get backToLandingFromSetup() { return document.getElementById("backToLandingFromSetup"); },

  // Reveal View Elements
  get revealBtn() { return document.getElementById("revealBtn"); },
  get hideBtn() { return document.getElementById("hideBtn"); },
  get roleCard() { return document.getElementById("roleCard"); },
  get roleImage() { return document.getElementById("roleImage"); },
  get handoffNotice() { return document.getElementById("handoffNotice"); },
  get handoffTimer() { return document.getElementById("handoffTimer"); },
  get revealStatus() { return document.getElementById("revealStatus"); },
  get roleTeam() { return document.getElementById("roleTeam"); },
  get roleName() { return document.getElementById("roleName"); },
  get roleDescription() { return document.getElementById("roleDescription"); },
  get playerProgress() { return document.getElementById("playerProgress"); },
  get currentPlayerLabel() { return document.getElementById("currentPlayerLabel"); },

  // Summary View Elements
  get summaryList() { return document.getElementById("summaryList"); },
  get livingDetails() { return document.getElementById("livingDetails"); },
  get livingCount() { return document.getElementById("livingCount"); },
  get fallenDetails() { return document.getElementById("fallenDetails"); },
  get fallenList() { return document.getElementById("fallenList"); },
  get fallenCount() { return document.getElementById("fallenCount"); },
  get mythPanel() { return document.getElementById("mythPanel"); },
  get mythStatusTag() { return document.getElementById("mythStatusTag"); },
  get mythPlayerLabel() { return document.getElementById("mythPlayerLabel"); },
  get mythInstructions() { return document.getElementById("mythInstructions"); },
  get mythTargetSelect() { return document.getElementById("mythTargetSelect"); },
  get mythConfirmBtn() { return document.getElementById("mythConfirmBtn"); },
  get mythResultMessage() { return document.getElementById("mythResultMessage"); },
  get mythSummary() { return document.getElementById("mythSummary"); },
  get mythSummaryText() { return document.getElementById("mythSummaryText"); },
  get dayCounter() { return document.getElementById("dayCounter"); },
  get nextDayBtn() { return document.getElementById("nextDayBtn"); },
  get guideProgress() { return document.getElementById("guideProgress"); },
  get guideStepText() { return document.getElementById("guideStepText"); },
  get guideFullList() { return document.getElementById("guideFullList"); },
  get guideNav() { return document.getElementById("guideNav"); },
  get toggleGuideMode() { return document.getElementById("toggleGuideMode"); },
  get prevGuideStep() { return document.getElementById("prevGuideStep"); },
  get nextGuideStep() { return document.getElementById("nextGuideStep"); },
  get eliminationSelect() { return document.getElementById("eliminationSelect"); },
  get eliminateBtn() { return document.getElementById("eliminateBtn"); },

  // Global UI Elements
  get infoFooter() { return document.getElementById("infoFooter"); },
  get restartBtn() { return document.getElementById("restartBtn"); },
  get openSummaryBtn() { return document.getElementById("openSummaryBtn"); },
  get modalOverlay() { return document.getElementById("modalOverlay"); },
  get modalTitle() { return document.getElementById("modalTitle"); },
  get modalMessage() { return document.getElementById("modalMessage"); },
  get modalCancel() { return document.getElementById("modalCancel"); },
  get modalConfirm() { return document.getElementById("modalConfirm"); },
  get languageSelect() { return document.getElementById("languageSelect"); },
  get languageToggle() { return document.getElementById("languageToggle"); },
  get languageFlag() { return document.getElementById("languageFlag"); },
  get languageMenu() { return document.getElementById("languageMenu"); },
  get languageButtons() { return document.querySelectorAll("[data-lang-button]"); },
  get languagePicker() { return document.querySelector(".language-picker"); },
  get infoButton() { return document.getElementById("infoButton"); },
  get infoOverlay() { return document.getElementById("infoOverlay"); },
  get infoClose() { return document.getElementById("infoClose"); },
  get menuBtn() { return document.getElementById("menuBtn"); },
  get mainMenu() { return document.getElementById("mainMenu"); },
  get menuVotingBtn() { return document.getElementById("menuVotingBtn"); },
  get menuImmersionBtn() { return document.getElementById("menuImmersionBtn"); },
  get menuFeedbackLink() { return document.getElementById("menuFeedbackLink"); },
  get menuDonateLink() { return document.getElementById("menuDonateLink"); },
  get votingOverlay() { return document.getElementById("votingOverlay"); },
  get votingClose() { return document.getElementById("votingClose"); },
  get privacyBtn() { return document.getElementById("privacyBtn"); },
  get privacyOverlay() { return document.getElementById("privacyOverlay"); },
  get privacyClose() { return document.getElementById("privacyClose"); },

  // Final View Elements
  get victoryTitle() { return document.getElementById("victoryTitle"); },
  get victorySubtitle() { return document.getElementById("victorySubtitle"); },
  get victoryList() { return document.getElementById("victoryList"); },
  get finalNewGameBtn() { return document.getElementById("finalNewGameBtn"); },

  // --- Toast Notifications ---
  get toastContainer() { return document.getElementById("toastContainer"); },

  toast(message, type = 'info', duration = 3000) {
    const container = el.toastContainer;
    if (!container) {
      console.warn("Toast container not found.");
      return;
    }

    const toastElement = document.createElement('div');
    toastElement.className = `toast toast-${type}`;
    toastElement.textContent = message;

    container.appendChild(toastElement);

    // Force reflow to enable transition
    void toastElement.offsetWidth;
    toastElement.classList.add('show');

    setTimeout(() => {
      toastElement.classList.remove('show');
      toastElement.addEventListener('transitionend', () => {
        toastElement.remove();
      }, { once: true });
    }, duration);
  },

  toastInfo(message, duration) {
    el.toast(message, 'info', duration);
  },

  toastError(message, duration = 5000) {
    el.toast(message, 'error', duration);
  },

  toastWarning(message, duration = 4000) {
    el.toast(message, 'warning', duration);
  },
};