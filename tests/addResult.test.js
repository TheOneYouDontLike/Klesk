'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResult from '../app/handlers/addResult.js'

describe('addResultHandler', () => {
    it('should save result of the match', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        let ladder = {
            name: 'laddername',
            matches: [
                {player1: 'winner', player2: 'loser', winner: ''}
            ]
        };

        let fakePersistence = {
            query(filterFunc, updateFunc, callback) {
                callback(null, [ladder])
            },
            update: sinon.spy()
        };

        let handler = addResult(fakePersistence);

        //when
        handler.makeItSo(parsedCommand, () => {});

        //then
        assert.that(fakePersistence.update.calledWith(sinon.match.func, sinon.match.func, sinon.match.func)).is.true();
    });
});