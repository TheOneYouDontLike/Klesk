'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import addResultHandler from '../app/handlers/addResultHandler';
import Persistence from 'JsonPersistence';
import seasonsHelper from '../app/seasonsHelper';

let ladder = {};
let fakePersistence = {};
let handler = {};
let callbackSpy = {};
let dummyNotification = {send: () => {}};

describe('addResultHandler', () => {
    beforeEach(() => {
        ladder = {
            name: 'laddername',
            seasons: [
                {
                    number: 1,
                    matches: []
                },
                {
                    number: 2,
                    matches: [
                        {player1: 'winner', player2: 'loser', winner: ''}
                    ]
                }
            ]
        };

        let fsMock = {
            readFile (fileName, callback) {
                callback(null, JSON.stringify([ladder]));
            },
            writeFile (filename, data, callback) {
                ladder = JSON.parse(data)[0];
                callback();
            }
        };

        fakePersistence = new Persistence('filename', fsMock);
        handler = addResultHandler(fakePersistence);
        callbackSpy = sinon.spy();
    });

    it('should save result of the match without provided score', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        // then
        let activeSeason = seasonsHelper.getActiveSeason(ladder);
        assert.that(activeSeason.matches[0].winner).is.equalTo('winner');
        assert.that(activeSeason.matches[0].score).is.undefined();
        assert.that(callbackSpy.calledWith(null, 'Result saved!')).is.true();
    });

    it('should save third command argument as match score if provided', () => {
        // given
        let matchScore = '33:20';
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', matchScore]
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        // then
        let activeSeason = seasonsHelper.getActiveSeason(ladder);
        assert.that(activeSeason.matches[0].score).is.equalTo(matchScore);
        assert.that(callbackSpy.calledWith(null, 'Result saved!')).is.true();
    });

    it('should not save third command argument as match score if invalid score provided', () => {
        // given
        let matchScore = 'an_invalid_score';
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', matchScore]
        };
        let expectedCallbackMessage = 'Score `' + matchScore + '` is invalid, score should be in format `int:int`';

        // when
        handler.makeItSo(parsedCommand, callbackSpy, dummyNotification);

        // then
        let activeSeason = seasonsHelper.getActiveSeason(ladder);
        assert.that(activeSeason.matches[0].score).is.undefined();
        assert.that(callbackSpy.calledWith(null, expectedCallbackMessage)).is.true();
    });

    it('should send notification when adding result', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        assert.that(notificationSpy.calledWith('`winner` has won a match with `loser` on ladder `laddername`')).is.true();
    });

    it('should send match score in notification if valid score provided', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser', '21:30']
        };

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        let notificationMessage = notificationSpy.getCall(0).args[0];
        assert.that(notificationMessage).is.equalTo('`winner` has won a match with `loser` on ladder `laddername`\nmatch score - 30:21');
    });

    it('should not allow adding results by player who was not in match', () => {
        // given
        let parsedCommand = {
            playerName: 'notInMatch',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        let activeSeason = seasonsHelper.getActiveSeason(ladder);
        assert.that(activeSeason.matches[0].winner).is.equalTo('');
        assert.that(callbackSpy.calledWith(null, 'You were not in the match and cannot add result.')).is.true();
    });

    it('should not save match result twice', () => {
        // given
        ladder = {
            name: 'laddername',
            seasons: [
                {
                    number: 1,
                    matches: []
                },
                {
                    number: 2,
                    matches: [{player1: 'winner', player2: 'loser', winner: 'winner'}]
                }
            ]
        };

        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.calledWith(null, 'This match result has already been added.')).is.true();
    });

    it('should not save result if no winner is found in command', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', 'winner', 'loser']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.calledWith(null, 'Indicate winner by adding a + before their name.'));
    });

    it('should not save result if both players in command are indicated as winners', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', '+loser']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.calledWith(null, 'Both players could not have won, get your shit together.')).is.true();
    });

    it('should not save result if match with both players does not exist in ladder', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'inexistentPlayer']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.calledWith(null, 'There is no match with given players in the ladder.')).is.true();
    });

    it('should send a notification about a finished ladder', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        let notificationMessage = notificationSpy.getCall(1).args[0];
        assert.that(notificationMessage).is.equalTo('All matches in `laddername` have been played!\n`winner` 1/0\n`loser` 0/1\n');
    });

    it('should send a personal notification when player played all matches', () => {
        // given
        let parsedCommand = {
            playerName: 'winner',
            arguments: ['addresult', 'laddername', '+winner', 'loser']
        };

        ladder = {
            name: 'laddername',
            seasons: [
                {
                    number: 1,
                    matches: [
                        {player1: 'winner', player2: 'loser', winner: ''},
                        {player1: 'player1', player2: 'player2', winner: ''},
                        {player1: 'player1', player2: 'winner', winner: 'winner'},
                        {player1: 'player1', player2: 'loser', winner: 'loser'},
                        {player1: 'winner', player2: 'player2', winner: 'player2'},
                        {player1: 'loser', player2: 'player2', winner: 'player2'}
                    ]
                }
            ]
        };

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        let winnerNotificationMessage = notificationSpy.getCall(1).args[0];
        assert.that(winnerNotificationMessage).is.equalTo('You played all matches in ladder `laddername`\nYour stats are: 2/1');

        let winnerChannelOverride = notificationSpy.getCall(1).args[1];
        assert.that(winnerChannelOverride).is.equalTo('@winner');

        let loserNotificationMessage = notificationSpy.getCall(2).args[0];
        assert.that(loserNotificationMessage).is.equalTo('You played all matches in ladder `laddername`\nYour stats are: 1/2');

        let loserChannelOverride = notificationSpy.getCall(2).args[1];
        assert.that(loserChannelOverride).is.equalTo('@loser');
    });
});
