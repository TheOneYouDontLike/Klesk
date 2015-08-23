'use strict';

import _ from 'lodash';

function _getMapListFavouringUpvotedMaps(maps) {
    let biasedMapList = [];

    _.forEach(maps, (map) => {
        if (map.votes.keyword < 0) {
            return;
        }

        for(let i = 0; i < map.votes.keyword + 1; ++i) {
            biasedMapList.push(map);
        }
    });

    biasedMapList = _.shuffle(biasedMapList);

    return biasedMapList;
}

function _initializeVotesForMapsWithoutKeywordVote(maps, keyword) {
    let keywordVoteMap =_.map(maps, (map) => {
        if (_.has(map.votes, keyword)) {
            return map;
        }

        map.votes.keyword = 0;
        return map;
    });

    return keywordVoteMap;
}

let mapSelection = function() {
    var randoms = {
        getRandomElement(collection) {
            return collection[Math.floor(Math.random()*collection.length)];
        }
    };

    return { 
        getMapFrom(maps, keyword) {
            if(!keyword) {
                return randoms.getRandomElement(maps);
            }

            let mapsWithKeywordVotes = _initializeVotesForMapsWithoutKeywordVote(maps, keyword);

            let mapsToSelectFrom = _getMapListFavouringUpvotedMaps(mapsWithKeywordVotes);

            return randoms.getRandomElement(mapsToSelectFrom);
        }
    };
};

export default mapSelection;