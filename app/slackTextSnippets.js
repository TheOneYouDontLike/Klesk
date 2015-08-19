'use strict';

import _ from 'lodash';

function decorate(playerName) {
    return '`' + playerName + '`';
}

function matchResultAdded(winner, loser, ladderName, score) {
    let notification = decorate(winner) + ' has won a match with ' + decorate(loser) + ' on ladder ' + decorate(ladderName);

    if (score) {
        notification += '\nmatch score - ' + score;
    }

    return notification;
}

function playerJoined(playerName, ladderName) {
    return 'Player ' + decorate(playerName) + ' has joined the ladder ' + decorate(ladderName);
}

function playerLeft(playerName, ladderName) {
    return decorate(playerName) + ' is no longer a part of the ladder ' + decorate(ladderName);
}

function newLadder(ladderName) {
    return 'Created new ladder: ' + decorate(ladderName);
}

function _indicateWinner(playerName, match) {
    if (playerName === match.winner) {
        return '`+' + playerName + '`';
    }

    return playerName;
}

function _getScoreRepresentation(score) {
    if(!score) {
        return '';
    }

    return ' (' + score + ')';
}

function _getMatchRepresentation(match, mapName) {
    return '[' + _indicateWinner(match.player1, match) + ' vs ' +  _indicateWinner(match.player2, match) + _getScoreRepresentation(match.score) + ' on ' + mapName + ']';
}

function ranking(ladder) {
    let message = '`' + ladder.name + ' matches`\n';

    ladder.matches.forEach((match) => {
        message += _getMatchRepresentation(match, ladder.map.name) + '\n';
    });

    return message;
}

function playerStats(ladderName, playerWinsCount, notPlayedMatches, playerMatches, requestingPlayerName, mapName) {
    let playerMatchesCount = playerMatches.length;

    let playerLossCount = playerMatchesCount - playerWinsCount - notPlayedMatches;

    let message = 'Ladder ' + decorate(ladderName) + '\n';
    message += 'Matches: ' + playerMatchesCount + ' / Wins: ' + playerWinsCount  + ' / Losses: ' + playerLossCount;

    let matchesStats = _.reduce(playerMatches, (result, match) => {
        let matchMessage = _getMatchRepresentation(match, mapName);

        result += matchMessage + '\n';

        return result;
    }, '');

    return message + '\n' + matchesStats;
}

export default {
    notifications: {
        matchResultAdded: matchResultAdded,
        playerJoined: playerJoined,
        playerLeft: playerLeft,
        newLadder: newLadder
    },
    decorate: decorate,
    ranking: ranking,
    playerStats: playerStats
};