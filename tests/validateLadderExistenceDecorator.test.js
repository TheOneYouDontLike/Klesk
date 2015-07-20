'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import validateLadderExistenceDecorator from '../app/validation/validateLadderExistenceDecorator.js';

describe('validateLadderExistenceDecorator', () => {
    it('should call decorated handler when ladder exists', () => {
        // given
        let dummyLadderThatShouldPassFiltering = {
            name: 'normal'
        };

        let jsonPersistence = {
            query(filter, queryCallback) {
                if (filter(dummyLadderThatShouldPassFiltering)) {
                    queryCallback(null, [ dummyLadderThatShouldPassFiltering ]);
                }
            }
        };

        let decoratedHandlerSpy = {
            makeItSo: sinon.spy()
        };

        let decorator = validateLadderExistenceDecorator(decoratedHandlerSpy, jsonPersistence);

        let parsedCommand = {
            arguments: ['somecommand', 'normal', 'something']
        };
        let decoratedHandlerCallback = () => {};

        // when
        decorator.makeItSo(parsedCommand, decoratedHandlerCallback);

        // then
        assert.that(decoratedHandlerSpy.makeItSo.calledWith(parsedCommand, decoratedHandlerCallback)).is.true();
    });

    it('should return error when ladder does not exist', () => {
        // given
        let dummyLadderThatShouldNotPassFiltering = {
            name: 'normal'
        };

        let jsonPersistence = {
            query(filter, callback) {
                if (!filter(dummyLadderThatShouldNotPassFiltering)) {
                    callback(null, []);
                }
            }
        };

        let decoratedHandlerSpy = {
            makeItSo: sinon.spy()
        };

        let decorator = validateLadderExistenceDecorator(decoratedHandlerSpy, jsonPersistence);

        let parsedCommand = {
            arguments: ['somecommand', 'iDoNotExistLadderName', 'something']
        };
        let decoratedHandlerCallback = sinon.spy();

        // when
        decorator.makeItSo(parsedCommand, decoratedHandlerCallback);

        // then
        assert.that(decoratedHandlerSpy.makeItSo.called).is.false();

        let expectedError = new Error('There is no `iDoNotExistLadderName` ladder.');
        assert.that(decoratedHandlerCallback.calledWith(expectedError, null)).is.true();
    });
});