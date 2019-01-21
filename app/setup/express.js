import Nodee from 'nodee';
import { app } from 'nodee/core/express';
import routes from 'nodee/core/routes';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { GlobalConfig } from '../config';
const { PLog } = Nodee.Utils;
import { RouteConfig, RenderEngineConfig } from '../config';

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__DIR_APP + '/public')); 

if (GlobalConfig.LOG_REQUEST) {
  PLog.put('[PLog] http request PLogging is enabled');
  app.use(morgan('dev'));
} else {
  PLog.put('[PLog] http request PLogging is disabled');
}

// configure the routes with provided function
routes(app, RouteConfig, RenderEngineConfig);