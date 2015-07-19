'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResultHandler from '../app/handlers/addResultHandler';

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

let handler = addResultHandler(fakePersistence);
let callbackSpy = sinon.spy();

describe('addResultHandler', () => {
    it('should save result of the match', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'Result saved!')).is.true();
    });

    it('should not allow adding results by player who was not in match', () => {
        //given
        let parsedCommand = {
            playerName: 'notInMatch',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'You were not in the match and cannot add result.')).is.true();
    });

    it('should not save match result twice', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        ladder = {
            name: 'laddername', 
            matches: [{player1: 'winner', player2: 'loser', winner: 'winner'}]
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'This match result has already been added.')).is.true();
    });

    it('should not save result if no winner is found in command', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', 'winner', 'loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'Indicate winner by adding a + before their name.'));
    });
});