'use strict';

function _getMapPredicate(mapName) {
    return (map) => {
        return map.name === mapName;
    };
}

function _decorate(word) {
    return '`' + word + '`';
}

function _getMapUpdateAction(keyword, voteStrategy, callback) {
    return (map) => {
        if (!map.votes) {
            map.votes = {};
        }

        if (!map.votes[keyword]) {
            map.votes[keyword] = 0;
        }

        map.votes[keyword] = voteStrategy(map.votes[keyword]);

        callback(null, 'Map voted for ' + _decorate(keyword) + ' currently at ' + map.votes[keyword]);
    };
}

function _getMapVoteHandler(mapPersistence, voteStrategy) {
    return {
        makeItSo(parsedCommand, callback) {
            if (parsedCommand.arguments.length < 2) {
                callback(null, 'Map name and keyword is required for voting.');
                return;
            }

            if (parsedCommand.arguments.length < 3) {
                callback(null, 'Keyword is required for voting.');
                return;
            }

            let mapName = parsedCommand.arguments[1];
            let keyword = parsedCommand.arguments[2];

            mapPersistence.update(_getMapPredicate(mapName), _getMapUpdateAction(keyword, voteStrategy, callback), (error) => {
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
