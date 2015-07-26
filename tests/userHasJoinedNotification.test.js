'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import request from 'superagent';
import userHasJoined from '../app/notifications/userHasJoinedNotification.js';

let config = {
    notificationWebhookAddress: 'http://fakeNotificationAddress.com/notify',
    notificationChannel: '#vg',
    botUsername: 'Klesk'
};

userHasJoined.__Rewire__('config', config);

describe('userHasJoinedNotification', function() {
    let requestSpy;

    beforeEach(() => {
        requestSpy = sinon.spy(request, 'post');
    });

    afterEach(() => {
        request.post.restore();
    });

    it('should send notification about the user joining ladder', function() {
        // when
        try {
            userHasJoined('user has joined');
        } catch(error) {}

        // then
        let expectedNotificationMessage = {
            username: config.botUsername,
            text: 'user has joined',
            channel: config.notificationChannel
        };

        assert.that(requestSpy.calledWith(config.notificationWebhookAddress, expectedNotificationMessage)).is.true();
    });
});