'use strict';

import _ from 'lodash';
import slackTextSnippets from '../slackTextSnippets';
import seasonsHelper from '../seasonsHelper';

let showStatsHandler = (persistence) => {
    return {
        makeItSo (parsedCommand, callback, notification) {
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
                let activeSeason = seasonsHelper.getActiveSeason(ladder);

                let playerMatches = _.filter(activeSeason.matches, (match) => {
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

                let resultMessage = slackTextSnippets.playerStats(ladder.name, playerWins.length, notPlayedMatches.length, playerMatches, activeSeason.map);

                let directResponseMessage = 'Your stats in this ladder were sent to you directly to your @slackbot channel.';

                callback(null, directResponseMessage);
                notification.send(resultMessage, '@' + playerName);
            };

            persistence.query(filterFunction, queryCallback);
        }
    };
};

export default showStatsHandler;
