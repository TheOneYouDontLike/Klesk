'use strict';

import getMatchRepresentation from '../getMatchRepresentation';

let rankingHandler = function(persistence) {
    function _getLadderFilterFunction(ladderName) {
        return (element) => {
            return ladderName === element.name;
        };
    }

    function _prepareReturnMessageAboutAllMatches(ladder) {
        let message = '`' + ladder.name + ' matches:`';

        ladder.matches.forEach((match) => {
            message += getMatchRepresentation(match);
        });

        return message;
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

    return {
        makeItSo(parsedCommand, callback) {
            let ladderName = parsedCommand.arguments[1];

            persistence.query(_getLadderFilterFunction(ladderName), (error, filteredData) => {
                if (error) {
                    callback(error, null);
                    return;
                }

                let ladderForRanking = _putPlayedMatchesFirst(filteredData[0]);

                callback(null, _prepareReturnMessageAboutAllMatches(ladderForRanking));
            });
        }
    };
};

export default rankingHandler;