'use strict';

import assert from 'assertthat';
import slackTextSnippets from '../app/slackTextSnippets';
import sinon from 'sinon';

describe('new match result notifcation', () => {
    it('should display winner score first', () => {
        //given

        //when
        let winningScoreFirst = slackTextSnippets.notifications.matchResultAdded('winner', 'loser', 'ladderName', '32:30');
        let losingScoreFirst = slackTextSnippets.notifications.matchResultAdded('winner', 'loser', 'ladderName', '30:32');
        
        //then
        let expectedMessage = '`winner` has won a match with `loser` on ladder `ladderName`\nmatch score - 32:30';

        assert.that(winningScoreFirst).is.equalTo(expectedMessage);
        assert.that(losingScoreFirst).is.equalTo(expectedMessage);
    });
});