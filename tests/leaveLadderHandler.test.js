'use strict';

import Persistence from 'JsonPersistence';
import sinon from 'sinon';
import leaveLadderHandler from  '../app/handlers/leaveLadderHandler';
import assert from 'assertthat';
import seasonsHelper from '../app/seasonsHelper';

describe('leaveLadderHandler', () => {
    it('should remove all matches with the player that is leaving from active season', () => {
        // given
        let ladderToUpdate = {
            name: 'ladderName',
            seasons:
            [
                {
                    number: 1,
                    matches: []
                },
                {
                    number: 2,
                    matches: [
                        {player1: 'playerThatIsLeaving', player2: 'player2', winner: 'player2'},
                        {player1: 'playerThatIsLeaving', player2: 'player1', winner: 'playerThatIsLeaving'},
                        {player1: 'player1', player2: 'player2', winner: ''}
                    ]
                }
            ]
        };

        let parsedCommand = {
            playerName: 'playerThatIsLeaving',
            arguments: ['leaveladder', ladderToUpdate.name]
        };

        let fsMock = {
            readFile (fileName, callback) {
                callback(null, JSON.stringify([ladderToUpdate]));
            },
            writeFile (filename, data) {
                ladderToUpdate = JSON.parse(data)[0];
            }
        };

        let persistence = new Persistence('filename', fsMock);
        let handler = leaveLadderHandler(persistence);
        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, callbackSpy, {send: () => {}});

        // then
        let activeSeason = seasonsHelper.getActiveSeason(ladderToUpdate);

        assert.that(callbackSpy.calledWith(null, 'You are no longer a part of the ladder `ladderName`')).is.true();
        assert.that(activeSeason.matches.length).is.equalTo(1);

        let onlyMatch = activeSeason.matches[0];
        assert.that(onlyMatch.player1 === 'player1');
        assert.that(onlyMatch.player2 === 'player2');
        assert.that(onlyMatch.winner = '');
    });

    it('should send notification when player is leaving', () => {
        // given
        let ladderToUpdate = {
            name: 'ladderName',
            seasons: [
                {
                    number: 1,
                    matches: [
                        {player1: 'playerThatIsLeaving', player2: 'player2', winner: 'player2'}
                    ]
                }
            ]
        };

        let parsedCommand = {
            playerName: 'playerThatIsLeaving',
            arguments: ['leaveladder', ladderToUpdate.name]
        };

        let fsMock = {
            readFile (fileName, callback) {
                callback(null, JSON.stringify([ladderToUpdate]));
            },
            writeFile (filename, data) {
                ladderToUpdate = JSON.parse(data)[0];
            }
        };

        let persistence = new Persistence('filename', fsMock);
        let handler = leaveLadderHandler(persistence);

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        assert.that(notificationSpy.calledWith('`playerThatIsLeaving` is no longer a part of the ladder `ladderName`')).is.true();
    });
});
