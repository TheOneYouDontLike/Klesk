'use strict';

import handlers from './commandHandlersFactory';
import notifications from './notificationsFactory';

export default {
    dispatch(command, callback) {
        let parsedCommandArguments = command.text.split(" ");
        let commandType = parsedCommandArguments[0];

        let parsedCommand = {
            playerName: command.user_name,
            arguments: parsedCommandArguments
        };

        let commandHandler = handlers.getCommandHandler(commandType);
        let notification = notifications.getNotification(commandType);
        let result = commandHandler.makeItSo(parsedCommand, callback, notification);

        return result;
    }
};