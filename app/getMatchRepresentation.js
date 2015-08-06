'use strict';

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

function getMatchRepresentation(match, mapName) {
    return '[' + _indicateWinner(match.player1, match) + ' vs ' +  _indicateWinner(match.player2, match) + _getScoreRepresentation(match.score) + ' on ' + mapName + ']';
}

export default getMatchRepresentation;