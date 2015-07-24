'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResultHandler from '../app/handlers/addResultHandler';
import Persistence from 'JsonPersistence';

let ladder = {};
let fakePersistence = {};
let handler = {};
let callbackSpy = {};

describe('addResultHandler', () => {
    beforeEach(() => {
        ladder = {
            name: 'laddername',
            matches: [
                { player1: 'winner', player2: 'loser', winner: '' }
            ]
        };

        let fsMock = {
            readFile(fileName, callback) {
                callback(null, JSON.stringify([ladder]));
            },
            writeFile(filename, data) {
                ladder = JSON.parse(data)[0];
            }
        };

        fakePersistence = new Persistence('filename', fsMock);

        handler = addResultHandler(fakePersistence);

        callbackSpy = sinon.spy();
    });

    it('should save result of the match', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(ladder.matches[0].winner).is.equalTo('winner');
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
        assert.that(ladder.matches[0].winner).is.equalTo('');
        assert.that(callbackSpy.calledWith(null, 'You were not in the match and cannot add result.')).is.true();
    });

    it('should not save match result twice', () => {
        ladder = {
            name: 'laddername',
            matches: [{player1: 'winner', player2: 'loser', winner: 'winner'}]
        };

        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
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

    it('should not save result if both players in command are indicated as winners', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', '+loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'Both players could not have won, get your shit together.')).is.true();
    });

    it('should not save result if match with both players does not exist in ladder', () => {
        //given
        let ladderToUpdate = {
            name: 'ladderName',
            matches: [
                { player1: 'winner', player2: 'loser', winner: '' }
            ]
        };

        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'inexistentPlayer']
        };

        let fsMock = {
            readFile(fileName, callback) {
                callback(null, JSON.stringify([ladderToUpdate]));
            },
            writeFile(filename, data) {
                ladderToUpdate = JSON.parse(data)[0];
            }
        };

        let persistence = new Persistence('filename', fsMock);

        let handler = addResultHandler(persistence);

        let callbackSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'There is no match with given players in the ladder.')).is.true();
    });
});