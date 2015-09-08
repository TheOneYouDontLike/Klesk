'use strict';

import request from 'superagent';
import logger from './logger';
import config from '../config';

function send (message, channelOverride) {
    let notificationChannel = channelOverride ? channelOverride : config.notificationChannel;
    let notificationMessage = {
        username: config.botUsername,
        icon_url: config.botIconUrl,
        text: message,
        channel: notificationChannel
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

export default {
    send: send
};
