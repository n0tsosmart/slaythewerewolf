import { state } from './state.js';
import { el } from './dom.js';
import { STORAGE_KEY, ROLE_LIBRARY, MIN_PLAYERS, DEFAULT_LANGUAGE } from './config.js';
import { createCard, deckFromRoleIds } from './roles.js';
import { normalizeMythStatus } from './logic.js';

export function persistState() {
  if (typeof localStorage === "undefined") return;
  try {
    const payload = {
      view: state.view,
      players: state.players,
      customNames: state.customNames,
      revealIndex: state.revealIndex,
      narratorDay: state.narratorDay,
      maxDays: state.maxDays,
      eliminatedPlayers: state.eliminatedPlayers,
      activeSpecialIds: state.activeSpecialIds,
      victory: state.victory,
      revealComplete: state.revealComplete,
      deckRoleIds: state.deck.map((card) => card.roleId),
      assignments: state.players.map((name, index) => ({
        name,
        roleId: state.deck[index]?.roleId || null,
      })),
      guideStepIndex: state.guideStepIndex,
      playersCollapsed: state.playersCollapsed,
      rolesDetailsOpen: state.rolesDetailsOpen,
      guideExpanded: state.guideExpanded,
      mythStatus: state.mythStatus,
      playerCount: el.playerCount ? el.playerCount.value : null,
      wolfCount: el.wolfCount ? el.wolfCount.value : null,
      selectedSpecialIds: el.roleOptions ? Array.from(el.roleOptions.querySelectorAll(".role-option:checked")).map(
        (input) => input.value,
      ) : [],
      language: state.language,
      playerVotes: state.playerVotes,
      benvenutoPlayer: state.benvenutoPlayer,
      assignedRole: state.assignedRole,
      connectionStatus: state.connectionStatus,
      hapticsEnabled: state.hapticsEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Unable to save the game state", error);
  }
}

export function restoreFromStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.playerCount && el.playerCount) el.playerCount.value = data.playerCount;
    if (data.wolfCount && el.wolfCount) el.wolfCount.value = data.wolfCount;
    if (Array.isArray(data.selectedSpecialIds) && el.roleOptions) {
      el.roleOptions.querySelectorAll(".role-option").forEach((input) => {
        input.checked = data.selectedSpecialIds.includes(input.value);
      });
    }

    state.customNames = Array.isArray(data.customNames) ? [...data.customNames] : [];

    const assignments = Array.isArray(data.assignments) ? data.assignments : null;
    if (assignments && assignments.length) {
      const fallbackPlayers = Array.isArray(data.players) ? data.players : [];
      state.players = assignments.map((entry, index) => entry?.name ?? fallbackPlayers[index] ?? "");
      state.deck = assignments.map((entry) => {
        if (entry && entry.roleId) {
          return createCard(ROLE_LIBRARY[entry.roleId] || ROLE_LIBRARY.villager);
        }
        return createCard(ROLE_LIBRARY.villager);
      });
    } else {
      state.players = Array.isArray(data.players) ? data.players : [];
      state.deck = deckFromRoleIds(data.deckRoleIds);
    }

    state.revealIndex = Math.min(data.revealIndex || 0, Math.max(state.players.length - 1, 0));
    state.revealComplete = Boolean(data.revealComplete);
    state.narratorDay = data.narratorDay || 1;
    state.eliminatedPlayers = Array.isArray(data.eliminatedPlayers) ? data.eliminatedPlayers : [];
    state.activeSpecialIds = Array.isArray(data.activeSpecialIds) ? data.activeSpecialIds : [];

    if (state.activeSpecialIds.includes("bodyguard")) state.maxDays = null;
    else if (data.maxDays === null) state.maxDays = null;
    else if (typeof data.maxDays === "number" && Number.isFinite(data.maxDays)) state.maxDays = data.maxDays;
    else state.maxDays = Math.max(1, state.players.length || 1);

    state.mythStatus = normalizeMythStatus(data.mythStatus, state.players, state.deck);

    state.victory = data.victory || null;
    state.guideStepIndex = data.guideStepIndex || 0;
    state.playersCollapsed = Boolean(data.playersCollapsed);
    state.rolesDetailsOpen = false;
    state.guideExpanded = data.guideExpanded !== undefined ? Boolean(data.guideExpanded) : true;
    state.view = data.view || "setup";
    if (state.view === "handoff") {
      state.view = "reveal";
      state.revealComplete = true;
    }
    state.language = data.language || DEFAULT_LANGUAGE;
    state.playerVotes = data.playerVotes || {};
    state.benvenutoPlayer = data.benvenutoPlayer || null;
    state.connectionStatus = data.connectionStatus || 'disconnected';
    state.hapticsEnabled = data.hapticsEnabled !== undefined ? Boolean(data.hapticsEnabled) : true;

  } catch (error) {
    console.warn("Unable to restore the game state", error);
  }
}