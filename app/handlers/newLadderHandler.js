'use strict';

import _ from 'lodash';
import slackTextSnippets from '../slackTextSnippets';

function Ladder(name) {
    return {
        name: name,
        map: '',
        matches: []
    };
}

function _prepareLadderExistsErrorMessage(ladderName) {
    return 'Ladder `' + ladderName + '` already exists.';
}

function _assignRandomMap(ladder, mapPersistence, callback) {
    mapPersistence.getAll((error, maps) => {
        if (error) {
            callback(error);
            return;
        }

        var randomMap = maps[Math.floor(Math.random()*maps.length)];

        ladder.map = randomMap.name;
    });
}

let newLadderHandler = function(ladderPersistence, mapPersistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            ladderPersistence.getAll((error, data) => {
                if (error) {
                    callback(error.message, null);
                    return;
                }

                let ladderAlreadyExists = _.any(data, { name: ladderName });
                if (ladderAlreadyExists) {
                    callback(null, _prepareLadderExistsErrorMessage(ladderName));
                    return;
                }

                let newLadder = Ladder(ladderName);

                _assignRandomMap(newLadder, mapPersistence, callback);

                ladderPersistence.add(newLadder, (error) => {
                    if (error) {
                        callback(error.message, null);
                        return;
                    }

                    let message = slackTextSnippets.notifications.newLadder(ladderName);
                    callback(null, message);
                    notification.send(message);
                });
            });
        }
    };
};

export default newLadderHandler;