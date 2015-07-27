'use strict';

import Persistence from 'JsonPersistence';
import sinon from 'sinon';
import leaveLadderHandler from  '../app/handlers/leaveLadderHandler';
import assert from 'assertthat';

describe('leaveLadderHandler', () => {
    it('should remove all matches with the player that is leaving', () => {
        //given
        let ladderToUpdate = {
            name: 'ladderName',
            matches: [
                {player1: 'playerThatIsLeaving', player2: 'player2', winner: 'player2'},
                {player1: 'playerThatIsLeaving', player2: 'player1', winner: 'playerThatIsLeaving'},
                {player1: 'player1', player2: 'player2', winner: ''},
            ]
        };

        let parsedCommand = {
            playerName: 'playerThatIsLeaving',
            arguments: ['leaveladder', ladderToUpdate.name]
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

        let handler = leaveLadderHandler(persistence);

        let callbackSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, callbackSpy, { send: () => {} });

        //then
        assert.that(callbackSpy.calledWith(null, 'You are no longer a part of the ladder `ladderName`')).is.true();
        assert.that(ladderToUpdate.matches.length).is.equalTo(1);
        let onlyMatch = ladderToUpdate.matches[0];
        assert.that(onlyMatch.player1 === 'player1');
        assert.that(onlyMatch.player2 === 'player2');
        assert.that(onlyMatch.winner = '');
    });

    it('should send notification when player is leaving', () => {
        //given
        let ladderToUpdate = {
            name: 'ladderName',
            matches: [
                {player1: 'playerThatIsLeaving', player2: 'player2', winner: 'player2'}
            ]
        };

        let parsedCommand = {
            playerName: 'playerThatIsLeaving',
            arguments: ['leaveladder', ladderToUpdate.name]
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
        let handler = leaveLadderHandler(persistence);

        let notificationSpy = sinon.spy();

        //when
        handler.makeItSo(parsedCommand, () => {}, { send: notificationSpy });

        //then
        assert.that(notificationSpy.calledWith('`playerThatIsLeaving` is no longer a part of the ladder `ladderName`')).is.true();
    });
});