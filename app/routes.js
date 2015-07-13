'use strict';

import logger from './logger';

let configure = function(app) {

    app.post('/', (req, res) => {
        logger(req.body);
        res.end("congratulation it works !");
    });

};

export default {
    configure: configure
};