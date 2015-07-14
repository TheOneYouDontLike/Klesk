'use strict';

import assert from 'assertthat';
import _ from 'lodash';

import commandBus from '../app/commandBus.js';

let genericKleskCommand = {
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

function prepareCommand(commandText) {
    let command = _.cloneDeep(genericKleskCommand);
    command.text = commandText;

    return command;
}

describe('commandBus', () => {
    afterEach(() => {
        commandBus.dispatch(prepareCommand('clear'));
    });

    it('handles /addplayer/ command', () => {
        // when
        let result = commandBus.dispatch(prepareCommand('addplayer anarki'));

        // then
        assert.that(result).is.equalTo('Added new player: anarki');
    });

    it('handles /getallplayers/ command', () => {
        // given
        // there are players added
        commandBus.dispatch(prepareCommand('addplayer anarki'));
        commandBus.dispatch(prepareCommand('addplayer sarge'));

        // when
        let result = commandBus.dispatch(prepareCommand('getallplayers'));

        // then
        assert.that(result).is.equalTo('anarki\nsarge');
    });

    //it('handles bad commands')
});