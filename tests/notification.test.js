'use strict';

import assert from 'assertthat';
import sinon from 'sinon';
import request from 'superagent';
import notification from '../app/notification.js';

let config = {
    notificationWebhookAddress: 'http://fakeNotificationAddress.com/notify',
    notificationChannel: '#vg',
    botUsername: 'Klesk',
    botIconUrl: 'http://botIconUrl.com'
};

notification.__Rewire__('config', config);
notification.__Rewire__('logger', function dummyFunction() {});

describe('notification', function() {
    let requestSpy;

    beforeEach(() => {
        requestSpy = sinon.spy(request, 'post');
    });

    afterEach(() => {
        request.post.restore();
    });

    it('should be sent when user joins ladder', () => {
        // when
        notification.send('user has joined');

        // then
        let expectedNotificationMessage = {
            username: config.botUsername,
            icon_url: config.botIconUrl,
            text: 'user has joined',
            channel: config.notificationChannel
        };

        assert.that(requestSpy.calledWith(config.notificationWebhookAddress, expectedNotificationMessage)).is.true();
    });

    it('should allow channel override', () => {
        //given
        let message = 'message';
        let channelOverride = '@channelOverride';
        
        //when
        notification.send(message, channelOverride);
        
        //then
        let expectedNotificationMessage = {
            username: config.botUsername,
            icon_url: config.botIconUrl,
            text: message,
            channel: channelOverride
        };

        assert.that(requestSpy.calledWith(config.notificationWebhookAddress, expectedNotificationMessage)).is.true();
    });
});