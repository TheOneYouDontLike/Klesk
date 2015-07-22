'use strict';

import _ from 'lodash';

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

let newLadderHandler = function(ladderPersistence, mapPersistence) {
    return {
        makeItSo(parsedCommand, callback) {
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

                let ladder = Ladder(ladderName);
                
                mapPersistence.getAll((error, maps) => {
                    if (error) {
                        callback(error);
                        return;
                    }

                    var randomMap = maps[Math.floor(Math.random()*maps.length)];

                    ladder.map = randomMap;
                });

                ladderPersistence.add(ladder, (error) => {
                    if (error) {
                        callback(error.message, null);
                        return;
                    }

                    callback(null, 'Created new ladder: ' + ladderName);
                });
            });
        }
    };
};

export default newLadderHandler;