'use strict';

import commandTypes from './commandTypes';
import request from 'superagent';
import logger from './logger';
import config from '../config';

function userHasJoined(message) {
    let notificationMessage = {
        username: 'Klesk',
        text: message,
        channel: config.notificationChannel
    };

    request
       .post(config.notificationWebhookAddress)
       .send(notificationMessage)
       .set('Accept', 'application/json')
       .end(function(error, response){
            if (error) {
                logger('Oh no! error ' + response.text);
            }
       });
}

let getNotification = function(commandType) {
    switch(commandType) {
        case commandTypes.JOINLADDER:
            return userHasJoined;
    }
};

export default {
    getNotification: getNotification
};