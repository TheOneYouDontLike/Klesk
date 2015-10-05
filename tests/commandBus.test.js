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
            getCommandHandler (commandType, callback) {
                callback(
                    {
                        makeItSo (command, handlerCallback) {
                            handlerCallback(null, 'result');
                        }
                    }
                );
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
