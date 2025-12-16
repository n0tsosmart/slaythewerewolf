/**
 * @fileoverview Player elimination logic - summary list, fallen list, lynching.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { persistState } from '../store.js';
import { el } from '../dom.js';
import { t, getRoleContent } from '../i18n.js';
import { isImmuneToWolves } from '../logic.js';
import { getRoleImage } from '../utils.js';
import { vibrate, PATTERNS } from '../haptics.js';
import { isHost, notifyPlayerEliminated, notifyPlayerRevived, notifyPlayerStatus } from '../network.js';

// Callback references to avoid circular dependencies
let _confirmAction = null;
let _renderMythPanel = null;
let _updateNarratorUI = null;
let _evaluateVictoryConditions = null;
let _predictVictoryOnElimination = null;
let _getVictoryText = null;
let _getVictorySurvivors = null;

// Internal variable for living toggle suppression
let suppressLivingToggle = false;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setEliminationCallbacks({
    confirmAction,
    renderMythPanel,
    updateNarratorUI,
    evaluateVictoryConditions,
    predictVictoryOnElimination,
    getVictoryText,
    getVictorySurvivors
}) {
    if (confirmAction) _confirmAction = confirmAction;
    if (renderMythPanel) _renderMythPanel = renderMythPanel;
    if (updateNarratorUI) _updateNarratorUI = updateNarratorUI;
    if (evaluateVictoryConditions) _evaluateVictoryConditions = evaluateVictoryConditions;
    if (predictVictoryOnElimination) _predictVictoryOnElimination = predictVictoryOnElimination;
    if (getVictoryText) _getVictoryText = getVictoryText;
    if (getVictorySurvivors) _getVictorySurvivors = getVictorySurvivors;
}

/**
 * Checks if a player is eliminated.
 * @param {string} name - Player name
 * @returns {boolean}
 */
export function isEliminated(name) {
    return state.eliminatedPlayers.some((entry) => entry.name === name);
}

/**
 * Gets all living players with their cards.
 * @returns {Array<{name: string, card: Object}>}
 */
export function getLivingPlayers() {
    return state.players
        .map((name, index) => ({ name, card: state.deck[index] }))
        .filter((entry) => !isEliminated(entry.name));
}

/**
 * Computes the two indiziato (suspect) players based on vote counts.
 * @returns {Array<string>} Array of 0-2 player names
 */
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

/**
 * Gets role name from an elimination entry.
 * @param {Object} entry - Elimination entry
 * @returns {string}
 */
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

/**
 * Renders the fallen players list.
 */
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

/**
 * Renders the summary list of all players.
 */
export function renderSummaryList() {
    const list = el.summaryList;
    if (!list) {
        renderFallenList();
        if (_renderMythPanel) _renderMythPanel();
        updateEliminationSelect();
        return;
    }

    if (el.livingDetails) {
        suppressLivingToggle = true;
        el.livingDetails.open = !state.playersCollapsed;
        suppressLivingToggle = false;
    }

    list.innerHTML = "";
    const winnerEntries = state.victory && _getVictorySurvivors ? _getVictorySurvivors() : null;
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

        // Only werehamster is immune to wolf attacks, not possessed
        const isWerehamster = isImmuneToWolves(card);

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
            // We allow clicking but will warn in toggleElimination if immune
            actionBtn.classList.add("remove");
            actionBtn.textContent = t("buttons.eliminate");
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

        // Add discover button for werehamster (seer can discover and kill them)
        if (isAlive && isWerehamster) {
            const discoverBtn = document.createElement("button");
            discoverBtn.type = "button";
            discoverBtn.className = "mini-action discover-btn";
            discoverBtn.dataset.player = player;
            discoverBtn.textContent = t("buttons.discover");
            discoverBtn.title = t("buttons.discover");
            actions.insertBefore(discoverBtn, actionBtn);
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
    if (_renderMythPanel) _renderMythPanel();
    updateEliminationSelect();

    // Broadcast status updates to online players
    if (isHost()) {
        broadcastPlayerStatuses(indiziatoPlayers);
    }
}

/**
 * Broadcasts suspect and welcome status to online players
 */
function broadcastPlayerStatuses(indiziatoPlayers) {
    state.players.forEach((player) => {
        const isBenvenuto = player === state.benvenutoPlayer;
        const isIndiziato = indiziatoPlayers.includes(player);
        const eliminationEntry = state.eliminatedPlayers.find((entry) => entry.name === player);
        const isEliminated = Boolean(eliminationEntry);

        // Only send status if player has a status
        if (isBenvenuto || isIndiziato) {
            notifyPlayerStatus(player, {
                isBenvenuto,
                isIndiziato,
                isEliminated
            });
        } else if (!isEliminated) {
            // Clear status for players without status
            notifyPlayerStatus(player, {
                isBenvenuto: false,
                isIndiziato: false,
                isEliminated: false
            });
        }
    });
}

/**
 * Lynches a player (eliminates via voting).
 * @param {string} player - Player name to lynch
 */
export function lynchPlayer(player) {
    if (!player) return;

    const confirmFn = _confirmAction || ((msg, cb) => cb());

    confirmFn(t("confirmation.lynch", { player }), () => {
        const outcome = _predictVictoryOnElimination ? _predictVictoryOnElimination(player) : null;
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
            vibrate(PATTERNS.ELIMINATION);
            renderSummaryList();
            persistState();
            if (_evaluateVictoryConditions) _evaluateVictoryConditions();
            // Notify eliminated player in online mode
            if (isHost()) {
                notifyPlayerEliminated(player);
            }
        };

        if (outcome && _getVictoryText) {
            const victoryText = _getVictoryText(outcome.team);
            confirmFn(t("confirmation.eliminationVictory", { player, outcome: victoryText.title }), () => {
                doLynch();
            });
        } else {
            doLynch();
        }
    });
}

/**
 * Toggles elimination status of a player (for night kills).
 * @param {string} player - Player name
 */
export function toggleElimination(player) {
    if (state.victory) return;
    if (!player) return;
    const index = state.eliminatedPlayers.findIndex((e) => e.name === player);

    const updateUI = () => {
        renderSummaryList();
        if (_updateNarratorUI) _updateNarratorUI({ preserveGuideStep: true });
    };

    if (index >= 0) {
        if (state.eliminatedPlayers[index].locked) return;
        state.eliminatedPlayers.splice(index, 1);

        if (state.benvenutoPlayer === player) {
            state.benvenutoPlayer = null;
        }

        // Notify revived player in online mode
        if (isHost()) {
            notifyPlayerRevived(player);
        }
        updateUI();
    } else {
        const performElimination = () => {
            state.eliminatedPlayers.push({ name: player, locked: false, type: 'sbranato', day: state.narratorDay });
            // Notify eliminated player in online mode
            if (isHost()) {
                notifyPlayerEliminated(player);
            }
            vibrate(PATTERNS.ELIMINATION);
            updateUI();
        };

        const playerIndex = state.players.indexOf(player);
        const card = playerIndex >= 0 ? state.deck[playerIndex] : null;

        if (isImmuneToWolves(card)) {
            const confirmFn = _confirmAction || ((msg, cb) => cb());
            confirmFn(t("confirmation.immune", { player }), performElimination);
        } else {
            performElimination();
        }
    }
}

/**
 * Adds an elimination entry for a player.
 * @param {string} name - Player name
 * @param {string} type - Type of elimination: 'lynch' or 'sbranato'
 */
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
    if (_updateNarratorUI) _updateNarratorUI({ preserveGuideStep: true });
}

/**
 * Updates the elimination dropdown select.
 */
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

/**
 * Eliminates a player selected from the dropdown.
 */
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

/**
 * Prompts for elimination confirmation.
 * @param {string} name - Player name
 * @param {Object} options - Options object with afterConfirm callback
 */
export function promptElimination(name, { afterConfirm } = {}) {
    const proceed = () => {
        addEliminationEntry(name, "lynch");
        if (typeof afterConfirm === "function") afterConfirm();
    };
    const outcome = _predictVictoryOnElimination ? _predictVictoryOnElimination(name) : null;
    const confirmFn = _confirmAction || ((msg, cb) => cb());

    if (outcome && _getVictoryText) {
        const texts = _getVictoryText(outcome.team);
        confirmFn(t("confirmation.eliminationVictory", { player: name, outcome: texts.title }), proceed);
    } else {
        confirmFn(t("confirmation.lynch", { player: name }), proceed);
    }
}

/**
 * Gets the suppressLivingToggle flag for external use.
 * @returns {boolean}
 */
export function getSuppressLivingToggle() {
    return suppressLivingToggle;
}

/**
 * Sets the suppressLivingToggle flag.
 * @param {boolean} value
 */
export function setSuppressLivingToggle(value) {
    suppressLivingToggle = value;
}
