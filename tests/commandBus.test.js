'use strict';

import assert from 'assertthat';

import commandBus from '../app/commandBus.js';

let exampleCommand = {
    token: "...",
    team_id: "...",
    team_domain: "...",
    channel_id: "...",
    channel_name: "...",
    user_id: "...",
    user_name: "...",
    command: "/klesk",
    text: "query string"
};

describe('commandBus', () => {
    it('dispatches events properly', () => {
        assert.that(commandBus.dispatch('some command')).is.equalTo('some command');
    });
});