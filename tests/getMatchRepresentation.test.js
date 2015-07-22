'use strict';

import getMatchRepresentation from '../app/getMatchRepresentation';
import assert from 'assertthat';

describe('getMatchRepresentation', () => {
    let mapName = 'aerowalk';

    function _testMatchRepresentation(match, mapName, expectedRepresentation) {
        let actualRepresentation = getMatchRepresentation(match, mapName);

        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    }

    it('should correctly format match without winner', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:''};
        let expectedRepresentation = '[player1 vs player2 on aerowalk]';

        //when -> //then
        _testMatchRepresentation(match, mapName, expectedRepresentation);
    });

    it('should correctly format match when player1 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player1'};
        let expectedRepresentation = '[`+player1` vs player2 on aerowalk]';

        //when -> //then
        _testMatchRepresentation(match, mapName, expectedRepresentation);
    });

    it('should correctly format match when player2 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player2'};
        let expectedRepresentation = '[player1 vs `+player2` on aerowalk]';

        //when -> //then
        _testMatchRepresentation(match, mapName, expectedRepresentation);
    });
})