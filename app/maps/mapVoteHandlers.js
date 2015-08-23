'use strict';

function _getMapPredicate(mapName) {
    return (map) => {
        return map.name === mapName;
    };
}

function _decorate(word) {
    return '`' + word + '`';
}

function _getMapUpdateAction(ladderName, voteStrategy, callback) {
    return (map) => {
        if (!map.votes) {
            map.votes = {};
        }

        if (!map.votes[ladderName]) {
            map.votes[ladderName] = 0;
        }

        map.votes[ladderName] = voteStrategy(map.votes[ladderName]);

        callback(null, 'Map voted for ladder ' + _decorate(ladderName) + ' currently at ' + map.votes[ladderName]);
    };
}

function _getMapVoteHandler(mapPersistence, voteStrategy) {
    return {
        makeItSo(parsedCommand, callback) {
            let mapName = parsedCommand.arguments[1];
            let ladderName = parsedCommand.arguments[2];

            mapPersistence.update(_getMapPredicate(mapName), _getMapUpdateAction(ladderName, voteStrategy, callback), (error) => {
                callback(error);
            },
            (mapNotFoundError) => {
                if (mapNotFoundError) {
                    callback(null, 'Map not found');
                }
            });
        }
    };
}

export function mapUpVoteHandler(mapPersistence) {
    return _getMapVoteHandler(mapPersistence, (ladderVotes) => { return ladderVotes + 1; });
}

export function mapDownVoteHandler(mapPersistence) {
    return _getMapVoteHandler(mapPersistence, (ladderVotes) => { return ladderVotes - 1; });
}
