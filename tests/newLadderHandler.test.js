'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import newLadderHandler from '../app/handlers/newLadderHandler.js';

let parsedCommand = {
    arguments: ['newladder', 'normal']
};

describe('newLadderHandler', () => {
    it('should return result with new ladder name', () => {
        // given
        let fakePersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add(ladder, callback) {
                callback(null);
            }
        };
        let handler = newLadderHandler(fakePersistence);

        let callback = sinon.spy();
        // when

        handler.makeItSo(parsedCommand, callback);

        // then
        assert.that(callback.calledWith(null, 'Created new ladder: normal')).is.true();
    });

    it('should create new ladder using underlying repo', () => {
        // given
        let fakePersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add: sinon.spy()
        };
        let handler = newLadderHandler(fakePersistence);

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        let expectedLadder = {
            name: 'normal',
            matches: []
        };
        assert.that(fakePersistence.add.calledWith(expectedLadder, sinon.match.func)).is.true();
    });

    it ('should not create the same ladder two times', () => {
        //given
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            matches: []
        };

        let fakePersistence = {
            getAll(callback) {
                callback(null, [ladderInRepository]);
            }
        };

        let callbackSpy = sinon.spy();
        let handler = newLadderHandler(fakePersistence);

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'Ladder `' + ladderInRepository.name + '` already exists.')).is.true();
    });
});