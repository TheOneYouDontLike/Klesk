'use strict';

import Persistence from 'JsonPersistence';

import newLadderHandler from './handlers/newLadderHandler';
import joinLadderHandler from './handlers/joinLadderHandler';
import leaveLadderHandler from './handlers/leaveLadderHandler';
import addResultHandler from './handlers/addResultHandler';
import showStatsHandler from './handlers/showStatsHandler';
import rankingHandler from './handlers/rankingHandler';
import thisIsNotTheCommandYouAreLookingFor from './handlers/nullHandler';
import validateLadderExistenceDecorator from './validation/validateLadderExistenceDecorator.js';
import config from '../config';
import logger from './logger';
import commandTypes from './commandTypes';

let getCommandHandler = function(commandType) {
    let ladderPersistence = new Persistence(config.storageFilename);
    ladderPersistence.init((error) => {
        logger(error);
    });

    switch(commandType) {
        case commandTypes.NEWLADDER:
            let mapPersistence = new Persistence(config.mapsFilename);
            ladderPersistence.init((error => {
                logger(error);
            }));

            return newLadderHandler(ladderPersistence, mapPersistence);

        case commandTypes.JOINLADDER:
            return validateLadderExistenceDecorator(joinLadderHandler(ladderPersistence), ladderPersistence);

        case commandTypes.LEAVELADDER:
            return validateLadderExistenceDecorator(leaveLadderHandler(ladderPersistence), ladderPersistence);

        case commandTypes.ADDRESULT:
            return validateLadderExistenceDecorator(addResultHandler(ladderPersistence), ladderPersistence);

        case commandTypes.SHOWSTATS:
            return validateLadderExistenceDecorator(showStatsHandler(ladderPersistence), ladderPersistence);

        case commandTypes.RANKING:
            return validateLadderExistenceDecorator(rankingHandler(ladderPersistence), ladderPersistence);

        default:
            return thisIsNotTheCommandYouAreLookingFor();
    }
};

export default {
    getCommandHandler: getCommandHandler
};