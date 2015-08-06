'use strict';

import fs from 'fs';
import path from 'path';
import config from '../config';

export default function(message) {
    console.log(message);

    if (!config.logErrorsToFile) {
        return;
    }
    let timestamp = 'log' + new Date().toString();
    let logFilePath = path.resolve(config.errorsLogPath, timestamp);

    let errorMessage = {
        message: message
    };

    fs.writeFile(logFilePath, JSON.stringify(errorMessage), (error) => {
        console.log(error);
    });
}