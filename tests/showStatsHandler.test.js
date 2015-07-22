'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import showStatsHandler from '../app/handlers/showStatsHandler.js';

let parsedCommand = {
    playerName: 'anarki',
    arguments: ['showstats', 'normal']
};

let commandWithoutLadderName = {
    playerName: 'anarki',
    arguments: ['showstats']
};

describe('showStatsHandler', () => {
    it('should return stats for player in ladder', () => {
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            map: { name: 'aerowalk' },
            matches: [
                { player1: 'anarki', player2: 'klesk', winner: 'anarki' },
                { player1: 'anarki', player2: 'sarge', winner: 'sarge' },
                { player1: 'klesk', player2: 'sarge', winner: 'sarge' }
            ]
        };

        let fakePersistence = {
            query(filterFunction, callback) {
                callback(null, [ ladderInRepository ]);
            }
        };

        let callbackSpy = sinon.spy();
        let handler = showStatsHandler(fakePersistence);

        let expectedMessage = 'Matches: 2 / Wins: 1 / Losses: 1\n' +
            '[`+anarki` vs klesk on aerowalk]' +
            '[anarki vs `+sarge` on aerowalk]';

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        let actualMessage = callbackSpy.getCall(0).args[1];

        assert.that(actualMessage).is.equalTo(expectedMessage);
    });

    it('should not count not played matches as player losses', () => {
        //given
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            map: { name: 'aerowalk' },
            matches: [
                { player1: 'anarki', player2: 'klesk', winner: '' }
            ]
        };

        let fakePersistence = {
            query(filterFunction, callback) {
                callback(null, [ ladderInRepository ]);
            }
        };

        let callbackSpy = sinon.spy();
        let handler = showStatsHandler(fakePersistence);

        let expectedMessage = 'Matches: 1 / Wins: 0 / Losses: 0\n' +
            '[anarki vs klesk on aerowalk]';

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        let actualMessage = callbackSpy.getCall(0).args[1];

        assert.that(actualMessage).is.equalTo(expectedMessage);
    });

    it('should not return stats if ladder name is not specified', () => {
        // given
        let handler = showStatsHandler({});

        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(commandWithoutLadderName, callbackSpy);

        // then
        let errorMessage = callbackSpy.getCall(0).args[0].message;
        assert.that(errorMessage).is.equalTo('Specify ladder name.');
    });

    it('should not return stats if player did not join the ladder', () => {
        // given
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            map: { name: 'aerowalk' },
            matches: [
                { player1: 'klesk', player2: 'sarge', winner: 'sarge' }
            ]
        };

        let fakePersistence = {
            query(filterFunction, callback) {
                callback(null, [ ladderInRepository ]);
            }
        };

        let handler = showStatsHandler(fakePersistence);

        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        let resultMessage = callbackSpy.getCall(0).args[1];
        assert.that(resultMessage).is.equalTo('You didn\'t join this ladder.');
    });
});