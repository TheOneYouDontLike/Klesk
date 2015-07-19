'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResultHandler from '../app/handlers/addResultHandler';

describe('addResultHandler', () => {
    it('should save result of the match', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        let ladder = 
        {
            name: 'laddername', 
            matches: [{player1: 'winner', player2: 'loser', winner: ''}]
        };

        let fakePersistence = {
            update(query, update, callback) {
                query(ladder); update(ladder); callback();
            }
        };

        let callbackSpy = sinon.spy();
        let handler = addResultHandler(fakePersistence);

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.getCall(0).args[1]).is.equalTo('Result saved!');
    });
});