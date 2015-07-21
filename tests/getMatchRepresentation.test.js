'use strict';

import getMatchRepresentation from '../app/getMatchRepresentation';
import assert from 'assertthat';

describe('getMatchRepresentation', () => {
    it('should correctly format match without winner', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:''};
        let expectedRepresentation = '[player1 vs player2]';

        //when
        let actualRepresentation = getMatchRepresentation(match);
        
        //then
        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    });

    it('should correctly format match when player1 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player1'};
        let expectedRepresentation = '[`+player1` vs player2]';

        //when
        let actualRepresentation = getMatchRepresentation(match);
        
        //then
        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    });

    it('should correctly format match when player2 won', () => {
        //given
        let match = {player1:'player1', player2:'player2', winner:'player2'};
        let expectedRepresentation = '[player1 vs `+player2`]';

        //when
        let actualRepresentation = getMatchRepresentation(match);
        
        //then
        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    });
})