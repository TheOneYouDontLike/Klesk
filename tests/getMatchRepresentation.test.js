'use strict';

import getMatchRepresentation from '../app/getMatchRepresentation';
import assert from 'assertthat';


describe('getMatchRepresentation', () => {
    let mapName = 'aerowalk';

    function _testMatchRepresentation(match, mapName, expectedRepresentation) {
        let actualRepresentation = getMatchRepresentation(match, mapName);

        assert.that(actualRepresentation).is.equalTo(expectedRepresentation);
    }

    let testCases = [
        {
            match: {player1:'player1', player2:'player2', winner:''},
            expectedRepresentation: '[player1 vs player2 on aerowalk]'
        },
        {
            match: {player1:'player1', player2:'player2', winner:'player1'},
            expectedRepresentation: '[`+player1` vs player2 on aerowalk]'
        },
        {
            match: {player1:'player1', player2:'player2', winner:'player2'},
            expectedRepresentation: '[player1 vs `+player2` on aerowalk]'
        },
        {
            match: {player1:'player1', player2:'player2', winner:'', score:'22:10'},
            expectedRepresentation: '[player1 vs player2 (22:10) on aerowalk]'
        },
        {
            match: {player1:'player1', player2:'player2', winner:'player1', score:'22:10'},
            expectedRepresentation: '[`+player1` vs player2 (22:10) on aerowalk]'
        },
        {
            match: {player1:'player1', player2:'player2', winner:'player2', score:'22:10'},
            expectedRepresentation: '[player1 vs `+player2` (22:10) on aerowalk]'
        },
    ];

    it('should give correct representations', () => {
        testCases.forEach(function(testCase) {
            _testMatchRepresentation(testCase.match, mapName, testCase.expectedRepresentation);
        });
    });
});