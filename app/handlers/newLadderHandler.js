'use strict';

import repo from '../repo';

let newLadderHandler = {
    makeItSo(parsedCommand, callback) {
        let ladderName = parsedCommand[1];

        repo.createNewLadder(ladderName, (error) => {
            if (error) {
                callback(error.message, null);
            }

            console.log('calling with ', ladderName);
            callback(null, 'Created new ladder: ' + ladderName);
        });
    }
};

export default newLadderHandler;