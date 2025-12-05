import { el } from './dom.js';
import { state } from './state.js';
import { ROLE_LIBRARY, MIN_PLAYERS, OPTIONAL_CONFIG } from './config.js';
import { t, getRoleContent } from './i18n.js';
import { createCard, deckFromRoleIds } from './roles.js';
import { persistState } from './store.js';
import { shuffle, getRoleImage } from './utils.js';

// Game Setup Logic

export function renderRoleOptions() {
  if (!el.roleOptions) return;
  el.roleOptions.innerHTML = "";
  OPTIONAL_CONFIG.forEach((config) => {
    const role = ROLE_LIBRARY[config.roleId];
    if (!role) return;
    const localized = getRoleContent(role.id);

    const item = document.createElement("label");
    item.className = "option-item";
    item.dataset.team = role.team;

    // Set role image as background
    item.style.backgroundImage = `url('${getRoleImage(role.id)}')`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = role.id;
    checkbox.dataset.copies = String(config.copies);
    checkbox.dataset.minPlayers = String(config.minPlayers);
    checkbox.className = "role-option";

    const title = document.createElement("div");
    title.className = "option-title";
    title.append(checkbox);

    const name = document.createElement("span");
    name.className = "option-name";
    name.textContent = localized.name;
    title.append(name);

    const tag = document.createElement("span");
    tag.className = `tag ${role.team}`;
    tag.textContent = localized.teamLabel;
    title.append(tag);

    const subtitle = document.createElement("p");
    subtitle.className = "help role-subtitle";
    subtitle.textContent = t("roles.availableFrom", { count: config.minPlayers });

    const description = document.createElement("p");
    description.className = "help option-desc";
    description.textContent = localized.description;
    if (config.noteKey) {
      const note = document.createElement("span");
      note.textContent = ` ${t(config.noteKey)}`;
      description.appendChild(note);
    }

    item.append(title, subtitle, description);
    el.roleOptions.appendChild(item);
  });
  enforceRoleLimits();
}

export function recommendWolves(playerTotal) {
  if (playerTotal < 8) return 1;
  if (playerTotal < 16) return 2;
  return 3;
}

export function updateWolfHint() {
  if (!el.playerCount || !el.wolfHint) return;
  const playerTotal = Number(el.playerCount.value) || 0;
  const recommended = recommendWolves(playerTotal);
  el.wolfHint.textContent = t("setup.wolfHint", { count: recommended });
}

export function autoAdjustWolvesFromPlayers() {
  if (!el.playerCount || !el.wolfCount) return;
  const playerTotal = Number(el.playerCount.value) || 0;
  if (playerTotal <= 0) return;
  const recommended = recommendWolves(playerTotal);
  const limit = Math.max(1, playerTotal - 1);
  const adjusted = Math.max(1, Math.min(recommended, limit));
  el.wolfCount.value = String(adjusted);
}

export function adjustNumberInput(input, delta) {
  const min = Number(input.min) || Number.NEGATIVE_INFINITY;
  const max = Number(input.max) || Number.POSITIVE_INFINITY;
  let value = Number(input.value) || 0;
  value += delta;
  value = Math.min(max, Math.max(min, value));
  input.value = String(value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function clampWolfCount() {
  if (!el.playerCount || !el.wolfCount) return;
  const playerTotal = Number(el.playerCount.value) || 0;
  let wolves = Number(el.wolfCount.value) || 1;
  if (wolves < 1) wolves = 1;
  if (playerTotal > 0) {
    wolves = Math.min(wolves, Math.max(1, playerTotal - 1));
  }
  el.wolfCount.value = String(wolves);
}

export function enforceRoleLimits() {
  if (!el.roleOptions) return; // Removed el.playerCount as it's not needed for unlocking
  const inputs = el.roleOptions.querySelectorAll("input[type='checkbox']");
  inputs.forEach((input) => {
    const optionItem = input.closest(".option-item");
    input.disabled = false; // Always enable the input
    if (optionItem) optionItem.classList.remove("option-disabled"); // Always remove the disabled styling
    // Removed: input.checked = false; to prevent unchecking roles
  });
}

export function getSelectedSpecials() {
  if (!el.roleOptions) return [];
  return Array.from(el.roleOptions.querySelectorAll("input:checked")).map((input) => ({
    roleId: input.value,
    copies: Number(input.dataset.copies || "1"),
  }));
}

export function updateDeckPreview() {
  if (!el.playerCount || !el.wolfCount || !el.validationMessage) return true;
  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specialTotal = getSelectedSpecials().reduce((sum, item) => sum + item.copies, 0);
  const selected = wolfTotal + 1 + specialTotal;
  const remaining = playerTotal - selected;
  let message = "";
  if (playerTotal < MIN_PLAYERS) message = t("errors.minPlayers", { count: MIN_PLAYERS });
  else if (wolfTotal < 1) message = t("errors.needWolf");
  else if (wolfTotal >= playerTotal) message = t("errors.tooManyWolves");
  else if (remaining < 0) message = t("errors.tooManySpecials");

  el.validationMessage.textContent = message;
  return message === "";
}

export function updateRoleSummary() {
  if (!el.roleSummary || !el.roleSummaryContent || !el.playerCount || !el.wolfCount) return;

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specialsSelected = getSelectedSpecials();

  if (playerTotal < MIN_PLAYERS) {
    el.roleSummary.classList.add("hidden");
    return;
  }

  const roleCounts = {};

  if (wolfTotal > 0) {
    const wolfRole = getRoleContent("werewolf");
    roleCounts[wolfRole.name] = wolfTotal;
  }

  const seerRole = getRoleContent("seer");
  roleCounts[seerRole.name] = 1;

  // Count special roles and track village-helping specials
  let villageSpecialCount = 0;
  specialsSelected.forEach((special) => {
    const roleContent = getRoleContent(special.roleId);
    roleCounts[roleContent.name] = (roleCounts[roleContent.name] || 0) + special.copies;
    // Count specials that help the village (not possessed/werehamster)
    const role = ROLE_LIBRARY[special.roleId];
    if (role && role.team === 'humans') {
      villageSpecialCount += special.copies;
    }
  });

  const specialTotal = wolfTotal + 1 + specialsSelected.reduce((sum, item) => sum + item.copies, 0);
  const villagerCount = playerTotal - specialTotal;
  if (villagerCount > 0) {
    const villagerRole = getRoleContent("villager");
    roleCounts[villagerRole.name] = (roleCounts[villagerRole.name] || 0) + villagerCount;
  }

  el.roleSummaryContent.innerHTML = "";
  Object.entries(roleCounts).forEach(([roleName, count]) => {
    const item = document.createElement("span");
    item.className = "role-summary-item";
    item.textContent = t("setup.rolesInDeck", { count, role: roleName });
    el.roleSummaryContent.appendChild(item);
  });

  // Update balance badge
  if (el.balanceBadge) {
    const balance = calculateBalance(wolfTotal, villageSpecialCount + 1, playerTotal); // +1 for seer
    el.balanceBadge.textContent = t(`balance.${balance}`);
    el.balanceBadge.className = `balance-badge balance-${balance}`;
  }

  el.roleSummary.classList.remove("hidden");
}

/**
 * Calculates the balance of the current role composition.
 * @param {number} wolfCount - Number of wolves
 * @param {number} villageSpecialCount - Number of village-helping specials (including seer)
 * @param {number} playerTotal - Total number of players
 * @returns {'wolves' | 'village' | 'balanced'} Balance indicator
 */
export function calculateBalance(wolfCount, villageSpecialCount, playerTotal) {
  if (playerTotal <= 0) return 'balanced';

  const wolfRatio = wolfCount / playerTotal;

  // Wolves win when they equal or outnumber village
  // More specials help village detect/protect
  if (wolfRatio > 0.30) return 'wolves';      // > 30% wolves favors wolves
  if (wolfRatio < 0.15) return 'village';     // < 15% wolves favors village
  if (villageSpecialCount >= wolfCount * 2.5) return 'village';  // Many village specials
  return 'balanced';
}

export function handleAddPlayer() {
  if (!el.playerNameInput) return;
  const name = el.playerNameInput.value.trim();
  if (!name) return;
  state.customNames.push(name);
  el.playerNameInput.value = "";
  renderPlayerList();
  persistState();
}

// Re-export these for engine.js
export { createCard, deckFromRoleIds };

export function buildPlayerList(playerCountOrNames) {
  const players = [];
  if (Array.isArray(playerCountOrNames)) {
    // If an array of names is provided, use them directly
    playerCountOrNames.forEach(name => players.push(name));
  } else {
    // If a number (total players) is provided, use customNames and generate defaults
    const playerTotal = playerCountOrNames;
    for (let i = 0; i < playerTotal; i += 1) {
      players.push(state.customNames[i] || t("status.defaultPlayer", { number: i + 1 }));
    }
  }
  return players;
}

export function buildDeck({ playerTotal, wolfTotal, specials }) {
  const deck = [];
  for (let i = 0; i < wolfTotal; i += 1) deck.push(createCard(ROLE_LIBRARY.werewolf));
  deck.push(createCard(ROLE_LIBRARY.seer));

  specials.forEach((special) => {
    const role = ROLE_LIBRARY[special.roleId];
    if (!role) return;
    for (let count = 0; count < special.copies; count += 1) {
      deck.push(createCard(role));
    }
  });

  while (deck.length < playerTotal) deck.push(createCard(ROLE_LIBRARY.villager));
  return shuffle(deck);
}

// Drag and Drop Logic - Enhanced with insertion indicators

let draggedItem = null;
let draggedIndex = null;
let touchCurrentItem = null;
let dropIndicator = null;
let insertionIndex = null;

/**
 * Generate a deterministic color from a string (player name)
 */
function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

/**
 * Get initials from a player name (up to 2 characters)
 */
function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Create or get the drop indicator element
 */
function getDropIndicator() {
  if (!dropIndicator) {
    dropIndicator = document.createElement('div');
    dropIndicator.className = 'drop-indicator';
  }
  return dropIndicator;
}

/**
 * Remove the drop indicator from the DOM
 */
function removeDropIndicator() {
  if (dropIndicator && dropIndicator.parentNode) {
    dropIndicator.parentNode.removeChild(dropIndicator);
  }
  insertionIndex = null;
}

/**
 * Calculate insertion index based on cursor position relative to chips
 */
function calculateInsertionIndex(clientY, list) {
  const chips = Array.from(list.querySelectorAll('.player-chip:not(.dragging)'));
  if (chips.length === 0) return 0;

  for (let i = 0; i < chips.length; i++) {
    const rect = chips[i].getBoundingClientRect();
    const midY = rect.top + rect.height / 2;

    if (clientY < midY) {
      return Number(chips[i].dataset.index);
    }
  }

  // If past all chips, insert at end
  return state.customNames.length;
}

/**
 * Position the drop indicator at the calculated insertion point
 */
function positionDropIndicator(clientY, list) {
  const indicator = getDropIndicator();
  const chips = Array.from(list.querySelectorAll('.player-chip:not(.dragging)'));

  if (chips.length === 0) {
    removeDropIndicator();
    return;
  }

  insertionIndex = calculateInsertionIndex(clientY, list);

  // Don't show indicator if dropping at the same position
  if (insertionIndex === draggedIndex || insertionIndex === draggedIndex + 1) {
    removeDropIndicator();
    return;
  }

  // Find the reference chip to position the indicator
  let referenceChip = null;
  let position = 'before';

  for (const chip of chips) {
    const chipIndex = Number(chip.dataset.index);
    if (chipIndex >= insertionIndex) {
      referenceChip = chip;
      break;
    }
  }

  if (!referenceChip && chips.length > 0) {
    referenceChip = chips[chips.length - 1];
    position = 'after';
  }

  if (referenceChip) {
    const rect = referenceChip.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();

    indicator.style.width = `${rect.width}px`;
    indicator.style.left = `${rect.left - listRect.left}px`;

    if (position === 'before') {
      indicator.style.top = `${rect.top - listRect.top - 6}px`;
    } else {
      indicator.style.top = `${rect.bottom - listRect.top + 2}px`;
    }

    if (!indicator.parentNode) {
      list.appendChild(indicator);
    }
  }
}

function handleDragStart(event) {
  draggedItem = event.currentTarget;
  draggedIndex = Number(draggedItem.dataset.index);
  draggedItem.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedIndex.toString());

  // Use a timeout to set drag image after the drag has started
  requestAnimationFrame(() => {
    draggedItem.style.opacity = '0.4';
  });
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const list = el.playerList;
  if (list) {
    positionDropIndicator(event.clientY, list);
  }

  return false;
}

function handleDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  if (insertionIndex !== null && insertionIndex !== draggedIndex && insertionIndex !== draggedIndex + 1) {
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    // Adjust insertion index if we removed before the insertion point
    const adjustedIndex = insertionIndex > draggedIndex ? insertionIndex - 1 : insertionIndex;
    state.customNames.splice(adjustedIndex, 0, draggedName);
    renderPlayerList();
    persistState();
  }

  removeDropIndicator();
  return false;
}

function handleDragEnd(event) {
  const target = event.currentTarget;
  target.classList.remove("dragging");
  target.style.opacity = '';
  removeDropIndicator();
  draggedItem = null;
  draggedIndex = null;
}

function handleDragEnter(event) {
  // No longer highlighting individual chips
}

function handleDragLeave(event) {
  // Check if we're leaving the list entirely
  const list = el.playerList;
  if (list && !list.contains(event.relatedTarget)) {
    removeDropIndicator();
  }
}

function handleTouchStart(event) {
  touchCurrentItem = event.currentTarget;
  draggedItem = touchCurrentItem;
  draggedIndex = Number(touchCurrentItem.dataset.index);
  touchCurrentItem.classList.add("dragging");
}

function handleTouchMove(event) {
  if (!touchCurrentItem) return;
  event.preventDefault();

  const touch = event.touches[0];
  const list = el.playerList;

  if (list) {
    positionDropIndicator(touch.clientY, list);
  }
}

function handleTouchEnd(event) {
  if (!touchCurrentItem) return;

  touchCurrentItem.classList.remove("dragging");

  if (insertionIndex !== null && insertionIndex !== draggedIndex && insertionIndex !== draggedIndex + 1) {
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    const adjustedIndex = insertionIndex > draggedIndex ? insertionIndex - 1 : insertionIndex;
    state.customNames.splice(adjustedIndex, 0, draggedName);
    renderPlayerList();
    persistState();
  }

  removeDropIndicator();
  touchCurrentItem = null;
  draggedItem = null;
  draggedIndex = null;
}

export function renderPlayerList() {
  const list = el.playerList;
  if (!list) return;
  list.innerHTML = "";

  const frag = document.createDocumentFragment();

  state.customNames.forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "player-chip";
    item.draggable = true;
    item.dataset.index = String(index);

    // Avatar with initials
    const avatar = document.createElement("span");
    avatar.className = "player-avatar";
    avatar.textContent = getInitials(name);
    avatar.style.background = getAvatarColor(name);
    item.appendChild(avatar);

    // Player name
    const nameSpan = document.createElement("span");
    nameSpan.className = "player-name";
    nameSpan.textContent = name;
    item.appendChild(nameSpan);

    // Action buttons
    const actions = document.createElement("div");
    actions.className = "chip-actions";
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-remove";
    removeButton.dataset.index = String(index);
    removeButton.setAttribute("aria-label", t("accessibility.removePlayer", { name }));
    removeButton.textContent = "×";
    actions.appendChild(removeButton);
    item.appendChild(actions);
    frag.appendChild(item);

    // Drag events
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);

    // Touch events
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);
  });

  list.appendChild(frag);

  const isEmpty = state.customNames.length === 0;
  if (el.clearPlayersBtn) el.clearPlayersBtn.classList.toggle("hidden", isEmpty);
  if (el.reorderHint) el.reorderHint.classList.toggle("hidden", isEmpty);
}