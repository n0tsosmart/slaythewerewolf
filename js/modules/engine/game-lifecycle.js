/**
 * @fileoverview Game lifecycle - starting and resetting games.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { t, getRoleContent } from '../i18n.js';
import { MIN_PLAYERS } from '../config.js';
import {
    getSelectedSpecials,
    buildPlayerList,
    buildDeck,
    updateWolfHint,
    clampWolfCount,
    enforceRoleLimits,
    updateDeckPreview,
    renderPlayerList
} from '../setup.js';
import { prepareReveal, clearHandoffCountdown } from '../reveal.js';
import { detectMythStatusFromDeck } from '../logic.js';
import { resetTimerPlaceholder } from '../timer.js';
import {
    isClient,
    isHost,
    getConnectedPlayers,
    broadcast,
    sendToPeer,
    disconnect as networkDisconnect
} from '../network.js';

// Map to store peerId to playerName for easy lookup when distributing roles
const peerIdToPlayerName = new Map();

// Callback references to avoid circular dependencies
let _showView = null;
let _showSummary = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setGameLifecycleCallbacks({ showView, showSummary }) {
    if (showView) _showView = showView;
    if (showSummary) _showSummary = showSummary;
}

/**
 * Starts a new game with current configuration.
 */
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
        prepareReveal();
        state.revealIndex = 0;
        state.localPlayersToReveal = localRevealPlayers;
        if (_showView) _showView("reveal");
    } else {
        // If all players are online or no players, skip reveal and go to summary
        state.revealComplete = true;
        if (_showSummary) _showSummary();
    }
    persistState();
}

/**
 * Resets the game to initial state.
 * @param {Object} options - Options object
 * @param {boolean} options.preserveNames - Whether to preserve custom player names
 */
export function resetGame({ preserveNames = true } = {}) {
    // Disconnect from network if connected
    if (isHost() || isClient()) {
        networkDisconnect();
        el.toastInfo(t("network.disconnected"));
    }

    const preservedPlayerCount = el.playerCount.value;
    const preservedWolfCount = el.wolfCount.value;

    clearHandoffCountdown();
    resetTimerPlaceholder(); // Reset timer on new match
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
    if (_showView) _showView("landing");
}

/**
 * Gets the peerIdToPlayerName map for external use.
 * @returns {Map}
 */
export function getPeerIdToPlayerNameMap() {
    return peerIdToPlayerName;
}
