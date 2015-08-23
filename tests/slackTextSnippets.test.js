'use strict';

import assert from 'assertthat';
import slackTextSnippets from '../app/slackTextSnippets';
import sinon from 'sinon';

describe('should display scores in the order players appear in message', () => {
    it('when creating new match result notification', () => {
        //given

        //when
        let winningScoreFirst = slackTextSnippets.notifications.matchResultAdded('winner', 'loser', 'ladderName', '32:30');
        let losingScoreFirst = slackTextSnippets.notifications.matchResultAdded('winner', 'loser', 'ladderName', '30:32');
        
        //then
        let expectedMessage = '`winner` has won a match with `loser` on ladder `ladderName`\nmatch score - 32:30';

        assert.that(winningScoreFirst).is.equalTo(expectedMessage);
        assert.that(losingScoreFirst).is.equalTo(expectedMessage);
    });

    it('when creating ranking representation', () => {
        //given
        let ladder = {
            name: 'ladder',
            map:  'map',
            matches: [
                { player1: 'winner', player2: 'loser', winner: 'winner', score: '32:23' },
                { player1: 'winner', player2: 'loser', winner: 'winner', score: '23:32' },
                { player1: 'loser', player2: 'winner', winner: 'winner', score: '23:32' },
                { player1: 'loser', player2: 'winner', winner: 'winner', score: '32:23' }
            ]
        };

        let expectedMessage = '`ladder matches`\n' +
        '[`+winner` vs loser 32:23 on map]\n' +
        '[`+winner` vs loser 32:23 on map]\n' +
        '[loser vs `+winner` 23:32 on map]\n' +
        '[loser vs `+winner` 23:32 on map]\n';

        //when
        let rankingMessage = slackTextSnippets.ranking(ladder);
        
        //then
        assert.that(rankingMessage).is.equalTo(expectedMessage);
    });

    it('when creating player stats message', () => {
        //given
        let playerWinsCount = 2;
        let notPlayedMatches = 0;
        let playerMatches = [
            { player1: 'winner', player2: 'loser', winner: 'winner', score: '32:23' },
            { player1: 'winner', player2: 'loser', winner: 'winner', score: '23:32' },
            { player1: 'loser', player2: 'winner', winner: 'winner', score: '23:32' },
            { player1: 'loser', player2: 'winner', winner: 'winner', score: '32:23' }
        ];
        
        let expectedMessage = 'Ladder `ladderName`\n' +
        'Matches: 4 / Wins: ' + playerWinsCount + ' / Losses: 2\n' +
        '[`+winner` vs loser 32:23 on mapName]\n' +
        '[`+winner` vs loser 32:23 on mapName]\n' +
        '[loser vs `+winner` 23:32 on mapName]\n' +
        '[loser vs `+winner` 23:32 on mapName]\n';

        //when
        let playerStatsMessage = slackTextSnippets.playerStats('ladderName', playerWinsCount, notPlayedMatches, playerMatches, 'mapName');
        
        //then
        assert.that(playerStatsMessage).is.equalTo(expectedMessage);
    });
});