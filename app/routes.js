'use strict';

import logger from './logger';
import commandBus from './commandBus';

let configure = function(app) {

    app.get('/', (req, res) => {
        res.end("hello from Klesk");
    });

    app.post('/', (req, res) => {
        commandBus.dispatch(req.body, (error, response) => {
            logger(req.body);
            res.end(JSON.stringify(response));
        });
    });
};

export default {
    configure: configure
};