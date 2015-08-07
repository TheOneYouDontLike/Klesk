'use strict';

import config from './config';
import logger from './app/logger';
import routes from './app/routes';

import express from 'express';
import bodyParser from 'body-parser';

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.configure(app);

var port = process.env.PORT || config.port;
app.listen(port);

console.log('Listening on port ' + port);