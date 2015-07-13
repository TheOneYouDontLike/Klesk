'use strict';

import assert from 'assertthat';

import commandBus from '../app/commandBus.js';

describe('commandBus', () => {
    it('dispatches events properly', () => {
        assert.that(commandBus.dispatch('some command')).is.equalTo('some command');
    });
});