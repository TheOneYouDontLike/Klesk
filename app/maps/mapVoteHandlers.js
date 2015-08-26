'use strict';

import slackTextSnippets from '../slackTextSnippets';

function _getMapVoteHandler(mapPersistence, voteStrategy) {
    return {
        makeItSo(parsedCommand, callback) {
            if (parsedCommand.arguments.length < 3) {
                callback(null, 'Missing arguments, correct syntax is ' + slackTextSnippets.decorate('(up|down)votemap <mapName> <keyword>'));
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

function _getMapPredicate(mapName) {
    return (map) => {
        return map.name === mapName;
    };
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

        callback(null, slackTextSnippets.decorate(map.name) + ' voted for ' + slackTextSnippets.decorate(keyword) + '; currently at ' + slackTextSnippets.decorate(map.votes[keyword]));
    };
}

export function mapUpVoteHandler(mapPersistence) {
    return _getMapVoteHandler(mapPersistence, (ladderVotes) => { return ladderVotes + 1; });
}

export function mapDownVoteHandler(mapPersistence) {
    return _getMapVoteHandler(mapPersistence, (ladderVotes) => { return ladderVotes - 1; });
}
