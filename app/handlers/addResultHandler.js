'use strict';

import _ from 'lodash';

let addResultHandler = function (persistence) {

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
        let matchWithPlayers = _.find(ladder.matches, (match) => {
            let player1InPlayers = _.any(players, (player) => {
                return _sanitizePlayerName(player) === match.player1;
            });
            let player2InPlayers = _.any(players, (player) => {
                return _sanitizePlayerName(player) === match.player2;
            });

            return player1InPlayers && player2InPlayers;
        });

        return matchWithPlayers;
    }

    function _getLadderPredicate(ladderName, players) {
        return (ladder) => {
            let isGoodLadder = ladder.name === ladderName;
            let hasMatch = Boolean(_getMatch(ladder, players));

            return isGoodLadder && hasMatch;
        };
    }

    function _getWinner(players) {
        return _sanitizePlayerName(_.find(players, (player) => {
            return _startsWith(player, '+');
        }));
    }

    function _getFunctionToSetWinner(players, callback) {
        return (ladder) => {
            var match = _getMatch(ladder, players);

            if (match.winner) {
                callback(null, 'This match result has already been added.');
                return;
            }

            match.winner = _getWinner(players);
            callback(null, 'Result saved!');
        };
    }

    function _playerWasInMatch(playerName, playersFromCommand) {
        var sanitizedPlayers = _.map(playersFromCommand, _sanitizePlayerName);

        return _.any(sanitizedPlayers, (sanitizedPlayerName) => {
            return playerName === sanitizedPlayerName;
        });
    }

    function _thereIsMatchWithPlayers(ladderName, players) {
        let sanitizedPlayers = _.map(players, _sanitizePlayerName);
        let bothPlayersWereInMatch = false;

        persistence.query(_getLadderPredicate(ladderName, sanitizedPlayers), (error, matchWithPlayers) => {
            bothPlayersWereInMatch = matchWithPlayers.length;
        });

        return bothPlayersWereInMatch;
    }

    function _noWinnerProvided(players) {
        return !_.any(players, (playerName) => {
            return _startsWith(playerName, '+');
        });
    }

    function _bothAreWinners(players) {
        return _.all(players, (playerName) => {
            return _startsWith(playerName, '+');
        });
    }

    return {
        makeItSo(parsedCommand, callback) {
            let ladderName = parsedCommand.arguments[1];
            let players = [parsedCommand.arguments[2], parsedCommand.arguments[3]];

            if (!_playerWasInMatch(parsedCommand.playerName, players)) {
                callback(null, 'You were not in the match and cannot add result.');
                return;
            }

            if (!_thereIsMatchWithPlayers(ladderName, players)) {
                callback(null, 'There is no match with given players in the ladder.');
                return;
            }

            if (_noWinnerProvided(players)) {
                callback(null, 'Indicate winner by adding a + before their name.');
                return;
            }

            if (_bothAreWinners(players)) {
                callback(null, 'Both players could not have won, get your shit together.');
                return;
            }

            persistence.update(_getLadderPredicate(ladderName, players), _getFunctionToSetWinner(players, callback), (error) => {
                callback(error);
            });
        }
    };

};

export default addResultHandler;