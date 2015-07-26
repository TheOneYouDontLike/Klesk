'use strict';

import _ from 'lodash';
import logger from '../logger';

const RESULT_MESSAGE = 'Added: ';
const ALREADY_JOINED = 'You already joined this ladder ';

let newLadderHandler = function(persistence) {
    function _thereAreNoOtherPlayers(matches) {
        return matches.length === 0;
    }

    function _thereIsOnlyOnePlayer(matches) {
        return matches.length === 1 &&
            (matches[0].player1 === '' || matches[0].player2 === '');
    }

    function _addNewPlayerToMatch(match, player) {
        if (match.player1 === '') {
            match.player1 = player;
            return;
        }

        match.player2 = player;
    }

    function _getAllPlayers(ladderMatches) {
        return _(ladderMatches)
            .map((match) => {
                return [ match.player1, match.player2 ];
            })
            .flatten()
            .uniq()
            .value();
    }

    function _alreadyJoinedLadder(ladderMatches, playerName) {
        let allPlayersInLadder = _getAllPlayers(ladderMatches);

        return _.any(allPlayersInLadder, (player) => {
            return player === playerName;
        });
    }

    function _decorate(playerName) {
        return '`' + playerName + '`';
    }

    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];
            let playerName = parsedCommand.playerName;

            let queryLadder = (ladder) => {
                return ladder.name === ladderName;
            };

            let updateCallback = (ladder) => {
                if (_thereAreNoOtherPlayers(ladder.matches)) {
                    ladder.matches.push({ player1: playerName, player2: '', winner: '' });

                    callback(null, RESULT_MESSAGE + _decorate(playerName));
                    notification.send('Player ' + _decorate(playerName) + ' has joined the ladder ' + _decorate(ladderName));
                    return;
                }

                if (_alreadyJoinedLadder(ladder.matches, playerName)) {
                    callback(null, ALREADY_JOINED + _decorate(playerName));
                    return;
                }

                if (_thereIsOnlyOnePlayer(ladder.matches)) {
                    _addNewPlayerToMatch(ladder.matches[0], playerName);

                    callback(null, RESULT_MESSAGE + _decorate(playerName));
                    notification.send('Player ' + _decorate(playerName) + ' has joined the ladder ' + _decorate(ladderName));
                    return;
                }

                let allPlayersInLadder = _getAllPlayers(ladder.matches);

                let newMatchesToPlay = _.map(allPlayersInLadder, (player) => {
                    return { player1: playerName, player2: player, winner: '' };
                });

                let allMatches = ladder.matches;

                let matches = allMatches.concat(newMatchesToPlay);

                ladder.matches = matches;

                callback(null, RESULT_MESSAGE + playerName);
                notification.send('Player ' + _decorate(playerName) + ' has joined the ladder ' + _decorate(ladderName));
            };

            persistence.update(queryLadder, updateCallback, (error) => {
                if (error) {
                    logger(error);
                }
            });
        }
    };
};

export default newLadderHandler;