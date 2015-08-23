'use strict';

import _ from 'lodash';

function _getMapListFavouringUpvotedMaps(maps, keyword) {
    let biasedMapList = [];

    _.forEach(maps, (map) => {
        if (map.votes[keyword] < 0) {
            return;
        }

        for(let i = 0; i < map.votes[keyword] + 1; ++i) {
            biasedMapList.push(map);
        }
    });

    biasedMapList = _.shuffle(biasedMapList);

    return biasedMapList;
}

function _initialiseVotesForMapsWithoutKeywordVote(maps, keyword) {
    let keywordVoteMap =_.map(maps, (map) => {
        if (_.has(map.votes, keyword)) {
            return map;
        }

        map.votes[keyword] = 0;
        return map;
    });

    return keywordVoteMap;
}

let mapSelection = { 
    getMapFrom(maps, keyword) {
        if(!keyword) {
            return _.sample(maps);
        }

        let mapsWithKeywordVotes = _initialiseVotesForMapsWithoutKeywordVote(maps, keyword);

        let mapsToSelectFrom = _getMapListFavouringUpvotedMaps(mapsWithKeywordVotes, keyword);

        return _.sample(mapsToSelectFrom);
    }
};

export default mapSelection;