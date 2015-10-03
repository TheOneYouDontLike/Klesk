'use strict';

function _getFilter (ladderName) {
    return (ladder) => {
        return ladderName === ladder.name;
    };
}

function _getQueryCallback (ladderName, commandHandlerToDecorate, parsedCommand, callback, notificationCallback) {
    return (error, ladders) => {
        if (ladders.length === 0) {
            callback(new Error('There is no ' + '`' + ladderName + '`' + ' ladder.'), null);
            return;
        }

        commandHandlerToDecorate.makeItSo(parsedCommand, callback, notificationCallback);
    };
}

let validateLadderExistenceDecorator = (commandHandlerToDecorate, persistence) => {
    return {
        makeItSo (parsedCommand, callback, notificationCallback) {
            let ladderName = parsedCommand.arguments[1];

            if (!ladderName) {
                callback(new Error('Specify ladder name'), null);
            }

            persistence.query(_getFilter(ladderName), _getQueryCallback(ladderName, commandHandlerToDecorate, parsedCommand, callback, notificationCallback));
        }
    };
};

export default validateLadderExistenceDecorator;
