import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createCard, deckFromRoleIds } from '../../js/modules/roles.js';

// Mock the config module
vi.mock('../../js/modules/config.js', () => ({
    ROLE_LIBRARY: {
        werewolf: {
            id: 'werewolf',
            name: 'Werewolf',
            team: 'wolves',
            teamLabel: 'Werewolves',
            description: 'A dangerous werewolf',
            image: 'assets/cards/lupo.jpg',
        },
        villager: {
            id: 'villager',
            name: 'Villager',
            team: 'humans',
            teamLabel: 'Village',
            description: 'An ordinary villager',
            image: 'assets/cards/villico.jpg',
        },
        seer: {
            id: 'seer',
            name: 'Seer',
            team: 'humans',
            teamLabel: 'Village',
            description: 'Can see the truth',
            image: 'assets/cards/veggente.jpg',
        },
    },
}));

describe('roles.js', () => {
    describe('createCard', () => {
        it('should create a card from a role definition', () => {
            const role = {
                id: 'werewolf',
                name: 'Werewolf',
                team: 'wolves',
                teamLabel: 'Werewolves',
                description: 'A dangerous werewolf',
                image: 'assets/cards/lupo.jpg',
            };

            const card = createCard(role);

            expect(card).toEqual({
                roleId: 'werewolf',
                name: 'Werewolf',
                team: 'wolves',
                teamLabel: 'Werewolves',
                description: 'A dangerous werewolf',
                image: 'assets/cards/lupo.jpg',
            });
        });

        it('should use villager as default when role is null', () => {
            const card = createCard(null);

            expect(card.roleId).toBe('villager');
            expect(card.team).toBe('humans');
        });

        it('should use villager as default when role is undefined', () => {
            const card = createCard(undefined);

            expect(card.roleId).toBe('villager');
            expect(card.team).toBe('humans');
        });
    });

    describe('deckFromRoleIds', () => {
        it('should reconstruct deck from role IDs', () => {
            const roleIds = ['werewolf', 'seer', 'villager'];
            const deck = deckFromRoleIds(roleIds);

            expect(deck).toHaveLength(3);
            expect(deck[0].roleId).toBe('werewolf');
            expect(deck[1].roleId).toBe('seer');
            expect(deck[2].roleId).toBe('villager');
        });

        it('should use villager for unknown role IDs', () => {
            const roleIds = ['werewolf', 'unknown_role', 'villager'];
            const deck = deckFromRoleIds(roleIds);

            expect(deck).toHaveLength(3);
            expect(deck[0].roleId).toBe('werewolf');
            expect(deck[1].roleId).toBe('villager'); // Unknown becomes villager
            expect(deck[2].roleId).toBe('villager');
        });

        it('should return empty array for non-array input', () => {
            expect(deckFromRoleIds(null)).toEqual([]);
            expect(deckFromRoleIds(undefined)).toEqual([]);
            expect(deckFromRoleIds('not-an-array')).toEqual([]);
            expect(deckFromRoleIds(123)).toEqual([]);
        });

        it('should handle empty array', () => {
            expect(deckFromRoleIds([])).toEqual([]);
        });
    });
});
