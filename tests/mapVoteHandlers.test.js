'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import {mapUpVoteHandler, mapDownVoteHandler} from '../app/maps/mapVoteHandlers';

function _shouldRequireMapNameAndKeyword(handler) {
    //given
    let parsedCommand = {
        arguments: ['voteForMap']
    };

    let callbackSpy = sinon.spy();

    //when
    handler.makeItSo(parsedCommand, callbackSpy);

    //then
    assert.that(callbackSpy.calledWith(null, 'Missing arguments, correct syntax is `(up|down)votemap <mapName> <keyword>`')).is.true();
}

function _shouldRequireKeyword(handler) {
    //given
    let parsedCommand = {
        arguments: ['voteForMap', 'map name']
    };

    let callbackSpy = sinon.spy();

    //when
    handler.makeItSo(parsedCommand, callbackSpy);

    //then
    assert.that(callbackSpy.calledWith(null, 'Missing arguments, correct syntax is `(up|down)votemap <mapName> <keyword>`')).is.true();
}

describe('downvoting a map', () => {
    let handler = new mapDownVoteHandler({});

    it('should require map name and keyword if nothing provided', () => {
        _shouldRequireMapNameAndKeyword(handler);
    });

    it('should required keyword if only map name provided', () => {
        _shouldRequireKeyword(handler);
    });
});

describe('upvoting a map', () => {
    let handler = new mapUpVoteHandler({});

    it('should require map name and keyword if nothing provided', () => {
        _shouldRequireMapNameAndKeyword(handler);
    });

    it('should required keyword if only map name provided', () => {
        _shouldRequireKeyword(handler);
    });
});