/**
 * @fileoverview Victory conditions and victory screen display.
 * Extracted from engine.js for better modularity.
 */
import { state } from '../state.js';
import { el } from '../dom.js';
import { t, getRoleContent } from '../i18n.js';
import { ROLE_LIBRARY } from '../config.js';
import { createCard } from '../setup.js';
import { getRoleImage } from '../utils.js';
import { vibrate, PATTERNS } from '../haptics.js';

// Callback reference to avoid circular dependency
let _showView = null;
let _isEliminated = null;
let _getLivingPlayers = null;

/**
 * Registers callback functions from other modules to avoid circular imports.
 * @param {Object} callbacks - Object containing callback functions
 */
export function setVictoryCallbacks({ showView, isEliminated, getLivingPlayers }) {
    if (showView) _showView = showView;
    if (isEliminated) _isEliminated = isEliminated;
    if (getLivingPlayers) _getLivingPlayers = getLivingPlayers;
}

/**
 * Checks if a player is eliminated.
 * @param {string} name - Player name
 * @returns {boolean}
 */
function isEliminated(name) {
    if (_isEliminated) return _isEliminated(name);
    return state.eliminatedPlayers.some((entry) => entry.name === name);
}

/**
 * Gets living players.
 * @returns {Array}
 */
function getLivingPlayers() {
    if (_getLivingPlayers) return _getLivingPlayers();
    return state.players
        .map((name, index) => ({ name, card: state.deck[index] }))
        .filter((entry) => !isEliminated(entry.name));
}

/**
 * Predicts what victory outcome would occur if a player is eliminated.
 * @param {string} name - Player name to simulate eliminating
 * @param {boolean} isNightKill - Whether this is a night kill
 * @returns {Object|null} Victory outcome or null
 */
export function predictVictoryOnElimination(name, isNightKill = false) {
    const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
    eliminatedSet.add(name);
    return computeVictoryOutcomeFromSet(eliminatedSet, isNightKill);
}

/**
 * Computes victory outcome from a set of eliminated players.
 * @param {Set} eliminatedSet - Set of eliminated player names
 * @param {boolean} isNightKill - Whether this is a night kill
 * @returns {Object|null} Victory outcome or null
 */
export function computeVictoryOutcomeFromSet(eliminatedSet, isNightKill = false) {
    if (!state.deck.length || !state.players.length) return null;
    if (state.deck.length < state.players.length) return null;

    const living = state.players
        .map((name, index) => ({ name, card: state.deck[index] }))
        .filter((entry) => !eliminatedSet.has(entry.name));

    if (!living.length) return null;

    // Identify groups based on physical role for parity checks
    // "Wolf Pack": Players who wake up as wolves (Werewolf).
    const wolfPack = living.filter((entry) => entry.card?.roleId === "werewolf");
    // "Non-Wolves": Everyone else (Villagers, Seer, Possessed, Hamster, etc.)
    const nonWolves = living.filter((entry) => entry.card?.roleId !== "werewolf");

    // Special roles
    const hamsters = living.filter((entry) => entry.card?.roleId === "werehamster");

    // Case 1: Only hamsters left alive (Everyone else died)
    if (hamsters.length && hamsters.length === living.length) {
        return { team: "loner", survivors: living };
    }

    // Case 2: No wolves left (Village Wins)
    if (!wolfPack.length) {
        if (hamsters.length) return { team: "loner", survivors: hamsters };
        return { team: "humans", survivors: living };
    }

    // Case 3: "Unstoppable Wolves" (Early win condition)
    // If it's night kill, and Wolves are just 1 short of parity with Non-Wolves.
    // e.g. 2 Wolves, 3 Non-Wolves. Night Kill -> 2 vs 2 -> Wolves Win.
    // Hamster presence prevents guaranteed kill logic (could be targeted but is immune)
    const unstoppableWolves = isNightKill &&
        !hamsters.length &&
        wolfPack.length > 0 &&
        nonWolves.length === wolfPack.length + 1 &&
        nonWolves.length > 1;

    if (unstoppableWolves) {
        return { team: "wolves", survivors: wolfPack };
    }

    // Case 4: Wolves >= Non-Wolves (Wolves Win)
    if (wolfPack.length >= nonWolves.length) {
        if (hamsters.length) return { team: "loner", survivors: hamsters };
        return { team: "wolves", survivors: living };
    }
    return null;
}

/**
 * Evaluates current victory conditions and shows victory screen if met.
 */
export function evaluateVictoryConditions() {
    if (state.victory) return;
    const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
    const outcome = computeVictoryOutcomeFromSet(eliminatedSet, false);
    if (outcome) {
        showVictoryScreen(outcome);
    }
}

/**
 * Gets the survivors for victory display.
 * @returns {Array}
 */
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

/**
 * Gets victory text for a winning team.
 * @param {string} team - The winning team: 'wolves', 'humans', or 'loner'
 * @returns {Object} Object with title and subtitle
 */
export function getVictoryText(team) {
    if (team === "wolves") {
        return { title: t("victory.wolves.title"), subtitle: t("victory.wolves.subtitle") };
    }
    if (team === "loner") {
        return { title: t("victory.hamster.title"), subtitle: t("victory.hamster.subtitle") };
    }
    return { title: t("victory.village.title"), subtitle: t("victory.village.subtitle") };
}

/**
 * Shows the victory screen for a winning team.
 * @param {Object} outcome - Object with team and optionally survivors
 */
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

    vibrate(PATTERNS.VICTORY);

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

    if (_showView) _showView("final");
}

/**
 * Renders victory screen from persisted state.
 */
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
