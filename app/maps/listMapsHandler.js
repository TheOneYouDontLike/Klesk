'use strict';

import slackTextSnippets from '../slackTextSnippets';
import logger from '../logger';

let listMapsHandler = function(mapPersistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            mapPersistence.getAll((error, maps) => {
                if (error) {
                    logger(error);
                    callback(error);
                    return;
                }

                if (maps.length === 0) {
                    callback(null, 'Maps not found - you should initialise the map list.');
                }

                notification.send(slackTextSnippets.mapList(maps), '@' + parsedCommand.playerName);

                let directMessage = 'Map list was sent to your @slackbot channel';
                callback(null, directMessage);
            });
        }
    };
};

export default listMapsHandler;