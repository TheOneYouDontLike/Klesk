'use strict';

import _ from 'lodash';
import slackTextSnippets from '../slackTextSnippets';
import seasonsHelper from '../seasonsHelper';

const LEFT_LADDER = 'You are no longer a part of the ladder';

function _getLadderFilterFunction (ladderName) {
    return (ladder) => {
        return ladder.name === ladderName;
    };
}

function _getLadderUpdateFunction (playerName) {
    return (ladder) => {
        let activeSeason = seasonsHelper.getActiveSeason(ladder);

        _.remove(activeSeason.matches, (match) => {
            return match.player1 === playerName || match.player2 === playerName;
        });
    };
}

function _getSuccessMessage (ladderName) {
    return LEFT_LADDER + ' `' + ladderName + '`';
}

let leaveLadderHandler = (persistence) => {
    return {
        makeItSo (parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            let updateSuccessfull = true;

            persistence.update(_getLadderFilterFunction(ladderName), _getLadderUpdateFunction(parsedCommand.playerName), (error) => {
                callback(error);
                updateSuccessfull = false;
            });

            if (updateSuccessfull) {
                callback(null, _getSuccessMessage(ladderName));
                notification.send(slackTextSnippets.notifications.playerLeft(parsedCommand.playerName, ladderName));
            }
        }
    };
};

export default leaveLadderHandler;
