'use strict';

import _ from 'lodash';
import logger from '../logger';

let showStatsHandler = (persistence) => {
    return {
        makeItSo (parsedCommand, callback) {
            persistence.getAll((error, ladders) => {
                if (error) {
                    logger(error);
                    callback(error);
                    return;
                }

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

function _decorate (ladderName, shouldAddComma) {
    let decoratedName = '`' + ladderName + '`';
    if (shouldAddComma) {
        decoratedName += ', ';
    }

    return decoratedName;
}

export default showStatsHandler;
