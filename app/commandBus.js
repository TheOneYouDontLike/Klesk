'use strict';

import _ from 'lodash';

let commandTypes = {
    NEWLADDER: 'newladder',
    ADDPLAYER: 'addplayer',
    GETALLPLAYERS: 'getallplayers',
    CLEAR: 'clear'
};

let allPlayers = [];
let ladders = [];

let newLadderHandler = {
    makeItSo(parsedCommand) {
        let ladderName = parsedCommand[1];
        ladders.push(ladderName);
        return 'Created new ladder: ' + ladderName;
    }
};

let addPlayerHandler = {
    makeItSo(parsedCommand) {
        allPlayers.push(parsedCommand[1]);
        return 'Added new player: ' + parsedCommand[1];
    }
};

let clearLadderHandler = {
    makeItSo() {
        allPlayers = [];
        return 'Ladder cleared!';
    }
};

let thisIsNotTheCommandYouAreLookingFor = {
    makeItSo() {
        return 'This is not the command you are looking for.';
    }
};

function getCommandHandler(commandType) {
    switch(commandType) {
        case commandTypes.NEWLADDER:
            return newLadderHandler;

        case commandTypes.ADDPLAYER:
            return addPlayerHandler;

        case commandTypes.CLEAR:
            return clearLadderHandler;

        default:
            return thisIsNotTheCommandYouAreLookingFor;
    }
}

function handle(command) {
    let parsedCommand = _.words(command.text);
    let commandType = parsedCommand[0];

    let commandHandler = getCommandHandler(commandType);
    let result = commandHandler.makeItSo(parsedCommand);

    return result;
}

export default {
    dispatch(command) {
        return handle(command);
    }
};