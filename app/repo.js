'use strict';

let ladders = [];

let fakeLadderRepo = {
    createNewLadder(ladderName) {
        ladders.push({ name: ladderName });
    }
};

export default fakeLadderRepo;