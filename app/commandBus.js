'use strict';

import _ from 'lodash';

let commandTypes = {
    ADDPLAYER: 'addplayer',
    GETALLPLAYERS: 'getallplayers',
    CLEAR: 'clear'
};

let allPlayers = [];

function handle(command) {
    let parsedCommand = _.words(command.text);

    switch (parsedCommand[0]) {
        case commandTypes.ADDPLAYER:
            allPlayers.push(parsedCommand[1]);
            return 'Added new player: ' + parsedCommand[1];

        case commandTypes.GETALLPLAYERS:
            let result = _.reduce(allPlayers, (players, next, key) => {
                let join = players + next;

                if (key < allPlayers.length - 1) {
                    join += '\n';
                }

                return join;
            },'');

            return result;

        case commandTypes.CLEAR:
            allPlayers = [];
            return 'Ladder cleared!';

        default: return 'Wrong command!';
    }
}

export default {
    dispatch(command) {
        return handle(command);
    }
};