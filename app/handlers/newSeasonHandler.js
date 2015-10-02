'use strict';

import slackTextSnippets from '../slackTextSnippets';
import MapSelection from '../maps/mapSelection';

let newSeasonHandler = (persistence, mapPersistence) => {
    return {
        makeItSo (parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            persistence.update(
                (ladder) => {
                    return ladder.name === ladderName;
                },
                (ladder) => {
                    let seasonNumber = ladder.seasons.length + 1;
                    _getRandomMap(mapPersistence, (error, randomMap) => {
                        if (error) {
                            callback(error);
                        }

                        ladder.seasons.push({
                            number: seasonNumber,
                            matches: [],
                            map: randomMap
                        });
                    });

                    let message = slackTextSnippets.notifications.newSeason(ladderName);
                    callback(null, message);
                    notification.send(message);
                }
            );
        }
    };
};

function _getRandomMap (mapPersistence, callback) {
    mapPersistence.getAll((error, maps) => {
        if (error) {
            callback(error);
            return;
        }

        let randomMap = MapSelection.getMapFrom(maps);

        callback(null, randomMap);
    });
}

export default newSeasonHandler;
