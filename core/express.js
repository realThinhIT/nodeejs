// ######################################################
// CORE: EXPRESSJS
// ######################################################

// set the server up
import express      from 'express';

import bodyParser   from 'body-parser';
import morgan       from 'morgan';
import routes       from './routes';
import exphbs       from 'express-handlebars';

import cors         from 'cors';

let app             = express();
let apiConfig       = Nodee.config.api;
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

// json customizations
app.set('json spaces', apiConfig.JSON_SPACES);

// template engine
let hbsConfig = require(__DIR_APP + 'config/handlebars').default;
if (hbsConfig.viewsPath) app.set('views', hbsConfig.viewsPath);
let hbs = exphbs.create(hbsConfig);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.enable('view cache');

// configure Routes
routes(app);

// start the server
app.listen(Nodee.config.global.SERVER_PORT || 8080, err => {
    if (err) {
        log.putException(err);
    }

    log.put('[webserver] server listening on port ' + Nodee.config.global.SERVER_PORT || 8080 + '.');
});
