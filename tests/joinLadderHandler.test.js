'use strict';

import assert from 'assertthat';
import joinLadderHandler from '../app/handlers/joinLadderHandler.js';

let parsedCommand = {
    playerName: 'newPlayer',
    arguments: ['joinladder', 'normal']
};

describe('joinLadderHandler', () => {
    it('should join ladder if it there are other players', () => {
        // given
        let ladderToUpdate = {
            name: 'normal',
            matches: [
                { player1: 'anarki', player2: 'sarge', winner: '' },
                { player1: 'sarge', player2: 'klesk', winner: '' },
                { player1: 'anarki', player2: 'klesk', winner: '' }
            ]
        };

        let fakePersistence = {
            update(filterDelegate, updateDelegate) {
                updateDelegate(ladderToUpdate);
            }
        };
        let handler = joinLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        let expectedMatches = [
            { player1: 'anarki', player2: 'sarge', winner: '' },
            { player1: 'sarge', player2: 'klesk', winner: '' },
            { player1: 'anarki', player2: 'klesk', winner: '' },
            { player1: 'newPlayer', player2: 'anarki', winner: '' },
            { player1: 'newPlayer', player2: 'sarge', winner: '' },
            { player1: 'newPlayer', player2: 'klesk', winner: '' }
        ];

        assert.that(ladderToUpdate.matches).is.equalTo(expectedMatches);
    });

    it('should join ladder if there is only one other player', () => {
        // given
        let ladderToUpdate = {
            name: 'normal',
            matches: [
                { player1: 'anarki', player2: '', winner: '' }
            ]
        };

        let fakePersistence = {
            update(filterDelegate, updateDelegate) {
                updateDelegate(ladderToUpdate);
            }
        };
        let handler = joinLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        let expectedMatches = [
            { player1: 'anarki', player2: 'newPlayer', winner: '' }
        ];

        assert.that(ladderToUpdate.matches).is.equalTo(expectedMatches);
    });

    it('should join ladder if there are no other players', () => {
        // given
        let ladderToUpdate = {
            name: 'normal',
            matches: []
        };

        let fakePersistence = {
            update(filterDelegate, updateDelegate) {
                updateDelegate(ladderToUpdate);
            }
        };
        let handler = joinLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        let expectedMatches = [
            { player1: 'newPlayer', player2: '', winner: '' }
        ];

        assert.that(ladderToUpdate.matches).is.equalTo(expectedMatches);
    });
});