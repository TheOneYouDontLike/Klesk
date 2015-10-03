'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import newSeasonHandler from '../app/handlers/newSeasonHandler';
import Persistence from 'JsonPersistence';
import seasonsHelper from '../app/seasonsHelper';

let ladder = {
    name: 'some ladder',
    seasons: [
        {
            number: 1,
            map: 'campgrounds',
            matches: []
        }
    ]
};

let fakePersistence = {};
let callbackSpy = {};
let handler = {};

let mapList = [{name: 'aerowalk'}];
let fakeMapPersistence = {
    getAll (callback) {
        callback(null, mapList);
    }
};

let emptyNotification = {send: () => {}};

let fsMock = {
    readFile (fileName, callback) {
        callback(null, JSON.stringify([ladder]));
    },
    writeFile (filename, data) {
        ladder = JSON.parse(data)[0];
    }
};

describe('newSeasonHandler', () => {
    beforeEach(() => {
        fakePersistence = new Persistence('filename', fsMock);
        callbackSpy = sinon.spy();
        handler = newSeasonHandler(fakePersistence, fakeMapPersistence);
    });

    it('should create new season when ladder exists', () => {
        // given
        let parsedCommand = {
            playerName: 'somedude',
            arguments: ['newseason', 'some ladder']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, emptyNotification);

        // then
        assert.that(callbackSpy.calledWith(null, 'New season added to `some ladder`')).is.true();
        assert.that(ladder.seasons.length).is.equalTo(2);
        assert.that(seasonsHelper.getActiveSeason(ladder).matches.length).is.equalTo(0);
    });

    it('should get random map when creating new season', () => {
        // given
        let parsedCommand = {
            playerName: 'somedude',
            arguments: ['newseason', 'some ladder']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, emptyNotification);

        // then
        assert.that(ladder.seasons[0].map.name).is.equalTo('aerowalk');
    });

    it('should send notification about new season', () => {
        // given
        let parsedCommand = {
            playerName: 'somedude',
            arguments: ['newseason', 'some ladder']
        };

        let notificationSpy = sinon.spy();

        // when
        handler.makeItSo(parsedCommand, () => {}, {send: notificationSpy});

        // then
        assert.that(notificationSpy.calledWith('New season added to `some ladder`')).is.true();
    });

    it('should log errors on failure', () => {
        // given
        let fsError = new Error();

        fsMock.writeFile = (filename, data, callback) => {
            callback(fsError);
        };

        let parsedCommand = {
            playerName: 'somedude',
            arguments: ['newseason', 'some ladder']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, emptyNotification);

        // then
        assert.that(callbackSpy.calledWith(null, 'Error occured')).is.true();
    });

    // should not create new sesaon when ladder does not exist
});
