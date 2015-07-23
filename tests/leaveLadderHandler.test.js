'use strict';

import Persistence from 'JsonPersistence';
import sinon from 'sinon';
import leaveLadderHandler from  '../app/handlers/leaveLadderHandler';
import assert from 'assertthat';

describe('leavLadderHandler', () => {
    it('should remove all matches with the player', () => {
        //given
        let ladderToUpdate = {
            name: 'ladderName',
            matches: [
                {player1: 'player', player2: 'player2', winner: 'player2'},
                {player1: 'player', player2: 'player1', winner: 'player'},
                {player1: 'player', player2: 'player1', winner: ''},
                {player1: 'player1', player2: 'player2', winner: ''},
            ]
        };

        let parsedCommand = {
            playerName: 'player',
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
        handler.makeItSo(parsedCommand, callbackSpy);
        
        //then
        assert.that(callbackSpy.calledWith(null, 'You are no longer a part of the ladder')).is.true();
        assert.that(ladderToUpdate.matches.length).is.equalTo(1);
        let onlyMatch = ladderToUpdate.matches[0];
        assert.that(onlyMatch.player1 === 'player1');
        assert.that(onlyMatch.player2 === 'player2');
        assert.that(onlyMatch.winner = '');
    });
});