'use strict';

import assert from 'assertthat';

import commandBus from '../app/commandBus.js';

describe('commandBus', () => {
    it('should use correct command handler', () => {
        // given
        let someCommand = {
            text: 'createnewladder ladder'
        };

        let fakeFactory = {
            getCommandHandler: function(/* commandType does not matter during this test */) {
                return {
                    makeItSo() {
                        return 'result';
                    }
                };
            }
        };

        commandBus.__Rewire__('handlersFactory', fakeFactory);

        // when
        let result = commandBus.dispatch(someCommand);

        // then
        assert.that(result).is.equalTo('result');
    });
});

// let genericKleskCommand = {
//     token: "...",
//     team_id: "...",
//     team_domain: "...",
//     channel_id: "...",
//     channel_name: "...",
//     user_id: "...",
//     user_name: "...",
//     command: "/klesk",
//     text: "query string"
// };