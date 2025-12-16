import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to import state before mocking to capture the real object
const stateModule = await import('../../js/modules/state.js');
const realState = stateModule.state;

// Import functions to test
import { persistState, restoreFromStorage } from '../../js/modules/store.js';

// Mock DOM operations
vi.mock('../../js/modules/dom.js', () => ({
    el: {
        playerCount: null,
        wolfCount: null,
        roleOptions: null,
    },
}));

vi.mock('../../js/modules/config.js', () => ({
    STORAGE_KEY: 'SLAY_STATE_TEST',
    ROLE_LIBRARY: {
        werewolf: { id: 'werewolf', name: 'Werewolf', team: 'wolves' },
        villager: { id: 'villager', name: 'Villager', team: 'humans' },
        seer: { id: 'seer', name: 'Seer', team: 'humans' },
    },
    MIN_PLAYERS: 5,
    DEFAULT_LANGUAGE: 'en',
}));

vi.mock('../../js/modules/roles.js', () => ({
    createCard: (role) => {
        const defaultRole = { id: 'villager', name: 'Villager', team: 'humans' };
        const base = role || defaultRole;
        return {
            roleId: base.id,
            name: base.name,
            team: base.team,
        };
    },
    deckFromRoleIds: (roleIds) => {
        if (!Array.isArray(roleIds)) return [];
        return roleIds.map((roleId) => ({
            roleId,
            name: roleId.charAt(0).toUpperCase() + roleId.slice(1),
            team: roleId === 'werewolf' ? 'wolves' : 'humans',
        }));
    },
}));

vi.mock('../../js/modules/logic.js', () => ({
    normalizeMythStatus: (savedStatus, players, deck) => savedStatus,
}));

describe('store.js - State Persistence', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();

        // Reset state using the real state object
        Object.assign(realState, {
            view: 'setup',
            players: [],
            customNames: [],
            revealIndex: 0,
            narratorDay: 1,
            maxDays: 5,
            eliminatedPlayers: [],
            activeSpecialIds: [],
            victory: null,
            revealComplete: false,
            deck: [],
            guideStepIndex: 0,
            playersCollapsed: false,
            rolesDetailsOpen: false,
            guideExpanded: true,
            mythStatus: null,
            language: 'en',
            playerVotes: {},
            benvenutoPlayer: null,
            assignedRole: null,
        });
    });

    describe('persistState and restoreFromStorage integration', () => {
        it('should save and restore basic game state', async () => {
            const { STORAGE_KEY } = await import('../../js/modules/config.js');


            // Set up state
            realState.view = 'summary';
            realState.players = ['Alice', 'Bob', 'Charlie'];
            realState.narratorDay = 3;
            realState.deck = [
                { roleId: 'werewolf' },
                { roleId: 'seer' },
                { roleId: 'villager' },
            ];

            // Persist
            persistState();

            // Verify data was saved
            const saved = localStorage.getItem(STORAGE_KEY);
            expect(saved).toBeTruthy();

            const data = JSON.parse(saved);
            expect(data.view).toBe('summary');
            expect(data.players).toEqual(['Alice', 'Bob', 'Charlie']);
            expect(data.narratorDay).toBe(3);
        });

        it('should round-trip state correctly', async () => {
            // Set up initial state
            realState.view = 'summary';
            realState.players = ['Alice', 'Bob', 'Charlie'];
            realState.customNames = ['Alice', 'Bob'];
            realState.narratorDay = 2;
            realState.eliminatedPlayers = [{ name: 'Alice', type: 'maul', day: 1 }];
            realState.revealComplete = true;
            realState.language = 'es';
            realState.hapticsEnabled = false;

            // Persist
            persistState();

            // Reset state
            realState.view = 'setup';
            realState.players = [];
            realState.narratorDay = 1;
            realState.eliminatedPlayers = [];
            realState.language = 'en';
            realState.hapticsEnabled = true;

            // Restore
            restoreFromStorage();

            // Verify restoration
            expect(realState.view).toBe('summary');
            expect(realState.players).toEqual(['Alice', 'Bob', 'Charlie']);
            expect(realState.customNames).toEqual(['Alice', 'Bob']);
            expect(realState.narratorDay).toBe(2);
            expect(realState.eliminatedPlayers).toHaveLength(1);
            expect(realState.language).toBe('es');
            expect(realState.hapticsEnabled).toBe(false);
        });

        it('should handle empty localStorage gracefully', () => {
            expect(() => restoreFromStorage()).not.toThrow();
        });

        it('should handle corrupted localStorage data', async () => {
            const { STORAGE_KEY } = await import('../../js/modules/config.js');

            localStorage.setItem(STORAGE_KEY, 'invalid json {{{');

            expect(() => restoreFromStorage()).not.toThrow();
        });

        it('should preserve role assignments correctly', async () => {
            realState.players = ['Alice', 'Bob', 'Charlie'];
            realState.deck = [
                { roleId: 'werewolf', name: 'Werewolf', team: 'wolves' },
                { roleId: 'seer', name: 'Seer', team: 'humans' },
                { roleId: 'villager', name: 'Villager', team: 'humans' },
            ];

            persistState();

            // Reset deck
            realState.deck = [];

            restoreFromStorage();

            // Verify role assignments were restored
            expect(realState.deck).toHaveLength(3);
            expect(realState.deck[0].roleId).toBe('werewolf');
            expect(realState.deck[1].roleId).toBe('seer');
            expect(realState.deck[2].roleId).toBe('villager');
        });
    });
});
