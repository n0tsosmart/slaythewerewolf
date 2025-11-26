// ========================================
// UI/UX ENHANCEMENTS (Mobile-First)
// ========================================

// Smooth page load
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = `opacity ${PAGE_FADE_DURATION / 1000}s ease`;
    document.body.style.opacity = '1';
  });
});

// FIXED: Ripple effect only on clicked button
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

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Toast notification system
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

// Form validation feedback
document.querySelectorAll('input, select, textarea').forEach(input => {
  input.addEventListener('invalid', (e) => {
    e.preventDefault();
    input.style.animation = `shake ${ANIMATION_SHAKE_DURATION / 1000}s ease`;
    setTimeout(() => input.style.animation = '', ANIMATION_SHAKE_DURATION);
  });
});

// Debounce utility
window.debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// ========================================
// END UI/UX ENHANCEMENTS
// ========================================


// ========================================
// CONSTANTS
// ========================================

const MIN_PLAYERS = 5;

// UI/UX Timing Constants
const TOAST_DURATION = 2500;
const RIPPLE_DURATION = 500;
const HAPTIC_VIBRATION_DURATION = 8;
const ANIMATION_SHAKE_DURATION = 300;
const PAGE_FADE_DURATION = 400;

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


function formatString(template, vars = {}) {
  return template.replace(/\{(.*?)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`));
}

function t(key, vars) {
  const langPack = TRANSLATIONS[state.language] || TRANSLATIONS[DEFAULT_LANGUAGE];
  const fallback = TRANSLATIONS[DEFAULT_LANGUAGE][key];
  const template = langPack[key] ?? fallback ?? key;
  return vars ? formatString(template, vars) : template;
}

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

function setLanguage(lang, { skipPersist = false, skipRender = false } = {}) {
  state.language = TRANSLATIONS[lang] ? lang : DEFAULT_LANGUAGE;
  if (el.languageSelect) el.languageSelect.value = state.language;
  updateLanguageButtons();
  if (typeof document !== "undefined") {
    document.documentElement.lang = state.language;
  }
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
  if (!skipRender) {
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
  }
  updateRoleSummary();
  if (!skipPersist) persistState();
}

function getRoleContent(roleId) {
  const base = ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager;
  const locale = base.locales?.[state.language] || {};
  return {
    name: locale.name || base.name,
    teamLabel: locale.teamLabel || base.teamLabel,
    description: locale.description || base.description,
  };
}

const STORAGE_KEY = "SLAY_STATE";

const state = {
  deck: [],
  players: [],
  revealIndex: 0,
  revealComplete: false,
  customNames: [],
  activeSpecialIds: [],
  narratorDay: 1,
  maxDays: 1,
  eliminatedPlayers: [],
  guideSteps: [],
  guideStepIndex: 0,
  victory: null,
  playersCollapsed: false,
  rolesDetailsOpen: false,
  guideExpanded: true,
  language: DEFAULT_LANGUAGE,
  view: "setup",
  mythStatus: null,
  handoffCountdown: 0,
  playerVotes: {},  // { playerName: voteCount }
  benvenutoPlayer: null,  // Name of the most recently lynched player
};

let suppressLivingToggle = false;
let handoffTimerId = null;

const el = {
  setupView: document.getElementById("setupView"),
  revealView: document.getElementById("revealView"),
  summaryView: document.getElementById("summaryView"),
  rolesDetails: document.getElementById("rolesDetails"),
  setupForm: document.getElementById("setupForm"),
  playerCount: document.getElementById("playerCount"),
  wolfCount: document.getElementById("wolfCount"),
  wolfHint: document.getElementById("wolfHint"),
  playerNameInput: document.getElementById("playerNameInput"),
  addPlayerBtn: document.getElementById("addPlayerBtn"),
  playerList: document.getElementById("playerList"),
  reorderHint: document.getElementById("reorderHint"),
  clearPlayersBtn: document.getElementById("clearPlayersBtn"),
  validationMessage: document.getElementById("validationMessage"),
  roleOptions: document.getElementById("roleOptions"),
  revealBtn: document.getElementById("revealBtn"),
  hideBtn: document.getElementById("hideBtn"),
  roleCard: document.getElementById("roleCard"),
  roleImage: document.getElementById("roleImage"),
  handoffNotice: document.getElementById("handoffNotice"),
  handoffTimer: document.getElementById("handoffTimer"),
  revealStatus: document.getElementById("revealStatus"),
  roleTeam: document.getElementById("roleTeam"),
  roleName: document.getElementById("roleName"),
  roleDescription: document.getElementById("roleDescription"),
  playerProgress: document.getElementById("playerProgress"),
  currentPlayerLabel: document.getElementById("currentPlayerLabel"),
  summaryList: document.getElementById("summaryList"),
  livingDetails: document.getElementById("livingDetails"),
  livingCount: document.getElementById("livingCount"),
  fallenDetails: document.getElementById("fallenDetails"),
  fallenList: document.getElementById("fallenList"),
  fallenCount: document.getElementById("fallenCount"),
  mythPanel: document.getElementById("mythPanel"),
  mythStatusTag: document.getElementById("mythStatusTag"),
  mythPlayerLabel: document.getElementById("mythPlayerLabel"),
  mythInstructions: document.getElementById("mythInstructions"),
  mythTargetSelect: document.getElementById("mythTargetSelect"),
  mythConfirmBtn: document.getElementById("mythConfirmBtn"),
  mythResultMessage: document.getElementById("mythResultMessage"),
  mythSummary: document.getElementById("mythSummary"),
  mythSummaryText: document.getElementById("mythSummaryText"),
  infoFooter: document.getElementById("infoFooter"),
  restartBtn: document.getElementById("restartBtn"),
  openSummaryBtn: document.getElementById("openSummaryBtn"),
  dayCounter: document.getElementById("dayCounter"),
  nextDayBtn: document.getElementById("nextDayBtn"),
  guideProgress: document.getElementById("guideProgress"),
  guideStepText: document.getElementById("guideStepText"),
  guideFullList: document.getElementById("guideFullList"),
  guideNav: document.getElementById("guideNav"),
  toggleGuideMode: document.getElementById("toggleGuideMode"),
  prevGuideStep: document.getElementById("prevGuideStep"),
  nextGuideStep: document.getElementById("nextGuideStep"),
  eliminationSelect: document.getElementById("eliminationSelect"),
  eliminateBtn: document.getElementById("eliminateBtn"),
  finalView: document.getElementById("finalView"),
  victoryTitle: document.getElementById("victoryTitle"),
  victorySubtitle: document.getElementById("victorySubtitle"),
  victoryList: document.getElementById("victoryList"),
  finalNewGameBtn: document.getElementById("finalNewGameBtn"),
  modalOverlay: document.getElementById("modalOverlay"),
  modalTitle: document.getElementById("modalTitle"),
  modalMessage: document.getElementById("modalMessage"),
  modalCancel: document.getElementById("modalCancel"),
  modalConfirm: document.getElementById("modalConfirm"),
  languageSelect: document.getElementById("languageSelect"),
  languageToggle: document.getElementById("languageToggle"),
  languageFlag: document.getElementById("languageFlag"),
  languageMenu: document.getElementById("languageMenu"),
  languageButtons: document.querySelectorAll("[data-lang-button]"),
  languagePicker: document.querySelector(".language-picker"),
  infoButton: document.getElementById("infoButton"),
  infoOverlay: document.getElementById("infoOverlay"),
  infoClose: document.getElementById("infoClose"),
  roleSummary: document.getElementById("roleSummary"),
  roleSummaryContent: document.getElementById("roleSummaryContent"),
  menuBtn: document.getElementById("menuBtn"),
  mainMenu: document.getElementById("mainMenu"),
  menuVotingBtn: document.getElementById("menuVotingBtn"),
  menuImmersionBtn: document.getElementById("menuImmersionBtn"),
  votingOverlay: document.getElementById("votingOverlay"),
  votingClose: document.getElementById("votingClose"),
};

init();

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
    // Only log in development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.warn("Unable to save the game state", error);
    }
  }
}

function restoreFromStorage() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.playerCount) el.playerCount.value = data.playerCount;
    if (data.wolfCount) el.wolfCount.value = data.wolfCount;
    if (Array.isArray(data.selectedSpecialIds)) {
      el.roleOptions.querySelectorAll(".role-option").forEach((input) => {
        input.checked = data.selectedSpecialIds.includes(input.value);
      });
    }
    state.customNames = Array.isArray(data.customNames) ? [...data.customNames] : [];
    renderPlayerList();
    clampWolfCount();
    enforceRoleLimits();
    updateDeckPreview();
    updateRoleSummary();
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
    state.mythStatus = normalizeMythStatus(data.mythStatus);
    state.victory = data.victory || null;
    state.guideStepIndex = data.guideStepIndex || 0;
    state.playersCollapsed = Boolean(data.playersCollapsed);
    state.rolesDetailsOpen = false;  // Always start collapsed on page load
    state.guideExpanded = data.guideExpanded !== undefined ? Boolean(data.guideExpanded) : true;
    state.view = data.view || "setup";
    if (state.view === "handoff") {
      state.view = "reveal";
      state.revealComplete = true;
    }
    state.language = data.language || DEFAULT_LANGUAGE;
    state.playerVotes = data.playerVotes || {};
    state.benvenutoPlayer = data.benvenutoPlayer || null;

    if (el.rolesDetails) el.rolesDetails.open = state.rolesDetailsOpen;
    setLanguage(state.language, { skipPersist: true, skipRender: true });
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
    updateEliminationSelect();
  } catch (error) {
    // Only log in development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.warn("Unable to restore the game state", error);
    }
  }
}

function init() {
  renderRoleOptions();
  attachEvents();
  updateWolfHint();
  clampWolfCount();
  enforceRoleLimits();
  updateDeckPreview();
  updateRoleSummary();
  renderPlayerList();
  restoreFromStorage();
  setLanguage(state.language, { skipPersist: true });
  showView(state.view || "setup");
}

function attachEvents() {
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

  el.addPlayerBtn.addEventListener("click", handleAddPlayer);
  el.playerNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddPlayer();
    }
  });

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

  el.clearPlayersBtn.addEventListener("click", () => {
    state.customNames = [];
    renderPlayerList();
    persistState();
  });

  el.setupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    startGame();
  });

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
  el.restartBtn.addEventListener("click", () => confirmAction(t("confirmation.restart"), resetGame));
  el.nextDayBtn.addEventListener("click", advanceDay);
  el.prevGuideStep.addEventListener("click", () => changeGuideStep(-1));
  el.nextGuideStep.addEventListener("click", () => changeGuideStep(1));
  el.summaryList.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    // Handle vote buttons
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



    // Handle eliminate/revive/lynch button
    const button = event.target.closest(".mini-action");
    if (!button) return;

    if (button.classList.contains("lynch-btn")) {
      lynchPlayer(button.dataset.player || "");
    } else {
      toggleElimination(button.dataset.player || "");
    }
  });
  el.finalNewGameBtn.addEventListener("click", () => confirmAction(t("confirmation.newGame"), resetGame));
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

  // Toggle list view mode (grid vs horizontal scroll)
  const toggleListViewBtn = document.getElementById("toggleListView");
  if (toggleListViewBtn && el.summaryList) {
    const VIEW_MODE_KEY = "slay_werewolf_view_mode";

    // Load saved state or default to vertical list
    const savedMode = localStorage.getItem(VIEW_MODE_KEY);
    const isHorizontal = savedMode === "horizontal"; // Default to vertical list

    if (isHorizontal) {
      el.summaryList.classList.add("horizontal-scroll");
    } else {
      el.summaryList.classList.remove("horizontal-scroll");
    }

    // Update initial icon
    const icon = toggleListViewBtn.querySelector(".view-icon");
    if (icon) {
      icon.textContent = isHorizontal ? "☰" : "⊞";
    }

    toggleListViewBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent details toggle
      el.summaryList.classList.toggle("horizontal-scroll");

      const isNowHorizontal = el.summaryList.classList.contains("horizontal-scroll");
      localStorage.setItem(VIEW_MODE_KEY, isNowHorizontal ? "horizontal" : "vertical");

      // Update icon
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
      setLanguage(event.target.value);
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
        if (lang) setLanguage(lang);
        // Don't close menu here to allow user to see change
      });
    });
  }

  // Hamburger Menu
  if (el.menuBtn && el.mainMenu) {
    el.menuBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleMainMenu(el.mainMenu.classList.contains("hidden"));
    });
    document.addEventListener("click", (event) => {
      if (!el.mainMenu || el.mainMenu.classList.contains("hidden")) return;
      if (el.menuBtn && event.target instanceof Node && el.menuBtn.contains(event.target)) return;
      if (el.mainMenu.contains(event.target)) return; // Don't close if clicking inside menu
      toggleMainMenu(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") toggleMainMenu(false);
    });
  }

  // Voting Modal
  if (el.menuVotingBtn) {
    el.menuVotingBtn.addEventListener("click", () => {
      toggleMainMenu(false);
      openVotingModal();
    });
  }
  // Voting Modal from Summary View
  const openVotingFromSummary = document.getElementById("openVotingFromSummary");
  if (openVotingFromSummary) {
    openVotingFromSummary.addEventListener("click", openVotingModal);
  }
  if (el.votingClose) {
    el.votingClose.addEventListener("click", closeVotingModal);
  }

  // Immersion Modal (from menu)
  if (el.menuImmersionBtn) {
    el.menuImmersionBtn.addEventListener("click", () => {
      toggleMainMenu(false);
      openInfoModal();
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
  if (el.infoClose) el.infoClose.addEventListener("click", closeInfoModal);
  if (el.infoOverlay) {
    el.infoOverlay.addEventListener("click", (event) => {
      if (event.target === el.infoOverlay) closeInfoModal();
    });
  }
}

function renderRoleOptions() {
  el.roleOptions.innerHTML = "";
  OPTIONAL_CONFIG.forEach((config) => {
    const role = ROLE_LIBRARY[config.roleId];
    const localized = getRoleContent(role.id);
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
    tag.className = `tag ${role.team}`;
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
  enforceRoleLimits();
}

function updateWolfHint() {
  const playerTotal = Number(el.playerCount.value) || 0;
  const recommended = recommendWolves(playerTotal);
  el.wolfHint.textContent = t("setup.wolfHint", { count: recommended });
}

function recommendWolves(playerTotal) {
  if (playerTotal < 8) return 1;
  if (playerTotal < 16) return 2;
  return 3;
}

function autoAdjustWolvesFromPlayers() {
  const playerTotal = Number(el.playerCount.value) || 0;
  if (playerTotal <= 0) return;
  const recommended = recommendWolves(playerTotal);
  const limit = Math.max(1, playerTotal - 1);
  const adjusted = Math.max(1, Math.min(recommended, limit));
  el.wolfCount.value = String(adjusted);
}

function adjustNumberInput(input, delta) {
  const min = Number(input.min) || Number.NEGATIVE_INFINITY;
  const max = Number(input.max) || Number.POSITIVE_INFINITY;
  let value = Number(input.value) || 0;
  value += delta;
  value = Math.min(max, Math.max(min, value));
  input.value = String(value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function clampWolfCount() {
  const playerTotal = Number(el.playerCount.value) || 0;
  let wolves = Number(el.wolfCount.value) || 1;
  if (wolves < 1) wolves = 1;
  if (playerTotal > 0) {
    wolves = Math.min(wolves, Math.max(1, playerTotal - 1));
  }
  el.wolfCount.value = String(wolves);
}

function enforceRoleLimits() {
  const inputs = el.roleOptions.querySelectorAll("input[type='checkbox']");
  inputs.forEach((input) => {
    input.disabled = false;
    const optionItem = input.closest(".option-item");
    if (optionItem) optionItem.classList.remove("option-disabled");
  });
}

function getSelectedSpecials() {
  return Array.from(el.roleOptions.querySelectorAll("input:checked")).map((input) => ({
    roleId: input.value,
    copies: Number(input.dataset.copies || "1"),
  }));
}

function updateDeckPreview() {
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

function updateRoleSummary() {
  if (!el.roleSummary || !el.roleSummaryContent) return;

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specialsSelected = getSelectedSpecials();

  if (playerTotal < MIN_PLAYERS) {
    el.roleSummary.classList.add("hidden");
    return;
  }

  // Build role counts
  const roleCounts = {};

  // Add werewolves
  if (wolfTotal > 0) {
    const wolfRole = getRoleContent("werewolf");
    roleCounts[wolfRole.name] = wolfTotal;
  }

  // Add seer (always included)
  const seerRole = getRoleContent("seer");
  roleCounts[seerRole.name] = 1;

  // Add special roles
  specialsSelected.forEach((special) => {
    const roleContent = getRoleContent(special.roleId);
    roleCounts[roleContent.name] = (roleCounts[roleContent.name] || 0) + special.copies;
  });

  // Calculate villagers
  const specialTotal = wolfTotal + 1 + specialsSelected.reduce((sum, item) => sum + item.copies, 0);
  const villagerCount = playerTotal - specialTotal;
  if (villagerCount > 0) {
    const villagerRole = getRoleContent("villager");
    roleCounts[villagerRole.name] = villagerCount;
  }

  // Render summary
  el.roleSummaryContent.innerHTML = "";
  Object.entries(roleCounts).forEach(([roleName, count]) => {
    const item = document.createElement("span");
    item.className = "role-summary-item";
    item.textContent = t("setup.rolesInDeck", { count, role: roleName });
    el.roleSummaryContent.appendChild(item);
  });

  el.roleSummary.classList.remove("hidden");
}

function handleAddPlayer() {
  const name = el.playerNameInput.value.trim();
  if (!name) return;
  state.customNames.push(name);
  el.playerNameInput.value = "";
  renderPlayerList();
  persistState();
}

function renderPlayerList() {
  el.playerList.innerHTML = "";
  state.customNames.forEach((name, index) => {
    const item = document.createElement("li");
    item.className = "player-chip";
    item.draggable = true;
    item.dataset.index = String(index);


    // Player name
    const nameSpan = document.createElement("span");
    nameSpan.className = "player-name";
    nameSpan.textContent = name;
    item.appendChild(nameSpan);

    // Actions container
    const actions = document.createElement("div");
    actions.className = "chip-actions";

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "chip-remove";
    removeButton.dataset.index = String(index);
    removeButton.setAttribute("aria-label", t("accessibility.removePlayer", { name }));
    removeButton.textContent = "×";
    actions.appendChild(removeButton);

    item.appendChild(actions);

    // Drag event listeners (desktop)
    item.addEventListener("dragstart", handleDragStart);
    item.addEventListener("dragover", handleDragOver);
    item.addEventListener("drop", handleDrop);
    item.addEventListener("dragend", handleDragEnd);
    item.addEventListener("dragenter", handleDragEnter);
    item.addEventListener("dragleave", handleDragLeave);

    // Touch event listeners (mobile)
    item.addEventListener("touchstart", handleTouchStart, { passive: false });
    item.addEventListener("touchmove", handleTouchMove, { passive: false });
    item.addEventListener("touchend", handleTouchEnd);

    el.playerList.appendChild(item);
  });

  const isEmpty = state.customNames.length === 0;
  el.clearPlayersBtn.classList.toggle("hidden", isEmpty);
  if (el.reorderHint) el.reorderHint.classList.toggle("hidden", isEmpty);
}

// Drag-and-drop handlers for player list
let draggedItem = null;
let draggedIndex = null;

function handleDragStart(event) {
  draggedItem = event.currentTarget;
  draggedIndex = Number(draggedItem.dataset.index);
  draggedItem.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", draggedItem.innerHTML);
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter(event) {
  const target = event.currentTarget;
  if (target !== draggedItem && target.classList.contains("player-chip")) {
    target.classList.add("drag-over");
  }
}

function handleDragLeave(event) {
  const target = event.currentTarget;
  target.classList.remove("drag-over");
}

function handleDrop(event) {
  event.stopPropagation();
  event.preventDefault();

  const target = event.currentTarget;
  target.classList.remove("drag-over");

  if (target !== draggedItem && target.classList.contains("player-chip")) {
    const targetIndex = Number(target.dataset.index);

    // Reorder the array
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    state.customNames.splice(targetIndex, 0, draggedName);

    // Re-render and persist
    renderPlayerList();
    persistState();
  }

  return false;
}

function handleDragEnd(event) {
  const target = event.currentTarget;
  target.classList.remove("dragging");

  // Clean up any remaining drag-over classes
  document.querySelectorAll(".player-chip").forEach((item) => {
    item.classList.remove("drag-over");
  });

  draggedItem = null;
  draggedIndex = null;
}

// Touch event handlers for mobile
let touchStartY = 0;
let touchCurrentItem = null;

function handleTouchStart(event) {
  touchCurrentItem = event.currentTarget;
  draggedItem = touchCurrentItem;
  draggedIndex = Number(touchCurrentItem.dataset.index);
  touchStartY = event.touches[0].clientY;

  // Add visual feedback
  touchCurrentItem.classList.add("dragging");
}

function handleTouchMove(event) {
  if (!touchCurrentItem) return;

  event.preventDefault(); // Prevent scrolling while dragging

  const touch = event.touches[0];
  const touchY = touch.clientY;

  // Find the element under the touch point
  const elementBelow = document.elementFromPoint(touch.clientX, touchY);
  const targetChip = elementBelow?.closest(".player-chip");

  // Remove drag-over from all items
  document.querySelectorAll(".player-chip").forEach((item) => {
    if (item !== touchCurrentItem) {
      item.classList.remove("drag-over");
    }
  });

  // Add drag-over to the target if it's different from the dragged item
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

    // Reorder the array
    const [draggedName] = state.customNames.splice(draggedIndex, 1);
    state.customNames.splice(targetIndex, 0, draggedName);

    // Re-render and persist
    renderPlayerList();
    persistState();
  }

  touchCurrentItem = null;
  draggedItem = null;
  draggedIndex = null;
}

function buildPlayerList(playerTotal) {
  const players = [];
  for (let i = 0; i < playerTotal; i += 1) {
    players.push(state.customNames[i] || t("status.defaultPlayer", { number: i + 1 }));
  }
  return players;
}

function buildDeck({ playerTotal, wolfTotal, specials }) {
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

function createCard(role) {
  const base = role || ROLE_LIBRARY.villager;
  return {
    roleId: base.id,
    name: base.name,
    team: base.team,
    teamLabel: base.teamLabel,
    description: base.description,
    image: base.image,
  };
}

function deckFromRoleIds(roleIds) {
  if (!Array.isArray(roleIds)) return [];
  return roleIds.map((roleId) => createCard(ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager));
}

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

function normalizeMythStatus(savedStatus) {
  if (!state.players.length) return null;
  if (savedStatus) {
    let index = -1;
    if (savedStatus.playerName) {
      index = state.players.findIndex((name) => name === savedStatus.playerName);
    }
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
  return detectMythStatusFromDeck();
}

function shuffle(deck) {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startGame() {
  enforceRoleLimits();
  if (!updateDeckPreview()) return;

  const playerTotal = Number(el.playerCount.value) || 0;
  const wolfTotal = Number(el.wolfCount.value) || 0;
  const specials = getSelectedSpecials();

  state.players = buildPlayerList(playerTotal);
  state.deck = buildDeck({ playerTotal, wolfTotal, specials });
  state.revealIndex = 0;
  state.activeSpecialIds = Array.from(new Set(specials.map((item) => item.roleId)));
  state.mythStatus = detectMythStatusFromDeck();
  state.eliminatedPlayers = [];
  state.narratorDay = 1;
  state.maxDays = state.activeSpecialIds.includes("bodyguard") ? null : Math.max(1, state.players.length);
  state.guideSteps = [];
  state.guideStepIndex = 0;
  state.victory = null;
  state.revealComplete = false;
  state.playerVotes = {};
  state.benvenutoPlayer = null;

  prepareReveal();
  showView("reveal");
  persistState();
}

function prepareReveal() {
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

function revealCard() {
  const card = state.deck[state.revealIndex];
  if (!card) return;
  el.roleCard.classList.remove("can-reveal");
  const roleText = getRoleContent(card.roleId);
  el.roleCard.dataset.team = card.team;
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
  el.revealBtn.classList.add("hidden");
  el.hideBtn.classList.remove("hidden");
  scrollToBottom();
}

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

function showCompletionState() {
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
  scrollToBottom();
}

function showSummary() {
  clearHandoffCountdown();
  renderSummaryList();
  updateNarratorUI();
  showView("summary");
  persistState();
}

function lynchPlayer(player) {
  if (!player) return;

  confirmAction(t("confirmation.lynch", { player }), () => {
    // Predict if this lynch will trigger a victory
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
      // Assign Benvenuto to this player
      state.benvenutoPlayer = player;
      // Reset votes after lynch
      state.playerVotes = {};
      renderSummaryList();
      persistState();
      evaluateVictoryConditions();
    };
    if (outcome) {
      // Confirm victory trigger with translated outcome
      const victoryText = getVictoryText(outcome.team);
      confirmAction(t("confirmation.eliminationVictory", { player, outcome: victoryText.title }), () => {
        doLynch();
      });
    } else {
      doLynch();
    }
  });
}

function computeIndiziatoPlayers() {
  const votes = state.playerVotes;
  const candidates = [];
  const voteCounts = {};

  // Calculate votes for alive players only
  state.players.forEach((player) => {
    const isAlive = !state.eliminatedPlayers.some((e) => e.name === player);
    if (isAlive) {
      voteCounts[player] = votes[player] || 0;
    }
  });

  const sortedPlayers = Object.keys(voteCounts).sort((a, b) => voteCounts[b] - voteCounts[a]);
  if (sortedPlayers.length === 0) return [];

  // If no votes at all, no suspects
  if (voteCounts[sortedPlayers[0]] === 0) return [];

  // Top 1
  candidates.push(sortedPlayers[0]);

  // Find second place
  if (sortedPlayers.length > 1) {
    const firstScore = voteCounts[sortedPlayers[0]];
    // Check for ties for first place
    const firstTies = sortedPlayers.filter((p) => voteCounts[p] === firstScore);

    if (firstTies.length >= 2) {
      // Tie for first place: pick the two closest to Benvenuto (clockwise)
      // Actually, rules say: "The two players with most votes... In case of tie, choose who is closest to Benvenuto"
      // If 3 people have 5 votes, we pick the 2 closest to Benvenuto.
      const benIdx = state.benvenutoPlayer ? state.players.indexOf(state.benvenutoPlayer) : -1;
      firstTies.sort((a, b) => {
        const idxA = state.players.indexOf(a);
        const idxB = state.players.indexOf(b);
        // If benIdx is -1 (no benvenuto), fallback to index order or random? Standard index order is fine.
        if (benIdx === -1) return idxA - idxB;

        // Distance clockwise from Benvenuto (starting from left)
        // (TargetIndex - StartIndex + Length) % Length
        // We want the one to the LEFT of Benvenuto to be "closest" in clockwise order?
        // Rules: "partendo da chi è a sinistra di quello che ha il “Benvenuto!”" -> starting from left of Benvenuto.
        // Left of Benvenuto means index + 1 (clockwise).
        const distA = (idxA - benIdx + state.players.length) % state.players.length;
        const distB = (idxB - benIdx + state.players.length) % state.players.length;
        return distA - distB;
      });
      return [firstTies[0], firstTies[1]];
    } else {
      // No tie for first place. Look for second place.
      const secondScore = voteCounts[sortedPlayers[1]];

      // IMPORTANT: Second place must have > 0 votes
      if (secondScore === 0) return candidates;

      const secondTies = sortedPlayers.filter((p) => voteCounts[p] === secondScore);

      if (secondTies.length === 1) {
        candidates.push(secondTies[0]);
      } else {
        // Tie for second place
        const benIdx = state.benvenutoPlayer ? state.players.indexOf(state.benvenutoPlayer) : -1;
        secondTies.sort((a, b) => {
          const idxA = state.players.indexOf(a);
          const idxB = state.players.indexOf(b);
          if (benIdx === -1) return idxA - idxB;
          const distA = (idxA - benIdx + state.players.length) % state.players.length;
          const distB = (idxB - benIdx + state.players.length) % state.players.length;
          return distA - distB;
        });
        candidates.push(secondTies[0]);
      }
    }
  }

  return candidates;
}

function renderSummaryList() {
  if (!el.summaryList) {
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
  el.summaryList.innerHTML = "";
  const winnerEntries = state.victory ? getVictorySurvivors() : null;
  const winnersSet = winnerEntries ? new Set(winnerEntries.map((entry) => entry.name)) : null;
  let renderedCount = 0;

  // Compute automatic indiziato players
  const indiziatoPlayers = computeIndiziatoPlayers();

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
      img.src = card.image;
      img.alt = localized ? localized.name : "Role image";
      listItem.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "summary-info";

    // Name row with badges
    const nameRow = document.createElement("div");
    nameRow.className = "summary-name-row";
    const name = document.createElement("span");
    name.className = "summary-name";
    name.textContent = player;
    nameRow.appendChild(name);
    info.appendChild(nameRow);

    // Badges container (absolute positioned)
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

    // Action buttons container
    const actions = document.createElement("div");
    actions.className = "summary-actions";



    // Eliminate/Revive button
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.className = "mini-action";
    actionBtn.dataset.player = player;

    // Check if player is wolf or hamster (cannot be sbranato)
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
      // Only humans can be sbranato
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

    // Lynch button (only for alive players and if no one has been lynched this turn)
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
      actions.insertBefore(lynchBtn, actionBtn);
    }

    listItem.appendChild(actions);
    el.summaryList.appendChild(listItem);
    if (isAlive) renderedCount += 1;
  });

  if (renderedCount === 0) {
    const empty = document.createElement("li");
    empty.className = "help";
    empty.textContent = t("living.empty");
    el.summaryList.appendChild(empty);
  }
  // Always use single column in list view (removed two-column toggle)
  if (el.livingCount) el.livingCount.textContent = String(renderedCount);
  renderFallenList();
  renderMythPanel();
  updateEliminationSelect();
}

function updateLanguageButtons() {
  if (el.languageButtons && el.languageButtons.length) {
    el.languageButtons.forEach((button) => {
      const isActive = button.dataset.langButton === state.language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }
  if (el.languageFlag) el.languageFlag.textContent = getLanguageFlag(state.language);
}

function toggleMainMenu(forceState) {
  if (!el.mainMenu || !el.menuBtn) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.mainMenu.classList.contains("hidden");
  el.mainMenu.classList.toggle("hidden", !shouldShow);
  el.mainMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.menuBtn.setAttribute("aria-expanded", String(shouldShow));
}

function openVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeVotingModal() {
  if (!el.votingOverlay) return;
  el.votingOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function getLanguageFlag(lang) {
  if (lang === "es") return "🇪🇸";
  if (lang === "it") return "🇮🇹";
  return "🇬🇧";
}

function toggleLanguageMenu(forceState) {
  if (!el.languageMenu || !el.languageToggle) return;
  const shouldShow = typeof forceState === "boolean" ? forceState : el.languageMenu.classList.contains("hidden");
  el.languageMenu.classList.toggle("hidden", !shouldShow);
  el.languageMenu.setAttribute("aria-hidden", String(!shouldShow));
  el.languageToggle.classList.toggle("active", shouldShow);
  el.languageToggle.setAttribute("aria-expanded", String(shouldShow));
}

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
  if (el.eliminateBtn) el.eliminateBtn.disabled = disabled;
}

function eliminateFromSelect() {
  if (!el.eliminationSelect) return;
  const name = el.eliminationSelect.value;
  if (!name || isEliminated(name)) return;
  promptElimination(name, {
    afterConfirm: () => {
      el.eliminationSelect.value = "";
    },
  });
}

function toggleElimination(player) {
  if (state.victory) return;
  if (!player) return;
  const index = state.eliminatedPlayers.findIndex((e) => e.name === player);
  if (index >= 0) {
    // Revive
    if (state.eliminatedPlayers[index].locked) return; // Cannot revive locked players
    state.eliminatedPlayers.splice(index, 1);

    // If this player was Benvenuto, clear it
    if (state.benvenutoPlayer === player) {
      state.benvenutoPlayer = null;
    }
  } else {
    // Eliminate (Sbranato) - DO NOT assign Benvenuto
    state.eliminatedPlayers.push({ name: player, locked: false, type: 'sbranato', day: state.narratorDay });
  }
  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
}

function isEliminated(name) {
  return state.eliminatedPlayers.some((entry) => entry.name === name);
}

function addEliminationEntry(name, type = "lynch") {
  const playerIndex = state.players.findIndex((player) => player === name);
  const roleId = playerIndex >= 0 && state.deck[playerIndex] ? state.deck[playerIndex].roleId : null;
  state.eliminatedPlayers.push({ name, roleId, day: state.narratorDay, locked: false, type });

  // If lynch, update benvenuto to this player (most recent lynched)
  if (type === "lynch") {
    state.benvenutoPlayer = name;
  }

  renderSummaryList();
  updateNarratorUI({ preserveGuideStep: true });
}

function promptElimination(name, { afterConfirm } = {}) {
  const proceed = () => {
    addEliminationEntry(name, "lynch");
    if (typeof afterConfirm === "function") afterConfirm();
  };
  const outcome = predictVictoryOnElimination(name);
  if (outcome) {
    const texts = getVictoryText(outcome.team);
    confirmAction(t("confirmation.eliminationVictory", { player: name, outcome: texts.title }), proceed);
  } else {
    proceed();
  }
}

function predictVictoryOnElimination(name, isNightKill = false) {
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  eliminatedSet.add(name);
  return computeVictoryOutcomeFromSet(eliminatedSet, isNightKill);
}

function updateNarratorUI({ preserveGuideStep = false } = {}) {
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

function buildNarrationSteps(day) {
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

function hasSpecial(roleId) {
  return state.activeSpecialIds.includes(roleId);
}

function isMythActive() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName),
  );
}

function mythRequiresAction() {
  return Boolean(
    state.mythStatus &&
    !state.mythStatus.completed &&
    state.mythStatus.playerName &&
    !isEliminated(state.mythStatus.playerName) &&
    state.narratorDay >= 2,
  );
}

function renderGuide() {
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

function toggleGuideMode() {
  state.guideExpanded = !state.guideExpanded;
  renderGuide();
  persistState();
}

function changeGuideStep(delta) {
  if (!state.guideSteps.length) return;
  const nextIndex = state.guideStepIndex + delta;
  if (nextIndex < 0 || nextIndex >= state.guideSteps.length) return;
  state.guideStepIndex = nextIndex;
  renderGuide();
  persistState();
}

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
    const pending = entry.locked ? "" : ` ${t("fallen.pending")}`;
    li.textContent = `${t("log.entry", {
      name: entry.name,
      day: entry.day ?? "?",
      role: getRoleNameFromEntry(entry),
    })} ${pending}`.trim();
    el.fallenList.appendChild(li);
  });
}

function hideMythUI() {
  if (el.mythPanel) el.mythPanel.classList.add("hidden");
  if (el.mythSummary) el.mythSummary.classList.add("hidden");
}

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

function renderMythPanel() {
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

function clearHandoffCountdown() {
  if (handoffTimerId) {
    clearInterval(handoffTimerId);
    handoffTimerId = null;
  }
  if (state.handoffCountdown !== 0) {
    state.handoffCountdown = 0;
  }
  updateHandoffTimer();
}

function updateHandoffTimer() {
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

function getMythResultText(status) {
  if (!status || !status.playerName) return "";
  const mythName = status.playerName;
  const target = status.targetName || t("myth.noTargets");
  if (status.outcome === "wolf") return t("myth.result.wolf", { name: mythName, target });
  if (status.outcome === "seer") return t("myth.result.seer", { name: mythName, target });
  return t("myth.result.human", { name: mythName, target });
}

function getRoleNameFromEntry(entry) {
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

function applyMythTransformation() {
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

function determineMythOutcome(card) {
  if (!card) return "human";
  if (card.roleId === "seer") return "seer";
  if (card.team === "wolves") return "wolf";
  return "human";
}

function advanceDay() {
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
      // Reset votes for the new day
      state.playerVotes = {};
      // Clear indiziato status for the new day
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

function confirmAction(message, onConfirm) {
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

function openInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeInfoModal() {
  if (!el.infoOverlay) return;
  el.infoOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function scrollToBottom() {
  if (state.view !== "reveal") return;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  });
}

function getLivingPlayers() {
  return state.players
    .map((name, index) => ({ name, card: state.deck[index] }))
    .filter((entry) => !isEliminated(entry.name));
}

function computeVictoryOutcomeFromSet(eliminatedSet, isNightKill = false) {
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
  // Wolves win if they are >= humans (for lynch) or will be >= humans after night kill (for sbranato)
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

function getVictorySurvivors() {
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

function evaluateVictoryConditions() {
  if (state.victory) return;
  const eliminatedSet = new Set(state.eliminatedPlayers.map((entry) => entry.name));
  const outcome = computeVictoryOutcomeFromSet(eliminatedSet, false);
  if (outcome) {
    showVictoryScreen(outcome);
  }
}

function showVictoryScreen({ team }) {
  // Calculate all winners (living and dead)
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

    // Add card image
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

function renderVictoryFromState() {
  if (!state.victory) return;
  const winners = state.victory.winners || []; // Use stored winners
  const texts = getVictoryText(state.victory.team);
  el.victoryTitle.textContent = texts.title;
  el.victorySubtitle.textContent = texts.subtitle;
  el.victoryList.innerHTML = "";

  winners.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "summary-item";
    if (entry.eliminated) li.classList.add("dead");

    // Add card image
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

function getVictoryText(team) {
  if (team === "wolves") {
    return { title: t("victory.wolves.title"), subtitle: t("victory.wolves.subtitle") };
  }
  if (team === "loner") {
    return { title: t("victory.hamster.title"), subtitle: t("victory.hamster.subtitle") };
  }
  return { title: t("victory.village.title"), subtitle: t("victory.village.subtitle") };
}

function showView(view) {
  if (view !== "reveal") clearHandoffCountdown();
  [el.setupView, el.revealView, el.summaryView, el.finalView].forEach((section) => {
    section.classList.add("hidden");
  });
  if (view === "setup") el.setupView.classList.remove("hidden");
  if (view === "reveal") el.revealView.classList.remove("hidden");
  if (view === "summary") el.summaryView.classList.remove("hidden");
  if (view === "final") el.finalView.classList.remove("hidden");
  if (view === "setup" && el.rolesDetails) {
    el.rolesDetails.open = state.rolesDetailsOpen;
  }
  state.view = view;
  toggleLanguageMenu(false);
  updateFooterVisibility();
  persistState();
}


function updateFooterVisibility() {
  if (!el.infoFooter) return;
  el.infoFooter.classList.toggle("hidden", state.view !== "setup");
}

function resetGame({ preserveNames = true } = {}) {
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
  showView("setup");
}

