'use strict';

import logger from './logger';
import commandBus from './commandBus';

let configure = function(app) {

    app.get('/', (req, res) => {
        res.end("hello from Klesk");
    });

    app.post('/', (req, res) => {
        let response = commandBus.dispatch(req.body);
        logger(req.body);
        res.end(JSON.stringify(response));
    });

};

export default {
    configure: configure
};