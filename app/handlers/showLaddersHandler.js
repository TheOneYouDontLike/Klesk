'use strict';

import _ from 'lodash';

let showStatsHandler = function(persistence) {
    return {
        makeItSo(parsedCommand, callback) {
            persistence.getAll((error, ladders) => {
                if (ladders.length === 0) {
                    callback(null, 'There are no active ladders.');
                }

                let message = _.reduce(ladders, (result, nextLadder, index) => {
                    result += _decorate(nextLadder.name, ladders.length !== index + 1);
                    return result;
                }, 'Active ladders: ');

                callback(null, message);
            });
        }
    };
};

function _decorate(ladderName, shouldAddComa) {
    let decoratedName = '`' + ladderName + '`';
    if (shouldAddComa) {
        decoratedName += ', ';
    }

    return decoratedName;
}

export default showStatsHandler;