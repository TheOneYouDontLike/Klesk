'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResultHandler from '../app/handlers/addResultHandler';
import Persistence from 'JsonPersistence';

let ladder = {};
let fakePersistence = {};
let handler = {};
let callbackSpy = {};
let dummyNotification = { send: () => {} };

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

    it('should save result of the match without provided score', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        //then
        assert.that(ladder.matches[0].winner).is.equalTo('winner');
        assert.that(ladder.matches[0].score).is.undefined();
        assert.that(callbackSpy.calledWith(null, 'Result saved!')).is.true();
    });

    it('should save third command argument as match score if provided', () => {
        //given
        let matchScore = '33:20';
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', matchScore]
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        //then
        assert.that(ladder.matches[0].score).is.equalTo(matchScore);
        assert.that(callbackSpy.calledWith(null, 'Result saved!')).is.true();
    });

    it('should not save third command argument as match score if invalid score provided', () => {
        //given
        let matchScore = 'an_invalid_score';
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', matchScore]
        };
        let expectedCallbackMessage = 'Score `' + matchScore + '` is invalid, score should be in format `int:int`';

        //when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        //then
        assert.that(ladder.matches[0].score).is.undefined();
        assert.that(callbackSpy.calledWith(null, expectedCallbackMessage)).is.true();
    });

    it('should send notification when adding result', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        let notificationSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, () => {}, { send: notificationSpy });

        //then
        assert.that(notificationSpy.calledWith('`winner` has won a match with `loser` on ladder `laddername`')).is.true();
    });

    it('should send match score in notification if valid score provided', () => {
        //given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', '21:30']
        };

        let notificationSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, () => {}, { send: notificationSpy });

        //then
        let notificationMessage = notificationSpy.getCall(0).args[0];
        assert.that(notificationMessage).is.equalTo('`winner` has won a match with `loser` on ladder `laddername`\nmatch score - 30:21');
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
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'inexistentPlayer']
        };

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'There is no match with given players in the ladder.')).is.true();
    });
});