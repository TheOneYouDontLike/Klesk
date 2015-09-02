'use strict';

import assert from 'assertthat';
import _ from 'lodash';
import sinon from 'sinon';
import joinLadderHandler from '../app/handlers/joinLadderHandler.js';

let parsedCommand = {
    playerName: 'newPlayer',
    arguments: ['joinladder', 'normal']
};

describe('joinLadderHandler', () => {
    it.only('should join ladder\'s active season if there are other players', () => {
        // given
        let ladderToUpdate = {
            name: 'normal',
            seasons: [
                {
                    number: 1,
                    matches: []
                },
                {
                    number: 2,
                    matches: [
                        {player1: 'anarki', player2: 'sarge', winner: ''},
                        {player1: 'sarge', player2: 'klesk', winner: ''},
                        {player1: 'anarki', player2: 'klesk', winner: ''}
                    ]
                }
            ]
        };

        let fakePersistence = {
            update (filterDelegate, updateDelegate) {
                updateDelegate(ladderToUpdate);
            }
        };
        let handler = joinLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: () => {}});

        // then
        let expectedMatches = [
            {player1: 'anarki', player2: 'sarge', winner: ''},
            {player1: 'sarge', player2: 'klesk', winner: ''},
            {player1: 'anarki', player2: 'klesk', winner: ''},
            {player1: 'newPlayer', player2: 'anarki', winner: ''},
            {player1: 'newPlayer', player2: 'sarge', winner: ''},
            {player1: 'newPlayer', player2: 'klesk', winner: ''}
        ];

        assert.that(ladderToUpdate.seasons[0].matches).is.equalTo(expectedMatches);
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
        handler.makeItSo(parsedCommand, () => {}, { send: () => {} });

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
        handler.makeItSo(parsedCommand, () => {}, { send: () => {} });

        // then
        let expectedMatches = [
            { player1: 'newPlayer', player2: '', winner: '' }
        ];

        assert.that(ladderToUpdate.matches).is.equalTo(expectedMatches);
    });

    it('should send notification when user joins the ladder', () => {
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

        let sendSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, { send: sendSpy });

        // then
        let expectedMessage = 'Player `newPlayer` has joined the ladder `normal`';
        assert.that(sendSpy.calledWith(expectedMessage)).is.true();
        assert.that(sendSpy.calledOnce).is.true();
    });

    it('should not join ladder if already joined', () => {
        // given
        let ladderToUpdate = {
            name: 'normal',
            matches: [{ player1: 'newPlayer', player2: '', winner: '' }]
        };

        let expectedMatches = _.cloneDeep(ladderToUpdate.matches);

        let fakePersistence = {
            update(filterDelegate, updateDelegate) {
                updateDelegate(ladderToUpdate);
            }
        };
        let handler = joinLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        assert.that(ladderToUpdate.matches).is.equalTo(expectedMatches);
    });
});