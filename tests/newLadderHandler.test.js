'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import newLadderHandler from '../app/handlers/newLadderHandler.js';

describe('newLadderHandler', () => {
    it('should create new ladder', () => {
        // when
        let fakeRepo = {
            createNewLadder: sinon.spy()
        };

        newLadderHandler.__Rewire__('repo', fakeRepo);

        let parsedCommand = ['newladder', 'normal'];
        let result = newLadderHandler.makeItSo(parsedCommand);

        // then
        let name = fakeRepo.createNewLadder.getCall(0).args[0];

        assert.that(name).is.equalTo('normal');
        assert.that(result).is.equalTo('Created new ladder: normal');
    });
});