'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import showStatsHandler from '../app/handlers/showStatsHandler.js';

let parsedCommand = {
    playerName: 'anarki',
    arguments: ['showStats', 'normal']
};

describe('showStatsHandler', () => {
    it('should return stats for player in ladder', () => {
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
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

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        let expectedMessage = 'Matches: 2 / Wins: 1 / Losses: 1\n' +
            'Match 1: `anarki` vs klesk / Winner: `anarki`\n' +
            'Match 2: `anarki` vs sarge / Winner: sarge';

        let actualMessage = callbackSpy.getCall(0).args[1];

        assert.that(actualMessage).is.equalTo(expectedMessage);
    });
});