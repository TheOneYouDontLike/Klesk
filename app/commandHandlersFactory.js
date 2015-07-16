'use strict';

import newLadderHandler from './handlers/newLadderHandler';
import thisIsNotTheCommandYouAreLookingFor from './handlers/nullHandler';

let commandTypes = {
    NEWLADDER: 'newladder',
    ADDPLAYER: 'addplayer',
    GETALLPLAYERS: 'getallplayers',
    CLEAR: 'clear'
};

let getCommandHandler = function(commandType) {
    switch(commandType) {
        case commandTypes.NEWLADDER:
            return newLadderHandler;

        default:
            return thisIsNotTheCommandYouAreLookingFor;
    }
};

export default {
    getCommandHandler: getCommandHandler
}