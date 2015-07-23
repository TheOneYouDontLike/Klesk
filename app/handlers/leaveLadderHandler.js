'use strict';

import _ from 'lodash';

const LEFT_LADDER = 'You are no longer a part of the ladder';

function _getLadderFilterFunction(ladderName) {
    return function(ladder) {
        return ladder.name === ladderName;
    };
}

function _getLadderUpdateFunction(playerName) {
    return function(ladder) {
        _.remove(ladder.matches, (match) => {
            return match.player1 === playerName || match.player2 === playerName;
        });
    }
} 

let leaveLadderHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback) {
            let ladderName = parsedCommand.arguments[1];

            let updateSuccessfull = true;

            persistence.update(_getLadderFilterFunction(ladderName), _getLadderUpdateFunction(parsedCommand.playerName), (error) => {
                callback(error);
                updateSuccessfull = false;
            });

            if (updateSuccessfull) {
                callback(null, LEFT_LADDER);
            }
        }
    }
};

export default leaveLadderHandler;