'use strict';

import slackTextSnippets from '../slackTextSnippets';
import seasonsHelper from '../seasonsHelper';

let rankingHandler = (persistence) => {
    return {
        makeItSo (parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            persistence.query(_getLadderFilterFunction(ladderName), (error, filteredData) => {
                if (error) {
                    callback(error, null);
                    return;
                }

                let seasonForRanking = _putPlayedMatchesFirst(filteredData[0]);

                callback(null, _getInformationAboutNotification());
                notification.send(slackTextSnippets.ranking(ladderName, seasonForRanking), '@' + parsedCommand.playerName);
            });
        }
    };
};

function _getLadderFilterFunction (ladderName) {
    return (element) => {
        return ladderName === element.name;
    };
}

function _putPlayedMatchesFirst (ladder) {
    let activeSeason = seasonsHelper.getActiveSeason(ladder);

    activeSeason.matches = activeSeason.matches.sort((a, b) => {
        let aComesFirstInOrder = -1;
        if (a.winner && !b.winner) {
            return aComesFirstInOrder;
        }

        let bComesFirstInOrder = 1;
        if (!a.winner && b.winner) {
            return bComesFirstInOrder;
        }

        let leaveOrderAsIs = 0;
        return leaveOrderAsIs;
    });

    return activeSeason;
}

function _getInformationAboutNotification() {
    return 'Ranking sent directly to you on your @slackbot channel';
}

export default rankingHandler;
