'use strict';

import logger from './logger';
import commandBus from './commandBus';

let configure = function(app) {

    app.get('/', (req, res) => {
        res.end("hello from Klesk");
    });

    app.post('/', (req, res) => {
        let response = commandBus(req.body);
        logger.log(req.body);
        res.end(response);
    });

};

export default {
    configure: configure
};