import { state } from './state.js';
import { el } from './dom.js';
import { DEFAULT_LANGUAGE, ROLE_LIBRARY } from './config.js';
import { getLanguageFlag } from './utils.js';

// Import and initialize translations
import { loadLanguage, isLanguageLoaded } from '../translations/index.js';

// Translation & I18n

export function formatString(template, vars = {}) {
  return template.replace(/\{(.*?)\}/g, (_, key) => (vars[key] !== undefined ? vars[key] : `{${key}}`));
}

/**
 * Ensures a language is loaded before use.
 * @param {string} lang - Language code
 * @returns {Promise<boolean>}
 */
export async function ensureLanguageLoaded(lang) {
  if (!isLanguageLoaded(lang)) {
    return await loadLanguage(lang);
  }
  return true;
}

export function t(key, vars) {
  // Access global TRANSLATIONS object from window
  const trans = window.TRANSLATIONS || {};

  // Check for Mafia theme overrides
  const isMafiaTheme = document.documentElement.getAttribute('data-theme') === 'purple';
  if (isMafiaTheme && trans.mafia && trans.mafia[state.language] && trans.mafia[state.language][key]) {
    const mafiaTemplate = trans.mafia[state.language][key];
    return vars ? formatString(mafiaTemplate, vars) : mafiaTemplate;
  }

  const langPack = trans[state.language] || trans[DEFAULT_LANGUAGE] || {};
  const fallback = trans[DEFAULT_LANGUAGE] ? trans[DEFAULT_LANGUAGE][key] : null;
  const template = langPack[key] ?? fallback ?? key;
  return vars ? formatString(template, vars) : template;
}

export function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) element.textContent = t(key);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key) element.placeholder = t(key);
  });
}

export function getRoleContent(roleId) {
  const base = ROLE_LIBRARY[roleId] || ROLE_LIBRARY.villager;

  // Check for Mafia theme overrides
  const isMafiaTheme = document.documentElement.getAttribute('data-theme') === 'purple';
  const trans = window.TRANSLATIONS || {};
  if (isMafiaTheme && trans.mafia && trans.mafia[state.language] && trans.mafia[state.language].roles && trans.mafia[state.language].roles[roleId]) {
    const mafiaRole = trans.mafia[state.language].roles[roleId];
    return {
      name: mafiaRole.name,
      teamLabel: mafiaRole.teamLabel || base.teamLabel,
      description: mafiaRole.description
    };
  }

  const locale = base.locales?.[state.language] || {};
  return {
    name: locale.name || base.name,
    teamLabel: locale.teamLabel || base.teamLabel,
    description: locale.description || base.description,
  };
}

export function updateLanguageButtons() {
  if (el.languageButtons && el.languageButtons.length) {
    el.languageButtons.forEach((button) => {
      const isActive = button.dataset.langButton === state.language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }
  if (el.languageFlag) el.languageFlag.textContent = getLanguageFlag(state.language);
}

export async function setLanguage(lang) {
  // Lazy load the language if needed
  if (lang !== 'en') {
    await ensureLanguageLoaded(lang);
  }

  const trans = window.TRANSLATIONS || {};
  state.language = trans[lang] ? lang : DEFAULT_LANGUAGE;
  if (el.languageSelect) el.languageSelect.value = state.language;
  updateLanguageButtons();
  if (typeof document !== "undefined") {
    document.documentElement.lang = state.language;
  }
  // Note: The orchestration of UI updates (renderRoleOptions, etc.)
  // has been moved to the caller (engine.js) to avoid circular dependencies.
}