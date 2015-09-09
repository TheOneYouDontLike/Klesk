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

describe('newSeasonHandler', () => {
    beforeEach(() => {
        let fsMock = {
            readFile (fileName, callback) {
                callback(null, JSON.stringify([ladder]));
            },
            writeFile (filename, data) {
                ladder = JSON.parse(data)[0];
            }
        };

        fakePersistence = new Persistence('filename', fsMock);
        callbackSpy = sinon.spy();
        handler = newSeasonHandler(fakePersistence);
    });

    it('should create new season when ladder exists', () => {
        // given
        let parsedCommand = {
            playerName: 'somedude',
            arguments: ['newseason', 'laddername']
        };

        // when
        handler.makeItSo(parsedCommand, callbackSpy, {});

        // then
        assert.that(callbackSpy.calledWith(null, 'New season added to `some ladder`')).is.true();
    });
});
