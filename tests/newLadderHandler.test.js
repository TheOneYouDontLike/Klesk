'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import newLadderHandler from '../app/handlers/newLadderHandler.js';

let parsedCommand = {
    arguments: ['newladder', 'normal']
};

let mapList = [{name: 'aerowalk'}];
let fakeMapPersistence = {
    getAll(callback) {
        callback(null, mapList);
    }
};

let emptyNotification = { send: () => {} };

describe('newLadderHandler', () => {
    it('should return result with new ladder name', () => {
        // given
        let fakeLadderPersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add(ladder, callback) {
                callback(null);
            }
        };
        let handler = newLadderHandler(fakeLadderPersistence, fakeMapPersistence);

        let callback = sinon.spy();
        // when

        handler.makeItSo(parsedCommand, callback, emptyNotification);

        // then
        assert.that(callback.calledWith(null, 'Created new ladder: `normal`')).is.true();
    });

    it('should send notification about new ladder', () => {
        // given
        let fakeLadderPersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add(ladder, callback) {
                callback(null);
            }
        };
        let handler = newLadderHandler(fakeLadderPersistence, fakeMapPersistence);

        let notificationCallback = sinon.spy();
        // when

        handler.makeItSo(parsedCommand, () => {}, { send: notificationCallback });

        // then
        assert.that(notificationCallback.calledWith('Created new ladder: `normal`')).is.true();
    });

    it('should create new ladder using underlying repo', () => {
        // given
        let fakeLadderPersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add: sinon.spy()
        };
        let handler = newLadderHandler(fakeLadderPersistence, fakeMapPersistence);

        let expectedLadder = {
            name: 'normal',
            matches: []
        };

        // when
        handler.makeItSo(parsedCommand, () => {});

        // then
        let actualLadder = fakeLadderPersistence.add.getCall(0).args[0];
        assert.that(actualLadder.name).is.equalTo(expectedLadder.name);
    });

    it ('should not create the same ladder two times', () => {
        //given
        let ladderInRepository = {
            name: parsedCommand.arguments[1],
            matches: []
        };

        let fakeLadderPersistence = {
            getAll(callback) {
                callback(null, [ladderInRepository]);
            }
        };

        let callbackSpy = sinon.spy();
        let handler = newLadderHandler(fakeLadderPersistence, fakeMapPersistence);

        //when
        handler.makeItSo(parsedCommand, callbackSpy);

        //then
        assert.that(callbackSpy.calledWith(null, 'Ladder `' + ladderInRepository.name + '` already exists.')).is.true();
    });

    it('should pick a random map from the list when creating a ladder', () => {
        //given
        let fakeLadderPersistence = {
            getAll(callback) {
                callback(null, []);
            },
            add(ladder, callback) {
                callback(null);
            }
        };

        let addLadderSpy = sinon.spy(fakeLadderPersistence, 'add');
        let callbackSpy = sinon.spy();
        let handler = newLadderHandler(fakeLadderPersistence, fakeMapPersistence);

        //when
        handler.makeItSo(parsedCommand, callbackSpy, emptyNotification);

        //then
        let addedLadder = addLadderSpy.getCall(0).args[0];
        assert.that(mapList).is.containing(addedLadder.map);
        assert.that(callbackSpy.calledWith(null, 'Created new ladder: `normal`')).is.true();
    });
});