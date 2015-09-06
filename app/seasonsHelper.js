import _ from 'lodash';

export default {
    getActiveSeason (ladder) {
        let seasonsWithActiveOnTheTop = _(ladder.seasons, 'number')
            .sortBy('number')
            .reverse()
            .value();

        ladder.seasons = seasonsWithActiveOnTheTop;

        return ladder.seasons[0];
    }
};
