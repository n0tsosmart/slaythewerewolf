/**
 * @fileoverview Translations loader for Slay the Werewolf
 * Loads English immediately and lazy loads other languages on demand.
 * Version: 1.1.6
 */

import { en, enMafia } from './en.js';

// Initialize with English (always loaded)
window.TRANSLATIONS = {
    en,
    mafia: { en: enMafia }
};

// Track loaded languages
const loadedLanguages = new Set(['en']);

/**
 * Lazy loads a language module if not already loaded.
 * @param {string} lang - Language code ('es' or 'it')
 * @returns {Promise<boolean>} True if loaded successfully
 */
export async function loadLanguage(lang) {
    if (loadedLanguages.has(lang)) {
        return true;
    }

    try {
        let module;
        switch (lang) {
            case 'es':
                module = await import('./es.js');
                window.TRANSLATIONS.es = module.es;
                window.TRANSLATIONS.mafia.es = module.esMafia;
                break;
            case 'it':
                module = await import('./it.js');
                window.TRANSLATIONS.it = module.it;
                window.TRANSLATIONS.mafia.it = module.itMafia;
                break;
            default:
                console.warn(`[i18n] Unknown language: ${lang}`);
                return false;
        }
        loadedLanguages.add(lang);
        console.log(`[i18n] Loaded language: ${lang}`);
        return true;
    } catch (error) {
        console.error(`[i18n] Failed to load language: ${lang}`, error);
        return false;
    }
}

/**
 * Check if a language is loaded.
 * @param {string} lang - Language code
 * @returns {boolean}
 */
export function isLanguageLoaded(lang) {
    return loadedLanguages.has(lang);
}

/**
 * Get all available language codes.
 * @returns {string[]}
 */
export function getAvailableLanguages() {
    return ['en', 'es', 'it'];
}

/**
 * Preload all languages (useful if you want all languages available immediately).
 * @returns {Promise<void>}
 */
export async function preloadAllLanguages() {
    await Promise.all([
        loadLanguage('es'),
        loadLanguage('it')
    ]);
}
