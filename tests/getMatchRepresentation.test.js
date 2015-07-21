'use strict';

import getMatchRepresentation from '../app/getMatchRepresentation';
import assert from 'assertthat';

describe('getMatchRepresentation', () => {
    function _testMatchRepresentation(match, expectedRepresentation) {
        let actualRepresentation = getMatchRepresentation(match);

        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    }

    it('should correctly format match without winner', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:''};
        let expectedRepresentation = '[player1 vs player2]';

        //when -> //then
        _testMatchRepresentation(match, expectedRepresentation);
    });

    it('should correctly format match when player1 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player1'};
        let expectedRepresentation = '[`+player1` vs player2]';

        //when -> //then
        _testMatchRepresentation(match, expectedRepresentation);
    });

    it('should correctly format match when player2 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player2'};
        let expectedRepresentation = '[player1 vs `+player2`]';

        //when -> //then
        _testMatchRepresentation(match, expectedRepresentation);
    });
})