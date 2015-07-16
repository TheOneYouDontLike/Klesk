'use strict';

import _ from 'lodash';
import handlersFactory from './commandHandlersFactory';

export default {
    dispatch(command, callback) {
        let parsedCommandArguments = _.words(command.text);
        let commandType = parsedCommandArguments[0];

        let parsedCommand = {
            playerName: command.user_name,
            arguments: parsedCommandArguments
        };

        let commandHandler = handlersFactory.getCommandHandler(commandType);
        let result = commandHandler.makeItSo(parsedCommand, callback);

        return result;
    }
};