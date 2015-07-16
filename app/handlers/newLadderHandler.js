'use strict';

import repo from '../repo';

let newLadderHandler = {
    makeItSo(parsedCommand) {
        let ladderName = parsedCommand[1];
        repo.createNewLadder(ladderName);

        return 'Created new ladder: ' + ladderName;
    }
};

export default newLadderHandler;