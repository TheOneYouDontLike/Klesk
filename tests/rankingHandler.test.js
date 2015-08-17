'use strict';

import assert from 'assertthat';
import rankingHandler from '../app/handlers/rankingHandler';
import sinon from 'sinon';

describe('ranking handler', () => {
    it('should present ranking directly to player showing played matches first', () => {
        //given
        let parsedCommand = {
            arguments: ['ranking', 'ladderName'],
            playerName: 'playerName'
        };

        let ladderWithNotPlayedMatchFirst = {
            name: 'ladderName',
            map: {name: 'aerowalk'},
            matches: [
                {player1: 'unplayedMatchPlayer1', player2: 'unplayedMatchPlayer2', winner: ''},
                {player1: 'playedMatchPlayer1', player2: 'playedMatchPlayer2', winner: 'playedMatchPlayer1'}
            ]
        };

        let expectedResponseString = 'Ranking sent directly to you on your @slackbot channel';
        let expectedNotificationString = '`ladderName matches`\n[`+playedMatchPlayer1` vs playedMatchPlayer2 on aerowalk]\n[unplayedMatchPlayer1 vs unplayedMatchPlayer2 on aerowalk]\n';

        let fakePersistence = {
            query(filter, callback) {
                callback(null, [ladderWithNotPlayedMatchFirst]);
            }
        };

        let handler = rankingHandler(fakePersistence);

        let callbackSpy = sinon.spy();
        let notificationSpy = {
            send: sinon.spy()
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy, notificationSpy);
        
        //then
        assert.that(callbackSpy.calledWith(null, expectedResponseString)).is.true();
        assert.that(notificationSpy.send.calledWith(expectedNotificationString, '@' + parsedCommand.playerName)).is.true();
    });
});