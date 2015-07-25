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
                    makeItSo(command, callback) {
                        callback(null, 'result');
                    }
                };
            }
        };

        commandBus.__Rewire__('handlers', fakeFactory);

        // when
        commandBus.dispatch(someCommand, (error, result) => {
            // then
            assert.that(result).is.equalTo('result');
        });
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