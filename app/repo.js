'use strict';

let ladders = [];

let fakeLadderRepo = {
    createNewLadder (ladder) {
        ladders.push(ladder);
    }
};

export default fakeLadderRepo;
