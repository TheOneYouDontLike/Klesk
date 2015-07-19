'use strict';

import _ from 'lodash';

let addResultHandler = function(persistence) {

    function _startsWith(element, startsWith) {
        return element.indexOf(startsWith) === 0;
    }

    function _sanitizePlayerName(playerNameWithIndicators) {
        if (_startsWith(playerNameWithIndicators, '+')) {
            return playerNameWithIndicators.substring(1);
        }

        return playerNameWithIndicators;
    }

    function _getMatch(ladder, players) {
        let matchWithPlayers = _.find(ladder.matches, function(match) {
            let player1InPlayers = _.any(players, function(player) { return _sanitizePlayerName(player) === match.player1; });
            let player2InPlayers = _.any(players, function(player) { return _sanitizePlayerName(player) === match.player2; });

            return player1InPlayers && player2InPlayers;
        });

        return matchWithPlayers;
    }

    function _getLadderPredicate(ladderName, players) {
        return function(ladder) {
            let isGoodLadder = ladder.name === ladderName;
            let hasMatch = Boolean(_getMatch(ladder, players));

            return isGoodLadder && hasMatch;
        };
    }

    function _getWinner(players) {
        return _sanitizePlayerName(_.find(players, function(player) { return _startsWith(player, '+'); }));
    }

    function _getFunctionToSetWinner(players, callback) {
        return function(ladder) {
            var match = _getMatch(ladder, players);

            match.winner = _getWinner(players);

            callback(null, 'Result saved!');
        };
    }

    return {
        makeItSo(parsedCommand, callback) {
            let ladderName = parsedCommand.arguments[1];
            let players = [parsedCommand.arguments[2], parsedCommand.arguments[3]];
            persistence.update(_getLadderPredicate(ladderName, players), _getFunctionToSetWinner(players, callback), function(error){
                callback(error);
            });
        }
    };

};

export default addResultHandler;