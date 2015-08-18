'use strict';

import handlers from './commandHandlersFactory';
import notification from './notification';

export default {
    dispatch(command, callback) {
        let parsedCommandArguments = command.text.split(" ");
        let commandType = parsedCommandArguments[0];

        let parsedCommand = {
            playerName: command.user_name,
            arguments: parsedCommandArguments
        };

        let commandHandler = handlers.getCommandHandler(commandType, (commandHandler) => {
            commandHandler.makeItSo(parsedCommand, callback, notification);
        });
    }
};