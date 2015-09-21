'use strict';

import slackTextSnippets from '../slackTextSnippets';

let newSeasonHandler = (persistence) => {
    return {
        makeItSo (parsedCommand, callback, notification) {
            let ladderName = parsedCommand.arguments[1];

            persistence.update(
                (ladder) => {
                    return ladder.name === ladderName;
                },
                (ladder) => {
                    let seasonNumber = ladder.seasons.length + 1;
                    ladder.seasons.push({
                        number: seasonNumber,
                        matches: []
                    });

                    callback(null, slackTextSnippets.notifications.newSeason(ladderName));
                }
            );
        }
    };
};

export default newSeasonHandler;
