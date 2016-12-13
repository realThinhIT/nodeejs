// ######################################################
// CORE: EXPRESSJS
// ######################################################

// set the server up
import express      from 'express';

import bodyParser   from 'body-parser';
import morgan       from 'morgan';
import routes       from './routes';

import $        from './$';

let app             = express();
let apiConfig       = $.config.api;
let globalConfig    = $.config.global;
let log             = $.module.plog;

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (globalConfig.LOG_REQUEST) {
    app.use(morgan('dev'));
}

// server default headers
app.use((req, res, next) => {
    res.type(apiConfig.DEFAULT_TYPE);

    for (const key of Object.keys(apiConfig.DEFAULT_HEADERS)) {
        res.set(key, apiConfig.DEFAULT_HEADERS[key]);
    }

    next();
});

// json customizations
app.set('json spaces', apiConfig.JSON_SPACES);

// configure Routes
routes(app);

// start the server
app.listen($.config.global.SERVER_PORT || 8080, err => {
    log.put('[webserver] server listening on port ' + $.config.global.SERVER_PORT || 8080 + '.');
});
