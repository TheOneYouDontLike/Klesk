'use strict';

import fs from 'fs';
import path from 'path';
import config from '../config';

export default function(stuff) {
    console.log('log: ', stuff);

    if (!config.logErrorsToFile) {
        return;
    }

    let timestamp = 'log_' + Date.now().toString();
    let logFilePath = path.resolve(config.errorsLogPath, timestamp);

    let thingToLog = {
        stuff: stuff
    };

    fs.writeFile(logFilePath, JSON.stringify(thingToLog), (error) => {
        if (error) console.log('error: ', error);
    });
}