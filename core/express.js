// ######################################################
// CORE: EXPRESSJS
// ######################################################

// set the server up
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes';
import cors from 'cors';

let app = express();
import { GlobalConfig } from '../config';
import { PLog, PCallback } from './modules/nodee';

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__DIR_APP + '/views/static'));

if (GlobalConfig.LOG_REQUEST) {
  PLog.put('[PLog] http request PLogging is enabled');
  app.use(morgan('dev'));
} else {
  PLog.put('[PLog] http request PLogging is disabled');
}

// configure Routes
routes(app);

// start the server
app.listen(GlobalConfig.SERVER_PORT || 8080, err => {
  if (err) {
    PLog.putException(err);
  }

  PLog.put('[webserver] server listening on port ' + GlobalConfig.SERVER_PORT || 8080 + '.');
});
