'use strict';

import _ from 'lodash';

const LEFT_LADDER = 'You are no longer a part of the ladder';
const NOTIFICATION_TEXT = 'is no longer a part of the ladder';

function _getLadderFilterFunction(ladderName) {
    return (ladder) => {
        return ladder.name === ladderName;
    };
}

function _getLadderUpdateFunction(playerName) {
    return (ladder) => {
        _.remove(ladder.matches, (match) => {
            return match.player1 === playerName || match.player2 === playerName;
        });
    };
}

function _getSuccessMessage(ladderName) {
    return LEFT_LADDER + ' `' + ladderName + '`';
}

function _getNotificationMessage(playerName, ladderName) {
    return '`' + playerName + '` ' + NOTIFICATION_TEXT + ' `' + ladderName + '`';
}

let leaveLadderHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            let updateSuccessfull = true;

            persistence.update(_getLadderFilterFunction(ladderName), _getLadderUpdateFunction(parsedCommand.playerName), (error) => {
                callback(error);
                updateSuccessfull = false;
            });

            if (updateSuccessfull) {
                callback(null, _getSuccessMessage(ladderName));
                notification.send(_getNotificationMessage(parsedCommand.playerName, ladderName));
            }
        }
    };
};

export default leaveLadderHandler;