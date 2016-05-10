'use strict';

import fs from 'fs';
import path from 'path';
import config from '../config';

export default function (stuffToLog) {
    console.log('log: ', stuffToLog);

    if (!config.logErrorsToFile) {
        return;
    }

    if (_isError(stuffToLog)) {
        let thingToLog = {
            message: stuffToLog.message,
            stack: stuffToLog.stack
        };

        _logToFile(thingToLog);
    }

    let thingToLog = {
        message: stuffToLog
    };

    _logToFile(thingToLog);
}

function _isError (stuffToLog) {
    if (!stuffToLog) {
        return false;
    }
    
    let isAnObject = typeof stuffToLog === 'object';
    let hasErrorProperties = stuffToLog.hasOwnProperty('message') && stuffToLog.hasOwnProperty('stack');

    return isAnObject && hasErrorProperties;
}

function _logToFile (thingToLog) {
    let timestamp = 'log_' + Date.now().toString();
    let logFilePath = path.resolve(config.errorsLogPath, timestamp);

    fs.writeFile(logFilePath, JSON.stringify(thingToLog), (error) => {
        if (error) {
            console.log('error: ', error);
        }
    });
}
