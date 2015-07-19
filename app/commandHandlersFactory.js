'use strict';

import Persistence from 'JsonPersistence';

import newLadderHandler from './handlers/newLadderHandler';
import joinLadderHandler from './handlers/joinLadderHandler';
import addResultHandler from './handlers/addResultHandler';
import showStatsHandler from './handlers/showStatsHandler';
import thisIsNotTheCommandYouAreLookingFor from './handlers/nullHandler';
import config from '../config';
import logger from './logger';

let jsonPersistence = new Persistence(config.storageFilename);
jsonPersistence.init((error) => {
    logger(error);
});

let commandTypes = {
    NEWLADDER: 'newladder',
    JOINLADDER: 'joinladder',
    ADDRESULT: 'addresult',
    SHOWSTATS: 'showstats'
};

let getCommandHandler = function(commandType) {
    switch(commandType) {
        case commandTypes.NEWLADDER:
            return newLadderHandler(jsonPersistence);

        case commandTypes.JOINLADDER:
            return joinLadderHandler(jsonPersistence);

        case commandTypes.ADDRESULT:
            return addResultHandler(jsonPersistence);
            
        case commandTypes.SHOWSTATS:
            return showStatsHandler(jsonPersistence);

        default:
            return thisIsNotTheCommandYouAreLookingFor();
    }
};

export default {
    getCommandHandler: getCommandHandler
};