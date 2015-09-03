'use strict';

import _ from 'lodash';
import slackTextSnippets from '../slackTextSnippets';

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

function _setScore(match, score) {
    if (!score) {
        return;
    }

    match.score = score;
}

function _validFormatScore(score) {
    if (!score) {
        return true;
    }
    
    var validScoreFormat = /^\d+:\d+$/;

    return score.match(validScoreFormat);
}

function _getMatchLoser(match) {
    return match.winner === match.player1 ? match.player2 : match.player1;
}

function _getFunctionToSetResult(players, score, callback, notification) {
    return (ladder) => {
        let match = _getMatch(ladder, players);

        match.winner = _getWinner(players);

        if (!_validFormatScore(score)) {
            callback(null, 'Score `' + score + '` is invalid, score should be in format `int:int`');
            return;
        }

        _setScore(match, score);

        callback(null, 'Result saved!');

        let notificationMessage = slackTextSnippets.notifications.matchResultAdded(match.winner, _getMatchLoser(match), ladder.name, match.score);
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

            persistence.query(_getLadderPredicate(ladderName, players), (error, filteredLadders) => {
                if (error) {
                    callback(error);
                    return;
                }

                if (filteredLadders.length === 0) {
                    callback(null, 'There is no match with given players in the ladder.');
                    return;
                }

                let ladder = filteredLadders[0];

                let match = _getMatch(ladder, players);

                if (match.winner) {
                    callback(null, 'This match result has already been added.');
                    return;
                }

                persistence.update(
                    _getLadderPredicate(ladderName, players),
                    _getFunctionToSetResult(players, score, callback, notification),
                    (error) => {
                        if (error) {
                            callback(error);
                            return;
                        }

                        _notifyAboutLadderEvents(persistence, notification, (ladder) => { return ladder.name === ladderName; }, _.map(players, _sanitizePlayerName));
                    }
                );
            });
        }
    };
};

function _notifyAboutLadderEvents(persistence, notification, ladderFilter, players) {
    persistence.query(ladderFilter, (error, data) => {
        if (error || data.length !== 1) {
            return;
        }

        let ladder = data[0];

        if (_allMatchesPlayed(ladder.matches)) {
            notification.send(slackTextSnippets.notifications.ladderFinished(ladder));
        }

        _.forEach(players, (playerName) => {
            _notifyAboutAllMatchesPlayedByPlayer(ladder, playerName, notification);
        });
    });
}

function _notifyAboutAllMatchesPlayedByPlayer(ladder, playerName, notification) {
    let playerMatches = _getPlayerMatches(ladder.matches, playerName);
    if (_allMatchesPlayed(playerMatches)) {
        notification.send(slackTextSnippets.notifications.playerFinishedLadder(ladder.name, playerMatches, playerName), '@' + playerName);
    }
}

function _allMatchesPlayed(matches) {
    return _.all(matches, (match) => {
        return match.winner;
    });
}

function _getPlayerMatches(matches, playerName) {
    return _.filter(matches, (match) => {
        return match.player1 === playerName || match.player2 === playerName;
    });
}

export default addResultHandler;