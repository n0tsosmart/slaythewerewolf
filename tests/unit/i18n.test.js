import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatString, t, getRoleContent } from '../../js/modules/i18n.js';

// Mock the state module
vi.mock('../../js/modules/state.js', () => ({
    state: {
        language: 'en',
    },
}));

// Mock the config module
vi.mock('../../js/modules/config.js', () => ({
    DEFAULT_LANGUAGE: 'en',
    ROLE_LIBRARY: {
        werewolf: {
            id: 'werewolf',
            name: 'Werewolf',
            teamLabel: 'Werewolves',
            description: 'A dangerous werewolf',
            locales: {
                es: {
                    name: 'Hombre Lobo',
                    teamLabel: 'Licántropos',
                    description: 'Un peligroso hombre lobo',
                },
                it: {
                    name: 'Lupo Mannaro',
                    teamLabel: 'Lupi Mannari',
                    description: 'Un pericoloso lupo mannaro',
                },
            },
        },
        villager: {
            id: 'villager',
            name: 'Villager',
            teamLabel: 'Village',
            description: 'An ordinary villager',
            locales: {
                es: {
                    name: 'Aldeano',
                    teamLabel: 'Aldea',
                    description: 'Un aldeano ordinario',
                },
            },
        },
    },
}));

// Mock DOM operations
vi.mock('../../js/modules/dom.js', () => ({
    el: {},
}));

describe('i18n.js', () => {
    beforeEach(() => {
        // Setup global TRANSLATIONS object
        global.window = {
            TRANSLATIONS: {
                en: {
                    'test.key': 'Hello',
                    'test.withVars': 'Hello {name}',
                    'test.multipleVars': '{greeting} {name}, you are {age} years old',
                },
                es: {
                    'test.key': 'Hola',
                    'test.withVars': 'Hola {name}',
                },
                it: {
                    'test.key': 'Ciao',
                },
                mafia: {
                    en: {
                        'test.mafia': 'Mafia Override',
                    },
                },
            },
        };
    });

    describe('formatString', () => {
        it('should replace single variable', () => {
            const result = formatString('Hello {name}', { name: 'Alice' });
            expect(result).toBe('Hello Alice');
        });

        it('should replace multiple variables', () => {
            const result = formatString('{greeting} {name}!', {
                greeting: 'Hello',
                name: 'Bob'
            });
            expect(result).toBe('Hello Bob!');
        });

        it('should leave unreplaced variables as-is', () => {
            const result = formatString('Hello {name}', {});
            expect(result).toBe('Hello {name}');
        });

        it('should handle empty template', () => {
            expect(formatString('', { name: 'Test' })).toBe('');
        });

        it('should handle template with no variables', () => {
            expect(formatString('Plain text', { name: 'Test' })).toBe('Plain text');
        });
    });

    describe('t (translation)', () => {
        it('should retrieve translation for current language', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'en';

            const result = t('test.key');
            expect(result).toBe('Hello');
        });

        it('should interpolate variables', () => {
            const result = t('test.withVars', { name: 'Charlie' });
            expect(result).toBe('Hello Charlie');
        });

        it('should fall back to English if key not found in current language', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'it';

            const result = t('test.withVars', { name: 'Diana' });
            expect(result).toBe('Hello Diana'); // Falls back to English
        });

        it('should return key if not found in any language', () => {
            const result = t('nonexistent.key');
            expect(result).toBe('nonexistent.key');
        });
    });

    describe('getRoleContent', () => {
        it('should return English role content by default', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'en';

            const content = getRoleContent('werewolf');

            expect(content.name).toBe('Werewolf');
            expect(content.teamLabel).toBe('Werewolves');
            expect(content.description).toBe('A dangerous werewolf');
        });

        it('should return localized role content for Spanish', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'es';

            const content = getRoleContent('werewolf');

            expect(content.name).toBe('Hombre Lobo');
            expect(content.teamLabel).toBe('Licántropos');
            expect(content.description).toBe('Un peligroso hombre lobo');
        });

        it('should return localized role content for Italian', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'it';

            const content = getRoleContent('werewolf');

            expect(content.name).toBe('Lupo Mannaro');
            expect(content.teamLabel).toBe('Lupi Mannari');
        });

        it('should fall back to default if locale missing', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'fr'; // Unsupported language

            const content = getRoleContent('werewolf');

            expect(content.name).toBe('Werewolf');
        });

        it('should fall back to villager for unknown role', async () => {
            const { state } = await import('../../js/modules/state.js');
            state.language = 'en';

            const content = getRoleContent('unknown_role');

            expect(content.name).toBe('Villager');
        });
    });
});
