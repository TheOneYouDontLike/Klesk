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
            { name: 'normal' },
            { name: 'insta' }
        ];

        let fakePersistence = {
            getAll(callback) {
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
            getAll(callback) {
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
});