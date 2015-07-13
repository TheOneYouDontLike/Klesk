'use strict';

import logger from './logger';

let configure = function(app) {

    app.get('/', (req, res) => {
        res.end("hello from Klesk");
    });

    app.post('/', (req, res) => {
        logger(req.body);
        res.end("congratulation it works !");
    });

};

export default {
    configure: configure
};