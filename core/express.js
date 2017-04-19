// ######################################################
// CORE: EXPRESSJS
// ######################################################

// set the server up
import Nodee from '../app/Nodee';
import express      from 'express';

import bodyParser   from 'body-parser';
import morgan       from 'morgan';
import routes       from './routes';

import cors         from 'cors';

let app             = express();
let globalConfig    = Nodee.config.global;
let log             = Nodee.module.plog;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if (globalConfig.LOG_REQUEST) {
    log.put('[log] http request logging is enabled');
    app.use(morgan('dev'));
}

// configure Routes
routes(app);

// start the server
app.listen(Nodee.config.global.SERVER_PORT || 8080, err => {
    if (err) {
        log.putException(err);
    }

    log.put('[webserver] server listening on port ' + Nodee.config.global.SERVER_PORT || 8080 + '.');
});
