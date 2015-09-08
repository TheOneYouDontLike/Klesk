'use strict';

import logger from './logger';
import commandBus from './commandBus';

let configure = (app) => {

    app.get('/', (req, res) => {
        res.end('hello from Klesk');
    });

    app.post('/', (req, res) => {
        logger(req.body);

        commandBus.dispatch(req.body, (error, response) => {
            if (error) {
                res.status(400).end(error.message);
            }
            res.end(JSON.stringify(response));
        });
    });
};

export default {
    configure: configure
};
