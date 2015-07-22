'use strict';

import assert from 'assertthat';
import rankingHandler from '../app/handlers/rankingHandler';
import sinon from 'sinon';

describe('ranking handler', () => {
    it('should present played matches first', () => {
        //given
        let parsedCommand = {
            arguments: ['ranking', 'ladderName']
        }

        let ladderWithNotPlayedMatchFirst = {
            name: 'ladderName',
            map: {name: 'aerowalk'},
            matches: [
                {player1: 'unplayedMatchPlayer1', player2: 'unplayedMatchPlayer2', winner: ''},
                {player1: 'playedMatchPlayer1', player2: 'playedMatchPlayer2', winner: 'playedMatchPlayer1'}
            ]
        }

        let expectedResponseString = '`ladderName matches:`[`+playedMatchPlayer1` vs playedMatchPlayer2 on aerowalk][unplayedMatchPlayer1 vs unplayedMatchPlayer2 on aerowalk]';

        let fakePersistence = {
            query(filter, callback) {
                callback(null, [ladderWithNotPlayedMatchFirst])
            }
        }

        let handler = rankingHandler(fakePersistence);

        let callbackSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, callbackSpy);
        
        //then
        assert.that(callbackSpy.calledWith(null, expectedResponseString)).is.true();
    });
});