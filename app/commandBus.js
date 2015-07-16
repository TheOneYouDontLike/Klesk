'use strict';

import _ from 'lodash';
import handlersFactory from './commandHandlersFactory';

export default {
    dispatch(command) {
        let parsedCommand = _.words(command.text);
        let commandType = parsedCommand[0];

        let commandHandler = handlersFactory.getCommandHandler(commandType);
        let result = commandHandler.makeItSo(parsedCommand);

        return result;
    }
};