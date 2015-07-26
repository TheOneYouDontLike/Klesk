'use strict';

import commandTypes from './commandTypes';
import userHasJoined from './notifications/userHasJoinedNotification.js';

let getNotification = function(commandType) {
    switch(commandType) {
        case commandTypes.JOINLADDER:
            return userHasJoined;
    }
};

export default {
    getNotification: getNotification
};