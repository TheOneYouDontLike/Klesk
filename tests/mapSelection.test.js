'use strict';

import assert from 'assertthat';
import mapSelection from '../app/maps/mapSelection';

describe('map selection', () => {
    it('should ignore maps with negative keyword count', () => {
        // given
        let maps = [
            {name: 'aerowalk'},
            {name: 'ignoredMap', votes: {negativeKeyword: -1}}
        ];

        // when
        let selectedMap = mapSelection.getMapFrom(maps, 'negativeKeyword');

        // then
        assert.that(selectedMap.name).is.equalTo('aerowalk');
    });

    it('should pick random map if all have negative keyword', () => {
        // given
        let maps = [
            {name: 'aerowalk', votes: {negativeKeyword: -1}},
            {name: 'ignoredMap', votes: {negativeKeyword: -1}}
        ];

        // when
        let selectedMap = mapSelection.getMapFrom(maps, 'negativeKeyword');

        // then
        assert.that(maps).is.containing(selectedMap);
    });
});
