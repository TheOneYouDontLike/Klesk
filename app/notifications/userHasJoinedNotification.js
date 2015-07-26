'use strict';

import request from 'superagent';
import logger from '../logger';
import config from '../../config';

function userHasJoined(message) {
    let notificationMessage = {
        username: config.botUsername,
        text: message,
        channel: config.notificationChannel
    };

    request
        .post(config.notificationWebhookAddress, notificationMessage)
        .set('Accept', 'application/json')
        .end((error) => {
            if (error) {
                logger('Oh no! error ' + error.message);
            }
        });
}

export default userHasJoined;