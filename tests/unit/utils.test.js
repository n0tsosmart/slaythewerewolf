import { describe, it, expect } from 'vitest';
import { shuffle, getLanguageFlag, getRoleImage } from '../../js/modules/utils.js';

// Mock the config module
vi.mock('../../js/modules/config.js', () => ({
    ROLE_LIBRARY: {
        werewolf: {
            id: 'werewolf',
            image: 'assets/cards/lupo.jpg',
        },
        villager: {
            id: 'villager',
            image: 'assets/cards/villico.jpg',
        },
    },
    PAGE_FADE_DURATION: 400,
    RIPPLE_DURATION: 500,
    HAPTIC_VIBRATION_DURATION: 8,
    TOAST_DURATION: 2500,
    ANIMATION_SHAKE_DURATION: 300,
}));

describe('utils.js', () => {
    describe('shuffle', () => {
        it('should return an array of the same length', () => {
            const deck = [1, 2, 3, 4, 5];
            const shuffled = shuffle(deck);

            expect(shuffled).toHaveLength(deck.length);
        });

        it('should preserve all elements', () => {
            const deck = [1, 2, 3, 4, 5];
            const shuffled = shuffle(deck);

            // Check that all original elements are present
            expect(shuffled.sort()).toEqual(deck.sort());
        });

        it('should not mutate the original array', () => {
            const deck = [1, 2, 3, 4, 5];
            const original = [...deck];
            shuffle(deck);

            expect(deck).toEqual(original);
        });

        it('should handle empty array', () => {
            const result = shuffle([]);
            expect(result).toEqual([]);
        });

        it('should handle single element array', () => {
            const result = shuffle([42]);
            expect(result).toEqual([42]);
        });

        it('should produce different orders (probabilistic test)', () => {
            const deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let differentOrder = false;

            // Run shuffle multiple times to check if we get different results
            for (let i = 0; i < 10; i++) {
                const shuffled = shuffle(deck);
                if (JSON.stringify(shuffled) !== JSON.stringify(deck)) {
                    differentOrder = true;
                    break;
                }
            }

            expect(differentOrder).toBe(true);
        });
    });

    describe('getLanguageFlag', () => {
        it('should return Spanish flag for "es"', () => {
            expect(getLanguageFlag('es')).toBe('🇪🇸');
        });

        it('should return Italian flag for "it"', () => {
            expect(getLanguageFlag('it')).toBe('🇮🇹');
        });

        it('should return UK flag for "en"', () => {
            expect(getLanguageFlag('en')).toBe('🇬🇧');
        });

        it('should return UK flag for unknown language', () => {
            expect(getLanguageFlag('fr')).toBe('🇬🇧');
            expect(getLanguageFlag('de')).toBe('🇬🇧');
            expect(getLanguageFlag('unknown')).toBe('🇬🇧');
        });

        it('should handle null and undefined', () => {
            expect(getLanguageFlag(null)).toBe('🇬🇧');
            expect(getLanguageFlag(undefined)).toBe('🇬🇧');
        });
    });

    describe('getRoleImage', () => {
        it('should return default image for werewolf in default theme', () => {
            document.documentElement.setAttribute('data-theme', 'default');

            const result = getRoleImage('werewolf');
            expect(result).toBe('assets/cards/lupo.jpg');

            document.documentElement.removeAttribute('data-theme');
        });

        it('should return mafia-prefixed image for werewolf in purple theme', () => {
            document.documentElement.setAttribute('data-theme', 'purple');

            const result = getRoleImage('werewolf');
            expect(result).toBe('assets/cards/mafia_lupo.jpg');

            document.documentElement.removeAttribute('data-theme');
        });

        it('should return mafia-prefixed image for villager in purple theme', () => {
            document.documentElement.setAttribute('data-theme', 'purple');

            const result = getRoleImage('villager');
            expect(result).toBe('assets/cards/mafia_villico.jpg');

            document.documentElement.removeAttribute('data-theme');
        });

        it('should fall back to villager for unknown role', () => {
            const result = getRoleImage('unknown_role');
            expect(result).toBe('assets/cards/villico.jpg');
        });

        it('should handle null theme attribute', () => {
            document.documentElement.removeAttribute('data-theme');

            const result = getRoleImage('werewolf');
            expect(result).toBe('assets/cards/lupo.jpg');
        });
    });
});
