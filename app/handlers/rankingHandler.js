'use strict';

import slackTextSnippets from '../slackTextSnippets';

function _getLadderFilterFunction(ladderName) {
    return (element) => {
        return ladderName === element.name;
    };
}

function _putPlayedMatchesFirst(ladder) {
    ladder.matches = ladder.matches.sort((a, b) => {
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

    return ladder;
}

function _getInformationAboutNotification() {
    return 'Ranking sent directly to you on your @slackbot channel';
}

let rankingHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            persistence.query(_getLadderFilterFunction(ladderName), (error, filteredData) => {
                if (error) {
                    callback(error, null);
                    return;
                }

                let ladderForRanking = _putPlayedMatchesFirst(filteredData[0]);

                callback(null, _getInformationAboutNotification());
                notification.send(slackTextSnippets.ranking(ladderForRanking), '@' + parsedCommand.playerName);
            });
        }
    };
};

export default rankingHandler;