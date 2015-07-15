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

    it('should handle /createladder/ command', () => {
        // when
        let result = commandBus.dispatch(prepareCommand('newladder normal'));

        // then
        assert.that(result).is.equalTo('Created new ladder: normal');
    });

    it('should handle /addplayer/ command', () => {
        // when
        let result = commandBus.dispatch(prepareCommand('addplayer anarki'));

        // then
        assert.that(result).is.equalTo('Added new player: anarki');
    });

    it('should handle bad commands', () => {
        // when
        let result = commandBus.dispatch(prepareCommand('makesheldartheultimatekiller'));

        // then
        assert.that(result).is.equalTo('This is not the command you are looking for.');
    });
});