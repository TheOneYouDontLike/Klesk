'use strict';

function _indicateWinner(playerName, match) {
    if (playerName === match.winner) {
        return '`+' + playerName + '`';
    }

    return playerName;
}

function getMatchRepresentation(match) {
    return '[' + _indicateWinner(match.player1, match) + ' vs ' +  _indicateWinner(match.player2, match) + ']';
};

export default getMatchRepresentation;