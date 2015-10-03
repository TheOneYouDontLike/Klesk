'use strict';

import _ from 'lodash';
import logger from '../logger';
import slackTextSnippets from '../slackTextSnippets';
import seasonsHelper from '../seasonsHelper';

const RESULT_MESSAGE = 'Added: ';
const ALREADY_JOINED = 'You already joined this ladder ';

let newLadderHandler = (persistence) => {
    function _thereAreNoOtherPlayers (matches) {
        return matches.length === 0;
    }

    function _thereIsOnlyOnePlayer (matches) {
        return matches.length === 1 &&
            (matches[0].player1 === '' || matches[0].player2 === '');
    }

    function _addNewPlayerToMatch (match, player) {
        if (match.player1 === '') {
            match.player1 = player;
            return;
        }

        match.player2 = player;
    }

    function _getAllPlayers (seasonMatches) {
        return _(seasonMatches)
            .map((match) => {
                return [match.player1, match.player2];
            })
            .flatten()
            .uniq()
            .value();
    }

    function _alreadyJoinedLadder (seasonMatches, playerName) {
        let allPlayersInLadder = _getAllPlayers(seasonMatches);

        return _.any(allPlayersInLadder, (player) => {
            return player === playerName;
        });
    }

    return {
        makeItSo (parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];
            let playerName = parsedCommand.playerName;

            let queryLadder = (ladder) => {
                return ladder.name === ladderName;
            };

            let updateCallback = (ladder) => {
                let activeSeason = seasonsHelper.getActiveSeason(ladder);

                if (_thereAreNoOtherPlayers(activeSeason.matches)) {
                    activeSeason.matches.push({player1: playerName, player2: '', winner: ''});

                    callback(null, RESULT_MESSAGE + slackTextSnippets.decorate(playerName));
                    notification.send(slackTextSnippets.notifications.playerJoined(playerName, ladderName));
                    return;
                }

                if (_alreadyJoinedLadder(activeSeason.matches, playerName)) {
                    callback(null, ALREADY_JOINED + slackTextSnippets.decorate(playerName));
                    return;
                }

                if (_thereIsOnlyOnePlayer(activeSeason.matches)) {
                    _addNewPlayerToMatch(activeSeason.matches[0], playerName);

                    callback(null, RESULT_MESSAGE + slackTextSnippets.decorate(playerName));
                    notification.send(slackTextSnippets.notifications.playerJoined(playerName, ladderName));
                    return;
                }

                let allPlayersInLadder = _getAllPlayers(activeSeason.matches);

                let newMatchesToPlay = _.map(allPlayersInLadder, (player) => {
                    return {player1: playerName, player2: player, winner: ''};
                });

                let allMatches = activeSeason.matches;

                let matches = allMatches.concat(newMatchesToPlay);

                activeSeason.matches = matches;

                callback(null, RESULT_MESSAGE + playerName);
                notification.send(slackTextSnippets.notifications.playerJoined(playerName, ladderName));
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
