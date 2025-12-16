import { state } from './state.js';
import { persistState } from './store.js';
import { el } from './dom.js';
import { t, getRoleContent } from './i18n.js';
import { scrollToBottom, getRoleImage } from './utils.js';
import { vibrate, PATTERNS } from './haptics.js';

let handoffTimerId = null;

export function prepareReveal() {
  if (!state.deck.length) return;
  clearHandoffCountdown();
  state.revealComplete = false;
  if (el.revealStatus) el.revealStatus.classList.remove("hidden");
  if (el.roleCard) el.roleCard.classList.remove("hidden");
  el.revealBtn.classList.remove("hidden");
  el.hideBtn.classList.add("hidden");
  el.openSummaryBtn.classList.add("hidden");
  el.roleImage.classList.add("hidden");
  el.roleImage.removeAttribute("src");
  el.roleCard.classList.remove("with-image");
  el.handoffNotice.classList.add("hidden");

  const total = state.players.length;
  const current = state.revealIndex + 1;
  el.playerProgress.textContent = t("status.player", { current, total });
  el.currentPlayerLabel.textContent = state.players[state.revealIndex];

  el.roleCard.dataset.team = "unknown";
  el.roleCard.classList.add("can-reveal");
  el.roleTeam.textContent = t("reveal.hiddenTeam");
  el.roleName.textContent = t("reveal.tap");
  el.roleDescription.textContent = t("reveal.prompt");
}

export function revealCard() {
  const card = state.deck[state.revealIndex];
  if (!card) return;
  vibrate(PATTERNS.REVEAL);
  el.roleCard.classList.remove("can-reveal");
  const roleText = getRoleContent(card.roleId);
  el.roleCard.dataset.team = card.team;
  el.roleTeam.textContent = roleText.teamLabel;
  el.roleName.textContent = roleText.name;
  el.roleDescription.textContent = roleText.description;
  if (card.image) {
    el.roleImage.src = getRoleImage(card.roleId);
    el.roleImage.alt = roleText ? roleText.name : "Role";
    el.roleImage.classList.remove("hidden");
    el.roleCard.classList.add("with-image");
  } else {
    el.roleImage.classList.add("hidden");
    el.roleCard.classList.remove("with-image");
  }
  el.revealBtn.classList.add("hidden");
  el.hideBtn.classList.remove("hidden");
  scrollToBottom("reveal");
}

export function nextPlayer() {
  if (state.revealIndex < state.players.length - 1) {
    state.revealIndex += 1;
    prepareReveal();
    persistState();
  } else {
    showCompletionState();
    persistState();
  }
  scrollToBottom("reveal");
}

export function showCompletionState() {
  state.revealComplete = true;
  el.roleCard.dataset.team = "humans";
  el.roleCard.classList.remove("can-reveal");
  el.roleTeam.textContent = "";
  el.roleName.textContent = "";
  el.roleDescription.textContent = "";
  el.playerProgress.textContent = "";
  el.currentPlayerLabel.textContent = "";
  el.roleImage.classList.add("hidden");
  el.roleImage.removeAttribute("src");
  el.roleCard.classList.remove("with-image");

  if (el.roleCard) el.roleCard.classList.add("hidden");
  if (el.revealStatus) el.revealStatus.classList.add("hidden");
  el.handoffNotice.classList.remove("hidden");
  el.revealBtn.classList.add("hidden");
  el.hideBtn.classList.add("hidden");
  el.openSummaryBtn.classList.remove("hidden");
  startHandoffCountdown(5);
  scrollToBottom("reveal");
}

export function startHandoffCountdown(seconds = 5) {
  clearHandoffCountdown();
  state.handoffCountdown = Math.max(0, seconds);
  updateHandoffTimer();
  if (state.handoffCountdown <= 0) return;
  handoffTimerId = setInterval(() => {
    state.handoffCountdown -= 1;
    if (state.handoffCountdown <= 0) {
      clearHandoffCountdown();
    } else {
      updateHandoffTimer();
    }
  }, 1000);
}

export function clearHandoffCountdown() {
  if (handoffTimerId) {
    clearInterval(handoffTimerId);
    handoffTimerId = null;
  }
  if (state.handoffCountdown !== 0) {
    state.handoffCountdown = 0;
  }
  updateHandoffTimer();
}

export function updateHandoffTimer() {
  if (!el.handoffTimer || !el.openSummaryBtn) return;
  if (state.handoffCountdown > 0) {
    el.handoffTimer.textContent = t("handoffNotice.timer", { seconds: state.handoffCountdown });
    el.handoffTimer.classList.remove("hidden");
    el.openSummaryBtn.disabled = true;
  } else {
    el.handoffTimer.textContent = "";
    el.handoffTimer.classList.add("hidden");
    el.openSummaryBtn.disabled = false;
  }
}
