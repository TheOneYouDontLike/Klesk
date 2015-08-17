'use strict';

import _ from 'lodash';
import getMatchRepresentation from '../getMatchRepresentation';

function _composeResultMessage(ladderName, playerWinsCount, notPlayedMatches, playerMatches, requestingPlayerName, mapName) {
    let playerMatchesCount = playerMatches.length;

    let playerLossCount = playerMatchesCount - playerWinsCount - notPlayedMatches;

    let message = 'Ladder `' + ladderName + '`\n';
    message += 'Matches: ' + playerMatchesCount + ' / Wins: ' + playerWinsCount  + ' / Losses: ' + playerLossCount;

    let matchesStats = _.reduce(playerMatches, (result, match) => {
        let matchMessage = getMatchRepresentation(match, mapName);

        result += matchMessage + '\n';

        return result;
    }, '');

    return message + '\n' + matchesStats;
}

let showStatsHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];
            let playerName = parsedCommand.playerName;

            if (!ladderName) {
                callback(new Error('Specify ladder name.'), null);
                return;
            }

            let filterFunction = (ladder) => {
                return ladder.name === ladderName;
            };

            let queryCallback = (error, filteredLadders) => {
                let ladder = filteredLadders[0];
                let playerMatches = _.filter(ladder.matches, (match) => {
                    return match.player1 === playerName || match.player2 === playerName;
                });

                if (playerMatches.length === 0) {
                    callback(null, 'You didn\'t join this ladder.');
                    return;
                }

                let playerWins = _.filter(playerMatches, (match) => {
                    return match.winner === playerName;
                });

                let notPlayedMatches = _.filter(playerMatches, (match) => {
                    return !match.winner;
                });

                let resultMessage = _composeResultMessage(ladder.name, playerWins.length, notPlayedMatches.length, playerMatches, playerName, ladder.map.name);

                let directResponseMessage = 'Your stats in this ladder were sent to you directly to your @slackbot channel.';

                callback(null, directResponseMessage);
                notification.send(resultMessage, '@' + playerName);
            };

            persistence.query(filterFunction, queryCallback);
        }
    };
};

export default showStatsHandler;