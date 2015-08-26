'use strict';

import _ from 'lodash';
import slackTextSnippets from '../slackTextSnippets';
import mapSelection from '../maps/mapSelection';

function Ladder(name) {
    return {
        name: name,
        map: '',
        matches: []
    };
}

let newLadderHandler = function(ladderPersistence, mapPersistence) {
    return {
        makeItSo(parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];
            let keyword = _getArgumentIfPresentAt(parsedCommand.arguments, 2);

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

                _assignRandomMap(newLadder, keyword, mapPersistence, callback);

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

function _getArgumentIfPresentAt(args, argumentIndex) {
    if (args.length < argumentIndex + 1) {
        return undefined;
    }

    return  args[argumentIndex];
}

function _prepareLadderExistsErrorMessage(ladderName) {
    return 'Ladder ' + slackTextSnippets.decorate(ladderName) + ' already exists.';
}

function _assignRandomMap(ladder, keyword, mapPersistence, callback) {
    mapPersistence.getAll((error, maps) => {
        if (error) {
            callback(error);
            return;
        }
        
        let randomMap = mapSelection.getMapFrom(maps, keyword);

        ladder.map = randomMap.name;
    });
}

export default newLadderHandler;