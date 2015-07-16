'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import newLadderHandler from '../app/handlers/newLadderHandler.js';

describe('newLadderHandler', () => {
    it('should return result new ladder name', () => {
        // given
        let parsedCommand = ['newladder', 'normal'];

        let fakeRepo = {
            createNewLadder(ladderName, callback) {
                callback(null);
            }
        };
        newLadderHandler.__Rewire__('repo', fakeRepo);

        let callback = sinon.spy();
        // when

        newLadderHandler.makeItSo(parsedCommand, callback);

        // then
        assert.that(callback.calledWith(null, 'Created new ladder: normal')).is.true();
    });

    it('should create new ladder using underlying repo', () => {
        // given
        let parsedCommand = ['newladder', 'normal'];

        let fakeRepo = {
            createNewLadder: sinon.spy()
        };
        newLadderHandler.__Rewire__('repo', fakeRepo);

        // when
        newLadderHandler.makeItSo(parsedCommand, () => {});

        // then
        assert.that(fakeRepo.createNewLadder.calledWith('normal', sinon.match.func)).is.true();
    });
});