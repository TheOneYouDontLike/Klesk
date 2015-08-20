'use strict';

import Persistence from 'JsonPersistence';

import newLadderHandler from './handlers/newLadderHandler';
import joinLadderHandler from './handlers/joinLadderHandler';
import leaveLadderHandler from './handlers/leaveLadderHandler';
import addResultHandler from './handlers/addResultHandler';
import showStatsHandler from './handlers/showStatsHandler';
import rankingHandler from './handlers/rankingHandler';
import showLaddersHandler from './handlers/showLaddersHandler';
import thisIsNotTheCommandYouAreLookingFor from './handlers/nullHandler';
import validateLadderExistenceDecorator from './validation/validateLadderExistenceDecorator.js';
import config from '../config';
import logger from './logger';
import commandTypes from './commandTypes';

let getCommandHandler = function(commandType, callback) {
    let ladderPersistence = new Persistence(config.storageFilename);
    ladderPersistence.init((error) => {
        logger(error);

        switch(commandType) {
            case commandTypes.NEWLADDER:
                let mapPersistence = new Persistence(config.mapsFilename);
                mapPersistence.init((error => {
                    logger(error);
                    callback(newLadderHandler(ladderPersistence, mapPersistence));
                }));
                break;

            case commandTypes.JOINLADDER:
                callback(validateLadderExistenceDecorator(joinLadderHandler(ladderPersistence), ladderPersistence));
                break;

            case commandTypes.LEAVELADDER:
                callback(validateLadderExistenceDecorator(leaveLadderHandler(ladderPersistence), ladderPersistence));
                break;

            case commandTypes.ADDRESULT:
                callback(validateLadderExistenceDecorator(addResultHandler(ladderPersistence), ladderPersistence));
                break;

            case commandTypes.SHOWSTATS:
                callback(validateLadderExistenceDecorator(showStatsHandler(ladderPersistence), ladderPersistence));
                break;

            case commandTypes.RANKING:
                callback(validateLadderExistenceDecorator(rankingHandler(ladderPersistence), ladderPersistence));
                break;

            case commandType.SHOWLADDERS:
                callback(showLaddersHandler(ladderPersistence));
                break;

            default:
                callback(thisIsNotTheCommandYouAreLookingFor());
        }
    });
};

export default {
    getCommandHandler: getCommandHandler
};