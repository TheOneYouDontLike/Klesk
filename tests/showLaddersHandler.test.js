'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import showLaddersHandler from '../app/handlers/showLaddersHandler.js';

let parsedCommand = {
    playerName: 'anarki',
    arguments: ['showladders']
};

describe('showLaddersHandler', () => {
    it('should show all possible ladders', () => {
        // given
        let ladders = [
            {name: 'normal'},
            {name: 'insta'}
        ];

        let fakePersistence = {
            getAll (callback) {
                callback(null, ladders);
            }
        };

        let handler = showLaddersHandler(fakePersistence);

        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.getCall(0).args[1]).is.equalTo('Active ladders: `normal`, `insta`');
    });

    it('should return info if there are no ladders', () => {
        // given
        let ladders = [];

        let fakePersistence = {
            getAll (callback) {
                callback(null, ladders);
            }
        };

        let handler = showLaddersHandler(fakePersistence);

        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.getCall(0).args[1]).is.equalTo('There are no active ladders.');
    });

    it('should inform about errors and log them', () => {
        // given
        let expectedError = new Error('something went wrong');

        let fakePersistence = {
            getAll (callback) {
                callback(expectedError, null);
            }
        };

        let loggerSpy = sinon.spy();
        showLaddersHandler.__Rewire__('logger', loggerSpy);

        let handler = showLaddersHandler(fakePersistence);

        let callbackSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, callbackSpy);

        // then
        assert.that(callbackSpy.getCall(0).args[0]).is.equalTo(expectedError);
        assert.that(loggerSpy.getCall(0).args[0]).is.equalTo(expectedError);
    });
});
