'use strict';

import _ from 'lodash';

function _decorate(playerName) {
    return '`' + playerName + '`';
}

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

function _getLoser(players) {
    return _sanitizePlayerName(_.find(players, (player) => { return !_startsWith(player, '+'); }));
}

function _setScore(match, score) {
    if (!score) {
        return;
    }

    match.score = score;
}

function _getFunctionToSetResult(players, score, callback, notification) {
    return (ladder) => {
            let match = _getMatch(ladder, players);

        if (match.winner) {
            callback(null, 'This match result has already been added.');
            return;
        }

        match.winner = _getWinner(players);

        _setScore(match, score);

        callback(null, 'Result saved!');

        let notificationMessage = _decorate(match.winner) + ' has won a match with ' + _decorate(_getLoser(players)) + ' on ladder ' + _decorate(ladder.name);
        notification.send(notificationMessage);
    };
}

function _playerWasInMatch(playerName, playersFromCommand) {
    var sanitizedPlayers = _.map(playersFromCommand, _sanitizePlayerName);

    return _.any(sanitizedPlayers, (sanitizedPlayerName) => {
        return playerName === sanitizedPlayerName;
    });
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

let addResultHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];
            let players = [parsedCommand.arguments[2], parsedCommand.arguments[3]];
            let score = parsedCommand.arguments.length === 5 ? parsedCommand.arguments[4] : null;

            if (!_playerWasInMatch(parsedCommand.playerName, players)) {
                callback(null, 'You were not in the match and cannot add result.');
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

            persistence.update(
                _getLadderPredicate(ladderName, players),
                _getFunctionToSetResult(players, score, callback, notification),
                (error) => {
                    callback(error);
                },
                (ladderNotFoundError) => {
                    if (ladderNotFoundError) {
                        callback(null, 'There is no match with given players in the ladder.');
                    }
                }
            );
        }
    };

};

export default addResultHandler;