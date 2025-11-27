/**
 * @fileoverview
 * This file contains the main application logic for the "Slay the Werewolf" game.
 * It manages UI interactions, game state, player and role management,
 * narration flow, and victory conditions.
 */

// ==========================================================================
// UI/UX ENHANCEMENTS (Mobile-First)
// ==========================================================================

/**
 * Handles smooth page loading animation.
 * Fades in the body content after DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = `opacity ${PAGE_FADE_DURATION / 1000}s ease`;
    document.body.style.opacity = '1';
  });
});

/**
 * Implements a ripple effect on button clicks.
 * Also provides haptic feedback on mobile devices.
 */
document.addEventListener('click', (e) => {
  const button = e.target.closest('button, .btn, [role="button"]');

  // Early returns for performance
  if (!button || button.disabled) return;
  if (!button.contains(e.target)) return;

  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.5s ease-out;
        z-index: 0;
      `;

  button.style.position = button.style.position || 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), RIPPLE_DURATION);

  // Haptic feedback on mobile
  if ('vibrate' in navigator && window.matchMedia('(max-width: 768px)').matches) {
    navigator.vibrate(HAPTIC_VIBRATION_DURATION);
  }
});

/**
 * Provides smooth scrolling for anchor links within the page.
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/**
 * Displays a toast notification with a given message.
 * @param {string} message - The message to display.
 * @param {number} [duration=TOAST_DURATION] - How long the toast should be visible in milliseconds.
 */
window.showToast = (message, duration = TOAST_DURATION) => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 12px 20px;
        background: rgba(185, 28, 28, 0.95);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 10000;
        font-family: var(--font-body);
        font-size: 14px;
        max-width: 90%;
        text-align: center;
        transition: transform 0.3s ease;
      `;

  document.body.appendChild(toast);

  // Slide in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Slide out and remove
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

/**
 * Adds a shake animation for invalid form inputs.
 */
document.querySelectorAll('input, select, textarea').forEach(input => {
  input.addEventListener('invalid', (e) => {
    e.preventDefault();
    input.style.animation = `shake ${ANIMATION_SHAKE_DURATION / 1000}s ease`;
    setTimeout(() => input.style.animation = '', ANIMATION_SHAKE_DURATION);
  });
});

/**
 * Debounce utility function to limit how often a function can run.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
window.debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ==========================================================================
// END UI/UX ENHANCEMENTS
// ==========================================================================


// ==========================================================================
// CONSTANTS & CONFIGURATION
// ==========================================================================

const MIN_PLAYERS = 5;

// UI/UX Timing Constants
const TOAST_DURATION = 2500;
const RIPPLE_DURATION = 500;
const HAPTIC_VIBRATION_DURATION = 8;
const ANIMATION_SHAKE_DURATION = 300;
const PAGE_FADE_DURATION = 400;

/**
 * Defines the library of all available roles in the game.
 * Each role includes properties like ID, name, team, image, and description,
 * along with localized translations.
 */
const ROLE_LIBRARY = {
  werewolf: {
    id: "werewolf",
    name: "Werewolf",
    team: "wolves",
    teamLabel: "Werewolves",
    image: "assets/cards/lupo.jpg",
    description: "Each night the wolves open their eyes together and pick a victim. They win when the pack is as numerous as the villagers.",
    locales: {
      es: {
        name: "Hombre Lobo",
        teamLabel: "Licántropos",
        description: "Cada noche los lobos abren los ojos juntos y eligen una víctima. Ganáis cuando la manada iguala o supera a los aldeanos.",
      },
      it: {
        name: "Lupo Mannaro",
        teamLabel: "Lupi Mannari",
        description: "Ogni notte i lupi aprono gli occhi insieme e scelgono una vittima. Vincete quando il branco uguaglia o supera i villici.",
      },
    },
  },
  villager: {
    id: "villager",
    name: "Villager",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/villico.jpg",
    description: "No special power: discuss, observe, and vote to expose the wolves. You win when no werewolves remain.",
    locales: {
      es: {
        name: "Aldeano",
        teamLabel: "Aldea",
        description: "Sin poderes especiales: observa, debate y vota para desenmascarar a los lobos. Ganas cuando no quedan licántropos.",
      },
      it: {
        name: "Villico",
        teamLabel: "Villaggio",
        description: "Nessun potere speciale: discuti, osserva e vota per smascherare i lupi. Vinci quando non restano lupi mannari.",
      },
    },
  },
  seer: {
    id: "seer",
    name: "Seer",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/veggente.jpg",
    description: "Each night you point at a player and learn whether they are wolf/hamster or human. Share information carefully.",
    locales: {
      es: {
        name: "Vidente",
        teamLabel: "Aldea",
        description: "Cada noche señala a un jugador y descubre si es lobo/criceto o humano. Comparte la información con cuidado.",
      },
      it: {
        name: "Veggente",
        teamLabel: "Villaggio",
        description: "Ogni notte indichi un giocatore e scopri se è lupo/criceto o umano. Condividi le informazioni con cautela.",
      },
    },
  },
  medium: {
    id: "medium",
    name: "Medium",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/medium.jpg",
    description: "From the second night on, learn whether the player lynched the previous day was a werewolf.",
    locales: {
      es: {
        name: "Médium",
        teamLabel: "Aldea",
        description: "Desde la segunda noche averiguas si el jugador linchado el día anterior era un hombre lobo.",
      },
      it: {
        name: "Medium",
        teamLabel: "Villaggio",
        description: "Dalla seconda notte scopri se il giocatore linciato il giorno precedente era un lupo mannaro.",
      },
    },
  },
  possessed: {
    id: "possessed",
    name: "Possessed",
    team: "wolves",
    teamLabel: "Ally of the Wolves",
    image: "assets/cards/indemoniato.jpg",
    description: "You are human but secretly root for the wolves without knowing who they are. Win only if the wolves dominate.",
    locales: {
      es: {
        name: "Endemoniado",
        teamLabel: "Aliado de los Lobos",
        description: "Eres humano pero apoyas en secreto a los lobos sin saber quiénes son. Solo ganas si los lobos vencen al pueblo.",
      },
      it: {
        name: "Indemoniato",
        teamLabel: "Alleato dei Lupi",
        description: "Sei umano ma tifi segretamente per i lupi senza sapere chi siano. Vinci solo se il branco domina il villaggio.",
      },
    },
  },
  bodyguard: {
    id: "bodyguard",
    name: "Bodyguard",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/guardia.jpg",
    description: "Each night before the wolves attack you protect one player. If targeted, they survive.",
    locales: {
      es: {
        name: "Guardián",
        teamLabel: "Aldea",
        description: "Cada noche, antes del ataque de los lobos, proteges a un jugador. Si lo atacan, sobrevive.",
      },
      it: {
        name: "Guardia del Corpo",
        teamLabel: "Villaggio",
        description: "Ogni notte, prima dell'attacco dei lupi, proteggi un giocatore. Se viene colpito, sopravvive.",
      },
    },
  },
  owl: {
    id: "owl",
    name: "Owl",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/gufo.jpg",
    description: "Each night you mark a suspect. That player is automatically nominated and with 20+ players dies if they are not Wolf/Hamster.",
    locales: {
      es: {
        name: "Búho",
        teamLabel: "Aldea",
        description: "Cada noche marcas a un sospechoso. Ese jugador queda nominado y con 20+ jugadores muere si no es Lobo/Criceto.",
      },
      it: {
        name: "Gufo",
        teamLabel: "Villaggio",
        description: "Ogni notte marchi un sospetto. Quel giocatore è automaticamente nominato e con 20+ giocatori muore se non è Lupo/Criceto.",
      },
    },
  },
  mason: {
    id: "mason",
    name: "Mason",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/massone.jpg",
    description: "Always in pairs: on the first night you open your eyes and recognize each other as allies.",
    locales: {
      es: {
        name: "Masón",
        teamLabel: "Aldea",
        description: "Siempre en pareja: la primera noche abrís los ojos y os reconocéis como aliados contra los lobos.",
      },
      it: {
        name: "Massone",
        teamLabel: "Villaggio",
        description: "Sempre in coppia: la prima notte aprite gli occhi e vi riconoscete come alleati contro i lupi.",
      },
    },
  },
  werehamster: {
    id: "werehamster",
    name: "Werehamster",
    team: "loner",
    teamLabel: "Loner",
    image: "assets/cards/criceto.jpg",
    description: "You only want to survive. Immune to wolf attacks but the Seer kills you if they look at you. Win alone if you live to the end.",
    locales: {
      es: {
        name: "Hámster Licántropo",
        teamLabel: "Solitaria",
        description: "Solo quieres sobrevivir. Eres inmune a los lobos pero mueres si el Vidente te ve. Ganas en solitario si sigues vivo al final.",
      },
      it: {
        name: "Criceto Mannaro",
        teamLabel: "Solitario",
        description: "Vuoi solo sopravvivere. Sei immune ai lupi mannari ma il Veggente ti elimina se ti osserva. Vinci da solo se resti in vita fino alla fine.",
      },
    },
  },
  mythomaniac: {
    id: "mythomaniac",
    name: "Mythomaniac",
    team: "humans",
    teamLabel: "Village",
    image: "assets/cards/mitomane.jpg",
    description: "At the end of the second night choose a player: if they are a Wolf you become one, if they are the Seer you inherit the power, otherwise you remain human.",
    locales: {
      es: {
        name: "Mitómano",
        teamLabel: "Aldea",
        description: "Al final de la segunda noche elige a un jugador: si es Lobo te conviertes en uno, si es Vidente heredas su poder, de lo contrario sigues como humano.",
      },
      it: {
        name: "Mitomane",
        teamLabel: "Villaggio",
        description: "Alla fine della seconda notte scegli un giocatore: se è un Lupo lo diventi, se è il Veggente erediti il suo potere, altrimenti rimani umano.",
      },
    },
  },
};

/**
 * Configuration for optional special roles, including their copies and minimum player count to be available.
 */
const OPTIONAL_CONFIG = [
  { roleId: "medium", copies: 1, minPlayers: 9 },
  { roleId: "possessed", copies: 1, minPlayers: 10 },
  { roleId: "bodyguard", copies: 1, minPlayers: 11 },
  { roleId: "owl", copies: 1, minPlayers: 12 },
  { roleId: "mason", copies: 2, minPlayers: 13, noteKey: "roles.masonNote" },
  { roleId: "werehamster", copies: 1, minPlayers: 15 },
  { roleId: "mythomaniac", copies: 1, minPlayers: 16 },
];

const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "SLAY_STATE"; // Key for localStorage persistence

// ==========================================================================
// TRANSLATION & LANGUAGE FUNCTIONS
// ==========================================================================

/**
 * Formats a translation template string by replacing placeholders with provided variables.
 * @param {string} template - The template string (e.g., "Hello {name}").
 * @param {object} [vars={}] - An object of variables to substitute (e.g., { name: "World" }).
 * @returns {string} The formatted string.
 */
function formatString(template, vars = {}) {
  return template.replace(/\{(.*?)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`));
}

/**
 * Translates a given key into the current language, with fallback to default language and then the key itself.
 * Supports variable substitution.
 * @param {string} key - The translation key.
 * @param {object} [vars] - Variables for string formatting.
 * @returns {string} The translated string.
 */
function t(key, vars) {
  const langPack = TRANSLATIONS[state.language] || TRANSLATIONS[DEFAULT_LANGUAGE];
  const fallback = TRANSLATIONS[DEFAULT_LANGUAGE][key];
  const template = langPack[key] ?? fallback ?? key; // Use provided key as ultimate fallback
  return vars ? formatString(template, vars) : template;
}

/**
 * Applies translations to all elements in the DOM that have `data-i18n` or `data-i18n-placeholder` attributes.
 */
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) element.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key) element.placeholder = t(key);
  });
}

/**
 * Sets the application's language, updates UI, and persists the choice.
 * @param {string} lang - The language code (e.g., 'en', 'es', 'it').
 * @param {object} [options] - Options to skip persistence or rendering.
 * @param {boolean} [options.skipPersist=false] - If true, language choice is not saved to localStorage.
 * @param {boolean} [options.skipRender=false] - If true, UI rendering is skipped.
 */
function setLanguage(lang, { skipPersist = false, skipRender = false } = {}) {
  state.language = TRANSLATIONS[lang] ? lang : DEFAULT_LANGUAGE;
  if (el.languageSelect) el.languageSelect.value = state.language; // For a native select, if used
  updateLanguageButtons(); // Update active state for language buttons
  if (typeof document !== "undefined") {
    document.documentElement.lang = state.language; // Set HTML lang attribute
  }
  // Re-render role options and enforce limits based on new language descriptions
  const selectedRoles = getSelectedSpecials().map((item) => item.roleId);
  renderRoleOptions();
  if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen; // Maintain details panel state
  selectedRoles.forEach((roleId) => {
    const input = el.roleOptions.querySelector(`.role-option[value="${roleId}"]`);
    if (input) input.checked = true; // Re-check previously selected roles
  });
  enforceRoleLimits(); // Re-enforce limits with potentially new player count due to UI adjustments
  applyTranslations(); // Apply new translations to UI text
  renderPlayerList(); // Re-render player list (accessibility labels might change)
  updateHandoffTimer(); // Update handoff timer message
  if (!skipRender) {
    updateWolfHint();
    renderSummaryList();
    if (state.view === "summary") {
      updateNarratorUI({ preserveGuideStep: true });
    }
    if (state.view === "reveal") {
      if (el.hideBtn && !el.hideBtn.classList.contains("hidden")) {
        revealCard(); // Re-reveal current card in new language
      } else {
        prepareReveal(); // Re-prepare reveal in new language
      }
    }
    if (state.view === "final" && state.victory) renderVictoryFromState();
  }
  updateRoleSummary(); // Update role summary in new language
  if (!skipPersist) persistState(); // Save language preference
}

/**
 * Retrieves localized content for a given role ID.
 * Falls back to default English content if locale-specific content is not found.
 * @param {string} roleId - The ID of the role.
 * @returns {object} An object containing the localized name, team label, and description.
 */
function getRoleContent(roleId) {
  const base = ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager;
  const locale = base.locales?.[state.language] || {};
  return {
    name: locale.name || base.name,
    teamLabel: locale.teamLabel || base.teamLabel,
    description: locale.description || base.description,
  };
}

// ==========================================================================
// STATE MANAGEMENT & PERSISTENCE
// ==========================================================================

/**
 * The main application state object.
 * Holds all dynamic data related to the game's current status.
 */
const state = {
  deck: [], // Array of role cards
  players: [], // Array of player names
  revealIndex: 0, // Current index in the deck being revealed
  revealComplete: false, // Flag if all cards have been revealed
  customNames: [], // User-defined player names
  activeSpecialIds: [], // IDs of currently selected special roles
  narratorDay: 1, // Current day in the game
  maxDays: 1, // Max days (relevant for bodyguard role)
  eliminatedPlayers: [], // List of eliminated players
  guideSteps: [], // Current narration guide steps
  guideStepIndex: 0, // Current step in the narration guide
  victory: null, // Stores victory state once game ends
  playersCollapsed: false, // UI state for player list summary
  rolesDetailsOpen: false, // UI state for roles details panel
  guideExpanded: true, // UI state for narration guide display mode
  language: DEFAULT_LANGUAGE, // Current language
  view: "setup", // Current view/screen (setup, reveal, summary, final)
  mythStatus: null, // Status object for the Mythomaniac role
  handoffCountdown: 0, // Countdown for narrator handoff
  playerVotes: {},  // Stores votes for players during lynching phase: { playerName: voteCount }
  benvenutoPlayer: null,  // Name of the most recently lynched player (important for tie-breaking)
};

let suppressLivingToggle = false; // Internal flag to prevent infinite loops with UI toggles
let handoffTimerId = null; // Timer ID for handoff countdown

/**
 * Stores the current game state into localStorage.
 * Skips saving if localStorage is not available or if in development mode.
 */
function persistState() {
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
      deckRoleIds: state.deck.map((card) => card.roleId), // Store only role IDs for deck
      assignments: state.players.map((name, index) => ({ // Store player-role assignments
        name,
        roleId: state.deck[index]?.roleId || null,
      })),
      guideStepIndex: state.guideStepIndex,
      playersCollapsed: state.playersCollapsed,
      rolesDetailsOpen: state.rolesDetailsOpen,
      guideExpanded: state.guideExpanded,
      mythStatus: state.mythStatus,
      playerCount: el.playerCount.value,
      wolfCount: el.wolfCount.value,
      selectedSpecialIds: Array.from(el.roleOptions.querySelectorAll(".role-option:checked")).map(
        (input) => input.value,
      ),
      language: state.language,
      playerVotes: state.playerVotes,
      benvenutoPlayer: state.benvenutoPlayer,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.warn("Unable to save the game state", error);
    }
  }
}

/**
 * Restores the game state from localStorage upon application load.
 * Handles migration of older state structures if necessary.
 */
function restoreFromStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    // Restore setup inputs
    if (data.playerCount) el.playerCount.value = data.playerCount;
    if (data.wolfCount) el.wolfCount.value = data.wolfCount;
    if (Array.isArray(data.selectedSpecialIds)) {
      el.roleOptions.querySelectorAll(".role-option").forEach((input) => {
        input.checked = data.selectedSpecialIds.includes(input.value);
      });
    }

    // Restore player names and list
    state.customNames = Array.isArray(data.customNames) ? [...data.customNames] : [];
    renderPlayerList(); // Render immediately to allow other functions to use `state.customNames`

    // Apply role rules
    clampWolfCount();
    enforceRoleLimits();
    updateDeckPreview();
    updateRoleSummary();

    // Restore deck and player assignments
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
      state.deck = deckFromRoleIds(data.deckRoleIds); // Legacy support for deckRoleIds
    }

    // Restore game progress
    state.revealIndex = Math.min(data.revealIndex || 0, Math.max(state.players.length - 1, 0));
    state.revealComplete = Boolean(data.revealComplete);
    state.narratorDay = data.narratorDay || 1;
    state.eliminatedPlayers = Array.isArray(data.eliminatedPlayers) ? data.eliminatedPlayers : [];
    state.activeSpecialIds = Array.isArray(data.activeSpecialIds) ? data.activeSpecialIds : [];
    if (state.activeSpecialIds.includes("bodyguard")) state.maxDays = null; // Bodyguard can extend max days
    else if (data.maxDays === null) state.maxDays = null;
    else if (typeof data.maxDays === "number" && Number.isFinite(data.maxDays)) state.maxDays = data.maxDays;
    else state.maxDays = Math.max(1, state.players.length || 1); // Default max days
    state.mythStatus = normalizeMythStatus(data.mythStatus);
    state.victory = data.victory || null;
    state.guideStepIndex = data.guideStepIndex || 0;
    state.playersCollapsed = Boolean(data.playersCollapsed);
    state.rolesDetailsOpen = false;  // Always start collapsed on page load for cleaner UI
    state.guideExpanded = data.guideExpanded !== undefined ? Boolean(data.guideExpanded) : true;
    state.view = data.view || "setup";
    if (state.view === "handoff") { // Backward compatibility for old handoff state
      state.view = "reveal";
      state.revealComplete = true;
    }
    state.language = data.language || DEFAULT_LANGUAGE;
    state.playerVotes = data.playerVotes || {};
    state.benvenutoPlayer = data.benvenutoPlayer || null;

    // Apply restored states to UI
    if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
    setLanguage(state.language, { skipPersist: true, skipRender: true }); // Apply language without re-persisting
    if (state.view === "reveal" && state.deck.length) {
      if (state.revealComplete) {
        showCompletionState();
      } else {
        prepareReveal();
      }
    } else if (state.view === "summary") {
      renderSummaryList();
      updateNarratorUI({ preserveGuideStep: true });
    } else if (state.view === "final" && state.victory) {
      renderVictoryFromState();
    }
    updateEliminationSelect(); // Ensure elimination dropdown reflects current state
  } catch (error) {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.warn("Unable to restore the game state", error);
    }
  }
}

// ==========================================================================
// DOM ELEMENT REFERENCES
// ==========================================================================

/**
 * Object to hold references to commonly used DOM elements for efficient access.
 */
const el = {
  // Main Views
  setupView: document.getElementById("setupView"),
  revealView: document.getElementById("revealView"),
  summaryView: document.getElementById("summaryView"),
  finalView: document.getElementById("finalView"),

  // Setup View Elements
  rolesDetails: document.getElementById("rolesDetails"), // Collapsible roles panel
  setupForm: document.getElementById("setupForm"),
  playerCount: document.getElementById("playerCount"),
  wolfCount: document.getElementById("wolfCount"),
  wolfHint: document.getElementById("wolfHint"),
  playerNameInput: document.getElementById("playerNameInput"),
  addPlayerBtn: document.getElementById("addPlayerBtn"),
  playerList: document.getElementById("playerList"), // Container for player chips
  reorderHint: document.getElementById("reorderHint"),
  clearPlayersBtn: document.getElementById("clearPlayersBtn"),
  validationMessage: document.getElementById("validationMessage"),
  roleOptions: document.getElementById("roleOptions"), // Container for special role checkboxes
  roleSummary: document.getElementById("roleSummary"), // Summary of role distribution
  roleSummaryContent: document.getElementById("roleSummaryContent"),

  // Reveal View Elements
  revealBtn: document.getElementById("revealBtn"),
  hideBtn: document.getElementById("hideBtn"),
  roleCard: document.getElementById("roleCard"), // The card displaying role info
  roleImage: document.getElementById("roleImage"),
  handoffNotice: document.getElementById("handoffNotice"),
  handoffTimer: document.getElementById("handoffTimer"),
  revealStatus: document.getElementById("revealStatus"), // Status of card revealing progress
  roleTeam: document.getElementById("roleTeam"),
  roleName: document.getElementById("roleName"),
  roleDescription: document.getElementById("roleDescription"),
  playerProgress: document.getElementById("playerProgress"), // "Player X / Y" text
  currentPlayerLabel: document.getElementById("currentPlayerLabel"), // Current player's name

  // Summary View Elements
  summaryList: document.getElementById("summaryList"), // List of living players
  livingDetails: document.getElementById("livingDetails"), // Collapsible living players panel
  livingCount: document.getElementById("livingCount"),
  fallenDetails: document.getElementById("fallenDetails"), // Collapsible fallen players panel
  fallenList: document.getElementById("fallenList"), // List of fallen players
  fallenCount: document.getElementById("fallenCount"),
  mythPanel: document.getElementById("mythPanel"), // Mythomaniac action panel
  mythStatusTag: document.getElementById("mythStatusTag"),
  mythPlayerLabel: document.getElementById("mythPlayerLabel"),
  mythInstructions: document.getElementById("mythInstructions"),
  mythTargetSelect: document.getElementById("mythTargetSelect"), // Dropdown for Mythomaniac target
  mythConfirmBtn: document.getElementById("mythConfirmBtn"),
  mythResultMessage: document.getElementById("mythResultMessage"),
  mythSummary: document.getElementById("mythSummary"), // Mythomaniac summary display
  mythSummaryText: document.getElementById("mythSummaryText"),
  dayCounter: document.getElementById("dayCounter"),
  nextDayBtn: document.getElementById("nextDayBtn"), // Button to advance to next day
  guideProgress: document.getElementById("guideProgress"), // "Step X / Y" text for guide
  guideStepText: document.getElementById("guideStepText"), // Current guide step description
  guideFullList: document.getElementById("guideFullList"), // Full list of guide steps
  guideNav: document.getElementById("guideNav"), // Navigation for guide steps
  toggleGuideMode: document.getElementById("toggleGuideMode"), // Button to toggle guide view
  prevGuideStep: document.getElementById("prevGuideStep"),
  nextGuideStep: document.getElementById("nextGuideStep"),
  eliminationSelect: document.getElementById("eliminationSelect"), // Dropdown for player elimination
  eliminateBtn: document.getElementById("eliminateBtn"), // Button to confirm elimination

  // Global UI Elements
  infoFooter: document.getElementById("infoFooter"), // Footer containing disclaimers
  restartBtn: document.getElementById("restartBtn"), // Global restart button
  openSummaryBtn: document.getElementById("openSummaryBtn"), // Button to go to summary from reveal
  modalOverlay: document.getElementById("modalOverlay"), // Generic confirmation modal
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  modalCancel: document.getElementById("modalCancel"),
  modalConfirm: document.getElementById("modalConfirm"),
  languageSelect: document.getElementById("languageSelect"), // Native select (if used)
  languageToggle: document.getElementById("languageToggle"), // Custom language toggle button
  languageFlag: document.getElementById("languageFlag"),
  languageMenu: document.getElementById("languageMenu"), // Language dropdown menu
  languageButtons: document.querySelectorAll("[data-lang-button]"), // Individual language selection buttons
  languagePicker: document.querySelector(".language-picker"),
  infoButton: document.getElementById("infoButton"), // Button to open info modal
  infoOverlay: document.getElementById("infoOverlay"), // Immersion tips modal
  infoClose: document.getElementById("infoClose"),
  menuBtn: document.getElementById("menuBtn"), // Hamburger menu button
  mainMenu: document.getElementById("mainMenu"), // Main menu dropdown
  menuVotingBtn: document.getElementById("menuVotingBtn"), // Voting rules button in menu
  menuImmersionBtn: document.getElementById("menuImmersionBtn"), // Immersion tips button in menu
  votingOverlay: document.getElementById("votingOverlay"), // Voting rules modal
  votingClose: document.getElementById("votingClose"),

  // Final View Elements
  victoryTitle: document.getElementById("victoryTitle"),
  victorySubtitle: document.getElementById("victorySubtitle"),
  victoryList: document.getElementById("victoryList"),
  finalNewGameBtn: document.getElementById("finalNewGameBtn"),
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

/**
 * Initializes the application: renders role options, attaches event listeners,
 * restores state from storage, and sets the initial language and view.
 */
init();

function init() {
  renderRoleOptions();
  attachEvents();
  updateWolfHint();
  clampWolfCount();
  enforceRoleLimits();
  updateDeckPreview();
  updateRoleSummary();
  renderPlayerList();
  restoreFromStorage(); // Restore previous session
  setLanguage(state.language, { skipPersist: true }); // Apply language without re-persisting
  showView(state.view || "setup"); // Display the appropriate view
}

// ==========================================================================
// EVENT HANDLERS
// ==========================================================================

/**
 * Attaches all necessary event listeners to DOM elements.
 */
function attachEvents() {
  // Player count and role selection changes
  el.playerCount.addEventListener("input", () => {
    autoAdjustWolvesFromPlayers();
    updateWolfHint();
    clampWolfCount();
    enforceRoleLimits();
    updateDeckPreview();
    updateRoleSummary();
    persistState();
  });

  el.wolfCount.addEventListener("input", () => {
    clampWolfCount();
    updateDeckPreview();
    persistState();
  });

  el.roleOptions.addEventListener("change", () => {
    updateDeckPreview();
    updateRoleSummary();
    persistState();
  });

  // Player name input and list management
  el.addPlayerBtn.addEventListener("click", handleAddPlayer);
  el.playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      handleAddPlayer();
    }
  });

  el.playerList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button");
    if (!button) return;
    if (button.classList.contains("chip-remove")) {
      const index = Number(button.dataset.index);
      state.customNames.splice(index, 1); // Remove player by index
      renderPlayerList();
      persistState();
    }
  });

  el.clearPlayersBtn.addEventListener("click", () => {
    state.customNames = []; // Clear all custom names
    renderPlayerList();
    persistState();
  });

  // Game start
  el.setupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    startGame();
  });

  // Reveal Phase interactions
  if (el.roleCard) {
    el.roleCard.addEventListener("click", () => {
      if (el.roleCard.classList.contains("can-reveal") && el.revealBtn && !el.revealBtn.classList.contains("hidden")) {
        revealCard();
      }
    });
  }
  el.revealBtn.addEventListener("click", revealCard);
  el.hideBtn.addEventListener("click", nextPlayer);
  el.openSummaryBtn.addEventListener("click", () => {
    confirmAction(t("confirmation.handoff"), () => {
      showSummary();
    });
  });

  // Global actions
  el.restartBtn.addEventListener("click", () => confirmAction(t("confirmation.restart"), resetGame));
  el.nextDayBtn.addEventListener("click", advanceDay);

  // Narrator Guide navigation
  el.prevGuideStep.addEventListener("click", () => changeGuideStep(-1));
  el.nextGuideStep.addEventListener("click", () => changeGuideStep(1));

  // Summary list actions (vote, eliminate, revive, lynch)
  el.summaryList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    // Handle vote buttons (+/-)
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
        renderSummaryList(); // Re-render to update vote counts
        persistState();
      }
      return;
    }

    // Handle eliminate/revive/lynch buttons
    const button = event.target.closest(".mini-action");
    if (!button) return;

    if (button.classList.contains("lynch-btn")) {
      lynchPlayer(button.dataset.player || "");
    } else {
      toggleElimination(button.dataset.player || "");
    }
  });

  // Final view new game button
  el.finalNewGameBtn.addEventListener("click", () => confirmAction(t("confirmation.newGame"), resetGame));

  // Toggle for living players list collapse state
  if (el.livingDetails) {
    el.livingDetails.addEventListener("toggle", () => {
      if (suppressLivingToggle) return; // Prevent loop when setting from state
      state.playersCollapsed = !el.livingDetails.open;
      persistState();
    });
  }

  // Guide mode toggle (step-by-step vs. full list)
  if (el.toggleGuideMode) el.toggleGuideMode.addEventListener("click", toggleGuideMode);

  // Elimination from select dropdown
  if (el.eliminateBtn) el.eliminateBtn.addEventListener("click", eliminateFromSelect);

  // Mythomaniac transformation confirmation
  if (el.mythConfirmBtn) el.mythConfirmBtn.addEventListener("click", applyMythTransformation);

  // Toggle list view mode (vertical vs horizontal scroll) for summary
  const toggleListViewBtn = document.getElementById("toggleListView");
  if (toggleListViewBtn && el.summaryList) {
    const VIEW_MODE_KEY = "slay_werewolf_view_mode"; // localStorage key

    // Load saved preference or default
    const savedMode = localStorage.getItem(VIEW_MODE_KEY);
    const isHorizontal = savedMode === "horizontal"; // Default to vertical

    if (isHorizontal) {
      el.summaryList.classList.add("horizontal-scroll");
    } else {
      el.summaryList.classList.remove("horizontal-scroll");
    }

    // Update initial icon to reflect current mode
    const icon = toggleListViewBtn.querySelector(".view-icon");
    if (icon) {
      icon.textContent = isHorizontal ? "☰" : "⊞"; // ☰ for horizontal (more compact), ⊞ for vertical (grid-like)
    }

    toggleListViewBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent parent details element from toggling
      el.summaryList.classList.toggle("horizontal-scroll");

      const isNowHorizontal = el.summaryList.classList.contains("horizontal-scroll");
      localStorage.setItem(VIEW_MODE_KEY, isNowHorizontal ? "horizontal" : "vertical");

      // Update icon
      if (icon) {
        icon.textContent = isNowHorizontal ? "☰" : "⊞";
      }
    });
  }

  // Roles details collapse state persistence
  if (el.rolesDetails) {
    el.rolesDetails.addEventListener("toggle", () => {
      state.rolesDetailsOpen = el.rolesDetails.open;
      persistState();
    });
  }

  // Language selection (for native select dropdown)
  if (el.languageSelect) {
    el.languageSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  }

  // Custom language toggle menu
  if (el.languageToggle && el.languageMenu) {
    el.languageToggle.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent document click from closing it immediately
      toggleLanguageMenu(el.languageMenu.classList.contains("hidden"));
    });
    // Close language menu if clicking outside
    document.addEventListener("click", (event) => {
      if (!el.languageMenu || el.languageMenu.classList.contains("hidden")) return;
      if (el.languagePicker && event.target instanceof Node && el.languagePicker.contains(event.target)) return;
      toggleLanguageMenu(false);
    });
    // Close on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleLanguageMenu(false);
    });
  }

  // Individual language buttons within the custom menu
  if (el.languageButtons && el.languageButtons.length) {
    el.languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const lang = button.dataset.langButton;
        if (lang) setLanguage(lang);
        // Don't close menu immediately; allow user to see change or pick another
      });
    });
  }

  // Hamburger Menu functionality
  if (el.menuBtn && el.mainMenu) {
    el.menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMainMenu(el.mainMenu.classList.contains("hidden"));
    });
    document.addEventListener("click", (event) => {
      if (!el.mainMenu || el.mainMenu.classList.contains("hidden")) return;
      if (el.menuBtn && event.target instanceof Node && el.menuBtn.contains(event.target)) return;
      if (el.mainMenu.contains(event.target)) return; // Keep open if clicking inside the menu
      toggleMainMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleMainMenu(false);
    });
  }

  // Voting Rules Modal (from main menu)
  if (el.menuVotingBtn) {
    el.menuVotingBtn.addEventListener("click", () => {
      toggleMainMenu(false); // Close main menu first
      openVotingModal();
    });
  }
  // Voting Rules Modal (from summary view)
  const openVotingFromSummary = document.getElementById("openVotingFromSummary");
  if (openVotingFromSummary) {
    openVotingFromSummary.addEventListener("click", openVotingModal);
  }
  if (el.votingClose) {
    el.votingClose.addEventListener("click", closeVotingModal);
  }

  // Immersion Tips Modal (from main menu)
  if (el.menuImmersionBtn) {
    el.menuImmersionBtn.addEventListener("click", () => {
      toggleMainMenu(false);
      openInfoModal();
    });
  }

  // General number stepper buttons (+/- for player/wolf count)
  document.querySelectorAll(".step-btn").forEach((button) => {
    const targetId = button.dataset.target;
    const delta = Number(button.dataset.delta) || 0;
    const targetInput = document.getElementById(targetId);
    if (!targetInput) return;
    button.addEventListener("click", () => adjustNumberInput(targetInput, delta));
  });

  // Immersion Tips Modal (from direct button, if any)
  if (el.infoButton) el.infoButton.addEventListener("click", openInfoModal);
  if (el.infoClose) el.infoClose.addEventListener("click", closeInfoModal);
  // Close info modal if clicking on the overlay backdrop
  if (el.infoOverlay) {
    el.infoOverlay.addEventListener("click", (event) => {
      if (event.target === el.infoOverlay) closeInfoModal();
    });
  }
}

// ==========================================================================
// GAME SETUP LOGIC
// ==========================================================================

/**
 * Renders the optional special role checkboxes and their descriptions
 * in the setup view.
 */
function renderRoleOptions() {
  el.roleOptions.innerHTML = "";
  OPTIONAL_CONFIG.forEach((config) => {
    const role = ROLE_LIBRARY[config.roleId];
    if (!role) return; // Skip if role not found in library
    const localized = getRoleContent(role.id); // Get localized role details
    const item = document.createElement("label");
    item.className = "option-item";
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
    name.textContent = localized.name;
    title.append(name);

    const tag = document.createElement("span");
    tag.className = `tag ${role.team}`; // Apply team-based styling to tag
    tag.textContent = localized.teamLabel;
    title.append(tag);

    const subtitle = document.createElement("p");
    subtitle.className = "help role-subtitle";
    subtitle.textContent = t("roles.availableFrom", { count: config.minPlayers });

    const description = document.createElement("p");
    description.className = "help";
    description.textContent = localized.description;
    if (config.noteKey) {
      const note = document.createElement("span");
      note.textContent = ` ${t(config.noteKey)}`;
      description.appendChild(note);
    }

    item.append(title, subtitle, description);
    el.roleOptions.appendChild(item);
  });
  enforceRoleLimits(); // Ensure roles are disabled if player count is too low
}

/**
 * Updates the hint text for the wolf count based on the current player count.
 */
function updateWolfHint() {
  const playerTotal = Number(el.playerCount.value) || 0;
  const recommended = recommendWolves(playerTotal);
  el.wolfHint.textContent = t("setup.wolfHint", { count: recommended });
}

/**
 * Recommends an optimal number of werewolves based on the total player count.
 * @param {number} playerTotal - The total number of players.
 * @returns {number} The recommended number of werewolves.
 */
function recommendWolves(playerTotal) {
  if (playerTotal < 8) return 1;
  if (playerTotal < 16) return 2;
  return 3;
}

/**
 * Automatically adjusts the werewolf count input based on recommended values
 * and current player count, ensuring it stays within valid bounds.
 */
function autoAdjustWolvesFromPlayers() {
  const playerTotal = Number(el.playerCount.value) || 0;
  if (playerTotal <= 0) return;
  const recommended = recommendWolves(playerTotal);
  const limit = Math.max(1, playerTotal - 1); // Max wolves is always one less than total players
  const adjusted = Math.max(1, Math.min(recommended, limit)); // Clamp to 1 and limit
  el.wolfCount.value = String(adjusted);
}

/**
 * Adjusts the value of a number input by a given delta, respecting min/max attributes.
 * Dispatches an 'input' event to trigger associated listeners.
 * @param {HTMLInputElement} input - The input element to adjust.
 * @param {number} delta - The amount to add or subtract from the input's value.
 */
function adjustNumberInput(input, delta) {
  const min = Number(input.min) || Number.NEGATIVE_INFINITY;
  const max = Number(input.max) || Number.POSITIVE_INFINITY;
  let value = Number(input.value) || 0;
  value += delta;
  value = Math.min(max, Math.max(min, value));
  input.value = String(value);
  input.dispatchEvent(new Event("input", { bubbles: true })); // Trigger listeners
}

/**
 * Ensures the werewolf count is within valid ranges based on the total player count.
 */
function clampWolfCount() {
  const playerTotal = Number(el.playerCount.value) || 0;
  let wolves = Number(el.wolfCount.value) || 1;
  if (wolves < 1) wolves = 1; // Minimum 1 wolf
  if (playerTotal > 0) {
    wolves = Math.min(wolves, Math.max(1, playerTotal - 1)); // Max wolves is playerTotal - 1
  }
  el.wolfCount.value = String(wolves);
}

/**
 * Disables special role checkboxes if the current player count is too low
 * for that role, and adds 'option-disabled' class for visual feedback.
 */
function enforceRoleLimits() {
  const playerTotal = Number(el.playerCount.value) || 0;
  const inputs = el.roleOptions.querySelectorAll("input[type='checkbox']");
  inputs.forEach((input) => {
    const minPlayers = Number(input.dataset.minPlayers || "0");
    const optionItem = input.closest(".option-item");

    if (playerTotal < minPlayers) {
      input.disabled = true;
      input.checked = false; // Uncheck if disabled due to player count
      if (optionItem) optionItem.classList.add("option-disabled");
    } else {
      input.disabled = false;
      if (optionItem) optionItem.classList.remove("option-disabled");
    }
  });
}

/**
 * Retrieves an array of currently selected special roles with their copies.
 * @returns {Array<object>} An array of objects, each containing `roleId` and `copies`.
 */
function getSelectedSpecials() {
  return Array.from(el.roleOptions.querySelectorAll("input:checked")).map((input) => ({
    roleId: input.value,
    copies: Number(input.dataset.copies || "1"),
  }));
}

/**
 * Validates the current game setup (player count, wolf count, special roles)
 * and displays an appropriate error message if invalid.
 * @returns {boolean} True if the setup is valid, false otherwise.
 */
function updateDeckPreview() {
  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specialTotal = getSelectedSpecials().reduce((sum, item) => sum + item.copies, 0);
  const selected = wolfTotal + 1 + specialTotal; // Wolves + Seer (always 1) + other specials
  const remaining = playerTotal - selected; // Number of villagers needed (can be negative if too many roles)
  let message = "";
  if (playerTotal < MIN_PLAYERS) message = t("errors.minPlayers", { count: MIN_PLAYERS });
  else if (wolfTotal < 1) message = t("errors.needWolf");
  else if (wolfTotal >= playerTotal) message = t("errors.tooManyWolves");
  else if (remaining < 0) message = t("errors.tooManySpecials"); // Too many roles selected for player count

  el.validationMessage.textContent = message;
  return message === ""; // Return true if valid, false if there's a message
}

/**
 * Updates and renders a summary of the role distribution (e.g., "2x Werewolf, 1x Seer, 5x Villager").
 */
function updateRoleSummary() {
  if (!el.roleSummary || !el.roleSummaryContent) return;

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specialsSelected = getSelectedSpecials();

  if (playerTotal < MIN_PLAYERS) {
    el.roleSummary.classList.add("hidden");
    return;
  }

  // Build role counts map: { "Role Name": count }
  const roleCounts = {};

  // Add werewolves
  if (wolfTotal > 0) {
    const wolfRole = getRoleContent("werewolf");
    roleCounts[wolfRole.name] = wolfTotal;
  }

  // Add seer (always included)
  const seerRole = getRoleContent("seer");
  roleCounts[seerRole.name] = 1;

  // Add other special roles
  specialsSelected.forEach((special) => {
    const roleContent = getRoleContent(special.roleId);
    roleCounts[roleContent.name] = (roleCounts[roleContent.name] || 0) + special.copies;
  });

  // Calculate remaining villagers
  const specialTotal = wolfTotal + 1 + specialsSelected.reduce((sum, item) => sum + item.copies, 0);
  const villagerCount = playerTotal - specialTotal;
  if (villagerCount > 0) {
    const villagerRole = getRoleContent("villager");
    roleCounts[villagerRole.name] = (roleCounts[villagerRole.name] || 0) + villagerCount; // Add to existing if any
  }

  // Render summary items
  el.roleSummaryContent.innerHTML = "";
  Object.entries(roleCounts).forEach(([roleName, count]) => {
    const item = document.createElement("span");
    item.className = "role-summary-item";
    item.textContent = t("setup.rolesInDeck", { count, role: roleName });
    el.roleSummaryContent.appendChild(item);
  });

  el.roleSummary.classList.remove("hidden");
}

/**
 * Adds a new player name from the input field to the custom names list.
 */
function handleAddPlayer() {
  const name = el.playerNameInput.value.trim();
  if (!name) return; // Ignore empty names
  state.customNames.push(name);
  el.playerNameInput.value = ""; // Clear input field
  renderPlayerList();
  persistState();
}

/**
 * Renders the list of custom player names as draggable chips.
 * Includes drag-and-drop and touch reordering functionality.
 */
function renderPlayerList() {
  el.playerList.innerHTML = "";
  state.customNames.forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "player-chip";
    item.draggable = true; // Enable drag for desktop
    item.dataset.index = String(index);

    // Player name display
    const nameSpan = document.createElement("span");
    nameSpan.className = "player-name";
    nameSpan.textContent = name;
    item.appendChild(nameSpan);

    // Actions container for buttons
    const actions = document.createElement("div");
    actions.className = "chip-actions";

    // Remove player button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-remove";
    removeButton.dataset.index = String(index);
    removeButton.setAttribute("aria-label", t("accessibility.removePlayer", { name }));
    removeButton.textContent = "×";
    actions.appendChild(removeButton);

    item.appendChild(actions);
    el.playerList.appendChild(item);

    // Drag event listeners (desktop)
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);

    // Touch event listeners (mobile) for reordering
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);
  });

  // Toggle visibility of "Clear list" and "Reorder hint" based on list emptiness
  const isEmpty = state.customNames.length === 0;
  el.clearPlayersBtn.classList.toggle("hidden", isEmpty);
  if (el.reorderHint) el.reorderHint.classList.toggle("hidden", isEmpty);
}

// Drag-and-drop logic for player list reordering (Desktop)
let draggedItem = null;
let draggedIndex = null;

function handleDragStart(event) {
  draggedItem = event.currentTarget;
  draggedIndex = Number(draggedItem.dataset.index);
  draggedItem.classList.add("dragging"); // Add visual feedback
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", draggedItem.innerHTML); // Required for Firefox
}

function handleDragOver(event) {
  event.preventDefault(); // Allow dropping
  event.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter(event) {
  const target = event.currentTarget;
  if (target !== draggedItem && target.classList.contains("player-chip")) {
    target.classList.add("drag-over"); // Highlight potential drop target
  }
}

function handleDragLeave(event) {
  const target = event.currentTarget;
  target.classList.remove("drag-over"); // Remove highlight
}

function handleDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  const target = event.currentTarget;
  target.classList.remove("drag-over");

  if (target !== draggedItem && target.classList.contains("player-chip")) {
    const targetIndex = Number(target.dataset.index);

    // Reorder the customNames array
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    state.customNames.splice(targetIndex, 0, draggedName);

    renderPlayerList(); // Re-render the updated list
    persistState();
  }
  return false;
}

function handleDragEnd(event) {
  const target = event.currentTarget;
  target.classList.remove("dragging"); // Remove visual feedback

  // Clean up any lingering drag-over highlights
  document.querySelectorAll(".player-chip").forEach((item) => {
    item.classList.remove("drag-over");
  });

  draggedItem = null;
  draggedIndex = null;
}

// Touch event handlers for player list reordering (Mobile)
let touchStartY = 0;
let touchCurrentItem = null; // The item currently being touched/dragged

function handleTouchStart(event) {
  touchCurrentItem = event.currentTarget;
  draggedItem = touchCurrentItem; // Use draggedItem for consistency with desktop D&D
  draggedIndex = Number(touchCurrentItem.dataset.index);
  touchStartY = event.touches[0].clientY;

  // Add visual feedback
  touchCurrentItem.classList.add("dragging");
}

function handleTouchMove(event) {
  if (!touchCurrentItem) return;

  event.preventDefault(); // Prevent page scrolling while dragging an item

  const touch = event.touches[0];
  const touchY = touch.clientY;

  // Find the element directly under the touch point
  const elementBelow = document.elementFromPoint(touch.clientX, touchY);
  const targetChip = elementBelow?.closest(".player-chip"); // Check if it's a player chip

  // Remove drag-over from all items except the one being dragged
  document.querySelectorAll(".player-chip").forEach((item) => {
    if (item !== touchCurrentItem) {
      item.classList.remove("drag-over");
    }
  });

  // Add drag-over to the potential drop target
  if (targetChip && targetChip !== touchCurrentItem) {
    targetChip.classList.add("drag-over");
  }
}

function handleTouchEnd(event) {
  if (!touchCurrentItem) return;

  const touch = event.changedTouches[0];
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  const targetChip = elementBelow?.closest(".player-chip");

  // Clean up visual feedback
  touchCurrentItem.classList.remove("dragging");
  document.querySelectorAll(".player-chip").forEach((item) => {
    item.classList.remove("drag-over");
  });

  // Reorder if dropped on a different item
  if (targetChip && targetChip !== touchCurrentItem) {
    const targetIndex = Number(targetChip.dataset.index);

    // Reorder the customNames array
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    state.customNames.splice(targetIndex, 0, draggedName);

    renderPlayerList(); // Re-render to update order
    persistState();
  }

  // Reset touch state variables
  touchCurrentItem = null;
  draggedItem = null;
  draggedIndex = null;
}

/**
 * Generates an array of player names, using custom names if provided,
 * or default "Player X" names otherwise.
 * @param {number} playerTotal - The total number of players.
 * @returns {Array<string>} An array of player names.
 */
function buildPlayerList(playerTotal) {
  const players = [];
  for (let i = 0; i < playerTotal; i += 1) {
    players.push(state.customNames[i] || t("status.defaultPlayer", { number: i + 1 }));
  }
  return players;
}

/**
 * Constructs the game deck with roles based on player count, wolf count, and selected special roles.
 * @param {object} options - Configuration for building the deck.
 * @param {number} options.playerTotal - Total number of players.
 * @param {number} options.wolfTotal - Total number of werewolves.
 * @param {Array<object>} options.specials - Array of selected special roles.
 * @returns {Array<object>} A shuffled array of role cards.
 */
function buildDeck({ playerTotal, wolfTotal, specials }) {
  const deck = [];
  // Add werewolves
  for (let i = 0; i < wolfTotal; i += 1) deck.push(createCard(ROLE_LIBRARY.werewolf));
  // Add seer (always included)
  deck.push(createCard(ROLE_LIBRARY.seer));

  // Add other special roles
  specials.forEach((special) => {
    const role = ROLE_LIBRARY[special.roleId];
    if (!role) return;
    for (let count = 0; count < special.copies; count += 1) {
      deck.push(createCard(role));
    }
  });

  // Fill remaining slots with villagers
  while (deck.length < playerTotal) deck.push(createCard(ROLE_LIBRARY.villager));
  return shuffle(deck); // Randomize the deck
}

/**
 * Creates a new role card object based on a role definition from `ROLE_LIBRARY`.
 * @param {object} role - The base role object.
 * @returns {object} A new card object.
 */
function createCard(role) {
  const base = role || ROLE_LIBRARY.villager; // Default to villager if role is undefined
  return {
    roleId: base.id,
    name: base.name,
    team: base.team,
    teamLabel: base.teamLabel,
    description: base.description,
    image: base.image,
  };
}

/**
 * Reconstructs a deck from an array of role IDs (used for state restoration).
 * @param {Array<string>} roleIds - An array of role IDs.
 * @returns {Array<object>} An array of role card objects.
 */
function deckFromRoleIds(roleIds) {
  if (!Array.isArray(roleIds)) return [];
  return roleIds.map((roleId) => createCard(ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager));
}

/**
 * Detects if a Mythomaniac is present in the current deck and initializes its status.
 * @returns {object|null} The initial mythStatus object, or null if no Mythomaniac.
 */
function detectMythStatusFromDeck() {
  if (!state.players.length || !state.deck.length) return null;
  const playerIndex = state.deck.findIndex((card) => card.roleId === "mythomaniac");
  if (playerIndex === -1) return null;
  return {
    playerIndex,
    playerName: state.players[playerIndex] || "",
    targetName: null,
    outcome: null,
    completed: false,
  };
}

/**
 * Normalizes the Mythomaniac status object from saved data, ensuring player names and indices are correct.
 * @param {object} savedStatus - The Mythomaniac status object loaded from storage.
 * @returns {object|null} The normalized mythStatus object, or null.
 */
function normalizeMythStatus(savedStatus) {
  if (!state.players.length) return null;
  if (savedStatus) {
    let index = -1;
    if (savedStatus.playerName) {
      index = state.players.findIndex((name) => name === savedStatus.playerName);
    }
    // Fallback if player name not found (e.g., player renamed or removed)
    if (index === -1 && typeof savedStatus.playerIndex === "number") {
      index = savedStatus.playerIndex;
    }
    if (index >= 0 && index < state.players.length) {
      return {
        playerIndex: index,
        playerName: state.players[index],
        targetName: savedStatus.targetName || null,
        outcome: savedStatus.outcome || null,
        completed: Boolean(savedStatus.completed),
      };
    }
  }
  return detectMythStatusFromDeck(); // Re-detect if no valid saved status
}

/**
 * Shuffles an array (Fisher-Yates algorithm).
 * @param {Array<any>} deck - The array to shuffle.
 * @returns {Array<any>} The shuffled array.
 */
function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Initiates a new game: builds the deck, assigns roles to players,
 * resets game state, and transitions to the reveal phase.
 */
function startGame() {
  enforceRoleLimits(); // Re-validate selected roles one last time
  if (!updateDeckPreview()) return; // Prevent starting if setup is invalid

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specials = getSelectedSpecials();

  state.players = buildPlayerList(playerTotal);
  state.deck = buildDeck({ playerTotal, wolfTotal, specials });
  state.revealIndex = 0;
  state.activeSpecialIds = Array.from(new Set(specials.map((item) => item.roleId))); // Unique special roles
  state.mythStatus = detectMythStatusFromDeck();
  state.eliminatedPlayers = [];
  state.narratorDay = 1;
  state.maxDays = state.activeSpecialIds.includes("bodyguard") ? null : Math.max(1, state.players.length); // Max days if bodyguard is present
  state.guideSteps = []; // Reset guide steps
  state.guideStepIndex = 0;
  state.victory = null;
  state.revealComplete = false;
  state.playerVotes = {}; // Reset votes
  state.benvenutoPlayer = null; // Reset Benvenuto

  prepareReveal(); // Set up the first card reveal
  showView("reveal");
  persistState();
}

// ==========================================================================
// REVEAL PHASE LOGIC
// ==========================================================================

/**
 * Prepares the UI to reveal the next player's role card.
 */
function prepareReveal() {
  if (!state.deck.length) return;
  clearHandoffCountdown(); // Clear any existing handoff timer
  state.revealComplete = false;
  if (el.revealStatus) el.revealStatus.classList.remove("hidden");
  if (el.roleCard) el.roleCard.classList.remove("hidden");
  el.revealBtn.classList.remove("hidden");
  el.hideBtn.classList.add("hidden");
  el.openSummaryBtn.classList.add("hidden");
  el.roleImage.classList.add("hidden");
  el.roleImage.removeAttribute("src"); // Clear previous image
  el.roleCard.classList.remove("with-image");
  el.handoffNotice.classList.add("hidden");

  const total = state.players.length;
  const current = state.revealIndex + 1;
  el.playerProgress.textContent = t("status.player", { current, total });
  el.currentPlayerLabel.textContent = state.players[state.revealIndex];

  // Reset role card display to "hidden" state
  el.roleCard.dataset.team = "unknown";
  el.roleCard.classList.add("can-reveal");
  el.roleTeam.textContent = t("reveal.hiddenTeam");
  el.roleName.textContent = t("reveal.tap");
  el.roleDescription.textContent = t("reveal.prompt");
}

/**
 * Reveals the current player's role card by updating the UI with role details.
 */
function revealCard() {
  const card = state.deck[state.revealIndex];
  if (!card) return;
  el.roleCard.classList.remove("can-reveal"); // Cannot tap again to reveal
  const roleText = getRoleContent(card.roleId); // Get localized role text
  el.roleCard.dataset.team = card.team; // Set team for styling
  el.roleTeam.textContent = roleText.teamLabel;
  el.roleName.textContent = roleText.name;
  el.roleDescription.textContent = roleText.description;
  if (card.image) {
    el.roleImage.src = card.image;
    el.roleImage.alt = roleText ? roleText.name : "Role";
    el.roleImage.classList.remove("hidden");
    el.roleCard.classList.add("with-image");
  } else {
    el.roleImage.classList.add("hidden");
    el.roleCard.classList.remove("with-image");
  }
  el.revealBtn.classList.add("hidden"); // Hide reveal button
  el.hideBtn.classList.remove("hidden"); // Show next player button
  scrollToBottom(); // Ensure card is visible
}

/**
 * Advances to the next player's card in the reveal sequence, or
 * shows the completion state if all cards have been revealed.
 */
function nextPlayer() {
  if (state.revealIndex < state.players.length - 1) {
    state.revealIndex += 1;
    prepareReveal();
    persistState();
  } else {
    showCompletionState();
    persistState();
  }
  scrollToBottom();
}

/**
 * Displays the completion state after all role cards have been revealed,
 * prompting for handoff to the narrator.
 */
function showCompletionState() {
  state.revealComplete = true;
  // Reset card display
  el.roleCard.dataset.team = "humans"; // Default to humans for generic styling
  el.roleCard.classList.remove("can-reveal");
  el.roleTeam.textContent = "";
  el.roleName.textContent = "";
  el.roleDescription.textContent = "";
  el.playerProgress.textContent = "";
  el.currentPlayerLabel.textContent = "";
  el.roleImage.classList.add("hidden");
  el.roleImage.removeAttribute("src");
  el.roleCard.classList.remove("with-image");

  if (el.roleCard) el.roleCard.classList.add("hidden"); // Hide the card itself
  if (el.revealStatus) el.revealStatus.classList.add("hidden"); // Hide reveal progress
  el.handoffNotice.classList.remove("hidden"); // Show handoff message
  el.revealBtn.classList.add("hidden");
  el.hideBtn.classList.add("hidden");
  el.openSummaryBtn.classList.remove("hidden"); // Show narrator handoff button
  startHandoffCountdown(5); // Start a brief countdown
  scrollToBottom();
}

/**
 * Transitions to the summary view for the narrator.
 */
function showSummary() {
  clearHandoffCountdown();
  renderSummaryList(); // Render the list of living/fallen players
  updateNarratorUI(); // Update narrator controls and guide
  showView("summary");
  persistState();
}

// ==========================================================================
// SUMMARY & NARRATION LOGIC
// ==========================================================================

/**
 * Handles the lynching of a player.
 * Confirms the action and checks for immediate victory conditions.
 * @param {string} player - The name of the player to lynch.
 */
function lynchPlayer(player) {
  if (!player) return;

  confirmAction(t("confirmation.lynch", { player }), () => {
    // Predict if this lynch will trigger a victory
    const outcome = predictVictoryOnElimination(player);
    const doLynch = () => {
      // Add player to eliminated list if not already there, mark as lynched
      if (!state.eliminatedPlayers.some((e) => e.name === player)) {
        state.eliminatedPlayers.push({
          name: player,
          locked: false, // Can be revived if needed (e.g., for testing)
          type: 'lynched',
          day: state.narratorDay
        });
      }
      state.benvenutoPlayer = player; // Set this player as the most recently lynched (Benvenuto)
      state.playerVotes = {}; // Reset votes for next round
      renderSummaryList();
      persistState();
      evaluateVictoryConditions(); // Check if game ends
    };

    if (outcome) {
      // If a victory is predicted, confirm with the user, including the winning team
      const victoryText = getVictoryText(outcome.team);
      confirmAction(t("confirmation.eliminationVictory", { player, outcome: victoryText.title }), () => {
        doLynch();
      });
    } else {
      doLynch();
    }
  });
}

/**
 * Computes which players are "Indiziato" (suspects) based on current votes and Benvenuto player.
 * Follows specific tie-breaking rules.
 * @returns {Array<string>} An array of player names who are suspects.
 */
function computeIndiziatoPlayers() {
  const votes = state.playerVotes;
  const candidates = [];
  const voteCounts = {};

  // Count votes for alive players only
  state.players.forEach((player) => {
    const isAlive = !state.eliminatedPlayers.some((e) => e.name === player);
    if (isAlive) {
      voteCounts[player] = votes[player] || 0;
    }
  });

  const sortedPlayers = Object.keys(voteCounts).sort((a, b) => voteCounts[b] - voteCounts[a]);
  if (sortedPlayers.length === 0) return [];

  // If top player has 0 votes, no suspects
  if (voteCounts[sortedPlayers[0]] === 0) return [];

  // Always include the top voter as a candidate
  candidates.push(sortedPlayers[0]);

  if (sortedPlayers.length > 1) {
    const firstScore = voteCounts[sortedPlayers[0]];
    // Filter players who tied for the top score
    const firstTies = sortedPlayers.filter((p) => voteCounts[p] === firstScore);

    if (firstTies.length >= 2) {
      // If multiple players tied for first place, select the two closest to Benvenuto (clockwise)
      const benIdx = state.benvenutoPlayer ? state.players.indexOf(state.benvenutoPlayer) : -1;
      firstTies.sort((a, b) => {
        const idxA = state.players.indexOf(a);
        const idxB = state.players.indexOf(b);
        if (benIdx === -1) return idxA - idxB; // Fallback to natural order if no Benvenuto
        // Calculate clockwise distance from player to the left of Benvenuto
        const benvenutoLeftIdx = (benIdx + 1) % state.players.length;
        const distA = (idxA - benvenutoLeftIdx + state.players.length) % state.players.length;
        const distB = (idxB - benvenutoLeftIdx + state.players.length) % state.players.length;
        return distA - distB;
      });
      // Ensure we pick at most two even if more tied
      return [firstTies[0], firstTies[1]].filter(Boolean);
    } else {
      // No tie for first place. Look for the second highest vote getter.
      const secondScore = voteCounts[sortedPlayers[1]];

      // Second place must have > 0 votes to be a suspect
      if (secondScore === 0) return candidates;

      const secondTies = sortedPlayers.filter((p) => voteCounts[p] === secondScore);

      if (secondTies.length === 1) {
        // If only one player has the second highest score
        candidates.push(secondTies[0]);
      } else {
        // If multiple players tied for second place, select the one closest to Benvenuto (clockwise)
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

  // Ensure only up to 2 candidates are returned
  return candidates.slice(0, 2);
}

/**
 * Renders the summary list of players, including living and fallen.
 * Displays vote controls, elimination options, and status badges.
 */
function renderSummaryList() {
  // If summaryList element is not ready, just update related components
  if (!el.summaryList) {
    renderFallenList();
    renderMythPanel();
    updateEliminationSelect();
    return;
  }

  // Control the collapse state of the living players details panel
  if (el.livingDetails) {
    suppressLivingToggle = true; // Prevent state update loop
    el.livingDetails.open = !state.playersCollapsed;
    suppressLivingToggle = false;
  }

  el.summaryList.innerHTML = "";
  // If there's a victory, filter players to show only winners
  const winnerEntries = state.victory ? getVictorySurvivors() : null;
  const winnersSet = winnerEntries ? new Set(winnerEntries.map((entry) => entry.name)) : null;
  let renderedCount = 0;

  // Compute "Indiziato" (suspect) players for the current voting round
  const indiziatoPlayers = computeIndiziatoPlayers();

  state.players.forEach((player, index) => {
    // If game has ended, only render players on the winning team
    if (winnersSet && !winnersSet.has(player)) return;

    const card = state.deck[index];
    const eliminationEntry = state.eliminatedPlayers.find((entry) => entry.name === player);
    const eliminated = Boolean(eliminationEntry);
    const isAlive = !eliminated;
    const isBenvenuto = player === state.benvenutoPlayer; // The most recently lynched player
    const isIndiziato = indiziatoPlayers.includes(player); // Player is a suspect

    const listItem = document.createElement("li");
    listItem.className = "summary-item";
    if (eliminated) listItem.classList.add("eliminated"); // Visually mark eliminated players
    if (isBenvenuto) listItem.classList.add("benvenuto"); // Highlight Benvenuto player

    // Add role image if available
    if (card && card.image) {
      const localized = getRoleContent(card.roleId);
      const img = document.createElement("img");
      img.className = "summary-thumb";
      img.src = card.image;
      img.alt = localized ? localized.name : "Role image";
      listItem.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "summary-info";

    // Player name with dynamic badges
    const nameRow = document.createElement("div");
    nameRow.className = "summary-name-row";
    const name = document.createElement("span");
    name.className = "summary-name";
    name.textContent = player;
    nameRow.appendChild(name);
    info.appendChild(nameRow);

    // Container for status badges (Benvenuto, Indiziato)
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
    listItem.appendChild(badgeContainer);

    // Player role (displayed below name)
    const role = document.createElement("span");
    role.className = "summary-role";
    const roleText = card ? getRoleContent(card.roleId) : null;
    role.textContent = roleText ? roleText.name : "-";
    info.appendChild(role);

    // Vote controls for alive players
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

    // Action buttons container (Eliminate, Lynch, Revive)
    const actions = document.createElement("div");
    actions.className = "summary-actions";

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "mini-action";
    actionBtn.dataset.player = player;

    // Determine if player is a wolf or werehamster (cannot be "mauled" or "sbranato")
    const isWolfOrHamster = card && (card.team === "wolves" || card.roleId === "werehamster");

    if (eliminated) {
      // Player is eliminated, show "Revive" button
      if (eliminationEntry?.locked) {
        actionBtn.classList.add("revive");
        actionBtn.textContent = t("buttons.locked");
        actionBtn.disabled = true; // Cannot revive if locked
      } else {
        actionBtn.classList.add("revive");
        actionBtn.textContent = t("buttons.revive");
      }
    } else {
      // Player is alive, show "Eliminate" (night kill) button
      if (isWolfOrHamster) {
        // Wolves/Hamsters can't be "mauled" by wolves (only lynched or seen by seer)
        actionBtn.classList.add("remove");
        actionBtn.textContent = t("buttons.eliminate"); // "Sbranato" in Italian, for example
        actionBtn.disabled = true;
        actionBtn.style.opacity = "0.5";
      } else {
        actionBtn.classList.add("remove");
        actionBtn.textContent = t("buttons.eliminate");
      }
    }
    actions.appendChild(actionBtn);

    // Lynch button: only available for alive players and if no one has been lynched this turn yet
    const alreadyLynchedThisTurn = state.eliminatedPlayers.some(
      (e) => e.type === 'lynched' && e.day === state.narratorDay && !e.locked
    );
    if (isAlive && !alreadyLynchedThisTurn) {
      const lynchBtn = document.createElement("button");
      lynchBtn.type = "button";
      lynchBtn.className = "mini-action lynch-btn";
      lynchBtn.dataset.player = player;
      lynchBtn.textContent = "🔥 " + t("buttons.lynch");
      lynchBtn.title = t("buttons.lynch");
      actions.insertBefore(lynchBtn, actionBtn); // Place lynch button before eliminate button
    }

    listItem.appendChild(actions);
    el.summaryList.appendChild(listItem);
    if (isAlive) renderedCount += 1; // Count living players
  });

  // Display message if no living players (e.g., game over scenarios)
  if (renderedCount === 0) {
    const empty = document.createElement("li");
    empty.className = "help";
    empty.textContent = t("living.empty");
    el.summaryList.appendChild(empty);
  }
  if (el.livingCount) el.livingCount.textContent = String(renderedCount); // Update living count display
  renderFallenList(); // Re-render fallen players list
  renderMythPanel(); // Re-render Mythomaniac panel
  updateEliminationSelect(); // Update elimination dropdown
}

/**
 * Updates the active state of language selection buttons.
 */
function updateLanguageButtons() {
  if (el.languageButtons && el.languageButtons.length) {
    el.languageButtons.forEach((button) => {
      const isActive = button.dataset.langButton === state.language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }
  // If there's a flag icon, update it
  if (el.languageFlag) el.languageFlag.textContent = getLanguageFlag(state.language);
}

/**
 * Toggles the visibility of the main hamburger menu.
 * @param {boolean} [forceState] - Optional: true to show, false to hide. If omitted, toggles current state.
 */
function toggleMainMenu(forceState) {
  if (!el.mainMenu || !el.menuBtn) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.mainMenu.classList.contains("hidden");
  el.mainMenu.classList.toggle("hidden", !shouldShow);
  el.mainMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.menuBtn.setAttribute("aria-expanded", String(shouldShow));
}

/**
 * Opens the voting rules modal.
 */
function openVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

/**
 * Closes the voting rules modal.
 */
function closeVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.add("hidden");
  document.body.style.overflow = ""; // Restore background scrolling
}

/**
 * Returns the Unicode flag emoji for a given language code.
 * @param {string} lang - The language code (e.g., 'en', 'es', 'it').
 * @returns {string} The flag emoji.
 */
function getLanguageFlag(lang) {
  if (lang === "es") return "🇪🇸";
  if (lang === "it") return "🇮🇹";
  return "🇬🇧"; // Default to UK flag for English
}

/**
 * Toggles the visibility of the custom language selection menu.
 * @param {boolean} [forceState] - Optional: true to show, false to hide.
 */
function toggleLanguageMenu(forceState) {
  if (!el.languageMenu || !el.languageToggle) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.languageMenu.classList.contains("hidden");
  el.languageMenu.classList.toggle("hidden", !shouldShow);
  el.languageMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.languageToggle.classList.toggle("active", shouldShow);
  el.languageToggle.setAttribute("aria-expanded", String(shouldShow));
}

/**
 * Updates the dropdown list of alive players for elimination.
 */
function updateEliminationSelect() {
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
  if (el.eliminateBtn) el.eliminateBtn.disabled = disabled; // Disable eliminate button if no players
}

/**
 * Triggers player elimination based on the selection in the dropdown.
 */
function eliminateFromSelect() {
  if (!el.eliminationSelect) return;
  const name = el.eliminationSelect.value;
  if (!name || isEliminated(name)) return; // Don't eliminate if already eliminated or no name selected
  promptElimination(name, {
    afterConfirm: () => {
      el.eliminationSelect.value = ""; // Clear selection after elimination
    },
  });
}

/**
 * Toggles a player's elimination status (eliminates if alive, revives if eliminated).
 * @param {string} player - The name of the player to toggle.
 */
function toggleElimination(player) {
  if (state.victory) return; // Cannot eliminate/revive if game has ended
  if (!player) return;
  const index = state.eliminatedPlayers.findIndex((e) => e.name === player);
  if (index >= 0) {
    // Player is eliminated, so revive them
    if (state.eliminatedPlayers[index].locked) return; // Cannot revive locked players (e.g., from previous days)
    state.eliminatedPlayers.splice(index, 1); // Remove from eliminated list

    // If this player was Benvenuto, clear that status
    if (state.benvenutoPlayer === player) {
      state.benvenutoPlayer = null;
    }
  } else {
    // Player is alive, so eliminate them (as a night kill, not lynched)
    state.eliminatedPlayers.push({ name: player, locked: false, type: 'sbranato', day: state.narratorDay });
  }
  renderSummaryList(); // Re-render UI
  updateNarratorUI({ preserveGuideStep: true }); // Update narrator UI (guide, next day button)
}

/**
 * Checks if a player is currently eliminated.
 * @param {string} name - The name of the player.
 * @returns {boolean} True if the player is eliminated, false otherwise.
 */
function isEliminated(name) {
  return state.eliminatedPlayers.some((entry) => entry.name === name);
}

/**
 * Adds an entry to the eliminated players list.
 * @param {string} name - The name of the player eliminated.
 * @param {string} [type='lynch'] - The type of elimination ('lynch' or 'sbranato').
 */
function addEliminationEntry(name, type = "lynch") {
  const playerIndex = state.players.findIndex((player) => player === name);
  const roleId = playerIndex >= 0 && state.deck[playerIndex] ? state.deck[playerIndex].roleId : null;
  state.eliminatedPlayers.push({ name, roleId, day: state.narratorDay, locked: false, type });

  // If this is a lynch, set the Benvenuto player for tie-breaking next round
  if (type === "lynch") {
    state.benvenutoPlayer = name;
  }

  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
}

/**
 * Prompts the user for confirmation before eliminating a player.
 * Checks for victory conditions immediately after elimination.
 * @param {string} name - The name of the player to eliminate.
 * @param {object} [options] - Options object.
 * @param {Function} [options.afterConfirm] - Callback function to execute after confirmation.
 */
function promptElimination(name, { afterConfirm } = {}) {
  const proceed = () => {
    addEliminationEntry(name, "lynch"); // Default to 'lynch' type for this prompt
    if (typeof afterConfirm === "function") afterConfirm();
  };
  const outcome = predictVictoryOnElimination(name); // Check if this elimination leads to victory
  if (outcome) {
    const texts = getVictoryText(outcome.team);
    confirmAction(t("confirmation.eliminationVictory", { player: name, outcome: texts.title }), proceed);
  } else {
    confirmAction(t("confirmation.lynch", { player: name }), proceed); // Generic lynch confirmation
  }
}

/**
 * Predicts the game's victory outcome if a specific player were to be eliminated.
 * This is used to warn the narrator before a game-ending elimination.
 * @param {string} name - The name of the player whose elimination is being simulated.
 * @param {boolean} [isNightKill=false] - True if simulating a night kill (affects wolf win condition slightly).
 * @returns {object|null} An object { team: string, survivors: Array } if a victory is predicted, otherwise null.
 */
function predictVictoryOnElimination(name, isNightKill = false) {
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  eliminatedSet.add(name); // Add the currently targeted player to the hypothetical eliminated set
  return computeVictoryOutcomeFromSet(eliminatedSet, isNightKill);
}

/**
 * Updates the Narrator UI elements: day counter, next day button state, guide steps, etc.
 * @param {object} [options] - Options for UI update.
 * @param {boolean} [options.preserveGuideStep=false] - If true, tries to maintain current guide step index.
 */
function updateNarratorUI({ preserveGuideStep = false } = {}) {
  el.dayCounter.textContent = String(state.narratorDay);
  const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
  const maxReached = hasCap && state.narratorDay >= state.maxDays;
  const mythBlocked = mythRequiresAction(); // Check if Mythomaniac needs action
  const disableNext = maxReached || mythBlocked || Boolean(state.victory); // Disable 'Next Day' if game is over or Mythomaniac needs action
  el.nextDayBtn.disabled = disableNext;
  el.nextDayBtn.textContent = mythBlocked
    ? t("myth.blockedButton") // Special text if Mythomaniac is blocking
    : maxReached
      ? t("buttons.noMoreDays")
      : t("buttons.nextDay");

  const previousIndex = state.guideStepIndex;
  state.guideSteps = buildNarrationSteps(state.narratorDay); // Rebuild guide for current day
  if (state.guideSteps.length === 0) {
    state.guideStepIndex = 0;
  } else if (!preserveGuideStep) {
    state.guideStepIndex = 0; // Reset guide step for new day
  } else {
    state.guideStepIndex = Math.min(previousIndex, state.guideSteps.length - 1); // Keep current step if possible
  }
  renderGuide(); // Render the narration guide
  renderMythPanel(); // Update Mythomaniac panel
  persistState();
  updateEliminationSelect();
  evaluateVictoryConditions(); // Re-evaluate victory conditions
}

/**
 * Constructs the narration guide steps for a given day.
 * @param {number} day - The current game day.
 * @returns {Array<string>} An array of localized guide step messages.
 */
function buildNarrationSteps(day) {
  const steps = [];
  steps.push(t("guide.step.closeEyes", { day }));
  if (hasSpecial("mason") && day === 1) steps.push(t("guide.step.masons"));
  if (hasSpecial("bodyguard") && day >= 2) steps.push(t("guide.step.bodyguard"));
  steps.push(t("guide.step.seer")); // Seer always active
  if (hasSpecial("medium") && day >= 2) steps.push(t("guide.step.medium"));
  if (hasSpecial("owl")) steps.push(t("guide.step.owl"));
  if (isMythActive() && day === 2) steps.push(t("guide.step.mythomaniac"));
  steps.push(t("guide.step.wolves")); // Werewolves always active
  if (hasSpecial("werehamster")) steps.push(t("guide.step.hamster"));
  steps.push(t("guide.step.dawn", { day }));
  if (hasSpecial("owl")) steps.push(t("guide.step.owlReveal"));
  if (hasSpecial("possessed")) steps.push(t("guide.step.possessed"));
  steps.push(t("guide.step.dayDiscuss", { day }));
  return steps;
}

/**
 * Checks if a specific special role is active in the current game.
 * @param {string} roleId - The ID of the role to check.
 * @returns {boolean} True if the role is active, false otherwise.
 */
function hasSpecial(roleId) {
  return state.activeSpecialIds.includes(roleId);
}

/**
 * Checks if the Mythomaniac role is currently active and unresolved.
 * @returns {boolean} True if Mythomaniac is active and needs attention.
 */
function isMythActive() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName), // Must be alive
  );
}

/**
 * Determines if the Mythomaniac requires immediate action from the narrator.
 * This happens on Day 2 or later if the Mythomaniac is alive and hasn't completed their action.
 * @returns {boolean} True if Mythomaniac action is pending.
 */
function mythRequiresAction() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName) &&
    state.narratorDay >= 2, // Mythomaniac acts from Day 2 onwards
  );
}

/**
 * Renders the narration guide, either as a step-by-step display or a full list.
 */
function renderGuide() {
  const total = state.guideSteps.length;
  if (el.guideProgress) el.guideProgress.classList.toggle("hidden", state.guideExpanded); // Hide progress bar if full list
  if (total === 0) {
    el.guideProgress.textContent = t("guide.progress", { current: 0, total: 0 });
    el.guideStepText.textContent = t("guide.empty");
    el.prevGuideStep.disabled = true;
    el.nextGuideStep.disabled = true;
    el.guideStepText.classList.remove("hidden");
    el.guideFullList.classList.add("hidden");
    el.guideNav.classList.remove("hidden"); // Ensure nav buttons are visible if no steps
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
 * Toggles the display mode of the narration guide (step-by-step vs. full list).
 */
function toggleGuideMode() {
  state.guideExpanded = !state.guideExpanded;
  renderGuide();
  persistState();
}

/**
 * Changes the current step in the narration guide.
 * @param {number} delta - The amount to change the step index by (e.g., -1 for previous, 1 for next).
 */
function changeGuideStep(delta) {
  if (!state.guideSteps.length) return;
  const nextIndex = state.guideStepIndex + delta;
  if (nextIndex < 0 || nextIndex >= state.guideSteps.length) return; // Stay within bounds
  state.guideStepIndex = nextIndex;
  renderGuide();
  persistState();
}

/**
 * Renders the list of fallen (eliminated) players.
 */
function renderFallenList() {
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
    // Show "(awaiting resolution)" for players eliminated this turn but not yet locked
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
 * Hides both the Mythomaniac panel and its summary.
 */
function hideMythUI() {
  if (el.mythPanel) el.mythPanel.classList.add("hidden");
  if (el.mythSummary) el.mythSummary.classList.add("hidden");
}

/**
 * Displays the Mythomaniac summary text.
 * @param {string} text - The summary message to display.
 */
function showMythSummary(text) {
  if (!el.mythSummary) return;
  if (!text) {
    el.mythSummary.classList.add("hidden");
    if (el.mythSummaryText) el.mythSummaryText.textContent = "";
    return;
  }
  el.mythSummary.classList.remove("hidden");
  if (el.mythSummaryText) el.mythSummaryText.textContent = text;
}

/**
 * Renders the Mythomaniac panel, handling its various states (waiting, ready, done).
 */
function renderMythPanel() {
  if (!el.mythPanel && !el.mythSummary) return;
  if (!state.mythStatus) {
    hideMythUI();
    return;
  }
  const status = state.mythStatus;
  // If Mythomaniac player is eliminated, clear status
  if (!status.playerName || isEliminated(status.playerName)) {
    state.mythStatus = null;
    hideMythUI();
    return;
  }
  if (el.mythPlayerLabel) {
    el.mythPlayerLabel.textContent = t("myth.playerLabel", { name: status.playerName });
  }
  const completed = Boolean(status.completed);
  const waiting = state.narratorDay < 2; // Mythomaniac acts from Day 2
  const livingTargets = getLivingPlayers().filter((entry) => entry.name !== status.playerName); // Exclude self
  const hasTargets = livingTargets.length > 0;
  const actionable = !completed && !waiting && hasTargets; // Mythomaniac can act
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

  // If actionable, show the panel and hide summary
  if (el.mythPanel) el.mythPanel.classList.remove("hidden");
  showMythSummary(""); // Clear summary text

  // Populate target selection dropdown
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
    el.mythResultMessage.textContent = ""; // Clear previous messages
  }
}

/**
 * Starts a countdown timer for the narrator handoff.
 * @param {number} [seconds=5] - The number of seconds for the countdown.
 */
function startHandoffCountdown(seconds = 5) {
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

/**
 * Clears any active handoff countdown timer.
 */
function clearHandoffCountdown() {
  if (handoffTimerId) {
    clearInterval(handoffTimerId);
    handoffTimerId = null;
  }
  if (state.handoffCountdown !== 0) {
    state.handoffCountdown = 0; // Reset counter
  }
  updateHandoffTimer(); // Update UI to reflect cleared timer
}

/**
 * Updates the display of the handoff countdown timer.
 */
function updateHandoffTimer() {
  if (!el.handoffTimer || !el.openSummaryBtn) return;
  if (state.handoffCountdown > 0) {
    el.handoffTimer.textContent = t("handoffNotice.timer", { seconds: state.handoffCountdown });
    el.handoffTimer.classList.remove("hidden");
    el.openSummaryBtn.disabled = true; // Disable button during countdown
  } else {
    el.handoffTimer.textContent = "";
    el.handoffTimer.classList.add("hidden");
    el.openSummaryBtn.disabled = false; // Enable button after countdown
  }
}

/**
 * Generates the localized result text for the Mythomaniac's transformation.
 * @param {object} status - The Mythomaniac status object.
 * @returns {string} The result message.
 */
function getMythResultText(status) {
  if (!status || !status.playerName) return "";
  const mythName = status.playerName;
  const target = status.targetName || t("myth.noTargets"); // Display target name or a fallback
  if (status.outcome === "wolf") return t("myth.result.wolf", { name: mythName, target });
  if (status.outcome === "seer") return t("myth.result.seer", { name: mythName, target });
  return t("myth.result.human", { name: mythName, target });
}

/**
 * Retrieves the localized role name from an eliminated player entry.
 * Provides fallback if role information is missing.
 * @param {object} entry - The eliminated player entry.
 * @returns {string} The localized role name or a fallback.
 */
function getRoleNameFromEntry(entry) {
  if (!entry) return t("log.unknownRole");
  if (entry.roleId) {
    const localized = getRoleContent(entry.roleId);
    if (localized?.name) return localized.name;
  }
  // Fallback to deck if roleId not directly on entry (old data structure compatibility)
  const index = state.players.findIndex((player) => player === entry.name);
  const fallbackCard = index >= 0 ? state.deck[index] : null;
  if (fallbackCard) {
    const localized = getRoleContent(fallbackCard.roleId);
    if (localized?.name) return localized.name;
  }
  return t("log.unknownRole");
}

/**
 * Applies the Mythomaniac's transformation based on the selected target.
 * Updates the Mythomaniac's role in the deck and marks the action as completed.
 */
function applyMythTransformation() {
  if (!state.mythStatus || state.mythStatus.completed) return;
  if (state.narratorDay < 2) return; // Mythomaniac acts on Day 2 or later
  if (!el.mythTargetSelect) return;
  const targetName = el.mythTargetSelect.value;
  if (!targetName) return; // No target selected
  const targetIndex = state.players.findIndex((name) => name === targetName);
  if (targetIndex === -1) return; // Target player not found
  const targetCard = state.deck[targetIndex];
  const outcome = determineMythOutcome(targetCard); // Determine outcome based on target's role

  // Change Mythomaniac's role based on outcome
  if (outcome === "wolf") {
    state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.werewolf);
  } else if (outcome === "seer") {
    state.deck[state.mythStatus.playerIndex] = createCard(ROLE_LIBRARY.seer);
  }
  // Update Mythomaniac status
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

/**
 * Determines the outcome of the Mythomaniac's transformation based on the target's card.
 * @param {object} card - The target player's role card.
 * @returns {string} The outcome ('wolf', 'seer', or 'human').
 */
function determineMythOutcome(card) {
  if (!card) return "human"; // Default if no card (e.g., target invalid)
  if (card.roleId === "seer") return "seer";
  if (card.team === "wolves") return "wolf";
  return "human";
}

/**
 * Advances the game to the next day.
 * Prompts for confirmation and resets relevant game state for the new day.
 */
function advanceDay() {
  if (state.victory) return; // Cannot advance day if game is over
  if (mythRequiresAction()) {
    renderMythPanel(); // Re-render to show warning
    if (el.mythResultMessage) el.mythResultMessage.textContent = t("myth.completeWarning");
    return;
  }
  const hasCap = typeof state.maxDays === "number" && Number.isFinite(state.maxDays);
  if (hasCap && state.narratorDay >= state.maxDays) return; // Prevent advancing past max days if capped

  const nextDay = state.narratorDay + 1;
  confirmAction(
    t("confirmation.nextDay", { day: nextDay }),
    () => {
      state.narratorDay += 1;
      state.guideStepIndex = 0; // Reset guide to first step for new day
      state.playerVotes = {}; // Reset votes for the new day's voting
      state.indiziatoPlayers = []; // Clear suspects for the new day
      // Lock all existing eliminated players; they cannot be revived from previous days
      state.eliminatedPlayers = state.eliminatedPlayers.map((entry) => ({
        ...entry,
        locked: true,
      }));
      renderSummaryList();
      updateNarratorUI();
    },
  );
}

// ==========================================================================
// MODAL & OVERLAY MANAGEMENT
// ==========================================================================

/**
 * Displays a generic confirmation modal.
 * @param {string} message - The message to display in the modal.
 * @param {Function} onConfirm - The callback function to execute if the user confirms.
 */
function confirmAction(message, onConfirm) {
  el.modalTitle.textContent = t("modal.title");
  el.modalMessage.textContent = message;
  el.modalOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // Prevent background scrolling

  // Event handlers for modal buttons
  const cleanup = () => {
    el.modalOverlay.classList.add("hidden");
    document.body.style.overflow = "";
    el.modalCancel.removeEventListener("click", cancelHandler);
    el.modalConfirm.removeEventListener("click", confirmHandler);
  };
  const cancelHandler = () => cleanup();
  const confirmHandler = () => {
    cleanup();
    if (typeof onConfirm === "function") onConfirm(); // Execute callback on confirm
  };
  el.modalCancel.addEventListener("click", cancelHandler);
  el.modalConfirm.addEventListener("click", confirmHandler);
}

/**
 * Opens the immersion tips and rules modal.
 */
function openInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the immersion tips and rules modal.
 */
function closeInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

/**
 * Scrolls the window to the bottom of the page, typically used during reveal phase.
 */
function scrollToBottom() {
  if (state.view !== "reveal") return;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });
}

/**
 * Retrieves a list of currently living players and their assigned cards.
 * @returns {Array<object>} An array of objects { name: string, card: object }.
 */
function getLivingPlayers() {
  return state.players
    .map((name, index) => ({ name, card: state.deck[index] }))
    .filter((entry) => !isEliminated(entry.name));
}

/**
 * Computes the victory outcome based on the current set of eliminated players.
 * This is the core logic for determining if a team has won.
 * @param {Set<string>} eliminatedSet - A set of names of currently eliminated players.
 * @param {boolean} [isNightKill=false] - True if simulating a night kill scenario (affects wolf win condition).
 * @returns {object|null} An object { team: string, survivors: Array } if a victory is detected, otherwise null.
 */
function computeVictoryOutcomeFromSet(eliminatedSet, isNightKill = false) {
  if (!state.deck.length || !state.players.length) return null;
  if (state.deck.length < state.players.length) return null; // Deck must match players

  // Filter for living players
  const living = state.players
    .map((name, index) => ({ name, card: state.deck[index] }))
    .filter((entry) => !eliminatedSet.has(entry.name));

  if (!living.length) return null; // No one left alive

  const wolves = living.filter((entry) => entry.card?.team === "wolves");
  const humans = living.filter((entry) => entry.card?.team === "humans");
  const hamsters = living.filter((entry) => entry.card?.roleId === "werehamster");

  // Werehamster wins alone if they are the only one left
  if (hamsters.length && hamsters.length === living.length) {
    return { team: "loner", survivors: living };
  }

  // Village wins if no wolves remain
  if (!wolves.length) {
    if (hamsters.length) return { team: "loner", survivors: hamsters }; // If hamsters are left, they win
    return { team: "humans", survivors: living };
  }

  // Wolves win if their count is greater than or equal to humans
  // Special case for night kill: if wolves + 1 (the one being killed) >= humans, wolves win
  const unstoppableWolves = isNightKill && !hamsters.length && wolves.length > 0 && humans.length === wolves.length + 1 && humans.length > 1;
  if (unstoppableWolves) {
    return { team: "wolves", survivors: wolves };
  }
  if (wolves.length >= humans.length) {
    if (hamsters.length) return { team: "loner", survivors: hamsters }; // If hamsters are left, they win
    return { team: "wolves", survivors: living };
  }
  return null; // No victory condition met yet
}

/**
 * Retrieves the players who are considered "survivors" for the victory screen.
 * This can be all living players or specific winners based on the victory type.
 * @returns {Array<object>} An array of player objects ({ name, card }).
 */
function getVictorySurvivors() {
  if (!state.victory) return getLivingPlayers(); // If no victory, just return all living
  if (state.victory.winners) {
    // If specific winners are stored, reconstruct their cards
    return state.victory.winners.map((entry) => ({
      name: entry.name,
      card: entry.card ? createCard(ROLE_LIBRARY[entry.card.roleId]) : null, // Recreate card object
    }));
  }
  if (Array.isArray(state.victory.survivors)) {
    // Legacy support for older state structure
    return state.victory.survivors.map((entry) => ({
      name: entry.name,
      card: entry.roleId ? createCard(ROLE_LIBRARY[entry.roleId]) : null,
    }));
  }
  return getLivingPlayers();
}

/**
 * Evaluates the current game state for victory conditions and triggers the
 * victory screen if a team has won.
 */
function evaluateVictoryConditions() {
  if (state.victory) return; // Don't re-evaluate if game is already over
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  const outcome = computeVictoryOutcomeFromSet(eliminatedSet, false); // Check for victory after lynch
  if (outcome) {
    showVictoryScreen(outcome);
  }
}

/**
 * Displays the final victory screen, showing the winning team and surviving players.
 * @param {object} outcome - The victory outcome object { team: string, survivors: Array }.
 */
function showVictoryScreen({ team }) {
  // Calculate all players (living and dead) and their roles for display
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

  // Store the victory state
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

  // Render winning players
  state.victory.winners.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    if (entry.eliminated) li.classList.add("dead"); // Mark dead winners

    if (entry.card && entry.card.image) {
      const localized = getRoleContent(entry.card.roleId);
      const img = document.createElement("img");
      img.className = "summary-thumb";
      img.src = entry.card.image;
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

/**
 * Renders the victory screen using the already stored `state.victory` data.
 * Used when restoring state or re-rendering.
 */
function renderVictoryFromState() {
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
      img.src = entry.card.image;
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

/**
 * Returns localized title and subtitle for a given winning team.
 * @param {string} team - The winning team ('wolves', 'humans', 'loner').
 * @returns {object} An object { title: string, subtitle: string }.
 */
function getVictoryText(team) {
  if (team === "wolves") {
    return { title: t("victory.wolves.title"), subtitle: t("victory.wolves.subtitle") };
  }
  if (team === "loner") {
    return { title: t("victory.hamster.title"), subtitle: t("victory.hamster.subtitle") };
  }
  return { title: t("victory.village.title"), subtitle: t("victory.village.subtitle") };
}

/**
 * Hides all main view sections and displays the specified view.
 * @param {string} view - The ID of the view to show ('setup', 'reveal', 'summary', 'final').
 */
function showView(view) {
  if (view !== "reveal") clearHandoffCountdown(); // Clear handoff timer if not in reveal view
  // Hide all main views
  [el.setupView, el.revealView, el.summaryView, el.finalView].forEach((section) => {
    section.classList.add("hidden");
  });
  // Show the requested view
  if (view === "setup") el.setupView.classList.remove("hidden");
  if (view === "reveal") el.revealView.classList.remove("hidden");
  if (view === "summary") el.summaryView.classList.remove("hidden");
  if (view === "final") el.finalView.classList.remove("hidden");

  // Restore roles details panel state if returning to setup
  if (view === "setup" && el.rolesDetails) {
    el.rolesDetails.open = state.rolesDetailsOpen;
  }
  state.view = view; // Update current view in state
  toggleLanguageMenu(false); // Close language menu when changing views
  updateFooterVisibility(); // Update footer visibility based on view
  persistState(); // Persist view change
}

/**
 * Toggles the visibility of the info footer based on the current view.
 */
function updateFooterVisibility() {
  if (!el.infoFooter) return;
  el.infoFooter.classList.toggle("hidden", state.view !== "setup"); // Show only on setup view
}

/**
 * Resets the game to its initial state.
 * @param {object} [options] - Options for resetting the game.
 * @param {boolean} [options.preserveNames=true] - If true, keeps custom player names.
 */
function resetGame({ preserveNames = true } = {}) {
  // Preserve current player and wolf counts for convenience
  const preservedPlayerCount = el.playerCount.value;
  const preservedWolfCount = el.wolfCount.value;

  clearHandoffCountdown();
  state.deck = [];
  state.players = [];
  state.revealIndex = 0;
  if (!preserveNames) state.customNames = []; // Clear custom names if not preserving
  state.activeSpecialIds = getSelectedSpecials().map((item) => item.roleId); // Keep selected special roles
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
  state.playerVotes = {}; // Reset votes
  state.benvenutoPlayer = null; // Reset Benvenuto

  el.playerNameInput.value = ""; // Clear player name input
  // Restore preserved player/wolf counts
  el.playerCount.value = preservedPlayerCount || el.playerCount.min || String(MIN_PLAYERS);
  el.wolfCount.value = preservedWolfCount || el.wolfCount.min || "1";

  el.openSummaryBtn.classList.add("hidden"); // Hide summary button
  renderPlayerList(); // Re-render player list (will be empty if names not preserved)
  updateWolfHint();
  clampWolfCount();
  enforceRoleLimits();
  updateDeckPreview();
  el.handoffNotice.classList.add("hidden"); // Hide handoff notice
  showView("setup"); // Return to setup view
}