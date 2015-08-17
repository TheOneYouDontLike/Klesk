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

let notificationSpy = {};

describe('showStatsHandler', () => {
    beforeEach(() => {
        notificationSpy = {
            send: sinon.spy()
        };
    });

    it('should tell player that stats where sent directly to him via notification', () => {
        //given
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            map: { name: 'aerowalk' },
            matches: [
                { player1: parsedCommand.playerName },
            ]
        };

        let fakePersistence = {
            query(filterFunction, callback) {
                callback(null, [ ladderInRepository ]);
            }
        };

        let callbackSpy = sinon.spy();
        let handler = showStatsHandler(fakePersistence);
        
        let expectedMessage = 'Your stats in this ladder were sent to you directly to your @slackbot channel.';

        //when
        handler.makeItSo(parsedCommand, callbackSpy, notificationSpy);
        
        //then
        let actualMessage = callbackSpy.getCall(0).args[1];

        assert.that(actualMessage).is.equalTo(expectedMessage);
    });

    it('should return stats for player in ladder directly to him', () => {
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

        let expectedNotificationMessage = 
            'Ladder `' + ladderInRepository.name + '`\n' +
            'Matches: 2 / Wins: 1 / Losses: 1\n' +
            '[`+anarki` vs klesk on aerowalk]\n' +
            '[anarki vs `+sarge` on aerowalk]\n';

        //when
        handler.makeItSo(parsedCommand, callbackSpy, notificationSpy);

        //then
        let actualMessage = notificationSpy.send.getCall(0).args[0];
        let channelOverride = notificationSpy.send.getCall(0).args[1];

        assert.that(actualMessage).is.equalTo(expectedNotificationMessage);
        assert.that(channelOverride).is.equalTo('@' + parsedCommand.playerName);
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

        let expectedNotificationMessage = 
            'Ladder `' + ladderInRepository.name + '`\n' +
            'Matches: 1 / Wins: 0 / Losses: 0\n' +
            '[anarki vs klesk on aerowalk]\n';

        //when
        handler.makeItSo(parsedCommand, callbackSpy, notificationSpy);

        //then
        let actualMessage = notificationSpy.send.getCall(0).args[0];

        assert.that(actualMessage).is.equalTo(expectedNotificationMessage);
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