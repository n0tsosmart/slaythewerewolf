import { describe, it, expect } from 'vitest';
import { normalizeMythStatus, detectMythStatusFromDeck, determineMythOutcome } from '../../js/modules/logic.js';

describe('logic.js', () => {
    describe('determineMythOutcome', () => {
        it('should return "seer" for seer card', () => {
            const card = { roleId: 'seer', team: 'humans' };
            expect(determineMythOutcome(card)).toBe('seer');
        });

        it('should return "wolf" for werewolf card', () => {
            const card = { roleId: 'werewolf', team: 'wolves' };
            expect(determineMythOutcome(card)).toBe('wolf');
        });

        it('should return "wolf" for possessed card (wolf team)', () => {
            const card = { roleId: 'possessed', team: 'wolves' };
            expect(determineMythOutcome(card)).toBe('wolf');
        });

        it('should return "human" for villager card', () => {
            const card = { roleId: 'villager', team: 'humans' };
            expect(determineMythOutcome(card)).toBe('human');
        });

        it('should return "human" for null card', () => {
            expect(determineMythOutcome(null)).toBe('human');
        });

        it('should return "human" for undefined card', () => {
            expect(determineMythOutcome(undefined)).toBe('human');
        });
    });

    describe('detectMythStatusFromDeck', () => {
        it('should detect mythomaniac in deck', () => {
            const players = ['Alice', 'Bob', 'Charlie'];
            const deck = [
                { roleId: 'werewolf' },
                { roleId: 'mythomaniac' },
                { roleId: 'villager' },
            ];

            const result = detectMythStatusFromDeck(players, deck);

            expect(result).toEqual({
                playerIndex: 1,
                playerName: 'Bob',
                targetName: null,
                outcome: null,
                completed: false,
            });
        });

        it('should return null if no mythomaniac in deck', () => {
            const players = ['Alice', 'Bob'];
            const deck = [
                { roleId: 'werewolf' },
                { roleId: 'villager' },
            ];

            expect(detectMythStatusFromDeck(players, deck)).toBeNull();
        });

        it('should return null for empty players array', () => {
            const deck = [{ roleId: 'mythomaniac' }];
            expect(detectMythStatusFromDeck([], deck)).toBeNull();
        });

        it('should return null for empty deck array', () => {
            const players = ['Alice'];
            expect(detectMythStatusFromDeck(players, [])).toBeNull();
        });
    });

    describe('normalizeMythStatus', () => {
        it('should normalize saved status with playerName', () => {
            const players = ['Alice', 'Bob', 'Charlie'];
            const deck = [
                { roleId: 'werewolf' },
                { roleId: 'mythomaniac' },
                { roleId: 'villager' },
            ];
            const savedStatus = {
                playerName: 'Bob',
                targetName: 'Alice',
                outcome: 'wolf',
                completed: true,
            };

            const result = normalizeMythStatus(savedStatus, players, deck);

            expect(result).toEqual({
                playerIndex: 1,
                playerName: 'Bob',
                targetName: 'Alice',
                outcome: 'wolf',
                completed: true,
            });
        });

        it('should fall back to playerIndex if playerName not found', () => {
            const players = ['Alice', 'Bob', 'Charlie'];
            const deck = [
                { roleId: 'werewolf' },
                { roleId: 'mythomaniac' },
                { roleId: 'villager' },
            ];
            const savedStatus = {
                playerName: 'Unknown',
                playerIndex: 2,
                targetName: null,
                outcome: null,
                completed: false,
            };

            const result = normalizeMythStatus(savedStatus, players, deck);

            expect(result).toEqual({
                playerIndex: 2,
                playerName: 'Charlie',
                targetName: null,
                outcome: null,
                completed: false,
            });
        });

        it('should detect from deck if no saved status', () => {
            const players = ['Alice', 'Bob'];
            const deck = [
                { roleId: 'mythomaniac' },
                { roleId: 'villager' },
            ];

            const result = normalizeMythStatus(null, players, deck);

            expect(result).toEqual({
                playerIndex: 0,
                playerName: 'Alice',
                targetName: null,
                outcome: null,
                completed: false,
            });
        });

        it('should return null for empty players', () => {
            const deck = [{ roleId: 'mythomaniac' }];
            expect(normalizeMythStatus(null, [], deck)).toBeNull();
        });

        it('should return null if saved index is out of bounds', () => {
            const players = ['Alice'];
            const deck = [{ roleId: 'villager' }];
            const savedStatus = {
                playerIndex: 5,
                playerName: 'Unknown',
            };

            // Should fall back to detecting from deck (which finds nothing)
            expect(normalizeMythStatus(savedStatus, players, deck)).toBeNull();
        });
    });
});
