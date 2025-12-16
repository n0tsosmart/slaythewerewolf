import { describe, it, expect, beforeEach } from 'vitest';
import { computeVictoryOutcomeFromSet } from '../../js/modules/engine/victory.js';
import { state } from '../../js/modules/state.js';

describe('victory.js', () => {
    beforeEach(() => {
        // Reset state
        state.deck = [];
        state.players = [];
        state.eliminatedPlayers = [];
    });

    it('should declare Wolf victory when Wolves >= Non-Wolves', () => {
        state.players = ['Wolf1', 'Wolf2', 'Villager1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'villager', team: 'humans' }
        ];

        const outcome = computeVictoryOutcomeFromSet(new Set());
        expect(outcome).toEqual({
            team: 'wolves',
            survivors: expect.arrayContaining([
                expect.objectContaining({ name: 'Wolf1' }),
                expect.objectContaining({ name: 'Wolf2' }),
                expect.objectContaining({ name: 'Villager1' })
            ])
        });
    });

    it('should declare Village victory when no Wolves remain', () => {
        state.players = ['Wolf1', 'Villager1', 'Villager2'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'villager', team: 'humans' },
            { roleId: 'villager', team: 'humans' }
        ];

        const outcome = computeVictoryOutcomeFromSet(new Set(['Wolf1']));
        expect(outcome).toEqual({
            team: 'humans',
            survivors: expect.arrayContaining([
                expect.objectContaining({ name: 'Villager1' }),
                expect.objectContaining({ name: 'Villager2' })
            ])
        });
    });

    it('should declare Hamster victory when Wolves win but Hamster survives', () => {
        state.players = ['Wolf1', 'Wolf2', 'Hamster1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'werehamster', team: 'loner' }
        ];

        // 2 Wolves vs 1 Hamster. 2 >= 1. Wolf Win condition met.
        // But Hamster is alive -> Hamster Win.
        const outcome = computeVictoryOutcomeFromSet(new Set());
        expect(outcome).toEqual({
            team: 'loner',
            survivors: expect.arrayContaining([
                expect.objectContaining({ name: 'Hamster1' })
            ])
        });
    });

    it('should declare Hamster victory when Village wins but Hamster survives', () => {
        state.players = ['Wolf1', 'Villager1', 'Hamster1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'villager', team: 'humans' },
            { roleId: 'werehamster', team: 'loner' }
        ];

        // Wolf eliminated. No wolves left. Village Win condition met.
        // But Hamster is alive -> Hamster Win.
        const outcome = computeVictoryOutcomeFromSet(new Set(['Wolf1']));
        expect(outcome).toEqual({
            team: 'loner',
            survivors: expect.arrayContaining([
                expect.objectContaining({ name: 'Hamster1' })
            ])
        });
    });

    it('should NOT declare victory if Hamster balances the count (Hamster counts as Non-Wolf)', () => {
        state.players = ['Wolf1', 'Villager1', 'Hamster1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'villager', team: 'humans' },
            { roleId: 'werehamster', team: 'loner' }
        ];

        // 1 Wolf.
        // Non-Wolves: 1 Villager + 1 Hamster = 2.
        // 1 < 2. Game continues.
        const outcome = computeVictoryOutcomeFromSet(new Set());
        expect(outcome).toBeNull();
    });

    it('should NOT declare victory if Possessed balances the count (Possessed counts as Non-Wolf)', () => {
        state.players = ['Wolf1', 'Villager1', 'Possessed1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'villager', team: 'humans' },
            { roleId: 'possessed', team: 'wolves' }
        ];

        // 1 Wolf (Wolf1).
        // Non-Wolves: 1 Villager + 1 Possessed = 2.
        // 1 < 2. Game continues.
        const outcome = computeVictoryOutcomeFromSet(new Set());
        expect(outcome).toBeNull();
    });

    it('should declare Wolf victory if Possessed is the only Non-Wolf left', () => {
        state.players = ['Wolf1', 'Possessed1'];
        state.deck = [
            { roleId: 'werewolf', team: 'wolves' },
            { roleId: 'possessed', team: 'wolves' }
        ];

        // 1 Wolf.
        // Non-Wolves: 1 Possessed = 1.
        // 1 >= 1. Wolf Victory.
        const outcome = computeVictoryOutcomeFromSet(new Set());
        expect(outcome).toEqual({
            team: 'wolves',
            survivors: expect.arrayContaining([
                expect.objectContaining({ name: 'Wolf1' }),
                expect.objectContaining({ name: 'Possessed1' })
            ])
        });
    });
});
